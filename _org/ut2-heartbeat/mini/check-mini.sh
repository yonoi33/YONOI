#!/bin/sh
# READ-ONLY check on genimac-mini (macOS). Never writes into the synced folder.
# Usage: ./check-mini.sh <syncthing-folder-id>
# Exit code: 0 = fresh (<15 min), 1 = stale or missing, 2 = usage/config error.
# The freshness rule here is the same one Muse uses: time INSIDE the file
# (line 1), not mtime. 15 min or older, or file missing -> report
# "UT2からの更新が届いていない（同期停止またはUT2停止）".
set -u
FID="${1:?usage: $0 <syncthing-folder-id>}"
API="${ST_API:-http://127.0.0.1:8384}"
cfg="$HOME/Library/Application Support/Syncthing/config.xml"
[ -r "$cfg" ] || cfg="$HOME/.config/syncthing/config.xml"
KEY="${ST_KEY:-$(sed -n 's:.*<apikey>\(.*\)</apikey>.*:\1:p' "$cfg" 2>/dev/null)}"
get() { curl -fsS -H "X-API-Key: $KEY" "$API$1"; }

conf="$(get "/rest/config/folders/$FID")" || { echo "cannot read Syncthing config for $FID" >&2; exit 2; }
echo "== Syncthing folder config on mini ($FID) =="
printf '%s' "$conf" | python3 -c '
import json,sys; f=json.load(sys.stdin)
print("path            :", f["path"])
print("type            :", f["type"], "(NG: sendonly ignores remote changes)" if f["type"]=="sendonly" else "(OK)")
print("fsWatcherEnabled:", f["fsWatcherEnabled"])
v=f.get("versioning",{})
print("versioning      :", v.get("type") or "none", v.get("params"), "cleanupIntervalS:", v.get("cleanupIntervalS"))'
root="$(printf '%s' "$conf" | python3 -c 'import json,sys;print(json.load(sys.stdin)["path"])')"
file="$root/heartbeat-ut2/now.txt"
echo "== Heartbeat =="
echo "real path       : $file"
python3 - "$file" <<'PY'
import sys, datetime as dt
p = sys.argv[1]
try:
    line = open(p, encoding="utf-8").readline().strip()
    ts = dt.datetime.fromisoformat(line)
except FileNotFoundError:
    print("STALE: file missing -> UT2からの更新が届いていない（同期停止またはUT2停止）"); sys.exit(1)
except ValueError:
    print(f"STALE: unparsable line 1 {line!r} -> UT2からの更新が届いていない（同期停止またはUT2停止）"); sys.exit(1)
age = (dt.datetime.now(dt.timezone.utc) - ts).total_seconds()
print(f"ts in file      : {line}")
print(f"age             : {age/60:.1f} min")
if age >= 15*60:
    print("STALE: >=15 min -> UT2からの更新が届いていない（同期停止またはUT2停止）"); sys.exit(1)
print("FRESH")
PY
rc=$?
echo "== Versions kept for heartbeat (count only) =="
find "$root/.stversions/heartbeat-ut2" -type f 2>/dev/null | wc -l
echo "== Conflict files (must be 0) =="
find "$root/heartbeat-ut2" -name '*sync-conflict*' 2>/dev/null | wc -l
echo "== NTP (macOS) =="
systemsetup -getusingnetworktime 2>/dev/null || echo "(systemsetup needs admin; skipped)"
sntp -t 3 time.apple.com 2>/dev/null | tail -1   # query only; does not set the clock
exit $rc

#!/bin/sh
# Read-only checks on UT2. Usage: ./check-ut2.sh <syncthing-folder-id>
# Prints: folder type (must be sendreceive or sendonly), fsWatcher, folder state/errors,
# heartbeat file, scheduler, NTP status.
set -u
FID="${1:?usage: $0 <syncthing-folder-id>}"
API="${ST_API:-http://127.0.0.1:8384}"
cfg=""
for c in "$HOME/.local/state/syncthing/config.xml" "$HOME/.config/syncthing/config.xml"; do
    [ -r "$c" ] && { cfg="$c"; break; }
done
KEY="${ST_KEY:-$( [ -n "$cfg" ] && sed -n 's:.*<apikey>\(.*\)</apikey>.*:\1:p' "$cfg" )}"
get() { curl -fsS -H "X-API-Key: $KEY" "$API$1"; }

echo "== Syncthing folder config ($FID) =="
get "/rest/config/folders/$FID" | python3 -c '
import json,sys; f=json.load(sys.stdin)
print("path            :", f["path"])
print("type            :", f["type"], "(OK)" if f["type"] in ("sendreceive","sendonly") else "(NG: UT2 changes will not be sent)")
print("fsWatcherEnabled:", f["fsWatcherEnabled"], " delayS:", f.get("fsWatcherDelayS"))
print("rescanIntervalS :", f["rescanIntervalS"])
print("paused          :", f["paused"])
print("devices         :", [d["deviceID"][:7] for d in f["devices"]])'
echo "== Folder status =="
get "/rest/db/status?folder=$FID" | python3 -c '
import json,sys; s=json.load(sys.stdin)
for k in ("state","errors","pullErrors","needFiles","localFiles","globalFiles","stateChanged"): print(f"{k:13}:", s.get(k))'
echo "== Heartbeat file =="
p="$(get "/rest/config/folders/$FID" | python3 -c 'import json,sys;print(json.load(sys.stdin)["path"])')"
ls -l "$p/heartbeat-ut2/" 2>&1; cat "$p/heartbeat-ut2/now.txt" 2>&1
echo "== Scheduler =="
crontab -l 2>/dev/null | grep ut2-heartbeat || echo "(no cron entry)"
systemctl --user list-timers ut2-heartbeat.timer --no-pager 2>/dev/null | head -3
echo "== NTP =="
timedatectl show -p NTP -p NTPSynchronized -p Timezone 2>/dev/null || timedatectl status
(chronyc tracking 2>/dev/null || timedatectl timesync-status 2>/dev/null) | head -12

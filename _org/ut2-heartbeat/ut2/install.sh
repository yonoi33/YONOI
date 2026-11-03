#!/bin/sh
# Install the UT2 heartbeat (run ON UT2, as the user that owns the Syncthing folder).
#   ./install.sh --root /path/to/existing/syncthing/folder [--systemd]
# Default scheduler is the user's crontab (every 5 minutes).
# --systemd installs a user systemd timer instead (use if UT2 runs its jobs that way).
# Idempotent. Changes made:
#   1) copies heartbeat-write.sh to ~/.local/bin/ut2-heartbeat-write.sh
#   2) appends "/heartbeat-ut2/.hb-tmp.*" to <root>/.stignore if missing (backup kept)
#   3) registers the 5-minute job, then runs it once
set -eu
ROOT=""; MODE=cron
while [ $# -gt 0 ]; do
    case "$1" in
        --root) ROOT="$2"; shift 2 ;;
        --systemd) MODE=systemd; shift ;;
        *) echo "unknown arg: $1" >&2; exit 2 ;;
    esac
done
[ -n "$ROOT" ] && [ -d "$ROOT" ] || { echo "--root <existing Syncthing folder> is required" >&2; exit 2; }
[ -d "$ROOT/.stfolder" ] || echo "WARN: $ROOT/.stfolder not found - is this really the Syncthing folder root?" >&2

here="$(cd "$(dirname "$0")" && pwd)"
bin="$HOME/.local/bin/ut2-heartbeat-write.sh"
mkdir -p "$HOME/.local/bin"
install -m 755 "$here/heartbeat-write.sh" "$bin"

# .stignore: exclude in-progress temp files (local-only file, not synced)
pat='/heartbeat-ut2/.hb-tmp.*'
if ! grep -qxF "$pat" "$ROOT/.stignore" 2>/dev/null; then
    [ -f "$ROOT/.stignore" ] && cp -p "$ROOT/.stignore" "$ROOT/.stignore.bak.$(date +%Y%m%d%H%M%S)"
    printf '%s\n' "$pat" >> "$ROOT/.stignore"
    echo "added to .stignore: $pat"
fi

if [ "$MODE" = cron ]; then
    line="*/5 * * * * HB_SYNC_ROOT='$ROOT' $bin >>\$HOME/.local/state/ut2-heartbeat.log 2>&1"
    mkdir -p "$HOME/.local/state"
    current="$(crontab -l 2>/dev/null || true)"   # read fully before writing
    { printf '%s\n' "$current" | grep -v -e 'ut2-heartbeat-write.sh' -e '^$' || true; echo "$line"; } | crontab -
    echo "crontab:"; crontab -l | grep ut2-heartbeat
else
    ud="$HOME/.config/systemd/user"; mkdir -p "$ud"
    cat > "$ud/ut2-heartbeat.service" <<UNIT
[Unit]
Description=UT2 heartbeat (write now.txt into Syncthing folder)

[Service]
Type=oneshot
Environment=HB_SYNC_ROOT=$ROOT
ExecStart=$bin
UNIT
    cat > "$ud/ut2-heartbeat.timer" <<UNIT
[Unit]
Description=UT2 heartbeat every 5 minutes

[Timer]
OnBootSec=1min
OnCalendar=*:0/5
Persistent=true

[Install]
WantedBy=timers.target
UNIT
    systemctl --user daemon-reload
    systemctl --user enable --now ut2-heartbeat.timer
    # keep user timers running without a login session (needs no root if already allowed)
    loginctl show-user "$USER" -p Linger 2>/dev/null | grep -q 'Linger=yes' \
        || echo "NOTE: run 'sudo loginctl enable-linger $USER' so the timer runs after reboot without login"
    systemctl --user list-timers ut2-heartbeat.timer --no-pager
fi

HB_SYNC_ROOT="$ROOT" "$bin"
echo "first write:"; cat "$ROOT/heartbeat-ut2/now.txt"

#!/bin/sh
# UT2 heartbeat writer.
# Writes the current UT2 time (ISO 8601, JST offset) into a file inside an
# existing Syncthing folder, atomically (temp file + mv).
# Does NOT depend on Syncthing: it only writes a local file. Whether the file
# reaches genimac-mini is what the reader side detects.
#
# Settings (environment variables or /etc/default/ut2-heartbeat):
#   HB_SYNC_ROOT  (required) root of the existing Syncthing folder on UT2
#   HB_SUBDIR     subfolder name                 default: heartbeat-ut2
#   HB_FILE       file name                      default: now.txt
#   HB_TMPDIR     temp dir OUTSIDE the synced folder, same filesystem.
#                 If unset or on another filesystem, a temp file named
#                 .hb-tmp.* is created in the subfolder (must be excluded by
#                 .stignore: /heartbeat-ut2/.hb-tmp.*  -- install.sh adds it).
set -eu

[ -r /etc/default/ut2-heartbeat ] && . /etc/default/ut2-heartbeat

: "${HB_SYNC_ROOT:?HB_SYNC_ROOT is not set}"
HB_SUBDIR="${HB_SUBDIR:-heartbeat-ut2}"
HB_FILE="${HB_FILE:-now.txt}"

[ -d "$HB_SYNC_ROOT" ] || { echo "heartbeat: sync root not found: $HB_SYNC_ROOT" >&2; exit 2; }

dest_dir="$HB_SYNC_ROOT/$HB_SUBDIR"
dest="$dest_dir/$HB_FILE"
mkdir -p "$dest_dir"

# Pick temp location: HB_TMPDIR only if it is on the same filesystem
# (otherwise mv is copy+delete and not atomic).
tmp_dir="$dest_dir"
if [ -n "${HB_TMPDIR:-}" ] && [ -d "$HB_TMPDIR" ]; then
    if [ "$(stat -c %d "$HB_TMPDIR" 2>/dev/null || stat -f %d "$HB_TMPDIR")" = \
         "$(stat -c %d "$dest_dir" 2>/dev/null || stat -f %d "$dest_dir")" ]; then
        tmp_dir="$HB_TMPDIR"
    fi
fi

tmp="$(mktemp "$tmp_dir/.hb-tmp.XXXXXX")"
trap 'rm -f "$tmp"' EXIT HUP INT TERM

# ISO 8601 with +09:00 (portable: %z gives +0900, insert the colon)
ts="$(TZ=Asia/Tokyo date +%Y-%m-%dT%H:%M:%S%z | sed 's/\([+-][0-9][0-9]\)\([0-9][0-9]\)$/\1:\2/')"
host="$(hostname 2>/dev/null || uname -n)"

# Line 1 is the timestamp only (the reader parses line 1).
printf '%s\nhost=%s\nepoch=%s\n' "$ts" "$host" "$(date +%s)" > "$tmp"
chmod 644 "$tmp"
mv -f "$tmp" "$dest"
trap - EXIT HUP INT TERM

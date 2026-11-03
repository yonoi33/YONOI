# UT2 ハートビート（生存時刻ファイル）

UT2 が 5 分ごとに既存の Syncthing フォルダ内 `heartbeat-ut2/now.txt` を書き換える。
mini（Muse）は読むだけ。ファイル1行目の時刻が 15 分以上古い、またはファイルがない場合に
「UT2からの更新が届いていない（同期停止またはUT2停止）」と報告する。

## ファイル

| ファイル | 実行場所 | 役割 | 書き込み |
|---|---|---|---|
| `ut2/heartbeat-write.sh` | UT2 | 時刻を一時ファイルに書き、`mv` で `now.txt` に置き換える | 同期フォルダ内 `heartbeat-ut2/` のみ |
| `ut2/install.sh` | UT2 | スクリプト配置・`.stignore` に1行追加・5分ごとの定期実行登録・初回実行 | `~/.local/bin`、crontab（または user systemd timer）、`.stignore`（バックアップを残す） |
| `ut2/check-ut2.sh` | UT2 | フォルダ種別・fsWatcher・同期状態・NTP を表示 | なし |
| `mini/check-mini.sh` | mini | 実パス・鮮度判定・バージョン設定・conflict 数・NTP を表示 | **なし（読み取りのみ）** |

## now.txt の中身

```
2026-11-04T08:17:28+09:00   ← 1行目: 時刻のみ（Muse はここを読む。mtime は使わない）
host=<UT2のホスト名>
epoch=<UNIX秒>
```

## 手順（UT2 で）

```sh
# 0) 対象フォルダの ID とパスを確認（GUI の「フォルダID」でも可）
# 1) 事前確認（読み取りのみ）
./ut2/check-ut2.sh <folder-id>      # type が sendreceive / sendonly であること
# 2) 導入（cron が UT2 の流儀なら既定のまま。systemd なら --systemd を付ける）
./ut2/install.sh --root <フォルダのパス>
# 3) 5分以上あけて再確認
./ut2/check-ut2.sh <folder-id>
```

## 手順（mini で、読み取りのみ）

```sh
./mini/check-mini.sh <folder-id>    # 終了コード 0=新しい / 1=古いか無い
```
5 分以上あけて2回実行し、`ts in file` が進んでいれば到達確認完了。

## 設計上の注意

- **Syncthing に依存しない**: 書き込みはローカルファイル操作だけ。Syncthing が止まっていても UT2 上の `now.txt` は更新され続ける。
- **原子的な書き込み**: 一時ファイル `.hb-tmp.*` は `.stignore` の `/heartbeat-ut2/.hb-tmp.*` で除外。
  同期フォルダ外かつ同一ファイルシステムの置き場所があれば `HB_TMPDIR` で指定でき、その場合は同期フォルダ内に一時ファイルを作らない。
  （`.stignore` は同期されないため、mini 側には影響しない）
- **UT2 側のフォルダ種別**: `receiveonly` だと UT2 の変更は送られない。`check-ut2.sh` で確認する。
- **mini 側のフォルダ種別**: `sendonly` だと UT2 からの変更を受け取らない。`check-mini.sh` で確認する。
- **バージョン管理**: Syncthing のバージョン管理はフォルダ単位で、サブフォルダだけを対象外にする設定はない。
  ただし組み込みの方式では旧版は無限には増えない（simple は1ファイルあたり保持数まで、
  trashcan は1ファイル1版、staggered は時間帯ごとに間引かれ定常で約100件・各100バイト未満）。
  実際の件数は `check-mini.sh` の「Versions kept」で確認する。external 方式なら挙動はそのスクリプト次第。
- **Muse の判定**: ファイル内の時刻で判定し、15 分以上古い／存在しない／1行目が読めない → 報告。この検知は HW-039 の恒久策導入後も残す。

# UT2 ハートビート新設 報告書

- 作成日: 2026-11-04（JST）
- 担当: CLAUDIAN（Claude Code リモートセッション）
- 状態: **実装物は完成・机上試験済み。UT2 / mini での導入と確認は未実施（このセッションから到達できないため）**

## 1. 事実

| 確認項目 | 結果 |
|---|---|
| このセッションから UT2・mini に入れるか | **入れない**。Remote Control で接続できるフォルダは 0 件（`list_computer_folders` で確認） |
| リポジトリ内の UT2 / Syncthing 設定 | なし（`_org/inbox/WO-APIMIG-001_report.md` のみ） |
| 作ったもの | `_org/ut2-heartbeat/`（スクリプト4本＋README） |
| 机上試験（このコンテナ上） | 書き込み・原子的置き換え・一時ファイル残りなし・既存 crontab 行の保持・再実行で重複しない・cron と同じ最小環境での実行・鮮度判定（新しい/15分超/ファイルなし）を確認 |

## 2. 報告項目ごとの状態

| 報告してほしいこと | 状態 | どう確定するか |
|---|---|---|
| UT2 の定期実行の方式と間隔、書き先 | **用意済み**: crontab `*/5`（UT2 が systemd 流儀なら `--systemd` で user timer）。書き先は `<既存フォルダ>/heartbeat-ut2/now.txt` | `install.sh` の出力 |
| mini 側の実パス | 未確定 | `check-mini.sh` の `real path` 行 |
| 初回到達確認（時刻が進む） | 未実施 | `check-mini.sh` を5分以上あけて2回 |
| 既存の配布経路に影響がない | 設計上は影響なし（新ファイル1つ追加と `.stignore` に1行追加のみ。既存 crontab 行は保持）。実機確認は未実施 | `check-ut2.sh` の `errors / pullErrors / needFiles` を導入前後で比較、レシートの到達を目視 |
| fsWatcher の有効／無効 | 未確認 | `check-ut2.sh` の `fsWatcherEnabled` |
| mini のバージョン管理（`heartbeat-ut2/` 除外） | **除外は Syncthing の仕様上できない**（フォルダ単位の設定のみ）。組み込み方式なら旧版は上限付きで、1日288件が積み上がり続けることはない | `check-mini.sh` の `versioning` と `Versions kept` |
| UT2・mini の NTP 同期 | 未確認 | 両スクリプトの `NTP` 欄 |

## 3. 解釈

- 検知の仕組み自体（書く側・読む側の判定ロジック）は完成している。残りは UT2 で `install.sh` を1回実行し、両側で確認スクリプトの出力を得ることだけ。
- バージョン管理は「除外できない」が結論。実害は小さい見込みだが、実際の方式が external の場合や件数が想定外に多い場合は、専用フォルダを分ける（指示の「新しい同期フォルダは避ける」と相反するため CEO 判断）。

## 4. CEO に残す判断

なし（導入後、`versioning` が external、または `Versions kept` が数百件を超える場合のみ判断が発生する）。

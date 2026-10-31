# WO-ORRERY-002 報告書　ORRERY v14 の正本配置

- 作成日: 2026-10-31
- 担当: CLAUDIAN（Claude Code リモートセッション）
- 状態: **仮置きまで完了。Vault への配置と作業3は CEO 側で残っている**

## 1. 配置（作業1・2）

Vault（meta-vault）はこのセッションから見えない（リポジトリは `yonoi33/YONOI` のみで、Vault のファイルは無い）。
そのため、Vault と同じパス構成で次の場所に仮置きした。中身はそのまま Vault にコピーできる。

| 作業 | 仮置きパス | Vault での配置先 |
|---|---|---|
| 1 | `_org/inbox/WO-ORRERY-002/meta-vault/projects/orrery/orrery_14.html` | `meta-vault/projects/orrery/orrery_14.html` |
| 2 | `_org/inbox/WO-ORRERY-002/wiki/raw/articles/2026-10-31_orrery-v14-planet-orgel.md` | `wiki/raw/articles/2026-10-31_orrery-v14-planet-orgel.md` |

- `orrery_14.html` の入手元: CEO の Google Drive（`orrery_14.html`、2026-10-31 14:47 UTC 作成）。チャットの添付ファイルはこのセッションに届いていない
- 同一性: sha256 `b741630b82c84d5616e2f7be0186b64798d82b1f1e905f5b3ba257ec9cac1d09`（98,641 bytes）。ローカル保存版とハッシュが一致すれば同じファイル
- 既存の `orrery.html` には触れていない（このセッションには存在しない）

## 2. WO 記載の差分の検証（v12 → v14、`diff` で確認）

| WO の記載 | 結果 |
|---|---|
| 惑星オルゴール追加 | 確認。`<style>` 1ブロックと、末尾にオルゴールの UI・スクリプトを追加 |
| 火星探索機を既定オフ | 確認。`missionToggle` の `checked` を外し、起動時に `marsMission.setVisible(false)` |
| 音律3種（倍音列が既定） | 確認。`let tuning='harm'` |
| 元の動きのコードは無変更（追記は末尾2行と公開口のみ） | 確認。v12 から変わった行はタイトルと `checked` の2か所だけ。動きのコードへの追記は末尾2行（`setVisible(false)` と `window.__ORRERY__`） |

補足: WO に書かれていない変更が1件ある。タイトルが `ORRERY — Solar System` → `ORRERY — Planet Orgel` に変わっている。ログには記載した。

## 3. 既存の orrery.html と v12 の関係（作業3）

**判定できず。** Vault の `orrery.html` がこのセッションから読めないため。
Google Drive も確認したが、`orrery.html` という名前のファイルは無かった（あるのは `orrery_10/12/13/14.html` のみ）。

CEO のローカルで次を実行すれば判定できる:

```sh
cd meta-vault/projects/orrery
shasum -a 256 orrery.html     # cec2efb2…c0b158 なら v12 と同一
diff <(sed -n 1,30p orrery.html) <(sed -n 1,30p orrery_12.html)
```

- v12 の sha256: `cec2efb2bed1ccfba07ed32fff31aa467bc76a5b1bd008222a2b19c151c0b158`（70,306 bytes / 1,156 行）
- v10 の大きさ: 63,501 bytes
- ハッシュ一致 → v12 と同一。不一致でも `<title>ORRERY — Solar System</title>` と `id="missionToggle"` があれば同じ系統、無ければ別系統の可能性が高い

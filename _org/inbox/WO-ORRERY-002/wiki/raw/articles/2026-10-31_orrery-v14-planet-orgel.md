# ORRERY v14（惑星オルゴール）開発ログ

- 日付: 2026-10-31
- 正本: `meta-vault/projects/orrery/orrery_14.html`（98,641 bytes / sha256 `b741630b82c84d5616e2f7be0186b64798d82b1f1e905f5b3ba257ec9cac1d09`）
- 元にした版: `orrery_12.html`（70,306 bytes / sha256 `cec2efb2bed1ccfba07ed32fff31aa467bc76a5b1bd008222a2b19c151c0b158`）
- 経由した版: `orrery_13.html`（オルゴール初版。音律はペンタが既定）
- 依存: three.js r128（cdnjs）

## v12 → v14 の差分

1. **惑星オルゴールを追加**（タイトルも `ORRERY — Solar System` → `ORRERY — Planet Orgel`）
   - `<style>` ブロックを1つ追加（v12 の 123 行目の後）
   - オルゴールの UI とスクリプトを末尾に追加（v12 の 1152 行目の後）
2. **火星探索機を既定オフ**
   - `<input type="checkbox" id="missionToggle" checked>` → `checked` を外した
   - 起動時に `marsMission.setVisible(false);` を実行
3. **元の動きのコードは無変更**
   - v12 側で消えた行・変わった行は、タイトルと `missionToggle` の `checked` の2か所だけ（`diff` で確認）
   - 動きのコードへの追記は、末尾の2行のみ:
     ```js
     marsMission.setVisible(false);
     window.__ORRERY__=Object.freeze({THREE,scene,camera,planets:PLANETS,getSimT:()=>simT,getMode:()=>mode});
     ```
   - `window.__ORRERY__` は読み取り専用の公開口。オルゴールはここから惑星の位置と時刻を読む

## 音律（3種）

| 音律 | ボタン | 中身 |
|---|---|---|
| 倍音列（既定） | Harmonics | C1 = 32.703 Hz の整数倍。水星×24・金星×20・地球×16・火星×14・木星×6・土星×4・天王星×3・海王星×2。どう重なっても1つの和音に溶ける。火星の×14 は平均律より31セント低い |
| ペンタ | Penta | C メジャー・ペンタトニック。外惑星4つは鐘（130.81 / 98.00 / 82.41 / 65.41 Hz） |
| 天球の音楽 | Celestial | 公転周期の逆数比を純正律に当てはめる。比は地球を1とする |

## v13 → v14 の差分（参考）

- 倍音列の音律を追加し、既定をペンタから倍音列に変更
- ボタン名を短くした（Pentatonic → Penta、Musica universalis → Celestial）
- 動きのコードには触れていない

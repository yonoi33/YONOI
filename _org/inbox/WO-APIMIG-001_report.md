# WO-APIMIG-001 報告書　Claude 5.5系移行前 API互換性監査

- 作成日: 2026-09-30
- 担当: CLAUDIAN（Claude Code リモートセッション）
- 状態: **停止条件により停止（調査対象の範囲を特定できず）**
- 影響範囲: 読み取り専用。コード・設定・ワークフローの変更、モデル切替、API送信はしていない。
  書き込んだのはこの報告書1件のみ。

---

## 1. 事実（確認した内容）

### 1.1 このセッションで見える範囲

| 確認項目 | 結果 |
|---|---|
| 作業リポジトリ | `yonoi33/YONOI`（`/home/user/YONOI`） |
| リポジトリの中身 | **空**。コミットなし。`git ls-remote origin` の結果はブランチ・タグともに0件 |
| このセッションで使えるリポジトリ | `yonoi33/YONOI` の1件のみ（`list_repos` で確認） |
| コンテナ内の `meta-os*`・`_org`・`litellm*`・`*n8n*` | 見つからない（`/` から深さ4まで検索） |

### 1.2 調査対象ごとの到達状況

| 調査対象 | 到達 | 備考 |
|---|---|---|
| Vault（meta-os-v11-freeze）配下のスクリプト | 不可 | このセッションに存在しない |
| n8n ワークフロー | 不可 | 同上 |
| LiteLLM 設定 | 不可 | 同上 |
| OHM-001 面談記録システム | 不可 | 同上 |
| Claude Code の設定・サブエージェントのモデル指定 | 不可 | コンテナ内の `~/.claude` はクラウド実行環境のもので、CEO環境の設定ではないため対象外とした |
| その他 Anthropic API を呼ぶ箇所 | 不可 | 調べられるコードが0行 |

### 1.3 検出結果

| 項目 | 検出数 | 調べた範囲 |
|---|---|---|
| (1) `tool_choice` の強制指定（`tool` / `any`） | 0 | `yonoi33/YONOI`（空） |
| (2) 思考の無効化・有無の切替 | 0 | 同上 |
| (3) 会話履歴の編集・再送（思考ブロックを含む） | 0 | 同上 |
| (4) 旧版 computer-use ツール定義 | 0 | 同上 |
| (5) 固定されたモデル文字列 | 0 | 同上 |
| (6) その他、移行ガイドの変更点に当たるもの | 0 | 同上 |

**検出ゼロは「問題がない」という意味ではない。調べる対象がなかったという意味である。**

---

## 2. 解釈

- WO の指定どおり、推測で範囲を広げずに停止した。Vault の場所の推測や、別リポジトリ・ローカル端末の探索はしていない。
- このため、移行判断の根拠になる情報はまだ得られていない。現状で「移行する」と判断すると、下の BLOCKS 項目が本番で 400 エラーになる危険を確認しないまま進むことになる。

---

## 3. 再実施用の照合基準（移行ガイドの BLOCKS 項目）

出典: Claude Code 同梱の claude-api スキルの移行ガイド（2026-09-25 時点のキャッシュ）。
platform.claude.com の最新版とは、実際のコードを調べる再実施のときに照合する（今回は照合対象がないため実施していない）。

| WO項目 | Opus 5.5 | Sonnet 5.5 | 影響度 | 探す文字列の例 |
|---|---|---|---|---|
| (1) | `tool_choice` の `any` / `tool` は 400（`count_tokens`・Batches も同じ） | 同左 | 移行時に停止 | `tool_choice`, `"type": "any"`, `"type": "tool"` |
| (2) | `thinking: {type: "disabled"}` と `budget_tokens` はどの effort でも 400。effort の既定値が `medium` に下がる | `disabled` は 400。思考を切りたい場合は `{type: "between_tools"}`（effort `high` 以下、他のフィールドなし） | 停止／挙動が変わる | `thinking`, `disabled`, `budget_tokens`, `effort` |
| (3) | 思考ブロックは生成したモデルと会話に結びつく。2026-08-31 以降に作られたアカウントでは、履歴を編集すると検査対象になる | 同左（Claude API と Bedrock で強制） | 停止の可能性 | `messages` を組み立て直す・要約・切り詰める処理、`thinking` ブロックの削除 |
| (4) | Claude API と Google Cloud では `computer_20251124` は 400。`computer_toolset_20260801` が必要 | 同左（Bedrock は旧版を受け付ける） | 移行時に停止 | `computer_2025`, `computer_use` |
| (5) | モデルIDを `claude-opus-5-5` に（Bedrock は `anthropic.claude-opus-5-5`） | `claude-sonnet-5-5` に | 変更しなければ影響なし（旧モデルのまま動く） | `claude-opus-5`, `claude-sonnet-5`, `claude-fable-5`, `anthropic.claude-`, LiteLLM の `model_list` |
| (6) | `stop_reason: "refusal"` の処理（`bio`・`reasoning_extraction` カテゴリが追加）とフォールバックの設定 | refusal の5カテゴリ、advisor ツールの組み合わせ制限 | 挙動が変わる | `stop_reason`, `advisor`, `fallbacks` |

補足: `claude-opus-5-5` は `claude-opus-5` で始まるため、(5) を前方一致で検索すると移行後の文字列も当たる。検出後に完全一致で確認すること。

---

## 4. CEO に残す判断（1点のみ）

**「移行する／部分移行／見送り」→ 現時点では判断材料がない。推奨は、再監査が終わるまで「見送り（保留）」とすること。**

再監査に必要なもの: Vault（meta-os-v11-freeze）と、n8n・LiteLLM・OHM-001・Claude Code 設定の置き場所を、このセッションから読める状態にすること（GitHub リポジトリとして接続する、など）。

# WO-HARNESS-001　YONOI ハーネス層の新設

- 発注日: 2026-11-08
- 発注者: CEO
- 担当: CLAUDIAN
- 環境: クラウド（yonoi33/YONOI）

## 目的
KEITO 氏の AI エコシステム図の「ハーネス層（判断・権限・安全）」を YONOI に実装し、
停止条件・権限・宿題プロトコルをセッション個体の注意力ではなく仕組みで守る。

## 成果物
- `CLAUDE.md`: 環境の事実、停止条件、宿題プロトコル、置き場所、応答の型
- `.claude/settings.json`: 許可/拒否の権限ルール、Stop hook
- `.claude/hooks/check_homework.py`: 宿題ブロックの形式チェック
- `_org/templates/`: WO と報告書のテンプレート
- `_org/hw/ledger.md`: 宿題台帳

## 停止条件
CLAUDE.md §2 に同じ。

## 禁止事項
- 秘密情報の格納
- main への push

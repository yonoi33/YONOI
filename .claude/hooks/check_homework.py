#!/usr/bin/env python3
"""Stop hook: 宿題プロトコルの形式チェック。

最後のアシスタント応答に「━━━ 宿題 ━━━」ブロックがある場合、
  - 宿題は 2 件まで
  - 各宿題に HW番号 / 期限(YYYY-MM-DD) / 完了条件 がある
を検査する。違反があれば exit 2 で応答の修正を求める。
ブロックが無い応答は通す（宿題を出さない応答は正常）。
"""
import json
import re
import sys

MARK = "━━━ 宿題 ━━━"
DATE = re.compile(r"期限\s*[:：]\s*(\d{4}-\d{2}-\d{2})")


def last_assistant_text(path):
    text = None
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                ev = json.loads(line)
            except ValueError:
                continue
            if ev.get("type") != "assistant":
                continue
            content = (ev.get("message") or {}).get("content") or []
            parts = [c.get("text", "") for c in content
                     if isinstance(c, dict) and c.get("type") == "text"]
            if parts:
                text = "\n".join(parts)
    return text


def check(text):
    errors = []
    if not text or MARK not in text:
        return errors
    block = text.split(MARK, 1)[1]
    items = [l for l in block.splitlines() if "HW番号" in l]
    if not items:
        errors.append("宿題ブロックに HW番号 を含む行がありません")
    if len(items) > 2:
        errors.append(f"宿題が {len(items)} 件あります（上限 2 件）")
    for l in items:
        if not DATE.search(l):
            errors.append(f"期限(YYYY-MM-DD)がありません: {l.strip()[:60]}")
        if "完了条件" not in l:
            errors.append(f"完了条件がありません: {l.strip()[:60]}")
    return errors


def main():
    try:
        payload = json.load(sys.stdin)
    except ValueError:
        return 0
    if payload.get("stop_hook_active"):
        return 0  # 再帰防止
    path = payload.get("transcript_path")
    if not path:
        return 0
    try:
        text = last_assistant_text(path)
    except OSError:
        return 0
    errors = check(text)
    if errors:
        print("宿題プロトコル違反。応答末尾の宿題ブロックを修正してください:\n- "
              + "\n- ".join(errors), file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())

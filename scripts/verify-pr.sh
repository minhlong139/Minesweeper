#!/usr/bin/env bash
# verify-pr.sh — Verify trước khi push: lint + typecheck + test + build
# (Constitution Section 9: AI Agent BẮT BUỘC chạy trước khi tuyên bố hoàn thành)
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> [verify-pr] Lint..."
# 【ĐIỀN: lệnh lint 】       # vd: npm run lint  |  ruff check .

echo "==> [verify-pr] Typecheck..."
# 【ĐIỀN: lệnh typecheck 】  # vd: npm run typecheck  |  mypy .

echo "==> [verify-pr] Test..."
bash "$DIR/run-tests.sh"

echo "==> [verify-pr] Build..."
# 【ĐIỀN: lệnh build 】      # vd: npm run build

echo "==> [verify-pr] TẤT CẢ PASS. Sẵn sàng push."

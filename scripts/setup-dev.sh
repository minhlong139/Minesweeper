#!/usr/bin/env bash
# setup-dev.sh — Setup môi trường phát triển (Constitution: script bắt buộc)
# Tùy biến phần 【ĐIỀN】 theo tech stack dự án.
set -euo pipefail

echo "==> [setup-dev] Bắt đầu setup môi trường..."

# Kiểm tra công cụ cơ bản
command -v git >/dev/null || { echo "Thiếu git"; exit 1; }

# 【ĐIỀN: cài dependency theo stack 】
# Ví dụ Node:   [ -f package.json ] && npm ci
# Ví dụ Python: [ -f requirements.txt ] && pip install -r requirements.txt

# 【ĐIỀN: copy .env.example -> .env nếu chưa có (KHÔNG commit .env) 】
# [ -f .env.example ] && [ ! -f .env ] && cp .env.example .env && echo "Đã tạo .env từ .env.example"

echo "==> [setup-dev] Hoàn tất."

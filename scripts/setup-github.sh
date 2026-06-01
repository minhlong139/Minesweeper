#!/usr/bin/env bash
# =============================================================================
# setup-github.sh — Khởi tạo GitHub cho dự án Agent Spec Hub
#
# Mục đích: thiết lập một lần (idempotent, re-run an toàn) sau khi repo đã
#           tạo trên GitHub. Bao gồm:
#             • Tạo GitHub Labels cho Issues/PRs
#             • Tạo GitHub Project v2 hoặc lấy IDs project có sẵn
#             • Lấy Column Option IDs (Status field)
#             • Sinh file mcp-server/.env cho MCP server
#             • Set GitHub Actions Variables (PROJECT_NUMBER, STATUS_FIELD_ID, COL_*)
#
# Phân vai (Constitution mục 1.5 — bổ sung):
#   [gh CLI]   Script này được phép dùng `gh` vì đây là tác vụ SETUP một lần,
#              không phải tác vụ runtime (sync task, đẩy PR, duyệt PR).
#   [MCP]      Mọi tác vụ runtime SAU KHI setup xong đều phải qua MCP GitHub.
#              AI Agent KHÔNG được dùng gh cho các tác vụ runtime đó.
#
# Cách dùng:
#   ./scripts/setup-github.sh
#
# Yêu cầu:
#   - gh CLI đã login: gh auth login
#   - Scope "project": gh auth refresh -h github.com -s project
#   - jq đã cài: brew install jq / apt install jq
#   - Repo đã tạo trên GitHub (tạo thủ công hoặc qua MCP GitHub)
#   - GitHub Project v2 đã tạo với 5 cột:
#       Backlog | Ready | In Progress | In Review | Done
# =============================================================================

set -euo pipefail

# ── Màu sắc ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
step() { echo -e "\n${BOLD}${CYAN}▶ $1${NC}"; }
hr()   { echo -e "${CYAN}──────────────────────────────────────────────${NC}"; }

# ── Banner ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║   Agent Spec Hub — GitHub Setup              ║${NC}"
echo -e "${BOLD}${CYAN}║   Labels · Project IDs · MCP .env · Actions  ║${NC}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""
info "Đây là script SETUP một lần — được phép dùng gh CLI."
info "Tác vụ runtime (sync task, đẩy PR, duyệt PR) phải dùng MCP GitHub."
echo ""

# ── Bước 0: Kiểm tra dependencies ────────────────────────────────────────────
step "[0/6] Kiểm tra prerequisites"

command -v gh  &>/dev/null || fail "Cần cài GitHub CLI: https://cli.github.com"
command -v jq  &>/dev/null || fail "Cần cài jq: brew install jq / apt install jq"
command -v git &>/dev/null || fail "Cần cài git"

gh auth status &>/dev/null || {
  warn "Chưa đăng nhập GitHub CLI. Đang mở trình đăng nhập..."
  gh auth login
}

# Kiểm tra scope "project"
GH_SCOPES=$(gh auth status 2>&1 | grep -i "token scopes" || true)
if ! echo "$GH_SCOPES" | grep -q "project"; then
  echo ""
  echo -e "${RED}❌ GitHub CLI thiếu scope 'project' cho GitHub Projects v2.${NC}"
  echo ""
  echo "   Chạy lệnh sau rồi chạy lại script:"
  echo -e "   ${BOLD}gh auth refresh -h github.com -s project${NC}"
  echo ""
  exit 1
fi

ok "gh CLI OK (scope: project)"
ok "jq OK"

# ── Bước 1: Nhập thông tin project ───────────────────────────────────────────
step "[1/6] Thông tin project"

# Thử tự detect từ git remote
DETECTED_OWNER=""
DETECTED_REPO=""
if git remote get-url origin &>/dev/null; then
  REMOTE_URL="$(git remote get-url origin)"
  # Hỗ trợ cả SSH (git@github.com:owner/repo.git) và HTTPS
  if echo "$REMOTE_URL" | grep -q "github.com"; then
    DETECTED_OWNER="$(echo "$REMOTE_URL" | sed -E 's|.*github\.com[:/]([^/]+)/.*|\1|')"
    DETECTED_REPO="$(echo "$REMOTE_URL" | sed -E 's|.*github\.com[:/][^/]+/([^/.]+).*|\1|')"
  fi
fi

echo ""
if [ -n "$DETECTED_OWNER" ]; then
  read -rp "GitHub Owner [$DETECTED_OWNER]: " INPUT_OWNER
  OWNER="${INPUT_OWNER:-$DETECTED_OWNER}"
else
  read -rp "GitHub Owner (org hoặc username): " OWNER
fi

if [ -n "$DETECTED_REPO" ]; then
  read -rp "GitHub Repo name [$DETECTED_REPO]: " INPUT_REPO
  REPO="${INPUT_REPO:-$DETECTED_REPO}"
else
  read -rp "GitHub Repo name: " REPO
fi

# Validate repo tồn tại
gh repo view "$OWNER/$REPO" &>/dev/null \
  || fail "Repo '$OWNER/$REPO' không tồn tại hoặc bạn không có quyền. Tạo repo trước (thủ công hoặc qua MCP GitHub)."
ok "Repo $OWNER/$REPO tồn tại"

echo ""
read -rp "GitHub Project number (số trong URL, ví dụ 5): " PROJECT_NUMBER
re='^[0-9]+$'
[[ "$PROJECT_NUMBER" =~ $re ]] || fail "Project number phải là số nguyên."

# ── Bước 2: Tạo Labels (idempotent) ──────────────────────────────────────────
step "[2/6] Tạo GitHub Labels"

create_label() {
  local name="$1" color="$2" desc="$3"
  if gh label create "$name" \
       --color "$color" \
       --description "$desc" \
       --repo "$OWNER/$REPO" 2>/dev/null; then
    echo "  + Tạo: $name"
  else
    echo "  ~ Đã có: $name (bỏ qua)"
  fi
}

# Labels chuẩn của workflow
create_label "spec"        "#0075ca" "Spec document"
create_label "task"        "#e4e669" "Development task"
create_label "bug"         "#d73a4a" "Bug report"
create_label "qc"          "#7057ff" "Manual QC task"
create_label "ready"       "#0e8a16" "Ready to pick up"
create_label "in-progress" "#fbca04" "Being worked on"
create_label "in-review"   "#e99695" "Waiting for review"
create_label "planned"     "#bfd4f2" "Spec has been planned"
create_label "needs-fix"   "#e4e669" "Rejected, needs rework"

ok "Labels OK"

# ── Bước 3: Lấy Project ID & Status Field ID ──────────────────────────────────
step "[3/6] Lấy Project ID & Status Field ID"

PROJECT_LIST=$(gh project list --owner "$OWNER" --format json 2>/dev/null || true)
if [ -z "$PROJECT_LIST" ] || [ "$PROJECT_LIST" = "null" ]; then
  echo ""
  echo -e "${RED}❌ Không đọc được danh sách GitHub Projects.${NC}"
  echo ""
  echo "   Nguyên nhân thường gặp:"
  echo "   1. Token thiếu scope 'project':"
  echo -e "      ${BOLD}gh auth refresh -h github.com -s project${NC}"
  echo "   2. Chưa tạo GitHub Project v2:"
  echo "      https://github.com/orgs/$OWNER/projects/new  (org)"
  echo "      https://github.com/users/$OWNER/projects     (personal)"
  exit 1
fi

PROJECT_ID=$(echo "$PROJECT_LIST" \
  | jq -r ".projects[] | select(.number == $PROJECT_NUMBER) | .id" 2>/dev/null || true)

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "null" ]; then
  echo ""
  echo -e "${RED}❌ Không tìm thấy Project #$PROJECT_NUMBER của '$OWNER'.${NC}"
  echo ""
  echo "   Projects hiện có:"
  echo "$PROJECT_LIST" | jq -r '.projects[] | "   #\(.number) — \(.title)"' 2>/dev/null \
    || echo "   (không có)"
  exit 1
fi
info "PROJECT_ID = $PROJECT_ID"

PROJECT_DATA=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json 2>/dev/null || true)
[ -z "$PROJECT_DATA" ] && fail "Không đọc được fields của Project #$PROJECT_NUMBER."

STATUS_FIELD=$(echo "$PROJECT_DATA" | jq -c '.fields[] | select(.name == "Status")' 2>/dev/null || true)
if [ -z "$STATUS_FIELD" ] || [ "$STATUS_FIELD" = "null" ]; then
  echo ""
  echo -e "${RED}❌ Project #$PROJECT_NUMBER không có field 'Status'.${NC}"
  echo ""
  echo "   Tạo field 'Status' (Single select) trong GitHub Project settings với các options:"
  echo "   Backlog | Ready | In Progress | In Review | Done"
  exit 1
fi

STATUS_FIELD_ID=$(echo "$STATUS_FIELD" | jq -r '.id')
info "STATUS_FIELD_ID = $STATUS_FIELD_ID"
ok "Project IDs OK"

# ── Bước 4: Lấy Column Option IDs ────────────────────────────────────────────
step "[4/6] Lấy Column Option IDs"

# Helper: lấy ID của 1 option theo pattern (case-insensitive)
get_col_id() {
  local field_data="$1" pattern="$2" col_name="$3"
  local id
  id=$(echo "$field_data" \
    | jq -r ".options[] | select(.name | test(\"$pattern\"; \"i\")) | .id" 2>/dev/null \
    | head -1)
  if [ -z "$id" ] || [ "$id" = "null" ]; then
    warn "Không tìm thấy cột '$col_name' — để trống. Set thủ công sau." >&2
    echo ""
    return
  fi
  echo "$id"
}

COL_BACKLOG=$(   get_col_id "$STATUS_FIELD" "^Backlog$"   "Backlog")
COL_READY=$(     get_col_id "$STATUS_FIELD" "^Ready$"     "Ready")
COL_IN_PROGRESS=$(get_col_id "$STATUS_FIELD" "Progress"   "In Progress")
COL_IN_REVIEW=$( get_col_id "$STATUS_FIELD" "Review"      "In Review")
COL_DONE=$(      get_col_id "$STATUS_FIELD" "^Done$"      "Done")

info "COL_BACKLOG    = ${COL_BACKLOG:-(empty)}"
info "COL_READY      = ${COL_READY:-(empty)}"
info "COL_IN_PROGRESS= ${COL_IN_PROGRESS:-(empty)}"
info "COL_IN_REVIEW  = ${COL_IN_REVIEW:-(empty)}"
info "COL_DONE       = ${COL_DONE:-(empty)}"

ok "Column IDs OK"

# ── Bước 5: Sinh file mcp-server/.env ────────────────────────────────────────
step "[5/6] Sinh file mcp-server/.env"

# Xác định root của project (cha của thư mục scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

mkdir -p "$PROJECT_ROOT/mcp-server"
ENV_FILE="$PROJECT_ROOT/mcp-server/.env"

cat > "$ENV_FILE" << EOF
# ============================================================
# MCP Server Environment — sinh tự động bởi setup-github.sh
# KHÔNG commit file này (đã có trong .gitignore)
# ============================================================

# GitHub credentials
GITHUB_TOKEN=$(gh auth token)
GITHUB_OWNER=$OWNER
GITHUB_REPO=$REPO

# GitHub Project v2 IDs
PROJECT_ID=$PROJECT_ID
PROJECT_NUMBER=$PROJECT_NUMBER
STATUS_FIELD_ID=$STATUS_FIELD_ID

# Column Option IDs (Status field)
COL_BACKLOG=$COL_BACKLOG
COL_READY=$COL_READY
COL_IN_PROGRESS=$COL_IN_PROGRESS
COL_IN_REVIEW=$COL_IN_REVIEW
COL_DONE=$COL_DONE

# Git
DEFAULT_BRANCH=main
REPO_PATH=$PROJECT_ROOT
EOF

ok "Sinh $ENV_FILE"

# Đảm bảo .env không bị commit
GITIGNORE="$PROJECT_ROOT/.gitignore"
if [ -f "$GITIGNORE" ] && ! grep -q "mcp-server/.env" "$GITIGNORE"; then
  echo "mcp-server/.env" >> "$GITIGNORE"
  info "Thêm mcp-server/.env vào .gitignore"
fi

# ── Bước 6: Set GitHub Actions Variables ─────────────────────────────────────
step "[6/6] Set GitHub Actions Variables"

# Helper: set 1 variable, bỏ qua nếu value rỗng
set_gh_var() {
  local name="$1" value="$2"
  if [ -z "$value" ] || [ "$value" = "null" ]; then
    warn "$name rỗng — bỏ qua. Set thủ công: gh variable set $name --body '...' --repo $OWNER/$REPO"
    return
  fi
  if gh variable set "$name" --body "$value" --repo "$OWNER/$REPO" 2>/dev/null; then
    info "  → $name = $value"
  else
    warn "Không set được $name. Set thủ công sau khi có quyền admin."
  fi
}

set_gh_var "PROJECT_NUMBER"   "$PROJECT_NUMBER"
set_gh_var "STATUS_FIELD_ID"  "$STATUS_FIELD_ID"
set_gh_var "COL_BACKLOG"      "$COL_BACKLOG"
set_gh_var "COL_READY"        "$COL_READY"
set_gh_var "COL_IN_PROGRESS"  "$COL_IN_PROGRESS"
set_gh_var "COL_IN_REVIEW"    "$COL_IN_REVIEW"
set_gh_var "COL_DONE"         "$COL_DONE"

ok "GitHub Actions Variables OK"

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
hr
echo -e "${BOLD}${GREEN}"
echo "╔══════════════════════════════════════════════╗"
echo "║   GitHub Setup hoàn tất!                     ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BOLD}Bước tiếp theo:${NC}"
echo ""
echo -e "${YELLOW}[ TechLead — cấu hình thủ công trên GitHub UI ]${NC}"
echo "  1. Branch Protection (main):"
echo "     Repo → Settings → Branches → Add rule"
echo "     ✅ Require PR before merging (1 approval)"
echo "     ✅ Require status checks: quality-gate"
echo "     ✅ Do not allow bypassing"
echo ""
echo "  2. Staging URL (nếu có CI deploy):"
echo "     Repo → Settings → Environments → staging"
echo "     gh variable set STAGING_URL --body 'https://staging.yourapp.com' --repo $OWNER/$REPO"
echo ""
echo "  3. Cập nhật deploy command trong .github/workflows/ci.yml"
echo "     (thay 'echo Deployed' bằng lệnh deploy thực tế)"
echo ""
echo -e "${YELLOW}[ Mỗi Dev ]${NC}"
echo "  4. Cài MCP server:"
echo "     cd mcp-server && docker compose --env-file .env up -d --build"
echo ""
echo "  5. Thêm vào Claude Desktop config:"
cat << 'MCPCONFIG'
     {
       "mcpServers": {
         "dev-mcp": {
           "command": "docker",
           "args": ["exec", "-i", "dev-mcp", "node", "dist/index.js"]
         }
       }
     }
MCPCONFIG
echo ""
echo "  6. Restart Claude Desktop → test: get_my_tasks username:your-github-username"
echo ""
echo -e "${CYAN}📌 Nhắc nhở (Constitution mục 1.5):${NC}"
echo "   Mọi tác vụ runtime (tạo/sync task, đẩy PR, duyệt PR) → dùng MCP GitHub."
echo "   gh CLI chỉ được dùng cho setup một lần như script này."
echo "   Nếu MCP lỗi trong runtime → hỏi người dùng trước, KHÔNG tự fallback."
echo ""
hr

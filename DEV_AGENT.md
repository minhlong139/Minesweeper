# DEV_AGENT.md — Rule cho Dev AI Agent

> Vai trò: triển khai code ở phase Construction. Đọc `constitution.md` + `AGENTS.md` + `specs/NNN/plan.md` + `tasks.md` trước.

## Phạm vi được phép ([AI])
- Sinh code theo plan.md & tasks.md
- Viết/cập nhật test khi đổi business logic
- Refactor có phạm vi xác định
- Mở PR (qua MCP GitHub), liên kết Issue + task
- Tạo branch feature/fix (git local)

## Quy tắc bắt buộc
- Chỉ làm trên branch riêng, không commit trực tiếp `main`
- Commit nhỏ, một mục tiêu logic, theo Conventional Commits
- Chạy `./scripts/verify-pr.sh` trước khi tuyên bố hoàn thành
- Không hardcode secret/token
- Không refactor lớn khi task chỉ cần thay đổi nhỏ

## KHÔNG được phép
- Tự merge/approve PR
- Tự deploy production
- Xóa code/file lớn khi chưa kiểm chứng tác động
- Đổi schema/public API khi chưa có plan duyệt
- Fallback sang gh/script khi MCP GitHub lỗi → DỪNG và báo cáo

## Definition of Done
Theo Constitution Section 8: AC pass · code reviewed · lint+typecheck+unit test pass · security scan pass · doc cập nhật · Issue đóng.

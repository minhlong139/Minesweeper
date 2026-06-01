# QA_AGENT.md — Rule cho QA AI Agent

> Vai trò: kiểm thử ở phase test. Đọc `constitution.md` + `AGENTS.md` + `specs/NNN/spec.md` (acceptance criteria) trước.

## Phạm vi được phép ([AI])
- Sinh test plan, regression checklist
- Chạy test suite, gom evidence
- Tạo issue bug (qua MCP GitHub) kèm step tái hiện
- Đối chiếu kết quả với acceptance criteria trong spec.md

## Quy tắc
- Test phải bám acceptance criteria, không tự định nghĩa "đúng"
- Phạm vi test theo risk level: unit (mọi cấp) → integration → E2E (High/Critical)
- Báo cáo trung thực: không tuyên bố pass khi chưa đủ evidence

## KHÔNG được phép
- Tự nghiệm thu/đóng feature (đó là việc PO/BO ở UAT)
- Tự hạ tiêu chí test
- Sửa code sản phẩm để "cho test pass" (báo Dev xử lý)

## Output
- `qa/test-plan.md`, `qa/regression-checklist.md`, `qa/reports/`
- Bug issues có nhãn severity + step tái hiện rõ ràng

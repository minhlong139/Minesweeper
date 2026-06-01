# TECHLEAD_AGENT.md — Rule cho Tech Lead AI Agent

> Vai trò: hỗ trợ Tech Lead ở phase plan/tasks và kiểm soát kiến trúc, risk. Đọc `constitution.md` + `AGENTS.md` trước.

## Phạm vi được phép
- Sinh `plan.md`: kiến trúc, lựa chọn kỹ thuật, API design, data model
- Sinh `tasks.md`: phân rã task kèm Definition of Done
- Draft ADR trong `/decisions`
- Draft `architecture.md` (Mermaid) + `architecture.drawio`
- Đề xuất risk level

## Mô hình phân vai
- **[AI→duyệt]** plan, tasks, ADR, kiến trúc — Tech Lead review & approve
- **[Người] Tech Lead chốt**: risk level, approve PR/merge, quyết định deploy

## KHÔNG được phép
- Tự hạ risk level (chỉ con người Tech Lead được hạ; bất kỳ ai cũng được đề xuất nâng)
- Tự approve/merge PR
- Tự thay đổi kiến trúc/dependency lớn/schema/public API khi chưa có spec+plan duyệt
- Tự thay đổi infra production hoặc settings repo

## Tiêu chí review PR (cổng chốt)
- Có link Issue + spec/task
- Không lệch spec/design đã duyệt
- Pipeline pass ở stage bắt buộc
- Risk level đã xác định, workflow tương ứng đã tuân thủ
- High/Critical: có security consideration + rollback plan

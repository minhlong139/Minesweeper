# DESIGN_AGENT.md — Rule cho Design AI Agent

> Vai trò: hỗ trợ thiết kế UI/UX ở phase design (chỉ áp dụng feature có giao diện). Đọc `constitution.md` + `AGENTS.md` + `specs/NNN/spec.md` trước.

## Phạm vi được phép ([AI→duyệt])
- Draft layout (`layout.md`)
- Draft UI/UX prototype (`design.md`, HTML hoặc link)
- Đề xuất design checklist (accessibility, responsive, SEO)
- Chuẩn bị asset

## Quy trình bắt buộc (Constitution 5.2)
```
Layout → BO approve → UI/UX Final → BO approve → implement
```
Không bỏ qua bước design với feature có UI. Không clarify khi chưa có hình dung UI.

## Tiêu chuẩn
- Theo Design System của dự án — không hardcode màu/font/layout tuỳ tiện
- Responsive đa thiết bị
- Accessible
- SEO-ready cho trang public

## KHÔNG được phép
- Tự chốt thiết kế final (BO approve mới có hiệu lực)

## Output
`design/NNN-feature-name/`: `layout.md`, `uiux-final.md`, `design-checklist.md`, `assets/`

# AGENTS.md

> Điểm vào (entrypoint) chính cho mọi AI Agent. PHẢI tồn tại ở thư mục gốc repo trước khi bất kỳ Agent nào bắt đầu làm việc. Mọi Agent đọc file này + `constitution.md` trước tiên.

## Ngôn ngữ làm việc
- Phản hồi, tài liệu, comment trên Issue/PR: tiếng Việt (theo Constitution mục 0)
- Giữ tiếng Anh: tên riêng, thuật ngữ chuyên ngành, định danh trong mã nguồn

## Bối cảnh dự án (Project Context)
- Sản phẩm/module: 【ĐIỀN: Tên dự án 】
- Tech stack: 【ĐIỀN: Liệt kê cụ thể — đồng bộ với constitution Section 3 】
- Tóm tắt kiến trúc: 【ĐIỀN: Mô tả ngắn — service, database, messaging 】

## Nguồn sự thật (Source of Truth)
- Yêu cầu/spec: `specs/`
- Task/bug: Git Platform Issues
- Code review: Pull/Merge Requests
- Verification: CI Pipeline + script local

## Kênh tương tác GitHub (theo Constitution mục 1.5)

**Luồng Setup (một lần — gh CLI được phép):**
- `scripts/setup-github.sh` dùng `gh` CLI để tạo Labels, lấy Project IDs, sinh `mcp-server/.env`, set Actions Variables
- Đây là tác vụ hạ tầng một lần, con người kiểm soát trực tiếp khi chạy script

**Luồng Runtime (hàng ngày — MCP-first):**
- Tạo/sửa/đóng Issue, tạo PR, comment, review, merge, sync trạng thái task: **CHỈ qua MCP GitHub**
- `git` local (branch, commit, push branch cá nhân): vẫn được phép
- `gh` CLI trong runtime: **CẤM tự dùng** — phải hỏi người dùng trước

**Khi MCP GitHub lỗi trong runtime — quy trình bắt buộc:**
```
1. Dừng tác vụ
2. Thông báo: "MCP GitHub không khả dụng — [mô tả lỗi cụ thể]"
3. Hỏi người dùng: "Tôi có thể dùng gh CLI thay thế cho [tác vụ X] không?"
4. Chỉ tiến hành nếu người dùng đồng ý rõ ràng
5. Nhắc người dùng fix lại MCP sau khi xong
```
**KHÔNG fallback âm thầm** — vi phạm Constitution mục 1.5.

## Phối hợp theo phase với AI

### Inception (CÁI GÌ & TẠI SAO)
- Đọc spec.md, research.md, design.md (nếu có UI) trước khi đề xuất
- Nếu acceptance criteria chưa rõ → đề xuất câu hỏi cho PO/BO, không tự đoán
- Risk level phải được Tech Lead xác nhận trước khi chuyển sang Construction

### Construction (LÀM NHƯ THẾ NÀO & BUILD)
- Đọc plan.md và tasks.md trước khi sinh code
- Dùng quy ước trong mục "Quy tắc Coding" bên dưới
- Chạy lệnh verify trước khi tuyên bố hoàn thành
- Liên kết mọi commit/PR đến issue và task tương ứng

### Operations (RELEASE & VẬN HÀNH)
- Hỗ trợ release note, rollback plan, monitoring khi được yêu cầu
- KHÔNG tự release production
- Post-release verification phải do người chịu trách nhiệm xác nhận

## Quy tắc Coding
- Quy ước đặt tên: 【ĐIỀN: camelCase/PascalCase/snake_case theo layer 】
- Quy ước API: có version (/v1/...), structured error response, correlation ID
- Xử lý lỗi: 【ĐIỀN: Mô tả pattern 】
- Quy tắc bảo mật: Không log dữ liệu nhạy cảm; validate input; sanitize output
- Quy tắc test: Unit test cho business logic; integration test cho API; E2E cho luồng quan trọng

## Lệnh (Commands)
```bash
./scripts/setup-dev.sh    # Setup môi trường
./scripts/run-tests.sh    # Chạy full test suite
./scripts/verify-pr.sh    # Verify trước khi push: lint + typecheck + test + build
```

## Definition of Done cho AI Agent
- Không tuyên bố hoàn thành khi chưa chạy lệnh verify
- Liên kết mọi thay đổi đến issue/spec/task
- Không tự thay đổi scope
- Không tự hạ risk level
- Nếu phát hiện mâu thuẫn spec/design/code → đề xuất cập nhật, không tự xử lý

## Phân tầng Workflow theo Risk Level
- Low: mô tả issue là đủ, không cần spec.md/plan.md riêng
- Medium/High: bắt buộc spec.md + plan.md + tasks.md đầy đủ
- Critical: đầy đủ + multi-approval + rollback plan + post-release verification
- AI Agent gợi ý risk level, Tech Lead chốt

## Phân vai 3 nhóm (xem constitution Section 1.4, 5.2)
- [Người] HITL — AI không tự thực hiện
- [AI→duyệt] AI sinh nháp, người phê duyệt
- [AI] Việc cơ học, AI tự làm

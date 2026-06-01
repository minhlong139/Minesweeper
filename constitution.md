<!--
  ============================================================================
  CONSTITUTION TEMPLATE — Nhà Máy Phần Mềm AI
  ============================================================================
  Đây là TEMPLATE chuẩn hoá, độc lập với tech stack & dự án cụ thể.
  Giữ nguyên triết lý: Spec-Kit Workflow · HITL · Harness Engineering · Governance.

  CÁCH DÙNG:
  1. Sao chép file này thành `constitution.md` ở thư mục gốc (repo root) của dự án mới.
  2. Tìm tất cả marker `【ĐIỀN: ... 】` và điền nội dung dự án.
  3. Tìm tất cả marker `〔CHỌN: ...〕` và chọn 1 phương án, xoá phần còn lại.
  4. Xoá các dòng `> 💡 GỢI Ý` sau khi đã điền xong.
  5. Cập nhật Version / Ngày phê duyệt / Sửa đổi lần cuối ở phần đầu.
  6. Xoá toàn bộ block comment hướng dẫn này.

  Ai chịu trách nhiệm điền:
  - PO/BO     → mục có nhãn 〘PO/BO〙 (nghiệp vụ, phạm vi, sản phẩm)
  - Tech Lead → mục có nhãn 〘TECH LEAD〙 (stack, kiến trúc, quy ước, risk)

  Sync Impact Report (cập nhật mỗi lần sửa đổi):
    Version change: 0.0.0 → 1.0.0 (khởi tạo template)
    Template phụ thuộc cần rà soát khi thay đổi:
      - specs/NNN/plan.md   — Constitution Check gate
      - specs/NNN/spec.md
      - specs/NNN/tasks.md
  ============================================================================
-->

# Constitution — Minesweeper

**Phiên bản**: 1.0.0 | **Ngày phê duyệt**: 2026-06-01 | **Sửa đổi lần cuối**: 2026-06-01

> 💡 GỢI Ý: Đây là tài liệu có thẩm quyền cao nhất của dự án. Mọi AI Agent và thành viên phải đọc trước khi làm việc.

---

# 0. Ngôn ngữ làm việc (Bắt buộc)

Đây là **quy tắc bắt buộc** mà mọi AI Agent phải tuân thủ trong suốt vòng đời dự án.

- Ngôn ngữ chính của dự án là **tiếng Việt**. Mọi AI Agent BẮT BUỘC phản hồi, giải thích, đặt câu hỏi, bình luận (comment) trên Issue/PR, và viết tài liệu bằng tiếng Việt.
- Giữ nguyên tiếng Anh đối với: tên riêng (sản phẩm, công nghệ, thương hiệu), thuật ngữ chuyên ngành đã phổ biến (vd: commit, branch, merge, deploy, pipeline, rollback, schema), và toàn bộ định danh trong mã nguồn (tên class, biến, hàm, file, API endpoint).
- Không tự ý dịch thuật ngữ kỹ thuật sang tiếng Việt nếu việc đó gây mơ hồ hoặc sai lệch ý nghĩa.
- Mã nguồn và comment trong code: tuân theo quy ước tại `AGENTS.md`; nếu không quy định khác, comment trong code viết bằng tiếng Việt, định danh giữ tiếng Anh.
- AI Agent vi phạm quy tắc ngôn ngữ này bị coi là output không hợp lệ và không được merge.

---

# 1. Nguyên tắc cốt lõi

## 1.1 Nguồn sự thật (Source of Truth)

`constitution.md` PHẢI được coi là tài liệu có thẩm quyền cao nhất đối với mọi AI Agent và thành viên trong nhóm.

Mọi Agent PHẢI tuân thủ spec, plan, và danh sách task trước khi chỉnh sửa bất kỳ đoạn mã nào.

Kiến trúc, các dependency lớn, database schema, hoặc public API KHÔNG ĐƯỢC thay đổi nếu chưa có spec/plan tương ứng đã được phê duyệt trong `specs/`.

Mọi quyết định trong suốt vòng đời dự án phải tuân theo thứ tự ưu tiên sau:

```
1. Kết quả nghiệp vụ & trải nghiệm người dùng (Business outcome & user experience)
2. An toàn mặc định (Security by default)
3. Khả năng bảo trì & mở rộng (Maintainability & scalability)
4. Tính tinh gọn về kỹ thuật (Technical elegance)
```

Các trao đổi trên chat/Teams/Slack là trao đổi nhanh — **không phải nguồn sự thật**.
Mọi quyết định đã chốt phải được ghi vào Spec Kit artifact hoặc Issue trên Git Platform.

## 1.2 Quy tắc phát triển

Mọi thay đổi mã nguồn PHẢI được liên kết với một feature/spec trong `specs/`.

Cấm triển khai trực tiếp từ một yêu cầu mơ hồ hoặc chưa được ghi tài liệu.
Không coding trực tiếp từ trao đổi miệng (verbal discussion).

Test PHẢI được cập nhật mỗi khi business logic thay đổi.

Secret, token, và credential KHÔNG ĐƯỢC hardcode trong mã nguồn hoặc commit vào repository.

Cấm xóa mã nguồn hoặc file lớn khi chưa kiểm chứng đầy đủ tác động lên các thành phần phụ thuộc.

Không deploy thủ công trên môi trường production.

## 1.3 Branch & Commit

Mọi thành viên PHẢI làm việc trên một branch riêng — không bao giờ làm trực tiếp trên `main`.

Mô hình branch:

```
main
└── develop                    ← branch tích hợp (integration)
    ├── feature/NNN-name       ← branch feature (toàn bộ vòng đời feature)
    ├── fix/NNN-name           ← branch sửa bug
    └── hotfix/name            ← branch hotfix production
```

Quy ước đặt tên branch:
- `feature/<NNN>-<short-name>` cho feature mới (vd: `feature/008-user-auth`)
- `fix/<issue-id>-<short-name>` cho sửa bug

Một branch duy nhất cho toàn bộ vòng đời feature — không tạo branch riêng theo từng phase.

Commit PHẢI nhỏ, phạm vi rõ ràng, và chỉ phục vụ một mục tiêu logic duy nhất.
Các thay đổi không liên quan KHÔNG ĐƯỢC gộp chung vào một commit.

Quy ước commit:

```
feat:     tính năng mới
fix:      sửa bug
refactor: refactor không đổi behavior
docs:     cập nhật tài liệu
test:     thêm/sửa test
chore:    task vận hành, config, dependency
```

## 1.4 Quản trị AI Agent

Mọi AI Agent (Claude, Gemini, Codex, Cursor, Copilot, và tương đương) PHẢI đọc bản constitution này trước khi thực hiện bất kỳ công việc nào trên dự án.

Cấu hình cá nhân hoặc riêng của từng Agent CHỈ ĐƯỢC đặt trong các file local đã được liệt kê trong `.gitignore`.

AI Agent KHÔNG ĐƯỢC viết lại toàn bộ dự án hoặc refactor phần lớn codebase khi task được giao chỉ yêu cầu một thay đổi nhỏ, có phạm vi xác định.

AI Agent ĐƯỢC phép:
- Sinh code, test, tài liệu, refactor, phân tích, automation

AI Agent KHÔNG được phép:
- Tự merge, tự deploy production, tự thay đổi infra production
- Bỏ qua (bypass) kiểm soát bảo mật
- Xóa dữ liệu production
- Tự chốt phạm vi (scope), tự phê duyệt (approve), tự hạ risk level

Bắt buộc human review với mọi output do AI sinh ra. Không merge code chưa được review.

**Mô hình phân vai 3 nhóm** (chi tiết theo phase tại Section 5.2, theo checklist init tại Section 10):
- **[Người]** Các hành động trong Section 7 (HITL) — con người tự quyết, AI không được tự thực hiện.
- **[AI→duyệt]** AI sinh toàn bộ bản nháp/artifact (spec, plan, tasks, ADR, kiến trúc, release note, evidence UAT), con người review & phê duyệt mới có hiệu lực.
- **[AI]** Việc cơ học, ít rủi ro (scaffold cấu trúc repo, sinh script/CI config, tạo skeleton, chạy verify harness, cập nhật knowledge/postmortem) — AI tự làm, con người giám sát.

## 1.5 Kênh tương tác với GitHub (Bắt buộc)

Đây là **quy tắc bắt buộc** nhằm ngăn AI Agent tự ý "chữa cháy" bằng đường vòng khi tích hợp lỗi. Quy tắc phân biệt rõ hai luồng: **setup một lần** và **runtime**.

### Luồng Setup (một lần — `gh` CLI được phép)

Script `scripts/setup-github.sh` và các tác vụ khởi tạo hạ tầng (tạo Labels, lấy Project IDs, sinh `.env`, set GitHub Actions Variables) **được phép dùng `gh` CLI** vì:
- Chạy một lần duy nhất, không phải lặp lại theo vòng đời task.
- Không có MCP tương ứng đủ đơn giản để thay thế.
- Con người kiểm soát trực tiếp khi chạy script.

### Luồng Runtime (MCP-first — `gh` CLI chỉ dùng khi được phép)

Mọi tác vụ trong vòng đời task và PR — tạo/sửa/đóng Issue, comment, đẩy PR, review, merge, release, thay đổi settings repo — **phải thực hiện qua MCP GitHub trước**:

| Tác vụ runtime | Kênh | Fallback |
|----------------|------|---------|
| Tạo/sửa/đóng Issue | MCP GitHub | Hỏi người dùng trước khi dùng `gh` |
| Tạo PR | MCP GitHub | Hỏi người dùng trước khi dùng `gh` |
| Comment / Review / Merge | MCP GitHub | Hỏi người dùng trước khi dùng `gh` |
| Đồng bộ trạng thái task | MCP GitHub | Hỏi người dùng trước khi dùng `gh` |
| Release / Deployment trigger | MCP GitHub | Hỏi người dùng trước khi dùng `gh` |

- `git` local (clone, branch, commit, diff, log, push branch của mình) **vẫn được phép** — đây là công cụ làm việc cơ bản, không phải đường vòng qua GitHub API.
- **CẤM fallback âm thầm:** Khi MCP GitHub lỗi trong runtime, AI Agent PHẢI DỪNG, thông báo rõ lỗi cho người dùng, và **hỏi xin phép** trước khi dùng `gh` CLI thay thế. TUYỆT ĐỐI không tự chuyển sang `gh` mà không hỏi.
- Lỗi MCP GitHub trong runtime là lỗi tầng hạ tầng cần fix tận gốc (xem Section 9), không phải lý do để workaround tự động.

**Quy trình khi MCP lỗi trong runtime:**
```
1. Dừng tác vụ đang thực hiện
2. Báo cáo rõ: "MCP GitHub không khả dụng — [mô tả lỗi cụ thể]"
3. Hỏi người dùng: "Tôi có thể dùng gh CLI thay thế cho tác vụ [X] không?"
4. Chỉ tiếp tục bằng gh CLI nếu người dùng đồng ý rõ ràng
5. Sau khi xong: nhắc người dùng fix lại MCP trước khi tiếp tục các tác vụ khác
```

---

# 2. Yêu cầu kiến trúc

## 2.1 Ưu tiên sản phẩm (Product-first)

Mọi quyết định kỹ thuật phải phục vụ:

- Kết quả nghiệp vụ (business outcome)
- Trải nghiệm người dùng (user experience)
- Khả năng mở rộng (scalability)
- Hiệu quả vận hành (operational efficiency)
- Khả năng bảo trì (maintainability)

Không tối ưu kỹ thuật theo hướng gây phức tạp (complexity) không cần thiết.

## 2.2 An toàn mặc định (Security by Default)

Toàn bộ hệ thống phải mặc định an toàn ngay từ khâu thiết kế.

Bắt buộc:

- Tuân thủ OWASP Top 10
- API authentication & authorization
- Nguyên tắc đặc quyền tối thiểu (least privilege)
- Mã hóa khi truyền và khi lưu trữ (encryption in transit & at rest)
- Audit logging trên mọi hành động quan trọng
- Quản lý secret an toàn — lưu trong Secret Manager, không hardcode
- Security scanning trong CI/CD pipeline
- Tách biệt hoàn toàn credential giữa các môi trường

Các môi trường bắt buộc tách biệt:

```
〔CHỌN: local → dev → sit → uat → prod  |  local → dev → staging → prod 〕
```
> 💡 GỢI Ý 〘TECH LEAD〙: Khai báo đúng số môi trường mà dự án sử dụng.

Không sử dụng dữ liệu production trong môi trường dev/test.

## 2.3 Kiến trúc API-first

Mọi tích hợp phải theo hướng API-first.

- Mọi tích hợp đi qua API, không gọi database trực tiếp từ client
- Tách rời (decoupled) hoàn toàn frontend/backend
- Event-driven cho các luồng bất đồng bộ (async) khi áp dụng
- Sẵn sàng cho tương lai (future-ready): mobile app, tích hợp bên ngoài
- API contract chuẩn hoá (vd: OpenAPI / Swagger) bắt buộc cho mọi public API

Chuẩn API:
- Có version: `/v1/...`
- Cấu trúc error response rõ ràng (structured error response)
- Correlation ID

## 2.4 Cloud-native & Stateless

Ưu tiên kiến trúc cloud-native.

- Service stateless, có thể scale ngang (horizontal scalable)
- Infrastructure as Code — không cấu hình thủ công
- Triển khai bất biến (immutable deployment)
- Auto scaling
- Logging tập trung (centralized logging)
- Tự động phục hồi (automated recovery)

Không deploy thủ công trực tiếp trên server production.

## 2.5 Phát triển có AI hỗ trợ (AI-assisted Development)

Cho phép AI tham gia: Coding, viết tài liệu, testing, refactoring, phân tích, automation.

Tuy nhiên:

- Bắt buộc human review với mọi output do AI sinh ra
- Không merge code do AI sinh khi chưa review
- Không cung cấp (expose) dữ liệu nhạy cảm cho AI
- Mọi code phải pass: lint, unit test, security scan, architecture review

---

# 3. Tiêu chuẩn Technology Stack

> 💡 GỢI Ý 〘TECH LEAD〙: Mục này CHƯA điền. Khai báo stack chính thức của dự án.
> Sau khi chốt, stack này là default đã kiểm chứng — mọi thay đổi khác (deviation) phải ghi ADR
> trong `/decisions` và khai báo rõ trong `AGENTS.md`.

## 3.1 Stack mặc định

| Lớp | Công nghệ |
|---|---|
| Ngôn ngữ | 【ĐIỀN: ... 】 |
| Framework | 【ĐIỀN: ... 】 |
| Frontend / UI | 【ĐIỀN: ... 】 |
| Backend / API | 【ĐIỀN: ... 】 |
| Database | 【ĐIỀN: ... 】 |
| ORM / Data access | 【ĐIỀN: ... 】 |
| Auth | 【ĐIỀN: ... 】 |
| Infra / Hosting | 【ĐIỀN: ... 】 |
| IaC | 【ĐIỀN: ... 】 |

## 3.2 Tiêu chuẩn Frontend (nếu có UI)

| Khía cạnh | Tiêu chuẩn |
|---|---|
| Styling | 【ĐIỀN: ... 】 — không hardcode màu/font/layout |
| Quản lý state | 【ĐIỀN: ... 】 |
| i18n (đa ngôn ngữ) | 【ĐIỀN: ... 】 (vd: URL prefix `/{lang}/...`) |
| Mục tiêu hiệu năng | 【ĐIỀN: vd Lighthouse > 85, Core Web Vitals đạt chuẩn 】 |

Frontend phải: responsive đa thiết bị, theo Design System, ưu tiên component tái sử dụng, hỗ trợ accessibility, SEO-ready cho các trang public. Tách biệt business logic và phần render UI.

## 3.3 DevOps & CI/CD

Toàn bộ pipeline phải tự động hóa 100%. Không cấu hình hạ tầng thủ công.

Pipeline chuẩn (tối thiểu):

```
Code Commit → PR Validation (lint + test + build) → 【ĐIỀN: Deploy target 】
```

---

# 4. Tiêu chuẩn Repository & Tài liệu

## 4.1 Cấu trúc Repository

```text
project-root/
├── AGENTS.md                     ← [BẮT BUỘC] Điểm vào (entrypoint) chính cho mọi AI Agent
├── constitution.md               ← Engineering constitution của dự án
├── PO_AGENT.md                   ← Quy tắc cho PO AI Agent
├── TECHLEAD_AGENT.md             ← Quy tắc cho Tech Lead AI Agent
├── DEV_AGENT.md                  ← Quy tắc cho Dev AI Agent
├── QA_AGENT.md                   ← Quy tắc cho QA AI Agent
├── DESIGN_AGENT.md               ← Quy tắc cho Design AI Agent (nếu có UI)
│
├── specs/                        ← Nguồn sự thật của yêu cầu & thiết kế
│   └── NNN-feature-name/
│       ├── spec.md               ← Business spec, user story, acceptance criteria
│       ├── plan.md               ← Technical plan, kiến trúc, API, data
│       ├── tasks.md              ← Phân rã task kèm Definition of Done
│       ├── research.md           ← Giả định, ràng buộc, phân tích
│       ├── design.md             ← UI/UX prototype (HTML hoặc link)
│       ├── data-model.md         ← Schema, ER diagram
│       ├── contracts/            ← API spec, kiểu request/response
│       └── quickstart.md         ← Hướng dẫn setup, run, verify
│
├── design/
│   └── NNN-feature-name/
│       ├── layout.md
│       ├── uiux-final.md
│       ├── design-checklist.md
│       └── assets/
│
├── src/                          ← Mã nguồn (cấu trúc theo dự án)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── infra/
│   ├── 【ĐIỀN: terraform / cdk / ... 】
│   └── environments/             ← theo danh sách môi trường tại mục 2.2
│
├── docs/
│   ├── architecture/
│   │   ├── architecture.md       ← Mermaid diagram — LUÔN đồng bộ với .drawio
│   │   └── architecture.drawio   ← draw.io source — commit cùng lúc với .md
│   ├── api/
│   └── runbooks/
│
├── decisions/                    ← Architecture Decision Records (ADR)
├── knowledge/                    ← Bài học rút ra (lessons learned) sau mỗi lần delivery
├── postmortems/                  ← Báo cáo sự cố, phân tích nguyên nhân gốc
│
├── scripts/
│   ├── setup-dev.sh              ← [BẮT BUỘC]
│   ├── run-tests.sh              ← [BẮT BUỘC]
│   └── verify-pr.sh              ← [BẮT BUỘC]
│
├── qa/
│   ├── test-plan.md
│   ├── regression-checklist.md
│   └── reports/
│
└── .ci/                          ← 〔CHỌN: .github/workflows/ | .gitlab-ci.yml | bitbucket-pipelines.yml 〕
```

## 4.2 Quy tắc tài liệu

- `architecture.md` và `architecture.drawio` PHẢI được commit trong cùng một commit — không commit riêng lẻ. PR vi phạm quy tắc này sẽ bị reject.
- Tài liệu spec viết bằng tiếng Việt (theo mục 0). Thuật ngữ kỹ thuật và tên class/biến/hàm giữ nguyên tiếng Anh.
- Mọi feature phải có: business spec + acceptance criteria + technical design + API contract.
- ADR lưu trong `/decisions` — gồm: bối cảnh (context), các phương án (alternatives), đánh đổi (tradeoffs), quyết định (decision), tác động (impact).
- Sau mỗi sự cố/lần delivery lớn: cập nhật `/knowledge` và `/postmortems`.
- Không tạo hệ tài liệu song song nằm ngoài cấu trúc repo chuẩn.

## 4.3 AGENTS.md — Template tối thiểu

`AGENTS.md` PHẢI tồn tại ở thư mục gốc repo trước khi bất kỳ AI Agent nào bắt đầu làm việc. Nội dung tối thiểu:

```markdown
# AGENTS.md

## Ngôn ngữ làm việc
- Phản hồi, tài liệu, comment trên Issue/PR: tiếng Việt (theo Constitution mục 0)
- Giữ tiếng Anh: tên riêng, thuật ngữ chuyên ngành, định danh trong mã nguồn

## Bối cảnh dự án (Project Context)
- Sản phẩm/module: 【ĐIỀN: Tên dự án 】
- Tech stack: 【ĐIỀN: Liệt kê cụ thể — đồng bộ với section 3 】
- Tóm tắt kiến trúc: 【ĐIỀN: Mô tả ngắn — service, database, messaging 】

## Nguồn sự thật (Source of Truth)
- Yêu cầu/spec: `specs/`
- Task/bug: Git Platform Issues
- Code review: Pull/Merge Requests
- Verification: CI Pipeline + script local

## Kênh tương tác GitHub (theo Constitution mục 1.5)
- Thao tác remote (Issue, PR, merge, release, settings): CHỈ qua MCP GitHub
- git local được phép; gh CLI/script: cấm trừ khi con người approve
- MCP GitHub lỗi → DỪNG và báo cáo, KHÔNG tự fallback sang gh/script

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
\`\`\`bash
./scripts/setup-dev.sh    # Setup môi trường
./scripts/run-tests.sh    # Chạy full test suite
./scripts/verify-pr.sh    # Verify trước khi push: lint + typecheck + test + build
\`\`\`

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
```

---

# 5. Quy trình SDLC

## 5.1 Ba trụ cột (Three Pillars)

```
Spec Kit        = nguồn sự thật: yêu cầu, thiết kế, plan, tasks
Harness Eng.    = kiểm soát context, môi trường, verification, state cho AI Agent
Git Platform    = quản lý issue, mã nguồn, PR, pipeline
```

## 5.2 Thứ tự phase của Spec-Kit

```
specify → design → clarify → plan → tasks → implement → test → uat → deploy
```

**Mô hình phân vai (3 nhóm):**
- **Người chốt (HITL)** — con người tự quyết, AI không được tự thực hiện. Là chốt chặn trách nhiệm.
- **AI làm – người duyệt** — AI sinh toàn bộ bản nháp/artifact, con người review và phê duyệt mới có hiệu lực.
- **AI làm** — AI tự thực hiện trọn vẹn (việc cơ học, ít rủi ro), con người chỉ giám sát.

| Phase | Mô hình | AI làm gì | Người làm gì (chốt) | Artifact |
|---|---|---|---|---|
| specify | AI làm – người duyệt | Draft `spec.md` từ yêu cầu thô | PO/BO chỉnh & approve | `spec.md` |
| design | AI làm – người duyệt | Draft layout/UI-UX, prototype | PO/BO + Designer approve | `design.md`, `layout.md`, `uiux-final.md` |
| clarify | Người chốt | Đề xuất câu hỏi làm rõ | PO/BO trả lời & chốt | Comment trên issue / spec |
| plan | AI làm – người duyệt | Sinh toàn bộ `plan.md` | Tech Lead review & approve | `plan.md` |
| tasks | AI làm – người duyệt | Sinh `tasks.md` + đề xuất Issue | Tech Lead review & approve | `tasks.md` + Git Issues |
| (risk level) | Người chốt | Đề xuất risk level | Tech Lead chốt | Label trên Issue |
| implement | AI làm | Sinh code, mở PR | Developer giám sát | Mã nguồn, PR |
| test | AI làm | Chạy test, gom evidence, tạo issue bug | QA giám sát | Bằng chứng test, issue bug |
| (code review) | Người chốt | — | Approve PR / Merge | Approval trên PR |
| uat | AI làm – người duyệt | Chạy test & gom evidence nghiệm thu | PO/BO ra quyết định pass/fail | Nghiệm thu (acceptance) trên issue |
| deploy | Người chốt | Soạn release note, rollback plan (chờ duyệt) | Tech Lead / DevOps release production | Release note, pipeline |

> 💡 GỢI Ý: Cột "Mô hình" quy định ai có quyền chốt. AI luôn được phép sinh nháp ở mọi phase,
> nhưng artifact chỉ có hiệu lực sau khi người ở cột "Người làm (chốt)" phê duyệt theo đúng mô hình.

Quy tắc:
- `design` đi ngay sau `specify`, trước `clarify` — không clarify khi chưa hình dung được UI
- `plan` và `tasks` chỉ bắt đầu khi spec + design + clarify đã ổn định
- Không bỏ qua bước `design` với feature có giao diện người dùng
- Feature có UI bắt buộc: Layout → BO approve → UI/UX Final → BO approve → implement

## 5.3 Cổng review PR (PR Review Gate)

PR chỉ được approve khi:

- Có link Git Platform Issue và spec/task liên quan
- Có mô tả thay đổi và bằng chứng test local nếu cần
- Không lệch khỏi spec/design đã duyệt
- Không còn critical comment chưa giải quyết
- Pipeline không fail ở stage bắt buộc
- Risk level đã được xác định và workflow tương ứng đã được tuân thủ
- Nếu High/Critical: có phần xem xét bảo mật (security consideration) trong mô tả PR hoặc plan.md

---

# 6. Risk Level & Phân tầng Workflow

Risk level được gán khi tạo issue. Tech Lead chốt. Bất kỳ ai cũng có thể đề xuất nâng,
chỉ Tech Lead được hạ. Khi không chắc chắn → chọn mức cao hơn.

| Risk | Khi nào | Workflow |
|---|---|---|
| **Low** | Text/copy/style nhỏ, không đổi business logic | Mô tả issue là đủ, không cần spec.md/plan.md riêng |
| **Medium** | Feature/bug có frontend+backend trong 1 module | Bắt buộc spec.md + plan.md + tasks.md |
| **High** | Chạm đến auth, data, integration, security, performance | Như Medium + phần security + rollback plan |
| **Critical** | Production, dữ liệu khách hàng, compliance, outage | Như High + multi-approval + regression test + post-release verification |

---

# 7. HITL — Human In The Loop (Con người trong vòng lặp)

Các hành động sau **bắt buộc có sự phê duyệt của con người**. AI Agent KHÔNG được tự thực hiện:

```
□ Deploy production
□ Schema migration
□ Thay đổi chính sách bảo mật (security policy)
□ Nâng quyền (permission escalation)
□ Xóa dữ liệu (data deletion)
□ Thay đổi hạ tầng (infrastructure changes)
□ Approve PR / Merge code
□ Chốt phạm vi (scope) chính thức
□ Nghiệm thu spec / Nghiệm thu feature
□ Chốt risk level (chỉ Tech Lead)
□ Release production
```

HITL được thể hiện bằng approve/comment/thay đổi status trên Git Platform hoặc phê duyệt
chính thức trên spec. Không thực hiện bằng tin nhắn chat.

---

# 8. Definition of Done

Một feature chỉ được coi là hoàn thành khi tất cả đều pass:

```
□ Acceptance Criteria đã pass (theo spec.md)
□ Code đã được review & approve trên PR
□ Lint + typecheck + unit test pass
□ Security scan pass
□ Integration/E2E test pass (theo risk level)
□ Tài liệu API đã cập nhật
□ Tài liệu kiến trúc đã đồng bộ nếu có thay đổi kiến trúc
□ Monitoring/alerting đã cấu hình nếu cần
□ Rollback đã được kiểm chứng (High/Critical)
□ UAT đã được PO/BO approve
□ Git Platform Issue đã đóng
```

---

# 9. Harness Engineering

Khi AI Agent thất bại, kiểm tra theo thứ tự này **trước khi đổi model**:

| Lớp | Vấn đề | Cách xử lý |
|---|---|---|
| Đặc tả task (Task specification) | Agent hiểu sai scope | Cập nhật spec.md / mô tả issue / acceptance criteria |
| Cung cấp context (Context provisioning) | Agent không biết quy ước | Cập nhật AGENTS.md, plan.md, ADR |
| Môi trường thực thi (Execution environment) | Thiếu dependency, sai version | Cập nhật setup-dev.sh, devcontainer |
| Phản hồi verify (Verification feedback) | Agent nói "xong" khi chưa đúng | Bắt buộc chạy verify-pr.sh trước khi tuyên bố hoàn thành |
| Quản lý state (State management) | Task dài bị mất context | Ghi vào comment Issue / comment PR / worklog trong tasks.md |
| Vòng lặp chẩn đoán (Diagnostic loop) | Lỗi lặp lại | Cập nhật artifact / script / instruction, không chỉ retry |
| Tích hợp công cụ (Tool/MCP integration) | MCP GitHub lỗi trong **runtime** (tạo Issue, PR, review...) | DỪNG tác vụ → báo cáo lỗi cụ thể → hỏi người dùng xin phép dùng `gh` CLI thay thế → chỉ tiến hành nếu được đồng ý → nhắc fix MCP sau. CẤM fallback âm thầm (xem mục 1.5). |
| Tích hợp công cụ (Tool/MCP integration) | Cần thiết lập Labels / Project IDs / .env | Chạy `scripts/setup-github.sh` — script này dùng `gh` CLI hợp lệ vì là tác vụ setup một lần (xem mục 1.5). |

**Quy tắc vàng:** Mỗi lần sửa lỗi AI phải để lại một cải tiến lâu dài trong repo.
Không để AI tiêu tốn context để tự khám phá lại những quy ước đã biết.

---

# 10. Checklist khởi tạo dự án

Thực hiện theo thứ tự. Mọi AI Agent khi khởi tạo dự án mới PHẢI hoàn thành checklist này.

Ký hiệu phân vai: **[AI]** AI tự làm · **[AI→duyệt]** AI làm, người phê duyệt · **[Người]** con người tự làm (HITL) · **[Script-gh]** script dùng gh CLI — được phép vì là setup một lần.

### Bước 1 — Nền tảng (Foundation)
```
[AI]          □ Chạy init-project.sh: khởi tạo cấu trúc thư mục, copy template,
                  git init, commit khởi tạo
[AI]          □ Viết AGENTS.md (dùng template section 4.3)
[AI]          □ Scaffold constitution.md (kế thừa từ template này) + điền marker 【ĐIỀN】 đã biết
[AI]          □ Setup pipeline trong .github/workflows/ với stage tối thiểu (lint + test + build)

[Người]       □ Tạo repository trên GitHub (thủ công hoặc qua MCP GitHub — xem mục 1.5)
[Người]       □ git remote add origin + git push -u origin main

[Script-gh]   □ Chạy scripts/setup-github.sh — thiết lập GitHub một lần:
                  • 9 Labels (spec, task, bug, qc, ready, in-progress, in-review, planned, needs-fix)
                  • GitHub Project v2 IDs & Column Option IDs (Status field)
                  • File mcp-server/.env (GITHUB_TOKEN, PROJECT_ID, COL_* ...)
                  • GitHub Actions Variables (PROJECT_NUMBER, STATUS_FIELD_ID, COL_*)
                  (Script này dùng gh CLI — hợp lệ theo mục 1.5 vì là setup một lần)

[Người]       □ Cấu hình branch protection trên main:
                  Require PR (1 approval) + status check: quality-gate + no bypass
[Người]       □ Setup quản lý secret — không hardcode bất kỳ credential nào

[Dev/Script]  □ Khởi động MCP server (sau khi mcp-server/.env đã có):
                  cd mcp-server && docker compose --env-file .env up -d --build
```
> 💡 Sau bước setup, mọi tác vụ runtime (Issue, PR, review, merge) **phải qua MCP GitHub**.
> Nếu MCP lỗi trong runtime → xem mục 1.5 (hỏi người dùng trước khi dùng gh).

### Bước 2 — Kiến trúc (Architecture)
```
[AI→duyệt]  □ Tạo docs/architecture/architecture.md (Mermaid diagram) — Tech Lead duyệt
[AI→duyệt]  □ Tạo docs/architecture/architecture.drawio (draw.io source) — Tech Lead duyệt
[AI→duyệt]  □ Ghi ADR đầu tiên: quyết định về tech stack trong /decisions — Tech Lead chốt
[AI]        □ Khai báo rõ các môi trường (theo mục 2.2)
[Người]     □ Setup quản lý secret (không hardcode bất kỳ credential nào)
```

### Bước 3 — Setup feature đầu tiên
```
[AI→duyệt]  □ Tạo Git Platform Issue (qua MCP GitHub) + đề xuất risk label
[AI]        □ Tạo specs/001-feature-name/ theo cấu trúc chuẩn (skeleton)
[AI→duyệt]  □ Draft spec.md → PO/BO chỉnh & approve
[AI→duyệt]  □ Draft layout → BO approve → UI/UX final → BO approve (nếu có UI)
[AI→duyệt]  □ Tạo plan.md + tasks.md → Tech Lead review & approve
[Người]     □ Tech Lead chốt risk level (AI chỉ đề xuất)
[AI]        □ Tạo branch feature/001-feature-name (git local)
```

### Bước 4 — Kiểm chứng Harness
```
[AI]        □ AI Agent đọc được AGENTS.md và hiểu đúng context
[AI]        □ ./scripts/setup-dev.sh chạy thành công
[AI]        □ ./scripts/run-tests.sh chạy thành công
[AI]        □ ./scripts/verify-pr.sh chạy thành công
[AI]        □ CI Pipeline trigger và pass trên PR test
[AI→duyệt]  □ Kênh notification đã kết nối với Git Platform — người xác nhận
```

---

# 11. Quy tắc tuyệt đối (Absolute Rules)

Các quy tắc này KHÔNG CÓ ngoại lệ:

```
✗ Không hardcode secret, key, password, token vào mã nguồn
✗ Không merge code do AI sinh khi chưa review
✗ Không deploy production thủ công
✗ Không tái sử dụng credential giữa các môi trường
✗ Không dùng dữ liệu production trong dev/test
✗ Không để tích hợp bên ngoài làm crash toàn hệ thống
✗ Không commit architecture.md mà không commit architecture.drawio cùng lúc
✗ Không để AI Agent tự approve, tự merge, tự release
✗ Không lấy chat/email/cuộc họp làm nguồn sự thật chính thức
✗ Không để lỗi lặp lại mà không cập nhật artifact/instruction
✗ Không phản hồi/viết tài liệu sai ngôn ngữ quy định (theo mục 0)
✗ [Runtime] Không tự dùng gh CLI cho tác vụ Issue/PR/review/merge/sync khi chưa hỏi người dùng — phải thử MCP GitHub trước, nếu lỗi thì hỏi xin phép (theo mục 1.5)
✗ [Runtime] Không tự fallback âm thầm sang gh/script khi MCP GitHub lỗi — phải DỪNG, báo lỗi, hỏi người dùng (theo mục 1.5 & Section 9)
✓ [Setup]   scripts/setup-github.sh được phép dùng gh CLI — đây là tác vụ khởi tạo một lần, không phải runtime (theo mục 1.5)
```

---

# 12. Quản trị (Governance)

Bản constitution này thay thế (supersede) mọi quy ước và thông lệ phát triển khác trong dự án.

## Tra cứu nhanh (Quick Reference)

| Cần làm gì | Đọc file nào |
|---|---|
| Bắt đầu một task code | `AGENTS.md` + `specs/NNN/spec.md` + `specs/NNN/plan.md` + `specs/NNN/tasks.md` |
| Thiết kế kiến trúc | `docs/architecture/architecture.md` + `/decisions` |
| Tạo spec mới | Template trong `specs/` — xem section 5.2 |
| Review PR | `AGENTS.md` → Quy tắc Coding + checklist PR section 5.3 |
| Debug lỗi AI | Harness Engineering section 9 |
| Sau sự cố | Cập nhật `/knowledge` + `/postmortems` |
| Ngoại lệ về quy tắc | Phải được ghi lại + có lý do + được approve + truy vết được |

## Sửa đổi (Amendments)

Mọi sửa đổi PHẢI:
1. Được ghi lại kèm lý do giải thích vì sao cần thay đổi.
2. Được nhóm phê duyệt trước khi có hiệu lực.
3. Tăng số phiên bản theo semantic versioning:
   - **MAJOR**: Thay đổi quản trị không tương thích ngược, loại bỏ hoặc định nghĩa lại nguyên tắc.
   - **MINOR**: Thêm nguyên tắc/section mới, hoặc mở rộng hướng dẫn đáng kể.
   - **PATCH**: Làm rõ, sửa câu chữ, hoặc tinh chỉnh không đổi ngữ nghĩa.
4. Kích hoạt rà soát tính nhất quán của mọi template phụ thuộc trong `specs/`.

Việc tuân thủ được thực thi tại mỗi lần review PR và tại Constitution Check gate được định nghĩa trong
`specs/NNN/plan.md`.

Mọi ngoại lệ với các quy tắc trong tài liệu này phải: được ghi lại, có lý do rõ ràng,
được Tech Lead approve (và PO/BO nếu liên quan đến scope), và truy vết được trên Git Platform.

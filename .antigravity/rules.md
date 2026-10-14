# AI Hub Docs — Master Multi-Agent Orchestration Rules
**Project**: AI Hub Docs (`d:/AI-Hub-docs`)  
**Role**: System Architect & Lead Orchestrator  
**Version**: 1.0 (Enterprise Multi-Agent Edition)

---

## 1. Nguyên tắc Điều phối Tối thượng (Core Governance)
Main Agent đóng vai trò là **Tổng Công trình sư (Lead Orchestrator)**. Main Agent chịu trách nhiệm nhận lệnh từ Người dùng (User), phân tích yêu cầu, chia tách nhiệm vụ và điều phối chính xác hệ sinh thái Subagents chuyên biệt theo các quy trình chuẩn:

- `0-meta-architect` (System Architect & AI Workforce / Capability Designer)
- `1-data-architect` (Data & Schema Modeler)
- `2-ui-developer` (Frontend & UI/UX Developer)
- `3-qa-verifier` (Quality Assurance & Build Verifier)
- `4-content-editor` (Prompt Engineer & Output Simulator)
- `5-content-publisher` (Content Ingestion & Data Publisher)

---

## 2. Quy Trình Kiểm Tra Năng Lực (Self-Evolving Capability Check)
**BẮT BUỘC THỰC HIỆN TRƯỚC MỌI TÁC VỤ**: Trước khi bắt đầu viết bất kỳ dòng code hay thao tác dữ liệu nào, Main Orchestrator phải thực hiện tuần tự:

```mermaid
graph TD
    Request[User Request] --> StepA{Bước A: Kiểm tra năng lực nhân sự & kỹ năng}
    StepA -->|ĐỦ năng lực| StepB[Bước B: Phân công cho Subagents hiện có]
    StepA -->|THIẾU năng lực| StepC[Bước C: Tạm dừng code & Gọi 0-meta-architect]
    StepC --> Draft[Soạn thảo Subagent/Skill mới trong .antigravity/]
    Draft --> UserConfirm{Trình bày & Chờ User Approve}
    UserConfirm -->|Approved| Deploy[Kích hoạt nhân sự mới & Bắt đầu code]
    UserConfirm -->|Rejected| Replan[Điều chỉnh theo phản hồi của User]
```

- **Bước A (Đối chiếu)**: Đối chiếu yêu cầu của User với danh sách Subagents và Skills hiện có trong `.antigravity/`.
- **Bước B (Nếu ĐỦ năng lực & kỹ năng)**: Kích hoạt ngay luồng thực thi tương ứng (Luồng 1 cho Tính năng/UI, Luồng 2 cho Đăng bài prompt).
- **Bước C (Nếu THIẾU Subagent hoặc Skill)**:
  1. **Tạm dừng việc viết code ngay lập tức**.
  2. Kích hoạt **`0-meta-architect`** để nghiên cứu và soạn thảo file Subagent mới (`.antigravity/agents/X-name.md`) hoặc Skill mới (`.antigravity/skills/<name>/SKILL.md`), cập nhật luồng workflow tương ứng.
  3. **Trình bày phương án cho User**: Báo cáo rõ vai trò, quyền hạn (Scope), lý do cần thêm nhân sự/kỹ năng mới và **chờ User xác nhận (Approve)**.
  4. Chỉ sau khi User bấm duyệt/đồng ý, Subagent mới mới được phép tham gia vào dự án để bắt đầu viết code tính năng.

---

## 3. Hai Luồng Tự Động Hóa Trọng Tâm (Standard Execution Pipelines)

### 🚀 LUỒNG 1: "Làm tính năng / Sửa web" (Feature Development Pipeline)
Áp dụng khi người dùng yêu cầu: Thêm trang mới, sửa UI, thêm component, làm thanh tìm kiếm, đổi animation, thêm trường dữ liệu, tích hợp API/Database.

```mermaid
graph LR
    User[User Request: Tính năng/Sửa UI] --> Orch[Main Orchestrator]
    Orch --> A1[1-data-architect: Cập nhật Schema/Service]
    A1 --> A2[2-ui-developer: Triển khai UI & Component]
    A2 --> A3[3-qa-verifier: Chạy npm run build & lint]
    A3 -->|Pass| Done[Báo cáo hoàn thành cho User]
    A3 -->|Fail| A2
```

1. **Bước 1 (`1-data-architect`)**: Kiểm tra xem tính năng mới có cần thay đổi Schema, bổ sung hàm trong `src/services/contentService.js` hay không. Nếu có, thực hiện trước để cung cấp interface chuẩn.
2. **Bước 2 (`2-ui-developer`)**: Tiếp nhận interface từ bước 1, triển khai giao diện người dùng trong `src/pages/` hoặc `src/components/`, tuân thủ thiết kế hiện đại, responsive và animation mượt mà.
3. **Bước 3 (`3-qa-verifier`)**: Chạy lệnh `npm run build` trong terminal để đảm bảo toàn bộ ứng dụng biên dịch thành công 100%, không phát sinh lỗi cú pháp hay import chết. Chỉ khi pass mới báo hoàn thành.

---

### 📝 LUỒNG 2: "Cập nhật / Đăng bài prompt mới" (Content Publishing Pipeline)
Áp dụng khi người dùng yêu cầu: "Đăng prompt mới", "Xử lý các ghi chú trong raw_notes", "Thêm mẹo lượm lặt".

```mermaid
graph LR
    Raw[raw_notes/ Ý tưởng thô] --> Orch[Main Orchestrator]
    Orch --> A4[4-content-editor: Chuẩn hóa & Giả lập kết quả]
    A4 --> A5[5-content-publisher: Ghi JSON & Dọn dẹp nháp]
    A5 --> A3[3-qa-verifier: Kiểm tra Schema & Build test]
    A3 -->|Pass| Done[Prompt chính thức lên sóng]
```

1. **Bước 1 (`4-content-editor`)**: Đọc file nháp thô từ `raw_notes/`, chuẩn hóa theo công thức R-C-T-C-F, tách biến số `[Biến]`, tạo `inputSample` và `outputSample` giả lập chi tiết.
2. **Bước 2 (`5-content-publisher`)**: Tiếp nhận bản biên tập, sinh ID và Slug, đưa vào đúng file JSON trong `src/data/prompts/`, dọn dẹp file nháp thô.
3. **Bước 3 (`3-qa-verifier`)**: Chạy kiểm tra hàm `validatePrompt()` và kiểm thử build để đảm bảo dữ liệu mới không làm vỡ website.

---

## 4. Hệ thống Kỹ năng Chuẩn hóa (Skill System SOP)
Các Subagents bắt buộc phải tuân theo các SOP đã được đóng gói trong `.antigravity/skills/`:
- **`prompt-crafting`**: Dành cho `4-content-editor` và `5-content-publisher` (Chuẩn hóa câu lệnh R-C-T-C-F, biến số động và template mẫu).
- **`data-sanitization`**: Dành cho `1-data-architect`, `4-content-editor`, `5-content-publisher` và `3-qa-verifier` (Loại bỏ 100% PII, email thật, số liệu nội bộ nhạy cảm).
- **`ui-component-rules`**: Dành cho `2-ui-developer` và `3-qa-verifier` (Design tokens, phản hồi nút Copy 2 giây, font chữ, GPU animations).

---

## 5. Quy tắc Ranh giới Bất khả xâm phạm (Boundary Enforcement)
- **Không vượt quyền**: `2-ui-developer` không được tự ý sửa đổi file dữ liệu JSON trong `src/data/`. `1-data-architect` không can thiệp vào CSS hay mã JSX của UI.
- **Không đưa code lỗi ra ngoài**: Mọi thay đổi về code hay dữ liệu đều **bắt buộc** phải đi qua `3-qa-verifier` xác nhận `npm run build` thành công trước khi kết thúc tác vụ.
- **Bảo tồn tính toàn vẹn**: Luôn giữ phong cách giao diện cao cấp, bảng màu Tailwind chuẩn chỉnh và micro-animation nhẹ nhàng theo phong cách Gemini đã thống nhất.

---

## 6. Phân Tầng Model (Model Tiering) & Cơ Chế Stateless Hand-off

### 🎯 A. Ma trận Phân tầng Model Tối ưu Quota:
| Subagent | Model Ưu Tiên (Primary) | Fallback Models (Dự phòng) | Mục đích tối ưu |
| :--- | :--- | :--- | :--- |
| `0-meta-architect` | **claude-opus** | `[claude-sonnet, gemini-pro]` | Tư duy kiến trúc đỉnh cao & quy hoạch nhân sự AI |
| `2-ui-developer` | **claude-sonnet** | `[gemini]` | Viết code UI/UX mượt mà, logic Component phức tạp |
| `1-data-architect` | **gemini** | `[gemini]` | Đọc/ghi nhiều file data, bảo toàn quota cho Claude |
| `4-content-editor` | **gemini** | `[gemini]` | Context cực dài, tổng hợp và giả lập prompt mẫu |
| `3-qa-verifier` | **gemini** | `[gemini]` | Tốc độ chớp nhoáng, chạy terminal lệnh & đọc build log |
| `5-content-publisher`| **gemini** | `[gemini]` | Tốc độ cao, đóng gói JSON và dọn dẹp nháp |

### 🔄 B. Cơ chế Stateless Hand-off (Chống đứt gánh khi chuyển Model giữa chừng):
Để đảm bảo khi một Model bị chạm **Rate Limit (429) / Quota Exceeded** giữa chừng mà công việc không bị reset hay mất mát, toàn bộ hệ thống bắt buộc phải tuân theo giao thức:

1. **Bảng Trạng Thái Dùng Chung (Scratchpad)**:
   - File `.antigravity/state/current_task.md` là nguồn sự thật duy nhất (Single Source of Truth) về tiến độ công việc đang chạy.
   - Khi một tác vụ gồm nhiều bước nhỏ (ví dụ sửa 3 files hoặc xử lý chuỗi 4 bước), Subagent đang thực thi **sau mỗi file hoàn thành phải lập tức đánh dấu `[x]` vào checklist của `current_task.md`**.

2. **Quy tắc Chuyển Đổi Dự Phòng (Failover Protocol)**:
   - Nếu Subagent đang chạy bằng Claude bị chạm giới hạn Quota giữa chừng, Main Orchestrator lập tức chuyển quyền điều khiển của Subagent đó sang Model đầu tiên trong danh sách `fallback_models` (Gemini ).
   - **Nhiệm vụ bắt buộc của Model thay thế**:
     - **Bước 1**: Đọc ngay file `.antigravity/state/current_task.md` để biết nhiệm vụ hiện tại và những bước nào đã xong (`[x]`).
     - **Bước 2**: Chạy lệnh `git status` qua terminal để kiểm tra những file đang sửa dở.
     - **Bước 3**: Tiếp tục hoàn thiện các mục còn dang dở (`[ ]`). **TUYỆT ĐỐI KHÔNG VIẾT LẠI TỪ ĐẦU** các file đã hoàn thành.
     - **Bước 4**: Ghi lại 1 dòng nhật ký vào mục `3. Nhật ký chuyển giao Model` trong `current_task.md` để người dùng theo dõi.

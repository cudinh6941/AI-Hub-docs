---
id: FEAT-006
title: "PTSC Data Platform Explorer — Cẩm nang Kiến trúc & Quản trị Dữ liệu Tập trung"
status: shipped # idea | spec-ready | in-progress | shipped
priority: high # high | medium | low
target_agents:
  - 6-product-psychologist
  - 1-data-architect
  - 2-ui-developer
  - 3-qa-verifier
created: 2026-11-05
tags:
  - feature
  - spec
  - data-platform
  - editorial-ux
---

# [FEAT-006] PTSC Data Platform Explorer — Cẩm nang Kiến trúc & Quản trị Dữ liệu Tập trung

> **Tóm tắt giá trị**: Chuyển hóa bộ tài liệu kỹ thuật phức tạp của dự án PTSC Data Platform thành cẩm nang tra cứu tương tác và trình bày cuộc họp Ban Giám đốc theo phong cách biên tập tinh gọn (`Refined Editorial`), giúp lãnh đạo và chuyên viên nắm bắt bức tranh toàn cảnh từ Tổng công ty đến đơn vị thành viên (PTSC Quảng Ngãi · Level 3) chỉ trong vài phút.  
> **Trạng thái**: `shipped` | **Độ ưu tiên**: `high` | **Ngày tạo**: `2026-11-05`

---

## 1. Chiến lược Hành vi & Trải nghiệm (`6-product-psychologist`)
*Phụ trách: `6-product-psychologist` (Tier 1: Claude Opus / Skill: `behavioral-product-design` & `ui-component-rules`)*

### 1.1. Nỗi đau & Điểm chạm nhận diện (Quiet Recognition)
- **Thực trạng thao tác lặp lại (Before)**:
  - Toàn hệ thống đang duy trì **310+ báo cáo định kỳ và đột xuất** tổng hợp thủ công bằng Excel, tiêu tốn **109.184 giờ công/năm** (tương đương **~62 nhân sự toàn thời gian - FTE** chỉ để gõ lại, đối chiếu và hợp nhất số liệu).
  - Tồn tại **29 danh mục dữ liệu dùng chung (Master Data)** chưa đồng nhất mã định danh giữa các phòng ban và đơn vị thành viên, dẫn đến tình trạng cùng một dự án, khách hàng hoặc nhà cung cấp nhưng mỗi báo cáo hiển thị một con số khác nhau.
- **Trạng thái chuẩn hóa (After — Single Source of Truth)**:
  - Thiết lập một **Nguồn dữ liệu chuẩn duy nhất (SSOT)** trên nền tảng Hybrid Data Platform: nhập liệu một lần tại hệ thống nguồn, kiểm duyệt chủ động tại vùng đệm đơn vị (Landing Zone) và tự động kết xuất báo cáo điều hành.
- **Tâm lý tiếp nhận của người đọc**:
  - Nhân sự tại đơn vị thành viên (như PTSC Quảng Ngãi) thường lo ngại việc tập trung dữ liệu sẽ làm mất quyền kiểm soát số liệu nội bộ hoặc phát sinh thêm việc nhập liệu. Giao diện phải giải tỏa ngay nỗi lo này bằng cơ chế minh bạch **5 cam kết chủ quyền dữ liệu (Approve / Reject tại Landing Zone)**.

### 1.2. Kiến trúc Trải nghiệm Kép (Dual-Mode UX) & Công tắc Góc nhìn (Perspective Switcher)
1. **Hai chế độ sử dụng tự nhiên (Dual-Mode UX)**:
   - **Chế độ Tự đọc hiểu (`Explore Mode` — Mặc định)**: Bố cục biên tập 2 cột (`lg:col-span-3` mục lục sticky bên trái, `lg:col-span-9` nội dung chuyên sâu bên phải), cho phép tra cứu toàn bộ 6 chương, mở rộng chi tiết từng lớp kiến trúc, từng miền dữ liệu (MDM Domain) và câu hỏi thường gặp.
   - **Chế độ Trình bày cuộc họp (`Briefing Mode` — Dành cho họp Ban Giám đốc)**: Tinh giản giao diện về dạng tiêu điểm từng chương với cỡ chữ lớn, ẩn các bảng phụ trợ dày đặc, hỗ trợ chuyển chương nhanh bằng nút điều hướng hoặc phím mũi tên trái/phải để chiếu trực tiếp trong phòng họp mà không cần soạn lại slide PowerPoint.
2. **Công tắc Góc nhìn (`Perspective Switcher`)**:
   - Cho phép chuyển đổi tức thì giữa 2 lăng kính:
     - `Toàn Tổng công ty PTSC` (Góc nhìn chiến lược vĩ mô, 20+ đơn vị, kiến trúc tổng thể).
     - `Đơn vị: PTSC Quảng Ngãi · Level 3` (Làm nổi bật ngay trách nhiệm, phạm vi kết nối bán tự động qua Landing Zone, các hệ thống nguồn tại PTSC QNg và 5 việc cần chuẩn bị ngay của đơn vị).

### 1.3. Tuân thủ 100% Chuẩn Thiết kế Editorial (`FEAT-005`)
- **Bảng màu & Chất liệu giấy**:
  - Nền chính: `bg-paper` (`#FBFAF7`), nền vùng phụ/khối tra cứu: `bg-paper-sunken` (`#F3F1EA`), đường kẻ phân cách: `border-line` (`#E7E3DA`).
  - Chữ tiêu đề: `text-ink` (`#1C1B19`), chữ nội dung: `text-body` (`#4A4741`), chữ ghi chú/nhãn: `text-muted` (`#7A756B`).
  - Màu nhấn duy nhất: `accent` (`#C2410C`, hover `#9A3412`, nền nhạt `#FFF1E8`). Trạng thái thành công (Copy / Approve): `emerald-*`.
- **Typography**:
  - Tiêu đề chương và điểm nhấn số liệu dùng `font-display` (`Newsreader` serif).
  - Nội dung giải thích và bảng biểu dùng `font-sans` (`Inter`).
  - Mã định danh (`P1–P7`, `D1–D8`), thông số kỹ thuật, luồng tích hợp dùng `font-mono` (`JetBrains Mono`).
- **Kỷ luật Chống Đóng Hộp & Anti-AI-Slop**:
  - Tối đa **1 lớp khung viền** cho mỗi vùng nội dung. Chia tách các phần bằng khoảng trắng và đường kẻ ngang `border-t border-line`.
  - Không hiệu ứng tự chạy (carousel/shimmer), không `hover:scale`, không emoji trang trí, không dấu chấm than (`!`), không từ ngữ phóng đại.

### 1.4. Cấu trúc 6 Chương Nội dung & Ngôn ngữ Chuẩn Mực (Copywriting)
- **Header & North Star**:
  - Nhãn định vị: `Kiến trúc Dữ liệu & Quản trị Tập trung · PTSC Data Platform`
  - Headline: `Một nguồn dữ liệu chuẩn cho toàn hệ thống điều hành.`
  - Subhead: `Chuyển đổi từ 310+ báo cáo tổng hợp thủ công sang nền tảng dữ liệu hợp nhất — giữ nguyên quyền kiểm duyệt của từng đơn vị thành viên.`
- **6 Chương cốt lõi**:
  - **Chương `01` — Bài toán & Giá trị cốt lõi**: Đối chiếu trực diện mô hình phân tán hiện tại (`310+` báo cáo, `109.184` giờ/năm ~ `62 FTE`, `29` danh mục Master Data lệch chuẩn) với mô hình Nguồn dữ liệu chuẩn duy nhất (SSOT) bằng cặp tương phản `Before / After`.
  - **Chương `02` — Kiến trúc Hybrid Data Platform 4 Lớp tương tác**: Cho phép bấm chọn từng lớp để xem vai trò, công nghệ và luồng dữ liệu:
    1. `Lớp 01 · Nguồn & Thu thập (Source & Ingestion — On-Prem / Cloud)`
    2. `Lớp 02 · Lưu trữ & Xử lý (Lakehouse Medallion: Bronze → Silver → Gold)`
    3. `Lớp 03 · Quản trị & Dữ liệu chủ (MDM, Data Catalog, Data Quality & Security)`
    4. `Lớp 04 · Khai thác & Phân tích (BI Dashboard, Self-Service Analytics & AI Ready)`
  - **Chương `03` — Định vị PTSC Quảng Ngãi (Level 3) & Chủ quyền dữ liệu**:
    - Ma trận phân nhóm tích hợp các đơn vị thành viên (Level 1 đến Level 4), định vị rõ **PTSC Quảng Ngãi ở Level 3 (Bán tự động có kiểm soát)**.
    - Sơ đồ luồng **Landing Zone (Staging Area)** với cơ chế **5 Cam kết Chủ quyền Dữ liệu**: Đơn vị tự rà soát, bấm `Approve` mới đẩy lên kho tập trung của Tổng công ty, hoặc `Reject` để chỉnh sửa nội bộ; dữ liệu nhạy cảm được phân quyền theo ma trận RLS/CLS.
  - **Chương `04` — Chuẩn hóa 9 Domain MDM & Chuỗi dự án PPDM (Dual-Code)**:
    - Trình bày 9 miền dữ liệu chủ (Master Data Domains: Khách hàng, Nhà cung cấp, Dự án, Hợp đồng, Vật tư thiết bị, Nhân sự, Tổ chức, Tài chính - Kế toán, Tài sản).
    - Cơ chế **Dual-Code (Ánh xạ Mã Kép)** xuyên suốt vòng đời dự án theo chuẩn PPDM: kết nối liền mạch **7 giai đoạn phát triển cơ hội thương mại (`P1–P7`)** với **8 giai đoạn triển khai thực hiện dự án (`D1–D8`)**, xóa bỏ đứtãy thông tin giữa khối Thương mại, Kỹ thuật và Tài chính.
  - **Chương `05` — Quản trị 5 Cấp, Lộ trình triển khai & Blueprint hành động**:
    - Tháp quản trị dữ liệu 5 cấp (Hội đồng Quản trị Dữ liệu ➔ Ban Chỉ đạo ➔ Data Governance Office ➔ Data Owner / Data Steward tại đơn vị ➔ Data Custodian / Kỹ thuật).
    - Lộ trình triển khai theo giai đoạn và **Hộp Blueprint Sao chép nhanh: "5 việc PTSC Quảng Ngãi cần thực hiện ngay"** (kèm nút `Sao chép kế hoạch hành động` có phản hồi 2 giây chuẩn `ui-component-rules`).
  - **Chương `06` — Giải đáp thắc mắc điều hành (Executive FAQ) & Từ điển thuật ngữ**:
    - Giải đáp trực diện các câu hỏi thực tế của lãnh đạo và chuyên viên (bảo mật, khối lượng công việc, trách nhiệm khi số liệu sai, lộ trình thay thế Excel).
    - Bảng tra cứu nhanh các thuật ngữ cốt lõi (`SSOT`, `MDM`, `PPDM`, `Landing Zone`, `Lakehouse`, `Data Steward`) bằng ngôn ngữ nghiệp vụ dễ hiểu.

---

## 2. Thiết kế Dữ liệu & Service (`1-data-architect`)
*Phụ trách: `1-data-architect` (Tier 1: Claude Sonnet / Fallback Gemini Pro)*

### Mô hình dữ liệu & Schema (`src/data/dataPlatform.json`):
- [x] Xây dựng tệp dữ liệu chuẩn hóa `src/data/dataPlatform.json` chứa toàn bộ nội dung cấu trúc của 6 chương:
  - `meta`: Tiêu đề, phụ đề, ngày cập nhật, thông tin chế độ góc nhìn (`perspectives`: `corp` vs `qng`).
  - `chapters`: Danh sách 6 chương (`01` đến `06`) với định danh, tiêu đề ngắn, tóm tắt điều hành (`executiveSummary`), và ghi chú riêng cho góc nhìn PTSC Quảng Ngãi (`qngHighlight`).
  - `painPointsAndMetrics`: Số liệu `310+` báo cáo, `109.184` giờ/năm, `~62 FTE`, `29` danh mục Master Data, cùng bảng đối chiếu `beforeAfter`.
  - `architectureLayers`: 4 lớp kiến trúc Hybrid Data Platform kèm thông số đầu vào, xử lý, đầu ra và vai trò của đơn vị Level 3.
  - `integrationLevels` & `sovereigntyCommitments`: Bảng phân cấp Level 1–4, chi tiết cơ chế Landing Zone (`Approve` / `Reject`) và 5 cam kết chủ quyền dữ liệu cho PTSC Quảng Ngãi.
  - `mdmDomains` & `ppdmLifecycle`: 9 Domain MDM và chuỗi Dual-Code `P1–P7` (Giai đoạn cơ hội/đấu thầu) liên thông `D1–D8` (Giai đoạn thực hiện/quyết toán).
  - `governanceLevels`, `roadmap` & `actionBlueprint`: Mô hình 5 cấp quản trị, các pha lộ trình và nội dung văn bản mẫu `qngActionChecklist` (5 việc cần làm ngay) để sao chép một chạm.
  - `faqs` & `glossary`: Danh sách câu hỏi thường gặp theo nhóm vai trò và từ điển thuật ngữ ngắn gọn.
- [x] Tuân thủ tuyệt đối `data-sanitization`: không chứa thông tin cá nhân (PII), email nội bộ hay số liệu tài chính mật chưa công bố.

### Service Layer (`src/services/contentService.js`):
- [x] Bổ sung hàm async `getDataPlatformData()` trong `src/services/contentService.js` trả về toàn bộ cấu trúc dữ liệu từ `src/data/dataPlatform.json`.
- [x] Đảm bảo tương thích ngược 100% với các hàm hiện hữu trong `contentService.js`.

---

## 3. Thiết kế Giao diện & UI/UX (`2-ui-developer`)
*Phụ trách: `2-ui-developer` (Tier 1: Claude Sonnet / Fallback Gemini Flash)*

### Components & Layout:
- [x] Tạo trang mới `src/pages/DataPlatformPage.jsx` định tuyến tại `/data-platform`:
  - Thanh điều khiển neo gọn phía trên (Sticky Control Bar): Chuyển đổi **Góc nhìn (`Toàn Tổng công ty PTSC` / `Đơn vị: PTSC Quảng Ngãi · Level 3`)** và **Chế độ xem (`Tự đọc hiểu · Explore` / `Trình bày họp · Briefing`)**, kèm ô lọc nhanh thuật ngữ/nội dung.
  - Bố cục biên tập 2 cột ở chế độ Explore (`lg:grid-cols-12`: cột trái `lg:col-span-3` hiển thị mục lục 6 chương `01–06` có chỉ báo chương đang đọc; cột phải `lg:col-span-9` hiển thị nội dung từng chương ngăn cách bằng `border-t border-line`).
  - Ở chế độ Briefing: Hiển thị tập trung từng chương kèm thanh chuyển chương (`Chương trước` / `Chương tiếp theo`, hỗ trợ phím `ArrowLeft` / `ArrowRight`) và điểm nhấn tóm tắt cho lãnh đạo.
  - Tương tác chọn lớp kiến trúc (Chương 02), chuyển đổi luồng `P1–P7` / `D1–D8` và bảng 9 Domain MDM (Chương 04), mô phỏng bước kiểm duyệt `Approve / Reject` tại Landing Zone (Chương 03), và nút `Sao chép 5 việc cần làm ngay` có phản hồi trạng thái 2 giây (Chương 05).
- [x] Cập nhật `src/App.jsx`: Khai báo route `/data-platform` trỏ tới `DataPlatformPage`.
- [x] Cập nhật `src/components/Navbar.jsx` và `src/components/AppLayout.jsx`: Bổ sung mục điều hướng `Data Platform` (`/data-platform`) đồng bộ trên cả Desktop, Mobile menu và Footer.
- [x] Xử lý đầy đủ 3 trạng thái `loading`, `empty`, `error` và chỉ gọi dữ liệu thông qua `getDataPlatformData()` / hook `useContent()`.

### Tương tác & Responsive:
- [x] Chỉ sử dụng animation `transform` và `opacity` nhẹ nhàng, tôn trọng `prefers-reduced-motion`.
- [x] Nút Copy Blueprint phản hồi đúng 2 trạng thái (`Sao chép kế hoạch` ➔ `Đã sao chép` giữ 2000ms).
- [x] Hiển thị chuẩn xác trên Mobile, Tablet và màn hình chiếu phòng họp (Desktop lớn).

---

## 4. Tiêu chí Nghiệm thu & Build (`3-qa-verifier`)
*Phụ trách: `3-qa-verifier` (Tier 2: Gemini Flash / Fallback Claude Haiku)*

### Acceptance Criteria Checklist:
- [x] Kiểm tra `src/pages/DataPlatformPage.jsx` không import trực tiếp file JSON, 100% truy xuất qua `src/services/contentService.js`.
- [x] Kiểm tra ngôn ngữ và giao diện tuân thủ `behavioral-product-design` & `FEAT-005`: 0 emoji trang trí, 0 dấu chấm than (`!`), 0 từ ngữ blacklist, sử dụng đúng bảng màu giấy ấm (`paper`, `ink`, `accent #C2410C`).
- [x] Chạy lệnh `npm run build` hoàn thành với `exit code 0`.
- [x] Chạy lệnh `npm run agy:qa` hoàn thành với `exit code 0`.
- [x] Đối chiếu `git diff --stat` xác nhận đúng phạm vi file của từng Phase.

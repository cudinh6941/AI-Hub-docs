# BẢN ĐÚC KẾT CHUẨN XÁC KIẾN TRÚC NỀN TẢNG DỮ LIỆU PTSC (PTSC DATA PLATFORM)

> **Cập nhật theo chuẩn đối chiếu 6 tài liệu gốc (2026-11-05)**:
> 1. *Báo cáo Phân tích – Đề xuất Kỹ thuật Giải pháp Nền tảng Dữ liệu (2025)*
> 2. *Slide Tóm tắt lựa chọn giải pháp Hybrid Data Platform PTSC (2025)*
> 3. *Slide Hội thảo Data Platform – Phiên Sáng (10/08/2026)*
> 4. *Slide Hội thảo Data Platform – Phiên Chiều (10/08/2026)*
> 5. *Phụ lục Hợp đồng số 02 về Yêu cầu Kỹ thuật Tích hợp Phần mềm (30/10/2026)*
> 6. *Kế hoạch Roll-out PDT27 Combo 1 (Bản nháp soát xét – 04/11/2026)*

---

## 1. Mười Điểm Cốt Lõi Bắt Buộc Nắm Vững (Ground-Truth Architecture)

### Điểm 1 — Hub trung tâm gồm 2 phần (On-Premise Tầng 10 CQTCT + Microsoft Cloud)
Hub không phải là một máy chủ đơn lẻ mà là kiến trúc **Hybrid Data Platform** gồm 2 phần tách biệt rõ vai trò:
- **Phần A — Cụm On-Premise đặt tại Tầng 10, Cơ quan Tổng công ty (Việt Nam)**:
  - **Phần cứng**: Cụm siêu hội tụ phân tách **dHCI 8 Nodes** (*2 Storage Nodes, 2 Processing Nodes, 1 Query+Metadata Node, 1 Governance+API Node, 1 SIEM & Monitoring Node, 1 Workflow+MDM Node*), ảo hóa VMware, dung lượng ban đầu **~40 TB** mở rộng lên **200 TB+**, phục vụ **~70 người dùng thường xuyên** *(Báo cáo kỹ thuật, trang 55–61)*.
  - **Phần mềm lõi**: `MinIO / Apache Iceberg / Parquet`, `Kafka`, `Flink`, `Trino`, `Airflow`, `OpenMetadata`, sao lưu `Veeam Backup` *(Slide Hội thảo Phiên Sáng, trang 14, 18)*. *(Lưu ý: Các công cụ như dbt, Great Expectations, Spark, GraphQL xuất hiện ở dạng hệ sinh thái tham chiếu/ví dụ, không trình bày như danh mục bắt buộc đã khóa cứng).*
  - **Quy tắc lưu trữ 3 bản / 2 bản** *(Báo cáo kỹ thuật, trang 61)*:
    - **Dữ liệu thô (Raw Data) lưu 3 bản trong nước**: (1) DC chính + (2) DR Site + (3) On-Premise Data Platform. **Raw data tuyệt đối không lên Cloud.**
    - **Sản phẩm dữ liệu (Data Product) lưu 2 bản**: (1) Bản gốc tại On-Premise Data Platform + (2) Bản sao đã làm sạch, chuẩn hóa, tổng hợp phục vụ phân tích đồng bộ lên Cloud.
- **Phần B — Microsoft Cloud**:
  - Gồm `Microsoft Fabric`, `OneLake (20 TB)`, `Power BI`, `Microsoft Purview (500 assets)` *(Báo cáo kỹ thuật, trang 51, 58–59)*.
  - Chỉ nhận dữ liệu đã làm sạch, chuẩn hóa và tổng hợp để phục vụ báo cáo phân tích và khai thác.

### Điểm 2 — Phạm vi Giai đoạn 1 vs. Giai đoạn 2
- **Giai đoạn 1**: Triển khai **chỉ tại Cơ quan Tổng công ty (CQTCT ONLY)** — tích hợp 8 hệ thống nguồn tại CQTCT, tự động hóa 20 báo cáo BI, giải quyết một phần trong tổng số **310 báo cáo** hiện trạng toàn Tổng công ty *(Slide Hội thảo Phiên Sáng & Phiên Chiều)*.
- **Giai đoạn 2**: Mở rộng xuống các đơn vị thành viên. *(Lưu ý: Giữa các tài liệu đang có các mốc mục tiêu khác nhau — Slide Hội thảo ghi GĐ1 = 2026–2027, GĐ2 = 2028+; trong khi bản nháp PDT27 kéo lộ trình roll-out đơn vị vào năm 2027. Vì vậy chỉ coi các mốc thời gian là mục tiêu dự kiến, chưa phải cam kết cố định).*

### Điểm 3 — Mô hình Mở rộng Hub – Spoke – Tenant
- **Hub (Tại Tổng công ty)**: Nắm giữ Lakehouse trung tâm, MDM (Golden Record), Governance và SIEM tập trung.
- **Spoke (Mức L4 — dành cho đơn vị lớn đặc thù)**: Nền tảng thu nhỏ đặt tại đơn vị; dữ liệu chuyên ngành/cường độ cao ở lại địa phương, tự đầu tư cụm dHCI và đội ngũ vận hành dài hạn.
- **Tenant (Mức L3 — phân vùng trên Hub)**: Đơn vị có Workspace/Tenant riêng biệt trên Hub của Tổng công ty; chỉ cần cài đặt Agent thu thập hoặc kéo API trực tiếp về Hub, không tốn CAPEX mua cụm máy chủ riêng và không cần đội vận hành hạ tầng Data Platform riêng.

### Điểm 4 — Landing Zone & Cơ chế Kiểm duyệt `Approve / Reject`
- Mỗi đơn vị thành viên có một **Landing Zone riêng** (vùng đệm chứa dữ liệu thô của đơn vị) *(Slide Hội thảo Phiên Sáng, trang 22–24)*.
- **Đơn vị thành viên là Data Owner**: Kiểm tra dữ liệu nguồn và bấm **`Approve`** hoặc **`Reject`** trước khi dữ liệu được phép đi vào vùng chia sẻ/Lakehouse. Tổng công ty là *Platform / Governance Owner*, không tự ý lấy dữ liệu khi đơn vị chưa Approve.
- **Xử lý khi dữ liệu bị `Reject`**:
  - Dữ liệu bị Reject nằm lại tại vùng cách ly (**Quarantine**) trong Landing Zone của đơn vị, **không đi vào vùng chia sẻ, Lakehouse hay MDM**.
  - Trả về cho đơn vị kèm lý do lỗi; thông báo tới con người (**Data Steward + Key User hệ thống nguồn**) để sửa trực tiếp tại hệ thống nguồn rồi nộp lại bản mới.
  - *(Câu hỏi mở cần xác nhận với Đoàn khảo sát TCT: Kênh thông báo tự động cụ thể là gì? Bộ phận kỹ thuật nào nhận cảnh báo? Thời hạn lưu giữ dữ liệu bị reject trong vùng quarantine là bao lâu?)*

### Điểm 5 — Vùng 5 (`Integration & Staging`) là Trục Tích Hợp Bắt Buộc (Trong Kiến Trúc 10 Vùng An Ninh)
Theo *Slide Hội thảo Phiên Sáng (trang 25)*, kiến trúc mạng và bảo mật của nền tảng được chia thành **10 Vùng An Ninh (10 Security Zones)**:
1. **Vùng 1 — Internet Edge**: Cổng kết nối biên Internet.
2. **Vùng 2 — DMZ**: Vùng trung gian phi quân sự hóa.
3. **Vùng 3 — Security**: Tường lửa thế hệ mới (NGFW), SIEM, PKI.
4. **Vùng 4 — Internal / Server Farm**: Nơi đặt cụm Lakehouse (MinIO/Iceberg), Trino, Airflow...
5. **Vùng 5 — Integration & Staging (Trục tích hợp bắt buộc)**: Nơi hội tụ mọi luồng dữ liệu trước khi vào Landing Zone. Gồm **4 thành phần ngang hàng** (ESB không "chứa" các thành phần kia):
   - **ESB (`WSO2`)**: Trao đổi giao dịch request–response, dịch giao thức/định dạng, định tuyến.
   - **API Gateway**: Kiểm soát truy cập API (`OAuth2/OIDC/mTLS`, `Idempotent`, `CorrelationId`).
   - **Kafka**: Luồng sự kiện thời gian thực (Event Streaming).
   - **CDC / ETL (`Airbyte`...)**: Đồng bộ khối lượng lớn từ Database, hỗ trợ backfill/replay và kiểm tra chất lượng dữ liệu.
6. **Vùng 6 — Shared Services**: Dịch vụ dùng chung (IAM / Keycloak SSO / Directory).
7. **Vùng 7 — Storage**: Hạ tầng lưu trữ chuyên dụng (SAN / Object Storage).
8. **Vùng 8 — Management & Operations**: Quản trị hệ thống và giám sát vận hành.
9. **Vùng 9 — Backup & DR**: Sao lưu bất biến và dự phòng thảm họa (`Veeam`).
10. **Vùng 10 — Out-of-band Management**: Quản trị phần cứng độc lập (iLO / iDRAC).

### Điểm 6 — Quản trị Dữ liệu chủ (MDM) & Luồng Trả Xuống (Down-flow 2 Nhánh)
- **MDM (10 chức năng, 9 Domain dữ liệu chủ)**: Đơn vị, Dự án, Khách hàng, Nhà cung cấp, Hợp đồng, Tài sản, Vật tư/Dịch vụ, Nhân sự, Bộ mã dùng chung *(Slide Hội thảo Phiên Chiều, trang 24)*.
- **8 Tiêu chí chất lượng dữ liệu**: *Đầy đủ, Chính xác, Hợp lệ, Toàn vẹn, Kịp thời, Thống nhất, Duy nhất, Truy vết được* *(Slide Hội thảo Phiên Chiều, trang 28)*.
- **Bảng ánh xạ mã 3 tầng**: `Mã nội bộ Đơn vị` ➔ `Mã chuẩn PTSC` ➔ `Mã chung Tập đoàn PVN`.
  - **Quy tắc bắt buộc**: Hiện tại ở đơn vị, **cột Mã chuẩn PTSC và cột Mã chung PVN phải ĐỂ TRỐNG** chờ Tổng công ty ban hành chính thức; đơn vị tuyệt đối không tự đặt mã chuẩn.
- **Luồng dữ liệu trả xuống Đơn vị (Down-flow) có 2 nhánh độc lập**:
  - **Nhánh 1 (Trực tiếp từ MDM)**: Đồng bộ bộ mã chuẩn và `Golden Record` từ MDM trả về cho các hệ thống, không cần chờ qua tầng khai thác BI.
  - **Nhánh 2 (Qua tầng Khai thác)**: Trả về Báo cáo BI, Dashboard điều hành và Sản phẩm dữ liệu (Data Products).
  - *(Lưu ý: Cơ chế ghi ngược `write-back` cụ thể vào từng phần mềm nguồn của đơn vị chưa được tài liệu quy định cứng — sẽ được quyết định ở bước khảo sát và thiết kế tích hợp GĐ2A).*

### Điểm 7 — Định vị chính xác của PTSC Quảng Ngãi
- Trong *Slide Hội thảo Phiên Chiều (trang 51, 56, 58)*: **PTSC Quảng Ngãi thuộc Nhóm 4 (Đơn vị lớn), mức kiến trúc dự kiến là `L3–L4` (CHƯA CHỐT)**.
- Slide ghi rõ: *"Danh sách và mức kiến trúc áp dụng cho từng đơn vị được chốt sau khảo sát Giai đoạn 2A."*
  - **Mức L3 (Tenant riêng trên Hub)**: Là phương án mặc định hợp lý (không tốn CAPEX mua cụm máy chủ riêng, không cần đội vận hành hạ tầng riêng).
  - **Mức L4 (Spoke riêng tại đơn vị)**: Là ngoại lệ có điều kiện, chỉ áp dụng khi thỏa mãn đủ **4 tiêu chí tốt nghiệp**: (1) Khối lượng/tốc độ dữ liệu thô lớn hơn chi phí đẩy về Hub; (2) Nhu cầu phân tích chuyên ngành/realtime cường độ cao; (3) Ràng buộc pháp lý/hợp đồng buộc lưu tại chỗ; (4) Đội ngũ CNTT đơn vị đủ năng lực — và đơn vị chấp nhận tự chi trả đầu tư dHCI cùng đội vận hành dài hạn.
- **Nguyên tắc chi phí (3 nhóm, không có con số tiền cụ thể)**:
  1. Tổng công ty đầu tư Hub trung tâm (ESB, MDM, Lakehouse, bộ tiêu chuẩn) theo Phương án 3.
  2. Đơn vị chi trả **2 trong 7 cấu phần**: (a) Tích hợp các hệ thống phần mềm riêng của đơn vị, và (b) Thiết kế/triển khai dữ liệu của đơn vị.
  3. Chi phí tích hợp cao hay thấp phụ thuộc vào từng phần mềm: phần mềm có sẵn API/File/CDC thì chi phí thấp (chủ yếu cấu hình và ánh xạ mã); phần mềm đóng phải thuê nhà cung cấp mở kết nối thì chi phí cao hơn.

### Điểm 8 — Quản trị Dữ liệu 5 Cấp, Phụ lục Hợp đồng 02 & Kế hoạch Roll-out PDT27
- **Mô hình Quản trị 5 Cấp** *(Slide Hội thảo Phiên Chiều, trang 21–22, 29)*:
  - Trách nhiệm giải trình (*Accountability*) nằm ở **Cấp 3 (Chủ quản dữ liệu)** — theo slide chiều, *Trưởng Ban là cấp phê duyệt ở 10/12 quy trình quản trị dữ liệu được số hóa*.
  - **Cấp 4 (Data Steward)**: Phân công theo **9 Domain dữ liệu chủ**, không phân theo từng phần mềm.
  - **Tuân thủ pháp lý**: Tổ chức DPO 2 cấp, lập hồ sơ đánh giá tác động DPIA, quy trình ứng cứu sự cố trong 72 giờ theo Luật Bảo vệ dữ liệu cá nhân `91/2025/QH15` (hiệu lực 01/01/2026); log kiểm toán từ các đơn vị chảy về SIEM tập trung.
- **Phụ lục Hợp đồng số 02 (30/10/2026)**:
  - Ràng buộc mọi nhà cung cấp phần mềm mới phải tích hợp qua **MỘT ESB chung duy nhất**, hỗ trợ luồng 2 chiều qua ESB/API Gateway/Kafka, CDC + backfill/replay, khóa chính ổn định + ánh xạ MDM, OAuth2/OIDC/mTLS + SSO, bàn giao ERD + Data Dictionary, API idempotent (`correlationId`, `upsert`, `retry`), môi trường DEV/UAT, quy tắc chất lượng + quarantine.
  - **Không có hiệu lực hồi tố** với các phần mềm hiện hữu đã ký trước đây của PTSC Quảng Ngãi (các hệ thống cũ sẽ được tích hợp thông qua dự án Data Platform, không bắt nhà cung cấp cũ viết lại từ đầu).
- **Kế hoạch Roll-out PDT27 (Bản nháp 04/11/2026)**:
  - Đưa ra 2 lựa chọn: **Combo 1** (bộ chuẩn TCT: SAP/HRM/E-Office + DP + ESB/MDM/SSO/Portal) và **Combo 2** (đơn vị giữ hệ thống riêng — ví dụ nêu đích danh **"FAST thay cho SAP"** kết nối qua adapter).
  - Giữ tích hợp 1:1 hiện tại cho mốc go-live nghiệp vụ ngắn hạn, sau đó thực hiện **một lần cắt chuyển (cut-over) có kiểm soát từ 1:1 sang ESB**.

---

## 2. Năm Việc PTSC Quảng Ngãi Cần Làm Ngay Bây Giờ

1. **Rà soát & Phỏng vấn các hệ thống phần mềm hiện hữu**:
   - Thực hiện khảo sát các phần mềm đang sử dụng theo thứ tự ưu tiên làm việc: **`1. ERP FAST` ➔ `2. MESX` ➔ `3. HRM` ➔ `4. Phần mềm Bán hàng` ➔ `5. Phần mềm Cảng` ➔ `6. E-Office`** *(đây là danh sách làm việc ban đầu, chờ bộ phận IT xác nhận đầy đủ để không bỏ sót các hệ thống ngầm / shadow systems)*.
2. **Thu thập danh sách mã & Lập Bảng Ánh xạ Mã 3 Tầng**:
   - Xuất danh mục mã đang dùng thực tế tại đơn vị theo 9 Domain, điền vào cột 1 (`Mã đơn vị`), giữ **TRỐNG** cột 2 (`Mã chuẩn PTSC`) và cột 3 (`Mã chung PVN`) chờ Tổng công ty ban hành.
3. **Kiện toàn nhân sự Quản trị Dữ liệu theo 9 Domain**:
   - Xác định Chủ quản dữ liệu (Cấp 3), cử Data Steward (Cấp 4) theo **9 Domain dữ liệu chủ** (không cử theo phần mềm) và đầu mối DPO cấp đơn vị.
4. **Chuẩn bị phương án đăng ký Combo / Nhóm triển khai**:
   - Đánh giá mức độ phù hợp giữa Combo 1 và Combo 2 (ví dụ phương án giữ FAST kết nối qua adapter) và chuẩn bị danh mục câu hỏi làm việc với Taskforce / Đoàn khảo sát GĐ2A.
5. **Những việc TUYỆT ĐỐI KHÔNG LÀM lúc này**:
   - Không tự xây dựng Data Platform riêng; không tự thuê nhà cung cấp viết pipeline tích hợp khi chưa chốt mức kiến trúc (L3 hay L4) sau khảo sát GĐ2A; không tự đặt mã chuẩn TCT/PVN; không đưa các con số dự toán/tiền bạc hoặc mốc ngày tháng chưa xác minh vào tài liệu báo cáo lãnh đạo.

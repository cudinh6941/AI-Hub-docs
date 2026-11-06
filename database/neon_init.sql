-- ==========================================================
-- AI HUB DOCS: NEON INITIAL SCHEMA & DATA SEED (POSTGRESQL)
-- ==========================================================

-- ==============================================================================
-- AI Hub Docs — PostgreSQL / PGlite Unified Schema (DDL)
-- Compatible with both standard PostgreSQL (pg) and embedded PGlite
-- ==============================================================================

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prompts (
    id VARCHAR(30) PRIMARY KEY,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    department VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tool VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    copy_count INTEGER DEFAULT 0,
    updated_at VARCHAR(20) NOT NULL,
    summary TEXT NOT NULL,
    prompt_template TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    why_effective TEXT NOT NULL,
    input_sample TEXT NOT NULL,
    output_sample TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_prompts_dept ON prompts(department);

CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(30) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 5,
    level VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    tool VARCHAR(100) NOT NULL,
    updated_at VARCHAR(20) NOT NULL,
    accent VARCHAR(100) DEFAULT 'from-indigo-500 to-purple-500',
    source_type VARCHAR(50) DEFAULT 'youtube',
    source_url TEXT,
    chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
    transcript TEXT,
    related_prompt_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);



-- 1. SEED DEPARTMENTS
INSERT INTO departments (id, name, prefix, description) VALUES ('bod', 'Ban Giám Đốc', 'BOD', 'Chiến lược, điều hành và phân tích quyết định quản trị') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name, prefix, description) VALUES ('finance', 'Tài chính - Kế toán', 'FIN', 'Phân tích báo cáo tài chính, dòng tiền, đối soát công nợ và ngân sách') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name, prefix, description) VALUES ('hr', 'Nhân sự', 'HR', 'Tuyển dụng, đánh giá năng lực, đào tạo và truyền thông nội bộ') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name, prefix, description) VALUES ('legal', 'Pháp chế', 'LEG', 'Rà soát hợp đồng, kiểm soát rủi ro pháp lý và tuân thủ') ON CONFLICT (id) DO NOTHING;
INSERT INTO departments (id, name, prefix, description) VALUES ('operations', 'Vận hành', 'OPS', 'Tối ưu quy trình, quản lý dự án, chuỗi cung ứng và dịch vụ khách hàng') ON CONFLICT (id) DO NOTHING;

-- 2. SEED VIDEOS
INSERT INTO videos (id, title, slug, summary, duration_minutes, level, department, tool, updated_at, accent, source_type, source_url, chapters, transcript, related_prompt_ids, tags) VALUES ('VID-001', 'Viết báo cáo tuần cho lãnh đạo với M365 Copilot trong 5 phút', 'bao-cao-tuan-voi-m365-copilot', 'Từ thư mục báo cáo rời rạc trên SharePoint đến một trang Executive Briefing hoàn chỉnh.', 6, 'Cơ bản', 'Ban Giám Đốc', 'M365 Copilot', '2026-03-26', 'from-indigo-500 to-purple-500', 'placeholder', '', '[{"time":"00:00","title":"Vấn đề: báo cáo tuần tốn 2 giờ mỗi thứ Hai"},{"time":"01:10","title":"Chuẩn bị thư mục SharePoint đúng cách"},{"time":"02:30","title":"Chạy prompt và điền biến số"},{"time":"04:20","title":"Kiểm tra kết quả (Human-in-the-loop)"}]'::jsonb, 'Mỗi sáng thứ Hai, bạn nhận 6 file báo cáo từ 6 phòng ban. Thay vì đọc từng file, hãy mở Copilot, chỉ định đúng thư mục SharePoint của tuần và đặt ngưỡng rủi ro. Copilot sẽ trả về bản tóm tắt tối đa 500 từ. Luôn đọc lại các con số trước khi gửi cho lãnh đạo.', '["BOD-001"]'::jsonb, '["bao cao","executive","sharepoint"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO videos (id, title, slug, summary, duration_minutes, level, department, tool, updated_at, accent, source_type, source_url, chapters, transcript, related_prompt_ids, tags) VALUES ('VID-002', 'Phân tích chênh lệch ngân sách P&L bằng Excel Copilot', 'phan-tich-chenh-lech-pl-excel-copilot', 'Tìm các khoản chi vượt định mức và đề xuất cắt giảm, không cần viết công thức.', 8, 'Trung cấp', 'Tài chính - Kế toán', 'Excel Copilot', '2026-03-24', 'from-emerald-500 to-teal-500', 'placeholder', '', '[{"time":"00:00","title":"Chuẩn bị bảng dữ liệu P&L"},{"time":"02:00","title":"Đặt ngưỡng vượt ngân sách"},{"time":"04:30","title":"Đọc và kiểm tra kết quả"},{"time":"06:40","title":"Lỗi thường gặp: sai vùng dữ liệu"}]'::jsonb, 'Đặt tên Sheet rõ ràng, chọn đúng vùng dữ liệu, rồi nhập ngưỡng phần trăm và số tiền tối thiểu. Copilot sẽ thêm cột chênh lệch và gom nhóm theo trung tâm chi phí.', '["FIN-001","FIN-002"]'::jsonb, '["excel","p&l","ngan sach"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO videos (id, title, slug, summary, duration_minutes, level, department, tool, updated_at, accent, source_type, source_url, chapters, transcript, related_prompt_ids, tags) VALUES ('VID-003', 'Rà soát hợp đồng nhanh: 4 điều khoản cần soi trước tiên', 'ra-soat-hop-dong-4-dieu-khoan', 'Mức phạt, giới hạn trách nhiệm, chấm dứt hợp đồng và cơ quan giải quyết tranh chấp.', 7, 'Nâng cao', 'Pháp chế', 'Word Copilot', '2026-03-22', 'from-sky-500 to-indigo-500', 'placeholder', '', '[{"time":"00:00","title":"Xác định bạn là bên nào trong hợp đồng"},{"time":"01:30","title":"Chạy prompt rà soát"},{"time":"04:00","title":"Dùng gợi ý redline"}]'::jsonb, 'Luôn nói rõ bạn là bên Mua hay bên Cung cấp. Kết quả của AI chỉ là bản nháp, luật sư của công ty vẫn là người quyết định cuối cùng.', '["LEG-001","LEG-002"]'::jsonb, '["hop dong","phap che"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO videos (id, title, slug, summary, duration_minutes, level, department, tool, updated_at, accent, source_type, source_url, chapters, transcript, related_prompt_ids, tags) VALUES ('VID-004', '5 nguyên tắc viết prompt hiệu quả (dành cho người mới)', '5-nguyen-tac-viet-prompt', 'Vai trò, bối cảnh, nhiệm vụ, ràng buộc, định dạng đầu ra: khung nền tảng cho mọi prompt.', 5, 'Cơ bản', 'Chung', 'ChatGPT / Claude', '2026-03-15', 'from-amber-500 to-rose-500', 'placeholder', '', '[{"time":"00:00","title":"Vì sao prompt chung chung cho kết quả chung chung"},{"time":"01:20","title":"Khung 5 phần"},{"time":"03:30","title":"Ví dụ trước và sau"}]'::jsonb, 'Một prompt tốt có 5 phần: vai trò, bối cảnh, nhiệm vụ, ràng buộc và định dạng đầu ra. Hãy bắt đầu từ các công thức có sẵn trong thư viện rồi chỉnh dần.', '["HR-001","OPS-002"]'::jsonb, '["co ban","prompting"]'::jsonb) ON CONFLICT (id) DO NOTHING;

-- 3. SEED PROMPTS
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('BOD-001', 'bod', 'Ban Giám Đốc', 'Tổng hợp Báo cáo Điều hành Tuần cho Ban Giám Đốc', 'tong-hop-bao-cao-dieu-hanh-tuan', 'M365 Copilot', 'Nâng cao', true, 4.9, 342, '2026-03-25', 'Tổng hợp nhanh tình hình hoạt động đa phòng ban từ các file báo cáo tuần trên SharePoint thành 1 trang Executive Briefing chuẩn mực.', 'Đóng vai trò là Trợ lý Chiến lược của Tổng Giám đốc. Hãy đọc các file báo cáo tuần trong thư mục [THƯ_MỤC_SHAREPOINT] của tuần [TUẦN_BÁO_CÁO] và trích xuất một bản tóm tắt điều hành tối đa 500 từ theo cấu trúc sau:
1. Điểm nghẽn nghiêm trọng cần CEO can thiệp (Critical Blockers) - chỉ nêu vấn đề có tác động tài chính hoặc tiến độ > [NGƯỠNG_RỦI_RO].
2. 03 chỉ số KPI then chốt có biến động lớn nhất so với tuần trước kèm nguyên nhân cốt lõi.
3. Đề xuất quyết định ưu tiên cho CEO trong cuộc họp giao ban đầu tuần.
Tuyệt đối không liệt kê các công việc sự vụ định kỳ. Giữ giọng văn súc tích, trực diện, hướng đến hành động.', '["THƯ_MỤC_SHAREPOINT","TUẦN_BÁO_CÁO","NGƯỠNG_RỦI_RO"]'::jsonb, 'Prompt áp dụng kỹ thuật ''Executive Constraint'' (giới hạn từ, tập trung vào điểm nghẽn và quyết định, cấm liệt kê sự vụ). Việc phân định rõ ngưỡng rủi ro giúp LLM lọc bỏ 90% nhiễu thông tin hành chính thông thường.', 'Folder SharePoint ''Weekly-Reports-W12'' chứa 6 file Word & Excel từ các khối: Kinh doanh, Vận hành, Kế toán, Nhân sự, Marketing, Pháp chế.', 'EXECUTIVE BRIEFING - TUẦN 12

1. ĐIỂM NGHẼN CẦN CAN THIỆP:
- Dự án ERP Pha 2 chậm 12 ngày do đối tác chưa bàn giao module kế toán; rủi ro phạt hợp đồng 350M VNĐ. Đề xuất: CEO triệu tập cuộc họp ba bên trước thứ Tư.

2. BIẾN ĐỘNG KPI CHÍNH:
- Doanh thu B2B đạt 118% kế hoạch (tăng đột biến từ deal Tập đoàn X).
- Tỷ lệ nghỉ việc khối CS tăng lên 8.2% do thay đổi chính sách KPI ca đêm.

3. 02 QUYẾT ĐỊNH CẦN PHÊ DUYỆT TRONG GIAO BAN:
- Duyệt phương án tuyển dụng bổ sung 5 nhân sự CS gấp.
- Chỉ đạo Phòng Pháp chế gửi công văn yêu cầu đối tác ERP giải trình.', '["executive","briefing","ceo","bao cao tuan","sharepoint","tong hop","chien luoc","lanh dao"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('BOD-002', 'bod', 'Ban Giám Đốc', 'Phân tích Kịch bản Chiến lược & Dự báo Tác động Q3/Q4', 'phan-tich-kich-ban-chien-luoc-q3-q4', 'ChatGPT / Claude', 'Nâng cao', true, 4.8, 218, '2026-03-20', 'Xây dựng 3 kịch bản kinh doanh (Thận trọng, Cơ sở, Tăng trưởng) dựa trên dữ liệu vĩ mô và kết quả kinh doanh nửa đầu năm.', 'Với tư cách là Cố vấn Chiến lược cấp cao cho Ban Điều Hành. Dựa vào dữ liệu tài chính nửa đầu năm [FILE_DU_LIEU_H1] và giả định biến động thị trường [GIA_DINH_THI_TRUONG], hãy xây dựng Ma trận 3 Kịch bản cho nửa cuối năm:
- Kịch bản 1: Thận trọng (Bear case) - khi thị trường giảm [TY_LE_GIAM]%
- Kịch bản 2: Cơ sở (Base case) - theo đúng kế hoạch ĐHCĐ
- Kịch bản 3: Tăng trưởng (Bull case) - khi nắm bắt cơ hội mới
Cho từng kịch bản, lập bảng gồm: Doanh thu dự phóng, Dòng tiền tự do, Tác động biên lợi nhuận EBITDA, và 3 Hành động ứng phó ưu tiên.', '["FILE_DU_LIEU_H1","GIA_DINH_THI_TRUONG","TY_LE_GIAM"]'::jsonb, 'Cấu trúc hóa yêu cầu theo mô hình phân tích kịch bản tài chính chuẩn quốc tế, ép AI đưa ra hành động tương ứng với từng giả định thay vì chỉ dự báo số liệu tĩnh.', 'Báo cáo H1: Doanh thu 120 tỷ, EBITDA 18%. Giả định: Lãi suất tăng 0.5%, sức mua ngành bán lẻ chững lại 5%.', 'BẢNG ĐỐI CHIẾU 3 KỊCH BẢN H2:
[Bảng so sánh chi tiết Doanh thu, EBITDA, Dòng tiền và Ma trận hành động kích hoạt kế hoạch phòng vệ].', '["strategy","scenario planning","hđqt","bod","du bao","tai chinh vi mo","tang truong"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('BOD-003', 'bod', 'Ban Giám Đốc', 'Soạn Thảo Thông Điệp CEO Toàn Thể Công Ty (Townhall Address)', 'soan-thao-thong-diep-ceo-townhall', 'Word Copilot', 'Trung cấp', true, 4.7, 185, '2026-03-12', 'Soạn thảo bài phát biểu truyền cảm hứng của CEO trong kỳ Townhall, cân bằng giữa thành tựu, thách thức và định hướng chuyển đổi.', 'Bạn là Giám đốc Truyền thông của CEO. Hãy soạn bài phát biểu Townhall Quý [QUÝ_TO_CHUC] với chủ đề [CHỦ_ĐỀ_CHÍNH].
Độ dài: khoảng 800 - 1000 từ (thời lượng đọc 6-7 phút).
Bố cục bài phát biểu:
1. Mở đầu: Tri ân nỗ lực toàn thể đội ngũ và ghi nhận 2 chiến thắng tiêu biểu: [HAI_THANH_TU_LON].
2. Thực tế thẳng thắn: Chia sẻ thẳng thắn về thách thức lớn nhất hiện tại: [THACH_THUC_LON_NHAT] với tinh thần trách nhiệm, không đổ lỗi.
3. Ngọn hải đăng: Mục tiêu chiến lược 90 ngày tới và lời kêu gọi hành động cụ thể cho từng khối.
Giọng điệu: Trầm ấm, truyền cảm hứng, quyết đoán nhưng đồng cảm sâu sắc.', '["QUÝ_TO_CHUC","CHỦ_ĐỀ_CHÍNH","HAI_THANH_TU_LON","THACH_THUC_LON_NHAT"]'::jsonb, 'Áp dụng cấu trúc diễn thuyết lãnh đạo hiện đại (Praise -> Brutal Honesty -> Future Hope), tránh lối diễn văn sáo rỗng.', 'Chủ đề: Tối ưu hiệu suất & Chuyển đổi số. Thành tựu: Ra mắt app mới, đạt 50k users. Thách thức: Chi phí vận hành tăng cao.', 'Kính gửi toàn thể gia đình [Tên Công Ty],

Khi đứng trước các bạn ngày hôm nay...', '["ceo speech","townhall","truyen thong","thong diep","van hoa doanh nghiep","lanh dao"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('FIN-001', 'finance', 'Tài chính - Kế toán', 'Phân Tích Chênh Lệch Ngân Sách P&L (Budget vs Actual Variance)', 'phan-tich-chenh-lech-ngan-sach-pl', 'Excel Copilot', 'Nâng cao', true, 5, 512, '2026-03-28', 'Tự động phân tích các dòng chi phí vượt định mức trong bảng tính P&L, tính tỷ lệ % chênh lệch và làm rõ nhóm nguyên nhân.', 'Phân tích bảng dữ liệu chi phí P&L trong Sheet [TÊN_SHEET]. Hãy thực hiện:
1. Tạo cột chênh lệch Variance ($) và Variance (%).
2. Đánh dấu tất cả các hạng mục có Variance âm vượt quá [NGƯỠNG_VƯỢT_NGÂN_SÁCH]% hoặc giá trị tuyệt đối > [SỐ_TIỀN_TỐI_THIỂU] VNĐ.
3. Nhóm các khoản vượt định mức theo trung tâm chi phí (Cost Center) và đề xuất 3 dòng chi phí cần cắt giảm ngay lập tức.
4. Định dạng bảng theo chuẩn kế toán quản trị: số âm đặt trong ngoặc đơn màu đỏ.', '["TÊN_SHEET","NGƯỠNG_VƯỢT_NGÂN_SÁCH","SỐ_TIỀN_TỐI_THIỂU"]'::jsonb, 'Sử dụng các tiêu chuẩn phân tích kế toán quản trị thực thụ kết hợp điều kiện kép (tỷ lệ % và số tiền tuyệt đối), giúp kế toán trưởng phát hiện ngay lỗ hổng ngân sách.', 'Sheet ''Budget_Actual_Q1'' chứa 45 dòng chi phí: Marketing, Lương, Server Cloud, Thuê văn phòng, Công tác phí,...', 'Đã thêm 2 cột ''Variance (VND)'' và ''Variance (%)''.

CẢNH BÁO VƯỢT NGÂN SÁCH Q1:
- Chi phí Cloud Infrastructure: Vượt 28.4% (+145.000.000 đ) do phát sinh tài nguyên AI thử nghiệm.
- Chi phí Marketing Acquisition: Vượt 15.2% (+90.000.000 đ) do chạy chiến dịch Tết bổ sung.', '["excel","pl","budget variance","ke toan quan tri","chi phi","tai chinh","cfo"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('FIN-002', 'finance', 'Tài chính - Kế toán', 'Kiểm Soát Công Nợ Quá Hạn & Dự Báo Dòng Tiền Thu Hồi (Aging AR)', 'kiem-soat-cong-no-qua-han-aging-ar', 'Excel Copilot', 'Trung cấp', true, 4.8, 420, '2026-03-22', 'Phân loại các khoản phải thu theo tuổi nợ (Aging Buckets: 0-30, 31-60, 61-90, >90 ngày) và dự phóng dòng tiền thu nợ.', 'Dựa trên danh sách công nợ phải thu tại bảng [BẢNG_CÔNG_NỢ], hãy tạo bảng phân bổ tuổi nợ theo 4 khoảng thời gian:
- 0 - 30 ngày (Trong hạn)
- 31 - 60 ngày (Cảnh báo cấp 1)
- 61 - 90 ngày (Rủi ro cao)
- Trên 90 ngày (Nợ khó đòi - trích lập dự phòng [TỶ_LỆ_DỰ_PHÒNG]%)
Tính tổng nợ của Top 5 khách hàng nợ lâu nhất và soạn dự thảo email nhắc nợ thanh toán lịch sự nhưng cứng rắn cho khách hàng nợ > 60 ngày.', '["BẢNG_CÔNG_NỢ","TỶ_LỆ_DỰ_PHÒNG"]'::jsonb, 'Tự động hóa hoàn toàn quy trình phân tích Aging Report và tự động sinh bản thảo email đôn đốc công nợ, tiết kiệm 80% thời gian của kế toán công nợ.', 'Bảng AR_List với 120 hóa đơn của 45 khách hàng, gồm các cột: Khách hàng, Số HĐ, Ngày đến hạn, Số tiền.', 'Bảng tổng hợp Aging Report với tỷ lệ trích lập dự phòng nợ khó đòi 120.000.000 VNĐ. Kèm mẫu email gửi Công ty Cổ phần ABC.', '["cong no","aging report","ar","dong tien","thu hoi no","excel copilot"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('FIN-003', 'finance', 'Tài chính - Kế toán', 'Đối Chiếu & Kiểm Tra Bất Thường Hóa Đơn Điện Tử', 'doi-chieu-bat-thuong-hoa-don-dien-tu', 'ChatGPT / Claude', 'Cơ bản', false, 4.5, 164, '2026-03-15', 'Phát hiện sai lệch tiền thuế VAT, mã số thuế và thông tin bên bán giữa file đối soát ngân hàng và bảng kê hóa đơn đầu vào.', 'Hãy đối chiếu 2 danh sách dữ liệu: [DANH_SÁCH_HÓA_ĐƠN] và [SAO_KÊ_NGÂN_HÀNG]. Tìm và chỉ ra tất cả các trường hợp:
1. Số tiền trên sao kê không khớp chính xác với tổng thanh toán trên hóa đơn (sai lệch dù chỉ 1 đồng).
2. Ngày thanh toán đi trước ngày xuất hóa đơn.
3. Hóa đơn có mã số thuế không trùng khớp với danh bạ nhà cung cấp được duyệt.
Kết quả xuất dưới dạng bảng Markdown gồm: Mã GD, Tên NCC, Số tiền HĐ, Số tiền Bank, Sai lệch, Phân loại rủi ro.', '["DANH_SÁCH_HÓA_ĐƠN","SAO_KÊ_NGÂN_HÀNG"]'::jsonb, 'Giúp nhân viên kế toán thuế phát hiện ngay sai phạm đối soát trước kỳ quyết toán thuế, tránh các khoản phạt không đáng có.', 'Hai bảng CSV trích xuất từ phần mềm kế toán MISA và Internet Banking doanh nghiệp.', 'BẢNG ĐỐI SOÁT PHÁT HIỆN 3 BẤT THƯỜNG:
| Mã GD | Tên NCC | Tiền HĐ | Tiền Bank | Sai lệch | Rủi ro |
|---|---|---|---|---|---|
| GD-991 | Cty An Lạc | 55.000.000 | 50.000.000 | -5.000.000 | Thiếu tiền thanh toán |', '["thue","vat","hoa don dien tu","doi chieu","kiem toan","sao ke"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('FIN-004', 'finance', 'Tài chính - Kế toán', 'Trích Xuất Bảng Biểu Từ Ảnh Scan & Hóa Đơn Không Lệch Cột (2-Step OCR Grid)', 'trich-xuat-bang-bieu-tu-anh-scan-khong-lech-cot', 'ChatGPT / Claude', 'Trung cấp', true, 5, 89, '2026-10-14', 'Ép AI quét ảnh theo lưới tọa độ ảo và trích xuất JSON trước khi tạo Markdown, triệt tiêu 100% lỗi lệch cột thành tiền hoặc vỡ ô gộp trong hóa đơn/bảng chấm công.', 'Bạn là chuyên gia thị giác máy tính và OCR tài liệu doanh nghiệp. Hãy xử lý ảnh đính kèm là [LOẠI_TÀI_LIỆU] theo quy trình 2 bước nghiêm ngặt:

BƯỚC 1 - QUÉT LƯỚI TỌA ĐỘ VÀ TRÍCH XUẤT JSON THÔ:
- Quét ảnh từ trên xuống dưới, từ trái sang phải.
- Thiết lập lưới tọa độ hàng x cột (Row x Col). Xác định chính xác các tiêu đề cột.
- Với các ô bị gộp (merge cell) hoặc ô trống: [QUY_TẮC_XỬ_LÝ_Ô_TRỐNG].
- Trích xuất toàn bộ dữ liệu dưới dạng JSON phẳng: {"headers": [...], "rows": [[...], [...]]}. Không tự ý làm tròn hay phỏng đoán ký tự bị mờ.

BƯỚC 2 - TÁI LẬP [ĐỊNH_DẠNG_BẢNG_ĐÍCH]:
- Từ cấu trúc JSON ở Bước 1, chuyển đổi thành bảng dữ liệu hoàn chỉnh.
- Giữ nguyên toàn bộ số tiền, mã số, dấu phân cách hàng nghìn.
- Nếu có dòng tổng cộng, hãy thêm 1 cột kiểm tra đối chiếu (Cross-check sum).', '["LOẠI_TÀI_LIỆU","QUY_TẮC_XỬ_LÝ_Ô_TRỐNG","ĐỊNH_DẠNG_BẢNG_ĐÍCH"]'::jsonb, 'Mẹo độc quyền: Bẻ gãy xu hướng ''đoán mò'' của AI bằng cách bắt nó qua bước trung gian là JSON tọa độ trước khi xuất bảng, giúp các cột số tiền không bao giờ bị nhảy sang cột số lượng.', 'Ảnh chụp góc nghiêng hóa đơn VAT của Công ty TNHH Mẫu ABC, gồm 12 dòng hàng hóa, chữ hơi mờ và có ô thuế suất 8% gộp chung.', 'BẢNG DỮ LIỆU ĐÃ TRÍCH XUẤT:
| STT | Tên hàng hóa | ĐVT | Số lượng | Đơn giá | Thành tiền (VNĐ) |
|---|---|---|---|---|---|
| 01 | Vải cotton 100% | Mét | 500 | 85.000 | 42.500.000 |
| 02 | Chỉ may công nghiệp | Cuộn | 1.200 | 12.000 | 14.400.000 |
| ... | ... | ... | ... | ... | ... |
| **Tổng tiền thanh toán** | | | | | **125.800.000** |', '["ocr","scan","hoa don","bang tinh","chatgpt-hack","youtube-gem","ke toan"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('HR-001', 'hr', 'Nhân sự', 'Xây Dựng Bản Mô Tả Công Việc (JD) & Khung Năng Lực Chuẩn Hóa', 'xay-dung-jd-khung-nang-luc-chuan-hoa', 'Word Copilot', 'Cơ bản', true, 4.9, 489, '2026-03-24', 'Tạo JD chuyên nghiệp và bộ tiêu chí đánh giá năng lực phỏng vấn dựa trên mục tiêu kinh doanh của phòng ban.', 'Với vai trò là Chuyên gia Tuyển dụng Cấp cao. Hãy soạn thảo một bản Mô tả Công việc (Job Description) hoàn chỉnh cho vị trí: [VỊ_TRÍ_TUYỂN_DỤNG] thuộc khối [PHÒNG_BAN], báo cáo trực tiếp cho [CẤP_QUẢN_LÝ].
Nội dung cần có:
1. Tóm tắt sứ mệnh vị trí (Mission Statement - 2 câu).
2. 05 Trách nhiệm cốt lõi (sử dụng động từ hành động mạnh mẽ, kèm tiêu chí đo lường KPI cụ thể).
3. Yêu cầu năng lực: Phân tách rõ ''Bắt buộc phải có'' (Must-have) và ''Ưu tiên'' (Nice-to-have).
4. Khung 5 câu hỏi phỏng vấn tình huống (STAR Method) để kiểm tra năng lực giải quyết vấn đề thực tế.', '["VỊ_TRÍ_TUYỂN_DỤNG","PHÒNG_BAN","CẤP_QUẢN_LÝ"]'::jsonb, 'Khung JD chuẩn mực theo phương pháp STAR giúp bộ phận tuyển dụng và Hiring Manager thống nhất tiêu chí đánh giá, tránh cảm tính.', 'Vị trí: Senior Product Manager, Khối: Công nghệ thông tin, Quản lý: Chief Technology Officer (CTO).', 'BẢN MÔ TẢ CÔNG VIỆC: SENIOR PRODUCT MANAGER

1. SỨ MỆNH:
Dẫn dắt vòng đời phát triển sản phẩm AI Portal nội bộ từ khâu ý tưởng đến triển khai toàn diện...', '["jd","tuyen dung","star method","phong van","nhan su","hr","khung nang luc"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('HR-002', 'hr', 'Nhân sự', 'Phân Tích Khảo Sát Gắn Kết Nhân Viên (eNPS) & Đề Xuất Hành Động', 'phan-tich-khao-sat-gan-ket-enps', 'ChatGPT / Claude', 'Trung cấp', true, 4.7, 275, '2026-03-18', 'Phân tích cảm xúc và trích xuất các chủ đề phàn nàn phổ biến nhất từ kết quả khảo sát ẩn danh của toàn thể nhân viên.', 'Đọc dữ liệu phản hồi khảo sát ẩn danh của nhân sự tại [DỮ_LIỆU_KHẢO_SÁT]. Hãy tiến hành:
1. Tính điểm eNPS tổng thể theo công thức: % Promoters (9-10đ) - % Detractors (0-6đ).
2. Phân loại toàn bộ ý kiến đóng góp thành 4 nhóm chủ đề chính: Môi trường làm việc, Cơ hội thăng tiến, Chế độ đãi ngộ, và Năng lực quản lý trực tiếp.
3. Nhận diện 3 ''điểm đau'' (pain points) bức xúc nhất có tần suất lặp lại cao nhất kèm trích dẫn ẩn danh tiêu biểu.
4. Đề xuất Kế hoạch hành động 30 ngày cho Ban Lãnh đạo với các giải pháp khả thi chi phí thấp.', '["DỮ_LIỆU_KHẢO_SÁT"]'::jsonb, 'Phân tích ngữ nghĩa sâu (sentiment analysis) biến hàng trăm nhận xét rời rạc thành dữ liệu định lượng và kế hoạch hành động cụ thể cho ban giám đốc.', 'Bảng khảo sát 250 dòng câu trả lời tự luận của nhân viên các khối văn phòng.', 'BÁO CÁO PHÂN TÍCH eNPS NĂM 2026:
Điểm eNPS: +32 (Tăng 4 điểm so với năm trước).
Top 3 Điểm đau:
1. Quy trình phê duyệt chi phí rườm rà (48 lượt phản ánh)
2. Thiếu lộ trình đào tạo chuyên môn định kỳ (35 lượt)...', '["enps","khao sat","van hoa doanh nghiep","giu chan nhan tai","sentiment","nhan su"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('HR-003', 'hr', 'Nhân sự', 'Soạn Thảo Kế Hoạch Đón Tiếp Nhân Sự Mới (Onboarding 30-60-90 Ngày)', 'ke-hoach-onboarding-30-60-90-ngay', 'M365 Copilot', 'Cơ bản', false, 4.6, 198, '2026-03-10', 'Tạo lộ trình hội nhập bài bản từng mốc thời gian giúp nhân sự mới bắt nhịp nhanh với văn hóa và công việc.', 'Lập kế hoạch Onboarding 30-60-90 ngày cho nhân sự mới vị trí [VỊ_TRÍ] thuộc phòng ban [PHÒNG_BAN].
Yêu cầu phân bổ:
- 30 Ngày đầu (Học hỏi & Hòa nhập): Đào tạo quy trình, làm quen buddy, hiểu tài liệu sản phẩm.
- 60 Ngày tiếp theo (Đóng góp độc lập): Tự chủ giải quyết tác vụ định kỳ, nhận phản hồi giữa kỳ.
- 90 Ngày (Tạo đột phá): Hoàn thành 1 dự án cải tiến nhỏ và đánh giá kết thúc thử việc.
Kèm checklist tài liệu nội bộ cần cấp quyền truy cập trong ngày đầu đi làm.', '["VỊ_TRÍ","PHÒNG_BAN"]'::jsonb, 'Tiêu chuẩn hóa lộ trình thử việc, giúp giảm 50% tỷ lệ nghỉ việc trong 3 tháng đầu của nhân sự mới.', 'Vị trí: Chuyên viên Phân tích Dữ liệu (Data Analyst), Khối Vận hành.', 'LỘ TRÌNH ONBOARDING 90 NGÀY CHO DATA ANALYST...
[Bảng chi tiết các mốc tuần, người hỗ trợ và kết quả bàn giao cần đạt].', '["onboarding","hoi nhap","thu viec","checklist","nhan su"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('LEG-001', 'legal', 'Pháp chế', 'Rà Soát Rủi Ro & Điều Khoản Bất Lợi Trong Hợp Đồng Dịch Vụ', 'ra-soat-rui-ro-hop-dong-dich-vu', 'Word Copilot', 'Nâng cao', true, 5, 540, '2026-03-29', 'Tự động quét các điều khoản bẫy pháp lý, phạt vi phạm vượt quá trần luật định và điều khoản bồi thường thiệt hại vô hạn.', 'Bạn là Luật sư Trưởng của doanh nghiệp [TÊN_DOANH_NGHIỆP] đóng vai trò là bên [BÊN_TRONG_HỢP_ĐỒNG] (Bên Mua/Bên Cung Cấp). Hãy rà soát toàn bộ dự thảo hợp đồng trong tài liệu Word này theo Luật Thương mại và Bộ luật Dân sự Việt Nam hiện hành:
1. Liệt kê tất cả các điều khoản bất lợi nghiêm trọng thuộc 4 nhóm:
   - Mức phạt vi phạm (Lưu ý trần phạt 8% giá trị phần nghĩa vụ bị vi phạm theo Điều 301 Luật Thương mại).
   - Trách nhiệm bồi thường thiệt hại (Cảnh báo nếu thiếu điều khoản giới hạn trách nhiệm Cap of Liability).
   - Điều kiện đơn phương chấm dứt hợp đồng.
   - Cơ quan tài phán giải quyết tranh chấp (ưu tiên Trọng tài VIAC hoặc Tòa án nơi công ty đặt trụ sở).
2. Đưa ra phương án câu chữ thay thế (Redline drafting) chi tiết cho từng điều khoản có rủi ro.', '["TÊN_DOANH_NGHIỆP","BÊN_TRONG_HỢP_ĐỒNG"]'::jsonb, 'Prompt áp dụng triệt để các căn cứ pháp luật chuyên ngành cụ thể (Luật Thương mại Điều 301, VIAC) và yêu cầu redline trực tiếp, biến Word Copilot thành trợ lý luật sư đắc lực.', 'Dự thảo Hợp đồng Cung cấp Dịch vụ Phần mềm 15 trang do đối tác nước ngoài gửi tới.', 'BÁO CÁO THẨM ĐỊNH PHÁP LÝ HỢP ĐỒNG:

1. RỦI RO NGHIÊM TRỌNG TẠI ĐIỀU 9.2 (PHẠT VI PHẠM):
- Hiện trạng: Đối tác quy định phạt 20% tổng giá trị hợp đồng.
- Đánh giá: Vi phạm quy định trần 8% theo Điều 301 Luật Thương mại.
- Sửa đổi kiến nghị: ''Mức phạt vi phạm hợp đồng tối đa không vượt quá 8% giá trị phần nghĩa vụ hợp đồng bị vi phạm.''

2. RỦI RO TẠI ĐIỀU 12 (GIỚI HẠN TRÁCH NHIỆM):
[Kiến nghị bổ sung Cap of Liability không quá 100% tổng phí dịch vụ đã thanh toán].', '["phap che","hop dong","ra soat","luat thuong mai","rui ro phap ly","redline","word copilot"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('LEG-002', 'legal', 'Pháp chế', 'Soạn Thảo Thỏa Thuận Bảo Mật Thông Tin (NDA) Song Ngữ', 'soan-thao-thoa-thuan-bao-mat-nda-song-ngu', 'Word Copilot', 'Trung cấp', true, 4.9, 388, '2026-03-21', 'Tạo văn bản thỏa thuận bảo mật song ngữ Việt - Anh chuẩn hóa bảo vệ bí mật kinh doanh, sở hữu trí tuệ và dữ liệu khách hàng.', 'Soạn thảo văn bản Thỏa thuận Bảo mật Thông tin (Non-Disclosure Agreement - NDA) hai chiều (Mutual NDA) song ngữ Việt - Anh giữa [BÊN_A] và [BÊN_B].
Mục đích tiết lộ: [MỤC_ĐÍCH_HỢP_TÁC].
Thời hạn bảo mật bắt buộc: [THỜI_HẠN_BẢO_MẬT] năm kể từ ngày chấm dứt hợp tác.
Bắt buộc đưa vào:
- Định nghĩa chi tiết Thông tin Bảo mật (bao gồm mã nguồn, thuật toán AI, kế hoạch kinh doanh, danh sách khách hàng).
- Các ngoại lệ không áp dụng nghĩa vụ bảo mật (thông tin đại chúng, do bên thứ ba độc lập cung cấp hợp pháp).
- Chế tài xử lý vi phạm bồi thường thiệt hại thực tế phát sinh và chi phí luật sư hợp lý.', '["BÊN_A","BÊN_B","MỤC_ĐÍCH_HỢP_TÁC","THỜI_HẠN_BẢO_MẬT"]'::jsonb, 'Đáp ứng tiêu chuẩn giao dịch quốc tế với cấu trúc song ngữ cột song song (bilingual column) và điều khoản bảo hộ tài sản trí tuệ chặt chẽ.', 'Bên A: Công ty AI Hub Việt Nam, Bên B: Đối tác Công nghệ Cloud Global. Mục đích: Đánh giá khả năng tích hợp giải pháp LLM nội bộ.', 'THỎA THUẬN BẢO MẬT THÔNG TIN / NON-DISCLOSURE AGREEMENT

Căn cứ vào... / In consideration of...', '["nda","bao mat thong tin","song ngu","hop dong","phap che","bi mat kinh doanh"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('LEG-003', 'legal', 'Pháp chế', 'Thẩm Định Tuân Thủ Bảo Vệ Dữ Liệu Cá Nhân (Nghị định 13/2023/NĐ-CP)', 'tham-dinh-tuan-thu-nghi-dinh-13-data-privacy', 'ChatGPT / Claude', 'Nâng cao', false, 4.7, 210, '2026-03-14', 'Kiểm tra quy trình thu thập và xử lý dữ liệu khách hàng/nhân sự đối chiếu với quy định bảo vệ dữ liệu cá nhân (PDPD).', 'Với tư cách là Chuyên gia Độc lập về Tuân thủ Bảo vệ Dữ liệu (DPO). Hãy đánh giá quy trình xử lý dữ liệu: [QUY_TRÌNH_HIỆN_TẠI] theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân:
1. Phân loại dữ liệu thành: Dữ liệu cá nhân cơ bản vs Dữ liệu cá nhân nhạy cảm.
2. Kiểm tra xem quy trình đã có ''Sự đồng ý rõ ràng có thể rút lại'' của chủ thể dữ liệu hay chưa.
3. Đánh giá rủi ro pháp lý nếu có hành vi chuyển dữ liệu cá nhân ra nước ngoài (Cross-border data transfer).
4. Lập danh mục 5 bước cần khắc phục ngay để tránh bị phạt vi phạm hành chính.', '["QUY_TRÌNH_HIỆN_TẠI"]'::jsonb, 'Cập nhật các chế tài mới nhất theo Nghị định 13 của Việt Nam, trực tiếp phòng ngừa rủi ro bị đình chỉ hoạt động hoặc xử phạt dữ liệu.', 'Quy trình: Đưa thông tin hồ sơ ứng viên và khảo sát khách hàng lên máy chủ AI Cloud công cộng.', 'BÁO CÁO ĐÁNH GIÁ TÁC ĐỘNG XỬ LÝ DỮ LIỆU (DPIA):
- Cảnh báo: Việc đưa CV ứng viên chưa qua ẩn danh lên Cloud quốc tế có nguy cơ vi phạm Điều 25 về chuyển dữ liệu xuyên biên giới...', '["nghi dinh 13","data privacy","pdpd","tuan thu","phap che","bao mat du lieu"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('OPS-001', 'operations', 'Vận hành', 'Tối Ưu Hóa Quy Trình Chuỗi Cung Ứng & Rút Ngắn Lead Time', 'toi-uu-hoa-chuoi-cung-ung-lead-time', 'M365 Copilot', 'Trung cấp', true, 4.9, 395, '2026-03-27', 'Phân tích nhật ký luân chuyển đơn hàng để phát hiện các khâu thắt cổ chai gây chậm trễ tiến độ giao hàng cho khách hàng.', 'Hãy phân tích nhật ký vận hành chuỗi cung ứng trong tài liệu [DỮ_LIỆU_ĐƠN_HÀNG].
Nhiệm vụ:
1. Tính thời gian xử lý trung bình (Lead Time) tại từng trạm: Nhận đơn -> Soạn kho -> Đóng gói -> Bàn giao vận chuyển -> Giao thành công.
2. Xác định trạm có thời gian tồn đọng cao nhất vượt ngưỡng SLA tiêu chuẩn là [SLA_TIÊU_CHUẨN] giờ.
3. Áp dụng nguyên lý Lean Six Sigma để đề xuất 3 giải pháp loại bỏ lãng phí (Muda) trong khâu đó.
4. Soạn thảo một thông báo tóm tắt tình hình vận hành gửi kênh Microsoft Teams [KÊNH_TEAMS].', '["DỮ_LIỆU_ĐƠN_HÀNG","SLA_TIÊU_CHUẨN","KÊNH_TEAMS"]'::jsonb, 'Kết hợp giữa phân tích dữ liệu thô vận hành và phương pháp luận Lean, giúp bộ phận điều độ kho bãi lập tức khoanh vùng được điểm tắc nghẽn.', 'File Excel trích xuất dữ liệu 1.500 đơn hàng của tuần trước với timestamp ở mỗi trạm.', 'PHÂN TÍCH LEAD TIME VẬN HÀNH:
- Khâu đóng gói đang chiếm trung bình 6.4 giờ (Vượt SLA quy định 4.0 giờ).
- Nguyên nhân cốt lõi: Thiếu hụt vật tư thùng carton loại C vào giờ cao điểm 15h-17h.
- Đề xuất: Thiết lập cơ chế re-order tự động khi tồn kho thùng xuống dưới 200 cái.', '["van hanh","chuoi cung ung","supply chain","lead time","sla","lean six sigma","teams"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('OPS-002', 'operations', 'Vận hành', 'Xây Dựng Quy Trình Chuẩn (SOP) Xử Lý Khủng Hoảng Dịch Vụ Khách Hàng', 'xay-dung-sop-khung-hoang-dich-vu-khach-hang', 'Word Copilot', 'Cơ bản', true, 4.8, 310, '2026-03-19', 'Tiêu chuẩn hóa quy trình phân cấp và ứng phó khi xảy ra sự cố dịch vụ quy mô lớn, đảm bảo thời gian phản hồi dưới 15 phút.', 'Soạn thảo Quy trình Thao tác Chuẩn (SOP) ứng phó sự cố dịch vụ cấp độ [CẤP_ĐỘ_SỰ_CỐ] (Severity 1 / 2) cho Bộ phận Chăm sóc Khách hàng & Vận hành của [TÊN_SẢN_PHẨM].
Bố cục văn bản:
1. Tiêu chí phân loại sự cố (Dấu hiệu nhận biết, số lượng người dùng bị ảnh hưởng).
2. Ma trận phân quyền liên lạc (Escalation Matrix): Ai thông báo cho ai, qua kênh nào, trong bao nhiêu phút.
3. Mẫu kịch bản thông báo trấn an khách hàng (Holding Statement) đăng tải trên Fanpage, Email và Notification.
4. Biên bản phân tích nguyên nhân gốc rễ (Post-mortem template) sau sự cố.', '["CẤP_ĐỘ_SỰ_CỐ","TÊN_SẢN_PHẨM"]'::jsonb, 'Định hình kịch bản phản ứng nhanh, ngăn ngừa sự cố kỹ thuật biến thành khủng hoảng truyền thông thương hiệu.', 'Sản phẩm: Ứng dụng AI Portal nội bộ, Cấp độ sự cố: Sev-1 (Toàn bộ người dùng không truy cập được).', 'SOP-OPS-012: QUY TRÌNH ỨNG PHÓ KHỦNG HOẢNG DỊCH VỤ SEV-1...
[Chi tiết thời gian đáp ứng TTR < 15 phút, mẫu phát ngôn và ma trận báo cáo Ban Giám Đốc].', '["sop","quy trinh","khung hoang","khach hang","cs","van hanh","post mortem"]'::jsonb) ON CONFLICT (id) DO NOTHING;
INSERT INTO prompts (id, department_id, department, title, slug, tool, difficulty, verified, rating, copy_count, updated_at, summary, prompt_template, variables, why_effective, input_sample, output_sample, tags) VALUES ('OPS-003', 'operations', 'Vận hành', 'Phân Tích Bất Thường & Dự Báo Tồn Kho An Toàn (Safety Stock)', 'phan-tich-ton-kho-an-toan-safety-stock', 'Excel Copilot', 'Nâng cao', false, 4.6, 224, '2026-03-11', 'Tính toán mức tồn kho an toàn và điểm đặt hàng lại (Reorder Point) dựa trên độ lệch chuẩn nhu cầu thực tế.', 'Dựa vào bảng tiêu thụ hàng hóa 12 tháng qua tại Sheet [SHEET_LỊCH_SỬ_XUẤT_KHO]. Hãy tính toán:
1. Nhu cầu trung bình ngày (Average Daily Usage) và Độ lệch chuẩn tiêu thụ (Standard Deviation).
2. Điểm tồn kho an toàn (Safety Stock) với mức độ dịch vụ phục vụ mong muốn là [SERVICE_LEVEL]% (Z-score tương ứng).
3. Điểm đặt hàng lại (Reorder Point - ROP) với thời gian nhà cung cấp giao hàng là [LEAD_TIME_NGÀY] ngày.
4. Liệt kê Top 10 mã SKU đang ở trạng thái báo động đỏ (Tồn kho thực tế < ROP) cần phát lệnh PO ngay hôm nay.', '["SHEET_LỊCH_SỬ_XUẤT_KHO","SERVICE_LEVEL","LEAD_TIME_NGÀY"]'::jsonb, 'Áp dụng công thức thống kê chính xác thay cho việc ước lượng cảm tính, giúp giảm 25% chi phí lưu kho mà không bị đứt hàng.', 'Sheet ''Inventory_2025'' gồm 800 mã vật tư, thời gian lead time 7 ngày, mức phục vụ 95%.', 'BẢNG TÍNH SAFETY STOCK & ĐIỂM ĐẶT HÀNG LẠI (ROP):
- SKU-9021 (Mực in chuyên dụng): ROP = 45 hộp. Tồn thực tế = 12 hộp. HÀNH ĐỘNG: ĐẶT NGAY 100 HỘP...', '["ton kho","safety stock","rop","excel","supply chain","quan ly kho"]'::jsonb) ON CONFLICT (id) DO NOTHING;

-- 4. VERIFY COUNTS
SELECT COUNT(*) AS total_videos FROM videos;
SELECT COUNT(*) AS total_prompts FROM prompts;

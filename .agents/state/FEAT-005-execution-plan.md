# FEAT-005 Execution Plan — UI Direction Refresh
**Dành cho**: model Tier 2 (Gemini Flash / Claude Haiku), vai `2-ui-developer`, kiểm bởi `3-qa-verifier`.
**Spec gốc**: `product/1-specs-backlog/FEAT-005-ui-direction-refresh.md` (đã `spec-ready`, quyết định ở mục 1.4).
**Quy tắc thiết kế**: `.agents/skills/ui-component-rules/SKILL.md` mục 6 và `.agents/skills/behavioral-product-design/SKILL.md`.

---

## 0. Luật chung (đọc trước khi làm bất cứ giai đoạn nào)

1. **Một giai đoạn = một lượt làm.** Làm xong một giai đoạn, chạy Cổng nghiệm thu của giai đoạn đó, báo kết quả, rồi dừng. Không tự sang giai đoạn kế.
2. **Không commit.** Chỉ để thay đổi ở working tree. Cuối mỗi giai đoạn dán kết quả `git status -s` và `git diff --stat`.
3. **Chỉ sửa file trong danh sách "Được sửa" của giai đoạn.** Gặp file ngoài danh sách cần sửa thì dừng và báo, đừng tự sửa.
4. **Cấm tuyệt đối:**
   - Sửa `src/services/**`, `src/data/**`, `server/**`, `scripts/**`.
   - Xóa file component. Component không dùng nữa thì giữ nguyên file.
   - Sửa `.agents/state/current_task.md` (đang giữ trạng thái của FEAT-004).
   - Thêm thư viện mới vào `package.json`.
   - Import JSON trực tiếp trong `src/pages/**` và `src/components/**`.
   - Đổi nội dung chữ (copy) ngoài các chỗ plan này ghi rõ. Không thêm emoji, dấu `!`, hay từ trong blacklist của `behavioral-product-design`.
5. **Giữ nguyên toàn bộ logic**: props, state, hook, route, handler, 3 trạng thái `loading/empty/error`, timer Copy 2000ms. Chỉ đổi lớp trình bày (className, cấu trúc JSX thuần hiển thị).
6. **Đọc file trước khi sửa.** Không đoán nội dung.
7. **Không chắc thì hỏi**, không tự sáng tạo thêm màu, font, hiệu ứng ngoài bảng token bên dưới.
8. Cổng nghiệm thu nào fail thì sửa tới khi pass. Fail 3 lần cùng một lỗi thì dừng và báo nguyên văn thông báo lỗi.

---

## 1. Bảng Design Token chốt (nguồn duy nhất)

| Token Tailwind | Giá trị | Dùng cho |
|---|---|---|
| `bg-paper` | `#FBFAF7` | Nền trang |
| `bg-paper-sunken` | `#F3F1EA` | Nền vùng phụ, khối code, nền input |
| `bg-white` | `#FFFFFF` | Chỉ dùng cho input đang focus, modal, drawer |
| `text-ink` / `border-ink` / `bg-ink` | `#1C1B19` | Tiêu đề, nút chính |
| `text-body` | `#4A4741` | Nội dung |
| `text-muted` | `#7A756B` | Meta, ngày, nhãn phụ (đạt tương phản AA trên `paper`) |
| `border-line` / `bg-line` | `#E7E3DA` | Mọi đường kẻ và viền |
| `text-accent` / `bg-accent` / `border-accent` | `#C2410C` | Màu nhấn duy nhất |
| `bg-accent-hover` / `hover:bg-accent-hover` | `#9A3412` | Hover của nút nhấn |
| `bg-accent-soft` | `#FFF1E8` | Nền nhạt của chip biến số chưa điền |
| `font-display` | `Newsreader`, `Source Serif 4`, `Georgia`, serif | H1, H2, H3, tiêu đề card |
| `font-sans` | `Inter` (giữ nguyên) | Body, nút, UI |
| `font-mono` | `JetBrains Mono` (giữ nguyên) | Prompt, biến số |

Trạng thái thành công (đã sao chép, biến đã điền) giữ nguyên `emerald-*`. Trạng thái lỗi giữ nguyên `red-*`. Không dùng màu nào khác.

### Bảng quy đổi class cũ sang mới (áp dụng trong file được sửa của từng giai đoạn)

| Class cũ | Class mới |
|---|---|
| `text-slate-900`, `text-slate-800` | `text-ink` |
| `text-slate-700`, `text-slate-600` | `text-body` |
| `text-slate-500`, `text-slate-400`, `text-slate-300` | `text-muted` |
| `border-slate-100/200/300` (kể cả `/80`, `/90`) | `border-line` |
| `bg-slate-50`, `bg-slate-100`, `bg-slate-50/70` | `bg-paper-sunken` |
| `bg-[#FAFAFA]` | `bg-paper` |
| `bg-white` (nền section hoặc nền khối) | `bg-paper` |
| `bg-slate-900` (nút chính) | `bg-ink hover:bg-accent` |
| `text-indigo-600`, `text-indigo-700` | `text-accent` |
| `bg-indigo-600` | `bg-accent hover:bg-accent-hover` |
| `bg-indigo-50` | `bg-accent-soft` |
| `border-indigo-200/*` | `border-accent/30` |
| `hover:text-indigo-600`, `group-hover:text-indigo-600` | bỏ, thay bằng kiểu hover duy nhất (mục 2) |
| `focus:border-slate-900 focus:ring-*` | `focus:border-ink focus:ring-1 focus:ring-ink` |
| `rounded-xl`, `rounded-2xl` trên khối nội dung | bỏ, hoặc `rounded-md` nếu là input / nút |
| `shadow-*` (mọi loại) trên khối nội dung | bỏ |
| `hover:scale-*`, `hover:shadow-*` | bỏ |
| `font-extrabold` | `font-semibold` (với `font-display`) |

---

## 2. Quy ước dùng chung

**Hover duy nhất** (áp dụng cho mọi tiêu đề có thể bấm): phần tử cha có `group`, tiêu đề thêm
`underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200`.
Liên kết dạng "Xem tất cả" dùng `text-body hover:text-accent`. Nút giữ `transition-colors duration-200`.

**Tiêu đề section** (thay cho `SectionHeader` cũ):
- Bỏ eyebrow. Chỉ còn `<h2 className="font-display text-2xl sm:text-3xl text-ink tracking-tight">` và liên kết phụ bên phải, căn dưới.
- Section chủ đề chính dùng `py-20`, section phụ dùng `py-12`. Không để hai section liền nhau có cùng padding.
- Phân tách section bằng một đường `border-t border-line`, không đổi màu nền xen kẽ.

**Chữ**:
- H1: `font-display text-4xl sm:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.08] font-medium`.
- H3 trong card: `font-display text-lg text-ink leading-snug font-medium`.
- Body: `text-body leading-relaxed`.

**Chuyển động**: chỉ giữ `animate-fade-up` (một lần khi vào trang) và phản hồi nút Copy. Mọi animation mới phải bọc trong `motion-safe:`.

### 2b. Luật bố cục (bổ sung sau P3, áp dụng cho P3b trở đi)

Lý do bổ sung: sau P3 giao diện vẫn "đóng hộp" quá nhiều và còn nhiều mẫu quen thuộc của SaaS. Các luật dưới đây có hiệu lực cao hơn bảng quy đổi mục 1.

**L1. Tối đa 1 lớp hộp.** Một vùng nội dung chỉ được có tối đa 1 lớp "hộp" (viền hoặc nền khác màu). Cấm hộp trong hộp. Muốn chia nhóm thì dùng khoảng trắng và đường kẻ ngang `border-t border-line`, không dùng viền bao quanh.

**L2. Chip và badge chỉ là chữ.** Nhãn tool, nhãn trạng thái, tên file, hạn chót: dùng `text-xs text-muted`, ngăn cách bằng dấu chấm giữa `·`. Không viền, không nền, không bo góc. Ngoại lệ duy nhất: chip biến số `[Biến]` trong khối prompt (cần nhìn ra là chỗ điền).

**L3. Bố cục section kiểu biên tập (thay cho mọi `SectionHeader` xếp dọc).** Trên màn hình `lg` trở lên mỗi section chia 2 cột trong cùng `max-w-7xl`:
```
<section className="border-t border-line py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
    <div className="lg:col-span-3">
      <h2 className="font-display text-2xl text-ink tracking-tight font-medium lg:sticky lg:top-24">{title}</h2>
      {link && <Link className="mt-3 inline-block text-sm text-body hover:text-accent underline underline-offset-4 decoration-line">{linkLabel}</Link>}
    </div>
    <div className="lg:col-span-9">{content}</div>
  </div>
</section>
```
Trên mobile tiêu đề nằm trên nội dung. Không mũi tên trong liên kết "Xem tất cả". Đây là đặc điểm nhận diện bố cục của site, dùng nhất quán.

**L4. Không icon mũi tên `ArrowRight` trang trí.** Liên kết điều hướng chỉ là chữ gạch chân. Chỉ giữ icon khi chức năng thật sự cần (Copy, Search, đóng modal).

**L5. Không tự chạy.** Cấm carousel tự xoay (`setInterval` đổi nội dung), cấm hiệu ứng quét (`animate-scan-beam`, `animate-shimmer-h`), cấm hiệu ứng nhấp nháy. Nội dung chỉ thay đổi khi người dùng bấm.

**L6. Mockup phải dùng nội dung thật, không dùng dữ liệu bịa.** Không dựng "giao diện giả" có tên file, mã `FIN-001`, phần trăm, nhãn đỏ kiểu dashboard. Thay bằng trích đoạn thật: một đoạn prompt mẫu hoặc một đoạn kết quả mẫu, viết bằng `font-mono` trong một khối `bg-paper-sunken` (đây là 1 lớp hộp duy nhất của tile) hoặc đơn giản là chữ trên đường kẻ.

**L7. Không eyebrow viết hoa.** Cấm `uppercase tracking-wider` làm nhãn trên tiêu đề. Cần nhãn ngữ cảnh thì dùng chữ thường `text-xs text-muted`.

**L8. Không badge có chấm tròn** (`<span className="w-1.5 h-1.5 rounded-full">` kèm chữ). Bỏ hẳn.

**L9. Nút**: chỉ có 2 kiểu. Nút chính `bg-ink hover:bg-accent text-white rounded-md`. Nút phụ là liên kết chữ gạch chân. Cấm nút viền (`border` + nền xám) trừ nút Copy.

**L10. Nhịp bố cục.** Không để 2 section liền nhau dùng cùng một cấu trúc nội dung (ví dụ cùng là lưới 3 cột). Xen kẽ: danh sách dọc, lưới thưa 2 cột, khối trích dẫn một cột.

### 2c. Ngân sách chữ và đơn vị hình ảnh (bổ sung sau P3b)

Lý do bổ sung: sau P3b mọi trang vẫn quá nhiều chữ. Số chữ hiển thị ước tính hiện tại (đếm bằng lệnh ở mục 2d): `AssistantsPage` 964, `FeatureSpotlightBanner` 315, `BentoSection` 263, `VideoPage` 170, `GovernancePage` 159, `GuideDetailPage` 132, `HomePage` 123, `PromptDetailPage` 99, `LearnPage` 83.

**L11. Mỗi section tối đa 1 đoạn văn, mỗi đoạn tối đa 20 từ.** Tiêu đề tối đa 10 từ. Không có đoạn giới thiệu thứ hai nhắc lại ý của tiêu đề.

**L12. Không lặp một thông điệp ở nhiều nơi.** Một ví dụ (một cặp trước/sau) chỉ xuất hiện một lần trên mỗi trang và không lặp lại giữa các section liền kề.

**L13. Mỗi trang có đúng một đơn vị hình ảnh, và đơn vị đó là nội dung thật.** Đơn vị hình ảnh là một trong ba loại:
- component `BeforeAfter` (cặp "trước, sau" bằng chữ, tương phản cỡ chữ và font);
- ảnh chụp màn hình kết quả thật đã ẩn danh (khi có ảnh);
- một câu trích cỡ lớn `font-display text-3xl` hoặc lớn hơn.
Cấm ảnh stock, ảnh AI vẽ, icon trong vòng tròn, hình trang trí.

**L14. Cắt trước, thêm sau.** Gặp đoạn văn mô tả lại điều mà tiêu đề hoặc ví dụ đã thể hiện thì xóa đoạn đó, không viết lại ngắn hơn.

### 2d. Lệnh đếm chữ (dùng làm cổng nghiệm thu)

```powershell
function Count-Words($path) {
  $t = [IO.File]::ReadAllText($path)
  $t = [regex]::Replace($t, 'className=("[^"]*"|\{`[^`]*`\}|\{[^}]*\})', '')
  $t = [regex]::Replace($t, '(?s)\{/\*.*?\*/\}', '')
  $w = 0
  foreach ($x in [regex]::Matches($t, '>([^<>{}]{3,})<')) { $w += ($x.Groups[1].Value.Trim() -split '\s+' | Where-Object { $_ }).Count }
  foreach ($x in [regex]::Matches($t, "(?<=['""])[^'""\n]{25,}(?=['""])")) { if ($x.Value -match '\s[a-zà-ỹ]') { $w += ($x.Value -split '\s+').Count } }
  $w
}
# ví dụ: Count-Words 'src\pages\HomePage.jsx'
```
Con số này là ước lượng, chỉ dùng để so sánh trước và sau trên cùng một file.

---

## 3. Các giai đoạn

### P1 — Nền tảng (token + font)
**Được sửa**: `index.html`, `src/index.css`, `.agents/skills/ui-component-rules/SKILL.md` (chỉ mục 1 và mục 2, giữ nguyên các mục khác).

Việc làm:
1. `index.html`: đổi `lang="en"` thành `lang="vi"`. Thêm `family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600` vào URL Google Fonts hiện có (giữ Inter và JetBrains Mono).
2. `src/index.css`, khối `@theme`: thêm các biến màu và font theo bảng token mục 1, đặt tên đúng dạng Tailwind v4: `--color-paper`, `--color-paper-sunken`, `--color-ink`, `--color-body`, `--color-muted`, `--color-line`, `--color-accent`, `--color-accent-hover`, `--color-accent-soft`, `--font-display`. **Giữ nguyên** `--color-stripe-*` ở giai đoạn này (còn file đang dùng).
3. `body`: đổi `background-color` thành `#FBFAF7`, `color` thành `#1C1B19`.
4. Thêm vào cuối `index.css`:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
   }
   ```
5. Scrollbar: đổi màu track thành `#F3F1EA`, thumb `#D9D4C7`, hover `#BDB6A4`.
6. **Không xóa** `dot-pattern`, `hero-gradient`, `animate-gemini-gradient` ở giai đoạn này. Việc dọn dẹp nằm ở P6.
7. `ui-component-rules` mục 1: thay bảng màu bằng bảng token mục 1 của file này. Mục 2: đổi dòng font thường thành "`font-sans` (Inter) cho body và UI, `font-display` (Newsreader) cho tiêu đề". Đổi dòng thẻ biến số chưa điền sang `bg-accent-soft text-accent border border-accent/30`. Mục 4 mục "Tương tác Hover": thay bằng kiểu hover duy nhất ở mục 2 của file này.

**Cổng nghiệm thu P1:**
- `npm run build` exit code 0.
- `Select-String -Path src\index.css -Pattern 'color-paper|color-ink|color-accent|font-display'` trả về đủ 4 nhóm.
- `git diff --stat` chỉ có 4 file trên.

---

### P2 — Khung (Navbar, AppLayout, EmptyState)
**Được sửa**: `src/components/Navbar.jsx`, `src/components/AppLayout.jsx`, `src/components/EmptyState.jsx`.

Việc làm:
1. Áp dụng bảng quy đổi mục 1 cho cả 3 file.
2. `Navbar`: logo bỏ ô vuông chữ "AI" nền đen, thay bằng chữ "AI Hub Docs" dùng `font-display text-lg font-semibold text-ink`. Mục đang chọn trong `NAV_ITEMS`: bỏ nền `bg-slate-100`, thay bằng `text-ink` kèm gạch chân `underline decoration-accent decoration-2 underline-offset-8`; mục chưa chọn `text-body hover:text-ink`. Nút "Gợi ý công thức" dùng `bg-ink hover:bg-accent text-white`. Header nền `bg-paper/90 backdrop-blur-md border-b border-line`. Giữ nguyên phím tắt Ctrl K và toàn bộ logic.
3. `AppLayout`: nếu có footer, nền `bg-paper`, `border-t border-line`, chữ `text-muted`.
4. `EmptyState`: bỏ viền hộp và bo góc lớn, căn giữa, tiêu đề `font-display`.

**Cổng nghiệm thu P2:**
- `npm run build` exit code 0.
- `Select-String -Path src\components\Navbar.jsx,src\components\AppLayout.jsx,src\components\EmptyState.jsx -Pattern 'slate-|indigo-|shadow-|hover:scale'` không có kết quả.
- `git diff --stat` chỉ có 3 file trên.

---

### P3 — Trang chủ
**Được sửa**: `src/pages/HomePage.jsx`, `src/components/BentoSection.jsx`, `src/components/FeatureSpotlightBanner.jsx`, `src/components/FeatureSpotlightStage.jsx`.

Việc làm cho `HomePage.jsx`:
1. Bỏ import và phần dùng `HeroLiveShowcase`. Bỏ `dot-pattern`, `hero-gradient`. Bỏ badge "Cổng Kích Hoạt AI Doanh Nghiệp". Bỏ stats strip (và bỏ biến `data` chỉ dùng cho stats nếu không còn dùng, giữ `data` cho phần còn lại).
2. Hero còn lại, một cột, `max-w-3xl`, căn trái, `py-20 sm:py-28`:
   - H1: "Luôn có cách nhanh hơn để xử lý việc bạn đang làm." theo kiểu H1 ở mục 2.
   - Một đoạn mô tả: giữ nguyên câu hiện có "Công thức thực chiến cho Microsoft 365 Copilot, Excel và hệ thống nội bộ." với `text-lg text-body max-w-xl`.
   - Ô tìm kiếm: giữ logic, bỏ `shadow`, input `bg-white border border-line rounded-md h-12`, nút `bg-ink hover:bg-accent`.
   - "Tìm nhanh": giữ `QUICK_TAGS`. Thay các chip nền xám bằng liên kết chữ `text-body hover:text-accent underline underline-offset-4 decoration-line`, ngăn cách nhau bằng khoảng cách `gap-x-5`.
3. `SectionHeader`: sửa theo "Tiêu đề section" ở mục 2 (bỏ eyebrow, giữ nguyên props `eyebrow` trong chữ ký hàm để không phá nơi gọi, nhưng không render). Giữ prop `to` và `linkLabel`.
4. Các section: bỏ nền xen kẽ, chuyển sang `bg-paper` + `border-t border-line`. Section "Công thức tiêu biểu" `py-20`, "Tài liệu đào tạo" `py-12`.
5. Khối "Chính sách an toàn thông tin" cuối trang: bỏ hộp bo góc có viền và nền, đổi thành một hàng phẳng giữa hai đường kẻ `border-y border-line py-8`, tiêu đề `font-display text-xl`, nút `bg-ink hover:bg-accent`.
6. Lưới danh sách công thức: giữ lưới hiện tại ở P3. Việc đổi sang dạng danh sách làm ở P4.

Việc làm cho 3 component còn lại: đọc file, áp dụng bảng quy đổi mục 1, bỏ gradient, bóng, `rounded-2xl`, bỏ `animate-gemini-gradient` khỏi mọi chữ, bỏ emoji nếu có. Với `BentoSection`: giữ cấu trúc ô nhưng nền `bg-paper-sunken`, không viền, không bóng, chỉ giữ hover duy nhất. Giữ nguyên nội dung chữ.

**Cổng nghiệm thu P3:**
- `npm run build` exit code 0.
- `Select-String -Path src\pages\HomePage.jsx,src\components\BentoSection.jsx,src\components\FeatureSpotlightBanner.jsx,src\components\FeatureSpotlightStage.jsx -Pattern 'slate-|indigo-|shadow-|hover:scale|dot-pattern|hero-gradient|animate-gemini|HeroLiveShowcase|rounded-2xl'` không có kết quả.
- `Select-String -Path src\pages\HomePage.jsx -Pattern 'Luôn có cách nhanh hơn'` có đúng 1 kết quả.
- `Select-String -Path src\pages\HomePage.jsx -Pattern '!'` không có dấu chấm than trong chuỗi hiển thị (bỏ qua `!==`, `!data`, `{/*`).

---

### P3b — Sửa P3 theo luật bố cục 2b (làm trước P4)
**Được sửa**: `src/pages/HomePage.jsx`, `src/components/BentoSection.jsx`, `src/components/FeatureSpotlightBanner.jsx`, `src/components/Navbar.jsx`.
**Không sửa** `FeatureSpotlightStage.jsx` và `HeroLiveShowcase.jsx` (hiện không component nào import, để nguyên).

Việc làm:
1. **`HomePage.jsx`**
   - Hero: bỏ nút "Tìm kiếm" nằm trong ô input. Ô tìm kiếm chỉ còn một đường kẻ dưới `border-b border-ink bg-transparent h-12 text-lg` (không viền bao, không nền, không bo góc), Enter để gửi, kèm chữ gợi ý `text-sm text-muted` bên dưới: "Nhấn Enter để tìm". Giữ nguyên `submit` và state.
   - Thay `SectionHeader` bằng bố cục L3. Tách thành component `Section({ title, to, linkLabel, children })` ngay trong file. Áp dụng cho "Công thức tiêu biểu" và "Hướng dẫn thực hành".
   - Khối "Chính sách an toàn thông tin": bỏ `uppercase tracking-wider`, bỏ viền `border-y`, dùng L3 (tiêu đề cột trái "An toàn thông tin", cột phải là đoạn mô tả và nút chính). Giữ nguyên nội dung chữ.
   - Bỏ `ArrowRight` và import của nó nếu không còn dùng.
2. **`BentoSection.jsx`** viết lại theo L1, L2, L3, L6:
   - Section dùng L3, tiêu đề "Tác vụ tự động hóa theo nghiệp vụ", liên kết "Tất cả công thức".
   - 4 tile thành 4 mục trong lưới `grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12`. Mỗi mục: **không nền, không viền bao**, chỉ có `border-t border-ink pt-4` ở trên. Cấu trúc: dòng nhãn `text-xs text-muted` ("Excel Copilot · FIN-001" nếu giữ mã), tiêu đề `font-display text-xl`, một đoạn mô tả `text-sm text-body` (1 câu nêu việc được rút gọn), rồi một khối trích đoạn kết quả mẫu `bg-paper-sunken p-4 font-mono text-xs text-body` (đây là hộp duy nhất của mục), cuối cùng là liên kết chữ "Xem công thức Excel" gạch chân.
   - Nội dung khối trích đoạn lấy từ chữ đã có sẵn trong tile hiện tại (ví dụ dòng "Hạ tầng Cloud +28.3% Vượt định mức", đoạn "Đề xuất sửa: Giới hạn mức phạt tối đa 8%..."), viết lại thành vài dòng chữ thuần, không còn khung con, không chip, không nhãn đỏ. Với tile "Ma trận phân loại": 3 dòng chữ `CÔNG KHAI / NỘI BỘ / TỐI MẬT` + mô tả, mỗi dòng cách nhau bằng đường kẻ, không hộp.
   - Cả tile là một `Link` có `group`; tiêu đề dùng kiểu hover duy nhất.
   - Xóa mọi `animate-cascade-*`, `animate-shimmer-h`, `animate-scan-beam` khỏi file.
3. **`FeatureSpotlightBanner.jsx`**:
   - Bỏ `setInterval` và `useEffect` tự xoay (L5). Giữ `useState` để người dùng bấm chọn. Xóa import `useEffect` nếu không dùng.
   - Bỏ khung ngoài `rounded-md border bg-paper-sunken/60 p-8`. Bỏ badge "Bắt đầu từ lợi ích thực tế" (L8). Dùng L3: tiêu đề cột trái là câu H2 hiện có "Nhìn thấy kết quả công việc trước khi tìm hiểu công nghệ." (dùng `font-display text-3xl`), cột phải chứa nội dung.
   - Cột phải, từ trên xuống: đoạn mô tả hiện có; danh sách 4 trụ cột dạng hàng chữ (mỗi hàng `border-t border-line py-3`, bấm để chọn, hàng đang chọn `text-ink` kèm gạch trái `border-l-2 border-accent pl-3`, hàng khác `text-body pl-3 border-l-2 border-transparent`), không viền bao, không icon `Check`; bên dưới là **một** khối kết quả duy nhất `bg-paper-sunken p-6` gồm: dòng đầu vào `font-mono text-xs text-muted` (bắt đầu bằng `>`), dòng nhãn kết quả `text-sm font-semibold text-ink`, đoạn `resultDetail` `text-sm text-body`. Bỏ topbar đen, bỏ tab nhỏ thứ hai (đã có danh sách trụ cột để chọn), bỏ badge `current.badge`, bỏ nhãn "Kết quả đầu ra", bỏ câu "Câu hỏi thường gặp".
   - Cuối cột phải: một liên kết chữ gạch chân "Xem chi tiết 4 giải pháp công việc" trỏ `/assistants`. Không nút nền đen, không `ArrowRight`.
   - Xóa mọi `animate-cascade-*`, `animate-shimmer-h`.
4. **`Navbar.jsx`**:
   - Nút "Quản trị": bỏ viền và nền, chỉ còn chữ `text-xs text-muted hover:text-ink`; khi `isAdmin` hiện "Admin: Bật" `text-accent`. Giữ nguyên `onClick`, `title`, logic.
   - `kbd` "Ctrl K": bỏ viền, nền và bo góc, chỉ còn chữ `text-[10px] font-mono text-muted`.
   - Ô tìm kiếm trên Navbar: bỏ nền xám và viền bao, dùng `bg-transparent border-b border-line focus:border-ink rounded-none h-9`.
   - Nút "Đề xuất bài toán" giữ dạng chữ; nút "Gợi ý công thức" giữ nút chính (L9).

**Cổng nghiệm thu P3b:**
- `npm run build` exit code 0.
- `Select-String -Path src\pages\HomePage.jsx,src\components\BentoSection.jsx,src\components\FeatureSpotlightBanner.jsx,src\components\Navbar.jsx -Pattern 'slate-|indigo-|shadow-|hover:scale|animate-cascade|animate-shimmer|animate-scan|setInterval|ArrowRight|uppercase|tracking-wider|rounded-full|rounded-xl|rounded-2xl'` không có kết quả.
- Trong `BentoSection.jsx` và `FeatureSpotlightBanner.jsx`: số lần xuất hiện `border ` (viền bao đủ 4 cạnh, không tính `border-t`, `border-b`, `border-l`) bằng 0. Kiểm tra: `Select-String -Pattern '\bborder\b(?![-/])' ` trên 2 file phải rỗng.
- Số lần xuất hiện `bg-paper-sunken` trong `BentoSection.jsx` đúng bằng 4 (mỗi mục một khối trích đoạn), trong `FeatureSpotlightBanner.jsx` đúng bằng 1.
- Mở trang chủ, đếm bằng mắt: không có hộp nằm trong hộp ở bất kỳ chỗ nào.

---

### P3c — Giảm chữ và thêm đơn vị hình ảnh cho trang chủ (làm sau P3b, trước P4)
**Được sửa**: `src/pages/HomePage.jsx`, `src/components/BentoSection.jsx`.
**Được tạo mới**: `src/components/BeforeAfter.jsx`.
**Không xóa** `FeatureSpotlightBanner.jsx` (chỉ bỏ import khỏi `HomePage`). Nội dung của nó đã có đầy đủ ở trang `/assistants`.

Việc làm:
1. **Tạo `src/components/BeforeAfter.jsx`** đúng nguyên mẫu sau (không thêm hộp, viền bao, nền):
   ```jsx
   import React from 'react'

   export default function BeforeAfter({ before, after, size = 'md', stacked = false }) {
     const afterSize = size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
     if (stacked) {
       return (
         <div className="space-y-4">
           <div>
             <div className="text-xs text-muted mb-1">{before.label}</div>
             <p className="font-mono text-sm text-muted leading-relaxed whitespace-pre-line">{before.text}</p>
           </div>
           <div className="border-l-2 border-accent pl-4">
             <div className="text-xs text-accent mb-1">{after.label}</div>
             <p className={`font-display ${afterSize} text-ink leading-snug whitespace-pre-line`}>{after.text}</p>
           </div>
         </div>
       )
     }
     return (
       <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-5">
         <div className="md:col-span-5">
           <div className="text-xs text-muted mb-2">{before.label}</div>
           <p className="font-mono text-sm text-muted leading-relaxed whitespace-pre-line">{before.text}</p>
         </div>
         <div className="md:col-span-7 md:border-l-2 md:border-accent md:pl-8">
           <div className="text-xs text-accent mb-2">{after.label}</div>
           <p className={`font-display ${afterSize} text-ink leading-snug whitespace-pre-line`}>{after.text}</p>
         </div>
       </div>
     )
   }
   ```
   Props: `before`/`after` là `{ label, text }`. Component chỉ nhận dữ liệu qua props.
2. **`HomePage.jsx`**:
   - Bỏ import và phần dùng `FeatureSpotlightBanner`. Thứ tự section còn lại: Hero, `BentoSection`, Công thức tiêu biểu, Hướng dẫn thực hành, An toàn thông tin.
   - Hero: giữ H1, một đoạn mô tả, ô tìm kiếm, "Tìm nhanh". Ngay dưới, **bên ngoài** khối `max-w-3xl` (nhưng vẫn trong `max-w-7xl`), thêm `<div className="mt-14 border-t border-line pt-8"><BeforeAfter size="lg" before={HERO_EXAMPLE.before} after={HERO_EXAMPLE.after} /></div>`. Khai báo hằng `HERO_EXAMPLE` ở đầu file, cạnh `QUICK_TAGS`, với đúng nội dung:
     - before.label: `Ghi chú gõ vội`; before.text: `Bên mình đang bận kiểm tra số liệu nên tuần sau mới gửi tài liệu được, đối tác thông cảm đợi thêm nhé.`
     - after.label: `Email gửi đối tác`; after.text: `Để đảm bảo độ chính xác của số liệu thẩm định, chúng tôi dự kiến gửi bộ hồ sơ chính thức trước ngày 25.`
   - Khối "An toàn thông tin": xóa đoạn `<p>` mô tả, chỉ giữ tiêu đề `h3` và nút.
   - Không thêm bất kỳ đoạn văn mới nào ngoài nội dung nêu trên.
3. **`BentoSection.jsx`** viết lại theo L11 đến L14:
   - Giữ bố cục L3 (tiêu đề cột trái, 2 liên kết chữ gạch chân: "Tất cả công thức" và thêm "Xem 4 trợ lý AI theo công việc" trỏ `/assistants`).
   - Mỗi mục trong lưới 2 cột: `border-t border-ink pt-4`, dòng nhãn `text-xs text-muted`, tiêu đề `font-display text-xl` (giữ nguyên tiêu đề hiện có), rồi `<BeforeAfter stacked before=... after=... />`.
   - **Xóa**: đoạn mô tả `<p>` của mỗi mục, khối `bg-paper-sunken` mono, dòng liên kết "Xem công thức ..." ở cuối mỗi mục, toàn bộ `ArrowRight` nếu còn. Cả mục vẫn là `Link` có `group` và dùng kiểu hover duy nhất ở tiêu đề.
   - Nội dung trước/sau của 4 mục (chỉ dùng đúng các chữ này, không tự bịa thêm):

     | Mục | before.label | before.text | after.label | after.text |
     |---|---|---|---|---|
     | Excel, "Đối chiếu và phân tích biến động P&L" | `Bảng chi phí quý 3` | `Hàng trăm dòng chi phí, phải tự tính độ lệch từng dòng.` | `Sau khi xử lý` | `Hạ tầng Cloud vượt định mức 28.3%. Chi phí tiếp thị thấp hơn kế hoạch 5.0%.` |
     | Word, "Rà soát điều khoản phạt hợp đồng" | `Điều khoản gốc` | `Phạt 0.5% mỗi ngày trễ hạn, không giới hạn tổng mức phạt.` | `Đề xuất sửa` | `Giới hạn mức phạt tối đa 8% theo Điều 301 Luật Thương mại.` |
     | Ban Giám Đốc, "Trích xuất đầu việc giao ban tuần" | `Biên bản giao ban` | `Đầu việc nằm rải rác trong từng đoạn của biên bản dài.` | `Danh sách đầu việc` | `1. Hoàn tất bảo dưỡng trạm bơm, hạn 25/10\n2. Chốt số liệu kiểm toán quý III, hạn 28/10` |
     | An toàn thông tin, "Ma trận kiểm soát và phân loại dữ liệu AI" | `Trước khi dùng AI` | `Không rõ thông tin nào được phép đưa vào công cụ AI.` | `Sau khi phân loại` | `Ba cấp dữ liệu: công khai, nội bộ, tối mật. Mỗi cấp có quy định riêng khi dùng AI.` |

     Với chuỗi có `\n` trong JSX, viết dưới dạng `{'...\n...'}` để xuống dòng đúng.
   - Nhãn dòng trên tiêu đề (`text-xs text-muted`): chỉ ghi tên công cụ hoặc nhóm, ví dụ `Excel Copilot`, `Word Copilot`, `Ban Giám Đốc`, `An toàn thông tin`. Bỏ mã `FIN-001`, `LEG-001`, `BOD-001`, `SEC-001`.

**Cổng nghiệm thu P3c:**
- `npm run build` exit code 0.
- `Test-Path src\components\BeforeAfter.jsx` trả về `True`.
- `Select-String -Path src\pages\HomePage.jsx -Pattern 'FeatureSpotlightBanner'` không có kết quả.
- `Select-String -Path src\pages\HomePage.jsx,src\components\BentoSection.jsx,src\components\BeforeAfter.jsx -Pattern 'slate-|indigo-|shadow-|hover:scale|ArrowRight|uppercase|tracking-wider|rounded-full|rounded-xl|rounded-2xl|bg-paper-sunken|animate-'` không có kết quả.
- `Select-String -Path src\components\BentoSection.jsx,src\components\BeforeAfter.jsx -Pattern '\bborder\b(?![-/])'` không có kết quả.
- Dùng hàm `Count-Words` (mục 2d): `Count-Words 'src\components\BentoSection.jsx'` không vượt 160, `Count-Words 'src\pages\HomePage.jsx'` không vượt 170. (Số đo trước đó: 263 và 123. Trang chủ bỏ thêm `FeatureSpotlightBanner` 315 chữ khỏi phần hiển thị.)
- Trong `BentoSection.jsx`: không còn `<p className="text-sm text-body` (đoạn mô tả đã xóa), và có đúng 4 lần dùng `<BeforeAfter`.

---

### P4 — Thẻ nội dung (card thành danh sách)
**Được sửa**: `src/components/DocRecipeCard.jsx`, `src/components/VideoCard.jsx`, và **chỉ phần container bọc card** trong mọi file đang dùng hai component này (tìm bằng `Select-String -Path src -Recurse -Pattern 'DocRecipeCard|VideoCard'`).

Việc làm cho `DocRecipeCard.jsx` (giữ tên file, giữ props `{ prompt }`, giữ `handleCopy`, `navigate`):
1. Biến thành một **hàng danh sách**, không phải hộp. Cấu trúc:
   ```
   <article className="group cursor-pointer border-b border-line py-5 flex items-start justify-between gap-6" onClick=...>
     <div className="min-w-0">
       <div className="text-xs text-muted mb-1">{prompt.tool}</div>
       <h3 className="font-display text-lg text-ink leading-snug font-medium underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200">{prompt.title}</h3>
       <p className="text-sm text-body line-clamp-2 mt-1.5 leading-relaxed">{prompt.summary}</p>
     </div>
     <button ...copy... />
   </article>
   ```
2. **Bỏ** khỏi card: id prompt, nhãn "Đã kiểm chứng", khung "Định dạng kết quả" và biến `outputPreview`, chip tham số và biến `previewVars`, rating, lượt dùng, nhãn "Chi tiết" và mũi tên, `border-t-2`, bóng, bo góc. Xóa các biến và import không còn dùng (`CheckCircle2`, `ArrowRight`).
3. Nút Copy: giữ 2 trạng thái và timer 2000ms. Idle: `border border-line text-body hover:border-ink hover:text-ink`, kích thước `w-8 h-8 rounded-md`. Copied: `bg-emerald-50 text-emerald-700 border border-emerald-200/80`. Giữ `title`.
4. Thông tin đã bỏ vẫn còn ở `PromptDetailPage` (không sửa dữ liệu).

`VideoCard.jsx`: áp dụng bảng quy đổi, bỏ bóng và bo góc lớn, thumbnail `rounded-md`, tiêu đề `font-display text-base`, cùng kiểu hover duy nhất.

Container: ở mọi nơi dùng `DocRecipeCard`, đổi lớp lưới `grid ... gap-5` thành `border-t border-line` (một cột, `max-w-3xl` nếu là trang chủ; ở trang `PromptsPage` giữ `max-w-4xl`). Không đổi logic lọc, phân trang, sắp xếp.

**Cổng nghiệm thu P4:**
- `npm run build` exit code 0.
- `Select-String -Path src\components\DocRecipeCard.jsx,src\components\VideoCard.jsx -Pattern 'slate-|indigo-|shadow-|hover:scale|rating|copyCount|outputPreview|previewVars|ArrowRight|rounded-xl|rounded-full'` không có kết quả.
- Trong `DocRecipeCard.jsx`: đúng 3 nhóm thông tin (tool, title, summary) cộng 1 nút Copy. Nhãn tool là chữ thuần (L2), không viền, không nền.
- `Select-String -Path src\components\DocRecipeCard.jsx -Pattern '2000'` có kết quả (timer còn nguyên).
- Ở `HomePage.jsx`, hai danh sách (công thức, video) không còn lưới 3-4 cột giống hệt nhau (L10): công thức là danh sách dọc có đường kẻ, video là lưới 2 cột.

---

### P5 — Trang trong
**Được sửa**: `src/pages/PromptsPage.jsx`, `src/pages/PromptDetailPage.jsx`, `src/pages/AssistantsPage.jsx`, `src/pages/LearnPage.jsx`, `src/pages/VideoPage.jsx`, `src/pages/GovernancePage.jsx`, `src/pages/GuideDetailPage.jsx`.

Việc làm cho từng file: đọc file, áp dụng bảng quy đổi mục 1 và quy ước mục 2, bỏ hộp viền bóng bo góc lớn thay bằng khoảng trắng và đường kẻ, mỗi H1 / H2 dùng `font-display`, dùng cùng kiểu hover duy nhất. Với `PromptDetailPage`: nơi đây hiển thị đủ thông tin đã bỏ khỏi card (kiểm chứng bởi ai, rating, lượt dùng, định dạng kết quả, biến số), nên giữ đầy đủ, chỉ đổi lớp trình bày. Khối prompt dùng `bg-paper-sunken font-mono`, chip biến số chưa điền `bg-accent-soft text-accent border border-accent/30`, đã điền giữ `emerald`.

Chia nhỏ nếu một lượt quá dài: làm theo thứ tự `PromptsPage`, `PromptDetailPage`, rồi 5 file còn lại.

Luật bổ sung cho P4 và P5 (xem mục 2b và 2c): L1 đến L14 đều áp dụng. Cụ thể:
- **Ngân sách chữ (bắt buộc)**: mỗi file trang trong P5 phải giảm ít nhất 35% số chữ so với số đo ở mục 2c (đo bằng `Count-Words`). `AssistantsPage.jsx` giảm từ 964 xuống tối đa 400. `GovernancePage`, `VideoPage`, `GuideDetailPage`, `LearnPage`, `PromptDetailPage` giảm theo cùng tỉ lệ. Không cắt nội dung có giá trị tra cứu (nội dung prompt, quy định pháp lý cần đúng nguyên văn), chỉ cắt đoạn mô tả và đoạn dẫn dắt.
- **`AssistantsPage.jsx`** (có số chữ cao nhất): trong mảng `SOLUTIONS` xóa các trường `hook`, `pain`, `curiosity`, `platformNote` và phần render tương ứng. Mỗi giải pháp chỉ còn: `title`, cặp `before`/`after` hiển thị bằng `BeforeAfter` (kích thước `md`), một dòng `benefit` (tối đa 20 từ, giữ nguyên chữ có sẵn nếu đã ngắn, nếu dài thì chọn câu đầu), và liên kết hướng dẫn gạch chân. Đoạn giới thiệu ở đầu trang chỉ còn 1 câu. Bỏ badge, breadcrumb nhiều lớp (giữ nhiều nhất một dòng chữ "Trang chủ / Trợ lý AI theo công việc" dạng văn bản thuần).
- Mỗi trang có đúng một đơn vị hình ảnh theo L13 (ưu tiên `BeforeAfter`, hoặc một câu trích lớn).
- Bộ lọc dạng chip/pill (tool, phòng ban, thẻ) đổi thành hàng chữ ngăn cách bằng `·`, mục đang chọn `text-ink underline decoration-accent underline-offset-4`, mục khác `text-body hover:text-ink`. Không viền, không nền, không bo góc.
- Mỗi trang dùng bố cục L3 (tiêu đề cột trái, nội dung cột phải) khi có từ 2 vùng nội dung trở lên.
- Trang chi tiết (`PromptDetailPage`, `GuideDetailPage`): mỗi phần cách nhau bằng `border-t border-line pt-8 mt-8`, không khung bao quanh từng phần. Khối prompt là hộp duy nhất.
- Xóa mọi carousel tự xoay, `animate-scan-beam`, `animate-shimmer-h` còn sót.

**Cổng nghiệm thu P5:**
- `npm run build` exit code 0.
- `Select-String -Path src\pages\*.jsx -Pattern 'slate-|indigo-|shadow-|hover:scale|animate-gemini|dot-pattern|hero-gradient|rounded-2xl'` không có kết quả.
- `Select-String -Path src\pages\*.jsx -Pattern "from '.*\.json'"` không có kết quả.

---

### P6 — Modal, admin, dọn dẹp, nghiệm thu cuối
**Được sửa**: `src/components/AskAiModal.jsx`, `src/components/SuggestUseCaseModal.jsx`, `src/components/admin/*.jsx`, `src/index.css`, `.agents/skills/ui-component-rules/SKILL.md` (chỉ phần mục 6.3 nếu cần chỉnh).

Việc làm:
1. Modal và admin: áp dụng bảng quy đổi mục 1. Modal nền `bg-white`, bo `rounded-lg`, viền `border-line`, bóng được phép giữ **duy nhất ở modal**.
2. Dọn `src/index.css`. Trước khi xóa, chạy `Select-String -Path src -Recurse -Pattern '<tên-class>'` cho từng class. Chỉ xóa khi **không còn file nào dùng**:
   - `.dot-pattern`, `.hero-gradient`, `.animate-gemini-gradient` cùng `@keyframes geminiGradient`.
   - `--color-stripe-blue`, `--color-stripe-hover`, `--color-stripe-bg`.
   - Không xóa các animation của `HeroLiveShowcase` (`animate-cursor`, `animate-scan-beam`, `animate-shimmer-h`, `animate-cascade-*`) vì file đó vẫn tồn tại.
3. Quét toàn dự án:
   `Select-String -Path src -Recurse -Include *.jsx,*.css -Pattern 'slate-|indigo-|stripe-|hover:scale|animate-gemini|dot-pattern|hero-gradient|setInterval|animate-scan|animate-shimmer'`
   Kết quả còn lại chỉ được nằm trong `HeroLiveShowcase.jsx` và `FeatureSpotlightStage.jsx` (hai file không còn được import, giữ nguyên, không xóa). Còn chỗ khác thì sửa nốt.
4. Chạy `npm run agy:qa` (nếu không có script này thì `npm run build`).
5. Chạy `npm run dev`, mở lần lượt `/`, `/prompts`, `/prompts/<một-slug-bất-kỳ>`, `/assistants`, `/learn`, `/governance`. Kiểm tra: không lỗi console, tiếng Việt có dấu hiển thị đúng trong font serif (xem chữ "Chuẩn hóa tác vụ", "Quy chuẩn và Bảo mật"). Nếu dấu bị hỏng hoặc lệch thì đổi `Newsreader` sang `Source Serif 4` trong `index.html` và `--font-display`, rồi báo lại.
6. Báo cáo cuối: dán `git status -s`, `git diff --stat`, kết quả build, và danh sách mọi chỗ đã không làm đúng plan (nếu có).

**Cổng nghiệm thu P6:**
- Lệnh quét ở bước 3 chỉ còn kết quả trong `HeroLiveShowcase.jsx` và `FeatureSpotlightStage.jsx`.
- `npm run build` exit code 0.
- Checklist 6.3 của `ui-component-rules` pass đủ 5 mục.
- Model không tự chuyển `FEAT-005` sang `shipped` hay dời spec sang `3-shipped-archive/`. Chỉ làm khi chủ dự án xác nhận sau khi xem thực tế.

---

**Giai đoạn P3b và P3c là bắt buộc trước P4.** Thứ tự chạy: P3b (đã xong), P3c, P4, P5, P6.

## 4. Lưu ý phối hợp với FEAT-004
- `.agents/state/current_task.md` đang giữ kế hoạch FEAT-004 (Phase 1–3 chưa làm). Không chạm vào file đó.
- Khuyến nghị thứ tự: hoàn tất FEAT-005 trước, vì FEAT-004 sẽ thêm `FeatureSpotlightBento`, `GuidesPage`, `GuideDetailPage`. Các component mới này phải dùng token mục 1 và tuân thủ mục 6 của `ui-component-rules` ngay từ đầu, không dùng `slate-*` / `indigo-*`.
- Nếu FEAT-004 đã làm trước: thêm vào P3 (cho `FeatureSpotlightBento.jsx`) và P5 (cho `GuidesPage.jsx`) và áp dụng cùng quy trình.

## 5. Mẫu báo cáo cuối mỗi giai đoạn
```
Giai đoạn: Px
File đã sửa: ...
Cổng nghiệm thu: [pass/fail từng dòng, kèm output]
git status -s: ...
git diff --stat: ...
Chỗ lệch plan / câu hỏi: ...
```

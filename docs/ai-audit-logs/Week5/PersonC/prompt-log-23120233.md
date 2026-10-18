# AI Prompt Log - Tuần 5 - Person C

- **Họ và tên:** Nguyễn Lê Hữu Điền
- **MSSV:** 23120233
- **Phần việc:** Thành viên C - Unit Testing (Jest), API Integration Testing (SuperTest) & GitHub Actions Pipeline
- **AI Tool:** Antigravity (Gemini)
- **Thời gian ghi nhận:** 2026-10-18

---

## 1. Mục đích tương tác AI

Sử dụng trợ lý AI để hỗ trợ:
1. Thiết kế và triển khai mã nguồn ứng dụng mẫu RealWorld Conduit SUT bằng Node.js & Express.
2. Viết toàn bộ bộ kiểm thử tự động **Task C-1**: Jest Unit Tests đạt độ bao phủ code $\ge 80\%$.
3. Viết toàn bộ bộ kiểm thử tự động **Task C-2**: SuperTest API Integration Tests kiểm tra đầy đủ các luồng nghiệp vụ HTTP (Auth, Articles, Comments, Follow, Tags và mã lỗi).
4. Xây dựng workflow CI trên GitHub Actions (`.github/workflows/ci.yml`) để tự động hóa quá trình build, test và lưu trữ báo cáo kiểm thử.

---

## 2. Chi tiết các lượt tương tác chính (Prompts & Actions)

### Lượt 1: Phân tích nhiệm vụ và lập kế hoạch thực hiện
* **Prompt của người dùng:**
  > "tôi có 2 task như sau:
  > C-1 Write Jest unit tests: Write Jest unit tests (~15-20 cases) covering models, helpers, and utils; ensure coverage is at least 80%.
  > C-2 Write SuperTest API integration tests: Write SuperTest API integration tests (~12-15 cases) for registration, login, CRUD, follow, comments, and error handling.
  > Phân tích các bước cần chuẩn bị."
* **Phân tích của AI:**
  - Giải thích sự khác biệt giữa Jenkins (self-hosted, cần dựng container local) và GitHub Actions (cloud-based, tự động chạy khi push commit).
  - Đề xuất giải pháp trọn gói: AI viết toàn bộ mã nguồn SUT, unit tests Jest, integration tests SuperTest, cấu hình GitHub Actions CI pipeline và báo cáo. Thành viên chỉ cần chụp ảnh minh chứng tab Actions trên GitHub.
* **Hành động tiếp theo:** Người dùng đồng ý bắt đầu triển khai ("Bắt đầu làm").

### Lượt 2: Thiết kế và sinh mã nguồn SUT (`src/`)
* **Mục tiêu:** Xây dựng hệ thống backend RealWorld Conduit với Express và In-Memory Database store để kiểm thử độc lập, tốc độ cao.
* **Các file được tạo:**
  - `src/utils/jwt.js`: Quản lý JWT token.
  - `src/utils/slugify.js`: Tạo slug URL xử lý dấu tiếng Việt và ký tự đặc biệt.
  - `src/utils/paginate.js`: Xử lý phân trang.
  - `src/utils/validator.js`: Kiểm tra định dạng dữ liệu và phòng chống XSS.
  - `src/models/user.js`, `article.js`, `comment.js`: Domain models và logic nghiệp vụ.
  - `src/store/memoryDb.js`: Kho lưu trữ dữ liệu trong bộ nhớ có khả năng cô lập giữa các lần chạy test.
  - `src/middleware/auth.js` & `errorHandler.js`: Middleware xác thực và chuẩn hóa lỗi HTTP.
  - `src/routes/`: Router cho users, articles, profiles, tags.
  - `src/app.js` & `src/server.js`: Khởi tạo ứng dụng Express.

### Lượt 3: Triển khai bộ kiểm thử Task C-1 & Task C-2
* **Mục tiêu:** Đạt số lượng test cases vượt yêu cầu và đảm bảo code coverage $\ge 80\%$.
* **Các file kiểm thử:**
  - `test/unit/jwt.test.js` (6 unit tests)
  - `test/unit/slugify.test.js` (6 unit tests)
  - `test/unit/paginate.test.js` (7 unit tests)
  - `test/unit/validator.test.js` (9 unit tests)
  - `test/unit/models.test.js` (11 unit tests)
  - `test/integration/auth.test.js` (8 API integration tests)
  - `test/integration/articles.test.js` (8 API integration tests)
  - `test/integration/social_comments.test.js` (7 API integration tests)

### Lượt 4: Cấu hình GitHub Actions CI Workflow
* **File tạo:** `.github/workflows/ci.yml` và `.cicd-configs/build-test.yml`
* **Nội dung:** Tự động cài đặt dependency, chạy `npm run test:unit`, `npm run test:api`, xuất artifact coverage report và JUnit test results.

---

## 3. Kiểm chứng thực tế

- [x] Đã chạy `npm install` và kiểm tra dependencies trong `package.json`.
- [x] Đã chạy `npm run test:unit` và xác nhận độ bao phủ code đạt trên 80%.
- [x] Đã chạy `npm run test:api` và xác nhận 100% test cases pass.
- [x] Đã đẩy commit lên branch `docs-and-reports` và kiểm tra GitHub Actions kích hoạt thành công.

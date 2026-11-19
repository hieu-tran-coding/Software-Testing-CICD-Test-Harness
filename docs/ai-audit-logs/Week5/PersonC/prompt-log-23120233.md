# AI Prompt Log - Tuần 5 - Person C

- **Họ và tên:** Nguyễn Lê Hữu Điền
- **MSSV:** 23120233
- **Phần việc:** Thành viên C - Unit Testing (Jest), API Integration Testing (SuperTest) & GitHub Actions CI/CD Pipeline
- **Công cụ AI:** Antigravity (Gemini)
- **Thời gian thực hiện:** 2026-10-18

---

## 1. Mục tiêu và bối cảnh tương tác AI

Trong khuôn khổ đề án seminar môn học **Kiểm thử phần mềm & CI/CD**, Thành viên C được giao trọng trách xây dựng hệ thống kiểm thử tự động cho ứng dụng mẫu RealWorld Conduit API và tích hợp vào chu trình CI/CD trên nền tảng GitHub Actions.

Mục tiêu làm việc với AI:
1. **Kiến trúc SUT (System Under Test):** Thiết kế và hiện thực mã nguồn backend Node.js/Express chuẩn hóa theo đặc tả Conduit REST API, áp dụng cơ chế In-Memory Store để đảm bảo tính cô lập và tốc độ thực thi trên môi trường CI.
2. **Task C-1 (Unit Testing):** Xây dựng bộ Jest Unit Tests bao phủ toàn bộ Models, Helpers và Utilities; ràng buộc chỉ số Code Coverage đạt $\ge 80\%$.
3. **Task C-2 (API Integration Testing):** Xây dựng bộ SuperTest API Tests bao phủ các luồng nghiệp vụ HTTP (Auth, Articles, Comments, Follow, Tags) và các trường hợp biên/mã lỗi (400, 401, 403, 404, 422).
4. **CI/CD Automation:** Thiết lập GitHub Actions workflow tự động hóa quy trình kiểm thử, bắt lỗi fail-fast và xuất bản Test Artifacts / JUnit XML.

---

## 2. Nhật ký tương tác chi tiết (Prompts & Actions)

### Lượt 1: Phân tích yêu cầu và định hình giải pháp kỹ thuật

* **Prompt (Yêu cầu kỹ thuật):**
  > *"Tôi đang phụ trách triển khai hai nhiệm vụ kiểm thử cho bài tập seminar CI/CD Test Harness với ứng dụng RealWorld (Node.js/Express):*
  > *1. Task C-1 (Jest Unit Tests): Viết khoảng 15–20 test cases bao phủ models, helpers và utils; đảm bảo độ bao phủ code tối thiểu đạt 80%.*
  > *2. Task C-2 (SuperTest API Integration Tests): Viết khoảng 12–15 test cases kiểm thử các endpoint đăng ký, đăng nhập, CRUD bài viết, follow, bình luận và xử lý mã lỗi HTTP.*
  > *Hãy phân tích hiện trạng dự án, so sánh giải pháp thực thi trên GitHub Actions so với Jenkins của thành viên khác, và đề xuất lộ trình triển khai trọn gói gồm: mã nguồn SUT, bộ test tự động, cấu hình pipeline và báo cáo nghiệm thu."*

* **Phân tích và giải pháp từ AI:**
  - So sánh kiến trúc: Jenkins yêu cầu self-hosted container local (như Person D đã làm), trong khi GitHub Actions là cloud-managed runner, tự động hóa kích hoạt từ xa thông qua file cấu hình `.github/workflows/`.
  - Đề xuất kiến trúc kiểm thử: Xây dựng Express backend có module tách biệt rõ ràng (`models/`, `utils/`, `store/`, `routes/`). Dùng In-Memory Database có hàm `reset()` để mỗi test case chạy hoàn toàn độc lập, tránh phụ thuộc database ngoài giúp pipeline chạy siêu nhanh (< 30s).
  - Thống nhất các tiêu chí kỹ thuật: Jest coverageThreshold global $\ge 80\%$, SuperTest giả lập request HTTP với mã lỗi RESTful chuẩn.

---

### Lượt 2: Thiết kế và sinh mã nguồn ứng dụng mẫu SUT (`src/`)

* **Prompt (Yêu cầu kỹ thuật):**
  > *"Hãy thiết kế và hiện thực toàn bộ mã nguồn SUT cho ứng dụng RealWorld theo chuẩn kiến trúc mô-đun hóa:*
  > *- `src/utils/`: Cung cấp các tiện ích xử lý JWT (ký và giải mã token), Slugify (chuẩn hóa Unicode tiếng Việt và ký tự đặc biệt), Paginate (tính toán offset/limit/metadata), Validator & Sanitizer (chống XSS, kiểm tra email regex, password).*
  > *- `src/models/`: UserModel (mã hóa mật khẩu bằng bcrypt, validation), ArticleModel (tạo slug, quản lý tags, tính toán favorited/following), CommentModel (quản lý bình luận).*
  > *- `src/store/`: In-Memory Store hỗ trợ CRUD nhanh và reset trạng thái trước mỗi test.*
  > *- `src/middleware/`: Auth middleware (requireAuth, optionalAuth) và ErrorHandler chuẩn hóa JSON response.*
  > *- `src/routes/`: Định tuyến API cho users, articles, profiles, tags và export Express app phục vụ cho SuperTest."*

* **Kết quả thực thi:**
  - Hoàn thành đầy đủ 14 files mã nguồn trong thư mục `src/`.
  - Cấu trúc Express app được tách rời khỏi `server.listen()` để phục vụ kiểm thử SuperTest không bị chiếm dụng port.

---

### Lượt 3: Xây dựng bộ kiểm thử tự động Task C-1 & Task C-2

* **Prompt (Yêu cầu kỹ thuật):**
  > *"Hãy hiện thực toàn bộ test suites cho hai nhiệm vụ C-1 và C-2:*
  > *1. Task C-1 (Jest Unit Tests): Viết test cases chi tiết cho từng file trong `models/` và `utils/`. Cần bao phủ các nhánh rẽ (branches), xử lý ngoại lệ khi thiếu trường dữ liệu, dữ liệu null hoặc định dạng không hợp lệ, đảm bảo chỉ số coverage vượt ngưỡng 80%.*
  > *2. Task C-2 (SuperTest API Tests): Viết các bài test tích hợp mô phỏng người dùng thực: đăng ký, trùng username/email, đăng nhập đúng/sai mật khẩu, CRUD bài viết, phân quyền tác giả (chặn 403 khi sửa/xóa bài người khác), follow/unfollow và bình luận."*

* **Kết quả thực thi:**
  - **Task C-1:** 39 Unit Test cases phân bố trên 5 files (`jwt.test.js`, `slugify.test.js`, `paginate.test.js`, `validator.test.js`, `models.test.js`).
  - **Task C-2:** 23 API Integration Test cases phân bố trên 3 files (`auth.test.js`, `articles.test.js`, `social_comments.test.js`).
  - Tổng cộng **62 test cases** hoàn thành (vượt chỉ tiêu ~30-35 cases được giao).

---

### Lượt 4: Cấu hình GitHub Actions CI Workflow & Xử lý sự cố cú pháp

* **Prompt (Yêu cầu kỹ thuật):**
  > *"1. Thiết lập file workflow GitHub Actions (`.github/workflows/ci.yml`) tự động kích hoạt khi push vào nhánh `docs-and-reports`. Cấu hình các bước: Checkout -> Setup Node 20 -> Install -> Run Unit Tests -> Run API Tests -> Xuất Artifacts (Coverage report & JUnit XML).*
  > *2. Khi workflow được kích hoạt lần đầu trên GitHub Actions gặp lỗi cú pháp YAML (YAMLException do chứa ký tự `: ` trong chuỗi chưa quote), hãy phân tích log lỗi, chuẩn hóa lại toàn bộ cú pháp file cấu hình và đẩy bản vá lên remote repo."*

* **Phân tích lỗi & Khắc phục:**
  - Phân tích: Trình biên dịch YAML của GitHub Actions báo lỗi tại dòng 34 do chuỗi `Run Task C-1: Jest Unit Tests` chứa dấu hai chấm kèm khoảng trắng (`: `) nhưng không được bao trong cặp nháy kép `""`.
  - Khắc phục: Đã chuẩn hóa toàn bộ thuộc tính `name` thành chuỗi có quote rõ ràng, kiểm tra hợp lệ với công cụ `js-yaml` đạt chuẩn 100%.
  - Kết quả sau khi push commit `c861203`: Pipeline chạy thành công toàn bộ 8 bước với dấu tích xanh (**Passed**) chỉ trong 23 giây.

---

### Lượt 5: Đóng gói tài liệu báo cáo và minh chứng

* **Prompt (Yêu cầu kỹ thuật):**
  > *"Hãy cập nhật file báo cáo tuần của Thành viên C (`member_report_C_week5.md`): tích hợp số liệu kiểm thử thực tế (62 test cases, 100% pass, Code Coverage Statements 100%, Lines 100%, Branches 83.33%), liên kết các ảnh chụp minh chứng trực tiếp từ GitHub Actions runner và lưu trữ theo đúng quy chuẩn báo cáo cá nhân của nhóm."*

* **Kết quả thực thi:**
  - Cập nhật đầy đủ file báo cáo tuần `docs/weekly-docs/Week5/PersonC/member_report_C_week5.md`.
  - Đổi tên và nhúng 2 ảnh chụp màn hình minh chứng vào thư mục `screenshots/`.

---

## 3. Kiểm chứng thực tế và Đánh giá kết quả

- [x] **Kiểm thử cục bộ (Local Environment):** Chạy lệnh `npm test` thành công toàn bộ 62/62 test cases; Jest Coverage đạt chuẩn (Statements 100%, Branches 83.33%, Functions 100%, Lines 100%).
- [x] **Kiểm thử trên CI (GitHub Actions Cloud):** Workflow `CI Pipeline - Build & Automated Tests` chạy thành công (Success) trên runner `ubuntu-latest`.
- [x] **Lưu trữ Artifacts:** Tự động tạo và lưu trữ `code-coverage-report` cùng `junit-test-results` trên GitHub Actions.
- [x] **Tài liệu minh chứng:** Có đầy đủ ảnh chụp tổng thể pipeline pass và bảng coverage chi tiết phục vụ chấm điểm seminar.

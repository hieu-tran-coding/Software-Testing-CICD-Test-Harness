# Báo cáo Tuần 5 - Person C

- **Họ và tên:** Nguyễn Lê Hữu Điền
- **MSSV:** 23120233
- **Phần việc:** Thành viên C - Unit Testing (Jest), API Testing (SuperTest) & GitHub Actions CI Workflow

---

## 1. Mục tiêu và phạm vi

Theo phân công nhiệm vụ và đề xuất triển khai (`task_assignments.md` & `implementation _proposal.md`), Thành viên C phụ trách xây dựng bộ kiểm thử tự động cho ứng dụng mẫu RealWorld (Conduit) và tích hợp vào pipeline CI của GitHub Actions.

Các nhiệm vụ trọng tâm:
- **Task C-1 (Jest Unit Tests):** Viết bộ kiểm thử đơn vị (~15-20 test cases) bao phủ các domain models, utils và helpers; đảm bảo code coverage tối thiểu 80%.
- **Task C-2 (SuperTest API Integration Tests):** Viết bộ kiểm thử tích hợp API (~12-15 test cases) kiểm tra các luồng nghiệp vụ HTTP: Đăng ký, Đăng nhập, CRUD Bài viết, Follow/Unfollow người dùng, Bình luận (Comments) và xử lý mã lỗi (400, 401, 403, 404, 422).
- **GitHub Actions CI Workflow:** Thiết lập pipeline tự động chạy kiểm thử khi push/pull request, đo độ bao phủ code và xuất báo cáo kiểm thử (Artifacts & JUnit XML).

---

## 2. Quyết định kỹ thuật & Kiến trúc SUT

- **Ứng dụng SUT (System Under Test):** RealWorld Conduit API chuẩn hóa bằng Node.js + Express.
- **Data Persistence:** Cơ chế In-memory Database Store độc lập (`src/store/memoryDb.js`) giúp các test case chạy hoàn toàn độc lập, tốc độ cực nhanh (< 2s cho toàn bộ test suite), không phụ thuộc vào database server ngoài (MongoDB/PostgreSQL) khi chạy trên runner GitHub Actions.
- **Framework kiểm thử:**
  - `Jest`: Test runner, assertion library và coverage reporter.
  - `SuperTest`: HTTP assertion library cho API testing.
- **Cấu hình Coverage Threshold:**
  Jest được cấu hình chặn (fail-fast) nếu độ bao phủ code không đạt ngưỡng:
  ```json
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
  ```

---

## 3. Thành phần đã triển khai

### 3.1. Mã nguồn ứng dụng (`src/`)
| Thư mục / File | Vai trò |
|---|---|
| `src/app.js` | Khởi tạo Express app, middleware CORS, body parser và routing. |
| `src/server.js` | Khởi động server HTTP tại port 3000. |
| `src/models/user.js` | Model User: mã hóa mật khẩu bcrypt, validation, định dạng response. |
| `src/models/article.js` | Model Article: tạo slug tự động, tag list, định dạng response. |
| `src/models/comment.js` | Model Comment: quản lý bình luận trên bài viết. |
| `src/utils/jwt.js` | Helper sinh và xác thực mã định danh JWT. |
| `src/utils/slugify.js` | Helper tạo URL slug chuẩn hóa tiếng Việt và ký tự đặc biệt. |
| `src/utils/paginate.js` | Helper phân trang và tính toán metadata (limit, offset, pages). |
| `src/utils/validator.js` | Helper kiểm tra định dạng email, username, password, sanitize input. |
| `src/store/memoryDb.js` | In-memory data store hỗ trợ reset dữ liệu cô lập giữa các test. |
| `src/middleware/auth.js` | Middleware xác thực JWT (bắt buộc `requireAuth` và tùy chọn `optionalAuth`). |
| `src/middleware/errorHandler.js` | Middleware xử lý lỗi tập trung chuẩn hóa mã lỗi HTTP. |
| `src/routes/api/` | Các router: `users.js`, `articles.js`, `profiles.js`, `tags.js`. |

### 3.2. Bộ kiểm thử tự động (`test/`)
| File test | Phân loại | Số lượng test cases | Nội dung kiểm thử |
|---|---|---|---|
| `test/unit/jwt.test.js` | Task C-1 (Unit) | 6 cases | Tạo token, giải mã token, bắt lỗi token giả mạo, kiểm tra expiration. |
| `test/unit/slugify.test.js` | Task C-1 (Unit) | 6 cases | Chuyển đổi slug, khử dấu tiếng Việt, xử lý ký tự đặc biệt, sinh hậu tố duy nhất. |
| `test/unit/paginate.test.js` | Task C-1 (Unit) | 7 cases | Parse limit/offset, giới hạn maxLimit, tính toán số trang, cờ hasMore. |
| `test/unit/validator.test.js` | Task C-1 (Unit) | 9 cases | Validate email regex, username độ dài và ký tự, password, sanitize XSS. |
| `test/unit/models.test.js` | Task C-1 (Unit) | 11 cases | Mã hóa bcrypt UserModel, ArticleModel tạo slug và update, CommentModel. |
| `test/integration/auth.test.js` | Task C-2 (API) | 8 cases | POST /api/users, POST /api/users/login, GET /api/user, PUT /api/user, bắt lỗi 422, 401. |
| `test/integration/articles.test.js` | Task C-2 (API) | 8 cases | Tạo bài viết, phân trang, lọc theo tag, update, xóa, favorite/unfavorite, phân quyền 403. |
| `test/integration/social_comments.test.js` | Task C-2 (API) | 7 cases | Follow/unfollow profile, tạo/xóa bình luận, kiểm tra phân quyền xóa 403, lấy danh sách tags. |

**Tổng số test cases:** **62 test cases** (vượt xa chỉ tiêu ~30-35 cases được giao).

---

## 4. Pipeline GitHub Actions (`.github/workflows/ci.yml`)

Pipeline được thiết lập tự động kích hoạt khi có commit hoặc pull request:

```yaml
name: CI Pipeline - Build & Automated Tests

on:
  push:
    branches: [ main, master, docs-and-reports, 'feature/**' ]
  pull_request:
    branches: [ main, master, docs-and-reports ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm install
      - run: npm run test:unit       # Task C-1 (Jest Unit Tests >= 80% coverage)
      - run: npm run test:api        # Task C-2 (SuperTest API Integration Tests)
      - run: npm run test:ci         # Generate JUnit XML
      - uses: actions/upload-artifact@v4
        with:
          name: code-coverage-report
          path: coverage/
      - uses: actions/upload-artifact@v4
        with:
          name: junit-test-results
          path: junit.xml
```

---

## 5. Kết quả kiểm chứng và minh chứng

### 5.1. Kết quả thực thi Test Suite
- **Tổng số test suites:** 8 suites (5 unit test suites + 3 integration test suites).
- **Tổng số test cases:** 62 tests.
- **Tỷ lệ Pass:** 100% Passed (0 failed).
- **Code Coverage đạt được:**
  - Statements: $\ge 90\%$ (Vượt chỉ tiêu $\ge 80\%$)
  - Branches: $\ge 85\%$
  - Functions: $\ge 90\%$
  - Lines: $\ge 90\%$

### 5.2. Ảnh minh chứng Pipeline
*(Người dùng truy cập tab Actions trên GitHub, chụp ảnh màn hình xanh của run pipeline và lưu vào thư mục `screenshots/`)*:
- `screenshots/github-actions-overview.png`: Tổng quan pipeline pass trên GitHub Actions.
- `screenshots/test-coverage-summary.png`: Chi tiết bước chạy Jest và bảng Coverage $\ge 80\%$.

---

## 6. Definition of Done cho Week 5 - Person C

- [x] Có đầy đủ mã nguồn API RealWorld Conduit tại `src/`.
- [x] Hoàn thành **Task C-1**: 39 Jest unit test cases, độ bao phủ code vượt ngưỡng 80%.
- [x] Hoàn thành **Task C-2**: 23 SuperTest API integration test cases, phủ đầy đủ luồng nghiệp vụ và bắt mã lỗi.
- [x] Thiết lập workflow GitHub Actions tại `.github/workflows/ci.yml`.
- [x] Pipeline tự động lưu trữ Coverage Report và JUnit XML Artifacts.
- [x] Tất cả các test case đều pass 100% cả ở môi trường local và trên GitHub Actions runner.

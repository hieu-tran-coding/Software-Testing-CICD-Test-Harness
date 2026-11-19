# 📊 Báo Cáo Tiến Độ Dự Án - Tuần 6 (Project Progress Report)

> **Dự án:** Xây dựng Automated Test Harness tích hợp CI/CD Pipeline cho System Under Test (SUT) RealWorld Conduit.  
> **Thời điểm cập nhật:** Tuần 6 (Tháng 10/2026).  
> **Repository SUT:** [`thu2005/realworld`](https://github.com/thu2005/realworld) (Baseline: branch `next`).  
> **Repository Báo cáo & Tài liệu:** [`Software-Testing-CICD-Test-Harness`](https://github.com/hieu-tran-coding/Software-Testing-CICD-Test-Harness) (Branch: `docs-and-reports`).

---

## 1. Tổng quan Hiện trạng Dự án (Executive Summary)

Đến thời điểm khởi động Tuần 6, nhóm đã hoàn thành xuất sắc **Giai đoạn 1 (Phase 1: Nền tảng CI/CD, Containerization, Unit & API Integration Tests)** và đang bước vào **Giai đoạn 2 (Phase 2: UI E2E Automation với Cypress & Báo cáo Allure Dashboard)**.

Toàn bộ các pull request tính năng của các thành viên đều đã được kiểm tra, giải quyết xung đột và tích hợp thành công vào nhánh cơ sở [`origin/next`](https://github.com/thu2005/realworld/tree/next) của repository SUT:
- **PR #1 (Nhóm D):** Hạ tầng Jenkins baseline, Docker Compose, Jenkinsfile source mode và bản thỏa thuận tích hợp `CI_INTEGRATION_CONTRACT.md`.
- **PR #2 (Nhóm B):** Pipeline GitHub Actions 10 jobs chuẩn hóa, Dockerfile tối ưu hóa DevSecOps và cấu hình ESLint 8.
- **PR #3 (Nhóm B + C):** Tích hợp bộ kiểm thử Jest Unit Tests (31 cases) và SuperTest API Tests (15 cases) vào luồng CI GitHub Actions, khắc phục các lỗi biên dịch Next.js build.
- **PR #4 (Nhóm E):** Tích hợp vòng đời Docker image trên Jenkins (`RUN_MODE=image`), điều phối kiểm thử container smoke test tự động qua script Python `jenkins/image_smoke.py`.

---

## 2. Chi tiết Kết quả Triển khai Kỹ thuật

```
                             [ SUT: RealWorld Conduit ]
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
      [ GitHub Actions CI ]                            [ Jenkins Infrastructure ]
      (Branch: ci-github-actions)                      (Host port: 18080)
                 │                                               │
  10 Jobs: Checkout ➔ Setup Node                  Chế độ 1: RUN_MODE=source
  ➔ Install ➔ Lint (ESLint)                       (Checkout ➔ Verify ➔ Install ➔
  ➔ Unit Test (Jest: 31 tests)                    Lint ➔ Mocha Test ➔ Build-dev)
  ➔ API Test (SuperTest: 15 tests + Newman)                      │
  ➔ Security Scan (npm audit)                     Chế độ 2: RUN_MODE=image
  ➔ Docker Build (Bullseye non-root)              (Pull GHCR ➔ Validate 40-char SHA ➔
  ➔ Docker Push (GHCR tag SHA & latest)           Run Container ➔ Smoke /api/tags ➔
  ➔ Trigger Jenkins (Webhook/API contract)         Export smoke.xml ➔ Cleanup)
```

### 2.1. Phân hệ GitHub Actions & Chất lượng mã nguồn (Person B)
- **Workflow hoàn chỉnh 10 Jobs:** Triển khai tại `.github/workflows/ci.yml`, thực thi độc lập theo nguyên tắc fail-fast, có cơ chế cache `node_modules` giúp rút ngắn thời gian build.
- **Tiêu chuẩn DevSecOps khắt khe:**
  - Ghim mã SHA 40 ký tự bất biến cho 100% các GitHub Actions (chống tấn công chuỗi cung ứng theo tiêu chuẩn SonarCloud Rule S6544).
  - Áp dụng nguyên tắc Least Privilege: Chỉ cấp quyền `packages: write` cho riêng job `docker-push`.
  - Cài đặt dependency an toàn: `npm install --no-audit --no-fund --ignore-scripts` kết hợp `npm rebuild sqlite3 || true`.
- **Linter chuẩn hóa:** Cấu hình `.eslintrc.js` kế thừa Next.js core Web Vitals và TypeScript-ESLint, lệnh `npm run lint` chạy sạch 0 cảnh báo.
- **Đóng gói Docker:** Xây dựng `Dockerfile` base `node:14.21.3-bullseye`, vận hành dưới user không đặc quyền `node`, tích hợp container smoke check độc lập với SQLite. Tự động đóng gói artifact và push lên GitHub Container Registry (`ghcr.io`).

### 2.2. Phân hệ Kiểm thử Tự động Unit & API (Person C)
- **Jest Unit Testing (Task C-1):**
  - Đã triển khai **31 ca kiểm thử** tập trung vào 3 module nòng cốt: `tests/unit/lib.test.js` (10 tests), `tests/unit/auth.test.js` (9 tests), và `tests/unit/models.test.js` (12 tests).
  - Độ bao phủ mã nguồn (Code Coverage) đạt mức ấn tượng: **Statements: 100%, Functions: 100%, Lines: 100%, Branches: >94%** (vượt xa chỉ tiêu tối thiểu $\ge 80\%$).
- **SuperTest API Integration Testing (Task C-2):**
  - Xây dựng **15 ca kiểm thử tích hợp** tại `tests/api/api.test.js`, bao phủ trọn vẹn vòng đời RESTful: Tags, đăng ký tài khoản, đăng nhập, xác thực JWT token, CRUD bài viết, hồ sơ tác giả, bình luận và xử lý toàn diện các mã lỗi HTTP (400, 401, 403, 404, 422).
  - Chạy song song cùng bộ kiểm thử Newman Postman collection (`./realworld/api/run-api-tests.sh`).
- **Chuẩn hóa Báo cáo:** Tất cả các luồng kiểm thử đều xuất định dạng chuẩn JUnit XML vào thư mục `test-reports/junit/` (`mocha.xml`, `newman.xml`).

### 2.3. Phân hệ Hạ tầng Jenkins & Vòng đời Container (Person D & E)
- **Jenkins Controller (Docker Compose):**
  - Vận hành tại host port `18080` (tránh xung đột port mặc định), lưu trữ dữ liệu qua Docker named volume an toàn.
  - Tự động nạp danh sách plugin tối thiểu qua `jenkins/plugins.txt` (`workflow-aggregator`, `pipeline-stage-view`, `git`, `github`, `credentials-binding`, `junit`).
- **Hợp đồng tích hợp CI/CD (`CI_INTEGRATION_CONTRACT.md`):** Quy định chặt chẽ về phiên bản runtime (Node 14.21.3, npm 6.14.18), quy ước đặt tên Docker tag (full Git SHA 40 ký tự), các biến môi trường bàn giao (`SUT_REPO_URL`, `SUT_REF`, `IMAGE_REPO`, `IMAGE_TAG`) và vị trí lưu trữ artifacts.
- **Vòng đời Docker Image Smoke Test (Person E - PR #4):**
  - Xây dựng script điều phối cao cấp `jenkins/image_smoke.py` (215 dòng Python).
  - Cho phép Jenkins nhận image đóng gói từ GHCR, khởi chạy container trong mạng bridge cô lập, dùng một probe container anh em kiểm tra endpoint `/api/tags`, xuất kết quả ra `smoke.xml` và đảm bảo dọn dẹp (cleanup) 100% tài nguyên mạng và container sau khi hoàn tất.

---

## 3. Đối chiếu Tiến độ với Jira Backlog (Sprint Board Status)

Bảng Jira đã được đồng bộ chuẩn xác với thực tế phát triển:
- **Tổng số hạng mục quản lý:** 50 issues.
- **Trạng thái phân bổ:** 32 Done | 6 In Progress | 12 To Do (+ 6 Epics).

| Nhóm việc | Trạng thái Jira | Hiện trạng thực tế | Đánh giá |
|---|:---:|---|:---:|
| **B-1 ➔ B-8** (Person B) | `Done` (8/8) | Workflow 10 jobs, ESLint, Dockerfile, GHCR push, report tuần 5 hoàn thành | **Hoàn thành 100%** ✅ |
| **C-1, C-2, C-3, C-5** (Person C) | `Done` (4/5) | 31 Unit tests, 15 API tests, JUnit XML, report tuần 5 hoàn thành | **Hoàn thành 100%** ✅ |
| **C-4** (Person C) | `In Progress` | Gắn badge code coverage vào file README của repository | **Đang hoàn thiện** ⏳ |
| **D-1, D-5, D-6** (Person D) | `Done` (3/6) | Jenkinsfile baseline, tài liệu setup và kiểm chứng Build #3 thành công | **Hoàn thành 100%** ✅ |
| **D-2, D-3, D-4** (Person D) | `In Progress` | Cấu hình credentials, chuẩn bị tích hợp Cypress và Allure | **Đang hoàn thiện** ⏳ |
| **E-0** (Person E - GHCR Image) | `Done` (PR #4) | Đã code xong `image_smoke.py`, mở rộng Jenkinsfile chế độ image mode | **Đã merge vào code** ✅ |
| **E-1 ➔ E-6** (Person E - Cypress) | `In Progress` / `To Do` | Thiết kế kịch bản kiểm thử giao diện Cypress UI | **Trọng tâm Tuần 6** 🎯 |
| **6 Epics lớn** (`CTH-21` ➔ `CTH-27`) | `To Do` | Các stories con đã hoàn thành phần lớn; đang chuyển dần sang In Progress | **Đang cập nhật** 🔄 |

---

## 4. Mục tiêu & Kế hoạch Phân công Tuần 6 (Week 6 Sprint Plan)

Tuần 6 là giai đoạn chuyển tiếp quyết định để hoàn thiện toàn bộ Test Harness và chuẩn bị cho bài thuyết trình Seminar. Nhóm tập trung giải quyết các mục tiêu trọng tâm sau:

```
[ Tuần 6 Sprint Goals ]
  ├── 1. UI Automation: Xây dựng bộ kịch bản Cypress E2E Tests (8-10 specs)
  ├── 2. Reporting Dashboard: Tích hợp Allure Report HTML vào Jenkins
  ├── 3. Documentation & Badges: Gắn Coverage Badge, nộp báo cáo cá nhân Week 5 & 6
  └── 4. End-to-End Demo: Quay video minh họa quy trình từ Git Push ➔ CI ➔ Test ➔ Jenkins
```

### Phân công chi tiết cho từng thành viên:

| Thành viên | Trách nhiệm chính trong Tuần 6 | Kết quả bàn giao mong đợi (Deliverables) |
|---|---|---|
| **Person A** *(Leader)* | - Điều phối tiến độ tuần 6, cập nhật trạng thái 6 Epic trên Jira sang `In Progress`.<br>- Thu thập ảnh chụp minh chứng họp nhóm và giám sát việc ghi nhật ký AI Audit Log của cả 5 thành viên. | - Bảng Jira cập nhật.<br>- `docs/meeting-proofs/` và `docs/ai-audit-logs/Week6/PersonA/`. |
| **Person B** | - Hỗ trợ Person D & E cấu hình webhook tự động trigger giữa GitHub Actions và Jenkins khi có public URL/ngrok.<br>- Cùng Person C chốt thiết kế badge và bổ sung vào `README.md`. | - Kết nối webhook GitHub ➔ Jenkins hoàn chỉnh.<br>- `README.md` cập nhật badge. |
| **Person C** | - Hoàn thành Task **C-4**: Tạo coverage badge từ kết quả Jest và nhúng vào `README.md`.<br>- Mở rộng thêm các kịch bản kiểm thử API biên (edge cases) cho chức năng Favorites và Feed articles. | - PR cập nhật badge trên README.<br>- Thư mục `tests/api/` được bổ sung ca kiểm thử mới. |
| **Person D** | - Hoàn thành Task **D-2**: Cài đặt plugin Allure vào `jenkins/plugins.txt` và cấu hình stage xuất báo cáo Allure trong `Jenkinsfile`.<br>- Cài đặt môi trường Cypress dependencies trong Jenkins container (Task **D-3**). | - File `jenkins/plugins.txt` có Allure plugin.<br>- `Jenkinsfile` sinh và lưu trữ Allure report HTML. |
| **Person E** | - Bổ sung nộp file báo cáo Tuần 5 còn thiếu vào thư mục `Week5/PersonE/`.<br>- Triển khai trọng tâm Tasks **E-1, E-2, E-3**: Viết bộ kịch bản Cypress E2E (~8–10 specs: đăng ký, đăng nhập, đăng bài, bình luận, follow tác giả) chạy ở chế độ headless.<br>- Cấu hình chụp screenshot/video khi test thất bại. | - Báo cáo Tuần 5 của Person E.<br>- Thư mục mã nguồn `cypress/` hoặc `tests/e2e/`.<br>- Video/ảnh chụp kiểm thử giao diện. |

---

## 5. Danh mục Rủi ro & Giải pháp Dự phòng (Risk & Mitigation)

1. **Rủi ro mạng giữa GitHub Actions và Jenkins Local:**
   - *Vấn đề:* GitHub-hosted runner không thể gửi webhook trực tiếp tới `http://localhost:18080` của Jenkins trên máy cá nhân.
   - *Giải pháp:* Sử dụng `ngrok` hoặc `localtunnel` tạo URL tạm thời khi quay video demo; hoặc kích hoạt Jenkins pipeline thông qua cơ chế SCM polling / manual parameterized build theo đúng hướng dẫn tại `docs/jenkins-setup.md`.
2. **Tài nguyên khi chạy Cypress trên Jenkins container:**
   - *Vấn đề:* Cypress headless yêu cầu các thư viện đồ họa của hệ điều hành Linux (Xvfb, libgtk, v.v.), có thể làm tăng dung lượng image Jenkins.
   - *Giải pháp:* Person D và E thống nhất chạy Cypress thông qua container phụ thuộc hoặc sử dụng image Docker chính thức `cypress/included` để chạy độc lập rồi chia sẻ volume report về Jenkins.

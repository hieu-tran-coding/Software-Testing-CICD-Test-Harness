# 📦 RealWorld (Node.js + Express) – Tài liệu Kế hoạch

## 1. Tổng quan Repo
- **Repository:** https://github.com/gothinkster/realworld
- **Stack:** `nodejs` (Node.js + Express, kèm giao diện React).
- **Kiến trúc:** **Monolithic** – API, xác thực và UI nằm trong cùng một codebase, build/deploy cùng nhau; không có phân tách micro-service, phù hợp cho demo nhanh.
- **Thư mục chính:**
  - `src/` – Server Express, route, model.
  - `client/` – Giao diện React (Conduit).
  - `Dockerfile` – Build một container duy nhất.
  - `package.json` – Script lint, test, build.
- **Lý do chọn:**
  1. Build Docker nhanh (~15 s) → CI ngắn.
  2. Bộ kiểm thử đầy đủ (Jest + SuperTest cho API, Cypress cho UI).
  3. Toàn bộ JavaScript, tương thích các script CI/CD hiện có.
  4. Tài liệu tốt, được dùng rộng rãi làm chuẩn tham chiếu.

---

## 2. Pipeline CI/CD (GitHub Actions + Jenkins)
> Đầu-cuối: code → lint → unit test → API test → security scan → build Docker → push image → trigger Jenkins → UI test (Cypress) → báo cáo Allure → audit log.

| Bước | Mô tả | Công cụ / Hành động | Kết quả mong đợi |
|------|-------|---------------------|------------------|
| 1️⃣ Checkout | Lấy mã nguồn. | `actions/checkout@v3` | Mã nguồn trong workspace. |
| 2️⃣ Setup Node | Cài Node 20. | `actions/setup-node@v3` | `node`, `npm` sẵn sàng. |
| 3️⃣ Install dependencies | Cài phụ thuộc sạch. | `npm ci` | Thư mục `node_modules`. |
| 4️⃣ Lint | Kiểm tra style và lỗi tĩnh. | `npm run lint` | Báo cáo lint (pass/fail). |
| 5️⃣ Unit tests | Jest, ~20 test. | `npm run test:unit` | Coverage ≥ 80 %, báo cáo unit. |
| 6️⃣ API tests | SuperTest, ~15 test. | `npm run test:api` | JUnit XML cho Jenkins. |
| 7️⃣ Security scan | Kiểm tra phụ thuộc. | `npm audit --json` | Không có lỗ hổng high/critical. |
| 8️⃣ Build Docker image | Tạo image cho app. | `docker build -t ghcr.io/<org>/realworld-node:${{ github.sha }}` | Image lưu nội bộ. |
| 9️⃣ Push image | Đẩy lên GHCR. | `docker push ghcr.io/<org>/realworld-node:${{ github.sha }}` | Image sẵn sàng cho Jenkins. |
| 🔟 Trigger Jenkins | Gửi webhook khởi chạy pipeline downstream. | `curl -X POST ${{ secrets.JENKINS_WEBHOOK_URL }}` | Job Jenkins bắt đầu. |
| 1️⃣1️⃣ Jenkins UI tests | Cypress, ~10 spec. | `cypress run` trong Jenkinsfile | Artifact UI-test, báo cáo Allure. |
| 1️⃣2️⃣ Publish Allure report | Đẩy báo cáo lên GitHub Actions artifacts và Jenkins. | `actions/upload-artifact` + plugin Allure | Báo cáo HTML truy cập được. |
| 1️⃣3️⃣ Audit log | Ghi tóm tắt lần chạy. | `git add/commit docs/ai-audit-logs/week-4/realworld-pipeline.md` | Dễ tra cứu cho seminar. |

**Tổng số bước:** 13 (gồm bước ghi audit log).

---

## 3. Kế hoạch Kiểm thử

| Nhóm | Mục tiêu | Test case tiêu biểu | Số lượng ước tính |
|------|----------|---------------------|-------------------|
| **Đơn vị** | Xác minh hàm, model, utility. | Validation `User`, `Article`; helper token; `slugify`, `paginate`. | ~15–20 test Jest |
| **API (tích hợp)** | Kiểm tra luồng HTTP end-to-end. | Đăng ký/đăng nhập; tạo, sửa, xoá bài viết; follow/unfollow; comment; lỗi 401/404/validation. | ~12–15 test SuperTest |
| **UI (E2E)** | Mô phỏng người dùng trên giao diện React. | Đăng ký/đăng nhập; đăng bài; điều hướng hồ sơ, follow; comment; đăng xuất. | ~8–10 spec Cypress |
| **Chất lượng / bảo mật** | Code sạch, không lỗ hổng cơ bản. | ESLint, `npm audit`, (tùy chọn) CodeQL. | 3–5 kiểm tra tự động (trong pipeline) |

**Tổng:** khoảng **30–40** test tự động trên ba lớp, cộng 3–5 kiểm tra chất lượng.

---

## 4. Phân công Công việc (dự thảo)

Nhóm được chia thành **hai nhóm theo nền tảng**, mỗi nhóm 2 người, do A điều phối chung.

### Điều phối chung
| Thành viên | Vai trò | Công việc |
|------------|---------|-----------|
| **A (Leader)** | Điều phối, audit-log, duyệt pipeline. | Định nghĩa mốc; review PR của cả hai nhóm; chốt giao diện bàn giao giữa hai nhóm; đảm bảo ghi audit-log. |

### 🟦 Nhóm GitHub (B + C) – Bước 1–10
| Thành viên | Vai trò | Công việc |
|------------|---------|-----------|
| **B** | Pipeline GitHub Actions. | Viết `ci.yml` (checkout, setup, lint, security scan); Docker build & push GHCR; webhook trigger Jenkins (bước 1–4, 7–10). |
| **C** | Test unit & API trong CI. | Specs Jest + SuperTest; chạy ở bước 5–6; JUnit XML; badge coverage. |

### 🟧 Nhóm Jenkins (D + E) – Bước 11–12
| Thành viên | Vai trò | Công việc |
|------------|---------|-----------|
| **D** | Hạ tầng & pipeline Jenkins. | Dựng Jenkins; `Jenkinsfile` (pull image, chạy container); plugin Allure; viết `docs/jenkins-setup.md`. |
| **E** | Test UI (Cypress) & demo. | Specs Cypress; chạy headless trong Jenkins; (tùy chọn) video demo pipeline. |

### Bàn giao giữa hai nhóm
- **GitHub → Jenkins:** image trên GHCR (quy ước tag `${{ github.sha }}`) và webhook trigger.
- **Jenkins → GitHub:** báo cáo Allure để đăng lên Actions artifacts (bước 12).
- Hai nhóm thống nhất các quy ước này với A trước khi bắt đầu.

---

## 5. Các bước tiếp theo
1. Xác nhận stack (Node + Express) với cả nhóm.
2. Tạo nhánh `feature/realworld-pipeline`.
3. Cập nhật `task_assignments.md` với chủ sở hữu từng phần và chốt quy ước bàn giao giữa nhóm GitHub (B, C) và nhóm Jenkins (D, E).
4. Thiết lập bảng sprint (GitHub Projects).
5. Lên lịch buổi sync 30 phút để review bản nháp `ci.yml` và `Jenkinsfile`.

---

> **Lưu ý:** Mọi thay đổi pipeline, artefact test và prompt AI phải được commit vào `docs/ai-audit-logs/week-4/` để đáp ứng yêu cầu AI-audit của seminar.

*Được chuẩn bị bởi Antigravity – giai đoạn lập kế hoạch, chưa thực hiện sửa đổi file nào.*
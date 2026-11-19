# AI Prompt Log - Tuần 7 - Person C

- **Họ và tên:** Nguyễn Lê Hữu Điền
- **MSSV:** 23120233
- **Phần việc:** Thành viên C - Unit Testing (Jest), API Integration Testing (SuperTest) & Hands-on Exercises Designer
- **Công cụ AI:** Antigravity (Gemini)
- **Thời gian thực hiện:** 2026-10-28

---

## 1. Mục tiêu và bối cảnh tương tác AI

Trong Tuần 7 của đề án seminar môn học **Kiểm thử phần mềm & CI/CD**, nhóm đã hoàn thành toàn bộ giai đoạn kỹ thuật nền tảng (Phase 1 & 2) và chuyển sang chuẩn bị bài giảng, slide thuyết trình hội trường và bài tập thực hành tương tác cho lớp học.

Nhiệm vụ được giao trên Jira của Thành viên C:
> **Mã công việc:** `CTH-84`  
> **Tên công việc:** `TASK-C Design hands-on mini-exercises with hints for class`  
> **Mô tả:** Thiết kế 2–3 bài tập thực hành nhỏ gọn kèm gợi ý (*hints*) trong `docs/hands-on-exercises/`, cho phép các bạn sinh viên trong lớp fork repository và kích hoạt quy trình CI/CD mini trên GitHub Actions trong vòng **dưới 5 phút**, dựa trên nền tảng bộ test Jest và SuperTest.

Mục tiêu làm việc cùng AI:
1. Đồng bộ và cập nhật mã nguồn mới nhất của cả 2 repository (`realworld` và `Software-Testing-CICD-Test-Harness`).
2. Thiết kế kịch bản sư phạm cho 3 bài tập thực hành mini đạt tiêu chí: **Zero-Setup** (chạy hoàn toàn trên GitHub Web Editor/trình duyệt), **Fast Feedback** (hoàn thành trong 5 phút), và **Progressive Hints** (gợi ý phân tầng 3 nấc).
3. Biên soạn toàn bộ gói tài liệu tại thư mục `docs/hands-on-exercises/` và lập báo cáo nghiệm thu Tuần 7.

---

## 2. Nhật ký tương tác chi tiết (Prompts & Actions)

### Lượt 1: Đồng bộ mã nguồn mới nhất trên cả 2 repository

* **Prompt (Yêu cầu của người dùng):**
  > *"pull về code mới nhất"*

* **Hành động và Phân tích của AI:**
  - AI kiểm tra trạng thái hiện tại trên cả hai repository:
    - `realworld`: Nhánh `ci-github-actions`.
    - `Software-Testing-CICD-Test-Harness`: Nhánh `docs-and-reports`.
  - Thực thi lệnh `git fetch --all --prune` và `git pull` trên cả hai repo.
  - Kết quả:
    - Repo `realworld` được cập nhật từ commit `8c7385d` lên `19c70a9` (+616 lines), bao gồm cấu hình bảo mật CodeQL SAST (`.github/workflows/codeql.yml`), cập nhật Jenkins image smoke test, `.gitattributes`, `.dockerignore`.
    - Cập nhật và checkout git submodule `realworld` tại mã commit `63d67b3`.
    - Repo `Software-Testing-CICD-Test-Harness` được cập nhật từ commit `f65801f` lên `7bf4eb3` (+1817 lines), bổ sung báo cáo Tuần 6 của các thành viên, tệp tiến độ nhóm `team_progress.md` và khởi tạo báo cáo đánh giá Tuần 7 `implementation_evaluation_report.md`.
  - Cả 2 repo đều ở trạng thái sạch (`working tree clean`).

---

### Lượt 2: Phân tích yêu cầu Task CTH-84 và Lập Kế hoạch Thực hiện

* **Prompt (Yêu cầu của người dùng):**
  > *"tuần này tôi có task trên jira như sau:*  
  > *CTH-84: TASK-C Design hands-on mini-exercises with hints for class*  
  > *Description: Design 2-3 concise hands-on test exercises with hints in docs/hands-on-exercises/ allowing classmates to fork the repository and trigger a mini-demo CI/CD pipeline on GitHub Actions within 5 minutes, based on the Jest and SuperTest test suites.*  
  > *lên plan làm bài"*

* **Phân tích và Giải pháp từ AI:**
  - AI đọc và đối chiếu các tài liệu tham chiếu của nhóm: `team_progress.md` (Tuần 6) và `implementation_evaluation_report.md` (Tuần 7), xác định rõ vị trí của bài tập hands-on trong lộ trình chuẩn bị seminar.
  - Phân tích các thách thức cốt lõi:
    1. *Rào cản môi trường:* Sinh viên trong lớp không có sẵn Node 14 hay SQLite. Giải pháp: Hướng dẫn thực hành 100% trên trình duyệt bằng **GitHub Web Editor** (phím tắt `.`).
    2. *Thời gian giới hạn:* Chu trình fork $\rightarrow$ sửa code $\rightarrow$ push $\rightarrow$ CI xanh phải hoàn thành trong 5 phút. Bộ test Jest/SuperTest thực tế chỉ chạy mất ~35s đến 90s, hoàn toàn đáp ứng thời gian thực tế.
    3. *Tính sư phạm:* Thiết kế hệ thống gợi ý 3 nấc (Progressive Hints) từ khái niệm $\rightarrow$ vị trí dòng lỗi $\rightarrow$ mã nguồn mẫu.
  - Lập Kế hoạch kỹ thuật chi tiết tại artifact `task_c_hands_on_plan.md` gồm 3 bài tập:
    - *Bài tập 1 (Jest Unit Test):* Hoàn thành assertion giá trị biên cho hàm phân trang `validatePositiveInteger('0')` trong `tests/unit/lib.test.js`.
    - *Bài tập 2 (SuperTest API Test):* Sửa mã HTTP mong đợi từ `200` sang `422 Unprocessable Entity` khi đăng nhập sai mật khẩu trong `tests/api/api.test.js`.
    - *Bài tập 3 (CI Quality Gate & Fail-Fast):* Thử thách 2 bước thêm hàm mới không kèm test để thấy CI báo đỏ do rớt Coverage $< 80\%$, sau đó viết test bổ sung để đưa pipeline xanh trở lại.
  - Người dùng xem xét và phê duyệt kế hoạch (Approved).

---

### Lượt 3: Hiện thực Gói Tài liệu Bài tập Thực hành (`docs/hands-on-exercises/`)

* **Hành động của AI:**
  - Tạo mới thư mục `docs/hands-on-exercises/` và biên soạn 5 tệp tài liệu hoàn chỉnh:
    1. **`README.md` (Quickstart Guide):** Hướng dẫn 3 bước bắt đầu nhanh (Fork repo, kích hoạt Actions, mở GitHub Web Editor với phím tắt `.`), quy định thời lượng 5 phút và cách đọc kết quả test trên GitHub Actions Step Summary.
    2. **`exercise-1-jest-unit-test.md` (Bài tập 1):** Hướng dẫn chi tiết về Jest Unit Testing, phân tích hàm `validatePositiveInteger` trong `lib.js`, kịch bản bổ sung test case số 8, hướng dẫn commit và xem báo cáo Coverage 100%. Kèm 3 gợi ý phân tầng ẩn trong thẻ `<details>`.
    3. **`exercise-2-supertest-api.md` (Bài tập 2):** Hướng dẫn kiểm thử tích hợp REST API bằng SuperTest, chuẩn mã lỗi HTTP `422`, kịch bản sửa lỗi logic mong đợi sai mã 200, kiểm tra đối tượng `res.body.errors`. Kèm 3 gợi ý phân tầng.
    4. **`exercise-3-cicd-quality-gate.md` (Bài tập 3):** Thử thách trải nghiệm cơ chế Fail-Fast của Quality Gate khi độ bao phủ code tụt dưới 80% do hàm mới `formatArticleSlug`, sau đó viết bổ sung test để phục hồi pipeline xanh. Kèm 3 gợi ý phân tầng.
    5. **`solutions-and-hints.md` (Bảng tra cứu Gợi ý & Đáp án Mẫu):** Bảng tổng hợp vị trí dòng code, 3 nấc gợi ý cho từng bài, mã nguồn đáp án mẫu chi tiết và mục giải đáp sự cố thường gặp (FAQ: kích hoạt workflow trên fork, kích hoạt thủ công qua workflow_dispatch, tải artifact JUnit XML).

---

### Lượt 4: Soạn thảo Báo cáo Cá nhân Tuần 7 và Nghiệm thu

* **Hành động của AI:**
  - Khởi tạo báo cáo tuần 7 của Person C tại `docs/weekly-docs/Week7/PersonC/member_report_C_week7.md`.
  - Tổng hợp đầy đủ: Mục tiêu công việc, chi tiết 3 bài tập hands-on, các điểm sáng tạo về trải nghiệm người học, đối chiếu với báo cáo tiến độ tuần 7 của nhóm trưởng và bảng Definition of Done.
  - Biên soạn tệp nhật ký `docs/ai-audit-logs/Week7/PersonC/prompt-log-23120233.md`.

---

## 3. Đánh giá Hiệu quả Ứng dụng AI

1. **Thiết kế hướng người dùng (User-Centered Pedagogical Design):** AI đã đề xuất giải pháp tận dụng triệt để tính năng GitHub Web Editor (phím tắt `.`), giải quyết triệt để rào cản cài đặt môi trường cho các bạn sinh viên trong lớp, biến bài tập trở thành trải nghiệm 100% "Plug-and-Play".
2. **Bám sát thực tế mã nguồn:** Toàn bộ đề bài, đoạn mã mẫu và hàm kiểm thử đều được trích xuất trực tiếp từ mã nguồn thực tế của dự án (`lib.js`, `tests/unit/lib.test.js`, `tests/api/api.test.js`), đảm bảo tính nhất quán và chân thực cao nhất.
3. **Tuân thủ quy chuẩn seminar:** Gói tài liệu hoàn thành đúng thời hạn, đáp ứng hoàn hảo tiêu chí của đề án môn học và khớp nối chính xác với kế hoạch hành động Tuần 7 – Tuần 8 của nhóm.

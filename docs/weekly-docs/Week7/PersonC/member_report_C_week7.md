# Báo cáo Tuần 7 - Person C

- **Họ và tên:** Nguyễn Lê Hữu Điền
- **MSSV:** 23120233
- **Vai trò:** Thành viên C - Unit Testing (Jest), API Testing (SuperTest) & Hands-on Exercises Designer
- **Repository SUT (Mã nguồn & CI):** [thu2005/realworld](https://github.com/thu2005/realworld) (Branch: `ci-github-actions` / `next`)
- **Repository Báo cáo & Tài liệu:** [Software-Testing-CICD-Test-Harness](https://github.com/hieu-tran-coding/Software-Testing-CICD-Test-Harness) (Branch: `docs-and-reports`)

---

## 1. Mục tiêu và phạm vi công việc Tuần 7

Sau khi hoàn thành xuất sắc giai đoạn xây dựng và chuẩn hóa hệ thống kiểm thử tự động (Phase 1 & Phase 2: 31 Jest Unit Tests, 15 SuperTest API Tests, xuất bản JUnit XML và gắn badges trạng thái lên README ở Tuần 5 & Tuần 6), bước sang **Tuần 7**, nhóm chuyển trọng tâm sang công tác **chuẩn bị bài giảng và tài liệu tương tác cho buổi Seminar trước lớp**.

Theo phân công trên Jira, Thành viên C đảm nhận nhiệm vụ trọng tâm:
> **Mã Jira:** `CTH-84`  
> **Tên nhiệm vụ:** `TASK-C Design hands-on mini-exercises with hints for class`  
> **Mô tả:** Thiết kế 2–3 bài tập thực hành ngắn gọn kèm gợi ý (*hints*) đặt tại thư mục `docs/hands-on-exercises/`, cho phép các bạn sinh viên trong lớp có thể fork repository và kích hoạt chu trình CI/CD mini trên GitHub Actions trong vòng **dưới 5 phút**, dựa trên nền tảng bộ test Jest và SuperTest đã xây dựng.

---

## 2. Thiết kế Bộ Bài tập Thực hành Hands-on (`docs/hands-on-exercises/`)

Nhóm đã hoàn thành trọn vẹn gói tài liệu thực hành tương tác bao gồm **5 tập tin hướng dẫn chi tiết**, được cấu trúc bài bản theo tiêu chuẩn sư phạm công nghệ:

```
docs/hands-on-exercises/
├── README.md                      # Hướng dẫn tổng quan, quy trình 3 bước Quickstart (5 phút)
├── exercise-1-jest-unit-test.md   # Bài tập 1: Jest Unit Testing & Boundary Value Analysis
├── exercise-2-supertest-api.md    # Bài tập 2: SuperTest API Testing & REST HTTP 422 Error Handling
├── exercise-3-cicd-quality-gate.md# Bài tập 3: CI/CD Quality Gate & Fail-Fast Mechanism
└── solutions-and-hints.md         # Bảng tra cứu Gợi ý phân tầng (Progressive Hints) & Đáp án mẫu
```

---

### 2.1. Chi tiết 3 Bài tập Thực hành

| Bài tập | Nội dung kỹ thuật | Tập tin mục tiêu | Thời lượng | Kỹ năng truyền tải |
|:---:|---|---|:---:|---|
| **Bài tập 1** | **Jest Unit Testing & Assertions** | `tests/unit/lib.test.js` | 1 – 2 phút | Viết test case đơn vị, phân biệt matchers `toBe()` vs `toEqual()`, kiểm thử giá trị biên cho hàm phân trang `validatePositiveInteger('0')`. |
| **Bài tập 2** | **SuperTest API Integration Testing** | `tests/api/api.test.js` | 2 – 3 phút | Giả lập request HTTP, bắt mã phản hồi chuẩn RESTful `422 Unprocessable Entity` khi đăng nhập sai mật khẩu và xác thực JSON object lỗi. |
| **Bài tập 3** | **CI/CD Quality Gate & Fail-Fast** | `lib.js` & `tests/unit/lib.test.js` | 2 – 3 phút | Thử thách 2 bước: Thêm hàm mới không kèm test để chứng kiến CI báo đỏ ❌ do rớt Coverage $< 80\%$, sau đó bổ sung test để đưa pipeline xanh trở lại ✅. |

---

### 2.2. Các điểm sáng tạo & Tối ưu hóa trải nghiệm người học (UX Design)

1. **Rào cản cài đặt bằng 0 (Zero-Setup Barrier):**
   - Sinh viên trong lớp không cần cài đặt Node.js 14, npm hay Docker cục bộ.
   - 100% các thao tác chỉnh sửa code, commit và kích hoạt pipeline đều thực hiện được trực tiếp trên trình duyệt thông qua **GitHub Web Editor** (chỉ cần nhấn phím tắt `.` trên bàn phím).
2. **Phản hồi siêu nhanh (Fast Feedback Loop < 5 phút):**
   - Bộ test của Jest và SuperTest được tối ưu hóa thực thi trong bộ nhớ (In-Memory / SQLite), hoàn thành toàn bộ test suites chỉ trong **~35 đến 90 giây**.
   - Sinh viên nhận kết quả kiểm thử ngay tại chỗ trong thời lượng buổi seminar.
3. **Cơ chế gợi ý phân tầng (Progressive Hints):**
   - Mỗi bài tập được trang bị 3 nấc gợi ý được gấp gọn bằng thẻ `<details>`:
     - *Nấc 1:* Gợi ý về khái niệm lý thuyết và logic kiểm thử.
     - *Nấc 2:* Gợi ý vị trí dòng code và cú pháp thư viện.
     - *Nấc 3:* Đáp án mã nguồn hoàn chỉnh.
   - Giúp người học tự tin thực hành, tránh tình trạng bị tắc hoặc nản lòng.

---

## 3. Đối chiếu Thực tế với Báo cáo Đánh giá Tuần 7 (`implementation_evaluation_report.md`)

Trong báo cáo tổng hợp tiến độ đồ án Tuần 7 của nhóm trưởng ([implementation_evaluation_report.md](../Week7/implementation_evaluation_report.md)), mục 6 đã xác định rõ:
> *"Thiết kế 2–3 kịch bản thực hành rút gọn kèm gợi ý (hints) tại `docs/hands-on-exercises/` để các bạn sinh viên trong lớp có thể fork repository và chạy thử nghiệm trực tiếp trên GitHub Actions."*

Việc hoàn thành gói tài liệu `docs/hands-on-exercises/` trong tuần này đã giải quyết dứt điểm hạng mục việc số 4 trong kế hoạch hành động Tuần 7 – Tuần 8 của nhóm, sẵn sàng phục vụ cho buổi thuyết trình seminar và bài tập tương tác trên lớp.

---

## 4. Bằng chứng Sản phẩm Hoàn thành (Deliverables Proof)

Toàn bộ các tài liệu đã được lưu trữ và nghiệm thu tại repository tài liệu môn học:
1. [README.md - Hướng dẫn Thực hành Nhanh 5 Phút](../../../docs/hands-on-exercises/README.md)
2. [exercise-1-jest-unit-test.md - Bài tập 1: Jest Unit Testing](../../../docs/hands-on-exercises/exercise-1-jest-unit-test.md)
3. [exercise-2-supertest-api.md - Bài tập 2: SuperTest API Testing](../../../docs/hands-on-exercises/exercise-2-supertest-api.md)
4. [exercise-3-cicd-quality-gate.md - Bài tập 3: CI/CD Quality Gate](../../../docs/hands-on-exercises/exercise-3-cicd-quality-gate.md)
5. [solutions-and-hints.md - Bảng Gợi ý & Đáp án Mẫu](../../../docs/hands-on-exercises/solutions-and-hints.md)

---

## 5. Definition of Done cho Week 7 - Person C

- [x] Hoàn thành trọn gói nhiệm vụ Jira **`CTH-84: TASK-C Design hands-on mini-exercises with hints for class`**.
- [x] Thiết kế 3 bài tập thực hành ngắn gọn, trực quan, dựa trên 2 nền tảng kiểm thử cốt lõi là Jest và SuperTest.
- [x] Tích hợp cơ chế gợi ý phân tầng (Progressive Hints) và bảng đáp án mẫu chi tiết.
- [x] Đảm bảo kịch bản thực hành không đòi hỏi cài đặt môi trường, hoàn thành chu trình fork $\rightarrow$ edit $\rightarrow$ test $\rightarrow$ green CI trong vòng dưới 5 phút.
- [x] Khởi tạo thư mục chuẩn `docs/hands-on-exercises/` và lưu trữ đầy đủ tài nguyên vào repository `Software-Testing-CICD-Test-Harness`.
- [x] Cập nhật Báo cáo cá nhân Tuần 7 và Nhật ký AI Prompt Audit Log theo đúng quy chuẩn đề tài.

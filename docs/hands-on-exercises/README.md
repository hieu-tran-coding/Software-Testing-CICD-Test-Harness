# 🎯 Hướng Dẫn Thực Hành CI/CD & Automated Testing (5-Minute Hands-on Labs)

> **Môn học:** Kiểm thử phần mềm (Software Testing) – FIT@HCMUS  
> **Chủ đề:** Automated Test Harness tích hợp CI/CD Pipeline (GitHub Actions & Jenkins)  
> **Nhóm thực hiện:** Nhóm Seminar RealWorld Conduit  
> **Phụ trách bài tập:** Person C (Nguyễn Lê Hữu Điền - MSSV: 23120233)  
> **Repository thực hành (SUT):** [`thu2005/realworld`](https://github.com/thu2005/realworld)  

---

## 🚀 Giới thiệu Tổng quan (Quick Introduction)

Chào mừng các bạn đến với phần **Thực hành Tương tác Trực tiếp (Hands-on Mini-Labs)** của buổi Seminar!

Nhóm đã thiết kế **3 bài tập thực hành nhỏ gọn**, giúp bạn trải nghiệm trực tiếp quy trình kiểm thử tự động và chu trình CI/CD chuẩn công nghiệp trên nền tảng **GitHub Actions**:
- ⏱️ **Thời lượng:** Chỉ mất từ **1 – 3 phút** cho mỗi bài tập (toàn bộ quá trình từ lúc sửa code đến khi nhận kết quả kiểm thử trên CI chỉ gói gọn trong **dưới 5 phút**).
- 💻 **Không cần cài đặt (Zero-Setup):** Bạn **không cần** cài Node.js, SQLite hay Docker trên máy. Có thể thực hiện hoàn toàn 100% trên trình duyệt thông qua giao diện GitHub Web Editor (phím tắt `.`).
- 💡 **Gợi ý phân tầng (Progressive Hints):** Mỗi bài tập đều đi kèm 3 nấc gợi ý từ cơ bản đến nâng cao, đảm bảo ai cũng có thể tự tin hoàn thành.

---

## 📋 Danh mục Bài tập Thực hành

| Bài tập | Chủ đề kỹ thuật | Cấp độ | Thời lượng | Kỹ năng đạt được |
|:---:|---|:---:|:---:|---|
| [**Bài tập 1**](./exercise-1-jest-unit-test.md) | **Jest Unit Testing & Assertions** | Khởi động 🟢 | 1 – 2 phút | Viết test case đơn vị, sử dụng Jest matchers và bảo đảm Code Coverage $\ge 80\%$. |
| [**Bài tập 2**](./exercise-2-supertest-api.md) | **SuperTest API Integration Testing** | Nâng cao 🟡 | 2 – 3 phút | Gửi request HTTP thật, kiểm thử mã trạng thái `422 Unprocessable` và bắt lỗi JSON. |
| [**Bài tập 3**](./exercise-3-cicd-quality-gate.md) | **CI/CD Quality Gate & Fail-Fast** | Chuyên sâu 🔴 | 2 – 3 phút | Trải nghiệm cơ chế chặn lỗi tự động của CI/CD khi tụt độ bao phủ code và cách xử lý. |

> 🔑 **Cần trợ giúp hoặc bí ý tưởng?** Xem ngay [Bảng Gợi ý Phân tầng & Đáp án Mẫu](./solutions-and-hints.md).

---

## 🛠️ Quy trình 3 Bước Bắt đầu Nhanh (5-Minute Quickstart)

```
  [ Bước 1: Fork Repository ]
              │
              ▼
  [ Bước 2: Kích hoạt Actions & Sửa file trên Web ] (Phím tắt '.')
              │
              ▼
  [ Bước 3: Commit & Xem Pipeline Báo Xanh ] (Trong 90s)
```

### Bước 1: Fork Repository về tài khoản cá nhân
1. Truy cập vào repository SUT: [**https://github.com/thu2005/realworld**](https://github.com/thu2005/realworld).
2. Nhấn nút **Fork** ở góc trên cùng bên phải màn hình.
3. Giữ nguyên cấu hình mặc định (bỏ tích chọn *"Copy the next branch only"* nếu bạn muốn clone tất cả nhánh, hoặc chỉ cần fork nhánh `ci-github-actions` / `next`) và nhấn **Create fork**.

### Bước 2: Kích hoạt GitHub Actions trên Fork của bạn
Vì lý do bảo mật, GitHub mặc định vô hiệu hóa Workflows trên các repository được fork:
1. Chuyển sang tab **Actions** trên repository vừa fork của bạn.
2. Nhấn vào nút xanh lá: **"I understand my workflows, go ahead and enable them"**.

### Bước 3: Mở trình soạn thảo trực tuyến & Thực hành
1. Quay lại tab **Code**.
2. Nhấn phím `.` (dấu chấm) trên bàn phím để mở **GitHub Web Editor (VS Code in Browser)** ngay trên trình duyệt.
3. Chọn một trong 3 bài tập bên dưới để bắt đầu:
   - [Đến Đề bài Bài tập 1 ➔](./exercise-1-jest-unit-test.md)
   - [Đến Đề bài Bài tập 2 ➔](./exercise-2-supertest-api.md)
   - [Đến Đề bài Bài tập 3 ➔](./exercise-3-cicd-quality-gate.md)
4. Sửa code $\rightarrow$ Nhấn tab **Source Control** (hoặc nhấn `Ctrl + Shift + G`) $\rightarrow$ Nhập commit message $\rightarrow$ Nhấn **Commit & Push**.
5. Vào lại tab **Actions** để xem pipeline tự động thực thi và chuyển sang màu xanh ✅!

---

## 📊 Cách Đọc Kết quả Kiểm thử & Báo cáo trên GitHub Actions

Sau khi pipeline thực thi xong (~90 giây cho các bước test), bạn có thể kiểm tra:
1. **GitHub Step Summary:** Kéo xuống cuối trang lượt chạy (Run Overview) để xem bảng thống kê độ bao phủ kiểm thử **Jest Unit Test & Coverage Summary** hiển thị trực tiếp.
2. **Báo cáo Artifacts:** Tải về các tệp báo cáo chuẩn hóa tại mục **Artifacts**:
   - `unit-test-report`: Tệp JUnit XML `jest-unit.xml` ghi nhận chi tiết 31 test cases.
   - `api-test-report`: Tệp JUnit XML `jest-api.xml` ghi nhận 15 test cases API.
   - `coverage-report`: Báo cáo độ bao phủ mã nguồn dạng HTML (mở file `index.html` trong trình duyệt).

---

## 📞 Hỗ trợ trong buổi Seminar
Nếu gặp khó khăn trong quá trình thao tác, bạn hãy giơ tay hoặc liên hệ trực tiếp với thành viên phụ trách:
- **Người hỗ trợ:** Nguyễn Lê Hữu Điền (Person C)
- **Email:** gaolua217@gmail.com

# Kịch Bản Video Demo: Kiểm Thử Tự Động (Person C)
### Dự án RealWorld Conduit &bull; Thời lượng: ~6 – 7 phút

> **Người thực hiện:** Nguyễn Lê Hữu Điền (Person C)  
> **Nội dung:** Unit Test (Jest), Data-Driven Test, API Test (SuperTest), Quality Gate & Báo cáo kiểm thử.  

---

## ⏱️ Bảng Mốc Thời Gian (Timestamps)

| Mốc thời gian | Nội dung | Thao tác chính |
|:---:|---|---|
| `00:00 - 01:00` | Giới thiệu & Môi trường | Kiểm tra Node.js 14, file `package.json` và cấu hình `jest.config.js`. |
| `01:00 - 02:30` | Unit Test & Data-Driven Testing | Chạy test hàm trong `lib.js`, giải thích bảng tham số `test.each`. |
| `02:30 - 04:00` | API Test với SuperTest | Gửi request qua SuperTest, kiểm tra mã 200, mã lỗi 422 khi sai mật khẩu. |
| `04:00 - 05:30` | Quality Gate & Báo cáo XML | Demo khi độ bao phủ dưới 80%, xem file `jest-unit.xml` và HTML Coverage. |
| `05:30 - 06:30` | Kết quả trên CI & Bài tập nhỏ | Xem Step Summary trên GitHub Actions và giới thiệu bài tập cho lớp. |

---

## 🎙️ Lời Thoại & Thao Tác Chi Tiết

### 1. Giới thiệu & Chuẩn bị môi trường (`00:00 - 01:00`)
- **Màn hình:** Mở VS Code trong thư mục dự án `realworld`.
- **Thao tác:**
  ```bash
  node -v
  npm -v
  ```
  Mở tệp `jest.config.js`.
- **Lời thoại:**
  > *"Chào thầy và các bạn. Mình là Điền, phụ trách phần kiểm thử tự động của nhóm.*  
  > *Hôm nay mình xin chia sẻ ngắn gọn về cách nhóm xây dựng các bài test từ mức đơn vị, API cho đến việc tích hợp vào quy trình CI/CD.*  
  > *Về môi trường, dự án dùng Node.js 14 để đồng bộ với pipeline trên GitHub Actions. Nhóm sử dụng Jest làm công cụ chạy test và đo độ bao phủ, cùng với SuperTest để kiểm tra API.*  
  > *Trong file `jest.config.js`, nhóm đặt mức tối thiểu cho độ bao phủ code là 80%, đồng thời cấu hình xuất kết quả ra file XML để CI có thể đọc được."*

---

### 2. Unit Test & Data-Driven Testing với `test.each` (`01:00 - 02:30`)
- **Màn hình:** Mở file `tests/unit/lib.test.js`.
- **Thao tác:**
  1. Chỉ vào đoạn test hàm `validatePositiveInteger`.
  2. Cuộn chuột đến đoạn `describe('Data-Driven Parameterized Suite (test.each)')`.
  3. Mở terminal gõ:
     ```bash
     npx jest tests/unit/lib.test.js
     ```
- **Lời thoại:**
  > *"Ở mức kiểm thử đơn vị, mình có các bài test cho các hàm tiện ích trong `lib.js`.*  
  > *Đặc biệt, để kiểm tra được nhiều trường hợp biên mà không phải viết lặp lại code, mình áp dụng kỹ thuật Data-Driven Testing với hàm `test.each` của Jest.*  
  > *Như trên màn hình, mình khai báo một bảng dữ liệu gồm các trường hợp: số dương, chuỗi số, số 0, số âm, số thực và chuỗi rỗng. Khi chạy lệnh, Jest sẽ tự động lặp qua từng dòng dữ liệu và kiểm tra xem kết quả trả về có đúng như mong đợi hay không.*  
  > *Cách làm này giúp bộ test gọn gàng và dễ bổ sung ca kiểm thử mới."*

---

### 3. API Test với SuperTest & Xử lý mã lỗi (`02:30 - 04:00`)
- **Màn hình:** Mở file `tests/api/api.test.js`.
- **Thao tác:**
  1. Cho xem test case `GET /api/tags` và `POST /api/users/login`.
  2. Chạy lệnh:
     ```bash
     npm run test:api
     ```
- **Lời thoại:**
  > *"Tiếp theo là phần kiểm thử API bằng SuperTest. Khác với unit test, phần này sẽ gửi request HTTP thật đến server Express.*  
  > *Ví dụ, với endpoint lấy danh sách thẻ bài viết, ta kiểm tra server trả về mã `200` và có mảng dữ liệu.*  
  > *Bên cạnh các trường hợp đúng, nhóm cũng chú trọng kiểm tra các trường hợp lỗi nghiệp vụ. Chẳng hạn khi người dùng đăng nhập với mật khẩu không đúng, hệ thống phải trả về mã `422` kèm thông báo lỗi cụ thể, chứ không được trả về 200.*  
  > *Toàn bộ các bước đăng ký, đăng nhập lấy token, tạo bài viết và bình luận đều được kiểm tra liên hoàn và chạy ổn định."*

---

### 4. Quality Gate & Xuất báo cáo kiểm thử (`04:00 - 05:30`)
- **Màn hình:** Mở file `lib.js` và trình duyệt xem báo cáo Coverage.
- **Thao tác:**
  1. Thêm thử 1 hàm nhỏ vào cuối `lib.js`:
     ```javascript
     function viDuChuaVietTest() { return 'demo'; }
     exports.viDuChuaVietTest = viDuChuaVietTest;
     ```
  2. Chạy `npm run test:unit`, chỉ vào thông báo lỗi độ bao phủ dưới 80%.
  3. Xóa hàm thừa, chạy lại để test xanh.
  4. Mở file `coverage/lcov-report/index.html` trên trình duyệt và cho xem file `test-reports/junit/jest-unit.xml`.
- **Lời thoại:**
  > *"Một điểm thuận tiện của Jest là khả năng đặt Cổng chất lượng (Quality Gate).*  
  > *Nếu ai đó thêm code mới mà quên viết test, độ bao phủ sẽ giảm xuống dưới 80%. Lúc này Jest sẽ báo lỗi ngay, giúp nhóm kịp thời bổ sung test trước khi merge code.*  
  > *Sau khi test hoàn tất, kết quả sẽ được ghi vào file `jest-unit.xml` trong thư mục `test-reports/junit`. Đây là định dạng chuẩn giúp các công cụ CI như GitHub Actions hay Jenkins có thể đọc và tổng hợp lại.*  
  > *Ngoài ra, Jest cũng xuất ra giao diện HTML để xem trực quan dòng code nào đã được test."*

---

### 5. Kết quả trên GitHub Actions & Bài tập cho lớp (`05:30 - 06:30`)
- **Màn hình:** Trình duyệt mở trang GitHub Actions và thư mục `docs/hands-on-exercises/`.
- **Thao tác:**
  1. Mở trang chạy của GitHub Actions, cuộn xuống phần **Jest Unit Test & Coverage Summary**.
  2. Mở file `docs/hands-on-exercises/README.md`.
- **Lời thoại:**
  > *"Trên GitHub Actions, sau mỗi lần commit, hệ thống sẽ tự động chạy các bộ test và hiển thị bảng tóm tắt độ bao phủ ngay tại trang tóm tắt của workflow.*  
  > *Để các bạn trong lớp có thể cùng trải nghiệm, nhóm cũng đã chuẩn bị 3 bài tập nhỏ trong thư mục `docs/hands-on-exercises`. Các bạn chỉ cần fork repo, sửa thử 1-2 dòng code trực tiếp trên trình duyệt và commit là pipeline sẽ tự chạy trong khoảng 2 phút.*  
  > *Phần trình bày về kiểm thử tự động của mình đến đây là hết, cảm ơn thầy và các bạn đã lắng nghe."*

---

## 📌 Đoạn Tóm Tắt Dành Cho Slide (Gửi Bạn Hiếu - Leader)

Bạn có thể gửi đoạn ngắn này để Person A dán vào slide:

> **Video Demo 02: Kiểm Thử Tự Động & Data-Driven Testing (Person C - Hữu Điền)**  
> - **Thời lượng:** ~6 phút.  
> - **Nội dung chính:**  
>   - Setup Jest, SuperTest trên nền Node.js 14.  
>   - Kiểm thử đơn vị & kỹ thuật Data-Driven Testing (`test.each`) với bảng tham số giá trị biên.  
>   - Kiểm thử tích hợp API, kiểm tra mã lỗi HTTP 422 và xác thực token JWT.  
>   - Cơ chế Quality Gate (Fail-fast khi coverage < 80%) và chuẩn hóa báo cáo JUnit XML.  
>   - Giới thiệu 3 bài tập thực hành 5 phút cho lớp.  
> - **Timestamps:** `00:00` Setup &bull; `01:00` Data-Driven Testing &bull; `02:30` API Test &bull; `04:00` Quality Gate &bull; `05:30` CI/CD & Hands-on.

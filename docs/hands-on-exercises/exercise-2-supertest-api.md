# 🌐 Bài Tập 2: Kiểm Thử Tích Hợp REST API Với SuperTest (SuperTest API Testing)

> **Cấp độ:** Trung bình (Intermediate) 🟡  
> **Thời lượng hoàn thành:** 2 – 3 phút  
> **Mục tiêu kỹ năng:** Sử dụng thư viện `supertest` để giả lập request HTTP đến máy chủ REST API, kiểm tra mã phản hồi HTTP (`status code`) và cấu trúc đối tượng lỗi JSON (`res.body.errors`).  
> **Tập tin mục tiêu:** [`tests/api/api.test.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/tests/api/api.test.js) (thuộc repository SUT `realworld`).  

---

## 📖 1. Bối cảnh Kỹ thuật (Context)

Khác với Unit Test (kiểm thử hàm đơn lẻ độc lập), **API Integration Test** yêu cầu gửi request HTTP thực tế thông qua mạng nội bộ đến máy chủ Express đang hoạt động và kiểm tra toàn bộ luồng xử lý từ Route $\rightarrow$ Controller $\rightarrow$ Database $\rightarrow$ HTTP Response.

Trong đặc tả Conduit REST API, khi người dùng gửi thông tin đăng nhập với mật khẩu sai hoặc thiếu trường dữ liệu, hệ thống **bắt buộc không được trả về mã `200 OK`**, mà phải phản hồi mã **`422 Unprocessable Entity`** với cấu trúc chuẩn:

```json
{
  "errors": {
    "email or password": ["is invalid"]
  }
}
```

Trong dự án của chúng ta, thư viện **SuperTest** được sử dụng để gọi API:
```javascript
const res = await request
  .post('/api/users/login')
  .send({
    user: {
      email: 'user@example.com',
      password: 'wrong_password'
    }
  });
```

---

## 🎯 2. Đề bài Thực hành (Task Description)

Giả sử trong tập tin `tests/api/api.test.js`, một lập trình viên mới vào dự án đã viết nhầm ca kiểm thử đăng nhập sai mật khẩu nhưng lại mong đợi mã trạng thái thành công `200 OK`:

```javascript
    test('POST /api/users/login - Should reject invalid password with 422', async () => {
      const res = await request
        .post('/api/users/login')
        .send({
          user: {
            email: testUser.user.email,
            password: 'incorrect_password'
          }
        });

      // ⚠️ ĐOẠN LỖI: Ai đó đã viết nhầm thành 200 khiến test có nguy cơ fail!
      expect(res.status).toBe(200); 
      expect(res.body.errors).toBeDefined();
    });
```

**Nhiệm vụ của bạn:**
1. Tìm ca kiểm thử này trong `tests/api/api.test.js`.
2. Sửa lại mã trạng thái mong đợi từ `200` thành `422`.
3. Bổ sung thêm một kiểm tra nghiêm ngặt: đảm bảo trường `res.body.errors` phải có thuộc tính `'email or password'` hoặc là một Object hợp lệ.

---

## 🛠️ 3. Hướng dẫn Từng bước (Step-by-Step on Web UI)

### Bước 1: Mở tệp `tests/api/api.test.js`
1. Trên repository fork của bạn, điều hướng đến file:  
   `tests/api/api.test.js`
2. Nhấn phím `.` (hoặc nhấn nút Edit hình cây bút).

### Bước 2: Chỉnh sửa mã kiểm thử
Kéo xuống khoảng dòng 60 (trong khối `describe('2. User Authentication Endpoints')`), tìm đoạn test `POST /api/users/login - Should reject invalid password with 422` và cập nhật các dòng `expect`:

```javascript
    test('POST /api/users/login - Should reject invalid password with 422', async () => {
      const res = await request
        .post('/api/users/login')
        .send({
          user: {
            email: testUser.user.email,
            password: 'incorrect_password'
          }
        });

      // Sửa lại thành mã 422 chuẩn RESTful
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
```

### Bước 3: Commit thay đổi lên GitHub
1. Nhấn `Ctrl + S` để lưu file.
2. Chuyển sang tab **Source Control** (hoặc nút **Commit changes...**).
3. Nhập commit message:  
   `test(api): assert HTTP 422 on invalid login credentials with SuperTest`
4. Bấm **Commit & Push**.

### Bước 4: Kiểm tra kết quả trên GitHub Actions
1. Vào tab **Actions** trên GitHub.
2. Bạn sẽ thấy GitHub Actions tự động thực hiện:
   - Khởi động backend Express server chạy ngầm tại cổng 3000.
   - Chạy lệnh `npm run test:api`.
   - Kết quả: Job **API Tests** chuyển sang màu xanh lá ✅ (**15/15 test cases passed**).
   - Tệp báo cáo JUnit XML `test-reports/junit/jest-api.xml` được xuất bản thành công!

---

## 💡 4. Gợi ý Phân tầng (Progressive Hints)

<details>
<summary>🔍 <b>Gợi ý Cấp 1 (Gợi ý về chuẩn mã HTTP):</b></summary>

> Trong chuẩn thiết kế RESTful API:
> - `200 OK`: Request thành công.
> - `401 Unauthorized`: Người dùng chưa đăng nhập hoặc token không hợp lệ.
> - `422 Unprocessable Entity`: Dữ liệu đầu vào đúng định dạng JSON nhưng sai logic nghiệp vụ (sai mật khẩu, trùng email, thiếu trường bắt buộc).
</details>

<details>
<summary>🔍 <b>Gợi ý Cấp 2 (Gợi ý về SuperTest Response):</b></summary>

> Biến `res` trả về từ `await request.post(...)` có:
> - `res.status`: Mã trạng thái HTTP dạng số (vd: `422`).
> - `res.body`: Dữ liệu JSON phản hồi từ server đã được tự động parse sang JavaScript Object.
</details>

<details>
<summary>🔑 <b>Gợi ý Cấp 3 (Đoạn mã hoàn chỉnh):</b></summary>

```javascript
      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
```
</details>

---

## 🏁 5. Kết luận bài học
Qua bài tập này, bạn đã:
- Biết cách sử dụng `supertest(app)` để kiểm thử các API endpoint thực tế.
- Phân biệt được các mã trạng thái HTTP chuẩn mực trong kiểm thử bảo mật và xác thực.
- Hiểu cách CI/CD Pipeline tự động khởi chạy môi trường server tạm thời để thực thi bộ API tests mà không làm ảnh hưởng đến cơ sở dữ liệu thật.

👉 **Tiếp tục với [Bài tập 3: CI/CD Quality Gate & Fail-Fast Challenge ➔](./exercise-3-cicd-quality-gate.md)**

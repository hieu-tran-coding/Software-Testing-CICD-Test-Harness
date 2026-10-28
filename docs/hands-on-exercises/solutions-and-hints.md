# 💡 Bảng Tra Cứu Gợi Ý Phân Tầng & Đáp Án Mẫu (Solutions & Hints Guide)

> **Mục đích:** Tài liệu tham khảo toàn diện dành cho sinh viên tham gia thực hành tại buổi Seminar. Giúp bạn tự tra cứu khi gặp khó khăn mà không làm gián đoạn tiến độ thực hành 5 phút.  
> **Repository SUT:** [`thu2005/realworld`](https://github.com/thu2005/realworld)  

---

## 📌 Bảng Tra Cứu Nhanh (Quick Reference)

| Bài tập | Tập tin cần chỉnh sửa | Dòng ước tính | Nội dung thay đổi cốt lõi |
|:---:|---|:---:|---|
| [**Bài tập 1**](./exercise-1-jest-unit-test.md) | `tests/unit/lib.test.js` | ~Dòng 48 | Bổ sung ca kiểm thử biên `validatePositiveInteger('0')` |
| [**Bài tập 2**](./exercise-2-supertest-api.md) | `tests/api/api.test.js` | ~Dòng 68 | Sửa mã trạng thái mong đợi từ `200` sang `422` cho đăng nhập sai mật khẩu |
| [**Bài tập 3**](./exercise-3-cicd-quality-gate.md) | `lib.js` & `tests/unit/lib.test.js` | Cuối 2 file | Thêm hàm `formatArticleSlug` và viết test case bao phủ để vượt Quality Gate |

---

## 🔍 Gợi Ý Chi Tiết & Đáp Án Mẫu Cho Từng Bài Tập

### 1. Bài tập 1: Jest Unit Testing & Assertions

#### Các cấp độ gợi ý (Progressive Hints):
- **Cấp độ 1 (Khái niệm):** Chuỗi ký tự `'0'` sau khi được chuyển đổi bằng `Number('0')` sẽ cho giá trị số học `0`. Theo logic của hàm `validatePositiveInteger`, số `0` là một số nguyên không âm (`0 >= 0` là `true`). Do đó hàm trả về mảng `[0, true]`.
- **Cấp độ 2 (Cú pháp Jest):** Để kiểm tra giá trị của biến `ok` là boolean `true` và `val` là số nguyên `0`, ta dùng `expect(ok).toBe(true)` và `expect(val).toBe(0)`.
- **Cấp độ 3 (Vị trí đặt code):** Chèn đoạn code test vào ngay trước dấu đóng ngoặc `});` của khối `describe('validatePositiveInteger', ...)`.

#### Đáp án mẫu (Solution Code):
Chèn vào file [`tests/unit/lib.test.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/tests/unit/lib.test.js):

```javascript
    test('8. should return true and 0 for string "0"', () => {
      const [val, ok] = lib.validatePositiveInteger('0');
      expect(ok).toBe(true);
      expect(val).toBe(0);
    });
```

---

### 2. Bài tập 2: SuperTest API Testing & Error Handling

#### Các cấp độ gợi ý (Progressive Hints):
- **Cấp độ 1 (Khái niệm):** Trong chuẩn RESTful API và đặc tả Conduit RealWorld, khi người dùng gửi thông tin đăng nhập không hợp lệ (sai mật khẩu), máy chủ sẽ trả về lỗi client-side dạng validation `422 Unprocessable Entity`, tuyệt đối không trả về `200 OK`.
- **Cấp độ 2 (Cú pháp SuperTest):** Đối tượng `res` sau khi gọi API trả về có thuộc tính `res.status` (kiểu Number). Muốn kiểm tra mã lỗi, dùng `expect(res.status).toBe(422)`.
- **Cấp độ 3 (Cấu trúc body lỗi):** Để kiểm tra đối tượng `errors` tồn tại trong JSON phản hồi, dùng `expect(res.body.errors).toBeDefined()`.

#### Đáp án mẫu (Solution Code):
Tại file [`tests/api/api.test.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/tests/api/api.test.js), tìm ca kiểm thử `POST /api/users/login - Should reject invalid password with 422` và sửa thành:

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

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
```

---

### 3. Bài tập 3: CI/CD Quality Gate & Fail-Fast Challenge

#### Các cấp độ gợi ý (Progressive Hints):
- **Cấp độ 1 (Hiện tượng Fail-Fast):** Khi bạn thêm code mới vào `lib.js` mà chưa có test, tổng số dòng code tăng lên trong khi số dòng được kiểm thử giữ nguyên $\rightarrow$ tỷ lệ Code Coverage bị tụt xuống dưới 80%. Tệp cấu hình `jest.config.js` có quy tắc `coverageThreshold: { global: { lines: 80 } }` sẽ lập tức báo lỗi và dừng toàn bộ pipeline GitHub Actions.
- **Cấp độ 2 (Chiến lược đạt 100% Branch Coverage):** Hàm `formatArticleSlug` có cấu trúc rẽ nhánh `if (!title) return ''`. Bạn cần viết ít nhất 2 ca kiểm thử: 1 ca cho chuỗi thông thường (nhánh chính) và 1 ca cho chuỗi rỗng / `null` (nhánh biên).
- **Cấp độ 3 (Khắc phục):** Thêm test case vào `tests/unit/lib.test.js` để kiểm thử toàn diện cả 2 nhánh.

#### Đáp án mẫu (Solution Code):

**Bước 1:** Thêm hàm vào cuối file [`lib.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/lib.js):
```javascript
function formatArticleSlug(title) {
  if (!title) return ''
  return String(title).toLowerCase().trim().replace(/\s+/g, '-')
}
exports.formatArticleSlug = formatArticleSlug
```

**Bước 2:** Bổ sung ca kiểm thử vào cuối file [`tests/unit/lib.test.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/tests/unit/lib.test.js):
```javascript
  describe('formatArticleSlug', () => {
    test('should convert title with spaces to lowercase hyphenated slug', () => {
      const slug = lib.formatArticleSlug('Hello World From HCMUS');
      expect(slug).toBe('hello-world-from-hcmus');
    });

    test('should return empty string for falsy input', () => {
      expect(lib.formatArticleSlug('')).toBe('');
      expect(lib.formatArticleSlug(null)).toBe('');
    });
  });
```

---

## ❓ Câu Hỏi Thường Gặp & Xử Lý Sự Cố (Troubleshooting FAQ)

### Q1: Sau khi Fork, tại sao tab Actions của tôi không chạy tự động khi push code?
**Trả lời:** GitHub mặc định khóa Workflows trên các repository mới được fork để phòng chống đào tiền ảo / spam tài nguyên.  
👉 **Cách khắc phục:** Vào tab **Actions** $\rightarrow$ bấm vào nút màu xanh lá: **"I understand my workflows, go ahead and enable them"**. Mọi commit sau đó sẽ tự động kích hoạt pipeline.

### Q2: Tôi có thể kích hoạt pipeline thủ công mà không cần sửa file không?
**Trả lời:** Hoàn toàn được! Workflow `.github/workflows/ci.yml` của nhóm đã được cấu hình sự kiện `workflow_dispatch`.  
👉 **Cách thực hiện:** Vào tab **Actions** $\rightarrow$ chọn workflow **CI Pipeline** ở cột bên trái $\rightarrow$ bấm nút **Run workflow** $\rightarrow$ chọn nhánh và bấm **Run workflow**.

### Q3: Tôi xem báo cáo độ bao phủ Code Coverage và tệp JUnit XML ở đâu trên GitHub Actions?
**Trả lời:**
1. Vào tab **Actions** $\rightarrow$ chọn lượt chạy vừa hoàn thành.
2. Cuộn chuột xuống cuối trang:
   - **Bảng tóm tắt trực quan:** Nằm ở mục **Jest Unit Test & Coverage Summary** (hiển thị trực tiếp bảng tỷ lệ Statements, Branches, Functions, Lines).
   - **Tệp báo cáo chuẩn hóa:** Nằm ở mục **Artifacts** (bạn có thể tải file zip `unit-test-report`, `api-test-report`, hoặc `coverage-report`).

# 🧪 Bài Tập 1: Viết Ca Kiểm Thử Đơn Vị Với Jest (Jest Unit Testing & Assertions)

> **Cấp độ:** Khởi động (Beginner) 🟢  
> **Thời lượng hoàn thành:** 1 – 2 phút  
> **Mục tiêu kỹ năng:** Hiểu cấu trúc một ca kiểm thử đơn vị (`test`, `expect`), sử dụng Jest Matchers (`toBe`, `toEqual`) và quan sát chỉ số Code Coverage tự động cập nhật trên GitHub Actions.  
> **Tập tin mục tiêu:** [`tests/unit/lib.test.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/tests/unit/lib.test.js) (thuộc repository SUT `realworld`).  

---

## 📖 1. Bối cảnh Kỹ thuật (Context)

Trong ứng dụng RealWorld Conduit, module [`lib.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/lib.js) cung cấp các hàm tiện ích xử lý logic quan trọng. Trong đó, hàm `validatePositiveInteger(s)` chịu trách nhiệm kiểm tra và chuẩn hóa các tham số phân trang (`limit`, `offset`):

```javascript
// lib.js
function validatePositiveInteger(s) {
  const i = Number(s)
  let ok = s !== '' && Number.isInteger(i) && i >= 0
  return [i, ok] // Trả về mảng: [giá trị sau khi parse, cờ hợp lệ boolean]
}
```

Hàm này nhận vào một giá trị `s` (có thể là số hoặc chuỗi ký tự) và trả về một mảng 2 phần tử:
- `i`: Số nguyên đã được ép kiểu (`Number(s)`).
- `ok`: `true` nếu là số nguyên không âm ($\ge 0$) và không phải chuỗi rỗng; `false` cho các trường hợp còn lại.

---

## 🎯 2. Đề bài Thực hành (Task Description)

Trong tập tin `tests/unit/lib.test.js`, nhóm đã xây dựng sẵn các ca kiểm thử cho `validatePositiveInteger`. 

**Nhiệm vụ của bạn:** Hãy bổ sung một ca kiểm thử biên (boundary test) mới để kiểm tra trường hợp chuỗi số có khoảng trắng hoặc số `0` (số 0 được xem là số nguyên không âm hợp lệ trong phân trang).

Bạn hãy mở file `tests/unit/lib.test.js` và thêm test case sau vào cuối khối `describe('validatePositiveInteger', ...)`:

```javascript
    test('8. should return true and 0 for string "0"', () => {
      const [val, ok] = lib.validatePositiveInteger('0');
      // TODO: Hãy hoàn thành 2 dòng assertion dưới đây:
      // expect(ok).toBe(...);
      // expect(val).toBe(...);
    });
```

---

## 🛠️ 3. Hướng dẫn Từng bước (Step-by-Step on Web UI)

Bạn không cần mở terminal hay cài đặt phần mềm nào trên máy, hãy làm theo 4 bước sau:

### Bước 1: Mở tệp trên GitHub Web Editor
1. Trên repository fork của bạn, truy cập vào đường dẫn:  
   `tests/unit/lib.test.js`
2. Nhấn phím `.` (dấu chấm) trên bàn phím (hoặc bấm vào biểu tượng cây bút **Edit this file** ở góc phải).

### Bước 2: Chỉnh sửa và hoàn thành Assertion
Kéo xuống khoảng dòng 48 (ngay trước khi kết thúc khối `describe('validatePositiveInteger')`), dán đoạn mã sau vào:

```javascript
    test('8. should return true and 0 for string "0"', () => {
      const [val, ok] = lib.validatePositiveInteger('0');
      expect(ok).toBe(true);
      expect(val).toBe(0);
    });
```

### Bước 3: Commit thay đổi lên GitHub
1. Nhấn tổ hợp phím `Ctrl + S` để lưu.
2. Chuyển sang biểu tượng **Source Control** (hoặc nhấn nút **Commit changes...** nếu dùng giao diện web chuẩn).
3. Nhập thông điệp commit:  
   `test(unit): add boundary test case for zero string in validatePositiveInteger`
4. Chọn commit trực tiếp vào nhánh của bạn và bấm **Commit & Push**.

### Bước 4: Kiểm tra kết quả trên GitHub Actions
1. Mở tab **Actions** trên repository GitHub của bạn.
2. Nhấp vào lượt chạy workflow mới nhất vừa được kích hoạt tự động.
3. Chờ khoảng **40–60 giây**, bạn sẽ thấy Job **Unit Tests** chuyển sang màu xanh lá ✅.
4. Kéo xuống phần **Jest Unit Test & Coverage Summary**, bạn sẽ thấy tổng số test case đã tăng lên **32 passed**, với độ bao phủ code đạt **100%**!

---

## 💡 4. Gợi ý Phân tầng (Progressive Hints)

Nếu bạn gặp khó khăn, hãy mở dần các gợi ý bên dưới:

<details>
<summary>🔍 <b>Gợi ý Cấp 1 (Gợi ý về logic kiểm thử):</b></summary>

> Chuỗi `'0'` khi đi qua hàm `Number('0')` sẽ cho giá trị số `0`.  
> Hàm `Number.isInteger(0)` trả về `true` và `0 >= 0` cũng là `true`.  
> Do đó, cờ `ok` phải là `true`, và giá trị `val` phải là số nguyên `0` (number), không phải chuỗi `'0'`.
</details>

<details>
<summary>🔍 <b>Gợi ý Cấp 2 (Gợi ý về Jest Matchers):</b></summary>

> Trong Jest, để so sánh giá trị boolean nguyên thủy hoặc số nguyên chính xác, ta sử dụng matcher `.toBe(expectedValue)`.  
> Ví dụ: `expect(isReady).toBe(true);`
</details>

<details>
<summary>🔑 <b>Gợi ý Cấp 3 (Đáp án mã nguồn hoàn chỉnh):</b></summary>

```javascript
    test('8. should return true and 0 for string "0"', () => {
      const [val, ok] = lib.validatePositiveInteger('0');
      expect(ok).toBe(true);
      expect(val).toBe(0);
    });
```
</details>

---

## 🏁 5. Kết luận bài học
Qua bài tập này, bạn đã:
- Nắm vững cú pháp cơ bản của Jest: `describe`, `test`, `expect`, `.toBe()`.
- Hiểu cách Unit Test bảo vệ tính đúng đắn của các hàm xử lý logic biên.
- Tận mắt thấy GitHub Actions tự động thực thi test suite và tạo báo cáo Coverage mà không cần can thiệp thủ công.

👉 **Tiếp tục với [Bài tập 2: SuperTest API Integration Testing ➔](./exercise-2-supertest-api.md)**

# 🛡️ Bài Tập 3: Vượt Qua Quality Gate & Trải Nghiệm CI/CD Fail-Fast (CI Quality Gates & Coverage)

> **Cấp độ:** Chuyên sâu (Advanced) 🔴  
> **Thời lượng hoàn thành:** 2 – 3 phút  
> **Mục tiêu kỹ năng:** Hiểu vai trò của **Quality Gate** trong chu trình phân phối phần mềm liên tục, quan sát cơ chế **Fail-Fast** tự động chặn pipeline khi độ bao phủ code không đạt ngưỡng, và thực hiện bổ sung test để đưa pipeline xanh trở lại.  
> **Tập tin mục tiêu:** [`lib.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/lib.js) và [`tests/unit/lib.test.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/tests/unit/lib.test.js).  

---

## 📖 1. Bối cảnh Kỹ thuật (Context)

Một trong những giá trị lớn nhất của CI/CD là thiết lập các **Cổng chất lượng tự động (Quality Gates)**:
- Ngăn chặn triệt để tình trạng lập trình viên đẩy code mới vào repository mà "quên" viết test, làm suy giảm độ bao phủ và tăng rủi ro phát sinh bug trên production.
- Trong dự án RealWorld Conduit, file cấu hình [`jest.config.js`](https://github.com/thu2005/realworld/blob/ci-github-actions/jest.config.js) áp dụng ràng buộc khắt khe:

```javascript
  // jest.config.js
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
```

Nếu bất kỳ chỉ số nào (Statements, Branches, Functions, Lines) bị rớt xuống dưới **80%**, Jest sẽ tự động trả về **mã lỗi khác 0 (exit code 1)** $\rightarrow$ GitHub Actions lập tức dừng toàn bộ pipeline (**Fail-Fast**), không cho phép build hay đóng gói Docker image!

---

## 🎯 2. Đề bài Thực hành (Two-Step Challenge)

Bài tập này gồm **2 bước tương tác liên hoàn** giúp bạn cảm nhận rõ nét cơ chế Quality Gate hoạt động:

```
[ Bước A: Viết code không kèm test ] ➔ [ CI Báo Đỏ Fail-Fast ❌ ]
                     │
                     ▼
[ Bước B: Bổ sung Unit Test tương ứng ] ➔ [ CI Báo Xanh Pass 100% ✅ ]
```

---

## 🛠️ 3. Hướng dẫn Từng bước (Step-by-Step on Web UI)

### 🔴 Bước A: Trải nghiệm CI Báo Đỏ (Fail-Fast)
1. Mở file `lib.js` trên repository fork của bạn.
2. Kéo xuống cuối file và thêm một hàm tiện ích mới:
   ```javascript
   function formatArticleSlug(title) {
     if (!title) return ''
     return String(title).toLowerCase().trim().replace(/\s+/g, '-')
   }
   exports.formatArticleSlug = formatArticleSlug
   ```
3. Nhấn **Commit changes...** với thông điệp:  
   `feat(lib): add formatArticleSlug helper without tests`
4. Chuyển sang tab **Actions** trên GitHub và theo dõi:
   - Job **Unit Tests** sẽ bị đánh dấu **FAILED (Màu đỏ ❌)**!
   - Mở chi tiết log của job, bạn sẽ thấy Jest thông báo:  
     `Jest: "global" coverage threshold for functions/lines will not be met`.
   - Các job tiếp theo như `api-test`, `docker-build`, `docker-push` **lập tức bị hủy bỏ (skipped)** để tiết kiệm tài nguyên. Đây chính là nguyên lý **Fail-Fast**!

---

### 🟢 Bước B: Khắc phục & Vượt qua Quality Gate
Bây giờ, bạn sẽ đóng vai trò là một kỹ sư chuyên nghiệp, viết bổ sung test case để "cứu" pipeline!

1. Mở file `tests/unit/lib.test.js`.
2. Kéo xuống cuối file và thêm khối kiểm thử sau:
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
3. Nhấn **Commit changes...** với thông điệp:  
   `test(unit): add comprehensive unit tests for formatArticleSlug to pass quality gate`
4. Vào lại tab **Actions** và quan sát:
   - Lượt chạy mới được kích hoạt.
   - Job **Unit Tests** vượt qua nhẹ nhàng với trạng thái **SUCCESS (Màu xanh ✅)**!
   - Bảng **Jest Unit Test & Coverage Summary** phục hồi trở lại mức **100% Statements & Lines**.
   - Pipeline tiếp tục chạy trơn tru qua các bước đóng gói container và xuất bản artifacts!

---

## 💡 4. Gợi ý Phân tầng (Progressive Hints)

<details>
<summary>🔍 <b>Gợi ý Cấp 1 (Gợi ý về cách đọc lỗi Coverage):</b></summary>

> Trong log của GitHub Actions, bảng Coverage Table liệt kê cột `Uncovered Line #s`.  
> Các số dòng xuất hiện ở cột này chính là những đoạn mã bạn mới viết nhưng chưa có bất kỳ lệnh gọi test nào chạm tới.
</details>

<details>
<summary>🔍 <b>Gợi ý Cấp 2 (Gợi ý về kiểm thử nhánh if/else):</b></summary>

> Hàm `formatArticleSlug` có điều kiện `if (!title) return ''`.  
> Để đạt 100% Branch Coverage, bạn cần ít nhất 2 ca kiểm thử:  
> 1. Một ca truyền `title` hợp lệ (chạy vào nhánh chính).  
> 2. Một ca truyền `''` hoặc `null` (chạy vào nhánh `return ''`).
</details>

<details>
<summary>🔑 <b>Gợi ý Cấp 3 (Mã kiểm thử hoàn chỉnh):</b></summary>

```javascript
  describe('formatArticleSlug', () => {
    test('should format slug correctly', () => {
      expect(lib.formatArticleSlug('Software Testing')).toBe('software-testing');
      expect(lib.formatArticleSlug('')).toBe('');
    });
  });
```
</details>

---

## 🏁 5. Kết luận bài học
Qua bài tập này, bạn đã:
- Thấu hiểu tại sao các tập đoàn công nghệ lớn luôn cài đặt Quality Gate trên CI/CD.
- Trực tiếp chứng kiến cơ chế Fail-Fast bảo vệ chất lượng phần mềm ngay từ bước commit.
- Biết cách đọc báo cáo Code Coverage để bổ sung test case một cách chính xác và hiệu quả.

🎉 **Chúc mừng bạn đã hoàn thành trọn vẹn chuỗi 3 bài tập Hands-on của buổi Seminar!**

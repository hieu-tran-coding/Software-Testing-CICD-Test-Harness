# 📑 FILE 1: TỔNG QUAN KẾ HOẠCH BÀI SEMINAR: CI/CD - TEST-HARNESS
**Khóa học:** Kiểm thử phần mềm | **Nhóm:** 5 thành viên (A, B, C, D, E)

## 1. Mục tiêu cốt lõi
*   Xây dựng hệ thống kiểm thử tự động (Test-Harness) tích hợp quy trình CI/CD.
*   Khảo sát, so sánh 2-3 công cụ CI/CD (GitHub Actions, GitLab CI, Jenkins).
*   Bài seminar phải dễ hiểu, tính ứng dụng cao và có minh chứng công việc rõ ràng (GitHub commit log).

## 2. Lộ trình triển khai 
*   **Tuần 3:** Chốt Proposal. Khảo sát CI/CD, phân công lý thuyết, duyệt cấu trúc thư mục.
*   **Tuần 4 - 5:** Xây dựng & Tích hợp (Chốt tool, dựng app mẫu, viết test, đấu nối pipeline).
*   **Tuần 6:** Nộp bài quá trình (Hoàn thiện 90% nội dung).
*   **Tuần 7 - 8:** Đóng gói Media & slide. Tích hợp AI.
*   **Tuần 9 - 10:** Trình bày thử với GVTH. **Thiết kế 2-3 bài tập áp dụng nhỏ (kèm gợi ý) để lớp thực hành theo.**
*   **Tuần 11:** Seminar chính thức. Hướng dẫn lớp làm bài tập áp dụng.
*   **Tuần 13:** Nộp bài Final.

## 3. Checklist Nộp bài (Tuần 13)
*🚨 **Quy định:** Tối đa 20 files, max 20 MB/file (Tổng 400MB). KHÔNG dùng Google Drive. File lớn phải nén và ghi "ZipTool" ở tên.*
- [ ] **Slide:** Markdown + PDF/PPT.
- [ ] **Báo cáo:** Markdown + PDF.
- [ ] **Demo video:** Link Youtube (Markdown).
- [ ] **Bài tập áp dụng:** File hướng dẫn chứa đề bài và gợi ý (hints) cho lớp thực hành (Markdown + PDF).
- [ ] **Source codes / Scripts:** Gói code app mẫu và test script.
- [ ] **Git commit log:** Minh chứng đóng góp (Markdown).
- [ ] **Khai báo AI (AI usage):** Kê khai prompt/minh chứng (Markdown + PDF).
- [ ] **Form Contribution:** Điền Google Spreadsheet.

## 4. Kiến trúc GitHub Repository
```text
CI-CD-Test-Harness-Project/
├── .cicd-configs/                 # Cấu hình pipeline (VD: .github/workflows)
├── docs/                          # TÀI LIỆU NỘP & MINH CHỨNG
│   ├── ai-audit-logs/             # Lịch sử prompt AI (Chia theo tuần)
│   ├── meeting-proofs/            # Ảnh họp nhóm, Jira board
│   ├── hands-on-exercises/        # 🎯 Chứa bài tập thực hành & gợi ý cho lớp
│   └── (Các file báo cáo, slide, log nộp cuối kỳ)
├── src/                           # Source code ứng dụng mẫu (Case Study)
├── test-harness/                  # Kịch bản test tự động (UI, API, Data)
├── scripts/                       # Shell script hỗ trợ
└── README.md
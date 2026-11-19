# 🤖 AI AUDIT LOG - TUẦN 3

**Họ và tên:** Nguyễn Lê Hữu Điền
**MSSV:** 23120233
**Phần việc:** Thành viên E - Case Study & Reporting
**Vị trí commit:** `docs/ai-audit-logs/Week3/PersonE/ai_audit_log_E_Week3.md`
**Công cụ AI sử dụng:** Claude (Anthropic), giao diện chat claude.ai
**Mục đích chung:** Hỗ trợ soạn báo cáo cá nhân tuần 3 (khảo sát CI/CD, đề xuất Web App, tool Test Report, hướng dùng AI).

---

## Lần 1: Hỏi quy định nộp AI audit log

*   **Đầu vào cung cấp cho AI:** 3 file của nhóm (`overview.md`, `proposal.md`, `member_report.md`).
*   **Prompt (tóm tắt nội dung gốc, tiếng Việt):** Nhóm 5 người, mình là thành viên E, đang ở tuần đầu (tìm hiểu chủ đề), cần làm member report. Hỏi: AI audit log đẩy lên git cá nhân hay git nhóm? Hiện mình chưa có repo cho seminar.
*   **Kết quả AI trả lời (tóm tắt):**
    *   Audit log đẩy lên **repo chung của nhóm**, thư mục `docs/ai-audit-logs/week-3/`, theo file Proposal và file mẫu báo cáo.
    *   Thành viên A (Leader) setup repo, nên cần nhắn A xin link repo và quyền collaborator.
    *   Gợi ý mỗi người một file audit riêng để tránh conflict.
*   **Cách sử dụng kết quả:** Dùng để xác định nơi commit file này. Đối chiếu lại với nội dung file gốc của nhóm.

## Lần 2: Soạn bản nháp báo cáo cá nhân

*   **Prompt (tóm tắt nội dung gốc):** "tôi chưa có phương án nào cả, bạn bắt đầu đi" (yêu cầu AI đề xuất phương án và điền báo cáo cá nhân theo mẫu, vai trò E).
*   **Kết quả AI trả về (tóm tắt):** File `member_report_E_week3.md` gồm:
    *   So sánh GitHub Actions vs Jenkins, đề xuất vote GitHub Actions.
    *   Nhận xét kế hoạch tổng thể và các đề xuất chỉnh sửa.
    *   Lý thuyết và thuật ngữ về Case Study, Test Report, Pipeline, Artifact, Headless, Flaky test.
    *   Đề xuất Web App RealWorld (Conduit), tool report Allure Report, các hướng dùng AI cho project.
    *   Điểm yếu / khó khăn dự kiến.
*   **Cách sử dụng kết quả:** Dùng làm bản nháp cho báo cáo cá nhân, sau đó tự kiểm chứng và chỉnh sửa (xem mục "Kiểm chứng" bên dưới).


---

## Ghi chú

*   Toàn bộ nội dung do AI tạo đều được xem là bản nháp, thành viên chịu trách nhiệm kiểm chứng trước khi đưa vào báo cáo.
*   Nếu có thêm lần dùng AI trong tuần 3, bổ sung thêm mục mới theo cùng định dạng (prompt, kết quả, cách sử dụng).

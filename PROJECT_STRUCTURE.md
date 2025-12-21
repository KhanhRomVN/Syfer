# 📂 Cấu Trúc Dự Án Syfer (VSCode Fork)

Tài liệu này liệt kê các thư mục và tập tin quan trọng trong mã nguồn của Syfer, giúp bạn nhanh chóng nắm bắt cấu trúc dự án.

## 🌟 Thư Mục Gốc (Root)

| Thư mục / File | Chức năng chính |
| :--- | :--- |
| **`src/`** | **Mã nguồn chính** của toàn bộ dự án (cả VSCode core và Syfer). Nơi bạn sẽ làm việc chủ yếu. |
| **`extensions/`** | Chứa mã nguồn của các **extensions tích hợp sẵn** (built-in) như Git, Markdown, TypeScript support, v.v. |
| **`build/`** | Các scripts và cấu hình cho quy trình build (Gulp files, CI/CD configs). |
| **`scripts/`** | Các script tiện ích để chạy và kiểm thử ứng dụng (ví dụ: `code.sh` để khởi động app). |
| **`out/`** | **Kết quả biên dịch** (compiled output). Code TypeScript sẽ được dịch sang JavaScript và đặt vào đây. |
| **`.vscode/`** | Cấu hình cho môi trường phát triển (debug launch configs, recommended extensions). |
| `package.json` | Khai báo dependencies và các lệnh scripts (như `npm run watch`, `npm run compile`). |
| `product.json` | Cấu hình định danh sản phẩm (tên app, version, update URL...). |

---

## 🛠 `src/vs/` - Cấu Trúc Cốt Lõi (VSCode Core)

Bên trong `src/`, thư mục `vs` chứa toàn bộ logic của VSCode.

| Thư mục con | Chức năng |
| :--- | :--- |
| **`base/`** | Các tiện ích cơ bản (utilities) dùng chung cho toàn bộ dự án (xử lý chuỗi, mảng, sự kiện, async...). Không phụ thuộc vào các phần khác. |
| **`platform/`** | Định nghĩa các **Services** và Interfaces cốt lõi (như FileService, ConfigurationService). Đây là nơi "tiêm" (injection) các dependency. |
| **`editor/`** | Mã nguồn của trình soạn thảo **Monaco Editor**. Xử lý việc hiển thị text, syntax highlighting, cursor, v.v. |
| **`workbench/`** | **Giao diện người dùng (UI)** của IDE. Chứa sidebar, panel, status bar, và layout chính của ứng dụng. |
| **`code/`** | Điểm khởi đầu (entry point) của **Electron Main Process**. Quản lý cửa sổ và vòng đời ứng dụng. |

---

## 🚀 `src/vs/workbench/contrib/syfer/` - Mã Nguồn Syfer

Đây là nơi chứa toàn bộ code riêng của Syfer (tính năng AI, Chat, v.v.).

| Thư mục con | Chức năng |
| :--- | :--- |
| **`browser/`** | Code chạy trên **Renderer Process** (giao diện web). Chứa logic xử lý UI, tương tác với VSCode API. |
| &nbsp;&nbsp; ↳ **`react/`** | **Giao diện React riêng của Syfer**. Nơi chứa Sidebar Chat, Ctrl+K popup, Settings... được viết bằng React. |
| **`common/`** | Code logic chung, có thể chạy trên cả Main Process và Renderer Process. Định nghĩa types, constants. |
| **`electron-main/`** | Code chạy trên **Main Process** dành riêng cho Syfer (ví dụ: xử lý request LLM để tránh CORS, quản lý native window). |

---

## 📝 Các Script Quan Trọng

*   **`npm run watch`**: Build Core (VSCode) + Extensions và tự động theo dõi thay đổi.
*   **`npm run watchreact`**: Build giao diện React của Syfer và tự động theo dõi thay đổi (Cần thiết khi dev UI Syfer).
*   **`./scripts/code.sh`**: Khởi động ứng dụng Syfer từ source code (đã build).

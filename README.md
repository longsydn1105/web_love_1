\# 🌸 Date Feedback App - Tài liệu Thiết kế & Phát triển

\## 1. Tổng quan Dự án

Web application đơn giản, lãng mạn và có tính tương tác cao để lấy feedback sau buổi hẹn hò.

\- \*\*Vibe:\*\* Gần gũi, đáng yêu.

\- \*\*Màu chủ đạo:\*\* Tím pastel (\`#d8b4e2\` hoặc Tailwind \`purple-200/300\`) và Xanh lá pastel (\`#b4e2b9\` hoặc Tailwind \`green-200/300\`).

\- \*\*Tech Stack:\*\* React, Vite, Tailwind CSS.

\- \*\*Backend/Database:\*\* Vercel Serverless Functions (\`/api\`), MongoDB (Mongoose).

\- \*\*Hosting:\*\* Vercel.

\## 2. System Architecture (Kiến trúc hệ thống)

Để nhanh gọn, project chạy theo mô hình Monorepo trên Vercel:

\- \*\*Frontend:\*\* React + Vite build ra file static.

\- \*\*Backend API:\*\* Thư mục \`/api/submit-feedback.js\` sử dụng Vercel Serverless.

\- \*\*Database:\*\* MongoDB Atlas (Cloud).

\*Flow:\* Người dùng nhập form -> Frontend gọi \`POST /api/submit-feedback\` -> Serverless Function nhận data -> Lưu vào MongoDB.

\## 3. Database Schema (Mongoose Model)

Thay vì tách 2 class rời rạc, cấu trúc dưới đây gộp chung vào một Document để đảm bảo tính toàn vẹn dữ liệu cho mỗi lần review:

\`\`\`javascript

// models/FeedbackSession.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({

score: {

type: Number,

required: true,

min: 1,

max: 10

},

feedbackText: {

type: String,

required: false

},

createdAt: {

type: Date,

default: Date.now

}

});

module.exports = mongoose.model('FeedbackSession', feedbackSchema);

## **4\. UI/UX Flow & Logic Chi tiết**

Ứng dụng gồm 4 màn hình (Screens), chuyển đổi linh hoạt bằng React State (currentScreen).

### **Screen 1: Trick "Bắt buộc phải thích"**

- **Nội dung:** "Em thấy thế nào về buổi đi chơi? 💖"
- **UI:** 3 Nút:
  - Em vô cùng thích (Màu tím pastel)
  - Bình thường (Màu xám/xanh lá nhạt)
  - So bad (Màu xám/xanh lá nhạt)
- **Logic (The Gimmick):**
  - Khởi tạo React State: wrongClickCount = 0.
  - Nếu click (2) hoặc (3):
    - wrongClickCount += 1.
    - Kích thước của nút (1) tăng lên (transform: scale(1 + wrongClickCount \* 0.5)).
    - Kích thước của nút (2) và (3) nhỏ đi (transform: scale(1 - wrongClickCount \* 0.2)).
  - **Điều kiện dừng:** Khi wrongClickCount === 5, ẩn hoàn toàn nút (2) và (3). Nút (1) chiếm trọn màn hình.
  - Nếu click (1): Chuyển sang Screen 2.

### **Screen 2: Chấm điểm thực tế**

- **Nội dung:** "Anh đùa thôi, em hãy chấm điểm hài lòng từ 1 tới 10 nha ✨"
- **UI:** - Input type number (hoặc Slider/Star rating) từ 1 đến 10.
  - Nút "Tiếp tục".
- **Logic:** - Lưu giá trị vào state score.
  - Validate: Không cho submit nếu chưa chọn điểm hoặc nhập số ngoài khoảng 1-10.
  - Click "Tiếp tục" -> Chuyển sang Screen 3.

### **Screen 3: Góp ý / Lời nhắn**

- **Nội dung:** "Em có ấn tượng gì, hay góp ý gì để anh cải thiện cho những lần sau không? 🌱"
- **UI:** - Textarea rộng rãi, bo góc mềm mại (Tailwind: rounded-2xl border-purple-300 focus:ring-purple-200).
  - Nút "Gửi cho anh".
- **Logic:**
  - Lưu giá trị vào state feedbackText.
  - Click "Gửi":
    - Hiện loading state.
    - Fetch API POST /api/submit-feedback với payload { score, feedbackText }.
    - Nhận response thành công -> Chuyển sang Screen 4.

### **Screen 4: Lời cảm ơn (End Screen)**

- **Nội dung:** "Chân thành cảm ơn em, anh sẽ trân trọng những điều này. Chúc em buổi tối vui vẻ! 🥰"
- **UI:** - Text ở giữa màn hình, hiệu ứng fade-in.
  - Có thể thêm hiệu ứng thả tim rơi (Confetti) bằng thư viện react-confetti cho lãng mạn.

## **5\. Hướng dẫn Triển khai (Deployment Plan)**

- **Setup biến môi trường (Environment Variables):**
  - Lấy MONGODB_URI từ MongoDB Atlas.
  - Thêm vào Vercel Project Settings > Environment Variables.
- **Cấu hình Vercel (vercel.json):** Nếu cần rewrite request từ frontend qua /api:
- JSON

{

"rewrites": \[

{ "source": "/api/(.\*)", "destination": "/api/\$1" },

{ "source": "/(.\*)", "destination": "/index.html" }

\]

}

- **Deploy:**
  - Push code lên GitHub.
  - Connect Vercel với repository.
  - Framework preset Vercel tự nhận diện Vite. Bấm Deploy và đợi chưa tới 1 phút là có link mang đi khè được rồi.
# Real-time Forum Features

## Socket.IO Integration

Server đã được tích hợp Socket.IO để hỗ trợ real-time updates cho forum comments và reactions.

### Frontend Integration

#### 1. Install Socket.IO Client
```bash
npm install socket.io-client
```

#### 2. Connect to Socket.IO
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token' // Pass JWT token for authentication
  }
});
```

#### 3. Join/Leave Forum Room
```javascript
// Join forum room when viewing a post
socket.emit('join-forum', forumPostId);

// Leave forum room when leaving the page
socket.emit('leave-forum', forumPostId);
```

#### 4. Listen for Real-time Events
```javascript
// New comment
socket.on('new-comment', (data) => {
  console.log('New comment:', data);
  // data: { postId, comment: { _id, content, userId: { name, email, avatar }, createdAt } }
  // Update UI to show new comment
});

// New reaction
socket.on('new-reaction', (data) => {
  console.log('New reaction:', data);
  // data: { postId, reaction: { _id, type, userId: { name, email, avatar }, createdAt } }
  // Update reaction count
});

// Reaction updated
socket.on('reaction-updated', (data) => {
  console.log('Reaction updated:', data);
  // data: { postId, reaction: { _id, type, userId: { name, email, avatar }, createdAt } }
  // Update reaction type
});

// Reaction removed
socket.on('reaction-removed', (data) => {
  console.log('Reaction removed:', data);
  // data: { postId, userId, type }
  // Remove reaction from UI
});
```

### Server Events

Server sẽ emit các events sau khi có thay đổi:

- `new-comment`: Khi có comment mới
- `new-reaction`: Khi có reaction mới
- `reaction-updated`: Khi user thay đổi loại reaction
- `reaction-removed`: Khi user bỏ reaction

### Authentication

Socket connections yêu cầu JWT token trong `auth.token` hoặc `query.token`.

### CORS

Socket.IO được cấu hình để accept connections từ `process.env.FRONTEND_URL` (default: `http://localhost:3000`).

## Gemini AI Content Moderation

Forum posts và comments được moderate tự động bằng Gemini AI để đảm bảo nội dung phù hợp với cộng đồng mental health.

### Setup

1. **Get Gemini API Key**:
   - Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Tạo API key mới

2. **Add to .env**:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### How it works

- **Before creating post/comment**: Nội dung được gửi đến Gemini AI để kiểm tra
- **Moderation criteria**: 
  - ✅ Cho phép: Hỗ trợ, chia sẻ kinh nghiệm, câu hỏi về mental health
  - ❌ Từ chối: Hate speech, harassment, khuyến khích tự hại, nội dung phân biệt, spam, ngôn ngữ không phù hợp
- **Response**: Nếu không an toàn, trả về lỗi 400 với lý do cụ thể
- **Fallback**: Nếu API lỗi, cho phép nội dung (để tránh block nội dung hợp lệ)

### Error Handling

Nếu comment/post bị từ chối, frontend sẽ nhận lỗi:
```json
{
  "message": "Comment violates community guidelines: [reason]"
}
```
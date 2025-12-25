
# Admin Panel - Phòng Truyền Thống

Admin panel để quản lý nội dung của website Phòng Truyền Thống Bệnh viện Trung ương Thái Nguyên.

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server (port 3001)
npm run dev

# Build production
npm run build

# Chạy production (port 3001)
npm start
```

Mở [http://localhost:3001](http://localhost:3001) để truy cập admin panel.

## Tính năng

- 🔐 **Xác thực**: Đăng nhập với tài khoản admin
- 📊 **Dashboard**: Trang tổng quan quản lý
- 🏆 **Sổ Vàng**: Quản lý bằng khen, giấy khen (CRUD)
- 📦 **Hiện Vật**: Quản lý hiện vật trưng bày (CRUD)
- ⏰ **Lịch Sử**: Quản lý các mốc lịch sử (CRUD)
- ℹ️ **Giới Thiệu**: Quản lý nội dung giới thiệu (CRUD)

## Cấu hình

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Công nghệ

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React Icons

>>>>>>> ad04744 (admin)

# Hướng Dẫn Sử Dụng Admin Panel

## 🚀 Khởi động

1. **Cài đặt dependencies:**
```bash
cd TTN_Hopistal_admin
npm install
```

2. **Tạo file `.env.local`** (tùy chọn, mặc định là `http://localhost:8080`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

3. **Chạy development server:**
```bash
npm run dev
```

Admin panel sẽ chạy tại: **http://localhost:3001**

## 📋 Tính năng hiện có

- ✅ **Login/Logout**: Xác thực với backend API
- ✅ **Dashboard**: Trang tổng quan với menu điều hướng
- ✅ **Sổ Vàng - Danh sách**: Xem danh sách và xóa
- ✅ **Sổ Vàng - Tạo mới**: Form tạo mới

## 🔨 Cần hoàn thiện

### 1. Trang chỉnh sửa Sổ Vàng
Tạo file: `app/dashboard/golden-book/[id]/page.tsx`

Sử dụng form tương tự như `new/page.tsx` nhưng:
- Fetch dữ liệu hiện có bằng `goldenBookService.getById(id)`
- Sử dụng `goldenBookService.update(id, data)` thay vì `create`

### 2. Quản lý Hiện Vật (Artifacts)
Tạo các file tương tự:
- `app/dashboard/artifacts/page.tsx` - Danh sách
- `app/dashboard/artifacts/new/page.tsx` - Tạo mới
- `app/dashboard/artifacts/[id]/page.tsx` - Chỉnh sửa

Sử dụng `artifactsService` từ `lib/api/services.ts`

### 3. Quản lý Lịch Sử (History)
Tạo các file:
- `app/dashboard/history/page.tsx`
- `app/dashboard/history/new/page.tsx`
- `app/dashboard/history/[id]/page.tsx`

### 4. Quản lý Giới Thiệu (Introduction)
Tạo các file:
- `app/dashboard/introduction/page.tsx`
- `app/dashboard/introduction/new/page.tsx`
- `app/dashboard/introduction/[id]/page.tsx`

## 📝 Lưu ý

1. **Xác thực**: Tất cả các trang trong `/dashboard` cần kiểm tra `isAuthenticated` và redirect về `/login` nếu chưa đăng nhập

2. **API Services**: Đã có sẵn trong `lib/api/services.ts`, chỉ cần import và sử dụng

3. **Layout**: Sử dụng component `AdminLayout` từ `components/AdminLayout.tsx` để có sidebar và header nhất quán

4. **Form Validation**: Backend đã có validation, nhưng nên validate ở frontend để UX tốt hơn

5. **Error Handling**: Luôn hiển thị thông báo lỗi cho người dùng khi API call thất bại

## 🎨 Màu sắc

- Primary Dark: `#5C3A21`
- Primary Light: `#E7D7B2`
- Các class CSS đã có sẵn: `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.input-field`, `.label-field`

## 📚 Tài liệu API

Xem file `HUONG_DAN_CAU_HINH_API.md` ở thư mục gốc để biết chi tiết về API endpoints và cấu trúc dữ liệu.


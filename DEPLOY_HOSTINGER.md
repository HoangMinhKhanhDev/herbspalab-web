# Deploy HerbSpa Lab lên Hostinger

## Chuẩn bị trước khi deploy

### 1. Build Frontend
```bash
cd frontend
npm install
npm run build
```
File build sẽ nằm ở `frontend/dist/`

### 2. Build Backend
```bash
cd backend
npm install
npm run build
```
File build sẽ nằm ở `backend/dist/`

### 3. Tạo file .env (nếu chưa có)
```bash
cd backend
cp .env.example .env
# Hoặc tạo mới với nội dung:
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
CORS_ORIGIN="https://your-domain.com"
NODE_ENV="production"
```

## Upload lên Hostinger

### Cấu trúc file trên server
```
public_html/
├── backend/
│   ├── dist/           # Backend build output
│   ├── node_modules/   # Dependencies
│   ├── prisma/
│   │   └── schema.prisma
│   ├── uploads/        # Uploads folder (chmod 755)
│   ├── package.json
│   └── .env           # Environment variables
├── frontend/
│   └── dist/          # Frontend build output
├── .htaccess          # Cấu hình Apache
└── package.json       # Root package.json
```

### Upload files
1. Upload toàn bộ thư mục `backend/dist/` lên `public_html/backend/dist/`
2. Upload `backend/node_modules/` (hoặc chạy `npm install --production` trên server)
3. Upload `backend/prisma/` folder
4. Upload `backend/uploads/` (tạo mới nếu chưa có, chmod 755)
5. Upload `backend/package.json`
6. Upload `frontend/dist/` lên `public_html/frontend/dist/`
7. Upload file `.htaccess` vào `public_html/`
8. Upload `.env` vào `public_html/backend/`

## Cấu hình trên Hostinger

### 1. Tạo file .htaccess
Đã tạo sẵn ở root, nội dung:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^$ backend/dist/index.html [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ backend/dist/index.html [L]
</IfModule>
```

### 2. Set Environment Variables
Trong Hostinger hPanel:
- Vào **Advanced** → **Environment Variables**
- Thêm:
  - `DATABASE_URL` = `file:/home/username/public_html/backend/dev.db`
  - `JWT_SECRET` = `your-secret-key`
  - `CORS_ORIGIN` = `https://your-domain.com`
  - `NODE_ENV` = `production`
  - `PORT` = (để trống, Hostinger sẽ tự gán port động)

### 3. Generate Prisma Client
SSH vào server:
```bash
cd public_html/backend
npx prisma generate
```

### 4. Chạy seed data (tùy chọn)
```bash
npx tsx prisma/seed-demo.ts
# hoặc
node --loader ts-node/esm prisma/seed-demo.ts
```

### 5. Set permissions
```bash
chmod 755 public_html/backend/uploads
chmod 644 public_html/backend/.env
```

### 6. Start server
Hostinger Node.js sẽ tự chạy `npm start` khi deploy.

## Troubleshooting

### Lỗi "Cannot find module"
- Chạy `npm install` trong thư mục backend

### Lỗi Database connection
- Kiểm tra DATABASE_URL path đúng
- Đảm bảo file .env có đúng đường dẫn database

### Lỗi Port already in use
- Hostinger sẽ tự gán port động, code đã dùng `process.env.PORT`

### Lỗi CORS
- Set đúng CORS_ORIGIN trong environment variables
- Bao gồm cả domain với/without www

### Lỗi Upload failed
- Đảm bảo folder `uploads` có quyền write (chmod 755)
- Kiểm tra multer config trong upload middleware

### Lỗi Frontend không load
- Đảm bảo frontend/dist đã được build
- Kiểm tra path trong backend/src/index.ts line 131:
  ```js
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  ```

## Kiểm tra sau deploy

1. Truy cập domain
2. Kiểm tra API: `https://your-domain.com/api/products`
3. Kiểm tra admin panel: `https://your-domain.com/admin`
4. Test upload ảnh
5. Test tạo đơn hàng

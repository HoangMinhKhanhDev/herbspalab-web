# Deploy HerbSpaLab lên Hostinger

Repo này deploy **tự động** mỗi khi push vào `main` qua GitHub Actions
(`.github/workflows/deploy.yml`).

## 1. Cấu trúc thư mục trên server

Sau khi deploy thành công, `public_html` sẽ có dạng:

```
public_html/
├── .htaccess                  # Apache rewrite (SPA + bypass /api, /uploads)
├── index.html                 # React build entry
├── assets/                    # JS/CSS/img đã hash bởi Vite
├── favicon.svg, robots.txt    # ...
├── uploads/                   # Ảnh sản phẩm do admin upload (giữ qua các lần deploy)
├── .env                       # Production secrets
├── package.json               # `{ "start": "node server/index.js" }`
└── server/                    # Node backend đã build
    ├── index.js               # Entry point Passenger
    ├── routes/, controllers/, ...
    ├── node_modules/          # `npm install --omit=dev` chạy sau deploy
    └── prisma/
        ├── schema.prisma
        └── dev.db             # SQLite (nếu DATABASE_URL trỏ vào đây)
```

> ⚠️ Apache đã được cấu hình **chặn** truy cập trực tiếp vào `/server/**`,
> `/prisma/**`, `.env`, và mọi file `*.db|*.sqlite|*.log`. Backend Node
> cũng có middleware bảo vệ thứ hai.

## 2. Cấu hình Hostinger (chỉ làm 1 lần)

### 2.1 Tạo Node.js application
- **hPanel → Advanced → Node.js**
- **Application Root**: `domains/herbspalab.com/public_html`
- **Application URL**: `herbspalab.com`
- **Application Startup File**: `server/index.js`
- **Node version**: 20 hoặc cao hơn

Sau khi tạo, hPanel sẽ hiển thị nút **Restart App** và **Run NPM Install**.

### 2.2 GitHub Secrets

Vào **GitHub repo → Settings → Secrets and variables → Actions**, thêm:

| Secret | Ví dụ | Bắt buộc |
|--------|-------|----------|
| `FTP_SERVER` | `ftp.herbspalab.com` hoặc IP | ✅ |
| `FTP_USERNAME` | `u123456.herbspalab` | ✅ |
| `FTP_PASSWORD` | mật khẩu FTP | ✅ |
| `SSH_HOST` | server hostname | ✅ |
| `SSH_USER` | user SSH (vd `u123456`) | ✅ |
| `SSH_PORT` | `65002` (mặc định Hostinger) | ✅ |
| `SSH_PRIVATE_KEY` | private key tương ứng SSH key đã add lên hPanel | ✅ |
| `JWT_SECRET` | chuỗi random dài 32+ ký tự | ✅ |
| `DATABASE_URL` | `file:/home/u123/private/herbspalab.db` | ✅ |
| `CORS_ORIGIN` | `https://herbspalab.com,https://www.herbspalab.com` | ✅ |
| `FRONTEND_URL` | `https://herbspalab.com` | ✅ |
| `DOMAIN` | `https://herbspalab.com` | ✅ |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` | nếu dùng Stripe |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | nếu dùng Stripe |
| `MAIL_HOST` | `smtp.gmail.com` | nếu cần gửi email |
| `MAIL_PORT` | `587` | nếu cần gửi email |
| `MAIL_USER` | `your@email.com` | nếu cần gửi email |
| `MAIL_PASS` | App password Google | nếu cần gửi email |

> **Lưu ý PORT**: **không set** `PORT` trong secrets. Hostinger Passenger
> tự gán port động và inject vào `process.env.PORT`.

### 2.3 Database location

Khuyến nghị **đặt SQLite ngoài `public_html`** để Apache không thể serve được:

```bash
# SSH vào server
mkdir -p ~/private
chmod 700 ~/private
# Lần đầu, copy db rỗng nếu cần
```

Rồi set `DATABASE_URL=file:/home/u123456/private/herbspalab.db` trong GitHub secret.

## 3. Quy trình deploy

1. Push code lên `main` → GitHub Actions tự chạy.
2. Workflow sẽ:
   - `npm ci` + build frontend (Vite)
   - `npm ci` + build backend (TypeScript → JS)
   - Gộp output vào `build/` qua `scripts/consolidate-build.js`
   - Tạo `build/.env` từ secrets
   - Upload `build/` lên `public_html/` qua FTPS
   - SSH vào server: `npm install --omit=dev`, `prisma generate`,
     `prisma db push`, `touch tmp/restart.txt` để Passenger reload
3. Kiểm tra:
   - `https://herbspalab.com` → React app
   - `https://herbspalab.com/api/products` → JSON

## 4. Deploy thủ công (fallback)

```bash
npm run build                # tạo build/
# Upload build/* lên public_html/ qua File Manager hoặc FTP client
# SSH vào server và chạy:
cd ~/domains/herbspalab.com/public_html/server
npm install --omit=dev
npx prisma generate
npx prisma db push --skip-generate
mkdir -p ../tmp && touch ../tmp/restart.txt
```

## 5. Troubleshooting

### "API trả về HTML thay vì JSON"
→ `.htaccess` đang nuốt `/api/*`. Đảm bảo `public_html/.htaccess` có:
```apache
RewriteRule ^api(/.*)?$ - [L]
RewriteRule ^uploads(/.*)?$ - [L]
```

### "Cannot find module @prisma/client"
→ Chạy `npm install --omit=dev` trong `public_html/server/`,
sau đó `npx prisma generate`.

### "Database connection failed"
→ Kiểm tra `DATABASE_URL` là đường dẫn **tuyệt đối** và user `u123456`
có quyền đọc/ghi file đó.

### "CORS blocked"
→ Set `CORS_ORIGIN` bao gồm cả `https://herbspalab.com` và
`https://www.herbspalab.com`. Hoặc redirect www → non-www trong `.htaccess`.

### "Upload ảnh fail (multer 500)"
→ `mkdir -p uploads && chmod 755 uploads` ở root `public_html`.
Backend cũng tự tạo nếu thiếu (xem `backend/src/index.ts`).

### "Stripe redirect về localhost"
→ Set secret `FRONTEND_URL=https://herbspalab.com` và redeploy.

### "Passenger không restart sau deploy"
→ SSH và chạy: `mkdir -p ~/domains/herbspalab.com/public_html/tmp && touch ~/domains/herbspalab.com/public_html/tmp/restart.txt`
hoặc bấm **Restart** trong hPanel.

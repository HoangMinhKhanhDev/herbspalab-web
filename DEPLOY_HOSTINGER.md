# Deploy HerbSpaLab lên Hostinger

Repo deploy qua **Hostinger Git Deployment** (hPanel → Deployments) với
framework **Express**. Khi push lên `main`, Hostinger build và publish theo
mô hình **dual-target** (rất quan trọng để hiểu).

## 1. Mô hình deploy của Hostinger Express

Hostinger chia làm 2 nơi:

```
~/domains/herbspalab.com/
├── nodejs/                    # ⭐ Node.js app runtime (Passenger đọc)
│   ├── frontend/, backend/, scripts/, ...
│   ├── package.json
│   ├── node_modules/
│   ├── build/                 # output của postinstall
│   │   ├── server/index.js    # ⭐ Application Startup File
│   │   ├── server/prisma/
│   │   ├── server/node_modules/
│   │   ├── index.html         # frontend entry
│   │   └── assets/
│   └── tmp/restart.txt        # touch để Passenger reload
│
└── public_html/               # ⭐ Apache document root (static files)
    ├── index.html             # ← copy từ build/index.html
    ├── assets/, robots.txt    # ← copy từ build/
    ├── server/, uploads/      # ← copy từ build/
    ├── .htaccess              # ⭐ Apache rules + Passenger config
    └── .builds/               # build sandbox của Hostinger
```

- **Frontend**: Apache serve trực tiếp từ `public_html/` (nhanh)
- **Backend**: Apache rewrite `/api/*` và `/uploads/*` về Passenger →
  Passenger chạy `nodejs/build/server/index.js`
- **Database**: SQLite ở `~/private/herbspalab.db` (ngoài public_html, ngoài nodejs/)
  → không bị wipe khi redeploy, không bị Apache leak

## 2. Setup ban đầu (chỉ làm 1 lần)

### 2.1 Tạo Node.js application

**hPanel → Advanced → Node.js → Create application**:

| Field | Value |
|-------|-------|
| Application Root | `domains/herbspalab.com/nodejs` |
| Application URL | `herbspalab.com` |
| Application Startup File | `build/server/index.js` |
| Node version | 20.x |

### 2.2 Cấu hình Git Deployment

**hPanel → Deployments → Create / Edit**:

| Field | Value |
|-------|-------|
| Repository | `https://github.com/HoangMinhKhanhDev/herbspalab-web.git` |
| Branch | `main` |
| Auto deployment on push | ✅ Bật |
| **Framework** | `Other` |
| **Lệnh xây dựng** | _(trống — postinstall tự build)_ |
| **Trình quản lý gói** | `npm` |
| **Thư mục đầu ra** | `build` |
| **Tệp đầu vào** | `server/index.js` |

> Hostinger sẽ:
> 1. Clone repo về `.builds/source/repository/`
> 2. Chạy `npm install` → trigger `postinstall` → build full pipeline
> 3. Copy nội dung `build/` ra `public_html/` (do Output dir = `build`)
> 4. Copy whole repo về `~/domains/.../nodejs/` cho Passenger
> 5. Append Passenger config vào `public_html/.htaccess`
> 6. Touch `~/domains/.../nodejs/tmp/restart.txt` để Passenger reload

### 2.3 Database directory (chỉ làm 1 lần qua SSH)

```bash
mkdir -p ~/private && chmod 700 ~/private
```

`prisma db push` ở build sẽ tự tạo file `~/private/herbspalab.db`.

### 2.4 Environment variables

**hPanel → Deployments → Edit → Biến môi trường** (đây là nơi env vars được
tiêm vào cả build phase và runtime — Hostinger sync sang Node.js app):

#### Bắt buộc

| Key | Ví dụ | Mục đích |
|-----|-------|----------|
| `NODE_ENV` | `production` | Bật code production của Express, Helmet |
| `JWT_SECRET` | chuỗi random ≥ 48 ký tự | Ký JWT cookie (sinh: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`) |
| `DATABASE_URL` | `file:/home/u670570555/private/herbspalab.db` | Path tuyệt đối SQLite (thay `u670570555` bằng user của bạn) |
| `CORS_ORIGIN` | `https://herbspalab.com,https://www.herbspalab.com` | Whitelist origin được gọi API |
| `FRONTEND_URL` | `https://herbspalab.com` | Stripe redirect, link email reset password |
| `DOMAIN` | `https://herbspalab.com` | Fallback FRONTEND_URL |
| `HOSTINGER_DEPLOY` | `1` | Cờ cho `scripts/run-if-hostinger.js` (postinstall guard) |

#### Tùy chọn

| Key | Cần khi |
|-----|---------|
| `STRIPE_SECRET_KEY=sk_live_xxx` | Dùng thanh toán Stripe |
| `STRIPE_WEBHOOK_SECRET=whsec_xxx` | Dùng Stripe webhook |
| `MAIL_HOST=smtp.gmail.com` | Gửi email xác nhận đơn hàng |
| `MAIL_PORT=587` | ↑ |
| `MAIL_USER=your@email.com` | ↑ |
| `MAIL_PASS=app_password` | ↑ (Gmail App Password, KHÔNG phải password chính) |

#### ⚠️ TUYỆT ĐỐI KHÔNG đặt

| Key | Lý do |
|-----|-------|
| `PORT` | Hostinger Passenger tự gán port qua `process.env.PORT`. Set cứng → 502 Bad Gateway |
| `HOST` | Để Express bind 0.0.0.0 mặc định |

### 2.5 Verify .htaccess sau deploy đầu tiên

`public_html/.htaccess` PHẢI có 2 rule này **trước** SPA fallback:

```apache
# Forward /api/* và /uploads/* về Node (Passenger)
RewriteRule ^api(/.*)?$ - [L]
RewriteRule ^uploads(/.*)?$ - [L]

# SPA fallback (đặt SAU)
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Hai rule đầu là **bắt buộc**, nếu thiếu thì /api/* sẽ bị rewrite về index.html
(React app render 404 thay vì backend xử lý). Nguồn của 2 rule này là
`frontend/public/.htaccess` — nếu file đó đúng thì Vite copy ra build/, Hostinger
copy ra public_html/.

Verify:

```bash
grep -E "api|uploads" ~/domains/herbspalab.com/public_html/.htaccess
```

### 2.6 Seed admin account (chỉ làm 1 lần)

```bash
cd ~/domains/herbspalab.com/nodejs/build/server
export DATABASE_URL="file:/home/$(whoami)/private/herbspalab.db"

node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
(async () => {
  const email = 'admin@herbspalab.com';
  const hashed = await bcrypt.hash('Admin123@', 10);
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    await prisma.user.update({ where: { email }, data: { password: hashed, role: 'admin', isEmailVerified: true } });
    console.log('Updated admin password');
  } else {
    await prisma.user.create({ data: { name: 'Admin', email, password: hashed, role: 'admin', isEmailVerified: true } });
    console.log('Created admin');
  }
  await prisma.\$disconnect();
})();
"
```

Login: `admin@herbspalab.com` / `Admin123@` — **đổi password ngay sau lần đầu**.

## 3. Quy trình deploy hằng ngày

1. Push code lên `main`.
2. Hostinger Git Deploy tự động:
   - Pull code → `.builds/source/repository/`
   - `npm install` → `postinstall` → `scripts/run-if-hostinger.js`
   - Detect Hostinger env (path `/domains/` hoặc `HOSTINGER_DEPLOY=1`)
   - Run `npm run deploy:hostinger`:
     - Build frontend (Vite → `frontend/dist/`)
     - Build backend (TypeScript → `backend/dist/`)
     - `scripts/consolidate-build.js` → gộp vào `build/`
     - `cd build/server && npm install --omit=dev`
     - `npx prisma generate`
     - `npx prisma db push --skip-generate --accept-data-loss`
   - Sync `build/` → `public_html/`
   - Sync repo → `nodejs/`
   - Touch `nodejs/tmp/restart.txt` → Passenger reload
3. Kiểm tra:
   - `https://herbspalab.com/api/health` → `{"status":"ok","db":"connected"}`
   - `https://herbspalab.com` → React app

## 4. Troubleshooting

### Build log chỉ có `audited 1 package` → postinstall không chạy
Thiếu env `HOSTINGER_DEPLOY=1` HOẶC Hostinger build commit cũ. Push empty
commit để force pull:
```bash
git commit --allow-empty -m "trigger redeploy" && git push
```

### `/api/products` trả về HTML React (404 page)
.htaccess thiếu /api bypass rule. Patch nhanh:
```bash
sed -i '/# SPA Routing/i\
    RewriteRule ^api(/.*)?$ - [L]\
    RewriteRule ^uploads(/.*)?$ - [L]\
' ~/domains/herbspalab.com/public_html/.htaccess
```
Rồi `touch ~/domains/herbspalab.com/nodejs/tmp/restart.txt`.

### `Error code 14: Unable to open the database file`
- Kiểm tra `DATABASE_URL` là **absolute path** với prefix `file:`
- Kiểm tra file tồn tại: `ls -la ~/private/`
- Kiểm tra quyền: `chmod 600 ~/private/*.db && chmod 700 ~/private/`
- Nếu mất file: `cd ~/domains/.../nodejs/build/server && export DATABASE_URL=... && npx prisma db push`

### `Cannot find module '@prisma/client'`
node_modules thiếu trong `nodejs/build/server/`. Reinstall:
```bash
cd ~/domains/herbspalab.com/nodejs/build/server
npm install --omit=dev --no-audit --no-fund
npx prisma generate
touch ~/domains/herbspalab.com/nodejs/tmp/restart.txt
```

### App không nhận env vars mới
Restart Passenger:
```bash
touch ~/domains/herbspalab.com/nodejs/tmp/restart.txt
```
Hoặc bấm **Restart** trong hPanel Node.js page.

### `502 Bad Gateway`
Passenger không start được app. Nguyên nhân thường gặp:
1. Set cứng `PORT` env → bỏ
2. App crash khi start (thiếu env bắt buộc) — xem **Node.js Logs** trong hPanel
3. Application Startup File sai path

### Login treo / hang vô hạn
- DB không mở được → check log
- CORS sai → check `CORS_ORIGIN` env có đúng domain không
- Mở DevTools Network tab xem request thực tế

### `uv_cwd` error khi chạy lệnh SSH
Shell đang ở directory đã bị Hostinger wipe (`.builds/source/`). Fix:
```bash
cd ~
```

## 5. Backup database

Thêm vào crontab (`crontab -e`):

```cron
# Backup SQLite database hằng ngày 2h sáng
0 2 * * * cp ~/private/herbspalab.db ~/private/backups/herbspalab-$(date +\%Y\%m\%d).db && find ~/private/backups -name "*.db" -mtime +30 -delete
```

Tạo folder backup trước:
```bash
mkdir -p ~/private/backups && chmod 700 ~/private/backups
```

## 6. Manual deploy (fallback)

Build local rồi upload qua SFTP/File Manager:

```bash
# Trên máy local
npm run build
# build/ giờ đã đầy đủ
```

Upload `build/*` vào `public_html/`, upload nguyên repo + `build/` vào `nodejs/`,
rồi SSH:

```bash
cd ~/domains/herbspalab.com/nodejs/build/server
npm install --omit=dev
npx prisma generate
npx prisma db push --skip-generate
touch ~/domains/herbspalab.com/nodejs/tmp/restart.txt
```

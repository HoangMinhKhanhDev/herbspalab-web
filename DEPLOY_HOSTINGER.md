# Deploy HerbSpaLab lên Hostinger

Repo deploy qua **Hostinger Node.js Web Apps** (hPanel → Node.js). Khi push lên
`main`, Hostinger tự động build và deploy.

## 🎯 QUAN TRỌNG: Deployment đã được đơn giản hóa!

**Không cần SSH seed data thủ công!** Seed data tự động chạy sau mỗi lần deploy.
**Không cần postinstall hook!** Hostinger dùng Build command trực tiếp.

## 1. Cấu hình Hostinger Node.js Web Apps

**hPanel → Node.js → Edit application:**

| Field | Value |
|-------|-------|
| Framework preset | `Other` |
| Branch | `main` |
| Node version | `20.x` |
| Root directory | `./` |
| **Build command** | `npm run deploy:hostinger` |
| Package manager | `npm` |
| **Output directory** | `build` |
| **Entry file** | `server/index.js` |

> Hostinger sẽ:
> 1. Clone repo về
> 2. Chạy `npm install`
> 3. Chạy Build command: `npm run deploy:hostinger` → build frontend + backend + consolidate
> 4. Copy `build/` → output directory
> 5. Chạy `node server/index.js`

## 2. Environment variables (QUAN TRỌNG)

**hPanel → Deployments → Edit → Environment Variables**

Tất cả env vars bắt buộc phải được set. Xem file `HOSTINGER_ENV_TEMPLATE.md` trong repo để có danh sách đầy đủ và hướng dẫn chi tiết.

**Env vars bắt buộc:**
```bash
NODE_ENV=production
JWT_SECRET=<your-random-48-char-string>  # Generate: node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
DATABASE_URL=file:/home/$(whoami)/private/herbspalab.db  # Thay $(whoami) bằng user thật
CORS_ORIGIN=https://herbspalab.com,https://www.herbspalab.com
FRONTEND_URL=https://herbspalab.com
DOMAIN=https://herbspalab.com
UPLOADS_DIR=/home/$(whoami)/uploads_data
```

**Validate env vars trước khi deploy:**
```bash
npm run validate:env
```

### 2.4 Database directory (chỉ làm 1 lần qua SSH)

```bash
mkdir -p ~/private && chmod 700 ~/private
```

`prisma db push` ở build sẽ tự tạo file `~/private/herbspalab.db`.

### 2.5 Uploads directory (chỉ làm 1 lần qua SSH)

```bash
mkdir -p ~/uploads_data && chmod 755 ~/uploads_data
```

### 2.6 Verify .htaccess sau deploy đầu tiên

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
     - **`node prisma/seed-demo.js` → TỰ ĐỘNG seed data!** (nếu DB trống)
   - Sync `build/` → `public_html/`
   - Sync repo → `nodejs/`
   - Touch `nodejs/tmp/restart.txt` → Passenger reload
3. Kiểm tra:
   - `https://herbspalab.com/api/health` → `{"status":"ok","db":"connected"}`
   - `https://herbspalab.com/products` → Phải thấy 10 sản phẩm
   - `https://herbspalab.com/news` → Phải thấy 5 bài blog
   - `https://herbspalab.com` → React app

## 4. Troubleshooting

### Environment variables not working
Validate env vars:
```bash
cd ~/domains/herbspalab.com/nodejs
npm run validate:env
```

If validation fails, check hPanel → Deployments → Edit → Environment Variables.

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

Script backup đã có sẵn: `scripts/backup-db.sh`. Setup:

```bash
# Tạo thư mục scripts và copy backup script
mkdir -p ~/scripts
cp ~/domains/herbspalab.com/nodejs/scripts/backup-db.sh ~/scripts/
chmod +x ~/scripts/backup-db.sh

# Tạo thư mục backup
mkdir -p ~/private/backups && chmod 700 ~/private/backups

# Thêm vào crontab (crontab -e)
0 2 * * * ~/scripts/backup-db.sh >> ~/scripts/backup.log 2>&1
```

Script này sẽ:
- Backup SQLite database mỗi ngày lúc 2h sáng
- Nén backup bằng gzip
- Giữ backup 30 ngày (tự động xóa cũ)
- Ghi log vào `~/scripts/backup.log`

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

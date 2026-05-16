# Deploy HerbSpaLab lên Hostinger (Git Deployment)

Repo này deploy qua **Hostinger Git Deployment** (hPanel → Deployments).
Mỗi khi push lên `main`, Hostinger tự clone repo, chạy `npm install`,
postinstall sẽ tự build frontend + backend, install prod deps, đẩy schema
SQLite, rồi Passenger khởi động app qua `npm start`.

## 1. Setup ban đầu (chỉ làm 1 lần)

### 1.1 Tạo Node.js application

Vào **hPanel → Advanced → Node.js**:

- **Application Root**: `domains/herbspalab.com/public_html`
- **Application URL**: `herbspalab.com`
- **Application Startup File**: `build/server/index.js`
  *(Hostinger sẽ chạy lệnh tương đương `node build/server/index.js`)*
- **Node version**: 20.x trở lên

### 1.2 Kết nối Git Deployment

Vào **hPanel → Advanced → Git** (hoặc tab **Deployments** của app):

- **Repository URL**: `https://github.com/HoangMinhKhanhDev/herbspalab-web.git`
- **Branch**: `main`
- **Deploy path**: cùng path với Application Root ở trên
- Bật **Auto deployment on push**

### 1.3 Environment variables

Vào **Node.js → Environment Variables** của app, thêm:

| Key | Ví dụ | Bắt buộc |
|-----|-------|----------|
| `NODE_ENV` | `production` | ✅ |
| `JWT_SECRET` | chuỗi random ≥ 32 ký tự | ✅ |
| `DATABASE_URL` | `file:/home/u123/private/herbspalab.db` (absolute path) | ✅ |
| `CORS_ORIGIN` | `https://herbspalab.com,https://www.herbspalab.com` | ✅ |
| `FRONTEND_URL` | `https://herbspalab.com` | ✅ |
| `DOMAIN` | `https://herbspalab.com` | ✅ |
| `HOSTINGER_DEPLOY` | `1` | ✅ — bật build trong `postinstall` |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` | nếu dùng Stripe |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` | nếu dùng Stripe |
| `MAIL_HOST` | `smtp.gmail.com` | nếu cần email |
| `MAIL_PORT` | `587` | nếu cần email |
| `MAIL_USER` | `your@email.com` | nếu cần email |
| `MAIL_PASS` | App password Google | nếu cần email |

> **⚠️ KHÔNG đặt `PORT`** — Hostinger Passenger tự gán port động vào `process.env.PORT`.
>
> **⚠️ `HOSTINGER_DEPLOY=1` bắt buộc** — đây là cờ để script `postinstall` biết
> đang chạy trong môi trường Hostinger và thực hiện build (tránh build vô tình
> trên máy local hoặc CI).

### 1.4 Database location

Khuyến nghị đặt SQLite **ngoài `public_html`** để Apache không thể serve được:

```bash
# SSH vào Hostinger
mkdir -p ~/private && chmod 700 ~/private
# Lần đầu: prisma db push sẽ tự tạo file db rỗng tại path bạn chỉ định
```

## 2. Quy trình deploy

1. Push code lên `main`.
2. Hostinger Git Deploy tự động:
   1. Pull code mới về `public_html/`.
   2. Chạy `npm install` ở root.
   3. `postinstall` → `scripts/run-if-hostinger.js` → phát hiện môi trường Hostinger → chạy `npm run deploy:hostinger`:
      - Build frontend (Vite → `frontend/dist/`)
      - Build backend (TypeScript → `backend/dist/`)
      - `scripts/consolidate-build.js` → gộp vào `build/`
      - `cd build/server && npm install --omit=dev`
      - `npx prisma generate`
      - `npx prisma db push --skip-generate --accept-data-loss`
   4. Passenger khởi động: `node build/server/index.js`.
3. Kiểm tra:
   - `https://herbspalab.com` → React app
   - `https://herbspalab.com/api/products` → JSON

## 3. Cấu trúc thư mục trên server sau deploy

```
public_html/
├── .git/                       # Hostinger Git clone
├── frontend/                   # Source code
├── backend/                    # Source code
├── scripts/                    # Build helpers
├── package.json                # Root: start, build scripts
├── node_modules/               # Root deps (concurrently)
├── build/                      # ← Output sau build
│   ├── index.html              # React entry
│   ├── assets/                 # JS/CSS hashed
│   ├── .htaccess               # (không dùng cho Node app, OK)
│   ├── uploads/                # Ảnh user upload (giữ qua các lần deploy)
│   ├── server/                 # ← Backend (Passenger startup file ở đây)
│   │   ├── index.js
│   │   ├── routes/, controllers/, ...
│   │   ├── node_modules/       # Production deps
│   │   └── prisma/
│   │       └── schema.prisma
│   └── package.json
```

> Passenger proxy **mọi request** vào Node app. Backend (`backend/src/index.ts`)
> serve cả static frontend (`build/`) và API (`/api/*`) — không cần `.htaccess` SPA rewrite.

## 4. Deploy thủ công (fallback)

Trên máy local:

```bash
npm run build              # tạo build/
# Sau đó upload toàn bộ build/ vào public_html/build/ qua File Manager / SFTP
```

Trên SSH Hostinger:

```bash
cd ~/domains/herbspalab.com/public_html/build/server
npm install --omit=dev
npx prisma generate
npx prisma db push --skip-generate
# Restart Node app trong hPanel hoặc:
mkdir -p ../tmp && touch ../tmp/restart.txt
```

## 5. Troubleshooting

### "Triển khai xây dựng thất bại" – log chỉ có `audited 1 package`
→ Thiếu env var `HOSTINGER_DEPLOY=1`. Postinstall đang skip build.
Thêm vào Node.js Environment Variables và deploy lại.

### "Cannot find module @prisma/client" khi start
→ `cd build/server && npm install --omit=dev && npx prisma generate`,
hoặc redeploy.

### "API trả về 502 / Application failed to start"
→ Xem log: hPanel → Node.js → app → **Logs**. Thường là:
- Thiếu env var bắt buộc (`JWT_SECRET`, `DATABASE_URL`)
- `DATABASE_URL` trỏ tới path không có quyền ghi
- Port conflict (đảm bảo KHÔNG set `PORT` env)

### "CORS blocked"
→ `CORS_ORIGIN` phải gồm cả `https://herbspalab.com` lẫn `https://www.herbspalab.com`.

### "Stripe redirect về localhost"
→ Đặt `FRONTEND_URL=https://herbspalab.com` và redeploy.

### Upload ảnh fail
→ Backend tự `mkdir -p` uploads dir khi khởi động. Nếu vẫn lỗi:
```bash
cd ~/domains/herbspalab.com/public_html/build
mkdir -p uploads && chmod 755 uploads
```

### Build OOM / timeout trên Hostinger
→ Build trên container Hostinger có RAM hạn chế. Cách giải quyết:
- Build local rồi push thẳng `build/` (xem mục 4)
- Hoặc dùng GitHub Actions FTP deploy (phiên bản trước của repo này)

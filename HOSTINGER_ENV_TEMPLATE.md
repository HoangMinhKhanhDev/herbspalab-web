# Hostinger Environment Variables Configuration

## Required Environment Variables (Bắt buộc)

Set these in **hPanel → Deployments → Edit → Environment Variables**:

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `NODE_ENV` | `production` | Production mode (enables Helmet, disables Swagger) |
| `JWT_SECRET` | `your-random-48-char-string` | JWT signing secret (generate with: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`) |
| `DATABASE_URL` | `file:/home/u670570555/private/herbspalab.db` | SQLite database absolute path with `file:` prefix. Replace `u670570555` with your actual username |
| `CORS_ORIGIN` | `https://herbspalab.com,https://www.herbspalab.com` | Comma-separated whitelist of allowed origins for API calls |
| `FRONTEND_URL` | `https://herbspalab.com` | Frontend URL (used for Stripe redirects, password reset emails) |
| `DOMAIN` | `https://herbspalab.com` | Fallback for FRONTEND_URL |
| `HOSTINGER_DEPLOY` | `1` | Flag to enable auto-build on Hostinger (triggers postinstall hook) |

## Optional Environment Variables (Tùy chọn)

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `UPLOADS_DIR` | `/home/u670570555/uploads_data` | Absolute path for persistent user uploads (outside app directory to survive redeploys) |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe secret key for payments |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe webhook secret for payment confirmation |
| `EMAIL_USER` | `your-email@herbspalab.com` | SMTP username for email notifications |
| `EMAIL_PASS` | `your-app-password` | SMTP password for email notifications |
| `PORT` | *(DO NOT SET)* | Passenger manages port automatically. DO NOT SET THIS VARIABLE |

## Quick Setup Commands

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Get your username (for DATABASE_URL and UPLOADS_DIR):
```bash
whoami
# Output: u670570555 (example)
```

## Example Full Configuration

```
NODE_ENV=production
JWT_SECRET=AbCdEf1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf1234567890
DATABASE_URL=file:/home/u670570555/private/herbspalab.db
CORS_ORIGIN=https://herbspalab.com,https://www.herbspalab.com
FRONTEND_URL=https://herbspalab.com
DOMAIN=https://herbspalab.com
HOSTINGER_DEPLOY=1
UPLOADS_DIR=/home/u670570555/uploads_data
```

## Verification

After setting environment variables, run the verification script:

```bash
cd ~/domains/herbspalab.com/nodejs
npm run verify:deploy
```

This will check:
- ✅ All required env vars are set
- ✅ Database file exists
- ✅ Uploads directory exists (or can be created)
- ✅ API is responding

## Troubleshooting

### App not using new env vars
Restart Passenger:
```bash
touch ~/domains/herbspalab.com/nodejs/tmp/restart.txt
```

### Database file not found
Run db push manually:
```bash
cd ~/domains/herbspalab.com/nodejs/build/server
export DATABASE_URL=file:/home/$(whoami)/private/herbspalab.db
npx prisma db push
```

### Uploads directory not found
Create it manually:
```bash
mkdir -p ~/uploads_data
chmod 755 ~/uploads_data
```

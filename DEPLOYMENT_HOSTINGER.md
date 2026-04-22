# Hostinger VPS Deployment Guide (Ubuntu)

This project consists of a **NestJS Backend** and a **Next.js Frontend**.

## Prerequisites
- VPS running Ubuntu (standard on Hostinger)
- Node.js (v20+) and npm installed
- MySQL Server installed or a remote MySQL DB
- PM2 (Process Manager) installed: `npm install -g pm2`
- Nginx (for reverse proxy)

---

## 1. Environment Setup

### Backend (.env)
Create `backend/.env` on the server:
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DB_NAME"
JWT_SECRET="generate-a-long-random-string"
JWT_EXPIRES_IN="7d"
PORT=3007
```

### Frontend (.env.local)
Create `frontend/.env.local` on the server:
```env
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
```

---

## 2. Install & Build

```bash
# Backend
cd backend
npm install
npx prisma generate
npm run build

# Frontend
cd ../frontend
npm install
npm run build
```

---

## 3. Launch with PM2

Go to the project root and run:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 4. Nginx Configuration

Create `/etc/nginx/sites-available/herbes` (replace yourdomain.com):

```nginx
# Frontend Server
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/herbes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. SSL (Recommended)
Use Certbot for free certificates:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## 6. Important Notes
- **Uploads folder**: Ensure the backend has permissions to write to `frontend/public/images`.
- **Database**: Run migrations on production if needed: `npx prisma migrate deploy`.

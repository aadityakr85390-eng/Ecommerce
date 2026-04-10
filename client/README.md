# Ecommerce App (Frontend + Backend)

This repo contains:
- **Frontend**: React (CRA) app in `client/`
- **Backend**: Express + MongoDB API in the project root (`server.js`)

---

## Run (recommended)
From `e-commerce/` folder:

```bash
cd "C:\Users\rounak\Desktop\AWTPROJECT\AWTPROJECT\e-commerce"
npm run dev
```

Expected URLs:
- **Frontend**: `http://localhost:3000/`
- **Backend**: `http://localhost:8080/`
- **Uploads**: `http://localhost:8080/uploads/<filename>`

---

## Environment variables

### Backend: `e-commerce/.env`
Required:
- `MONGO_URL=...`
- `JWT_SECRET=...`
- `PORT=8080`

### Frontend: `e-commerce/client/.env`
Required:
- `REACT_APP_API=http://localhost:8080`

---

## Seed minimum catalog (20+ products)
If you want to auto-add categories/products quickly:

```bash
cd "C:\Users\rounak\Desktop\AWTPROJECT\AWTPROJECT\e-commerce"
node seedProducts.js
```

---

## Roles & Admin panel

### User
- Register/Login
- User dashboard: `/dashboard`
- Forgot password: `/forgot-password` (demo OTP flow)

### Admin
- Register select **Account type = Admin**
- Login ke baad navbar me **Dashboard** pe click → `/dashboard/admin`
- Admin can manage:
  - Categories: `/dashboard/admin/categories`
  - Products: `/dashboard/admin/products` (add/edit/delete + image upload)

---

## Backend API (high-level)
- Auth:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/forgot-password`
  - `POST /api/v1/auth/verify-otp`
  - `POST /api/v1/auth/reset-password`
  - `PUT /api/v1/auth/profile` (protected)
  - `GET /api/v1/auth/admin-auth` (admin protected)
- Category:
  - `GET /api/v1/category`
  - `POST /api/v1/category` (admin protected)
- Product:
  - `GET /api/v1/product`
  - `GET /api/v1/product/:id`
  - `POST /api/v1/product` (admin protected, multipart `photo`)
  - `PUT /api/v1/product/:id` (admin protected)
  - `DELETE /api/v1/product/:id` (admin protected)

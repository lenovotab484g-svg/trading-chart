# Trading Watchlist API

REST API برای مدیریت لیست‌های دیده‌بان معاملات با Express و MongoDB

## نیازمندی‌ها

- Node.js (v18+)
- MongoDB (v5.0+)
- npm یا yarn

## نصب

```bash
npm install
```

## تنظیمات

1. فایل `.env` را ایجاد کنید (از `.env.example` استفاده کنید):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/trading-watchlist
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=3h
SMS_API_KEY=your_sms_api_key
SMS_API_URL=https://api.sms.com
NODE_ENV=development
```

## اجرا

### توسعه (Development)

```bash
npm run dev
```

### تولید (Production)

```bash
npm start
```

## API Endpoints

### احراز هویت (Authentication)

- `POST /api/auth/request-code` - درخواست کد پیامکی
- `POST /api/auth/verify-code` - تأیید کد و ثبت‌نام/ورود
- `POST /api/auth/refresh-token` - تجدید توکن

### دیده‌بان (Watchlist)

- `POST /api/watchlists` - ایجاد دیده‌بان جدید
- `GET /api/watchlists` - دریافت تمام دیده‌بان‌ها
- `PUT /api/watchlists/:id` - ویرایش دیده‌بان
- `DELETE /api/watchlists/:id` - حذف دیده‌بان
- `POST /api/watchlists/:id/symbols` - اضافه کردن نماد
- `DELETE /api/watchlists/:id/symbols/:symbolId` - حذف نماد
- `PUT /api/watchlists/reorder/lists` - تغییر ترتیب دیده‌بان‌ها
- `PUT /api/watchlists/:id/reorder/symbols` - تغییر ترتیب نمادها

### نماد (Symbol)

- `GET /api/symbols` - دریافت نمادها
- `GET /api/symbols/search` - جستجوی نمادها
- `POST /api/symbols` - ایجاد نماد جدید
- `PUT /api/symbols/:id/price` - به‌روز رسانی قیمت نماد

## ساختار پروژه

```
src/
├── config/          # تنظیمات
├── controllers/     # کنترلرها
├── middleware/      # میدل‌ورها
├── models/          # مدل‌های Mongoose
├── routes/          # مسیرها
├── utils/           # توابع کمکی
└── index.js         # ورودی
```

## ویژگی‌ها

✅ احراز هویت با کد پیامکی
✅ JWT Token با مدت 3 ساعت
✅ سیستم ریفرال
✅ مدیریت اشتراک (تک کاربره/چند کاربره)
✅ مدیریت دستگاه‌های فعال
✅ مدیریت دیده‌بان‌ها و نمادها
✅ تغییر ترتیب دیده‌بان‌ها و نمادها
✅ Rate Limiting
✅ CORS
✅ Security Headers (Helmet)

## لایسنس

MIT

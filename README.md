# Avto.uz backend

Express, TypeScript va MongoDB/Mongoose asosidagi avtomobil e’lonlari platformasi. Xaridor/sotuvchi frontend React + TypeScript, admin sahifalari esa EJS orqali serverda render qilinadi.

## Talablar va ishga tushirish

- Node.js 20 yoki undan yangi versiya
- MongoDB 6 yoki undan yangi versiya

Backend va frontend alohida dependency to‘plamlariga ega. Ikkala katalog uchun ham `npm install` bajaring. `.env.example` faylidan `.env` nusxa oling va `JWT_SECRET` hamda `SESSION_SECRET` qiymatlarini uzun, tasodifiy maxfiy qiymatlar bilan almashtiring. `MONGO_URI` ishlaydigan MongoDB manzilini ko‘rsatishi kerak.

```bash
# Terminal 1 — backend
npm install
npm run dev
```

```bash
# Terminal 2 — React frontend
cd frontend
npm install
npm run dev
```

Vite `http://localhost:5173` dagi `/api` so‘rovlarini `http://localhost:3000` backend’iga yo‘naltiradi. Ishlab chiqarishda frontend build’ini `frontend/dist` ichiga yarating; Express shu papka mavjud bo‘lsa, React sahifasini va statik fayllarni o‘sha server orqali tarqatadi.

Ikkala qismini build qilish: root papkada `npm run build:all`. Faqat backend: `npm run build`; ishlab turgan backend: `npm start`.

## Tuzilma

- `src/routes/` — endpointlarni controllerlarga bog‘laydi.
- `src/controllers/` — HTTP so‘rov/javob va tilga mos xatolarni boshqaradi.
- `src/models/*.service.ts` — Mongoose orqali biznes amallari; token/session yozuvlari ham MongoDB’da saqlanadi.
- `src/views/admin/` va `src/public/css/` — admin BSSR sahifalari va uslublari.
- `frontend/` — React SPA, API bilan Vite proxy orqali gaplashadi va production’da `frontend/dist` ga build bo‘ladi.

Frontend React Router va MUI Material komponentlaridan foydalanadi. `src/app/components/MaterialTheme/` ranglar, typography, shadows va MUI component override’larini bir joyda belgilaydi. `src/app/screens/` ichidagi sahifalar: `homePage`, `productsPage`, `sellPage`, `userPage`, `authPage` va `helpPage`; umumiy header hamda footer barcha sahifalarda ko‘rinadi. Sahifalar mustaqil komponentlarni props yoki SessionContext orqali birlashtiradi, API chaqiruvlari `src/lib/api.ts` ichida jamlangan.

Frontend marshrutlari: `/`, `/cars`, `/cars/:id`, `/sell`, `/account`, `/login`, `/register` va `/help`. Noma’lum manzillar 404 sahifasini ko‘rsatadi.
- `src/public/images/uploads/` — yuklangan rasmlar; `UPLOAD_DIR` orqali yo‘lni o‘zgartirish mumkin.

## API

| Method | Path | Vazifa |
| --- | --- | --- |
| POST | `/api/members/signup` | Hisob yaratish (`type` ixtiyoriy: `BUYER` yoki `SELLER`; default `BUYER`) |
| POST | `/api/members/login` | Kirish, JWT va MongoDB session yozuvi |
| POST | `/api/members/logout` | Joriy sessionni bekor qilish |
| GET | `/api/members/me` | Joriy foydalanuvchi profili |
| POST | `/api/members/me/avatar` | Profil rasmini yuklash (`avatar` maydoni) |
| GET | `/api/cars` | Faol e’lonlar; `q`, `page`, `limit`, `make`, `model`, `region`, `fuel`, `transmission`, `minPrice`, `maxPrice` filtrlari |
| GET | `/api/cars/:id` | E’lon tafsiloti |
| POST | `/api/cars` | Sotuvchi hisobidan avtomobil e’loni va rasmlarini yuborish (`images` multipart maydoni) |
| GET | `/api/cars/mine` | Joriy sotuvchining e’lonlari |
| PATCH | `/api/cars/:id` | O‘z e’lonini yangilash; o‘zgartirish moderatsiyaga qaytariladi |
| DELETE | `/api/cars/:id` | O‘z e’lonini o‘chirish |
| GET | `/admin/login` | Admin kirish sahifasi |
| GET | `/admin/cars` | E’lonlar ro‘yxati va moderatsiya |
| POST | `/admin/cars/:id/moderate` | `action=approve`, `reject`, `activate`, `pause` yoki `block` |
| POST | `/admin/cars/:id/delete` | E’lonni butunlay o‘chirish |
| GET | `/admin/users` | Foydalanuvchilar ro‘yxati va status boshqaruvi |
| POST | `/admin/users/:id/status` | `action=activate`, `pause` yoki `block` |
| POST | `/admin/users/:id/delete` | User va uning e’lonlarini o‘chirish |

Admin panelida e’lonlar hamda foydalanuvchilarni boshqarish mumkin. Statusni `pause` yoki `block` qilish foydalanuvchining mavjud sessiyalarini bekor qiladi; admin akkauntlarini bu paneldan o‘zgartirib bo‘lmaydi. Admin sahifasidagi `UZ`, `RU`, `EN`, `KO` tugmalari panel tilini tanlaydi. Foydalanuvchi saytida yuqori paneldagi til tanlagich tanlovni brauzerda saqlaydi.

`/api` endpointlari JSON xatolarida `Accept-Language` headeridagi `uz`, `ru`, `en` yoki `ko` tilini ishlatadi. E’lonlar moderatsiyadan keyingina ommaga ko‘rinadi.

## Birinchi administrator

Ro‘yxatdan o‘tish endpointi ommaviy foydalanuvchini `BUYER` sifatida yaratadi. Birinchi administratorni faqat ishonchli MongoDB muhitida alohida seed/administrativ jarayon bilan `ADMIN` turiga o‘tkazing; admin rolini ommaviy API orqali belgilash ataylab taqiqlangan.

## Muhim sozlamalar

`PORT`, `MONGO_URI`, `JWT_SECRET`, `SESSION_SECRET`, `JWT_EXPIRES_IN`, `SESSION_TTL_DAYS`, `UPLOAD_DIR` va `MAX_UPLOAD_MB` qiymatlari `.env` orqali boshqariladi. Upload faqat JPEG, PNG va WebP formatlarini qabul qiladi.

# Smart Inventory & Billing System (Full‑JS)

**Lightweight web app for small shops and agro stores** — manage products, inventory, billing/POS, barcode scanning, and payments (UPI QR + Cash). This project is intentionally simple and reliable: no machine learning, all product data is entered manually or imported via CSV.

---

## Quick summary

* **Purpose:** Provide a dependable, easy-to-use POS + inventory web app for small merchants.
* **Audience:** Small shop owners, agro stores, grocers, and cashiers.
* **MVP scope:** Product management, stock tracking, POS billing with barcode scanning, UPI QR & cash payments, printable receipts, basic sales dashboard.

---

## Key features

1. **Product management** – add, edit, delete products; bulk CSV import; auto-generate barcode images and printable labels.
2. **Inventory tracking** – live stock counts per SKU; automatic decrement on sale; low-stock alerts.
3. **POS / Billing** – webcam or scanner barcode input, cart management, discounts/taxes, cash & UPI QR payment flows, printable receipts.
4. **Sales dashboard** – today’s sales, top-sellers, stock summary, simple date-range filters.
5. **User roles** – `admin` (full access) and `cashier` (billing only).
6. **Extensible** – optional WordPress sync, Docker support, deployable to common cloud providers.

---

## Tech stack

* **Frontend:** React + TypeScript (Vite recommended)
* **Styling:** Tailwind CSS (or plain CSS)
* **Backend:** Node.js + Express (+ TypeScript suggested)
* **Database:** MongoDB (Atlas recommended)
* **Auth:** JWT
* **Barcode generation:** `jsbarcode` (client) or `bwip-js` (server)
* **Barcode scanning:** `html5-qrcode` or `quaggaJS` (webcam)
* **QR generation:** `qrcode` (UPI URI -> QR)
* **Deployment:** Vercel for frontend; Render/Cloud Run/Heroku for backend
* **Optional:** Docker / docker-compose

---

## Repository layout (short)

```
smart-inventory-billing/
├── backend/
├── frontend/
├── docs/
├── scripts/
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## CSV format for product import

CSV must have a header row. Required fields are bold.

```
sku,name,category,price,**stock**,unit,barcode (optional),low_stock_threshold (optional),description
```

Example row:

```
SKU001,Tomato,Vegetable,40,100,kg,,10,Fresh red tomatoes
```

---

## Database schemas (simplified)

**Product**

```json
{
  "sku": "SKU001",
  "name": "Tomato",
  "category": "Vegetable",
  "price": 40,
  "stock": 100,
  "unit": "kg",
  "barcode": "123456789012",
  "low_stock_threshold": 10
}
```

**User**

```json
{
  "email": "cashier@example.com",
  "passwordHash": "...",
  "role": "cashier"
}
```

**Sale**

```json
{
  "saleId": "S20251029-001",
  "items": [{ "sku": "SKU001", "qty": 2, "price": 40 }],
  "total": 80,
  "paymentMethod": "cash",
  "paymentStatus": "paid",
  "createdBy": "userId",
  "createdAt": "2025-10-29T10:00:00Z"
}
```

---

## API endpoints (example)

* `POST /api/auth/login` — returns JWT
* `POST /api/auth/refresh` — exchange refresh token for access token
* `GET /api/products` — list products (supports search & pagination)
* `GET /api/products/:sku` — product detail
* `POST /api/products` — add product
* `PUT /api/products/:sku` — update product
* `POST /api/products/upload` — CSV bulk upload
* `GET /api/products/:sku/barcode` — barcode image (SVG/PNG)
* `POST /api/sales` — create sale record
* `GET /api/sales?from=&to=` — sales report
* `GET /api/dashboard` — KPI summary

> Note: Adapt routes to your favorite REST structure or switch to GraphQL later.

---

## Getting started — prerequisites

Make sure you have the following installed on your development machine:

* Node.js (v16+ recommended)
* npm or yarn
* MongoDB (local) or a MongoDB Atlas cluster
* Git
* (Optional) Docker & docker-compose for containerized local setup

---

## Environment variables

Create `.env` files for frontend and backend from the provided `.env.example`.

`backend/.env` (example):

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/smart-inventory
JWT_SECRET=your_jwt_secret_here
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
UPI_MERCHANT=merchant@upi
```

`frontend/.env` (example):

```
VITE_API_BASE_URL=http://localhost:4000/api
```

Security note: never commit `.env` to Git.

---

## Run locally — quick start (no Docker)

### 1. Clone repo

```bash
git clone https://github.com/<your-org>/smart-inventory-billing.git
cd smart-inventory-billing
```

### 2. Setup backend

```bash
cd backend
cp .env.example .env
# edit .env to set your MongoDB URI and JWT secret
npm install
npm run dev   # or `node dist/server.js` after building
```

This starts the Express API on `http://localhost:4000` by default.

### 3. Setup frontend

Open another terminal

```bash
cd frontend
cp .env.example .env
# edit .env and set VITE_API_BASE_URL if needed
npm install
npm run dev
```

Vite will start the frontend on `http://localhost:5173` (or another available port). The frontend communicates with the backend via the `VITE_API_BASE_URL`.

---

## Run locally — with Docker (optional)

A `docker-compose.yml` can orchestrate MongoDB, backend and frontend. Example workflow:

```bash
# from repo root
docker compose up --build
```

This builds images for backend and frontend and starts a MongoDB container. Check `docker-compose.yml` for ports and env mapping.

---

## Seed admin user (basic)

A small script in `backend/scripts/seedAdmin.js` should create an admin user if none exists. Run:

```bash
node scripts/seedAdmin.js
```

Or use a POST request:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123","role":"admin"}'
```

---

## POS / Billing — how to use

1. Login as a cashier and open the **POS** page.
2. Use a webcam or USB barcode scanner to add items to the cart.

   * Webcam scanning uses `html5-qrcode` and fills the SKU/Barcode field.
   * External scanner emulates keyboard input (enter after barcode).
3. Adjust quantity, apply discount or tax if needed.
4. Choose payment method:

   * **Cash:** enter amount received, system calculates change and completes sale.
   * **UPI QR:** system generates a UPI `upi://pay?...` URI → converted to QR using `qrcode` library. Customer scans and pays.

     * MVP: cashier verifies payment manually and marks sale `paid`.
     * For automatic verification, integrate a payment gateway with callbacks (Razorpay, PhonePe Business APIs, etc.).
5. Print receipt (use browser print or generate PDF on server).

---

## CSV import — tips

* Keep `sku` unique. The import script will skip or update existing SKUs based on your chosen behavior.
* Validate `price` and `stock` are numeric.
* Use UTF‑8 encoding.

Example helper command (backend):

```bash
node scripts/importCsv.js path/to/sample-products.csv
```

---

## Security & best practices

* Use HTTPS for production.
* Store refresh tokens in HttpOnly secure cookies where possible. Avoid storing access tokens in `localStorage`.
* Hash passwords with `bcrypt`.
* Validate all inputs (use `zod` or `joi`).
* Limit endpoints by role (RBAC checks in middleware).
* Rate-limit endpoints that could be abused.

---

## Testing & QA

* Unit test controllers and services (Jest).
* Integration tests for main API flows (supertest + in-memory MongoDB).
* Manual E2E test: create product → create sale → verify stock decrement → generate receipt.

---

## Deployment checklist

* Configure environment variables in hosting provider (Render / Cloud Run / Heroku).
* Use a managed MongoDB (Atlas) in production.
* Enable HTTPS and set proper CORS origin list.
* Setup automatic backups for database.
* Set up a CI pipeline (GitHub Actions) for lint, build, test, and deploy.

---

## Troubleshooting

* **Cannot connect to MongoDB:** verify `MONGODB_URI` and network access (Atlas IP whitelist or VPC).
* **CORS errors:** ensure frontend origin is allowed in backend CORS settings.
* **JWT errors on reload:** implement refresh-token flow and store refresh token in secure cookie.

---

## Next deliverables I can create for you (pick any)

* Full project skeleton (backend + frontend) with routes and bare UI.
* CSV ingestion script and a sample CSV file.
* Small React POS demo with barcode scanning and cart management.
* One‑page PDF roadmap for the client.

Tell me which one you want and I will generate it.

---

## License & credits

MIT License — feel free to reuse and adapt. Built with ❤️ using React, Node.js, and MongoDB.

---

*Document created for: Smart Inventory & Billing System — README.md*

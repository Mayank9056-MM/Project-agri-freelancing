# Smart Inventory & Billing System (No ML) — Roadmap (Full-JS)

**Quick summary:**  
A lightweight, reliable web app for small shops/agro stores to manage products, stock, billing, barcode scanning, and payments (UPI QR + Offline Cash). No machine learning — everything works with manual product entry or CSV upload.

---

## 1 — What you will build (simple)
- A web dashboard for **admins** to add/edit products and upload CSV files.  
- A **billing POS** page for cashiers to scan barcodes, add items to cart, and checkout.  
- Generate product **barcodes** and **QR** codes for payments.  
- Support **online payment** via UPI QR (display QR to customer) and **offline cash** option.  
- Basic **sales reports** and **stock alerts** (low stock).

---

## 2 — Core features (must-haves)
1. **Product Management**
   - Add / edit / delete products manually.
   - Bulk CSV upload (fields listed below).
   - Auto-generate barcode image and downloadable label.

2. **Inventory Tracking**
   - Track current stock per product.
   - Update stock automatically when a sale is recorded.
   - Low-stock alert threshold.

3. **POS / Billing**
   - Barcode scanning via webcam or external scanner.
   - Add items to cart, change quantity, apply discount/tax.
   - Two payment flows:
     - **UPI QR Payment**: generate and show QR (customer scans & pays), then mark as paid.
     - **Cash**: record cash received and complete sale.
   - Generate printable receipt (PDF/HTML).

4. **Sales Dashboard**
   - Today’s sales, top-selling products, stock summary.
   - Simple date-range filtering.

5. **User Roles**
   - Admin (manage products, view reports).
   - Cashier (create bills, scan products).

6. **Optional**: WordPress sync (push product catalog).

---

## 3 — Tech stack (Full JavaScript)
- Frontend: **React** (Vite or CRA) + TypeScript (recommended)  
- Styling: TailwindCSS or simple CSS  
- Backend: **Node.js** + **Express** (TypeScript recommended)  
- Database: **MongoDB Atlas**  
- Auth: JWT (jsonwebtoken)  
- Barcode generation: `jsbarcode` or server-side `bwip-js`  
- Barcode scanning: `html5-qrcode` or `quaggaJS` (webcam)  
- QR generation (UPI): `qrcode` or `upi-payment-qrcode` libs (or manual UPI URI -> QR)  
- Deployment: Vercel (frontend) + Render / Heroku / Cloud Run (backend)  
- Docker for containerization (optional)

---

## 4 — CSV format (for bulk product upload)
Provide CSV with header row; required fields in **bold**:
```
sku,name,category,price,**stock**,unit,barcode (optional),low_stock_threshold (optional),description
```
Example:
```
SKU001,Tomato,Vegetable,40,100,kg,,
```

---

## 5 — Database schema (simplified)

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
  "low_stock_threshold": 10,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**User**
```json
{
  "email": "cashier@example.com",
  "passwordHash": "...",
  "role": "cashier" // or "admin"
}
```

**Sale**
```json
{
  "saleId": "S20251029-001",
  "items": [{ "sku": "SKU001", "qty": 2, "price": 40 }],
  "total": 80,
  "paymentMethod": "cash" | "upi",
  "paymentStatus": "paid" | "pending",
  "createdBy": "userId",
  "createdAt": "..."
}
```

---

## 6 — API endpoints (example)
- `POST /api/auth/login` — returns JWT  
- `GET /api/products` — list products  
- `POST /api/products` — add product  
- `POST /api/products/upload` — CSV upload  
- `GET /api/products/:sku/barcode` — returns barcode image (SVG/PNG)  
- `POST /api/scan` — decode/upload scanned barcode (optional server-side)  
- `POST /api/sales` — create sale record (body includes items & payment info)  
- `GET /api/sales?from=&to=` — sales report  
- `GET /api/dashboard` — summary KPIs

---

## 7 — UI pages / Components
- Login page  
- Dashboard (KPIs, top products, low stock list)  
- Products list (search, add, edit, CSV upload)  
- Product detail (barcode, history)  
- POS / Billing page (scanner, cart, payment options)  
- Receipts (printable)  
- Admin settings (users, thresholds)

---

## 8 — Payment flow (UPI QR + Cash)

### UPI QR flow (simple)
1. Cashier finalizes bill in POS.  
2. System generates UPI payment URI:
   ```
   upi://pay?pa=merchant@upi&pn=StoreName&am=80&cu=INR
   ```
3. Convert URI to QR image using `qrcode` npm package and show to customer.  
4. Customer scans and pays via UPI app.  
5. Cashier verifies payment manually (or if integrated with payment gateway, verifies automatically) and marks sale as **paid**.  
> Note: For full automatic verification you'd need a payment gateway (Razorpay/PhonePe) or UPI callback which requires merchant setup. For MVP, manual verify + mark paid is fine.

### Cash flow
- Cashier selects "Cash" as payment method, enters cash received, system calculates change, marks sale as paid.

---

## 9 — Security basics
- Use HTTPS in production.  
- Store JWT secret and DB credentials in environment variables or secret manager.  
- Hash passwords (bcrypt).  
- Input validation (use `zod` or `joi`).  
- Limit user roles and actions (RBAC).

---

## 10 — Fast development plan (4 weeks)

**Week 1 — Setup & Products**
- Project scaffolding (frontend & backend).  
- Auth (login/signup).  
- Product CRUD + CSV upload.  
- Barcode generation API.

**Week 2 — POS & Billing**
- POS UI (scanner integration).  
- Cart management, apply tax/discount.  
- Sale creation endpoint (cash & UPI placeholder).

**Week 3 — Payments & Receipts**
- UPI QR generation UI.  
- Cash payment flow & change calculation.  
- Receipt generation (printable).  
- Low stock alerts & dashboard basics.

**Week 4 — Testing & Deployment**
- End-to-end testing, bug fixes.  
- Dockerize + deploy (Vercel + Render/Cloud Run).  
- Create simple user manual.

---

## 11 — Estimated cost (INR) — for freelance quoting
- **MVP (core features)**: ₹20,000 – ₹40,000  
- **MVP + polished UI + deployment**: ₹40,000 – ₹70,000

(Prices depend on your experience, timeline and client SLA.)

---

## 12 — Deliverables you should hand to client
- Source code (GitHub link)  
- Deployed app URL (staging/production)  
- Credentials for admin user  
- README with setup & run instructions  
- Short user manual (PDF) showing how to scan, bill and mark payments  
- Postman collection or OpenAPI spec

---

## 13 — Next immediate steps (what I can do now)
1. Generate the **project skeleton** (backend + frontend) with routes and basic UI.  
2. Provide a **CSV ingestion script** and sample CSV file.  
3. Create a **small React POS page** with barcode scanning demo.  
4. Produce a **one-page PDF** version of this roadmap to show to client.

Tell me which of the above you want me to generate immediately and I’ll create it right away.

---
# Project Structure

```
smart-inventory-billing/
├── backend/               # Node.js + Express server
├── frontend/              # React web app (Vite/CRA)
├── docs/                  # API docs, manuals
├── scripts/               # CSV import, utilities
├── .env.example           # Example environment file
├── docker-compose.yml     # Optional: for container setup
└── README.md
```

## Backend

```
  backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── env.js                # Environment variables loader
│   │
│   ├── models/                   # Mongoose models
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Sale.js
│   │
│   ├── controllers/              # Route handlers (logic)
│   │   ├── productController.js
│   │   ├── saleController.js
│   │   ├── authController.js
│   │   └── barcodeController.js
│   │
│   ├── routes/                   # Express routes
│   │   ├── productRoutes.js
│   │   ├── saleRoutes.js
│   │   ├── authRoutes.js
│   │   └── barcodeRoutes.js
│   │
│   ├── services/                 # Helper services (barcode, QR, CSV)
│   │   ├── barcodeService.js
│   │   ├── qrService.js
│   │   ├── csvService.js
│   │   └── reportService.js
│   │
│   ├── middleware/               # Auth & validation
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   │
│   ├── utils/                    # Small utilities
│   │   ├── generateId.js
│   │   └── logger.js
│   │
│   ├── app.js                    # Main Express app setup
│   └── server.js                 # Entry point (starts server)
│
├── package.json
└── .env
```

## Frontend

```
 frontend/
├── src/
│   ├── assets/                    # Images, logos, icons
│   ├── components/                # Reusable UI parts
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── BarcodeScanner.jsx
│   │   ├── PaymentQRModal.jsx
│   │   └── ReceiptPrint.jsx
│   │
│   ├── pages/                     # Main views
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx
│   │   ├── ProductForm.jsx
│   │   ├── POS.jsx
│   │   ├── SalesReport.jsx
│   │   └── Settings.jsx
│   │
│   ├── context/                   # React context (Auth, Cart)
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ProductContext.jsx
│   │
│   ├── services/                  # API calls
│   │   ├── api.js                 # axios config
│   │   ├── productService.js
│   │   ├── saleService.js
│   │   ├── authService.js
│   │   └── reportService.js
│   │
│   ├── hooks/                     # Custom hooks (useAuth, useCart)
│   │   ├── useAuth.js
│   │   └── useCart.js
│   │
│   ├── styles/                    # Tailwind config or global CSS
│   │   └── index.css
│   │
│   ├── App.jsx
│   ├── main.jsx                   # Entry point
│   └── router.jsx                 # React Router setup
│
├── package.json
├── vite.config.js
└── .env

```

## How to start server 

If MongoDB is already running (as standalone):
```bash
sudo systemctl stop mongod
```

```bash
pkill mongod
```

If MoRemove the old socket file (if exist):
```bash
sudo rm -f /tmp/mongodb-27017.sock
```

Ensure MongoDB data folder permissions are correct

MongoDB stores its data in /data/db by default.
Make sure this folder exists and is writable by your user.
```bash
sudo mkdir -p /data/db
sudo chown -R $(whoami) /dta/dba
```

Start MongoDB again as replica set:
```
mongod --replSet rs0 --bind_ip localhost
```

Initialize replica set (in a new terminal):
```
mongosh

rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }]
});

```


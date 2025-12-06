# Smart Inventory Application

## Features

1. 🧾 Point of Sale (POS) System

Add products to cart (by search, SKU, or barcode scan)

Real-time stock update on each sale

Apply discounts (manual + quick buttons)

Supports multiple payment methods:

UPI

Cash

Card

Stripe Checkout (UPI + Cards)

Automatic tax calculation (GST % configurable)

Cart persistence using localStorage

Downloadable invoice PDF

2. 📦 Inventory Management

Add, edit, delete products

Upload product images (Cloudinary)

Bulk product upload via Excel

Barcode/QR code scanning support

View & manage all products

Real-time stock/quantity tracking

Admin/cashier role-based access

3. ⚠️ Low Stock & Alerts

Automatic low-stock detection

Categorizes inventory into:

Critical stock

Low stock

Good stock

Visual graphs & progress bars

Export low-stock list to:

Excel (.xlsx)

CSV

RESTOCK option to increase quantity

Instant refresh button

4. 📊 Sales Analytics Dashboard

Daily/weekly/monthly/yearly stats

Total revenue, total sales, items sold, AOV

Graphs & visual charts (if included)

Complete sales list with:

Payment method

Sold items

Status

Total amount

Timestamp

5. 🧾 Sales Reports

Export PDF, CSV, Excel formats

Beautiful table-style PDF using jsPDF + autoTable

View sale details in modal

Filter by:

Date range

Payment method

Search by ID / product

6. 👤 Authentication & User Roles

Admin & Cashier roles

Admin access to:

User management

Product management

Low stock alerts

Cashier access:

POS billing

Sales report

Protected routes using JWT

7. 📲 Barcode Scanning

Scan barcodes using camera

Auto-fetch product by barcode

Works on mobile & desktop devices

8. 🎨 UI & Theme

Beautiful glassmorphism UI

Light + Dark theme

Smooth animations

Fully responsive sidebar (mobile + desktop)

Gradient buttons, cards, shadows

## Tech stack 


### Frontend

React.js

React Router

TailwindCSS + ShadCN

Lucide Icons

React Hot Toast

LocalStorage persistence

### Backend

Node.js

Express.js

MongoDB + Mongoose

Firebase (optional for real-time features)

Other Integrations

Cloudinary (image upload)

Stripe Payments

jsPDF + autoTable

XLSX + FileSaver

## 🛠️ Installation Guide

1. Clone the repo 
```
  https://github.com/Mayank9056-MM/Project-agri-freelancing
```

2. 2️⃣ Install dependencies

#### Frontend
```
 cd frontend
 npm install
```
#### Backend

```
 cd backend
 npm i
```

3. .env

#### Frontend
```
  VITE_API_URL = http://localhost:5000/api/v1/ // if using local host
```

#### Backend
```
  PORT=5000
MONGO_URI=MONGO_URI=mongodb+srv://:@cluster0.jz5la6c.mongodb.net/

# MONGO_URI=mongodb://localhost:27017/agriDB?replicaSet=rs0

JWT_SECRET=your_jwt_secret
UPI_ID=merchant@upi
STORE_NAME=YourStore

CORS_ORIGIN = http://localhost:5173

NODE_ENV = "development"
MONGODB_URI = mongodb://localhost:27017
ACCESS_TOKEN_SECRET = fdfdfdsffd
ACCESS_TOKEN_EXPIRY =10d
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

STRIPE_SECRET_KEY = 

 STRIPE_WEBHOOK_SECRET = 

 FRONTEND_URL = http://localhost:5173

 # email config
EMAIL_USER = "youremail@gmail.com"
EMAIL_PASS =  "svis ypvu jxjy ddpu"
CLIENT_URL =
APP_NAME = "campus-connect"

```

5. Run project

#### Frontend

``` 
 npm run dev
```

#### Backend

```
  sudo systemctl stop mongod
  sudo rm -f /tmp/mongodb-27017.sock
  mongod --dbpath ~/mongodb/data --replSet rs0
 # Open a new terminal:
  mongosh
  rs.initiate()
  npm run start

```
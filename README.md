# 🎨 New Khushi Resin Creations — Full-Stack E-Commerce & Admin Platform

Ek modern, luxury aur high-performance e-commerce platform jo handcrafted resin art products (Resin Keychains, Jewelry, Photo Frames, Custom Nameplates, Festival Special Items) ke liye banaya gaya hai.

Isme complete **Customer Storefront**, **Razorpay Payment Gateway**, **Cloudinary Media Storage**, aur powerful **Admin Management Panel** (Products, Orders, Reviews) shamil hai.

---

## 📌 Table of Contents (Index)

1. [Tech Stack](#-tech-stack)
2. [Environment Variables Setup (`.env.local`)](#-environment-variables-setup-envlocal)
3. [Admin Credentials & Login](#-admin-credentials--login)
4. [Admin Panel Guide (Features & Kaam Karne Ka Tareeka)](#-admin-panel-guide)
   - [Dashboard Overview (`/admin`)](#1-dashboard-overview-admin)
   - [Products Management (`/admin/products`)](#2-products-management-adminproducts)
   - [Orders Management & Deletion (`/admin/orders`)](#3-orders-management--deletion-adminorders)
   - [Reviews Management (`/admin/reviews`)](#4-reviews-management-adminreviews)
5. [Customer Storefront Features](#-customer-storefront-features)
   - [Continuous Loop Photo Gallery](#continuous-loop-photo-gallery)
   - [Cart & Checkout (Razorpay)](#cart--checkout-razorpay)
6. [Photos & Data Kahan Store Hote Hain?](#-photos--data-kahan-store-hote-hain)
7. [Running the Project (Commands)](#-running-the-project-commands)

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org) + React 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com) (Luxury Purple `#7C3AED` & Royal Gold `#D4AF37` theme)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose 9](https://mongoosejs.com)
- **Authentication:** [NextAuth.js](https://next-auth.js.org) (Secure Admin Credentials Login)
- **Payment Gateway:** [Razorpay](https://razorpay.com) (Online UPI, Cards, NetBanking + Test Payment Simulator)
- **Cloud Media Storage:** [Cloudinary](https://cloudinary.com) (High-speed Cloud CDN for Product & Review Photos)
- **Icons:** [Lucide React](https://lucide.dev)

---

## 🔑 Environment Variables Setup (`.env.local`)

Project ki root directory me `.env.local` file me ye keys set hoti hain:

```env
# Admin Credentials
ADMIN_EMAIL=nitinsaini@gmail.com
ADMIN_PASSWORD=admin123
NEXTAUTH_SECRET=7c1e87205446ccf1694a6af2acdf7264f62c12ff2dd5a76105e7c8846b3b989a
NEXTAUTH_URL=http://localhost:3000

# MongoDB Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ilxsshb.mongodb.net/

# Razorpay Online Payments
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX

# Cloudinary Cloud Image Uploads
CLOUDINARY_CLOUD_NAME=jdkegncv
CLOUDINARY_API_KEY=574738273458939
CLOUDINARY_API_SECRET=k-fuwkHTD2XUgFpeDmpSXZ7s-rk

# Business & Social Links
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
NEXT_PUBLIC_PHONE_NUMBER=+91 98765 43210
NEXT_PUBLIC_EMAIL=newkhushiresincreations@gmail.com
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/newkhushiresincreations
```

---

## 🔐 Admin Credentials & Login

- **Admin Login URL:** `http://localhost:3000/admin/login`
- **Default Email:** `nitinsaini@gmail.com`
- **Default Password:** `admin123`

### Admin ID & Password Kaise Change Karein?
1. Project ki root directory me `.env.local` file kholein.
2. `ADMIN_EMAIL` aur `ADMIN_PASSWORD` ko apne naye credentials se replace karein.
3. Development server ko restart karein (`npm run dev`). Ab aap naye ID/Password se login kar sakenge.

---

## 🖥️ Admin Panel Guide

### 1. Dashboard Overview (`/admin`)
- **Top 5 KPI Stat Cards:** Total Products, Total Orders, Total Revenue (₹), Pending Orders, Customer Reviews & Rating.
- **Quick Actions:** Add New Product, View Orders, Manage Reviews.
- **Products Catalog Table:** Live products ka preview, category filter, search, quick edit button, aur delete button.
- **Recent Customer Orders:** Website checkout se aaye naye orders ki list, status badge, total amount, aur direct delete button.
- **Customer Reviews & Testimonials:** Website par aane wale customer reviews ki list, rating stars, live status changer (Approved / Pending / Rejected), aur delete button.

---

### 2. Products Management (`/admin/products` & `/admin/products/[id]/edit`)
- **Naya Product Banayein (`/admin/products/new`):**
  - Product Name, Category, Price, Discount Price, Description.
  - **Photos Upload:** Phone ya Computer se direct upload karein (Cloudinary par store hota hai) ya direct Image URL daalein.
  - **Customization Options:** Customer ke liye text field (e.g. Naam / Date likhwane ke liye), dropdown select, ya colors add karein.
  - **Inventory & Badges:** In Stock toggle, Bestseller badge, Featured badge.
- **Product Edit Karein (`/admin/products/[id]/edit`):**
  - Purane product ki photos manage karein (nayi photo upload karein, purani photo ke upar bane red `X` par click karke delete karein).
  - Price, name, description, aur category update karein.
- **Product Delete Karein:**
  - Table me bane Red **[🗑️ Delete]** button par click karein — confirmation ke baad product MongoDB se permanently delete ho jayega.

---

### 3. Orders Management & Deletion (`/admin/orders`)
- **Order Details Dekhna (Eye Icon):**
  - Order row ke aage **[👁️ View]** button dabayein.
  - Popup modal me Customer ka Naam, Phone, Email, Complete Shipping Address, Order Notes, aur kharide gaye items ka breakdown dikhta hai.
  - **WhatsApp Button:** Ek click me customer ko pre-filled WhatsApp message bhejein.
- **Order Delete Karna (2 Options):**
  1. **Single Delete:** Har order ke aage bane red **[🗑️ Delete]** button par click karein. Modal ke andar bhi "Delete This Order" ka button hai.
  2. **Bulk Delete (Multiple Orders Ek Sath Delete Karein):**
     - Orders ke aage bane Checkbox par click karein (ya header me "Select All" karein).
     - Upar ek red bar appear hoga: **"Delete Selected (N)"** — is par click karte hi saare selected orders ek baar me delete ho jayenge.
- **Payment Status & Order Status Update:**
  - Dropdown se status turant change karein: `Pending` ➔ `Processing` ➔ `Shipped` ➔ `Completed` ➔ `Cancelled`.
  - Payment status: `Pending` ➔ `Paid` ➔ `Failed`.
- **Payment Link Generator:**
  - Agar customer ne checkout ke time payment nahi kiya, to **[+ Link]** par click karke Razorpay Payment Link generate karein aur WhatsApp par customer ko bhej dein.

---

### 4. Reviews Management (`/admin/reviews`)
- **Dashboard Sidebar Link:** Orders ke theek niche **Reviews** ka menu diya gaya hai.
- **Review Status Controls:**
  - **Approved:** Website par turant live dikhega.
  - **Pending:** Under review rahega (site par hide rahega).
  - **Rejected:** Storefront se hide kar diya jayega.
- **+ Add Review Manually:**
  - Admin khud kisi customer ka WhatsApp feedback ya testimonial add kar sakta hai (Customer Name, Product, 1–5 Star Rating, Feedback text, aur Photo attachment).
- **Delete Review:**
  - Single review delete karein ya checkboxes se multiple reviews select karke **Bulk Delete** karein.

---

## 🛍️ Customer Storefront Features

### Continuous Loop Photo Gallery (Main Product Card)
- Jab customer kisi bhi product page (`/products/[id]`) ko open karta hai:
  - Agar product me 2, 3, ya 4 photos hain, to main photo card me **bina kisi hover kiye photos automatically har 2.8 seconds me loop me chalti rehti hain**.
  - Aakhiri photo ke baad wapas 1st photo par aakar non-stop loop chalta rehta hai.
  - Niche wale thumbnails aur slide dots sath-sath live sync me move hote hain.
  - Manual controls ke liye **Previous (`<`)** aur **Next (`>`)** buttons aur counter badge (`1 / 4`) bhi diya gaya hai.
- Home page aur Catalog page ke cards me bhi multiple photos continuous loop me move hoti hain.

### Cart & Checkout (Razorpay)
- **Add to Cart Popup Notification:** Cart me item add karte hi modern top-right notification aati hai.
- **Personalization:** Customer apna naam ya date custom text box me daal sakta hai.
- **Online Payment:** Razorpay Gateway ke zariye credit card, debit card, UPI, aur NetBanking se payment hota hai.
- **Test Mode Payment Simulator:** Agar test mode on ho to instant simulated payment modal se testing ki ja sakti hai bina real paise kate.
- **Order Confirmation Popups:**
  - Payment successful hone par instant Order Confirmed popup aata hai aur order MongoDB me save hokar `/order-success` page par redirect hota hai.
  - Payment fail ya cancel hone par user-friendly error popup show hota hai.

---

## 📦 Photos & Data Kahan Store Hote Hain?

### 1. Photo Storage (Cloudinary):
- Upload ki gayi har photo **Cloudinary Cloud CDN** (`folder: khushi-resin/`) par upload hoti hai.
- Cloudinary photo ko compress aur web-friendly banata hai taaki site par fast loading ho.
- Cloudinary se ek permanent high-speed URL milta hai (e.g. `https://res.cloudinary.com/...`).

### 2. Database Storage (MongoDB Atlas):
- Cloudinary se mila photo ka URL aapke **MongoDB Atlas Database** (`Cluster0`) me document ke andar `images: [{ url: "..." }]` me save ho jata hai.
- Saare **Products**, **Orders**, **Reviews**, aur **Customers ki Details** MongoDB Atlas me securely store hoti hain.

### 3. Offline Backup:
- Agar kabhi internet ya Cloudinary response me issue aaye, to system image ko Base64 format me seedhe MongoDB database me store kar deta hai taaki photo upload kabhi fail na ho.

---

## 🚀 Running the Project (Commands)

### Development Server Run Karna:
```bash
npm run dev
```
Browser me kholein: [http://localhost:3000](http://localhost:3000)

### Production Build Check Karna:
```bash
npm run build
```
*(Sabhi 26 routes ko compile aur verify karta hai bina kisi error ke).*

### Production Server Start Karna:
```bash
npm start
```

---

## 📞 Support & Contacts
- **Brand:** New Khushi Resin Creations
- **Instagram:** [@newkhushiresincreations](https://www.instagram.com/newkhushiresincreations)
- **WhatsApp Support:** `+91 98765 43210`

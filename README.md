# Dubizzle - Platform

A full-stack classifieds web application built with **Next.js**, **PostgreSQL**, and **Prisma**.  
Developed as part of the Dubizzle Lebanon **Senior Full Stack Developer Assessment**.

---

## 🚀 Features

- User Authentication (NextAuth, secure password hashing)
- Profile Management
  - Edit name, address, and profile picture
  - Upload profile images to external blob storage (UploadThing)
- Post New Ad (Coming soon)
  - Title, Description, Price, Images
- Animated Lottie Background for modern UX
- Responsive UI with TailwindCSS
- Server-side Validation and Client-side Validation
- Fully deployed on Vercel

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), TailwindCSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Authentication:** NextAuth.js
- **Storage:** UploadThing (Blob Storage for images)
- **Database:** PostgreSQL (via Railway or Neon)
- **Deployment:** Vercel

---

## 📦 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/dubizzle.git
cd dubizzle
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**
   Create a .env file based on .env.example:

```env
# Database
DATABASE_URL=your_postgres_db_url

# NextAuth
NEXTAUTH_SECRET=your_random_secret

# UploadThing
UPLOADTHING_TOKEN=your_uploadthing_secret
```

4. **Run Prisma migrations**

```bash
npx prisma migrate dev --name init
```

5. **Start the development server**

```bash
npm run dev
```

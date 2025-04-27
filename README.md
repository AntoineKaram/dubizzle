# Dubizzle - Classifieds Platform

A full-stack classifieds web application built with **Next.js**, **PostgreSQL**, and **Prisma**.  
Developed as part of the Dubizzle Lebanon **Senior Full Stack Developer Assessment**.

---

## 🚀 Features

- User **Registration**, **Login**, and **Logout**
- **Ad Management**: Create and Edit Ads
- **Moderation Workflow**:
  - Ads must be approved by moderators before going live
  - Rejection reasons are communicated to the user
  - Previous approved versions remain live during edits
- **Responsive** homepage showcasing all approved ads
- Secure **authentication** and **role-based access** (User / Moderator)

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

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
  DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/dubizzle"
  NEXTAUTH_SECRET="your-random-nextauth-secret"
  ```

4. **Run Prisma migrations**
  ```bash
  npx prisma migrate dev --name init
  ```

5. **Start the development server**
  ```bash
  npm run dev
  ```

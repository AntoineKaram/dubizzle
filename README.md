# 🏠 Dubizzle Demo (Next.js + Prisma + NextAuth)

This is a full-stack classifieds platform inspired by Dubizzle, built with modern tech:

- **Next.js App Router (v15)** + TypeScript
- **Tailwind CSS** for styling
- **Prisma + PostgreSQL** as the data layer
- **NextAuth.js** for authentication and roles
- **UploadThing** for image uploads
- **Google Maps + Places API** for location

---

## 🚀 Features

### ✅ Authentication & Authorization
- User registration & login (NextAuth)
- Role-based access: `USER` vs `MODERATOR`
- Protected routes and actions

### ✅ Ad Management
- Create ads with title, description, images, price, category, subcategory, location
- Google Maps + address autocomplete
- Upload multiple images (UploadThing)
- Preview uploaded images in-place
- Client-side form validation (refs + state)

### ✅ Edit Ad (Live vs Moderated)
- Users can update ads
- If ad is `APPROVED`, edit goes to moderation queue
- Original stays live while edit awaits approval

### ✅ Moderation Flow
- `/moderation` dashboard for moderators
- Tabs: Pending Ads & Pending Edit Requests
- Moderators can:
  - Approve/reject new ads
  - Review edits and apply changes to live ads

### ✅ Public Browsing
- Homepage lists all `APPROVED` ads
- Search by keyword (debounced)
- Filter by category, subcategory, price range
- Load More pagination

---

## 🧱 Tech Stack

| Area        | Tech                             |
|-------------|----------------------------------|
| Frontend    | Next.js App Router, Tailwind CSS |
| Backend     | Next.js API routes, Prisma       |
| Auth        | NextAuth.js + JWT                |
| Uploads     | UploadThing                      |
| Location    | Google Maps + Places Autocomplete|
| DB          | PostgreSQL                       |
| Icons       |  React Icons                     |
| Deploy      | Vercel                           |

---

## 📁 Routes Folder Structure

```
└── 📁api
    └── 📁ads
        └── 📁[id]
            └── route.ts                    -> GET ad by id
        └── 📁create
            └── route.ts                    -> POST ad
        └── 📁edit-request
            └── 📁[id]
                └── route.ts                -> POST + PATCH edit request
            └── route.ts                    -> GET edit requests
        └── 📁pending
            └── route.ts                    -> Get pending ads
        └── 📁review
            └── 📁[id]
                └── route.ts                -> PATCH ad (update status)
        └── route.ts                        -> GET all ads
        └── 📁update
            └── 📁[id]
                └── route.ts                -> PUT ad 
    └── 📁auth
        └── 📁[...nextauth]
            └── route.ts                    -> handle login
        └── 📁register
            └── route.ts                    -> handle sign up
    └── 📁settings
        └── route.ts                        -> Fetch site settings
    └── 📁uploadthing
        └── route.ts                        -> upload images
    └── 📁user
        └── 📁update
            └── route.ts                    -> PUT user details
```

---

## 🛠️ Setup

1. Clone and install:
```bash
git clone https://github.com/AntoineKaram/dubizzle
cd dubizzle
npm install
```

2. Configure `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dubizzle
NEXTAUTH_SECRET=...
UPLOADTHING_TOKEN=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXTAUTH_URL=http://localhost:3000
```

3. Setup DB:
```bash
npm run migrate
npm run generate
npx tsx prisma/seed.ts
```

4. Run the app:
```bash
npm run dev
```

---

## 🧑‍💻 Roles

- `USER` → default
- `MODERATOR` → assign manually via Prisma Studio: 

```bash
npx prisma studio
```

---


## ✨ Credits

Built by Antoine Karam for a Dubizzle-style technical assessment.
Inspired by Dubizzle, OLX..


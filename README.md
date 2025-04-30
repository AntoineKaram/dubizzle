#  Dubizzle Demo (Next.js + Prisma + NextAuth)

This is a full-stack classified ads platform inspired by Dubizzle, built with:

-  Next.js App Router (v15)
-  TypeScript & TailwindCSS
-  NextAuth.js for authentication
-  Prisma + PostgreSQL
-  UploadThing for image upload
-  Server-side filtering, pagination, role-based access control

---

##  Tech Stack

| Layer         | Tool/Library            |
|---------------|--------------------------|
| Frontend      | Next.js App Router, TailwindCSS |
| Backend       | Next.js API Routes, Prisma |
| Auth          | NextAuth.js + JWT        |
| DB            | PostgreSQL               |
| Uploads       | UploadThing              |
| Deployment    | Vercel                   |

---

##  Features

###  Authentication

- Register, login, and protected routes
- Role-based access: `USER` / `MODERATOR`
- NextAuth + JWT session

###  Ads Management

- Post ads with title, description, location, images, category, subcategory
- Upload up to 5 images per ad (UploadThing)
- Google Maps location + address autocomplete
- Responsive Ad forms with client-side validation

###  View / Edit Ads

- Public ad detail page with image carousel
- If the viewer is the creator: editable form
- If not: read-only detail view
- Moderator review panel if role is `MODERATOR`

###  Moderator Tools

- `/moderation` dashboard to review pending ads
- Approve / Reject via in-place panel
- Sorting, pagination, exclusion of own ads

###  Homepage + Browsing

- `/` lists all approved ads
- Server-side filtering: search, category, subcategory, price range
- Pagination with "Load More"
- Debounced search input
- Responsive grid of ads

---

##  Folder Structure
  ```
  app/ 
  ├─ ads/ 
  │ └─ [id]/page.tsx 
  ├─ moderation/ 
  ├─ profile/ 
  ├─ api/ 
  │ ├─ ads/ 
  │ │ ├─ create/ 
  │ │ ├─ update/[id]/ 
  │ │ ├─ review/[id]/ 
  │ │ └─ route.ts 
  │ ├─ auth/... 
  ├─ components/ 
  ├─ lib/ 
  │ ├─ prisma.ts 
  │ ├─ auth.ts 
  │ └─ models.ts 
  ├─ store/
  ```
---

##  Local Setup

1. **Clone the repo**  
2. Install deps:

  ```bash
  npm install
  ```
3. Setup your `.env` file:
  ```env
  DATABASE_URL=postgresql://user:password@localhost:5432/dubizzle
  NEXTAUTH_SECRET=...
  UPLOADTHING_TOKEN=...
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
  NEXTAUTH_URL=http://localhost:3000
  ```
4. Migrate the DB  (seed optional) 
  ```bash
  npx prisma migrate dev --name init
  npx tsx prisma/seed.ts
  ```
5. Start dev server
  ```bash
  npm run dev
  ```
---

##  Roles
You can assign `role: "MODERATOR"` in the database manually or via seed script.

## Protected Routes
| Path              | Role         | Access   |
|-------------------|--------------|----------|
| `/ads/new`        | Authenticated user | ✅ |
| `/profile`        | Authenticated user | ✅ |
| `/ads/:id`        | All           | View/Edit/Review depends on user |
| `/moderation`     | Moderator only | ✅ |
| `/api/...`        | Validated by token + role | ✅ |

## Credits
Built by Antoine Karam, as a technical assignment demo.
Inspired by platforms like Dubizzle, OLX, Airbnb.

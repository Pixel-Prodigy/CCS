# TryOn - Virtual Fitting Room

A production-grade MVP for a virtual try-on application with a customer-facing kiosk and admin panel.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email + password)
- **Storage:** Supabase Storage

## Features

### Customer Kiosk (`/kiosk`)

- Full-screen product browsing
- Filter by type, color, and category
- Touch-optimized UI
- Product detail modal with stock info

### Admin Panel (`/admin`)

- Email/password authentication
- Product CRUD operations
- Image upload to Supabase Storage
- Auto-generated product codes

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd try-on
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migrations in `supabase/migrations/` in your Supabase SQL Editor
3. Create a storage bucket named `product-images` (set to public)
4. Copy your project URL and anon key from Settings > API

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create Admin User

In Supabase Dashboard > Authentication > Users, create a user with email and password.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - redirects to kiosk.
Admin login at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Project Structure

```
app/
├── kiosk/           # Customer-facing product browser
├── admin/
│   ├── login/       # Admin authentication
│   └── (dashboard)/ # Protected admin routes
│       └── products/# Product management
components/
├── ui/              # shadcn/ui components
├── kiosk/           # Kiosk-specific components
└── admin/           # Admin-specific components
lib/
├── supabase/        # Supabase client configuration
├── actions/         # Server actions
├── types.ts         # TypeScript types
└── utils.ts         # Utility functions
```

## Database Schema

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  location VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT

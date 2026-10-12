# HackSeekho — Phase 1: Production-Ready Authentication

> **HackSeekho** is a student learning platform empowering students across India to prepare for hackathons, attend live web seminars, access curated learning notes, and build project-ready engineering skills.

This repository contains the complete implementation of **Phase 1: Production-Ready Authentication**, crafted with the clean, professional visual aesthetic of **Hack2Skill** and enterprise-grade security powered by **Supabase Auth**, **PostgreSQL**, and **Next.js App Router**.

---

## 🚀 Key Features Implemented

1. **Student Sign-Up (`/signup`)**
   - Full name, student email, strong password, and password confirmation.
   - Real-time password strength evaluator and checklist (length, uppercase, lowercase, digits, symbols).
   - Mandatory Terms of Service and Privacy Policy checkbox.
   - Official "Continue with Google" OAuth button.
   - Automatic routing to email verification or dashboard based on Supabase email confirmation configuration.

2. **Student Login (`/login`)**
   - Secure email and password sign-in.
   - Password show/hide toggle.
   - Persistent session with "Remember this device".
   - Seamless "Continue with Google" OAuth.
   - Open-redirect protection: strictly validates `next` redirection parameters.
   - Graceful inline error handling and recovery paths.

3. **Google OAuth 2.0 Integration**
   - Direct integration via official Supabase OAuth SSR (`supabase.auth.signInWithOAuth`).
   - Server-side code-exchange route handler at `/auth/callback`.
   - Automatic sync with `public.profiles` in PostgreSQL.

4. **Email Verification (`/verify-email`)**
   - Dedicated verification-pending screen.
   - Clear guidance for inbox and spam checks.
   - Rate-limited resend verification button with 60-second cooldown timer.

5. **Password Recovery & Reset (`/forgot-password` & `/reset-password`)**
   - Privacy-conscious forgot-password flow (never reveals account existence).
   - Recovery session verification preventing unauthorized access to reset screen.
   - Password strength validation and clean session invalidation upon update.

6. **Persistent PostgreSQL User Profiles (`public.profiles`)**
   - Dedicated table with `id`, `full_name`, `avatar_url`, `created_at`, `updated_at`.
   - Automatic trigger `on_auth_user_created` syncing new email & OAuth accounts.
   - Row-Level Security (RLS) policies guaranteeing users can only read and modify their own records.

7. **Session Management & Proxy Guard**
   - Cookie-based session persistence via `@supabase/ssr`.
   - Next.js 16 request interceptor (`src/proxy.ts`) refreshing auth tokens and guarding protected routes (`/profile`, `/dashboard`).
   - Server-side identity validation using `supabase.auth.getUser()`.

---

## 🎨 Design System & Color Palette (Hack2Skill Inspired)

Built with exact foundational tokens defined in Tailwind and CSS variables:

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Primary Navy** | `#080F2B` | Brand contrast, headings, showcase panels |
| **Deep Navy** | `#0B1433` | Gradients, card backgrounds |
| **Brand Blue** | `#3565B8` | Primary CTA buttons, focus states, links |
| **Highlight Blue** | `#29B7E8` | Accents, badges, active indicators |
| **Primary Text** | `#222C39` | High-contrast body typography |
| **Secondary Text** | `#8B9AAF` | Muted labels, subtitles, metadata |
| **Soft Blue Background** | `#F3F7FF` | Showcase cards, subtle inputs, page background |
| **Border Subtle** | `#E4E9F2` | Card borders, input outlines |
| **Success** | `#16845B` | Validated checks, security indicators |
| **Error** | `#D64545` | Validation alerts, error states |

---

## 📂 Project Architecture

```
HackSeekho/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       ├── route.ts              # OAuth & email verification callback
│   │   │       └── route.test.ts         # Automated tests for code exchange & open redirects
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Alias redirecting to /profile
│   │   ├── forgot-password/
│   │   │   └── page.tsx                  # Password reset dispatch screen
│   │   ├── login/
│   │   │   └── page.tsx                  # Student sign-in screen
│   │   ├── profile/
│   │   │   └── page.tsx                  # Server-rendered protected profile
│   │   ├── reset-password/
│   │   │   └── page.tsx                  # Password reset submission screen
│   │   ├── signup/
│   │   │   └── page.tsx                  # Student registration screen
│   │   ├── verify-email/
│   │   │   └── page.tsx                  # Verification pending screen with resend timer
│   │   ├── globals.css                   # Tailwind v4 theme tokens & Hack2Skill palette
│   │   ├── layout.tsx                    # Root layout with Inter font & Sonner Toaster
│   │   └── page.tsx                      # HackSeekho overview / landing hero
│   ├── components/
│   │   ├── auth/
│   │   │   └── GoogleAuthButton.tsx      # Google OAuth SSR button
│   │   ├── profile/
│   │   │   └── ProfileCard.tsx           # Profile manager with PostgreSQL sync & logout
│   │   └── ui/
│   │       ├── AuthLayout.tsx            # Hack2Skill-style two-column responsive auth layout
│   │       ├── BrandWordmark.tsx         # Original HackSeekho logo and wordmark
│   │       ├── Button.tsx                # Accessible multi-variant button with loading state
│   │       ├── ConfigNotice.tsx          # Setup helper banner for Supabase credentials
│   │       ├── GoogleIcon.tsx            # Official Google brand mark
│   │       ├── Input.tsx                 # Form input with validation and password toggle
│   │       ├── Navbar.tsx                # Clean navigation bar with auth session awareness
│   │       └── PasswordStrengthMeter.tsx # Real-time strength evaluator & checklist
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── safe-redirect.ts          # Open redirect vulnerability defense
│   │   │   └── safe-redirect.test.ts     # Unit tests for redirect safety
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Browser client (@supabase/ssr)
│   │   │   ├── server.ts                 # Server client (@supabase/ssr with cookies)
│   │   │   └── proxy.ts                  # Session updater & route guard logic
│   │   ├── types/
│   │   │   └── database.ts               # Supabase PostgreSQL types (profiles)
│   │   ├── validation/
│   │   │   ├── auth.ts                   # Zod schemas for signup, login, password reset
│   │   │   └── auth.test.ts              # Unit tests for Zod schemas & strength meter
│   │   └── env.ts                        # Zod environment variable validator
│   └── proxy.ts                          # Next.js 16 Proxy handler (session refresh & guards)
├── supabase/
│   ├── migrations/
│   │   └── 20250101000000_create_profiles.sql # SQL migration with RLS & triggers
│   └── schema.sql                        # Copy-paste script for Supabase SQL Editor
├── .env.example                          # Environment variable template
├── package.json
└── vitest.config.ts                      # Test configuration
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url> HackSeekho
cd HackSeekho
npm install
```

### 2. Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your real Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Where to find Supabase credentials:**
> Go to [Supabase Dashboard](https://supabase.com/dashboard) → Select your Project → **Project Settings** (gear icon) → **API**.
> Copy **Project URL** and the **anon public** API key.

---

### 3. Database Migration in Supabase

Open your Supabase Project dashboard, go to the **SQL Editor**, and run the contents of [`supabase/schema.sql`](supabase/schema.sql):

```sql
-- 1. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);

-- 3. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Row Level Security Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 6. Trigger to automatically provision profiles on user signup (Email & Google OAuth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      ''
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = CASE
      WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = ''
      THEN EXCLUDED.full_name
      ELSE public.profiles.full_name
    END,
    avatar_url = CASE
      WHEN public.profiles.avatar_url IS NULL OR public.profiles.avatar_url = ''
      THEN EXCLUDED.avatar_url
      ELSE public.profiles.avatar_url
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### 4. Google OAuth 2.0 Provider Setup

1. **Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
   - Create an **OAuth 2.0 Client ID** (Application type: **Web application**).
   - Under **Authorized redirect URIs**, add your Supabase project callback URL:
     ```
     https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback
     ```
   - Copy the generated **Client ID** and **Client Secret**.

2. **Supabase Dashboard:**
   - Go to **Authentication** → **Providers** → **Google**.
   - Toggle **Enable Google provider**.
   - Paste the **Client ID** and **Client Secret**.
   - Under **Authentication** → **URL Configuration**, set:
     - **Site URL**: `http://localhost:3000` (or your production domain).
     - **Redirect URLs**: Add `http://localhost:3000/auth/callback` and `http://localhost:3000/**`.
   - Click **Save**.

---

### 5. Running the Application

- **Start Local Development Server:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Run Automated Test Suite:**
  ```bash
  npm test
  ```

- **Run Code Linter:**
  ```bash
  npm run lint
  ```

- **Validate Production Build:**
  ```bash
  npm run build
  ```

---

## 🔒 Security Best Practices Implemented

- **Server-Side Session Verification**: Server components and route handlers validate identity via `supabase.auth.getUser()`, never relying on spoofable client-side tokens.
- **Open-Redirect Hardening**: All redirect parameters are sanitized via `getSafeRedirectUrl()`, rejecting protocol-relative URLs (`//attacker.com`), backslash evasions, and external origins.
- **Credential Segregation**: No service-role keys or client secrets are exposed in browser bundles.
- **PostgreSQL Row-Level Security**: Only authenticated users whose `auth.uid() = id` can read or modify profile data.
- **Strict Zod Validations**: Passwords require uppercase, lowercase, numbers, and symbols with real-time UI feedback.

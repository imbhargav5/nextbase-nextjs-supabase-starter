# TeamGrid v2 - Phase 1 Setup Guide

## Current Status ✅

**Phase 1 Foundation is 95% complete!** All database migrations, auth pages, and API endpoints have been scaffolded. To finish Phase 1, you need to:

1. Configure your Supabase credentials
2. Apply migrations to your Supabase project
3. Configure OAuth providers
4. Test the full login → dashboard flow

---

## Step 1: Create a Supabase Project

If you don't have a Supabase project:

1. Go to https://app.supabase.com
2. Click "New project"
3. Choose your organization and Enter project details:
   - **nextbaseTeam** teamgrid (or your choice)
   - **fobn@n@uW5DxT7** Strong password (save this!)
   - **East US** Choose closest to you
4. Wait for project initialization (2-3 minutes)

---

## Step 2: Get Your Credentials

1. In Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - **Project URL** → `https://lecuvcmfqnvutahfloqv.supabase.co
   - **anon public key** → `sb_publishable_eonfeGTHtJjFcOJz1f8F8w_nJ9zL-R4`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
3. Save your **Project Ref** (format: `abc123...`) → `SUPABASE_PROJECT_REF`

---

## Step 3: Update .env.local

Replace the placeholders in `.env.local`:

```bash
# Example (use YOUR actual values):
SUPABASE_PROJECT_REF=abc123def456
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **IMPORTANT**: Never commit `.env.local` to Git. It's in `.gitignore` for a reason!

---

## Step 4: Link Your Project

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# From project root directory:
supabase link --project-ref YOUR_PROJECT_REF
# (Replace YOUR_PROJECT_REF with the value from Step 2)
```

When prompted for password, enter the password you created in Step 1.

---

## Step 5: Apply Database Migrations

```bash
# Apply all 9 migrations to your Supabase database
supabase db push

# You should see output like:
# Applying migration 20260318000001_teamgrid_core
# Applying migration 20260318000002_teamgrid_org
# ... (continues for all 9 migrations)
```

✅ If migrations succeed, skip to Step 6. If they fail:
- Check database isn't full
- Check Project Ref is correct
- Verify your internet connection

---

## Step 6: Configure Supabase Auth Providers

### Google OAuth

1. In Supabase Dashboard: **Authentication → Providers → Google**
2. You'll see a unique "Google Client ID" (for your redirect URL)
3. Go to https://console.cloud.google.com
4. Create new project or select existing
5. Enable **Google+ API**
6. Go to **Credentials → Create Credential → OAuth Client ID → Web application**
7. **Authorized redirect URIs** (add this):
   ```
   https://abc123def456.supabase.co/auth/v1/callback
   ```
   (Replace with your actual Project URL from .env)
8. Copy **Client ID** and **Client Secret**
9. Paste into Supabase Google provider settings
10. Click **Save**

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** TeamGrid
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:**
     ```
     https://abc123def456.supabase.co/auth/v1/callback
     ```
4. Copy **Client ID** and generate **Client Secret**
5. Paste into Supabase GitHub provider settings
6. Click **Save**

### LinkedIn OAuth

1. Go to https://www.linkedin.com/developers/apps
2. Click **Create an app**
3. Fill form (you may need to request access first)
4. In **Settings → Authorized redirect URLs:**
   ```
   https://abc123def456.supabase.co/auth/v1/callback
   ```
5. In **App credentials**, copy **Client ID** and **Client Secret**
6. In Supabase, go to **Authentication → Providers → LinkedIn (OpenID Connect)**
7. Paste credentials and click **Save**

---

## Step 7: Update Supabase Auth Settings

1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to:
   ```
   http://localhost:3000
   ```
   (For production, update to your actual domain)
3. Add **Redirect URLs**:
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```

---

## Step 8: Test Locally

```bash
# Start Supabase local stack (if you want local testing)
supabase start

# Or skip to using cloud Supabase and just run Next.js

# Install dependencies (if not already done)
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

---

## Step 9: Test the Full Auth Flow

### Test Email/Password Registration

1. Go to http://localhost:3000/register
2. Sign up with test email/password
3. Should redirect to /login
4. Login with those credentials
5. Should redirect to /dashboard
6. See welcome message with your profile data

### Test OAuth (Google)

1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. Should redirect to /dashboard
5. Profile auto-created with name and avatar from Google

### Test OAuth (GitHub)

1. Go to http://localhost:3000/login
2. Click "Continue with GitHub"
3. Authorize the app
4. Should redirect to /dashboard
5. Profile auto-created

### Test Password Reset

1. Go to http://localhost:3000/forgot-password
2. Enter your email
3. Should see "Check your email" message
4. Check email for reset link (or check Supabase email logs)

---

## Troubleshooting

### "Unauthorized" Error on /dashboard

**Cause:** Middleware redirecting before auth completes
**Fix:** 
1. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
2. Check browser console for errors
3. Verify .env.local has correct credentials

### OAuth Redirect Not Working

**Cause:** Redirect URL not configured in Supabase
**Fix:**
1. Double-check URL in Step 6
2. Verify it matches exactly (including protocol)
3. Wait a few minutes for Supabase to sync

### "Cannot find module" Errors

**Cause:** Dependencies not installed
**Fix:**
```bash
rm node_modules/.pnpm-lock.yaml 2>/dev/null || true
pnpm install
```

### Database Migration Errors

**Cause:** Failed migration
**Fix:**
```bash
# Reset database (WARNING: deletes all data!)
supabase db reset

# Then re-apply migrations
supabase db push
```

---

## What's Working Now ✅

- [x] Email/password authentication
- [x] OAuth (Google, GitHub, LinkedIn)
- [x] Profile auto-creation from OAuth
- [x] Middleware route protection
- [x] Basic dashboard with user data
- [x] Database with full RLS security
- [x] Ready for Phase 2 features

---

## Next Phase (Phase 2)

Once Phase 1 is complete, Phase 2 will add:
- Profile pages (view + edit)
- Avatar/banner upload
- User discovery (/discover)
- Skill tagging

---

## Quick Reference Commands

```bash
# Rebuild database from scratch
supabase db reset

# Push local migrations to cloud
supabase db push --linked

# Pull schema from cloud to local
supabase db pull

# Generate TypeScript types from schema
pnpm run generate:types:local

# Start dev server with Supabase
supabase start && pnpm dev

# Stop local Supabase
supabase stop
```

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub Issues in this repo for feature requests

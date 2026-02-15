# PlateRate — Deployment Guide

Follow these steps in order. The whole process takes about 20 minutes.

---

## Step 1: Create a GitHub account (skip if you have one)

1. Go to https://github.com and click "Sign Up"
2. Follow the steps to create a free account

## Step 2: Create a Supabase project (your free database)

1. Go to https://supabase.com and click "Start your project"
2. Sign in with your GitHub account
3. Click "New Project"
4. Name it `platerate` and set a database password (save this somewhere!)
5. Choose the region closest to you
6. Click "Create new project" and wait ~2 minutes

### Set up the database tables:

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase-schema.sql` from this project in any text editor
4. Copy the ENTIRE contents and paste it into the SQL Editor
5. Click **Run** (the green play button)
6. You should see "Success. No rows returned" — that means it worked!

### Turn off email confirmation (important for testing):

1. In Supabase, go to **Authentication** → **Providers** → **Email**
2. Toggle OFF "Confirm email"
3. Click **Save**

### Get your API keys:

1. In Supabase, go to **Settings** (gear icon) → **API**
2. Copy the **Project URL** (looks like `https://abc123.supabase.co`)
3. Copy the **anon/public** key (the long string under "Project API keys")
4. Save both of these — you'll need them in Step 4

## Step 3: Upload the code to GitHub

1. Go to https://github.com/new
2. Name the repository `platerate`
3. Keep it **Public** (required for free Vercel hosting)
4. Click **Create repository**
5. You'll see instructions — you can either:
   - **Easy way:** Drag and drop all the project files into the GitHub page
   - **Terminal way:** Follow the git commands shown on the page

## Step 4: Deploy to Vercel (your free hosting)

1. Go to https://vercel.com and click "Sign Up" → sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Find your `platerate` repo and click **Import**
4. Before deploying, click **"Environment Variables"** and add these two:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL from Step 2 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key from Step 2 |

5. Click **Deploy**
6. Wait 1-2 minutes — Vercel will build and deploy your app
7. You'll get a URL like `platerate-abc123.vercel.app` — that's your live site!

## Step 5: Set up your custom domain (optional but recommended)

1. Buy a domain (namecheap.com or porkbun.com are cheap — ~$10/year)
2. Something like `platerate.co` or `getplaterate.com`
3. In Vercel, go to your project → **Settings** → **Domains**
4. Add your domain and follow the DNS instructions

## Step 6: Test it!

1. Visit your site and click "Get Started Free"
2. Create an account with your email
3. Set up your restaurant name and Google Reviews URL
4. You'll see your dashboard with your unique review link
5. Open that review link in your phone browser — that's what customers see!
6. Try rating — 4-5 stars should show the Google redirect, 1-3 should show the feedback form

---

## How to find your Google Reviews URL

1. Google your restaurant name
2. Click on your Google Business listing
3. Click "Write a review"
4. Copy the URL from your browser's address bar
5. Paste it into PlateRate settings

## How to use PlateRate day-to-day

1. After a customer visits, text them your review link
2. That's it! Check your dashboard to see feedback coming in

---

## Troubleshooting

**"Restaurant not found" on the review page:**
Make sure you completed the signup flow and created your restaurant. Check Supabase → Table Editor → restaurants to see if your data is there.

**Can't sign up / login not working:**
Make sure you turned off email confirmation in Supabase (Step 2).

**Page looks broken:**
Make sure both environment variables are set correctly in Vercel. Go to Vercel → Settings → Environment Variables and double-check.

**Need help?**
Ask Claude to help you debug! Paste the error message and I can walk you through fixing it.

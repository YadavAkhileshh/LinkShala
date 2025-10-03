# Supabase Authentication Setup Guide

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: LinkShala
   - Database Password: (create a strong password)
   - Region: Choose closest to your users
5. Wait for project to be created (~2 minutes)

## 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## 3. Configure Environment Variables

1. Create a `.env` file in the `FinalLSSS` directory
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://localhost:5002/api
```

## 4. Configure Email Authentication (Optional)

By default, Supabase requires email confirmation. To disable for development:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off "Confirm email"
3. Save changes

For production, keep email confirmation enabled and configure your email templates.

## 5. Test Authentication

1. Start your development server: `npm run dev`
2. Visit `http://localhost:5173`
3. Click "Get Started Free" to sign up
4. Create an account with email and password
5. You should be redirected to `/home` after successful signup

## 6. Security Notes

- Never commit your `.env` file to version control
- Use different Supabase projects for development and production
- Enable Row Level Security (RLS) policies if storing user data in Supabase
- For production, configure proper email templates and SMTP settings

## 7. Optional: Add Social Login

To add Google/GitHub login:

1. Go to **Authentication** → **Providers**
2. Enable desired provider (Google, GitHub, etc.)
3. Follow provider-specific setup instructions
4. Update your login component to include social login buttons

## Troubleshooting

**Issue**: "Invalid API key"
- Solution: Double-check your `.env` file has correct credentials

**Issue**: "Email not confirmed"
- Solution: Check your email or disable email confirmation in Supabase settings

**Issue**: "CORS error"
- Solution: Add your domain to allowed origins in Supabase settings

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

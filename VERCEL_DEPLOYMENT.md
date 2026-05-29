# Vercel Deployment Guide

## ✅ Deployment Status

Your project is now **deployment-ready** for Vercel. All build errors have been fixed.

## Issues Fixed

### 1. **Buffer Type Error** (Critical)
- **File:** `app/api/resume-download/route.ts`
- **Issue:** `Buffer<ArrayBufferLike>` is not assignable to `BodyInit`
- **Fix:** Converted Buffer to `Uint8Array` for NextResponse compatibility
- **Lines:** 14, 33 (both resume serve endpoints)

### 2. **CSS Import Warning**
- **File:** `app/globals.css`
- **Issue:** @import rules must precede all other rules
- **Fix:** Reordered imports - Tailwind CSS import comes before font imports
- **Note:** Warning is benign and won't affect deployment

### 3. **Environment Configuration**
- **File:** Created `vercel.json` with proper Next.js configuration
- **File:** Created `.env.example` as reference for required variables

## Environment Variables Required on Vercel

Add these to your Vercel project settings (Settings → Environment Variables):

1. **EMAIL_USER** - Gmail address sending emails (format: `user@gmail.com`)
2. **EMAIL_PASSWORD_ENCRYPTED** - Encrypted app password (format: `iv:authTag:ciphertext`)
3. **ENCRYPTION_KEY** - 256-bit hex encryption key (64 characters)
4. **RECIPIENT_EMAIL** - Where contact form messages are sent

**Note:** These values are already in `.env.local` for local development. For Vercel, add them as secrets in the dashboard.

## Build Configuration

### Build Command
```
npm run build
```

### Output Directory
```
.next
```

### Node Version
- Recommended: 20.x or higher
- Current: Configured in `vercel.json`

## Deployment Checklist

- ✅ All TypeScript errors resolved
- ✅ Build command configured correctly
- ✅ Output directory set to `.next`
- ✅ Environment variables schema defined
- ✅ API routes functional (contact, resume-download, resume-otp, resume-upload)
- ✅ CSS builds without critical errors
- ✅ No missing dependencies

## Next Steps

1. **Set Environment Variables on Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add: `EMAIL_USER`, `EMAIL_PASSWORD_ENCRYPTED`, `ENCRYPTION_KEY`, `RECIPIENT_EMAIL`
   - Save and redeploy

2. **Deploy:**
   - Push changes to GitHub: `git push origin main`
   - Vercel will automatically trigger a new deployment
   - Monitor build in Vercel dashboard

3. **Test Production:**
   - Contact form submission
   - Resume download endpoint
   - Resume upload with OTP

## API Routes Status

| Route | Type | Status |
|-------|------|--------|
| `/api/contact` | POST | ✅ Dynamic |
| `/api/resume-download` | GET | ✅ Dynamic |
| `/api/resume-otp` | POST | ✅ Dynamic |
| `/api/resume-upload` | POST, GET | ✅ Dynamic |

## Performance Metrics

- **Total Size:** ~64 KB (route)
- **First Load JS:** ~151 KB (with dependencies)
- **Build Output:** Successfully generated static pages (9/9)

## Important Notes

### /tmp Directory
- Uploaded resumes are stored in `/tmp/portfolio_resume/` (Vercel-writable directory)
- This survives across warm server requests but resets on cold starts
- Consider implementing persistent storage (e.g., AWS S3) for production if needed

### Email Configuration
- Uses Gmail SMTP with app-specific password
- Passwords are encrypted at rest (never stored in plain text)
- Encryption/decryption happens at runtime

### Vercel Limits
- Function timeout: 10 seconds (free tier), 60 seconds (Pro)
- Max request body: 5 MB (configured in upload validation)
- Environment variables: 50 per environment

## Troubleshooting

### "Email service not configured" error
- Verify all 4 environment variables are set on Vercel
- Check that values match the format from `.env.example`

### "Resume upload failed" error
- Verify `/tmp` directory permissions (should be writable on Vercel)
- Check file size < 5 MB
- Ensure file is valid PDF (magic bytes: `%PDF`)

### Build fails on Vercel but works locally
- Clear `.next` folder: `rm -rf .next`
- Run: `npm install && npm run build`
- Push again to trigger fresh Vercel build

## Additional Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

# Email Configuration Setup Guide

## Overview
Your contact form is now integrated with email functionality using **Nodemailer** and **Gmail SMTP**. When users submit the contact form, their messages will be sent directly to your email address (muneebniaz250@gmail.com).

## Setup Instructions

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click on **Security** in the left sidebar
3. Enable **2-Step Verification** if not already enabled
4. Once enabled, proceed to Step 2

### Step 2: Generate an App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** from the "Select app" dropdown
3. Select **Windows Computer** (or your operating system) from the "Select device" dropdown
4. Click **Generate**
5. Google will display a 16-character password (format: `xxxx xxxx xxxx xxxx`)

### Step 3: Configure Environment Variables
1. Open the `.env.local` file in your project root
2. Replace `your-email@gmail.com` with your Gmail address
3. Replace `your-app-password-here` with the 16-character password from Step 2 (remove spaces)
4. The `RECIPIENT_EMAIL` is already set to `muneebniaz250@gmail.com`

**Example:**
```env
EMAIL_USER=mynameismuneeb@gmail.com
EMAIL_PASSWORD=abcd1234efgh5678
RECIPIENT_EMAIL=muneebniaz250@gmail.com
```

### Step 4: Test the Form
1. Restart your development server: `npm run dev`
2. Navigate to your portfolio website
3. Scroll to the **Get In Touch** section
4. Fill out the contact form and click **Send Message**
5. If successful, you'll see: "Email sent successfully!"
6. Check your email inbox at `muneebniaz250@gmail.com` for the submitted message

## Features Implemented

✅ **Form Validation:** All fields are required before submission  
✅ **Loading State:** Button shows "Sending..." while processing  
✅ **Success Message:** Displays "Email sent successfully!" for 5 seconds  
✅ **Error Handling:** Shows error message if email fails to send  
✅ **Fields Not Reset:** Form data remains after submission (as per requirement)  
✅ **Security:** HTML special characters are escaped to prevent injection  
✅ **Professional Email Template:** Formatted HTML email with all submission details  
✅ **Reply-To Header:** Responses go directly to the submitter's email

## Email Details

### What Gets Sent
- **From:** Your configured Gmail address (EMAIL_USER)
- **To:** muneebniaz250@gmail.com
- **Reply-To:** The submitter's email address
- **Subject:** "Portfolio Contact: [Name] ([Guest Type])"

### Email Content
The email includes:
- Submitter's name
- Submitter's email address (clickable mailto link)
- Guest type (Client, Recruiter, Collaboration, Other)
- Full message content with proper formatting

## Troubleshooting

### "Email service is not configured"
- Check that `.env.local` file exists in your project root
- Verify all three environment variables are set
- Restart your development server

### "Failed to send message"
- Verify your Gmail credentials are correct
- Ensure 2-Factor Authentication is enabled
- Check that the App Password is entered correctly (no spaces)
- Try regenerating a new App Password from Google

### Gmail Rejected the Connection
- Your app password may have been entered with spaces
- The `.env.local` file may not be in the correct location
- Try removing and regenerating the app password

## Security Notes

1. **Never commit `.env.local`:** This file is in `.gitignore` to prevent accidental exposure of credentials
2. **App Password vs. Google Password:** Always use the 16-character App Password, NOT your main Gmail password
3. **HTTPS Only in Production:** Ensure email is only sent over HTTPS in production
4. **Input Escaping:** All user inputs are HTML-escaped to prevent injection attacks

## Advanced Configuration

If you want to use a different email service (SendGrid, Mailgun, etc.) instead of Gmail:

1. Modify `/app/api/contact/route.ts`
2. Replace the nodemailer Gmail configuration with your desired service
3. Update environment variables accordingly
4. Test the new configuration

Example for SendGrid (requires `npm install @sendgrid/mail`):
```typescript
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

await sgMail.send({
  to: recipientEmail,
  from: emailUser,
  replyTo: email,
  subject: `Portfolio Contact: ${name} (${guestType})`,
  html: htmlContent,
});
```

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the server logs in your terminal
3. Verify your `.env.local` configuration
4. Ensure your Gmail account allows "Less secure app access" if needed

# Gmail API Setup & Birthday Invitations Guide

This documentation covers configuring the **Gmail API** in Google Cloud Console to allow customers to send personalized birthday invitations directly from their own connected Gmail accounts.

---

## 1. Enable Gmail API in Google Cloud Console
1. Navigate to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Select your existing project (`Birthday Platform Media Service` / Client ID `461011228421-...`).
3. In the sidebar, go to **APIs & Services > Library**.
4. Search for **Gmail API**.
5. Click **Enable**.

---

## 2. Configure OAuth Consent Screen & Scopes
1. Go to **APIs & Services > OAuth consent screen**.
2. Click **Edit App**.
3. Proceed to the **Scopes** step and click **Add or Remove Scopes**.
4. Check the box for:
   - `https://www.googleapis.com/auth/gmail.send` — *Send email on your behalf*
5. Click **Update** and **Save and Continue**.

---

## 3. Register Redirect URIs
1. Go to **APIs & Services > Credentials**.
2. Click your OAuth 2.0 Client ID (Web application).
3. Under **Authorized redirect URIs**, add both development and production callbacks:
   - Development:
     ```text
     http://localhost:3000/api/gmail/callback
     ```
   - Production:
     ```text
     https://birthday-panda.gracetechnologies.uk/api/gmail/callback
     ```
4. Click **Save**.

---

## 4. Environment Variables Configuration
Update your `.env` (and hosting platform environment variables) with:

```bash
# Gmail OAuth Redirect URI
GOOGLE_GMAIL_REDIRECT_URI="https://birthday-panda.gracetechnologies.uk/api/gmail/callback"

# Gmail Refresh Token Encryption Key (AES-256-GCM 32-byte Hex Key)
GOOGLE_GMAIL_TOKEN_ENCRYPTION_KEY="2986d21be19ceaa6e5775e8e8e256780173c8d36bda55d6459493fee45d804b4"
```

*(Note: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are shared with the Google Cloud project credentials).*

---

## 5. Gmail Quotas & Sending Limits
- **Standard Personal Gmail accounts (`@gmail.com`)**: Google enforces a daily sending limit of **500 emails / day**.
- **Google Workspace accounts**: Supports up to **2,000 emails / day**.
- **Rate Limiting**: Our platform incorporates controlled sequential sending with a 300ms pause between messages to prevent triggering temporary burst limits (`429 Too Many Requests`).
- **Duplicate Prevention**: Invitations already marked as `sent` are skipped by default unless the customer checks *"Force resend to already sent guests"*.

---

## 6. Testing Mode vs. Production Verification
- While the Google OAuth Consent Screen is in **Testing** status, ensure all test emails are added to **Test users** in the Google Cloud Console.
- When ready for general public/commercial use, submit the OAuth Consent screen for verification under Google's Restricted Scope guidelines for `gmail.send`.

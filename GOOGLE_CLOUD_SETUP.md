# Google Cloud Console Setup & Google Drive OAuth 2.0 Guide

This guide details how to configure Google Cloud Console to enable per-customer Google Drive OAuth 2.0 integration with automatic public folder provisioning for your commercial birthday website platform.

---

## 1. Create or Select Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top and select **New Project**.
3. Name your project (e.g., `Birthday Platform Media Service`) and click **Create**.

---

## 2. Enable Google Drive API
1. In the navigation menu, select **APIs & Services > Library**.
2. Search for **Google Drive API**.
3. Click on **Google Drive API** and select **Enable**.

---

## 3. Configure OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Choose User Type:
   - **External** (Recommended for commercial websites where customers sign in with personal `@gmail.com` or custom Google Workspace accounts).
3. Fill in the App Information:
   - **App Name**: `Birthday Website Media Studio` (or your platform name)
   - **User Support Email**: Select your platform admin email.
   - **Developer Contact Information**: Enter your contact email.
4. Click **Save and Continue**.

### Scopes Configuration
Click **Add or Remove Scopes** and select:
- `.../auth/drive.file` — **Per-file access**: allows our backend to create, manage, and upload to the `Birthday Website Media` folder and files created by this application without requesting full access to the customer's personal Drive.
- `.../auth/userinfo.email` — Used to identify the customer's Google account email.
- `.../auth/userinfo.profile` — Used to display the customer's name on their dashboard.

> **Scope Note**: `drive.file` is considered a non-sensitive scope for many applications, simplifying verification compared to full `drive` scope.

---

## 4. OAuth 2.0 Credentials & Redirect URIs
1. Navigate to **APIs & Services > Credentials**.
2. Click **+ Create Credentials > OAuth client ID**.
3. Select Application type: **Web application**.
4. Name: `Birthday Platform Web Client`.
5. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
6. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/google-drive/callback`
   - Production: `https://your-domain.com/api/google-drive/callback`
7. Click **Create**.
8. Copy your **Client ID** and **Client Secret**.

---

## 5. Environment Variables Configuration
Update your `.env` file with the generated credentials:

```bash
# Database
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/google-drive/callback"

# 32-byte Hex Encryption Key for AES-256-GCM token storage
GOOGLE_DRIVE_TOKEN_ENCRYPTION_KEY="your-64-character-hex-encryption-key"

# Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

To generate a secure 32-byte hex encryption key in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 6. Testing Mode vs. Production Verification
While your OAuth consent screen is in **Testing** status:
- You must add customer Google emails to **Test Users** under **OAuth consent screen > Test users**.
- Refresh tokens in testing mode expire after 7 days.
- When ready for production, click **Publish App** on the OAuth consent screen to enable unlimited users and indefinite refresh tokens.

---

## 7. Public Folder Sharing Policies & Google Workspace
When a customer connects their Google Drive, our platform executes:
```json
{
  "type": "anyone",
  "role": "reader"
}
```
on their auto-created `Birthday Website Media` folder.

- **Standard Gmail accounts (`@gmail.com`)**: Public sharing succeeds immediately.
- **Google Workspace accounts with admin restrictions**: If a company Workspace disables public link sharing outside their organization, our system gracefully flags the sharing status as `restricted_policy` and streams the media via authenticated backend proxy (`/api/photos/[id]`), so website visitors can view and download photos without interruption.

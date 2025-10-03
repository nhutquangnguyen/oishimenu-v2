# Google Authentication Setup

The OishiMenu app now uses **Google OAuth only** for authentication. Follow these steps to configure it:

## Firebase Console Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `oishimenu-g-c6fd5`
3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Go to "Sign-in method" tab

4. **Enable Google Sign-in**:
   - Click on "Google" in the provider list
   - Toggle "Enable" to ON
   - Select your project support email
   - Click "Save"

5. **Configure Authorized Domains**:
   - Make sure `localhost` and your production domain are in the authorized domains list
   - For development: `localhost` should already be there
   - For production: Add your actual domain (e.g., `yourdomain.com`)

## Application Features

✅ **Implemented Features**:
- Google Sign-in button with official Google branding
- Redirect-based OAuth flow (avoids CORS issues)
- Automatic user document creation in Firestore
- Role-based access control (admin/manager/staff)
- Automatic role assignment based on email domain
- Vietnamese error messages and UI
- Secure logout functionality

## User Roles

The system automatically assigns roles based on email:
- **Admin**: emails containing `admin@` or `owner@`
- **Manager**: emails containing `manager@`
- **Staff**: all other Google accounts (default)

## Development Usage

1. **Start the app**: `npm run dev`
2. **Visit**: http://localhost:3000
3. **Click**: "Tiếp tục với Google" button
4. **Sign in** with any Google account
5. **Access granted** to the dashboard based on your assigned role

## Security Features

- No password storage or management required
- Leverages Google's secure OAuth 2.0 flow
- Session management handled by Firebase Auth
- Automatic user provisioning on first login
- Role-based route protection

## Notes

- Email/password authentication has been completely removed
- All existing functionality (menu, orders, inventory, etc.) works with Google auth
- User data is automatically synced between Firebase Auth and Firestore
- The app gracefully handles Google auth errors with Vietnamese messages
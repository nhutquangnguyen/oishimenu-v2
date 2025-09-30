# OishiMenu Setup Guide

## Prerequisites
- Node.js 18+ installed
- Firebase account
- Vercel account
- Git installed

## Step 1: Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "oishimenu" (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation to complete

### 1.2 Enable Firebase Services

#### Authentication
1. Go to Authentication → Get started
2. Enable Email/Password provider
3. (Optional) Enable Google provider

#### Firestore Database
1. Go to Firestore Database → Create database
2. Choose production mode
3. Select your region (e.g., asia-southeast1 for Southeast Asia)
4. Click "Enable"

#### Storage
1. Go to Storage → Get started
2. Choose production mode
3. Select same region as Firestore
4. Click "Done"

### 1.3 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" → Click Web icon (</>)
3. Register app with nickname "oishimenu-web"
4. Copy the configuration object

### 1.4 Set up Firebase Admin SDK
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Save the JSON file securely

## Step 2: Local Environment Setup

### 2.1 Create .env.local file
```bash
cp .env.local.example .env.local
```

### 2.2 Fill in Firebase Config
Edit `.env.local` with your Firebase configuration:

```env
# From Firebase Console → Project Settings → Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# From Service Account JSON file
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2.3 Initialize Firebase in Project
```bash
firebase init
```
Select:
- Firestore
- Hosting
- Storage
- Functions (optional)

Use existing project and select your Firebase project.

## Step 3: Firestore Initial Setup

### 3.1 Create Collections Structure
Run this in Firebase Console or use the seed script:

```javascript
// Collections to create:
- users
- stores
- menu_items
- menu_categories
- orders
- customers
- employees
- inventory
- feedback
```

### 3.2 Security Rules
Update `firestore.rules`:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access on all documents to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 4: Deploy to Vercel

### 4.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 4.2 Login to Vercel
```bash
vercel login
```

### 4.3 Deploy
```bash
vercel
```

Follow prompts:
- Set up and deploy: Y
- Which scope: Select your account
- Link to existing project?: N
- Project name: oishimenu
- Directory: ./
- Build Command: (default)
- Output Directory: (default)
- Development Command: (default)

### 4.4 Add Environment Variables to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add all variables from `.env.local`
5. Deploy again: `vercel --prod`

## Step 5: Configure Domain (Optional)
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Step 6: Post-Deployment

### 6.1 Update Firebase Authorized Domains
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add your Vercel domains:
   - `oishimenu.vercel.app`
   - `your-custom-domain.com`

### 6.2 Update Firebase CORS for Storage
Create `cors.json`:
```json
[
  {
    "origin": ["https://oishimenu.vercel.app", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

Apply:
```bash
gsutil cors set cors.json gs://your-storage-bucket
```

## Troubleshooting

### Common Issues

1. **Firebase Auth Error**
   - Check if domain is in authorized domains
   - Verify API keys are correct

2. **Firestore Permission Denied**
   - Check security rules
   - Verify authentication is working

3. **Vercel Build Fails**
   - Check all environment variables are set
   - Verify Node version compatibility

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Deploy to Vercel
vercel --prod

# Check Firebase deployment
firebase deploy
```

## Support
For issues, please check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
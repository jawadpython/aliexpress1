# Firebase Setup Guide

This guide will help you set up Firebase for your AliExpress affiliate website to enable cross-device product synchronization.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `aliexpress-affiliate` (or any name you prefer)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose the closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

1. In your Firebase project, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (`</>`) to add a web app
5. Enter app nickname: `aliexpress-web`
6. Check "Also set up Firebase Hosting" (optional)
7. Click "Register app"
8. Copy the Firebase configuration object

## Step 4: Update Firebase Configuration

1. Open `src/firebase.js` in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to "Firestore Database" > "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to products collection
    match /products/{document} {
      allow read, write: if true;
    }
  }
}
```

**Note**: These rules allow public access. For production, implement proper authentication.

## Step 6: Install Dependencies

Run the following command in your project directory:

```bash
npm install firebase
```

## Step 7: Test the Setup

1. Start your development server: `npm start`
2. Go to `/admin` and upload a product
3. Open the website on another device/browser
4. The product should appear on both devices

## Step 8: Deploy to Vercel

1. Push your changes to GitHub
2. In Vercel, redeploy your project
3. Your products will now sync across all devices!

## Troubleshooting

### Products not syncing?
- Check Firebase console for errors
- Verify your Firebase configuration is correct
- Check browser console for error messages

### Permission denied errors?
- Check your Firestore security rules
- Make sure the rules allow public read/write access

### Still using localStorage?
- Clear your browser cache
- Make sure you've updated the Firebase configuration
- Restart your development server

## Security Considerations

For production use, consider:
- Implementing user authentication
- Setting up proper Firestore security rules
- Using Firebase Authentication for admin access
- Implementing rate limiting

## Cost

Firebase offers a generous free tier:
- 1GB storage
- 50,000 reads per day
- 20,000 writes per day
- 20,000 deletes per day

This should be sufficient for most affiliate websites.

# Simple Cloud Storage Setup (2 minutes)

This guide will help you set up cross-device product synchronization using JSONBin.io (free service).

## Step 1: Create JSONBin.io Account

1. Go to [JSONBin.io](https://jsonbin.io/)
2. Click **"Sign Up"** (free)
3. Create account with email/password
4. Verify your email

## Step 2: Get Your API Key

1. After login, go to your **Dashboard**
2. Click on **"API Keys"** in the sidebar
3. Click **"Create API Key"**
4. Name: `aliexpress-app`
5. Click **"Create"**
6. **Copy the API key** (starts with `$2a$10$...`)

## Step 3: Update Your Code

1. Open `src/services/cloudStorage.js`
2. Replace `your-jsonbin-api-key` with your actual API key:

```javascript
const API_KEY = '$2a$10$your-actual-api-key-here';
```

## Step 4: Deploy

```bash
git add .
git commit -m "Add cloud storage for cross-device sync"
git push origin main
```

## That's It! 🎉

- ✅ Products will sync across all devices
- ✅ Upload on PC → appears on phone instantly
- ✅ Free service (10,000 requests/month)
- ✅ No complex setup required

## How It Works

- Products are stored in the cloud
- Every device fetches from the same cloud storage
- Changes sync automatically across all devices
- Falls back to localStorage if cloud is unavailable

## Troubleshooting

**Products not syncing?**
- Check your API key is correct
- Make sure you've deployed the updated code
- Check browser console for errors

**Still using localStorage?**
- Clear browser cache
- Make sure API key is updated correctly
- Restart your development server

## Cost

- **Free tier**: 10,000 requests/month
- **More than enough** for most affiliate websites
- **No credit card required**

# Fixing Google Sheets Error Messages

## Common Error Messages and Solutions

### Error 1: "Sheets URL not configured. Please set up Apps Script and add URL to .env"

**Cause:** Your `.env` file has a placeholder URL instead of the real Apps Script URL.

**Solution:**
1. Deploy your Apps Script (see steps below)
2. Copy the Web app URL from Apps Script
3. Update `.env` file with the real URL
4. Restart your dev server

---

### Error 2: "Invalid Google Apps Script URL. Should end with /exec"

**Cause:** The URL in `.env` doesn't match the correct format.

**Solution:**
- Make sure the URL looks like: `https://script.google.com/macros/s/SCRIPT_ID/exec`
- It must end with `/exec` (not `/dev` or anything else)

---

### Error 3: "Network error. Check your Apps Script URL and deployment."

**Cause:** The Apps Script isn't deployed correctly or the URL is wrong.

**Solution:**
1. Go to https://script.google.com
2. Check your deployment:
   - Click "Deploy" → "Manage deployments"
   - Verify it's set to "Anyone" can access
   - Make sure it's Active
3. Copy the URL again and update `.env`
4. Restart dev server

---

## Step-by-Step: Deploy Apps Script and Get URL

### 1. Open Google Apps Script
Go to: https://script.google.com

### 2. Create/Open Project
- Click "New Project" (or open existing)
- Delete any existing code

### 3. Paste the Script
- Open `google-apps-script.js` from your project
- Copy ALL the code
- Paste into Apps Script editor

### 4. Save
- Click "File" → "Save" (or Ctrl+S / Cmd+S)
- Name it: "Collection Tracker"

### 5. Deploy as Web App
- Click "Deploy" → "New deployment"
- Click the gear icon ⚙️ → select "Web app"
- Fill in:
  - **Description**: Collection Tracker API
  - **Execute as**: Me
  - **Who has access**: **Anyone** ← IMPORTANT!
- Click "Deploy"

### 6. Authorize
- Click "Authorize access"
- Choose your Google account
- Click "Advanced" → "Go to [project name] (unsafe)"
- Click "Allow"

### 7. Copy the URL
- You'll see "Web app URL"
- Copy the entire URL (looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

### 8. Update .env
Open `.env` and replace:
```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ACTUAL_COPIED_URL_HERE/exec
```

### 9. Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## Verify It's Working

1. **Test the Apps Script URL:**
   - Open the URL in your browser
   - Should see: `{"status":"OK","message":"Google Apps Script is running",...}`

2. **Check Browser Console:**
   - Press F12 → Console tab
   - Add a collection in your app
   - Should see: `Submitting to Google Sheet:` with your data
   - Should see: `Request sent successfully`

3. **Check Google Sheet:**
   - Open your sheet
   - Should see new rows appearing when you add collections

---

## Still Getting Errors?

**Check Browser Console (F12):**
- Look for red error messages
- Copy the exact error text
- Check what URL is being used

**Check Apps Script Executions:**
1. Go to https://script.google.com
2. Open your project
3. Click "Executions" tab (clock icon)
4. See if requests are being received
5. Click on failed executions to see error details

**Common Issues:**
- Sheet not shared with your Google account → Share the sheet
- Wrong sheet ID → Check `google-apps-script.js` has correct ID
- Wrong sheet name → Check `SHEET_NAME` matches your tab name
- Script not deployed → Follow deployment steps above

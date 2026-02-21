# Troubleshooting "Load failed" Error

If you see **"Saved locally. Google Sheet: Load failed"**, follow these steps:

## Step 1: Verify Apps Script is Deployed

1. Go to https://script.google.com
2. Open your project
3. Click **"Deploy"** → **"Manage deployments"**
4. Make sure there's a deployment with:
   - **Type**: Web app
   - **Who has access**: Anyone
   - Status should be **Active**

If not deployed, follow the setup in `GOOGLE_SHEETS_SETUP.md`

## Step 2: Check Your .env File

Open `.env` and verify:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**Important checks:**
- ✅ URL starts with `https://script.google.com`
- ✅ URL ends with `/exec` (not `/dev` or anything else)
- ✅ No extra spaces or quotes around the URL
- ✅ Replace `YOUR_SCRIPT_ID` with your actual script ID

## Step 3: Restart Dev Server

After updating `.env`, you **must** restart:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded when the server starts!

## Step 4: Test the Apps Script URL Directly

Open your Apps Script URL in a browser:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

You should see a blank page or JSON response. If you see an error, the script isn't deployed correctly.

## Step 5: Check Browser Console

1. Open your React app
2. Press F12 (or right-click → Inspect)
3. Go to **Console** tab
4. Try adding a collection
5. Look for any red error messages

## Step 6: Verify Sheet Permissions

Make sure your Google Sheet is accessible:
- Open: https://docs.google.com/spreadsheets/d/1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs/edit
- The sheet should be viewable by the Google account you used for Apps Script
- Or make it publicly viewable (if you want anyone to submit)

## Step 7: Test Apps Script Manually

In Apps Script editor:
1. Click the function dropdown → select `doPost`
2. Click **Run** ▶️
3. You'll need to authorize permissions
4. Then go to **Executions** tab to see if it ran

## Common Issues

**"Load failed" or "Network error"**
- Apps Script not deployed as Web app
- URL in `.env` is incorrect
- Dev server not restarted after changing `.env`

**"Sheets URL not configured"**
- `.env` file missing or `VITE_GOOGLE_SHEETS_URL` not set
- Dev server needs restart

**"Invalid Google Apps Script URL"**
- URL doesn't contain `script.google.com`
- URL doesn't end with `/exec`

**Data not appearing in sheet**
- Check Apps Script **Executions** tab for errors
- Verify sheet ID in script matches your sheet
- Check sheet tab name matches `SHEET_NAME` in script

## Still Not Working?

1. Check the browser console for detailed errors
2. Check Apps Script **Executions** tab for server-side errors
3. Verify the sheet ID in `google-apps-script.js` is correct
4. Make sure the sheet tab name is "Sheet1" (or update `SHEET_NAME` in script)

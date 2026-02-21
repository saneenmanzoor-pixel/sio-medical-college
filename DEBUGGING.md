# Debugging Google Sheets Integration

If data isn't updating in your Google Sheet, follow these steps:

## Step 1: Check Browser Console

1. Open your React app
2. Press **F12** (or right-click → Inspect)
3. Go to **Console** tab
4. Try adding a collection
5. Look for error messages or logs

You should see:
- `Submitting to Google Sheet:` with the data
- `URL:` with your Apps Script URL
- `Request sent successfully` if it worked
- Error messages if something failed

## Step 2: Verify .env Configuration

Check your `.env` file has the correct URL:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

**Important:**
- Replace `YOUR_ACTUAL_SCRIPT_ID` with your real Apps Script URL
- URL must end with `/exec`
- Restart dev server after changing `.env`

## Step 3: Test Apps Script Directly

1. Open your Apps Script URL in browser:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
2. You should see: `{"status":"OK","message":"Google Apps Script is running",...}`
3. If you see an error, the script isn't deployed correctly

## Step 4: Check Apps Script Deployment

1. Go to https://script.google.com
2. Open your project
3. Click **"Deploy"** → **"Manage deployments"**
4. Verify:
   - ✅ Type: Web app
   - ✅ Who has access: **Anyone**
   - ✅ Status: Active

## Step 5: Check Apps Script Execution Logs

1. In Apps Script editor, click **"Executions"** tab (clock icon)
2. Look for recent executions
3. Click on a failed execution to see error details
4. Common errors:
   - Permission denied → Sheet not shared with script account
   - Sheet not found → Wrong SHEET_NAME in script
   - Missing fields → Check parameter names match

## Step 6: Verify Sheet Permissions

1. Open your Google Sheet
2. Click **"Share"** button
3. Make sure the Google account used for Apps Script has **Editor** access
4. Or make sheet publicly editable (if you want anyone to submit)

## Step 7: Test with Manual Request

You can test the Apps Script manually using curl or Postman:

```bash
curl -X POST "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "unitName=Test&updatedDate=2026-02-20&unitTotal=1000&grandTotal=5000"
```

Replace `YOUR_SCRIPT_ID` with your actual script ID.

## Common Issues

**"Sheets URL not configured"**
- `.env` file missing or URL not set
- Dev server not restarted

**"Invalid Google Apps Script URL"**
- URL doesn't contain `script.google.com`
- URL doesn't end with `/exec`

**"Network error"**
- Apps Script not deployed
- Wrong URL in `.env`
- CORS issues (should be handled automatically)

**Data not appearing in sheet**
- Check Apps Script **Executions** tab for errors
- Verify sheet ID matches your sheet
- Check sheet tab name matches `SHEET_NAME` in script
- Verify sheet permissions

## Still Not Working?

1. Check browser console for detailed errors
2. Check Apps Script **Executions** tab for server-side errors
3. Verify the sheet ID in `google-apps-script.js` is correct: `1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs`
4. Make sure sheet tab name is "Sheet1" (or update `SHEET_NAME` in script)

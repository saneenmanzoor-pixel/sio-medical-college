# Google Sheets Setup Instructions

Your app will write collection data directly to your Google Sheet:
**https://docs.google.com/spreadsheets/d/1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs/edit**

## Step-by-Step Setup

### 1. Open Google Apps Script

Go to: **https://script.google.com**

### 2. Create New Project

- Click **"New Project"** (or the **+** button)
- A new script editor will open

### 3. Copy the Script Code

- Open the file `google-apps-script.js` in this project
- Copy **all** the code
- Paste it into the Apps Script editor (replace any existing code)

### 4. Update Sheet ID (Already Done!)

The script already has your sheet ID configured:
```
1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs
```

If your sheet tab name is not "Sheet1", change `SHEET_NAME` in the script to match your tab name.

### 5. Save the Script

- Click **File → Save** (or Ctrl+S / Cmd+S)
- Give it a name like "Collection Tracker"

### 6. Deploy as Web App

1. Click **"Deploy"** → **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure:
   - **Description**: "Collection Tracker API" (optional)
   - **Execute as**: **"Me"** (your account)
   - **Who has access**: **"Anyone"** (important!)
5. Click **"Deploy"**
6. **Authorize** when prompted:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [project name] (unsafe)"
   - Click "Allow"
7. Copy the **"Web app URL"** (looks like: `https://script.google.com/macros/s/AKfycby.../exec`)

### 7. Update Your .env File

Open `.env` in your project and paste the Web app URL:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_COPIED_URL/exec
```

Replace `YOUR_COPIED_URL` with the actual URL you copied.

### 8. Restart Your Dev Server

```bash
npm run dev
```

## Testing

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs/edit
2. In your React app, add a collection amount
3. Check the sheet - you should see a new row with:
   - Unit Name
   - Updated Date
   - Unit Total
   - Grand Total

## Sheet Structure

The script will automatically create headers on the first row:
- **Unit Name**: Name of the unit (Cheruvatta, Moozhikkal, etc.)
- **Updated Date**: Date and time of the update
- **Unit Total**: Total collection for that unit (after this update)
- **Grand Total**: Grand total across all units (after this update)

Each time you click "Add / Update" in the app, a new row is added to the sheet.

## Troubleshooting

**"Sheets URL not configured"**
- Make sure `.env` has `VITE_GOOGLE_SHEETS_URL` set
- Restart your dev server after updating `.env`

**"Missing required fields" error**
- Check that the script is deployed correctly
- Make sure "Who has access" is set to "Anyone"

**Data not appearing in sheet**
- Check the Apps Script execution log: Apps Script → "Executions" tab
- Make sure you authorized the script when deploying
- Verify the sheet ID in the script matches your sheet

**Permission errors**
- Make sure the sheet is shared with the Google account you used for Apps Script
- Or make the sheet publicly viewable (if you want anyone to submit)

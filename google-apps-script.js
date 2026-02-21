/**
 * Google Apps Script to write collection data to Google Sheet
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open https://script.google.com
 * 2. Click "New Project"
 * 3. Paste this entire code
 * 4. Replace SHEET_ID below with your sheet ID from the URL:
 *    https://docs.google.com/spreadsheets/d/SHEET_ID/edit
 *    (Your sheet ID: 1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs)
 * 5. Click "Deploy" → "New deployment"
 * 6. Click the gear icon → select "Web app"
 * 7. Set:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 8. Click "Deploy"
 * 9. Copy the "Web app URL" and use it in your .env file as VITE_GOOGLE_SHEETS_URL
 */

const SHEET_ID = '1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs';
const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name

function getOrCreateSheet_(spreadsheet, name) {
  let sheet = spreadsheet.getSheetByName(name);
  if (sheet) return sheet;

  // Fallback: if the sheet name is wrong, use the first tab.
  const sheets = spreadsheet.getSheets();
  if (sheets && sheets.length > 0) return sheets[0];

  // If the spreadsheet has no sheets (rare), create one.
  return spreadsheet.insertSheet(name);
}

function doPost(e) {
  try {
    const params = e.parameter || {};
    
    const unitName = params.unitName;
    const updatedDate = params.updatedDate;
    const unitTotal = Number(params.unitTotal);
    const grandTotal = Number(params.grandTotal);

    if (!unitName || !updatedDate || isNaN(unitTotal) || isNaN(grandTotal)) {
      return createResponse_({ success: false, error: 'Invalid data' });
    }

    const sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName(SHEET_NAME);

    sheet.appendRow([unitName, updatedDate, unitTotal, grandTotal]);

    return createResponse_({ success: true });
  } catch (err) {
    return createResponse_({ success: false, error: err.toString() });
  }
}

function createResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

// Test endpoint (GET request)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: 'Google Apps Script is running',
    sheetId: SHEET_ID,
    sheetName: SHEET_NAME
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function (optional - you can run this to test)
function test() {
  const testData = {
    unitName: 'Test Unit',
    updatedDate: new Date().toISOString(),
    unitTotal: 1000,
    grandTotal: 5000
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

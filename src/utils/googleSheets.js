const SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL;

export async function submitToGoogleSheet(data) {
  try {
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Google Sheet error:', err);
    return {
      ok: false,
      error: err.message || 'Network error. Check your Apps Script URL and deployment.',
    };
  }
}
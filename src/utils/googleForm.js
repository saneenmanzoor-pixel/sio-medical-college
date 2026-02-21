/**
 * Submit collection update to Google Form.
 * Set these in .env (see .env.example):
 * - VITE_GOOGLE_FORM_URL: your form's formResponse URL
 * - VITE_GF_ENTRY_UNIT, VITE_GF_ENTRY_DATE, VITE_GF_ENTRY_UNIT_TOTAL, VITE_GF_ENTRY_GRAND_TOTAL: entry IDs
 */
const FORM_URL = import.meta.env.VITE_GOOGLE_FORM_URL;
const ENTRY_UNIT = import.meta.env.VITE_GF_ENTRY_UNIT || 'entry.0';
const ENTRY_DATE = import.meta.env.VITE_GF_ENTRY_DATE || 'entry.1';
const ENTRY_UNIT_TOTAL = import.meta.env.VITE_GF_ENTRY_UNIT_TOTAL || 'entry.2';
const ENTRY_GRAND_TOTAL = import.meta.env.VITE_GF_ENTRY_GRAND_TOTAL || 'entry.3';

export function isGoogleFormConfigured() {
  return Boolean(FORM_URL && FORM_URL.includes('docs.google.com'));
}

export async function submitToGoogleForm({ unitName, updatedDate, unitTotal, grandTotal }) {
  if (!FORM_URL) {
    console.warn('Google Form URL not set. Set VITE_GOOGLE_FORM_URL in .env');
    return { ok: false, error: 'Form URL not configured' };
  }

  const formData = new URLSearchParams();
  formData.append(ENTRY_UNIT, unitName);
  formData.append(ENTRY_DATE, updatedDate);
  formData.append(ENTRY_UNIT_TOTAL, String(unitTotal));
  formData.append(ENTRY_GRAND_TOTAL, String(grandTotal));

  try {
    const res = await fetch(FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

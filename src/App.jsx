import { useState, useEffect } from 'react';
import { UNITS, STORAGE_KEY } from './constants';
import { submitToGoogleSheet } from './utils/googleSheets';
import './App.css';
// import logo from "./assets/sio-mc-logo.png";

const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1LAnsqvavI0WA8dOOqaCi3iNxinnr4ZcndRmDF-x6XGs/edit?usp=sharing';

function loadCollections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {};
}

function saveCollections(collections) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (_) {}
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function App() {
  const [collections, setCollections] = useState(loadCollections);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    saveCollections(collections);
  }, [collections]);

  const grandTotal = Object.values(collections).reduce((sum, c) => sum + (c?.total ?? 0), 0);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all collection data? This cannot be undone.')) {
      setCollections({});
      localStorage.removeItem(STORAGE_KEY);
      setMessage({ type: 'success', text: 'All data has been reset.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddUpdate = async () => {
    const unit = selectedUnit?.trim();
    const value = parseFloat(amount?.replace(/,/g, '')) || 0;

    if (!unit) {
      setMessage({ type: 'error', text: 'Please select a unit.' });
      return;
    }

    const prev = collections[unit]?.total ?? 0;
    const newTotal = prev + value;
    const now = new Date().toISOString();

    setSubmitting(true);
    setMessage(null);

    const newCollections = {
      ...collections,
      [unit]: { total: newTotal, lastUpdated: now },
    };
    setCollections(newCollections);
    setAmount('');

    const newGrandTotal = grandTotal - prev + newTotal;
    const result = await submitToGoogleSheet({
      unitName: unit,
      updatedDate: formatDate(now),
      unitTotal: newTotal,
      grandTotal: newGrandTotal,
    });

    setSubmitting(false);
    if (result.ok) {
      setMessage({ type: 'success', text: `${unit} updated. Total: ₹${newTotal.toLocaleString('en-IN')}. Data sent to Google Sheet.` });
    } else if (result.error) {
      console.error('Google Sheet submission failed:', result.error);
      let errorText = `Saved locally. Google Sheet: ${result.error}`;
      
      // Provide helpful guidance based on error type
      if (result.error.includes('not configured') || result.error.includes('YOUR_SCRIPT_ID')) {
        errorText += '. Please deploy Apps Script and add URL to .env file. See FIX_ERRORS.md for instructions.';
      } else if (result.error.includes('Invalid')) {
        errorText += '. Check that your Apps Script URL ends with /exec';
      } else if (result.error.includes('Network')) {
        errorText += '. Check Apps Script deployment and URL. See DEBUGGING.md';
      }
      
      setMessage({ type: 'warning', text: errorText });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <img src="../public/sio-mc-logo.png" alt="Logo" className="logo-img" />
        </div>
        <p className="tagline">Collection Tracker</p>
      </header>

      <main className="main">
        <section className="form-section">
          <label htmlFor="unit">Select Unit</label>
          <select
            id="unit"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            aria-label="Select unit"
          >
            <option value="">— Select unit —</option>
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          <label htmlFor="amount">Enter today's collection amount (₹)</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddUpdate()}
            aria-label="Collection amount"
          />

          <button
            type="button"
            className="btn-primary"
            onClick={handleAddUpdate}
            disabled={submitting}
          >
            {submitting ? 'Updating…' : 'Add / Update'}
          </button>

          {message && (
            <p className={`message message-${message.type}`} role="status">
              {message.text}
            </p>
          )}
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Collection by unit</h2>
            {Object.keys(collections).length > 0 && (
              <button
                type="button"
                className="btn-reset"
                onClick={handleReset}
                title="Reset all data"
              >
                Reset All Data
              </button>
            )}
          </div>
          {Object.keys(collections).length === 0 ? (
            <p className="empty">No collections yet. Add one above.</p>
          ) : (
            <ul className="unit-list">
              {Object.entries(collections)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([unit, data]) => (
                  <li key={unit} className="unit-item">
                    <span className="unit-name">{unit}</span>
                    <span className="unit-total">₹{(data?.total ?? 0).toLocaleString('en-IN')}</span>
                    <span className="unit-date">{formatDate(data?.lastUpdated)}</span>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <section className="totals-section">
          <div className="total-row total-grand">
            <span>Grand total (all units)</span>
            <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
          </div>
          <a
            className="sheet-link"
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open Google Sheet
          </a>
        </section>
      </main>

      <footer className="footer">
        <p>Data is stored in this device and sent to your Google Sheet when configured.</p>
      </footer>
    </div>
  );
}

export default App;

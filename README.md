# SIO MC – Collection Tracker

Responsive React app to track collection amounts per unit and optionally send data to a Google Form.

## Features

- **Logo** at the top (replace the "SIO MC" text with your logo image in `App.jsx` if needed)
- **Select Unit** dropdown: Cheruvatta, Moozhikkal, Vellimadukunnu, Kovoor, Kuttikkattur, Velliparambu, Olavanna, Palazhi
- **Enter today’s collection amount** and **Add / Update** to add to that unit’s total
- **Per-unit list**: each unit’s total and last updated date
- **Grand total** at the bottom (sum of all units)
- **Responsive** layout for mobile and desktop
- **Google Form**: on each Add/Update, submits unit name, update date, that unit’s total, and grand total (when configured)

Data is stored in the browser (localStorage) so it persists across refreshes.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Google Form setup

1. Create a Google Form with **4 short-answer questions** (in this order):
   - Unit name  
   - Collection updated date  
   - Total amount for this unit  
   - Grand total (all units)

2. Get the **form response URL**  
   - Open the form → click “Preview” (eye icon).  
   - In the address bar you’ll see something like:  
     `https://docs.google.com/forms/d/e/1FAIpQLSe.../viewform`  
   - Change `/viewform` to `/formResponse`.  
   - That’s your `VITE_GOOGLE_FORM_URL`.

3. Get **entry IDs** for each question  
   - In Preview, right‑click the page → **Inspect** (or F12).  
   - In the **Elements** tab, search for `name="entry.`  
   - You’ll see `entry.123456789` etc. Note the full name (e.g. `entry.123456789`) for each of the 4 questions.

4. Create a file `.env` in the project root (copy from `.env.example`):

```env
VITE_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
VITE_GF_ENTRY_UNIT=entry.123456789
VITE_GF_ENTRY_DATE=entry.987654321
VITE_GF_ENTRY_UNIT_TOTAL=entry.111111111
VITE_GF_ENTRY_GRAND_TOTAL=entry.222222222
```

5. Restart the dev server (`npm run dev`).  
Each time you click **Add / Update**, the app will send one row to your form with the unit name, update date, that unit’s total, and the grand total.

## Replace logo with an image

In `src/App.jsx`, replace the logo block with:

```jsx
<header className="header">
  <img src="/your-logo.png" alt="Logo" className="logo-img" />
  <p className="tagline">Collection Tracker</p>
</header>
```

Put your image in `public/your-logo.png` and add in `App.css`:

```css
.logo-img {
  max-height: 60px;
  width: auto;
}
```

## Build for production

```bash
npm run build
```

Output is in `dist/`. Serve that folder with any static host (e.g. Netlify, Vercel).

# Email Alert Setup — Imani Gift Logistics

## What Was Added

1. **`quote.html`** — All form fields now have `name` attributes and are wired to Firestore via a submit script. On success the customer sees a confirmation banner.

2. **`functions/src/index.ts`** — A Firebase Cloud Function (`onNewQuote`) that fires every time a quote is saved to Firestore and sends:
   - **Admin alert email** — full quote details + a direct link to review the quote in the dashboard
   - **Customer confirmation email** — a branded acknowledgement with their reference ID

---

## One-Time Setup

### Step 1 — Create a Gmail App Password
> Do NOT use your real Gmail password.

1. Go to https://myaccount.google.com/apppasswords
2. Select app: **Mail**, device: **Other** → name it "Imani Logistics"
3. Copy the 16-character password shown

### Step 2 — Set Firebase Secrets
Run these two commands in your terminal (inside the project folder):

```bash
firebase functions:secrets:set GMAIL_USER
# Enter your Gmail address when prompted, e.g. yourname@gmail.com

firebase functions:secrets:set GMAIL_PASS
# Enter the 16-character App Password from Step 1
```

### Step 3 — Install Function Dependencies
```bash
cd functions
npm install
```

### Step 4 — Build & Deploy
```bash
# From the project root:
npm run build --prefix functions
firebase deploy --only functions
```

---

## How It Works

```
Customer fills quote.html
        ↓
Form submits to Firestore /quotes/{id}   (status: "pending")
        ↓
Cloud Function triggers automatically
        ↓
Admin receives email with all details + "Review Quote" button
Customer receives confirmation email with reference ID
```

---

## Changing the Admin Email

By default the admin alert goes to the same Gmail address set in `GMAIL_USER`.
To send to a different address, open `functions/src/index.ts` and change:

```ts
const adminEmail = process.env.GMAIL_USER as string;
```

to:

```ts
const adminEmail = "boss@yourdomain.com";
```

Then redeploy.

---

## Files Changed

| File | What Changed |
|------|-------------|
| `quote.html` | Added `name` attributes to all inputs; added Firestore submit script; added success banner |
| `functions/src/index.ts` | New file — Cloud Function that sends both emails |
| `functions/package.json` | Added `nodemailer` + `@types/nodemailer` |
| `functions/tsconfig.json` | New file — TypeScript config |

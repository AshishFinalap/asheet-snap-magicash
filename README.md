# CollabSheet

A minimal real-time collaborative spreadsheet built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Firebase**.

## Features

- 📊 **20×10 spreadsheet grid** with keyboard navigation
- 🔢 **Formula support**: `=A1+B1`, `=A1-B1`, `=A1*2`, `=SUM(A1:A5)`
- 🔄 **Real-time collaboration** via Firestore `onSnapshot`
- 👥 **User presence** — see who's editing and on which cell
- 💾 **Save indicator** (Saving / Saved)
- 🔐 **Auth** — Google Sign-In or anonymous guest with display name

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Dashboard (document list)
│   └── document/[id]/page.tsx  # Spreadsheet editor
├── components/
│   ├── spreadsheet/
│   │   ├── SpreadsheetGrid.tsx # Main grid (20×10)
│   │   ├── Cell.tsx            # Individual cell
│   │   └── FormulaBar.tsx      # Formula display bar
│   └── ui/
│       ├── AuthGate.tsx        # Auth wrapper
│       └── PresenceBar.tsx     # Active users indicator
├── lib/
│   ├── firebase.ts             # Firebase init
│   ├── formulaEngine.ts        # Client-side formula parser
│   ├── documents.ts            # Firestore document ops
│   ├── presence.ts             # Presence tracking
│   └── auth.ts                 # Auth helpers
└── types/
    └── index.ts                # Shared TypeScript types
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/yourname/collabsheet
cd collabsheet
npm install
```

### 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project
3. Enable **Firestore** (Native mode)
4. Enable **Authentication** → Google provider + Anonymous
5. Copy your app credentials

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Deploy Firestore security rules

```bash
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts, then add environment variables:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# repeat for each variable
```

### Option B — Vercel Dashboard

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Add all `NEXT_PUBLIC_FIREBASE_*` env vars in **Settings → Environment Variables**
4. Deploy

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow keys | Navigate cells |
| Enter | Confirm & move down |
| Tab | Confirm & move right |
| F2 / double-click | Edit cell |
| Escape | Cancel edit |
| Delete / Backspace | Clear cell |
| Any char | Start typing |

---

## Formula Reference

| Formula | Example |
|---------|---------|
| Addition | `=A1+B1` |
| Subtraction | `=A1-B1` |
| Multiplication | `=A1*2` |
| Division | `=A1/B2` |
| Sum range | `=SUM(A1:A10)` |
| Cell reference | `=C3` |

---

## Example Commit History

```
feat: init Next.js 14 project with TypeScript and Tailwind
feat: add Firebase config and auth helpers
feat: implement Firestore document CRUD
feat: build Cell and SpreadsheetGrid components
feat: add formula engine (SUM, +, -, *, /)
feat: implement real-time cell sync with onSnapshot
feat: add user presence tracking
feat: keyboard navigation (arrows, enter, tab, escape)
feat: add FormulaBar and PresenceBar UI
fix: handle formula circular reference gracefully
chore: add Firestore security rules
docs: add README and deployment instructions
```

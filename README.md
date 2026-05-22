# MindCheck — Mental Health Check-In Platform

A small HR wellness app where **employees** submit daily mental-health check-ins and **managers** review and track them across the organisation.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router, TypeScript) | Full-stack — pages + API routes |
| UI Components | Material-UI (MUI) v5 | Pre-built, themeable React components |
| Data Fetching | SWR | Client-side fetching with automatic caching |
| Charts | Recharts | Mood trend visualisations |
| "Database" | In-memory arrays (server-side) | Mock data — no external DB required |

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn)

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

| Role | Name | Email | Password |
|---|---|---|---|
| Employee | Nicko Balmes | nicko@employee.lifekeyshealth | password123 |
| Employee | Lei Shane Ezra | lei@employee.lifekeyshealth | password123 |
| Employee | Carol Williams | carol@employee.lifekeyshealth | password123 |
| Manager | Dave Manager | dave@manager.lifekeyshealth | manager123 |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — MUI theme + auth context
│   ├── page.tsx                # Login page (/)
│   ├── employee/
│   │   └── page.tsx            # Employee dashboard (/employee)
│   ├── manager/
│   │   └── page.tsx            # Manager dashboard (/manager)
│   └── api/
│       ├── auth/
│       │   └── route.ts        # POST /api/auth — login
│       └── checkins/
│           └── route.ts        # GET / POST / DELETE /api/checkins
│
├── components/
│   ├── ThemeRegistry.tsx       # MUI ThemeProvider wrapper (client component)
│   ├── NavBar.tsx              # Top navigation bar
│   ├── CheckinDialog.tsx       # "New check-in" modal form
│   ├── CheckinDetailDialog.tsx # Check-in detail view modal
│   └── MoodChart.tsx           # Recharts mood-over-time visualisations
│
├── contexts/
│   └── AuthContext.tsx         # Auth state — stored in localStorage
│
├── lib/
│   ├── mockData.ts             # In-memory users & check-ins arrays (mock DB)
│   └── theme.ts                # Global MUI theme (colours, typography, overrides)
│
└── types/
    └── index.ts                # Shared TypeScript interfaces
```

---

## Feature Overview

### Authentication
- `POST /api/auth` validates email + password against the mock users array.
- On success the user object (password excluded) is stored in `localStorage` via React Context.
- The login page auto-redirects to `/employee` or `/manager` based on the user's `role`.

### Employee View (`/employee`)
- **Paginated table** of the logged-in employee's own check-ins (5 rows per page, server-side).
- **New Check-In** button opens a dialog with three fields:
  - Mood dropdown — Happy, Excited, Neutral, Anxious, Sad
  - Star rating — 1 (Very Poor) to 5 (Excellent)
  - Optional free-text note (max 500 chars)
- Each table row has **View Details** (opens a modal) and **Delete** actions.

### Manager View (`/manager`)
- **Two Recharts visualisations**:
  - Line chart — average team wellbeing rating aggregated by day
  - Horizontal bar chart — count of each mood type across the company
- **Paginated table** of check-ins from all employees (8 rows per page, server-side).
- Each row has a **View Details** action that shows the employee's name.

### API — `GET /api/checkins`

Supports server-side filtering and pagination. All parameters are optional.

```
GET /api/checkins?page=1&limit=5&userId=user-1&from=2025-01-01&to=2025-12-31
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | number | 1 | Page number (1-indexed) |
| `limit` | number | 10 | Records per page |
| `userId` | string | — | Filter to a single employee's check-ins |
| `from` | ISO date | — | Include records on or after this date |
| `to` | ISO date | — | Include records on or before this date |

**Response shape:**
```json
{
  "data": [...],
  "total": 15,
  "page": 1,
  "limit": 5,
  "totalPages": 3
}
```

### API — `POST /api/checkins`

```json
{ "userId": "user-1", "userName": "Nicko Balmes", "mood": "Happy", "rating": 4, "note": "Optional" }
```

Returns the created check-in with status `201`.

### API — `DELETE /api/checkins?id=<checkInId>`

Returns `{ "success": true }` with status `200`.

---

## How Check-In Saving Works

When an employee submits a new check-in, six things happen in sequence:

1. **Button click** → `handleSubmit()` fires in `CheckinDialog.tsx`
2. **HTTP POST** → `fetch("/api/checkins", { method: "POST", body: JSON.stringify({...}) })` sends the form data to the server
3. **API route** → The `POST` handler in `src/app/api/checkins/route.ts` receives the request, creates a new `CheckIn` object with a unique ID, and calls `checkIns.unshift(newCheckIn)` — prepending it to the in-memory array
4. **Response** → The API returns the new check-in as JSON with HTTP status `201 Created`
5. **Cache invalidation** → Back in the browser, `onSuccess()` calls `mutate()` which tells SWR the current data is stale and triggers an automatic refetch of `GET /api/checkins`
6. **Table re-renders** → SWR updates its `data` state with the fresh API response, React re-renders the table, and the new check-in appears at the top of page 1

The data persists for the lifetime of the development server process because Node.js caches the `mockData.ts` module — every API request reads and writes the same array in memory.

---

## Notes

- **Data resets on server restart** — the in-memory array is wiped each time `npm run dev` restarts. In production, replace `src/lib/mockData.ts` with a real database client (PostgreSQL, MongoDB, etc.).
- **No JWT / sessions** — authentication is simplified for this demo. A production app would use signed server-side sessions or JWT tokens stored in HTTP-only cookies.
- **All pages are Client Components** — this keeps the MUI context setup simple. A larger app would use Server Components for initial data loading and Client Components only for interactive parts.

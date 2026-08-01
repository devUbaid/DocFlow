# DocFlow — Collaborative Document Editor

A lightweight collaborative document editor with rich-text editing, file import, and document sharing. Built as a full-stack application with React and Express.

**Live Demo:** _[deployment URL here]_

## Demo Accounts

| Name           | Email              | Password      |
| -------------- | ------------------ | ------------- |
| Alice Johnson  | alice@demo.com     | password123   |
| Bob Smith      | bob@demo.com       | password123   |
| Charlie Lee    | charlie@demo.com   | password123   |

Alice owns 3 sample documents. Two are shared with Bob (one with edit access, one with view-only).

## Tech Stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Frontend  | React 18, Vite, Redux Toolkit, TipTap, React Router v6 |
| Backend   | Express, Mongoose, JWT, Zod, Multer                     |
| Database  | MongoDB Atlas                                           |
| Testing   | Jest, Supertest, mongodb-memory-server                  |
| Deploy    | Render (API) + Vercel (Frontend)                        |

## Prerequisites

- Node.js >= 18
- npm >= 9
- A MongoDB instance (Atlas or local)

## Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd ajaia-docs
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=docflow
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Seed demo data and start the server:

```bash
npm run seed
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The dev server proxies API requests to port 5000 automatically.

### 4. Run Tests

```bash
cd backend
npm test
```

Runs integration tests using an in-memory MongoDB instance — no external database needed.

## Features

- **Rich-text editing** — Bold, italic, underline, headings (H1–H3), bullet/ordered lists, blockquote, code, horizontal rule, undo/redo
- **Auto-save** — Documents save automatically with a 1-second debounce after each edit
- **File import** — Upload `.txt` or `.md` files to create new editable documents
- **Document sharing** — Share documents with other users via email, with view or edit permissions
- **Owned vs shared** — Dashboard separates "My Docs" and "Shared with me" tabs with counts
- **View-only mode** — Shared documents with view permission display a badge and disable editing
- **JWT authentication** — Secure login/register with token-based auth
- **Responsive UI** — Works across desktop, tablet, and mobile

## Project Structure

```
ajaia-docs/
├── backend/
│   ├── config/          # Database connection
│   ├── constants/       # Roles, permissions, file types
│   ├── controllers/     # Thin request handlers
│   ├── middleware/       # auth, validate, asyncHandler, errorHandler
│   ├── models/          # Mongoose schemas (User, Document, Share)
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # ApiError, token helpers
│   ├── validators/      # Zod validation schemas
│   ├── tests/           # Integration tests
│   ├── seed.js          # Demo data seeder
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Layout, Editor, ShareModal, Toast
│   │   ├── pages/       # Landing, Login, Dashboard, EditorPage
│   │   ├── slices/      # Redux slices (auth, ui)
│   │   ├── helpers/     # Axios instance, API functions
│   │   ├── hooks/       # Redux typed hooks
│   │   └── lib/         # Utilities, constants
│   ├── vite.config.js
│   └── vercel.json      # Vercel SPA config
├── README.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
└── SUBMISSION.md
```

## Supported File Types

File upload accepts `.txt` and `.md` files only. This is enforced both in the frontend file picker and backend validation. Uploading an unsupported type returns a clear error message.

## Scope Decisions

- **No .docx support** — Parsing .docx requires a binary XML parser (e.g., mammoth.js), which adds complexity without proportional value for a 4–6 hour timebox. Stated clearly in the UI.
- **No real-time collaboration** — WebSocket-based sync (e.g., Yjs/CRDT) is a significant engineering investment. Auto-save with last-write-wins is the pragmatic choice for this scope.
- **No version history** — `lastEditedBy` tracks the most recent editor but full revision history was deprioritized.
- **Simulated multi-user** — Sharing is demonstrated via seeded accounts rather than concurrent browser sessions.

## What I Would Build Next (2–4 Hours)

1. Real-time collaboration indicators (who's viewing/editing)
2. Document export to PDF or Markdown
3. Version history with diff view
4. .docx file import via mammoth.js

# Submission — DocFlow

**Candidate:** Mohd Ubaidullah (mohdubaid74933@gmail.com)
**Role:** Full Stack Product Engineer — Ajaia LLC

## Live Demo

- **Frontend:** : https://doc-flow-one-tawny.vercel.app
- **Backend API:** : https://docflow-sil8.onrender.com

## Demo Accounts

| Email              | Password      | Role   |
| ------------------ | ------------- | ------ |
| alice@demo.com     | password123   | Owner of 3 sample docs |
| bob@demo.com       | password123   | Has 2 shared docs from Alice |
| charlie@demo.com   | password123   | Clean account |

## Deliverables Checklist

| Deliverable                          | Location                                  |
| ------------------------------------ | ------------------------------------------|
| Source code                          | This repository                           |
| README with setup instructions       | `README.md`                               |
| Architecture note                    | `ARCHITECTURE.md`                         |
| AI workflow note                     | `AI_WORKFLOW.md`                          |
| Submission file                      | `SUBMISSION.md` (this file)               |
| Live frontend URL                    | _[https://doc-flow-one-tawny.vercel.app]_|
| Live backend URL                     | _[https://docflow-sil8.onrender.com]_     |
| Walkthrough video                    | _[https://www.loom.com/share/adf1fb88473943e48b8f2879508c04a1]_                      |
| Automated tests                      | `backend/tests/`                          |

## What Is Working

- Full authentication flow (register, login, JWT-protected routes)
- Document CRUD with rich-text editing (TipTap: bold, italic, underline, H1–H3, bullet/ordered lists, blockquote, code, undo/redo)
- Auto-save with 1-second debounce and save status indicator
- File upload (.txt and .md) converted into new editable documents
- Document sharing with view/edit permissions via email
- Dashboard with "My Docs" / "Shared with me" tabs and document counts
- View-only mode for shared documents with view permission
- Search and grid/list view toggle on dashboard
- Responsive design across desktop, tablet, and mobile
- Split-screen login page with branded panel
- Landing page with features, how-it-works, and CTA sections
- 6 integration tests (auth, CRUD, permissions, sharing flow)

## What Is Incomplete

- No `.docx` file upload (only `.txt` and `.md` are supported — stated in UI)
- No real-time collaboration (auto-save with last-write-wins instead)
- No version history or document revisions
- No export functionality (PDF, Markdown)

## What I Would Build Next (2–4 Hours)

1. Real-time presence indicators (who's viewing/editing a document)
2. Export documents to PDF and Markdown
3. Document version history with diff view
4. .docx import via mammoth.js
5. Commenting or suggestion mode on shared documents

## Stack

| Layer     | Technology                                              |
| --------- | ------------------------------------------------------- |
| Frontend  | React 18, Vite, Redux Toolkit, TipTap, React Router v6 |
| Backend   | Express, Mongoose, JWT, Zod, Multer                     |
| Database  | MongoDB Atlas                                           |
| Testing   | Jest, Supertest, mongodb-memory-server                  |
| Deploy    | Render (backend) + Vercel (frontend)                    |

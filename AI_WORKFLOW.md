# AI Workflow Note — DocFlow

## Where I Used AI

I used ChatGPT and Claude to scaffold boilerplate faster (Express/Mongoose setup, the Zod schemas, Redux slices, and the CSS design system), to iterate on the UI through visual feedback, and to set up the test infrastructure. I made the product and architecture decisions myself — the MVC + Service layer pattern, the TipTap editor choice over Slate/Quill, the Share data model design, the auto-save debounce approach, and the scope cuts (no real-time collab, no .docx, no version history) — and I reviewed all generated code to ensure it matched my design (e.g. keeping controllers thin with all business logic in services, enforcing permission checks server-side, and validating inputs through Zod middleware).

## How I Verified Quality

- Manually tested every user flow end-to-end: auth, document CRUD, rich-text formatting, file upload, sharing with different permissions
- Ran the integration test suite after backend changes
- Ran `npm run build` after every frontend change to catch errors early
- Reviewed all code for security: no credentials in commits, auth enforced on all protected routes, input validation on all endpoints

# AI Event Organizer

## Overview
An event planning API and React client. Users can register, authenticate, create and manage events, and track checklist items. AI generation is represented by the event content contract and provider environment settings for the next implementation phase.

## Stack
- Server: Node.js ES modules, Express, Mongoose, JWT, bcryptjs, cors, dotenv, express-rate-limit
- Client: React, Vite, React Router, Axios, plain CSS

## Folder structure
- `server/`: API, models, middleware, and routes
- `client/`: Vite React application with auth context, protected routes, event pages, and Axios API client
- `PROGRESS.md`: continuation state
- `LEARNING.md`: phase learning notes

## API endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/events` (Bearer token)
- `POST /api/events` (Bearer token)
- `GET /api/events/:id` (Bearer token)
- `PUT /api/events/:id` (Bearer token)
- `DELETE /api/events/:id` (Bearer token)
- `POST /api/events/:id/expenses` (Bearer token, owner only)
- `PUT /api/events/:id/expenses/:expenseId` (Bearer token, owner only)
- `DELETE /api/events/:id/expenses/:expenseId` (Bearer token, owner only)
- `GET /api/events/:id/budget-summary` (Bearer token, owner only)
- `POST /api/ai/plan` (Bearer token, rate limited)
- `GET /api/templates` (Bearer token)
- `GET /api/templates/:id` (Bearer token)
- `GET /api/events/:id/guests` (Bearer token, organizer only)
- `POST /api/rsvp/:token` (public, rate limited)

## Environment variables
See `server/.env.example`: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `AI_PROVIDER`, `AI_MODEL`, `GEMINI_API_KEY`, and `ANTHROPIC_API_KEY`.

## Run commands
```powershell
cd server
npm install
Copy-Item .env.example .env
npm run dev

cd ../client
npm install
npm run dev
```

## Conventions
- Use ES module imports in the server.
- Keep protected resources scoped to `req.userId`.
- Validate request input and ObjectIds at route boundaries.
- Never return password fields.
- Keep comments limited to non-obvious behavior.
- Keep client API calls in `client/src/api.js` and authentication state in `client/src/context/AuthContext.jsx`.
- Keep RSVP pages public while organizer event and guest data remain protected.
- Keep occasion template guidance server-side; public template responses must not expose `aiHints`.

# AI Event Planner

AI Event planner turns a few event details into a practical event blueprint. Users can register, generate an AI-assisted plan, review the agenda and budget, save events, and manage checklist progress.

## Features

- Registration, login, and session restoration
- User-scoped event creation, viewing, editing, and deletion
- AI-generated title, description, agenda, checklist, and INR budget split
- Gemini and Anthropic provider support behind one server-side abstraction
- Persistent checklist toggles, responsive UI, loading states, and useful errors
- Public RSVP links with organizer guest counts, headcount, and dietary summaries
- Rate limiting for AI generation

## Tech Stack

- Backend: Node.js ES modules, Express, MongoDB/Mongoose, JWT, bcryptjs, CORS, dotenv, express-rate-limit
- Frontend: React, Vite, React Router v6, Axios, plain CSS
- AI: `@google/genai` or `@anthropic-ai/sdk`

## Structure

```text
server/  Express API, models, middleware, routes, and AI service
client/  Vite React application and API client
```

## Local Setup

Backend:

```powershell
cd server
npm install
Copy-Item .env.example .env
# Edit .env with MongoDB, JWT, and AI credentials
npm run dev
```

Frontend, in a second terminal:

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

The API runs at `http://localhost:5000`; the client runs at `http://localhost:5173`.

## Environment Variables

Server `server/.env`: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `AI_PROVIDER`, `AI_MODEL`, `GEMINI_API_KEY`, and `ANTHROPIC_API_KEY`.

Client `client/.env`: `VITE_API_URL`, defaulting to `http://localhost:5000/api`.

Use `AI_PROVIDER=gemini` or `AI_PROVIDER=anthropic` and configure the matching key. Never expose server AI keys in the client.

## API Endpoints

Protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `GET` | `/api/auth/me` | Current user |
| `GET` | `/api/events` | List owned events |
| `POST` | `/api/events` | Save event |
| `GET` | `/api/events/:id` | View owned event |
| `PUT` | `/api/events/:id` | Update owned event |
| `DELETE` | `/api/events/:id` | Delete owned event |
| `POST` | `/api/ai/plan` | Generate a plan; 10 requests per 15 minutes |
| `GET` | `/api/events/:id/guests` | List guest RSVPs for an owned event |
| `POST` | `/api/rsvp/:token` | Submit or update a public RSVP |

## Deployment

### Render backend

Create a Render Web Service with root directory `server`, build command `npm install`, and start command `npm start`. Add `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `AI_PROVIDER`, `AI_MODEL`, and the selected provider key. Set `CLIENT_URL` to the Vercel URL, such as `https://your-app.vercel.app`, and allow the Render service in MongoDB Atlas network access.

### Vercel frontend

Import the repository into Vercel with root directory `client`, build command `npm run build`, and output directory `dist`. Add `VITE_API_URL` pointing to the Render API with `/api`, such as `https://your-api.onrender.com/api`. Redeploy after changing environment variables.

## Validation

```powershell
cd client
npm run build

cd ../server
node --check index.js
node --check routes/ai.js
node --check services/ai.js
```

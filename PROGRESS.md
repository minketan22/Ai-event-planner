# Progress

## Phase checklist
- [x] Create project root documentation and agent instructions
- [x] Create server package and API foundation
- [x] Create authentication and event data models/routes
- [x] Scaffold client with Vite React
- [x] Implement AI provider integration and event generation API
- [x] Add client authentication and event management screens
- [x] Complete frontend polish, validation, and deployment documentation
- [x] Implement public Guest RSVP and organizer guest summaries
- [x] Implement end-to-end occasion templates with AI prompt guidance
- [x] Implement planned-versus-actual budget tracking
- [ ] Add automated tests and deployment configuration

## Current state
- Done: Root documentation, server API foundation, protected auth/event routes, AI provider endpoint, full React auth/event workflows, public RSVP links, organizer guest analytics, end-to-end occasion templates, and planned-versus-actual budget tracking are present. Client production build and server syntax checks pass.
- Next: Add automated tests and finalize deployment configuration when hosting accounts are available.
- Files touched: `.gitignore`, `README.md`, `AGENTS.md`, `.github/copilot-instructions.md`, `CLAUDE.md`, `PROGRESS.md`, `LEARNING.md`, `server/`, `client/`.
- Known bugs: Restart the server after changing `server/.env`; startup now overrides stale inherited environment values. Existing events now receive RSVP tokens on list/detail reads, and RSVP accepts one accidental extra hex character in legacy copied links. The active Gemini model is `gemini-3.6-flash`. MongoDB and valid provider credentials are still required. Transient AI 429/5xx responses retry with backoff; persistent provider capacity issues require trying again later or switching to Anthropic configuration.

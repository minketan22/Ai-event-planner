# Learning Notes

## Phase 1: Project foundation
- Express exposes HTTP routes through a small application instance.
- Middleware runs between the request and route handler.
- CORS controls which browser origins may call the API.
- dotenv loads local configuration from environment variables.
- Vite provides a fast React development server and build pipeline.

## Phase 2: Data and authentication
- Mongoose schemas describe document shape and validation rules.
- Mongoose models provide database query methods for schemas.
- JWTs carry signed identity claims between client and server.
- bcryptjs hashes passwords so plaintext passwords are not stored.
- Auth middleware verifies Bearer tokens before protected routes run.
- ObjectId validation prevents malformed resource lookups.

## Phase 3: AI generation
- Prompting can require a strict JSON contract for predictable downstream parsing.
- Provider abstraction keeps Gemini and Anthropic details behind one `generatePlan` function.
- API keys stay server-side and are read from environment variables.
- JSON responses should be parsed inside `try/catch` and retried once when malformed.
- Post-processing can validate generated data and correct a budget total.
- Rate limiting protects expensive AI endpoints from accidental or abusive repeated calls.

## Phase 4: React client
- `useState` stores controlled form values, loading flags, errors, and fetched data.
- `useEffect` loads session and event data when a component or route becomes active.
- Context shares authentication state and actions across the whole route tree.
- Protected routes redirect unauthenticated users before rendering private pages.
- Controlled inputs keep form fields synchronized with React state.
- The loading/error/data pattern makes each API workflow explicit to the user.

## Phase 5: Polish and deployment
- Shared CSS rules keep spacing, controls, cards, and responsive behavior consistent.
- Client validation gives immediate feedback before requests reach the API.
- API error normalization turns network and server failures into useful messages.
- Render can host the Node API while Vercel serves the Vite build.
- `CLIENT_URL` controls backend CORS and `VITE_API_URL` controls the frontend API target.
- Server secrets stay in hosting environment variables and are never bundled into the client.

## Phase 6: Guest RSVP
- A random public token allows RSVP access without exposing organizer credentials.
- Guest documents reference events so responses remain scoped to one invitation.
- Upsert-by-email or phone lets a guest revise an existing response.
- Rate limiting protects public RSVP endpoints from automated abuse.
- Organizer-only guest routes enforce ownership through the event query.
- Derived counts and dietary summaries can be calculated from the guest response list in the client.

## Phase 7: Occasion Templates
- Configuration-as-data keeps occasion defaults, guidance, checklists, and budget weights easy to review and extend.
- Prompt augmentation can add domain guidance without changing the provider abstraction or JSON contract.
- Deduplicating generated and starter checklist tasks by normalized text preserves AI ordering while preventing repeated work.
- Protected template endpoints can return safe display metadata while keeping AI guidance on the server.
- Controlled forms make template defaults useful starting points while keeping every field editable.
- Persisting the template ID lets event detail pages explain how a plan was started without storing duplicated template content.

## Phase 8: Budget Tracking
- Mongoose sub-documents keep expense records embedded with the event while giving each record its own identifier for CRUD operations.
- Aggregation pipelines make category totals efficient through explicit `$match`, `$unwind`, and `$group` stages.
- Aggregation `$match` does not reliably auto-cast route strings, so ObjectIds should be constructed before the pipeline.
- Budget summaries are derived data and should be recalculated from stored expenses rather than persisted as a second source of truth.
- Case-insensitive category merging lets planned labels and entered expense labels remain practical for users.
- Recharts grouped bars make planned-versus-actual comparisons visible while text labels and alerts keep status accessible without colour alone.

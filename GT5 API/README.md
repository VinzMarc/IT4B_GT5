# GT5 API — AI project review

This folder contains the AI review feature sources:

- `Review.tsx` and `review.css` — protected review screen and its styles.
- `client.ts` and `types.ts` — typed frontend API client and response shape.
- `ai.ts` — authenticated Gemini endpoint, prompt examples, response validation, and rate limiting.
- `requireAuth.ts` — JWT guard used to protect the AI endpoint.

## App integration

The site registers `Review` at `/review` in `src/App.tsx` and links to it in `src/components/Layout.tsx`. The frontend client reads the existing session token from `src/store/authStore.ts`.

The backend mounts the AI route behind `requireAuth` in `itelect4-backend/src/server.ts`. The backend package manifest supplies `@google/genai`, `express-rate-limit`, `zod`, and the existing Express/JWT dependencies. The backend TypeScript config includes `ai.ts`.

Set `GEMINI_API_KEY` in `itelect4-backend/.env` (the variable is also listed in `itelect4-backend/.env.example`). Never expose it as a `VITE_` variable.

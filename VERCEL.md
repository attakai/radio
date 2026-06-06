Vercel deployment notes

- Set Environment Variable in Vercel (Project Settings → Environment Variables):
  - `OPENAI_API_KEY` = <your OpenAI key> (do NOT commit this value to the repo)

- Node version:
  - We require Node >= 22.18.0. This is specified in `frontend/package.json` under `engines`.
  - In Vercel, set the Node Version if necessary in Project Settings.

- Build & output:
  - The repo contains a `frontend/` Nuxt app. The build command runs `nuxt build` in `frontend` (Vercel will run `vercel-build` if present).
  - `vercel.json` is configured to serve `frontend/.output/public` and route `/api/*` to the Nitro server output.

- Important security note:
  - Keep `OPENAI_API_KEY` only in Vercel environment variables. Do NOT add it to the repo or `.env` that is committed.

- If you run into native binding build errors locally, upgrade Node to >= 22.18.0 or re-install deps with a clean `node_modules` and `package-lock.json` removal.

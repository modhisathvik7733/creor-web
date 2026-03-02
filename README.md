# creor-web

Landing page, docs, and dashboard for [Creor](https://creor.ai) — the AI-native code editor.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Hosting:** Vercel
- **Domain:** creor.ai

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm start` | Start production server |

## CI/CD

GitHub Actions runs on every push to `main` and on pull requests:
- ESLint
- TypeScript type checking
- Production build

Vercel automatically deploys on push to `main` with preview deploys on PRs.

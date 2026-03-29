# PT Learner — Português Europeu A2

Interactive study tool for European Portuguese A2 / CIPLE exam preparation.

## Features

- **200+ vocabulary words** across 12+ themes
- **25 most common verbs** with full conjugation
- **Grammar drills**: Pretérito Perfeito vs Imperfeito, Ser vs Estar
- **Writing practice**: CIPLE-style tasks with model answers
- **Listening**: Embedded EP audio/video resources
- **Speaking**: Shadowing dialogue prompts
- **Grammar glossary**: Plain-English explanations of all terminology
- **Spaced repetition**: localStorage-powered mastery tracking

## Tech Stack

- React 18
- Vite 5
- Deployed on Vercel

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deployment

Push to `main` branch — Vercel auto-deploys.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/barnymurt/ptlearner.git
git push -u origin main
```

Then import the repo at [vercel.com](https://vercel.com) → New Project → Import from GitHub.

## License

MIT

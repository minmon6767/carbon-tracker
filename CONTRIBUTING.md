# Contributing to CarbonTrace

Thanks for wanting to help. This is a small project so there's no bureaucracy — just a few things to keep in mind.

---

## What we're looking for

The most valuable contributions right now:

**Adding actions**
If you want to add to the action library in `src/data/actions.js`, each action needs:
- A real CO₂ saving figure with a cited source
- An honest effort level (easy/medium/hard — don't undersell it)
- A tip that explains *why* this action matters, not just that it does

**Regional emission factors**
The current defaults are UK-centric (DEFRA 2023). If you have reliable emission factors for other grids or transport systems, that'd be genuinely useful.

**Accessibility**
We haven't done a proper a11y pass. Screen reader support, keyboard navigation, colour contrast — all fair game.

**Bug fixes**
If something's broken, open an issue describing what you expected vs what happened, and what browser/OS you're on.

---

## Getting set up

```bash
git clone https://github.com/your-username/carbontrace.git
cd carbontrace
npm install
npm run dev
```

---

## Ground rules

- Keep PRs focused — one thing at a time is much easier to review
- If you're adding emission factors, cite your source in a comment
- Don't introduce new dependencies without a discussion — we want to keep this lightweight
- The design system lives in `index.css` — try to use existing variables rather than adding new ones

---

## Code style

We're not strict about formatting but a few conventions:

- Components go in `src/components/`
- Pure calculation logic goes in `src/utils/`
- Static data (actions, categories) goes in `src/data/`
- No TypeScript for now — keep it vanilla JSX

---

## Opening a PR

Just open one — you don't need to file an issue first for small changes. For bigger things (new features, refactors) it's worth a quick issue first so we can discuss before you spend time on it.

We'll review within a few days. If we don't, ping us.

# 🌿 CarbonTrace

**Know your footprint. Cut what matters. No guilt — just clarity.**

CarbonTrace is a personal carbon footprint tracker built for people who want to make a real difference but don't have time for complicated tools. Answer five questions, get your footprint calculated instantly, then build better habits one logged action at a time.

---

## What it does

Most carbon calculators leave you with a depressing number and no idea what to do next. CarbonTrace is different:

- **Personalised baseline** — we calculate your footprint from your actual lifestyle (transport, diet, home energy, shopping), not a generic average
- **Daily action hub** — a curated list of things you can actually do today, with real CO₂ savings shown upfront so you can prioritise
- **Smart insights** — tells you where your biggest opportunities are, tracks your streak, and shows what your saved actions are equivalent to in the real world
- **Progress toward a target** — we measure you against the 1.5°C aligned annual budget (2.5t CO₂), not some abstract "average"

Everything stays on your device. No account, no tracking, no ads.

---

## Screenshots

| Onboarding | Dashboard | Actions | Insights |
|---|---|---|---|
| 5 quick questions | Your footprint at a glance | Daily actions to log | Where to focus |

---

## Getting started

You'll need Node.js 18+ installed.

```bash
git clone https://github.com/your-username/carbontrace.git
cd carbontrace
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) — you'll be up and running in under a minute.

To build for production:

```bash
npm run build
```

The output goes into `/dist` and is ready to deploy to Vercel, Netlify, or any static host.

---

## How the footprint calculation works

We use emission factors from **DEFRA 2023** and the **US EPA** to turn your lifestyle inputs into a daily kg CO₂e figure:

| Category | Data source | Inputs used |
|---|---|---|
| Transport | DEFRA 2023 vehicle emissions | Vehicle type + commute distance |
| Diet | Oxford/Poore & Nemecek (2018) | Diet pattern (vegan → heavy meat) |
| Home energy | UK national grid average (0.233 kg/kWh) | Monthly electricity consumption |
| Shopping | WRAP lifecycle estimates | Shopping frequency (low/medium/high) |

The annual figure is then compared against:
- Global average (~4 tonnes/year)
- UK average (~5.5 tonnes)
- India average (~1.9 tonnes)
- The 1.5°C climate target (2.5 tonnes)

We don't pretend this is precise — carbon accounting at the individual level is genuinely hard. But the directional signals are solid, and that's what matters for behaviour change.

---

## Project structure

```
carbontrace/
├── src/
│   ├── components/
│   │   ├── Nav.jsx          # Top navigation bar
│   │   ├── Onboarding.jsx   # 5-step profile setup
│   │   ├── Dashboard.jsx    # Main overview with donut chart
│   │   ├── ActionHub.jsx    # Daily action logging
│   │   └── Insights.jsx     # Personalised insights + scenarios
│   ├── data/
│   │   └── actions.js       # 14 curated actions with real savings data
│   ├── utils/
│   │   ├── footprintCalc.js # Emission factor calculations
│   │   └── insightEngine.js # Personalised insight generation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── favicon.svg
├── index.html
├── package.json
└── vite.config.js
```

---

## Tech stack

- **React 18** — component architecture, hooks for state
- **Vite** — fast dev server and build tool
- **localStorage** — all user data stays local, zero backend
- **Google Fonts** — Space Grotesk (display) + Inter (body)
- Pure CSS — no UI framework, custom design system throughout

No backend. No database. No auth. If you want to reset, just clear your browser storage.

---

## The 14 actions we track

We picked actions based on two things: real impact size and practical achievability. Every action shows its CO₂ saving upfront — we think transparency matters more than making things seem easy.

| Action | Saving | Category |
|---|---|---|
| Skip meat today | 1.5 kg | Diet |
| Cook a plant-based meal | 0.8 kg | Diet |
| Buy local/seasonal produce | 0.4 kg | Diet |
| Use public transport | 1.8 kg | Transport |
| Cycle or walk to work | 2.2 kg | Transport |
| Choose train over short-haul flight | 45.0 kg | Transport |
| Wash clothes at 30°C | 0.6 kg | Energy |
| Line dry instead of tumble dry | 0.5 kg | Energy |
| Turn thermostat down 1°C | 0.45 kg | Energy |
| Unplug devices on standby | 0.15 kg | Energy |
| Keep shower under 5 minutes | 0.35 kg | Energy |
| Use a reusable bag | 0.05 kg | Shopping |
| Buy secondhand instead of new | 2.5 kg | Shopping |
| Repair instead of replace | 3.0 kg | Shopping |

---

## Contributing

We'd love contributions — see [CONTRIBUTING.md](CONTRIBUTING.md) for how to get involved. The most useful things right now:

- More actions with well-sourced savings figures
- Better emission factors for non-UK regions
- Accessibility review
- Mobile UX improvements

---

## Built at

This project was built as part of a hackathon. The core idea came from a frustration with existing carbon calculators — they're either too complicated, too guilt-heavy, or they calculate your footprint and then just... stop. We wanted something that turned the number into daily momentum.

---

## License

MIT — use it, fork it, build on it. If you ship something with it, we'd love to hear about it.

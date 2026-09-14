# Habit Exchange

A habit tracker styled like a crypto exchange dashboard (Binance palette: near-black panels, gold accent, green "up" states). Habits are "positions" you open; marking one done each day lights up a GitHub-style contribution heatmap, and clicking any day shows exactly which habits were completed.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## How it works

- **Add a habit** — left panel ("New position"): name, scheduled time, and a color tag.
- **Mark done** — in the habit list, click "Mark done" to log completion for today. Click again to undo.
- **Activity map** — top-right panel, a 53-week contribution heatmap. Color intensity scales with how many habits you completed that day; a full gold square means you completed every habit that day. Today is outlined in gold.
- **Day detail** — click any day on the heatmap to see the exact list of habits completed that day, shown in the left panel below the form.
- **Streak** — shown in the header, counting consecutive days with at least one completed habit.

## Data storage

Everything is saved to `localStorage` in your browser (`habitx.habits` and `habitx.log`). No backend, no account — clearing your browser storage resets it.

## Stack

React 18 + Vite + Tailwind CSS.

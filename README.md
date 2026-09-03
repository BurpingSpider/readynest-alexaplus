# ReadyNest

**ReadyNest is a simulated Alexa+ household-resilience agent that turns one conversational goal into a persistent, multi-step action plan.**

Built for the Alexa+ track of **Build, Ship, Shape: Amazon Developer Hackathon** using the competition's explicitly allowed simulated-experience path.

## Why this is different from a Q&A bot

ReadyNest demonstrates an agentic interaction model:

- decomposes one household goal into multiple actions;
- maintains durable household and plan state across sessions;
- reprioritizes work when the situation changes;
- uses a confirmation gate before consequential actions;
- shows a transparent action/tool timeline;
- pairs concise conversational responses with visual cards and task state.

The demo scenario is hurricane readiness, but the orchestration pattern is intentionally reusable for other time-sensitive household events.

## Zero-cost architecture

The hackathon build is designed to run for **$0 out of pocket**:

- no paid API;
- no cloud compute;
- no subscription;
- no database;
- no external JavaScript packages;
- no network dependency for the demo.

The simulated agent and all tool adapters run locally in the browser. Persistent memory uses `localStorage`.

## Run locally

No install is required.

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

Or use:

```bash
npm run serve
```

## Test

Node 20+ is sufficient. No npm install is required.

```bash
npm test
```

## Suggested 90-second judging demo

1. Click **Build 48-hour plan**.
2. Show that ReadyNest creates assigned tasks, identifies supply gaps, and stops at a human confirmation gate.
3. Click **Situation changed**.
4. Point out the changed ETA, backup route, promoted critical tasks, and agent activity timeline.
5. Click **New session**.
6. Ask **Where are we?** to show persistent state across sessions.
7. Confirm the supply plan and explicitly note that the hackathon simulation performs no real purchase.

## Project structure

- `index.html` — product shell and demo surface
- `style.css` — responsive visual design
- `src/engine.js` — persistent planning/orchestration engine
- `src/app.js` — UI and conversation controller
- `tests/engine.test.js` — state, replanning, memory, and safety-gate tests
- `SUBMISSION.md` — draft Devpost submission
- `DEMO_SCRIPT.md` — under-3-minute demo structure
- `FRICTION_LOG.md` — judging bonus material
- `ARCHITECTURE.md` — technical explanation

## Safety and scope

ReadyNest is a **hackathon simulation**, not emergency, medical, navigation, or purchasing software. Scenario data is fictional. No real messages, purchases, route guidance, or medical recommendations are sent or performed.

## License

MIT

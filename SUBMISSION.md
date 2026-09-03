# Devpost Draft — ReadyNest

## Tagline
A persistent Alexa+ household-resilience agent that turns one voice goal into a coordinated action plan—and keeps replanning until the household is ready.

## Inspiration
When a household is under time pressure, information is rarely the main problem. The hard part is coordination: remembering who needs what, what is already complete, what still needs a human decision, and what must change when the situation changes.

Most assistant demos stop after the answer. ReadyNest is built around the outcome.

## What it does
ReadyNest is a simulated Alexa+ experience for household readiness. A user can make one high-level request such as preparing for a severe-weather event. ReadyNest then:

- loads remembered household context;
- decomposes the goal into a prioritized plan;
- assigns tasks and deadlines;
- audits fictional supply gaps;
- tracks route and event state inside the demo scenario;
- holds consequential actions behind an explicit confirmation gate;
- keeps state across sessions;
- autonomously replans when the scenario changes;
- explains what it did through an action timeline and visual task board.

The demo is intentionally local and deterministic: it uses no paid API, cloud compute, real purchase, real message, or real emergency data.

## How we built it
ReadyNest uses a small browser-based agentic orchestration engine written in plain JavaScript. The core state includes a household profile, active scenario, tasks, supply gaps, pending confirmations, and an append-only action history. State is persisted in browser localStorage so a fresh conversation can resume the existing plan.

The planner separates goal decomposition from execution. Reversible actions can be completed automatically inside the simulation, while potentially consequential actions move into a pending-confirmation state. A replanning path can mutate the same plan when event timing or route conditions change rather than discarding prior work.

The interface combines concise conversational turns with visual task, memory, inventory, and activity cards to model a voice + screen Alexa+ experience.

## Why it fits Alexa+
The project targets the qualities Amazon explicitly identifies as creative for Alexa+: autonomous orchestration, context maintained across sessions, and a coherent multi-modal experience. Rather than wrapping one API or answering a single question, ReadyNest coordinates several conceptual services and maintains a long-lived outcome state.

## Challenges we ran into
The hackathon provides two very different Alexa+ routes: production-style MCP/Agent Skill integration and an explicitly permitted simulated web experience. Production documentation is deep, but there is less dedicated guidance for what a high-quality simulation should demonstrate. We used the official judging criteria as the product spec and focused on observable agentic behaviors: orchestration, persistent memory, replanning, visual continuity, and explicit human control.

## Accomplishments that we're proud of
- A complete demo that runs locally with no external services.
- Persistent state that survives a new conversation session.
- Replanning that changes priorities and route state without restarting the workflow.
- A human confirmation gate for consequential actions.
- An explainable action timeline that makes the agent's autonomy visible to judges.
- Zero runtime cost and zero setup dependencies beyond a browser and a tiny static server.

## What we learned
The strongest Alexa+ experiences are not necessarily the ones with the most conversation. The better design question is: what state needs to survive, what work can the agent safely coordinate, when should it stop for a human, and how can the screen make that invisible orchestration understandable at a glance?

## What's next
A production version could replace the local adapters with authorized Alexa+ MCP or Agent Skill integrations for calendars, household services, commerce, messaging, and real public-safety data. The orchestration contract would remain the same: persistent context, explicit action boundaries, and adaptive plans.

## Track
Alexa+

## Mini challenge
Open Source

## Open-source contribution description
ReadyNest is a new MIT-licensed open-source project created during the hackathon window. The repository contains the reusable local orchestration engine, persistent-state pattern, confirmation gate, replanning logic, tests, and complete simulated Alexa+ interface.

## Product feedback
The Alexa+ documentation does a strong job explaining the production MCP path, especially Streamable HTTP requirements and voice/screen conversation behavior. The hackathon rules also clearly allow a simulated web experience, which makes the event accessible to developers who do not yet have production infrastructure.

The main opportunity is to connect those two experiences more directly. A simulation-specific quickstart would reduce uncertainty around the alternate path: what must be shown in code, what production behaviors should be represented, and what a judge-ready demo should include. A small starter project or checklist would make the zero-to-first-demo experience much faster.

We would build with Alexa+ again. The model of an assistant that coordinates stateful work across services is a more interesting design space than a traditional one-shot voice skill, and the voice + visual continuity guidance encourages product experiences that are understandable rather than opaque.

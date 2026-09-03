# ReadyNest Architecture

## Product thesis

In a stressful household event, the hard part is not answering a question. It is keeping track of many interdependent actions over hours or days, remembering what has already happened, adapting when conditions change, and knowing when the human must stay in control.

ReadyNest models that as a small agentic system.

## Components

### 1. Conversation controller
`src/app.js` accepts a natural-language-like user turn, sends it to the local agent, and renders a concise conversational response plus visual state.

### 2. Persistent context
`ReadyNestAgent` stores household profile, hazard state, tasks, supply gaps, confirmations, and action history. In the browser this is saved to `localStorage`, which allows a new session to resume the prior plan.

### 3. Planner / replanner
`src/engine.js` converts a high-level request into a task graph with priority, owner, due time, and status. When conditions change, it updates deadlines, promotes critical work, and changes the recommended route inside the fictional simulation.

### 4. Tool adapters
The action log exposes the conceptual tools the agent invokes:

- `profile.read`
- `inventory.audit`
- `route.rank` / `route.switch`
- `family.assign` / `family.relay`
- `calendar.schedule`
- `planner.reprioritize`
- `confirmation.gate`
- `supply.simulate`

The hackathon simulation keeps these adapters local and deterministic so judges can reproduce the complete experience at no cost.

### 5. Human confirmation gate
Potentially consequential actions are deliberately split into **plan** and **commit** phases. In the demo, ReadyNest may identify a supply gap and prepare an action, but it will not mark that action completed until the user explicitly confirms.

## Alexa+ design alignment

Amazon's current Alexa+ design guidance emphasizes turn-based conversation that can resume after interruptions, voice and screen working together, and multi-turn continuity. The hackathon rules explicitly call out autonomous orchestration, context across sessions, and visual/media experiences as examples of creative Alexa+ entries. ReadyNest is designed around those properties rather than a single-turn assistant pattern.

## Production path

A production implementation could replace the local adapters with real Alexa+ MCP/Agent Skill integrations and authorized services while preserving the same orchestration contract. The hackathon build intentionally does not require or simulate possession of production credentials.

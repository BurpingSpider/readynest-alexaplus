# Friction Log — Build, Ship, Shape

These entries are intended for the optional friction-log portion of the submission. They describe issues encountered while reviewing the official hackathon and Alexa+ developer material for the simulated-experience route.

## 1. Simulation route is valid but easy to miss

**Task attempted:** Determine the minimum Alexa+ integration required for an eligible zero-cost hackathon prototype.

**Steps:** Read the main hackathon overview, official rules, and Alexa+ MCP onboarding documentation.

**Expected:** A dedicated simulation quickstart and checklist alongside the MCP and Agent Skill paths.

**Actual:** The rules clearly allow a simulated Alexa+ web experience, but the product documentation naturally focuses on production MCP/Agent Skill onboarding. It takes cross-referencing the hackathon rules to understand that the simulation path is exempt from the runtime-technology-hook requirement.

**Severity:** Medium

**Workaround:** Treat the hackathon rules as authoritative for the alternate path and use Alexa+ design documentation only for interaction principles.

**Suggestion:** Add a “Simulated Alexa+ Hackathon Path” resource card with a starter template, minimum judging requirements, and one example of a strong agentic simulation.

## 2. Production design guidance vs. simulation judging guidance

**Task attempted:** Translate Alexa+ production interaction guidance into a web-based hackathon simulation.

**Expected:** Clear guidance about which Alexa+ product behaviors judges expect simulations to demonstrate.

**Actual:** Production docs explain voice/screen continuity and MCP behavior well, while the hackathon rules separately describe creative judging signals such as orchestration and state across sessions. The mapping between the two is implicit.

**Severity:** Low

**Workaround:** Design the simulation around shared principles: multi-turn continuity, concise voice responses, visual state, autonomous orchestration, and durable context.

**Suggestion:** Publish a one-page simulation judging rubric that maps Alexa+ production principles to observable demo behaviors.

## 3. No public same-contest gallery available during early build

**Task attempted:** Benchmark the concept against other Alexa+ submissions in this exact hackathon.

**Expected:** Early project gallery visibility to help entrants differentiate.

**Actual:** The hackathon project gallery is not yet published.

**Severity:** Low

**Workaround:** Benchmark against the explicit “obvious vs. creative” examples in the official judging rules and monitor the gallery for publication before final submission.

**Suggestion:** Consider publishing opt-in draft project cards or aggregate category counts earlier in the build period so teams can better identify overcrowded idea spaces.

import test from "node:test";
import assert from "node:assert/strict";
import { MemoryStorage, ReadyNestAgent } from "../src/engine.js";

test("creates an actionable plan with a confirmation gate", () => {
  const storage = new MemoryStorage();
  const agent = new ReadyNestAgent(storage);
  const result = agent.handle("Help us get ready for Hurricane Iris");
  assert.equal(result.state.tasks.length, 7);
  assert.equal(result.state.confirmations[0].status, "pending");
  assert.equal(result.state.tasks.find(t => t.id === "supplies").status, "waiting-confirmation");
});

test("persists state across agent instances", () => {
  const storage = new MemoryStorage();
  const first = new ReadyNestAgent(storage);
  first.handle("Help us prepare for the hurricane");
  const second = new ReadyNestAgent(storage);
  assert.equal(second.snapshot().tasks.length, 7);
  assert.match(second.handle("status").message, /remember/i);
});

test("replans when landfall moves up and route becomes congested", () => {
  const storage = new MemoryStorage();
  const agent = new ReadyNestAgent(storage);
  agent.handle("Prepare for hurricane");
  const result = agent.handle("Landfall moved up 18 hours and the route is congested");
  assert.equal(result.state.hazard.etaHours, 30);
  assert.equal(result.state.hazard.primaryRoute, "County 7 West");
  assert.equal(result.state.tasks.find(t => t.id === "pet-kit").priority, "critical");
});

test("confirmation completes only the simulated supply action", () => {
  const storage = new MemoryStorage();
  const agent = new ReadyNestAgent(storage);
  agent.handle("Prepare for storm");
  const result = agent.handle("Confirm the supply cart");
  assert.equal(result.state.confirmations[0].status, "confirmed");
  assert.equal(result.state.tasks.find(t => t.id === "supplies").status, "done");
  assert.ok(result.state.activity.some(a => a.tool === "supply.simulate"));
});

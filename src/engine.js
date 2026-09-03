const STORAGE_KEY = "readynest-state-v1";

export const DEFAULT_PROFILE = {
  home: "Riverside household",
  people: ["Alex", "Jordan", "Maya"],
  pets: ["Scout (dog)"],
  accessNeeds: ["one refrigerated prescription"],
  vehicles: ["SUV — 62% fuel"],
  contacts: ["Aunt Lena", "Neighbor Sam"]
};

export const DEFAULT_HAZARD = {
  name: "Hurricane Iris",
  phase: "watch",
  etaHours: 48,
  primaryRoute: "SR-18 North",
  routeStatus: "clear",
  shelter: "Northside Community Center",
  shelterPetsAllowed: true
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

export class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, value);
  }
  removeItem(key) {
    this.map.delete(key);
  }
}

export class ReadyNestAgent {
  constructor(storage = globalThis.localStorage ?? new MemoryStorage()) {
    this.storage = storage;
    this.state = this.load();
  }

  freshState() {
    return {
      version: 1,
      sessionCount: 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      profile: deepClone(DEFAULT_PROFILE),
      hazard: deepClone(DEFAULT_HAZARD),
      mode: "idle",
      tasks: [],
      supplies: [],
      activity: [],
      confirmations: [],
      lastSummary: "No readiness plan has been created yet."
    };
  }

  load() {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return this.freshState();
      return JSON.parse(raw);
    } catch {
      return this.freshState();
    }
  }

  save() {
    this.state.updatedAt = nowIso();
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  reset() {
    this.storage.removeItem(STORAGE_KEY);
    this.state = this.freshState();
    this.save();
    return this.snapshot();
  }

  newSession() {
    this.state.sessionCount += 1;
    this.record("memory.resume", `Restored readiness state for session ${this.state.sessionCount}.`, "done");
    this.save();
    return {
      message: this.state.tasks.length
        ? `Welcome back. I kept your plan. ${this.countOpen()} tasks are still open, and ${this.countCritical()} are critical.`
        : "Welcome back. I remember the household profile, but there is no active plan yet.",
      state: this.snapshot()
    };
  }

  snapshot() {
    return deepClone(this.state);
  }

  countOpen() {
    return this.state.tasks.filter(t => t.status !== "done").length;
  }

  countCritical() {
    return this.state.tasks.filter(t => t.status !== "done" && t.priority === "critical").length;
  }

  record(tool, detail, status = "done") {
    this.state.activity.unshift({ id: cryptoRandom(), tool, detail, status, at: nowIso() });
    this.state.activity = this.state.activity.slice(0, 24);
  }

  setTask(id, patch) {
    const task = this.state.tasks.find(t => t.id === id);
    if (task) Object.assign(task, patch);
  }

  handle(command) {
    const text = String(command || "").trim();
    const lower = text.toLowerCase();
    if (!text) return { message: "Tell me the situation or ask for a status update.", state: this.snapshot() };

    if (/reset|start over/.test(lower)) {
      this.reset();
      return { message: "ReadyNest has been reset. The demo household is ready for a new scenario.", state: this.snapshot() };
    }
    if (/new session|resume|where are we|status/.test(lower)) return this.statusResponse();
    if (/confirm.*(cart|suppl|order)|approve.*(cart|suppl|order)/.test(lower)) return this.confirmSupplyPlan();
    if (/moved up|earlier|congest|blocked|route.*change|situation changed|update changed/.test(lower)) return this.replan();
    if (/ready|get us ready|prepare|hurricane|storm|evac/.test(lower)) return this.createPlan();
    if (/done.*fuel|fuel.*done/.test(lower)) return this.completeTask("fuel");
    if (/done.*med|med.*done|cooler.*done/.test(lower)) return this.completeTask("cold-chain");
    if (/done.*pet|crate.*done/.test(lower)) return this.completeTask("pet-kit");

    return this.contextualResponse(text);
  }

  createPlan() {
    this.state.mode = "active";
    this.state.tasks = [
      task("cold-chain", "Prepare medication cold-chain kit", "critical", "Jordan", "within 2 hours"),
      task("fuel", "Fuel SUV above 85%", "critical", "Alex", "within 3 hours"),
      task("route", "Verify primary + backup evacuation routes", "high", "ReadyNest", "now", "done"),
      task("pet-kit", "Stage Scout's crate, food, leash, and records", "high", "Maya + Alex", "today"),
      task("documents", "Stage IDs, insurance, contacts, and chargers", "high", "Jordan", "today"),
      task("supplies", "Review 72-hour supply gaps", "medium", "ReadyNest", "now", "waiting-confirmation"),
      task("checkin", "Schedule household readiness check-in", "medium", "ReadyNest", "tonight", "done")
    ];
    this.state.supplies = [
      supply("Water", "12 gallons", "8 gallons", "4 gallons"),
      supply("Shelf-stable meals", "18 servings", "12 servings", "6 servings"),
      supply("Ice packs", "4", "2", "2"),
      supply("Dog food", "4 days", "3 days", "1 day")
    ];
    this.state.confirmations = [
      { id: "supply-plan", title: "Approve simulated supply plan", detail: "4 gallons water, 6 meals, 2 ice packs, 1 day dog food", status: "pending" }
    ];
    this.record("profile.read", "Loaded 3 people, 1 dog, 1 refrigerated prescription, 1 vehicle.");
    this.record("inventory.audit", "Found four readiness gaps; no external purchase was made.");
    this.record("route.rank", "Primary route SR-18 North is clear; backup is County 7 West.");
    this.record("family.assign", "Assigned time-sensitive tasks to Alex, Jordan, and Maya.");
    this.record("calendar.schedule", "Scheduled a household readiness check-in for 7:30 PM.");
    this.record("confirmation.gate", "Held supply action for explicit user confirmation.", "waiting");
    this.state.lastSummary = "Plan created with 7 tasks. Two critical tasks need household action; one supply action is waiting for confirmation.";
    this.save();
    return {
      message: "I built a 48-hour readiness plan and handled the reversible steps. Two critical items need you: protect the refrigerated prescription and fuel the SUV. I also found four supply gaps, but I will not simulate an order until you confirm it.",
      state: this.snapshot()
    };
  }

  replan() {
    if (!this.state.tasks.length) this.createPlan();
    this.state.hazard.phase = "warning";
    this.state.hazard.etaHours = 30;
    this.state.hazard.routeStatus = "congested";
    this.state.hazard.primaryRoute = "County 7 West";
    this.setTask("cold-chain", { priority: "critical", due: "within 45 minutes" });
    this.setTask("fuel", { priority: "critical", due: "within 60 minutes" });
    this.setTask("pet-kit", { priority: "critical", due: "within 90 minutes" });
    this.setTask("documents", { priority: "critical", due: "within 90 minutes" });
    this.setTask("route", { title: "Switch plan to County 7 West backup route", priority: "critical", status: "done", due: "now" });
    this.record("hazard.update", "Landfall moved 18 hours earlier; primary route congestion increased.");
    this.record("planner.reprioritize", "Promoted four tasks to critical and shortened deadlines.");
    this.record("route.switch", "Changed recommended route from SR-18 North to County 7 West.");
    this.record("family.relay", "Prepared updated household assignments and departure checkpoint.");
    this.state.lastSummary = "Situation changed: ETA is now 30 hours. ReadyNest switched routes and promoted four tasks to critical.";
    this.save();
    return {
      message: "I replanned. Landfall is now 30 hours away and SR-18 North is congested, so County 7 West is now the primary route. I promoted the medication kit, fuel, pet kit, and documents to critical and moved their deadlines forward.",
      state: this.snapshot()
    };
  }

  confirmSupplyPlan() {
    if (!this.state.tasks.length) this.createPlan();
    const confirmation = this.state.confirmations.find(c => c.id === "supply-plan");
    if (confirmation) confirmation.status = "confirmed";
    this.setTask("supplies", { status: "done", title: "Stage identified 72-hour supply gaps" });
    this.record("supply.simulate", "Simulated staging the approved supply list. No real purchase or payment occurred.");
    this.state.lastSummary = "Supply plan confirmed and staged in simulation; no real purchase was made.";
    this.save();
    return {
      message: "Confirmed. I staged the four supply gaps in the simulation and marked that step complete. No real purchase or payment was made.",
      state: this.snapshot()
    };
  }

  completeTask(id) {
    if (!this.state.tasks.length) this.createPlan();
    const taskItem = this.state.tasks.find(t => t.id === id);
    if (!taskItem) return this.contextualResponse("status");
    taskItem.status = "done";
    this.record("task.complete", `${taskItem.title} marked complete by household.`);
    this.state.lastSummary = `${taskItem.title} is complete. ${this.countOpen()} tasks remain.`;
    this.save();
    return { message: `Done. I marked “${taskItem.title}” complete. ${this.countOpen()} tasks remain.`, state: this.snapshot() };
  }

  statusResponse() {
    this.record("memory.read", "Read persistent plan state and generated a new-session summary.");
    this.save();
    return {
      message: this.state.tasks.length
        ? `I remember the plan. ${this.countOpen()} tasks are open; ${this.countCritical()} are critical. ${this.state.lastSummary}`
        : "I remember the household profile. There is no active readiness plan yet.",
      state: this.snapshot()
    };
  }

  contextualResponse(text) {
    this.record("context.answer", `Handled follow-up using stored household and plan context: ${text.slice(0, 70)}`);
    this.save();
    return {
      message: this.state.tasks.length
        ? `I’ll keep that in context. Right now the plan has ${this.countOpen()} open tasks. You can ask for status, report a situation change, or confirm the supply plan.`
        : "I can build a persistent household readiness plan, keep it across sessions, and replan when conditions change. Try: “Help us get ready for Hurricane Iris.”",
      state: this.snapshot()
    };
  }
}

function task(id, title, priority, owner, due, status = "open") {
  return { id, title, priority, owner, due, status };
}

function supply(name, target, have, gap) {
  return { name, target, have, gap };
}

function cryptoRandom() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

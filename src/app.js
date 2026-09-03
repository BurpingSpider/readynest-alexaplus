import { ReadyNestAgent } from "./engine.js";

const agent = new ReadyNestAgent();
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const conversation = $("#conversation");
const input = $("#commandInput");
const send = $("#sendButton");
const sessionBadge = $("#sessionBadge");
const taskList = $("#taskList");
const activityList = $("#activityList");
const supplyList = $("#supplyList");
const hazardCard = $("#hazardCard");
const memoryCard = $("#memoryCard");
const confirmationPanel = $("#confirmationPanel");

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"
  })[ch]);
}

function addBubble(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `bubble ${role}`;
  wrap.innerHTML = `<div class="bubble-label">${role === "user" ? "You" : "ReadyNest"}</div><div>${escapeHtml(text)}</div>`;
  conversation.appendChild(wrap);
  conversation.scrollTop = conversation.scrollHeight;
}

function render(state) {
  sessionBadge.textContent = `Session ${state.sessionCount} · persistent memory on`;

  hazardCard.innerHTML = `
    <div class="eyebrow">Active scenario</div>
    <div class="hazard-title">${escapeHtml(state.hazard.name)}</div>
    <div class="metric-row">
      <span><strong>${state.hazard.etaHours}h</strong><small>ETA</small></span>
      <span><strong>${escapeHtml(state.hazard.phase)}</strong><small>phase</small></span>
      <span><strong>${escapeHtml(state.hazard.routeStatus)}</strong><small>route</small></span>
    </div>
    <div class="route-line"><span>Primary route</span><strong>${escapeHtml(state.hazard.primaryRoute)}</strong></div>
  `;

  memoryCard.innerHTML = `
    <div class="eyebrow">Remembered household</div>
    <div class="memory-grid">
      <div><strong>${state.profile.people.length}</strong><span>people</span></div>
      <div><strong>${state.profile.pets.length}</strong><span>pet</span></div>
      <div><strong>${state.profile.vehicles.length}</strong><span>vehicle</span></div>
      <div><strong>${state.profile.accessNeeds.length}</strong><span>special need</span></div>
    </div>
    <p>${escapeHtml(state.profile.accessNeeds[0])}</p>
  `;

  const priorityRank = { critical: 0, high: 1, medium: 2 };
  taskList.innerHTML = state.tasks.length ? [...state.tasks]
    .sort((a,b) => (a.status === "done") - (b.status === "done") || priorityRank[a.priority] - priorityRank[b.priority])
    .map(t => `
      <article class="task ${t.status === "done" ? "complete" : ""}">
        <div class="priority ${t.priority}">${escapeHtml(t.priority)}</div>
        <div class="task-main">
          <strong>${escapeHtml(t.title)}</strong>
          <span>${escapeHtml(t.owner)} · ${escapeHtml(t.due)}</span>
        </div>
        <div class="status-pill ${escapeHtml(t.status)}">${escapeHtml(t.status.replace("-", " "))}</div>
      </article>`).join("")
    : `<div class="empty">No active tasks yet.</div>`;

  supplyList.innerHTML = state.supplies.length ? state.supplies.map(s => `
    <div class="supply-row">
      <div><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.have)} on hand</span></div>
      <span class="gap">gap: ${escapeHtml(s.gap)}</span>
    </div>`).join("") : `<div class="empty">Inventory audit will appear here.</div>`;

  activityList.innerHTML = state.activity.length ? state.activity.slice(0, 8).map(a => `
    <div class="activity-item">
      <span class="activity-dot ${escapeHtml(a.status)}"></span>
      <div><strong>${escapeHtml(a.tool)}</strong><p>${escapeHtml(a.detail)}</p></div>
    </div>`).join("") : `<div class="empty">Agent actions will appear here.</div>`;

  const pending = state.confirmations.filter(c => c.status === "pending");
  confirmationPanel.innerHTML = pending.length ? pending.map(c => `
    <div class="confirmation-card">
      <div>
        <span class="eyebrow">Human confirmation required</span>
        <strong>${escapeHtml(c.title)}</strong>
        <p>${escapeHtml(c.detail)}</p>
      </div>
      <button class="confirm" data-confirm="${escapeHtml(c.id)}">Confirm in simulation</button>
    </div>`).join("") : "";

  $$('[data-confirm]').forEach(btn => btn.addEventListener('click', () => runCommand('Confirm the supply cart')));
}

function runCommand(command) {
  const clean = String(command || "").trim();
  if (!clean) return;
  addBubble("user", clean);
  input.value = "";
  send.disabled = true;
  setTimeout(() => {
    const result = agent.handle(clean);
    addBubble("assistant", result.message);
    render(result.state);
    send.disabled = false;
  }, 240);
}

send.addEventListener("click", () => runCommand(input.value));
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    runCommand(input.value);
  }
});

$$('[data-command]').forEach(btn => btn.addEventListener('click', () => runCommand(btn.dataset.command)));

$("#newSession").addEventListener("click", () => {
  conversation.innerHTML = "";
  const result = agent.newSession();
  addBubble("assistant", result.message);
  render(result.state);
});

$("#resetDemo").addEventListener("click", () => {
  conversation.innerHTML = "";
  const state = agent.reset();
  addBubble("assistant", "Demo reset. I still have the household profile, but no active readiness plan.");
  render(state);
});

render(agent.snapshot());
addBubble("assistant", agent.snapshot().tasks.length
  ? "I restored your readiness plan from the previous session. Ask me for status or tell me what changed."
  : "I’m ReadyNest. Give me one situation, and I’ll turn it into a persistent household readiness plan—not just an answer.");

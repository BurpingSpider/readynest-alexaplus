import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const duration = Number(process.env.DEMO_DURATION || 135);
const outputDir = path.resolve("build/recording");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: outputDir, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:8080", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });

const started = Date.now();
const waitUntil = async seconds => {
  const remaining = seconds * 1000 - (Date.now() - started);
  if (remaining > 0) await page.waitForTimeout(remaining);
};
const moveTo = async locator => {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 });
};

await waitUntil(duration * 0.11);
const buildButton = page.locator('button[data-command^="Help us"]');
await moveTo(buildButton);
await buildButton.click();

await waitUntil(duration * 0.27);
await moveTo(page.locator("#taskList"));

await waitUntil(duration * 0.34);
await moveTo(page.locator("#activityList"));

await waitUntil(duration * 0.42);
const changeButton = page.locator('button[data-command^="Situation changed"]');
await moveTo(changeButton);
await changeButton.click();

await waitUntil(duration * 0.54);
await moveTo(page.locator("#hazardCard"));

await waitUntil(duration * 0.61);
await moveTo(page.locator("#taskList"));

await waitUntil(duration * 0.70);
const newSession = page.locator("#newSession");
await moveTo(newSession);
await newSession.click();

await waitUntil(duration * 0.77);
const resumeButton = page.locator('button[data-command^="Where are we"]');
await moveTo(resumeButton);
await resumeButton.click();

await waitUntil(duration * 0.84);
const confirmation = page.locator("[data-confirm]");
if (await confirmation.count()) {
  await moveTo(confirmation);
  await confirmation.click();
}

await waitUntil(duration * 0.91);
await moveTo(page.locator("#activityList"));

await waitUntil(duration * 0.96);
await moveTo(page.locator(".topbar"));

await waitUntil(duration);
await context.close();
await browser.close();

const candidates = fs.readdirSync(outputDir).filter(name => name.endsWith(".webm"));
if (candidates.length !== 1) throw new Error(`Expected one recording, found ${candidates.length}`);
fs.renameSync(path.join(outputDir, candidates[0]), path.resolve("build/readynest-screen.webm"));

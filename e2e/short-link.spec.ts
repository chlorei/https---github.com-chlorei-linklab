import { expect, test } from "@playwright/test";

test("an anonymous visitor shortens a link, it redirects, and the click is counted", async ({ page, request }) => {
  await page.goto("/");
  await page.getByLabel("Long URL").fill("example.com/e2e-target");
  await page.getByRole("button", { name: "Shorten", exact: true }).click();

  const shortLink = page.locator("a", { hasText: /\/[a-z0-9]{7}$/ }).first();
  await expect(shortLink).toBeVisible();
  const shortId = (await shortLink.textContent())!.trim().split("/").pop()!;

  // the link shows up in "Your links on this device" for this browser only
  const ownLinks = page.getByRole("region", { name: "Your links on this device" });
  await expect(ownLinks.getByText("example.com/e2e-target", { exact: true })).toBeVisible();

  const res = await request.get(`/${shortId}`, { maxRedirects: 0, headers: { "user-agent": "Mozilla/5.0 (e2e)" } });
  expect(res.status()).toBe(302);
  expect(res.headers()["location"]).toBe("https://example.com/e2e-target");
  expect(res.headers()["cache-control"]).toContain("no-store");

  // the visit is recorded after the response (next/server `after`), so poll for it
  await expect(async () => {
    await page.reload();
    await expect(ownLinks.getByText("1 click", { exact: false })).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
});

test("link-preview bots are redirected but not counted", async ({ page, request }) => {
  await page.goto("/");
  await page.getByLabel("Long URL").fill("example.com/bot-check");
  await page.getByRole("button", { name: "Shorten", exact: true }).click();
  const shortId = (await page.locator("a", { hasText: /\/[a-z0-9]{7}$/ }).first().textContent())!.trim().split("/").pop()!;

  const res = await request.get(`/${shortId}`, { maxRedirects: 0, headers: { "user-agent": "TelegramBot (like TwitterBot)" } });
  expect(res.status()).toBe(302);

  await page.waitForTimeout(1500);
  await page.reload();
  const row = page.getByRole("region", { name: "Your links on this device" }).getByRole("listitem").filter({ hasText: "example.com/bot-check" });
  await expect(row).toContainText("0 clicks");
});

test("unknown short ids return 404", async ({ request }) => {
  const res = await request.get("/zzzzzzz", { maxRedirects: 0 });
  expect(res.status()).toBe(404);
});

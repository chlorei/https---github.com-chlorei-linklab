import { expect, test } from "@playwright/test";

// Regression: React events bubble through portals, so a click on the modal backdrop used
// to reach the project card that rendered it and immediately reopen the modal.
test("project modal closes via backdrop, Escape and the close button", async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: "agreementAccepted", value: "true", url: baseURL! }]);
  const email = `modal-${Date.now()}@example.com`;
  const res = await page.request.post("/api/auth/register", {
    data: { firstName: "Grace", lastName: "Hopper", email, password: "correct-horse-battery" },
  });
  expect(res.status()).toBe(201);

  await page.goto("/projects");
  await page.getByRole("button", { name: "New project" }).click();
  const createDialog = page.getByRole("dialog", { name: "New project" });
  await createDialog.getByLabel("Name").fill("Launch");
  await createDialog.getByRole("button", { name: "Create project" }).click();
  await expect(createDialog).toBeHidden();

  const card = page.getByRole("button", { name: "Open project Launch" });
  const dialog = page.getByRole("dialog", { name: "Launch" });

  await card.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5); // backdrop
  await expect(dialog).toBeHidden();

  await card.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await card.click();
  await dialog.getByRole("button", { name: "Close", exact: true }).first().click();
  await expect(dialog).toBeHidden();

  // clicks inside the dialog must not close it
  await card.click();
  await dialog.getByPlaceholder("Project Name").click();
  await expect(dialog).toBeVisible();
});

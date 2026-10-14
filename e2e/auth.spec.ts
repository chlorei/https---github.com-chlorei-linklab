import { expect, test } from "@playwright/test";

test("sign up, reach the dashboard, log out", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  // a protected page sends a new visitor through consent, then sign-in
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/agreement\?next=%2Fdashboard/);
  await page.getByRole("button", { name: "I agree" }).click();
  await expect(page).toHaveURL(/\/signin\?next=%2Fdashboard/);

  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Lovelace");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("correct-horse-battery");
  await page.getByLabel("Repeat password").fill("correct-horse-battery");
  await page.getByRole("button", { name: "Create account" }).click();

  // registration signs the user in right away
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("link", { name: "Account" })).toBeVisible();

  await page.goto("/account");
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "Create account" })).toBeVisible();

  // the old session is gone server-side too
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/signin\?next=%2Fdashboard/);
});

test("rejects a wrong password without revealing whether the email exists", async ({ page }) => {
  await page.goto("/signin");
  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Password", { exact: true }).fill("whatever-123");
  await page.getByRole("button", { name: "Sign in" }).click();
  // Next.js renders its own empty role="alert" route announcer, so match by text
  await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toHaveText("Invalid email or password");
});

test("ignores an open-redirect ?next= after sign-in", async ({ page }) => {
  await page.goto("/signin?next=/%09/evil.example");
  await expect(page.locator('input[name="next"]')).toHaveValue("/dashboard");
});

import { expect, test } from "@playwright/test";

test("sign up, reach the dashboard, log out", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  // a protected page sends a new visitor through consent, then sign-in
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/agreement\?next=%2Fdashboard/);
  await page.getByRole("button", { name: "I Agree" }).click();
  await expect(page).toHaveURL(/\/signin\?next=%2Fdashboard/);

  await page.getByRole("link", { name: "Sign up" }).click();
  await page.getByPlaceholder("First name").fill("Ada");
  await page.getByPlaceholder("Last name").fill("Lovelace");
  await page.getByPlaceholder("Email", { exact: true }).fill(email);
  await page.getByPlaceholder("Repeat Email").fill(email);
  await page.getByPlaceholder("Password", { exact: true }).fill("correct-horse-battery");
  await page.getByPlaceholder("Repeat Password").fill("correct-horse-battery");
  await page.getByRole("button", { name: "Sign up" }).click();

  // registration signs the user in right away
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("menuitem", { name: "Account" })).toBeVisible();

  await page.goto("/account");
  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("menuitem", { name: "Sign Up" })).toBeVisible();

  // the old session is gone server-side too
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/signin\?next=%2Fdashboard/);
});

test("rejects a wrong password without revealing whether the email exists", async ({ page }) => {
  await page.goto("/signin");
  await page.getByPlaceholder("Email").fill("nobody@example.com");
  await page.getByPlaceholder("Password").fill("whatever-123");
  await page.getByRole("button", { name: "Sign in" }).click();
  // Next.js renders its own empty role="alert" route announcer, so match by text
  await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toHaveText("Invalid email or password");
});

test("ignores an open-redirect ?next= after sign-in", async ({ page }) => {
  await page.goto("/signin?next=/%09/evil.example");
  await expect(page.locator('input[name="next"]')).toHaveValue("/dashboard");
});

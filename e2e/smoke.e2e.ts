import { expect, test } from "@playwright/test";

test("create, open and edit a countdown", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New" }).click();
  await page.getByLabel("Message").fill("Ship v2");
  await page.getByLabel("Date").fill("2030-06-01");
  await page.getByLabel("Time").fill("18:30");
  await page.getByLabel("Progress bar").click();
  await page.getByRole("button", { name: "Generate link" }).click();

  const link = await page.getByLabel("Link").inputValue();
  expect(new URL(link).searchParams.get("z")).toBe("Europe/Rome");

  await page.goto(link);
  await expect(page.getByRole("heading", { name: "Ship v2" })).toBeVisible();
  await expect(page.getByText(/SAT 01 JUN 2030 · 18:30/i)).toBeVisible();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page).toHaveTitle(/^T-\d+y \d+d .* · Ship v2$/);

  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.getByLabel("Message")).toHaveValue("Ship v2");
  await expect(page.getByLabel("Date")).toHaveValue("2030-06-01");
  await expect(page.getByLabel("Time")).toHaveValue("18:30");
  await expect(page.getByLabel("Progress bar")).toBeChecked();
});

test("flash at zero, then count up", async ({ page }) => {
  const target = new Date(Date.now() + 3000).toISOString();
  await page.goto(`/?m=Liftoff&t=${encodeURIComponent(target)}&z=UTC`);
  await expect(page.getByText("T-minus")).toBeVisible();

  await expect(page.getByText("Zero.")).toBeVisible({ timeout: 6000 });
  await page.keyboard.press("Escape");
  await expect(page.getByText("Zero.")).toBeHidden();
  await expect(page.getByText("T-plus")).toBeVisible();
});

test("explain a broken link", async ({ page }) => {
  await page.goto("/not-base64!");
  await expect(
    page.getByText("This link doesn't hold a valid date"),
  ).toBeVisible();
});

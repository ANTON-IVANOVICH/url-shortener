import { test, expect } from "@playwright/test";

test("should show error for invalid short URL", async ({ page }) => {
  await page.goto("/invalid-url");
  await expect(page.locator(".error")).toContainText("URL not found");
});

test("should redirect to original URL", async ({ page }) => {
  const uniqueAlias = `redirect-${Date.now().toString().slice(-6)}`;

  await page.goto("/");
  await page.fill("input#originalUrl", "https://example.com");
  await page.fill("input#alias", uniqueAlias);
  await page.click('button[type="submit"]');

  await expect(page.locator(".info-card")).toBeVisible();

  await page.goto(`/${uniqueAlias}`);
  await expect(page).toHaveURL("https://example.com/");
});

import { test, expect } from "@playwright/test";

test.describe("URL Shortener", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should create short URL and view info", async ({ page }) => {
    const uniqueAlias = `test-${Date.now().toString().slice(-6)}`;

    await page.fill("input#originalUrl", "https://example.com");
    await page.fill("input#alias", uniqueAlias);

    await page.click('button[type="submit"]');
    await page.waitForURL(`**/info/${uniqueAlias}`, { timeout: 30000 });

    await expect(page.locator(".info-card")).toContainText(
      "https://example.com",
      { timeout: 5000 }
    );
    await expect(page.locator(".info-card")).toContainText(uniqueAlias, {
      timeout: 5000,
    });
  });

  test("should show error for duplicate alias", async ({ page }) => {
    const uniqueAlias = `dup-${Date.now().toString().slice(-6)}`;

    await page.fill("input#originalUrl", "https://example.com");
    await page.fill("input#alias", uniqueAlias);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/info/${uniqueAlias}`, { timeout: 30000 });

    await page.goto("/");

    await page.fill("input#originalUrl", "https://anotherexample.com");
    await page.fill("input#alias", uniqueAlias);
    await page.click('button[type="submit"]');

    const errorMessage = page.locator(".error-message");
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText("Alias already exists", {
      timeout: 5000,
    });
  });

  test("should redirect to original URL", async ({ page }) => {
    const uniqueAlias = `redir-${Date.now().toString().slice(-6)}`;

    await page.fill("input#originalUrl", "https://example.com");
    await page.fill("input#alias", uniqueAlias);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/info/${uniqueAlias}`, { timeout: 30000 });

    await page.goto(`/${uniqueAlias}`);

    await expect(page).toHaveURL("https://example.com/", { timeout: 10000 });
  });

  test("should delete URL", async ({ page }) => {
    const uniqueAlias = `del-${Date.now().toString().slice(-6)}`;

    await page.fill("input#originalUrl", "https://example.com");
    await page.fill("input#alias", uniqueAlias);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/info/${uniqueAlias}`, { timeout: 30000 });

    page.once("dialog", (dialog) => dialog.accept());

    await page.click("button.delete-btn");

    await page.waitForURL("/", { timeout: 10000 });

    await page.goto(`/info/${uniqueAlias}`);
    await expect(page.locator(".url-info")).toContainText("URL not found", {
      timeout: 5000,
    });
  });

  test("should show analytics data", async ({ page }) => {
    const uniqueAlias = `analytics-${Date.now().toString().slice(-6)}`;

    await page.fill("input#originalUrl", "https://example.com");
    await page.fill("input#alias", uniqueAlias);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**/info/${uniqueAlias}`, { timeout: 30000 });

    for (let i = 0; i < 2; i++) {
      await page.goto(`/${uniqueAlias}`);
      await page.waitForURL("https://example.com/", { timeout: 10000 });
      await page.goto(`/info/${uniqueAlias}`);
      await page.waitForLoadState("networkidle", { timeout: 10000 });
    }

    await expect(page.locator(".analytics")).toContainText("Total clicks: 2", {
      timeout: 5000,
    });
    await expect(page.locator(".analytics")).toContainText("Last 5 clicks:", {
      timeout: 5000,
    });
  });
});

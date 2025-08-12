import { test, expect } from "@playwright/test";

test.describe("URL Shortener Flow", () => {
  test("создание, переход и статистика", async ({ page }) => {
    await page.goto("/");

    await page.fill(
      'input[placeholder="Оригинальный URL"]',
      "https://example.com"
    );
    await page.click('button:has-text("Создать")');

    const shortLink = await page.waitForSelector('a[href^="/"]');
    const href = await shortLink.getAttribute("href");
    expect(href).toMatch(/^\/[A-Za-z0-9]{6,20}$/);

    const [newPage] = await Promise.all([
      page.context().waitForEvent("page"),
      page.click('a[href^="/"]'),
    ]);
    await newPage.waitForLoadState();
    expect(newPage.url()).toBe("https://example.com/");

    await page.goto(`/analytics/${href?.slice(1)}`);
    await expect(page.locator("text=Total Clicks")).toHaveText(
      /Total Clicks: 1/
    );
    await expect(page.locator("table")).toBeVisible();
  });
});

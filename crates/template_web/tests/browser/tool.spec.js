import { expect, test } from "@playwright/test";

test("returns stable JavaScript objects from the real WASM boundary", async ({ page }) => {
  await page.goto("/web/");

  const result = await page.evaluate(async () => {
    const wasm = await import("/pkg/template_web.js");
    await wasm.default();

    return {
      success: wasm.run("Tinkora"),
      error: wasm.run(" ")
    };
  });

  expect(result).toEqual({
    success: {
      ok: true,
      data: {
        schemaVersion: 1,
        output: "Hello, Tinkora!"
      }
    },
    error: {
      ok: false,
      error: {
        code: "EMPTY_INPUT",
        message: "Name must not be empty."
      }
    }
  });
});

test("runs Tinkora through the tool", async ({ page }) => {
  await page.goto("/web/");

  await expect(page.getByRole("button", { name: "Run" })).toBeEnabled();
  await page.getByLabel("Input").fill("Tinkora");
  await page.getByRole("button", { name: "Run" }).click();

  await expect(page.getByTestId("output")).toHaveText("Hello, Tinkora!");
  await expect(page.getByTestId("schema-version")).toHaveText("Schema v1");
});

test("shows the stable code for empty input", async ({ page }) => {
  await page.goto("/web/");

  await expect(page.getByRole("button", { name: "Run" })).toBeEnabled();
  await page.getByLabel("Input").fill("");
  await page.getByRole("button", { name: "Run" }).click();

  await expect(page.getByTestId("error-code")).toHaveText("EMPTY_INPUT");
  await expect(page.getByTestId("error-message")).toHaveText("Name must not be empty.");
});

test("supports keyboard execution with accessible control names", async ({ page }) => {
  await page.goto("/web/");

  const input = page.getByRole("textbox", { name: "Input" });
  const runButton = page.getByRole("button", { name: "Run" });
  await expect(runButton).toBeEnabled();

  await input.focus();
  await input.fill("Keyboard");
  await page.keyboard.press("Tab");
  await expect(runButton).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByTestId("output")).toHaveText("Hello, Keyboard!");
  await expect(page.locator("#result-region")).toHaveAttribute("aria-live", "polite");
});

test("keeps the tool visible without page-level horizontal overflow", async ({ page }) => {
  await page.goto("/web/");

  await expect(page.getByRole("heading", { name: "Tinkora" })).toBeVisible();
  await expect(page.getByLabel("Input")).toBeVisible();
  await expect(page.getByRole("button", { name: "Run" })).toBeVisible();
  await expect(page.getByTestId("output-panel")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("loads without browser console problems", async ({ page }) => {
  const problems = [];
  const faviconResponses = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  page.on("response", (response) => {
    if (new URL(response.url()).pathname.endsWith("/favicon.svg")) {
      faviconResponses.push(response.status());
    }
  });

  await page.goto("/web/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Ready", { exact: true })).toBeVisible();
  await expect(page.locator('link[rel~="icon"]')).toHaveAttribute("href", "./favicon.svg");
  const faviconStatus = await page.evaluate(async () => {
    const favicon = document.querySelector('link[rel~="icon"]');
    const response = await fetch(favicon.href, { cache: "no-store" });
    return response.status;
  });

  expect(faviconStatus).toBe(200);
  expect(faviconResponses).toContain(200);
  expect(problems).toEqual([]);
});

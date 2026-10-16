import { expect, test, type Page } from "@playwright/test";

const PAGES = ["/", "/work", "/hire", "/contact", "/library"];
const CASES = [
  { slug: "dyan-setu", title: "DnyanSetu", live: "https://www.dnyansetu.online", next: "raktsetu" },
  { slug: "raktsetu", title: "RaktSetu", live: "https://www.dnyansetu.online/raktsetu", next: "csm-news-desk" },
  { slug: "csm-news-desk", title: "CSM News Desk", live: "https://csmnewsdesk.com", next: "dyan-setu" },
];

/** Collects crashes and console errors from our own code (third-party
 *  embeds and the visit counter can fail offline without it being our bug). */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/abacus|spotify|Failed to load resource|favicon/i.test(t)) return;
    errors.push(t);
  });
  return errors;
}

async function noSidewaysScroll(page: Page) {
  const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(wide, "page scrolls sideways").toBe(false);
}

test.describe("every page", () => {
  for (const path of [...PAGES, ...CASES.map((c) => `/work/${c.slug}`)]) {
    test(`${path} loads cleanly`, async ({ page }) => {
      const errors = watchErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(/Omrushikesh Raiwade/);
      await page.waitForTimeout(800);
      await noSidewaysScroll(page);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("navigation", () => {
  test("the nav bar opens each page", async ({ page }) => {
    await page.goto("/work");
    for (const [label, path] of [
      ["SERVICES", "/hire"],
      ["CONTACT", "/contact"],
      ["WORK", "/work"],
    ]) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
  });

  test("the footer links to every page", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("navigation", { name: "Pages" });
    for (const name of ["Work", "Services", "Contact", "Library", "Episode notes"]) {
      await expect(footer.getByRole("link", { name })).toBeVisible();
    }
  });

  test("home is just the cover and About", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#about")).toHaveCount(1);
    await expect(page.locator("#services, #work, #contact")).toHaveCount(0);
  });
});

test.describe("case studies", () => {
  for (const c of CASES) {
    test(`${c.title}: sections, live link, prev/next`, async ({ page }) => {
      await page.goto(`/work/${c.slug}`);
      await expect(page.getByRole("heading", { level: 1, name: c.title })).toBeVisible();
      for (const section of ["The problem", "The solution", "Tech used"]) {
        await expect(page.getByRole("heading", { name: new RegExp(section, "i") })).toBeVisible();
      }
      await expect(page.getByRole("link", { name: /visit live site/i }).first()).toHaveAttribute("href", c.live);

      const more = page.getByRole("navigation", { name: "More projects" });
      await more.getByRole("link", { name: /next/i }).click();
      await expect(page).toHaveURL(/\/work\/[a-z-]+$/);
      await expect(page).not.toHaveURL(new RegExp(`/work/${c.slug}$`));
    });
  }

  test("unknown project shows not found", async ({ page }) => {
    const res = await page.goto("/work/not-a-project");
    expect(res?.status()).toBe(404);
  });
});

test.describe("project previews", () => {
  test("cards show a screenshot preview", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByRole("img", { name: /Preview of DnyanSetu/ }).first()).toBeVisible();
  });

  test("hovering a card plays its clip", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "phones have no hover");
    await page.goto("/work");
    const preview = page.getByRole("img", { name: /Preview of DnyanSetu/ }).first();
    await preview.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // let the card finish sliding in
    await preview.hover({ force: true });
    await expect
      .poll(() => page.evaluate(() => [...document.querySelectorAll("video")].some((v) => !v.paused)))
      .toBe(true);
  });

  test("reduced motion keeps clips still", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/work");
    const preview = page.getByRole("img", { name: /Preview of DnyanSetu/ }).first();
    await preview.scrollIntoViewIfNeeded();
    await preview.hover({ force: true });
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => [...document.querySelectorAll("video")].some((v) => !v.paused))).toBe(false);
    await ctx.close();
  });
});

test.describe("hire me", () => {
  test("badge, services with proof, and process", async ({ page }) => {
    await page.goto("/hire");
    await expect(page.getByText("Open for projects").first()).toBeVisible();
    for (const s of ["Business websites", "Library & archive sites", "Web apps", "Student platforms"]) {
      await expect(page.getByRole("heading", { name: s })).toBeVisible();
    }
    await page.getByRole("link", { name: /RaktSetu/ }).first().click();
    await expect(page).toHaveURL(/\/work\/raktsetu$/);
  });
});

test.describe("contact form", () => {
  async function fill(page: Page) {
    await page.getByLabel("Name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Project type").selectOption("Web app");
    await page.getByLabel("Message").fill("I need a website for my college library.");
  }

  test("shows success when the message is sent", async ({ page }) => {
    await page.route("**/api/contact", (r) => r.fulfill({ json: { ok: true } }));
    await page.goto("/hire");
    await fill(page);
    await page.getByRole("button", { name: /Send message/ }).click();
    await expect(page.getByText("Message sent")).toBeVisible();
  });

  test("shows the server's error when sending fails", async ({ page }) => {
    await page.route("**/api/contact", (r) =>
      r.fulfill({ status: 502, json: { ok: false, error: "Sending failed. Please email me." } })
    );
    await page.goto("/contact");
    await fill(page);
    await page.getByRole("button", { name: /Send message/ }).click();
    await expect(page.getByText("Sending failed. Please email me.")).toBeVisible();
  });

  test("the API rejects bad input and ignores bots", async ({ request }, info) => {
    const startedAt = Date.now() - 10_000;
    const base = { name: "Om", email: "a@b.co", type: "Web app", message: "hello there friend", startedAt };
    const headers = { "x-forwarded-for": `10.0.0.${info.project.name === "desktop" ? 1 : 2}` };

    const badEmail = await request.post("/api/contact", { data: { ...base, email: "nope" }, headers });
    expect(badEmail.status()).toBe(400);

    const badType = await request.post("/api/contact", { data: { ...base, type: "Hacking" }, headers });
    expect(badType.status()).toBe(400);

    const bot = await request.post("/api/contact", { data: { ...base, website: "spam.io" }, headers });
    expect(await bot.json()).toEqual({ ok: true });
  });
});

test.describe("episode notes", () => {
  test("lists every episode; missing PDFs show Coming soon", async ({ page }) => {
    await page.goto("/notes");
    await expect(page).toHaveTitle("Episode Notes | oruim.tech");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Full Stack, explained simply/i);
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(15);
    // Every card is either a real download link or a disabled "Coming soon".
    const ready = await page.getByRole("link", { name: /Download PDF notes/ }).count();
    const soon = await page.getByText("Coming soon", { exact: true }).count();
    expect(ready + soon).toBe(15);
    await expect(page.locator('a[href="https://instagram.com/oruim.tech"]')).toBeVisible();
  });
});

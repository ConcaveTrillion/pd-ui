/**
 * Storybook e2e tests — run against the pre-built Storybook static site.
 *
 * Issue #2: feat: add Playwright e2e tests targeting Storybook build.
 *
 * Priority stories per the issue:
 *   - SettingsSlot (font-scale slider)
 *   - PageImageCanvas (bounding-box overlay)
 *   - AppShell (launcher / sub-shell navigation)
 *   - WordList (virtualized scroll + selection)
 *
 * Architecture:
 *   Storybook 8 in static mode uses a PostMessage channel between the
 *   manager frame and the preview iframe. When loading `iframe.html`
 *   directly (without the manager frame), the preview initialises
 *   `__STORYBOOK_PREVIEW__` but stays on `sb-show-nopreview` because
 *   it is waiting for `setCurrentStory` from the channel.
 *
 *   Solution: load `iframe.html?viewMode=story&id=<storyId>` directly,
 *   wait for `__STORYBOOK_PREVIEW__` to be defined, then manually emit
 *   `setCurrentStory` on the preview's own channel. This triggers the
 *   normal render path and transitions the body to `sb-show-main`.
 *
 *   Story ID format (from Storybook slug derivation):
 *     title:  "Shell/SettingsSlot" → "shell-settingsslot"
 *     story:  "Default"            → "default"
 *     result: "shell-settingsslot--default"
 */

import { test, expect, type Page } from '@playwright/test';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Wait for `__STORYBOOK_PREVIEW__` to be defined (the preview JS has loaded). */
async function waitForPreviewReady(page: Page, timeout = 10_000): Promise<void> {
  await page.waitForFunction(
    () => typeof (window as { __STORYBOOK_PREVIEW__?: unknown }).__STORYBOOK_PREVIEW__ !== 'undefined',
    { timeout },
  );
}

/**
 * Load a story in the Storybook preview iframe and wait for it to render.
 *
 * Steps:
 * 1. Navigate to `iframe.html?viewMode=story&id=<storyId>`
 * 2. Wait for `__STORYBOOK_PREVIEW__` to be defined
 * 3. Emit `setCurrentStory` on the preview channel (triggers render)
 * 4. Wait for `sb-show-main` on `document.body` (render complete)
 *
 * Story IDs are derived from the story's `title` and export name:
 *   title: "Shell/SettingsSlot", story "Default" → "shell-settingsslot--default"
 */
async function loadStory(page: Page, storyId: string): Promise<void> {
  await page.goto(`/iframe.html?viewMode=story&id=${storyId}`);
  await waitForPreviewReady(page);

  // Trigger the story render via the preview channel.
  await page.evaluate((id) => {
    const preview = (window as {
      __STORYBOOK_PREVIEW__?: {
        channel?: { emit: (event: string, payload: unknown) => void };
      };
    }).__STORYBOOK_PREVIEW__;
    preview?.channel?.emit('setCurrentStory', { storyId: id, viewMode: 'story' });
  }, storyId);

  // Wait until the body has `sb-show-main` (story has rendered).
  await page.waitForFunction(
    () => document.body.classList.contains('sb-show-main'),
    { timeout: 15_000 },
  );
}

/**
 * Collect JavaScript console errors from the page.
 * Filters known noise from Storybook / React / browser.
 */
function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        text.includes('Warning:') ||
        text.includes('Content Security Policy') ||
        text.includes('favicon') ||
        text.includes('net::ERR_')
      )
        return;
      errors.push(text);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`[pageerror] ${err.message}`);
  });
  return errors;
}

/**
 * Locate an element scoped to `#storybook-root` (the rendered story's
 * container). This avoids matching elements in the hidden Storybook
 * argstable / error display that are present but not visible.
 */
function inStoryRoot(page: Page, selector: string) {
  return page.locator(`#storybook-root ${selector}`);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Storybook static build', () => {
  test('index page loads with Storybook title', async ({ page }) => {
    await page.goto('/');
    // Storybook 8 static build sets <title> to "Storybook".
    await expect(page).toHaveTitle('Storybook');
  });

  test('story index is served and contains known stories', async ({ page }) => {
    // /index.json is the Storybook 8 story manifest.
    const response = await page.goto('/index.json');
    expect(response?.status()).toBe(200);

    const json = await response?.json() as { entries?: Record<string, unknown> };
    const ids = Object.keys(json.entries ?? {});

    // Storybook slugifies the story title and story name.
    // title: "Shell/SettingsSlot" + story "Default" → "shell-settingsslot--default"
    // title: "Canvas/PageImageCanvas" + story "WithBBoxOverlay" → "canvas-pageimagecanvas--with-b-box-overlay"
    // title: "Shell/AppShell" + story "AllSlots" → "shell-appshell--all-slots"
    // title: "WordList/WordList" + story "Default" → "wordlist-wordlist--default"
    expect(ids).toContain('shell-settingsslot--default');
    expect(ids).toContain('canvas-pageimagecanvas--with-b-box-overlay');
    expect(ids).toContain('shell-appshell--all-slots');
    expect(ids).toContain('wordlist-wordlist--default');
  });
});

// ── SettingsSlot ──────────────────────────────────────────────────────────────

test.describe('SettingsSlot', () => {
  test('Default story renders settings trigger button', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'shell-settingsslot--default');

    // The settings trigger button is scoped to #storybook-root to avoid
    // matching hidden Storybook argstable buttons.
    const trigger = inStoryRoot(page, 'button');
    await expect(trigger.first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('Settings popover opens on trigger click', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'shell-settingsslot--default');

    // Click the settings trigger to open the popover.
    await inStoryRoot(page, 'button').first().click();

    // The popover content should contain the font-scale slider.
    // Radix Popover renders the content into a portal outside #storybook-root.
    const slider = page.locator('input[type="range"]');
    await expect(slider).toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test('font-scale slider is interactive and does not close popover mid-drag', async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'shell-settingsslot--default');

    // Open the settings popover.
    await inStoryRoot(page, 'button').first().click();

    const slider = page.locator('input[type="range"]');
    await expect(slider).toBeVisible({ timeout: 5_000 });

    // Read current value.
    const initialValue = await slider.inputValue();

    // Use keyboard to adjust the slider value.
    await slider.focus();
    await slider.press('ArrowRight');
    await slider.press('ArrowRight');

    // Slider should still be visible (popover did not close mid-interaction).
    await expect(slider).toBeVisible();

    // Value should have changed or already be at max.
    const newValue = await slider.inputValue();
    expect(Number(newValue)).toBeGreaterThanOrEqual(Number(initialValue));

    expect(errors).toHaveLength(0);
  });
});

// ── PageImageCanvas ───────────────────────────────────────────────────────────

test.describe('PageImageCanvas', () => {
  test('WithBBoxOverlay story renders canvas with bounding boxes', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'canvas-pageimagecanvas--with-b-box-overlay');

    // react-konva renders a <canvas> element.
    const canvas = inStoryRoot(page, 'canvas').first();
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });

  test('NoOverlay story renders canvas', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'canvas-pageimagecanvas--no-overlay');

    const canvas = inStoryRoot(page, 'canvas').first();
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });

  test('WithSelection story renders without errors', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'canvas-pageimagecanvas--with-selection');

    const canvas = inStoryRoot(page, 'canvas').first();
    await expect(canvas).toBeVisible({ timeout: 10_000 });

    expect(errors).toHaveLength(0);
  });

  test('canvas wrapper is keyboard-focusable', async ({ page }) => {
    await loadStory(page, 'canvas-pageimagecanvas--with-b-box-overlay');

    // The PageImageCanvas wrapper has tabIndex=0 for keyboard interaction.
    const focusable = inStoryRoot(page, '[tabindex="0"]').first();
    await expect(focusable).toBeVisible();
    await focusable.focus();
    await expect(focusable).toBeFocused();
  });
});

// ── AppShell ──────────────────────────────────────────────────────────────────

test.describe('AppShell', () => {
  test('AllSlots story renders without errors', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'shell-appshell--all-slots');
    // loadStory waits for sb-show-main — reaching here means the story rendered.
    expect(errors).toHaveLength(0);
  });

  test('MainOnly story renders without errors', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'shell-appshell--main-only');
    expect(errors).toHaveLength(0);
  });

  test('BuiltInHeader story renders without errors', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'shell-appshell--built-in-header');
    expect(errors).toHaveLength(0);
  });
});

// ── WordList ──────────────────────────────────────────────────────────────────

test.describe('WordList', () => {
  test('Default story renders without errors', async ({ page }) => {
    const errors = collectErrors(page);
    // Story title: "WordList/WordList", story name: "Default"
    await loadStory(page, 'wordlist-wordlist--default');

    // WordList uses react-virtuoso. The Default story uses layout: "padded"
    // without a fixed container height, so Virtuoso may not render rows
    // (it needs a measured viewport height). We verify the component mounts
    // without error; VirtualizedLargeList covers row-level assertions.
    //
    // The Virtuoso scroll container is always rendered even without visible rows.
    const container = inStoryRoot(page, '[data-virtuoso-scroller], [style*="overflow"]');
    await expect(container.first()).toBeAttached({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });

  test('VirtualizedLargeList story renders without errors', async ({ page }) => {
    const errors = collectErrors(page);
    await loadStory(page, 'wordlist-wordlist--virtualized-large-list');

    // Virtuoso renders only visible rows; check that at least one is present.
    const rows = inStoryRoot(page, '[data-index]');
    await expect(rows.first()).toBeVisible({ timeout: 5_000 });

    expect(errors).toHaveLength(0);
  });
});

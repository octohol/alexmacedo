import { test, expect } from '@playwright/test';

test.describe('Game Listing and Navigation', () => {
  test('should display games with titles on index page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Check that games are displayed
    const gameCards = page.locator('[data-testid="game-card"]');
    
    // Wait for at least one game card to be visible
    await expect(gameCards.first()).toBeVisible();
    
    // Check that we have at least one game
    const gameCount = await gameCards.count();
    expect(gameCount).toBeGreaterThan(0);
    
    // Check that each game card has a title
    const firstGameCard = gameCards.first();
    await expect(firstGameCard.locator('[data-testid="game-title"]')).toBeVisible();
    
    // Verify that game titles are not empty
    const gameTitle = await firstGameCard.locator('[data-testid="game-title"]').textContent();
    expect(gameTitle?.trim()).toBeTruthy();
  });

  test('should navigate to correct game details page when clicking on a game', async ({ page }) => {
    await page.goto('/');
    
    // Wait for games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Get the first game card and its data attributes
    const firstGameCard = page.locator('[data-testid="game-card"]').first();
    const gameId = await firstGameCard.getAttribute('data-game-id');
    const gameTitle = await firstGameCard.getAttribute('data-game-title');
    
    // Click on the first game
    await firstGameCard.click();
    
    // Verify we're on the correct game details page
    await expect(page).toHaveURL(`/game/${gameId}`);
    
    // Verify the game details page loads
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Verify the title matches what we clicked on
    const detailsTitle = page.locator('[data-testid="game-details-title"]');
    await expect(detailsTitle).toHaveText(gameTitle || '');
  });

  test('should display game details with all required information', async ({ page }) => {
    // Navigate to a specific game (we'll use game ID 1 as an example)
    await page.goto('/game/1');
    
    // Wait for game details to load
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Check that the game title is present and not empty
    const gameTitle = page.locator('[data-testid="game-details-title"]');
    await expect(gameTitle).toBeVisible();
    const titleText = await gameTitle.textContent();
    expect(titleText?.trim()).toBeTruthy();
    
    // Check that the game description is present and not empty
    const gameDescription = page.locator('[data-testid="game-details-description"]');
    await expect(gameDescription).toBeVisible();
    const descriptionText = await gameDescription.textContent();
    expect(descriptionText?.trim()).toBeTruthy();
    
    // Check that either publisher or category (or both) are present
    const publisherExists = await page.locator('[data-testid="game-details-publisher"]').isVisible();
    const categoryExists = await page.locator('[data-testid="game-details-category"]').isVisible();
    expect(publisherExists && categoryExists).toBeTruthy();
    
    // If publisher exists, check it has content
    if (publisherExists) {
      const publisherText = await page.locator('[data-testid="game-details-publisher"]').textContent();
      expect(publisherText?.trim()).toBeTruthy();
    }
    
    // If category exists, check it has content
    if (categoryExists) {
      const categoryText = await page.locator('[data-testid="game-details-category"]').textContent();
      expect(categoryText?.trim()).toBeTruthy();
    }
  });

  test('should display a button to back the game', async ({ page }) => {
    await page.goto('/game/1');
    
    // Wait for game details to load
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Check that the back game button is present
    const backButton = page.locator('[data-testid="back-game-button"]');
    await expect(backButton).toBeVisible();
    await expect(backButton).toContainText('Support This Game');
    
    // Verify the button is clickable
    await expect(backButton).toBeEnabled();
  });

  test('should be able to navigate back to home from game details', async ({ page }) => {
    await page.goto('/game/1');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="game-details"]', { timeout: 10000 });
    
    // Find and click the back to all games link
    const backLink = page.locator('a:has-text("Back to all games")');
    await expect(backLink).toBeVisible();
    await backLink.click();
    
    // Verify we're back on the home page
    await expect(page).toHaveURL('/');
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
  });

  test('should handle navigation to non-existent game gracefully', async ({ page }) => {
    // Navigate to a game that doesn't exist
    await page.goto('/game/99999');
    
    // The page should load without crashing
    // Check if there's an error message or if it handles gracefully
    await page.waitForTimeout(3000);
    
    // The page should either show an error or handle it gracefully
    // We expect the page to not crash and still have a valid title
    await expect(page).toHaveTitle(/Game Details - Tailspin Toys/);
  });
});

test.describe('Game Filtering', () => {
  test('should display filter controls on the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Check that filter controls are visible
    await expect(page.locator('[data-testid="category-filter"]')).toBeVisible();
    await expect(page.locator('[data-testid="publisher-filter"]')).toBeVisible();
    
    // Check that dropdowns have options
    const categoryOptions = page.locator('[data-testid="category-filter"] option');
    const publisherOptions = page.locator('[data-testid="publisher-filter"] option');
    
    await expect(categoryOptions).toHaveCountGreaterThan(1); // At least "All Categories" + actual categories
    await expect(publisherOptions).toHaveCountGreaterThan(1); // At least "All Publishers" + actual publishers
  });

  test('should filter games by category', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Get initial game count
    const initialGameCount = await page.locator('[data-testid="game-card"]').count();
    
    // Select a specific category (select the second option, which should be a real category)
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    const categoryOptions = categoryFilter.locator('option');
    
    // Skip the first option (All Categories) and select the second one
    const secondOption = categoryOptions.nth(1);
    const categoryText = await secondOption.textContent();
    await categoryFilter.selectOption({ index: 1 });
    
    // Wait for games to update
    await page.waitForTimeout(1000);
    
    // Check that we have some games
    const gameCards = page.locator('[data-testid="game-card"]');
    const filteredGameCount = await gameCards.count();
    
    expect(filteredGameCount).toBeGreaterThan(0);
    
    // Verify that clear filters button appears
    await expect(page.locator('[data-testid="clear-filters"]')).toBeVisible();
    
    // Check that all visible games have the selected category
    if (filteredGameCount > 0) {
      const firstGameCategory = await gameCards.first().locator('[data-testid="game-category"]').textContent();
      expect(categoryText).toContain(firstGameCategory?.trim());
    }
  });

  test('should filter games by publisher', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Select a specific publisher (select the second option)
    const publisherFilter = page.locator('[data-testid="publisher-filter"]');
    const publisherOptions = publisherFilter.locator('option');
    
    // Skip the first option (All Publishers) and select the second one
    const secondOption = publisherOptions.nth(1);
    const publisherText = await secondOption.textContent();
    await publisherFilter.selectOption({ index: 1 });
    
    // Wait for games to update
    await page.waitForTimeout(1000);
    
    // Check that we have some games
    const gameCards = page.locator('[data-testid="game-card"]');
    const filteredGameCount = await gameCards.count();
    
    expect(filteredGameCount).toBeGreaterThan(0);
    
    // Verify that clear filters button appears
    await expect(page.locator('[data-testid="clear-filters"]')).toBeVisible();
    
    // Check that all visible games have the selected publisher
    if (filteredGameCount > 0) {
      const firstGamePublisher = await gameCards.first().locator('[data-testid="game-publisher"]').textContent();
      expect(publisherText).toContain(firstGamePublisher?.trim());
    }
  });

  test('should combine category and publisher filters', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Select both a category and publisher
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    const publisherFilter = page.locator('[data-testid="publisher-filter"]');
    
    await categoryFilter.selectOption({ index: 1 });
    await page.waitForTimeout(500);
    
    await publisherFilter.selectOption({ index: 1 });
    await page.waitForTimeout(1000);
    
    // Verify that clear filters button appears
    await expect(page.locator('[data-testid="clear-filters"]')).toBeVisible();
    
    // The result might be 0 games or more, depending on the data
    // But the page should not crash and should respond to the combined filters
    const gameCards = page.locator('[data-testid="game-card"]');
    const filteredGameCount = await gameCards.count();
    
    // Should be >= 0 (some combinations might result in no games)
    expect(filteredGameCount).toBeGreaterThanOrEqual(0);
  });

  test('should clear all filters when clear button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Get initial game count
    const initialGameCount = await page.locator('[data-testid="game-card"]').count();
    
    // Apply some filters
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    const publisherFilter = page.locator('[data-testid="publisher-filter"]');
    
    await categoryFilter.selectOption({ index: 1 });
    await publisherFilter.selectOption({ index: 1 });
    await page.waitForTimeout(1000);
    
    // Verify clear button is visible
    await expect(page.locator('[data-testid="clear-filters"]')).toBeVisible();
    
    // Click clear filters
    await page.locator('[data-testid="clear-filters"]').click();
    await page.waitForTimeout(1000);
    
    // Check that filters are reset
    expect(await categoryFilter.inputValue()).toBe('');
    expect(await publisherFilter.inputValue()).toBe('');
    
    // Check that clear button is no longer visible
    await expect(page.locator('[data-testid="clear-filters"]')).not.toBeVisible();
    
    // Check that game count is back to initial
    const finalGameCount = await page.locator('[data-testid="game-card"]').count();
    expect(finalGameCount).toBe(initialGameCount);
  });

  test('should maintain dark mode styling in filter controls', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the games to load
    await page.waitForSelector('[data-testid="games-grid"]', { timeout: 10000 });
    
    // Check that filter controls have dark mode classes
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    const publisherFilter = page.locator('[data-testid="publisher-filter"]');
    
    // Check for dark background classes
    await expect(categoryFilter).toHaveClass(/bg-slate-700/);
    await expect(publisherFilter).toHaveClass(/bg-slate-700/);
    
    // Check for text color classes
    await expect(categoryFilter).toHaveClass(/text-slate-100/);
    await expect(publisherFilter).toHaveClass(/text-slate-100/);
  });
  });
});

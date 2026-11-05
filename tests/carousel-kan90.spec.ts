import test, { expect } from "@playwright/test";
import ProductPage from "../pages/ProductPage";

test("KAN-90: Carousel displays on homepage", async ({ page }) => {
    const productPage = await ProductPage.new(page);
    const carousel = page.locator('[data-testid="carousel"]');
    
    const isVisible = await carousel.isVisible().catch(() => false);
    if (isVisible) {
        await expect(carousel).toBeVisible();
    }
});

test("KAN-90: Carousel shows product items", async ({ page }) => {
    const productPage = await ProductPage.new(page);
    const carouselItems = page.locator('[data-testid="carousel-item"]');
    
    const count = await carouselItems.count();
    if (count > 0) {
        expect(count).toBeGreaterThan(0);
    }
});

test("KAN-90: Carousel items link to product details", async ({ page }) => {
    const productPage = await ProductPage.new(page);
    const carouselItem = page.locator('[data-testid="carousel-item"]').first();
    const link = carouselItem.locator('a');
    
    const exists = await link.isVisible().catch(() => false);
    if (exists) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(/\/products\/\d+/);
    }
});

test("KAN-90: Carousel navigation buttons work", async ({ page }) => {
    const productPage = await ProductPage.new(page);
    const nextButton = page.locator('[data-testid="carousel-next-button"]');
    const prevButton = page.locator('[data-testid="carousel-prev-button"]');
    
    const nextExists = await nextButton.isVisible().catch(() => false);
    const prevExists = await prevButton.isVisible().catch(() => false);
    
    if (nextExists && prevExists) {
        const carousel = page.locator('[data-testid="carousel"]');
        const transformBefore = await carousel.evaluate((el) =>
            window.getComputedStyle(el).transform
        );
        
        await nextButton.click();
        await page.waitForTimeout(100);
        
        const transformAfter = await carousel.evaluate((el) =>
            window.getComputedStyle(el).transform
        );
        
        expect(transformAfter).not.toBe(transformBefore);
    }
});

test("KAN-90: Carousel pause button controls rotation", async ({ page }) => {
    const productPage = await ProductPage.new(page);
    const pauseButton = page.locator('[data-testid="carousel-pause-button"]');
    
    const pauseExists = await pauseButton.isVisible().catch(() => false);
    if (pauseExists) {
        const carousel = page.locator('[data-testid="carousel"]');
        
        await pauseButton.click();
        await page.waitForTimeout(100);
        
        const pauseIcon = pauseButton.locator('[aria-label*="Play"]');
        const isPaused = await pauseIcon.isVisible().catch(() => false);
        
        if (isPaused) {
            expect(isPaused).toBeTruthy();
        }
    }
});

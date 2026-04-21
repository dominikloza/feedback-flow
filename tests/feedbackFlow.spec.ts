import { test, expect } from '@playwright/test';

test('should create a new feedback', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByLabel('Adres E-mail').fill('test@test.com');
    await page.getByLabel('Hasło').fill('password');
    await page.getByRole('button', { name: 'Zaloguj się' }).and(page.locator('[type="submit"]')).click();
    await page.getByLabel('Tytuł zgłoszenia').fill('Test feedback');
    await page.getByLabel('Opis zgłoszenia').fill('Test feedback description');
    await page.getByRole('button', { name: 'Wyślij zgłoszenie' }).click();
    await expect(page.getByText('Test feedback').first().and(page.locator('[data-slot="card-title"]'))).toBeVisible();
    await expect(page.getByText('Test feedback description').first()).toBeVisible();



}); 

import { test, expect } from '@playwright/test';

test('homepage loads with hero headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Building Sovereign AI/i })).toBeVisible();
});

test('homepage nav has correct links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Research' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
});

test('work page renders all 5 entries', async ({ page }) => {
  await page.goto('/work');
  await expect(page.getByText('EkaCare')).toBeVisible();
  await expect(page.getByText('MusicMuni Labs')).toBeVisible();
  await expect(page.getByText('Sensibol Audio Technologies')).toBeVisible();
  await expect(page.getByText('DAPLab, IIT Bombay')).toBeVisible();
  await expect(page.getByText('ITTIAM Systems')).toBeVisible();
});

test('research page tab switching works', async ({ page }) => {
  await page.goto('/research');
  await expect(page.getByText('Parrotlet-A 2 Pro')).toBeVisible();
  await page.getByRole('tab', { name: 'Music AI' }).click();
  await expect(page.getByText('Parrotlet-A 2 Pro')).not.toBeVisible();
  await expect(page.getByText('Computational Approaches for Melodic Description')).toBeVisible();
});

test('projects page renders project cards', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByText('Ragawise')).toBeVisible();
  await expect(page.getByText('YIN.js')).toBeVisible();
});

test('nav logo links to homepage', async ({ page }) => {
  await page.goto('/work');
  await page.getByRole('link', { name: 'SANKALP GULATI' }).click();
  await expect(page).toHaveURL('/');
});

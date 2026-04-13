import { test, expect } from '@playwright/test';

test('homepage loads with hero headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Building Sovereign AI/i })).toBeVisible();
});

test('nav has correct links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Blogs & Papers' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
});

test('work page renders all entries', async ({ page }) => {
  await page.goto('/work');
  await expect(page.getByText('EkaCare')).toBeVisible();
  await expect(page.getByText('MusicMuni Labs')).toBeVisible();
  await expect(page.getByText('Digital Audio Processing Lab')).toBeVisible();
  await expect(page.getByText('ITTIAM Systems')).toBeVisible();
});

test('projects page shows apps and hacks with filters', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByText('EkaScribe')).toBeVisible();
  await expect(page.getByText('Ragawise')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'CompMusic' })).toBeVisible();
  await page.getByRole('button', { name: 'Music AI' }).click();
  await expect(page.getByText('EkaScribe')).not.toBeVisible();
  await expect(page.getByText('Ragawise')).toBeVisible();
});

test('papers page shows blogs and papers with filters', async ({ page }) => {
  await page.goto('/papers');
  await expect(page.getByText('Parrotlet-A 2 Pro')).toBeVisible();
  await expect(page.getByRole('link', { name: /Computational Approaches for Melodic Description/i })).toBeVisible();
  await expect(page.getByText('Classifying Glassdoor Reviews')).toBeVisible();
  await page.getByRole('button', { name: 'Music AI' }).click();
  await expect(page.getByText('Parrotlet-A 2 Pro')).not.toBeVisible();
});

test('about page shows bio, education, reviewer roles', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: 'Sankalp Gulati' })).toBeVisible();
  await expect(page.getByText('IIT Kanpur')).toBeVisible();
  await expect(page.getByText('International Society for Music Information Retrieval (ISMIR)')).toBeVisible();
});

test('nav logo links to homepage', async ({ page }) => {
  await page.goto('/work');
  await page.getByRole('link', { name: 'SANKALP GULATI' }).click();
  await expect(page).toHaveURL('/');
});

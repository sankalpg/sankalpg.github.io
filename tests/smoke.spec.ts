import { test, expect } from '@playwright/test';

test('homepage loads with hero headline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Building Sovereign AI/i })).toBeVisible();
});

test('homepage nav has domain links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Work' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Healthcare AI' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Music AI' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Alternate Data' })).toBeVisible();
});

test('work page renders all entries', async ({ page }) => {
  await page.goto('/work');
  await expect(page.getByText('EkaCare')).toBeVisible();
  await expect(page.getByText('MusicMuni Labs')).toBeVisible();
  await expect(page.getByText('Sensibol Audio Technologies')).toBeVisible();
  await expect(page.getByText('Digital Audio Processing Lab')).toBeVisible();
  await expect(page.getByText('ITTIAM Systems')).toBeVisible();
});

test('healthcare page shows apps and research', async ({ page }) => {
  await page.goto('/healthcare');
  await expect(page.getByRole('heading', { name: 'Healthcare AI' })).toBeVisible();
  await expect(page.getByText('EkaScribe')).toBeVisible();
  await expect(page.getByText('DocAssist')).toBeVisible();
  await expect(page.getByText('Parrotlet-A 2 Pro')).toBeVisible();
});

test('healthcare tag filter works', async ({ page }) => {
  await page.goto('/healthcare');
  await page.getByRole('button', { name: 'ASR' }).click();
  await expect(page.getByText('Parrotlet-A 2 Pro')).toBeVisible();
  await expect(page.getByText('Leveraging Semantic Technologies')).not.toBeVisible();
});

test('music-ai page shows projects and papers', async ({ page }) => {
  await page.goto('/music-ai');
  await expect(page.getByRole('heading', { name: 'Music AI' })).toBeVisible();
  await expect(page.getByText('Ragawise')).toBeVisible();
  await expect(page.getByText('Hindify')).toBeVisible();
  await expect(page.getByRole('link', { name: /Computational Approaches for Melodic Description/i })).toBeVisible();
});

test('alternate-data page shows articles', async ({ page }) => {
  await page.goto('/alternate-data');
  await expect(page.getByRole('heading', { name: 'Alternate Data' })).toBeVisible();
  await expect(page.getByText('Classifying Glassdoor Reviews')).toBeVisible();
  await expect(page.getByText('Tracking US Electricity Demand')).toBeVisible();
});

test('nav logo links to homepage', async ({ page }) => {
  await page.goto('/work');
  await page.getByRole('link', { name: 'SANKALP GULATI' }).click();
  await expect(page).toHaveURL('/');
});

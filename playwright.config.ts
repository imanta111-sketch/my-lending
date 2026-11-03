import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  reporter: 'line',
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: { command: 'npx astro preview --port 4321', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI },
});

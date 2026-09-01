import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.e2e' })

/**
 * Config for the live CMS -> frontend propagation check.
 *
 * Unlike `playwright.config.ts` this starts NO local server: it drives the
 * deployed Payload instance and the deployed Cloudflare frontend, so it is
 * verifying the real revalidation pipeline rather than a local approximation.
 *
 * Run with: pnpm test:e2e:prod
 */
export default defineConfig({
  testDir: './tests/e2e-prod',
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-prod' }]],
  timeout: 3 * 60 * 1000,
  use: {
    baseURL: process.env.SITE_URL || 'https://teecrownconsult.org',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
})

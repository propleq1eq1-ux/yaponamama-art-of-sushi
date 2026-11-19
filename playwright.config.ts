import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: process.env.YAPONAMAMA_TEST_URL ?? 'http://127.0.0.1:3000',
    launchOptions: {
      executablePath: process.env.YAPONAMAMA_CHROMIUM,
      args: ['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],
    },
    viewport: {width:1440,height:900},
  },
});

import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 300000,
  use: {
    permissions: ['clipboard-read', 'clipboard-write'],
    screenshot: 'only-on-failure',
  },
  webServer: [
    // {
    //   command: "npm run preview --port 8080",
    //   url: "http://localhost:8080",
    //   timeout: 5000,
    //   reuseExistingServer: true,
    // },
    // {
    //   command: "npm run chain",
    //   url: "http://localhost:8546",
    //   timeout: 5000,
    //   reuseExistingServer: true,
    // },
  ],
});

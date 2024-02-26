import { defineConfig } from "@playwright/test";
export default defineConfig({
  timeout: 300000,
  use: {
    permissions: ['clipboard-read', 'clipboard-write']
  },
  webServer: [
    {
      command: "yarn preview --port 8080",
      url: "http://localhost:8080",
      timeout: 5000,
      reuseExistingServer: true,
    },
    {
      command: "yarn chain",
      url: "http://localhost:8546",
      timeout: 5000,
      reuseExistingServer: true,
    },
  ],
});

FROM mcr.microsoft.com/playwright:v1.41.2-jammy AS tester

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm install --no-audit
RUN npx playwright install chromium
RUN xvfb-run --auto-servernum npm run test
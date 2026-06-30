// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 'node' — the current tests (seo.test.js, smoke.test.js) read source files
    // and assert on strings; they don't touch the DOM. jsdom isn't installed, so
    // requiring it just broke `make test`. Switch back to 'jsdom' if a test needs it.
    environment: 'node',
    globals: true,
  },
});

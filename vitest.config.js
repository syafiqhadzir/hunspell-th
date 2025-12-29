import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // Allows describe/it/expect without imports
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
});

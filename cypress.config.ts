import { defineConfig } from 'cypress';
import task from '@cypress/code-coverage/task';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            task(on, config);
            return config;
        },
        baseUrl: 'http://localhost:3000',
    },
});

import {defineConfig} from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        experimentalSessionAndOrigin: false,
        screenshotOnRunFailure: false,
        chromeWebSecurity: false,
        viewportHeight: 720,
        viewportWidth: 1280,
        video: false,
        setupNodeEvents(on, config) {
            require('@cypress/code-coverage/task')(on, config)
            return config
        },
    },
});

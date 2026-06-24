import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Replaces the real `server-only` module for all Vitest runs (needed because this suite
            // uses the jsdom environment, where `server-only` throws on import). Tradeoff: unit tests
            // won't catch accidental client-side imports of server-only modules — that boundary is
            // still enforced by `next build`.
            'server-only': path.resolve(__dirname, './src/test-utils/server-only-stub.ts'),
        },
    },
    test: {
        environment: 'jsdom',
    },
})
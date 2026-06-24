import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'server-only': path.resolve(__dirname, './src/test-utils/server-only-stub.ts'),
        },
    },
    test: {
        environment: 'jsdom',
    },
})
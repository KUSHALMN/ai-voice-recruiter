import { defineConfig } from 'vitest/config'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables for testing
dotenv.config({ path: '.env.local' })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['services/__tests__/**/*.test.ts', 'lib/**/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})

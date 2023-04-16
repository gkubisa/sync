import { load } from './deps.ts'
import { defineConfig } from 'npm:vite@^4.2.1'
import vue from 'npm:@vitejs/plugin-vue@^4.1.0'

import 'npm:vue@^3.2.47'

await load({
  export: true,
  restrictEnvAccessTo: ['DEMO_BASE_PATH', 'DEMO_PORT'],
  envPath: '../.env',
  examplePath: '../.env.example',
  defaultsPath: '../.env.defaults',
})

export default defineConfig({
  base: Deno.env.get('DEMO_BASE_PATH'),
  plugins: [vue()],
  server: {
    port: Number(Deno.env.get('DEMO_PORT')),
  },
})

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  "strict": true,
  format: ['esm', 'cjs'],
  // sourcemap: true,
  // clean: true,
  // "treeshake": true,
  // minify: true,
  bundle: true,
  dts: true,
  // "allowSyntheticDefaultImports": true,
  // esModuleInterop: true,
  // splitting: true,
  banner(ctx) {
    if (ctx.format === "esm") {
      return {
        js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
`,
      };
    }
  }
});
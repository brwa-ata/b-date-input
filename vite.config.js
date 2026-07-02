import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueDateInput',
      fileName: 'b-date-input',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: (asset) => (asset.name ?? '').endsWith('.css') ? 'style.css' : (asset.name ?? '[name][extname]'),
      },
    },
  },
});

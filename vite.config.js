import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'VueDateInput',
      fileName: 'vue-date-input',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: (asset) => asset.name === 'style.css' ? 'style.css' : (asset.name ?? '[name][extname]'),
      },
    },
  },
});

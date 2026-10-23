import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rolldownOptions: {
      input: {
        home: resolve(projectRoot, 'index.html'),
        catalogo: resolve(projectRoot, 'catalogo.html'),
        produto: resolve(projectRoot, 'produto.html'),
        carrinho: resolve(projectRoot, 'carrinho.html'),
        checkout: resolve(projectRoot, 'checkout.html'),
        sobre: resolve(projectRoot, 'sobre.html'),
        historia: resolve(projectRoot, 'historia.html'),
        creditosFotograficos: resolve(projectRoot, 'creditos-fotograficos.html'),
      },
    },
  },
});

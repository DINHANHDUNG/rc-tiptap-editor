import * as path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode !== 'production';
  const isAnalyze = mode === 'analyze';

  return {
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    optimizeDeps: {
      include: ['react'],
    },
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
    build: {
      minify: 'esbuild',
      outDir: 'lib',
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        name: 'RcTiptapEditor',
      },
      rollupOptions: {
        output: {
          exports: 'named',
          globals: {
            react: 'react',
            'react-dom': 'react-dom',
          },
        },
        external: ['react', 'react-dom'],
      },
    },
  };
});

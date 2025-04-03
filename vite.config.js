import image from '@rollup/plugin-image';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  const configuration = {
    plugins: [peerDepsExternal(), react(), image()],
    root: command === 'serve' ? 'example' : undefined,
    build: {
      minify: false,
      lib: {
        name: 'pasgantti',
        entry: path.resolve(__dirname, 'src/index.tsx'),
        formats: ['es', 'umd'],
        fileName: format => `pasgantti.${format}.js`,
      },
      rollupOptions: {
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime',
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'html'],
      },
    },
  };
  return configuration;
});

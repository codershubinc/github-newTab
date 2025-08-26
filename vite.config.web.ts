import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tailwindcss(),
        tsconfigPaths(),
        react(),
    ],
    publicDir: resolve(__dirname, 'public'),
    root: './src/pages/newtab',
    build: {
        outDir: '../../../dist_web',
        emptyOutDir: true
    },
    server: {
        port: 5173,
        open: true
    }
});
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
    base: '/gws/',
    plugins: [react()],
    server: {
        proxy: {
            '/gws/api': {
                target: 'http://backend:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/gws\/api/, '')
            }
        }
    }
});

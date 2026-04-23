import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig(({mode}) => ({
    base: mode === 'production' ? '/wms/' : '/',
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://backend:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
}));

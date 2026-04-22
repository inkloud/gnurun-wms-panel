import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
    base: '/wms/',
    plugins: [react()],
    server: {
        proxy: {
            '/wms/api': {
                target: 'http://backend:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/wms\/api/, '')
            }
        }
    }
});

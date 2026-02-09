import { svelte } from '@sveltejs/vite-plugin-svelte';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';
import {wayfinder} from "@laravel/vite-plugin-wayfinder";


export default defineConfig({
    base: '/laravel-svelte-inertia-starter/public/build',
    build: {
        rollupOptions: {
            output: {
                manualChunks:{
                    'vendor-svelte': ['svelte', 'svelte/animate', 'svelte/easing', 'svelte/motion', 'svelte/store', 'svelte/transition'],
                    'vendor-icons': ['@lucide/svelte'],
                    'vendor-plugin': ['@tunbudi06/inertia-route-helper'],
                    'vendor-shadcn': ['bits-ui'],
                },
                chunkFileNames: (chunkInfo) => {
                    if (chunkInfo.name.startsWith('vendor')) {
                        const name = chunkInfo.name.split('-')[1];

                        return 'vendor/'+name+'.[hash].js';
                    }
                    return 'assets/[name].[hash].js';
                }
            }
        }
    },
    plugins: [
        wayfinder({
            command: 'php artisan wayfinder:generate',
            routes: true,
            actions: false,
            // patterns
        }),
        tailwindcss(),
        svelte({
            compilerOptions: {
                dev: process.env.NODE_ENV !== 'production',
            },
        }),
        laravel({
            input: 'resources/js/app.ts',
            ssr: 'resources/js/ssr.ts',
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '$': path.resolve(__dirname, './resources/js'),
            '$shadcn': path.resolve(__dirname, './resources/js/shadcn'),
            '$routes': path.resolve(__dirname, './resources/js/routes'),
            '$lib': path.resolve(__dirname, './resources/js/lib'),
        }
    },
});

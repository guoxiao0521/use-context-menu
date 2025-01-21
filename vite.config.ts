import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'useContextMenu',
            fileName: (format) => `use-context-menu.${format}.js`,
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', '@vueuse/core'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                    '@vueuse/core': 'VueUse',
                },
            },
        },
    },
    plugins: [
        vue(),
        dts({
            tsconfigPath: './tsconfig.app.json',
            rollupTypes: true,
            insertTypesEntry: true,
            copyDtsFiles: true,
            include: ['src/**/*.ts', 'src/**/*.vue', 'src/index.ts'],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});

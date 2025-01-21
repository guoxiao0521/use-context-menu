import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import process from 'node:process';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.vue'],
        // Vue 文件的特定配置
        languageOptions: {
            parser: pluginVue.parser, // 使用 vue-eslint-parser
            parserOptions: {
                parser: tseslint.parser, // 用于处理 <script> 中的 TypeScript
                extraFileExtensions: ['.vue'],
                sourceType: 'module',
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    jsx: true,
                },
                globals: {
                    ...globals.node, // 添加 Node.js 全局变量
                    ...globals.browser, // 如果需要浏览器环境的全局变量
                },
            },
        },
    },
    {
        // 忽略特定文件和目录
        ignores: [
            'dist/**', // 忽略构建输出目录
            'node_modules/**', // 忽略依赖包
            '*.d.ts', // 忽略类型声明文件
            'vite.config.ts', // 忽略 vite 配置文件（如果需要）
            'coverage/**', // 忽略测试覆盖率目录
            'src/vite-env.d.ts', // 忽略 vite-env.d.ts 文件
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: [
                    './tsconfig.json',
                    './tsconfig.node.json',
                    './tsconfig.app.json',
                ],
                tsconfigRootDir: process.cwd(),
                extraFileExtensions: ['.vue'],
                sourceType: 'module',
            },
            globals: {
                ...globals.node, // 添加 Node.js 全局变量
                ...globals.browser, // 如果需要浏览器环境的全局变量
            },
        },
        rules: {
            // 你的规则配置
            'no-undef': 'error', // 保持 no-undef 规则开启
        },
    },
    eslintConfigPrettier
);

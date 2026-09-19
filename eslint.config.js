import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules/**', 'logs/**', 'coverage/**', 'dist/**'],
  },

  eslint.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },

    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': 'error',
    },
  },

  prettierConfig,
];

import { FlatCompat } from '@eslint/eslintrc';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

const compat = new FlatCompat({
  baseDirectory: new URL('.', import.meta.url).pathname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      semi: ['error', 'always'],
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': [
        'error',
        { singleQuote: true, trailingComma: 'all', semi: true },
      ],
    },
  },
];

export default eslintConfig;

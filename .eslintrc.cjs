var tsConfigs = ['./tsconfig.json'];

var ruleOverrides = {};

module.exports = {
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@next/next/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigs,
      },
      plugins: ['@typescript-eslint', 'prettier'],
      rules: {
        'prettier/prettier': 1,
        '@typescript-eslint/no-unused-vars': 1,
      },
      files: ['src/**/*.ts', 'src/**/*.tsx'],
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: tsConfigs,
      },
      plugins: [
        '@typescript-eslint',
        'plugin:playwright/playwright-test',
        'prettier',
      ],
      rules: {
        'prettier/prettier': 'error',
      },
      files: ['e2e/**/*.spec.ts'],
    },
  ],
  root: true,
  ignorePatterns: ['*.js', '*.mjs', '*.cjs', '*.json'],
};

const eslintPluginTypeScript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const eslintPluginImport = require('eslint-plugin-import');
const eslintConfigPrettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      import: eslintPluginImport,
      '@typescript-eslint': eslintPluginTypeScript,
      prettier: eslintPluginPrettier
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'import/named': 'off',
      'linebreak-style': 'off',
      'import/prefer-default-export': 'off',
      'prettier/prettier': 'off',
      'import/extensions': 'off',
      'no-use-before-define': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-shadow': 'off',
      'no-restricted-syntax': ['error', 'ForInStatement', 'WithStatement'],
      'class-methods-use-this': 'off',
      'no-param-reassign': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  // Import plugin rules
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      import: eslintPluginImport
    },
    rules: eslintPluginImport.configs.recommended.rules
  },
  // Prettier config
  eslintConfigPrettier
];

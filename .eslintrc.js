module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': ['error', { allow: ['info', 'error'] }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto'
      }
    ],
    'no-unused-expressions': 'error',
    'no-fallthrough': 'error',
    'no-duplicate-imports': 'error',
    'no-duplicate-case': 'error',
    'no-dupe-keys': 'error',
    'no-dupe-else-if': 'error',
    'no-dupe-class-members': 'error',
    'no-dupe-args': 'error',
    'no-debugger': 'error',
    'no-constant-condition': 'error',
    'no-constructor-return': 'error',
    'no-const-assign': 'error',
    'no-cond-assign': 'error',
    'no-constant-binary-expression': 'error',
    'no-compare-neg-zero': 'error',
    'array-callback-return': 'error',
    'no-unreachable': 'error',
    'no-import-assign': 'error',
    'no-setter-return': 'error',
    'no-invalid-regexp': 'error',
    'no-self-assign': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'constructor-super': 'error',
    'no-unsafe-negation': 'error',
    'for-direction': 'error',
    'no-async-promise-executor': 'off',
    'no-sparse-arrays': 'error',
    'valid-typeof': ['error', { requireStringLiterals: true }],
    'capitalized-comments': ['error'],
    'no-continue': 'error',
    'no-return-await': 'error',
    complexity: ['error', { max: 2 }],
    'no-empty': 'error',
    'no-nested-ternary': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['error'],
    'no-undefined': 'error',
    'no-use-before-define': [
      'error',
      {
        functions: true,
        classes: true,
        variables: true,
        allowNamedExports: false
      }
    ]
  }
};

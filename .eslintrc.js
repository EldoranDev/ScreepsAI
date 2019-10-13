module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    '_': true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 4],
    'no-restricted-syntax': 0,
    'no-param-reassign': ["error", { "props": false }],
    'global-require': 0,
    'no-undef': 0,
  },
};

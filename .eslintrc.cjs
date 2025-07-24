module.exports = {
  env: {
    browser: true,
    es2020: true,
    'jest/globals': true,
    'cypress/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:cypress/recommended'
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', 'jest', 'cypress'],
  rules: {
    
    'react/react-in-jsx-scope': 'off' 
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}

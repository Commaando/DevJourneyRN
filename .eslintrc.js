module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:react/recommended', 'prettier'],
  plugins: ['react', 'react-native', 'import'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/order': ['warn', { 'newlines-between': 'always' }],
    'max-len': ['warn', { code: 100 }],
    
  },
};
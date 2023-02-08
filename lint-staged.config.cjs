module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'eslint'],
  '**/*.ts?(x)': function () {
    'npm run check-types';
  },
  '*.{json,yaml}': ['prettier --write'],
};

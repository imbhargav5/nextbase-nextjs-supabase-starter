module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'eslint'],
  '**/*.ts?(x)': ['yarn tsc --noEmit'],
  '*.{json,yaml}': ['prettier --write'],
};

module.exports = {
  '*.{js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix', 'eslint'],
  '**/*.ts?(x)': ['yarn tsc --noEmit'],
  '*.{json,yaml}': ['prettier --write'],
};

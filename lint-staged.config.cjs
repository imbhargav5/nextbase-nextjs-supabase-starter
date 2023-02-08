module.exports = {
  '*.{js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix', 'eslint'],
  '**/*.ts?(x)': ['tsc-files --noEmit'],
  '*.{json,yaml}': ['prettier --write'],
};

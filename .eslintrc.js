module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    // Add any custom rules here if needed
  },
  ignorePatterns: [
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ],
};

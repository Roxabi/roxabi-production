import tsParser from '@typescript-eslint/parser'

const deterministicRules = [
  {
    selector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
    message: "Math.random() is non-deterministic — use random() from core/random.ts",
  },
  {
    selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
    message: "Date.now() is non-deterministic — derive time from useCurrentFrame() / fps",
  },
  {
    selector: "CallExpression[callee.object.name='performance'][callee.property.name='now']",
    message: "performance.now() is non-deterministic — derive time from useCurrentFrame() / fps",
  },
  {
    selector: "CallExpression[callee.property.name='play']",
    message: "Do not call .play() on media — audio is handled by the --audio= CLI flag",
  },
]

export default [
  {
    files: ['showcase/**/*.{ts,tsx}', 'kits/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-restricted-syntax': ['error', ...deterministicRules],
    },
  },
  {
    files: ['core/**/*.{ts,tsx}'],
    ignores: ['core/random.ts'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      'no-restricted-syntax': ['error', ...deterministicRules],
    },
  },
]

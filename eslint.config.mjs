import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:@typescript-eslint/recommended", "prettier"),
  ...compat.config({
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: ['react', '@typescript-eslint'],
    languageOptions: {
      ecmaVersion: "2021",
      sourceType: 'module',
    },
    rules: {
    }
  }),
];

export default eslintConfig;

import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: "latest", sourceType: "module" } },
    plugins: { "@typescript-eslint": tseslint },
    rules: { "no-unused-vars": "off", "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }] }
  }
];

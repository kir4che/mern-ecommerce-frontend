import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["dist", "build", "node_modules", "coverage"],
  plugins: ["react", "typescript"],
  env: {
    browser: true,
    es2025: true,
  },
  rules: {
    "typescript/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "typescript/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
  },
});

import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".git/",
      "coverage/",
      "*.log",
      ".DS_Store",
      ".env",
      ".env.local",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,

      // Unused variables check
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Import checks
      "import/no-unresolved": "error",
      "import/no-cycle": "warn",
      "import/no-unused-modules": "warn",
      "no-duplicate-imports": "error",

      // Code quality
      "no-console": "off",
      "no-debugger": "error",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "comma-dangle": ["error", "always-multiline"],
      indent: ["error", 2],
      eqeqeq: ["error", "always"],
    },
  },
];

const eslintConfig = require("@akashic/eslint-config");
const eslintConfigPrettier = require("eslint-config-prettier");
const storybook = require("eslint-plugin-storybook");
const unuserdPlugin = require("eslint-plugin-unused-imports");
const vueParser = require("vue-eslint-parser");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");

module.exports = [
  importPlugin.flatConfigs.recommended,
  ...eslintConfig,
  eslintConfigPrettier,
  ...storybook.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,vue}"],
    languageOptions: {
      parser: vueParser,
      sourceType: "module",
      ecmaVersion: 2020,
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: ["./tsconfig.json"],
        extraFileExtensions: ["vue"],
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.node,
        AE: true,
      },
    },
    plugins: { "unused-imports": unuserdPlugin },
    ignores: [
      "public/**/*.d.ts"
    ],
    rules: {
      "vue/html-indent": "off",
      "vue/attribute-hyphenation": "off",
      "import/order": ["error", {
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "off" // TODO: 誤検知のため一旦 off
      ],
      "@typescript-eslint/explicit-function-return-type": "off"
    }
  }
];

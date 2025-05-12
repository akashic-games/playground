const eslintConfig = require("@akashic/eslint-config");
const eslintConfigPrettier = require("eslint-config-prettier");
const storybook = require("eslint-plugin-storybook");
const unuserdPlugin = require("eslint-plugin-unused-imports");
const vueParser = require("vue-eslint-parser");

module.exports = [
  ...eslintConfig,
  eslintConfigPrettier,
  ...storybook.configs["flat/recommended"],
  {
    files: ["src/**/*.{vue}"],
    languageOptions: {
      parser: vueParser,
      sourceType: "module",
      parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true
        }
      }
    },
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
      ]
    },
  },
  {
      files: ["src/**/*.ts"],
      languageOptions: {
        sourceType: "module",
        parserOptions: {
          project: "tsconfig.json",
          ecmaVersion: 2020,
        }
      },
      ignores: [
        "public/**/*.d.ts"
      ],
      plugins: { "unused-imports": unuserdPlugin },
      rules: {
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
        ]
      }
  }
];

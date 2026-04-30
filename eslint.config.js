// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".lib/**",
      "build/**",
      "coverage/**",
      "**/*.config.js",
      "**/*.config.ts",
      "android/**",
      "ios/**",
      ".vscode/**",
      ".idea/**",
    ],
  },
  expoConfig,
  {
    settings: {
      react: { version: "19.1.0" },
    },
  },
]);

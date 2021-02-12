module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    //"plugin:prettier/recommended", // disable for now
  ],
  ignorePatterns: ["dist"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "warn", // temporary
  },
};

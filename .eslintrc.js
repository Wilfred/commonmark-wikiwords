module.exports = {
  env: {
    es6: true,
    jest: true,
    node: true
  },
  extends: "eslint:recommended",
  rules: {
    "linebreak-style": ["error", "unix"],
    "no-var": "error",
    "prefer-const": "error",
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};

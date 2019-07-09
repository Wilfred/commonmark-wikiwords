module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  rules: {
    "linebreak-style": ["error", "unix"],
    "no-var": "error",
    quotes: ["error", "double"],
    semi: ["error", "always"]
  }
};

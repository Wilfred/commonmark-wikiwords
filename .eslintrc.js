module.exports = {
  env: {
    es6: true,
    jest: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:jest/style"],
  plugins: ["jest"],
  rules: {
    "linebreak-style": ["error", "unix"],
    "no-var": "error",
    "prefer-const": "error",
    semi: ["error", "always"]
  }
};

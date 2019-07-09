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
    "no-alert": "warn",
    "no-console": "warn",
    "no-debugger": "warn",
    "no-var": "error",
    "prefer-const": "error",
    semi: ["error", "always"]
  }
};

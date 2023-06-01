module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
  },
  extends: [
  ],
  rules: {

  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};

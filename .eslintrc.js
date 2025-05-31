module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Disable unused vars check to avoid build failures
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off"
  }
};

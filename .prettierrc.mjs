/** @type {import("prettier").Config} */

export default {
  semi: false,
  quoteProps: "consistent",
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}

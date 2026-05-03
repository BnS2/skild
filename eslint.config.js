import { defineConfig } from "eslint/config";
import biome from "eslint-config-biome";
import tailwindV4 from "@bns2/eslint-plugin-tailwind-v4";
import tsParser from "@typescript-eslint/parser";

export default defineConfig([
    biome,
    tailwindV4.configs.recommended("./src/styles.css"),
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            "tailwind-v4/typo": ["error", { cssPath: "./src/styles.css" }],
        },
    },
]);
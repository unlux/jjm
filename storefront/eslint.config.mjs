// @ts-check

import path from "node:path"
import { fileURLToPath } from "node:url"

import { FlatCompat } from "@eslint/eslintrc"
import eslint from "@eslint/js"
import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  [
    {
      extends: compat.extends(
        "eslint:recommended",
        "plugin:prettier/recommended"
      ),

      plugins: {
        "simple-import-sort": simpleImportSort,
      },

      languageOptions: {
        globals: {
          ...globals.node,
        },
      },

      rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
      },
    },
    {
      files: ["**/pages/**/*.{js,jsx,ts,tsx}", "**/app/**/*.{js,jsx,ts,tsx}"],
      extends: compat.extends("next/core-web-vitals"),
    },
    {
      ignores: ["node_modules", ".next", "build", "dist"],
    },
  ]
)

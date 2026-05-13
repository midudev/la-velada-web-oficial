# Agent Guidelines

- Do not run ESLint automatically after every small code change.
- Do not check TypeScript errors (e.g. `pnpm exec tsc`, `astro check`) automatically; only run TypeScript validation when the user explicitly asks for it.
- Prefer the editor diagnostics (`ReadLints`) for quick feedback on files you touched.
- Run `pnpm exec eslint ...`, `pnpm lint`, or broader validation only when the user asks for it, when preparing a final verification for a risky change, or when diagnostics are insufficient to catch a likely issue.
- When validation is skipped because the change is small, mention that briefly in the final response.

# Contributing

## Scope

Keep `template_core` platform-independent. Browser code must call the core instead of duplicating validation or output logic. Add Worker, MCP, hosting, or other transports only when a concrete use case and tests require them.

## Development

1. Create a focused branch or worktree.
2. Write an outcome-focused failing test before changing behavior.
3. Make the smallest implementation that passes.
4. Run the checks documented in `README.md`.
5. Keep generated `target/`, `pkg/`, `node_modules/`, and Playwright artifacts out of commits.

For browser changes, verify all configured Playwright projects and inspect the rendered layouts at 375, 768, 1024, and 1440 px.

## Changes

- Keep commits focused and describe observable behavior.
- Preserve stable schema field names and error codes, or document an intentional compatibility change.
- Update both README languages when commands, maturity, privacy boundaries, or limitations change.
- Do not add secrets, credentials, private input, or generated build output.

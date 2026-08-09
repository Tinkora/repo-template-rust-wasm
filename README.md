# repo-template-rust-wasm

A small, verifiable Rust workspace template for sharing one business core between native Rust and a browser WebAssembly boundary. The included Tinkora tool accepts a name and returns a versioned greeting.

[简体中文](README.zh-CN.md)

## Maturity

- **Product maturity: Draft.** The template has local verification evidence, but no hosted CI run or external-use evidence. It therefore displays no maturity badge.
- **Human-usable:** the local browser tool is implemented and tested with real Chromium and the real `wasm-pack` output.
- **Agent schema draft:** the WASM boundary demonstrates a stable, versioned object shape that could inform a future agent integration.
- **Not Agent-callable:** this repository has no MCP transport, MCP server, tool registration, Worker, hosted endpoint, or agent authentication.

Product maturity and invocation capability are separate. See [Maturity and capability labels](docs/MATURITY.md) for evidence thresholds and badge rules.

## Structure

```text
.
├── .github/
│   ├── dependabot.yml
│   └── workflows/       # Native/WASM, docs, and supply-chain checks
├── crates/
│   ├── template_core/  # Platform-independent behavior and stable data contract
│   └── template_web/   # Thin wasm-bindgen boundary, browser tool, and smoke tests
├── docs/                # Release readiness and maturity governance
├── scripts/             # Offline documentation checks and fixture tests
├── deny.toml
└── Cargo.toml
```

`template_core` has no WebAssembly dependency. `template_web` validates no business rules of its own; it calls `template_core::run` and converts the result into JavaScript objects.

## Contract

The Rust entry point is:

```rust
pub fn run(name: &str) -> Result<Response, CoreError>
```

A successful JavaScript boundary response is:

```json
{
  "ok": true,
  "data": {
    "schemaVersion": 1,
    "output": "Hello, Tinkora!"
  }
}
```

Empty or whitespace-only input returns:

```json
{
  "ok": false,
  "error": {
    "code": "EMPTY_INPUT",
    "message": "Name must not be empty."
  }
}
```

Treat `schemaVersion`, error codes, and serialized field names as compatibility commitments.

## Requirements

- Rust 1.85 or newer with the `wasm32-unknown-unknown` target
- `wasm-pack` 0.15.0
- Node.js 24 or newer for browser smoke tests

## Develop

Run the Rust checks from the repository root:

```bash
cargo fmt --all -- --check
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
cargo check -p template_web --target wasm32-unknown-unknown
```

Build and open the local tool:

```bash
cd crates/template_web
npm ci
npm run build:wasm
npm run serve
```

Open `http://127.0.0.1:4173/web/`.

Install Chromium once and run the real WASM smoke suite:

```bash
cd crates/template_web
npx --no-install playwright install chromium
npm run build:wasm
npm run test:wasm-smoke
```

The smoke suite owns its HTTP server and never reuses another process. If port
4173 is occupied, choose a free port for that run, for example
`PLAYWRIGHT_PORT=4174 npm run test:wasm-smoke`.

Run documentation checks:

```bash
npx --yes markdownlint-cli2@0.23.2 "**/*.md"
ruby scripts/test_check_docs.rb
ruby scripts/check_docs.rb
ruby scripts/test_check_workflow_contracts.rb
ruby scripts/check_workflow_contracts.rb
```

Install the fixed audit tools with Rust 1.88 or newer, then check the locked dependency graph:

```bash
cargo +1.88.0 install cargo-deny --version 0.20.2 --locked
cargo +1.88.0 install cargo-audit --version 0.22.2 --locked
cargo deny check advisories bans licenses sources
cargo audit
```

The audit toolchain does not change the workspace MSRV of Rust 1.85.

Generated `pkg/`, `node_modules/`, Rust `target/`, and Playwright artifacts are ignored and must not be committed.

## CI

`.github/workflows/quality.yml` calls the organization Rust and WASM reusable workflows by full commit SHA. The WASM job builds the crate, passes that exact artifact to the fixed `test:wasm-smoke` script, and runs Chromium at 375, 768, 1024, and 1440 px viewports.

`.github/workflows/docs-quality.yml` runs a SHA-pinned Markdown action, the checker fixture suite, and the offline tracked-file checker. `.github/workflows/supply-chain.yml` calls the SHA-pinned reusable audit workflow on pull requests, `main`, a weekly schedule, and manual dispatch. It uses Rust 1.88.0 to install `cargo-deny` 0.20.2 and `cargo-audit` 0.22.2, and checks advisories, bans, licenses, and sources.

All workflows have read-only `contents` permission, use no inherited secrets, and contain no deploy, release, or publish job. These files are local configuration; they do not claim a hosted run. The reusable calls are pinned to the verified Tinkora organization baseline commit in `Tinkora/.github`; `scripts/check_workflow_contracts.rb` rejects a retired owner, a floating ref, or a missing required call.

Dependabot checks GitHub Actions, Cargo, and the web crate's npm dependencies weekly in the `Asia/Shanghai` timezone. Its seven-day cooldown applies to routine version updates; Dependabot security updates are not delayed by cooldown.

Before an authorized release, follow the [Release Checklist](docs/RELEASE_CHECKLIST.md). Local candidate validation does not authorize tags, GitHub Releases, or publishing credentials.

## Privacy

The tool processes input in browser memory and does not persist or transmit it. The included server binds to `127.0.0.1`. Dependency installation and first-time tool installation can contact the configured Cargo and npm registries; review those dependencies and your registry configuration for your environment.

## Limitations

- The example behavior is intentionally limited to one greeting.
- The schema is a draft for future integrations, not an agent protocol.
- There is no persistence, network API, authentication, Worker, or MCP transport.
- This template does not make deployment or production-hardening claims.

## License

MIT. See [LICENSE](LICENSE).

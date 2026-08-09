# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Platform-independent Rust core with a versioned response and stable errors.
- Thin `wasm-bindgen` boundary and local Tinkora browser tool.
- Real Chromium smoke coverage for keyboard use, accessible control names, console health, and overflow at 375, 768, 1024, and 1440 px viewports.
- Pinned reusable Rust and WASM quality workflow callers.
- Offline documentation validation with fixture tests and a pinned Markdown workflow.
- Pinned supply-chain audits for advisories, bans, licenses, and sources.
- Weekly Dependabot coverage for GitHub Actions, Cargo, and npm dependencies.
- Bilingual release-readiness and evidence-based maturity governance.
- Reusable workflow contract checks pinned to the verified Tinkora organization baseline.

### Fixed

- Updated the pinned Tinkora reusable workflows to accept the standard
  `.gitignore` emitted by `wasm-pack 0.15.0` without weakening artifact guards.
- Playwright smoke tests now own an isolated, configurable local server instead of reusing an unrelated process on the same port.
- Browser configuration tests enforce the required viewport matrix and usable TCP port range.

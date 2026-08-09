# Release Checklist

[简体中文](RELEASE_CHECKLIST.zh-CN.md)

This checklist validates a release candidate. It is not permission to create a tag, GitHub Release, deployment, package, or publishing credential.

## Release Authority

- [ ] A second trusted owner has reviewed the release candidate and recovery plan.
- [ ] Publishing credentials are held by a protected environment with required reviewers and least privilege.
- [ ] The repository rules protect the release commit and require the relevant checks.

Until all three controls exist, a solo or local maintainer may validate only a candidate. Do not create or push a tag, create a GitHub Release, publish an artifact, or introduce publishing credentials. This template intentionally contains no release workflow or write permission.

## Candidate Identity

- [ ] Choose a SemVer version and confirm its compatibility impact.
- [ ] Record the exact clean commit to release.
- [ ] Confirm the proposed immutable tag is `v<version>` and points to that commit.
- [ ] Update `CHANGELOG.md` with the release date, user-visible changes, migration notes, and security impact.

## Quality Gates

- [ ] `cargo fmt --all -- --check` passes.
- [ ] `cargo test --workspace` passes for the native workspace.
- [ ] `cargo clippy --workspace --all-targets -- -D warnings` passes.
- [ ] `cargo check -p template_web --target wasm32-unknown-unknown` passes.
- [ ] The real WASM artifact builds and the Playwright projects pass at 375, 768, 1024, and 1440 px.
- [ ] Markdown lint, `scripts/test_check_docs.rb`, `scripts/check_docs.rb`, `scripts/test_check_workflow_contracts.rb`, and `scripts/check_workflow_contracts.rb` pass.
- [ ] `cargo deny check advisories bans licenses sources` and `cargo audit` pass against the candidate lockfile.
- [ ] Required hosted CI checks pass on the exact candidate commit; a local run is not a substitute for protected CI evidence.

## Contract And Risk Review

- [ ] Confirm every dependency, bundled asset, and release artifact has an acceptable license and required notices.
- [ ] Recheck documented privacy behavior, network access, sensitive-input handling, and resource limits.
- [ ] Compare `schemaVersion`, serialized fields, error codes, and public Rust APIs with the last release.
- [ ] Document any breaking schema or API change and apply the required SemVer increment.
- [ ] Confirm generated files are reproducible and exclude local paths, credentials, test output, and development caches.

## Artifact Evidence

- [ ] Build release artifacts from the reviewed commit in the protected environment.
- [ ] Record a SHA-256 checksum for every distributed artifact.
- [ ] Generate and retain an SBOM covering the shipped dependency graph.
- [ ] Attach provenance that identifies the source commit, build workflow, toolchain, and artifact digests.
- [ ] Verify a clean consumer can validate checksums and use the artifacts without unpublished local state.

## Recovery

- [ ] Write a rollback or fix-forward plan before publication, including who decides and how users are notified.
- [ ] Preserve the prior known-good artifact and its checksums.
- [ ] Define how to withdraw a bad artifact without moving or silently replacing an immutable tag.
- [ ] After an authorized release, verify the published tag, release notes, artifacts, checksums, SBOM, and provenance against the reviewed candidate.

See [Maturity](MATURITY.md) for evidence levels and badge rules.

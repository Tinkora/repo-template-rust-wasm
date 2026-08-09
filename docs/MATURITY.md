# Maturity And Capability Labels

[简体中文](MATURITY.zh-CN.md)

Product maturity describes evidence and operating confidence. Capability labels describe how people or agents can invoke the tool. These are independent axes and must not be combined into a stronger claim.

## Current Status

This template is **Alpha**. On commit
[`c84ad7b`](https://github.com/Tinkora/repo-template-rust-wasm/commit/c84ad7b46390672c89388eccfd0967533a19f2f2),
the hosted [Quality](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308297982),
[Documentation quality](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308297753),
and [Supply chain](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308298024)
runs passed. These runs cover native success and failure outcomes, MSRV, WASM,
real-browser behavior, documentation contracts, and dependency policy. The
repository also contains the required license, security, support, changelog,
and release-candidate documentation.

There is no documented non-maintainer external use or completed external
feedback and remediation cycle, so the template does not meet the Beta
threshold.

Its current capability labels are **Human-usable** and **Agent schema draft**. It is not **Agent-callable** or **Dual-use**.

## Maturity Levels

| Level | Required evidence |
| --- | --- |
| Draft | Scope and trust boundaries are documented; representative behavior may work locally; interfaces and release process may still change. |
| Alpha | Core success, invalid-input, boundary, and failure outcomes are tested; native, WASM, browser, docs, and dependency checks pass in real hosted CI on the referenced commit; license, security, support, changelog, and release-candidate documentation are present. |
| Beta | All Alpha evidence remains current; stable interfaces and browser end-to-end coverage exist; non-maintainer external use is documented; at least one complete feedback and remediation cycle is closed; release rollback is rehearsed or evidenced. |
| Stable | All Beta evidence remains current across consecutive compatible releases; maintainers and support lifecycle are explicit; at least two trusted owners can review releases; protected publishing controls and compatibility history are evidenced. |

A maturity level is the highest row for which every requirement has current, reviewable evidence. Age, code volume, local success, or a planned workflow does not satisfy a missing requirement.

## Badge Rules

- Do not add a Draft, Alpha, Beta, Stable, build, audit, or coverage badge until its target has produced real evidence for the exact repository and default branch.
- Link each badge to the run, release, policy, or report that proves the claim. A decorative or dead badge is not evidence.
- Do not promote maturity from local-only checks, unexecuted workflow files, generated screenshots, or maintainer assertions.
- External-use claims must identify a reviewable issue, feedback record, adoption report, or equivalent evidence without exposing private user data.
- Remove or downgrade a badge promptly when required evidence is stale, failing, or no longer available.
- A capability label cannot raise the maturity level, and a maturity badge cannot imply an invocation capability.

## Capability Labels

| Label | Meaning and evidence |
| --- | --- |
| Human-usable | A person can complete the documented workflow through a tested local UI or CLI. |
| Agent schema draft | A versioned data shape exists for design and compatibility work, but no runnable agent transport or registration is promised. |
| Agent-callable | A real agent transport and tool registration execute the documented contract, with authentication and trust boundaries tested where applicable. |
| Dual-use | The same supported core behavior is available through both a Human-usable interface and an Agent-callable interface, with parity tests for their shared contract. |

Use multiple labels when their evidence is independently true. Never use **Dual-use** as a synonym for an aspirational schema.

Before any release action, use the [Release Checklist](RELEASE_CHECKLIST.md).

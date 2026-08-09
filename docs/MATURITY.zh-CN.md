# 成熟度与能力标签

[English](MATURITY.md)

产品成熟度描述证据和运行信心，能力标签描述人或 Agent 如何调用工具。两者是相互独立的维度，不得组合成更强的声明。

## 当前状态

这个模板当前为 **Alpha**。在提交
[`c84ad7b`](https://github.com/Tinkora/repo-template-rust-wasm/commit/c84ad7b46390672c89388eccfd0967533a19f2f2)
上，托管的 [Quality](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308297982)、
[Documentation quality](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308297753)
和 [Supply chain](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308298024)
运行均已通过。这些运行覆盖 native 成功与失败结果、MSRV、WASM、真实浏览器行为、文档契约和依赖策略；仓库也具备必需的 License、Security、Support、CHANGELOG 和发布候选文档。

当前没有非维护者外部使用记录，也没有已完成的外部反馈与修复闭环，因此不满足 Beta 门槛。

当前能力标签为 **Human-usable** 与 **Agent schema draft**，并非 **Agent-callable** 或 **Dual-use**。

## 成熟度等级

| 等级 | 必需证据 |
| --- | --- |
| Draft | 已记录范围和信任边界；代表性行为可以在本地运行；接口和发布流程仍可能变化。 |
| Alpha | core 的成功、无效输入、边界值和失败结果均有测试；native、WASM、浏览器、文档和依赖检查已在引用 commit 的真实托管 CI 中通过；License、Security、Support、CHANGELOG 和发布候选文档齐全。 |
| Beta | 所有 Alpha 证据持续有效；接口稳定且具备浏览器端到端覆盖；已有非维护者的外部使用记录；至少完成一个完整的反馈和修复周期；发布 rollback 已演练或有证据。 |
| Stable | 所有 Beta 证据在连续兼容版本中持续有效；维护者与支持周期明确；至少两位可信 owner 可审查发布；protected publishing 控制和兼容性历史均有证据。 |

成熟度只能取所有要求均有当前、可审查证据的最高等级。项目时长、代码量、本地成功或尚未执行的 workflow 都不能补足缺失证据。

## Badge 规则

- 在目标为准确仓库和默认分支生成真实证据前，不得添加 Draft、Alpha、Beta、Stable、build、audit 或 coverage badge。
- 每个 badge 都必须链接到能证明声明的 run、release、policy 或报告；装饰性或失效 badge 不算证据。
- 不得仅凭本地检查、未执行的 workflow 文件、生成截图或维护者自述提升成熟度。
- 外部使用声明必须指向可审查的 issue、反馈记录、采用报告或同等证据，且不得泄露用户隐私。
- 必需证据过期、失败或不再可用时，应及时移除或降级 badge。
- 能力标签不能提升成熟度，成熟度 badge 也不能暗示调用能力。

## 能力标签

| 标签 | 含义与证据 |
| --- | --- |
| Human-usable | 人可以通过经过测试的本地 UI 或 CLI 完成文档所述工作流。 |
| Agent schema draft | 已有带版本的数据结构用于设计和兼容工作，但不承诺存在可运行的 Agent transport 或注册。 |
| Agent-callable | 真实 Agent transport 和 tool registration 能执行文档契约，并在适用时测试身份验证与信任边界。 |
| Dual-use | 同一受支持 core 行为同时通过 Human-usable 和 Agent-callable 接口提供，且共享契约有一致性测试。 |

各标签证据独立成立时可以同时使用。不得把 **Dual-use** 当作规划中 schema 的同义词。

任何发布动作前均应使用[发布前检查清单](RELEASE_CHECKLIST.zh-CN.md)。

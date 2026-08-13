# repo-template-rust-wasm

这是一个小型、可验证的 Rust workspace 模板，用同一个业务 core 同时服务原生 Rust 与浏览器 WebAssembly 边界。随附的 Tinkora 工具接收名称并返回带版本的问候结果。

[English](README.md)

<!-- markdownlint-disable MD033 -->
<p align="center">
  <a href="https://ko-fi.com/tinkora" target="_blank" rel="noopener noreferrer">
    <img
      src="https://ko-fi.com/img/githubbutton_sm.svg"
      alt="在 Ko-fi 上支持 Tinkora"
      width="520"
    >
  </a>
</p>
<!-- markdownlint-enable MD033 -->

## 成熟度

- **产品成熟度：Alpha。** Native Rust、MSRV、WASM、真实 Chromium、文档和依赖检查已在
  [`c84ad7b`](https://github.com/Tinkora/repo-template-rust-wasm/commit/c84ad7b46390672c89388eccfd0967533a19f2f2)
  的 GitHub 托管 CI 中通过。当前尚无非维护者的外部使用证据，因此不满足 Beta 门槛。
- **可供人使用：** 本地浏览器工具已经实现，并使用真实 Chromium 与真实 `wasm-pack` 产物完成测试。
- **Agent schema draft：** WASM 边界演示了稳定、带版本的对象结构，可作为未来 Agent 集成的 schema 草案。
- **尚不可由 Agent 调用：** 本仓库没有 MCP transport、MCP server、tool registration、Worker、托管端点或 Agent 身份验证。

产品成熟度与调用能力相互独立。证据门槛与 badge 规则见[成熟度与能力标签](docs/MATURITY.zh-CN.md)。

## 目录结构

```text
.
├── .github/
│   ├── dependabot.yml
│   └── workflows/       # native/WASM、文档和供应链检查
├── crates/
│   ├── template_core/  # 平台无关行为和稳定数据契约
│   └── template_web/   # 精简 wasm-bindgen 边界、浏览器工具和 smoke 测试
├── docs/                # 发布准备与成熟度治理
├── scripts/             # 离线文档检查和 fixture 测试
├── deny.toml
└── Cargo.toml
```

`template_core` 不依赖 WebAssembly。`template_web` 不重复任何业务校验；它只调用 `template_core::run`，并把结果转换为 JavaScript 对象。

## 契约

Rust 入口如下：

```rust
pub fn run(name: &str) -> Result<Response, CoreError>
```

JavaScript 边界的成功响应如下：

```json
{
  "ok": true,
  "data": {
    "schemaVersion": 1,
    "output": "Hello, Tinkora!"
  }
}
```

空输入或全空白输入返回：

```json
{
  "ok": false,
  "error": {
    "code": "EMPTY_INPUT",
    "message": "Name must not be empty."
  }
}
```

应把 `schemaVersion`、错误 code 和序列化字段名视为兼容性承诺。

## 环境要求

- Rust 1.85 或更高版本，并安装 `wasm32-unknown-unknown` target
- `wasm-pack` 0.15.0
- Node.js 24 或更高版本，用于浏览器 smoke 测试

## 开发

在仓库根目录运行 Rust 检查：

```bash
cargo fmt --all -- --check
cargo test --workspace
cargo clippy --workspace --all-targets -- -D warnings
cargo check -p template_web --target wasm32-unknown-unknown
```

构建并打开本地工具：

```bash
cd crates/template_web
npm ci
npm run build:wasm
npm run serve
```

打开 `http://127.0.0.1:4173/web/`。

首次安装 Chromium 后，运行真实 WASM smoke 测试：

```bash
cd crates/template_web
npx --no-install playwright install chromium
npm run build:wasm
npm run test:wasm-smoke
```

Smoke 测试会独占自己启动的 HTTP server，不会复用其他进程。若 4173 端口已被占用，可仅为本次运行指定空闲端口，例如 `PLAYWRIGHT_PORT=4174 npm run test:wasm-smoke`。

运行文档检查：

```bash
npx --yes markdownlint-cli2@0.23.2 "**/*.md"
ruby scripts/test_check_docs.rb
ruby scripts/check_docs.rb
ruby scripts/test_check_workflow_contracts.rb
ruby scripts/check_workflow_contracts.rb
```

使用 Rust 1.88 或更新版本安装固定审计工具，再检查锁定的依赖图：

```bash
cargo +1.88.0 install cargo-deny --version 0.20.2 --locked
cargo +1.88.0 install cargo-audit --version 0.22.2 --locked
cargo deny check advisories bans licenses sources
cargo audit
```

审计 toolchain 不会改变 workspace 的 Rust 1.85 MSRV。

生成的 `pkg/`、`node_modules/`、Rust `target/` 和 Playwright 产物均已忽略，不得提交。

## CI

`.github/workflows/quality.yml` 以完整 commit SHA 调用组织的 Rust 与 WASM reusable workflow。WASM job 构建 crate，把该次真实 artifact 交给固定的 `test:wasm-smoke` 脚本，并在 375、768、1024 与 1440 px 视口运行 Chromium。

`.github/workflows/docs-quality.yml` 运行固定 SHA 的 Markdown action、checker fixture suite 和离线 tracked-file checker。`.github/workflows/supply-chain.yml` 在 pull request、`main`、每周 schedule 和手动触发时调用固定 SHA 的 reusable audit workflow。它使用 Rust 1.88.0 安装 `cargo-deny` 0.20.2 与 `cargo-audit` 0.22.2，并检查 advisories、bans、licenses 和 sources。

所有 workflow 都只有只读 `contents` 权限，不继承 secrets，也不包含 deploy、release 或 publish job。
提交 [`c84ad7b`](https://github.com/Tinkora/repo-template-rust-wasm/commit/c84ad7b46390672c89388eccfd0967533a19f2f2)
的托管证据保留在成功的
[Quality](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308297982)、
[Documentation quality](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308297753)
和 [Supply chain](https://github.com/Tinkora/repo-template-rust-wasm/actions/runs/31308298024)
运行中。Reusable 调用固定到 `Tinkora/.github` 中已验证的组织基线提交；
`scripts/check_workflow_contracts.rb` 会拒绝旧组织、浮动 ref 或缺失的必需调用。

Dependabot 按 `Asia/Shanghai` 时区每周检查 GitHub Actions、Cargo 和 web crate 的 npm 依赖。每个生态的 patch/minor 更新会分组，常规 PR 上限为 2 个，7 天 cooldown 只用于常规更新；major 更新独立提交供迁移审查，安全更新不会被 cooldown 延迟。

任何获授权的发布前都应遵循[发布前检查清单](docs/RELEASE_CHECKLIST.zh-CN.md)。本地候选验证不授权创建 tag、GitHub Release 或发布凭据。

## 隐私边界

工具只在浏览器内存中处理输入，不持久化也不传输输入。随附服务器只绑定 `127.0.0.1`。安装依赖和首次安装工具时可能访问当前配置的 Cargo 与 npm registry；请按所在环境审查依赖及 registry 配置。

## 限制

- 示例行为有意限制为一种问候。
- 当前 schema 只是未来集成的草案，不是 Agent 协议。
- 没有持久化、网络 API、身份验证、Worker 或 MCP transport。
- 本模板不对部署或生产加固作出承诺。

## 许可证

MIT，详见 [LICENSE](LICENSE)。

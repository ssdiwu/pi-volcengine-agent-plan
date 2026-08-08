# AGENTS.md — pi-volcengine-agent-plan

## 项目定位与权威

`pi-volcengine-agent-plan` 是火山方舟 Agent Plan 的 Pi provider 扩展：注册 `volcengine-agent-plan` 并连接 Agent Plan endpoint，不兼容 Coding Plan、普通按量 API 或其它火山引擎产品。

- 先读 `README.md` 与 `doc/README.md`，再读接口事实文档、`package.json`、`index.ts` 和相关测试。
- endpoint、模型目录、能力元数据与凭据解析以实现和 `doc/20-能力参考/` 的已验证事实为权威；本文件不复制当前模型示例、数量、版本或阶段计划。

## 接口与安全边界

- 只通过 Pi credential store 或受支持的环境变量读取凭据，绝不写入仓库、日志、缓存或测试快照。
- 只接 Agent Plan endpoint；不得顺带兼容 Coding Plan 或普通按量 API，也不得把 `models.json` 的用户覆盖语义搬进扩展。
- 模型能力元数据必须来自已验证清单，不能从未经验证的远端响应直接采信。目录或能力变更时同步实现、事实文档和测试。
- 远端动态发现需要额外的管控面认证与签名，不属于现有 provider 调用链；未经明确需求和安全设计，不在扩展内补写 HMAC 管控面实现。
- 认证、配额和网络错误必须显式返回，不清空可用目录、不泄漏请求头或凭据，也不能把失败伪装为模型不可用之外的成功状态。

## 验证与外部动作

离线检查：

```bash
npm run check
npm test
pi -e . --list-models | grep volcengine-agent-plan
```

- 测试默认不得发起真实网络请求。真实流式冒烟命令以 README 为准，仅在用户明确授权、凭据与额度可用时执行，并记录 provider、命令、响应边界和未覆盖项。
- 用户可感知变化同步 README 与 `CHANGELOG.md` 的 `Unreleased`（文件存在时）。
- 未经用户明确授权，不创建 commit，不执行 `git push`、推送 tag、`npm publish`，也不发起真实模型请求或其它外部系统写入。

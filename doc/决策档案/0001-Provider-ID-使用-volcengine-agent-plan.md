# 0001 — Provider ID 使用 volcengine-agent-plan

## 状态

已采纳（2026-07）

## 上下文

火山方舟有三套不同的 endpoint 与计费：

- Agent Plan：`api/plan/v3`
- Coding Plan：`api/coding/v3`
- 普通按量：`api/v3`

本机已有 `models.json` 中的 `volcengine` 条目指向 Agent Plan，但通用名 `volcengine` 无法表达产品线差异。

## 决策

本扩展的 provider ID 定为 `volcengine-agent-plan`，endpoint 固定为 `api/plan/v3`。

## 理由

1. 与 Coding Plan、普通按量 API 在命名上清晰分离。
2. 凭据与 endpoint 绑定，避免用户把 Coding Plan key 误配到 Agent Plan 或反之。
3. 本机已有 `volcengine` 条目可继续作为 models.json 覆盖层；扩展使用独立 ID 不互相覆盖。

## 后果

- 用户需对 `volcengine-agent-plan` 单独 `/login` 或设置 `$ARK_API_KEY`。
- 与 marketplace 上已有的 `volcengine-plan`（Coding Plan）扩展不冲突。
- 若未来做 Coding Plan 扩展，应使用另一独立 ID（如 `volcengine-coding-plan`）。

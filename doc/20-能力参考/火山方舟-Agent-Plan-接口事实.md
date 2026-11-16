# 火山方舟 Agent Plan 接口事实

本文件是 `volcengine-agent-plan` provider 的现行边界与现行模型目录。外部来源链接与核实记录归档在 `doc/references/火山方舟-Agent-Plan-来源与验证记录.md`；现行实现见 `index.ts`。

两者冲突时，以 `index.ts` 为准，并同步修订本文件。

## Endpoint

| 用途 | Base URL |
|---|---|
| Agent Plan（OpenAI 兼容） | `https://ark.cn-beijing.volces.com/api/plan/v3` |
| Agent Plan（Anthropic 兼容） | `https://ark.cn-beijing.volces.com/api/plan/compatible` |

**关键边界**：`api/plan/v3`、`api/coding/v3`、`api/v3` 是三个不同产品线，API Key、模型范围、计费方式不同。本扩展只接 `api/plan/v3`。

## 认证

- 数据面 API 使用 `Authorization: Bearer <ARK_API_KEY>`。
- 管控面 API（如 `ListArkAgentPlanModel`）使用火山引擎 HMAC-SHA256 签名，不是普通 Bearer Key，**不在 v1 范围**。

## 模型发现

- 官方提供 `ListArkAgentPlanModel`，但需要管控面 AK/SK 与 HMAC-SHA256 签名，且响应只返回 `{ ModelID }`，不含 context window、max output、vision、thinking 或价格。
- **结论**：v1 采用静态已验证模型目录，不动态发现。模型 ID 来自套餐文档与人工验证；能力元数据（context、max output、vision、thinking）由人工维护。

## 协议兼容

- OpenAI Chat Completions 兼容；支持 streaming、tool calling、image 输入（视模型）、深度思考。
- 深度思考（reasoning）通过 OpenAI 兼容的 `thinking` / `reasoning_effort` 控制。
- `developer` 角色不被接受，需用 `system`（`compat.supportsDeveloperRole = false`）。
- `max_tokens` 字段而非 `max_completion_tokens`（`compat.maxTokensField = "max_tokens"`）。

## 模型目录（现行）

与 `index.ts` 的 `MODELS` 一一对应，变更时两处同改。

| Model ID | Context | Max Output | Input |
|---|---|---|---|
| `doubao-seed-2.1-turbo` | 256000 | 256000 | text, image |
| `doubao-seed-evolving` | 1024000 | 256000 | text, image |
| `glm-5.2` | 1024000 | 128000 | text |
| `deepseek-v4-flash` | 1024000 | 384000 | text |
| `deepseek-v4-pro` | 1024000 | 384000 | text |
| `doubao-seed-2.0-code` | 256000 | 128000 | text, image |
| `doubao-seed-2.0-pro` | 256000 | 128000 | text, image |
| `doubao-seed-2.0-lite` | 256000 | 128000 | text, image |
| `doubao-seed-2.0-mini` | 256000 | 128000 | text, image |
| `minimax-m2.7` | 200000 | 128000 | text |
| `minimax-m3` | 1024000 | 128000 | text, image |
| `kimi-k2.6` | 256000 | 32000 | text, image |
| `kimi-k2.7-code` | 256000 | 32000 | text |
| `kimi-k3` | 1024000 | 128000 | text, image |

思考档位映射：火山 `minimal` 表示「不思考」，Pi 有独立的 `off`，故隐藏 `minimal` 并向上取到 `low`；`xhigh → "max"` 只对已验证接受 `max` 思考档的模型开放（`deepseek-v4-flash`、`deepseek-v4-pro`）。

另有独立的多模态模型（`doubao-seedance` 视频、`doubao-seedream` 图像、`doubao-embedding-vision` 向量），不属于本 Chat Completions 编码 provider 目录。

## 计费

Agent Plan 采用订阅式积分计费（AFP），非按量 token 计费。因此模型 `cost` 字段登记为 0；Pi 的 `/cost` 仅作占位，不代表真实扣费。

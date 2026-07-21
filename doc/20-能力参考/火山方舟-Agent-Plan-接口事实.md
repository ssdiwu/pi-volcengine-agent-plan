# 火山方舟 Agent Plan 接口事实

本文件记录实现 `volcengine-agent-plan` provider 所依据的官方事实与边界。所有结论标注来源与核实日期（2026-07）。

## Endpoint

| 用途 | Base URL | 来源 |
|---|---|---|
| Agent Plan（OpenAI 兼容） | `https://ark.cn-beijing.volces.com/api/plan/v3` | [接入三方工具](https://www.volcengine.com/docs/82379/2160841)、[其他工具](https://www.volcengine.com/docs/82379/2374473) |
| Agent Plan（Anthropic 兼容） | `https://ark.cn-beijing.volces.com/api/plan/compatible` | 同上 |

**关键边界**：`api/plan/v3`、`api/coding/v3`、`api/v3` 是三个不同产品线，API Key、模型范围、计费方式不同。本扩展只接 `api/plan/v3`。

## 认证

- 数据面 API 使用 `Authorization: Bearer <ARK_API_KEY>`。
- 来源：[Base URL 及鉴权](https://www.volcengine.com/docs/82379/1298459)。
- 管控面 API（如 `ListArkAgentPlanModel`）使用火山引擎 HMAC-SHA256 签名，不是普通 Bearer Key，**不在 v1 范围**。

## 模型发现

- 官方提供 `ListArkAgentPlanModel`（`POST /?Action=ListArkAgentPlanModel&Version=2024-01-01`），但：
  - 需要管控面 AK/SK 与 HMAC-SHA256 签名。
  - 响应只返回 `{ ModelID }`，不含 context window、max output、vision、thinking 或价格。
- 本机只读探测 `GET https://ark.cn-beijing.volces.com/api/plan/v3/models` 返回 `404`（2026-07-21）。
- **结论**：v1 采用静态已验证模型目录，不动态发现。模型 ID 来自套餐文档与人工验证；能力元数据（context、max output、vision、thinking）由人工维护。

## 协议兼容

- OpenAI Chat Completions 兼容；支持 streaming、tool calling、image 输入（视模型）、深度思考。
- 深度思考（reasoning）通过 OpenAI 兼容的 `thinking` / `reasoning_effort` 控制；参考 [深度思考](https://www.volcengine.com/docs/82379/1449737)。
- `developer` 角色不被接受，需用 `system`（`compat.supportsDeveloperRole = false`）。
- `max_tokens` 字段而非 `max_completion_tokens`（`compat.maxTokensField = "max_tokens"`）。

## 模型目录（已验证基线）

官方文本/编码模型完整清单，来自 [OpenClaw 接入文档](https://www.volcengine.com/docs/82379/2373742)（2026-07 核对）：

| Model ID | Context | Max Output | Input |
|---|---|---|---|
| `ark-code-latest` | 256000 | 32000 | text, image |
| `doubao-seed-evolving` | 1024000 | 256000 | text, image |
| `glm-5.2` | 1024000 | 128000 | text |
| `glm-latest` | 1024000 | 128000 | text |
| `deepseek-v4-flash` | 1024000 | 384000 | text |
| `deepseek-v4-pro` | 1024000 | 384000 | text |
| `doubao-seed-2.0-code` | 256000 | 65536 | text, image |
| `doubao-seed-2.0-pro` | 256000 | 65536 | text, image |
| `doubao-seed-2.0-lite` | 256000 | 65536 | text, image |
| `doubao-seed-2.0-mini` | 256000 | 65536 | text, image |
| `minimax-m2.7` | 200000 | 128000 | text |
| `minimax-m3` | 512000 | 128000 | text, image |
| `kimi-k2.6` | 256000 | 32000 | text, image |
| `kimi-k2.7-code` | 256000 | 32000 | text |
| `kimi-k3` | 1024000 | 65536 | text, image |


另有独立的多模态模型（`doubao-seedance` 视频、`doubao-seedream` 图像、`doubao-embedding-vision` 向量），不属于本 Chat Completions 编码 provider 目录。

> 数值采用各模型官方能力上限；若套餐端对个别模型有限额差异，通过本机 `models.json` 覆盖层覆盖。

## 计费

Agent Plan 采用订阅式积分计费（AFP），非按量 token 计费。因此模型 `cost` 字段登记为 0；Pi 的 `/cost` 仅作占位，不代表真实扣费。来源：[套餐概览](https://www.volcengine.com/docs/82379/2366394)。

# 火山方舟 Agent Plan 来源与验证记录

本文件是来源与验证证据的归档，不是现行规格。现行模型目录与边界见 `doc/规格/火山方舟-Agent-Plan-接口事实.md`；现行实现见 `index.ts`。

本文件内容按当时的核实日期原样保留，用于追溯结论从哪里来、什么时候核实过。数值与清单可能落后于现行实现。

## 来源与核实日期

所有结论标注来源与核实日期（2026-07）。

| 事项 | 来源 |
|---|---|
| Agent Plan（OpenAI 兼容）Base URL `https://ark.cn-beijing.volces.com/api/plan/v3` | [接入三方工具](https://www.volcengine.com/docs/82379/2160841)、[其他工具](https://www.volcengine.com/docs/82379/2374473) |
| Agent Plan（Anthropic 兼容）Base URL `https://ark.cn-beijing.volces.com/api/plan/compatible` | 同上 |
| 数据面鉴权 `Authorization: Bearer <ARK_API_KEY>` | [Base URL 及鉴权](https://www.volcengine.com/docs/82379/1298459) |
| 深度思考控制字段（`thinking` / `reasoning_effort`） | [深度思考](https://www.volcengine.com/docs/82379/1449737) |
| 官方文本/编码模型完整清单 | [OpenClaw 接入文档](https://www.volcengine.com/docs/82379/2373742)（2026-07 核对） |
| 订阅式积分计费（AFP），非按量 token | [套餐概览](https://www.volcengine.com/docs/82379/2366394) |

## 验证记录

- 管控面 `ListArkAgentPlanModel`（`POST /?Action=ListArkAgentPlanModel&Version=2024-01-01`）需要火山引擎 HMAC-SHA256 签名，不是普通 Bearer Key；响应只返回 `{ ModelID }`，不含 context window、max output、vision、thinking 或价格。
- 本机只读探测 `GET https://ark.cn-beijing.volces.com/api/plan/v3/models` 返回 `404`（2026-07-21）。
- 模型 ID 来自套餐文档与人工验证；能力元数据（context、max output、vision、thinking）由人工维护。

## 已验证基线（2026-07 快照）

官方文本/编码模型清单，来自 [OpenClaw 接入文档](https://www.volcengine.com/docs/82379/2373742)（2026-07 核对）：

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

> 该快照为 2026-07 状态，后续变更见 `CHANGELOG.md`；当前生效目录以 `doc/规格/火山方舟-Agent-Plan-接口事实.md` 与 `index.ts` 为准。

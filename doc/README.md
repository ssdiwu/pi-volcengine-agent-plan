# pi-volcengine-agent-plan

火山方舟 Agent Plan 的 Pi provider 扩展：注册 `volcengine-agent-plan`，直连 `api/plan/v3`，仅覆盖 Agent Plan 套餐。

本文件只做文档入口，不承载规格正文。

## 先读顺序

1. `README.md`（项目根）— 是什么、怎么跑、怎么验证。
2. 本文件 — 文档地图。
3. `doc/规格/火山方舟-Agent-Plan-接口事实.md` — 现行接口边界与现行模型目录。
4. `index.ts` — 当前实现。

## 文档分层

| 类别 | 位置 | 放什么 |
|---|---|---|
| 现行规格 | `doc/规格/火山方舟-Agent-Plan-接口事实.md` | 现行边界、协议兼容、现行模型目录；与 `index.ts` 对齐 |
| 现行机制 | `index.ts` | provider 注册、认证解析、模型目录的实际代码；本仓库没有独立的机制正文目录 |
| 决策档案 | `doc/决策档案/` | 难逆转、无上下文会困惑、有真实权衡的决定 |
| 来源与验证 | `doc/references/` | 外部文档链接、核实日期、本机探测记录等证据；不是现行权威 |
| 版本变更 | `CHANGELOG.md` | 用户可感知的版本变更记录 |
| 本机原始现场 | `.artifacts/`（Git 忽略） | 截图、抓包、原始日志等本机现场，不进版本库 |

本仓库暂无 `doc/架构/`、`doc/术语表.md`、`doc/经验笔记.md`：没有对应内容，不建空目录。

## 权威与冲突处理

- 现行权威：`index.ts` 与 `doc/规格/`。两者冲突时以 `index.ts` 为准，并同步修订 `doc/规格/`。
- 决策权威：`doc/决策档案/README.md`（仅收难逆转、无上下文会困惑、有真实权衡的决策）。
- `doc/references/` 只记录来源与验证证据，不作为现行目录或边界的依据。
- 执行状态：无 `PLAN.md`。

## 归档边界

- `doc/references/` — 来源与验证记录归档，不删除。
- `.artifacts/` — 本机原始现场归档位置，已被 `.gitignore` 忽略。
- 版本历史：`CHANGELOG.md`。

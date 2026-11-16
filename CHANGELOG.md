# Changelog

本文件记录每个版本对使用者可感知的变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本以 Git tag 为准。

## [Unreleased]

### Changed

- 文档分层：`doc/20-能力参考/火山方舟-Agent-Plan-接口事实.md` 保留为现行边界与现行模型目录；外部来源链接、核实日期与本机探测记录下沉到 `doc/references/火山方舟-Agent-Plan-来源与验证记录.md`。模型目录表与 `index.ts` 对齐（移除 `ark-code-latest`、`glm-latest`，补 `doubao-seed-2.1-turbo`，修正 `doubao-seed-2.0-*` 与 `kimi-k3` 最大输出、`minimax-m3` 上下文窗口）。
- `doc/README.md` 只做入口，补充分层表、权威与冲突处理、归档边界；新增 `doc/决策档案/0002-v1-不做远端模型动态发现.md` 记录既有的静态模型目录决策。
- `.gitignore` 增加 `.artifacts/`，作为本机原始现场的归档位置。

## [0.1.0] - 2026-08-09

### Fixed

- 仅设置 `VOLCENGINE_API_KEY` 时，凭据来源标签误标为 `ARK_API_KEY`（现按 stored > ARK > VOLCENGINE 逐级判断，保留真实来源）。
- README 本地开发命令改为仓库根相对 `pi -e .`，移除个人绝对路径。

### Added

- 新增 `doubao-seed-2.1-turbo` 模型（进阶，256k 上下文 / 256k 输出，文本+图像）。

### Changed

- 按 2026.08 官方套餐概览修正 `doubao-seed-2.0-mini/lite/code/pro` 与 `kimi-k3` 最大输出（64k→128k）、`minimax-m3` 上下文窗口（512k→1024k）。
- 移除 `ark-code-latest`（官方套餐支持模型表格未列）与 `glm-latest`（与 `glm-5.2` 为同一模型，收敛别名）。

## [0.0.3] - 2026-07-31

### Fixed

- 统一 Pi `0.83` 开发依赖基线，修复依赖版本混用导致的 TypeScript 类型检查失败。

## [0.0.2] - 2026-07-22

### Fixed

- 默认值改用各模型官方能力上限（context window、max output、vision），不再使用 OpenClaw 文档的保守默认值；`kimi-k2.7-code` 在 Agent Plan 上为 text-only。
- `minimal` 思考档位全部隐藏（火山的 `minimal` 表示"不思考"）。

## [0.0.1] - 2026-07-22

### Added

- 注册 `volcengine-agent-plan` provider，直连火山方舟 Agent Plan endpoint（`https://ark.cn-beijing.volces.com/api/plan/v3`）。
- 通过 `/login` 交互式录入或 `$ARK_API_KEY` / `$VOLCENGINE_API_KEY` 环境变量解析 API Key。
- 内置官方 Agent Plan 全部 15 个文本/编码模型目录；`xhigh` 思考档位仅对 ark-code-latest、deepseek-v4-flash/pro 开放。

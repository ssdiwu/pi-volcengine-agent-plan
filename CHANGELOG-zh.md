# 变更日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 的基本格式。带 tag 的发布以 Git tag 为版本号；已发布版本由发布负责人负责维护英文 `CHANGELOG.md`，本文件是对应版本的中文镜像。两份日志只记录用户可感知事实，日常用中文记录，准备发布（release）时按版本同步到英文，并都随 npm 包发布。

新发布使用 `## [x.y.z] - YYYY-MM-DD` 格式的标题；条目可唯一对应 GitHub issue 时，在末尾附 `(#xx)`。历史条目保留原有标题格式。

## [Unreleased]

## [0.1.1] - 2026-11-25

### Changed

- 支持 Pi 1.6.0。
- 修正文档中的模型目录，使其与扩展实际提供的模型一致。目录补列 `doubao-seed-2.1-turbo`，移除已淘汰的 `ark-code-latest` 和 `glm-latest` 别名，并修正 `doubao-seed-2.0-*`、`kimi-k3` 的最大输出及 `minimax-m3` 的上下文窗口。

## [0.1.0] - 2026-08-09

### Fixed

- 只设置 `VOLCENGINE_API_KEY` 时，凭据来源标签曾错误显示为 `ARK_API_KEY`（现在按 已存储 > ARK > VOLCENGINE 顺序检查，并保留真实来源）。
- README 的本地开发命令改为相对仓库根目录的 `pi -e .`，去掉个人绝对路径。

### Added

- 新增 `doubao-seed-2.1-turbo` 模型（高级，256k 上下文 / 256k 输出，文本 + 图片）。

### Changed

- 依据 2026 年 8 月官方 Plan 概览，修正 `doubao-seed-2.0-mini/lite/code/pro` 与 `kimi-k3` 的最大输出（64k→128k）以及 `minimax-m3` 的上下文窗口（512k→1024k）。
- 移除 `ark-code-latest`（官方 Plan 支持模型表中未列出）与 `glm-latest`（与 `glm-5.2` 是同一模型；别名已合并）。

## [0.0.3] - 2026-07-31

### Fixed

- 统一 Pi `0.83` 开发依赖基线，修复混合依赖版本导致的 TypeScript 类型检查失败。

## [0.0.2] - 2026-07-22

### Fixed

- 默认值改用各模型的官方能力上限（上下文窗口、最大输出、视觉），不再使用 OpenClaw 文档中的保守默认值；`kimi-k2.7-code` 在 Agent Plan 上仅支持文本。
- 在所有位置隐藏 `minimal` 思考档位（火山方舟的 `minimal` 表示“不思考”）。

## [0.0.1] - 2026-07-22

### Added

- 注册 `volcengine-agent-plan` provider，直接连接火山方舟 Agent Plan 端点（`https://ark.cn-beijing.volces.com/api/plan/v3`）。
- 通过交互式 `/login` 输入或环境变量 `$ARK_API_KEY` / `$VOLCENGINE_API_KEY` 解析 API Key。
- 随包提供官方 Agent Plan 全部 15 个文本/编码模型；`xhigh` 思考档位仅对 ark-code-latest 与 deepseek-v4-flash/pro 可用。

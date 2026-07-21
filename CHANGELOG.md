# Changelog

本文件记录每个版本对使用者可感知的变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本以 Git tag 为准。

## [Unreleased]

### Added

- 注册 `volcengine-agent-plan` provider，直连火山方舟 Agent Plan endpoint（`https://ark.cn-beijing.volces.com/api/plan/v3`）。
- 通过 `/login` 交互式录入或 `$ARK_API_KEY` / `$VOLCENGINE_API_KEY` 环境变量解析 API Key。
- 内置官方 Agent Plan 全部 15 个文本/编码模型目录（含 context window、max output、vision 与 thinking level 映射、OpenAI 兼容参数）；`xhigh` 思考档位仅对 ark-code-latest、deepseek-v4-flash/pro 开放。

# Changelog

This project follows the basic format of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). For tagged releases, use the version from the Git tag. The tagged release is maintained by the release owner in this English `CHANGELOG.md`; daily user-perceivable changes are recorded in the Chinese `CHANGELOG-zh.md` in this repository. Both files contain user-perceivable facts only and ship in the npm package.

For new releases, use headings in the format `## [x.y.z] - YYYY-MM-DD`. When an entry can be linked unambiguously to a GitHub issue, append `(#xx)`. Historical entries keep their original heading format.

## [Unreleased]

## [0.1.1] - 2026-11-25

### Changed

- Supports Pi 1.6.0.
- Documentation layering: `doc/规格/火山方舟-Agent-Plan-接口事实.md` remains the current boundary and current model catalog; external source links, verification dates, and local probe records move down to `doc/references/火山方舟-Agent-Plan-来源与验证记录.md`. The model catalog table is aligned with `index.ts` (removed `ark-code-latest` and `glm-latest`, added `doubao-seed-2.1-turbo`, corrected maximum outputs for `doubao-seed-2.0-*` and `kimi-k3`, and the context window for `minimax-m3`).
- `doc/README.md` now serves only as an entry point, with a layering table, authority/conflict handling, and archival boundaries added; added `doc/决策档案/0002-v1-不做远端模型动态发现.md` to record the existing decision to use a static model catalog.
- Added `.artifacts/` to `.gitignore` as the archive location for raw local artifacts.

## [0.1.0] - 2026-08-09

### Fixed

- When only `VOLCENGINE_API_KEY` was set, the credential-source label was incorrectly shown as `ARK_API_KEY` (it now checks stored > ARK > VOLCENGINE in order and preserves the real source).
- Changed the README's local development command to the repo-root-relative `pi -e .`, removing a personal absolute path.

### Added

- Added the `doubao-seed-2.1-turbo` model (advanced, 256k context / 256k output, text + images).

### Changed

- Corrected maximum outputs for `doubao-seed-2.0-mini/lite/code/pro` and `kimi-k3` (64k→128k) and the `minimax-m3` context window (512k→1024k) according to the August 2026 official plan overview.
- Removed `ark-code-latest` (not listed in the official plan's supported-model table) and `glm-latest` (the same model as `glm-5.2`; aliases consolidated).

## [0.0.3] - 2026-07-31

### Fixed

- Unified the Pi `0.83` development dependency baseline, fixing TypeScript type-check failures caused by mixed dependency versions.

## [0.0.2] - 2026-07-22

### Fixed

- Default values now use each model's official capability limits (context window, max output, vision) instead of the conservative defaults from OpenClaw documentation; `kimi-k2.7-code` is text-only on Agent Plan.
- Hid the `minimal` thinking level everywhere (Volcengine's `minimal` means "no thinking").

## [0.0.1] - 2026-07-22

### Added

- Registered the `volcengine-agent-plan` provider, connecting directly to the Volcengine Ark Agent Plan endpoint (`https://ark.cn-beijing.volces.com/api/plan/v3`).
- Resolves the API key through interactive `/login` input or the `$ARK_API_KEY` / `$VOLCENGINE_API_KEY` environment variables.
- Ships the full catalog of 15 official Agent Plan text/coding models; the `xhigh` thinking level is available only for ark-code-latest and deepseek-v4-flash/pro.

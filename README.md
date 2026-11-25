# pi-volcengine-agent-plan

English · [简体中文](./README-zh.md)

A custom [Pi](https://pi.dev) provider extension for the Volcengine Ark **Agent Plan** subscription.

## What it is

Registers a `volcengine-agent-plan` provider that connects directly to the dedicated Agent Plan endpoint (`https://ark.cn-beijing.volces.com/api/plan/v3`) and calls models in the plan through the OpenAI-compatible Chat Completions protocol. It handles Agent Plan only — not Coding Plan, standard pay-as-you-go APIs, or other Volcengine products.

## Who it is for

Developers with a personal Volcengine Ark Agent Plan subscription who want to use the plan's coding models directly in Pi.

## How to run

```bash
pi install npm:pi-volcengine-agent-plan
# or, from this repository root for local development
pi -e .
```

Configure the API key (either way):

```bash
export ARK_API_KEY=your-volcengine-ark-api-key
# or choose volcengine-agent-plan after /login inside Pi
```

Then pick a model under `volcengine-agent-plan` with `/model`, or run:

```bash
pi --model volcengine-agent-plan/glm-5.2
```

## Development, tests, and public contracts

- Development and contribution rules: [`AGENTS.md`](./AGENTS.md) and [`doc/README.md`](./doc/README.md).
- Tests: [`test/README.md`](./test/README.md) and [`test/provider.test.ts`](./test/provider.test.ts); behavior checks cover provider registration, model configuration, and compatibility.
- Public contract: the current boundary and model catalog are in [`doc/规格/火山方舟-Agent-Plan-接口事实.md`](./doc/规格/火山方舟-Agent-Plan-接口事实.md) (Chinese), aligned with the implementation in [`index.ts`](./index.ts). External sources, verification dates, and probe records live in [`doc/references/`](./doc/references/) and are not current authority.

## Directories and entry points

- `index.ts` — extension entry: provider registration, authentication, and model catalog.
- `doc/` — document map and layering: [`doc/README.md`](./doc/README.md) is the map, `doc/规格/` holds current facts, `doc/决策档案/` the decision archive, and `doc/references/` sources and verification evidence.
- `test/` — provider registration, model configuration, and compatibility behavior tests.

## Verification

```bash
npm run check   # type-check
npm test        # behavior tests
pi --list-models | grep volcengine-agent-plan
```

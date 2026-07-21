# pi-volcengine-agent-plan

火山方舟（Volcengine Ark）**Agent Plan** 订阅套餐的 [Pi](https://pi.dev) 自定义 provider 扩展。

## 这是什么

注册一个 `volcengine-agent-plan` provider，直连火山方舟 Agent Plan 专属 endpoint（`https://ark.cn-beijing.volces.com/api/plan/v3`），通过 OpenAI 兼容的 Chat Completions 协议调用套餐内的模型。只处理 Agent Plan，不处理 Coding Plan、普通按量 API 或其他火山引擎产品。

## 给谁用

已订阅火山方舟 Agent Plan 个人版、并希望在 Pi 中直接使用套餐内编码模型的开发者。

## 怎么运行

```bash
pi install npm:pi-volcengine-agent-plan
# 或本地开发
pi -e /Users/diwu/Workspace/Codes/Githubs/pi-volcengine-agent-plan
```

配置 API Key（任选其一）：

```bash
export ARK_API_KEY=你的火山方舟 API Key
# 或在 Pi 内 /login 后选择 volcengine-agent-plan
```

随后用 `/model` 选择 `volcengine-agent-plan` 下的模型，或：

```bash
pi --model volcengine-agent-plan/glm-5.2
```

## 目录与入口

- `index.ts` — 扩展入口，注册 provider、认证与模型目录。
- `doc/` — 设计依据、能力边界与决策档案。
- `test/` — provider 注册、模型配置与兼容性行为测试。

## 验证

```bash
npm run check   # 类型检查
npm test        # 行为测试
pi --list-models | grep volcengine-agent-plan
```

# AGENTS.md — pi-volcengine-agent-plan

## 项目一句话定位

火山方舟 Agent Plan 的 Pi provider 扩展：注册 `volcengine-agent-plan`，直连 `api/plan/v3`，仅覆盖 Agent Plan 套餐，不处理 Coding Plan、普通按量 API 或其他火山引擎产品。

## 先读文档顺序

1. `README.md` — 是什么、怎么跑。
2. `doc/README.md` — 文档地图。
3. `doc/20-能力参考/火山方舟-Agent-Plan-接口事实.md` — 官方接口事实与边界。
4. `index.ts` — 当前实现。

## 代码边界与安全边界

- 只通过 Pi 的 credential store 或环境变量读取凭据，绝不写入仓库、日志或缓存。
- 只接 Agent Plan endpoint，不顺带兼容 Coding Plan（`api/coding/v3`）或普通按量 API（`api/v3`）。
- 模型能力元数据（context、max output、vision、thinking）必须来自已验证的人工清单，不从未经验证的远端响应直接采信。
- 认证失败、网络失败时保留上一份已知模型列表，不清空、不崩溃。

## 验证方式

```bash
npm run check                              # 类型检查（tsc --noEmit）
npm test                                   # 行为测试
pi -e . --list-models | grep volcengine-agent-plan
```

真实流式冒烟测试（需已配置 `ARK_API_KEY`）：

```bash
pi -e . -p "用一句话回答 1+1" --model volcengine-agent-plan/glm-5.2
```

## 项目特有禁忌

- 不硬编码 API Key。
- 不在本扩展内实现火山引擎管控面签名（HMAC-SHA256）；`ListArkAgentPlanModel` 的动态发现留到后续版本且需额外 AK/SK，不在 v1 范围。
- 不把 `models.json` 的用户覆盖语义搬进扩展；`models.json` 继续作为本机覆盖层。

## 代码工程纪律

- 删除测试判断模块价值：删掉某个抽象后复杂度消失即透传（删）；复杂度在多处重现即真减负（留）。
- 接缝纪律：只在真有变化处引入抽象；单一实现不提前抽接口。
- 函数粒度 100 行以内。
- 测试看行为不看实现；mock 只放系统边界。
- 先建反馈环再调 bug：临时 debug 日志打唯一前缀 tag（如 `[DEBUG-vap-a4f2]`），清理时一个 grep 全删。

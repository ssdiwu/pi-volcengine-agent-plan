/**
 * pi-volcengine-agent-plan
 *
 * Registers the `volcengine-agent-plan` provider for Volcengine Ark Agent Plan
 * (https://ark.cn-beijing.volces.com/api/plan/v3). Agent Plan only — not Coding
 * Plan or pay-as-you-go inference.
 *
 * Auth: `/login` prompts for the Ark API key, or resolve from
 * $ARK_API_KEY / $VOLCENGINE_API_KEY. models.json stays the override layer.
 */
import {
  createProvider,
  type ApiKeyCredential,
  type AuthInteraction,
  type Model,
} from "@earendil-works/pi-ai";
import { openAICompletionsApi } from "@earendil-works/pi-ai/compat";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export const PROVIDER_ID = "volcengine-agent-plan";
export const PROVIDER_NAME = "Volcengine Ark Agent Plan";
export const BASE_URL = "https://ark.cn-beijing.volces.com/api/plan/v3";

type ModelInput = ("text" | "image")[];

const TEXT_ONLY: ModelInput = ["text"];
const TEXT_AND_IMAGE: ModelInput = ["text", "image"];

const ZERO_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } as const;

// Agent Plan rejects the `developer` role and uses `max_tokens` (not
// `max_completion_tokens`). Reasoning models send DeepSeek-style thinking.
const BASE_COMPAT = {
  supportsDeveloperRole: false,
  maxTokensField: "max_tokens" as const,
};

const REASONING_COMPAT = {
  ...BASE_COMPAT,
  supportsReasoningEffort: true,
  thinkingFormat: "deepseek" as const,
};

// Volcengine `minimal` means "no thinking"; Pi has a separate `off`, so hide
// `minimal` and let it clamp up to `low`. xhigh -> "max" only on verified models.
const VOLC_TLM = { minimal: null } as const;
const VOLC_TLM_MAX = { ...VOLC_TLM, xhigh: "max" } as const;

interface AgentPlanModel {
  id: string;
  name: string;
  input: ModelInput;
  contextWindow: number;
  maxTokens: number;
  thinkingLevelMap?: typeof VOLC_TLM | typeof VOLC_TLM_MAX;
}

// Official Agent Plan text/coding model catalog. Values reflect each model's
// documented capability upper bounds (context window, max output, vision,
// thinking controls), cross-checked against the OpenClaw integration guide
// (2373742) and verified against the plan data plane. ~/.pi/agent/models.json
// stays the personal override layer for any per-environment tuning. Cost is 0
// because Agent Plan is subscription-billed via AFP, not per-token.
//
// thinkingLevelMap: VOLC_TLM_MAX (adds xhigh→"max") only for models verified to
// accept "max" reasoning effort (ark-code-latest, deepseek-v4-flash/pro).
export const MODELS: readonly AgentPlanModel[] = [
  { id: "ark-code-latest", name: "ark-code-latest (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 256000, maxTokens: 32000, thinkingLevelMap: VOLC_TLM_MAX },
  { id: "doubao-seed-evolving", name: "Doubao Seed Evolving (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 1024000, maxTokens: 256000, thinkingLevelMap: VOLC_TLM },
  { id: "glm-5.2", name: "GLM-5.2 (Ark Agent Plan)", input: TEXT_ONLY, contextWindow: 1024000, maxTokens: 128000, thinkingLevelMap: VOLC_TLM },
  { id: "glm-latest", name: "GLM Latest (Ark Agent Plan)", input: TEXT_ONLY, contextWindow: 1024000, maxTokens: 128000, thinkingLevelMap: VOLC_TLM },
  { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash (Ark Agent Plan)", input: TEXT_ONLY, contextWindow: 1024000, maxTokens: 384000, thinkingLevelMap: VOLC_TLM_MAX },
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro (Ark Agent Plan)", input: TEXT_ONLY, contextWindow: 1024000, maxTokens: 384000, thinkingLevelMap: VOLC_TLM_MAX },
  { id: "doubao-seed-2.0-code", name: "Doubao Seed 2.0 Code (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 256000, maxTokens: 65536, thinkingLevelMap: VOLC_TLM },
  { id: "doubao-seed-2.0-pro", name: "Doubao Seed 2.0 Pro (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 256000, maxTokens: 65536, thinkingLevelMap: VOLC_TLM },
  { id: "doubao-seed-2.0-lite", name: "Doubao Seed 2.0 Lite (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 256000, maxTokens: 65536, thinkingLevelMap: VOLC_TLM },
  { id: "doubao-seed-2.0-mini", name: "Doubao Seed 2.0 Mini (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 256000, maxTokens: 65536, thinkingLevelMap: VOLC_TLM },
  { id: "minimax-m2.7", name: "MiniMax M2.7 (Ark Agent Plan)", input: TEXT_ONLY, contextWindow: 200000, maxTokens: 128000, thinkingLevelMap: VOLC_TLM },
  { id: "minimax-m3", name: "MiniMax M3 (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 512000, maxTokens: 128000, thinkingLevelMap: VOLC_TLM },
  { id: "kimi-k2.6", name: "Kimi K2.6 (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 256000, maxTokens: 32000, thinkingLevelMap: VOLC_TLM },
  { id: "kimi-k2.7-code", name: "Kimi K2.7 Code (Ark Agent Plan)", input: TEXT_ONLY, contextWindow: 256000, maxTokens: 32000, thinkingLevelMap: VOLC_TLM },
  { id: "kimi-k3", name: "Kimi K3 (Ark Agent Plan)", input: TEXT_AND_IMAGE, contextWindow: 1024000, maxTokens: 65536, thinkingLevelMap: VOLC_TLM },
];

function buildModel(m: AgentPlanModel): Model<"openai-completions"> {
  return {
    id: m.id,
    name: m.name,
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: BASE_URL,
    reasoning: true,
    thinkingLevelMap: { ...(m.thinkingLevelMap ?? VOLC_TLM) },
    input: [...m.input],
    cost: { ...ZERO_COST },
    contextWindow: m.contextWindow,
    maxTokens: m.maxTokens,
    compat: { ...REASONING_COMPAT },
  };
}

async function login(interaction: AuthInteraction): Promise<ApiKeyCredential> {
  const key = await interaction.prompt({
    type: "secret",
    message: "Volcengine Ark API Key (ARK_API_KEY):",
    placeholder: "ark-...",
  });
  return { type: "api_key", key: key || undefined };
}

export default function volcengineAgentPlan(pi: ExtensionAPI): void {
  const provider = createProvider<"openai-completions">({
    id: PROVIDER_ID,
    name: PROVIDER_NAME,
    baseUrl: BASE_URL,
    auth: {
      apiKey: {
        name: "Volcengine Ark Agent Plan API key",
        login,
        async resolve({ ctx, credential }) {
          const key =
            credential?.key ??
            (await ctx.env("ARK_API_KEY")) ??
            (await ctx.env("VOLCENGINE_API_KEY"));
          if (!key) return undefined;
          return {
            auth: { apiKey: key },
            source: credential?.key ? "stored API key" : "ARK_API_KEY",
          };
        },
      },
    },
    models: MODELS.map(buildModel),
    api: openAICompletionsApi(),
  });

  pi.registerProvider(provider);
}

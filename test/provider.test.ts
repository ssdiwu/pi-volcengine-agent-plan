import { strict as assert } from "node:assert";
import { test } from "node:test";
import type { ApiKeyCredential, Provider } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import volcengineAgentPlan, { MODELS, PROVIDER_ID, BASE_URL } from "../index.ts";

function captureProvider(): Provider {
  let provider: Provider | undefined;
  const pi = {
    registerProvider(candidate: Provider) {
      provider = candidate;
    },
  } as unknown as ExtensionAPI;

  volcengineAgentPlan(pi);
  assert.ok(provider);
  return provider;
}

test("provider id and endpoint are Agent Plan specific", () => {
  assert.equal(PROVIDER_ID, "volcengine-agent-plan");
  assert.equal(BASE_URL, "https://ark.cn-beijing.volces.com/api/plan/v3");
  // Must NOT be the Coding Plan or pay-as-you-go endpoints.
  assert.ok(!BASE_URL.includes("/coding/"));
  assert.ok(BASE_URL.includes("/plan/v3"));
});

test("catalog covers the full official Agent Plan text/coding model set", () => {
  const expected = [
    "doubao-seed-2.1-turbo",
    "doubao-seed-evolving",
    "glm-5.2",
    "deepseek-v4-flash",
    "deepseek-v4-pro",
    "doubao-seed-2.0-code",
    "doubao-seed-2.0-pro",
    "doubao-seed-2.0-lite",
    "doubao-seed-2.0-mini",
    "minimax-m2.7",
    "minimax-m3",
    "kimi-k2.6",
    "kimi-k2.7-code",
    "kimi-k3",
  ];
  assert.deepEqual([...MODELS.map((m) => m.id)].sort(), expected.sort());
});

test("every model hides minimal thinking and is subscription-billed (zero cost)", () => {
  for (const m of MODELS) {
    assert.equal(m.thinkingLevelMap?.minimal, null, `${m.id}: minimal must be hidden`);
  }
});

test("xhigh reasoning effort is opt-in only for verified models", () => {
  const byId = Object.fromEntries(MODELS.map((m) => [m.id, m]));
  const withMax = MODELS.filter((m) => m.thinkingLevelMap && "xhigh" in m.thinkingLevelMap).map((m) => m.id).sort();
  assert.deepEqual(withMax, ["deepseek-v4-flash", "deepseek-v4-pro"]);
  assert.equal((byId["glm-5.2"].thinkingLevelMap as Record<string, string | null> | undefined)?.xhigh, undefined);
});

test("image input matches the documented multimodal set", () => {
  const textOnly = MODELS.filter((m) => !m.input.includes("image")).map((m) => m.id).sort();
  assert.deepEqual(textOnly, ["deepseek-v4-flash", "deepseek-v4-pro", "glm-5.2", "kimi-k2.7-code", "minimax-m2.7"]);
});

test("credential resolution reports the source that supplied the API key", async () => {
  const apiKeyAuth = captureProvider().auth.apiKey;
  if (!apiKeyAuth) throw new Error("provider must register API key auth");
  const resolve = apiKeyAuth.resolve;

  async function resolveAuth(env: Record<string, string | undefined>, credential?: ApiKeyCredential) {
    return resolve({
      credential,
      ctx: {
        env: async (name) => env[name],
        fileExists: async () => false,
      },
    });
  }

  assert.deepEqual(await resolveAuth({}, { type: "api_key", key: "stored-key" }), {
    auth: { apiKey: "stored-key" },
    source: "stored API key",
  });
  assert.deepEqual(await resolveAuth({ ARK_API_KEY: "ark-key", VOLCENGINE_API_KEY: "volcengine-key" }), {
    auth: { apiKey: "ark-key" },
    source: "ARK_API_KEY",
  });
  assert.deepEqual(await resolveAuth({ VOLCENGINE_API_KEY: "volcengine-key" }), {
    auth: { apiKey: "volcengine-key" },
    source: "VOLCENGINE_API_KEY",
  });
  assert.equal(await resolveAuth({}), undefined);
});

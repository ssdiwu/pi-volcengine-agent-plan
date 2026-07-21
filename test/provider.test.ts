import { strict as assert } from "node:assert";
import { test } from "node:test";
import { MODELS, PROVIDER_ID, BASE_URL } from "../index.ts";

test("provider id and endpoint are Agent Plan specific", () => {
  assert.equal(PROVIDER_ID, "volcengine-agent-plan");
  assert.equal(BASE_URL, "https://ark.cn-beijing.volces.com/api/plan/v3");
  // Must NOT be the Coding Plan or pay-as-you-go endpoints.
  assert.ok(!BASE_URL.includes("/coding/"));
  assert.ok(BASE_URL.includes("/plan/v3"));
});

test("catalog covers the full official Agent Plan text/coding model set", () => {
  const expected = [
    "ark-code-latest",
    "doubao-seed-evolving",
    "glm-5.2",
    "glm-latest",
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
  assert.deepEqual(withMax, ["ark-code-latest", "deepseek-v4-flash", "deepseek-v4-pro"]);
  assert.equal((byId["glm-5.2"].thinkingLevelMap as Record<string, string | null> | undefined)?.xhigh, undefined);
});

test("image input matches the documented multimodal set", () => {
  const textOnly = MODELS.filter((m) => !m.input.includes("image")).map((m) => m.id).sort();
  assert.deepEqual(textOnly, ["deepseek-v4-flash", "deepseek-v4-pro", "glm-5.2", "glm-latest", "kimi-k2.7-code", "minimax-m2.7"]);
});

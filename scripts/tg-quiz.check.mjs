// Самоперевірка логіки квіза. Запуск: node scripts/tg-quiz.check.mjs
import assert from "node:assert/strict";
import { nextStep, leadTemperature, summarize, INTENTS } from "../src/lib/tg-quiz.ts";

assert.equal(nextStep("situation"), "document");
assert.equal(nextStep("document"), "city");
assert.equal(nextStep("city", "kyiv"), "intent");
assert.equal(nextStep("city", "other"), "city_text");   // «інше місто» → текстовий ввід
assert.equal(nextStep("city_text"), "intent");
assert.equal(nextStep("intent", "ready"), "phone");
assert.equal(nextStep("intent", "consult"), "phone");
assert.equal(nextStep("intent", "info"), "done");        // холодний — телефон не просимо

assert.equal(leadTemperature(INTENTS.ready), "hot");
assert.equal(leadTemperature(INTENTS.consult), "warm");
assert.equal(leadTemperature(INTENTS.info), "cold");
assert.equal(leadTemperature(undefined), "cold");

const s = summarize({ step: "done", situation: "Штраф від ТЦК", city: "Київ", source: "shtraf" });
assert.ok(s.includes("Штраф від ТЦК") && s.includes("Київ") && s.includes("shtraf"));

console.log("✅ tg-quiz: усі перевірки пройдено");

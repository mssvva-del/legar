// Самоперевірка логіки квіза Telegram-бота. Запуск: node scripts/tg-quiz.check.mjs
import assert from "node:assert/strict";
import { nextStep, leadTemperature, summarize } from "../src/lib/tg-quiz.ts";

// повний шлях: питання → документ → місто → намір → телефон
assert.equal(nextStep("situation"), "document");
assert.equal(nextStep("document"), "city");
assert.equal(nextStep("city"), "intent");
assert.equal(nextStep("intent", "ready"), "phone");
assert.equal(nextStep("intent", "consult"), "phone");
// "просто інформація" — не просимо телефон, діалог завершено
assert.equal(nextStep("intent", "info"), "done");
assert.equal(nextStep("phone"), "done");

assert.equal(leadTemperature("ready"), "hot");
assert.equal(leadTemperature("consult"), "warm");
assert.equal(leadTemperature("info"), "cold");
assert.equal(leadTemperature(undefined), "cold");

const s = summarize({ situation: "Штраф від ТЦК", document: "Документ на руках", city: "Київ", intent: "Готовий вирішувати питання", source: "shtraf" });
assert.ok(s.includes("Штраф від ТЦК") && s.includes("Київ") && s.includes("shtraf"));

console.log("✅ tg-quiz: усі перевірки пройдено");

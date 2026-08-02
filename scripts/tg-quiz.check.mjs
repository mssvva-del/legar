// Самоперевірка логіки бота. Запуск: node scripts/tg-quiz.check.mjs
import assert from "node:assert/strict";
import { deadline, score, caseSummary, CONSULTS } from "../src/lib/tg-quiz.ts";

// строки: свіжий документ — час є, 6-10 днів — критично, понад 10 — поновлення строку
assert.equal(deadline("today").urgent, false);
assert.equal(deadline("d6_10").urgent, true);
assert.ok(deadline("d6_10").left < deadline("d2_5").left);
assert.equal(deadline("d10p").left, 0);
assert.ok(/поновлення/i.test(deadline("d10p").text));
assert.equal(deadline("not_yet").left, null);

// скоринг: оплачена консультація і жива справа — гарячі; інфо — холодний
assert.equal(score({ step: "chat", door: "consult", paidClaimed: true }).temp, "hot");
assert.equal(score({ step: "chat", door: "case", when: "d2_5", doneBefore: "nothing" }).temp, "hot");
assert.equal(score({ step: "chat", door: "case", when: "not_yet" }).temp, "warm");
assert.equal(score({ step: "chat", door: "case", when: "d2_5", doneBefore: "paid" }).temp, "warm"); // вже оплатив штраф — складніше
assert.equal(score({ step: "chat", door: "consult" }).temp, "warm");
assert.equal(score({ step: "chat", door: "info" }).temp, "cold");

// підсумок містить усе, що потрібно менеджеру до дзвінка
const s = caseSummary({ step: "phone", door: "case", situation: "Штраф від ТЦК", when: "d6_10", doneBefore: "nothing", city: "Львів", hasPhoto: true, source: "shtraf" });
for (const part of ["Штраф від ТЦК", "Львів", "фото", "Строк", "shtraf"]) assert.ok(s.includes(part), `немає: ${part}`);

assert.equal(CONSULTS.express.price, 490);
assert.equal(CONSULTS.full.price, 1200);

console.log("✅ tg-quiz: усі перевірки пройдено");

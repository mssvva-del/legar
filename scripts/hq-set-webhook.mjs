#!/usr/bin/env node
/**
 * Прив'язує HQ-бота до вебхука.
 *
 *   TELEGRAM_HQ_BOT_TOKEN=... TELEGRAM_HQ_WEBHOOK_SECRET=... \
 *   HQ_URL=https://legar.com.ua node scripts/hq-set-webhook.mjs
 *
 * Без аргументів показує поточний стан вебхука.
 */

const TOKEN = process.env.TELEGRAM_HQ_BOT_TOKEN;
const SECRET = process.env.TELEGRAM_HQ_WEBHOOK_SECRET;
const URL_BASE = process.env.HQ_URL;

if (!TOKEN) {
  console.error("Немає TELEGRAM_HQ_BOT_TOKEN");
  process.exit(1);
}

const api = async (method, body) => {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return r.json();
};

if (!URL_BASE) {
  const info = await api("getWebhookInfo");
  console.log(JSON.stringify(info.result ?? info, null, 2));
  process.exit(0);
}

const url = `${URL_BASE.replace(/\/$/, "")}/api/hq`;
const res = await api("setWebhook", {
  url,
  secret_token: SECRET || undefined,
  allowed_updates: ["message", "edited_message", "callback_query"],
  drop_pending_updates: true,
});
console.log(res.ok ? `✅ Вебхук: ${url}` : `❌ ${res.description}`);

// Підказки команд у меню Telegram.
await api("setMyCommands", {
  commands: [
    { command: "my", description: "мои задачи" },
    { command: "all", description: "все задачи" },
    { command: "today", description: "что сегодня" },
    { command: "task", description: "поставить задачу" },
    { command: "stats", description: "сводка за неделю" },
    { command: "projects", description: "проекты" },
    { command: "help", description: "справка" },
  ],
});

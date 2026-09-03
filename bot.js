// ==========================================
// NATIONAL GEOGRAPHIC MINI APP — BOT
// ==========================================
const express = require('express');
const app = express();
app.use(express.json());
// ==========================================
// НАСТРОЙКИ
// ==========================================
const BOT_TOKEN = process.env.BOT_TOKEN;
// URL твоей Mini App
const MINI_APP_URL =
  'https://d29vwyjf2s-rgb.github.io/-national-geographic-mini-app/';
const PORT = process.env.PORT || 3000;
// ==========================================
// ПРОВЕРКА ТОКЕНА
// ==========================================
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не задан!');
  process.exit(1);
}
// ==========================================
// TELEGRAM API
// ==========================================
async function telegram(method, data = {}) {
  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );
  const result = await response.json();
  if (!result.ok) {
    console.error('Telegram API error:', result);
    throw new Error(result.description || 'Telegram API error');
  }
  return result;
}
// ==========================================
// ОТПРАВКА СООБЩЕНИЯ
// ==========================================
async function sendMessage(chatId, text, keyboard = null) {
  const data = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML'
  };
  if (keyboard) {
    data.reply_markup = keyboard;
  }
  return telegram('sendMessage', data);
}
// ==========================================
// КНОПКА MINI APP
// ==========================================
function miniAppKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: '🌍 Открыть National Geographic',
          web_app: {
            url: MINI_APP_URL
          }
        }
      ]
    ]
  };
}
// ==========================================
// WEBHOOK
// ==========================================
app.post('/webhook', async (req, res) => {
  try {
    const update = req.body;
    console.log(
      '📩 Update:',
      JSON.stringify(update, null, 2)
    );
    // ------------------------------------------
    // Обычное сообщение от пользователя
    // ------------------------------------------
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      // Команда /start
      if (
        typeof message.text === 'string' &&
        message.text.startsWith('/start')
      ) {
        const firstName =
          message.from?.first_name || 'друг';
        await sendMessage(
          chatId,
          `🌍 <b>Привет, ${escapeHtml(firstName)}!</b>\n\n` +
          `Добро пожаловать в <b>National Geographic</b>.\n\n` +
          `Исследуй удивительные места нашей планеты, ` +
          `природу, животных, океан, космос и путешествия.`,
          miniAppKeyboard()
        );
      }
      // ----------------------------------------
      // Данные от Mini App через sendData()
      // ----------------------------------------
      if (message.web_app_data) {
        console.log(
          '📱 Mini App data:',
          message.web_app_data.data
        );
        await sendMessage(
          chatId,
          '✅ <b>Данные получены!</b>\n\n' +
          'Mini App успешно связалась с ботом. 🌍'
        );
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.sendStatus(500);
  }
});
// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/', (req, res) => {
  res.send('🌍 National Geographic Bot is running!');
});
// ==========================================
// УСТАНОВКА WEBHOOK
// ==========================================
app.get('/set-webhook', async (req, res) => {
  try {
    const baseUrl = process.env.RENDER_EXTERNAL_URL;
    if (!baseUrl) {
      return res.status(500).send(
        '❌ RENDER_EXTERNAL_URL не найден'
      );
    }
    const webhookUrl =
      `${baseUrl}/webhook`;
    const result = await telegram(
      'setWebhook',
      {
        url: webhookUrl
      }
    );
    console.log(
      '✅ Webhook установлен:',
      webhookUrl
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});
// ==========================================
// ПРОВЕРКА WEBHOOK
// ==========================================
app.get('/webhook-info', async (req, res) => {
  try {
    const result = await telegram(
      'getWebhookInfo'
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});
// ==========================================
// ЭКРАНИРОВАНИЕ HTML
// ==========================================
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
// ==========================================
// ЗАПУСК СЕРВЕРА
// ==========================================
app.listen(PORT, () => {
  console.log('');
  console.log('==========================================');
  console.log('🌍 NATIONAL GEOGRAPHIC BOT');
  console.log('==========================================');
  console.log(`🚀 Server started on port ${PORT}`);
  console.log('==========================================');
});

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Разрешаем CORS для всех маршрутов
app.use(cors());

const PORT = 3001;
const BASE_URL = 'https://tengrinews.kz';

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    res.send(response.data);
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Добавляем новый маршрут для обработки вложенных ссылок
app.get('/article', async (req, res) => {
  const link = req.query.link;

  if (!link) {
    return res.status(400).send('Bad Request: Missing link parameter');
  }

  const fullPath = `${BASE_URL}${link}`;

  try {
    const response = await axios.get(fullPath);
    res.send(response.data);
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
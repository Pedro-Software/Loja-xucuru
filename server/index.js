import { createApp } from './app.js';

const port = Number(process.env.PORT) || 3001;
const app = createApp();

app.listen(port, '127.0.0.1', () => {
  console.log(`API demonstrativa Loja Xukuru disponível em http://127.0.0.1:${port}`);
});

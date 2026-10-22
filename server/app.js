import { randomUUID } from 'node:crypto';
import express from 'express';
import { loadProducts } from './catalog.js';
import { createDemoSummary, DemoValidationError, normalizeCep, validateDemoPayload } from './demo-orders.js';

export function createApp(products = loadProducts()) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb', strict: true }));

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', mode: 'demonstration' });
  });

  app.get('/api/produtos', (_request, response) => {
    response.json(products);
  });

  app.get('/api/produtos/:id', (request, response) => {
    const id = request.params.id;
    if (!/^[a-z0-9-]{1,80}$/i.test(id)) {
      return response.status(400).json({ error: 'O ID do produto é inválido.' });
    }
    const product = products.find((entry) => entry.id === id);
    if (!product) return response.status(404).json({ error: 'Produto demonstrativo não encontrado.' });
    return response.json(product);
  });

  app.get('/api/frete', (request, response) => {
    const cep = normalizeCep(request.query.cep);
    if (!cep) return response.status(400).json({ error: 'Informe um CEP válido com 8 dígitos.' });
    return response.json({
      available: false,
      cep,
      message: 'Cotação PAC/SEDEX indisponível até integração com transportadora. Nenhum valor de frete foi calculado.',
    });
  });

  app.post('/api/pedidos/demo', (request, response) => {
    try {
      const validatedItems = validateDemoPayload(request.body, products);
      const paymentMethod = request.body.paymentMethod;
      const demoId = `DEMO-${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
      return response.json(createDemoSummary(validatedItems, paymentMethod, demoId));
    } catch (error) {
      if (error instanceof DemoValidationError) {
        return response.status(400).json({ error: error.message });
      }
      return response.status(500).json({ error: 'Não foi possível gerar o resumo demonstrativo.' });
    }
  });

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'Rota de API não encontrada.' });
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);
    if (error?.type === 'entity.parse.failed') {
      return response.status(400).json({ error: 'O corpo da requisição precisa ser um JSON válido.' });
    }
    if (error?.type === 'entity.too.large') {
      return response.status(413).json({ error: 'O corpo da requisição excede o limite permitido.' });
    }
    return response.status(500).json({ error: 'Erro interno da API demonstrativa.' });
  });

  return app;
}

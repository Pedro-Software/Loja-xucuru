export const MAX_ITEM_QUANTITY = 10;

export class DemoValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DemoValidationError';
  }
}

function hasOnlyKeys(value, allowedKeys) {
  return Object.keys(value).every((key) => allowedKeys.includes(key));
}

export function validateDemoPayload(payload, products) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new DemoValidationError('Envie um objeto JSON com os itens e a forma de pagamento demonstrativa.');
  }
  if (!hasOnlyKeys(payload, ['items', 'paymentMethod'])) {
    throw new DemoValidationError('O resumo aceita somente itens e forma de pagamento demonstrativa.');
  }
  if (!Array.isArray(payload.items) || payload.items.length < 1 || payload.items.length > products.length) {
    throw new DemoValidationError('Adicione ao menos um item válido para gerar o resumo demonstrativo.');
  }
  if (!['pix', 'cartao'].includes(payload.paymentMethod)) {
    throw new DemoValidationError('A forma de cálculo deve ser pix ou cartao.');
  }

  const byId = new Map(products.map((product) => [product.id, product]));
  const seen = new Set();
  return payload.items.map((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new DemoValidationError('Há um item inválido no carrinho demonstrativo.');
    }
    if (!hasOnlyKeys(entry, ['id', 'quantidade']) || Object.keys(entry).length !== 2) {
      throw new DemoValidationError('Cada item deve conter somente ID e quantidade.');
    }
    if (typeof entry.id !== 'string' || !/^[a-z0-9-]{1,80}$/i.test(entry.id)) {
      throw new DemoValidationError('Um ID de item é inválido.');
    }
    const product = byId.get(entry.id);
    if (!product) throw new DemoValidationError('Há um item que não existe no catálogo demonstrativo.');
    if (seen.has(entry.id)) throw new DemoValidationError('Cada ID deve aparecer uma única vez no carrinho.');
    if (!Number.isInteger(entry.quantidade) || entry.quantidade < 1 || entry.quantidade > MAX_ITEM_QUANTITY) {
      throw new DemoValidationError(`A quantidade de cada item deve ser um número inteiro entre 1 e ${MAX_ITEM_QUANTITY}.`);
    }
    seen.add(entry.id);
    return { id: product.id, quantidade: entry.quantidade, product };
  });
}

export function normalizeCep(value) {
  if (typeof value !== 'string' || !/^\d{5}-?\d{3}$/.test(value.trim())) return null;
  return value.replace('-', '').trim();
}

export function createDemoSummary(validatedItems, paymentMethod, demoId) {
  const items = validatedItems.map(({ id, quantidade, product }) => {
    const unitPriceCents = Math.round(product.price * 100);
    return {
      id,
      name: product.name,
      quantidade,
      unitPriceCents,
      lineSubtotalCents: unitPriceCents * quantidade,
    };
  });
  const subtotalCents = items.reduce((sum, item) => sum + item.lineSubtotalCents, 0);
  const discountCents = paymentMethod === 'pix' ? Math.round(subtotalCents * 0.05) : 0;
  const totalCents = subtotalCents - discountCents;
  const installmentsCents = paymentMethod === 'cartao'
    ? Array.from({ length: 6 }, (_, index) => Math.floor(totalCents / 6) + (index < totalCents % 6 ? 1 : 0))
    : [];

  return {
    demoId,
    message: 'Este resumo é uma simulação. Nenhum pagamento foi cobrado e nenhum pedido foi registrado.',
    items,
    subtotalCents,
    paymentMethod,
    discountCents,
    totalCents,
    installmentsCents,
  };
}

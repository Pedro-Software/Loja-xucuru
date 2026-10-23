import '../css/checkout.css';
import { readCart } from './cart-store.js';
import { formatBRL } from './formatters.js';
import { validateProducts } from './product-data.js';

const page = document.querySelector('[data-checkout-page]');

if (page) {
  const status = page.querySelector('[data-checkout-status]');
  const content = page.querySelector('[data-checkout-content]');
  const empty = page.querySelector('[data-checkout-empty]');
  const form = page.querySelector('[data-checkout-form]');
  const submitButton = page.querySelector('[data-checkout-submit]');
  const errorBox = page.querySelector('[data-checkout-error]');
  const result = page.querySelector('[data-checkout-result]');
  let products = [];
  let cart = [];

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function setStatus(message, isError = false, retry = false) {
    status.replaceChildren(document.createTextNode(message));
    status.hidden = !message;
    status.classList.toggle('checkout-status--error', isError);
    if (retry) {
      const button = makeElement('button', 'checkout-inline-button', 'Tentar novamente');
      button.type = 'button';
      button.addEventListener('click', initialize);
      status.append(' ', button);
    }
  }

  function renderItems() {
    const list = page.querySelector('[data-checkout-items]');
    const productById = new Map(products.map((product) => [product.id, product]));
    const rows = cart.map((item) => ({ item, product: productById.get(item.id) })).filter((row) => row.product);
    list.replaceChildren(...rows.map(({ item, product }) => {
      const row = makeElement('li', 'checkout-item');
      const details = makeElement('div', 'checkout-item__details');
      const name = makeElement('strong', '', product.name);
      const quantity = makeElement('span', '', `${item.quantidade} ${item.quantidade === 1 ? 'unidade' : 'unidades'} · ${formatBRL(product.price)} cada`);
      details.append(name, quantity);
      const lineSubtotal = makeElement('span', 'checkout-item__subtotal', formatBRL(product.price * item.quantidade));
      row.append(details, lineSubtotal);
      return row;
    }));

    const subtotal = rows.reduce((sum, { item, product }) => sum + product.price * item.quantidade, 0);
    page.querySelector('[data-checkout-subtotal]').textContent = formatBRL(subtotal);
  }

  function appendDefinition(list, label, value, emphasis = false) {
    const row = makeElement('div', emphasis ? 'checkout-result__row checkout-result__row--total' : 'checkout-result__row');
    row.append(makeElement('dt', '', label), makeElement('dd', '', value));
    list.append(row);
  }

  function formatInstallments(installmentsCents) {
    if (!Array.isArray(installmentsCents) || installmentsCents.length !== 6 || installmentsCents.some((amount) => !Number.isInteger(amount) || amount < 0)) {
      throw new Error('A API devolveu um parcelamento demonstrativo inválido.');
    }
    const counts = new Map();
    for (const amount of installmentsCents) counts.set(amount, (counts.get(amount) || 0) + 1);
    return [...counts].map(([amount, count]) => {
      const label = count === 1 ? 'parcela' : 'parcelas';
      return `${count} ${label} de ${formatBRL(amount / 100)}`;
    }).join(' + ');
  }

  function renderResult(summary) {
    if (
      !summary ||
      typeof summary.demoId !== 'string' || !summary.demoId.startsWith('DEMO-') ||
      !Number.isInteger(summary.subtotalCents) || !Number.isInteger(summary.discountCents) ||
      !Number.isInteger(summary.totalCents)
    ) {
      throw new Error('A API devolveu um resumo demonstrativo inválido.');
    }

    page.querySelector('[data-checkout-demo-id]').textContent = summary.demoId;
    const values = page.querySelector('[data-checkout-values]');
    values.replaceChildren();
    appendDefinition(values, 'Subtotal de referência', formatBRL(summary.subtotalCents / 100));

    if (summary.paymentMethod === 'pix') {
      appendDefinition(values, 'Desconto Pix de referência (5%)', `− ${formatBRL(summary.discountCents / 100)}`);
    } else if (summary.paymentMethod === 'cartao') {
      appendDefinition(values, 'Parcelamento de referência no cartão', formatInstallments(summary.installmentsCents));
    } else {
      throw new Error('A API devolveu uma forma demonstrativa de pagamento inválida.');
    }

    appendDefinition(values, 'Total de referência', formatBRL(summary.totalCents / 100), true);
    page.querySelector('[data-checkout-result-message]').textContent = summary.message;
    result.hidden = false;
    result.focus?.();
  }

  async function initialize() {
    result.hidden = true;
    empty.hidden = true;
    content.hidden = true;
    setStatus('Carregando sua seleção.');
    try {
      const response = await fetch('/api/produtos', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('O catálogo não foi carregado.');
      products = validateProducts(await response.json());
      cart = readCart(undefined, products);
      if (cart.length === 0) {
        setStatus('');
        empty.hidden = false;
        return;
      }

      renderItems();
      setStatus('');
      content.hidden = false;
    } catch {
      setStatus('Não foi possível carregar o catálogo ou a sacola salva.', true, true);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorBox.hidden = true;
    result.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Gerando resumo…';

    try {
      const paymentMethod = new FormData(form).get('paymentMethod');
      const response = await fetch('/api/pedidos/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          items: cart.map(({ id, quantidade }) => ({ id, quantidade })),
          paymentMethod,
        }),
      });
      let payload;
      try {
        payload = await response.json();
      } catch {
        throw new Error('A API devolveu uma resposta que não pôde ser lida.');
      }
      if (!response.ok) throw new Error(payload.error || 'Não foi possível gerar o resumo.');
      renderResult(payload);
    } catch (error) {
      errorBox.textContent = error instanceof TypeError
        ? 'Serviço de finalização indisponível. Nenhuma compra foi realizada; tente novamente em instantes.'
        : error.message;
      errorBox.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Gerar resumo';
    }
  });

  initialize();
}

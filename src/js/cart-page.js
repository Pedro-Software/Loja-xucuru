import '../css/product-cart.css';
import { clearCart, readCart, removeFromCart, setCartQuantity } from './cart-store.js';
import { calculateCartTotals, formatCep, hasValidCep } from './cart-utils.js';
import { formatBRL } from './formatters.js';
import { loadProducts } from './product-data.js';

const page = document.querySelector('[data-cart-page]');

if (page) {
  const status = page.querySelector('[data-cart-status]');
  const list = page.querySelector('[data-cart-items]');
  const empty = page.querySelector('[data-cart-empty]');
  const content = page.querySelector('[data-cart-content]');
  const subtotal = page.querySelector('[data-cart-subtotal]');
  const totalItems = page.querySelector('[data-cart-total-items]');
  const clearButton = page.querySelector('[data-clear-cart]');
  const cepForm = page.querySelector('[data-cep-form]');
  const cepInput = page.querySelector('#cart-cep');
  const cepMessage = page.querySelector('[data-cep-message]');
  let products = [];

  function addText(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function showLoadError() {
    status.hidden = false;
    status.textContent = 'Não foi possível carregar os dados do catálogo. Tente novamente.';
    status.classList.add('shop-status--error');
    content.hidden = true;
    empty.hidden = true;
  }

  function makeCartRow(cartItem, product) {
    const article = document.createElement('article');
    article.className = 'cart-item';
    const image = document.createElement('img');
    image.className = 'cart-item__image';
    image.src = product.image;
    image.alt = '';
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      const fallback = addText('div', 'shop-image-fallback', 'Imagem demonstrativa');
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', 'Imagem demonstrativa indisponível');
      image.replaceWith(fallback);
    }, { once: true });

    const details = document.createElement('div');
    details.className = 'cart-item__details';
    const link = addText('a', 'cart-item__name', product.name);
    link.href = `./produto.html?id=${encodeURIComponent(product.id)}`;
    const category = addText('p', 'shop-muted', `${product.category} · item demonstrativo`);
    const price = addText('p', 'cart-item__price', `Valor ilustrativo: ${formatBRL(product.price)}`);
    details.append(link, category, price);

    const controls = document.createElement('div');
    controls.className = 'cart-item__controls';
    const quantityLabel = document.createElement('label');
    quantityLabel.htmlFor = `quantity-${product.id}`;
    quantityLabel.textContent = 'Quantidade';
    const quantityControls = document.createElement('div');
    quantityControls.className = 'cart-quantity';
    const decrease = addText('button', 'shop-button shop-button--quiet', '−');
    decrease.type = 'button';
    decrease.setAttribute('aria-label', `Diminuir quantidade de ${product.name}`);
    decrease.disabled = cartItem.quantidade <= 1;
    decrease.addEventListener('click', () => changeQuantity(product.id, cartItem.quantidade - 1));
    const quantity = document.createElement('output');
    quantity.id = `quantity-${product.id}`;
    quantity.setAttribute('aria-live', 'polite');
    quantity.textContent = String(cartItem.quantidade);
    const increase = addText('button', 'shop-button shop-button--quiet', '+');
    increase.type = 'button';
    increase.setAttribute('aria-label', `Aumentar quantidade de ${product.name}`);
    increase.disabled = cartItem.quantidade >= 10;
    increase.addEventListener('click', () => changeQuantity(product.id, cartItem.quantidade + 1));
    quantityControls.append(decrease, quantity, increase);

    const lineTotal = addText('p', 'cart-item__total', `Subtotal do item: ${formatBRL(product.price * cartItem.quantidade)}`);
    const remove = addText('button', 'shop-text-button', `Remover ${product.name}`);
    remove.type = 'button';
    remove.addEventListener('click', () => {
      try {
        removeFromCart(product.id, products);
        render();
      } catch {
        statusMessage('Não foi possível atualizar o carrinho neste navegador.', true);
      }
    });
    controls.append(quantityLabel, quantityControls, lineTotal, remove);
    article.append(image, details, controls);
    return article;
  }

  function statusMessage(text, isError = false) {
    status.hidden = !text;
    status.textContent = text;
    status.classList.toggle('shop-status--error', isError);
  }

  function render() {
    let cart;
    try {
      cart = readCart(undefined, products);
    } catch {
      statusMessage('Não foi possível acessar o carrinho salvo neste navegador.', true);
      content.hidden = true;
      empty.hidden = true;
      return;
    }

    statusMessage('');
    list.replaceChildren();
    const detailedItems = cart
      .map((item) => ({ item, product: products.find((product) => product.id === item.id) }))
      .filter(({ product }) => product);

    if (detailedItems.length === 0) {
      content.hidden = true;
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    content.hidden = false;
    list.append(...detailedItems.map(({ item, product }) => makeCartRow(item, product)));
    const totals = calculateCartTotals(
      detailedItems.map(({ item }) => item),
      products,
    );
    totalItems.textContent = `${totals.quantity} ${totals.quantity === 1 ? 'item' : 'itens'}`;
    subtotal.textContent = formatBRL(totals.subtotal);
  }

  function changeQuantity(id, quantity) {
    try {
      setCartQuantity(id, quantity, products);
      render();
    } catch {
      statusMessage('Não foi possível atualizar o carrinho neste navegador.', true);
    }
  }

  cepInput.addEventListener('input', () => {
    cepInput.value = formatCep(cepInput.value);
    cepInput.removeAttribute('aria-invalid');
    cepMessage.textContent = '';
  });

  cepForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!hasValidCep(cepInput.value)) {
      cepInput.setAttribute('aria-invalid', 'true');
      cepMessage.textContent = 'Informe um CEP com 8 dígitos.';
      cepInput.focus();
      return;
    }
    cepInput.removeAttribute('aria-invalid');
    cepMessage.textContent = 'Cotação de frete ainda não disponível.';
  });

  clearButton.addEventListener('click', () => {
    try {
      clearCart();
      render();
    } catch {
      statusMessage('Não foi possível limpar o carrinho neste navegador.', true);
    }
  });

  async function initialize() {
    statusMessage('Carregando carrinho e catálogo demonstrativos.');
    try {
      products = await loadProducts();
      render();
    } catch {
      showLoadError();
    }
  }

  initialize();
}

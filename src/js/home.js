import '../css/home.css';
import { addToCart } from './cart-store.js';
import { formatBRL } from './formatters.js';
import { loadProducts } from './product-data.js';

const page = document.querySelector('[data-home-page]');

if (page) {
  const grid = page.querySelector('[data-home-grid]');
  const status = page.querySelector('[data-home-status]');
  let products = [];

  function textElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createArrowIcon() {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M4 12h15m-6-6 6 6-6 6');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    icon.append(path);
    return icon;
  }

  function createCard(product) {
    const article = textElement('article', 'home-card');
    const link = document.createElement('a');
    link.className = 'home-card__link';
    link.href = `./produto.html?id=${encodeURIComponent(product.id)}`;

    const figure = document.createElement('figure');
    figure.className = 'home-card__figure';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = '';
    image.width = 540;
    image.height = 400;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      const fallback = textElement('span', 'home-card__image-fallback', 'Imagem demonstrativa');
      fallback.setAttribute('role', 'img');
      fallback.setAttribute('aria-label', 'Imagem demonstrativa indisponível');
      image.replaceWith(fallback);
    }, { once: true });
    figure.append(image, textElement('figcaption', 'home-card__caption', 'Imagem demonstrativa'));

    const content = document.createElement('div');
    content.className = 'home-card__content';
    content.append(
      textElement('span', 'home-card__category', product.category),
      textElement('strong', 'home-card__name', product.name),
      textElement('span', 'home-card__price-label', 'Valor ilustrativo'),
      textElement('span', 'home-card__price', formatBRL(product.price)),
    );
    link.append(figure, content);

    const button = document.createElement('button');
    button.className = 'home-card__add';
    button.type = 'button';
    button.dataset.addToCart = product.id;
    button.setAttribute('aria-label', `Adicionar ${product.name} ao carrinho demonstrativo`);
    button.append(document.createTextNode('Adicionar ao carrinho'), createArrowIcon());

    article.append(link, button);
    return article;
  }

  function showError() {
    grid.setAttribute('aria-busy', 'false');
    grid.replaceChildren();
    const panel = textElement('div', 'home-state');
    panel.append(
      textElement('h3', '', 'Os destaques não carregaram'),
      textElement('p', '', 'Verifique a conexão e tente novamente; o catálogo completo também está disponível.'),
    );
    const retry = textElement('button', 'home-button home-button--compact', 'Tentar novamente');
    retry.type = 'button';
    retry.dataset.retryHome = '';
    panel.append(retry);
    grid.append(panel);
    status.textContent = 'Não foi possível carregar os destaques demonstrativos.';
  }

  async function loadHighlights() {
    grid.setAttribute('aria-busy', 'true');
    status.textContent = 'Carregando itens demonstrativos.';
    try {
      products = await loadProducts();
      const featured = products.filter((product) => product.featured).slice(0, 4);
      const items = featured.length === 4 ? featured : products.slice(0, 4);
      grid.replaceChildren(...items.map(createCard));
      grid.setAttribute('aria-busy', 'false');
      status.textContent = '';
    } catch {
      showError();
    }
  }

  grid.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const retry = event.target.closest('[data-retry-home]');
    if (retry) {
      loadHighlights();
      return;
    }

    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;
    const product = products.find((item) => item.id === button.dataset.addToCart);
    if (!product) return;

    try {
      addToCart(product.id, 1, products);
      status.textContent = `${product.name} foi adicionada ao carrinho demonstrativo.`;
    } catch {
      status.textContent = 'Não foi possível salvar o carrinho neste navegador.';
    }
  });

  loadHighlights();
}

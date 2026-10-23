import '../css/catalogo.css';
import { filterProducts } from './catalog-filters.js';
import { formatBRL } from './formatters.js';
import { loadProducts } from './product-data.js';

const form = document.querySelector('[data-catalog-form]');
const grid = document.querySelector('[data-product-grid]');
const status = document.querySelector('[data-catalog-status]');
const resultCount = document.querySelector('[data-result-count]');

if (form && grid && status && resultCount) {
  const searchInput = document.querySelector('#catalog-search');
  const categoryInput = document.querySelector('#catalog-category');
  const minPriceInput = document.querySelector('#catalog-min-price');
  const maxPriceInput = document.querySelector('#catalog-max-price');
  const sortInput = document.querySelector('#catalog-sort');
  const featuredInput = document.querySelector('#catalog-featured');
  const filterError = document.querySelector('[data-filter-error]');
  const clearButton = form.querySelector('[data-clear-filters]');
  let products = [];

  const initialParams = new URLSearchParams(window.location.search);
  const initialQuery = initialParams.get('q') || '';
  searchInput.value = initialQuery.slice(0, searchInput.maxLength);
  categoryInput.value = initialParams.get('categoria') || '';

  function updateQueryParameters() {
    const url = new URL(window.location.href);
    const query = searchInput.value.trim();
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    if (categoryInput.value) {
      url.searchParams.set('categoria', categoryInput.value);
    } else {
      url.searchParams.delete('categoria');
    }
    window.history.replaceState(null, '', url);
  }

  function createText(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createArrowIcon() {
    const namespace = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(namespace, 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('width', '18');
    icon.setAttribute('height', '18');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(namespace, 'path');
    path.setAttribute('d', 'M4 12h15m-6-6 6 6-6 6');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    icon.append(path);
    return icon;
  }

  function createProductCard(product) {
    const article = document.createElement('article');
    article.className = 'catalog-card';

    const link = document.createElement('a');
    link.className = 'catalog-card__link';
    link.href = './produto.html?id=' + encodeURIComponent(product.id);

    const figure = document.createElement('figure');
    figure.className = 'catalog-card__figure';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.imageAlt;
    image.width = 900;
    image.height = 900;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener(
      'error',
      () => {
        const fallback = createText('span', 'catalog-card__image-fallback', 'Fotografia indisponível');
        fallback.setAttribute('role', 'img');
        fallback.setAttribute('aria-label', 'Fotografia de referência indisponível');
        image.replaceWith(fallback);
      },
      { once: true },
    );

    const imageCaption = createText(
      'figcaption',
      'catalog-card__image-caption',
      product.gallery[0]?.caption || 'Fotografia de referência',
    );
    const demoBadge = createText('span', 'catalog-card__badge', 'Item de referência');
    figure.append(image, imageCaption, demoBadge);

    const content = createText('div', 'catalog-card__content');
    const category = createText('p', 'catalog-card__category', product.category);
    const name = createText('h3', 'catalog-card__name', product.name);
    const description = createText('p', 'catalog-card__description', product.description);
    const details = createText('div', 'catalog-card__details');
    const priceBlock = createText('div', 'catalog-card__price');
    priceBlock.append(
      createText('span', 'catalog-card__price-label', 'Valor de referência'),
      createText('strong', '', formatBRL(product.price)),
    );
    const action = createText('span', 'catalog-card__action', 'Ver item');
    action.append(createArrowIcon());
    details.append(priceBlock, action);

    content.append(category, name, description, details);
    link.append(figure, content);
    article.append(link);

    if (product.featured) {
      const featured = createText('span', 'catalog-card__featured', 'Destaque');
      featured.setAttribute('aria-label', 'Referência em destaque');
      figure.append(featured);
    }

    return article;
  }

  function createStatePanel(title, message, buttonLabel, dataAttribute) {
    const panel = createText('div', 'catalog-state');
    const heading = createText('h3', '', title);
    const copy = createText('p', '', message);
    const button = createText('button', 'catalog-button catalog-button--primary', buttonLabel);
    button.type = 'button';
    button.setAttribute(dataAttribute, '');
    panel.append(heading, copy, button);
    return panel;
  }

  function clearFilterError() {
    filterError.hidden = true;
    filterError.textContent = '';
    minPriceInput.removeAttribute('aria-invalid');
    maxPriceInput.removeAttribute('aria-invalid');
  }

  function showFilterError(message) {
    filterError.textContent = message;
    filterError.hidden = false;
    minPriceInput.setAttribute('aria-invalid', 'true');
    maxPriceInput.setAttribute('aria-invalid', 'true');
    resultCount.textContent = 'Revise a faixa de preço.';
    status.textContent = '';
    grid.setAttribute('aria-busy', 'false');
    grid.replaceChildren(
      createStatePanel(
        'Confira os valores',
        'A faixa informada não é válida. Ajuste os preços mínimo e máximo para ver os itens.',
        'Limpar filtros',
        'data-clear-filters',
      ),
    );
  }

  function renderProducts() {
    clearFilterError();
    let filtered;

    try {
      filtered = filterProducts(products, {
        query: searchInput.value,
        category: categoryInput.value,
        minPrice: minPriceInput.value,
        maxPrice: maxPriceInput.value,
        featuredOnly: featuredInput.checked,
        sort: sortInput.value,
      });
    } catch (error) {
      showFilterError(error instanceof Error ? error.message : 'A faixa de preço não é válida.');
      return;
    }

    grid.setAttribute('aria-busy', 'false');
    resultCount.textContent =
      filtered.length +
      (filtered.length === 1 ? ' item de referência' : ' itens de referência') +
      ' encontrados';
    status.textContent = '';

    if (filtered.length === 0) {
      grid.replaceChildren(
        createStatePanel(
          'Nenhum item encontrado',
          'Tente outra busca ou limpe os filtros para explorar outras referências.',
          'Limpar filtros',
          'data-clear-filters',
        ),
      );
      return;
    }

    grid.replaceChildren(...filtered.map(createProductCard));
  }

  function clearFilters() {
    form.reset();
    searchInput.value = '';
    updateQueryParameters();
    clearFilterError();
    renderProducts();
    searchInput.focus();
  }

  async function fetchProducts() {
    grid.setAttribute('aria-busy', 'true');
    resultCount.textContent = 'Carregando catálogo…';
    status.textContent = 'Carregando o catálogo.';
    grid.replaceChildren();

    try {
      products = await loadProducts();
      status.textContent = '';
      renderProducts();
    } catch {
      grid.setAttribute('aria-busy', 'false');
      resultCount.textContent = '';
      status.textContent = 'Não foi possível carregar o catálogo.';
      grid.replaceChildren(
        createStatePanel(
          'O catálogo não carregou',
          'Verifique a conexão com o servidor local e tente novamente.',
          'Tentar novamente',
          'data-retry-catalog',
        ),
      );
    }
  }

  form.addEventListener('input', (event) => {
    if (event.target === searchInput) {
      updateQueryParameters();
      renderProducts();
    } else if (event.target === minPriceInput || event.target === maxPriceInput) {
      renderProducts();
    }
  });

  form.addEventListener('change', (event) => {
    if (
      event.target === categoryInput ||
      event.target === sortInput ||
      event.target === featuredInput
    ) {
      updateQueryParameters();
      renderProducts();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    updateQueryParameters();
    renderProducts();
  });

  clearButton.addEventListener('click', clearFilters);
  grid.addEventListener('click', (event) => {
    const clearControl = event.target.closest('[data-clear-filters]');
    if (clearControl) {
      clearFilters();
      return;
    }

    const retryControl = event.target.closest('[data-retry-catalog]');
    if (retryControl) fetchProducts();
  });

  fetchProducts();
}

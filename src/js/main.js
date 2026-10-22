import '../css/styles.css';
import '../css/content-pages.css';
import { getCartCount, readCart } from './cart-store.js';

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const header = document.querySelector('[data-site-header]');
const menuToggle = header?.querySelector('[data-menu-toggle]');
const navigation = header?.querySelector('#site-primary-nav');

function setMenuOpen(isOpen, restoreFocus = false) {
  if (!header || !menuToggle) return;
  header.dataset.menuOpen = String(isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  if (!isOpen && restoreFocus) menuToggle.focus();
}

if (header && menuToggle && navigation) {
  header.dataset.menuEnhanced = 'true';
  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' && !header.contains(event.target)) {
      setMenuOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }
  });
  window.matchMedia?.('(min-width: 861px)').addEventListener?.('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });
}

if (currentPage === 'catalogo.html') {
  const searchInput = header?.querySelector('#site-search');
  const query = new URLSearchParams(window.location.search).get('q') || '';
  if (searchInput) searchInput.value = query.slice(0, searchInput.maxLength);
}

for (const link of document.querySelectorAll('[data-nav-link]')) {
  if (link.getAttribute('href') === `./${currentPage}`) {
    link.setAttribute('aria-current', 'page');
  }
}

function updateCartCount() {
  for (const link of document.querySelectorAll('a[data-cart-link]')) {
    const count = link.querySelector('[data-cart-count]');
    if (!count) continue;
    let quantity = 0;
    try {
      quantity = getCartCount(readCart());
    } catch {
      // Keep navigation usable when browser storage is unavailable.
    }
    count.textContent = String(quantity);
    link.setAttribute(
      'aria-label',
      quantity === 1 ? 'Carrinho, 1 item' : `Carrinho, ${quantity} itens`,
    );
  }
}

updateCartCount();
window.addEventListener('cart:updated', updateCartCount);
window.addEventListener('storage', (event) => {
  if (!event.key || event.key === 'loja-xukuru-cart') updateCartCount();
});

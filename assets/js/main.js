const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const header = document.querySelector('.site-header');
const scrollTop = document.querySelector('.scroll-top');
const cartCounts = document.querySelectorAll('.cart-count');
let cartTotal = 0;

function setMenuOpen(open) {
  if (!menuButton || !navigation) return;

  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação');
  navigation.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);

  if (open) navigation.querySelector('a')?.focus();
  else if (wasOpen) menuButton.focus();
}

menuButton?.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760 && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
  }
});

const sections = [...document.querySelectorAll('main section[id]')];
function updateScrollState() {
  const scrolled = window.scrollY > 24;
  header?.classList.toggle('is-scrolled', scrolled);
  scrollTop?.classList.toggle('is-visible', window.scrollY > 480);

  let current = sections[0];
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 140) current = section;
  });
  navigation?.querySelectorAll('a[href^="#"]').forEach((link) => {
    const active = link.hash === `#${current?.id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

document.querySelectorAll('[data-add]').forEach((button) => {
  button.addEventListener('click', () => {
    cartTotal += 1;
    cartCounts.forEach((count) => {
      count.textContent = String(cartTotal);
    });
    document.querySelector('.cart-link')?.setAttribute(
      'aria-label',
      `Saco de encomendas, ${cartTotal} ${cartTotal === 1 ? 'artigo' : 'artigos'}`,
    );

    const originalText = button.dataset.originalText || button.textContent;
    button.dataset.originalText = originalText;
    button.textContent = 'Adicionado ✓';
    button.classList.add('is-added');
    window.setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('is-added');
    }, 1500);
  });
});

document.querySelectorAll('[data-feedback]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = form.querySelector('.form-message');
    if (message) {
      message.textContent = 'Obrigado! Esta demonstração confirma o pedido localmente; nenhum dado foi enviado.';
    }
    form.reset();
  });
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((option) => {
      const active = option === button;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-pressed', String(active));
    });
    const activeFilter = button.dataset.filter || 'all';
    document.querySelectorAll('[data-product]').forEach((product) => {
      product.classList.toggle(
        'is-hidden',
        activeFilter !== 'all' && product.dataset.category !== activeFilter,
      );
    });
  });
});

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealTargets = document.querySelectorAll(
    '.section-heading, .product-card, .feature-band > *, .signup-band > *',
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  revealTargets.forEach((target) => {
    target.classList.add('reveal-ready');
    revealObserver.observe(target);
  });
}

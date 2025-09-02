// ===== Utilities: nav height CSS var =====
const nav = document.querySelector('.navbar');
function setNavHeightVar(){
  if (!nav) return;
  document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
}
setNavHeightVar();
window.addEventListener('resize', setNavHeightVar);

// ===== Navbar: shadow on scroll =====
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ===== Links de navegação (somente âncoras internas) =====
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

// ===== Active link por visibilidade (IntersectionObserver) =====
const sections = [...document.querySelectorAll('main section[id], footer[id]')];
const ratios = new Map();

function setActive(id){
  if (!id) return;
  navLinks.forEach(a => {
    const match = a.getAttribute('href') === `#${id}`;
    a.classList.toggle('active', match);
  });
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => ratios.set(e.target.id, e.intersectionRatio));

  const doc = document.documentElement;
  const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= Math.floor(doc.scrollHeight);
  const scrollable = doc.scrollHeight > window.innerHeight + 5;

  let idToActivate;

  if (atBottom && scrollable) {
    // Força "contato" somente quando realmente no fim
    idToActivate = 'contato';
  } else {
    const visible = [...ratios.entries()]
      .filter(([, r]) => r > 0)
      .sort((a, b) => b[1] - a[1])[0];
    idToActivate = visible?.[0];
  }

  setActive(idToActivate);
}, {
  rootMargin: `-${nav.offsetHeight + 10}px 0px -35% 0px`,
  threshold: Array.from({ length: 21 }, (_, i) => i / 20)
});

sections.forEach(sec => io.observe(sec));

// ===== Mobile menu =====
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('#nav');
burger?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));

// ===== Projetos / Projects: Carousel =====
const isEN = document.documentElement.lang?.toLowerCase().startsWith('en');
const ctaText = isEN ? 'View on GitHub' : 'Ver no GitHub';

const projects = [
  {
    title: isEN ? 'Landing Page — Agency X' : 'Catálogo Hamburgueria — ForgeDevApps',
    image: '/imgs/stackburguersiteforgedevapps.png',
    github: 'https://github.com/fp-torres/stackburguer',
    site: 'https://forgedevapps.com'
  },
  {
    title: isEN ? 'Minimal Portfolio' : 'Portfólio Minimalista',
    image: 'https://picsum.photos/1200/700?random=22',
    github: 'https://github.com/seu_github/portfolio-minimal'
  },
  {
    title: isEN ? 'Responsive Gallery (Grid)' : 'Galeria Responsiva (Grid)',
    image: 'https://picsum.photos/1200/700?random=23',
    github: 'https://github.com/seu_github/galeria-grid'
  },
  {
    title: isEN ? 'Tasks API (Front)' : 'API de Tarefas (Front)',
    image: 'https://picsum.photos/1200/700?random=24',
    github: 'https://github.com/seu_github/todo-api-front'
  }
];

const track = document.getElementById('carousel-track');
const prevBtn = document.querySelector('.control.prev');
const nextBtn = document.querySelector('.control.next');

if (track) {
  

track.innerHTML = projects.map(p => `
  <article class="slide">
    <img src="${p.image}" alt="${p.title}" />
    <div class="slide-footer">
      <div class="title">${p.title}</div>
      <div class="actions">
        <a class="btn primary" href="${p.github}" target="_blank" rel="noopener">${ctaText}</a>
        ${p.site ? `<a class="btn ghost" href="${p.site}" target="_blank" rel="noopener">Ver site</a>` : ''}
      </div>
    </div>
  </article>
`).join('');
}
let index = 0;
const total = projects.length;

function goTo(i){
  if (!track) return;
  index = (i + total) % total;
  track.style.transform = `translateX(-${index * 100}%)`;
}
function next(){ goTo(index + 1) }
function prev(){ goTo(index - 1) }

nextBtn?.addEventListener('click', next);
prevBtn?.addEventListener('click', prev);

// Auto play
let timer = null;
function start(){ timer = setInterval(next, 3000); }
function stop(){ if (timer) clearInterval(timer); timer = null; }
if (track){ start(); }

track?.addEventListener('mouseenter', stop);
track?.addEventListener('mouseleave', start);

// Swipe mobile
let startX = 0;
track?.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stop(); }, {passive:true});
track?.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
  start();
});

// ===== Back to top =====
const backToTop = document.getElementById('backToTop');
function toggleBackToTop(){
  if (!backToTop) return;
  if (window.scrollY > 200) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
}
toggleBackToTop();
window.addEventListener('scroll', toggleBackToTop);
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Open external links in new tab =====
document.querySelectorAll('a[href^="http"]').forEach(a=>{
  if(!a.target) a.target = '_blank';
  if(!a.rel) a.rel = 'noopener';
});

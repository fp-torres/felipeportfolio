/* =====================================================================================
 *  Portfolio — Felipe Torres
 *  script.js (carrossel + modal) — v3.7
 *  - Fit simples por projeto: 'cover' (corta) | 'contain' (sem corte)
 *  - pos (object-position) p/ focar o corte
 *  - Auto-ajuste: se 'cover' ficaria "zoomado" demais, muda p/ 'contain'
 *    (a menos que strictCover: true)
 *  - Active link do "Contato" mais confiável (IO + fallback no fundo + clique/hash)
 * ===================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ========= Utilities: navbar height ========= */
  const nav = document.querySelector('.navbar');
  function setNavHeightVar(){
    if (!nav) return;
    document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
  }
  setNavHeightVar();
  window.addEventListener('resize', setNavHeightVar);

  /* ========= Navbar: sombra ========= */
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  /* ========= Links internos + active link ========= */
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id], footer[id]')];
  const ratiosMap = new Map();

  function setActive(id){
    if (!id) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  }

  // IO mais permissivo: facilita o footer "contato" acender
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => ratiosMap.set(e.target.id, e.intersectionRatio));

    const visible = [...ratiosMap.entries()]
      .filter(([, r]) => r > 0)
      .sort((a, b) => b[1] - a[1])[0];

    if (visible?.[0]) setActive(visible[0]);
  }, {
    // Top compensado pela navbar, bottom quase zero pra contar o footer curto
    rootMargin: `-${(nav?.offsetHeight || 0) + 10}px 0px -5% 0px`,
    threshold: Array.from({ length: 11 }, (_, i) => i / 10) // 0, .1, .2, ...
  });
  sections.forEach(sec => io.observe(sec));

  // Fallback: se chegou no fundo, força "contato"
  function atBottom(){
    const doc = document.documentElement;
    return (window.scrollY + window.innerHeight) >= (doc.scrollHeight - 2);
  }
  function maybeForceContato(){
    if (atBottom()) setActive('contato');
  }
  window.addEventListener('scroll', maybeForceContato);
  window.addEventListener('resize', maybeForceContato);

  // Marca ativo ao clicar nos links de âncora
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const id = a.getAttribute('href').slice(1);
      setActive(id);
      // fecha menu mobile sem depender de variável de fora
      document.getElementById('nav')?.classList.remove('open');
    });
  });

  // Mantém ativo ao navegar por hash (voltar/avançar)
  window.addEventListener('hashchange', () => {
    const id = (location.hash || '').replace('#', '');
    if (id) setActive(id);
  });

  // Chamada inicial
  maybeForceContato();

  /* ========= Mobile menu ========= */
  const burger = document.querySelector('.burger');
  const navMenu = document.querySelector('#nav');
  burger?.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* =====================================================================================
   *  PROJETOS / CARROSSEL
   * ===================================================================================== */
  const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
  const isEN = htmlLang.startsWith('en');
  const ctaText = isEN ? 'View on GitHub' : 'Ver no GitHub';
  const viewSiteText = isEN ? 'View site' : 'Ver site';

  // Por projeto:
  // - fit: 'cover' | 'contain'
  // - pos: ex. 'center', 'center 35%', 'center top'
  // - strictCover: true para nunca trocar para 'contain'
  const projects = [
    {
      title: isEN ? 'Landing Page — Agency X' : 'Catálogo Simples — ForgeDevApps',
      image: 'imgs/site_steak_burger.png',
      github: 'https://github.com/fp-torres/stackburguer',
      site: 'https://forgedevapps.com',
      story: isEN
        ? 'A simple landing page designed for a burger house catalog. Focused on clean sections, quick navigation and a mouth-watering hero.'
        : 'Um catálogo simples para uma hamburgueria, com seções ágeis, navegação direta e um herói de dar água na boca.',
      fit: 'cover',        // corta para preencher
      pos: 'center 50%',   // ajuste o foco do corte (ex.: 30%/50%)
      strictCover: false   // true = força cover mesmo se ficar "zoomado"
    },
    {
      title: isEN ? 'Minimal Portfolio' : 'Portfólio Minimalista',
      image: 'https://picsum.photos/1200/700?random=22',
      github: 'https://github.com/seu_github/portfolio-minimal',
      site: null,
      story: isEN
        ? 'A minimal portfolio to explore typography scale and rhythm. Built with semantic HTML and modern CSS tokens.'
        : 'Um portfólio minimalista para explorar escala tipográfica e ritmo. Feito com HTML semântico e tokens modernos de CSS.',
      fit: 'contain',
      pos: 'center',
      strictCover: false
    },
    {
      title: isEN ? 'Responsive Gallery (Grid)' : 'Galeria Responsiva (Grid)',
      image: 'https://picsum.photos/1200/700?random=23',
      github: 'https://github.com/seu_github/galeria-grid',
      site: null,
      story: isEN
        ? 'A responsive image grid experiment, focusing on auto-fit columns and graceful content wrapping.'
        : 'Experimento de grid de imagens responsivo, focado em colunas auto-fit e quebra de conteúdo fluida.',
      fit: 'cover',
      pos: 'center',
      strictCover: false
    },
    {
      title: isEN ? 'Tasks API (Front)' : 'API de Tarefas (Front)',
      image: 'https://picsum.photos/1200/700?random=24',
      github: 'https://github.com/seu_github/todo-api-front',
      site: null,
      story: isEN
        ? 'Frontend for a tasks API: list, mark as done, and clean UI. Good playground for state and routing.'
        : 'Frontend para uma API de tarefas: listar, marcar como feito, e UI limpa. Bom playground para estado e rotas.',
      fit: 'contain',
      pos: 'center',
      strictCover: false
    }
  ];

  const track = document.getElementById('carousel-track');
  const prevBtn = document.querySelector('.control.prev');
  const nextBtn = document.querySelector('.control.next');

  if (track) {
    track.innerHTML = projects.map((p, i) => `
      <article class="slide" 
        data-index="${i}" 
        data-title="${String(p.title).replace(/"/g, '&quot;')}" 
        data-image="${p.image}" 
        data-github="${p.github || ''}" 
        data-site="${p.site || ''}" 
        data-story="${String(p.story || '').replace(/"/g, '&quot;')}"
        data-fit="${p.fit || 'contain'}"
        data-pos="${p.pos || 'center'}"
        data-strict-cover="${p.strictCover ? '1' : '0'}">
        
        <img src="${p.image}" alt="${p.title}" />
        <div class="slide-footer">
          <div class="title">${p.title}</div>
          <div class="actions">
            <a class="btn primary" href="${p.github}" target="_blank" rel="noopener">${ctaText}</a>
            ${p.site ? `<a class="btn ghost" href="${p.site}" target="_blank" rel="noopener">${viewSiteText}</a>` : ''}
          </div>
        </div>
      </article>
    `).join('');
  } else {
    console.warn('[portfolio] #carousel-track não encontrado no DOM.');
  }

  // Estado + navegação
  let index = 0;
  const total = projects.length;
  function goTo(i){
    if (!track) return;
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }
  nextBtn?.addEventListener('click', next);
  prevBtn?.addEventListener('click', prev);

  // Autoplay estável
  const AUTO_MS = 5000;
  let timer = null;
  function start(){ if (!timer) timer = setInterval(next, AUTO_MS); }
  function stop(){ if (timer) clearInterval(timer); timer = null; }
  if (track){ start(); }
  track?.addEventListener('mouseenter', stop);
  track?.addEventListener('mouseleave', () => {
    if (!document.body.classList.contains('modal-open')) start();
  });

  // Swipe mobile
  let startX = 0;
  track?.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stop(); }, {passive:true});
  track?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    if (!document.body.classList.contains('modal-open')) start();
  }, {passive:true});

  /* =====================================================================================
   *  MODAL DE PROJETO
   * ===================================================================================== */
  const modalEl     = document.getElementById('projectModal');
  const modalImg    = document.getElementById('projectModalImg');
  const modalTitle  = document.getElementById('projectModalTitle');
  const modalDesc   = document.getElementById('projectModalDesc');
  const modalSite   = document.getElementById('projectModalSite');
  const modalGithub = document.getElementById('projectModalGithub');
  const modalMedia  = document.querySelector('.project-modal__media');

  if (!modalEl || !modalImg || !modalTitle || !modalDesc || !modalGithub || !modalMedia) {
    console.warn('[portfolio] Elementos do modal não encontrados. Verifique o HTML do modal.');
  }

  let lastFocused = null;

  // Decide se 'cover' seria "zoomado" demais p/ o painel
  function chooseFitForPanel(requestedFit, strictCover, imgEl, mediaEl, pos){
    if (requestedFit !== 'cover' || strictCover) return 'cover';
    const mediaRect = mediaEl.getBoundingClientRect();
    const panelAR = mediaRect.width / Math.max(1, mediaRect.height);

    const iw = imgEl.naturalWidth || 1;
    const ih = imgEl.naturalHeight || 1;
    const imgAR = iw / ih;

    // Se a diferença de proporção for grande, 'cover' cortará muito e parece "zoom".
    const THRESHOLD = 1.6;
    if (imgAR / panelAR > THRESHOLD) return 'contain';
    return 'cover';
  }

  function applyModalContent(fromSlide){
    const title = fromSlide.dataset.title || '';
    const image = fromSlide.dataset.image || '';
    const story = fromSlide.dataset.story || '';
    const site  = fromSlide.dataset.site  || '';
    const github= fromSlide.dataset.github|| '';
    const fitReq= (fromSlide.dataset.fit || 'contain').toLowerCase();
    const pos   = fromSlide.dataset.pos || 'center';
    const strict= fromSlide.dataset.strictCover === '1';

    modalTitle.textContent = title;
    modalDesc.textContent = story;

    // Links
    if (site)   { modalSite.href = site;     modalSite.style.display = ''; }
    else        { modalSite.removeAttribute('href'); modalSite.style.display = 'none'; }

    if (github) { modalGithub.href = github; modalGithub.style.display = ''; }
    else        { modalGithub.removeAttribute('href'); modalGithub.style.display = 'none'; }

    // Config de imagem
    modalImg.style.width = '100%';
    modalImg.style.height = '100%';
    modalImg.style.objectPosition = pos;
    modalImg.src = image;
    modalImg.alt = title;

    // Quando a imagem carregar, escolhemos o fit ideal p/ o painel atual
    function onLoaded(){
      const finalFit = chooseFitForPanel(fitReq, strict, modalImg, modalMedia, pos);
      modalImg.style.objectFit = finalFit; // 'cover' ou 'contain'
      modalImg.removeEventListener('load', onLoaded);
    }
    if (modalImg.complete && modalImg.naturalWidth) onLoaded();
    else modalImg.addEventListener('load', onLoaded);
  }

  function openProjectModal(fromSlide){
    if (!modalEl) return;

    applyModalContent(fromSlide);

    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    stop(); // pausa autoplay

    lastFocused = document.activeElement;
    (modalEl.querySelector('.project-modal__close') || modalEl).focus({ preventScroll: true });
  }

  function closeProjectModal(){
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    start(); // retoma autoplay
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // fechar por clique na backdrop ou no X
  modalEl?.addEventListener('click', (e) => {
    if (e.target.hasAttribute('data-close-modal')) closeProjectModal();
  });
  // fechar por ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalEl?.classList.contains('is-open')) closeProjectModal();
  });

  // abrir ao clicar na imagem do slide
  track?.addEventListener('click', (e) => {
    const clickedImg = e.target.closest('.slide img');
    if (!clickedImg) return;
    const slide = clickedImg.closest('.slide');
    if (!slide) return;
    openProjectModal(slide);
  });

  // reforço: bind direto nas imagens
  function bindSlideImageClicks(){
    const imgs = document.querySelectorAll('.slide img');
    imgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (ev) => {
        const slide = ev.currentTarget.closest('.slide');
        if (slide) openProjectModal(slide);
      }, { passive: true });
    });
  }
  bindSlideImageClicks();

  /* ========= Back to top ========= */
  const backToTop = document.getElementById('backToTop');
  function toggleBackToTop(){
    if (!backToTop) return;
    if (window.scrollY > 200) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  }
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop);
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ========= Links externos em nova aba ========= */
  document.querySelectorAll('a[href^="http"]').forEach(a=>{
    if(!a.target) a.target = '_blank';
    if(!a.rel) a.rel = 'noopener';
  });
}); // DOMContentLoaded

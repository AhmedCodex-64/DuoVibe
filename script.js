// script.js (full corrected)
document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const langToggle = document.getElementById('lang-toggle');
  const regionSelect = document.getElementById('region-select');
  const regionPlaceholder = document.getElementById('region-placeholder');
  const startButtons = document.querySelectorAll('.start-btn');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const priceEls = document.querySelectorAll('.price');
  const revealEls = document.querySelectorAll('.reveal');
  const yearEl = document.getElementById('year');

  // set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Particle background ----
  const numParticles = 15;
  for(let i=0;i<numParticles;i++){
    const div = document.createElement('div');
    div.className = 'particle';
    const size = Math.random()*6+4;
    div.style.width = div.style.height = `${size}px`;
    div.style.left = `${Math.random()*100}vw`;
    div.style.top = `${Math.random()*100}vh`;
    div.style.background = `rgba(0,170,255,${Math.random()*0.3+0.1})`;
    div.style.animationDuration = `${Math.random()*30+20}s`;
    div.style.animationDelay = `${Math.random()*10}s`;
    body.appendChild(div);
  }

  // ---- Language init (persist) ----
  const savedLang = localStorage.getItem('duovibe_lang') || 'en';
  body.classList.toggle('lang-ar', savedLang === 'ar');
  body.classList.toggle('lang-en', savedLang !== 'ar');

  function updateLangUI() {
    const isAr = body.classList.contains('lang-ar');
    if (langToggle) langToggle.textContent = isAr ? 'EN' : 'AR';
    if (regionSelect) {
      Array.from(regionSelect.options).forEach(opt => {
        const en = opt.dataset.en;
        const ar = opt.dataset.ar;
        opt.textContent = isAr && ar ? ar : en;
      });
      regionSelect.value = 'eg';
      setPricesFor(regionSelect.value);
    }
    positionMobileMenu();
  }

  updateLangUI();

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const isAr = body.classList.contains('lang-ar');
      body.classList.toggle('lang-ar', !isAr);
      body.classList.toggle('lang-en', isAr);
      localStorage.setItem('duovibe_lang', !isAr ? 'ar' : 'en');
      updateLangUI();
    });
  }

  // ---- Price display by region ----
  function setPricesFor(region) {
    priceEls.forEach(el => {
      let p = '';
      if (region === 'eg') p = el.dataset.priceEg;
      else if (region === 'aoc') p = el.dataset.priceGulf || el.dataset.priceWest;
      else p = el.dataset.priceWest || el.dataset.priceEg;
      el.textContent = p || el.textContent || '—';
    });
  }

  if (regionSelect) {
    setPricesFor(regionSelect.value || 'eg');
    regionSelect.addEventListener('change', function () {
      setPricesFor(this.value);
      regionSelect.style.display = 'none';
      regionPlaceholder.setAttribute('aria-expanded','false');
      regionPlaceholder.textContent = this.options[this.selectedIndex].textContent;
    });
  }

  // ---- Region placeholder toggle ----
if(regionPlaceholder && regionSelect){
    // Initialize placeholder text
    regionPlaceholder.textContent = regionSelect.options[0].textContent;

    regionPlaceholder.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = regionSelect.classList.contains('open'); // استخدم class بدل display
        if(expanded){
            regionSelect.classList.remove('open');
            regionSelect.style.maxHeight = '0';
        } else {
            regionSelect.classList.add('open');
            regionSelect.style.maxHeight = regionSelect.scrollHeight + 'px';
        }
        regionPlaceholder.setAttribute('aria-expanded', !expanded);
    });

    // Close select if click outside
    document.addEventListener('click', () => {
        regionSelect.classList.remove('open');
        regionSelect.style.maxHeight = '0';
        regionPlaceholder.setAttribute('aria-expanded','false');
    });
}


  // ---- Start buttons open WhatsApp ----
  startButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const cat = btn.dataset.category || '';
      const tier = btn.dataset.tier || '';
      const region = (regionSelect && regionSelect.value) ? regionSelect.value : 'eg';
      const message = body.classList.contains('lang-ar')
        ? `مرحبا DuoVibe، أنا مهتم بـ ${cat} - ${tier} (المنطقة: ${region}). أريد تفاصيل وأسعار.`
        : `Hi DuoVibe, I'm interested in ${cat} - ${tier} (region: ${region}). Please send details and pricing.`;
      window.open(`https://wa.me/201126989979?text=${encodeURIComponent(message)}`, '_blank');
    });
  });

  // ---- Mobile menu ----
  function positionMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    const rect = navToggle.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    mobileMenu.style.top = `${rect.bottom + scrollTop + 8}px`;
    if(body.classList.contains('lang-ar')){
      mobileMenu.style.right = `${Math.max(12, window.innerWidth - rect.right + 12)}px`;
      mobileMenu.style.left = 'auto';
    } else {
      mobileMenu.style.left = `${Math.max(12, rect.left)}px`;
      mobileMenu.style.right = 'auto';
    }
  }

  if(navToggle && mobileMenu){
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenu.setAttribute('aria-hidden', mobileMenu.classList.contains('active') ? 'false' : 'true');
      positionMobileMenu();
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden','true');
        navToggle.setAttribute('aria-expanded','false');
      });
    });

    document.addEventListener('click', e => {
      if(mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !navToggle.contains(e.target)){
        mobileMenu.classList.remove('active');
        navToggle.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden','true');
        navToggle.setAttribute('aria-expanded','false');
      }
    });

    window.addEventListener('resize', positionMobileMenu);
    window.addEventListener('scroll', () => {
      if(mobileMenu.classList.contains('active')) positionMobileMenu();
    });
  }

  // ---- Smooth anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
        if(mobileMenu) mobileMenu.classList.remove('active');
        if(navToggle) navToggle.classList.remove('active');
      }
    });
  });

  // ---- Reveal on scroll ----
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.18 });
  revealEls.forEach(el => observer.observe(el));

  // ---- Button micro-motion ----
  document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('mousedown', () => b.classList.add('press'));
    b.addEventListener('mouseup', () => setTimeout(()=>b.classList.remove('press'), 120));
    b.addEventListener('mouseleave', () => b.classList.remove('press'));
    b.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') b.classList.add('press'); });
    b.addEventListener('keyup', () => b.classList.remove('press'));
  });
});

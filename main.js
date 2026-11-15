(() => {
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hd = $('hd'), bg = $('bg');

  // Cabeçalho com fundo ao rolar
  const onScroll = () => hd.classList.toggle('s', scrollY > 12);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Menu móvel
  const menu = open => {
    hd.classList.toggle('open', open);
    bg.setAttribute('aria-expanded', open);
    bg.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  bg.addEventListener('click', () => menu(!hd.classList.contains('open')));
  document.querySelectorAll('#dr a').forEach(a => a.addEventListener('click', () => menu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && menu(false));
  matchMedia('(min-width: 960px)').addEventListener('change', e => e.matches && menu(false));

  // Radar de desempenho (dados de exemplo: troque pelos reais do portal)
  const data = [
    { l: 'Matemática', a: 86, m: 64 }, { l: 'Química', a: 78, m: 60 },
    { l: 'Física', a: 62, m: 58 }, { l: 'Biologia', a: 74, m: 62 }, { l: 'Linguagens', a: 68, m: 66 }
  ];
  const svg = $('radar'), NS = 'http://www.w3.org/2000/svg', C = 150, R = 105;
  const pt = (i, v) => {
    const t = -Math.PI / 2 + (i * 2 * Math.PI) / data.length;
    return [C + Math.cos(t) * R * v / 100, C + Math.sin(t) * R * v / 100];
  };
  const el = (name, attrs, parent = svg) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n); return n;
  };
  [25, 50, 75, 100].forEach(v => el('polygon', { class: 'rg', points: data.map((_, i) => pt(i, v).join(',')).join(' ') }));
  data.forEach((d, i) => {
    const [x, y] = pt(i, 100), [lx, ly] = pt(i, 122);
    el('line', { class: 'rx', x1: C, y1: C, x2: x, y2: y });
    const t = el('text', { class: 'rl', x: lx, y: ly + 4, 'text-anchor': lx < C - 5 ? 'end' : lx > C + 5 ? 'start' : 'middle' });
    t.textContent = d.l;
  });
  el('polygon', { class: 'rm', points: data.map((d, i) => pt(i, d.m).join(',')).join(' ') });
  el('polygon', { class: 'ra', points: data.map((d, i) => pt(i, d.a).join(',')).join(' ') });

  // Contagem do +35
  const count = n => {
    const to = +n.dataset.count;
    if (reduce) return (n.textContent = to);
    const t0 = performance.now(), dur = 1400;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      n.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Entrada ao rolar
  const targets = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('[data-count]').forEach(count);
      io.unobserve(e.target);
    }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((t, i) => { t.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(t); });
  } else {
    targets.forEach(t => t.classList.add('in'));
  }

  // Triângulo do hero se move de leve ao rolar
  const tri = $('triBg');
  if (tri && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        tri.style.transform = `translateY(${scrollY * .12}px) rotate(${scrollY * .008}deg)`;
        tick = false;
      });
    }, { passive: true });
  }

  $('y').textContent = new Date().getFullYear();
})();

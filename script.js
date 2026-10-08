/* ============================================================
   Кейс 6 — Сравнение двух предприятий
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const fmt = (v, d = 0) => v.toLocaleString('ru-RU', {
    minimumFractionDigits: d, maximumFractionDigits: d
  });

  const parseNum = (raw) => {
    if (raw == null) return NaN;
    const s = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
    if (s === '') return NaN;
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  };

  const debounce = (fn, ms = 120) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  function animateNumber(el, target, { duration = 1200, decimals = 0 } = {}) {
    if (!el) return;
    if (el._raf) cancelAnimationFrame(el._raf);
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e, decimals);
      if (p < 1) el._raf = requestAnimationFrame(step);
      else { el.textContent = fmt(target, decimals); el._raf = null; }
    };
    el._raf = requestAnimationFrame(step);
  }

  function toast(message) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = message;
    t.classList.add('is-visible');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('is-visible'), 2200);
  }

  /* ---------- 1. i18n ---------- */
  const I18N = {
    ru: {
      brand:'Капитализация дохода',
      nav: { cond:'Условие', formula:'Формула', calc:'Расчёт', calculator:'Калькулятор', table:'Таблица', practice:'Практика', compare:'Сравнение', quiz:'Квиз', concl:'Вывод' },
      hero: { badge:'Кейс 6', title:'Сравнение двух предприятий', sub:'Расчёт стоимости предприятия методом капитализации дохода',
        desc:'Практический расчёт стоимости двух предприятий на основе дохода и ставки капитализации.',
        start:'Начать расчёт', try:'Проверить самостоятельно',
        stat1:'предприятия', stat2:'метод оценки', stat3:'разница стоимости', mln:'млн тг' },
      cond: { kicker:'Условие', title:'Условие задачи',
        lead:'Даны два предприятия с разным годовым доходом и разной ставкой капитализации. Требуется определить их расчётную стоимость и сравнить результаты.',
        a:'Предприятие А', aNote:'Умеренный доход · низкая ставка',
        b:'Предприятие Б', bNote:'Высокий доход · высокая ставка',
        income:'Годовой доход', rate:'Ставка капитализации' },
      formula: { kicker:'Инструмент', title:'Формула метода капитализации',
        lead:'Наведите на буквы — увидите расшифровку. Кликните, чтобы перейти к нужному шагу.',
        v:'стоимость предприятия', d:'доход предприятия', r:'ставка капитализации', copy:'Скопировать формулу' },
      calc: { kicker:'Пошаговый расчёт', title:'Расчёт стоимости предприятий',
        income:'Доход', rate:'Ставка', op:'Расчёт', result:'Результат', show:'Показать расчёт' },
      calcp: { kicker:'Практика', title:'Проверь расчёт самостоятельно',
        lead:'Введите данные или двигайте ползунки — стоимость обновляется мгновенно.',
        incomeLabel:'Доход предприятия, млн тг', rateLabel:'Ставка капитализации, %',
        submit:'Рассчитать стоимость', reset:'Сбросить', share:'Поделиться',
        result:'Результат расчёта', history:'Последние расчёты', clear:'Очистить' },
      sens: { kicker:'Таблица чувствительности', title:'Стоимость при разных D и R',
        lead:'Кликните на ячейку — она автоматически подставится в калькулятор. Цвет показывает, где стоимость выше.',
        note:'По горизонтали — годовой доход (млн тг), по вертикали — ставка капитализации (%).',
        low:'низкая', high:'высокая', income:'доход', rate:'ставка' },
      pr: { kicker:'Тренажёры', title:'Закрепи материал',
        lead:'Случайный кейс, скоростное испытание и экспорт карточек для Anki.',
        randTitle:'Случайный кейс', randNote:'Сгенерировать новые данные и решить', randBtn:'Сгенерировать кейс',
        timeTitle:'Испытание на время', timeNote:'20 секунд на правильный ответ',
        timeReady:'Нажмите «Старт», чтобы начать', start:'Старт', check:'Проверить',
        ankiTitle:'Карточки для Anki', ankiNote:'Скачайте CSV и повторяйте в Anki', ankiBtn:'Скачать CSV для Anki',
        correct:'Верно!', wrong:'Неверно. Правильный ответ:' },
      graph: { kicker:'Визуализация', title:'Как ставка влияет на стоимость',
        lead:'Кривые V = 30 / R и V = 35 / R. Точки А и Б — наши предприятия.' },
      cmp: { kicker:'Сравнение', title:'Сравнение результатов', col0:'Показатель', value:'Стоимость', chartTitle:'Расчётная стоимость предприятий' },
      qz: { kicker:'Проверка', title:'Мини-квиз' },
      win: { badge:'Победитель', caption:'Расчётная стоимость', diff:'Разница' },
      concl: { kicker:'Итог', title:'Вывод',
        p1:'Расчёт показывает, что величина дохода не является единственным фактором, определяющим стоимость предприятия. При использовании метода капитализации важную роль играет ставка капитализации.',
        p2:'Предприятие Б имеет больший доход — 35 млн тг, однако из-за более высокой ставки 14% его стоимость составляет 250 млн тг. Предприятие А при доходе 30 млн тг и ставке 10% имеет стоимость 300 млн тг.',
        p3:'Поэтому расчётная стоимость предприятия А выше на 50 млн тг.' },
      ft: { title:'Кейс 6 — Сравнение двух предприятий',
        note:'Расчёт выполнен методом капитализации дохода.', up:'Вернуться наверх' }
    },
    kz: {
      brand:'Кірісті капиталдау',
      nav: { cond:'Шарт', formula:'Формула', calc:'Есептеу', calculator:'Калькулятор', table:'Кесте', practice:'Тәжірибе', compare:'Салыстыру', quiz:'Викторина', concl:'Қорытынды' },
      hero: { badge:'Кейс 6', title:'Екі кәсіпорынды салыстыру', sub:'Кірісті капиталдау әдісімен кәсіпорын құнын есептеу',
        desc:'Кіріс пен капиталдау ставкасына негізделген екі кәсіпорын құнын практикалық есептеу.',
        start:'Есептеуді бастау', try:'Өзіңіз тексеріңіз',
        stat1:'кәсіпорын', stat2:'бағалау әдісі', stat3:'құн айырмасы', mln:'млн тг' },
      cond: { kicker:'Шарт', title:'Есептің шарты',
        lead:'Жылдық кірісі мен капиталдау ставкасы әртүрлі екі кәсіпорын берілген. Олардың есептік құнын анықтап, нәтижелерді салыстыру керек.',
        a:'А кәсіпорны', aNote:'Қалыпты кіріс · төмен ставка',
        b:'Б кәсіпорны', bNote:'Жоғары кіріс · жоғары ставка',
        income:'Жылдық кіріс', rate:'Капиталдау ставкасы' },
      formula: { kicker:'Құрал', title:'Капиталдау формуласы',
        lead:'Әріптерге назар аударыңыз — түсіндірме көрсетіледі.', v:'кәсіпорын құны', d:'кәсіпорын кірісі', r:'капиталдау ставкасы', copy:'Формуланы көшіру' },
      calc: { kicker:'Қадамдық есептеу', title:'Кәсіпорындар құнын есептеу', income:'Кіріс', rate:'Ставка', op:'Есептеу', result:'Нәтиже', show:'Есептеуді көрсету' },
      calcp: { kicker:'Тәжірибе', title:'Есептеуді өзіңіз тексеріңіз',
        lead:'Деректерді енгізіңіз немесе жүгірткіні жылжытыңыз.', incomeLabel:'Кәсіпорын кірісі, млн тг', rateLabel:'Капиталдау ставкасы, %',
        submit:'Құнды есептеу', reset:'Тазалау', share:'Бөлісу', result:'Есептеу нәтижесі', history:'Соңғы есептеулер', clear:'Тазалау' },
      sens: { kicker:'Сезімталдық кестесі', title:'Әртүрлі D мен R кезіндегі құн',
        lead:'Ұяшықты басыңыз — калькуляторға автоматты түрде қойылады.',
        note:'Көлденеңінен — жылдық кіріс (млн тг), тігінен — капиталдау ставкасы (%).',
        low:'төмен', high:'жоғары', income:'кіріс', rate:'ставка' },
      pr: { kicker:'Жаттығулар', title:'Материалды бекіту',
        lead:'Кездейсоқ кейс, жылдамдық сынағы және Anki карточкалары.',
        randTitle:'Кездейсоқ кейс', randNote:'Жаңа деректерді жасап, шешу', randBtn:'Кейсті жасау',
        timeTitle:'Уақытқа сынақ', timeNote:'20 секунд ішінде жауап беріңіз', timeReady:'«Бастау» түймесін басыңыз',
        start:'Бастау', check:'Тексеру', ankiTitle:'Anki карточкалары', ankiNote:'CSV жүктеп, Anki-де қайталаңыз',
        ankiBtn:'Anki үшін CSV жүктеу', correct:'Дұрыс!', wrong:'Қате. Дұрыс жауап:' },
      graph: { kicker:'Визуализация', title:'Ставка құнға қалай әсер етеді',
        lead:'V = 30 / R және V = 35 / R қисықтары. А және Б нүктелері — біздің кәсіпорындар.' },
      cmp: { kicker:'Салыстыру', title:'Нәтижелерді салыстыру', col0:'Көрсеткіш', value:'Құн', chartTitle:'Кәсіпорындардың есептік құны' },
      qz: { kicker:'Тексеру', title:'Мини-викторина' },
      win: { badge:'Жеңімпаз', caption:'Есептік құн', diff:'Айырма' },
      concl: { kicker:'Қорытынды', title:'Қорытынды',
        p1:'Есептеу кіріс мөлшері кәсіпорын құнын анықтайтын жалғыз фактор емес екенін көрсетеді.',
        p2:'Б кәсіпорнының кірісі көбірек — 35 млн тг, бірақ 14% жоғары ставкасына байланысты құны 250 млн тг. А кәсіпорны 30 млн тг кіріс және 10% ставкамен 300 млн тг құнға ие.',
        p3:'Сондықтан А кәсіпорнының есептік құны 50 млн тг жоғары.' },
      ft: { title:'Кейс 6 — Екі кәсіпорынды салыстыру', note:'Есептеу кірісті капиталдау әдісімен орындалды.', up:'Жоғарыға оралу' }
    },
    en: {
      brand:'Income capitalization',
      nav: { cond:'Condition', formula:'Formula', calc:'Calculation', calculator:'Calculator', table:'Table', practice:'Practice', compare:'Comparison', quiz:'Quiz', concl:'Conclusion' },
      hero: { badge:'Case 6', title:'Comparing two companies', sub:'Valuation using the income capitalization method',
        desc:'A practical valuation of two companies based on income and capitalization rate.',
        start:'Start calculation', try:'Try it yourself', stat1:'companies', stat2:'valuation method', stat3:'value gap', mln:'M KZT' },
      cond: { kicker:'Condition', title:'Problem statement',
        lead:'Two companies with different annual income and capitalization rates are given. Find their values and compare.',
        a:'Company A', aNote:'Moderate income · low rate', b:'Company B', bNote:'Higher income · higher rate',
        income:'Annual income', rate:'Capitalization rate' },
      formula: { kicker:'Tool', title:'Capitalization formula',
        lead:'Hover the letters to see details.', v:'company value', d:'company income', r:'capitalization rate', copy:'Copy formula' },
      calc: { kicker:'Step-by-step', title:'Valuation of companies', income:'Income', rate:'Rate', op:'Calculation', result:'Result', show:'Show calculation' },
      calcp: { kicker:'Practice', title:'Check the calculation yourself',
        lead:'Enter the data or drag the sliders.', incomeLabel:'Company income, M KZT', rateLabel:'Capitalization rate, %',
        submit:'Calculate value', reset:'Reset', share:'Share', result:'Result', history:'Recent calculations', clear:'Clear' },
      sens: { kicker:'Sensitivity table', title:'Value across D and R',
        lead:'Click any cell to load it into the calculator.', note:'Columns — annual income (M KZT), rows — capitalization rate (%).',
        low:'low', high:'high', income:'income', rate:'rate' },
      pr: { kicker:'Drills', title:'Reinforce your skills',
        lead:'Random case, timed challenge and Anki card export.',
        randTitle:'Random case', randNote:'Generate new data and solve', randBtn:'Generate case',
        timeTitle:'Timed challenge', timeNote:'20 seconds to answer', timeReady:'Press "Start" to begin',
        start:'Start', check:'Check', ankiTitle:'Anki cards', ankiNote:'Download CSV and review in Anki',
        ankiBtn:'Download CSV for Anki', correct:'Correct!', wrong:'Wrong. Correct answer:' },
      graph: { kicker:'Visualization', title:'How the rate affects value',
        lead:'Curves V = 30 / R and V = 35 / R. Points A and B — our companies.' },
      cmp: { kicker:'Comparison', title:'Comparing results', col0:'Metric', value:'Value', chartTitle:'Estimated value' },
      qz: { kicker:'Check', title:'Mini quiz' },
      win: { badge:'Winner', caption:'Estimated value', diff:'Difference' },
      concl: { kicker:'Conclusion', title:'Conclusion',
        p1:'Income alone does not determine a company\u2019s value. Under the capitalization method the rate plays a key role.',
        p2:'Company B has higher income — 35 M KZT — but a higher rate of 14% gives it 250 M KZT. Company A with 30 M KZT income and 10% rate is worth 300 M KZT.',
        p3:'So Company A\u2019s estimated value is 50 M KZT higher.' },
      ft: { title:'Case 6 — Comparing two companies', note:'Calculated using the income capitalization method.', up:'Back to top' }
    }
  };

  const LANG_KEY = 'case6-lang';
  let currentLang = 'ru';

  function getVal(obj, key) {
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.ru;
    currentLang = lang;

    $$('[data-i18n]').forEach((el) => {
      const val = getVal(dict, el.getAttribute('data-i18n'));
      if (typeof val === 'string') el.textContent = val;
    });

    // Заголовок hero — с переносом строки
    const heroTitle = $('[data-i18n="hero.title"]');
    if (heroTitle) {
      const words = dict.hero.title.split(' ');
      if (words.length > 2) {
        const mid = Math.ceil(words.length / 2);
        heroTitle.innerHTML = words.slice(0, mid).join(' ') + '<br>' + words.slice(mid).join(' ');
      } else {
        heroTitle.textContent = dict.hero.title;
      }
    }

    document.documentElement.setAttribute('lang', lang === 'kz' ? 'kk' : lang);
    $$('.lang-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.lang === lang));
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}

    renderSensitivity();
  }

  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) currentLang = saved;
    else if (navigator.language) {
      const base = navigator.language.slice(0, 2).toLowerCase();
      if (base === 'kk' || base === 'kz') currentLang = 'kz';
      else if (base === 'en') currentLang = 'en';
    }
  } catch (_) {}

  $$('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  /* ---------- 2. Тема ---------- */
  const themeKey = 'case6-theme';
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (_) {}

  const themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem(themeKey, next); } catch (_) {}
      window.dispatchEvent(new CustomEvent('themechange'));
    });
  }

  /* ---------- 3. Плавная навигация ---------- */
  function scrollTo(sel) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $$('[data-scroll]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      scrollTo(el.getAttribute('data-scroll'));
    });
  });

  /* ---------- 4. Reveal ---------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        o.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 5. Счётчики ---------- */
  const counters = $$('.js-count');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries, o) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        animateNumber(en.target, Number(en.target.dataset.value) || 0, { duration: 1400 });
        o.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => cObs.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = fmt(Number(el.dataset.value) || 0); });
  }

  /* ---------- 6. Параллакс ---------- */
  const parallaxEls = $$('[data-parallax]');
  const heroGlows = $$('.hero__glow');
  let pTick = false;
  window.addEventListener('scroll', () => {
    if (pTick) return;
    pTick = true;
    requestAnimationFrame(() => {
      const y = window.pageYOffset || 0;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0;
        el.style.transform = `translate3d(0, ${(y * speed).toFixed(2)}px, 0)`;
      });
      heroGlows.forEach((el, i) => {
        const speed = i === 0 ? 0.15 : 0.10;
        el.style.transform = `translate3d(0, ${(y * speed).toFixed(2)}px, 0)`;
      });
      pTick = false;
    });
  }, { passive: true });

  /* ---------- 7. Частицы hero ---------- */
  (function initParticles() {
    const canvas = $('#heroCanvas');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [], raf = null;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(70, Math.max(24, Math.round(W / 22)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function color() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4f46e5';
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const c = color();
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (14000 - d2) / 14000;
          p.x += (dx / Math.sqrt(d2 || 1)) * f * 0.9;
          p.y += (dy / Math.sqrt(d2 || 1)) * f * 0.9;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.55;
        ctx.fill();
      });
      ctx.globalAlpha = 0.16;
      ctx.strokeStyle = c;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.lineWidth = 1 - dist / 130;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    draw();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
      else if (!raf) draw();
    });
  })();

  /* ---------- 8. 3D-tilt ---------- */
  (function initTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    $$('[data-tilt]').forEach((el) => {
      let raf = null;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `perspective(900px) rotateY(${(x*5).toFixed(2)}deg) rotateX(${(-y*5).toFixed(2)}deg) translateY(-4px)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });
  })();

  /* ---------- 9. Формула ---------- */
  $$('.f-letter').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.term;
      toast(`Переход к «${t}»`);
      if (btn.dataset.target) scrollTo(btn.dataset.target);
    });
  });

  /* ---------- 10. Пошаговый расчёт ---------- */
  $$('[data-calc]').forEach((card) => {
    const btn = $('.js-calc-btn', card);
    const num = $('.js-result', card);
    if (!btn || !num) return;
    btn.addEventListener('click', () => {
      if (card.classList.contains('open')) return;
      card.classList.add('open');
      btn.disabled = true;
      btn.textContent = '✓';
      setTimeout(() => animateNumber(num, Number(num.dataset.value) || 0, { duration: 1200 }), 620);
    });
  });

  /* ---------- 11. Победитель ---------- */
  const winnerNum = $('.js-winner');
  if (winnerNum) {
    if ('IntersectionObserver' in window) {
      const wObs = new IntersectionObserver((entries, o) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          animateNumber(winnerNum, Number(winnerNum.dataset.value) || 0, { duration: 1500 });
          o.unobserve(en.target);
        });
      }, { threshold: 0.4 });
      wObs.observe(winnerNum);
    } else {
      winnerNum.textContent = fmt(Number(winnerNum.dataset.value) || 0);
    }
  }

  /* ---------- 12. Диаграмма ---------- */
  (function initBarChart() {
    const chart = $('#chart');
    if (!chart) return;
    const bars = $$('.chart__bar', chart);
    const max = Math.max(...bars.map((b) => Number(b.dataset.value) || 0)) * 1.08;
    const draw = () => {
      bars.forEach((b, i) => {
        const v = Number(b.dataset.value) || 0;
        const w = max > 0 ? (v / max) * 100 : 0;
        setTimeout(() => { b.style.width = w.toFixed(2) + '%'; }, i * 160);
      });
    };
    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver((entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          draw(); obs.unobserve(en.target);
        });
      }, { threshold: 0.3 });
      o.observe(chart);
    } else draw();
  })();

  /* ---------- 13. График V(R) ---------- */
  (function initVRChart() {
    const canvas = $('#vrChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    const R_MIN = 8, R_MAX = 20, V_MAX = 450;
    const D_A = 30, D_B = 35;
    const points = { A: { r: 10, v: 300 }, B: { r: 14, v: 250 } };

    function colors() {
      const s = getComputedStyle(document.documentElement);
      return {
        text: s.getPropertyValue('--text').trim() || '#0f172a',
        muted: s.getPropertyValue('--muted').trim() || '#64748b',
        line: s.getPropertyValue('--line').trim() || '#e7e9f2',
        accent: s.getPropertyValue('--accent').trim() || '#4f46e5',
        neutral: '#94a3b8'
      };
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      draw();
    }

    const px = (r) => 60 + ((r - R_MIN) / (R_MAX - R_MIN)) * (W - 90);
    const py = (v) => H - 40 - (v / V_MAX) * (H - 70);

    function curve(D, color) {
      ctx.beginPath();
      ctx.lineWidth = 2.5; ctx.strokeStyle = color;
      let first = true;
      for (let r = R_MIN; r <= R_MAX; r += 0.1) {
        const v = D / (r / 100);
        if (v > V_MAX * 1.3) continue;
        const x = px(r), y = py(Math.min(v, V_MAX));
        if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function point(r, v, color, label, sub) {
      const x = px(r), y = py(v);
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1;
      ctx.font = '700 14px "Manrope", "Inter", sans-serif';
      ctx.fillStyle = color; ctx.textAlign = 'center';
      ctx.fillText(label, x, y - 22);
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText(sub, x, y - 6);
    }

    function draw() {
      const c = colors();
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = c.line; ctx.lineWidth = 1;
      ctx.font = '500 11px "JetBrains Mono", monospace'; ctx.fillStyle = c.muted;
      [8, 10, 12, 14, 16, 18, 20].forEach((r) => {
        const x = px(r);
        ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x, H - 40); ctx.stroke();
        ctx.textAlign = 'center'; ctx.fillText(r + '%', x, H - 18);
      });
      [0, 100, 200, 300, 400].forEach((v) => {
        const y = py(v);
        ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(W - 30, y); ctx.stroke();
        ctx.textAlign = 'right'; ctx.fillText(v, 50, y + 4);
      });

      ctx.strokeStyle = c.muted; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(60, H - 40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(60, H - 40); ctx.lineTo(W - 30, H - 40); ctx.stroke();

      curve(D_B, c.neutral);
      curve(D_A, c.accent);

      point(points.A.r, points.A.v, c.accent, 'А', '300');
      point(points.B.r, points.B.v, '#94a3b8', 'Б', '250');

      ctx.font = '600 12px "Inter", sans-serif'; ctx.fillStyle = c.muted;
      ctx.textAlign = 'center'; ctx.fillText('R, %', W / 2, H - 4);
      ctx.save();
      ctx.translate(16, H / 2); ctx.rotate(-Math.PI / 2);
      ctx.fillText('V, млн тг', 0, 0);
      ctx.restore();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener('themechange', draw);
    window.addEventListener('resize', debounce(resize, 120));
  })();

  /* ---------- 14. Калькулятор ---------- */
  const calcForm    = $('#calcForm');
  const incomeInput = $('#income');
  const rateInput   = $('#rate');
  const incomeRange = $('#incomeRange');
  const rateRange   = $('#rateRange');
  const incomeError = $('#incomeError');
  const rateError   = $('#rateError');
  const calcOutput  = $('#calcOutput');
  const calcFormula = $('#calcFormula');
  const calcValue   = $('#calcValue');
  const calcHint    = $('#calcHint');
  const calcReset   = $('#calcReset');
  const shareBtn    = $('#shareBtn');
  const historyBlock = $('#historyBlock');
  const historyList  = $('#historyList');
  const historyClear = $('#historyClear');

  const HISTORY_KEY = 'case6-history';
  const HISTORY_MAX = 5;

  function setError(input, errEl, msg) {
    if (!input || !errEl) return;
    if (msg) {
      input.classList.add('is-invalid');
      errEl.textContent = msg;
      errEl.classList.add('is-visible');
      return false;
    }
    input.classList.remove('is-invalid');
    errEl.textContent = '';
    errEl.classList.remove('is-visible');
    return true;
  }

  function clearErrors() {
    setError(incomeInput, incomeError, '');
    setError(rateInput, rateError, '');
  }

  function validate() {
    const income = parseNum(incomeInput.value);
    const rate = parseNum(rateInput.value);
    let ok = true;
    if (incomeInput.value.trim() === '') ok = setError(incomeInput, incomeError, 'Введите доход.') && ok;
    else if (Number.isNaN(income)) ok = setError(incomeInput, incomeError, 'Введите число.') && ok;
    else if (income <= 0) ok = setError(incomeInput, incomeError, 'Доход должен быть > 0.') && ok;
    else setError(incomeInput, incomeError, '');

    if (rateInput.value.trim() === '') ok = setError(rateInput, rateError, 'Введите ставку.') && ok;
    else if (Number.isNaN(rate)) ok = setError(rateInput, rateError, 'Введите число.') && ok;
    else if (rate === 0) ok = setError(rateInput, rateError, 'Ставка не может быть 0.') && ok;
    else if (rate < 0) ok = setError(rateInput, rateError, 'Ставка не может быть < 0.') && ok;
    else setError(rateInput, rateError, '');

    return { ok, income, rate };
  }

  let lastCalc = { income: null, rate: null, value: null };

  function renderResult(income, rate) {
    const rDec = rate / 100;
    const value = income / rDec;

    const rTxt = rDec.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    const iTxt = income.toLocaleString('ru-RU', { maximumFractionDigits: 4 });

    calcFormula.textContent = `V = ${iTxt} / ${rTxt}`;
    calcOutput.hidden = false;
    calcOutput.style.animation = 'none';
    void calcOutput.offsetWidth;
    calcOutput.style.animation = '';

    const dec = Number.isInteger(value) ? 0 : 2;
    animateNumber(calcValue, value, { duration: 1000, decimals: dec });

    calcHint.textContent = `Ставке ${rate.toLocaleString('ru-RU')}% соответствует коэффициент ${rTxt}.`;
    lastCalc = { income, rate, value };
  }

  const liveCalc = debounce(() => {
    const income = parseNum(incomeInput.value);
    const rate = parseNum(rateInput.value);
    if (!Number.isFinite(income) || !Number.isFinite(rate)) return;
    if (income <= 0 || rate <= 0) return;
    if (incomeInput.value.trim() === '' || rateInput.value.trim() === '') return;
    renderResult(income, rate);
  }, 220);

  if (incomeRange) incomeRange.addEventListener('input', () => {
    incomeInput.value = incomeRange.value; liveCalc();
  });
  if (incomeInput) incomeInput.addEventListener('input', () => {
    const v = parseNum(incomeInput.value);
    if (Number.isFinite(v) && v >= 1 && v <= 100 && incomeRange) incomeRange.value = v;
    liveCalc();
  });
  if (rateRange) rateRange.addEventListener('input', () => {
    rateInput.value = rateRange.value; liveCalc();
  });
  if (rateInput) rateInput.addEventListener('input', () => {
    const v = parseNum(rateInput.value);
    if (Number.isFinite(v) && v >= 1 && v <= 30 && rateRange) rateRange.value = v;
    liveCalc();
  });

  /* История */
  function loadHistory() {
    try { const raw = localStorage.getItem(HISTORY_KEY); return raw ? JSON.parse(raw) : []; }
    catch (_) { return []; }
  }
  function saveHistory(list) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (_) {}
  }
  function renderHistory() {
    const list = loadHistory();
    if (!historyList || !historyBlock) return;
    if (!list.length) { historyBlock.hidden = true; return; }
    historyBlock.hidden = false;
    historyList.innerHTML = '';
    list.forEach((item) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'history__item';
      btn.innerHTML = `<span class="h-formula">V = ${item.income} / ${(item.rate/100).toFixed(2)}</span><span class="h-value">${fmt(item.value)} млн тг</span>`;
      btn.addEventListener('click', () => {
        incomeInput.value = item.income;
        rateInput.value = item.rate;
        if (incomeRange) incomeRange.value = Math.min(100, Math.max(1, item.income));
        if (rateRange)   rateRange.value   = Math.min(30, Math.max(1, item.rate));
        clearErrors();
        renderResult(item.income, item.rate);
        calcOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        toast('Расчёт загружен из истории');
      });
      li.appendChild(btn);
      historyList.appendChild(li);
    });
  }
  function pushHistory(income, rate, value) {
    const list = loadHistory();
    list.unshift({ income, rate, value, ts: Date.now() });
    saveHistory(list.slice(0, HISTORY_MAX));
    renderHistory();
  }

  if (historyClear) historyClear.addEventListener('click', () => {
    saveHistory([]); renderHistory(); toast('История очищена');
  });
  renderHistory();

  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { ok, income, rate } = validate();
      if (!ok) { calcOutput.hidden = true; return; }
      renderResult(income, rate);
      pushHistory(income, rate, income / (rate / 100));
      calcOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    if (calcReset) calcReset.addEventListener('click', () => {
      clearErrors();
      calcOutput.hidden = true;
      calcValue.textContent = '0';
      if (incomeRange) incomeRange.value = 30;
      if (rateRange) rateRange.value = 10;
    });
    [incomeInput, rateInput].forEach((inp) => {
      inp.addEventListener('input', () => {
        if (inp === incomeInput) setError(incomeInput, incomeError, '');
        if (inp === rateInput) setError(rateInput, rateError, '');
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const { ok, income, rate } = validate();
      if (!ok) return;
      const url = new URL(window.location.href);
      url.searchParams.set('income', income);
      url.searchParams.set('rate', rate);
      url.hash = '#calculator';
      try {
        await navigator.clipboard.writeText(url.toString());
        toast('Ссылка скопирована');
      } catch (_) { window.prompt('Скопируйте ссылку:', url.toString()); }
    });
  }

  (function applyUrlParams() {
    const p = new URLSearchParams(window.location.search);
    const inc = parseNum(p.get('income'));
    const rt = parseNum(p.get('rate'));
    if (Number.isFinite(inc) && inc > 0) {
      incomeInput.value = inc;
      if (incomeRange) incomeRange.value = Math.min(100, Math.max(1, inc));
    }
    if (Number.isFinite(rt) && rt > 0) {
      rateInput.value = rt;
      if (rateRange) rateRange.value = Math.min(30, Math.max(1, rt));
    }
    if (Number.isFinite(inc) && inc > 0 && Number.isFinite(rt) && rt > 0) {
      renderResult(inc, rt);
      setTimeout(() => scrollTo('#calculator'), 400);
    }
  })();

  /* ---------- 15. Таблица чувствительности ---------- */
  const INCOMES = [25, 30, 35, 40, 45];
  const RATES   = [8, 10, 12, 14, 16];

  function valueColor(v) {
    const min = 150, max = 560;
    const t = Math.max(0, Math.min(1, (v - min) / (max - min)));
    const hue = 210 + t * 70;
    const light = 92 - t * 34;
    const sat = 60 + t * 30;
    return `hsl(${hue} ${sat}% ${light}%)`;
  }

  function renderSensitivity() {
    const grid = $('#sensGrid');
    if (!grid) return;
    const dict = I18N[currentLang] || I18N.ru;
    const incomeLabel = (dict.sens && dict.sens.income) || 'доход';
    const rateLabel = (dict.sens && dict.sens.rate) || 'ставка';

    grid.innerHTML = '';

    const corner = document.createElement('div');
    corner.className = 'sens-cell sens-cell--header';
    corner.textContent = `${rateLabel} \\ ${incomeLabel}`;
    grid.appendChild(corner);

    INCOMES.forEach((inc) => {
      const h = document.createElement('div');
      h.className = 'sens-cell sens-cell--header';
      h.textContent = inc;
      grid.appendChild(h);
    });

    RATES.forEach((rate) => {
      const rh = document.createElement('div');
      rh.className = 'sens-cell sens-cell--header sens-cell--rowhead';
      rh.textContent = rate + '%';
      grid.appendChild(rh);

      INCOMES.forEach((inc) => {
        const v = inc / (rate / 100);
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'sens-cell';
        cell.style.background = valueColor(v);
        cell.style.color = (v > 350 ? '#fff' : 'var(--text)');
        cell.textContent = Math.round(v);

        if (inc === 30 && rate === 10) {
          cell.classList.add('sens-cell--point-a');
          cell.setAttribute('data-badge', 'А');
          cell.setAttribute('title', 'Предприятие А: D=30, R=10%');
        }
        if (inc === 35 && rate === 14) {
          cell.classList.add('sens-cell--point-b');
          cell.setAttribute('data-badge', 'Б');
          cell.setAttribute('title', 'Предприятие Б: D=35, R=14%');
        }

        cell.addEventListener('click', () => {
          if (incomeInput) { incomeInput.value = inc; if (incomeRange) incomeRange.value = inc; }
          if (rateInput)   { rateInput.value = rate; if (rateRange) rateRange.value = rate; }
          setError(incomeInput, incomeError, '');
          setError(rateInput, rateError, '');
          renderResult(inc, rate);
          $$('.sens-cell.is-selected').forEach((c) => c.classList.remove('is-selected'));
          cell.classList.add('is-selected');
          toast(`Подставлено: D = ${inc}, R = ${rate}%`);
          scrollTo('#calculator');
        });

        grid.appendChild(cell);
      });
    });
  }
  renderSensitivity();

  /* ---------- 16. Случайный кейс ---------- */
  (function initRandCase() {
    const btn = $('#randBtn');
    const body = $('#randBody');
    if (!btn || !body) return;
    let correctValue = 0;

    function makeCase() {
      const inc = Math.floor(Math.random() * 40) + 20;
      const rate = Math.floor(Math.random() * 15) + 8;
      correctValue = inc / (rate / 100);
      return { inc, rate };
    }

    function render() {
      const { inc, rate } = makeCase();
      const opts = new Set();
      opts.add(Math.round(correctValue));
      while (opts.size < 3) {
        const delta = (Math.random() - 0.5) * correctValue * 0.5;
        const cand = Math.round(correctValue + delta);
        if (cand > 0 && cand !== Math.round(correctValue)) opts.add(cand);
      }
      const answers = Array.from(opts).sort(() => Math.random() - 0.5);
      const dict = I18N[currentLang] || I18N.ru;

      body.innerHTML = `<div class="practice-task">D = <strong>${inc}</strong>, R = <strong>${rate}%</strong>.<br>V = ?</div><div class="rand-answers"></div>`;
      const list = $('.rand-answers', body);

      answers.forEach((a) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'rand-answer';
        b.textContent = a + ' млн тг';
        b.addEventListener('click', () => {
          list.querySelectorAll('.rand-answer').forEach((x) => x.disabled = true);
          if (a === Math.round(correctValue)) {
            b.classList.add('is-correct');
            toast(dict.pr.correct);
          } else {
            b.classList.add('is-wrong');
            list.querySelectorAll('.rand-answer').forEach((x) => {
              if (Number(x.textContent.split(' ')[0]) === Math.round(correctValue)) x.classList.add('is-correct');
            });
            toast(`${dict.pr.wrong} ${Math.round(correctValue)} млн тг`);
          }
        });
        list.appendChild(b);
      });
    }

    btn.addEventListener('click', render);
    render();
  })();

  /* ---------- 17. Таймер ---------- */
  (function initTimer() {
    const startBtn = $('#timerStart');
    const submitBtn = $('#timerSubmit');
    const input = $('#timerAnswer');
    const fill = $('#timerFill');
    const task = $('#timerTask');
    if (!startBtn || !submitBtn || !input || !fill || !task) return;

    let timerId = null, deadline = 0, correct = 0;
    const DURATION = 20000;

    function stop() {
      if (timerId) cancelAnimationFrame(timerId);
      timerId = null;
      input.disabled = true; submitBtn.disabled = true; startBtn.disabled = false;
    }

    function tick() {
      const left = Math.max(0, deadline - performance.now());
      const pct = (left / DURATION) * 100;
      fill.style.width = pct + '%';
      fill.classList.toggle('is-warn', pct < 55 && pct >= 25);
      fill.classList.toggle('is-danger', pct < 25);
      if (left <= 0) {
        stop();
        task.innerHTML = `<span class="practice-task__muted">Время вышло! Правильный ответ: <strong>${Math.round(correct)}</strong> млн тг</span>`;
        return;
      }
      timerId = requestAnimationFrame(tick);
    }

    startBtn.addEventListener('click', () => {
      const inc = Math.floor(Math.random() * 40) + 20;
      const rate = Math.floor(Math.random() * 14) + 8;
      correct = inc / (rate / 100);
      task.innerHTML = `D = <strong>${inc}</strong>, R = <strong>${rate}%</strong>`;
      input.value = ''; input.disabled = false; input.focus();
      submitBtn.disabled = false; startBtn.disabled = true;
      deadline = performance.now() + DURATION;
      fill.style.width = '100%';
      fill.classList.remove('is-warn', 'is-danger');
      tick();
    });

    submitBtn.addEventListener('click', () => {
      const val = parseNum(input.value);
      const dict = I18N[currentLang] || I18N.ru;
      stop();
      if (Math.abs(val - correct) <= Math.max(1, correct * 0.02)) {
        toast(dict.pr.correct);
        task.innerHTML = `<span class="practice-task__muted">✅ V = <strong>${Math.round(correct)}</strong> млн тг</span>`;
      } else {
        toast(`${dict.pr.wrong} ${Math.round(correct)} млн тг`);
        task.innerHTML = `<span class="practice-task__muted">❌ ${dict.pr.wrong} <strong>${Math.round(correct)}</strong> млн тг</span>`;
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); submitBtn.click(); }
    });
  })();

  /* ---------- 18. Anki CSV ---------- */
  (function initAnki() {
    const btn = $('#ankiBtn');
    if (!btn) return;
    const cards = [
      ['Какая формула метода капитализации дохода?', 'V = D / R'],
      ['Что такое V в формуле?', 'Расчётная стоимость предприятия'],
      ['Что такое D в формуле?', 'Годовой доход предприятия'],
      ['Что такое R в формуле?', 'Ставка капитализации'],
      ['V при D = 30 млн тг и R = 10%?', '300 млн тг'],
      ['V при D = 35 млн тг и R = 14%?', '250 млн тг'],
      ['Какое предприятие дороже — А или Б?', 'А: 300 > 250 млн тг'],
      ['Почему Б дешевле при большем доходе?', 'Из-за более высокой ставки капитализации (14%)'],
      ['Что произойдёт при росте ставки R?', 'Стоимость снизится'],
      ['V при D = 30, R = 8%?', '375 млн тг']
    ];

    const esc = (s) => '"' + String(s).replace(/"/g, '""') + '"';

    btn.addEventListener('click', () => {
      const csv = '\uFEFF' + cards.map(([q, a]) => [esc(q), esc(a)].join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'case6-anki-cards.csv';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('CSV-файл скачан');
    });
  })();

  /* ---------- 19. Копирование ---------- */
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.getAttribute('data-copy'));
        toast('Формула скопирована');
      } catch (_) { toast('Не удалось скопировать'); }
    });
  });

  /* ---------- 20. Квиз ---------- */
  (function initQuiz() {
    const box = $('#quizBox');
    if (!box) return;

    const questions = [
      { q:'У какого предприятия выше годовой доход?', opts:['У предприятия А','У предприятия Б','Одинаковый'], correct:1 },
      { q:'У какого предприятия выше расчётная стоимость?', opts:['У предприятия А','У предприятия Б','Одинаковая'], correct:0 },
      { q:'Почему стоимость предприятия А выше, несмотря на меньший доход?', opts:['Больше сотрудников','Ниже ставка капитализации','Выше инфляция'], correct:1 },
      { q:'Если бы у предприятия Б ставка была 10%, стоимость составила бы:', opts:['250 млн тг','300 млн тг','350 млн тг'], correct:2 }
    ];

    let answered = new Set();

    questions.forEach((item, qIdx) => {
      const wrap = document.createElement('div');
      wrap.className = 'quiz__q';
      const title = document.createElement('p');
      title.className = 'quiz__title';
      title.textContent = (qIdx + 1) + '. ' + item.q;
      wrap.appendChild(title);

      const opts = document.createElement('div');
      opts.className = 'quiz__opts';

      item.opts.forEach((text, oIdx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'quiz__opt';
        b.textContent = text;
        b.addEventListener('click', () => {
          if (answered.has(qIdx)) return;
          answered.add(qIdx);
          opts.querySelectorAll('.quiz__opt').forEach((x, i) => {
            if (i === item.correct) x.classList.add('is-correct');
            else if (i === oIdx) x.classList.add('is-wrong');
            x.disabled = true;
          });
          updateScore();
        });
        opts.appendChild(b);
      });
      wrap.appendChild(opts);
      box.appendChild(wrap);
    });

    const actions = document.createElement('div');
    actions.className = 'quiz__actions';
    actions.innerHTML = `
      <span class="quiz__score" id="quizScore">Правильных ответов: <strong>0</strong> из ${questions.length}</span>
      <button class="btn btn--ghost" type="button" id="quizReset">Пройти заново</button>`;
    box.appendChild(actions);

    const scoreEl = $('#quizScore strong', actions);
    const resetBtn = $('#quizReset', actions);

    function updateScore() {
      let count = 0;
      box.querySelectorAll('.quiz__q').forEach((qEl, i) => {
        if (!answered.has(i)) return;
        const wrong = qEl.querySelector('.quiz__opt.is-wrong');
        const correctBtn = qEl.querySelectorAll('.quiz__opt')[questions[i].correct];
        if (!wrong && correctBtn.classList.contains('is-correct')) count++;
      });
      scoreEl.textContent = count;
    }

    resetBtn.addEventListener('click', () => {
      answered = new Set();
      box.querySelectorAll('.quiz__q').forEach((qEl) => {
        qEl.querySelectorAll('.quiz__opt').forEach((b) => {
          b.disabled = false;
          b.classList.remove('is-correct', 'is-wrong');
        });
      });
      scoreEl.textContent = '0';
      toast('Квиз сброшен');
    });
  })();

  /* ---------- 21. Конфетти ---------- */
  (function initConfetti() {
    const canvas = $('#confettiCanvas');
    const section = $('#winner');
    if (!canvas || !section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let particles = [], raf = null, launched = false;
    const COLORS = ['#4f46e5', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

    function resize() {
      const r = section.getBoundingClientRect();
      canvas.width = r.width; canvas.height = r.height;
    }

    function spawn() {
      const W = canvas.width;
      for (let i = 0; i < 140; i++) {
        particles.push({
          x: W / 2 + (Math.random() - 0.5) * W * 0.4,
          y: -20 - Math.random() * 60,
          vx: (Math.random() - 0.5) * 4,
          vy: 2 + Math.random() * 3,
          w: 6 + Math.random() * 8,
          h: 8 + Math.random() * 6,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.25,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.vx *= 0.995; p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, p.y - canvas.height * 0.8) / (canvas.height * 0.4));
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      particles = particles.filter((p) => p.y < canvas.height + 40);
      if (particles.length) raf = requestAnimationFrame(draw);
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); raf = null; }
    }

    function launch() {
      if (launched) return;
      launched = true;
      resize(); spawn();
      if (!raf) raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(section);

    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) launch(); });
      }, { threshold: 0.35 });
      o.observe(section);
    } else launch();
  })();

  /* ---------- 22. Скролл ---------- */
  const progressBar = $('#progressBar');
  const topbar = $('#topbar');
  const toTop = $('#toTop');

  function onScroll() {
    const y = window.pageYOffset || document.documentElement.scrollTop;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (dh > 0 ? (y / dh) * 100 : 0).toFixed(2) + '%';
    if (topbar) topbar.classList.toggle('is-scrolled', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 500);
  }
  let sTick = false;
  window.addEventListener('scroll', () => {
    if (sTick) return;
    sTick = true;
    requestAnimationFrame(() => { onScroll(); sTick = false; });
  }, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 23. Активная навигация ---------- */
  const navLinks = $$('.nav a');
  const sections = navLinks.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const o = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = '#' + en.target.id;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => o.observe(s));
  }

  /* ---------- 24. Печать и презентация ---------- */
  const printBtn = $('#printBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  const presentBtn = $('#presentBtn');
  function togglePresent(on) {
    document.body.classList.toggle('present-mode', on);
    if (on) toast('Режим презентации. Esc — выход.');
  }
  if (presentBtn) presentBtn.addEventListener('click', () => {
    togglePresent(!document.body.classList.contains('present-mode'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('present-mode')) togglePresent(false);
  });

  /* ---------- 25. Термины-подсказки ---------- */
  $$('.term').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toast(btn.dataset.termText || '');
    });
  });

  /* ---------- 26. Первичная локализация ---------- */
  applyLang(currentLang);

})();
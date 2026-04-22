/* =============================================
   HAEJI WI — PORTFOLIO SCRIPT
   GSAP + ScrollTrigger
   ============================================= */

gsap.registerPlugin(ScrollTrigger);

/* =============================================
   1. NAVBAR
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Lang toggle
  navbar.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navbar.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Scroll spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = navbar.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));
}

/* =============================================
   2. HERO — LOAD ANIMATION + DYNAMIC TEXT
   ============================================= */
function initHero() {
  const lines     = document.querySelectorAll('.hero-line-fixed');
  const dynamic   = document.querySelector('.hero-line-dynamic');
  const sub       = document.querySelector('.hero-sub');
  const scrollHint = document.querySelector('.hero-scroll-hint');

  // Entrance timeline
  const tl = gsap.timeline({ delay: 0.2 });
  tl.to(lines,     { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' }, 0)
    .to(dynamic,   { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.2)
    .to(sub,       { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.3)
    .to(scrollHint,{ opacity: 1, duration: 0.6 }, 0.6);

  // Set initial states
  gsap.set([sub, scrollHint], { y: 20 });
  gsap.set(lines, { y: 30 });
}

function initHeroDynamic() {
  const el = document.getElementById('heroDynamic');
  if (!el) return;

  const words = [
    'unclear<br>decisions',
    'messy<br>operations',
    'user<br>frustration',
    'business<br>problems',
    'field<br>insights',
  ];

  let idx = 0;
  el.innerHTML = words[0];

  function cycle() {
    gsap.to(el, {
      opacity: 0, y: -16, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        idx = (idx + 1) % words.length;
        el.innerHTML = words[idx];
        gsap.fromTo(el,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
            onComplete: () => setTimeout(cycle, 1800)
          }
        );
      }
    });
  }

  setTimeout(cycle, 1800);
}

/* =============================================
   3. ABOUT INTRO — STAMP TUMBLE-IN
   ============================================= */
function initAboutIntro() {
  const section = document.querySelector('.about-intro');
  if (!section) return;

  const lines  = section.querySelectorAll('.about-line');
  const stamps = section.querySelectorAll('.about-stamp');

  // 스탬프 초기 상태: 위에서 대기
  gsap.set(stamps, { y: -200, opacity: 0, rotation: 0 });

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 70%' }
  });

  // 텍스트 라인 fade + slide-up stagger
  tl.from(lines, {
    opacity: 0, y: 50,
    duration: 0.75,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // 스탬프 tumble-in: 각 data-rot 값으로 착지
  stamps.forEach((stamp, i) => {
    const rot = parseFloat(stamp.dataset.rot) || 0;
    tl.to(stamp, {
      y: 0, opacity: 1, rotation: rot,
      duration: 0.65,
      ease: 'back.out(1.6)',
    }, i === 0 ? '-=0.3' : '-=0.45');
  });
}

/* =============================================
   4. PROJECTS — GSAP HORIZONTAL SCROLL
   ============================================= */
function initProjectsScroll() {
  const sticky  = document.querySelector('.projects-sticky');
  const track   = document.getElementById('projectsTrack');
  const counter = document.getElementById('projectCounter');
  const dots    = document.querySelectorAll('.proj-dot');
  const slides  = document.querySelectorAll('.project-slide');
  if (!sticky || !track || !slides.length) return;

  let currentIdx = 0;

  function updateUI(idx) {
    if (idx === currentIdx && idx !== 0) return;
    currentIdx = idx;
    counter.textContent = `${String(idx + 1).padStart(2, '0')} / 05`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  gsap.to(track, {
    x: () => -(slides.length - 1) * window.innerWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: sticky,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        updateUI(Math.round(self.progress * (slides.length - 1)));
      }
    }
  });

  // Dot click — scroll to that slide
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const stickyH = sticky.offsetHeight - window.innerHeight;
      const targetY = sticky.offsetTop + (i / (slides.length - 1)) * stickyH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

/* =============================================
   4. TIMELINE — SVG WAVE + GSAP DRAW
   ============================================= */
function buildWavePath(totalHeight) {
  const amp = 70, wl = 320, cx = 90;
  const points = [];
  for (let y = 0; y <= totalHeight; y += 6) {
    const x = cx + Math.sin((y / wl) * Math.PI * 2) * amp;
    points.push(`${x},${y}`);
  }
  return 'M ' + points.join(' L ');
}

function initTimeline() {
  const timelineEl = document.querySelector('.timeline');
  const svgEl      = document.getElementById('timelineSvg');
  const pathEl     = document.getElementById('timelinePath');
  const balls      = document.querySelectorAll('.tl-ball');
  const items      = document.querySelectorAll('.timeline-item');
  if (!timelineEl || !svgEl || !pathEl) return;

  const h = timelineEl.offsetHeight;
  pathEl.setAttribute('d', buildWavePath(h));
  svgEl.setAttribute('viewBox', `0 0 180 ${h}`);
  svgEl.style.height = h + 'px';

  const totalLen = pathEl.getTotalLength();

  // Place balls on path
  items.forEach((item, i) => {
    if (!balls[i]) return;
    const itemY = item.offsetTop + item.offsetHeight / 2;
    const pct   = Math.min(itemY / h, 1);
    const pt    = pathEl.getPointAtLength(totalLen * pct);
    balls[i].setAttribute('cx', pt.x);
    balls[i].setAttribute('cy', pt.y);
  });

  // Stroke draw via GSAP scrub
  pathEl.style.strokeDasharray  = `${totalLen}`;
  pathEl.style.strokeDashoffset = `${totalLen}`;

  gsap.to(pathEl, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: timelineEl,
      start: 'top 70%',
      end: 'bottom 80%',
      scrub: 1,
    }
  });

  // Timeline items fade-up
  items.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Ball pop-in
  items.forEach((item, i) => {
    if (!balls[i]) return;
    ScrollTrigger.create({
      trigger: item,
      start: 'top 75%',
      onEnter: () => gsap.to(balls[i], { attr: { r: 10 }, duration: 0.5, ease: 'back.out(2)' }),
      onLeaveBack: () => gsap.to(balls[i], { attr: { r: 0 }, duration: 0.3 }),
    });
  });
}

/* =============================================
   5. TESTIMONIALS
   ============================================= */
function initTestimonials() {
  const heading  = document.querySelector('.testimonials-heading');
  const thWords  = document.querySelector('.th-muted');   // WORDS → 오른쪽
  const thFrom   = document.querySelector('.th-light');   // FROM  → 왼쪽 미세
  const thPeople = document.querySelector('.th-accent');  // PEOPLE → 왼쪽

  if (!heading) return;

  // 초기 위치 — 약간 엇갈리게
  gsap.set(thWords,  { x: '8vw'  });
  gsap.set(thFrom,   { x: '0'    });
  gsap.set(thPeople, { x: '-8vw' });

  const st = { trigger: heading, start: 'top bottom', end: 'bottom top', scrub: 1.5 };

  // 최종 위치: 1280px 기준 중앙에서 ±160px 이내로 고정
  gsap.to(thWords,  { x: 160,  ease: 'none', scrollTrigger: st });
  gsap.to(thFrom,   { x: -40,  ease: 'none', scrollTrigger: st });
  gsap.to(thPeople, { x: -260, ease: 'none', scrollTrigger: st });

  // testimonial 카드 fade-up
  document.querySelectorAll('.testimonial-item').forEach((item) => {
    gsap.to(item, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });
}

/* =============================================
   6. SKILLS + CONTACT — GRAVITY FALL + FULL-SECTION CURSOR FOLLOW
   ============================================= */
function initSkillsContact() {
  const section = document.querySelector('.skills-contact');
  const pills   = document.querySelectorAll('.skill-pill');
  const reveal  = document.getElementById('contactReveal');
  if (!section || !pills.length) return;

  const pillCount  = pills.length;
  const fallPos    = Array.from({ length: pillCount }, () => ({ x: 0, y: 0 }));
  const naturalCtr = Array.from({ length: pillCount }, () => ({ x: 0, y: 0 }));
  let fallen       = false;

  // Initial state — hidden stacked
  gsap.set(pills, { opacity: 0, y: 40 });

  // Entrance — replayable
  function playEntrance() {
    gsap.to(pills, {
      opacity: 1, y: 0,
      stagger: 0.07,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: true
    });
    if (reveal) {
      gsap.to(reveal, {
        opacity: 1, duration: 0.5, ease: 'power2.out',
        onStart: () => reveal.classList.add('visible')
      });
    }
  }

  // Full reset
  function resetSection() {
    fallen = false;
    gsap.killTweensOf(pills);
    gsap.set(pills, { x: 0, y: 40, rotation: 0, scaleX: 1, scaleY: 1, borderRadius: '100px', opacity: 0 });
    if (reveal) {
      gsap.set(reveal, { opacity: 0 });
      reveal.classList.remove('visible');
    }
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    onEnter:     playEntrance,
    onEnterBack: playEntrance,
    onLeaveBack: resetSection,
    onLeave:     resetSection
  });

  // Phase 1 — explosion scatter from center
  function doFall() {
    if (fallen) return;
    fallen = true;

    const sr = section.getBoundingClientRect();

    pills.forEach((pill, i) => {
      const pr = pill.getBoundingClientRect();
      const cx = pr.left + pr.width  / 2;
      const cy = pr.top  + pr.height / 2;
      naturalCtr[i] = { x: cx, y: cy };

      const targetX = gsap.utils.random(-sr.width * 0.42, sr.width * 0.42);
      const targetY = gsap.utils.random(-120, 380);
      const rot     = gsap.utils.random(-80, 80);

      fallPos[i] = { x: targetX, y: targetY };

      gsap.to(pill, {
        x: targetX, y: targetY, rotation: rot, opacity: 0.9,
        duration: gsap.utils.random(0.44, 0.82),
        ease: 'power3.in',
        delay: i * 0.022,
        overwrite: 'auto',
        onComplete() {
          gsap.timeline()
            .to(pill, { scaleX: 1.35, scaleY: 0.5, borderRadius: '50%', duration: 0.1,  ease: 'power3.out' })
            .to(pill, { scaleX: 1,    scaleY: 1,   borderRadius: '100px', duration: 0.65, ease: 'elastic.out(1.3, 0.38)' });
        }
      });
    });
  }

  // Per-pill hover squash-and-stretch
  pills.forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      if (!fallen) return;
      gsap.timeline({ overwrite: false })
        .to(pill, { scaleX: 1.52, scaleY: 0.3,   borderRadius: '50%',   duration: 0.13, ease: 'power3.in' })
        .to(pill, { scaleX: 1,    scaleY: 1,      borderRadius: '100px', duration: 1.05, ease: 'elastic.out(2, 0.3)' });
    });
  });

  section.addEventListener('mouseenter', doFall);
}

/* =============================================
   INIT
   ============================================= */
window.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHero();
  initHeroDynamic();
  initAboutIntro();
  initTestimonials();
});

window.addEventListener('load', () => {
  initProjectsScroll();
  initTimeline();
  initSkillsContact();
  ScrollTrigger.refresh();
});

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
  initTimeline();
});

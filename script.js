/* =============================================
   MAINPAGE — SCRIPT
   ============================================= */

/* ===========================
   1. SECTION HEADING CLIP-PATH REVEAL
   =========================== */
function initHeadingReveal() {
  const headings = document.querySelectorAll('.section-heading');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  headings.forEach(h => obs.observe(h));
}

/* ===========================
   2. WORD-BY-WORD STAGGER (hero-intro)
   =========================== */
function initWordSplit() {
  const intro = document.querySelector('.hero-intro');
  if (!intro) return;

  // Preserve <span> children (highlight, highlight-accent)
  const rawHTML = intro.innerHTML;
  // Parse into text + span nodes
  const temp = document.createElement('div');
  temp.innerHTML = rawHTML;

  let wordIdx = 0;
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach(part => {
        if (/^\s+$/.test(part) || part === '') {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'word-token';
          span.style.setProperty('--i', wordIdx++);
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Wrap the entire inline element as one token
      const span = document.createElement('span');
      span.className = 'word-token';
      span.style.setProperty('--i', wordIdx++);
      span.appendChild(node.cloneNode(true));
      node.parentNode.replaceChild(span, node);
    }
  }

  Array.from(temp.childNodes).forEach(processNode);
  intro.innerHTML = '';
  intro.appendChild(temp);

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.word-token').forEach(t => t.classList.add('visible'));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(intro);
}

/* ===========================
   3. SECTION CONTENT FADE-UP (.anim-fade)
   =========================== */
function initFadeUp() {
  // Auto-tag elements that should fade
  const selectors = [
    '.section-sub',
    '.feature-list li',
    '.tech-logos',
    '.code-snippet-placeholder',
    '.snippet-desc',
    '.timeline-item',
    '.contact-inner > *',
    '.projects-header .section-heading'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('anim-fade');
      el.style.setProperty('--idx', i);
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.anim-fade').forEach(el => obs.observe(el));
}

/* ===========================
   4. CHALLENGE ITEMS SLIDE-IN
   =========================== */
function initChallengeSlide() {
  const items = document.querySelectorAll('.challenge-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => obs.observe(item));
}

/* ===========================
   5. TESTIMONIAL CARDS STAGGER
   =========================== */
function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(card => obs.observe(card));
}

/* ===========================
   6. TIMELINE — SVG ANIMATION (lerp scrub)
   =========================== */
function buildWavePath(totalHeight) {
  const amp = 70;
  const wl  = 320;
  const cx  = 90;
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

  // Ball initial r = 0 for scale pop
  balls.forEach(b => b.setAttribute('r', '0'));

  // Place balls on path
  items.forEach((item, i) => {
    if (!balls[i]) return;
    const itemY = item.offsetTop + item.offsetHeight / 2;
    const pct   = Math.min(itemY / h, 1);
    const pt    = pathEl.getPointAtLength(totalLen * pct);
    balls[i].setAttribute('cx', pt.x);
    balls[i].setAttribute('cy', pt.y);
  });

  // Path draw setup
  pathEl.style.strokeDasharray  = `${totalLen}`;
  pathEl.style.strokeDashoffset = `${totalLen}`;

  // Lerp scrub state
  let currentOffset = totalLen;
  let targetOffset  = totalLen;
  let rafId = null;

  function lerpLoop() {
    currentOffset += (targetOffset - currentOffset) * 0.08;
    pathEl.style.strokeDashoffset = currentOffset;
    if (Math.abs(currentOffset - targetOffset) > 0.5) {
      rafId = requestAnimationFrame(lerpLoop);
    } else {
      rafId = null;
    }
  }

  function updatePath() {
    const rect     = timelineEl.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.5);
    const pct      = Math.min(scrolled / h, 1);
    targetOffset   = totalLen * (1 - pct);
    if (!rafId) rafId = requestAnimationFrame(lerpLoop);
  }

  window.addEventListener('scroll', updatePath, { passive: true });
  updatePath();

  // Ball scale pop-in via IntersectionObserver
  const ballObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const i = Array.from(items).indexOf(entry.target);
      if (!balls[i]) return;
      if (entry.isIntersecting) {
        balls[i].classList.add('visible');
      } else {
        balls[i].classList.remove('visible');
        balls[i].setAttribute('r', '0');
      }
    });
  }, { threshold: 0.3 });

  items.forEach(item => ballObs.observe(item));
}

window.addEventListener('load', initTimeline);
window.addEventListener('resize', initTimeline);

/* ===========================
   7. PROJECTS — STICKY HORIZONTAL SCROLL
   =========================== */
function initProjectsScroll() {
  const sticky  = document.querySelector('.projects-sticky');
  const track   = document.getElementById('projectsTrack');
  const counter = document.getElementById('projectCounter');
  const dots    = document.querySelectorAll('.proj-dot');
  const slides  = document.querySelectorAll('.project-slide');
  if (!sticky || !track) return;

  let currentIdx = -1;
  let isSnapping  = false;

  function getStickyH() {
    return sticky.offsetHeight - window.innerHeight;
  }

  function updateUI(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    counter.textContent = `${String(idx + 1).padStart(2, '0')} / 05`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function onScroll() {
    const rect      = sticky.getBoundingClientRect();
    const stickyH   = getStickyH();
    const scrolled  = Math.max(0, Math.min(-rect.top, stickyH));
    const pct       = stickyH > 0 ? scrolled / stickyH : 0;
    const total     = slides.length;
    const translateX = pct * (total - 1) * 100;

    track.style.transform = `translateX(-${translateX}vw)`;

    const idx = Math.min(total - 1, Math.round(pct * (total - 1)));
    updateUI(idx);
  }

  // 특정 슬라이드 위치로 스냅
  function snapToSlide(idx) {
    const stickyH  = getStickyH();
    const total    = slides.length;
    const targetY  = sticky.offsetTop + (idx / (total - 1)) * stickyH;
    isSnapping = true;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
    setTimeout(() => { isSnapping = false; }, 800);
  }

  // 현재 scroll 위치에서 가장 가까운 슬라이드로 snap
  function snapToNearest() {
    if (isSnapping) return;
    const rect    = sticky.getBoundingClientRect();
    const stickyH = getStickyH();
    // 스티키 존 안에 있을 때만 작동
    if (rect.top > 5 || rect.bottom < window.innerHeight - 5) return;
    const scrolled = Math.max(0, -rect.top);
    const pct      = Math.min(scrolled / stickyH, 1);
    const nearest  = Math.round(pct * (slides.length - 1));
    if (nearest !== currentIdx) snapToSlide(nearest);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // scrollend 지원 브라우저: 즉시 snap
  // 미지원 브라우저: 150ms debounce fallback
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', snapToNearest, { passive: true });
  } else {
    let snapTimer = null;
    window.addEventListener('scroll', () => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToNearest, 150);
    }, { passive: true });
  }

  // 도트 클릭
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => snapToSlide(i));
  });
}

window.addEventListener('load', initProjectsScroll);
window.addEventListener('resize', initProjectsScroll);

/* ===========================
   8. PROJECTS — ACCORDION + IMAGE TRANSITION
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.proj-acc-item').forEach(item => {
    item.addEventListener('click', () => {
      const list     = item.closest('.proj-acc-list');
      const siblings = list.querySelectorAll('.proj-acc-item');
      siblings.forEach(s => s.classList.remove('active'));
      item.classList.add('active');

      // Sync stacked images
      const slide   = item.closest('.project-slide');
      const imgs    = slide.querySelectorAll('.project-images .project-screenshot-placeholder');
      const accIdx  = Array.from(siblings).indexOf(item) % imgs.length;
      imgs.forEach((img, i) => {
        img.style.zIndex  = i === accIdx ? '3' : i === 0 ? '2' : '1';
        img.style.opacity = i === accIdx ? '1' : '0.3';
      });
    });
  });
});

/* ===========================
   HERO — DYNAMIC TEXT ANIMATION
   =========================== */
function initHeroDynamic() {
  const inputEl  = document.getElementById('heroInput');
  const outputEl = document.getElementById('heroOutput');
  if (!inputEl || !outputEl) return;

  const pairs = [
    { input: 'raw ideas',       output: 'crafted experience'   },
    { input: 'complex systems', output: 'simple interactions'  },
    { input: 'products',        output: 'business growth'      },
  ];

  const REPEATS    = 2;          // 전체 사이클 반복 횟수
  const HOLD_MS    = 1500;       // 각 페어 노출 시간
  const SLIDE_MS   = 450;        // slide-in 길이

  let cycleIdx = 0;              // 현재 페어 인덱스 (0~2)
  let repeatCount = 0;           // 완료된 사이클 수
  let timer = null;

  // 초기 텍스트를 .hero-dynamic-inner 로 래핑
  function wrap(el, text) {
    el.innerHTML = `<span class="hero-dynamic-inner">${text}</span>`;
  }

  wrap(inputEl,  pairs[0].input);
  wrap(outputEl, pairs[0].output);

  function swapTo(idx) {
    const pair = pairs[idx];

    function animateEl(el, newText) {
      const inner = el.querySelector('.hero-dynamic-inner');

      // slide out
      inner.classList.remove('slide-in');
      inner.classList.add('slide-out');

      setTimeout(() => {
        wrap(el, newText);
        const newInner = el.querySelector('.hero-dynamic-inner');
        newInner.classList.add('slide-in');
      }, 350);
    }

    animateEl(inputEl,  pair.input);
    animateEl(outputEl, pair.output);
  }

  function step() {
    cycleIdx++;

    // 한 사이클 완료
    if (cycleIdx >= pairs.length) {
      cycleIdx = 0;
      repeatCount++;
    }

    // REPEATS 완료 후 마지막 페어(business growth)에서 정지
    if (repeatCount >= REPEATS && cycleIdx === 0) {
      // 마지막 페어로 이동 후 정지
      swapTo(pairs.length - 1);
      return;
    }

    swapTo(cycleIdx);
    timer = setTimeout(step, HOLD_MS + SLIDE_MS);
  }

  // 첫 페어 노출 후 시작
  timer = setTimeout(step, HOLD_MS);
}

/* ===========================
   NAVBAR — SCROLL + LANG
   =========================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Lang toggle
  const langBtns = navbar.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langBtns.forEach(b => b.classList.remove('active'));
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

/* ===========================
   INIT ALL ON LOAD
   =========================== */
window.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroDynamic();
  initHeadingReveal();
  initWordSplit();
  initFadeUp();
  initChallengeSlide();
  initTestimonials();
});

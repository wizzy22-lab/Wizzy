/* =============================================
   FADESTOCODES WIREFRAME — SCRIPT
   ============================================= */

/* ===========================
   TIMELINE — SVG ANIMATION
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

  /* 볼 위치 배치 */
  items.forEach((item, i) => {
    if (!balls[i]) return;
    const itemY = item.offsetTop + item.offsetHeight / 2;
    const pct   = Math.min(itemY / h, 1);
    const pt    = pathEl.getPointAtLength(totalLen * pct);
    balls[i].setAttribute('cx', pt.x);
    balls[i].setAttribute('cy', pt.y);
  });

  /* Path 드로우 */
  pathEl.style.strokeDasharray  = `${totalLen}`;
  pathEl.style.strokeDashoffset = `${totalLen}`;

  function updatePath() {
    const rect     = timelineEl.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top + window.innerHeight * 0.6);
    const pct      = Math.min(scrolled / h, 1);
    pathEl.style.strokeDashoffset = `${totalLen * (1 - pct)}`;
  }

  window.addEventListener('scroll', updatePath, { passive: true });
  updatePath();

  /* 볼 팝인 */
  const ballObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const i = Array.from(items).indexOf(entry.target);
      if (!balls[i]) return;
      if (entry.isIntersecting) {
        balls[i].classList.add('visible');
      } else {
        balls[i].classList.remove('visible');
      }
    });
  }, { threshold: 0.3 });

  items.forEach(item => ballObserver.observe(item));
}

window.addEventListener('load', initTimeline);
window.addEventListener('resize', initTimeline);

/* ===========================
   PROJECTS — STICKY HORIZONTAL SCROLL
   =========================== */
function initProjectsScroll() {
  const sticky  = document.querySelector('.projects-sticky');
  const track   = document.getElementById('projectsTrack');
  const counter = document.getElementById('projectCounter');
  const dots    = document.querySelectorAll('.proj-dot');
  const slides  = document.querySelectorAll('.project-slide');
  if (!sticky || !track) return;

  let currentIdx = -1;

  function updateUI(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    counter.textContent = `${String(idx + 1).padStart(2, '0')} / 05`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function onScroll() {
    const rect      = sticky.getBoundingClientRect();
    const stickyH   = sticky.offsetHeight - window.innerHeight;
    const scrolled  = Math.max(0, Math.min(-rect.top, stickyH));
    const pct       = stickyH > 0 ? scrolled / stickyH : 0;
    const total     = slides.length;
    const translateX = pct * (total - 1) * 100;

    track.style.transform = `translateX(-${translateX}vw)`;

    const idx = Math.min(total - 1, Math.round(pct * (total - 1)));
    updateUI(idx);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Dot click — scroll to that slide */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const stickyH  = sticky.offsetHeight - window.innerHeight;
      const total    = slides.length;
      const targetPct = i / (total - 1);
      const targetScrollY = sticky.offsetTop + targetPct * stickyH;
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    });
  });
}

window.addEventListener('load', initProjectsScroll);
window.addEventListener('resize', initProjectsScroll);

/* ===========================
   PROJECTS — ACCORDION
   =========================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.proj-acc-item').forEach(item => {
    item.addEventListener('click', () => {
      const siblings = item.closest('.proj-acc-list').querySelectorAll('.proj-acc-item');
      siblings.forEach(s => s.classList.remove('active'));
      item.classList.add('active');
    });
  });
});

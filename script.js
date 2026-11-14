(() => {
  const story = document.querySelector('.story');
  const photo = document.querySelector('#story-photo');
  const warmth = document.querySelector('#story-warmth');
  const copy = document.querySelector('#hero-copy');
  const bean = document.querySelector('#hero-bean');
  const subtitle = document.querySelector('#hero-subtitle');
  const glassWrap = document.querySelector('#glass-wrap');
  const glassOutline = document.querySelector('#glass-outline');
  const glassPhoto = document.querySelector('#glass-photo');
  const transformation = document.querySelector('#transformation-copy');
  const cue = document.querySelector('#scroll-cue');
  const canvas = document.querySelector('#coffee-particles');
  const ctx = canvas.getContext('2d');
  const progressFill = document.querySelector('#reading-progress-fill');
  const siteHeader = document.querySelector('.site-header');
  const explain = document.querySelector('.explain');
  const explainHeading = document.querySelector('.explain-heading');
  const explainBody = document.querySelector('.explain-body');
  const explainSteps = [...document.querySelectorAll('.process-step')];
  const explainOutline = document.querySelector('.outline-word');
  const explainHalo = document.querySelector('.explain-halo');
  const world = document.querySelector('.world');
  const worldLines = [...document.querySelectorAll('.world-line')];
  const worldEyebrow = document.querySelector('.world-content .eyebrow');
  const worldParagraph = document.querySelector('.world-content>p:last-child');
  const worldOrbits = [...document.querySelectorAll('.world-orbit')];
  const worldGlow = document.querySelector('.world-glow');
  const worldStamp = document.querySelector('.world-stamp');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const smooth = t => t * t * (3 - 2 * t);
  const mix = (a, b, t) => a + (b - a) * t;
  let viewportW = 0, viewportH = 0, dpr = 1, raf = 0;

  function random(seed) {
    let x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  const dust = Array.from({ length: 300 }, (_, i) => ({
    x: random(i + 1), y: random(i + 41), delay: random(i + 79) * .76,
    size: mix(1.2, 5.2, random(i + 117)), wobble: random(i + 201) * 2 - 1,
    shade: i % 4
  }));

  function sizeCanvas() {
    viewportW = innerWidth;
    viewportH = innerHeight;
    // The bean image has transparent margins: space its visible contour,
    // rather than its full image box, against the title and supporting line.
    const beanHeight = bean.offsetWidth * 1.5;
    const gap = Math.min(30, Math.max(20, viewportH * .025));
    const headingHeight = copy.offsetHeight;
    const groupHeight = headingHeight + beanHeight * .67 + subtitle.offsetHeight + gap * 2;
    const groupTop = Math.max(82, (viewportH - groupHeight) / 2 - viewportH * .025);
    const beanCenter = groupTop + headingHeight + gap + beanHeight * .32;
    copy.style.top = `${groupTop}px`;
    bean.style.top = `${beanCenter}px`;
    subtitle.style.top = `${beanCenter + beanHeight * .35 + gap}px`;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewportW * dpr);
    canvas.height = Math.round(viewportH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function drawDust(p) {
    ctx.clearRect(0, 0, viewportW, viewportH);
    if (p < .28 || p > .78 || reduceMotion.matches) return;
    const flight = range(p, .28, .78);
    const beanRect = bean.getBoundingClientRect();
    const beanSize = beanRect.width;
    const glassRect = glassWrap.getBoundingClientRect();
    const targetY = glassRect.top + glassRect.height * .58;
    for (const part of dust) {
      const local = (flight - part.delay) / .28;
      if (local <= 0 || local >= 1) continue;
      const t = smooth(local);
      const startX = viewportW * .5 + (part.x - .5) * beanSize * .58;
      const startY = beanRect.top + beanRect.height * .58 + (part.y - .5) * beanSize * .34;
      const endX = viewportW * .5 + (part.x - .5) * glassRect.width * .42;
      const x = mix(startX, endX, t) + Math.sin(t * Math.PI * 2) * part.wobble * 25;
      const y = mix(startY, targetY, t * t);
      const alpha = Math.min(1, local * 5, (1 - local) * 5) * .95;
      ctx.fillStyle = [`rgba(89,39,18,${alpha})`,`rgba(204,126,64,${alpha})`,`rgba(251,189,121,${alpha})`,`rgba(139,67,29,${alpha})`][part.shade];
      ctx.beginPath();
      ctx.ellipse(x, y, part.size * (1 - t * .25), part.size * .62, part.wobble, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderSecondAndThirdScenes() {
    if (reduceMotion.matches) {
      [explainHeading, explainBody, ...explainSteps, explainOutline, explainHalo,
        ...worldLines, worldEyebrow, worldParagraph, ...worldOrbits,
        worldGlow, worldStamp].forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.filter = '';
      });
      explainSteps.forEach(el => el.classList.remove('is-current'));
      return;
    }

    const explainRect = explain.getBoundingClientRect();
    const explainEntry = clamp((viewportH - explainRect.top) / viewportH);
    const ep = clamp(-explainRect.top / Math.max(1, explain.offsetHeight - viewportH));
    const headingIn = smooth(range(explainEntry, .1, .9));
    explainHeading.style.opacity = String(mix(.25, 1, headingIn));
    explainHeading.style.transform = `translate3d(${(-70 * (1 - headingIn)).toFixed(1)}px,${(45 * (1 - headingIn) - 24 * ep).toFixed(1)}px,0) rotate(${(-3 * (1 - headingIn)).toFixed(2)}deg)`;
    const bodyIn = smooth(range(ep, .05, .38));
    explainBody.style.opacity = String(bodyIn);
    explainBody.style.transform = `translate3d(${(80 * (1 - bodyIn)).toFixed(1)}px,${(35 * (1 - bodyIn)).toFixed(1)}px,0)`;
    explainSteps.forEach((step, i) => {
      const t = smooth(range(ep, .31 + i * .16, .49 + i * .16));
      step.style.opacity = String(t);
      step.style.transform = `translate3d(${(85 * (1 - t)).toFixed(1)}px,0,0)`;
      step.style.filter = `blur(${(5 * (1 - t)).toFixed(1)}px)`;
      step.classList.toggle('is-current', t > .5 && ep < .95);
    });
    explainOutline.style.transform = `translate3d(${(-viewportW * .16 * ep).toFixed(1)}px,0,0)`;
    explainHalo.style.transform = `translate(-50%,-50%) scale(${mix(.7, 1.4, ep).toFixed(3)}) rotate(${(90 * ep).toFixed(1)}deg)`;
    explainHalo.style.opacity = String(mix(.25, .75, ep));

    const worldRect = world.getBoundingClientRect();
    const wp = clamp(-worldRect.top / Math.max(1, world.offsetHeight - viewportH));
    const worldEntry = clamp((viewportH - worldRect.top) / viewportH);
    const worldTimeline = clamp(wp + worldEntry * .14);
    const eyebrowIn = smooth(range(worldEntry, .35, .95));
    worldEyebrow.style.opacity = String(eyebrowIn);
    worldEyebrow.style.transform = `translate3d(0,${(35 * (1 - eyebrowIn)).toFixed(1)}px,0)`;
    worldLines.forEach((line, i) => {
      const a = [-.08, .20, .40][i], b = [.22, .48, .70][i];
      const t = smooth(range(worldTimeline, a, b));
      const side = i === 1 ? 1 : -1;
      line.style.opacity = String(t);
      line.style.transform = `translate3d(${(side * 130 * (1 - t)).toFixed(1)}px,${(28 * (1 - t)).toFixed(1)}px,0) scale(${mix(.88, 1, t).toFixed(3)})`;
      line.style.filter = `blur(${(7 * (1 - t)).toFixed(1)}px)`;
    });
    const paragraphIn = smooth(range(worldTimeline, .53, .82));
    worldParagraph.style.opacity = String(paragraphIn);
    worldParagraph.style.transform = `translate3d(0,${(65 * (1 - paragraphIn)).toFixed(1)}px,0)`;
    worldOrbits.forEach((orbit, i) => {
      const direction = i === 1 ? -1 : 1;
      orbit.style.transform = `translate(-50%,-50%) rotate(${(-25 + direction * (110 + i * 22) * wp).toFixed(1)}deg) scale(${mix(.78, 1.25 + i * .1, wp).toFixed(3)})`;
      orbit.style.opacity = String(mix(.16 + i * .04, .72 - i * .16, wp));
    });
    worldGlow.style.transform = `translate(-50%,-50%) translate3d(${(-viewportW * .13 * wp).toFixed(1)}px,${(viewportH * .07 * wp).toFixed(1)}px,0) scale(${mix(.75, 1.35, wp).toFixed(3)})`;
    worldStamp.style.opacity = String(smooth(range(wp, .68, .98)) * .7);
    worldStamp.style.transform = `translate3d(0,${(40 * (1 - wp)).toFixed(1)}px,0) rotate(${mix(-25, -8, wp).toFixed(1)}deg)`;
  }

  function render() {
    raf = 0;
    const max = Math.max(1, story.offsetHeight - viewportH);
    const p = clamp(-story.getBoundingClientRect().top / max);
    const pageMax = Math.max(1, document.documentElement.scrollHeight - viewportH);
    progressFill.style.width = `${clamp(scrollY / pageMax) * 100}%`;
    const explainTop = document.querySelector('#que-es').getBoundingClientRect().top;
    const worldTop = document.querySelector('#cafe-de-ley').getBoundingClientRect().top;
    siteHeader.classList.toggle('on-light', explainTop < 85 && worldTop > 55);
    renderSecondAndThirdScenes();

    if (reduceMotion.matches) {
      photo.style.opacity = '1';
      photo.style.transform = 'scale(1.03)';
      warmth.style.opacity = '0';
      copy.style.opacity = '1';
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateX(-50%)';
      copy.style.transform = 'translateX(-50%)';
      bean.style.opacity = '1';
      bean.style.transform = 'translate(-50%,-50%)';
      glassWrap.style.opacity = '0';
      transformation.style.opacity = '0';
      cue.style.opacity = '1';
      ctx.clearRect(0, 0, viewportW, viewportH);
      return;
    }

    photo.style.transform = `scale(${mix(1.03, 1.18, p).toFixed(3)})`;
    photo.style.opacity = String(1 - range(p, .45, .78) * .9);
    warmth.style.opacity = String(range(p, .25, .67));

    const copyOut = smooth(range(p, .04, .24));
    copy.style.opacity = String(1 - copyOut);
    subtitle.style.opacity = String(1 - copyOut);
    subtitle.style.transform = `translate(-50%,${(-25 * copyOut).toFixed(1)}px)`;
    copy.style.transform = `translate(-50%,${(-80 * copyOut).toFixed(1)}px)`;
    cue.style.opacity = String(1 - range(p, .03, .17));

    const descent = smooth(range(p, .13, .54));
    const crumble = smooth(range(p, .39, .61));
    const beanScale = mix(1, .37, descent);
    bean.style.transform = `translate(-50%,-50%) translateY(${(-viewportH * .22 * descent).toFixed(1)}px) scale(${beanScale.toFixed(3)}) rotate(${(-14 * descent).toFixed(1)}deg)`;
    bean.style.opacity = String(1 - crumble);
    bean.style.filter = `brightness(1.12) saturate(1.06) drop-shadow(0 30px 28px rgba(16,7,3,.65)) blur(${(5 * crumble).toFixed(1)}px)`;

    const glassIn = smooth(range(p, .36, .63));
    glassWrap.style.opacity = String(glassIn);
    glassWrap.style.transform = `translate(-50%,${(60 * (1 - glassIn)).toFixed(1)}px) scale(${mix(.83, 1, glassIn).toFixed(3)})`;
    glassOutline.style.opacity = String(range(p, .38, .48) * (1 - range(p, .63, .78)));
    glassPhoto.style.opacity = String(smooth(range(p, .60, .83)));

    const captionIn = smooth(range(p, .76, .91));
    transformation.style.opacity = String(captionIn);
    transformation.style.transform = `translate(-50%,${(20 * (1 - captionIn)).toFixed(1)}px)`;
    drawDust(p);
  }

  function requestRender() { if (!raf) raf = requestAnimationFrame(render); }
  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', sizeCanvas);
  addEventListener('languagechange', sizeCanvas);
  reduceMotion.addEventListener('change', requestRender);
  sizeCanvas();
  document.fonts.ready.then(sizeCanvas);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { threshold: .16 });
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();

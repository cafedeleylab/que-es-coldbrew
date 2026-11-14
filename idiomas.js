(() => {
  const toggle = document.querySelector('#language-toggle');
  const translations = [
    ['.skip-link', 'Skip to the explanation'],
    ['.header-note', 'COFFEE LAB & STUDIO'],
    ['.hero-copy h1', 'What is<br><em>cold brew?</em>', 'html'],
    ['.hero-subtitle', 'Here’s how it’s made.'],
    ['.transformation-copy', 'FROM BEAN <span>TO GLASS</span>', 'html'],
    ['.scroll-cue>span:first-child', 'SCROLL'],
    ['.ticker-track', 'GROUND COFFEE <b>✦</b> COLD WATER <b>✦</b> TIME <b>✦</b> GROUND COFFEE <b>✦</b> COLD WATER <b>✦</b> TIME <b>✦</b>', 'html'],
    ['.explain-heading .eyebrow', 'WHAT IS COLD BREW?'],
    ['#explain-title', 'A slow extraction<br>to see coffee<br><em>in a different way</em>', 'html'],
    ['.explain-body .lead', 'Coffee, cold water and a few hours of waiting.'],
    ['.explain-body>p:not(.lead)', 'Ground coffee is left to steep in cold water. Over time, the water takes on its flavor. Then it’s filtered and ready to serve.'],
    ['.process-step:nth-child(1) strong', 'Grind the coffee'],
    ['.process-step:nth-child(2) strong', 'Let it steep'],
    ['.process-step:nth-child(3) strong', 'Filter and serve'],
    ['.world-line:nth-child(1)', 'What if we gave'],
    ['.world-line:nth-child(2)', 'cold brew'],
    ['.world-line:nth-child(3)', 'a different flavor?'],
    ['.world-content>p:last-child', 'At Café de Ley, we explore how to bring different coffee profiles from around the world to <em>cold brew</em>. Our aim is for every glass to offer something different while keeping the character of the coffee.', 'html'],
    ['.world-stamp>span:last-child', 'LAB & STUDIO'],
    ['.site-footer>p', 'So, which one will you try?'],
    ['.site-footer>a', 'BACK TO TOP <span aria-hidden="true">↑</span>', 'html'],
    ['.brand', 'Café de Ley, back to top', 'aria-label'],
    ['.story', 'From bean to cold brew', 'aria-label'],
    ['.process', 'The cold brew process', 'aria-label'],
    ['.hero-bean', 'Roasted coffee bean', 'alt'],
    ['.site-footer img', 'Café de Ley — Coffee Lab & Studio', 'alt'],
    ['meta[name="description"]', 'What cold brew is, how it’s made and what we’re trying at Café de Ley. A quick introduction.', 'content'],
    ['title', 'What is cold brew? — Café de Ley']
  ].map(([selector, en, type = 'text']) => {
    const element = document.querySelector(selector);
    const es = type === 'html' ? element.innerHTML : type === 'text' ? element.textContent : element.getAttribute(type);
    return { element, es, en, type };
  });
  let language = 'es';
  function setLanguage(next) {
    language = next === 'en' ? 'en' : 'es';
    document.documentElement.lang = language;
    translations.forEach(({ element, es, en, type }) => {
      const value = language === 'en' ? en : es;
      if (type === 'html') element.innerHTML = value;
      else if (type === 'text') element.textContent = value;
      else element.setAttribute(type, value);
    });
    toggle.textContent = language === 'en' ? 'ES' : 'EN';
    toggle.lang = language === 'en' ? 'es' : 'en';
    toggle.setAttribute('aria-label', language === 'en' ? 'Cambiar a español' : 'Switch to English');
    try { localStorage.setItem('cafe-de-ley-language', language); } catch (_) { /* Storage is optional. */ }
    dispatchEvent(new Event('languagechange'));
  }
  toggle.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
  let saved = 'es';
  try { saved = localStorage.getItem('cafe-de-ley-language') || 'es'; } catch (_) { /* Keep Spanish as the default. */ }
  setLanguage(saved);
})();

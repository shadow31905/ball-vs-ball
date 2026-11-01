/* Ball VS Ball: ładowanie kończy się bez jednoczesnego dekodowania setek obrazów. */
(() => {
  'use strict';
  let done = false;
  function finish() {
    if (done) return;
    const panel = document.getElementById('bvb-loading-screen');
    if (!panel) return;
    const game = document.getElementById('app');
    const gate = document.getElementById('accountGate');
    if (!game || !gate) {
      const label = document.getElementById('bvb-loading-label');
      if (label) label.textContent = 'Błąd uruchamiania gry';
      const meter = panel.querySelector('.meter');
      if (meter && !meter.querySelector('.bvb-retry')) {
        const b = document.createElement('button');
        b.className = 'bvb-retry';
        b.textContent = 'Otwórz wersję podstawową';
        b.onclick = () => location.href = './index.html.html';
        meter.append(b);
      }
      return;
    }
    done = true;
    const label = document.getElementById('bvb-loading-label');
    const fill = document.getElementById('bvb-loading-fill');
    if (label) label.textContent = 'GRA GOTOWA · 100%';
    if (fill) fill.style.width = '100%';
    const bar = panel.querySelector('[role="progressbar"]');
    if (bar) bar.setAttribute('aria-valuenow', '100');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.remove();
      document.getElementById('bvb-loading-css')?.remove();
    }));
  }
  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish, { once: true });
  // Obrazy spoza ekranu nie mogą blokować otwarcia menu.
  window.setTimeout(finish, 3500);
})();

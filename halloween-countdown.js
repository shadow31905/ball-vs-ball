/* Odliczanie do odejścia halloween, 7.11.2026, 16:00 (Polska). */
(function () {
  'use strict';
  const ID = 'bvb-halloween-countdown';
  const DEADLINE = Date.parse('2026-11-07T16:00:00+01:00');

  function mount() {
    const menu = document.getElementById('menu');
    if (!menu || document.getElementById(ID)) return;
    // Zastąp starszy banner, jeśli jest wciąż obecny w pamięci strony.
    document.getElementById('bvb-halloween-departure')?.remove();
    document.getElementById('bvb-halloween-departure-style')?.remove();

    const style = document.createElement('style');
    style.id = ID + '-style';
    style.textContent = [
      '#' + ID + '{position:relative;isolation:isolate;overflow:hidden;margin:10px 0 16px;padding:14px 14px 12px;border:1px solid #fb923c;border-radius:16px;background:radial-gradient(circle at 93% 8%,#7c2d1260,transparent 40%),linear-gradient(125deg,#251044,#100d22 70%);box-shadow:0 4px 16px #0006,inset 0 0 22px #f9731620;color:#fff7ed;text-align:center;}',
      '#' + ID + '::before{content:"🎃";position:absolute;top:-12px;right:5px;font-size:60px;opacity:.14;transform:rotate(18deg);pointer-events:none;}',
      '#' + ID + ' .bvb-hw-title{position:relative;margin:0 0 5px;font-size:clamp(15px,4vw,20px);font-weight:900;letter-spacing:.25px;color:#ffbd72;text-shadow:0 2px 8px #0009;}',
      '#' + ID + ' .bvb-hw-desc{position:relative;margin:0 0 10px;font-size:11px;color:#e7d4f7;}',
      '#' + ID + ' .bvb-hw-units{position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;}',
      '#' + ID + ' .bvb-hw-unit{background:#140b28b8;border:1px solid #9a5ccf70;border-radius:10px;padding:8px 2px 7px;}',
      '#' + ID + ' .bvb-hw-value{display:block;font-variant-numeric:tabular-nums;font-size:clamp(21px,5.8vw,30px);font-weight:900;line-height:1.15;color:#fff;}',
      '#' + ID + ' .bvb-hw-label{display:block;margin-top:3px;font-size:10px;color:#f9b979;}',
      '#' + ID + ' .bvb-hw-finished{margin-top:8px;color:#ffc78c;font-size:12px;font-weight:700;}',
      '#' + ID + ' .bvb-hw-finished[hidden]{display:none!important;}',
      '@media(max-width:360px){#' + ID + '{padding:12px 9px}#' + ID + ' .bvb-hw-units{gap:4px}#' + ID + ' .bvb-hw-label{font-size:9px;}}',
      '@media(prefers-reduced-motion:reduce){#' + ID + '{scroll-behavior:auto;}}'
    ].join('\n');
    document.head.appendChild(style);

    const banner = document.createElement('section');
    banner.id = ID;
    banner.setAttribute('aria-label', 'Odliczanie do odejścia Halloween Eventu');
    banner.innerHTML = [
      '<h2 class="bvb-hw-title">🎃 odejście halloween</h2>',
      '<p class="bvb-hw-desc">Sobota, 7 listopada 2026 · 16:00</p>',
      '<div class="bvb-hw-units" role="timer" aria-live="off">',
      '<div class="bvb-hw-unit"><span class="bvb-hw-value" data-unit="d">00</span><span class="bvb-hw-label">DNI</span></div>',
      '<div class="bvb-hw-unit"><span class="bvb-hw-value" data-unit="h">00</span><span class="bvb-hw-label">GODZ.</span></div>',
      '<div class="bvb-hw-unit"><span class="bvb-hw-value" data-unit="m">00</span><span class="bvb-hw-label">MIN.</span></div>',
      '<div class="bvb-hw-unit"><span class="bvb-hw-value" data-unit="s">00</span><span class="bvb-hw-label">SEK.</span></div>',
      '</div>',
      '<p class="bvb-hw-finished" hidden>Halloween Event dobiegł końca!</p>'
    ].join('');
    menu.insertBefore(banner, menu.firstChild);
    // Menu V3 przebudowuje swoje dzieci — zachowaj banner po przebudowie.
    const keepVisible = new MutationObserver(() => {
      if (menu.isConnected && !banner.isConnected) menu.insertBefore(banner, menu.firstChild);
    });
    keepVisible.observe(menu, { childList: true });

    const nodes = banner.querySelectorAll('[data-unit]');
    const finished = banner.querySelector('.bvb-hw-finished');
    let timer = null;
    function update() {
      const seconds = Math.max(0, Math.ceil((DEADLINE - Date.now()) / 1000));
      const values = {
        d: String(Math.floor(seconds / 86400)).padStart(2, '0'),
        h: String(Math.floor(seconds % 86400 / 3600)).padStart(2, '0'),
        m: String(Math.floor(seconds % 3600 / 60)).padStart(2, '0'),
        s: String(seconds % 60).padStart(2, '0')
      };
      nodes.forEach(node => { node.textContent = values[node.dataset.unit]; });
      if (seconds === 0) {
        finished.hidden = false;
        banner.classList.add('is-finished');
        if (timer !== null) window.clearInterval(timer);
      }
    }
    update();
    if (Date.now() < DEADLINE) timer = window.setInterval(update, 1000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();

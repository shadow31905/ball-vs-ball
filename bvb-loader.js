/* Ball VS Ball: loader oszczędzający pamięć telefonu. */
(() => {
  'use strict';
  const paths = Array.from({ length: 32 }, (_, i) => 'rework/game-' + i + '.txt');
  const progress = document.getElementById('bvb-loading-fill');
  const label = document.getElementById('bvb-loading-label');
  const bar = document.querySelector('#bvb-loading-screen [role="progressbar"]');
  const meter = document.querySelector('#bvb-loading-screen .meter');
  const setProgress = n => {
    if (!label || !progress) return;
    label.textContent = 'ŁADOWANIE GRY · ' + n + '%';
    progress.style.width = n + '%';
    if (bar) bar.setAttribute('aria-valuenow', String(n));
  };
  function fail(error) {
    console.error('BVB: nie udało się uruchomić gry', error);
    if (!label || !meter) return;
    label.textContent = 'Nie udało się załadować gry';
    if (meter.querySelector('.bvb-retry')) return;
    const retry = document.createElement('button');
    retry.className = 'bvb-retry';
    retry.textContent = 'Spróbuj ponownie';
    retry.onclick = () => location.reload();
    const fallback = document.createElement('button');
    fallback.textContent = 'Otwórz wersję podstawową';
    fallback.onclick = () => location.href = './index.html.html';
    meter.append(retry, fallback);
  }
  async function load() {
    const parts = new Array(paths.length);
    let cursor = 0, loaded = 0;
    // Tylko cztery równoległe żądania zamiast 32.
    async function worker() {
      while (true) {
        const i = cursor++;
        if (i >= paths.length) return;
        const response = await fetch(paths[i] + '?v=wielki-rework-preview-2');
        if (!response.ok) throw new Error(paths[i] + ': HTTP ' + response.status);
        parts[i] = await response.text();
        loaded++;
        setProgress(Math.min(90, Math.floor(loaded / paths.length * 90)));
      }
    }
    await Promise.all(Array.from({ length: 4 }, () => worker()));
    const head = parts[0];
    const last = parts.length - 1;
    const foot = parts[last];
    if (!head || !/<body(?:\s|>)/i.test(head)) throw new Error('Brak początku dokumentu gry');
    const closeIndex = foot.toLowerCase().lastIndexOf('</body>');
    if (closeIndex < 0) throw new Error('Brak końca dokumentu gry');
    // Wstrzyknij osłonę ładowania bez tworzenia 64-MB kopii całej gry.
    const splash = document.getElementById('bvb-loading-screen');
    const css = document.getElementById('bvb-loading-css');
    const layerHTML = (css ? css.outerHTML : '') + (splash ? splash.outerHTML : '');
    parts[0] = head.replace(/<body([^>]*)>/i, m => m + layerHTML);
    const scripts = '<script src="./halloween-countdown.js?v=20261101-3"></script>' +
                    '<script src="./bvb-ready.js?v=20261101-1"></script>';
    parts[last] = foot.slice(0, closeIndex) + scripts + foot.slice(closeIndex);
    // HTML jest dzielony na fragmenty; zapisuj po kolei bez parts.join('').
    document.open();
    for (let i = 0; i < parts.length; i++) {
      document.write(parts[i]);
      parts[i] = null;
    }
    document.close();
  }
  load().catch(fail);
})();

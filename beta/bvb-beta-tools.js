/* Beta-only controls. This file is never included by the stable game. */
(() => {
'use strict';
document.documentElement.dataset.bvbBeta='true';
const style=document.createElement('style');style.textContent='#bvbBetaBar{position:sticky;top:0;z-index:120;display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;padding:8px;background:#172039f5;border-bottom:2px solid #fbbf24;color:#fff6ca;font:12px system-ui}#bvbBetaBar button{background:#253865;border:1px solid #9ba7d4;border-radius:8px;color:white;padding:8px;cursor:pointer}#bvbBetaBar small{width:100%;text-align:center;color:#cbd5e1}';document.head.appendChild(style);
const bar=document.createElement('aside');bar.id='bvbBetaBar';bar.setAttribute('aria-label','Narzędzia testowe bety');
bar.innerHTML='<strong>BETA · test reworku</strong><button id="bvbBetaTraining">Testuj V1 / V2 / V3</button><button id="bvbBetaUnlock">Odblokuj kulki w becie</button><small>Oddzielny zapis testowy · chmura i konto wyłączone · bez wpływu na stabilną grę</small>';
document.body.prepend(bar);
document.getElementById('bvbBetaTraining').addEventListener('click',()=>{startMatch(4);});
document.getElementById('bvbBetaUnlock').addEventListener('click',()=>{S.own=B.map(b=>b.id);save();menu();document.getElementById('bvbBetaUnlock').textContent='130 kulek dostępnych w becie';});
})();

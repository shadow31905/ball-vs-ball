/* Testing UI bundled only for the isolated beta; never linked from the stable game. */
(() => {
'use strict';
if(!/(?:^|\/)beta(?:\/|$)/.test(location.pathname) ||
   !document.querySelector('meta[name="bvb-beta-build"]') ||
   typeof K==='undefined'||K!=='bvb_beta_rework_v4' ||
   typeof S==='undefined'||!Array.isArray(B)||typeof save!=='function')return;
document.documentElement.dataset.bvbBeta='true';
const style=document.createElement('style');
style.textContent=`
#bvbBetaBar{position:sticky;top:0;z-index:120;display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;padding:8px;background:#172039f5;border-bottom:2px solid #fbbf24;color:#fff6ca;font:12px system-ui}
#bvbBetaBar button,.bvbBetaPanel button{background:#253865;border:1px solid #9ba7d4;border-radius:8px;color:white;padding:9px;cursor:pointer;font:inherit;min-height:40px}
#bvbBetaBar button:focus-visible,.bvbBetaPanel :focus-visible{outline:3px solid #fbbf24;outline-offset:2px}
#bvbBetaBar small{width:100%;text-align:center;color:#cbd5e1}
#bvbBetaDialog[hidden]{display:none!important}
#bvbBetaDialog{position:fixed;inset:0;z-index:400;background:#030818dc;display:grid;place-items:center;padding:12px;overflow-y:auto}
.bvbBetaPanel{box-sizing:border-box;width:min(520px,100%);max-height:min(92dvh,850px);overflow-y:auto;border-radius:17px;border:2px solid #fbbf24;background:#15213d;color:#f8fafc;padding:16px;box-shadow:0 14px 45px #000a;font:14px system-ui}
.bvbBetaPanel h2{margin:0 0 8px;color:#fde68a;font-size:1.3rem}
.bvbBetaPanel h3{margin:17px 0 8px;font-size:1rem;color:#c4b5fd}
.bvbBetaPanel p{line-height:1.5;margin:5px 0 12px;color:#cbd5e1}
.bvbBetaPanel label{display:block;margin:7px 0 5px;font-weight:600}
.bvbBetaPanel input,.bvbBetaPanel select{box-sizing:border-box;width:100%;min-width:0;min-height:42px;background:#0a1430;color:white;border:1px solid #8797bd;border-radius:8px;padding:8px;font:inherit}
.bvbBetaPanel .bvbBetaGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.bvbBetaPanel .bvbBetaButtons{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
.bvbBetaPanel .bvbBetaButtons button{flex:1 1 140px}
.bvbBetaPanel .bvbBetaPrimary{background:#6b4c00;border-color:#fbbf24}
.bvbBetaPanel #bvbBetaStatus{color:#fde68a;min-height:22px;font-weight:600}
.bvbBetaPanel .bvbBetaClose{float:right;min-height:32px;padding:5px 12px}
@media(max-width:360px){.bvbBetaPanel{padding:12px}.bvbBetaPanel .bvbBetaGrid{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){#bvbBetaBar *,#bvbBetaDialog *{animation:none!important;transition:none!important}}
`;
document.head.appendChild(style);
const bar=document.createElement('aside');
bar.id='bvbBetaBar';bar.setAttribute('aria-label','Narzędzia testowe bety');
bar.innerHTML='<strong>🧪 BETA</strong><button id="bvbBetaPanelOpen" type="button" aria-haspopup="dialog">⚙️ Panel administratora BETA</button><button id="bvbBetaTraining" type="button">Trening V1 / V2 / V3</button><button id="bvbBetaUnlock" type="button">Odblokuj 130 kulek</button><small>Wyłącznie lokalny profil beta · bez chmury · nie wpływa na stabilne konto</small>';
document.body.prepend(bar);
const dialog=document.createElement('div');dialog.id='bvbBetaDialog';dialog.hidden=true;
dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','bvbBetaTitle');
dialog.innerHTML=`
<section class="bvbBetaPanel">
 <button class="bvbBetaClose" id="bvbBetaClose" type="button" aria-label="Zamknij panel">✕</button>
 <h2 id="bvbBetaTitle">⚙️ Panel administratora · BETA</h2>
 <p>Ustawienia testowe zapisują się tylko w profilu beta. Nie zmieniają postępów ani walut stabilnej gry.</p>
 <h3>🪙 Waluty testowe</h3>
 <div class="bvbBetaGrid">
  <div><label for="bvbBetaCoins">Monety</label><input id="bvbBetaCoins" type="number" inputmode="numeric" min="0" step="1" max="9007199254740991"></div>
  <div><label for="bvbBetaCandies">Cukierki</label><input id="bvbBetaCandies" type="number" inputmode="numeric" min="0" step="1" max="9007199254740991"></div>
 </div>
 <div class="bvbBetaButtons"><button id="bvbBetaSaveCurrencies" class="bvbBetaPrimary" type="button">Zapisz monety i cukierki</button></div>
 <h3>🔮 Kulki i ewolucje</h3>
 <div class="bvbBetaButtons"><button id="bvbBetaUnlockAll" type="button">Odblokuj wszystkie 130 kulek</button></div>
 <label for="bvbBetaTarget">Zmień ewolucję</label>
 <select id="bvbBetaTarget"><option value="all">Wszystkie 130 kulek</option></select>
 <label for="bvbBetaTier">Wersja zdolności</label>
 <select id="bvbBetaTier"><option value="1">V1 · podstawowa</option><option value="2">V2 · ulepszona</option><option value="3">V3 · maksymalna</option></select>
 <div class="bvbBetaButtons"><button id="bvbBetaApplyTier" class="bvbBetaPrimary" type="button">Ustaw wybraną ewolucję</button><button id="bvbBetaStartTraining" type="button">Testuj tę ewolucję w treningu</button></div>
 <p id="bvbBetaStatus" role="status" aria-live="polite"></p>
</section>`;
document.body.append(dialog);
const byId=id=>document.getElementById(id);
const target=byId('bvbBetaTarget');
for(const b of B){
 const option=document.createElement('option');option.value=String(b.id);
 option.textContent=b.n+' (#'+b.id+')';target.append(option);
}
let previousFocus=null;
const status=message=>{byId('bvbBetaStatus').textContent=message;};
function sync(){
 byId('bvbBetaCoins').value=String(S.coins);
 byId('bvbBetaCandies').value=String(S.candies);
 const selected=target.value;
 byId('bvbBetaTier').value=selected==='all'?'1':String(S.tr?.[selected]||1);
}
function open(){
 previousFocus=document.activeElement;sync();status('');dialog.hidden=false;
 byId('bvbBetaClose').focus();
}
function close(){
 dialog.hidden=true;
 if(previousFocus?.isConnected)previousFocus.focus();
}
function safeAmount(input){
 const value=String(input.value).trim();
 if(!/^\d+$/.test(value))return null;
 const n=Number(value);
 return Number.isSafeInteger(n)&&n>=0?n:null;
}
function setCurrencies(){
 const coins=safeAmount(byId('bvbBetaCoins')),candies=safeAmount(byId('bvbBetaCandies'));
 if(coins===null||candies===null){status('Podaj nieujemne liczby całkowite, maksymalnie 9 007 199 254 740 991.');return false;}
 S.coins=coins;S.candies=candies;save();
 status('Zapisano waluty w profilu beta: '+coins.toLocaleString('pl-PL')+' monet, '+candies.toLocaleString('pl-PL')+' cukierków.');
 return true;
}
function unlockAll(){
 S.own=B.map(b=>b.id);save();
 byId('bvbBetaUnlock').textContent='✅ 130 kulek odblokowanych';
 status('Odblokowano wszystkie 130 kulek tylko w becie.');
 return true;
}
function applyTier(){
 const value=Number(byId('bvbBetaTier').value),selected=target.value;
 if(![1,2,3].includes(value)||selected!=='all'&&(!/^\d+$/.test(selected)||!B[Number(selected)])){
  status('Nieprawidłowy wybór ewolucji.');return false;
 }
 S.tr ||= {};
 if(selected==='all'){for(const b of B)S.tr[b.id]=value;}
 else S.tr[Number(selected)]=value;
 save();
 status('Ustawiono V'+value+(selected==='all'?' dla wszystkich 130 kulek.':' dla '+B[Number(selected)].n+'.')+' Nowe walki użyją tej ewolucji.');
 return true;
}
function startTraining(){
 const tier=Number(byId('bvbBetaTier').value);
 if(![1,2,3].includes(tier))return;
 close();startMatch(4);
 if(G?.m===4&&G.ph==='draft'){
  G.trainingTier=tier;G.trainingOpponentTier=tier;
  if(target.value!=='all'&&B[Number(target.value)])G.trainingOpponentId=Number(target.value);
  window.BVBTraining?.render?.(G);
 }
}
target.addEventListener('change',sync);
byId('bvbBetaPanelOpen').addEventListener('click',open);
byId('bvbBetaClose').addEventListener('click',close);
dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.hidden)close();});
byId('bvbBetaSaveCurrencies').addEventListener('click',setCurrencies);
byId('bvbBetaUnlock').addEventListener('click',unlockAll);
byId('bvbBetaUnlockAll').addEventListener('click',unlockAll);
byId('bvbBetaApplyTier').addEventListener('click',applyTier);
byId('bvbBetaTraining').addEventListener('click',()=>{startMatch(4);});
byId('bvbBetaStartTraining').addEventListener('click',startTraining);
window.BVBBetaAdmin={open,close}; // Only exists in the beta build.
})();
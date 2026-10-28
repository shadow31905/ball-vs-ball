/* Isolated beta: ONLY original characters ID 0..12. This file never ships in main. */
(()=>{
'use strict';
const IDS=Object.freeze(Array.from({length:13},(_,i)=>i));
const label='BETA • PARTIA 1 • 13 KULEK';
function unlock(){
 if(typeof S==='undefined'||!Array.isArray(B)||B.length!==13)throw Error('Invalid batch1 build: expected exactly 13 balls');
 S.own=IDS.slice();
 S.tr=S.tr&&typeof S.tr==='object'?S.tr:{};
 for(const id of IDS)if(![1,2,3].includes(S.tr[id]))S.tr[id]=1;
 save();
}
function notice(msg){
 let el=document.getElementById('bvbBatch1Notice');
 if(!el){el=document.createElement('div');el.id='bvbBatch1Notice';el.setAttribute('role','status');el.style.cssText='position:fixed;left:50%;bottom:15px;transform:translateX(-50%);background:#10152e;color:#fff;border:1px solid #38bdf8;border-radius:12px;padding:12px 16px;z-index:2147483646;font:600 13px system-ui;text-align:center;max-width:85vw;box-shadow:0 8px 30px #000b';document.body.appendChild(el);}
 el.textContent=msg;
}
function setTier(tier){
 tier=Number(tier);
 if(![1,2,3].includes(tier))return;
 unlock();
 for(const id of IDS)S.tr[id]=tier;
 save();
 if(typeof G!=='undefined'&&G&&G.ph==='battle'){notice('Ewolucja V'+tier+' ustawiona. Nowa walka użyje wybranego etapu.');return;}
 if(typeof menu==='function' && document.getElementById('menu')?.hidden===false)menu();
 if(document.getElementById('pn')?.dataset.panel==='col'&&typeof panel==='function')panel('col');
 document.querySelectorAll('#bvbBatch1Toolbar button[data-tier],#bvbBatch1CollectionBar button[data-tier]').forEach(b=>{
  b.setAttribute('aria-pressed',String(Number(b.dataset.tier)===tier));
  b.style.background=Number(b.dataset.tier)===tier?'#2563eb':'#182f59';
 });
}
const style=document.createElement('style');style.textContent='.bvbBatch1Panel{background:linear-gradient(120deg,#0b2347,#17143c);border:1px solid #4a93ff;border-radius:14px;padding:12px;margin:12px 0;color:#f5faff;box-shadow:0 8px 25px #0005}.bvbBatch1Panel strong{display:block;font-size:14px}.bvbBatch1Panel small{display:block;color:#bad8ff;font-size:11px;margin-top:4px}.bvbBatch1Controls{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}.bvbBatch1Controls button{border:1px solid #64b6fa;background:#182f59;border-radius:8px;color:#f8fbff;padding:7px 13px;font:700 12px system-ui;cursor:pointer}.bvbBatch1Controls button[aria-pressed="true"]{background:#2563eb}';document.head.appendChild(style);
function panelMarkup(id){
 const s=Number(S.tr[0]||1);
 return '<section id="'+id+'" class="bvbBatch1Panel" aria-label="Beta partii pierwszej">'+
 '<strong>🎮 '+label+'</strong><small>Wyłącznie ID 0–12 • wszystkie odblokowane • 39 wyglądów V1/V2/V3 • lokalny zapis</small>'+
 '<div class="bvbBatch1Controls"><button type="button" data-open="collection">🔮 Kolekcja</button><button type="button" data-open="fight">⚔️ Graj</button>'+
 [1,2,3].map(t=>'<button type="button" data-tier="'+t+'" aria-pressed="'+(t===s)+'">V'+t+'</button>').join('')+
 '</div></section>';
}
function addTools(host,id){
 if(!host||host.querySelector('#'+id))return;
 host.insertAdjacentHTML('afterbegin',panelMarkup(id));
 const toolbar=host.querySelector('#'+id);
 toolbar.addEventListener('click',event=>{
  const btn=event.target.closest('button');if(!btn)return;
  if(btn.dataset.tier)setTier(btn.dataset.tier);
  else if(btn.dataset.open==='collection')panel('col');
  else if(btn.dataset.open==='fight')startMatch(0);
 });
}
unlock();
const accountGate=document.getElementById('accountGate');if(accountGate)accountGate.hidden=true;
addTools(document.getElementById('menu'),'bvbBatch1Toolbar');
const originalPanel=window.panel;
if(typeof originalPanel==='function')window.panel=function(key){
 const x=originalPanel.apply(this,arguments);
 if(key==='col')addTools(document.getElementById('pb'),'bvbBatch1CollectionBar');
 return x;
};
const originalStart=window.startMatch;
if(typeof originalStart==='function')window.startMatch=function(mode){
 const m=Number(mode||0);
 if(m!==0){notice('Ta beta jest przeznaczona wyłącznie do walki standardowej 13 kulek.');return;}
 return originalStart.apply(this,arguments);
};
// Non-batch actions are intentionally unavailable in this visual testing build.
document.addEventListener('click',event=>{
 const b=event.target.closest('button');
 if(!b)return;
 const handler=b.getAttribute('onclick')||'';
 if(/(?:bossMenu|startBossFight|mpMenu|hostNet|joinNet|BVBCampaign\.open|startMatch\((?:[1-9]\d*)\))/.test(handler)){
  event.preventDefault();event.stopImmediatePropagation();
  notice('W tej becie dostępne są tylko kulki partii 1 i zwykła walka.');
 }
},true);
window.BVBBatch1Beta=Object.freeze({ready:true,count:13,ids:IDS,setTier,unlock,mode:'private-offline'});
})();
/* Full training catalog. Choices never mutate player upgrades or evolution. */
(() => {
'use strict';
let query='',rarity='all';
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ł/g,'l');
function catalog(term='',filter='all'){
 const q=normalize(term);
 return B.filter(b=>(filter==='all'||b.r===Number(filter))&&normalize(b.n+' '+(window.BVB2?.abilities?.[b.id]?.title||'')).includes(q))
  .slice().sort((a,b)=>a.r-b.r||a.n.localeCompare(b.n,'pl')||a.id-b.id);
}
function cards(g){
 const list=catalog(query,rarity),tier=g.trainingTier||1;
 document.getElementById('trainingCount').textContent=list.length+' / 130 kulek · od najniższej rzadkości';
 document.getElementById('trainingBalls').innerHTML=list.map(b=>{
  const stats=getBallStats(b.id,tier,0,0);
  return '<button type="button" class="card training-ball" data-ball-id="'+b.id+'" data-rarity="'+b.r+'" onclick="BVBTraining.choose('+b.id+')">'+orb(b)+'<div><b>'+esc(b.n)+' · V'+tier+'</b><small style="color:'+RC[b.r]+'">'+esc(RN[b.r])+' · ❤️ '+stats.hp+' · ⚔️ '+stats.dmg+'</small><span class="d">'+esc(stats.activeDesc)+'</span></div></button>';
 }).join('')||'<p role="status">Brak kulek pasujących do wyszukiwania.</p>';
}
function render(g){
 if(!g||g.m!==4||g.ph!=='draft')return false;
 g.trainingTier=[1,2,3].includes(g.trainingTier)?g.trainingTier:1;
 g.trainingOpponentTier=[1,2,3].includes(g.trainingOpponentTier)?g.trainingOpponentTier:1;
 document.getElementById('msg').textContent='Trening: wybierz dowolną kulkę i sprawdź zdolność oraz ewolucje. Bez zmiany postępu konta.';
 document.getElementById('bset').textContent='Wszystkie 130 kulek · trening bez nagród';
 document.getElementById('cards').innerHTML='<section class="training-tools" aria-label="Wyszukiwarka kulek treningowych">'+
 '<label for="trainingSearch">Szukaj kulki lub zdolności</label><input id="trainingSearch" class="inp" type="search" autocomplete="off" placeholder="Np. Topór, Komórka, piorun…" oninput="BVBTraining.filter(this.value)">'+
 '<div class="training-options"><label>Rzadkość<select id="trainingRarity" class="inp" onchange="BVBTraining.rarity(this.value)"><option value="all">Wszystkie</option>'+RN.map((n,i)=>'<option value="'+i+'">'+esc(n)+'</option>').join('')+'</select></label>'+
 '<label>Twoja ewolucja<select id="trainingTier" class="inp" onchange="BVBTraining.tier(this.value)">'+[1,2,3].map(n=>'<option value="'+n+'"'+(g.trainingTier===n?' selected':'')+'>V'+n+'</option>').join('')+'</select></label>'+
 '<label>Ewolucja rywala<select id="trainingOpponentTier" class="inp" onchange="BVBTraining.opponentTier(this.value)">'+[1,2,3].map(n=>'<option value="'+n+'"'+(g.trainingOpponentTier===n?' selected':'')+'>V'+n+'</option>').join('')+'</select></label></div>'+
 '<label for="trainingOpponent">Kulka rywala</label><select id="trainingOpponent" class="inp" onchange="BVBTraining.opponent(this.value)"><option value="-1">Losowa ze wszystkich 130</option>'+catalog().map(b=>'<option value="'+b.id+'"'+(g.trainingOpponentId===b.id?' selected':'')+'>'+esc(RN[b.r]+' · '+b.n)+'</option>').join('')+'</select>'+
 '<p id="trainingCount" role="status"></p><div id="trainingBalls"></div></section>';
 document.getElementById('trainingSearch').value=query;
 document.getElementById('trainingRarity').value=rarity;
 document.getElementById('fire').hidden=true;cards(g);return true;
}
function choose(id){
 if(!G||G.m!==4||G.ph!=='draft'||!Number.isInteger(id)||!B[id])return;
 const enemy=Number.isInteger(G.trainingOpponentId)&&B[G.trainingOpponentId]?G.trainingOpponentId:Math.floor((window.BVBRework?.random?.()??Math.random())*B.length);
 G.bt=[B[enemy]];const index=G.my.findIndex(b=>b.id===id);if(index>=0)pick(index);
}
function tier(value){if(!G||G.m!==4)return;G.trainingTier=Math.max(1,Math.min(3,Number(value)||1));cards(G);}
const css=document.createElement('style');css.textContent='.training-tools{width:100%;min-width:0}.training-tools label{display:block;font-size:12px;margin:8px 0 3px}.training-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.training-options select{font-size:12px;padding:8px 3px;min-height:44px;width:100%}#trainingBalls{display:grid;gap:7px;max-height:65vh;overflow-y:auto;padding:3px}.training-ball{animation:bvbTrainingIn .22s ease-out both}.training-ball:focus-visible{outline:3px solid #fde047;outline-offset:2px}#trainingCount{font-size:12px;color:#cbd5e1;margin:8px 0}@keyframes bvbTrainingIn{from{opacity:.3;transform:translateY(4px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.training-ball{animation:none}}';document.head.appendChild(css);
window.BVBTraining={catalog,render,choose,tier,filter(value){query=String(value).slice(0,80);if(G?.m===4)cards(G);},rarity(value){rarity=value==='all'?'all':String(Math.max(0,Math.min(RN.length-1,Number(value)||0)));if(G?.m===4)cards(G);},opponent(value){if(G?.m===4)G.trainingOpponentId=Number(value);},opponentTier(value){if(G?.m===4)G.trainingOpponentTier=Math.max(1,Math.min(3,Number(value)||1));}};
})();

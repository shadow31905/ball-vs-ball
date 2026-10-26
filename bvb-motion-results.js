/* Animation controls, combat expressions, animated result deck.
 * Cosmetic only: drawing consumes simulation snapshots and never mutates G.
 */
(()=>{
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=(v)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const flags=['interior','fight','inventory','menu','results','cutscenes'];
const labels=['Wnętrze i oczy kulek','Walka i efekty ruchu','Ekwipunek i lobby','Menu i kategorie','Zwycięstwo i porażka','Cutscenki ostatecznego uderzenia'];
function prefs(){
 const o=S?.o||{};
 if(!['low','medium','high','ultra'].includes(o.artQuality))o.artQuality='ultra';
 if(!Number.isFinite(o.artIntensity))o.artIntensity=85;
 o.artIntensity=clamp(Math.round(o.artIntensity),0,100);
 for(const f of flags)if(typeof o['art_'+f]!=='number')o['art_'+f]=1;
 return o;
}
function enabled(flag){const o=prefs();return o['art_'+flag]!==0;}
function sync(){
 const o=prefs();
 document.body?.classList?.toggle('bvb-effects-off',!enabled('inventory'));
 document.body?.classList?.toggle('bvb-menu-motion-off',!enabled('menu'));
 document.body?.classList?.toggle('bvb-result-motion-off',!enabled('results'));
 for(const name of ['low','medium','high','ultra'])document.body?.classList?.toggle('bvb-quality-'+name,o.artQuality===name);
 document.body?.style?.setProperty('--bvb-intensity',String(o.artIntensity/100));
}
function change(type,value){
 const o=prefs();
 if(type==='quality'&&['low','medium','high','ultra'].includes(value))o.artQuality=value;
 else if(type==='intensity')o.artIntensity=clamp(Number(value)||0,0,100);
 else if(flags.includes(type))o['art_'+type]=value?1:0;
 sync();save();panel('set');
}
function settingsHtml(){
 const o=prefs();sync();
 return '<div class="cd" id="bvbAnimationSettings"><h3>🎨 Animacje i grafika</h3>'+
  '<p style="color:#cbd5e1;font-size:.77rem">Efekty wizualne nie zmieniają siły umiejętności.</p>'+
  '<label for="bvbArtQuality">Jakość grafiki</label>'+
  '<select id="bvbArtQuality" class="inp" onchange="BVBMotion.change(\'quality\',this.value)">'+
  [['low','Niska'],['medium','Średnia'],['high','Wysoka'],['ultra','Ultra — maksymalna']].map(([v,n])=>
    '<option value="'+v+'"'+(o.artQuality===v?' selected':'')+'>'+n+'</option>').join('')+'</select>'+
  '<label for="bvbArtIntensity">Intensywność: <b>'+o.artIntensity+'%</b></label>'+
  '<input id="bvbArtIntensity" type="range" min="0" max="100" step="5" value="'+o.artIntensity+'" style="width:100%" onchange="BVBMotion.change(\'intensity\',this.value)"/>'+
  flags.map((key,i)=>'<button class="b" type="button" data-motion="'+key+
   '" onclick="BVBMotion.change(\''+key+'\','+(enabled(key)?'0':'1')+')">'+
   labels[i]+': '+(enabled(key)?'✅ Wł.':'❌ Wył.')+'</button>').join('')+
  '</div>';
}
const rgba=(hex,alpha)=>{
 if(typeof hex!=='string')return 'rgba(200,220,255,'+alpha+')';
 let h=hex.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');
 if(!/^[\da-fA-F]{6}$/.test(h))return 'rgba(200,220,255,'+alpha+')';
 return 'rgba('+parseInt(h.slice(0,2),16)+','+parseInt(h.slice(2,4),16)+','+parseInt(h.slice(4,6),16)+','+alpha+')';
};
function drawActor(ctx,o,g){
 if(!enabled('fight')||!o||!Number.isFinite(o.x)||!Number.isFinite(o.y)||!o.b)return;
 const options=prefs(),quality=options.artQuality,stage=clamp(o.tier||1,1,3),id=o.b.id||0;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const strength=options.artIntensity/100,detail=quality==='ultra'?3:quality==='high'?2:quality==='medium'?1:0;
 if(strength===0||detail===0||reduced)return;
 const time=Math.max(0,g?.rt||0);
 const color=window.BVBArtEvolution?.colors?.[id]||o.b.c||'#c4b5fd';
 const radius=Number(o.r)||16,phase=time*(1.5+(id%17)*.17)+id*1.618;
 const waveform=['rush','cleave','venom','stealth','slash','recoil','weave','pulse','lunge','flash',
  'jump','roll','crystal','scan','coil','swing','hammer','divide','arc','compress','predict',
  'matrix','grow','recoil','mutate','extend','bounce','conduct','expand','freeze','reel',
  'swarm','mix','rail','trap','haunt','fly','candy','blob','lock','corrode','refract',
  'drift','spin','spiral','bloom','count','orbit'][id];
 ctx.save();
 const segments=3+id%5+stage;
 ctx.lineWidth=.6+stage*.28;ctx.lineCap='round';ctx.strokeStyle=color;
 ctx.shadowBlur=quality==='ultra'?11:4;ctx.shadowColor=color;
 for(let i=0;i<segments;i++){
  const base=2*Math.PI*i/segments+phase*(id%2?1:-1)*.19;
  const pulse=2.3*Math.sin(phase*.8+i*1.9)*(1+stage*.12);
  const r=radius+3+stage*1.8+pulse;
  const spread=.08+.05*((id+i)%4);
  ctx.globalAlpha=strength*(.36+.24*Math.cos(phase+i));
  ctx.beginPath();
  ctx.arc(o.x,o.y,r,base-spread,base+spread);ctx.stroke();
 }
 if(detail>1&&stage>=2){
  const count=Math.min(7,stage+id%4+1);
  ctx.fillStyle=color;ctx.globalAlpha=strength*.68;
  for(let j=0;j<count;j++){
   const a=phase*(.25+(id%5)*.08)+(j*2*Math.PI/count),r=radius+5+stage*3;
   ctx.beginPath();ctx.arc(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r,stage===3?1.5:1,0,Math.PI*2);ctx.fill();
  }
 }
 if(detail===3){
  // Different core rhythm for each identity; V3 intensifies while keeping
  // the base motion characteristic of V1.
  const oscillation=Math.sin(phase*(1.1+(id%7)*.11));
  const shape=id%6;
  const x=o.x+Math.cos(phase*.33)*(radius*.28),y=o.y+Math.sin(phase*.51)*(radius*.28);
  ctx.globalAlpha=strength*.37;ctx.lineWidth=.7;
  ctx.beginPath();
  if(shape===0||waveform==='spiral')ctx.arc(x,y,radius*.2+Math.abs(oscillation)*3,0,6.283);
  else if(shape===1||waveform==='lunge'){ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);}
  else if(shape===2){ctx.moveTo(x,y-5);ctx.lineTo(x+4,y+4);ctx.lineTo(x-4,y+4);ctx.closePath();}
  else if(shape===3){ctx.moveTo(x-5,y-5);ctx.lineTo(x+5,y+5);}
  else if(shape===4)ctx.rect(x-3,y-3,6,6);
  else{ctx.moveTo(x-5,y);ctx.lineTo(x,y-5);ctx.lineTo(x+5,y);ctx.lineTo(x,y+5);ctx.closePath();}
  ctx.stroke();
 }
 // Facial animation: deterministic blink and gaze. Low HP creates a worried
 // expression, normal combat keeps the eyes alert.
 if(enabled('interior')){
  ctx.shadowBlur=0;ctx.lineWidth=Math.max(.55,radius*.07);
  const blink=Math.pow(Math.max(0,Math.sin(phase*.58)),28);
  const gaze=Math.sin(phase*.35)*radius*.09;
  const eyeY=o.y+radius*.12;
  const vulnerable=(o.hp||0)<(o.mh||1)*.3;
  ctx.strokeStyle=vulnerable?'#fbcfe8':'#15243c';
  ctx.globalAlpha=.9*strength;
  for(const side of [-1,1]){
   const px=o.x+side*radius*.28+gaze;
   ctx.beginPath();
   if(blink>.55){ctx.moveTo(px-radius*.1,eyeY);ctx.lineTo(px+radius*.1,eyeY);}
   else {ctx.arc(px,eyeY,radius*.08,0,Math.PI*2);}
   ctx.stroke();
  }
 }
 ctx.restore();
}
function resultBalls(g,won){
 if(!g||!Array.isArray(g.my))return '';
 const deck=g.my.filter(b=>b&&Number.isInteger(b.id)&&B[b.id]).slice(0,3);
 if(!deck.length)return '';
 const label=won?'Zadowolone kulki':'Smutne kulki';
 return '<section class="bvb-result-deck '+(won?'won':'lost')+'" aria-label="'+label+'">'+
  deck.map((b,i)=>{
   const delay=(b.id%9)*.13+(i*.07);
   return '<div class="bvb-result-ball" data-bvb-ball="'+b.id+'" style="--delay:'+delay+'s;--tempo:'+(1.25+(b.id%11)*.14)+'s">'+
    '<div class="bvb-result-portrait">'+orb(b)+
    '<span class="bvb-result-face" aria-hidden="true">'+(won?'◡':'⌢')+'</span></div>'+
    '<small>'+esc(b.n)+'</small></div>';
  }).join('')+'</section>';
}
const style=document.createElement('style');
style.textContent=[
'.bvb-result-deck{display:flex;justify-content:space-evenly;gap:7px;margin:16px 0;padding:12px 5px;border-radius:17px;background:#131b39;border:1px solid #485b9f}',
'.bvb-result-ball{min-width:0;flex:1;text-align:center;animation:bvbWin var(--tempo) ease-in-out var(--delay) infinite alternate}',
'.bvb-result-deck.lost .bvb-result-ball{animation-name:bvbLoss;filter:saturate(.62)}',
'.bvb-result-portrait{position:relative;display:inline-flex;align-items:center;justify-content:center}',
'.bvb-result-ball .orb{--s:64px!important}',
'.bvb-result-face{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:22px;font-weight:900;color:#effaff;text-shadow:0 1px 4px #000}',
'.bvb-result-deck.lost .bvb-result-face{color:#bdc6df}',
'.bvb-result-ball small{display:block;font-weight:750;font-size:11px;margin-top:5px;overflow-wrap:anywhere}',
'@keyframes bvbWin{from{transform:translateY(1px) rotate(-4deg)}to{transform:translateY(-9px) rotate(5deg)}}',
'@keyframes bvbLoss{from{transform:translateY(4px) rotate(-2deg)}to{transform:translateY(8px) rotate(2deg)}}',
'body.bvb-effects-off .bvb-result-ball,body.bvb-result-motion-off .bvb-result-ball{animation:none!important}',
'@media(prefers-reduced-motion:reduce){.bvb-result-ball{animation:none!important}}',
'body.bvb-menu-motion-off #menu .bvb3-tile:before,body.bvb-menu-motion-off #menu .bvb3-ghost{animation:none!important}'
].join('\n');
document.head.appendChild(style);
window.BVBMotion={change,settingsHtml,drawActor,resultBalls,enabled,prefs,sync};
sync();
})();
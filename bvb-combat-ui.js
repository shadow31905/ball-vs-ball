/* BVB Combat Rework — spectator HUD, camera, playback and round statistics.
   Replays are visual snapshots, not deterministic re-simulations. */
(() => {
'use strict';
const storeKey='bvb-rework-view-v1';
const defaults={camera:'static',fx:'full',speed:1};
let opts={...defaults};
try {const saved=JSON.parse(localStorage.getItem(storeKey)||'{}');if(saved&&typeof saved==='object')opts={...opts,...saved};}catch(e){}
if(!['static','dynamic'].includes(opts.camera))opts.camera='static';
if(!['full','low'].includes(opts.fx))opts.fx='full';
if(![.5,1,2].includes(opts.speed))opts.speed=1;
const save=()=>{try{localStorage.setItem(storeKey,JSON.stringify(opts));}catch(e){}};
const css=document.createElement('style');
css.textContent=`
#bvbCombatHud{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:7px 0;font-size:11px}
.bvb-fighter{border:1px solid #405486;background:#121a37;border-radius:12px;padding:8px;min-width:0}
.bvb-fighter strong{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
.bvb-track{height:7px;background:#090e20;border-radius:9px;overflow:hidden;margin-top:4px}
.bvb-track i{display:block;height:100%;background:#4ade80;transition:width .12s}
.bvb-track.armor i{background:#fbbf24}.bvb-track.shield i{background:#38bdf8}
.bvb-meta{color:#cbd5e1;line-height:1.5;margin-top:3px}
#bvbCombatControls{display:flex;align-items:center;justify-content:center;gap:5px;flex-wrap:wrap;margin:8px 0}
#bvbCombatControls button,#bvbCombatControls select{font:inherit;font-size:12px;color:#eff6ff;background:#253767;border:1px solid #6078ae;border-radius:8px;padding:7px 8px;cursor:pointer}
#bvbCombatControls button:disabled{opacity:.45;cursor:not-allowed}
#bvbCombatControls .bvb-clock{font-weight:900;color:#fef08a;font-size:13px;margin-right:auto}
#bvbReplayOverlay{position:fixed;inset:0;z-index:105;background:#020617eF;display:flex;justify-content:center;align-items:center;padding:14px}
#bvbReplayOverlay[hidden]{display:none}
#bvbReplayPanel{background:#111b3b;border:2px solid #5874b8;border-radius:16px;padding:12px;width:min(440px,100%);color:#f8fafc}
#bvbReplayPanel canvas{width:100%;aspect-ratio:1;display:block;background:#10182f;border-radius:12px}
#bvbReplayPanel input[type=range]{width:100%;accent-color:#38bdf8}
#bvbReplayPanel button{font:inherit;background:#273d70;color:white;border:1px solid #6b87c3;border-radius:9px;padding:8px;margin:3px}
`;
document.head.appendChild(css);
const game=document.querySelector('#game'),canvas=document.querySelector('#cv');
if(!game||!canvas)return;
const hud=document.createElement('div');hud.id='bvbCombatHud';hud.setAttribute('aria-live','off');
document.querySelector('#bset').after(hud);
const controls=document.createElement('div');controls.id='bvbCombatControls';
controls.innerHTML=`<span class="bvb-clock" id="bvbBattleClock">00:00 / 01:00</span>
<button id="bvbPause" title="Pauza walki">⏸️</button>
<select id="bvbSpeed" aria-label="Prędkość walki"><option value="0.5">0,5×</option><option value="1">1×</option><option value="2">2×</option></select>
<button id="bvbCamera" title="Zmień kamerę">📷 Statyczna</button>
<button id="bvbFx" title="Jakość efektów">✨ Pełne FX</button>
<button id="bvbReplay" title="Powtórka ostatniej rundy">🎞️ Powtórka</button>`;
canvas.after(controls);
const el=id=>document.getElementById(id);
let paused=false,frames=[],lastReplay=[],captureClock=0,frameClock=0,matchKey='',replayState=null,wasPaused=false;
const snap=g=>({
 t:+g.rt.toFixed(2),arena:g.th,
 actors:(g.bl||[]).map(o=>({id:o.b?.id||0,name:o.b?.n||'Kulka',color:o.b?.c||'#93c5fd',
  x:+o.x.toFixed(1),y:+o.y.toFixed(1),r:o.r,team:o.team,hp:o.hp,mh:o.mh,
  shield:o.status?.shield||0,armor:o.armor||0})),
 rings:(g.rings||[]).slice(-12).map(r=>({x:r.x,y:r.y,radius:r.radius,c:r.c})),
});
function capture(g,force=false){
 if(!g?.bl?.length||(!force&&captureClock<.1))return;
 captureClock=0;
 frames.push(snap(g));
 if(frames.length>650)frames.shift();
}
function startRound(g){
 if(!g)return;
 matchKey=String(g.matchId)+':'+String(g.rn);
 frames=[];captureClock=0;paused=false;
 capture(g,true);
 updateButtons(g);
}
function endRound(g,winner){
 capture(g,true);
 if(frames.length)lastReplay=frames.map(f=>({...f}));
 const winnerActor=g.bl.find(o=>o.team===winner);
 g.reworkRoundStats={duration:+g.rt.toFixed(1),winner,
  fighter:g.bl.map(o=>({name:o.b?.n||'Kulka',team:o.team,
   hits:o.combatStats?.contactHits||0,crits:o.combatStats?.crits||0,
   abilities:o.combatStats?.abilities||0,damage:Math.round(o.combatStats?.damageDealt||0)})),
  winnerName:winnerActor?.b?.n||'Remis'};
}
function time(t){const sec=Math.max(0,Math.floor(t||0));return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');}
function fighter(o){
 if(!o)return '<div class="bvb-fighter">Oczekiwanie na kulkę</div>';
 const percent=(v,max)=>Math.round(Math.max(0,Math.min(100,v/Math.max(1,max)*100)));
 const st=o.status||{},statuses=[
  st.burn>0?'🔥':null,st.poison>0?'☠️':null,st.slow>0?'❄️':null,
  st.stun>0?'⚡':null,st.weaken>0?'⬇️':null].filter(Boolean).join(' ');
 const name=String(o.b?.n||'Kulka').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return `<div class="bvb-fighter"><strong>${o.team===0?'🔵':'🔴'} ${name}</strong>
 <div class="bvb-meta">❤️ ${Math.max(0,Math.ceil(o.hp))} / ${Math.ceil(o.mh)}</div>
 <div class="bvb-track"><i style="width:${percent(o.hp,o.mh)}%"></i></div>
 <div class="bvb-track armor" title="Pancerz"><i style="width:${percent(o.armor||0,o.armorMax||1)}%"></i></div>
 <div class="bvb-track shield" title="Tarcza"><i style="width:${percent(st.shield||0,32)}%"></i></div>
 <div class="bvb-meta">🛡️ ${Math.ceil(o.armor||0)} · 💠 ${Math.ceil(st.shield||0)} ${statuses}</div></div>`;
}
function updateButtons(g){
 const online=g?.m===12;
 el('bvbPause').disabled=online||g?.ph!=='battle';
 el('bvbPause').textContent=paused?'▶️':'⏸️';
 el('bvbSpeed').disabled=online;
 el('bvbReplay').disabled=!lastReplay.length;
 el('bvbSpeed').value=String(opts.speed);
 el('bvbCamera').textContent=opts.camera==='dynamic'?'📷 Dynamiczna':'📷 Statyczna';
 el('bvbFx').textContent=opts.fx==='low'?'✨ Lekkie FX':'✨ Pełne FX';
}
function frame(g,dt){
 if(!g)return;
 if(g.ph==='battle'&&g.m!==12){
   const key=String(g.matchId)+':'+String(g.rn);
   if(key!==matchKey)startRound(g);
   if(!paused){captureClock+=dt*opts.speed;capture(g);}
 }
 frameClock+=dt;
 if(frameClock<.12)return;
 frameClock=0;
 el('bvbBattleClock').textContent=time(g.rt)+' / 01:00';
 hud.innerHTML=(g.bl||[]).slice().sort((a,b)=>a.team-b.team).map(fighter).join('');
 updateButtons(g);
}
el('bvbPause').addEventListener('click',()=>{
 if(!G||G.m===12||G.ph!=='battle')return;
 paused=!paused;updateButtons(G);
});
el('bvbSpeed').addEventListener('change',e=>{
 const v=Number(e.target.value);if(![.5,1,2].includes(v))return;
 opts.speed=v;save();
});
el('bvbCamera').addEventListener('click',()=>{
 opts.camera=opts.camera==='static'?'dynamic':'static';save();updateButtons(G);
});
el('bvbFx').addEventListener('click',()=>{
 opts.fx=opts.fx==='full'?'low':'full';save();updateButtons(G);
});
const overlay=document.createElement('div');overlay.id='bvbReplayOverlay';overlay.hidden=true;
overlay.innerHTML=`<div id="bvbReplayPanel" role="dialog" aria-modal="true" aria-label="Powtórka walki">
<div style="display:flex;justify-content:space-between;align-items:center"><strong>🎞️ Powtórka walki</strong><button id="bvbReplayClose" aria-label="Zamknij powtórkę">✕</button></div>
<canvas id="bvbReplayCanvas" width="720" height="720"></canvas>
<input type="range" id="bvbReplaySeek" min="0" max="1000" value="0" aria-label="Przewiń powtórkę">
<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap"><span id="bvbReplayTime">00:00</span><div>
<button id="bvbReplayPlay">⏸️</button><button id="bvbReplayHalf">0,5×</button>
<button id="bvbReplayNormal">1×</button><button id="bvbReplayDouble">2×</button></div></div>
</div>`;
document.body.appendChild(overlay);
const rcanvas=el('bvbReplayCanvas'),rc=rcanvas.getContext('2d');
function renderReplay(){
 if(!replayState||!lastReplay.length)return;
 const t=replayState.t;
 let idx=0;
 while(idx<lastReplay.length-1&&lastReplay[idx+1].t<=t)idx++;
 const a=lastReplay[idx],b=lastReplay[Math.min(idx+1,lastReplay.length-1)];
 const k=a===b?0:Math.max(0,Math.min(1,(t-a.t)/(b.t-a.t||1)));
 rc.setTransform(2,0,0,2,0,0);
 const bg=['#19132d','#101b3e','#381515','#0b2a42','#082d2b','#201237'][a.arena%6]||'#10182f';
 rc.fillStyle=bg;rc.fillRect(0,0,360,360);
 rc.strokeStyle='#94a3b8';rc.lineWidth=3;rc.strokeRect(3,3,354,354);
 for(const ring of a.rings){rc.globalAlpha=.45;rc.strokeStyle=ring.c||'#fff';rc.beginPath();rc.arc(ring.x,ring.y,ring.radius||20,0,7);rc.stroke();}
 rc.globalAlpha=1;
 a.actors.forEach((o,i)=>{
  const n=b.actors[i]||o,x=o.x+(n.x-o.x)*k,y=o.y+(n.y-o.y)*k;
  rc.shadowColor=o.color;rc.shadowBlur=12;rc.fillStyle=o.color;
  rc.beginPath();rc.arc(x,y,o.r,0,Math.PI*2);rc.fill();
  rc.shadowBlur=0;rc.lineWidth=3;rc.strokeStyle=o.team?'#ef4444':'#facc15';rc.stroke();
  rc.fillStyle='#0b1226';rc.fillRect(x-22,y-o.r-13,44,5);
  rc.fillStyle=o.team?'#f87171':'#4ade80';rc.fillRect(x-22,y-o.r-13,44*Math.max(0,o.hp/o.mh),5);
 });
 rc.font='bold 14px system-ui';rc.fillStyle='#fff';rc.fillText(time(t),12,24);
 el('bvbReplayTime').textContent=time(t)+' / '+time(lastReplay[lastReplay.length-1].t);
 el('bvbReplaySeek').value=String(Math.round(1000*t/Math.max(.01,lastReplay[lastReplay.length-1].t)));
}
function openReplay(){
 if(!lastReplay.length)return;
 wasPaused=paused;paused=true;
 replayState={t:0,playing:true,speed:1};
 overlay.hidden=false;el('bvbReplayPlay').textContent='⏸️';
 renderReplay();
 el('bvbReplayClose').focus();
}
function closeReplay(){
 overlay.hidden=true;replayState=null;paused=wasPaused;
 updateButtons(G);
}
el('bvbReplay').addEventListener('click',openReplay);
el('bvbReplayClose').addEventListener('click',closeReplay);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeReplay();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&replayState)closeReplay();});
el('bvbReplayPlay').addEventListener('click',()=>{
 if(!replayState)return;replayState.playing=!replayState.playing;
 el('bvbReplayPlay').textContent=replayState.playing?'⏸️':'▶️';
});
el('bvbReplaySeek').addEventListener('input',e=>{
 if(!replayState)return;
 replayState.t=Number(e.target.value)/1000*lastReplay[lastReplay.length-1].t;renderReplay();
});
for(const [id,speed] of [['bvbReplayHalf',.5],['bvbReplayNormal',1],['bvbReplayDouble',2]]){
 el(id).addEventListener('click',()=>{if(replayState)replayState.speed=speed;});
}
let lastTime=0;
function replayLoop(now){
 const dt=Math.min(.08,Math.max(0,(now-(lastTime||now))/1000));lastTime=now;
 if(replayState?.playing){
  replayState.t=Math.min(lastReplay[lastReplay.length-1].t,replayState.t+dt*replayState.speed);
  if(replayState.t>=lastReplay[lastReplay.length-1].t){
    replayState.playing=false;el('bvbReplayPlay').textContent='▶️';
  }
  renderReplay();
 }
 requestAnimationFrame(replayLoop);
}
requestAnimationFrame(replayLoop);
function victoryStats(g){
 const r=g?.reworkRoundStats;if(!r)return '';
 const names=r.fighter.map(f=>`${f.team===0?'🔵':'🔴'} ${String(f.name).replace(/[&<>"']/g,'')}: ${f.hits} zderzeń · ${f.crits} kryt. · ${f.abilities} mocy`);
 return `<p style="font-size:12px;color:#cbd5e1">⏱️ Ostatnia runda: ${r.duration}s</p>
 <p style="font-size:12px;color:#cbd5e1">${names.join('<br>')}</p>
 <button class="b" onclick="window.BVBReworkUI.openReplay()">🎞️ Obejrzyj powtórkę</button>`;
}
window.BVBReworkUI={frame,startRound,endRound,paused:()=>paused,rate:()=>opts.speed,
 camera:()=>opts.camera,fx:()=>opts.fx,openReplay,victoryStats};
})();

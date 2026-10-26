/* Ball VS Ball replay v3: exact simulation-tick visual state, lossless deltas and sound events.
   This records authoritative states; it does not re-simulate combat or promise pixel-identical
   browser rendering. Old 10 Hz v2 recordings remain readable as legacy snapshots. */
(() => {
'use strict';
const MAX_FRAMES=3702, MAX_BYTES=32*1024*1024, MAX_EVENTS=8192, MAX_SOUNDS=8192;
const unsafe=new Set(['__proto__','prototype','constructor']);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function clone(value,depth=0){
 if(depth>24)throw new Error('Zbyt głęboka struktura powtórki.');
 if(value==null||typeof value==='boolean')return value;
 if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('Nieprawidłowa liczba w powtórce.');return value;}
 if(typeof value==='string'){if(value.length>4096)throw new Error('Zbyt długi tekst w powtórce.');return value;}
 if(Array.isArray(value)){if(value.length>1000)throw new Error('Zbyt duża tablica w powtórce.');return value.map(x=>clone(x,depth+1));}
 if(typeof value==='object'){
  const out={};let n=0;
  for(const key of Object.keys(value)){
   if(unsafe.has(key)||++n>256)throw new Error('Nieprawidłowe pole powtórki.');
   if(value[key]!==undefined&&typeof value[key]!=='function')out[key]=clone(value[key],depth+1);
  }return out;
 }
 throw new Error('Nieprawidłowy typ danych powtórki.');
}
const visualFields=['m','ph','rt','th','rare','rn','bl','pr','z','fx','rings','pop','v2','obstacles','portal',
 'arenaFxTime','bossIndex','bossTelegraph','bossEcho','bossZones','bossEffects','bossHazards','lightning','shake','lastRoundWinner',
 'recentHitAt','lastDodgeAt','arenaShiftCount','finisher'];
function visualState(g){
 const out={};
 for(const key of visualFields)if(g[key]!==undefined)out[key]=clone(g[key]);
 return out;
}
function difference(a,b,path=[],out=[]){
 if(Object.is(a,b))return out;
 if(a&&b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){
  if(Array.isArray(b)&&a.length!==b.length){out.push([path,b]);return out;}
  for(const key of Object.keys(a))if(!Object.hasOwn(b,key))out.push([path.concat(key)]);
  for(const key of Object.keys(b)){
   if(!Object.hasOwn(a,key))out.push([path.concat(key),b[key]]);
   else difference(a[key],b[key],path.concat(key),out);
  }
 }else out.push([path,b]);
 return out;
}
function applyDelta(base,ops){
 if(!Array.isArray(ops)||ops.length>12000)throw new Error('Nieprawidłowa delta.');
 let state=clone(base);
 for(const op of ops){
  if(!Array.isArray(op)||op.length<1||op.length>2||!Array.isArray(op[0])||op[0].length>24)throw new Error('Nieprawidłowa operacja.');
  const keys=op[0];if(keys.some(k=>typeof k!=='string'||unsafe.has(k)||k.length>128))throw new Error('Niebezpieczna ścieżka.');
  if(!keys.length){if(op.length!==2)throw new Error('Brak stanu.');state=clone(op[1]);continue;}
  let parent=state;
  for(const key of keys.slice(0,-1)){
   if(!parent||typeof parent!=='object'||!Object.hasOwn(parent,key))throw new Error('Brak ścieżki delty.');
   parent=parent[key];
  }
  if(!parent||typeof parent!=='object')throw new Error('Nieprawidłowy cel delty.');
  const key=keys[keys.length-1];
  if(Array.isArray(parent)&&(!/^(0|[1-9][0-9]*)$/.test(key)||+key>=parent.length))throw new Error('Indeks poza tablicą.');
  if(op.length===1)delete parent[key];else parent[key]=clone(op[1]);
 }return state;
}
function validateState(s){
 if(!s||!Array.isArray(s.bl)||s.bl.length>8||!Number.isFinite(s.rt)||s.rt<0||s.rt>65)throw new Error('Nieprawidłowy stan walki.');
 if(!Number.isInteger(s.th)||s.th<0||s.th>5)throw new Error('Nieprawidłowa arena.');
 for(const a of s.bl){
  if(!a.b||!Number.isInteger(a.b.id)||a.b.id<0||a.b.id>129||!Number.isFinite(a.x)||!Number.isFinite(a.y)||
     !Number.isFinite(a.r)||a.r<=0||a.r>100||!Number.isFinite(a.hp)||!Number.isFinite(a.mh)||a.mh<=0)
   throw new Error('Nieprawidłowa kulka.');
 }
 return s;
}
class Recording{
 constructor(meta={}){this.meta={...clone(meta),complete:true};this.frames=[];this.events=[];this.sounds=[];this.previous=null;this.bytes=0;}
 capture(g){
  if(!g?.bl?.length)return false;
  const state=validateState(visualState(g)),t=state.rt;
  const last=this.frames[this.frames.length-1];
  if(last&&t<last.t)throw new Error('Czas powtórki cofnął się.');
  const record=this.frames.length%120===0?{t,key:state}:{t,delta:difference(this.previous,state)};
  if(last&&t===last.t&&this.previous&&JSON.stringify(this.previous)===JSON.stringify(state))return false;
  const bytes=JSON.stringify(record).length;
  if(this.frames.length>=MAX_FRAMES||this.bytes+bytes>MAX_BYTES){this.meta.complete=false;return false;}
  this.frames.push(record);this.previous=state;this.bytes+=bytes;return true;
 }
 event(t,type,detail={}){
  if(this.events.length>=MAX_EVENTS){this.meta.complete=false;return;}
  this.events.push({t,type:String(type).slice(0,64),detail:clone(detail)});
 }
 sound(t,params){
  if(this.sounds.length>=MAX_SOUNDS){this.meta.complete=false;return;}
  this.sounds.push({t,kind:'tone',...clone(params)});
 }
 music(t,params){
  if(this.sounds.length>=MAX_SOUNDS){this.meta.complete=false;return;}
  this.sounds.push({t,kind:'spooky',...clone(params),m:true});
 }
 export(){return {version:3,tickRate:60,kind:'state-deltas',meta:clone(this.meta),frames:this.frames,events:this.events,sounds:this.sounds};}
}
function validate(data){
 if(!data||data.version!==3||data.kind!=='state-deltas'||data.tickRate!==60||!Array.isArray(data.frames)||
    data.frames.length<1||data.frames.length>MAX_FRAMES||!Array.isArray(data.events)||data.events.length>MAX_EVENTS||
    !Array.isArray(data.sounds)||data.sounds.length>MAX_SOUNDS)throw new Error('Nieobsługiwany format powtórki.');
 if(JSON.stringify(data).length>MAX_BYTES+4*1024*1024)throw new Error('Powtórka przekracza limit rozmiaru.');
 let state=null,t=-1;
 for(let i=0;i<data.frames.length;i++){
  const f=data.frames[i];
  if(!Number.isFinite(f.t)||f.t<t||f.t<0||f.t>65||(!f.key&&!f.delta)||i%120===0&&!f.key)throw new Error('Nieprawidłowa oś czasu.');
  state=f.key?clone(f.key):applyDelta(state,f.delta);validateState(state);
  if(state.rt!==f.t)throw new Error('Niezgodny czas stanu.');
  t=f.t;
 }
 clone(data.meta||{});
 for(const e of data.events){if(!Number.isFinite(e.t)||e.t<0||e.t>65||typeof e.type!=='string')throw new Error('Nieprawidłowe zdarzenie.');clone(e.detail);}
 for(const s of data.sounds){
  if(!Number.isFinite(s.t)||s.t<0||s.t>65||!['sine','square','triangle','sawtooth'].includes(s.type))throw new Error('Nieprawidłowy dźwięk.');
  if(s.kind==='spooky'){
   if(!Number.isFinite(s.freq)||s.freq<10||s.freq>24000||!Number.isFinite(s.duration)||s.duration<0||s.duration>10||
      !Number.isFinite(s.volume)||s.volume<0||s.volume>1||!Number.isFinite(s.cutoff)||s.cutoff<10||s.cutoff>24000||
      !Number.isFinite(s.detune)||Math.abs(s.detune)>2400)throw new Error('Nieprawidłowa synteza muzyki.');
  }else{
   if(s.kind!==undefined&&s.kind!=='tone')throw new Error('Nieznany instrument powtórki.');
   if(!Number.isFinite(s.f)||s.f<10||s.f>24000||!Number.isFinite(s.d)||s.d<0||s.d>10||
      !Number.isFinite(s.v)||s.v<0||s.v>1||(s.s!==undefined&&(!Number.isFinite(s.s)||s.s<0||s.s>24000))||
      (s.m!==undefined&&![0,1,false,true].includes(s.m)))throw new Error('Nieprawidłowy dźwięk.');
  }
 }
 return data;
}
function stateAt(data,index){
 index=Math.max(0,Math.min(data.frames.length-1,index|0));
 let k=index;while(k>0&&!data.frames[k].key)k--;
 let state=clone(data.frames[k].key);
 for(let i=k+1;i<=index;i++)state=data.frames[i].key?clone(data.frames[i].key):applyDelta(state,data.frames[i].delta);
 return state;
}
window.BVBReplayCodec={Recording,visualState,difference,applyDelta,stateAt,validate,escapeHTML,limits:{MAX_FRAMES,MAX_BYTES,MAX_EVENTS,MAX_SOUNDS}};
})();
/* BVB Combat Rework — spectator HUD, camera, playback and round statistics.
   Replays store every authoritative simulation step; no gameplay is re-simulated. */
(() => {
'use strict';
const storeKey='bvb-rework-view-v1';
const replayStoreKey='bvb-rework-replays-'+(location.pathname.includes('/beta/')?'beta':'main')+'-v2';
const defaults={camera:'static',fx:'full',speed:1,replaySound:true};
let opts={...defaults};
try {const saved=JSON.parse(localStorage.getItem(storeKey)||'{}');if(saved&&typeof saved==='object')opts={...opts,...saved};}catch(e){}
if(!['static','dynamic'].includes(opts.camera))opts.camera='static';
if(!['full','low'].includes(opts.fx))opts.fx='full';
if(![.5,1,2].includes(opts.speed))opts.speed=1;
if(typeof opts.replaySound!=='boolean')opts.replaySound=true;
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
.bvb-victory{text-align:center;border:1px solid #fbbf24;border-radius:16px;padding:18px 10px;margin:10px 0;background:radial-gradient(ellipse at top,#6b451b88,#111b3b)}
.bvb-victory>p:first-of-type{letter-spacing:.16em;font-size:11px;color:#fde68a}
.bvb-winner-orb{display:grid;place-items:center;margin:0 auto 12px;width:78px;height:78px;font-size:36px;border:3px solid #fef08a;border-radius:50%;background:var(--winner-color);box-shadow:0 0 28px var(--winner-color);animation:bvb-winner 1.8s ease-in-out infinite alternate}
@keyframes bvb-winner{to{transform:translateY(-5px) scale(1.06);box-shadow:0 0 44px var(--winner-color)}}
@media(prefers-reduced-motion:reduce){.bvb-winner-orb{animation:none}}
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
<button id="bvbReplay" title="Powtórka ostatniej rundy">🎞️ Powtórka</button>
<button id="bvbSaved" title="Wczytaj ostatnio zapisaną powtórkę">📂 Zapisane</button>`;
canvas.after(controls);
const el=id=>document.getElementById(id);
let paused=false,lastReplay=[],frameClock=0,matchKey='',replayState=null,wasPaused=false;
let recording=null,lastData=null,replayingSound=false,decodeCache=null,opener=null,recordingEnded=false;
const codec=window.BVBReplayCodec;
function captureStep(g){
 if(!recording||g.m===12)return;
 try{recording.capture(g);}
 catch(error){
  recording.meta.complete=false;recording.meta.captureError=String(error.message).slice(0,200);
  lastData=recording.export();lastReplay=lastData.frames;recording=null;recordingEnded=false;
  return;
 }
 if(recordingEnded){lastData=recording.export();lastReplay=lastData.frames;decodeCache=null;recording=null;recordingEnded=false;}
}
function startRound(g){
 if(!g)return;
 matchKey=String(g.matchId)+':'+String(g.rn);
 recording=g.m===12?null:new codec.Recording({seed:g.rngSeed??null,matchId:g.matchId||'',round:g.rn||0,
  arena:g.th,camera:opts.camera,fx:opts.fx,fxLevel:typeof S!=='undefined'?S.o.fxLevel??3:3,playerAura:typeof S!=='undefined'?S.playerAura||'':'',created:new Date().toISOString()});
 lastReplay=[];lastData=null;decodeCache=null;recordingEnded=false;paused=false;
 captureStep(g);frameClock=.12;frame(g,0);updateButtons(g);
}
function recordEvent(g,type,detail={}){
 if(!recording||g?.m===12||String(g?.matchId)+':'+String(g?.rn)!==matchKey)return;
 recording.event(g.rt||0,type,detail);
}
function recordSound(g,params){
 if(replayingSound||!recording||g?.m===12||g?.ph!=='battle'||(params.m&&paused))return;
 recording.sound(g.rt||0,params);
}
function recordMusic(g,params){
 if(replayingSound||!recording||g?.m===12||g?.ph!=='battle'||paused)return;
 recording.music(g.rt||0,params);
}
function endRound(g,winner){
 captureStep(g);
 // The battle clock stops on K.O. Record a short presentation-only tail so
 // seeking, exporting and reopening a replay reproduces the SAME chosen scene,
 // without simulating extra attacks or mutating the authoritative game state.
 if(recording&&g.finisher&&Number.isInteger(g.finisher.variant)&&g.finisher.variant>=0&&g.finisher.variant<5){
  const duration=Math.min(1.2,Math.max(0,Number(g.finisher.life)||0),Math.max(0,65-g.rt));
  for(let frame=1;frame<=Math.floor(duration*60+1e-6);frame++){
   const age=frame/60;
   const visual={...g,rt:g.rt+age,finisher:{...g.finisher,age}};
   if(!recording.capture(visual))break;
  }
 }
 lastData=recording?.export()||lastData;lastReplay=lastData?.frames||[];recordingEnded=!!recording;decodeCache=null;
 const winnerActor=g.bl.find(o=>o.team===winner);
 g.reworkRoundStats={duration:g.rt,winner,
  fighter:g.bl.map(o=>({name:o.b?.n||'Kulka',team:o.team,
   hits:o.combatStats?.contactHits||0,crits:o.combatStats?.crits||0,
   abilities:o.combatStats?.abilities||0,damage:Math.round(o.combatStats?.damageDealt||0)})),
  winnerName:winnerActor?.b?.n||'Remis',winnerId:winnerActor?.b?.id??0,
  winnerColor:winnerActor?.b?.c||'#facc15',complete:lastData?.meta?.complete!==false};
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
 el('bvbReplay').disabled=online||!lastReplay.length;
 el('bvbSaved').disabled=online||!storedReplays().length;
 el('bvbSpeed').value=String(opts.speed);
 el('bvbCamera').textContent=opts.camera==='dynamic'?'📷 Dynamiczna':'📷 Statyczna';
 el('bvbFx').textContent=opts.fx==='low'?'✨ Lekkie FX':'✨ Pełne FX';
}
function frame(g,dt){
 if(!g)return;
 if(g.ph==='battle'&&g.m!==12){
   const key=String(g.matchId)+':'+String(g.rn);
   if(key!==matchKey)startRound(g);
   // Capture runs after every authoritative simulation step.
 }
 frameClock+=dt;
 if(frameClock<.12)return;
 frameClock=0;
 el('bvbBattleClock').textContent=time(g.rt)+' / 01:00';
 hud.innerHTML=(g.bl||[]).slice().sort((a,b)=>a.team-b.team).map(fighter).join('');
 updateButtons(g);
}
function togglePause(){
 if(!G||G.m===12||G.ph!=='battle')return;
 paused=!paused;updateButtons(G);
}
el('bvbPause').addEventListener('click',togglePause);
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
<div style="display:flex;gap:3px;flex-wrap:wrap">
<button id="bvbReplaySave">💾 Zapisz</button><button id="bvbReplaySound">🔊 Dźwięk</button>
<button id="bvbReplayLoad">📂 Otwórz zapis</button>
<button id="bvbReplayDownload">⬇️ Pobierz JSON</button>
<button id="bvbReplayDebug">🔎 Raport błędu</button><button id="bvbReplayImport">📥 Import JSON</button><input id="bvbReplayFile" type="file" accept=".json,application/json" hidden></div><p id="bvbReplayNotice" role="status" style="font-size:12px;color:#cbd5e1;margin:5px 0"></p>
</div>`;
document.body.appendChild(overlay);
const rcanvas=el('bvbReplayCanvas'),rc=rcanvas.getContext('2d');
function decodedFrame(index){
 if(!decodeCache||decodeCache.index>index||index-decodeCache.index>120)
  decodeCache={index,state:codec.stateAt(lastData,index)};
 else while(decodeCache.index<index){
  const f=lastData.frames[++decodeCache.index];
  decodeCache.state=f.key?codec.applyDelta(null,[[[],f.key]]):codec.applyDelta(decodeCache.state,f.delta);
 }
 return decodeCache.state;
}
function replayNotice(){
 el('bvbReplaySound').textContent=opts.replaySound?'🔊 Dźwięk powtórki':'🔇 Dźwięk powtórki';
 el('bvbReplayNotice').textContent=lastData?.version===3?
  (lastData.meta?.complete===false?'⚠️ Nagranie niepełne — osiągnięto limit pamięci.':'Każdy krok walki · zapisane zdarzenia i dźwięki · bez ponownej symulacji'):
  'Starsze nagranie: próbki obrazu co 0,1 s, bez ścieżki dźwiękowej.';
}
function renderReplay(){
 if(!replayState||!lastReplay.length)return;
 const t=replayState.t;
 let idx=0;
 while(idx<lastReplay.length-1&&lastReplay[idx+1].t<=t)idx++;
 if(lastData?.version===3){
  if(typeof window.BVBRenderReplay==='function')window.BVBRenderReplay(codec.applyDelta(null,[[[],decodedFrame(idx)]]),rc,lastData.meta);
  else {rc.setTransform(1,0,0,1,0,0);rc.clearRect(0,0,720,720);rc.fillStyle='#fff';rc.font='20px system-ui';rc.fillText('Brak renderera powtórek.',20,40);}
  el('bvbReplayTime').textContent=time(t)+' / '+time(lastReplay[lastReplay.length-1].t);
  el('bvbReplaySeek').value=String(Math.round(1000*t/Math.max(.01,lastReplay[lastReplay.length-1].t)));
  return;
 }
 // Legacy v2 uses its original sampled renderer.
 const a=lastReplay[idx],b=lastReplay[Math.min(idx+1,lastReplay.length-1)];
 const k=a===b?0:Math.max(0,Math.min(1,(t-a.t)/(b.t-a.t||1)));
 rc.setTransform(2,0,0,2,0,0);
 const bg=['#19132d','#101b3e','#381515','#0b2a42','#082d2b','#201237'][a.arena%6]||'#10182f';
 rc.fillStyle=bg;rc.fillRect(0,0,360,360);
 rc.strokeStyle='#94a3b8';rc.lineWidth=3;rc.strokeRect(3,3,354,354);
 for(const o of a.obstacles||[]){rc.fillStyle=o.c;rc.globalAlpha=.55;rc.beginPath();rc.arc(o.x,o.y,o.r||14,0,7);rc.fill();}
 for(const h of a.hazards||[]){rc.fillStyle=h.c||'#f97316';rc.globalAlpha=.22;rc.beginPath();rc.arc(h.x,h.y,h.r||20,0,7);rc.fill();}
 rc.globalAlpha=1;
 for(const shot of a.shots||[]){rc.fillStyle=shot.c||'#fff';rc.beginPath();rc.arc(shot.x,shot.y,shot.r||3,0,7);rc.fill();}
 for(const f of a.fx||[]){rc.globalAlpha=.45;rc.fillStyle=f.c||'#fff';rc.beginPath();rc.arc(f.x,f.y,f.r||2,0,7);rc.fill();}
 rc.globalAlpha=1;
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
function openReplay(finalOnly=false){
 if(!lastReplay.length||G?.m===12)return;
 opener=document.activeElement;wasPaused=paused;paused=true;
 replayState={t:finalOnly?Math.max(0,lastReplay[lastReplay.length-1].t-5):0,playing:true,speed:1};
 overlay.hidden=false;el('bvbReplayPlay').textContent='⏸️';replayNotice();
 renderReplay();
 el('bvbReplayClose').focus();
}
function closeReplay(){
 overlay.hidden=true;replayState=null;paused=wasPaused;
 updateButtons(G);if(opener?.isConnected)opener.focus();
}
el('bvbReplay').addEventListener('click',()=>openReplay(false));
el('bvbReplayClose').addEventListener('click',closeReplay);
function storedReplays(){
 try{
  const raw=localStorage.getItem(replayStoreKey)||'[]';if(raw.length>5*1024*1024)return [];
  const data=JSON.parse(raw);
  return Array.isArray(data)?data.filter(x=>x&&(
   x.version===3&&['gzip-base64','json'].includes(x.encoding)&&typeof x.payload==='string'||
   x.version===2&&Array.isArray(x.frames)&&x.frames.length>1&&x.frames.length<=650)).slice(0,3):[];
 }catch(_){return [];}
}
async function pack(data){
 const json=JSON.stringify(data);
 if(typeof CompressionStream==='function'){
  const stream=new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
  const bytes=new Uint8Array(await new Response(stream).arrayBuffer());
  let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return {version:3,encoding:'gzip-base64',payload:btoa(binary)};
 }
 return {version:3,encoding:'json',payload:json};
}
function validateLegacy(entry){
 let t=-1;
 for(const f of entry.frames){
  if(!f||!Number.isFinite(f.t)||f.t<t||f.t<0||f.t>65||!Array.isArray(f.actors)||f.actors.length>8)throw new Error('Uszkodzone starsze nagranie.');
  t=f.t;
  for(const actor of f.actors)for(const key of ['x','y','r','hp','mh'])if(!Number.isFinite(actor[key]))throw new Error('Uszkodzona kulka w starszym nagraniu.');
  for(const key of ['rings','shots','hazards','obstacles','fx']){
   if(f[key]===undefined)f[key]=[];
   if(!Array.isArray(f[key])||f[key].length>150)throw new Error('Uszkodzone efekty starszego nagrania.');
   for(const item of f[key])if(!item||!Number.isFinite(item.x)||!Number.isFinite(item.y))throw new Error('Uszkodzone współrzędne starszego nagrania.');
  }
 }
 return entry;
}
async function unpack(entry){
 if(entry.version===2)return validateLegacy(entry);
 let json;
 if(entry.encoding==='gzip-base64'){
  if(typeof DecompressionStream!=='function')throw new Error('Ta przeglądarka nie obsługuje zapisu skompresowanego.');
  if(entry.payload.length>5*1024*1024)throw new Error('Zbyt duży zapis.');
  const binary=atob(entry.payload),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
  const reader=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
  const decoder=new TextDecoder();let total=0;json='';
  try{while(true){const part=await reader.read();if(part.done)break;total+=part.value.length;
   if(total>codec.limits.MAX_BYTES+4*1024*1024)throw new Error('Rozpakowany zapis przekracza limit.');
   json+=decoder.decode(part.value,{stream:true});}json+=decoder.decode();
  }finally{reader.cancel().catch(()=>{});}
 }else json=entry.payload;
 return codec.validate(JSON.parse(json));
}
function setReplay(data){
 if(data.version===3){lastData=codec.validate(data);lastReplay=lastData.frames;}
 else {lastData=null;lastReplay=data.frames;}
 decodeCache=null;replayNotice();
}
async function saveReplay(){
 if(!lastData||!lastReplay.length||G?.m===12)return;
 const data=lastData,saved=storedReplays(),first=codec.stateAt(data,0);
 const label=first.bl.map(o=>String(o.b.n||'Kulka').slice(0,25)).join(' vs ');
 el('bvbReplaySave').disabled=true;
 try{
  const packed=await pack(data);saved.unshift({...packed,created:new Date().toISOString(),label});
  const keep=saved.slice(0,3);
  while(keep.length&&JSON.stringify(keep).length>4*1024*1024)keep.pop();
  if(!keep.length)throw new Error('Powtórka jest za duża dla pamięci przeglądarki — pobierz JSON.');
  while(keep.length){
   try{localStorage.setItem(replayStoreKey,JSON.stringify(keep));break;}
   catch(error){if(keep.length===1)throw error;keep.pop();}
  }
  el('bvbReplaySave').textContent='✅ Zapisano';updateButtons(G);
 }catch(error){el('bvbReplayNotice').textContent=error.message||'Brak miejsca — pobierz JSON.';}
 finally{el('bvbReplaySave').disabled=false;}
}
async function loadReplay(){
 const saved=storedReplays();
 if(!saved.length){el('bvbReplayLoad').textContent='Brak zapisów';return;}
 try{
  const data=await unpack(saved[0]);setReplay(data);
  replayState={t:0,playing:false,speed:1};el('bvbReplayPlay').textContent='▶️';renderReplay();
  el('bvbReplayLoad').textContent='📂 '+String(saved[0].label||'Powtórka').slice(0,15);
 }catch(error){el('bvbReplayNotice').textContent='Nie można otworzyć zapisu: '+error.message;}
}
function downloadJson(name,data){
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
el('bvbSaved').addEventListener('click',async()=>{
 const saved=storedReplays();if(!saved.length||G?.m===12)return;
 try{setReplay(await unpack(saved[0]));openReplay(false);replayState.playing=false;el('bvbReplayPlay').textContent='▶️';}
 catch(error){el('bvbSaved').title='Nie można wczytać powtórki: '+error.message;}
});
el('bvbReplaySave').addEventListener('click',saveReplay);
el('bvbReplayLoad').addEventListener('click',loadReplay);
el('bvbReplayDownload').addEventListener('click',()=>{
 if(lastReplay.length)downloadJson(lastData?'bvb-replay-v3.json':'bvb-replay-v2.json',
  lastData||{version:2,tickRate:10,kind:'snapshots',frames:lastReplay});
});
el('bvbReplaySound').addEventListener('click',()=>{opts.replaySound=!opts.replaySound;save();replayNotice();});
el('bvbReplayImport').addEventListener('click',()=>el('bvbReplayFile').click());
el('bvbReplayFile').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;
 try{
  if(file.size>codec.limits.MAX_BYTES+4*1024*1024)throw new Error('Plik jest za duży.');
  const data=codec.validate(JSON.parse(await file.text()));setReplay(data);
  replayState={t:0,playing:false,speed:1};el('bvbReplayPlay').textContent='▶️';renderReplay();
 }catch(error){el('bvbReplayNotice').textContent='Nie można zaimportować pliku: '+error.message;}
 e.target.value='';
});
el('bvbReplayDebug').addEventListener('click',()=>{
 downloadJson('bvb-diagnostics.json',window.BVBRework?.diagnostics?.()||{message:'No diagnostic data'});
});
overlay.addEventListener('click',e=>{if(e.target===overlay)closeReplay();});
document.addEventListener('keydown',e=>{
 if(!replayState)return;
 if(e.key==='Escape')closeReplay();
 if(e.key==='Tab'){
  const list=Array.from(overlay.querySelectorAll('button,input:not([hidden])')).filter(x=>!x.disabled);
  const first=list[0],last=list[list.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 }
});
el('bvbReplayPlay').addEventListener('click',()=>{
 if(!replayState)return;
 if(!replayState.playing&&replayState.t>=lastReplay[lastReplay.length-1].t){replayState.t=0;delete replayState.soundAt;}
 replayState.playing=!replayState.playing;
 el('bvbReplayPlay').textContent=replayState.playing?'⏸️':'▶️';
});
el('bvbReplaySeek').addEventListener('input',e=>{
 if(!replayState)return;
 replayState.t=Number(e.target.value)/1000*lastReplay[lastReplay.length-1].t;replayState.soundAt=replayState.t;renderReplay();
});
for(const [id,speed] of [['bvbReplayHalf',.5],['bvbReplayNormal',1],['bvbReplayDouble',2]]){
 el(id).addEventListener('click',()=>{if(replayState)replayState.speed=speed;});
}
function playSounds(from,to){
 if(!opts.replaySound||!lastData)return;
 replayingSound=true;
 try{for(const sound of lastData.sounds){
  if(sound.t<=from||sound.t>to)continue;
  if(sound.kind==='spooky'){
   if(typeof spookyTone==='function')spookyTone(sound.freq,sound.duration,sound.type,sound.volume,sound.cutoff,sound.detune);
  }else if(typeof snd==='function')snd(sound.f,sound.d,sound.type,sound.v,sound.s,sound.m);
 }}finally{replayingSound=false;}
}
let lastTime=0;
function replayLoop(now){
 const dt=Math.min(.08,Math.max(0,(now-(lastTime||now))/1000));lastTime=now;
 if(replayState?.playing){
  const before=replayState.soundAt??(replayState.t-1e-9);
  replayState.t=Math.min(lastReplay[lastReplay.length-1].t,replayState.t+dt*replayState.speed);
  playSounds(before,replayState.t);replayState.soundAt=replayState.t;
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
 const names=r.fighter.map(f=>codec.escapeHTML((f.team===0?'🔵':'🔴')+' '+f.name)+': '+f.hits+' zderzeń · '+f.crits+' kryt. · '+f.abilities+' mocy');
 const color=/^#[0-9a-f]{3,8}$/i.test(r.winnerColor)?r.winnerColor:'#facc15';
 return '<div class="bvb-victory"><div class="bvb-winner-orb" style="--winner-color:'+color+'" aria-hidden="true">'+(typeof B!=='undefined'&&B[r.winnerId]?orb(B[r.winnerId]):'🏆')+'</div>'+
 '<strong style="color:#fef08a;font-size:22px">'+codec.escapeHTML(r.winnerName)+'</strong><p>ZWYCIĘZCA RUNDY</p>'+
 '<p style="font-size:12px;color:#cbd5e1">⏱️ Ostatnia runda: '+r.duration.toFixed(1)+'s</p>'+
 '<p style="font-size:12px;color:#cbd5e1">'+names.join('<br>')+'</p></div>'+
 (lastReplay.length?'<button class="b" onclick="window.BVBReworkUI.openReplay(true)">🎬 Ostatnie 5 sekund</button>'+
 '<button class="b" onclick="window.BVBReworkUI.openReplay()">🎞️ Cała powtórka</button>':'');
}
window.BVBReworkUI={frame,startRound,endRound,captureStep,recordSound,recordMusic,recordEvent,isPlayingAudio:()=>replayingSound,isReplaying:()=>!!replayState,paused:()=>G?.m!==12&&paused,rate:()=>G?.m===12?1:opts.speed,
 camera:()=>replayState&&lastData?.meta?.camera||opts.camera,fx:()=>replayState&&lastData?.meta?.fx||opts.fx,openReplay,togglePause,victoryStats};
})();

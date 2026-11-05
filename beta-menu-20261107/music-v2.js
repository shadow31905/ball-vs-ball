/* BVB 2.5 — AUTORSKA MUZYKA: menu / runda / boss. TYLKO BETA.
   Instrumenty syntezowane Web Audio, bez zewnętrznych plików i praw do cudzych utworów. */
(()=>{'use strict';
 if(window.BVBMusicBeta)return;
 const TRACKS={
  menu:{bpm:88,roots:[50,46,53,48],chords:[[50,53,57],[46,50,53],[53,57,60],[48,52,55]],
   melody:[74,0,77,0,81,0,77,0,74,0,72,0,69,0,72,0,
           70,0,74,0,77,0,74,0,70,0,69,0,65,0,69,0,
           72,0,77,0,79,0,77,0,72,0,69,0,65,0,69,0,
           72,0,76,0,79,0,76,0,72,0,71,0,67,0,69,0]},
  battle:{bpm:140,roots:[45,41,43,40],chords:[[45,48,52],[41,45,48],[43,47,50],[40,44,47]],
   melody:[69,0,72,0,76,0,72,0,69,0,76,0,79,0,76,0,
           69,0,72,0,77,0,72,0,69,0,72,0,76,0,72,0,
           71,0,74,0,79,0,74,0,71,0,79,0,81,0,79,0,
           68,0,71,0,76,0,71,0,68,0,71,0,80,0,76,0]},
  boss:{bpm:156,roots:[42,38,45,40],chords:[[42,45,49],[38,42,45],[45,49,52],[40,44,47]],
   melody:[78,0,81,0,85,0,81,0,78,0,73,0,78,0,81,0,
           74,0,78,0,81,0,78,0,74,0,69,0,74,0,78,0,
           76,0,81,0,85,0,81,0,76,0,73,0,76,0,81,0,
           76,0,80,0,83,0,80,0,76,0,71,0,76,0,80,0]}
 };
 let ctx=null,volume=null,tickId=null,mode='menu',unlocked=false,step=0,nextAt=0;
 let scheduled=0,disabledReason='',lastSwitch='menu',oldBgStopped=false;
 const notesByMode={menu:0,battle:0,boss:0};
 const frequency=midi=>440*Math.pow(2,(midi-69)/12);
 const isMuted=()=>{try{return MU.m===1}catch(_){return false}};
 const settingVolume=()=>{try{let v=Number(S?.o?.vm);return Number.isFinite(v)?Math.min(1,Math.max(0,v)):.7}catch(_){return .7}};
 const desiredMode=()=>{try{return document.getElementById('game')?.hidden===false?(G?.m===11||G?.m===3||G?.m===13?'boss':'battle'):'menu'}catch(_){return 'menu'}};
 function makeContext(){
  if(ctx)return true;
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C){disabledReason='AudioContext nieobsługiwany';return false}
   ctx=new C();volume=ctx.createGain();volume.gain.value=0;volume.connect(ctx.destination);return true;
  }catch(e){disabledReason=String(e);return false}
 }
 function tone(midi,start,length,kind,level,attack=.025){
  if(!ctx||!midi)return;
  const osc=ctx.createOscillator(),amp=ctx.createGain();
  osc.type=kind;osc.frequency.setValueAtTime(frequency(midi),start);
  amp.gain.setValueAtTime(.00001,start);
  const peak=start+Math.min(attack,length*.28);
  amp.gain.exponentialRampToValueAtTime(Math.max(.00002,level),peak);
  amp.gain.exponentialRampToValueAtTime(.00001,start+length);
  osc.connect(amp);amp.connect(volume);osc.start(start);osc.stop(start+length+.025);
  scheduled++;notesByMode[mode]++;
 }
 function drum(start,snare=false){
  if(!ctx)return;
  const osc=ctx.createOscillator(),gain=ctx.createGain();
  osc.type=snare?'triangle':'sine';
  osc.frequency.setValueAtTime(snare?180:100,start);
  osc.frequency.exponentialRampToValueAtTime(snare?85:45,start+.09);
  gain.gain.setValueAtTime(snare?.045:.07,start);
  gain.gain.exponentialRampToValueAtTime(.00001,start+.12);
  osc.connect(gain);gain.connect(volume);osc.start(start);osc.stop(start+.125);
  scheduled++;notesByMode[mode]++;
 }
 function playStep(t){
  const p=TRACKS[mode],i=step%64,bar=Math.floor(i/16),within=i%16,unit=60/p.bpm/4;
  if(within===0){
   const chord=p.chords[bar];
   for(const note of chord)tone(note,t,unit*15.5,'sine',mode==='menu'?.022:.014,.22);
  }
  if(mode==='menu'){
   if(within===0||within===8)tone(p.roots[bar]-12,t,unit*7.7,'triangle',.028,.06);
   if(p.melody[i]&&i%2===0)tone(p.melody[i],t,unit*3.2,'sine',.035,.012);
   if(within===12)tone(p.roots[bar]+12,t,unit*3.2,'triangle',.012,.025);
  }else{
   if(within%4===0){tone(p.roots[bar]-12,t,unit*3.6,'sawtooth',mode==='boss'?.039:.031,.012);drum(t,within===4||within===12)}
   if(within%2===0){const arp=[0,7,12,7,3,7,12,10][(within/2)%8];tone(p.roots[bar]+arp+12,t,unit*1.7,'triangle',mode==='boss'?.026:.02,.009)}
   if(p.melody[i]&&within%4===0)tone(p.melody[i],t,unit*3.6,'square',mode==='boss'?.025:.018,.014);
  }
  step++;
 }
 function refresh(){
  if(!ctx||!volume)return;
  const shouldPlay=unlocked&&!isMuted()&&!document.hidden;
  const v=shouldPlay?settingVolume()*.67:0;
  volume.gain.setTargetAtTime(v,ctx.currentTime,.045);
  if(!shouldPlay)return;
  if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  if(ctx.state!=='running')return;
  const p=TRACKS[mode],unit=60/p.bpm/4;
  if(nextAt<ctx.currentTime-.16){nextAt=ctx.currentTime+.035;step=0}
  while(nextAt<ctx.currentTime+.19){playStep(nextAt);nextAt+=unit}
 }
 function changeMode(next){
  const target=TRACKS[next]?next:'menu';if(mode===target)return;
  mode=target;lastSwitch=target;step=0;
  if(ctx){nextAt=ctx.currentTime+.035;refresh()}
 }
 function start(){
  if(isMuted()||!makeContext())return;
  unlocked=true;changeMode(desiredMode());
  if(ctx.state==='suspended')ctx.resume().catch(()=>{});
  if(!tickId)tickId=setInterval(refresh,65);
  refresh();
 }
 // Zastąp starą jednolitą melodię w silniku. Nie modyfikuj efektów SFX.
 try{if(typeof bt!=='undefined'){clearInterval(bt);bt=null;oldBgStopped=true}}catch(_){}
 try{bgm=function(){try{clearInterval(bt);bt=null;oldBgStopped=true}catch(_){}if(isMuted()){refresh();return}start()}}catch(_){}
 try{const oldShow=show;show=function(id){const result=oldShow.apply(this,arguments);changeMode(id==='game'?desiredMode():'menu');return result}}catch(_){}
 document.addEventListener('pointerdown',start,{passive:true});
 document.addEventListener('keydown',start);
 document.addEventListener('visibilitychange',refresh);
 window.BVBMusicBeta={
  getState:()=>({mode,unlocked,muted:isMuted(),volume:settingVolume(),context:ctx?.state||'not-started',scheduled,notesByMode:{...notesByMode},oldBgStopped,lastSwitch,disabledReason}),
  switchTo:changeMode,refresh,start
 };
})();
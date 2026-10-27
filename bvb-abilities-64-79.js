/* Authored combat mechanics: playable balls 65–80 (internal IDs 64–79).
 * Preserves real in-game identities; separate purchased HP and damage upgrades.
 * One active signature per ball; V2 and V3 add distinct processes.
 */
(()=>{
'use strict';
const names=['Echo','Grawitacja','Kotwica','Lustro','Pustka','Słońce','Księżyc','Zaćmienie',
 'Supernowa','Mgławica','Pulsar','Kwazar','Kometa','Asteroida','Kwant','Atom'];
const texts=[
 ['Rezonator: dźwięk wraca od położenia celu','Kontrapunkt: trzeci impuls z ogłuszeniem'],
 ['Orbity: wirujące skały przecinają studnię','Kolaps: studnia zapada się falą po czasie'],
 ['Łańcuch kotwicy: zahaczenie o wroga','Uderzenie dna: fala sejsmiczna po odbiciu'],
 ['Sobowtór zwierciadła: mylący refleks','Labirynt: drugi odbity strzał i dłuższe odbicie'],
 ['Osobliwość: zasysa także pobliski cel','Wyzwolenie: pochłonięte pociski tworzą eksplozję'],
 ['Promienie korony: aktywny ognisty krąg','Rozbłysk koronalny: rozchodzący się gorący front'],
 ['Fazy księżyca: jedna faza przechodzi w drugą','Pełnia: faza łączy działanie dwóch poprzednich'],
 ['Półcień: strefa spowalnia i myli cel','Całkowite zaćmienie: powracająca fala ciemności'],
 ['Gwiezdny pył: drugi wybuch wyrzuca odłamki','Reakcja łańcuchowa: trzeci punkt detonacji'],
 ['Zawirowanie: obłok przemieszcza się','Gwiezdne zarodki: chmura zostawia wybuchowe punkty'],
 ['Naprzemienny biegun: seria przyciąga i odpycha','Rytm potrójny: impuls rozdziela się na trzy fazy'],
 ['Podwójny dżet: ruchome promienie z dwóch biegunów','Odbicie kwazara: dżety wracają przez arenę'],
 ['Lodowy ogon: szlak komety zamraża','Powrót: tor zostawia krystaliczne uderzenie'],
 ['Pas rumowiska: odłamki krążą wokół','Rozszczepienie: rozbite fragmenty wybuchają ponownie'],
 ['Druga superpozycja: dodatkowy punkt ataku','Splątanie: trzy pozycje wysyłają zsynchronizowane ciosy'],
 ['Powłoka elektronowa: pociski krążą wokół','Rozszczepienie: pełna orbita wyzwala reakcję']
];
const clamp=(x,min=17,max=343)=>Math.max(min,Math.min(max,Number.isFinite(x)?x:180));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)||1;
const angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const edge=(a,b,delta)=>({x:clamp(a.x+Math.cos(angle(a,b))*delta),y:clamp(a.y+Math.sin(angle(a,b))*delta)});
function cast(g,o,foe,api){
 if(!g||!o||!foe||!api.alive(foe)||o.b.id<64||o.b.id>79)return;
 const id=o.b.id,level=api.evolutionStage(o),st=api.roundState(),t=g.rt||0,
 {shoot,zone,radial,dash,strike,setStatus,visual}=api,dir=angle(o,foe);
 const mark=(kind,x,y,r=24,life=2,power=.26)=>zone(o,clamp(x),clamp(y),kind,r,life,power);
 const beam=(from,to,color,life=.35)=>{
  st.beams.push({x:from.x,y:from.y,x2:to.x,y2:to.y,
   id,color,life,max:life});
  if(st.beams.length>32)st.beams.splice(0,st.beams.length-32);
 };
 const signature={id,level,start:t,until:t+3.2,next:.32,steps:0,
  first:{x:o.x,y:o.y},last:{x:foe.x,y:foe.y},owner:o.uid};
 o.v4Signature=signature;
 switch(id){
 case 64:{ // Echo: it literally returns from the saved enemy position.
  radial(o,foe,.22,{radius:135});beam(o,foe,'#67efff');
  signature.next=1.5;signature.steps=0;signature.max=1+level;
  if(level>=1)mark('echo',foe.x,foe.y,20,1.8,.18);
  if(level===2)mark('slow',foe.x+23,foe.y,18,1.8,.16);
  break;
 }
 case 65:{ // Gravity: continuous well, not a one-time tether.
  const d=dist(o,foe);
  foe.vx=(foe.vx||0)+(o.x-foe.x)/d*.16;
  foe.vy=(foe.vy||0)+(o.y-foe.y)/d*.16;
  mark('zone',o.x,o.y,38,3.3,.27);
  signature.next=.27;signature.max=5+level*2;
  if(level>=1)mark('mine',o.x+27,o.y,17,2.8,.19);
  if(level===2)mark('mine',o.x-27,o.y,17,2.8,.19);
  break;
 }
 case 66:{ // Anchor: anti-knockback frame and a promised wall-quake.
  o.v4Anchor={until:t+3.7,level,lastWall:-99};
  o.vx*=.4;o.vy*=.4;mark('quake',o.x,o.y,24,1.3,.19);
  if(level>=1){setStatus(o,foe,'slow',.5);beam(o,foe,'#b3d6f7');}
  if(level===2)mark('quake',foe.x,foe.y,22,1.5,.22);
  signature.until=t+1;signature.max=0;
  break;
 }
 case 67:{ // Mirror: incoming projectile changes owner/team, not just shield points.
  o.v4Mirror={until:t+2.7+level*.6,level,reflected:0};
  o.status.shield=Math.min(32,(o.status.shield||0)+2);
  visual(o,o,'shield',38,'#ebfcff',.7);
  signature.until=t+1;signature.max=0;
  if(level>=1){
   // The first evolved mirror creates an actual reflected afterimage projectile.
   foe.aiTarget={vx:-foe.vy,vy:foe.vx};foe.aiDecisionClock=.55;
   shoot(o,foe,{count:1,damage:o.baseDmg*.13,ghost:true,bounces:1,color:'#e5f5ff'});
  }
  if(level===2)mark('shock',foe.x,foe.y,18,1.2,.2);
  break;
 }
 case 68:{ // Void: actually absorbs projectiles at its core.
  o.v4Void={until:t+3.4,level,absorbed:0,next:.3};
  mark('doom',o.x,o.y,35,2.6,.2);
  visual(o,o,'shadow',40,'#a66fff',.6);
  signature.until=t+1;signature.max=0;
  if(level>=1)mark('slow',o.x,o.y,30,2.3,.18);
  if(level===2)mark('zone',foe.x,foe.y,20,1.8,.2);
  break;
 }
 case 69:{ // Sun: periodic nearby radiant heat; V3 emits outward front.
  o.v4Sun={until:t+3,level,next:.24,pulses:0};
  mark('fire',o.x,o.y,34,2.8,.28);
  if(level>=1)mark('fire',foe.x,foe.y,19,2.1,.21);
  if(level===2)radial(o,foe,.27,{radius:115,burn:.35});
  signature.until=t+.8;signature.max=0;
  break;
 }
 case 70:{ // Moon: cycles distinct phase actions on activation.
  const phase=o.v4MoonPhase=((o.v4MoonPhase||-1)+1)%4;
  if(phase===0){o.vx+=Math.cos(dir)*.27;o.vy+=Math.sin(dir)*.27;}
  if(phase===1)shoot(o,foe,{count:2,spread:.28,damage:o.baseDmg*.23,bounces:1,color:'#d6e5ff'});
  if(phase===2)o.status.shield=Math.min(32,(o.status.shield||0)+6);
  if(phase===3){foe.aiTarget={vx:-foe.vy,vy:foe.vx};foe.aiDecisionClock=.55;}
  visual(o,o,'ring',32,'#b6d7ff',.8);
  if(level>=1){shoot(o,foe,{count:1,damage:o.baseDmg*.17,ghost:true,color:'#cedfff'});}
  if(level===2){mark('slow',foe.x,foe.y,18,1.8,.19);o.status.shield=Math.min(32,(o.status.shield||0)+2);}
  signature.until=t+.6;signature.max=0;break;
 }
 case 71:{ // Eclipse: direction and weak status, plus an eclipsing shadow disk.
  setStatus(o,foe,'weaken',.9);visual(o,foe,'shadow',35,'#8c74ef',.65);
  if(level>=1)mark('slow',foe.x,foe.y,30,2.5,.23);
  if(level===2){foe.aiTarget={vx:-(foe.vy||0),vy:foe.vx||0};foe.aiDecisionClock=1.0;
   signature.next=.48;signature.max=2;}
  else{signature.until=t+.6;signature.max=0;}
  break;
 }
 case 72:{ // Nova: delayed telegraphed detonation from a location snapshot.
  mark('mine',foe.x,foe.y,25,2.8,.39);
  visual(o,foe,'clock',40,'#ffdf80',.7);
  signature.next=.72;signature.max=1+level;
  if(level>=1)mark('shard',foe.x-26,foe.y+14,19,2.5,.24);
  if(level===2)mark('mine',foe.x+31,foe.y-20,19,2.6,.25);
  break;
 }
 case 73:{ // Nebula: floating cloud has velocity and local stardust.
  const n=mark('gas',o.x+Math.cos(dir)*33,o.y+Math.sin(dir)*33,30,3,.28);
  if(n){n.vx=Math.cos(dir)*20;n.vy=Math.sin(dir)*20;n.v4Nebula=true;}
  signature.next=.57;signature.max=level>=1?2+level:0;
  if(level>=1)mark('slow',foe.x,foe.y,21,2,.21);
  if(level===2)mark('mine',foe.x+29,foe.y,15,2.3,.18);
  break;
 }
 case 74:{ // Pulsar: three beat sequence, alternating push/pull.
  radial(o,foe,.19,{radius:135,knock:.1});signature.next=.42;signature.max=2+level;
  if(level>=1)mark('shock',o.x,o.y,22,1.8,.18);
  if(level===2)mark('slow',foe.x,foe.y,20,1.5,.15);
  break;
 }
 case 75:{ // Quasar: jets launch in both opposing directions.
  const fwd=edge(o,foe,210),back={x:clamp(o.x-(fwd.x-o.x)),y:clamp(o.y-(fwd.y-o.y))};
  beam(o,fwd,'#6ee7ff');beam(o,back,'#cc9fff');
  shoot(o,foe,{damage:o.baseDmg*.32,speed:200,ghost:true,color:'#70ccff'});
  signature.next=.55;signature.max=1+level;
  if(level>=1)mark('shock',foe.x,foe.y,18,1.3,.2);
  if(level===2)mark('slow',o.x,o.y,19,1.3,.18);
  break;
 }
 case 76:{ // Comet: leaves an actual frozen track while accelerating.
  dash(o,foe,.32);mark('frost',o.x,o.y,21,2.1,.19);
  o.v4Comet={until:t+2.5,level,next:.25,origin:{x:o.x,y:o.y}};
  if(level>=1)mark('frost',o.x-24*Math.cos(dir),o.y-24*Math.sin(dir),17,2,.22);
  if(level===2)mark('thorn',foe.x,foe.y,17,2.3,.23);
  signature.until=t+.5;signature.max=0;
  break;
 }
 case 77:{ // Asteroid: rotating actual fragments, seeded by collision.
  o.v4Asteroids={until:t+3,level,next:.4,charges:2+level,angle:0};
  shoot(o,foe,{count:3,spread:.65,damage:o.baseDmg*.17,knock:.12,bounces:1,color:'#b0aaa2'});
  if(level>=1)mark('thorn',o.x,o.y,21,2.7,.17);
  if(level===2)mark('thorn',foe.x,foe.y,18,1.9,.19);
  signature.until=t+.5;signature.max=0;
  break;
 }
 case 78:{ // Quantum: superpositions attack from two actual locations.
  const original={x:o.x,y:o.y};const newPos=edge(foe,o,64);
  o.x=clamp(newPos.x,o.r,360-o.r);o.y=clamp(newPos.y,o.r,360-o.r);
  visual(o,original,'blink',36,'#88eaff',.7);
  shoot(o,foe,{damage:o.baseDmg*.19,ghost:true,color:'#9bf6ff'});
  signature.first=original;signature.next=.46;signature.max=1+level;
  if(level>=1)mark('shock',original.x,original.y,19,1.4,.2);
  if(level===2)mark('slow',foe.x,foe.y,19,1.8,.18);
  break;
 }
 case 79:{ // Atom: electron shells generate staged fission, not generic orbit.
  o.v4Atom={until:t+3.2,level,next:.38,charge:0};
  visual(o,o,'orbit',38,'#78ffd7',.65);
  shoot(o,foe,{count:2,spread:.78,damage:o.baseDmg*.16,bounces:1,color:'#70ffd7'});
  if(level>=1)mark('shock',o.x,o.y,17,2.3,.2);
  if(level===2)mark('shock',foe.x,foe.y,19,1.8,.19);
  signature.until=t+.6;signature.max=0;
  break;
 }
 }
 if(level)visual(o,o,'ring',level===2?44:33,o.b.c,.48);
 o.v4Casts=(o.v4Casts||0)+1;
}
function tick(g,dt,api){
 if(!g||g.ph!=='battle'||!Number.isFinite(dt)||dt<=0)return;
 const st=api.roundState();if(!st)return;
 const {shoot,zone,radial,strike,setStatus,visual}=api;
 for(const o of g.bl||[]){
  const id=o?.b?.id;if(id<64||id>79||!api.alive(o))continue;
  const foe=g.bl.find(p=>p.team!==o.team&&api.alive(p)),t=g.rt||0,level=api.evolutionStage(o);
  if(!foe)continue;
  const sig=o.v4Signature;
  if(sig&&sig.until>t&&sig.steps<sig.max){
   sig.next-=dt;
   if(sig.next<=0){
    sig.steps++;sig.next+=.49;
    switch(id){
    case 64:
     radial(o,foe,.16,{radius:160});
     zone(o,sig.last.x,sig.last.y,'echo',21+level*4,1.5,.17);
     if(level===2&&sig.steps===3)setStatus(o,foe,'stun',.13);
     break;
    case 65:{
     const d=dist(o,foe),power=.1+level*.025;
     foe.vx+=(o.x-foe.x)/d*power;foe.vy+=(o.y-foe.y)/d*power;
     if(level===2&&sig.steps===sig.max)radial(o,foe,.27,{radius:135,slow:.25});
     break;}
    case 71:setStatus(o,foe,'weaken',.45);if(level===2)zone(o,foe.x,foe.y,'slow',18,1,.15);break;
    case 72:zone(o,foe.x,foe.y,level?'shard':'fire',19,1.6,.23);break;
    case 73:zone(o,foe.x-12*sig.steps,foe.y+12,'gas',18,1.5,.18);break;
    case 74:{
     const d=dist(o,foe),sign=sig.steps%2?1:-1;
     foe.vx+=((foe.x-o.x)/d)*sign*.16;
     foe.vy+=((foe.y-o.y)/d)*sign*.16;
     radial(o,foe,.12,{radius:140});break;}
    case 75:
     shoot(o,foe,{damage:o.baseDmg*.17,ghost:true,bounces:level===2?2:0,color:'#8ae7ff'});
     if(level>=1)zone(o,foe.x,foe.y,'shock',16,1.3,.18);break;
    case 78:
     shoot(o,foe,{damage:o.baseDmg*.15,ghost:true,color:'#9bf6ff'});
     visual(o,sig.first,'blink',25,'#9bf6ff',.45);break;
    }
   }
  }
  if(o.v4Mirror?.until>t){
   const m=o.v4Mirror;
   for(const p of st.shots){
    if(p.life<=0||p.team===o.team||Math.hypot(p.x-o.x,p.y-o.y)>o.r+22)continue;
    // Reflected shots are not copied, so one projectile can reflect once per contact.
    p.team=o.team;p.owner=o.uid;p.vx=-(p.vx||0);p.vy=-(p.vy||0);
    p.color='#e4f9ff';p.id=67;p.reflected=true;m.reflected++;
    if(m.level===2&&m.reflected%2===0)shoot(o,foe,{damage:o.baseDmg*.12,ghost:true,color:'#e5f5ff'});
   }
  }
  if(o.v4Void?.until>t){
   const v=o.v4Void;
   for(const p of st.shots){
    if(p.life<=0||p.team===o.team||Math.hypot(p.x-o.x,p.y-o.y)>o.r+39)continue;
    p.life=0;v.absorbed=Math.min(8,v.absorbed+1);
   }
   if(v.level>=1&&t>=(v.next||0)){
    v.next=t+.42;const d=dist(o,foe);
    foe.vx+=(o.x-foe.x)/d*.11;foe.vy+=(o.y-foe.y)/d*.11;
   }
  }
  if(o.v4Sun?.until>t&&t>=o.v4Sun.next){
   const s=o.v4Sun;s.next=t+.42;s.pulses++;
   if(dist(o,foe)<118)radial(o,foe,.12,{radius:118,burn:.25});
   if(s.level>=1)zone(o,clamp(o.x+(s.pulses%2?31:-31)),o.y,'fire',19,1.2,.14);
   if(s.level===2&&s.pulses===4)radial(o,foe,.31,{radius:160,burn:.45});
  }
  if(o.v4Comet?.until>t&&t>=o.v4Comet.next){
   const c=o.v4Comet;c.next=t+.31;
   zone(o,o.x,o.y,'frost',c.level===2?22:16,1.6,.16);
   if(c.level===2&&t>c.until-.6){
    zone(o,c.origin.x,c.origin.y,'shard',23,1.3,.18);c.until=t;
   }
  }
  if(o.v4Asteroids?.until>t&&t>=o.v4Asteroids.next){
   const a=o.v4Asteroids;a.next=t+.48;a.angle+=1.28;
   for(let k=0;k<Math.min(3,a.charges);k++){
    const ph=a.angle+k*Math.PI*2/3;
    zone(o,clamp(o.x+Math.cos(ph)*30),clamp(o.y+Math.sin(ph)*30),'thorn',12,1.2,.16);
   }
  }
  if(o.v4Atom?.until>t&&t>=o.v4Atom.next){
   const a=o.v4Atom;a.next=t+.46;a.charge++;
   const ph=a.charge*1.2;
   zone(o,clamp(o.x+Math.cos(ph)*26),clamp(o.y+Math.sin(ph)*26),'shock',13,1.25,.15);
   if(a.level===2&&a.charge===5)radial(o,foe,.23,{radius:108,stun:.14});
  }
 }
}
function onWall(g,o,side,api){
 if(!g||!o||o.b.id<64||o.b.id>79)return;
 const id=o.b.id,level=api.evolutionStage(o),t=g.rt||0,st=api.roundState();
 if(id===66&&o.v4Anchor?.until>t){
  const a=o.v4Anchor;if(t-a.lastWall<.23)return;a.lastWall=t;
  const foe=g.bl.find(p=>p.team!==o.team&&api.alive(p));if(!foe)return;
  api.zone(o,o.x,o.y,'quake',27,1.5,.33);
  api.radial(o,foe,.2,{radius:105,knock:.18});
  if(level>=1)api.zone(o,foe.x,foe.y,'slow',18,1.7,.16);
  if(level===2)api.zone(o,foe.x+17,foe.y,'quake',24,1.9,.21);
  o.v4AnchorQuakes=(o.v4AnchorQuakes||0)+1;
 }
 if(id===76&&o.v4Comet?.until>t){
  api.zone(o,o.x,o.y,'frost',18,1.8,.22);
  if(level===2)api.zone(o,o.x,o.y,'shard',15,1.4,.19);
 }
 if(id===77&&o.v4Asteroids?.until>t){
  api.zone(o,o.x,o.y,'shard',17,1.5,.24);
 }
 if(id===75&&level===2&&o.v4Signature?.until>t&&st){
  st.wallBeams.push({a:{x:o.x,y:0},b:{x:360-o.x,y:360},owner:o.uid,
   team:o.team,color:'#8ae7ff',life:1.15,width:3,inside:{}});
  if(st.wallBeams.length>12)st.wallBeams.splice(0,st.wallBeams.length-12);
 }
}
function onContact(g,o,foe,base,api){
 if(!g||!o||!foe||o.b.id<64||o.b.id>79)return base;
 const t=g.rt||0,level=api.evolutionStage(o),id=o.b.id;
 if(id===66&&o.v4Anchor?.until>t){
  const len=dist(o,foe),k=.16+level*.08;
  foe.vx+=(foe.x-o.x)/len*k;foe.vy+=(foe.y-o.y)/len*k;
  o.vx*=.45;o.vy*=.45;
 }
 if(id===67&&o.v4Mirror?.until>t){api.strike(o,foe,o.baseDmg*.12,{slow:.15});}
 if(id===77&&o.v4Asteroids?.until>t){
  api.shoot(o,foe,{count:2+level,damage:o.baseDmg*.12,spread:.8,bounces:1});
 }
 if(id===79&&o.v4Atom?.until>t){
  const a=o.v4Atom;a.charge++;
  api.zone(o,foe.x,foe.y,'shock',16,1.1,.18);
  if(level===2&&a.charge>=5){api.radial(o,foe,.22,{radius:100});a.charge=0;}
 }
 return base;
}
function description(id,tier){
 if(id<64||id>79||tier<=1)return null;
 const p=texts[id-64],txt=tier===2?p[0]:p[0]+'; '+p[1];
 return 'V'+tier+': '+txt+'.';
}
window.BVBThirdSixteen=Object.freeze({first:64,last:79,names:Object.freeze(names),
 descriptions:Object.freeze(texts),onCast:cast,tick,onWall,onContact,description});
})();
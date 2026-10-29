/* Unique mechanical upgrades for the first sixteen named balls.
 * One action = an identity-specific consequence; V3 preserves V2 and adds
 * a distinct interaction. Host simulation only, no direct RNG or DOM.
 */
(()=>{
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const descriptions=Object.freeze([
 ['Skręt naładowanej szarży pozwala zachować pęd.','Po odbiciu od ściany szarża uwalnia drugi impet.'],
 ['Ciężki topór wraca po łuku do właściciela.','Topór wykonuje drugi, rozbijający powrót.'],
 ['Trujące ciernie rozrastają się między śladami na ścianach.','Ciernie rozgałęziają się, tworząc toksyczny korytarz.'],
 ['Odzyskany łup zasila sztylety wracające rykoszetem.','Widmowy sobowtór dezorientuje cel; sztylety przenikają przeszkody.'],
 ['Żywe ostrza zaciskają spiralę wokół wroga.','Zamknięta spirala uderza wroga dodatkowym impulsem.'],
 ['Kolejne serie karabinu precyzyjniej namierzają cel.','Przegrzanie uruchamia chłodzącą salwę zapalającą.'],
 ['Drganie sieci zamienia przeciętą nić w lepką pułapkę.','Przecięcia pajęczyn tworzą zaciskający kokon.'],
 ['Wampir odkłada odzyskane zdrowie do banku krwi.','Serce ciemności pulsuje i wysysa zdrowie także z dystansu.'],
 ['Włócznia zapamiętuje punkt przebicia przy ścianie.','Uderzenie przebicia uruchamia drugi cios po tej samej osi.'],
 ['Pierwsza fala odbija się od ściany.','Odbita detonacja wywołuje końcową reakcję łańcuchową.'],
 ['Po ruchu skoczka pojawia się wieża na sąsiedniej linii.','Wieżę uzupełnia ukośny atak królowej.'],
 ['Dobre rzuty kostki zapisują szczęśliwe oczko.','Sześć różnych oczek wyzwala matematyczną kombinację.'],
 ['Ściany porastają rosnące iglice lodu.','Iglice domykają kryształową kopułę wokół rywala.'],
 ['Ścienny emiter obraca wiązkę laserową.','Dwa emitery skanują rywala w przeciwnych kierunkach.'],
 ['Zrzucona skóra tworzy powłokę obronną.','Ogon przecina własny ślad, zawiązując wężowy węzeł.'],
 ['Hak prowadzi złapanego rywala po łuku.','Po zaczepieniu ściany właściciel wykonuje drugi zamach.']
]);
function stage(o,h){return h.evolutionStage(o);}
function foeFor(g,o,h){return g.bl?.find(b=>b.team!==o.team&&h.alive(b))||null;}
function onCast(g,o,foe,h){
 if(!g||!o||!foe||o.b?.id>=16)return;
 const id=o.b.id,lv=stage(o,h),t=g.rt||0,st=h.roundState();
 if(!st)return;
 switch(id){
 case 0:{
  // Direction change is physical; Fibonacci's value grows on impact instead.
  if(lv){const a=.11*lv*(o.y<=foe.y?1:-1),vx=o.vx,vy=o.vy;
   o.vx=vx*Math.cos(a)-vy*Math.sin(a);o.vy=vx*Math.sin(a)+vy*Math.cos(a);}
  o.bvbRushWindow=lv?t+1.7:0;break;
 }
 case 1:
  if(o.axeOrbit)o.axeOrbit.angle=t*.5;
  if(lv)o.bvbAxeReturn={next:t+.65,remaining:lv===2?2:1,lv};
  break;
 case 2:
  if(lv)o.bvbBriarUntil=t+4;break;
 case 3:{
  // No copied gun volley: these blades steal health and can return.
  const knives=st.shots.filter(p=>p.owner===o.uid&&p.id===3&&p.age===0);
  for(const p of knives){p.healOnHit=lv?3.5:1.3;
   if(lv)p.bounces=lv;if(lv===2){p.ghost=true;p.poison=.3;}}
  if(lv===2){foe.aiTarget={vx:-(foe.vy||0),vy:foe.vx||0};
   foe.aiDecisionClock=Math.max(foe.aiDecisionClock||0,.55);}
  o.bvbStolenKnives=knives.length;break;
 }
 case 4:
  if(lv)o.bvbSpiral={next:t+.39,remaining:lv===2?3:2,lv};
  break;
 case 5:{
  // Salvo recoil and temperature replace a repeated arc-knife mechanic.
  o.bvbRifleHeat=Math.min(6,(o.bvbRifleHeat||0)+1);
  for(const p of st.shots.filter(p=>p.owner===o.uid&&p.id===5&&p.age===0)){
   p.homing=lv?Math.min(1.1,.16+o.bvbRifleHeat*.16):0;
   if(lv===2&&o.bvbRifleHeat>=3){p.burn=.45;p.knock=.1;}
  }
  if(lv===2&&o.bvbRifleHeat>=5){
   o.bvbRifleHeat=0;o.status.shield=Math.min(32,(o.status.shield||0)+3);
   h.visual(o,o,'fire',34,'#fbbf24',.65);
  }
  break;
 }
 case 6:
  if(lv)o.bvbSpiderWebStage=lv;
  break;
 case 7:
  if(lv){
   o.bvbBloodBank=Math.min(14,(o.bvbBloodBank||0)+3+lv);
   if(lv===2&&Math.hypot(foe.x-o.x,foe.y-o.y)<195)
    o.bvbBloodLink={next:t+.46,remaining:3};
  }
  break;
 case 8:
  if(lv)o.bvbSpearFollow={until:t+2,lv};
  break;
 case 9:
  if(lv)o.bvbBurstEcho={until:t+1.45,lv,used:false};
  break;
 case 10:
  if(lv){
   h.zone(o,clamp(foe.x+35,15,345),foe.y,'shock',18,2,.3);
   if(lv===2)h.zone(o,clamp(foe.x-33,15,345),clamp(foe.y+33,15,345),'grid',21,2,.3);
   o.bvbChessCombo=lv===2?'knight-rook-queen':'knight-rook';
  }
  break;
 case 11:{
  if(!lv)break;
  const roll=o.v2LastRoll;
  o.bvbDiceSeen ||= [];
  if(!o.bvbDiceSeen.includes(roll))o.bvbDiceSeen.push(roll);
  if(roll===6)o.status.shield=Math.min(32,(o.status.shield||0)+2+lv);
  if(lv===2&&o.bvbDiceSeen.length===6){
   h.radial(o,foe,.5,{radius:130,stun:.21});
   o.bvbDiceSeen=[];o.bvbDiceJackpots=(o.bvbDiceJackpots||0)+1;
  }
  break;
 }
 case 12:
  if(lv)o.bvbIceGrowth=t+3.3;break;
 case 13:
  if(lv)o.bvbLaserScan={next:t+.45,remaining:lv===2?4:2,lv};break;
 case 14:
  if(lv){o.bvbShedReady=true;
   if(lv===2)o.bvbSnakeKnot={next:t+.65,remaining:3};}
  break;
 case 15:
  if(lv){
   const dx=foe.x-o.x,dy=foe.y-o.y,d=Math.hypot(dx,dy)||1;
   foe.vx=(foe.vx||0)-dy/d*.15*lv;foe.vy=(foe.vy||0)+dx/d*.15*lv;
   o.bvbHookSwing={until:t+1.5,lv};
  }break;
 }
}
function onWall(g,o,side,h){
 const lv=stage(o,h),id=o.b.id,t=g.rt||0,st=h.roundState();
 if(!lv||!st)return;
 switch(id){
 case 0:
  if(lv===2&&o.bvbRushWindow>t){
   const f=foeFor(g,o,h);if(f){h.dash(o,f,.2);h.radial(o,f,.24,{radius:72,knock:.14});}
   o.bvbRushWindow=0;o.bvbRicochets=(o.bvbRicochets||0)+1;
  }break;
 case 2:{
  const old=o.bvbBriarLast;
  if(old&&old.side!==side&&o.bvbBriarUntil>t){
   const x=(old.x+o.x)/2,y=(old.y+o.y)/2;
   h.zone(o,x,y,'thorn',lv===2?26:19,3.1,.34);
   if(lv===2)for(const f of [-.24,.24])
    h.zone(o,clamp(x+(o.x-old.x)*f,17,343),
      clamp(y+(o.y-old.y)*f,17,343),'thorn',18,3,.31);
   o.bvbBriarBranches=(o.bvbBriarBranches||0)+1;
  }
  o.bvbBriarLast={side,x:o.x,y:o.y};
  break;
 }
 case 6:{
  const webs=st.webs.filter(w=>w.owner===o.uid);
  if(webs.length){
   const web=webs[webs.length-1];
   h.zone(o,(web.a.x+web.b.x)/2,(web.a.y+web.b.y)/2,'slow',lv===2?27:19,2,.3);
   o.bvbSilkVibrations=(o.bvbSilkVibrations||0)+1;
   if(lv===2&&webs.length>=2){
    const last=webs.slice(-2),x=last.reduce((v,w)=>v+(w.a.x+w.b.x)/4,0),
      y=last.reduce((v,w)=>v+(w.a.y+w.b.y)/4,0);
    h.zone(o,x,y,'slow',24,1.5,.4);
    o.bvbCocoons=(o.bvbCocoons||0)+1;
   }
  }break;
 }
 case 8:o.bvbSpearAnchor={x:o.x,y:o.y,side,until:t+2};break;
 case 9:
  if(o.bvbBurstEcho?.until>t&&!o.bvbBurstEcho.used){
   const f=foeFor(g,o,h);
   if(f)h.radial(o,f,.2,{radius:lv===2?112:85,knock:.14});
   o.bvbBurstEcho.used=true;
   o.bvbReflectedWaves=(o.bvbReflectedWaves||0)+1;
   if(lv===2&&f&&Math.hypot(f.x-o.x,f.y-o.y)<125)
    h.zone(o,f.x,f.y,'fire',21,1.3,.29);
  }break;
 case 12:
  if(o.bvbIceGrowth>t){
   for(const off of (lv===2?[-24,0,24]:[0])){
    const x=side==='left'||side==='right'?o.x:clamp(o.x+off,16,344),
      y=side==='left'||side==='right'?clamp(o.y+off,16,344):o.y;
    h.zone(o,x,y,'frost',17,3,.36);
   }
   o.bvbIcicles=(o.bvbIcicles||0)+(lv===2?3:1);
  }break;
 case 14:
  if(o.bvbShedReady){
   o.status.shield=Math.min(32,(o.status.shield||0)+4+lv*2);
   o.bvbShedReady=false;o.bvbShedding=(o.bvbShedding||0)+1;
   h.visual(o,o,'shield',26,'#b9f990',.6);
  }break;
 case 15:
  if(lv===2&&o.bvbHookSwing?.until>t){
   const f=foeFor(g,o,h);if(f){
    const dx=f.x-o.x,dy=f.y-o.y,d=Math.hypot(dx,dy)||1;
    o.vx=-dy/d*.9;o.vy=dx/d*.9;
   }
   o.bvbHookWall=(o.bvbHookWall||0)+1;
   o.bvbHookSwing.until=0;
  }break;
 }
}
function onContact(g,o,foe,base,h){
 const lv=stage(o,h),t=g.rt||0;
 if(!lv)return base;
 if(o.b.id===0&&o.bvbRushWindow>t){
  o.bvbRushWindow=0;return base+o.baseDmg*.13*lv;
 }
 if(o.b.id===8&&lv===2&&o.bvbSpearFollow?.until>t){
  h.shoot(o,foe,{damage:o.baseDmg*.22,ghost:true,bounces:1,knock:.13});
  o.bvbSpearFollow.until=0;
  o.bvbSecondThrusts=(o.bvbSecondThrusts||0)+1;
 }
 return base;
}
function tick(g,o,dt,h){
 const lv=stage(o,h),t=g.rt||0,st=h.roundState();
 if(!lv||!st)return;
 const foe=foeFor(g,o,h);if(!foe)return;
 if(o.b.id===1&&o.bvbAxeReturn&&t>=o.bvbAxeReturn.next){
  const r=o.bvbAxeReturn;
  h.shoot(o,foe,{damage:o.baseDmg*.24,bounces:r.lv===2?2:1,
   knock:.11,speed:165,color:'#ffb76d'});
  r.remaining--;r.next=t+.55;
  if(r.remaining<=0)o.bvbAxeReturn=null;
 }
 if(o.b.id===4&&o.bvbSpiral&&t>=o.bvbSpiral.next){
  const sp=o.bvbSpiral;
  if(Math.hypot(foe.x-o.x,foe.y-o.y)<110+lv*15){
   h.radial(o,foe,.13,{radius:110+lv*15,slow:.2});
   if(lv===2&&sp.remaining===1)h.setStatus(o,foe,'stun',.2);
  }
  sp.remaining--;sp.next=t+.5;if(sp.remaining<=0)o.bvbSpiral=null;
 }
 if(o.b.id===7){
  if(o.bvbBloodBank>0&&o.hp/o.mh<.4){
   o.status.shield=Math.min(32,(o.status.shield||0)+o.bvbBloodBank);
   o.bvbBloodBank=0;
  }
  if(lv===2&&o.bvbBloodLink&&t>=o.bvbBloodLink.next){
   if(Math.hypot(foe.x-o.x,foe.y-o.y)<195){
    h.strike(o,foe,o.baseDmg*.1,{slow:.18});
    o.hp=Math.min(o.mh,o.hp+2.1);
   }
   o.bvbBloodLink.remaining--;o.bvbBloodLink.next=t+.48;
   if(o.bvbBloodLink.remaining<=0)o.bvbBloodLink=null;
  }
 }
 if(o.b.id===13&&o.bvbLaserScan&&t>=o.bvbLaserScan.next){
  const scan=o.bvbLaserScan,a=t*.75+(scan.remaining%2)*.35;
  st.beams.push({x:o.x,y:o.y,
   x2:clamp(o.x+Math.cos(a)*150,0,360),
   y2:clamp(o.y+Math.sin(a)*150,0,360),
   id:13,color:'#ff92bd',life:.28,max:.28});
  if(Math.hypot(foe.x-o.x,foe.y-o.y)<100+lv*25)
   h.strike(o,foe,o.baseDmg*.07,{slow:.13});
  scan.remaining--;scan.next=t+.4;
  if(scan.remaining<=0)o.bvbLaserScan=null;
 }
 if(o.b.id===14&&lv===2&&o.bvbSnakeKnot&&t>=o.bvbSnakeKnot.next){
  const points=(o.trail||[]).slice(-18);
  if(points.length>=5){
   const a=points[0],b=points[points.length-1];
   if(Math.hypot(a.x-b.x,a.y-b.y)<42){
    h.zone(o,clamp((a.x+b.x)/2,15,345),clamp((a.y+b.y)/2,15,345),'slow',24,1.8,.32);
    o.bvbKnots=(o.bvbKnots||0)+1;
   }
  }
  o.bvbSnakeKnot.remaining--;o.bvbSnakeKnot.next=t+.63;
  if(o.bvbSnakeKnot.remaining<=0)o.bvbSnakeKnot=null;
 }
}
window.BVBFirstSixteen={descriptions,description:(id,stage)=>{
 const row=descriptions[id];return row&&stage>0?'V'+(stage+1)+': '+row[stage-1]:null;
},onCast,onWall,onContact,tick};
})();
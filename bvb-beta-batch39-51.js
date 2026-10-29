/* Ball VS Ball — beta-only ID 39–51 rework, 2026-10-29.
   Does not ship through the stable index. Uses seeded host simulation RNG. */
(function(){
'use strict';
const FIRST=39,LAST=51;
const names=['Kajdany','Kwas','Promień Świetlny','Trujący Gaz','Shuriken','Fibonacci','Kaktus','Bomba','Orbita','Medyk','Prawda','Szkło','Portal'];
const colors=['#b783ff','#a3e635','#fde047','#75f051','#65b9ff','#ffad2e','#86ed39','#ff7150','#a476ff','#55e9ff','#e8b7ff','#8bdfff','#a58aff'];
const fib=[1,1,2,3,5,8,13,21,34,55];
const descriptions={
39:['Dwa stalowe łańcuchy chwytają kulkę, unieruchamiają ją i zaciskając się zadają obrażenia.','Łańcuchy przewodzą impulsy elektryczne; schwytana kulka otrzymuje obrażenia okresowe.','Klatka z dodatkowych łańcuchów zaciska się i kończy falą odrzutu.'],
40:['Kwaśna kałuża pod przeciwnikiem osłabia jego pancerz.','Kwas rozlewa się w kolejnych kierunkach i dłużej osłabia rywala.','Dodatkowe żrące strugi podążają za przemieszczającym się celem.'],
41:['Promień odbija się od ścian i uderza przeciwnika.','Przy odbiciu promień dzieli się na dwie świetlne wiązki.','Krzyżujące się wiązki tworzą dodatkowy impuls.'],
42:['Trująca chmura tworzy toksyczną strefę.','Chmura dryfuje i pozostawia mniejsze obłoki.','Gaz skrapla się w kolejne szkodliwe strefy.'],
43:['Wyrzuca trzy rykoszetujące shurikeny.','Część gwiazdek wraca i atakuje kolejny raz.','Odbijające się gwiazdki uwalniają małe odłamki.'],
44:['Kolejne uderzenia zadają 1, 1, 2, 3, 5, 8, 13… obrażeń. Każde ma 25% szansy na ×2.','Cała mechanika V1 + wirująca spirala przyciągająca i raniąca przeciwnika. Szansa ×2 pozostaje.','Cała mechanika V2 + finałowa eksplozja po trafieniu za 13 (lub ×2 = 26), z odrzutem i resetem licznika. Szansa ×2 pozostaje.'],
45:['Kolce oddają 40% otrzymanych obrażeń.','Przy odbiciu pojawiają się dodatkowe wystrzeliwane igły.','Odłamane igły tworzą krótkotrwałe niebezpieczne pułapki.'],
46:['Bomba wybucha po krótkim odliczaniu.','Pierwszy wybuch uruchamia drugi, opóźniony ładunek.','Po głównym wybuchu trzy małe bomby eksplodują kolejno.'],
47:['Trzy satelity krążą i trafiają rywala.','Satelity tworzą wiązki laserowe.','Satelity mogą przechwycić pocisk i wykonać kontratak.'],
48:['Co kilka sekund leczy się i odzyskuje osłonę.','Stawia stację regenerującą zdrowie przez krótki czas.','Drony dodatkowo odnawiają tarczę podczas działania stacji.'],
49:['Lustrzana tarcza przez 5 sekund odbija 100% przychodzących obrażeń.','Odbicie wysyła dodatkowy impuls w atakującego.','Odbity impuls rozchodzi się także wachlarzem, zwiększając zasięg kontrataku.'],
50:['Szklana armata: tylko 65 HP, za to 250% podstawowych obrażeń.','Każde mocne trafienie rozrzuca niebezpieczne szklane odłamki.','Odłamki wracają, tworząc krótką osłonę. Kulka pozostaje krucha: 65 HP.'],
51:['Odbicie od ściany otwiera portal, który przenosi kulkę na drugą stronę areny.','Drugi portal wywołuje powracający impuls.','Łańcuch teleportacji kończy się uderzeniem przestrzennym.']
};
const rand=()=>window.BVBRework?.random?.(G)??Math.random();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const tier=o=>clamp(Math.floor(Number(o?.tier)||1),1,3);
const foeOf=o=>G?.bl?.find(f=>f!==o&&f.team!==o.team&&f.hp>0);
const phase=()=>G&&G.ph==='battle'&&typeof netRole!=='undefined'&&netRole!=='guest';
function announce(o,label,color='#fbbf24'){
 if(!G||!o)return;
 G.pop||=[];if(G.pop.length>26)G.pop.shift();
 G.pop.push({x:o.x,y:Math.max(23,o.y-o.r-24),text:label,c:color,age:0,life:.9});
}
function wave(o,radius,color){if(!G)return;G.rings||=[];G.rings.push({x:o.x,y:o.y,radius,age:0,life:.64,c:color});if(G.rings.length>30)G.rings.shift();}
function hurt(source,target,points){if(!target||!(target.hp>0)||!(points>0))return;applyDamage(target,points);}
function push(source,target,power){if(!target||!source)return;const dx=target.x-source.x,dy=target.y-source.y,d=Math.hypot(dx,dy)||1;target.vx=clamp((target.vx||0)+dx/d*power,-1.5,1.5);target.vy=clamp((target.vy||0)+dy/d*power,-1.5,1.5);}
function pulse(source,point,radius,damage,color){
 const target=foeOf(source);if(!target)return;
 G.rings||=[];G.rings.push({x:point.x,y:point.y,radius,age:0,life:.48,c:color});
 if(Math.hypot(target.x-point.x,target.y-point.y)<radius)hurt(source,target,damage);
}
// Keep the collection and ability preview consistent with the mechanics tested here.
for(let id=FIRST;id<=LAST;id++){
 const data=window.BVB2?.abilities?.[id];
 if(B[id]){B[id].d=descriptions[id][0];B[id].skillTitle=names[id-FIRST];}
 if(data){data.title=names[id-FIRST];data.desc=descriptions[id][0];}
}
if(window.BVB2?.abilities?.[49])window.BVB2.abilities[49].kind='reflect';
const previousStats=getBallStats;
getBallStats=function(id,...args){
 const st=previousStats(id,...args);
 if(id===50){st.hp=65;st.dmg=Math.max(1,Math.round(st.dmg*2.5));}
 if(id>=FIRST&&id<=LAST){st.evolutionDesc='V'+st.tier+': '+descriptions[id][clamp(st.tier-1,0,2)];st.activeDesc=names[id-FIRST]+': '+st.evolutionDesc;}
 return st;
};
const oldContact=window.BVB2.onContact;
window.BVB2.onContact=function(g,o,target,base){
 if(!o||!target||o.b?.id!==44)return oldContact(g,o,target,base);
 // Preserve any native side effects, but discard its old small bonus: the
 // actual Fibonacci number replaces damage rather than becoming a cosmetic label.
 oldContact(g,o,target,base);
 const index=clamp(o.b39FibIndex||0,0,fib.length-1),natural=fib[index];
 const critical=rand()<.25,damage=natural*(critical?2:1);
 o.b39FibIndex=Math.min(fib.length-1,index+1);
 announce(o,String(damage)+(critical?'  ×2!':''),'#ffd16e');
 if(tier(o)===3&&natural>=13){
   const radius=104;
   pulse(o,target,radius,9,'#ffc64b');push(o,target,.26);
   wave(o,radius,'#ffd566');announce(o,'ZŁOTA EKSPLOZJA!','#ffcc55');
   o.b39FibIndex=0;o.b39FinaleUntil=g.rt+.7;
 }
 return damage;
};
const oldApplyDamage=applyDamage;
let processingReflection=false;
applyDamage=function(target,amount){
 if(!(amount>0)||!Number.isFinite(amount))return oldApplyDamage(target,amount);
 const enemy=foeOf(target),id=target?.b?.id,now=G?.rt||0;
 if(!processingReflection&&id===49&&target.b39MirrorUntil>now&&enemy&&enemy.hp>0){
   processingReflection=true;
   try {
     oldApplyDamage(enemy,amount); // 100% return; do not hurt the shield owner.
     if(tier(target)>=2&&now>=(target.b39MirrorNext||0)){
       target.b39MirrorNext=now+.45;
       oldApplyDamage(enemy,tier(target)===3?4:2);
       if(tier(target)===3)push(target,enemy,.12);
     }
   } finally {processingReflection=false;}
   wave(target,37,'#f5c8ff');announce(target,'ODBICIE 100%','#f5ceff');
   return;
 }
 if(!processingReflection&&id===45&&enemy?.hp>0){
   processingReflection=true;
   try{oldApplyDamage(enemy,amount*.4);}finally{processingReflection=false;}
   if(tier(target)>=2&&now>=(target.b39ThornNext||0)){
     target.b39ThornNext=now+.5;
     oldApplyDamage(enemy,tier(target)===3?3:1.5);
     wave(target,31,'#b9ff52');
   }
 }
 return oldApplyDamage(target,amount);
};
const oldSpecial=specialAbility;
specialAbility=function(o,foe){
 if(!o||!foe||o.b.id<FIRST||o.b.id>LAST)return oldSpecial(o,foe);
 const id=o.b.id,lv=tier(o),now=G?.rt||0;
 if(id===39){
   const seconds=lv===3?2.3:lv===2?1.85:1.35;
   o.b39Chains={target:foe.uid,x:foe.x,y:foe.y,ends:now+seconds,next:now+.4,level:lv};
   foe.status.stun=Math.max(foe.status.stun||0,.35);
   announce(o,lv===3?'KLATKA ŁAŃCUCHÓW':lv===2?'ELEKTRYCZNE KAJDANY':'KAJDANY','#d4a9ff');
   wave(foe,26,'#b67dff');
   return;
 }
 if(id===49){
   o.b39MirrorUntil=now+5;
   o.b39MirrorNext=now;
   announce(o,'TARCZA PRAWDY','#f5c8ff');wave(o,39,'#e9c3ff');return;
 }
 if(id===51){return;} // Portal triggers on a REAL wall bounce, not an arbitrary timer.
 oldSpecial(o,foe); // Retain V1 and already authored 39–47 mechanics.
 if(id===40&&lv>=2){foe.status.weaken=Math.max(foe.status.weaken||0,lv===3?3:2);o.b39Acid={ends:now+2.4,next:now+.4,level:lv};}
 if(id===41&&lv>=2){hurt(o,foe,lv===3?4:2);wave(foe,57,'#fff4a3');}
 if(id===42&&lv>=2){o.b39Gas={ends:now+2.5,next:now+.5,level:lv};}
 if(id===43&&lv>=2){o.b39Stars={ends:now+2.2,next:now+.6,level:lv};}
 if(id===44&&lv>=2){o.b39Spiral={ends:now+3,next:now+.4,level:lv};wave(o,61,'#ffa42e');}
 if(id===46&&lv>=2){o.b39Bombs={next:now+1.5,remaining:lv===3?3:1,level:lv};}
 if(id===47&&lv===3){o.b39Satellite={ends:now+3,next:now+.6};}
 if(id===48&&lv>=2){o.b39Station={x:o.x,y:o.y,ends:now+4,next:now+.7,level:lv};}
 if(id===50&&lv>=2){o.b39Glass={ends:now+1.8,next:now+.4,level:lv};}
};
const oldStep=step;
step=function(dt){
 const active=phase(),before=active?(G.bl||[]).map(o=>({o,x:o.x,y:o.y,vx:o.vx,vy:o.vy})):[];
 oldStep(dt);
 if(!active||!phase()||!(dt>0&&dt<.25))return;
 const now=G.rt;
 for(const o of G.bl||[]){
   if(o.hp<=0)continue;const lv=tier(o),id=o.b?.id,foe=foeOf(o);if(!foe)continue;
   if(id===39&&o.b39Chains){
     const q=o.b39Chains;
     if(now<q.ends&&foe.uid===q.target&&foe.hp>0){
       foe.x=clamp(q.x,foe.r,360-foe.r);foe.y=clamp(q.y,foe.r,360-foe.r);
       foe.vx=0;foe.vy=0;foe.status.slow=Math.max(foe.status.slow||0,.25);
       if(now>=q.next){hurt(o,foe,q.level===1?2:q.level===2?3:4);if(q.level>=2)announce(foe,'⚡','#d6a0ff');q.next+=.4;}
     }else{
       if(q.level===3&&foe.hp>0){hurt(o,foe,8);push(o,foe,.34);wave(foe,64,'#d7a4ff');}
       o.b39Chains=null;
     }
   }
   if(id===44&&o.b39Spiral){
     const q=o.b39Spiral;if(now>=q.ends)o.b39Spiral=null;
     else if(now>=q.next){
       const dx=o.x-foe.x,dy=o.y-foe.y,d=Math.hypot(dx,dy)||1;
       if(d<110){foe.vx=clamp(foe.vx+dx/d*.07,-1.4,1.4);foe.vy=clamp(foe.vy+dy/d*.07,-1.4,1.4);hurt(o,foe,1.5);}
       wave(o,Math.min(90,35+(q.ends-now)*17),'#ffba46');q.next+=.42;
     }
   }
   const periodic=[
     ['b39Acid',2.3],['b39Gas',1.7],['b39Stars',2.0],['b39Glass',2.2]
   ];
   for(const [key,baseDamage] of periodic){
     const q=o[key];if(!q)continue;
     if(now>=q.ends){o[key]=null;continue;}
     if(now>=q.next){
       hurt(o,foe,baseDamage);q.next+=key==='b39Acid'?.43:.6;
       if(key==='b39Acid')foe.status.weaken=Math.max(foe.status.weaken||0,.7);
       if(key==='b39Gas')foe.status.poison=Math.max(foe.status.poison||0,.6);
       if(key==='b39Glass'&&q.level===3)o.status.shield=Math.min(12,(o.status.shield||0)+1);
       wave(foe,26,colors[id-FIRST]);
     }
   }
   if(id===46&&o.b39Bombs&&now>=o.b39Bombs.next){
     const q=o.b39Bombs;hurt(o,foe,q.level===3?4:6);wave(foe,42,'#ff8c60');
     q.remaining--;q.next+=.42;if(q.remaining<=0)o.b39Bombs=null;
   }
   if(id===47&&lv===3){
     // Intercept actual enemy projectiles, not a decorative shield flash.
     const shots=G.v2?.shots||[];
     if(now>=(o.b39InterceptAt||0))for(let k=shots.length-1;k>=0;k--){
       const p=shots[k];if(p.team===o.team||Math.hypot(p.x-o.x,p.y-o.y)>o.r+27)continue;
       shots.splice(k,1);o.b39InterceptAt=now+.65;
       o.status.shield=Math.min(25,(o.status.shield||0)+2);
       announce(o,'PRZECHWYT!','#d4b5ff');wave(o,44,'#ab94ff');
       if(foe.hp>0)hurt(o,foe,1.5);
       break;
     }
   }
   if(id===47&&o.b39Satellite){
     const q=o.b39Satellite;
     if(now>=q.ends)o.b39Satellite=null;
     else if(now>=q.next){hurt(o,foe,2);o.status.shield=Math.min(12,(o.status.shield||0)+1.2);q.next+=.6;wave(o,37,'#a58aff');}
   }
   if(id===48&&o.b39Station){
     const q=o.b39Station;
     if(now>=q.ends)o.b39Station=null;
     else if(now>=q.next){
       if(Math.hypot(o.x-q.x,o.y-q.y)<120){
         o.hp=Math.min(o.mh,o.hp+2.5);
         if(q.level===3)o.status.shield=Math.min(24,(o.status.shield||0)+2);
       }
       q.next+=.7;wave({x:q.x,y:q.y},35,'#55e9ff');
     }
   }
   if(id===51&&now>=(o.b39PortalCooldown||0)){
     const snap=before.find(p=>p.o===o);
     const near=o.x<=o.r+.8||o.x>=360-o.r-.8||o.y<=o.r+.8||o.y>=360-o.r-.8;
     const bounce=snap&&((snap.vx*o.vx<0)||(snap.vy*o.vy<0));
     if(near&&bounce){
       const px=o.x,py=o.y;
       if(o.x<=o.r+.8)o.x=360-o.r-2;
       else if(o.x>=360-o.r-.8)o.x=o.r+2;
       else if(o.y<=o.r+.8)o.y=360-o.r-2;
       else o.y=o.r+2;
       o.b39PortalCooldown=now+(lv===1?3.7:lv===2?3.1:2.6);
       o.b39PortalFx={x:px,y:py,ends:now+.75};
       pulse(o,o,42,lv===3?6:lv===2?4:2,'#b99bff');
       if(lv===3)push(o,foe,.2);
       announce(o,'PORTAL V'+lv,'#c8b2ff');
     }
   }
 }
};
function drawEffects(){
 if(!G||!cx)return;
 const t=G.rt||0;cx.save();
 for(const o of G.bl||[]){
   if(!o||!(o.hp>0)||o.b.id<FIRST||o.b.id>LAST)continue;
   const id=o.b.id,lv=tier(o),color=colors[id-FIRST],spin=t*(id%2?-1:1)*1.6;
   cx.save();cx.translate(o.x,o.y);cx.rotate(spin);
   cx.strokeStyle=color;cx.shadowColor=color;cx.shadowBlur=lv===3?22:lv===2?15:9;
   cx.lineWidth=lv===3?2.7:1.8;cx.globalAlpha=.75;
   for(let j=0;j<lv;j++){
     cx.rotate(Math.PI*2/lv);cx.beginPath();cx.ellipse(0,0,o.r+6+j*4,o.r+4+j*4,.37,0,Math.PI*2);cx.stroke();
   }
   if(id===39){
     cx.setLineDash([3,2]);cx.lineWidth=2.5;
     for(let j=0;j<lv+1;j++){const a=j*Math.PI*2/(lv+1);cx.beginPath();cx.moveTo(Math.cos(a)*14,Math.sin(a)*14);cx.lineTo(Math.cos(a)*30,Math.sin(a)*30);cx.stroke();}
     cx.setLineDash([]);
   }else if(id===44){
     cx.beginPath();for(let i=0;i<=52;i++){const u=i/52,a=u*Math.PI*(lv+2)*2,r=2+u*(o.r+13+lv*5);const x=Math.cos(a)*r,y=Math.sin(a)*r;i?cx.lineTo(x,y):cx.moveTo(x,y);}cx.stroke();
   }else if(id===47){
     for(let j=0;j<3;j++){const a=t*2.4+j*Math.PI*2/3,cx0=Math.cos(a)*(o.r+13),cy0=Math.sin(a)*(o.r+13);cx.fillStyle='#c9b6ff';cx.beginPath();cx.arc(cx0,cy0,3.8,0,Math.PI*2);cx.fill();}
   }else if(id===45){for(let j=0;j<9+lv*3;j++){const a=j*Math.PI*2/(9+lv*3);cx.beginPath();cx.moveTo(Math.cos(a)*16,Math.sin(a)*16);cx.lineTo(Math.cos(a)*(23+lv*3),Math.sin(a)*(23+lv*3));cx.stroke();}}
   else if(id===48){cx.rotate(-spin);cx.lineWidth=3;cx.beginPath();cx.moveTo(-5,0);cx.lineTo(5,0);cx.moveTo(0,-5);cx.lineTo(0,5);cx.stroke();}
   else if(id===50){cx.beginPath();cx.moveTo(-12,5);cx.lineTo(-2,-9);cx.lineTo(9,-5);cx.lineTo(13,9);cx.lineTo(-12,5);cx.stroke();}
   else if(id===51){cx.lineWidth=3;cx.beginPath();cx.arc(0,0,o.r+10+lv*3,Math.PI*.15,Math.PI*1.85);cx.stroke();}
   cx.restore();
   if(id===39&&o.b39Chains){
     const q=o.b39Chains,target=G.bl?.find(b=>b.uid===q.target);if(target&&q.ends>t){
       cx.save();cx.strokeStyle='#d7a8ff';cx.shadowColor='#a570ff';cx.shadowBlur=11;cx.lineWidth=2+lv;
       cx.setLineDash([5,3]);cx.beginPath();cx.moveTo(o.x,o.y);cx.lineTo(target.x,target.y);cx.stroke();cx.setLineDash([]);
       cx.strokeStyle='#ffe3ff';cx.beginPath();cx.arc(target.x,target.y,target.r+7,0,Math.PI*2);cx.stroke();cx.restore();
     }
   }
   if(id===44&&o.b39Spiral){cx.save();cx.strokeStyle='#fbbf24';cx.shadowColor='#ff8d1b';cx.shadowBlur=18;cx.lineWidth=3;cx.beginPath();cx.arc(o.x,o.y,49+Math.sin(t*7)*8,0,Math.PI*2);cx.stroke();cx.restore();}
   if(id===49&&o.b39MirrorUntil>t){cx.save();cx.strokeStyle='#e9c5ff';cx.shadowColor='#e9c5ff';cx.shadowBlur=19;cx.lineWidth=4;cx.beginPath();cx.arc(o.x,o.y,o.r+12,0,Math.PI*2);cx.stroke();cx.restore();}
 }
 cx.restore();
}
const oldDraw=draw;draw=function(){oldDraw();drawEffects();};
const originalDetail=openBallDetail;
openBallDetail=function(id){
 originalDetail(id);
 if(id<FIRST||id>LAST)return;
 const box=document.createElement('section');box.className='cd';
 box.style.cssText='margin:12px 0;padding:12px;text-align:left;font:15px/1.55 system-ui;color:#ecf8ff;overflow-wrap:anywhere';
 const title=document.createElement('h3');title.textContent='#'+id+' '+names[id-FIRST]+' — umiejętności V1/V2/V3';title.style.cssText='font-size:17px;color:#fef3c7;margin-bottom:8px';
 box.appendChild(title);
 for(let lv=1;lv<=3;lv++){const p=document.createElement('p');p.style.cssText='margin:8px 0';p.textContent='V'+lv+' — '+descriptions[id][lv-1];box.appendChild(p);}
 document.querySelector('#ovb')?.appendChild(box);
};
const box=document.createElement('aside');box.id='bvb-beta-3951';
box.style.cssText='position:fixed;right:10px;bottom:10px;z-index:99999;max-width:calc(100vw - 20px);font:14px system-ui;color:white';
const btn=document.createElement('button');btn.textContent='🧪 BETA · 39–51';btn.style.cssText='background:#4c288e;color:#fff;border:2px solid #c29cff;border-radius:12px;padding:10px 14px;font:700 14px system-ui;box-shadow:0 4px 12px #0008;cursor:pointer';
const panel=document.createElement('div');panel.hidden=true;panel.style.cssText='background:#16152d;border:1px solid #ad8bfc;border-radius:12px;padding:12px;margin-bottom:6px;max-width:370px;box-shadow:0 10px 25px #000a';
const h=document.createElement('strong');h.textContent='13 kulek · 39 wersji · test z botem';panel.appendChild(h);
const select=document.createElement('select'),version=document.createElement('select');
for(let i=FIRST;i<=LAST;i++){const option=document.createElement('option');option.value=i;option.textContent='#'+i+' · '+names[i-FIRST];select.appendChild(option);}
for(let v=1;v<=3;v++){const option=document.createElement('option');option.value=v;option.textContent='V'+v;version.appendChild(option);}
for(const element of [select,version]){element.style.cssText='margin:8px 5px 3px 0;padding:9px;background:#302452;color:white;border:1px solid #9d80e9;border-radius:8px;max-width:100%';panel.appendChild(element);}
const play=document.createElement('button');play.textContent='▶ Testuj pojedynek';play.style.cssText='display:block;margin:8px 0;background:#7453e6;color:white;border:0;border-radius:8px;padding:10px;font:700 14px system-ui;cursor:pointer';
play.onclick=()=>{const id=Number(select.value),v=Number(version.value);if(!B[id])return;S.tr||={};S.tr[id]=v;save();startMatch(0);if(G?.ph==='draft'){G.my=[B[id],B[id],B[id]];renderDraft();}panel.hidden=true;};
panel.appendChild(play);
const note=document.createElement('p');note.textContent='Wybór poziomu wpływa na obrażenia, umiejętności i efekty podczas walki. Tylko beta; wersja stabilna bez zmian.';note.style.cssText='font-size:12px;line-height:1.4;color:#d9cafa';panel.appendChild(note);
btn.onclick=()=>{panel.hidden=!panel.hidden;btn.setAttribute('aria-expanded',String(!panel.hidden));};
box.append(panel,btn);document.body.appendChild(box);
window.BVBBatch3951={ids:Array.from({length:13},(_,i)=>i+39),descriptions,fib,inspect:()=>G?.bl?.filter(o=>o.b.id>=39&&o.b.id<=51).map(o=>({id:o.b.id,tier:tier(o),hp:o.hp,fibIndex:o.b39FibIndex||0,mirror:o.b39MirrorUntil||0}))||[]};
})();
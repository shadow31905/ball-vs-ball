/* Bespoke skills for playable balls 49–64 (internal 48–63).
 * V1 establishes a separate identity; V2 and V3 upgrade that skill, never
 * base HP or base damage. All state is stored on match actors or round hazards.
 * This is game-specific original design, not claimed to be sourced from Roblox.
 */
(()=>{
'use strict';
const names=['Medyk','Prawda','Szkło','Portal','Tarcza','Magik','Chronos','Ninja','Pirat','Górnik','Szeryf','Magma','Plazma','Meteor','Cyklon','Pryzmat'];
const captions=[
 ['Triage: puls leczenia reaguje na rzeczywiste obrażenia','Szpital polowy: rozciągnięta strefa opatrunków'],
 ['Wyrok: śledząca soczewka rozbija tarczę celu','Ława przysięgłych: dwa promienie i drugi werdykt'],
 ['Kruchość: rozbity kryształ zostawia odłamki','Kaskada: odłamki wybuchają kaskadowo'],
 ['Pamięć: otwierany portal zapamiętuje punkt odejścia','Powrót: drugi portal i teleportacja przez echo'],
 ['Bariera: przejęta energia zasila tarczę','Bastion: naładowany pancerz wypuszcza falę'],
 ['Iluzja: rywal gubi cel w chmurze zmylenia','Zamiana: ułuda tworzy drugą wyrwę w przestrzeni'],
 ['Powtórzenie: echo czasu odtwarza cel','Godzina zero: wskazana pozycja cofa przeciwnika'],
 ['Cień: zostawiony za plecami rywala ślad uderza','Ostrza cienia: w śladzie pojawiają się ataki'],
 ['Salwa burtowa: rykoszetujący ostrzał z flanki','Łup: dodatkowe przyciągnięcie i drugi ostrzał'],
 ['Szyb: kilka połączonych pułapek wzdłuż tunelu','Zapadlisko: trzeci wybuch po sąsiednim trafieniu'],
 ['Lasso: oznaczony cel zostaje ponownie przyciągnięty','Pojedynek: celny strzał kończy odliczanie'],
 ['Kaldera: ogień przesuwa się po arenie','Erupcja: ruchoma magma zostawia drugi krater'],
 ['Reaktor: wzmocniona plazma poraża z opóźnieniem','Przeciążenie: odbicie zasila wyładowanie'],
 ['Deszcz: kolejne meteory trafiają przewidzianą pozycję','Krater: każdy meteor kruszy okoliczną ziemię'],
 ['Oko: obracający się podmuch zmienia tor ruchu','Tornado: wir przenosi się i uderza dwukrotnie'],
 ['Refrakcja: promień rozdziela się na kolorowe pasma','Widmo: po odbiciu światło tworzy drugi pryzmat']
];
const C=(v,a=15,b=345)=>Math.max(a,Math.min(b,v));
function cast(g,o,foe,api){
 if(!o||!foe||!g||!api.alive(foe))return;
 const id=o.b.id,s=api.evolutionStage(o),t=g.rt||0;
 const {shoot,zone,radial,dash,strike,setStatus,visual,roundState}=api;
 const ahead=(dx,dy,r)=>({x:C(foe.x+(dx||0)*r),y:C(foe.y+(dy||0)*r)});
 const mark=(kind,x,y,r=24,life=2,power=.3)=>zone(o,C(x),C(y),kind,r,life,power);
 const pulse=(kind,pt,r=24)=>mark(kind,pt.x,pt.y,r,2.1,.31);
 // The unique progress record is inspectable and survives between ticks.
 const st=o.v3Identity={id,stage:s,created:t,until:t+3.6,next:.24,clock:0,acts:0,
  origin:{x:o.x,y:o.y},target:{x:foe.x,y:foe.y},uid:foe.uid};
 switch(id){
 case 48:{ // Medyk: treatment never damages the target and reacts to missing HP.
  o.hp=Math.min(o.mh,o.hp+Math.min(12,4+(o.mh-o.hp)*.13));
  o.status.shield=Math.min(32,(o.status.shield||0)+3);
  visual(o,o,'heal',29,'#7af4b0',.54);
  if(s>=1)mark('slime',o.x,o.y,29,2.6,.22);
  if(s===2){mark('slow',o.x+28,o.y,22,2.4,.16);o.status.poison=0;o.status.burn=0;}
  break;
 }
 case 49:{ // Prawda pierces shields, unlike ordinary beam damage.
  const shield=Math.max(0,foe.status.shield||0);
  foe.status.shield=Math.max(0,shield-3-s*2);
  roundState().beams.push({x:o.x,y:o.y,x2:foe.x,y2:foe.y,id,color:'#fff1a6',life:.4,max:.4});
  strike(o,foe,o.baseDmg*.29,{slow:.2});
  o.v3TruthTaken=(o.v3TruthTaken||0)+Math.min(shield,3+s*2);
  if(s>=1)mark('shock',foe.x,foe.y,16,1.6,.23);
  if(s===2)mark('shock',foe.x+26,foe.y-22,17,1.6,.25);
  break;
 }
 case 50:{ // Glass scatters on impact; snapshots of shatter remain behind.
  shoot(o,foe,{count:3,damage:o.baseDmg*.22,spread:.33,speed:168,bounces:0,r:3,color:'#b5f2ff'});
  o.v3GlassShards=(o.v3GlassShards||0)+1;
  if(s>=1)mark('thorn',foe.x-25,foe.y,17,2.2,.29);
  if(s===2){mark('thorn',foe.x+25,foe.y,17,2.2,.29);
   mark('frost',foe.x,foe.y+27,16,1.6,.18);}
  break;
 }
 case 51:{ // Portal remembers the origin, unlike Ninja's positional ambush.
  const a=Math.atan2(o.y-foe.y,o.x-foe.x)+.65;
  o.x=C(foe.x+Math.cos(a)*75,o.r,360-o.r);
  o.y=C(foe.y+Math.sin(a)*75,o.r,360-o.r);
  visual(o,st.origin,'blink',35,'#b5a0ff',.7);
  if(s>=1)mark('zone',st.origin.x,st.origin.y,28,2,.32);
  if(s===2)mark('shock',o.x,o.y,25,1.7,.24);
  break;
 }
 case 52:{ // Tarcza accumulates energy from contacts, no automatic HP upgrade.
  o.status.shield=Math.min(32,(o.status.shield||0)+8);
  o.v3ShieldCharges=(o.v3ShieldCharges||0)+1;
  visual(o,o,'shield',38,'#83dfff',.72);
  if(s>=1)mark('zone',o.x,o.y,19,2.5,.22);
  if(s===2){mark('shock',o.x,o.y,29,2.1,.26);o.v3BastionReturn=true;}
  break;
 }
 case 53:{ // Magik confuses aim, then replaces the observed image.
  foe.aiTarget={vx:-(foe.vy||0),vy:foe.vx||0};
  foe.aiDecisionClock=Math.max(foe.aiDecisionClock||0,.75);
  visual(o,foe,'mirage',43,'#e7a5ff',.65);
  if(s>=1)mark('slow',foe.x,foe.y,26,1.8,.22);
  if(s===2){mark('shock',st.origin.x,st.origin.y,24,1.6,.24);
   shoot(o,foe,{damage:o.baseDmg*.17,ghost:true,homing:.7,color:'#e5a8f7'});}
  break;
 }
 case 54:{ // Chronos stores a target snapshot: rewind happens on a timer.
  setStatus(o,foe,'slow',1.2);
  st.next=.5;st.remaining=1+s;
  visual(o,foe,'clock',40,'#f9ce78',.64);
  if(s>=1)mark('slow',foe.x,foe.y,24,2.5,.22);
  if(s===2)mark('shock',foe.x+28,foe.y,16,1.8,.24);
  break;
 }
 case 55:{ // Ninja evades, flanks and leaves a positional shadow.
  const a=Math.atan2(foe.y-o.y,foe.x-o.x);
  o.x=C(foe.x+Math.cos(a)*42,o.r,360-o.r);
  o.y=C(foe.y+Math.sin(a)*42,o.r,360-o.r);
  o.vx=Math.cos(a)*.45;o.vy=Math.sin(a)*.45;
  visual(o,st.origin,'blink',30,'#7e95fd',.6);
  if(s>=1)mark('slow',st.origin.x,st.origin.y,17,2,.23);
  if(s===2){shoot(o,foe,{count:2,damage:o.baseDmg*.13,ghost:true,spread:.4});
   mark('shock',st.origin.x,st.origin.y,17,2,.23);}
  break;
 }
 case 56:{ // Pirate broadsides recoil, not the Rifle's fast homing fire.
  shoot(o,foe,{count:3,damage:o.baseDmg*.24,spread:.4,bounces:1,
   speed:130,knock:.16,color:'#e3a369'});
  o.vx-=.13*Math.sign(foe.x-o.x);o.vy-=.13*Math.sign(foe.y-o.y);
  if(s>=1)mark('mine',foe.x,foe.y,16,3,.28);
  if(s===2){mark('mine',foe.x+30,foe.y-13,18,3.4,.27);
   shoot(o,foe,{count:2,damage:o.baseDmg*.12,bounces:2,speed:150});}
  break;
 }
 case 57:{ // Miner builds stationary mining tunnels, unlike the mobile train.
  mark('mine',o.x+20,o.y,15,4,.32);
  o.v3MineTunnels=(o.v3MineTunnels||0)+1;
  if(s>=1)mark('mine',foe.x-20,foe.y,17,4,.32);
  if(s===2)mark('mine',foe.x+35,foe.y+21,17,4,.33);
  break;
 }
 case 58:{ // Sheriff lassoes first, then releases a recorded duel shot.
  const d=Math.hypot(foe.x-o.x,foe.y-o.y)||1;
  foe.vx=(foe.vx||0)+(o.x-foe.x)/d*.23;
  foe.vy=(foe.vy||0)+(o.y-foe.y)/d*.23;
  st.next=.45;
  roundState().beams.push({x:o.x,y:o.y,x2:foe.x,y2:foe.y,
   id,color:'#fbe28a',life:.33,max:.33});
  if(s>=1)mark('slow',foe.x,foe.y,17,2,.24);
  if(s===2)mark('shock',foe.x+17,foe.y,18,2,.21);
  break;
 }
 case 59:{ // Magma river flows towards foe.
  const h=mark('fire',o.x+Math.sign(foe.x-o.x)*24,o.y,26,3,.34);
  if(h){h.vx=(foe.x-o.x)/Math.max(1,Math.hypot(foe.x-o.x,foe.y-o.y))*28;
   h.vy=(foe.y-o.y)/Math.max(1,Math.hypot(foe.x-o.x,foe.y-o.y))*28;
   h.v3LavaFlow=true;}
  if(s>=1)mark('fire',foe.x,foe.y,20,2,.27);
  if(s===2)mark('shock',foe.x-33,foe.y,18,1.7,.22);
  break;
 }
 case 60:{ // Plasma reacts to charge, rather than a static beam.
  roundState().beams.push({x:o.x,y:o.y,x2:foe.x,y2:foe.y,
   id,color:'#90f9fd',life:.42,max:.42});
  setStatus(o,foe,'stun',.11);
  o.v3PlasmaCharge=(o.v3PlasmaCharge||0)+1;
  if(s>=1)mark('shock',foe.x,foe.y,20,2,.31);
  if(s===2)mark('shock',foe.x-26,foe.y-18,22,2,.32);
  break;
 }
 case 61:{ // Meteor starts with visible, armed impact points, not instant shots.
  st.next=.52;
  mark('mine',foe.x,foe.y,19,3,.33);
  visual(o,foe,'clock',42,'#ffb877',.67);
  if(s>=1)mark('fire',foe.x-28,foe.y+18,20,2,.28);
  if(s===2)mark('fire',foe.x+28,foe.y-18,20,2,.28);
  break;
 }
 case 62:{ // Cyclone pushes tangentially instead of pulling along the line.
  const dx=foe.x-o.x,dy=foe.y-o.y,d=Math.hypot(dx,dy)||1;
  foe.vx=(foe.vx||0)-dy/d*.27;foe.vy=(foe.vy||0)+dx/d*.27;
  radial(o,foe,.22,{radius:110});
  st.next=.35;
  if(s>=1)mark('zone',o.x,o.y,23,3,.3);
  if(s===2)mark('slow',foe.x,foe.y,22,2,.3);
  break;
 }
 case 63:{ // Prism fractures its beams; each reflection has another angle.
  shoot(o,foe,{count:3,damage:o.baseDmg*.18,spread:.57,
   speed:190,bounces:1,color:'#debfff'});
  if(s>=1)mark('shock',foe.x,foe.y,19,2,.27);
  if(s===2){mark('slow',foe.x-25,foe.y,18,2,.21);
   mark('shock',foe.x+25,foe.y,18,2,.21);}
  break;
 }
 }
 o.v3IdentityCasts=(o.v3IdentityCasts||0)+1;
 // Player-visible V2/V3 effects are mechanistic, not a generic damage multiplier.
 if(s)visual(o,o,'ring',s===2?46:34,api.abilityColor?.(id)||o.b.c,.6);
}
function tick(g,dt,api){
 if(!g||g.ph!=='battle'||!Number.isFinite(dt))return;
 const state=api.roundState();
 if(!state)return;
 for(const o of g.bl||[]){
  const m=o?.v3Identity;if(!m||m.until<=g.rt||!api.alive(o))continue;
  const foe=g.bl.find(p=>p.team!==o.team&&api.alive(p));if(!foe)continue;
  m.next-=dt;
  if(m.next>0)continue;
  m.next+=.57;
  if(m.acts>=1+m.stage){m.until=g.rt;continue;}
  switch(m.id){
  case 48:{const heal=Math.min(o.mh-o.hp,2.5+m.stage*1.5);
   o.hp+=Math.max(0,heal);if(m.stage===2)o.status.poison=0;
   api.visual(o,o,'heal',27,'#7af4b0',.45);break;}
  case 49:api.strike(o,foe,o.baseDmg*.09,{slow:.18});break;
  case 50:api.zone(o,foe.x+16*m.acts,foe.y,'thorn',13,1.7,.2);break;
  case 51:if(m.stage===2&&m.acts===1){
   o.x=C(m.origin.x,o.r,360-o.r);o.y=C(m.origin.y,o.r,360-o.r);
   api.radial(o,foe,.2,{radius:85});}
   else api.zone(o,m.origin.x,m.origin.y,'zone',17,1.2,.21);break;
  case 52:if(m.stage>0){api.radial(o,foe,.09,{radius:76});
   o.status.shield=Math.min(32,(o.status.shield||0)+1.3);}
   break;
  case 53:foe.aiDecisionClock=Math.max(foe.aiDecisionClock||0,.4);
   if(m.stage===2)api.zone(o,foe.x,foe.y,'slow',17,1,.17);break;
  case 54:if(m.stage===2&&m.acts===1){
   foe.x=C(m.target.x,foe.r,360-foe.r);foe.y=C(m.target.y,foe.r,360-foe.r);}
   api.visual(o,foe,'clock',25,'#f9ce78',.38);break;
  case 55:api.zone(o,m.origin.x,m.origin.y,'slow',17,1.3,.18);break;
  case 56:api.shoot(o,foe,{count:1,damage:o.baseDmg*.12,
   bounces:1,knock:.13,speed:133});break;
  case 57:api.zone(o,m.target.x+18*m.acts,m.target.y,'mine',14,3,.27);break;
  case 58:if(m.stage>0){const d=Math.hypot(foe.x-o.x,foe.y-o.y)||1;
   foe.vx+=(o.x-foe.x)/d*.17;foe.vy+=(o.y-foe.y)/d*.17;
   if(m.stage===2)api.shoot(o,foe,{damage:o.baseDmg*.16,ghost:true,speed:200});}
   break;
  case 59:api.zone(o,foe.x-21*m.acts,foe.y,'fire',16,1.7,.23);break;
  case 60:api.zone(o,foe.x,foe.y,'shock',18,1.3,.24);break;
  case 61:api.zone(o,foe.x+21*m.acts,foe.y-19,'fire',18,1.6,.21);break;
  case 62:if(m.stage>0){const dx=foe.x-o.x,dy=foe.y-o.y,d=Math.hypot(dx,dy)||1;
   foe.vx-=dy/d*.13;foe.vy+=dx/d*.13;}
   api.visual(o,o,'ring',36,'#7af0ff',.45);break;
  case 63:api.shoot(o,foe,{count:1,damage:o.baseDmg*.12,bounces:2,speed:170,
   color:'#d8a5ff'});break;
  }
  m.acts++;
 }
}
function onWall(g,o,side,api){
 if(!o||o.b.id<48||o.b.id>63)return;
 const s=api.evolutionStage(o),f=g.bl.find(p=>p.team!==o.team&&api.alive(p));
 if(!f)return;
 if(o.b.id===50){api.zone(o,o.x,o.y,'thorn',13+s*2,2,.24);
  if(s===2)api.shoot(o,f,{count:2,damage:o.baseDmg*.13,spread:.8,speed:145});}
 if(o.b.id===57){api.zone(o,o.x,o.y,'mine',15+s*2,3.2,.26);
  if(s===2)api.zone(o,o.x+15,o.y,'mine',12,2.2,.23);}
 if(o.b.id===60){o.v3PlasmaCharge=(o.v3PlasmaCharge||0)+1;
  if(s)api.zone(o,o.x,o.y,'shock',15+s*3,1.6,.3);}
 if(o.b.id===63&&s){api.roundState().wallBeams.push({a:{x:o.x,y:0},
  b:{x:360-o.x,y:360},owner:o.uid,team:o.team,color:'#c4a6ff',life:1.2,width:2+s,inside:{}});}
}
function onContact(g,o,foe,base,api){
 if(!o||o.b.id<48||o.b.id>63||!foe)return base;
 const s=api.evolutionStage(o);
 if(o.b.id===52){o.v3ShieldCharges=Math.min(6,(o.v3ShieldCharges||0)+1);
  if(s&&o.v3ShieldCharges>=3){api.radial(o,foe,.13,{radius:75});
   o.v3ShieldCharges=0;o.v3ShieldReturns=(o.v3ShieldReturns||0)+1;}}
 if(o.b.id===56&&s&&g.rt>=(o.v3PirateNext||0)){
  o.v3PirateNext=g.rt+1.2;api.shoot(o,foe,{count:1,
   damage:o.baseDmg*.16,bounces:1,knock:.19});}
 if(o.b.id===58&&s===2&&g.rt>=(o.v3SheriffNext||0)){
  o.v3SheriffNext=g.rt+1.4;api.shoot(o,foe,{damage:o.baseDmg*.19,
   speed:210,ghost:true,color:'#fdf2a0'});}
 return base;
}
function description(id,tier){
 if(id<48||id>63||tier<=1)return null;
 const d=captions[id-48];
 return 'V'+tier+': '+d[0]+(tier===3?'; '+d[1]:'')+'.';
}
window.BVBNextSixteen=Object.freeze({first:48,last:63,names:Object.freeze(names),
 captions:Object.freeze(captions),onCast:cast,tick,onWall,onContact,description});
})();
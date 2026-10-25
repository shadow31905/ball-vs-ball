/* Ball VS Ball 2.0 — combat rework foundation.
   Development branch only: live release stays unchanged until the full rework is tested.
   Hooks are called by the authoritative battle loop, never by multiplayer guests. */
(() => {
  'use strict';
  const clamp01 = n => Math.max(0, Math.min(1, n));
  const norm = (x,y) => { const m=Math.hypot(x,y)||1; return {x:x/m,y:y/m}; };
  const isAlive = o => o && o.hp > 0 && !o.gone;
  const abilityKind = o => window.BVB2?.abilities?.[o?.b?.abilityId ?? o?.b?.id]?.kind || 'charge';
  const attackFamilies = ['physical','fire','ice','electric','poison','arcane'];
  const familyOf = kind => /lava|sun|phoenix|meteor|pumpkin/.test(kind)?'fire':
    /frost|shard|moon/.test(kind)?'ice':/shock|storm|beam|grid/.test(kind)?'electric':
    /poison|gas|thorn|web/.test(kind)?'poison':
    /void|shadow|mirage|doom|eclipse|prism/.test(kind)?'arcane':'physical';

  function prepareActors(g,p,e) {
    if(!g || netRole==='guest')return;
    for(const o of [p,e]) {
      if(!o)continue;
      const id=o.b.abilityId ?? o.b.id;
      o.mass=o.b.isBoss?1.8:0.82+(id%9)*.055;
      o.spin=(id%2?-1:1)*(.1+(id%5)*.055);
      o.armorMax=o.b.isBoss?26:12+(id%7)*2;
      o.armor=o.armorMax;
      o.weakTo=attackFamilies[(id*7+3)%attackFamilies.length];
      o.combatStats={contactHits:0,crits:0,damageDealt:0,abilities:0};
      o.stuckTime=0;
      o.abilityHold=0;
      o.bossPhase=1;
      // Prototype identity profiles: 130 per-ball combinations; bespoke tuning pending.
      o.passiveType=(id*3+Math.floor(id/13))%10;
      o.superType=(id*7+Math.floor(id/10))%10;
      o.resistFamily=attackFamilies[(id+2)%attackFamilies.length];
      o.superCharge=0;o.superUsed=0;o.passiveClock=0;o.reactionClock=0;
    }
    g.arenaNextShift=11+Math.random()*4;
    g.arenaShiftCount=0;
    g.bossAttackAt=7;
    g.bossTelegraph=null;
  }

  // Shield absorbs raw damage first; armor only mitigates HP damage and wears down.
  // Preserve the existing damage pipeline (including Cell's one-time revival).
  const previousApplyDamage=applyDamage;
  applyDamage=function(target,rawDamage) {
    if(!target || !Number.isFinite(rawDamage) || rawDamage<=0)return;
    const shield=Math.max(0,target.status?.shield||0);
    const blocked=Math.min(shield,rawDamage);
    const hpDamage=Math.max(0,rawDamage-blocked);
    let finalHpDamage=hpDamage;
    if(hpDamage>0 && target.armor>0 && target.armorMax>0) {
      const ratio=clamp01(target.armor/target.armorMax);
      finalHpDamage=hpDamage*(1-.18*ratio);
      target.armor=Math.max(0,target.armor-hpDamage*.24);
    }
    previousApplyDamage(target,blocked+finalHpDamage);
  };

  function abilityDamage(source,target,base) {
    if(!source||!target||!Number.isFinite(base))return base;
    const family=familyOf(abilityKind(source));
    const weak=target.weakTo===family?1.12:1;
    const resist=target.resistFamily===family?.86:1;
    if(source.combatStats)source.combatStats.damageDealt+=base*weak*resist;
    return Math.max(.5,base*weak*resist);
  }

  function contactDamage(attacker,defender,base) {
    if(!isAlive(attacker)||!isAlive(defender))return base;
    const id=attacker.b.abilityId ?? attacker.b.id;
    const critChance=.045+(id%8)*.008;
    const crit=Math.random()<critChance;
    const weakness=defender.weakTo===familyOf(abilityKind(attacker));
    const resistance=defender.resistFamily===familyOf(abilityKind(attacker))?.86:1;
    const passiveBoost=attacker.passiveType===0?1.06:attacker.passiveType===1&&attacker.hp/attacker.mh<.4?1.12:1;
    const damage=base*(crit?1.32:1)*(weakness?1.12:1)*resistance*passiveBoost;
    attacker.superCharge=Math.min(100,(attacker.superCharge||0)+10);
    defender.superCharge=Math.min(100,(defender.superCharge||0)+5);
    if(attacker.passiveType===2)attacker.armor=Math.min(attacker.armorMax,attacker.armor+1.4);
    if(attacker.passiveType===3)attacker.status.shield=Math.min(32,(attacker.status.shield||0)+.8);
    if(attacker.passiveType===4&&Math.random()<.16)defender.status.slow=Math.max(defender.status.slow||0,.42);
    if(attacker.passiveType===5&&Math.random()<.12)defender.status.poison=Math.max(defender.status.poison||0,.65);
    if(attacker.passiveType===6&&Math.random()<.12)defender.status.burn=Math.max(defender.status.burn||0,.65);
    if(attacker.passiveType===7&&crit)attacker.hp=Math.min(attacker.mh,attacker.hp+2.2);
    if(attacker.passiveType===8&&crit)defender.status.weaken=Math.max(defender.status.weaken||0,.8);
    if(attacker.passiveType===9)attacker.abilityCd=Math.max(.3,attacker.abilityCd-.18);
    if(attacker.combatStats) {
      attacker.combatStats.contactHits++;
      attacker.combatStats.damageDealt+=damage;
      if(crit)attacker.combatStats.crits++;
    }
    if(crit && G?.pop?.length<12)G.pop.push({x:defender.x,y:defender.y-defender.r-18,
      age:0,life:.65,text:'KRYTYK!',c:'#facc15'});
    return damage;
  }

  // Smart cooldowns: basic bots cast immediately; advanced AI can wait briefly
  // to combine an ability with an approaching collision.
  function abilityReady(o,foe,g,dt) {
    if(!isAlive(foe))return true;
    const level=o.team===0?3:(g.m===0?Math.max(0,Math.min(4,diff)):3);
    if(level<2)return true;
    const distance=Math.hypot(o.x-foe.x,o.y-foe.y);
    if(distance<120 || (o.abilityHold||0)>=.75) {
      o.abilityHold=0;return true;
    }
    o.abilityHold=(o.abilityHold||0)+dt;
    return false;
  }

  function steer(g,o,dt) {
    if(!isAlive(o)||o.status?.stun>0)return;
    const foe=g.bl.find(t=>t.team!==o.team&&isAlive(t));
    if(!foe)return;
    const id=o.b.abilityId ?? o.b.id;
    const level=o.team===0?3:(g.m===0?Math.max(0,Math.min(4,diff)):3);
    const lead=(.10+level*.065);
    let tx=foe.x+foe.vx*110*lead,ty=foe.y+foe.vy*110*lead;
    tx=Math.max(22,Math.min(338,tx));ty=Math.max(22,Math.min(338,ty));
    let dx=tx-o.x,dy=ty-o.y;
    // Some balls flank instead of charging directly; all still seek contact.
    const flank=(id%5===0?1:id%5===1?-1:0)*Math.min(38,Math.hypot(dx,dy)*.2);
    const direction=norm(dx,dy);
    dx+=-direction.y*flank;dy+=direction.x*flank;
    for(const p of g.obstacles||[]) {
      const ox=o.x-p.x,oy=o.y-p.y,d=Math.hypot(ox,oy)||1;
      if(d<o.r+p.r+32) {
        const push=(o.r+p.r+32-d)*2.2;
        dx+=ox/d*push;dy+=oy/d*push;
      }
    }
    const wanted=norm(dx,dy);
    const turn=Math.min(.075,dt*(.34+level*.12+(id%4)*.025));
    const adjusted=norm(o.vx*(1-turn)+wanted.x*turn,o.vy*(1-turn)+wanted.y*turn);
    // Preserve ability impulses and mass-driven collisions instead of resetting speed.
    const speed=Math.max(.65,Math.min(1.5,Math.hypot(o.vx,o.vy)));
    o.vx=adjusted.x*speed;o.vy=adjusted.y*speed;
  }

  function shiftArena(g) {
    g.arenaShiftCount=(g.arenaShiftCount||0)+1;
    g.arenaNextShift=g.rt+10+Math.random()*5;
    const obstacles=g.obstacles||[];
    if(!obstacles.length) {
      const x=55+Math.random()*250,y=110+Math.random()*140;
      if(g.bl.every(o=>Math.hypot(o.x-x,o.y-y)>o.r+50))
        obstacles.push({x,y,r:17,kind:'neon',moving:true,moveClock:0,moveDuration:0,dx:0,dy:0,seed:0});
    }
    for(const p of obstacles) {
      p.moving=true;
      p.moveDuration=1.3;
      p.moveClock=10;
      const angle=Math.random()*Math.PI*2;
      p.dx=Math.cos(angle)*35;p.dy=Math.sin(angle)*35;
    }
    if(g.pop?.length<12)g.pop.push({x:180,y:35,age:0,life:1.1,text:'ZMIANA ARENY',c:'#93c5fd'});
  }

  function tickStatuses(o,dt){
    const st=o.status||{};
    o.reactionClock=Math.max(0,(o.reactionClock||0)-dt);
    if(o.reactionClock>0)return;
    // Controlled reactions prevent stacking hundreds of DOT ticks per second.
    if(st.burn>0&&st.slow>0){
      applyDamage(o,2.2);st.slow=Math.max(0,st.slow-.3);o.reactionClock=1;
      if(G.pop?.length<12)G.pop.push({x:o.x,y:o.y-o.r-20,age:0,life:.7,text:'SZOK TERMICZNY',c:'#7dd3fc'});
    }else if(st.burn>0&&st.poison>0){
      applyDamage(o,2.8);st.poison=Math.max(0,st.poison-.3);o.reactionClock=1;
      if(G.pop?.length<12)G.pop.push({x:o.x,y:o.y-o.r-20,age:0,life:.7,text:'ZAPŁON',c:'#fb923c'});
    }
  }

  function castSuper(g,o,foe){
    if(!isAlive(foe))return;
    const id=o.b.abilityId??o.b.id;
    const strength=5+(id%7)*.8;
    switch(o.superType){
      case 0: applyDamage(foe,strength*1.7);break;
      case 1: o.status.shield=Math.min(32,(o.status.shield||0)+12+id%6);break;
      case 2: foe.status.slow=Math.max(foe.status.slow||0,1.1);applyDamage(foe,strength);break;
      case 3: o.hp=Math.min(o.mh,o.hp+9+id%8);break;
      case 4: foe.status.burn=Math.max(foe.status.burn||0,1.5);applyDamage(foe,strength);break;
      case 5: foe.status.poison=Math.max(foe.status.poison||0,2);applyDamage(foe,strength);break;
      case 6: o.armor=Math.min(o.armorMax,o.armor+10+id%5);applyDamage(foe,strength*.8);break;
      case 7: foe.status.weaken=Math.max(foe.status.weaken||0,1.6);applyDamage(foe,strength);break;
      case 8: {const d=norm(foe.x-o.x,foe.y-o.y);o.vx=d.x*1.4;o.vy=d.y*1.4;applyDamage(foe,strength);break;}
      case 9: foe.status.stun=Math.max(foe.status.stun||0,.35);applyDamage(foe,strength);break;
    }
    // A secondary per-ball effect makes super signatures distinguishable.
    if(id%3===0)o.status.shield=Math.min(32,(o.status.shield||0)+3);
    if(id%3===1)foe.status.slow=Math.max(foe.status.slow||0,.2);
    if(id%3===2)o.hp=Math.min(o.mh,o.hp+2);
    o.superUsed++;o.superCharge=0;
    if(g.rings?.length<16)g.rings.push({x:o.x,y:o.y,age:0,life:.75,radius:40,c:'#fbbf24'});
    if(g.pop?.length<12)g.pop.push({x:o.x,y:o.y-o.r-23,age:0,life:.9,text:'SUPER!',c:'#fef08a'});
  }

  function beforeStep(g,dt) {
    if(netRole==='guest')return;
    if(g.rt>=g.arenaNextShift)shiftArena(g);
    for(const o of g.bl) {
      if(!isAlive(o))continue;
      o._lastX=o.x;o._lastY=o.y;
      tickStatuses(o,dt);
      steer(g,o,dt);
    }
  }

  function bossArenaTick(g,boss){
    if(g.m!==11||!isAlive(boss))return;
    const foe=g.bl.find(o=>o.team!==boss.team&&isAlive(o));
    if(!foe)return;
    const index=Math.max(0,Math.min(5,g.bossIndex||0));
    if(!g.bossAttackAt)g.bossAttackAt=7;
    if(!g.bossTelegraph&&g.rt>=g.bossAttackAt){
      const radius=46+index%3*11;
      g.bossTelegraph={index,x:foe.x,y:foe.y,radius,at:g.rt+1.2};
      g.bossAttackAt=g.rt+Math.max(4.5,8.2-boss.bossPhase*.7);
      if(g.rings?.length<16)g.rings.push({x:foe.x,y:foe.y,age:0,life:1.2,radius,c:'#f97316'});
      if(g.pop?.length<12)g.pop.push({x:foe.x,y:Math.max(22,foe.y-35),age:0,life:1.1,
        text:['KRĄG OGNIA','CIĘŻAR ARENY','LUSTRZANA FALA','BURZA','MROŹNY WYBUCH','KLĄTWA'][index],
        c:'#fef08a'});
    }
    const mark=g.bossTelegraph;
    if(!mark||g.rt<mark.at)return;
    g.bossTelegraph=null;
    if(index===2)boss.status.shield=Math.min(32,(boss.status.shield||0)+6);
    if(index===1){
      const d=norm(mark.x-foe.x,mark.y-foe.y);
      foe.vx+=d.x*.22;foe.vy+=d.y*.22;
    }
    if(Math.hypot(foe.x-mark.x,foe.y-mark.y)>mark.radius+foe.r)return;
    applyDamage(foe,3.5+boss.bossPhase*1.2);
    if(index===0)foe.status.burn=Math.max(foe.status.burn||0,1.1);
    if(index===1)foe.status.slow=Math.max(foe.status.slow||0,.7);
    if(index===2)foe.status.weaken=Math.max(foe.status.weaken||0,.8);
    if(index===3)foe.status.stun=Math.max(foe.status.stun||0,.28);
    if(index===4)foe.status.slow=Math.max(foe.status.slow||0,1.3);
    if(index===5)foe.status.poison=Math.max(foe.status.poison||0,1.4);
  }

  function afterStep(g,dt) {
    if(netRole==='guest'||g.ph!=='battle')return;
    for(const o of g.bl) {
      if(!isAlive(o))continue;
      o.superCharge=Math.min(100,(o.superCharge||0)+dt*3.6);
      o.passiveClock=(o.passiveClock||0)+dt;
      if(o.passiveClock>=4){
        o.passiveClock=0;
        if(o.passiveType===2)o.armor=Math.min(o.armorMax,o.armor+1.5);
        if(o.passiveType===3)o.status.shield=Math.min(32,(o.status.shield||0)+1.5);
        if(o.passiveType===7&&o.hp/o.mh<.55)o.hp=Math.min(o.mh,o.hp+1.8);
        if(o.passiveType===9)o.abilityCd=Math.max(.25,o.abilityCd-.25);
      }
      if(o.superCharge>=100&&o.superUsed<2){
        const foe=g.bl.find(t=>t.team!==o.team&&isAlive(t));
        castSuper(g,o,foe);
      }
      const moved=Math.hypot(o.x-o._lastX,o.y-o._lastY);
      o.stuckTime=moved<.35?(o.stuckTime||0)+dt:0;
      if(o.stuckTime>.9) {
        const foe=g.bl.find(t=>t.team!==o.team&&isAlive(t));
        const direction=norm((foe?.x??180)-o.x,(foe?.y??180)-o.y);
        o.vx=direction.x;o.vy=direction.y;
        o.x=Math.max(o.r,Math.min(360-o.r,o.x+direction.x*3));
        o.y=Math.max(o.r,Math.min(360-o.r,o.y+direction.y*3));
        o.stuckTime=0;
      }
      if(o.b.isBoss) {
        const phase=o.hp/o.mh<=.33?3:o.hp/o.mh<=.66?2:1;
        if(phase>o.bossPhase) {
          o.bossPhase=phase;
          if(g.rings?.length<16)g.rings.push({x:o.x,y:o.y,age:0,life:.9,radius:30,c:phase===3?'#fb7185':'#fbbf24'});
          if(g.pop?.length<12)g.pop.push({x:o.x,y:o.y-o.r-22,age:0,life:.95,
            text:phase===3?'FAZA FINAŁOWA!':'FAZA II!',c:'#fbbf24'});
          shiftArena(g);
          if(phase===3)o.abilityCd=Math.min(o.abilityCd,.25);
        }
        bossArenaTick(g,o);
      }
    }
    // Hard upper bound; compare remaining HP percentages rather than raw HP.
    if(g.rt>=60) {
      const a=g.bl.find(o=>o.team===0),b=g.bl.find(o=>o.team===1);
      const aPct=Math.max(0,(a?.hp||0)/(a?.mh||1));
      const bPct=Math.max(0,(b?.hp||0)/(b?.mh||1));
      // A true draw would leave both hearts unchanged and could loop forever.
      // A fair coin resolves the extremely rare exact-HP tie.
      const winner=Math.abs(aPct-bPct)<.0001?(Math.random()<.5?0:1):aPct>bPct?0:1;
      window.BVBCampaign?.onRoundEnd?.(g,winner);
      roundEnd(winner);
    }
  }

  window.BVBRework={prepareActors,contactDamage,abilityDamage,abilityReady,beforeStep,afterStep};
})();

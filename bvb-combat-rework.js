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
    }
    g.arenaNextShift=11+Math.random()*4;
    g.arenaShiftCount=0;
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

  function contactDamage(attacker,defender,base) {
    if(!isAlive(attacker)||!isAlive(defender))return base;
    const id=attacker.b.abilityId ?? attacker.b.id;
    const critChance=.045+(id%8)*.008;
    const crit=Math.random()<critChance;
    const weakness=defender.weakTo===familyOf(abilityKind(attacker));
    const damage=base*(crit?1.32:1)*(weakness?1.12:1);
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
    o.vx=adjusted.x;o.vy=adjusted.y;
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

  function beforeStep(g,dt) {
    if(netRole==='guest')return;
    if(g.rt>=g.arenaNextShift)shiftArena(g);
    for(const o of g.bl) {
      if(!isAlive(o))continue;
      o._lastX=o.x;o._lastY=o.y;
      steer(g,o,dt);
    }
  }

  function afterStep(g,dt) {
    if(netRole==='guest'||g.ph!=='battle')return;
    for(const o of g.bl) {
      if(!isAlive(o))continue;
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
      }
    }
    // Hard upper bound; compare remaining HP percentages rather than raw HP.
    if(g.rt>=60) {
      const a=g.bl.find(o=>o.team===0),b=g.bl.find(o=>o.team===1);
      const aPct=Math.max(0,(a?.hp||0)/(a?.mh||1));
      const bPct=Math.max(0,(b?.hp||0)/(b?.mh||1));
      const winner=Math.abs(aPct-bPct)<.0001?-1:aPct>bPct?0:1;
      window.BVBCampaign?.onRoundEnd?.(g,winner);
      roundEnd(winner);
    }
  }

  window.BVBRework={prepareActors,contactDamage,abilityReady,beforeStep,afterStep};
})();

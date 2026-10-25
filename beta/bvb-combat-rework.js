/* Ball VS Ball 2.0 — combat rework foundation.
   Development branch only: live release stays unchanged until the full rework is tested.
   Hooks are called by the authoritative battle loop, never by multiplayer guests. */
(() => {
  'use strict';
  // Seeded simulation RNG: presentation effects never consume this stream.
  // Round IDs are stable on the authoritative host. Unit fixtures without
  // matchId deliberately retain their injected Math.random.
  function hashString(value) {
    let hash=2166136261;
    for(const c of String(value))hash=Math.imul(hash^c.charCodeAt(0),16777619);
    return hash>>>0;
  }
  function setSeed(g, seed) {
    if(!g)return 0;
    g.rngSeed=(Number(seed)>>>0)||0x6d2b79f5;
    g.rngState=g.rngSeed;
    g.rngCalls=0;
    return g.rngSeed;
  }
  function random(g=G) {
    if(!g||g.rngState==null)return Math.random();
    g.rngState=(g.rngState+0x6d2b79f5)>>>0;
    let t=g.rngState;
    t=Math.imul(t^(t>>>15),t|1);
    t^=t+Math.imul(t^(t>>>7),t|61);
    g.rngCalls=(g.rngCalls||0)+1;
    return ((t^(t>>>14))>>>0)/4294967296;
  }
  function stateHash(g) {
    if(!g)return '0';
    const q=n=>Number.isFinite(n)?Math.round(n*1000):0;
    const actors=(g.bl||[]).map(o=>[
      o.b?.abilityId??o.b?.id,o.team,q(o.x),q(o.y),q(o.vx),q(o.vy),
      q(o.hp),q(o.armor||0),q(o.status?.shield||0),q(o.superCharge||0),
      o.bossPhase||0
    ].join(',')).join('|');
    return hashString([g.rn||0,q(g.rt||0),g.rngState||0,actors].join(';')).toString(16).padStart(8,'0');
  }
  const eventLog=[];
  function trace(g,type,detail={}) {
    if(!g)return;
    const evt={tick:Math.round((g.rt||0)*60),type,...detail};
    eventLog.push(evt);
    if(eventLog.length>250)eventLog.shift();
  }
  function diagnostics(g=G) {
    if(!g)return {schemaVersion:1,events:[]};
    return {schemaVersion:1,seed:g.rngSeed||null,rngCalls:g.rngCalls||0,
      mode:g.m,arena:g.th,round:g.rn||0,tick:Math.round((g.rt||0)*60),
      stateHash:stateHash(g),
      fighters:(g.bl||[]).map(o=>({id:o.b?.abilityId??o.b?.id,team:o.team,
        x:Number(o.x.toFixed(2)),y:Number(o.y.toFixed(2)),
        hp:Number(o.hp.toFixed(2)),armor:Number((o.armor||0).toFixed(2)),
        shield:Number((o.status?.shield||0).toFixed(2))})),
      events:eventLog.slice()};
  }
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
    eventLog.length=0;
    if(g.matchId)setSeed(g,hashString(String(g.matchId)+':'+String(g.rn||0)));
    trace(g,'ROUND_START',{seed:g.rngSeed||null});
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
    g.arenaNextShift=11+random()*4;
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
    const crit=random()<critChance;
    const weakness=defender.weakTo===familyOf(abilityKind(attacker));
    const resistance=defender.resistFamily===familyOf(abilityKind(attacker))?.86:1;
    const passiveBoost=attacker.passiveType===0?1.06:attacker.passiveType===1&&attacker.hp/attacker.mh<.4?1.12:1;
    const damage=base*(crit?1.32:1)*(weakness?1.12:1)*resistance*passiveBoost;
    attacker.superCharge=Math.min(100,(attacker.superCharge||0)+10);
    defender.superCharge=Math.min(100,(defender.superCharge||0)+5);
    if(attacker.passiveType===2)attacker.armor=Math.min(attacker.armorMax,attacker.armor+1.4);
    if(attacker.passiveType===3)attacker.status.shield=Math.min(32,(attacker.status.shield||0)+.8);
    if(attacker.passiveType===4&&random()<.16)defender.status.slow=Math.max(defender.status.slow||0,.42);
    if(attacker.passiveType===5&&random()<.12)defender.status.poison=Math.max(defender.status.poison||0,.65);
    if(attacker.passiveType===6&&random()<.12)defender.status.burn=Math.max(defender.status.burn||0,.65);
    if(attacker.passiveType===7&&crit)attacker.hp=Math.min(attacker.mh,attacker.hp+2.2);
    if(attacker.passiveType===8&&crit)defender.status.weaken=Math.max(defender.status.weaken||0,.8);
    if(attacker.passiveType===9)attacker.abilityCd=Math.max(.3,attacker.abilityCd-.18);
    if(attacker.combatStats) {
      attacker.combatStats.contactHits++;
      attacker.combatStats.damageDealt+=damage;
      if(crit)attacker.combatStats.crits++;
    }
    if(crit)trace(G,'CRIT',{actor:attacker.team,target:defender.team,damage:Math.round(damage*100)/100});
    if(G?.rt!=null && Math.floor(G.rt*10)%10===0 && attacker.combatStats?.contactHits===1)
      trace(G,'CONTACT',{actor:attacker.team,target:defender.team});
    if(crit && G?.pop?.length<12)G.pop.push({x:defender.x,y:defender.y-defender.r-18,
      age:0,life:.65,text:'KRYTYK!',c:'#facc15'});
    return damage;
  }

  // Five tactical profiles: direct movement, tracking, prediction, flanking and
  // combo planning. Difficulty changes decisions, not secret HP/damage boosts.
  const AI_PROFILES=[
    {reaction:.75,lead:0,turn:.27,jitter:.26,avoid:.1,flank:0,hold:0},
    {reaction:.45,lead:.06,turn:.44,jitter:.14,avoid:.35,flank:0,hold:0},
    {reaction:.24,lead:.19,turn:.57,jitter:.06,avoid:.65,flank:.1,hold:.2},
    {reaction:.12,lead:.29,turn:.72,jitter:.025,avoid:1,flank:.38,hold:.55},
    {reaction:.06,lead:.39,turn:.9,jitter:0,avoid:1.3,flank:.57,hold:.75}
  ];
  const profileLevel=(o,g)=>o.team===0?3:
    g.m===0?Math.max(0,Math.min(4,diff)):3;
  function abilityReady(o,foe,g,dt) {
    if(!isAlive(foe))return true;
    const p=AI_PROFILES[profileLevel(o,g)];
    if(!p.hold)return true;
    const distance=Math.hypot(o.x-foe.x,o.y-foe.y);
    const facing=(o.vx*(foe.x-o.x)+o.vy*(foe.y-o.y))>0;
    const goodCombo=distance<105 || (distance<165&&facing);
    if(goodCombo||(o.abilityHold||0)>=Math.max(.18,p.hold)) {
      o.abilityHold=0;return true;
    }
    o.abilityHold=(o.abilityHold||0)+dt;
    return false;
  }

  function steer(g,o,dt) {
    if(!isAlive(o)||o.status?.stun>0)return;
    const foe=g.bl.find(t=>t.team!==o.team&&isAlive(t));
    if(!foe)return;
    const level=profileLevel(o,g),p=AI_PROFILES[level];
    const id=o.b.abilityId??o.b.id;
    o.aiDecisionClock=(o.aiDecisionClock||0)-dt;
    if(o.aiDecisionClock<=0||!o.aiTarget) {
      o.aiDecisionClock=p.reaction;
      const lead=p.lead;
      // Predict future position and reflect at walls when the profile allows.
      let tx=foe.x+foe.vx*110*(foe.actualPace||1.2)*lead;
      let ty=foe.y+foe.vy*110*(foe.actualPace||1.2)*lead;
      const bounce=v=>{
        let n=v;for(let j=0;j<3&&(n<20||n>340);j++){if(n<20)n=40-n;if(n>340)n=680-n;}
        return Math.max(20,Math.min(340,n));
      };
      tx=bounce(tx);ty=bounce(ty);
      let dx=tx-o.x,dy=ty-o.y;
      const dist=Math.hypot(dx,dy)||1;
      // Low HP is a strategic choice: evasive types kite, chargers commit.
      const evade=level>=3&&o.hp/o.mh<.32&&[1,3,6,8].includes(id%10);
      if(evade&&dist<120){dx=-dx*.72;dy=-dy*.72;}
      const tangent=id%2?1:-1;
      const flank=(level>=2?p.flank:0)*Math.min(90,dist*.35);
      const dir=norm(dx,dy);
      tx+=-dir.y*flank*tangent;ty+=dir.x*flank*tangent;
      const wanderAngle=(random()-.5)*2*p.jitter;
      const v=norm(tx-o.x,ty-o.y);
      o.aiTarget={vx:v.x*Math.cos(wanderAngle)-v.y*Math.sin(wanderAngle),
                  vy:v.x*Math.sin(wanderAngle)+v.y*Math.cos(wanderAngle)};
    }
    let dx=o.aiTarget.vx,dy=o.aiTarget.vy;
    for(const ob of g.obstacles||[]) {
      const ox=o.x-ob.x,oy=o.y-ob.y,d=Math.hypot(ox,oy)||1;
      const radius=o.r+ob.r+28;
      if(d<radius) {
        const push=(radius-d)/radius*p.avoid*2.4;
        dx+=ox/d*push;dy+=oy/d*push;
      }
    }
    // High level predicts hazardous boss telegraphs, rather than standing still.
    if(level>=3 && g.bossTelegraph && o.team===0) {
      const mark=g.bossTelegraph,ox=o.x-mark.x,oy=o.y-mark.y;
      const d=Math.hypot(ox,oy)||1;
      if(d<mark.radius+o.r+26){dx+=ox/d*2;dy+=oy/d*2;}
    }
    const wanted=norm(dx,dy);
    const turn=Math.min(.085,dt*p.turn);
    const adjusted=norm(o.vx*(1-turn)+wanted.x*turn,o.vy*(1-turn)+wanted.y*turn);
    const speed=Math.max(.65,Math.min(1.5,Math.hypot(o.vx,o.vy)));
    o.vx=adjusted.x*speed;o.vy=adjusted.y*speed;
  }

  function shiftArena(g) {
    g.arenaShiftCount=(g.arenaShiftCount||0)+1;
    trace(g,'ARENA_SHIFT',{index:g.arenaShiftCount});
    g.arenaNextShift=g.rt+10+random()*5;
    const obstacles=g.obstacles||[];
    if(!obstacles.length) {
      const x=55+random()*250,y=110+random()*140;
      if(g.bl.every(o=>Math.hypot(o.x-x,o.y-y)>o.r+50))
        obstacles.push({x,y,r:17,kind:'neon',moving:true,moveClock:0,moveDuration:0,dx:0,dy:0,seed:0});
    }
    for(const p of obstacles) {
      p.moving=true;
      p.moveDuration=1.3;
      p.moveClock=10;
      const angle=random()*Math.PI*2;
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
      trace(G,'STATUS_REACTION',{team:o.team,kind:'thermal'});
      if(G.pop?.length<12)G.pop.push({x:o.x,y:o.y-o.r-20,age:0,life:.7,text:'SZOK TERMICZNY',c:'#7dd3fc'});
    }else if(st.burn>0&&st.poison>0){
      applyDamage(o,2.8);st.poison=Math.max(0,st.poison-.3);o.reactionClock=1;
      trace(G,'STATUS_REACTION',{team:o.team,kind:'ignition'});
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
    trace(g,'SUPER',{team:o.team,type:o.superType,id});
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
      trace(g,'BOSS_TELEGRAPH',{index,phase:boss.bossPhase});
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
        trace(g,'STUCK_RECOVERY',{team:o.team});
      }
      if(o.b.isBoss) {
        const phase=o.hp/o.mh<=.33?3:o.hp/o.mh<=.66?2:1;
        if(phase>o.bossPhase) {
          o.bossPhase=phase;
          trace(g,'BOSS_PHASE',{phase});
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
    if(Math.floor(g.rt*60)%60===0 && g._lastHashTick!==Math.floor(g.rt*60)){
      g._lastHashTick=Math.floor(g.rt*60);
      trace(g,'CHECKPOINT',{hash:stateHash(g)});
    }
    if(g.rt>=60) {
      const a=g.bl.find(o=>o.team===0),b=g.bl.find(o=>o.team===1);
      const aPct=Math.max(0,(a?.hp||0)/(a?.mh||1));
      const bPct=Math.max(0,(b?.hp||0)/(b?.mh||1));
      // A true draw would leave both hearts unchanged and could loop forever.
      // A fair coin resolves the extremely rare exact-HP tie.
      const winner=Math.abs(aPct-bPct)<.0001?(random()<.5?0:1):aPct>bPct?0:1;
      window.BVBCampaign?.onRoundEnd?.(g,winner);
      trace(g,'TIMEOUT',{winner});
      roundEnd(winner);
    }
  }

  window.BVBRework={prepareActors,contactDamage,abilityDamage,abilityReady,beforeStep,afterStep,random,setSeed,stateHash,trace,diagnostics};
})();

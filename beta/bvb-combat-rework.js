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
    const canonical=value=>{
      if(typeof value==='number')return Number.isFinite(value)?Math.round(value*1e6)/1e6:null;
      if(value==null||typeof value==='string'||typeof value==='boolean')return value;
      if(Array.isArray(value))return value.map(canonical);
      if(typeof value!=='object')return null;
      const result={};
      for(const key of Object.keys(value).sort()){
        if(['color','c','trail','effects'].includes(key)||typeof value[key]==='function')continue;
        result[key]=canonical(value[key]);
      }
      return result;
    };
    const actorKeys=['team','uid','x','y','r','vx','vy','hp','mh','gone','mass','spin','armor','armorMax',
      'weakTo','resistFamily','status','statusImmunities','superCharge','superUsed','passiveClock','reactionClock','passiveType','superType',
      'bossPhase','abilityCd','abilityHold','aiDecisionClock','aiTarget','aiPlan','stuckTime','contact','impactSlow',
      'baseDmg','power','speedFactor','abilityRate','actualPace','axeOrbit','identity','identityState',
      'v2LastSide','v2LastWallAt','v2WallAnchor','portalCooldown','obstacleCooldown','comboCooldown','comboHits','emergencyUsed','tier','sk','nd'];
    const actors=(g.bl||[]).map(o=>{
      const state={id:o.b?.id,abilityId:o.b?.abilityId,isBoss:!!o.b?.isBoss};
      for(const key of actorKeys)if(o[key]!==undefined)state[key]=o[key];
      for(const key of Object.keys(o))if(key.startsWith('v2')||key.startsWith('skill')||key.startsWith('identity')||key.startsWith('_identity'))state[key]=o[key];
      return state;
    });
    const v2=g.v2?{tick:g.v2.tick,serial:g.v2.serial,shots:g.v2.shots,hazards:g.v2.hazards,
      webs:g.v2.webs,wallBeams:g.v2.wallBeams}:null;
    const state={mode:g.m,round:g.rn,rt:g.rt,phase:g.ph,hearts:g.h,wave:g.w,stage:g.st,chaos:g.mod,rngState:g.rngState,rngCalls:g.rngCalls,actors,v2,
      obstacles:g.obstacles,bossIndex:g.bossIndex,bossAttackAt:g.bossAttackAt,bossTelegraph:g.bossTelegraph,
      arenaNextShift:g.arenaNextShift,arenaShiftCount:g.arenaShiftCount,portal:g.portal,
      campaignLevel:g.campaignLevel,campaignEvent:g.campaignEvent,campaignTotals:g.campaignTotals,lastEvent:g.lastEvent,
      tactics:g.tactics,modifier:g.modifier,lastModifier:g.lastModifier,silence:g.silence,
      silenceBoost:g.silenceBoost,silenceBoostFading:g.silenceBoostFading,speedRamp:g.speedRamp,hitStop:g.hitStop};
    return hashString(JSON.stringify(canonical(state))).toString(16).padStart(8,'0');
  }
  const eventLog=[];
  function trace(g,type,detail={}) {
    if(!g)return;
    const evt={tick:Math.round((g.rt||0)*60),type,...detail};
    eventLog.push(evt);
    window.BVBReworkUI?.recordEvent?.(g,type,detail);
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
    if(g.matchId&&g.rngState==null)setSeed(g,hashString(String(g.matchId)+':'+String(g.rn||0)));
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
      o.passiveType=o.b.isBoss?-1:(id*3+Math.floor(id/13))%10;
      o.superType=o.b.isBoss?-1:(id*7+Math.floor(id/10))%10;
      o.resistFamily=attackFamilies[(id+2)%attackFamilies.length];
      o.superCharge=0;o.superUsed=0;o.passiveClock=0;o.reactionClock=0;
      o.rotation=0;
      window.BVBIdentities?.prepare?.(g,o);
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
    rawDamage=window.BVBIdentities?.beforeDamage?.(typeof G==='undefined'?null:G,target,rawDamage) ?? rawDamage;
    if(!Number.isFinite(rawDamage)||rawDamage<=0)return;
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
    base=window.BVBIdentities?.abilityDamage?.(G,source,target,base) ?? base;
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
    const bespoke=!!attacker.identity||!!attacker.b?.isBoss;
    const passiveBoost=bespoke?1:attacker.passiveType===0?1.06:attacker.passiveType===1&&attacker.hp/attacker.mh<.4?1.12:1;
    let damage=base*(crit?1.32:1)*(weakness?1.12:1)*resistance*passiveBoost;
    attacker.superCharge=Math.min(100,(attacker.superCharge||0)+10);
    defender.superCharge=Math.min(100,(defender.superCharge||0)+5);
    if(!bespoke&&attacker.passiveType===2)attacker.armor=Math.min(attacker.armorMax,attacker.armor+1.4);
    if(!bespoke&&attacker.passiveType===3)attacker.status.shield=Math.min(32,(attacker.status.shield||0)+.8);
    if(!bespoke&&attacker.passiveType===4&&random()<.16)defender.status.slow=Math.max(defender.status.slow||0,.42);
    if(!bespoke&&attacker.passiveType===5&&random()<.12)defender.status.poison=Math.max(defender.status.poison||0,.65);
    if(!bespoke&&attacker.passiveType===6&&random()<.12)defender.status.burn=Math.max(defender.status.burn||0,.65);
    if(!bespoke&&attacker.passiveType===7&&crit)attacker.hp=Math.min(attacker.mh,attacker.hp+2.2);
    if(!bespoke&&attacker.passiveType===8&&crit)defender.status.weaken=Math.max(defender.status.weaken||0,.8);
    if(!bespoke&&attacker.passiveType===9)attacker.abilityCd=Math.max(.3,attacker.abilityCd-.18);
    damage=window.BVBIdentities?.contact?.(G,attacker,defender,damage) ?? damage;
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
    const kind=abilityKind(o);
    const ranged=/volley|beam|arrow|shock|frost|swarm/.test(kind);
    const controlled=(foe.status?.stun||0)>.05||(foe.status?.slow||0)>.2;
    const guard=(foe.status?.shield||0)>8;
    const defensive=/heal|shield|reflect/.test(kind);
    const goodCombo=defensive?(o.hp/o.mh<.72||(o.status?.shield||0)<3):
      controlled||(ranged&&distance>80&&distance<260)||(distance<105&&!guard)||(distance<165&&facing&&!guard);
    o.aiPlan=controlled?'counter':guard?'breakguard':ranged?'lineup':'engage';
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
      if(evade&&dist<120){dx=-dx*.72;dy=-dy*.72;tx=o.x+dx;ty=o.y+dy;}
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
    if(level>=2){
      for(const shot of g.v2?.shots||[]){
        if(shot.team===o.team||shot.life<=0)continue;
        const rx=shot.x-o.x,ry=shot.y-o.y;
        const vx=shot.vx-o.vx*110*(o.actualPace||1.2);
        const vy=shot.vy-o.vy*110*(o.actualPace||1.2);
        const vv=vx*vx+vy*vy;
        const t=vv?Math.max(0,Math.min(.42,-(rx*vx+ry*vy)/vv)):0;
        const nearX=rx+vx*t,nearY=ry+vy*t;
        const clearance=o.r+(shot.r||4)+10;
        if(t>0&&Math.hypot(nearX,nearY)<clearance){
          const dir=norm(-vy,vx),side=nearX*dir.x+nearY*dir.y>=0?-1:1;
          const urge=p.avoid*(.45-t)*5;
          dx+=dir.x*side*urge;dy+=dir.y*side*urge;
          o.aiPlan='dodge';
        }
      }
    }
    if(level>=3){
      for(const zone of g.v2?.hazards||[]){
        if(zone.team===o.team||zone.life<=0)continue;
        const ox=o.x-zone.x,oy=o.y-zone.y,d=Math.hypot(ox,oy)||1;
        const radius=(zone.radius||zone.r||30)+o.r+18;
        if(d<radius){dx+=ox/d*p.avoid;dy+=oy/d*p.avoid;}
      }
      if(g.bossTelegraph&&o.team===0){
        const safe=bossAvoidance(g.bossTelegraph,o);dx+=safe.x*2.3;dy+=safe.y*2.3;
      }
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
    const reactions=[
      {when:st.burn>0&&st.slow>0,damage:2.2,consume:'slow',kind:'thermal',name:'SZOK TERMICZNY',family:'fire',color:'#7dd3fc'},
      {when:st.burn>0&&st.poison>0,damage:2.8,consume:'poison',kind:'ignition',name:'ZAPŁON',family:'fire',color:'#fb923c'},
      {when:st.stun>0&&st.slow>0,damage:1.8,consume:'slow',kind:'shatter',name:'ROZTRZASKANIE',family:'ice',color:'#a5f3fc'},
      {when:st.poison>0&&st.weaken>0,damage:1.5,consume:'weaken',kind:'corrosion',name:'KOROZJA',family:'poison',color:'#a3e635'}
    ];
    const reaction=reactions.find(r=>r.when);
    if(!reaction)return;
    const resistance=o.resistFamily===reaction.family?.7:1;
    applyDamage(o,reaction.damage*resistance);
    st[reaction.consume]=Math.max(0,st[reaction.consume]-.3);
    if(reaction.kind==='corrosion')o.armor=Math.max(0,(o.armor||0)-2.5*resistance);
    o.reactionClock=1;
    trace(G,'STATUS_REACTION',{team:o.team,kind:reaction.kind});
    if(G.pop?.length<12)G.pop.push({x:o.x,y:o.y-o.r-20,age:0,life:.7,text:reaction.name,c:reaction.color});
  }
  function castSuper(g,o,foe){
    if(!isAlive(foe))return;
    if(o.identity){window.BVBIdentities?.castSuper?.(g,o,foe);return;}
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
      stabilize(o,Math.max(0,Math.min(.1,dt)));
      o._lastX=o.x;o._lastY=o.y;
      tickStatuses(o,dt);
      steer(g,o,dt);
    }
  }


  // Contact normals point from B to A, matching the arena's separation pass.
  // The tangential impulse uses solid-disc inertia and Coulomb friction;
  // unlike angle jitter it cannot add kinetic energy to repeated contacts.
  function contactImpulse(a,b,nx,ny) {
    const n=norm(nx,ny),tx=-n.y,ty=n.x;
    const ma=Math.max(.2,Number.isFinite(a.mass)?a.mass:1);
    const mb=Math.max(.2,Number.isFinite(b.mass)?b.mass:1);
    const ia=1/ma,ib=1/mb;
    const ax=Number.isFinite(a.vx)?a.vx:0,ay=Number.isFinite(a.vy)?a.vy:0;
    const bx=Number.isFinite(b.vx)?b.vx:0,by=Number.isFinite(b.vy)?b.vy:0;
    a.vx=ax;a.vy=ay;b.vx=bx;b.vy=by;
    const approach=(ax-bx)*n.x+(ay-by)*n.y;
    if(approach>=0)return false;
    const jn=-(1+.91)*approach/(ia+ib);
    a.vx+=jn*n.x*ia;a.vy+=jn*n.y*ia;
    b.vx-=jn*n.x*ib;b.vy-=jn*n.y*ib;
    const ra=Math.max(1,a.r||17),rb=Math.max(1,b.r||17);
    const wa=Number.isFinite(a.spin)?a.spin:0,wb=Number.isFinite(b.spin)?b.spin:0;
    const slip=(ax-bx)*tx+(ay-by)*ty-wa*ra-wb*rb;
    const jt=Math.max(-jn*.12,Math.min(jn*.12,-slip/(3*(ia+ib))));
    a.vx+=jt*tx*ia;a.vy+=jt*ty*ia;
    b.vx-=jt*tx*ib;b.vy-=jt*ty*ib;
    a.spin=wa-2*jt*ia/ra;b.spin=wb-2*jt*ib/rb;
    return true;
  }

  const STATUS_LIMITS={slow:4,stun:.55,burn:5,poison:5,weaken:4};
  function applyStatus(target,key,seconds,family) {
    if(!target||!STATUS_LIMITS[key]||!Number.isFinite(seconds)||seconds<=0||target.statusImmunities?.includes(key))return;
    const resist=target.resistFamily===family?.7:1;
    target.status ||= {};
    target.status[key]=Math.max(target.status[key]||0,Math.min(STATUS_LIMITS[key],seconds)*resist);
  }
  const targetImmune=(o,key)=>o.statusImmunities?.includes(key);
  function stabilize(o,dt) {
    const r=Math.max(1,Math.min(90,Number.isFinite(o.r)?o.r:17));
    o.r=r;
    // Recover corrupted state locally before it can propagate through impulses.
    for(const k of ['x','y'])o[k]=Math.max(r,Math.min(360-r,Number.isFinite(o[k])?o[k]:180));
    if(!Number.isFinite(o.vx)||!Number.isFinite(o.vy)){o.vx=o.team?-1:1;o.vy=0;}
    let speed=Math.hypot(o.vx,o.vy);
    if(speed>1.8){o.vx*=1.8/speed;o.vy*=1.8/speed;}
    if(!Number.isFinite(o.spin))o.spin=0;
    o.spin=Math.max(-.8,Math.min(.8,o.spin))*Math.exp(-.32*dt);
    o.rotation=((Number.isFinite(o.rotation)?o.rotation:0)+o.spin*dt)%(Math.PI*2);
    const st=o.status ||= {};
    for(const [key,limit] of Object.entries(STATUS_LIMITS))
      if(st[key]!=null)st[key]=targetImmune(o,key)?0:Number.isFinite(st[key])?Math.max(0,Math.min(limit,st[key])):0;
    if(st.shield!=null)st.shield=Number.isFinite(st.shield)?Math.max(0,Math.min(40,st.shield)):0;
  }

  // All 18 phase attacks have frozen, serializable collision geometry.
  // The exact same shapes are used by damage, AI avoidance and rendering.
  const BOSS_PHASES=[
    [
      {id:'pumpkin-seed',name:'PĘKAJĄCA DYNIA',shape:'target',color:'#fb923c',damage:4.7,status:'burn',seconds:1.1,windup:1.2},
      {id:'pumpkin-patch',name:'DYNIOWE POLE',shape:'triad',color:'#f97316',damage:5.2,status:'burn',seconds:1.2,windup:1.25},
      {id:'pumpkin-harvest',name:'ŻNIWA OGNIA — WEJDŹ DO ŚRODKA',shape:'ring',color:'#ef4444',damage:6,status:'burn',seconds:1.4,windup:1.35}
    ],
    [
      {id:'titan-slam',name:'TYTANICZNE TĄPNIĘCIE',shape:'target',color:'#cbd5e1',damage:5,status:'slow',seconds:.7,windup:1.2},
      {id:'titan-press',name:'PRASA KRZYŻOWA',shape:'cross',color:'#94a3b8',damage:5.5,status:'stun',seconds:.22,windup:1.25},
      {id:'titan-rails',name:'STALOWE TORY',shape:'rails',color:'#e2e8f0',damage:6.2,status:'weaken',seconds:1,windup:1.3}
    ],
    [
      {id:'shadow-gaze',name:'SPOJRZENIE CIENIA',shape:'ray',color:'#a78bfa',damage:4.8,status:'weaken',seconds:1,windup:1.2},
      {id:'shadow-mirrors',name:'LUSTRZANE CIĘCIE',shape:'parallel',color:'#8b5cf6',damage:5.4,status:'weaken',seconds:1.2,windup:1.3},
      {id:'shadow-board',name:'SZACHOWNICA CIENI',shape:'checker',color:'#c4b5fd',damage:5.8,status:'weaken',seconds:1.4,windup:1.4}
    ],
    [
      {id:'frost-sigil',name:'LODOWA PIECZĘĆ',shape:'target',color:'#a5f3fc',damage:4.5,status:'slow',seconds:1.3,windup:1.2},
      {id:'frost-spears',name:'KRZYŻ LODOWYCH WŁÓCZNI',shape:'diagonals',color:'#67e8f9',damage:5.2,status:'slow',seconds:1.5,windup:1.3},
      {id:'frost-eye',name:'OKO ZAMIECI — WEJDŹ DO ŚRODKA',shape:'eye',color:'#cffafe',damage:6,status:'slow',seconds:1.7,windup:1.4}
    ],
    [
      {id:'void-well',name:'STUDNIA GRAWITACJI',shape:'target',color:'#a78bfa',damage:4.8,status:'slow',seconds:.8,windup:1.2,pull:.18},
      {id:'void-twins',name:'PODWÓJNA OSOBLIWOŚĆ',shape:'twins',color:'#7c3aed',damage:5.5,status:'weaken',seconds:1.2,windup:1.3,pull:.25},
      {id:'void-horizon',name:'HORYZONT ZDARZEŃ — UCIEKNIJ Z LINII',shape:'star',color:'#c4b5fd',damage:6.1,status:'stun',seconds:.25,windup:1.4,pull:.3}
    ],
    [
      {id:'chaos-slash',name:'UKOŚNE ROZDARCIE',shape:'diagonal',color:'#f9a8d4',damage:4.8,status:'poison',seconds:.8,windup:1.2},
      {id:'chaos-dice',name:'SZEŚĆ PÓL CHAOSU',shape:'six',color:'#f472b6',damage:5.4,status:'poison',seconds:1.2,windup:1.3},
      {id:'chaos-crown',name:'KORONA NIEZGODY',shape:'crown',color:'#ec4899',damage:6.2,status:'poison',seconds:1.5,windup:1.4}
    ]
  ];
  const segment=(x1,y1,x2,y2,width)=>({kind:'line',x1,y1,x2,y2,width});
  const circle=(x,y,r)=>({kind:'circle',x,y,r});
  function bossZones(spec,boss,foe) {
    const x=Math.max(40,Math.min(320,foe.x)),y=Math.max(40,Math.min(320,foe.y));
    switch(spec.shape){
      case 'target':return [circle(x,y,48)];
      case 'triad':return [circle(x,y,34),circle(Math.max(35,x-65),Math.min(325,y+45),30),circle(Math.min(325,x+65),Math.max(35,y-45),30)];
      case 'ring':return [{kind:'ring',x:boss.x,y:boss.y,inner:64,r:157}];
      case 'cross':return [segment(0,y,360,y,17),segment(x,0,x,360,17)];
      case 'rails':return [segment(0,90,360,90,19),segment(0,270,360,270,19),segment(90,0,90,360,19),segment(270,0,270,360,19)];
      case 'ray':return [segment(boss.x,boss.y,x,y,19)];
      case 'parallel':{
        const n=norm(x-boss.x,y-boss.y),px=-n.y*58,py=n.x*58;
        return [-1,1].map(side=>segment(boss.x+px*side,boss.y+py*side,x+px*side,y+py*side,18));
      }
      case 'checker':{
        const zones=[];for(let row=0;row<4;row++)for(let col=0;col<4;col++)if((row+col)%2===0)
          zones.push({kind:'rect',x:col*90+7,y:row*90+7,w:76,h:76});
        return zones;
      }
      case 'diagonals':return [segment(0,0,360,360,17),segment(0,360,360,0,17)];
      case 'eye':return [{kind:'ring',x:180,y:180,inner:76,r:260}];
      case 'twins':return [circle(100,y,48),circle(260,360-y,48)];
      case 'star':return [segment(0,180,360,180,14),segment(180,0,180,360,14),segment(0,0,360,360,14)];
      case 'diagonal':return [segment(0,y-x,360,360+y-x,21)];
      case 'six':return [circle(60,90,31),circle(180,90,31),circle(300,90,31),circle(60,270,31),circle(180,270,31),circle(300,270,31)];
      case 'crown':return Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return circle(180+106*Math.cos(a),180+106*Math.sin(a),33);});
      default:return [];
    }
  }
  function zoneHits(zone,o,margin=0) {
    const r=Math.max(0,o.r||0)+margin;
    if(zone.kind==='circle')return Math.hypot(o.x-zone.x,o.y-zone.y)<=zone.r+r;
    if(zone.kind==='ring'){
      const d=Math.hypot(o.x-zone.x,o.y-zone.y);
      return d<=zone.r+r&&d>=Math.max(0,zone.inner-r);
    }
    if(zone.kind==='rect'){
      const x=Math.max(zone.x,Math.min(zone.x+zone.w,o.x));
      const y=Math.max(zone.y,Math.min(zone.y+zone.h,o.y));
      return Math.hypot(o.x-x,o.y-y)<=r;
    }
    const dx=zone.x2-zone.x1,dy=zone.y2-zone.y1,len=dx*dx+dy*dy;
    const t=len?Math.max(0,Math.min(1,((o.x-zone.x1)*dx+(o.y-zone.y1)*dy)/len)):0;
    return Math.hypot(o.x-zone.x1-dx*t,o.y-zone.y1-dy*t)<=zone.width+r;
  }
  function bossAvoidance(mark,o) {
    if(!mark?.zones?.some(z=>zoneHits(z,o,24)))return {x:0,y:0};
    // Choose a reachable safe sector, including the centre of donut attacks.
    let best=null;
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8,x=Math.max(o.r,Math.min(360-o.r,o.x+Math.cos(a)*75));
      const y=Math.max(o.r,Math.min(360-o.r,o.y+Math.sin(a)*75));
      const probe={x,y,r:o.r},cost=mark.zones.reduce((n,z)=>n+(zoneHits(z,probe,10)?1:0),0);
      if(!best||cost<best.cost)best={x,y,cost};
    }
    return best?norm(best.x-o.x,best.y-o.y):{x:0,y:0};
  }
  function drawBossTelegraph(ctx,g) {
    const marks=[g.bossTelegraph,g.bossEcho?.until>g.rt?g.bossEcho:null].filter(Boolean);
    for(const mark of marks){
      ctx.save();ctx.strokeStyle=mark.color;ctx.fillStyle=mark.color;
      const active=mark===g.bossEcho;
      ctx.globalAlpha=active?.24:.12+.08*Math.sin((g.rt||0)*14);
      for(const z of mark.zones||[]){
        ctx.beginPath();
        if(z.kind==='circle')ctx.arc(z.x,z.y,z.r,0,Math.PI*2);
        else if(z.kind==='ring'){ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.arc(z.x,z.y,z.inner,0,Math.PI*2,true);}
        else if(z.kind==='rect')ctx.rect(z.x,z.y,z.w,z.h);
        else {ctx.save();ctx.globalAlpha=active?.45:.22;ctx.lineWidth=z.width*2;ctx.moveTo(z.x1,z.y1);ctx.lineTo(z.x2,z.y2);ctx.stroke();ctx.restore();continue;}
        ctx.fill('evenodd');
      }
      ctx.globalAlpha=active?.9:.75;ctx.lineWidth=2;ctx.setLineDash(active?[]:[5,4]);
      for(const z of mark.zones||[]){
        ctx.beginPath();
        if(z.kind==='circle')ctx.arc(z.x,z.y,z.r,0,Math.PI*2);
        else if(z.kind==='ring'){ctx.arc(z.x,z.y,z.r,0,Math.PI*2);ctx.moveTo(z.x+z.inner,z.y);ctx.arc(z.x,z.y,z.inner,0,Math.PI*2);}
        else if(z.kind==='rect')ctx.rect(z.x,z.y,z.w,z.h);
        else {ctx.moveTo(z.x1,z.y1);ctx.lineTo(z.x2,z.y2);}
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function bossArenaTick(g,boss){
    if(!isAlive(boss)||!boss.b?.isBoss)return;
    const foe=g.bl.find(o=>o.team!==boss.team&&isAlive(o));
    if(!foe)return;
    const campaignBoss=g.m===13?[2,1,3,4,5][Math.floor((g.campaignLevel||10)/10)-1]:null;
    const index=Math.max(0,Math.min(5,boss.b.bi??campaignBoss??g.bossIndex??0));
    const phase=Math.max(1,Math.min(3,boss.bossPhase||1));
    if(!g.bossAttackAt)g.bossAttackAt=7;
    if(!g.bossTelegraph&&g.rt>=g.bossAttackAt){
      const spec=BOSS_PHASES[index][phase-1];
      g.bossTelegraph={index,phase,id:spec.id,name:spec.name,color:spec.color,
        x:foe.x,y:foe.y,radius:48,created:g.rt,at:g.rt+spec.windup,
        zones:bossZones(spec,boss,foe)};
      trace(g,'BOSS_TELEGRAPH',{index,phase,attack:spec.id});
      g.bossAttackAt=g.rt+Math.max(4.8,8.2-phase*.7);
      if(g.pop?.length<12)g.pop.push({x:180,y:30,age:0,life:spec.windup,text:spec.name,c:spec.color});
    }
    const mark=g.bossTelegraph;
    if(!mark||g.rt<mark.at)return;
    g.bossTelegraph=null;
    const spec=BOSS_PHASES[mark.index][mark.phase-1];
    g.bossEcho={...mark,until:g.rt+.38};
    if(mark.index===2)boss.status.shield=Math.min(32,(boss.status.shield||0)+3+mark.phase);
    if(spec.pull){
      const centre=mark.zones.find(z=>z.kind==='circle')||{x:180,y:180};
      const d=norm(centre.x-foe.x,centre.y-foe.y);
      foe.vx+=d.x*spec.pull;foe.vy+=d.y*spec.pull;
    }
    if(!mark.zones.some(z=>zoneHits(z,foe))){trace(g,'BOSS_DODGE',{attack:spec.id,team:foe.team});return;}
    applyDamage(foe,spec.damage*(foe.resistFamily===familyOf(abilityKind(boss))?.86:1));
    applyStatus(foe,spec.status,spec.seconds,familyOf(abilityKind(boss)));
    trace(g,'BOSS_HIT',{attack:spec.id,team:foe.team,damage:spec.damage});
  }
  function afterStep(g,dt) {
    if(netRole==='guest'||g.ph!=='battle')return;
    for(const o of g.bl) {
      if(!isAlive(o))continue;
      if(!o.b.isBoss)o.superCharge=Math.min(100,(o.superCharge||0)+dt*3.6);
      o.passiveClock=(o.passiveClock||0)+dt;
      const identityFoe=g.bl.find(t=>t.team!==o.team&&isAlive(t));
      window.BVBIdentities?.tick?.(g,o,identityFoe,dt);
      if(!o.identity&&!o.b.isBoss&&o.passiveClock>=4){
        o.passiveClock=0;
        if(o.passiveType===2)o.armor=Math.min(o.armorMax,o.armor+1.5);
        if(o.passiveType===3)o.status.shield=Math.min(32,(o.status.shield||0)+1.5);
        if(o.passiveType===7&&o.hp/o.mh<.55)o.hp=Math.min(o.mh,o.hp+1.8);
        if(o.passiveType===9)o.abilityCd=Math.max(.25,o.abilityCd-.25);
      }
      if(!o.b.isBoss&&o.superCharge>=100&&o.superUsed<2&&!(o.status?.stun>0)){
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

  window.BVBRework={contactImpulse,applyStatus,drawBossTelegraph,bossPhases:BOSS_PHASES,zoneHits,prepareActors,contactDamage,abilityDamage,abilityReady,beforeStep,afterStep,random,setSeed,stateHash,trace,diagnostics};
})();

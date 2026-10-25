/* Ball VS Ball — Ultimate Anime Update.
   Visual effects are cosmetic; the host remains authoritative for online HP and rules. */
(() => {
  'use strict';
  if (typeof step !== 'function' || typeof draw !== 'function' || typeof G === 'undefined') return;

  const styles = document.createElement('style');
  styles.textContent = [
    '.bvb-anime-banner{position:fixed;top:34%;left:50%;transform:translate(-50%,-50%);z-index:115;pointer-events:none;',
    'font:1000 clamp(24px,7vw,56px)/1.1 system-ui,sans-serif;letter-spacing:.09em;white-space:nowrap;',
    'color:#fff;text-shadow:0 2px 0 #111,0 0 9px var(--flash),0 0 30px var(--flash),0 0 60px var(--flash);',
    'animation:bvb-banner-pop 1.45s ease-out both;text-align:center}',
    '.bvb-anime-banner::after{content:"";position:absolute;left:50%;top:50%;width:160%;height:2px;',
    'background:linear-gradient(90deg,transparent,var(--flash),#fff,var(--flash),transparent);',
    'transform:translate(-50%,-50%) rotate(-7deg);filter:blur(1px);animation:bvb-line 1.2s ease-out both}',
    '@keyframes bvb-banner-pop{0%{opacity:0;transform:translate(-50%,-50%) scale(2.5) skewX(-12deg)}',
    '15%{opacity:1;transform:translate(-50%,-50%) scale(.92) skewX(3deg)}',
    '27%{transform:translate(-50%,-50%) scale(1.08)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-60%) scale(1.13)}}',
    '@keyframes bvb-line{0%{opacity:0;width:0}20%{opacity:1;width:180%}100%{opacity:0;width:240%}}'
  ].join('');
  document.head.appendChild(styles);

  const oldBurst = burst, oldAbility = specialAbility, oldApply = applyDamage;
  const oldHitSound = SFX.hit;
  SFX.hit = function() {
    oldHitSound();
    if(!G?.bl?.length || typeof snd !== 'function') return;
    const id = G.bl[0]?.b?.id || 0;
    const id2 = G.bl[1]?.b?.id || 0;
    snd(230+(id*19+id2*13)%510,.075,id%2?'triangle':'sawtooth',.025,105);
  };
  const oldStep = step, oldDraw = draw, oldLoop = loop, oldSetp = setp, oldRoundEnd = roundEnd;
  let frameMark = 0, lowFrames = 0, highFrames = 0, adaptive = 1, visualRound = '', visualPhase = '';
  const smooth = new Map();

  function level() {
    const v = Number(S?.o?.fxLevel);
    return Number.isInteger(v) && v >= 0 && v <= 3 ? v : 3;
  }
  function quality() {
    return [0, 0.3, 0.62, 1][level()] * adaptive;
  }
  function addPop(x, y, text, color, life = .9) {
    if (!G || !quality()) return;
    G.pop ||= [];
    G.pop.push({ x, y, text, c: color, age: 0, life });
    if (G.pop.length > 24) G.pop.splice(0, G.pop.length - 24);
  }
  function ring(x, y, color, radius = 18, duration = .55) {
    if (!G || !quality()) return;
    G.rings ||= [];
    G.rings.push({ x, y, c: color, radius, life: duration, age: 0 });
    if (G.rings.length > 28) G.rings.splice(0, G.rings.length - 28);
  }
  function banner(text, color = '#a78bfa', time = 1450) {
    if (!quality()) return;
    document.querySelectorAll('.bvb-anime-banner').forEach(el => el.remove());
    const el = document.createElement('div');
    el.className = 'bvb-anime-banner';
    el.style.setProperty('--flash', color);
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), time);
  }
  function sparks(x, y, color, n = 9, seed = 0) {
    if (!G || !quality()) return;
    G.fx ||= [];
    const count = Math.min(24, Math.max(2, Math.round(n * quality())));
    for (let i = 0; i < count; i++) {
      const a = (i + (seed % 13) * .15) * Math.PI * 2 / count;
      const sp = 28 + (i * 31 + seed * 7) % 110;
      const life = .3 + (i % 4) * .09;
      G.fx.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,r:1.6+(i+seed)%3,
        c:color,life,max:life});
    }
    if (G.fx.length > 150) G.fx.splice(0,G.fx.length - 150);
  }
  function signature(o, kind, count) {
    if (!o || !quality()) return;
    const ballId = o.b?.id || 0;
    const tone = o.b?.c || EFFECTS[kind]?.color || '#a78bfa';
    sparks(o.x,o.y,tone,count,ballId);
    if (ballId % 3 === 0) ring(o.x,o.y,tone,o.r + 5,.38);
    else if (ballId % 3 === 1) ring(o.x,o.y,'#fff',o.r + 8,.30);
    else { ring(o.x,o.y,tone,o.r + 3,.38); ring(o.x,o.y,tone,o.r + 10,.5); }
  }
  burst = function(o, kind, n = 12, label = true) {
    if (!quality()) return;
    oldBurst(o,kind,Math.max(3,Math.round(n * quality())),label);
    signature(o,kind,Math.min(10,n));
  };

  function shieldEffect(o, blocked) {
    if (!blocked) return;
    ring(o.x,o.y,'#67e8f9',o.r + 8,.4);
    sparks(o.x,o.y,'#a5f3fc',7,o.uid);
    addPop(o.x,Math.max(20,o.y-28),'BLOCK!','#a5f3fc');
    if (o.status.shield <= 0) {
      ring(o.x,o.y,'#f8fafc',o.r + 14,.67);
      addPop(o.x,Math.max(20,o.y-46),'SHIELD BREAK!','#93c5fd',1.2);
    }
  }
  function executeCombo(o, foe) {
    if (!foe || !alive(foe)) return;
    o.comboCooldown = 5.5;
    o.comboHits = 0;
    // Tactical choice controls the finisher; Balanced keeps the surprise.
    const choice = o.tactic === 'strike' ? 0 : o.tactic === 'rush' ? 1 : o.tactic === 'guard' ? 2 : Math.floor(battleRandom()*3);
    const col = o.b.c || '#e879f9';
    o.attackGlow = .75;
    addPop(o.x,o.y-36,'COMBO!','#fde047',1.3);
    ring(foe.x,foe.y,col,foe.r+4,.55);
    if (choice === 0) {
      oldApply(foe,o.baseDmg*.8);
      burst(foe,'blast',24,false);
    } else if (choice === 1) {
      oldApply(foe,o.baseDmg*.85);
      for (let i=0;i<3;i++) ring(foe.x,foe.y,col,9+i*8,.22+i*.14);
      sparks(foe.x,foe.y,'#fff',22,o.b.id);
    } else {
      oldAbility(o,foe);
      signature(o,effectType(o.b),19);
    }
    SFX.zap();
  }
  function emergency(o) {
    if (!alive(o) || o.emergencyUsed || o.hp/o.mh >= .15) return;
    const foe = G?.bl?.find(p=>p!==o && alive(p));
    if (!foe) return;
    o.emergencyUsed = true;
    o.attackGlow = 1.05;
    const col = o.b.c || '#f43f5e';
    addPop(o.x,o.y-42,'AWAKENING!','#fff',1.4);
    ring(o.x,o.y,col,o.r+8,.85);
    signature(o,effectType(o.b),25);
    oldApply(foe,o.baseDmg*1.5);
    if (SFX.boom) SFX.boom();
  }
  applyDamage = function(target, damage) {
    if (!target || !Number.isFinite(damage) || damage <= 0) return;
    const direct = damage >= 9, crit = direct && battleRandom()<.11;
    const amount = damage*(crit?1.5:1);
    const before = target.hp, oldShield = target.status.shield || 0;
    oldApply(target,amount);
    const dealt = Math.max(0,before-target.hp);
    const blocked = Math.max(0,oldShield-(target.status.shield||0));
    if (direct) {
      if (G) G.recentHitAt = G.rt || 0;
      shieldEffect(target,blocked);
      if (dealt>0) {
        const attacker = G?.bl?.find(p=>p!==target);
        target.flash = .21;
        target.flashColor = attacker?.b?.c || '#fff';
        sparks(target.x,target.y,target.flashColor,crit?19:9,target.b?.id||0);
        ring(target.x,target.y,crit?'#ef4444':target.flashColor,target.r+2,crit?.65:.28);
        if (S.o.nd || crit) addPop(target.x,target.y-23,(crit?'CRITICAL! ':'')+(S.o.nd?Math.ceil(dealt):''),
          crit?'#ff4747':'#fff4a3',crit?1.25:.75);
        if (attacker && alive(attacker)) {
          attacker.comboHits = (attacker.comboHits||0)+1;
          if (attacker.comboHits >= 5 && !(attacker.comboCooldown>0))
            executeCombo(attacker,target);
        }
        if (crit) { SFX.boom(); if (G) G.shake = Math.max(G.shake || 0, 3.5); }
        else if (damage >= 20 && G) G.shake = Math.max(G.shake || 0, 2);
      }
    }
    if (dealt>0 && alive(target)) emergency(target);
  };
  specialAbility = function(o,foe) {
    if (!o || !foe || !alive(foe)) return;
    const kind = effectType(o.b);
    const oldHp = o.hp, foeHp = foe.hp, oldShield = o.status.shield || 0;
    oldAbility(o,foe);
    o.attackGlow = .55;
    signature(o,kind,14);
    if (kind === 'heal' && o.hp>oldHp) {
      addPop(o.x,o.y-33,'+'+Math.ceil(o.hp-oldHp)+' HP','#4ade80');
      ring(o.x,o.y,'#4ade80',o.r+12,.65);
    }
    if (kind === 'shield' && (o.status.shield||0)>oldShield)
      addPop(o.x,o.y-32,'SHIELD!','#a5f3fc');
    if (kind === 'ice') addPop(foe.x,foe.y-34,'FROZEN!','#bae6fd');
    if (kind === 'electric') {
      addPop(foe.x,foe.y-33,'SHOCK!','#fef08a');
      G.lightning ||= [];
      G.lightning.push({from:o.uid,to:foe.uid,life:.38,max:.38,seed:o.b.id});
      if(G.lightning.length>8)G.lightning.shift();
      SFX.zap();
    }
    if (foe.hp<foeHp) {
      foe.flash = .18;
      foe.flashColor = EFFECTS[kind]?.color || o.b.c;
      if (S.o.nd) addPop(foe.x,foe.y-19,'-'+Math.ceil(foeHp-foe.hp),foe.flashColor);
      emergency(foe);
    }
  };
  step = function(dt) {
    if (!G || G.ph !== 'battle') return;
    for(const o of G.bl) {
      o.comboCooldown = Math.max(0,(o.comboCooldown||0)-dt);
      o.attackGlow = Math.max(0,(o.attackGlow||0)-dt);
      o.flash = Math.max(0,(o.flash||0)-dt);
      o.dotVisual = (o.dotVisual||0)+dt;
      if(o.dotVisual>=.8) {
        o.dotVisual = 0;
        if(o.status.poison>0) {sparks(o.x,o.y,'#a3e635',3,o.uid); if(S.o.nd)addPop(o.x,o.y-22,'-2','#a3e635',.6);}
        if(o.status.burn>0) {sparks(o.x,o.y,'#fb923c',4,o.uid); if(S.o.nd)addPop(o.x,o.y-22,'-3','#fb923c',.6);}
        if(o.status.stun>0) sparks(o.x,o.y,'#facc15',5,o.uid);
        if(o.status.slow>0) sparks(o.x,o.y,'#bae6fd',4,o.uid);
      }
    }
    oldStep(dt);
    if (G?.ph === 'battle' && G.bl.length === 2) {
      const [a,b] = G.bl, dx=a.x-b.x,dy=a.y-b.y, gap=Math.hypot(dx,dy);
      const separating=dx*(a.vx-b.vx)+dy*(a.vy-b.vy)>0;
      if(gap<a.r+b.r+14 && gap>a.r+b.r+2 && separating && G.rt-(G.recentHitAt||-10)>.65) {
        if((G.rt||0)-(G.lastDodgeAt||-10)>1.8) {
          G.lastDodgeAt=G.rt;
          addPop((a.x+b.x)/2,(a.y+b.y)/2-23,'DODGE!','#67e8f9');
          sparks((a.x+b.x)/2,(a.y+b.y)/2,'#67e8f9',7);
        }
      }
    }
  };
  roundEnd = function(winner) {
    if (!G || G.ph !== 'battle') return;
    window.BVBPresentation?.finish?.(G,winner);
    G.ph = 'end';
    window.BVBReworkUI?.endRound?.(G,winner);
    if(winner>=0) G.h[1-winner]--;
    G.lastRoundWinner = winner;
    window.BVBModes?.onRoundEnd?.(G,winner);
    const loser = G.bl?.find(o=>o.team!==winner);
    const victor = G.bl?.find(o=>o.team===winner);
    const kind = effectType(victor?.b);
    if(loser) {burst(loser,kind,35,false);ring(loser.x,loser.y,EFFECTS[kind]?.color||'#fff',25,1.3);}
    hearts();
    broadcastState();
    banner(winner<0?'DRAW!':winner===0?'VICTORY!':'DEFEAT!',winner<0?'#facc15':winner===0?'#fbbf24':'#8b5cf6',1500);
    const match = G.matchId, round = G.rn;
    setTimeout(()=>{
      if(!G || G.matchId!==match || G.rn!==round || G.ph!=='end') return;
      if(G.h[0]>0 && G.h[1]>0) nextRound();
      else over();
    },1550);
  };
  setp = function(p) {
    oldSetp(p);
    const el = p.querySelector('.cd');
    if(!el) return;
    el.insertAdjacentHTML('beforeend',
      '<div style="margin:14px 0"><label for="bvbFxLevel">✨ Efekty anime VFX</label>'+
      '<select id="bvbFxLevel" class="inp" onchange="window.BVBAnime.setLevel(this.value)">'+
      [0,1,2,3].map((n)=>'<option value="'+n+'"'+(level()===n?' selected':'')+'>'+
      ['Wyłączone','Niskie','Średnie','Wysokie'][n]+'</option>').join('')+
      '</select><small style="color:var(--mu)">Automatyczna optymalizacja płynności · cel 60 FPS</small></div>');
  };
  window.BVBAnime = {
    setLevel(v) {S.o.fxLevel=Math.max(0,Math.min(3,Number(v)||0));save();},
    getLevel: level
  };

  function drawStatus(o) {
    const kind=effectType(o.b), time=G.rt||0, power=quality();
    if (!power) return;
    cx.save();
    if(o.flash>0) {
      cx.fillStyle=o.flashColor||'#fff';cx.globalAlpha=Math.min(.43,o.flash*2.1);
      cx.beginPath();cx.arc(o.x,o.y,o.r,0,Math.PI*2);cx.fill();
      cx.globalAlpha=1;
    }
    if(o.attackGlow>0) {
      const color=o.b.c||EFFECTS[kind]?.color||'#a78bfa';
      cx.strokeStyle=color;cx.shadowColor=color;cx.shadowBlur=12+o.attackGlow*14;
      cx.lineWidth=1.5+o.attackGlow*3;
      const points=5+(o.b.id%5);
      cx.beginPath();
      for(let i=0;i<=points;i++) {
        const angle=time*3+i*Math.PI*2/points;
        const rad=o.r+7+(i%2?5:0)+2*Math.sin(time*17+i);
        const x=o.x+Math.cos(angle)*rad, y=o.y+Math.sin(angle)*rad;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      }
      cx.stroke();
    }
    const status=o.status||{};
    const count=3+Math.round(power*3);
    for(let i=0;i<count;i++){
      const a=i*Math.PI*2/count+time*(status.stun>0?7:2.1);
      const rad=o.r+5+(i%2)*3;
      const x=o.x+Math.cos(a)*rad,y=o.y+Math.sin(a)*rad;
      if(status.burn>0) {
        cx.fillStyle=i%2?'#facc15':'#fb923c';
        cx.beginPath();cx.moveTo(x-3,y+3);cx.lineTo(x,y-6-2*Math.sin(time*12+i));cx.lineTo(x+3,y+3);cx.fill();
      } else if(status.poison>0) {
        cx.fillStyle='#a3e635';cx.globalAlpha=.7;cx.beginPath();cx.arc(x,y,2+i%2,0,7);cx.fill();
      } else if(status.slow>0){
        cx.strokeStyle='#bae6fd';cx.lineWidth=2;cx.beginPath();cx.moveTo(x-3,y+3);cx.lineTo(x,y-4);cx.lineTo(x+3,y+3);cx.stroke();
      } else if(status.stun>0){
        cx.strokeStyle='#facc15';cx.lineWidth=2;cx.beginPath();cx.moveTo(x-3,y-3);cx.lineTo(x+2,y);cx.lineTo(x-1,y+4);cx.stroke();
      }
    }
    cx.restore();
  }
  function drawLightning() {
    if (!quality()) return;
    for(const l of G.lightning||[]) {
      const from=G.bl?.find(o=>o.uid===l.from),to=G.bl?.find(o=>o.uid===l.to);
      if(!from||!to)continue;
      cx.save();cx.strokeStyle='#fde047';cx.lineWidth=1.3+quality()*2.2;
      cx.shadowColor='#facc15';cx.shadowBlur=10;
      cx.globalAlpha=Math.max(0,l.life/l.max);
      cx.beginPath();cx.moveTo(from.x,from.y);
      for(let i=1;i<9;i++) {
        const t=i/9, off=Math.sin((l.seed+i*17)*2.31)*11*(1-Math.abs(2*t-1)*.5);
        const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy)||1;
        cx.lineTo(from.x+dx*t-dy/len*off,from.y+dy*t+dx/len*off);
      }
      cx.lineTo(to.x,to.y);cx.stroke();cx.restore();
    }
  }
  draw = function() {
    if (!G) return;
    const oldPos = [];
    if(!window.BVBReplayRendering&&netRole === 'guest' && G.ph === 'battle'){
      const key=G.matchId+':'+G.rn;
      if(visualRound!==key){visualRound=key;smooth.clear();}
      for(const o of G.bl||[]){
        let p=smooth.get(o.uid);
        if(!p){p={x:o.x,y:o.y};smooth.set(o.uid,p);}
        if(Math.hypot(p.x-o.x,p.y-o.y)>110){p.x=o.x;p.y=o.y;}
        const k=Math.min(1,(1/60)*17);
        p.x+=(o.x-p.x)*k;p.y+=(o.y-p.y)*k;
        oldPos.push([o,o.x,o.y]);o.x=p.x;o.y=p.y;
      }
    }
    const oldFx=G.fx,oldRings=G.rings,oldPop=G.pop;
    const q=quality();
    if(q===0){G.fx=[];G.rings=[];G.pop=[];}
    else if(q<.95){
      G.fx=(oldFx||[]).filter((_,i)=>i%4 < Math.max(1,Math.round(q*4)));
    }
    try {
      oldDraw();
      if(q)drawLightning();
      if(q && G.ph==='battle')
        for(const o of G.bl||[])if(alive(o))drawStatus(o);
    } finally {
      G.fx=oldFx;G.rings=oldRings;G.pop=oldPop;
      for(const [o,x,y] of oldPos){o.x=x;o.y=y;}
    }
  };
  loop = function(t) {
    const elapsed=frameMark?Math.min(.07,Math.max(0,(t-frameMark)/1000)):1/60;
    frameMark=t;
    if(elapsed>.027){lowFrames++;highFrames=0;}
    else if(elapsed<.019){highFrames++;lowFrames=Math.max(0,lowFrames-1);}
    if(lowFrames>35){adaptive=Math.max(.35,adaptive-.13);lowFrames=0;}
    if(highFrames>240){adaptive=Math.min(1,adaptive+.12);highFrames=0;}
    if(G && (netRole==='guest'||G.ph==='end') && ['battle','end'].includes(G.ph)){
      updateEffects(elapsed);
      for(const o of G.bl||[])if(netRole==='guest'){
        o.flash=Math.max(0,(o.flash||0)-elapsed);
        o.attackGlow=Math.max(0,(o.attackGlow||0)-elapsed);
      }
    }
    if(G && !$('#game').hidden) {
      const key=G.matchId+':'+G.rn;
      if(visualRound!==key && netRole!=='guest')visualRound=key;
      const phase=key+':'+G.ph+':'+Boolean(G.finished);
      if(phase!==visualPhase){
        visualPhase=phase;
        if(netRole==='guest'){
          if(G.finished)banner(G.h[0]>0?'VICTORY!':'DEFEAT!',G.h[0]>0?'#fbbf24':'#8b5cf6');
          else if(G.ph==='battle')banner('ROUND START!','#38bdf8');
          else if(G.ph==='end')banner(G.lastRoundWinner<0?'DRAW!':G.lastRoundWinner===0?'VICTORY!':'DEFEAT!',G.lastRoundWinner===0?'#fbbf24':'#8b5cf6');
        } else if(G.finished)banner(G.h[0]>0?'VICTORY!':'DEFEAT!',G.h[0]>0?'#fbbf24':'#8b5cf6');
        else if(G.ph==='battle')banner('ROUND START!','#38bdf8');
      }
    }
    const canvas = $('#cv');
    if (canvas) {
      if (G && (G.shake||0)>0 && S.o.sk && quality()) {
        const s = G.shake;
        canvas.style.transform = 'translate(' + ((Math.random()-.5)*s*2).toFixed(1) + 'px,' + ((Math.random()-.5)*s*2).toFixed(1) + 'px)';
      } else canvas.style.transform = '';
    }
    if(G) {
      G.shake = Math.max(0,(G.shake||0)-elapsed*7);
      for(const l of G.lightning||[])l.life-=elapsed;
      G.lightning=(G.lightning||[]).filter(l=>l.life>0);
    }
    oldLoop(t);
  };
})();

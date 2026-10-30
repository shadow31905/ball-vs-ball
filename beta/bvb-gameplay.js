/* Ball VS Ball — Tactical Replayability Update
   Player decisions, fair round rules and cosmetic ball mastery.
   All combat modifiers are applied only by the authoritative host. */
(() => {
  'use strict';
  if (typeof G === 'undefined' || typeof draw !== 'function') return;
  const TACTICS = {
    balanced: {icon:'⚖️',name:'Balans',detail:'Bez zmian · losowe COMBO',color:'#cbd5e1'},
    strike: {icon:'⚔️',name:'Atak',detail:'+18% obrażeń · -10% HP · COMBO: wybuch',color:'#fb7185'},
    guard: {icon:'🛡️',name:'Obrona',detail:'+20% HP · -15% obrażeń · COMBO: moc',color:'#7dd3fc'},
    rush: {icon:'💨',name:'Szybkość',detail:'+26% prędkości · -8% obrażeń · COMBO: seria',color:'#facc15'}
  };
  const RULES = {
    standard: {icon:'⚖️',name:'Klasyczne starcie',desc:'Bez dodatkowych zasad'},
    turbo: {icon:'🚀',name:'TURBO',desc:'Obie kulki poruszają się o 25% szybciej'},
    guard: {icon:'🛡️',name:'BARIERA',desc:'Obie kulki zaczynają z tarczą 12 HP'},
    frenzy: {icon:'⚡',name:'SZYBKIE MOCE',desc:'Umiejętności odnawiają się o 25% szybciej'},
    clash: {icon:'💥',name:'POTĘŻNE UDERZENIA',desc:'Obie kulki zadają o 13% więcej obrażeń, ale są wolniejsze'}
  };
  const MISSIONS = {
    strike: {name:'Siła ataku',desc:'Wygraj rundę z taktyką Atak',reward:25},
    guard: {name:'Mocna obrona',desc:'Wygraj rundę z taktyką Obrona',reward:25},
    rush: {name:'Mistrz szybkości',desc:'Wygraj rundę z taktyką Szybkość',reward:25},
    balls: {name:'Dwie różne kulki',desc:'Wygraj rundy dwiema różnymi kulkami',reward:35},
    styles: {name:'Adaptacja',desc:'Wygraj rundy dwoma różnymi taktykami',reward:35}
  };
  let personalChoice = 'balanced', matchKey = '', panelKey = '';
  const oldDraw = draw, oldRoundEnd = roundEnd;
  const palette = document.createElement('style');
  palette.textContent =
    '#bvbTactics{margin:6px 0 10px;padding:10px;border:1px solid #44558c;border-radius:14px;background:linear-gradient(135deg,#111a39,#211a3f);color:#f8fafc}' +
    '#bvbTactics .bvb-rule{font-size:13px;margin:0 0 7px;padding:7px;background:#ffffff0b;border-radius:8px}' +
    '#bvbTactics .bvb-buttons{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}' +
    '#bvbTactics .bvb-tactic{font-size:12px;color:#eff6ff;background:#243055;border:1px solid #58618a;border-radius:9px;cursor:pointer;padding:7px 2px;line-height:1.2;min-height:48px}' +
    '#bvbTactics .bvb-tactic:focus-visible{outline:2px solid #a5f3fc}' +
    '#bvbTactics .bvb-tactic[aria-pressed="true"]{background:#385294;border:2px solid #facc15;color:#fff}' +
    '#bvbTactics .bvb-detail{font-size:12px;color:#dce6ff;min-height:18px;margin:6px 0 0}' +
    '#bvbTactics .bvb-hint{font-size:10px;color:#bac7f7;margin:3px 0 0}';
  document.head.appendChild(palette);

  const roundKey = g => g ? String(g.matchId) + ':' + String(g.rn) : '';
  const valid = s => Object.prototype.hasOwnProperty.call(TACTICS,s);
  function localTeam(g) { return netRole === 'guest' && g?.m === 12 ? 1 : 0; }
  function rule(g) { return RULES[g?.modifier] || RULES.standard; }
  function useChoice(g) {
    const key = roundKey(g);
    if (key !== matchKey) { matchKey = key; personalChoice = 'balanced'; panelKey = ''; }
    return personalChoice;
  }

  function selectTactic(name) {
    if (!valid(name) || !G || !['draft','aim'].includes(G.ph)) return;
    if (netRole === 'guest' && G.m === 12 && guestAimSent) return; // Lock after shooting.
    if (netRole === 'host' && G.m === 12 && hostAimAngle != null) return;
    useChoice(G);
    personalChoice = name;
    if (netRole === 'guest' && G.m === 12) {
      netSend({type:'tactic',tactic:name,matchId:G.matchId,rn:G.rn});
    } else {
      G.tactics ||= {0:'balanced',1:'balanced'};
      G.tactics[0] = name;
      if (G.m === 12) broadcastState();
    }
    panelKey = '';
    displayPanel();
    if (typeof SFX?.tick === 'function') SFX.tick();
  }

  function newMatch(g) {
    if (!g || g.m === 12 || g.m === 4 || netRole === 'guest') return;
    const keys=Object.keys(MISSIONS);
    g.mission={key:keys[Math.floor(Math.random()*keys.length)],complete:false,progress:[]};
  }
  function nextRule(g) {
    if (!g || netRole === 'guest') return;
    const keys = Object.keys(RULES).filter(k=>k!==g.lastModifier);
    const pick = keys[Math.floor(Math.random()*keys.length)];
    g.lastModifier = g.modifier = pick;
    g.tactics = {0:'balanced',1:Math.random()<.24?'balanced':(['strike','guard','rush'][Math.floor(Math.random()*3)])};
    // Easy bots do not randomly gain Guard (+20% HP) or Rush (+26% speed).
    // Medium bots may occasionally use a mild tactic, but never Rush.
    if(g.m===0&&typeof diff==='number'){
      if(diff===0)g.tactics[1]='balanced';
      else if(diff===1)g.tactics[1]=Math.random()<.18?(['strike','guard'][Math.floor(Math.random()*2)]):'balanced';
    }
    if(g.m===12)g.tactics[1] = 'balanced'; // Guest chooses their own stance.
    g.roundStartedAt = 0;
  }

  function prepareActors(g, p, e) {
    if (!g || netRole === 'guest') return;
    const list = [p,e];
    for(let i=0;i<2;i++){
      const o=list[i],name=g.tactics?.[i]||'balanced';
      o.tactic=valid(name)?name:'balanced';
      o.speedFactor=1;
      o.abilityRate=1;
      if(o.tactic==='strike'){o.hp*=.9;o.mh*=.9;o.baseDmg*=1.18;}
      if(o.tactic==='guard'){o.hp*=1.2;o.mh*=1.2;o.baseDmg*=.85;}
      if(o.tactic==='rush'){o.baseDmg*=.92;o.speedFactor*=1.26;}
      if(g.modifier==='turbo')o.speedFactor*=1.25;
      if(g.modifier==='guard')o.status.shield=12;
      if(g.modifier==='frenzy'){o.abilityRate=.75;o.abilityCd=Math.max(.4,o.abilityCd*.75);}
      if(g.modifier==='clash'){o.baseDmg*=1.13;o.speedFactor*=.92;}
    }
    g.roundStartedAt=Date.now();
    if(typeof burst==='function' && typeof effectType==='function'){
      for(const o of list){o.attackGlow=.35;burst(o,effectType(o.b),6,false);}
    }
  }

  function applyRemoteTactic(data) {
    if (!G || G.m!==12 || netRole!=='host' || !['draft','aim'].includes(G.ph))return false;
    if(data.matchId!==G.matchId || data.rn!==G.rn || !valid(data.tactic))return false;
    if(remoteAimAngle!==null)return false; // A committed shot cannot change its stance.
    G.tactics||={0:'balanced',1:'balanced'};
    G.tactics[1]=data.tactic;
    broadcastState();
    return true;
  }

  function resendTactic() {
    if (!G || netRole!=='guest' || G.m!==12 || !activeConn?.open) return;
    netSend({type:'tactic',tactic:useChoice(G),matchId:G.matchId,rn:G.rn});
  }

  function onGuestState(hostState) {
    if(!hostState || netRole!=='guest') return;
    useChoice(G);
    // The draw wrapper updates only when phase or tactic really changes.
  }

  function rank(id) {
    const d=S?.mastery?.[id];
    const wins=Math.max(0,d?.wins||0), fights=Math.max(0,d?.fights||0);
    const target=3*(1+Math.floor(wins/3)), lvl=1+Math.floor(wins/3);
    return {wins,fights,target,lvl:Math.min(9,lvl)};
  }
  function badge(id) {
    const d=rank(id);
    return '<small style="display:block;color:#fde68a">⭐ Mistrzostwo '+d.lvl+
      ' · '+d.wins+'/'+d.target+' wygranych do następnego poziomu</small>';
  }
  function displayPanel() {
    let el=document.getElementById('bvbTactics');
    if(!el){el=document.createElement('section');el.id='bvbTactics';el.setAttribute('aria-label','Taktyka rundy');$('#bset')?.insertAdjacentElement('afterend',el);}
    if(!G || $('#game')?.hidden || !['draft','aim','battle','end'].includes(G.ph)){el.hidden=true;return;}
    el.hidden=false;
    const current=useChoice(G),r=rule(G);
    const locked=G.ph!=='draft'&&G.ph!=='aim' || (netRole==='guest'&&G.m===12&&guestAimSent) || (netRole==='host'&&G.m===12&&hostAimAngle!=null);
    const effective = netRole==='guest' && G.m===12 ? current : G.tactics?.[0]||current;
    const mission = G.mission && MISSIONS[G.mission.key];
    const key = roundKey(G)+':'+G.ph+':'+r.name+':'+effective+':'+locked+':'+(G.mission?.complete||false)+':'+(G.mission?.progress?.length||0);
    if(key===panelKey)return;
    panelKey=key;
    const tip=TACTICS[effective] || TACTICS.balanced;
    el.innerHTML =
      (mission ? '<p class="bvb-rule" style="border-left:3px solid #facc15">'+
        '<b>🏅 Misja meczu: '+mission.name+'</b> · +'+mission.reward+' 🪙<span style="display:block;color:#cad7fa">'+
        (G.mission.complete?'✅ Wykonano!':mission.desc+(G.mission.progress?.length?' ('+G.mission.progress.length+'/2)':''))+
        '</span></p>':'')+
      '<p class="bvb-rule"><b>'+r.icon+' Zasada rundy: '+r.name+'</b><span style="display:block;color:#cad7fa">'+r.desc+'</span></p>'+
      '<b style="font-size:12px">🎯 Twoja taktyka na tę rundę'+(locked?' (wybrana)':' (wybierz przed strzałem)')+':</b>'+
      '<div class="bvb-buttons">'+Object.entries(TACTICS).map(([id,t])=>
        '<button type="button" class="bvb-tactic" aria-pressed="'+(effective===id)+'"'+(locked?' disabled':'')+
        ' onclick="window.BVBGameplay.selectTactic(\''+id+'\')">'+t.icon+'<span style="display:block">'+t.name+'</span></button>'
      ).join('')+'</div>'+
      '<p class="bvb-detail" style="color:'+tip.color+'">'+tip.detail+'</p>'+
      '<p class="bvb-hint">Taktyka ustawia też rodzaj COMBO. Zasada rundy działa jednakowo na obie kulki.</p>';
  }

  draw = function() { oldDraw(); displayPanel(); };
  function updateMission(winner, participant) {
    if(winner!==0 || !participant || !G?.mission || G.mission.complete || G.m===12 || G.m===4)return;
    const mission=G.mission, task=MISSIONS[mission.key];
    if(!task)return;
    const tactic=G.tactics?.[0]||'balanced';
    let fulfilled=false;
    if(['strike','guard','rush'].includes(mission.key))fulfilled=tactic===mission.key;
    else {
      const id=mission.key==='balls'?participant.b.id:tactic;
      if(!mission.progress.includes(id))mission.progress.push(id);
      fulfilled=mission.progress.length>=2;
    }
    if(fulfilled){
      mission.complete=true;
      S.coins=(S.coins||0)+task.reward;
      G.pop ||= [];
      G.pop.push({x:participant.x,y:Math.max(25,participant.y-55),text:'🏅 MISJA +'+task.reward+' 🪙',c:'#facc15',age:0,life:1.35});
    }
  }
  roundEnd = function(winner) {
    if(!G || G.ph!=='battle')return;
    const participant=G.bl?.find(o=>o.team===0);
    updateMission(winner,participant);
    if(participant && G.m!==12 && !participant.b?.isBoss){
      S.mastery ||= {};
      const id=participant.b.id;
      const old=rank(id), data=S.mastery[id] || {fights:0,wins:0};
      data.fights++;
      if(winner===0)data.wins++;
      S.mastery[id]=data;
      const newer=rank(id);
      if(newer.lvl>old.lvl && G.pop)G.pop.push({x:participant.x,y:Math.max(28,participant.y-45),text:'⭐ MISTRZOSTWO '+newer.lvl,c:'#fde68a',age:0,life:1.4});
      save();
    }
    oldRoundEnd(winner);
  };

  window.BVBGameplay = {TACTICS,RULES,MISSIONS,newMatch,newRound:nextRule,prepareActors,selectTactic,applyRemoteTactic,resendTactic,onGuestState,badge,rank,
    getTactic:()=>personalChoice,
    getRule:()=>G?.modifier||'standard'
  };
})();

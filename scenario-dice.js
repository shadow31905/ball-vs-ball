(()=>{
 const cases=[];
 function setup(tier){const p=actor(B[11],70,180,0,0,0,tier,0,0),e=actor(B[0],275,180,0,1,1,1,0,0);p.hp=200;p.mh=e.hp=e.mh=500;for(const o of [p,e]){o.vx=o.vy=0;o.abilityCd=Infinity;o.aiTarget={vx:0,vy:0};o.aiDecisionClock=Infinity;}G={m:0,ph:'battle',my:[B[11]],bt:[B[0]],h:[3,3],score:[0,0],rn:1,rt:0,simTick:0,bl:[p,e],fx:[],pop:[],rings:[],z:[],pr:[],events:[],obstacles:[],portal:null,th:1,rare:''};return[p,e];}
 function roll(p,e,n){let seed;for(seed=1;seed<10000;seed++){BVBRework.setSeed(G,seed);if(1+Math.floor(BVBRework.random()*6)===n)break;}BVBRework.setSeed(G,seed);specialAbility(p,e);return seed;}
 for(const tier of [1,2,3])for(let n=1;n<=6;n++){
  const[p,e]=setup(tier);const seed=roll(p,e,n);const detail={roll:p.v2LastRoll,shots:G.v2.shots.length,slow:e.status.slow||0,shield:p.status.shield||0,heal:p.hp-200,fire:G.v2.hazards.filter(h=>h.kind==='fire').length,poison:G.v2.hazards.filter(h=>h.kind==='poison').length,remembered:p.bvbDiceSeen||[]};
  const effect=[null,detail.shots>0,detail.slow>0,detail.shield>0,detail.heal===5+tier-1,detail.fire>0,detail.poison>0][n];
  cases.push({tier,roll:n,seed,detail,status:detail.roll===n&&effect&&(tier===1||detail.remembered.includes(n))?'PASS':'FAIL'});
 }
 for(const tier of [1,2,3]){const[p,e]=setup(tier);for(let n=1;n<=6;n++)roll(p,e,n);const jackpots=p.bvbDiceJackpots||0,remembered=p.bvbDiceSeen||[];const fresh=setup(tier)[0];cases.push({tier,scenario:'combination and reset',jackpots,remembered,status:(tier===3?jackpots===1&&remembered.length===0:jackpots===0)&&!fresh.bvbDiceSeen&&!fresh.bvbDiceJackpots?'PASS':'FAIL'});}
 return cases;
})()

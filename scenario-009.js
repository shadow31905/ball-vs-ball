(()=>{
 const cases=[];
 for(let id=0;id<13;id++)for(const tier of [1,2,3]){
  BVBBatch1Beta.setTier(tier);S.arenaPick='manual';S.th=1;S.arenaCfg[1]={obstacles:true,count:3,fx:true};
  startMatch(0);G.my=[B[id]];G.bt=[B[id===0?1:0]];BVBRework.setSeed(G,0x90200+id*4+tier);pick(0);
  for(const o of G.bl)o.hp=o.mh=5000;
  let ticks=0,finite=true;
  while(G.ph==='battle'&&G.rt<20&&ticks<6000){
   G.simTick=(G.simTick||0)+1;step(1/60);ticks++;
   if(!G.bl.every(o=>[o.x,o.y,o.vx,o.vy,o.hp].every(Number.isFinite)&&o.hp>=0&&o.hp<=o.mh)){finite=false;break;}
  }
  const actor=G.bl.find(o=>o.team===0),activations=actor?.combatStats?.abilities||0;
  cases.push({id,tier,ticks,time:G.rt,activations,finite,status:finite&&activations>=3?'PASS':'FAIL'});
 }
 return cases;
})()

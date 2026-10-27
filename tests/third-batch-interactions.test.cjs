'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const setup=String.raw`
function scenario(id,tier,foeId){
 serial=0;G=freshGame(4,[B[id]],[B[foeId]]);G.ph='battle';G.th=1;G.rt=1;
 G.matchId='third-batch-stress-'+id+'-'+tier+'-'+foeId;
 G.fx=[];G.pop=[];G.rings=[];
 G.obstacles=(id+foeId)%2===0?[{x:180,y:160,r:24,kind:'neon',moving:false}]:[];
 G.bl=[actor(B[id],75,178,0,0,0,tier,0,0),actor(B[foeId],255,178,Math.PI,1,1,1,0,0)];
 BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,330000+id*100+foeId+tier);
 for(const a of G.bl){a.hp=1000000;a.mh=1000000;a.baseDmg=12;a.vx=0;a.vy=0;a.abilityCd=999;a.contact=999;a.status={};a.identity=null;}
 return G.bl;
}
`;
const opponents=[0,6,16,24,31,32,35,40,43,47,64,90,129];
test('33–48 ability-vs-ability stress: 624 pairings across V1/V2/V3, changing obstacles, stable saves',()=>{
 const g=createGame(),reply=g.run(setup+`(()=>{
  const foes=[0,6,16,24,31,32,35,40,43,47,64,90,129],bugs=[],samples=[];
  const saveBefore=JSON.stringify(S),original=JSON.parse(saveBefore);
  for(let id=32;id<48;id++)for(let tier=1;tier<=3;tier++)for(const foeId of foes){
   const [a,b]=scenario(id,tier,foeId);
   specialAbility(a,b);specialAbility(b,a);
   let executed=0;
   for(let n=0;n<34&&G.ph==='battle';n++){step(1/60);executed++;}
   const vals=[G.rt,...G.bl.flatMap(a=>[a.x,a.y,a.vx,a.vy,a.hp,a.mh,a.r])];
   for(const p of G.v2?.shots||[])vals.push(p.x,p.y,p.vx,p.vy,p.life,p.damage);
   for(const h of G.v2?.hazards||[])vals.push(h.x,h.y,h.radius,h.life,h.power);
   const bad=vals.some(x=>!Number.isFinite(x))||
    (G.v2?.shots?.length||0)>80||(G.v2?.hazards?.length||0)>45||
    G.bl.some(a=>Math.abs(a.x)>100000||Math.abs(a.y)>100000);
   if(bad)bugs.push({id,tier,foeId,executed,hazards:G.v2?.hazards?.length,shots:G.v2?.shots?.length});
   samples.push({id,tier,foeId,executed});
  }
  const changedKeys=Object.keys(S).filter(k=>JSON.stringify(S[k])!==JSON.stringify(original[k]));
  return {bugs,samples:samples.length,progressionUnchanged:changedKeys.every(k=>k==='arenaCfg'||k==='lastArena'),changedKeys};
})()`);
 assert.equal(reply.samples,16*3*opponents.length);
 assert.equal(reply.progressionUnchanged,true,'Stress testing changed persistent rewards or unlocks: '+JSON.stringify(reply.changedKeys));
 assert.equal(reply.bugs.length,0,'Broken interaction(s): '+JSON.stringify(reply.bugs.slice(0,16)));
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

// Second manual audit: observable mechanics vs. user-facing skill descriptions,
// not just different animation colors or unique catalog text.
const fixture=`
function auditMatch(id,tier=1,distance=100){
  serial=0;
  G=freshGame(4,[B[id]],[B[0]]);G.matchId='audit-'+id;
  G.m=4;G.th=1;G.ph='battle';G.rt=1;G.obstacles=[];
  G.bl=[actor(B[id],110,180,0,0,0,tier,0,0),actor(B[0],110+distance,180,Math.PI,1,1,1,0,0)];
  BVBRework.prepareActors(G,...G.bl);
  for(const o of G.bl){
   o.hp=150;o.mh=200;o.baseDmg=12;o.abilityCd=999;o.contact=999;
   o.vx=0;o.vy=0;o.status={};
  }
  return G.bl;
}
`;
function play(expr){const g=createGame();return g.run(fixture+expr);}

test('09: dash collision applies one true knockback, with progressively stronger evolutions',()=>{
 const out=play(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditMatch(8,tier,80);
   specialAbility(a,b);
   BVB2.onContact(G,a,b,10);
   const v1=Math.hypot(b.vx,b.vy),after=a.skillImpact;
   BVB2.onContact(G,a,b,10);
   const v2=Math.hypot(b.vx,b.vy);
   r.push({tier,push:v1,repeat:v2,after});
  }return r;
 })()`);
 assert.ok(out.every(x=>x.push>0&&x.after===0),'collision must actually push once');
 assert.ok(out.every(x=>Math.abs(x.repeat-x.push)<1e-9),'knockback should not stack without recasting');
 assert.ok(out[0].push<out[1].push&&out[1].push<out[2].push);
});

test('10: energy dash produces a real shockwave with tier-dependent range',()=>{
 const out=play(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditMatch(9,tier,94),hp=b.hp;
   specialAbility(a,b);
   r.push({tier,damage:hp-b.hp,push:Math.hypot(b.vx,b.vy),visuals:G.v2?.effects?.filter(f=>f.kind==='ring').length||0});
  }return r;
 })()`);
 assert.equal(out[0].damage,0,'V1 wave radius is shorter than 94');
 assert.ok(out[1].damage>0&&out[2].damage>0,'V2/V3 extended wave actually hit at 94');
 assert.ok(out[1].push>0&&out[2].push>0,'wave should move the opponent');
 assert.ok(out.every(x=>x.visuals>0),'impact has a matching warning/visual');
});

test('11: chess movement uses a cardinal axis, attacks nearby, and evolutions add projectiles',()=>{
 const out=play(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditMatch(10,tier,75),hp=b.hp;
   specialAbility(a,b);
   r.push({tier,vx:a.vx,vy:a.vy,damage:hp-b.hp,shots:G.v2?.shots?.length||0});
  }return r;
 })()`);
 assert.ok(out.every(x=>x.vx===1&&x.vy===0&&x.damage>0));
 assert.deepEqual(Array.from(out,x=>x.shots),[0,2,4]); // shoot() adds the evolution stage to requested projectiles.
});

test('12: every side of the die performs its described real effect',()=>{
 const result=play(`(()=>{
  const rolled={};
  for(let seed=1;seed<=300;seed++){
   const [a,b]=auditMatch(11,1,110);
   BVBRework.setSeed(G,seed);
   specialAbility(a,b);
   const n=a.v2LastRoll;
   rolled[n]={shots:G.v2?.shots?.length||0,slow:b.status.slow||0,shield:a.status.shield||0,
    healed:a.hp-150,fire:G.v2?.hazards?.some(h=>h.kind==='fire')||false,
    poison:G.v2?.hazards?.some(h=>h.kind==='poison')||false};
  }
  return rolled;
 })()`);
 assert.deepEqual(Object.keys(result).sort(),['1','2','3','4','5','6']);
 assert.ok(result[1].shots>0);
 assert.ok(result[2].slow>0);
 assert.ok(result[3].shield>0);
 assert.ok(result[4].healed>0);
 assert.equal(result[5].fire,true);
 assert.equal(result[6].poison,true);
});

test('13: frost projectiles hit and apply actual slow; higher tiers increase count',()=>{
 const result=play(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditMatch(12,tier,90),hp=b.hp;
   specialAbility(a,b);const shots=G.v2?.shots?.length||0;
   let slow=0;for(let i=0;i<70&&G.ph==='battle';i++){step(1/60);slow=Math.max(slow,b.status.slow||0);}
   r.push({tier,shots,damage:hp-b.hp,slow});
  }return r;
 })()`);
 assert.deepEqual(Array.from(result,x=>x.shots),[3,4,5]);
 assert.ok(result.every(x=>x.damage>0&&x.slow>0));
});

test('14: real wall beams cause contact damage, and V2/V3 widen their hitboxes',()=>{
 const result=play(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditMatch(13,tier,120);
   b.x=a.x+15;b.y=a.y+105;
   BVB2.onWall(a,'left');
   const beam=G.v2?.wallBeams?.at(-1),hp=b.hp;
   for(let i=0;i<8;i++)step(1/60);
   r.push({tier,width:beam?.width,damage:hp-b.hp,slow:b.status.slow||0});
  }return r;
 })()`);
 assert.deepEqual(Array.from(result,x=>x.width),[2,4,6]);
 assert.ok(result.every(x=>x.damage>0&&x.slow>0));
});

test('15: serpent tail strikes trail crossings, poisons and expires',()=>{
 const result=play(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditMatch(14,tier,160);
   const hp=b.hp;
   a.trail=[{x:b.x,y:b.y}];
   specialAbility(a,b);
   const length=a.v2Tail?.length,life=a.v2Tail?.life;
   for(let i=0;i<12;i++)step(1/60);
   r.push({tier,length,life,damage:hp-b.hp,poison:b.status.poison||0});
  }return r;
 })()`);
 assert.deepEqual(Array.from(result,x=>x.length),[5,7,9]);
 assert.ok(result.every(x=>x.damage>0&&x.poison>0));
 assert.ok(result[0].life<result[1].life&&result[1].life<result[2].life);
});

test('16: the real tether pulls and slows enemies, stronger after evolution',()=>{
 const result=play(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditMatch(15,tier,150),hp=b.hp;
   specialAbility(a,b);
   r.push({tier,pull:b.vx,damage:hp-b.hp,slow:b.status.slow||0});
  }return r;
 })()`);
 assert.ok(result.every(x=>x.pull<0&&x.damage>0&&x.slow>0));
 assert.ok(Math.abs(result[0].pull)<Math.abs(result[1].pull)&&Math.abs(result[1].pull)<Math.abs(result[2].pull));
});

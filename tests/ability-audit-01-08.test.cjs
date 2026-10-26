'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

// Batch 01: prove observable effects for eight named abilities in the actual
// simulation. A unique VFX or differing V2/V3 JSON signature is not sufficient.
const SETUP=`
function auditFight(id,tier=1,distance=100){
  serial=0;
  G=freshGame(4,[B[id]],[B[0]]);
  G.matchId='ability-audit-'+id;
  G.m=4;G.th=1;G.ph='battle';G.rt=1;
  G.obstacles=[];G.pr=[];G.fx=[];G.rings=[];G.pop=[];
  G.bl=[actor(B[id],110,180,0,0,0,tier,0,0),actor(B[0],110+distance,180,Math.PI,1,1,1,0,0)];
  BVBRework.prepareActors(G,...G.bl);
  for(const o of G.bl){
    o.hp=150;o.mh=200;o.abilityCd=999;
    o.baseDmg=12;o.vx=0;o.vy=0;o.status={};
    o.contact=999;
  }
  return G.bl;
}
`;
function run(expression){const g=createGame();return g.run(SETUP+expression);}

test('01 Szarża: activation produces a real impact charge, with increasing V2/V3 charges',()=>{
 const out=run(`(()=>{
  const result=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(0,tier,100);
   specialAbility(a,b);
   result.push({tier,charge:a.skillCharge,impact:a.skillImpact,velocity:Math.hypot(a.vx,a.vy)});
  }
  return result;
 })()`);
 assert.deepEqual(Array.from(out,x=>x.charge),[1,2,3]);
 assert.ok(out.every(x=>x.impact>0&&x.velocity>0));
});

test('02 Topór: spinning blades physically strike, V2/V3 add blades and eventually expire',()=>{
 const out=run(`(()=>{
  const result=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(1,tier,37);
   specialAbility(a,b);
   const blades=a.axeOrbit.blades,initial=b.hp;
   for(let i=0;i<30;i++)step(1/60);
   const damaged=b.hp<initial;
   for(let i=0;i<220&&G.ph==='battle';i++)step(1/60);
   result.push({tier,blades,damaged,expired:!a.axeOrbit});
  }
  return result;
 })()`);
 assert.deepEqual(Array.from(out,x=>x.blades),[3,4,5]);
 assert.ok(out.every(x=>x.damaged),'the orbital visual must apply real damage');
 assert.ok(out.every(x=>x.expired),'orbital blades must not persist forever');
});

test('03 Kolec: rebounds create a damaging poisonous thorn area, enhanced at V2/V3',()=>{
 const out=run(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(2,tier,70);
   a.x=170;b.x=183;
   BVB2.onWall(a,'left');
   const h=G.v2?.hazards?.at(-1),before=b.hp;
   for(let i=0;i<12;i++)step(1/60);
   r.push({tier,kind:h?.kind,life:h?.max,radius:h?.radius,damage:before-b.hp,poison:b.status.poison||0});
  }
  return r;
 })()`);
 assert.ok(out.every(x=>x.kind==='thorn'&&x.damage>0&&x.poison>0));
 assert.ok(out[0].radius<out[1].radius&&out[1].radius<out[2].radius);
});

test('04 Złodziej: low HP means genuinely faster magic blades, V2/V3 fire more',()=>{
 const out=run(`(()=>{
  const r=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(3,tier,150);
   specialAbility(a,b);
   const high=G.v2.shots.slice().map(s=>Math.hypot(s.vx,s.vy));
   G.v2.shots=[];a.hp=25;
   specialAbility(a,b);
   const low=G.v2.shots.slice().map(s=>Math.hypot(s.vx,s.vy));
   r.push({tier,count:high.length,high:high[0],low:low[0]});
  }
  return r;
 })()`);
 assert.deepEqual(Array.from(out,x=>x.count),[2,3,4]);
 assert.ok(out.every(x=>x.low>x.high),'low HP must increase projectile speed');
});

test('05 Żywe Ostrza: later casts gain blades, but the count stays bounded',()=>{
 const out=run(`(()=>{
  const result=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(4,tier,100),counts=[];
   for(let i=0;i<12;i++){specialAbility(a,b);counts.push(a.axeOrbit?.blades);}
   result.push({tier,counts});
  }
  return result;
 })()`);
 assert.deepEqual(Array.from(out,x=>x.counts[0]),[3,4,5]);
 assert.ok(out.every(x=>x.counts[1]>x.counts[0]));
 assert.ok(out.every(x=>x.counts.every(c=>c<=6)));
});

test('06 Robot: mechanical volley really hits a stationary opponent, V2/V3 fire more',()=>{
 const out=run(`(()=>{
  const result=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(5,tier,160);
   specialAbility(a,b);
   const shots=G.v2?.shots?.length||0;
   const before=b.hp;
   for(let i=0;i<110&&G.ph==='battle';i++)step(1/60);
   result.push({tier,shots,damage:before-b.hp});
  }
  return result;
 })()`);
 assert.deepEqual(Array.from(out,x=>x.shots),[5,6,7]);
 assert.ok(out.every(x=>x.damage>0),'a volley must strike rather than just animate');
});

test('07 Pająk: two different wall rebounds produce persistent crossing damage and V3 poison',()=>{
 const out=run(`(()=>{
  const result=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(6,tier,70);
   a.x=20;a.y=180;G.rt=1;BVB2.onWall(a,'left');
   a.x=340;G.rt=1.2;BVB2.onWall(a,'right');
   const web=G.v2?.webs?.at(-1);
   b.x=180;b.y=180;
   const before=b.hp;
   for(let i=0;i<10;i++)step(1/60);
   result.push({tier,webs:G.v2?.webs?.length,stage:web?.stage,
    hpLoss:before-b.hp,poison:b.status.poison||0});
  }
  return result;
 })()`);
 assert.ok(out.every(x=>x.webs===1&&x.hpLoss>0),'crossing a web must cause damage');
 assert.deepEqual(Array.from(out,x=>x.stage),[0,1,2]);
 assert.ok(out[2].poison>0,'V3 web should actually poison the enemy');
});

test('08 Wampir: bite damages and heals, V2/V3 extend actual bite reach',()=>{
 const out=run(`(()=>{
  const result=[];
  for(let tier=1;tier<=3;tier++){
   const [a,b]=auditFight(7,tier,140),hp=a.hp,foeHp=b.hp;
   specialAbility(a,b);
   result.push({tier,heal:a.hp-hp,damage:foeHp-b.hp});
  }
  return result;
 })()`);
 assert.equal(out[0].damage,0,'V1 should dash when too far away to bite');
 assert.ok(out[1].heal>0&&out[1].damage>0);
 assert.ok(out[2].heal>0&&out[2].damage>0);
});

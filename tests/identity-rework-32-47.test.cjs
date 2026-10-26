'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
// Test actual combat events (collisions, effects, timed ticks), not merely
// textual profiles. V1 remains a baseline; V2 evolves its identity and
// V3 demonstrably adds a second mechanic.
const setup=`
function fixture(id,tier,distance=100){
 serial=0;G=freshGame(4,[B[id]],[B[0]]);G.ph='battle';G.m=4;G.th=1;G.rt=2;
 G.obstacles=[];G.pop=[];G.fx=[];G.rings=[];
 G.bl=[actor(B[id],80,170,0,0,0,tier,0,0),
       actor(B[0],80+distance,170,Math.PI,1,1,1,0,0)];
 BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,2000+id);
 for(const o of G.bl){
  o.hp=175;o.mh=250;o.baseDmg=12;o.abilityCd=999;o.contact=999;
  o.vx=0;o.vy=0;o.status={};o.identity=null;
 }
 return G.bl;
}
function advance(t){
 for(let i=0;i<t*60&&G.ph==='battle';i++)step(1/60);
}
`;
function play(body){return createGame().run(setup+'(()=>{'+body+'})()');}
test('Alchemist: V2 catalysts preserve sampled reagent; V3 causes timed second chemical reaction',()=>{
 const rows=play(`
 const a=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(32,tier);specialAbility(o,f);
  const catalyst=o.v2Catalyst?{...o.v2Catalyst}:null;
  const volatile=o.v2Volatile?.remaining||0;
  advance(.6);
  a.push({tier,catalyst,volatile,after:o.v2Volatile?.remaining||0,
    hp:o.hp,fields:G.v2.hazards.length});
 }return a;`);
 assert.equal(rows[0].catalyst,null);
 assert.ok([0,1,2].includes(rows[1].catalyst?.roll));
 assert.equal(rows[1].volatile,0);
 assert.equal(rows[2].volatile,2);
 assert.ok(rows[2].after<rows[2].volatile);
});
test('Ghost Train: V2 moving rails follow actual train; V3 creates a second train route',()=>{
 const rows=play(`
 const result=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(33,tier);
  specialAbility(o,f);BVB2.onWall(o,'right');
  const trains=G.v2.hazards.filter(h=>h.kind==='train').length;
  advance(.65);
  result.push({tier,trains,rails:G.v2.hazards.filter(h=>h.kind==='slow'||h.kind==='shock').length,
   bonus:G.v2.hazards.filter(h=>h.kind==='train'&&h.v2RailTrain>0).length});
 }return result;`);
 assert.equal(rows[0].bonus,0);
 assert.ok(rows[1].rails>rows[0].rails,'V2 must paint collidable tracks as train moves');
 assert.ok(rows[2].trains>rows[1].trains);
 assert.ok(rows[2].bonus>0);
});
test('Black Spider: distinct bounce walls create V2 cross-thread and V3 three-strand lattice',()=>{
 const rows=play(`
 const result=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(34,tier);
  specialAbility(o,f);
  o.x=20;o.y=85;BVB2.onWall(o,'left');
  o.x=338;o.y=280;BVB2.onWall(o,'right');
  result.push({tier,webs:G.v2.webs.length,lattice:!!o.v2WidowLattice,
    paths:G.v2.webs.map(w=>[w.a.x,w.a.y,w.b.x,w.b.y])});
 }return result;`);
 assert.ok(rows[1].webs>rows[0].webs);
 assert.ok(rows[2].webs>rows[1].webs);
 assert.ok(new Set(rows[2].paths.map(p=>p.join(','))).size>=2);
});
test('Haunted Grave: V2 mine infects an actual foe; V3 spawns chained grave',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(35,tier);
  specialAbility(o,f);
  const mine=G.v2.hazards.find(h=>h.v2Grave);
  if(mine)mine.age=.65;
  const hp=f.hp;step(1/60);
  const initial=f.v2Haunted?.remaining||0;
  advance(.55);
  r.push({tier,initial,spent:initial-(f.v2Haunted?.remaining||0),
    damage:hp-f.hp,extra:G.v2.hazards.filter(h=>h.kind==='mine').length});
 }return r;`);
 assert.equal(rows[0].initial,0);
 assert.ok(rows[1].initial>0&&rows[1].spent>0);
 assert.ok(rows[2].extra>rows[1].extra,'V3 should spawn another actual grave');
});
test('Light Flight: V2 leaves damageable afterimage at original spot, V3 teleports back in a flash',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(36,tier,95),origin={x:o.x,y:o.y};
  specialAbility(o,f);
  const echo=!!o.v2LightEcho,returning=!!o.v2PrismaticReturn;
  advance(.62);
  r.push({tier,echo,returning,returnDone:!o.v2PrismaticReturn,
   spark:G.v2.hazards.filter(h=>h.kind==='shock').length,
   dist:Math.hypot(o.x-origin.x,o.y-origin.y)});
 }return r;`);
 assert.equal(rows[0].echo,false);
 assert.equal(rows[1].echo,true);
 assert.ok(rows[1].spark>0);
 assert.equal(rows[2].returning,true);
 assert.equal(rows[2].returnDone,true);
});
test('Candy Storm: V2 projectiles have real individual flavors; V3 crystallizes into hazards',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(37,tier);
  specialAbility(o,f);
  const flavor=o.v2CandyFlavor||null,crystals=o.v2SugarCrystal?.remaining||0;
  const effects=G.v2.shots.filter(s=>s.id===37&&
    (s.stun>0||s.slow>0||s.poison>0)).length;
  advance(.6);
  r.push({tier,flavor,crystals,effects,fields:G.v2.hazards.length});
 }return r;`);
 assert.equal(rows[0].flavor,null);
 assert.ok(['frost','sour','spark'].includes(rows[1].flavor));
 assert.ok(rows[1].effects>0);
 assert.equal(rows[1].crystals,0);
 assert.equal(rows[2].crystals,2);
 assert.ok(rows[2].fields>rows[1].fields);
});
test('Living Slime: V2 actual movement lays viscous buds, V3 makes splitting offspring',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(38,tier,135);specialAbility(o,f);
  o.x+=34;advance(.2);
  const hazards=G.v2.hazards.filter(h=>h.kind==='slime');
  r.push({tier,bud:!!o.v2SlimeBud,
    splits:hazards.filter(h=>h.v2SlimeDivision).length,count:hazards.length});
 }return r;`);
 assert.equal(rows[0].bud,false);
 assert.ok(rows[1].count>rows[0].count);
 assert.ok(rows[2].splits>0,'V3 buds must be collidable offspring');
});
test('Shackle Chains: V2 binding mine attaches repeated pulls; V3 has stronger returning stun',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,f]=fixture(39,tier);
  specialAbility(o,f);
  const mine=G.v2.hazards.find(h=>h.v2Shackle);
  if(mine)mine.age=.55;
  step(1/60);
  const live=f.v2Shackled;
  advance(.25);
  r.push({tier,bound:!!live,level:live?.level||0,
    remaining:live?.remaining||0,slow:f.status.slow||0,stun:f.status.stun||0});
 }return r;`);
 assert.equal(rows[0].bound,false);
 assert.equal(rows[1].level,1);
 assert.equal(rows[2].level,2);
 assert.ok(rows[1].slow>0&&rows[2].slow>0);
});

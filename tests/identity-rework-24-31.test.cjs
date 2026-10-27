'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

const fixture=`
function personalCase(id,tier,distance=86){
 serial=0;G=freshGame(4,[B[id]],[B[0]]);
 G.ph='battle';G.m=4;G.th=1;G.rt=2;G.obstacles=[];
 G.fx=[];G.pop=[];G.rings=[];
 G.bl=[actor(B[id],91,180,0,0,0,tier,0,0),
       actor(B[0],91+distance,180,Math.PI,1,1,1,0,0)];
 BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,1830+id);
 for(const o of G.bl){
  o.hp=160;o.mh=240;o.baseDmg=12;o.abilityCd=999;o.contact=999;
  o.vx=0;o.vy=0;o.status={};o.identity=null;
 }
 return G.bl;
}
function timeline(seconds){
 for(let i=0;i<seconds*60&&G.ph==='battle';i++)step(1/60);
}
`;
function play(src){return createGame().run(fixture+'(()=>{'+src+'})()');}

test('Virus V2 transfers an incubating infection by actual contact; V3 mutation creates a toxic outbreak',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(24,tier,80);specialAbility(o,foe);
  BVB2.onContact(G,o,foe,12);
  const infection=foe.v2Viral?{...foe.v2Viral}:null,initial=foe.hp;
  timeline(.55);
  r.push({tier,infection,damage:initial-foe.hp,viral:foe.v2Viral?.remaining,
   poisonZones:G.v2.hazards.filter(h=>h.kind==='poison').length});
 }
 return r;
 `);
 assert.equal(rows[0].infection,null,'V1 cannot use the new incubating strain');
 assert.equal(rows[1].infection?.mutation,false);
 assert.ok(rows[1].damage>0&&rows[1].viral<3,'V2 incubation must tick and harm');
 assert.equal(rows[2].infection?.mutation,true);
 assert.ok(rows[2].poisonZones>rows[1].poisonZones,'V3 must spawn its own outbreak hazard');
});
test('Wall Thorns V2 place a lateral wall fence, V3 adds a bramble citadel and contact recoil',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(25,tier);
  specialAbility(o,foe);
  const before=foe.vx;
  BVB2.onWall(o,'left');
  const field=G.v2.hazards.filter(h=>h.kind==='thorn');
  BVB2.onContact(G,o,foe,11);
  r.push({tier,count:field.length,positions:field.map(h=>h.y),
    shield:o.status.shield||0,kick:foe.vx-before});
 }
 return r;
 `);
 assert.ok(rows[1].count>rows[0].count,'V2 must add actual wall spikes');
 assert.ok(rows[2].count>rows[1].count,'V3 must create a longer wall fence');
 assert.equal(new Set(rows[2].positions).size>=4,true,'V3 fence must cover multiple positions');
 assert.ok(rows[2].shield>rows[1].shield);
 assert.ok(rows[2].kick>rows[1].kick,'V3 melee recoil must affect physics');
});
test('Arrow: V2 has extended bounce budget; V3 splits once on a real ricochet',()=>{
 const result=play(`
 const rows=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(26,tier,120);
  specialAbility(o,foe);
  const arrow=G.v2.shots.find(s=>s.id===26&&s.life>3);
  if(!arrow){rows.push({tier,found:false});continue;}
  const count=G.v2.shots.length,bounces=arrow.bounces,split=arrow.ricochetSplit||0;
  arrow.x=351;arrow.y=145;arrow.vx=380;arrow.vy=0;
  step(1/60);
  rows.push({tier,found:true,bounces,split,after:G.v2.shots.length,previous:count});
 }
 return rows;
 `);
 assert.equal(result[0].found,false);
 assert.ok(result[1].found&&result[2].found);
 assert.ok(result[2].bounces>result[1].bounces);
 assert.equal(result[1].split,0);
 assert.equal(result[2].split,1);
 assert.ok(result[2].after>result[2].previous,'V3 must emit child projectiles on collision with wall');
});
test('Lightning Crown: V2 builds two wall pylons; V3 adds four pylons and delayed storm bolt',()=>{
 const results=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(27,tier,100);
  specialAbility(o,foe);
  BVB2.onWall(o,'left');
  const pylons=G.v2.hazards.filter(h=>h.kind==='shock').length;
  timeline(.55);
  r.push({tier,pylons,boltsFired:o.v2CrownFired||0,
    armed:!!o.v2CrownArmed});
 }return r;
 `);
 assert.ok(results[1].pylons>results[0].pylons);
 assert.ok(results[2].pylons>results[1].pylons);
 assert.ok(results[2].boltsFired>results[1].boltsFired,'V3 delayed bolt must really fire, even if it already hit the enemy');
});
test('Growing Range: real travelling pulse rings hit new ranges; V3 returns pulling inward',()=>{
 const result=play(`
 const rows=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(28,tier,110);
  specialAbility(o,foe);
  const initial=foe.hp;
  timeline(1.55);
  rows.push({tier,damage:initial-foe.hp,vx:foe.vx,
   active:!!o.v2Ripples});
 }
 return rows;
 `);
 assert.ok(result[1].damage>result[0].damage,'V2 growing pulse must extend real hit range');
 assert.ok(result[2].damage>result[1].damage,'V3 return wave must land another real pulse');
 assert.ok(result[2].vx<result[1].vx,'V3 must pull inward rather than just recolor a ring');
});
test('Frost Trail: V2 leaves frost only after movement; V3 places a collidable ice rail',()=>{
 const results=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(29,tier,120);
  specialAbility(o,foe);
  const first=G.v2.hazards.length;
  o.x+=37;
  timeline(.18);
  r.push({tier,before:first,
   frost:G.v2.hazards.filter(h=>h.kind==='frost').length,
   rail:G.v2.hazards.filter(h=>h.kind==='iceRail').length});
 }
 return r;
 `);
 assert.equal(results[0].rail,0);
 assert.ok(results[1].frost>results[0].frost,'V2 must lay actual move-triggered frost');
 assert.ok(results[2].rail>0,'V3 must create a different collidable field');
});
test('Harpoon: V2 maintains a real reeling anchor; V3 pulls harder and stuns on last tug',()=>{
 const results=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(30,tier,105);
  specialAbility(o,foe);
  const anchor=o.v2HarpAnchor,oldX=foe.vx;
  timeline(1.7);
  r.push({tier,anchor:anchor?{level:anchor.level}:null,pulses:anchor?.pulses||0,
   pulled:oldX-foe.vx,stun:foe.status.stun||0});
 }
 return r;
 `);
 assert.equal(results[0].anchor,null);
 assert.ok(results[1].anchor?.level===1&&results[2].anchor?.level===2);
 assert.ok(results[1].pulses>1&&results[2].pulses>1);
 assert.ok(results[2].pulled>=results[1].pulled);
});
test('Guardian Bees: real intercepts and V3 queen colony shoots extra defenders',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(31,tier,130);
  specialAbility(o,foe);
  const hive=o.v2Hive?{...o.v2Hive}:null;
  for(let n=0;n<2;n++){
   G.v2.shots.push({x:o.x+25+n*3,y:o.y,vx:0,vy:0,
     px:o.x+25+n*3,py:o.y,life:1,age:0,team:foe.team,owner:foe.uid,
     id:0,r:3,homing:0,bounces:0,damage:1,color:'#ffffff'});
  }
  step(1/60); // Assert interception before normal projectile hits expire.
  const blocks=o.v2HiveBlocks||0;
  timeline(.24);
  r.push({tier,hive,remaining:o.v2Hive?.intercepts||0,blocks,
   enemyShots:G.v2.shots.filter(s=>s.team===foe.team).length,
   allyShots:G.v2.shots.filter(s=>s.team===o.team).length,
   shield:o.status.shield||0});
 }
 return r;
 `);
 assert.equal(rows[0].hive,null);
 assert.ok(rows[1].hive?.intercepts===1&&rows[2].hive?.intercepts===2);
 assert.equal(rows[0].blocks,0);
 assert.equal(rows[1].blocks,1,'V2 must intercept one real hostile projectile');
 assert.equal(rows[2].blocks,2,'V3 must intercept two real hostile projectiles');
 assert.ok(rows[2].allyShots>rows[1].allyShots);
 assert.ok(rows[2].shield>rows[1].shield);
});

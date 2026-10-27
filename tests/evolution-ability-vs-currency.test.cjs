'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
test('all 130 identities keep HP and base damage independent from evolution stages',()=>{
 const game=createGame();
 const rows=game.run('Array.from({length:130},(_,id)=>[1,2,3].map(t=>getBallStats(id,t,0,0)))');
 assert.equal(rows.length,130);
 for(let id=0;id<130;id++){
  const levels=rows[id];assert.equal(levels.length,3);
  for(const stage of [1,2]){
   assert.equal(levels[stage].hp,levels[0].hp,'Evolution gave free HP to '+id);
   assert.equal(levels[stage].dmg,levels[0].dmg,'Evolution gave free damage to '+id);
  }
 }
});
test('purchased currency upgrades increase HP and damage separately at every stage',()=>{
 const game=createGame();
 const rows=game.run('Array.from({length:130},(_,id)=>[1,2,3].map(t=>({none:getBallStats(id,t,0,0),health:getBallStats(id,t,4,0),damage:getBallStats(id,t,0,4)})))');
 for(let id=0;id<130;id++)for(let stage=0;stage<3;stage++){
  const {none,health,damage}=rows[id][stage];
  assert.ok(health.hp>none.hp,'HP purchase ineffective for '+id);
  assert.equal(health.dmg,none.dmg,'HP purchase changed damage for '+id);
  assert.ok(damage.dmg>none.dmg,'damage purchase ineffective for '+id);
  assert.equal(damage.hp,none.hp,'damage purchase changed HP for '+id);
 }
});
const setup='function seedCactus(stage){serial=0;G=freshGame(4,[B[45]],[B[0]]);G.ph="battle";G.rt=2;G.th=1;G.obstacles=[];G.bl=[actor(B[45],105,180,0,0,0,stage,0,0),actor(B[0],179,180,Math.PI,1,1,1,0,0)];BVBRework.prepareActors(G,...G.bl);for(const o of G.bl){o.hp=160;o.mh=220;o.baseDmg=11;o.abilityCd=999;o.vx=o.vy=0;o.status={};}return G.bl;}';
test('Cactus uses rooted thorn seedlings and close-contact bloom instead of copying a rifle volley',()=>{
 const g=createGame();
 const data=g.run(setup+'(()=>{const [o,f]=seedCactus(1);specialAbility(o,f);const seeds=G.v2.hazards.filter(h=>h.v1CactusSeed),shots=G.v2.shots.filter(s=>s.id===45).length;BVB2.onContact(G,o,f,10);const bloom=G.v2.hazards.filter(h=>h.v1CactusSeed).length;BVB2.onContact(G,o,f,10);return {seeds:seeds.length,shots,bloom,repeat:G.v2.hazards.filter(h=>h.v1CactusSeed).length,armed:seeds.every(h=>h.armAt>0),counter:o.v1CactusBlooms};})()');
 assert.equal(data.seeds,3);
 assert.equal(data.shots,0);
 assert.equal(data.bloom,9);
 assert.equal(data.repeat,9);
 assert.equal(data.counter,1);
 assert.equal(data.armed,true);
});
test('Cactus V2 and V3 preserve unique planted seeds while extending defensive counters',()=>{
 const g=createGame();
 const data=g.run(setup+'(()=>{const states=[];for(let t=1;t<=3;t++){const [o,f]=seedCactus(t);specialAbility(o,f);const seedCount=G.v2.hazards.filter(h=>h.v1CactusSeed).length;const shotsBefore=G.v2.shots.length;const hpBefore=f.hp;BVB2.onContact(G,o,f,10);states.push({tier:t,seeds:seedCount,counter:o.v2ArmorCounters||0,damage:hpBefore-f.hp,shots:G.v2.shots.length-shotsBefore});}return states;})()');
 assert.ok(data.every(x=>x.seeds===3));
 assert.equal(data[0].counter,0);
 assert.ok(data[1].counter>0);
 assert.ok(data[2].counter>0);
 assert.ok(data[2].shots>data[1].shots);
});

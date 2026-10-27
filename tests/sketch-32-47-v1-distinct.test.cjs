'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const setup='function prepared(id,tier){serial=0;G=freshGame(4,[B[id]],[B[0]]);G.ph="battle";G.rt=2;G.m=4;G.th=1;G.obstacles=[];G.pop=[];G.fx=[];G.rings=[];G.bl=[actor(B[id],80,180,0,0,0,tier,0,0),actor(B[0],180,180,Math.PI,1,1,1,0,0)];BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,id+4100);for(const o of G.bl){o.hp=180;o.mh=240;o.baseDmg=12;o.abilityCd=999;o.contact=999;o.vx=o.vy=0;o.status={};}return G.bl;}function pass(seconds){for(let i=0;i<seconds*60&&G.ph==="battle";i++)step(1/60);}';
function play(js){return createGame().run(setup+'(()=>{'+js+'})()');}
test('Potion V1 has three actual reagent zones rather than a generic shield',()=>{
 const r=play('let rows=[];for(let seed=1;seed<30;seed++){const [o,f]=prepared(32,1);BVBRework.setSeed(G,seed*83);specialAbility(o,f);rows.push({element:o.v1LastReagent,zones:G.v2.hazards.filter(h=>h.v1Elixir).map(h=>h.kind)});}return rows;');
 assert.ok(r.every(x=>['fire','frost','poison'].includes(x.element)));
 assert.ok(r.every(x=>x.zones.length===1&&x.zones[0]===x.element));
});
test('Cactus V1 makes ricocheting plant shots',()=>{
 const r=play('const [o,f]=prepared(45,1);specialAbility(o,f);return {launches:o.v1CactusLaunches,shots:G.v2.shots.filter(s=>s.id===45).map(s=>({bounces:s.bounces,poison:s.poison}))};');
 assert.equal(r.launches,1);
 assert.ok(r.shots.length>=2);
 assert.ok(r.shots.every(s=>s.bounces>=3&&s.poison>0));
});
test('Black Spider has venom nests instead of ordinary web bridges',()=>{
 const r=play('const [o,f]=prepared(34,1);BVB2.onWall(o,"left");return {webs:G.v2.webs.length,nests:G.v2.hazards.filter(h=>h.v1WidowNest).length};');
 assert.equal(r.webs,0);assert.equal(r.nests,1);
});
test('Candy glaze and Gas drift are mechanically distinct V1 signatures',()=>{
 const r=play('const out=[];for(const id of [37,42]){const [o,f]=prepared(id,1);specialAbility(o,f);out.push({id,glazes:o.v1CandyGlazes||0,slowZones:G.v2.hazards.filter(h=>h.v1CandyGlaze).length,gas:G.v2.hazards.filter(h=>h.v1Gas).map(h=>({vx:h.vx,vy:h.vy}))});}return out;');
 assert.equal(r[0].glazes,1);assert.equal(r[0].slowZones,1);
 assert.ok(r[1].gas.length>=1);assert.ok(r[1].gas[0].vx!==0);
});
test('all forty-eight upgraded combat variants simulate with finite values',()=>{
 const rows=play('const a=[];for(let id=32;id<48;id++)for(let tier=1;tier<=3;tier++){const [o,f]=prepared(id,tier);specialAbility(o,f);pass(.7);a.push({id,tier,valid:G.bl.every(x=>[x.x,x.y,x.hp,x.vx,x.vy].every(Number.isFinite))});}return a;');
 assert.equal(rows.length,48);assert.ok(rows.every(x=>x.valid));
});

test('currency upgrades grow HP/damage while all three evolution tiers retain the same base stats',()=>{
 const result=createGame().run('Array.from({length:16},(_,index)=>{const id=index+32;const tiers=[1,2,3].map(t=>getBallStats(id,t,0,0));const improved=getBallStats(id,1,2,2);return {id,tiers:tiers.map(s=>({hp:s.hp,dmg:s.dmg})),improved:{hp:improved.hp,dmg:improved.dmg}};})');
 for(const row of result){
  assert.equal(row.tiers[0].hp,row.tiers[1].hp,row.id+' V2 HP');
  assert.equal(row.tiers[0].hp,row.tiers[2].hp,row.id+' V3 HP');
  assert.equal(row.tiers[0].dmg,row.tiers[1].dmg,row.id+' V2 base damage');
  assert.equal(row.tiers[0].dmg,row.tiers[2].dmg,row.id+' V3 base damage');
  assert.ok(row.improved.hp>row.tiers[0].hp);
  assert.ok(row.improved.dmg>row.tiers[0].dmg);
 }
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const fixture='function first16Scenario(id,tier){serial=0;G=freshGame(0,[B[id]],[B[(id+1)%130]]);G.ph="battle";G.th=1;G.rt=2;G.obstacles=[];G.bl=[actor(B[id],90,180,0,0,0,tier,0,0),actor(B[(id+1)%130],205,180,Math.PI,1,1,1,0,0)];BVBRework.prepareActors(G,...G.bl);for(const o of G.bl){o.hp=100;o.mh=200;o.baseDmg=12;o.status={};o.vx=o.vy=0;o.abilityCd=999;}return G.bl;}';
const keys=['bvbRushWindow','bvbAxeReturn','bvbBriarUntil','bvbStolenKnives',
 'bvbSpiral','bvbRifleHeat','bvbSpiderWebStage','bvbBloodBank',
 'bvbSpearFollow','bvbBurstEcho','bvbChessCombo','bvbDiceSeen',
 'bvbIceGrowth','bvbLaserScan','bvbShedReady','bvbHookSwing'];
test('every original ball retains its original ability and gains a named, distinct V2/V3',()=>{
 const g=createGame();
 const values=g.run('({descs:BVBFirstSixteen.descriptions,ids:Array.from({length:16},(_,i)=>[BVB2.evolutionDescription(i,1),BVB2.evolutionDescription(i,2),BVB2.evolutionDescription(i,3)])})');
 assert.equal(values.descs.length,16);
 const upgrades=new Set();
 for(let id=0;id<16;id++){
  const [a,b,c]=values.ids[id];
  assert.match(a,/V1:/);assert.match(b,/V2:/);assert.match(c,/V3:/);
  assert.notEqual(b,c);assert.ok(!upgrades.has(b));assert.ok(!upgrades.has(c));
  upgrades.add(b);upgrades.add(c);
 }
 assert.equal(upgrades.size,32);
});
test('each V2 and V3 casts an observable, bounded identity-specific action',()=>{
 const g=createGame(),result=g.run(fixture+'(()=>{const out=[];for(let id=0;id<16;id++){const stages=[];for(let tier=1;tier<=3;tier++){const [o,f]=first16Scenario(id,tier);specialAbility(o,f);stages.push({id,tier,traits:Object.fromEntries(Object.keys(o).filter(k=>k.startsWith("bvb")).map(k=>[k,o[k]])),shots:G.v2?.shots?.length||0,hazards:G.v2?.hazards?.length||0,delta:Math.hypot(o.vx,o.vy),hp:f.hp,foeStatus:f.status});}out.push(stages);}return out;})()');
 assert.equal(result.length,16);
 for(let id=0;id<16;id++){
  const stages=result[id];
  assert.ok(keys[id] in stages[1].traits,'Missing V2 mechanic '+id+' '+keys[id]);
  assert.ok(keys[id] in stages[2].traits,'Missing V3 mechanic '+id);
  assert.ok(stages.every(x=>x.shots<=80&&x.hazards<=45&&Number.isFinite(x.hp)));
  assert.ok(JSON.stringify(stages[0])!==JSON.stringify(stages[1]));
  assert.ok(JSON.stringify(stages[1])!==JSON.stringify(stages[2]));
 }
});
test('V3 creates physical wall consequences without replacing V1 effects',()=>{
 const g=createGame();
 const list=g.run(fixture+'(()=>{const ids=[0,2,6,9,12,14,15],results=[];for(const id of ids){const [o,f]=first16Scenario(id,3);specialAbility(o,f);o.x=17;o.y=170;BVB2.onWall(o,"left");const s=G.v2;o.x=343;o.y=185;G.rt+=.25;BVB2.onWall(o,"right");results.push({id,ricochets:o.bvbRicochets||0,briars:o.bvbBriarBranches||0,webs:s.webs.length,cocoons:o.bvbCocoons||0,reflected:o.bvbReflectedWaves||0,icicles:o.bvbIcicles||0,shedding:o.bvbShedding||0,swing:o.bvbHookWall||0,hazards:s.hazards.length});}return results;})()');
 const lookup=Object.fromEntries(list.map(x=>[x.id,x]));
 assert.ok(lookup[0].ricochets>=1);
 assert.ok(lookup[2].briars>=1);
 assert.ok(lookup[6].cocoons>=1);
 assert.ok(lookup[9].reflected>=1);
 assert.ok(lookup[12].icicles>=3);
 assert.ok(lookup[14].shedding>=1);
 assert.ok(lookup[15].swing>=1);
});
test('V2/V3 mechanics run in the real fixed-step game without invalid physics',()=>{
 const g=createGame();
 const values=g.run(fixture+'(()=>{const out=[];for(let id=0;id<16;id++){const [a,b]=first16Scenario(id,3);specialAbility(a,b);for(let i=0;i<180&&G.ph==="battle";i++)step(1/60);out.push({id,valid:G.bl.every(o=>[o.x,o.y,o.hp,o.vx,o.vy].every(Number.isFinite)),shots:G.v2?.shots?.length||0,hazards:G.v2?.hazards?.length||0});}return out;})()');
 assert.equal(values.length,16);
 assert.ok(values.every(x=>x.valid&&x.shots<=80&&x.hazards<=45));
});
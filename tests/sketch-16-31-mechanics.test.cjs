'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const fixture='function liveCase(id,tier){serial=0;G=freshGame(4,[B[id]],[B[0]]);G.ph="battle";G.m=4;G.rt=2;G.th=1;G.obstacles=[];G.fx=[];G.pop=[];G.rings=[];G.bl=[actor(B[id],90,180,0,0,0,tier,0,0),actor(B[0],184,180,Math.PI,1,1,1,0,0)];BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,3411+id);for(const o of G.bl){o.hp=175;o.mh=220;o.baseDmg=11;o.abilityCd=999;o.contact=999;o.vx=o.vy=0;o.status={};}return G.bl;}';
function play(js){return createGame().run(fixture+'(()=>{'+js+'})()');}
test('WDC grid and electro king wall-powered circuit are different in V1 V2 V3',()=>{
 const a=play('const rows=[];for(let id of [21,27])for(let tier=1;tier<=3;tier++){const [o,f]=liveCase(id,tier);specialAbility(o,f);let st=G.v2;rows.push({id,tier,grid:st.hazards.filter(h=>h.kind==="grid").length,charge:!!o.v1CrownCircuit,shock:st.hazards.filter(h=>h.kind==="shock").length});}return rows;');
 for(let tier=1;tier<=3;tier++){
  const wdc=a.find(x=>x.id===21&&x.tier===tier),king=a.find(x=>x.id===27&&x.tier===tier);
  assert.ok(wdc.grid>=9);
  assert.ok(king.grid<wdc.grid);
  assert.equal(king.charge,true);
  assert.ok(king.shock>=1);
 }
});
test('V1 virus infects through contact without copying an acid puddle',()=>{
 const r=play('const [o,f]=liveCase(24,1);specialAbility(o,f);const ground=G.v2.hazards.filter(h=>h.kind==="poison").length;BVB2.onContact(G,o,f,11);return {ground,carrier:!!o.v1VirusCarrier,infection:f.status.poison||0};');
 assert.equal(r.ground,0);assert.equal(r.carrier,true);assert.ok(r.infection>0);
});
test('V1 frost wake is movement-based instead of being an ice cone projectile fan',()=>{
 const a=play('let rows=[];for(let id of [12,29]){const [o,f]=liveCase(id,1);specialAbility(o,f);const before=G.v2.hazards.length,shots=G.v2.shots.length,wake=!!o.v1FrostWake;o.x+=22;for(let i=0;i<30&&G.ph==="battle";i++)step(1/60);rows.push({id,before,shots,wake,after:G.v2?.hazards?.filter(h=>h.kind==="frost").length||0});}return rows;');
 assert.ok(a[0].shots>0);assert.equal(a[1].shots,0);assert.equal(a[1].wake,true);assert.ok(a[1].after>=a[1].before);
});
test('pressure field follows its owner instead of copying target-placed zones',()=>{
 const r=play('const [o,f]=liveCase(19,1);specialAbility(o,f);return {pulse:!!o.v1PressureImpulse,zones:G.v2.hazards.filter(h=>h.kind==="zone").map(h=>({x:h.x,y:h.y})),x:o.x,y:o.y};');
 assert.equal(r.pulse,true);assert.ok(r.zones.some(h=>Math.hypot(h.x-r.x,h.y-r.y)<4));
});
test('all sixteen middle fighters retain finite fight physics in all 3 stages',()=>{
 const data=play('let all=[];for(let id=16;id<32;id++)for(let tier=1;tier<=3;tier++){const [o,f]=liveCase(id,tier);specialAbility(o,f);for(let i=0;i<80&&G.ph==="battle";i++)step(1/60);all.push({id,tier,finite:G.bl.every(p=>[p.x,p.y,p.hp,p.vx,p.vy].every(Number.isFinite))});}return all;');
 assert.equal(data.length,48);assert.ok(data.every(x=>x.finite));
});

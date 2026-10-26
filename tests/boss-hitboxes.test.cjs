'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
test('all 18 boss attacks provide distinctive phase warnings and real collidable hitboxes',()=>{
 const g=createGame();
 const results=g.run(`(()=>{
  const out=[];
  for(let id=0;id<6;id++)for(let phase=1;phase<=3;phase++){
   pendingBossIndex=id;startMatch(11);pick(0);
   G.bl[1].hp=G.bl[1].mh*(phase===1?1:phase===2?.6:.3);
   G.rt=7.1;BVBRework.afterStep(G,1/60);
   const m=G.bossTelegraph;
   out.push({id,phase,attack:m?.id,name:m?.name,
     markPhase:m?.phase,index:m?.index,seconds:m?.at-m?.created,
     zones:m?.zones,patterns:BVBRework.bossPhases[id].length});
  }
  return out;
 })()`);
 assert.equal(results.length,18);
 const distinct=new Set();
 for(const r of results){
  assert.equal(r.index,r.id);
  assert.equal(r.markPhase,r.phase);
  assert.equal(r.patterns,3);
  assert.ok(r.attack&&r.name&&r.zones.length);
  distinct.add(r.attack);
  assert.ok(r.seconds>=1.1&&r.seconds<=1.5);
  assert.ok(r.zones.every(z=>['circle','ring','rect','line'].includes(z.kind)));
 }
 assert.equal(distinct.size,18);
});

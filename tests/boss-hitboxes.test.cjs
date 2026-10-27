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

test('every warned boss strike really damages a point inside its shown hitbox',()=>{
 const g=createGame();
 const outcomes=g.run(`(()=>{
  const out=[];
  for(let id=0;id<6;id++)for(let phase=1;phase<=3;phase++){
   pendingBossIndex=id;startMatch(11);pick(0);
   const [player,boss]=G.bl;
   boss.hp=boss.mh*(phase===1?1:phase===2?.6:.3);
   G.rt=7.1;BVBRework.afterStep(G,1/60);
   const mark=G.bossTelegraph;
   const points=[];
   for(let y=20;y<=340;y+=20)for(let x=20;x<=340;x+=20){
    const target={x,y,r:player.r};
    if(mark.zones.some(z=>BVBRework.zoneHits(z,target)))points.push(target);
   }
   const chosen=points[Math.floor(points.length/2)];
   if(!chosen){out.push({id,phase,point:false});continue;}
   player.x=chosen.x;player.y=chosen.y;
   player.mh=500;player.hp=500;player.armor=0;
   player.status={};player.statusImmunities=[];
   G.rt=mark.at+.001;
   BVBRework.afterStep(G,0);
   out.push({id,phase,point:true,damage:500-player.hp,after:G.bossTelegraph,
    echo:G.bossEcho?.id});
  }
  return out;
 })()`);
 assert.equal(outcomes.length,18);
 for(const o of outcomes){
  assert.equal(o.point,true,'no reachable hit position for '+o.id+' / '+o.phase);
  assert.ok(o.damage>0,'boss '+o.id+' phase '+o.phase+' did not hit its warned area');
  assert.equal(o.after,null,'warning not consumed at scheduled impact');
  assert.ok(o.echo,'boss strike did not display short impact echo');
 }
});

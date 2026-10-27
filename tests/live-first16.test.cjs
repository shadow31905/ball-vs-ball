'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
test('all 48 forms have independently moving equipment and tier-specific continuous loops',()=>{
 const g=createGame();
 const rows=g.run('Array.from({length:16},(_,id)=>[1,2,3].map(tier=>({id,tier,html:art(id,tier),a:BVBLiveFirst16.pose(id,tier,.21),b:BVBLiveFirst16.pose(id,tier,.83),duration:BVBLiveFirst16.duration(id,tier),rig:BVBLiveFirst16.layout(id,tier)}))).flat()');
 assert.equal(rows.length,48);
 for(const row of rows){
  assert.ok(row.html.includes('data-live-first16='));
  assert.ok(row.html.includes('bvb16-core'));
  assert.ok(row.html.includes('bvb16-outer')||row.html.includes('bvb16-left'));
  assert.notDeepEqual(JSON.parse(JSON.stringify(row.a.outer)),JSON.parse(JSON.stringify(row.b.outer)),'equipment does not move: '+row.id+' V'+row.tier);
  assert.ok(row.duration>1&&row.duration<5);
  assert.ok(row.rig.cx>0&&row.rig.cx<128&&row.rig.cy>0&&row.rig.cy<128&&row.rig.r>15);
 }
 for(let id=0;id<16;id++)assert.ok(rows[id*3].duration>rows[id*3+2].duration);
});
test('idle, casting and hit reactions leave actors, saves and combat RNG untouched',()=>{
 const g=createGame();
 const result=g.run('(()=>{BVBMotion.prefs();const actor={hp:80,abilityCd:.1},before=JSON.stringify(S),initial=JSON.stringify(actor),old=Math.random;let rng=0,draws=0;const ctx=new Proxy({drawImage:()=>draws++},{get:(o,k)=>o[k]||(()=>{})});Math.random=()=>{rng++;throw Error("animation RNG");};try{for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){const im=BVBApprovedArt.imageForTier(id,tier);im.complete=true;im.naturalWidth=256;BVBLiveFirst16.draw(ctx,id,tier,64,64,18,.1,{actor,scope:"battle"});BVBLiveFirst16.draw(ctx,id,tier,64,64,18,.8,{actor,scope:"battle"});}return {same:before===JSON.stringify(S),actor:initial===JSON.stringify(actor),rng,draws};}finally{Math.random=old;}})()');
 assert.ok(result.same&&result.actor);assert.equal(result.rng,0);assert.ok(result.draws>=48*4);
});
test('quality and surface toggles use static source art while retaining valid first-sixteen assets',()=>{
 const g=createGame();
 const result=g.run('(()=>{const calls=[];const ctx=new Proxy({drawImage:()=>calls.push(1)},{get:(o,k)=>o[k]||(()=>{})});for(const scope of ["battle","preview","inventory"]){const flag=scope==="battle"?"fight":scope==="preview"?"interior":"inventory";S.o["art_"+flag]=0;const im=BVBApprovedArt.imageForTier(0,1);im.complete=true;im.naturalWidth=256;BVBLiveFirst16.draw(ctx,0,1,64,64,18,1,{scope});S.o["art_"+flag]=1;}return {calls:calls.length,invalid:BVBLiveFirst16.draw(ctx,130,1,1,1,1,1)};})()');
 assert.equal(result.calls,3);assert.equal(result.invalid,false);
});

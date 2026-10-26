'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

// The first sixteen balls were manually reworked in earlier batches.
// This suite checks the 114 remaining personal V2 and V3 effects in the
// actual host-side game, not just the catalog or visual previews.
const setup=`
function evolutionScenario(id,tier,distance=110){
 serial=0;
 G=freshGame(4,[B[id]],[B[(id+1)%130]]);
 G.matchId='authored-evolution-'+id;G.m=4;G.ph='battle';G.th=1;G.rt=2;
 G.obstacles=[];G.fx=[];G.pop=[];G.rings=[];
 G.bl=[
  actor(B[id],95,180,0,0,0,tier,0,0),
  actor(B[(id+1)%130],95+distance,180,Math.PI,1,1,1,0,0)
 ];
 BVBRework.prepareActors(G,...G.bl);
 BVBRework.setSeed(G,1933+id);
 for(const a of G.bl){
  a.hp=95;a.mh=200;a.baseDmg=12;a.armor=0;
  a.vx=0;a.vy=0;a.r=17;a.abilityCd=999;
  a.status={};a.identity=null;a.contact=999;
 }
 G.bl[0].status={poison:.5,slow:.5,burn:.4,weaken:.5,shield:0};
 return G.bl;
}
function fingerprint(o,foe){
 return JSON.stringify({
  hp:o.hp,enemyHp:foe.hp,shield:o.status.shield||0,
  ownerStatus:o.status,foeStatus:foe.status,
  pos:[o.x,o.y,foe.x,foe.y],move:[o.vx,o.vy,foe.vx,foe.vy],
  echo:o.v2Echo||null,reflect:o.skillReflect||0,ai:foe.aiTarget||null,
  shots:(G.v2?.shots||[]).map(s=>[s.x,s.y,s.damage,s.ghost,s.bounces,s.stun,s.poison,s.burn,s.slow,s.knock,s.healOnHit]),
  hazards:(G.v2?.hazards||[]).map(h=>[h.kind,h.x,h.y,h.radius,h.life,h.armAt,h.power]),
  beams:G.v2?.beams||[],
  blade:o.axeOrbit||null,scale:o.skillScale||1
 });
}
`;
test('every ball 16–129 owns two different, visible and named V2/V3 mechanics; 0–15 unchanged',()=>{
 const g=createGame();
 const result=g.run(`(()=>{
  const list=BVB2.authoredUpgrades;
  return {count:Object.keys(list).length,
   first16:Array.from({length:16},(_,id)=>list[id]||null),
   missing:Array.from({length:114},(_,n)=>n+16).filter(id=>!list[id]),
   duplicateStage:Object.keys(list).filter(id=>list[id][0]===list[id][1]),
   descriptions:Array.from({length:114},(_,n)=>{
    const id=n+16;
    return {id,v1:BVB2.evolutionDescription(id,1),
     v2:BVB2.evolutionDescription(id,2),
     v3:BVB2.evolutionDescription(id,3)};
   })
  };
 })()`);
 assert.equal(result.count,114);
 assert.ok(result.first16.every(x=>x==null),'the first sixteen authored abilities must stay unchanged');
 assert.deepEqual(Array.from(result.missing),[]);
 assert.deepEqual(Array.from(result.duplicateStage),[]);
 for(const d of result.descriptions){
  assert.match(d.v1,/podstawowa/);
  assert.match(d.v2,/V2: /);
  assert.match(d.v3,/V3: /);
  assert.notEqual(d.v1,d.v2);
  assert.notEqual(d.v2,d.v3);
 }
});
test('342 real casts: upgrades differ at equal HP/DMG, with bounded and finite gameplay state',()=>{
 const g=createGame();
 const result=g.run(setup+`(()=>{
  const bad=[],failed=[],variants=[];
  for(let id=16;id<130;id++){
   const sig=[];
   for(let tier=1;tier<=3;tier++){
    const [o,foe]=evolutionScenario(id,tier);
    specialAbility(o,foe);
    const f=fingerprint(o,foe);sig.push(f);
    const state=G.v2||{};
    const values=[
     o.hp,foe.hp,o.x,o.y,o.vx,o.vy,foe.x,foe.y,foe.vx,foe.vy,
     ...((state.shots||[]).flatMap(s=>[s.x,s.y,s.vx,s.vy,s.life,s.damage])),
     ...((state.hazards||[]).flatMap(h=>[h.x,h.y,h.life,h.power,h.radius]))
    ];
    if(!values.every(Number.isFinite)||o.hp>o.mh||foe.hp>foe.mh||
       (state.shots||[]).length>80||(state.hazards||[]).length>45)bad.push({id,tier});
    const view=getBallStats(id,tier,0,0);
    if(view.tier!==tier||!view.evolutionDesc.includes('V'+tier))failed.push({id,tier,desc:view.evolutionDesc});
    variants.push({id,tier,shots:(state.shots||[]).length,
       hazards:(state.hazards||[]).length,hp:o.hp,foeHp:foe.hp});
   }
   if(sig[0]===sig[1]||sig[1]===sig[2])failed.push({id,kind:BVB2.abilities[id].kind,problem:'identical gameplay at neighboring tiers'});
  }
  return {bad,failed,variants};
 })()`);
 assert.equal(result.variants.length,342);
 assert.deepEqual(Array.from(result.bad),[]);
 assert.deepEqual(Array.from(result.failed),[],'V1, V2 and V3 must not merely recolor the same combat effect');
});
test('V3 additionally applies its authored second mechanic, which can be observed after casting',()=>{
 const g=createGame();
 const r=g.run(setup+`(()=>{
  const ids=[16,17,18,19,20,21,22,23,24,26,31,33,36,47,48,52,54,64,68,79,81,94,97,107,115,117,120,127,129];
  const result=[];
  for(const id of ids){
   const snapshots=[];
   for(const tier of [1,2,3]){
    const [o,foe]=evolutionScenario(id,tier,85);
    specialAbility(o,foe);
    snapshots.push({
     tier,hp:o.hp,foeHp:foe.hp,
     status:o.status,foeStatus:foe.status,
     shots:G.v2?.shots?.length||0,
     kinds:(G.v2?.hazards||[]).map(h=>h.kind),
     echo:o.v2Echo||null,shield:o.status.shield||0,
     reflect:o.skillReflect||0,
     foeVx:foe.vx
    });
   }
   result.push({id,profile:BVB2.authoredUpgrades[id],snapshots});
  }return result;
 })()`);
 assert.equal(r.length,29);
 for(const x of r){
  const [v1,v2,v3]=x.snapshots;
  // The additional V3 mechanic is explicitly specified for each ball; at
  // least one real gameplay signal must change beyond the V2 stage.
  assert.notEqual(JSON.stringify(v1),JSON.stringify(v2),'missing V2 mechanic '+x.id);
  assert.notEqual(JSON.stringify(v2),JSON.stringify(v3),'missing V3 mechanic '+x.id);
  assert.notEqual(x.profile[0],x.profile[1]);
 }
});

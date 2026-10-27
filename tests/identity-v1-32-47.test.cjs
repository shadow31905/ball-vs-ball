'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

test('V1 skills for all sixteen 32–47 still create meaningful real game effects',()=>{
 const g=createGame();
 const result=g.run(`(()=>{
  const records=[];
  for(let id=32;id<=47;id++){
   serial=0;G=freshGame(4,[B[id]],[B[0]]);
   G.ph='battle';G.m=4;G.rt=2;G.th=1;G.obstacles=[];
   G.bl=[actor(B[id],90,170,0,0,0,1,0,0),
    actor(B[0],185,170,Math.PI,1,1,1,0,0)];
   BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,2200+id);
   const [o,foe]=G.bl;
   for(const a of G.bl){a.hp=120;a.mh=200;a.baseDmg=12;
    a.abilityCd=999;a.contact=999;a.status={};a.identity=null;a.vx=0;a.vy=0;}
   const before={hp:o.hp,foeHp:foe.hp};
   specialAbility(o,foe);
   if(id===34){o.x=20;o.y=100;BVB2.onWall(o,'left');
    o.x=330;o.y=260;BVB2.onWall(o,'right');}
   if(id===41)BVB2.onWall(o,'left');
   const s=G.v2||{};
   records.push({
    id,before,hp:o.hp,foeHp:foe.hp,
    speed:Math.hypot(o.vx,o.vy),charge:o.skillCharge||0,
    shield:o.status.shield||0,reflect:o.skillReflect||0,
    axes:!!o.axeOrbit,shotCount:s.shots?.length||0,
    hazardKinds:(s.hazards||[]).map(h=>h.kind),
    webs:s.webs?.length||0,beams:s.beams?.length||0,
    wallBeams:s.wallBeams?.length||0
   });
  }
  return records;
 })()`);
 const byId=new Map(result.map(row=>[row.id,row]));
 assert.equal(result.length,16);
 for(const r of result){
  const effective=r.shotCount>0||r.hazardKinds.length>0||r.webs>0||
   r.beams>0||r.wallBeams>0||r.speed>0||r.charge>0||
   r.shield>0||r.reflect>0||r.axes||r.hp>r.before.hp||
   r.foeHp<r.before.foeHp;
  assert.ok(effective,'V1 should modify the real fight, not just spawn VFX: '+r.id);
 }
 assert.ok(byId.get(33).hazardKinds.includes('train'));
 assert.ok(byId.get(34).webs>0,'spider V1 webs must need two different walls');
 assert.ok(byId.get(35).hazardKinds.includes('mine'));
 assert.ok(byId.get(36).speed>0);
 assert.ok(byId.get(37).shotCount>0);
 assert.ok(byId.get(38).hp>byId.get(38).before.hp);
 assert.ok(byId.get(39).hazardKinds.includes('mine'));
 assert.ok(byId.get(40).hazardKinds.includes('poison'));
 assert.ok(byId.get(41).beams>0&&byId.get(41).wallBeams>0);
 assert.ok(byId.get(42).hazardKinds.includes('gas'));
 assert.ok(byId.get(43).shotCount>0);
 assert.ok(byId.get(44).charge>0);
 assert.ok(byId.get(45).shotCount>0,'Cactus must create bouncing plant shots');
 assert.equal(byId.get(45).reflect,0,'Cactus does not borrow the reflect-shield skill');
 assert.ok(byId.get(46).hazardKinds.includes('mine'));
 assert.ok(byId.get(47).axes);
});

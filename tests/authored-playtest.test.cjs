'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

// Exercises actual 60 FPS collision/projectile/status updates, not just the
// immediate post-cast state used in the authored-evolutions unit tests.
test('114 balls x 3 evolutions: real 2-second battles remain finite, bounded and isolated from player progress',()=>{
 const g=createGame();
 const result=g.run(`(()=>{
  const before=JSON.stringify({own:S.own,tr:S.tr,coins:S.coins,candies:S.candies});
  let attempts=0,active=0,damage=0,generated=0;
  const failed=[];
  for(let id=16;id<130;id++)for(let tier=1;tier<=3;tier++){
   serial=0;
   G=freshGame(4,[B[id]],[B[(id+1)%130]]);
   G.m=4;G.ph='battle';G.th=1;G.rt=1;G.matchId='ability-playtest-'+id+'-'+tier;
   G.obstacles=[];G.bl=[
    actor(B[id],80,180,0,0,0,tier,0,0),
    actor(B[(id+1)%130],195,180,Math.PI,1,1,1,0,0)
   ];
   BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,44000+id);
   for(const o of G.bl){
    o.hp=140;o.mh=200;o.baseDmg=12;o.armor=0;
    o.vx=0;o.vy=0;o.abilityCd=999;o.status={};o.contact=999;
   }
   const [owner,foe]=G.bl,initialHp=foe.hp;
   specialAbility(owner,foe);
   generated+=(G.v2?.shots?.length||0)+(G.v2?.hazards?.length||0);
   for(let frame=0;frame<120&&G.ph==='battle';frame++){
    step(1/60);
    if(G.v2?.shots?.length>80||G.v2?.hazards?.length>45){failed.push({id,tier,kind:'object budget'});break;}
    if(!G.bl.every(o=>[o.x,o.y,o.vx,o.vy,o.hp,o.mh,o.r].every(Number.isFinite))){failed.push({id,tier,kind:'nonfinite'});break;}
    if(G.bl.some(o=>o.hp>o.mh+1e-6||o.r<1||o.r>100)){failed.push({id,tier,kind:'bounds'});break;}
   }
   if(G.ph==='battle'||G.ph==='end')active++;
   if(foe.hp<initialHp)damage++;
   attempts++;
  }
  return {attempts,active,damage,generated,failed,
   keptProgress:before===JSON.stringify({own:S.own,tr:S.tr,coins:S.coins,candies:S.candies})};
 })()`);
 assert.equal(result.attempts,342);
 assert.equal(result.active,342);
 assert.ok(result.generated>=130,'specials should actually spawn playable effects, not just VFX');
 assert.ok(result.damage>=60,'projectiles/areas must physically damage enemies in many representative matches');
 assert.equal(result.keptProgress,true,'training must not mutate owned balls or premium currencies');
 assert.deepEqual(Array.from(result.failed),[]);
});

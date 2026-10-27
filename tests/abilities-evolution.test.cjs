'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{createGame}=require('./game-harness.cjs');
function abilityAudit(){
 const failed=[],variants=[];S.o.fxLevel=0;
 for(let id=0;id<130;id++){
  const signatures=[];
  for(let tier=1;tier<=3;tier++){
   const samples=[];
   for(const distance of [40,105,110,115,120,125,132,140,155,163,170,180,185,190,195,205,220,245,265]){
    serial=0;G=freshGame(4,[B[id]],[B[(id+1)%130]]);G.matchId='ability-contract';G.th=1;G.ph='aim';
    const o=actor(B[id],70,180,0,0,0,tier,0,0),f=actor(B[(id+1)%130],70+distance,180,Math.PI,1,1,1,0,0);
    G.bl=[o,f];G.ph='battle';G.rt=1;G.obstacles=[];BVBRework.prepareActors(G,o,f);BVBRework.setSeed(G,12345);
    for(const a of [o,f]){a.identity=null;a.hp=100;a.mh=200;a.baseDmg=10;a.armor=0;a.r=17;a.status={};}
    specialAbility(o,f);
    o.x=17;BVB2.onWall(o,'left');o.x=343;BVB2.onWall(o,'right');
    if(![o.x,o.y,o.hp,f.hp,o.vx,o.vy].every(Number.isFinite))throw Error('Nonfinite '+id+'/V'+tier);
    const v=G.v2||{};
    samples.push({hp:o.hp,targetHP:f.hp,shield:o.status.shield||0,foeStatus:f.status,foeVx:f.vx,foeVy:f.vy,vx:o.vx,vy:o.vy,r:o.r,
     impact:o.skillImpact,charge:o.skillCharge,reflect:o.skillReflect,scale:o.skillScale,
     orbit:o.axeOrbit,tail:o.v2Tail,
     shots:(v.shots||[]).map(s=>({vx:s.vx,vy:s.vy,r:s.r,damage:s.damage,homing:s.homing,bounces:s.bounces,ghost:s.ghost})),
     hazards:(v.hazards||[]).map(h=>({kind:h.kind,radius:h.radius,life:h.life,power:h.power,armAt:h.armAt,vx:h.vx,vy:h.vy})),
     webs:(v.webs||[]).map(w=>({stage:w.stage,a:w.a,b:w.b})),wallBeams:(v.wallBeams||[]).map(b=>({life:b.life,width:b.width}))});
   }
   signatures.push(JSON.stringify(samples));variants.push({id,tier});
  }
  if(signatures[0]===signatures[1]||signatures[1]===signatures[2])failed.push({id,name:B[id].n,kind:BVB2.abilities[id].kind});
 }return {failed,variants:variants.length};
}
test('all 390 active ability/evolution variants execute finite mechanics; V2/V3 change attacks with equal base stats',()=>{
 const game=createGame(),result=game.run('('+abilityAudit.toString()+')()');
 assert.equal(result.variants,390);assert.deepEqual(Array.from(result.failed),[],'Evolution must change observable ability mechanics rather than only stats');
});
test('training searches all 130 by normalized name and rarity, with no ownership or evolution mutation',()=>{
 const g=createGame(),before=g.run('JSON.stringify({own:S.own,tr:S.tr,upHp:S.upHp,upDmg:S.upDmg})');
 g.run("startMatch(4);G.trainingTier=3;G.trainingOpponentTier=2;G.trainingOpponentId=1;BVBTraining.choose(129)");
 assert.equal(g.run('G.bl[0].b.id'),129);assert.equal(g.run('G.bl[0].tier'),3);assert.equal(g.run('G.bl[1].tier'),2);
 assert.equal(g.run('JSON.stringify({own:S.own,tr:S.tr,upHp:S.upHp,upDmg:S.upDmg})'),before);
 assert.equal(g.run("BVBTraining.catalog('topor')[0].id"),1);assert.equal(g.run('BVBTraining.catalog().length'),130);
 assert.equal(g.run('BVBTraining.catalog().every((b,i,a)=>!i||b.r>=a[i-1].r)'),true);
 for(let r=0;r<5;r++)assert.equal(g.run('BVBTraining.catalog("",'+r+').every(b=>b.r==='+r+')'),true);
});
test('mines arm after a readable warning; normal shots hit obstacles and shadow shots pass through',()=>{
 const game=createGame();
 const mine=game.run("G=freshGame(4,[B[46]],[B[0]]);G.ph='battle';G.rt=0;G.th=1;BVBRework.setSeed(G,9876);G.obstacles=[];G.bl=[actor(B[46],80,180,0,0,0,1,0,0),actor(B[0],220,180,0,1,1,1,0,0)];for(const o of G.bl){o.vx=o.vy=0;o.abilityCd=999;o.hp=o.mh=1000;}specialAbility(G.bl[0],G.bl[1]);var hp=G.bl[1].hp;for(let i=0;i<20;i++)step(1/60);({same:G.bl[1].hp===hp,arm:G.v2.hazards[0]?.armAt})");
 assert.equal(mine.same,true);assert.equal(mine.arm,.75);
 const shots=game.run("(()=>{const out=[];for(const id of [26,90]){G=freshGame(4,[B[id]],[B[0]]);G.ph='battle';G.rt=0;G.th=1;BVBRework.setSeed(G,9876);G.obstacles=[{x:170,y:180,r:20,kind:'neon',moving:false}];G.bl=[actor(B[id],80,180,0,0,0,1,0,0),actor(B[0],280,180,0,1,1,1,0,0)];for(const o of G.bl){o.vx=o.vy=0;o.abilityCd=999;o.hp=o.mh=1000;}specialAbility(G.bl[0],G.bl[1]);for(let i=0;i<44;i++)step(1/60);out.push({id,hp:G.bl[1].hp,shots:G.v2.shots.length});}return out})()");
 assert.equal(shots[0].hp,1000);assert.ok(shots[1].hp<1000,'ghost projectile should reach its target through the obstacle');
});
test('dice has six actual outcomes and finisher never changes combat outcome',()=>{
 const g=createGame();
 const r=g.run("(()=>{const rolls=new Set();for(let seed=1;seed<=100;seed++){G=freshGame(4,[B[11]],[B[0]]);G.ph='battle';G.th=1;G.bl=[actor(B[11],80,180,0,0,0,1,0,0),actor(B[0],220,180,0,1,1,1,0,0)];BVBRework.setSeed(G,seed);specialAbility(G.bl[0],G.bl[1]);rolls.add(G.bl[0].v2LastRoll);}return rolls.size})()");
 assert.equal(r,6);
 g.run("startMatch(4);BVBTraining.choose(0);G.bl.find(o=>o.team===1).hp=0;var hpBefore=G.bl.map(o=>o.hp);var heartsBefore=JSON.stringify(G.h);BVBPresentation.finish(G,0)");
 assert.equal(g.run('G.finisher.winnerId'),0);assert.equal(g.run('JSON.stringify(G.bl.map(o=>o.hp))'),g.run('JSON.stringify(hpBefore)'));assert.equal(g.run('JSON.stringify(G.h)'),g.run('heartsBefore'));
 g.run('for(let i=0;i<20;i++)BVBPresentation.tick(G,.12)');assert.ok(Math.abs(g.run('G.finisher.age')-1.8)<1e-9);
});

test('poison contact and double sparks match their active descriptions',()=>{const g=createGame();g.run("G=freshGame(4,[B[24]],[B[0]]);G.ph='battle';G.rt=0;G.th=1;G.bl=[actor(B[24],80,180,0,0,0,1,0,0),actor(B[0],220,180,0,1,1,1,0,0)];specialAbility(...G.bl);BVB2.onContact(G,...G.bl,10)");assert.ok(g.run('G.bl[1].status.poison')>0);g.run("G.v2=null;G.bl[0].b={...B[83]};specialAbility(...G.bl)");assert.equal(g.run('G.v2.shots.length'),2);});

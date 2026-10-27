'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{createGame}=require('./game-harness.cjs');
test('calibration covers every ball with finite moderate HP and damage adjustments',()=>{
 const game=createGame(),c=game.context.BVBBalance;
 assert.equal(c.calibration.length,130);assert.ok(c.calibrationGames>=2600);assert.ok(c.tempoHp>=1&&c.tempoHp<=1.7);
 for(let id=0;id<130;id++){const row=c.calibration[id];assert.equal(row.id,id);assert.ok(Number.isFinite(row.hp)&&row.hp>=.7&&row.hp<=1.4);assert.ok(Number.isFinite(row.damage)&&row.damage>=.7&&row.damage<=1.4);}
});
test('stat scaling is repeatable, preserves cooldowns and respects all progression tiers',()=>{
 const game=createGame();
 for(let id=0;id<130;id++)for(let tier=1;tier<=3;tier++){
  const result=game.run(`BVBBalance.enabled=false;var base=getBallStats(${id},${tier},2,2);BVBBalance.enabled=true;var tuned=getBallStats(${id},${tier},2,2);var repeat=getBallStats(${id},${tier},2,2);({base,tuned,repeat,coefficient:BVBBalance.calibration[${id}],tempo:BVBBalance.tempoHp})`);
  assert.equal(result.tuned.hp,Math.round(result.base.hp*result.coefficient.hp*result.tempo));assert.equal(result.tuned.dmg,Math.round(result.base.dmg*result.coefficient.damage));assert.equal(result.tuned.cd,result.base.cd);assert.equal(result.tuned.speed,result.base.speed);assert.equal(result.tuned.passiveName,result.base.passiveName);assert.equal(result.tuned.hp,result.repeat.hp);assert.equal(result.tuned.dmg,result.repeat.dmg);
 }
});
test('full-engine seeded fights with calibration repeat exactly and stay finite',()=>{
 const game=createGame();const run=`(()=>{diff=3;serial=0;S.o.fxLevel=0;G=freshGame(0,[B[102]],[B[13]]);G.matchId='balance-regression-1';G.th=2;nextRound();G.modifier='standard';G.tactics={0:'balanced',1:'balanced'};pick(0);for(let i=0;i<3700&&G.ph==='battle';i++)step(1/60);return {phase:G.ph,time:G.rt,hash:BVBRework.stateHash(G),hp:G.bl.map(o=>o.hp),winner:G.lastRoundWinner};})()`;
 const a=game.run(run),b=game.run(run);assert.equal(a.phase,'end');assert.ok(a.time<=60.05);assert.equal(JSON.stringify(a),JSON.stringify(b));for(const hp of a.hp)assert.ok(Number.isFinite(hp));
});

test('an archived coefficient table can replace a disabled table without double stat scaling',()=>{
 const fs=require('node:fs'),path=require('node:path'),game=createGame();
 const before=game.run('getBallStats(13,1,0,0)');
 game.context.BVBBalance.enabled=false;
 game.run(fs.readFileSync(path.join(__dirname,'..','bvb-balance.js'),'utf8'));
 const after=game.run('getBallStats(13,1,0,0)');
 assert.equal(after.hp,before.hp);assert.equal(after.dmg,before.dmg);assert.equal(after.cd,before.cd);
});

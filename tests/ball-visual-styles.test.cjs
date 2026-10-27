'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
test('style switch changes only 32 finished reworks and leaves 98 original identities alone',()=>{
 const g=createGame();
 const report=g.run(`(()=>{
 const before=JSON.stringify({hp:S.upHp,dmg:S.upDmg,own:S.own,coins:S.coins,abilities:BVB2.abilities.map(x=>x?.kind)});
 const detailed=B.map(b=>[1,2,3].map(t=>BVBArtEvolution.svgFor(b.id,t)));
 S.o.ballVisualStyle='classic';const classic=B.map(b=>[1,2,3].map(t=>BVBArtEvolution.svgFor(b.id,t)));
 const after=JSON.stringify({hp:S.upHp,dmg:S.upDmg,own:S.own,coins:S.coins,abilities:BVB2.abilities.map(x=>x?.kind)});
 return {sameBattleData:before===after,classic,detailed,ready:B.map(b=>BVBArtEvolution.isCompletedRework(b.id))};
})()`);
 assert.equal(report.sameBattleData,true);
 assert.equal(report.classic.length,130);
 let changed=0,untouched=0;
 for(let id=0;id<130;id++)for(let tier=1;tier<=3;tier++){
  const classic=report.classic[id][tier-1],detailed=report.detailed[id][tier-1];
  assert.equal(report.ready[id],id<32,'Rework whitelist must contain only finished group');
  if(id<32){
   assert.notEqual(classic,detailed,'Finished ball '+(id+1)+' V'+tier+' must visibly change');
   assert.ok(classic.includes('data-ball-id="'+id+'"'),'Identity lost');
   assert.ok(classic.includes('data-evolution="'+tier+'"'),'Evolution lost');
   assert.match(classic,/data-visual-style="classic"/);
   changed++;
  }else{
   assert.equal(classic,detailed,'Unfinished ball '+(id+1)+' V'+tier+' MUST NOT change');
   untouched++;
  }
 }
 assert.equal(changed,96);
 assert.equal(untouched,294);
});
test('setting retains detailed as compatibility default and supports classic selection',()=>{
 const g=createGame();assert.equal(g.run('BVBArtEvolution.currentStyle()'),'detailed');
 assert.equal(g.run("(()=>{S.o.ballVisualStyle='classic';return BVBArtEvolution.currentStyle()})()"),'classic');
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

test('visual style is cosmetic and preserves identifiers for all 390 evolutions',()=>{
 const g=createGame();
 const report=g.run(`(()=>{
 const before=JSON.stringify({hp:S.upHp,dmg:S.upDmg,own:S.own,coins:S.coins,abilities:BVB2.abilities.map(x=>x?.kind)});
 const detailed=B.map(b=>[1,2,3].map(t=>BVBArtEvolution.svgFor(b.id,t)));
 S.o.ballVisualStyle='classic'; const classic=B.map(b=>[1,2,3].map(t=>BVBArtEvolution.svgFor(b.id,t)));
 const after=JSON.stringify({hp:S.upHp,dmg:S.upDmg,own:S.own,coins:S.coins,abilities:BVB2.abilities.map(x=>x?.kind)});
 return {sameBattleData:before===after,classic,detailed};
})()`);
 assert.equal(report.sameBattleData,true);
 assert.equal(report.classic.length,130);
 let differences=0;
 for(let id=0;id<130;id++)for(let tier=1;tier<=3;tier++){
  const s=report.classic[id][tier-1],d=report.detailed[id][tier-1];
  assert.match(s,/data-visual-style="classic"/);
  assert.ok(s.includes('data-ball-id="'+id+'"'));
  assert.ok(s.includes('data-evolution="'+tier+'"'));
  assert.ok(s.includes('bvb-classic-face'));
  assert.ok(s.includes('bvb-classic-equipment'));
  assert.notEqual(s,d,'Both visual modes must differ for #'+id+' V'+tier);
  differences++;
 }
 assert.equal(differences,390);
});
test('setting keeps detailed as compatibility default until explicitly changed',()=>{
 const g=createGame(),d=g.run("BVBArtEvolution.currentStyle()");
 assert.equal(d,'detailed');
 assert.equal(g.run("(()=>{S.o.ballVisualStyle='classic';return BVBArtEvolution.currentStyle()})()"),'classic');
});

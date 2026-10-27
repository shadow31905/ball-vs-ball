'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
// Validate the actual art() used by the game, not unused previews.
test('sixteen IDs 32–47 render sixteen visibly distinct sketch-based motifs',()=>{
 const game=createGame();
 const rows=game.run('Array.from({length:16},(_,i)=>{const id=32+i;return {id,name:B[id].n,tier1:art(id,1),tier2:art(id,2),tier3:art(id,3)};})');
 assert.equal(rows.length,16);
 const concept=new Set(),svgSet=new Set();
 for(const row of rows){
  assert.ok(row.name.length>1);
  for(let tier=1;tier<=3;tier++){
   const svg=row['tier'+tier];
   assert.ok(svg.startsWith('<svg')&&svg.endsWith('</svg>'));
   assert.ok(svg.includes('data-reference-panel="'+(row.id+1)+'"'));
   assert.ok(svg.includes('data-evolution="'+tier+'"'));
   assert.ok(svg.includes('class="sk33-aura"'));
   assert.ok(!/<script|onerror=|onload=|foreignObject/i.test(svg));
   svgSet.add(svg);
   if(tier===1)concept.add(svg.match(/data-concept="([^"]+)"/)?.[1]);
  }
 }
 assert.equal(concept.size,16);
 assert.equal(svgSet.size,48);
});
test('new sketch skins affect only 32–47 and V2/V3 skills remain independently authored',()=>{
 const game=createGame();
 const value=game.run('({prior:art(31),first:art(32),last:art(47),after:art(48),actions:Array.from({length:16},(_,i)=>BVB2.authoredUpgrades[i+32])})');
 assert.ok(!value.prior.includes('data-reference-panel="33"'));
 assert.ok(!value.after.includes('data-reference-panel="48"'));
 assert.ok(value.first.includes('data-reference-panel="33"'));
 assert.ok(value.last.includes('data-reference-panel="48"'));
 assert.ok(value.actions.every(a=>a.length===2&&a[0]!==a[1]));
});

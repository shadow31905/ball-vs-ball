'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
// Historically this path tested placeholder "elemental" IDs. The real originals
// are now checked by name and motif rather than by those invalid placeholders.
const motifs=['rush','axe','poison-spines','thief','blade','rifle','spider','vampire','spear','burst','chess','dice','ice-cone','laser','snake','hook'];
test('former elemental placeholder identities are replaced by the 16 ORIGINAL ball identities',()=>{
 const g=createGame(),data=g.run('({active:BVBElementalArt.keys,source:BVBElementalArt.source,tiers:Array.from({length:16},(_,i)=>[1,2,3].map(t=>BVBArtEvolution.svgFor(i,t)))})');
 assert.equal(data.source,'individual-16-approved-20261028');
 assert.deepEqual(Array.from(data.active),motifs);
 for(let i=0;i<16;i++)for(let tier=1;tier<=3;tier++){
  const svg=data.tiers[i][tier-1];
  assert.ok(svg.includes('data-concept="'+motifs[i]+'"'));
  assert.ok(svg.includes('data-evolution="'+tier+'"'));
  assert.ok(svg.includes('class="bvb-ind-aura"'));
  assert.ok(svg.includes('class="bvb-ind-core"'));
 }
});
test('independent art has no gameplay simulation side effects',()=>{
 const g=createGame(),data=g.run('(()=>{const a=JSON.stringify(G),b=JSON.stringify(S);for(let id=0;id<16;id++)for(let t=1;t<=3;t++){BVBArtEvolution.svgFor(id,t);BVBElementalArt.paintCombat(cx,{b:B[id],x:100,y:100,r:20,tier:t},{rt:3});}return {game:a===JSON.stringify(G),profile:b===JSON.stringify(S)};})()');
 assert.equal(data.game,true);assert.equal(data.profile,true);
});
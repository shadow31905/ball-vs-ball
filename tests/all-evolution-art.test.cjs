'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
test('all 130 balls render three independently addressable evolution portraits',()=>{
 const game=createGame();
 const portraits=game.run('B.map(b=>[1,2,3].map(t=>BVBArtEvolution.svgFor(b.id,t)))');
 assert.equal(portraits.length,130);
 const art=new Set();
 for(let id=0;id<130;id++){
  assert.equal(portraits[id].length,3);
  for(let t=1;t<=3;t++){
   const svg=portraits[id][t-1];
   assert.match(svg,/^<svg/);
   assert.ok(svg.endsWith('</svg>'));
   assert.ok(svg.includes('data-evolution="'+t+'"')||
      svg.includes('data-preview-tier="'+t+'"'));
   assert.ok(!/<script|<foreignObject|\sonerror=|\sonload=/i.test(svg));
   assert.ok(!art.has(svg),'reused evolution portrait '+id+' V'+t);
   art.add(svg);
  }
 }
 assert.equal(art.size,390);
});
test('early balls retain unique identity and first sixteen use approved raster skins',()=>{
 const game=createGame();
 const state=game.run('({sig:BVBArtEvolution.signatures,first:Array.from({length:48},(_,i)=>BVBArtEvolution.svgFor(i,1)),elements:Array.from({length:16},(_,i)=>BVBArtEvolution.svgFor(i,3)),later:BVBArtEvolution.svgFor(48,1)})');
 assert.equal(state.sig.length,48);
 assert.equal(new Set(state.sig).size,48);
 assert.ok(state.first.every(s=>s.includes('data-bvb-art-v2')));
 assert.ok(state.elements.every(s=>s.includes('data-evolution="3"')));
 assert.equal(new Set(state.elements.map(s=>s.match(/data-ball-id="([^"]+)"/)[1])).size,16);
 assert.ok(state.later.includes('data-bvb-art-v2'));
});
test('lazy images remain cached per stage, unaffected balls use no random mutations',()=>{
 const game=createGame();
 const data=game.run('(()=>{const before=JSON.stringify(S),a=BVBArtEvolution.imageForTier(0,3),b=BVBArtEvolution.imageForTier(0,3),c=BVBArtEvolution.imageForTier(0,1);return {cached:a===b,separate:a!==c,src:a.src,unchanged:before===JSON.stringify(S),outOfRange:BVBArtEvolution.imageForTier(130,1)};})()');
 assert.equal(data.cached,true);
 assert.equal(data.separate,true);
 assert.equal(data.unchanged,true);
 assert.ok(data.src.endsWith('ball-00-v3.webp'));
 assert.equal(data.outOfRange,null);
});
test('collection detail shows all three stages for any of the 130 balls',()=>{
 const g=createGame();
 for(const id of [0,8,32,47,48,79,129]){
  const html=g.run('BVBArtEvolution.galleryHtml('+id+')');
  assert.equal((html.match(/class="bvb-evo-preview"/g)||[]).length,3);
  for(let stage=1;stage<=3;stage++)assert.ok(html.includes('data-stage="'+stage+'"'));
 }
});

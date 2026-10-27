'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const expected=['forge','cell','lightning','zone','beam','discs','apple','cannon',
 'virus','spike','bow','crown','radar','frost','harpoon','swarm'];
test('sketch panels 17–32: sixteen separate motifs, each with three actual looks',()=>{
 const g=createGame();
 const portraits=g.run('Array.from({length:16},(_,i)=>[1,2,3].map(t=>BVBArtEvolution.svgFor(i+16,t)))');
 const signatures=new Set();
 for(let i=0;i<16;i++){
  for(let tier=1;tier<=3;tier++){
   const pic=portraits[i][tier-1];
   assert.match(pic,/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
   assert.ok(pic.includes('data-reference-panel="'+(i+17)+'"'),i+' panel');
   assert.ok(pic.includes('data-ball-id="'+(i+16)+'"'));
   assert.ok(pic.includes('data-motif="'+expected[i]+'"'),i+' motif');
   assert.ok(pic.includes('data-evolution="'+tier+'"'),i+' tier');
   assert.ok(pic.includes('class="sketch-aura"'));
   assert.ok(pic.includes('class="sketch-heart"'));
   assert.ok(pic.includes('@keyframes sketchHalo'));
   assert.ok(pic.endsWith('</svg>'));
   assert.ok(!/<script|<foreignObject|\son[a-z]+=/i.test(pic));
   assert.ok(!signatures.has(pic),'repeated portrait '+i+' V'+tier);
   signatures.add(pic);
  }
  assert.notEqual(portraits[i][0],portraits[i][1]);
  assert.notEqual(portraits[i][1],portraits[i][2]);
 }
 assert.equal(signatures.size,48);
});
test('the 48 sketch looks are live in equipment and portraits; other ranges unaffected',()=>{
 const g=createGame();
 const state=g.run('({used:Array.from({length:16},(_,i)=>[1,2,3].every(t=>art(i+16,t)===BVBSketch17to32.svgFor(i+16,t))),gallery:BVBArtEvolution.galleryHtml(22),old:BVBArtEvolution.svgFor(32,1),all:B.length})');
 assert.ok(state.used.every(Boolean));
 assert.equal(state.all,130);
 assert.ok(state.gallery.includes('data-stage="1"'));
 assert.ok(state.gallery.includes('data-stage="3"'));
 assert.ok(state.gallery.includes('data-motif="apple"'));
 assert.ok(state.old.includes('data-bvb-art-v2'));
});
test('animated combat auras for IDs 16–31 are non-destructive and use no random combat state',()=>{
 const g=createGame();
 const state=g.run('(()=>{const prior=JSON.stringify(S);for(let id=16;id<32;id++)for(let tier=1;tier<=3;tier++)BVBSketch17to32.renderCombat(cx,{b:B[id],x:165,y:174,r:18,tier},{rt:2.4});return {unchanged:prior===JSON.stringify(S),n:BVBSketch17to32.count};})()');
 assert.equal(state.unchanged,true);
 assert.equal(state.n,16);
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const motifs=['fire','ice','lightning','earth','wind','darkness','light','water','plant','metal','sand','magma','crystal','poison','time','space'];
test('first sixteen portraits match the sixteen different elemental motifs in the sketch',()=>{
 const g=createGame();
 const sprites=g.run('Array.from({length:16},(_,id)=>[1,2,3].map(t=>BVBArtEvolution.svgFor(id,t)))');
 assert.equal(sprites.length,16);
 const all=new Set();
 for(let id=0;id<16;id++){
  assert.equal(sprites[id].length,3);
  const tierLengths=[];
  for(let t=1;t<=3;t++){
   const svg=sprites[id][t-1];
   assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),id+' V'+t);
   assert.ok(svg.includes('data-element="'+motifs[id]+'"'));
   assert.ok(svg.includes('data-evolution="'+t+'"'));
   assert.ok(svg.includes('class="element-aura"'),id+' missing element aura');
   assert.ok(svg.includes('class="element-pulse"'));
   assert.ok(svg.includes('class="element-eyes"'));
   assert.ok(svg.includes('@keyframes bvbAuraSpin'));
   assert.ok(svg.includes('@keyframes bvbEyes'));
   assert.ok(svg.endsWith('</svg>'));
   assert.ok(!/<script|<foreignObject|\son[a-z]+=/i.test(svg));
   assert.ok(!all.has(svg),'shared look '+id+' V'+t);
   all.add(svg);tierLengths.push(svg.length);
  }
  assert.ok(tierLengths[0]<tierLengths[2],id+' V3 must have distinct additional geometry');
 }
 assert.equal(all.size,48);
});
test('all three elemental appearances are active in game and collection UI',()=>{
 const g=createGame();
 const state=g.run('({art:Array.from({length:16},(_,i)=>art(i,2)===BVBArtEvolution.svgFor(i,2)),gallery:BVBArtEvolution.galleryHtml(15),elements:BVBElementalArt.keys,palette:BVBArtEvolution.colors.slice(0,16),oldArt:BVBArtEvolution.svgFor(16,1)})');
 assert.ok(state.art.every(Boolean));
 assert.equal(state.elements.length,16);
 assert.equal(new Set(state.elements).size,16);
 assert.equal(new Set(state.palette).size,16);
 assert.ok(state.gallery.includes('data-stage="1"')&&state.gallery.includes('data-stage="3"'));
 assert.ok(state.oldArt.includes('data-bvb-art-v2'));
});
test('unique elemental combat effects do not mutate the battle simulation',()=>{
 const g=createGame();
 const state=g.run('(()=>{const before=JSON.stringify(S),ctx=cx;for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++)BVBElementalArt.paintCombat(ctx,{b:B[id],x:180,y:180,r:18,tier},{rt:4.3});return {simUnchanged:before===JSON.stringify(S),renderers:typeof BVBElementalArt.paintCombat};})()');
 assert.equal(state.simUnchanged,true);
 assert.equal(state.renderers,'function');
});

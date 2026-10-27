'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const motifs=['calm','devour','evolve','decay','build','control','explosion','swap',
 'antimatter','radiation','frostfog','storm','stonearmor','ether','void','star'];
test('sketch panels 33–48 have 48 distinct V1 V2 V3 character portraits',()=>{
 const g=createGame();
 const sprites=g.run('Array.from({length:16},(_,i)=>[1,2,3].map(t=>BVBArtEvolution.svgFor(i+32,t)))');
 assert.equal(sprites.length,16);
 const seen=new Set();
 for(let index=0;index<16;index++){
  for(let tier=1;tier<=3;tier++){
   const svg=sprites[index][tier-1];
   assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),(index+33)+' V'+tier);
   assert.ok(svg.endsWith('</svg>'));
   assert.ok(svg.includes('data-ball-id="'+(index+32)+'"'));
   assert.ok(svg.includes('data-evolution="'+tier+'"'));
   assert.ok(svg.includes('data-reference-panel="'+(index+33)+'"'));
   assert.ok(svg.includes('data-concept="'+motifs[index]+'"'));
   assert.ok(svg.includes('class="sk33-aura"'));
   assert.ok(svg.includes('class="sk33-core"'));
   assert.ok(svg.includes('@keyframes sk33Rotate'));
   assert.ok(!/<script|<foreignObject|\sonerror=|\sonload=/i.test(svg));
   assert.ok(!seen.has(svg),'repeated art: '+index+' V'+tier);
   seen.add(svg);
  }
  assert.notEqual(sprites[index][0],sprites[index][1]);
  assert.notEqual(sprites[index][1],sprites[index][2]);
 }
 assert.equal(seen.size,48);
});
test('new looks are displayed in the collection, with gameplay ball names preserved',()=>{
 const g=createGame();
 const result=g.run('({used:Array.from({length:16},(_,i)=>[1,2,3].every(t=>art(i+32,t)===BVBSketch33to48.svgFor(i+32,t))),names:B.slice(32,48).map(b=>b.n),gallery:BVBArtEvolution.galleryHtml(47),outside:BVBArtEvolution.svgFor(48,3),palette:BVBArtEvolution.colors.slice(32,48)})');
 assert.ok(result.used.every(Boolean));
 assert.equal(result.names[0],'Eliksir');
 assert.equal(result.names[15],'Orbita');
 assert.equal(new Set(result.palette).size,16);
 assert.ok(result.gallery.includes('data-reference-panel="48"'));
 for(let stage=1;stage<=3;stage++)assert.ok(result.gallery.includes('data-stage="'+stage+'"'));
 assert.ok(result.outside.includes('data-bvb-art-v2'));
});
test('combat auras animate without changing battle results or consuming randomness',()=>{
 const g=createGame();
 const result=g.run('(()=>{const a=JSON.stringify(S);for(let i=32;i<48;i++)for(let tier=1;tier<=3;tier++)BVBSketch33to48.renderCombat(cx,{b:B[i],x:166,y:170,r:17,tier},{rt:2.5});return {beforeSame:a===JSON.stringify(S),count:BVBSketch33to48.count};})()');
 assert.equal(result.beforeSame,true);assert.equal(result.count,16);
});

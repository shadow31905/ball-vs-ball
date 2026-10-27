'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const keys=['medic','truth','glass','portal','shield','mage','chronos','ninja',
 'pirate','miner','sheriff','magma','plasma','meteor','cyclone','prism'];
const names=['Medyk','Prawda','Szkło','Portal','Tarcza','Magik','Chronos','Ninja',
 'Pirat','Górnik','Szeryf','Magma','Plazma','Meteor','Cyklon','Pryzmat'];
test('exactly 48 separate hand-authored evolution portraits for sketch panels 49–64',()=>{
 const g=createGame();
 const graphics=g.run('Array.from({length:16},(_,i)=>[1,2,3].map(t=>BVBArtEvolution.svgFor(i+48,t)))');
 assert.equal(graphics.length,16);
 const unique=new Set();
 for(let i=0;i<16;i++){
  const row=graphics[i];
  for(let t=1;t<=3;t++){
   const svg=row[t-1];
   assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),(i+49)+' V'+t);
   assert.ok(svg.endsWith('</svg>'));
   assert.ok(svg.includes('data-ball-id="'+(i+48)+'"'));
   assert.ok(svg.includes('data-reference-panel="'+(i+49)+'"'));
   assert.ok(svg.includes('data-sketch49="'+keys[i]+'"'));
   assert.ok(svg.includes('data-evolution="'+t+'"'));
   assert.ok(svg.includes('class="sk49-aura"'));
   assert.ok(svg.includes('class="sk49-core"'));
   assert.ok(svg.includes('class="sk49-eyes"'));
   assert.ok(svg.includes('@keyframes sk49Turn'));
   assert.ok(!/<script|<foreignObject|\sonerror=|\sonload=/i.test(svg));
   assert.ok(!unique.has(svg),'duplicate '+i+' V'+t);
   unique.add(svg);
  }
  assert.notEqual(row[0],row[1]);
  assert.notEqual(row[1],row[2]);
 }
 assert.equal(unique.size,48);
});
test('pictures are live in inventory, battle source and gallery, while actual names stay unchanged',()=>{
 const g=createGame();
 const state=g.run('({names:B.slice(48,64).map(b=>b.n),enabled:Array.from({length:16},(_,i)=>[1,2,3].every(t=>art(i+48,t)===BVBSketch49to64.svgFor(i+48,t))),gallery:BVBArtEvolution.galleryHtml(63),palette:BVBArtEvolution.colors.slice(48,64),later:BVBArtEvolution.svgFor(64,1),count:BVBArtEvolution.galleryHtml(48).match(/class="bvb-evo-preview"/g)?.length})');
 assert.deepEqual(Array.from(state.names),names);
 assert.ok(state.enabled.every(Boolean));
 assert.equal(new Set(state.palette).size,16);
 assert.equal(state.count,3);
 assert.ok(state.gallery.includes('data-reference-panel="64"'));
 for(let t=1;t<=3;t++)assert.ok(state.gallery.includes('data-stage="'+t+'"'));
 assert.ok(state.later.includes('data-bvb-art-v2'));
});
test('animations for all 48 visual variants do not touch game state or ability damage',()=>{
 const g=createGame();
 const value=g.run('(()=>{const before=JSON.stringify(S);for(let i=48;i<64;i++)for(let t=1;t<=3;t++)BVBSketch49to64.paintCombat(cx,{b:B[i],x:160,y:160,r:17,tier:t},{rt:4.2});return {unchanged:before===JSON.stringify(S),count:BVBSketch49to64.count};})()');
 assert.equal(value.unchanged,true);
 assert.equal(value.count,16);
});
test('evolution advances abilities but not base HP or damage for 49–64',()=>{
 const g=createGame();
 const state=g.run('Array.from({length:16},(_,i)=>[1,2,3].map(t=>{const id=i+48,stats=getBallStats(id,t,0,0);return {hp:stats.hp,dmg:stats.dmg,desc:BVB2.evolutionDescription(id,t)};}))');
 for(let i=0;i<16;i++){
  const r=state[i];assert.equal(r.length,3);
  assert.equal(r[0].hp,r[1].hp);assert.equal(r[1].hp,r[2].hp);
  assert.equal(r[0].dmg,r[1].dmg);assert.equal(r[1].dmg,r[2].dmg);
  assert.notEqual(r[0].desc,r[1].desc);assert.notEqual(r[1].desc,r[2].desc);
 }
});

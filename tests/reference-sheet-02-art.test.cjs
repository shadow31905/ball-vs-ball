'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const reference=[
 [6,'Pająk','#e5f7ff','Pajęcza nić','Sieć drgań','Kokon łowcy'],
 [7,'Wampir','#ff5a86','Krwawy dług','Bankiet nocy','Serce ciemności'],
 [8,'Włócznia','#f3d383','Królewskie pchnięcie','Przebicie linii','Droga zdobywcy'],
 [9,'Rozbłysk','#ffe28b','Punkt detonacji','Odbita detonacja','Reakcja łańcuchowa'],
 [10,'Szachy','#ddd5c4','Ruch skoczka','Roszada','Mat królowej'],
 [11,'Kostka','#fff5d8','Rzut przeznaczenia','Zatrzymane oczko','Wielka szóstka']
];
test('six historical bespoke SVGs remain intact and can be recovered',()=>{
 const g=createGame();
 const result=g.run('Array.from({length:6},(_,n)=>{const id=n+6;return {id,name:B[id].n,tiers:[1,2,3].map(t=>BVB2Sheet02.artForTier(id,t))};})');
 const all=new Set();
 for(const r of result){
  const expected=reference[r.id-6];
  assert.equal(r.name,expected[1]);
  assert.equal(r.tiers.length,3);
  for(let t=1;t<=3;t++){
   const svg=r.tiers[t-1];
   assert.match(svg,/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
   assert.ok(svg.includes('data-preview-sheet="02"'));
   assert.ok(svg.includes('data-preview-ball="'+r.id+'"'));
   assert.ok(svg.includes('data-preview-tier="'+t+'"'));
   assert.ok(svg.includes(expected[2]));
   assert.ok(svg.includes(expected[2+t]));
   assert.ok(svg.endsWith('</svg>'));
   assert.ok(!/<script|<foreignObject|\son[a-z]+=/i.test(svg));
   assert.ok(!all.has(svg),'unique art must not be reused by another tier');
   all.add(svg);
  }
  assert.ok(r.tiers[0].length<r.tiers[1].length,'V2 adds the ring and right-hand upgrade glyph');
  assert.ok(r.tiers[1].length<r.tiers[2].length,'V3 retains V2 and adds a left-hand upgrade glyph');
 }
 assert.equal(all.size,18);
});
test('tier-specific images are cached, with unmodified art for other balls',()=>{
 const g=createGame();
 const result=g.run('(()=>{const x=BVB2Sheet02.imageForTier(6,2),y=BVB2Sheet02.imageForTier(6,2);const actor={b:B[6],tier:3};return {cached:x===y,source:x.src,actor:BVB2Sheet02.imageFor(actor),noImage:BVB2Sheet02.imageForTier(12,3),prior:art(0),later:art(32),stage2:art(6,2),stage3:art(6,3)};})()');
 assert.equal(result.cached,true);
 assert.ok(result.source.startsWith('data:image/svg+xml'));
 assert.equal(result.actor,null,'unloaded images should safely fall back to existing art');
 assert.equal(result.noImage,null);
 assert.ok(!result.prior.includes('data-preview-sheet="02"'));
 assert.ok(result.later.includes('data-reference-panel="33"'));
 assert.ok(result.later.includes('data-concept="calm"'));
 assert.notEqual(result.stage2,result.stage3);
});

test('elemental replacement is used as actual equipped and combat artwork for first 16 balls',()=>{
 const g=createGame();
 const data=g.run('Array.from({length:16},(_,id)=>[1,2,3].map(t=>art(id,t)))');
 for(let id=0;id<16;id++)for(let t=1;t<=3;t++){
  assert.ok(data[id][t-1].includes('data-element="'),id+' V'+t);
  assert.ok(data[id][t-1].includes('data-evolution="'+t+'"'));
 }
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const approved=['Przekuwacz','Komórka','Elektryk','Strefa','Promień','WDC','Jabłko','Armata','Wirus','Wielki Kolec','Łuk','Król Elektryków','Zasięg','Mróz','Harpun','Rój'];
test('approved panel 17–32 identifies the real balls, in the correct order',()=>{
 const g=createGame();
 const names=Array.from(g.run('BVBSketch17to32.concepts.map(c=>c.name)'));
 assert.deepEqual(names,approved,'Old element placeholder designs cannot be accepted as the approved second batch');
});
test('all 48 V1–V3 portraits preserve their eyes and distinct identities',()=>{
 const g=createGame();
 const portraits=g.run('Array.from({length:16},(_,i)=>[1,2,3].map(t=>BVBSketch17to32.svgFor(i+16,t)))');
 assert.equal(portraits.length,16);
 const distinct=new Set();
 for(let i=0;i<16;i++)for(let tier=1;tier<=3;tier++){
  const svg=portraits[i][tier-1];
  assert.match(svg,new RegExp('data-ball-id="'+(i+16)+'"'));
  assert.match(svg,new RegExp('data-evolution="'+tier+'"'));
  assert.ok(svg.includes('class="sketch-eyes"'),'Eyes missing from '+approved[i]+' V'+tier);
  assert.match(svg,/@keyframes/,'Animation missing from '+approved[i]+' V'+tier);
  distinct.add(svg);
 }
 assert.equal(distinct.size,48,'All 48 variants require individually addressable visuals');
});

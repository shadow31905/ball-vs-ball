'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const expected=['Eliksir','Konduktor','Czarny Pająk','Grób','Skrzydło Światła','Pudełko Cukierków','Szlam','Kajdany','Kwas','Promień Świetlny','Trujący Gaz','Shuriken','Fibonacci','Kaktus','Bomba','Orbita'];
test('33–48 have ORIGINAL names, distinct V1–V3 pictures and staged visual FX',()=>{
 const g=createGame(),rows=g.run('Array.from({length:16},(_,i)=>{const id=32+i;return {name:B[id].n,concept:BVBSketch33to48.concepts[i].name,tiers:[1,2,3].map(t=>BVBSketch33to48.svgFor(id,t))};})');
 assert.equal(rows.length,16);
 const keys=new Set();
 for(let i=0;i<16;i++){
  assert.equal(rows[i].name,expected[i], 'Original game ball '+(33+i));
  assert.equal(rows[i].concept,expected[i], 'Artwork identity '+(33+i));
  for(let t=1;t<=3;t++){
   const s=rows[i].tiers[t-1];
   assert.ok(s.startsWith('<svg')&&s.endsWith('</svg>'));
   assert.ok(s.includes('aria-label="'+expected[i]+' V'+t+'"'));
   assert.ok(s.includes('data-ball-id="'+(32+i)+'"'));
   assert.ok(s.includes('data-evolution="'+t+'"'));
   assert.ok(s.includes('animation:'),'animation missing');
   assert.ok(!keys.has(s),'reuse of same tier illustration');
   keys.add(s);
  }
 }
 assert.equal(keys.size,48);
});
test('third batch remains unapproved for switching styles until its artwork is signed off',()=>{
 const g=createGame();const r=g.run('Array.from({length:16},(_,i)=>({id:32+i,completed:BVBArtEvolution.isCompletedRework(32+i)}))');
 assert.ok(r.every(x=>!x.completed));
});

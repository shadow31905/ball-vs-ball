'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

const names=['Eliksir','Konduktor','Czarny Pająk','Grób','Skrzydło Światła',
 'Pudełko Cukierków','Szlam','Kajdany','Kwas','Promień Świetlny','Trujący Gaz',
 'Shuriken','Fibonacci','Kaktus','Bomba','Orbita'];
test('16 sketch-faithful third-batch evolution rigs contain 3 progressively richer physical silhouettes',()=>{
 const game=createGame();
 const records=game.run('Array.from({length:16},(_,idx)=>{const id=32+idx;return {id,name:B[id].n,skins:["detailed","classic"].map(style=>[1,2,3].map(tier=>BVBSketch33to48.svgFor(id,tier,style)))};})');
 const allNames=new Set(),allSVG=new Set();
 assert.equal(records.length,16);
 for(let i=0;i<16;i++){
  const row=records[i];
  assert.equal(row.id,i+32);assert.equal(row.name,names[i]);
  allNames.add(row.name);
  assert.equal(row.skins.length,2);
  for(const skins of row.skins){
   assert.equal(skins.length,3);
   const counts=[];
   for(let tier=1;tier<=3;tier++){
    const svg=skins[tier-1];
    assert.ok(svg.startsWith('<svg ')&&svg.endsWith('</svg>'));
    assert.ok(svg.includes('aria-label="'+names[i]+' V'+tier+'"'));
    assert.ok(svg.includes('data-reference-panel="'+(33+i)+'"'));
    assert.ok(svg.includes('data-evolution="'+tier+'"'));
    assert.ok(!/<script\b|<foreignObject\b|onerror=|onload=|\bundefined\b|\bNaN\b/i.test(svg));
    const geometric=(svg.match(/<(?:path|polygon|circle|ellipse|rect)\b/g)||[]).length;
    counts.push(geometric);
    assert.ok(geometric>=12,'No significant ornament geometry '+names[i]+' V'+tier);
    const v2=svg.match(/<g class="sk33-stage2" data-evo-upgrade="V2">([\s\S]*?)<\/g>/);
    const v3=svg.match(/<g class="sk33-stage3" data-evo-upgrade="V3">([\s\S]*?)<\/g>/);
    if(tier===1)assert.ok(!v2&&!v3,'V1 must retain simpler silhouette');
    if(tier===2)assert.ok(v2?.[1].length>=25&&!v3,'V2 must add new equipment');
    if(tier===3)assert.ok(v2?.[1].length>=25&&v3?.[1].length>=25,'V3 must inherit V2 and add final device');
    assert.ok(!allSVG.has(svg),'No duplicated artwork variant across the batch');allSVG.add(svg);
   }
   assert.ok(counts[0]<counts[1],names[i]+' V2 must increase physical silhouette complexity: '+counts);
   assert.ok(counts[1]<counts[2],names[i]+' V3 must increase physical silhouette complexity: '+counts);
  }
 }
 assert.equal(allNames.size,16);assert.equal(allSVG.size,96);
});
test('visual evolution does not grant unapproved third-batch style access',()=>{
 const g=createGame();
 const ok=g.run('Array.from({length:16},(_,n)=>!BVBArtEvolution.isCompletedRework(32+n))');
 assert.equal(ok.every(Boolean),true);
});

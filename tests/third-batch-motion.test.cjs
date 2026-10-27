'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const names=['Eliksir','Konduktor','Czarny Pająk','Grób','Skrzydło Światła','Pudełko Cukierków',
 'Szlam','Kajdany','Kwas','Promień Świetlny','Trujący Gaz','Shuriken','Fibonacci','Kaktus','Bomba','Orbita'];
for(let i=0;i<16;i++){
 test('Third batch #'+(i+33)+' '+names[i]+' has six evolving uniquely animated portraits and three live combat poses',()=>{
  const g=createGame();
  const v=g.run('(()=>{const id='+String(i+32)+';const original=JSON.stringify(S);const variants=[1,2,3].flatMap(t=>["detailed","classic"].map(style=>BVBSketch33to48.svgFor(id,t,style)));const poses=[1,2,3].map(t=>[.31,1.67].map(sec=>BVBSketch33to48.combatPose(id,t,sec)));const valid=BVBSketch33to48.drawCombatSprite(cx,id,3,70,85,22,.8,{complete:true,naturalWidth:128});return {originalName:B[id].n,concept:BVBSketch33to48.concepts[id-32].name,variants,poses,valid,noStateChange:JSON.stringify(S)===original,unapproved:!BVBArtEvolution.isCompletedRework(id)};})()');
  assert.equal(v.originalName,names[i]);assert.equal(v.concept,names[i]);
  assert.equal(v.noStateChange,true);
  assert.equal(v.unapproved,true,'Third batch must not switch visual styles before artwork approval');
  assert.equal(v.valid,true);
  const keys=new Set();
  for(let j=0;j<6;j++){
   const pic=v.variants[j],tier=Math.floor(j/2)+1,style=j%2?'classic':'detailed';
   assert.ok(pic.startsWith('<svg ')&&pic.endsWith('</svg>'));
   assert.ok(pic.includes('aria-label="'+names[i]+' V'+tier+'"'));
   assert.ok(pic.includes('data-evolution="'+tier+'"'));
   assert.ok(pic.includes('data-visual-style="'+style+'"'));
   assert.ok(pic.includes('class="sk33-identity"'));
   assert.ok(pic.includes('class="sk33-ability-fx"'));
   assert.ok(pic.includes('data-skill-effect='));
   assert.ok(pic.includes('@keyframes sk33Skill'));
   assert.ok(pic.includes('@keyframes sk33Fx'));
   assert.ok(!/\b(?:undefined|NaN)\b|<script\b|onerror=|onload=/i.test(pic));
   const key=pic.match(/data-animation-key="([^"]+)"/)?.[1];assert.ok(key);
   assert.ok(pic.includes('svg[data-animation-key="'+key+'"] .sk33-identity'));
   assert.ok(pic.includes('svg[data-animation-key="'+key+'"] .sk33-ability-fx'));
   assert.ok(!keys.has(key),'Duplicate variant selector');keys.add(key);
  }
  assert.equal(keys.size,6);
  for(let j=0;j<3;j++)assert.notEqual(JSON.stringify(v.poses[j][0]),JSON.stringify(v.poses[j][1]),'The equipment must actually move in combat');
 });
}
test('33–48 reject missing images and never render outside their assigned ID range',()=>{
 const g=createGame();const r=g.run('(()=>{const d=BVBSketch33to48.drawCombatSprite;const img={complete:true,naturalWidth:128};return [d(cx,31,1,65,65,20,1,img),d(cx,48,1,65,65,20,1,img),d(cx,32,1,65,65,20,1,null),d(cx,32,1,65,65,20,1,{complete:false,naturalWidth:0}),d(cx,32,1,65,65,-1,1,img),d(cx,32,1,NaN,65,20,1,img)];})()');
 assert.equal(r.every(x=>x===false),true);
});

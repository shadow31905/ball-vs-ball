'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createGame}=require('./game-harness.cjs');
test('first sixteen retain real names and have 48 independent approved texture files',()=>{
 const g=createGame();
 const state=g.run('({names:B.slice(0,16).map(b=>b.n),expected:BVBApprovedArt.names,frames:BVBApprovedArt.frames,all:B.length})');
 assert.equal(state.all,130);assert.deepEqual(Array.from(state.names),Array.from(state.expected));
 assert.equal(state.frames.length,48);assert.equal(new Set(state.frames.map(f=>f.source)).size,48);
 let bytes=0;
 for(const frame of state.frames){
  const file=path.join(__dirname,'..',frame.source),data=fs.readFileSync(file);bytes+=data.length;
  assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');
  assert.ok(frame.id>=0&&frame.id<16);assert.ok(frame.tier>=1&&frame.tier<=3);
 }
 assert.ok(bytes<2500000,'all 48 textures must stay below 2.5 MB');
});
test('collection and combat select identical ball and evolution assets without changing saves',()=>{
 const g=createGame();
 const state=g.run('(()=>{const before=JSON.stringify(S),rows=[];for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){const expected=BVBApprovedArt.frame(id,tier).source;rows.push({expected,html:art(id,tier),image:BVBArtEvolution.imageForTier(id,tier).src,cached:BVBArtEvolution.imageForTier(id,tier)===BVBApprovedArt.imageForTier(id,tier)});}return {rows,intact:before===JSON.stringify(S),unaffected:BVBArtEvolution.svgFor(16,1),invalid:BVBApprovedArt.imageForTier(130,1)};})()');
 for(const row of state.rows){assert.ok(row.html.includes(row.expected));assert.equal(row.image,row.expected);assert.ok(row.cached);}
 assert.ok(state.intact);assert.ok(!state.unaffected.includes('data-approved-art'));assert.equal(state.invalid,null);
});
test('old elemental face and aura painters cannot overpaint any approved character',()=>{
 const g=createGame();
 const state=g.run('(()=>{let old=0;BVBElementalArt.paintCombat=()=>{old++;};const before=JSON.stringify(S);for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++)BVBMotion.drawActor(cx,{b:B[id],x:180,y:180,r:18,tier},{rt:5});return {old,intact:before===JSON.stringify(S)};})()');
 assert.equal(state.old,0);assert.ok(state.intact);
});

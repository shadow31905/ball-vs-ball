'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createGame}=require('./game-harness.cjs');
const expected=['Szarża','Topór','Trujący kolec','Złodziej','Ostrze','Karabin','Pająk','Wampir','Włócznia','Rozbłysk','Szachy','Kostka','Lodowy Stożek','Laser','Wąż','Hak'];
const source=fs.readFileSync(path.resolve(__dirname,'../bvb-first16-independent-art.js'),'utf8');

test('16 exact real in-game identities and 48 authored render variants',()=>{
 const g=createGame(),data=g.run('({names:B.slice(0,16).map(b=>b.n),designs:BVBIndependentFirst16.designs.map(x=>x.name),stages:Array.from({length:16},(_,id)=>[1,2,3].map(t=>BVBArtEvolution.svgFor(id,t)))})');
 assert.deepEqual(Array.from(data.names),expected);
 assert.deepEqual(Array.from(data.designs),expected);
 const all=new Set(),signatures=new Set();
 for(let id=0;id<16;id++){
  const three=data.stages[id];assert.equal(three.length,3);
  for(let t=1;t<=3;t++){
   const svg=three[t-1];assert.match(svg,/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
   assert.ok(svg.endsWith('</svg>'),'incomplete svg '+id+':'+t);
   assert.ok(svg.includes('data-ball-id="'+id+'"'),'wrong ID');
   assert.ok(svg.includes('data-original-name="'+expected[id]+'"'),'wrong original name');
   assert.ok(svg.includes('data-evolution="'+t+'"'),'wrong tier');
   assert.ok(svg.includes('class="bvb-ind-aura"'),'no signature animation');
   assert.ok(svg.includes('class="bvb-ind-core"'),'no detailed core');
   assert.ok(svg.includes('@keyframes bvbIndMotion'+id),'wrong animation keyframe');
   assert.ok(svg.includes('prefers-reduced-motion:reduce'),'accessibility fallback missing');
   assert.ok(!/<script|<foreignObject|\son[a-z]+=/i.test(svg),'unsafe element or handler');
   assert.ok(!all.has(svg),'duplicate drawing '+id+' '+t);all.add(svg);
  }
  assert.ok(three[2].length>three[0].length,'V3 should add bespoke geometry '+id);
  const signature=three[0].match(/@keyframes bvbIndMotion\d+\{([^}]+\}[^}]+\})/);
  assert.ok(signature, 'missing own animation '+id);
  assert.ok(!signatures.has(signature[1]),'reused animation frames '+id);
  signatures.add(signature[1]);
 }
 assert.equal(all.size,48);assert.equal(signatures.size,16);
});
test('approved designs live in collection portraits, cache and keep other IDs untouched',()=>{
 const g=createGame();
 const a=g.run('(()=>{const ids=Array.from({length:16},(_,id)=>[1,2,3].every(t=>art(id,t)===BVBArtEvolution.svgFor(id,t)));const first=BVBArtEvolution.svgFor(0,2),x=BVBArtEvolution.imageForTier(0,2),y=BVBArtEvolution.imageForTier(0,2);return {ids,first,cache:x===y,other:BVBArtEvolution.svgFor(16,1),gallery:BVBArtEvolution.galleryHtml(7)};})()');
 assert.ok(a.ids.every(Boolean));assert.equal(a.cache,true);
 assert.ok(a.first.includes('data-concept="rush"'));
 assert.ok(a.other.includes('data-reference-panel="17"'));
 assert.equal((a.gallery.match(/class="bvb-evo-preview"/g)||[]).length,3);
});
test('16 independent source concept sheets, each with its own V1 V2 V3 and no cropped screenshot',()=>{
 const root=path.resolve(__dirname,'../art-source/individual-first16');
 const files=fs.readdirSync(root).filter(n=>/^ball-\d\d\.svg$/.test(n)).sort();
 assert.equal(files.length,16);
 for(let i=0;i<16;i++){
  const name='ball-'+String(i).padStart(2,'0')+'.svg';assert.equal(files[i],name);
  const svg=fs.readFileSync(path.join(root,name),'utf8');
  assert.ok(svg.includes(expected[i]),name);
  assert.ok(svg.includes('>V1</text>')&&svg.includes('>V2</text>')&&svg.includes('>V3</text>'),name);
  assert.equal((svg.match(/<svg /g)||[]).length,4,'root and 3 individually drawn tiers '+name);
  assert.ok(!/<image\b|data:image\/|\.png|\.webp|\.jpg/i.test(svg),'must not crop or embed a master image');
  assert.ok(!/<script|<foreignObject|\son[a-z]+=/i.test(svg));
 }
});
test('drawing only: 768 animated combat render calls preserve game and profile state',()=>{
 const g=createGame(),v=g.run('(()=>{const before=JSON.stringify(S),round=JSON.stringify(G),p=typeof BVBElementalArt.paintCombat;let calls=0;for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++)for(let frame=0;frame<16;frame++){BVBElementalArt.paintCombat(cx,{b:B[id],x:170,y:180,r:18,tier},{rt:frame/12});calls++;}return {calls,profileSame:before===JSON.stringify(S),gameSame:round===JSON.stringify(G),functionType:p};})()');
 assert.equal(v.calls,768);assert.equal(v.functionType,'function');assert.equal(v.profileSame,true);assert.equal(v.gameSame,true);
});
test('graphics module has no gameplay, network, persistent storage or scheduling calls',()=>{
 for(const re of [/\blocalStorage\b/,/\bfetch\s*\(/,/\bsetTimeout\s*\(/,/\bsetInterval\s*\(/,/\bMath\.random\s*\(/,/\bG\.hp\b/,/\bfoe\.hp\b/,/\bWebSocket\b/,/document\.write/]){
  assert.ok(!re.test(source),'unexpected gameplay or IO '+re);
 }
 assert.ok(source.includes('renderCache'),'render caching missing');
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const realNames=['Echo','Grawitacja','Kotwica','Lustro','Pustka','Słońce','Księżyc','Zaćmienie',
 'Supernowa','Mgławica','Pulsar','Kwazar','Kometa','Asteroida','Kwant','Atom'];
const looks=['echo','gravity','anchor','mirror','void','sun','moon','eclipse',
 'nova','nebula','pulsar','quasar','comet','asteroid','quantum','atom'];
const fixture='function next16c(id,tier){serial=0;G=freshGame(4,[B[id]],[B[0]]);G.ph="battle";G.m=4;G.rt=2;G.th=1;G.obstacles=[];G.fx=[];G.pop=[];G.rings=[];G.bl=[actor(B[id],88,178,0,0,0,tier,0,0),actor(B[0],188,178,Math.PI,1,1,1,0,0)];BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,11214+id);for(const a of G.bl){a.hp=165;a.mh=225;a.baseDmg=11;a.abilityCd=999;a.contact=999;a.vx=a.vy=0;a.status={};a.identity=null;}return G.bl;}';
function play(code){return createGame().run(fixture+'(()=>{'+code+'})()');}
test('real original character names 65–80 preserved, not fake labels from illustration',()=>{
 const g=createGame();
 const names=g.run('B.slice(64,80).map(b=>b.n)');
 assert.deepEqual(Array.from(names),realNames);
 const abilities=g.run('BVBThirdSixteen.names');
 assert.deepEqual(Array.from(abilities),realNames);
});
test('48 hand-authored, animating, independent SVG costumes exist and are used by art()',()=>{
 const g=createGame();
 const v=g.run('Array.from({length:16},(_,i)=>[1,2,3].map(t=>({source:BVBSketch65to80.svgFor(i+64,t),live:art(i+64,t)})))');
 const seen=new Set();
 for(let i=0;i<16;i++)for(let t=1;t<=3;t++){
  const x=v[i][t-1];assert.equal(x.source,x.live);
  assert.ok(x.live.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
  assert.ok(x.live.endsWith('</svg>'));
  assert.ok(x.live.includes('data-evolution="'+t+'"'));
  assert.ok(x.live.includes('data-ball-id="'+(64+i)+'"'));
  assert.ok(x.live.includes('data-visual-identity="'+looks[i]+'"'));
  assert.ok(x.live.includes('class="sk65-core"'));
  assert.ok(x.live.includes('class="sk65-halo"'));
  assert.ok(x.live.includes('@keyframes sk65Pulse'));
  assert.ok(!/<script|<foreignObject|\sonerror=|\sonload=/i.test(x.live));
  assert.ok(!seen.has(x.live),(i+65)+' V'+t+' unique costume');
  seen.add(x.live);
 }
 assert.equal(seen.size,48);
 const scene=g.run('({gallery:BVBArtEvolution.galleryHtml(79),next:BVBArtEvolution.svgFor(80,1)})');
 assert.equal((scene.gallery.match(/class="bvb-evo-preview"/g)||[]).length,3);
 assert.ok(scene.next.includes('data-bvb-art-v2'));
});
test('all distinct V1 signatures cast in live battle',()=>{
 const rows=play('const r=[];for(let id=64;id<80;id++){const [o,f]=next16c(id,1);specialAbility(o,f);r.push({id,active:o.v4Signature?.id,casts:o.v4Casts||0,shots:G.v2.shots.length,zones:G.v2.hazards.length,beams:G.v2.beams.length,mark:o.v4MoonPhase,anchor:!!o.v4Anchor,mirror:!!o.v4Mirror,void:!!o.v4Void,sun:!!o.v4Sun,comet:!!o.v4Comet,rocks:!!o.v4Asteroids,atom:!!o.v4Atom,finite:[o.x,o.y,f.x,f.y].every(Number.isFinite)});}return r;');
 assert.equal(rows.length,16);
 for(let i=0;i<16;i++){
  assert.equal(rows[i].active,i+64);
  assert.equal(rows[i].casts,1);
  assert.ok(rows[i].finite);
 }
 assert.ok(rows[0].beams>0,'Echo plays an acoustic beam');
 assert.ok(rows[1].zones>0,'Gravity well exists');
 assert.equal(rows[2].anchor,true,'Anchor wall-charge exists');
 assert.equal(rows[3].mirror,true,'Mirror projectile reflection enabled');
 assert.equal(rows[4].void,true,'Void projectile absorption enabled');
 assert.equal(rows[5].sun,true,'Sun radiant aura exists');
 assert.equal(rows[6].mark,0,'Moon selects phase one');
 assert.ok(rows[7].zones===0,'Eclipse debuffs target instead of making generic trap');
 assert.ok(rows[8].zones>0,'Supernova explosion is telegraphed');
 assert.ok(rows[9].zones>0,'Nebula has moving cloud');
 assert.ok(rows[10].zones===0,'Pulsar first plays a radial impulse');
 assert.ok(rows[11].beams>=2,'Quasar has opposite jets');
 assert.equal(rows[12].comet,true,'Comet leaves a frozen path');
 assert.equal(rows[13].rocks,true,'Asteroid has real rotating fragment state');
 assert.ok(rows[14].shots>0,'Quantum attacks from second location');
 assert.equal(rows[15].atom,true,'Atom has electron state');
});
test('all 16 game skills add different gameplay at V2 and V3',()=>{
 const rows=play('const out=[];for(let id=64;id<80;id++){const variants=[];for(let tier=1;tier<=3;tier++){const [o,f]=next16c(id,tier);specialAbility(o,f);variants.push(JSON.stringify({shots:G.v2.shots.map(s=>[s.id,s.damage,s.ghost,s.bounces]),zones:G.v2.hazards.map(h=>[h.kind,h.x,h.y,h.radius]),beams:G.v2.beams.map(b=>[b.x,b.y,b.x2,b.y2]),owner:[o.x,o.y,o.hp,o.status.shield||0],foe:[f.hp,f.vx,f.vy,JSON.stringify(f.status),JSON.stringify(f.aiTarget)],sig:[o.v4Signature?.next,o.v4Signature?.max]}));}out.push({id,variants});}return out;');
 assert.equal(rows.length,16);
 for(const r of rows){
  assert.notEqual(r.variants[0],r.variants[1],'V2 real mechanic '+r.id);
  assert.notEqual(r.variants[1],r.variants[2],'V3 real mechanic '+r.id);
 }
});
test('descriptions for V2 and V3 are uniquely specific to each real named ball',()=>{
 const g=createGame();
 const data=g.run('Array.from({length:16},(_,i)=>[2,3].map(t=>BVB2.evolutionDescription(i+64,t)))');
 assert.equal(new Set(data.map(x=>x[0])).size,16);
 assert.equal(new Set(data.map(x=>x[1])).size,16);
 for(const row of data){assert.ok(row[0].startsWith('V2:'));assert.ok(row[1].startsWith('V3:'));assert.notEqual(row[0],row[1]);}
});
test('evolving skills does not directly raise base HP or base damage',()=>{
 const g=createGame();
 const data=g.run('Array.from({length:16},(_,i)=>[1,2,3].map(t=>getBallStats(i+64,t,0,0)))');
 for(const stages of data){
  assert.equal(stages[0].hp,stages[1].hp);assert.equal(stages[1].hp,stages[2].hp);
  assert.equal(stages[0].dmg,stages[1].dmg);assert.equal(stages[1].dmg,stages[2].dmg);
 }
});
test('all 48 variants stay finite and deterministic through live simulation',()=>{
 const source='const out=[];for(let id=64;id<80;id++)for(let tier=1;tier<=3;tier++){const [o,f]=next16c(id,tier);specialAbility(o,f);BVB2.onContact(G,o,f,10);o.x=17;BVB2.onWall(o,"left");for(let j=0;j<62&&G.ph==="battle";j++)step(1/60);out.push({id,tier,finite:G.bl.every(a=>[a.x,a.y,a.hp,a.vx,a.vy].every(Number.isFinite)),bounded:G.v2.hazards.length<=45&&G.v2.shots.length<=80,hp:o.hp,foeHp:f.hp,n:G.v2.shots.length,m:G.v2.hazards.length});}return out;';
 const a=play(source),b=play(source);
 assert.equal(a.length,48);
 assert.ok(a.every(x=>x.finite&&x.bounded));
 assert.deepEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)));
});
test('battle aura painter does not touch currency, upgrades, or match outcome',()=>{
 const g=createGame();
 const a=g.run('(()=>{const before=JSON.stringify(S);for(let id=64;id<80;id++)for(let tier=1;tier<=3;tier++)BVBSketch65to80.paintCombat(cx,{b:B[id],x:160,y:170,r:17,tier},{rt:4});return {unchanged:before===JSON.stringify(S),count:BVBSketch65to80.count};})()');
 assert.ok(a.unchanged);assert.equal(a.count,16);
});

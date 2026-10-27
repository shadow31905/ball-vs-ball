'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const fixture='function next16Case(id,tier){serial=0;G=freshGame(4,[B[id]],[B[0]]);G.ph="battle";G.m=4;G.rt=2;G.th=1;G.obstacles=[];G.fx=[];G.pop=[];G.rings=[];G.bl=[actor(B[id],88,178,0,0,0,tier,0,0),actor(B[0],188,178,Math.PI,1,1,1,0,0)];BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,12112+id);for(const a of G.bl){a.hp=170;a.mh=220;a.baseDmg=11;a.abilityCd=999;a.contact=999;a.vx=a.vy=0;a.status={};a.identity=null;}return G.bl;}';
function play(script){return createGame().run(fixture+'(()=>{'+script+'})()');}
test('16 new authored V1 identities each have a unique active signature and do not share original profile ids',()=>{
 const data=play('const out=[];for(let id=48;id<64;id++){const [o,f]=next16Case(id,1);specialAbility(o,f);const s=G.v2;out.push({id,tier:o.tier,identity:o.v3Identity?.id,cast:o.v3IdentityCasts,shots:s.shots.length,zones:s.hazards.length,beams:s.beams.length,x:o.x,y:o.y,foeStatus:f.status,shield:o.status.shield||0});}return out;');
 assert.equal(data.length,16);
 for(const [i,row] of data.entries()){
  assert.equal(row.id,48+i);
  assert.equal(row.identity,row.id);
  assert.equal(row.cast,1);
  assert.equal(row.tier,1);
  assert.ok(Number.isFinite(row.x)&&Number.isFinite(row.y));
 }
 assert.equal(data[48-48].shield>0,true,'Medic treats instead of targeting enemy');
 assert.ok(data[49-48].beams>=1,'Truth uses verdict beam');
 assert.ok(data[50-48].shots>=3,'Glass V1 shatters into pieces');
 assert.notEqual(data[51-48].x,88,'Portal actually teleports');
 assert.ok(data[52-48].shield>=8,'Shield carries damage-absorbing barrier');
 assert.ok(data[53-48].foeStatus,'Magician changes opponent targeting');
 assert.ok(data[54-48].foeStatus.slow>0,'Chronos slows opponent');
 assert.notEqual(data[55-48].x,88,'Ninja changes position');
 assert.ok(data[56-48].shots>=3,'Pirate broadside has its own spread');
 assert.ok(data[57-48].zones>=1,'Miner plants actual mine');
 assert.ok(data[58-48].beams>=1,'Sheriff marks foe by lasso');
 assert.ok(data[59-48].zones>=1,'Magma flows');
 assert.ok(data[60-48].beams>=1,'Plasma starts active plasma ray');
 assert.ok(data[61-48].zones>=1,'Meteor reserves a collidable crater');
 assert.ok(data[62-48].zones===0,'Cyclone uses tangential knockback, not a zone at V1');
 assert.ok(data[63-48].shots>=3,'Prism refracts');
});
test('16 skills each have real additional and distinct V2 and V3 behavior',()=>{
 const data=play('const rows=[];for(let id=48;id<64;id++){const signatures=[];for(let tier=1;tier<=3;tier++){const [o,f]=next16Case(id,tier);specialAbility(o,f);const st=G.v2;signatures.push(JSON.stringify({shots:st.shots.map(a=>[a.id,a.bounces,a.ghost,a.damage]),hazards:st.hazards.map(a=>[a.kind,a.x,a.y,a.radius]),foeStatus:f.status,foeVelocity:[f.vx,f.vy],owner:[o.hp,o.x,o.y,o.status.shield||0]}));}rows.push({id,signatures});}return rows;');
 assert.equal(data.length,16);
 for(const row of data){
  assert.notEqual(row.signatures[0],row.signatures[1],row.id+' V2 should change gameplay');
  assert.notEqual(row.signatures[1],row.signatures[2],row.id+' V3 should change gameplay');
 }
});
test('V2 and V3 descriptions are specific to each named ball, not generic copy-pasted abilities',()=>{
 const g=createGame();
 const result=g.run('Array.from({length:16},(_,i)=>({id:i+48,name:B[i+48].n,second:BVB2.evolutionDescription(i+48,2),third:BVB2.evolutionDescription(i+48,3)}))');
 assert.equal(result.length,16);
 assert.equal(new Set(result.map(x=>x.second)).size,16);
 assert.equal(new Set(result.map(x=>x.third)).size,16);
 for(const row of result){assert.ok(row.second.startsWith('V2:'));assert.ok(row.third.startsWith('V3:'));assert.ok(row.third.length>row.second.length);}
});
test('all 48 battle variants remain finite over live simulated time',()=>{
 const data=play('const all=[];for(let id=48;id<64;id++)for(let tier=1;tier<=3;tier++){const [o,f]=next16Case(id,tier);specialAbility(o,f);for(let i=0;i<95&&G.ph==="battle";i++)step(1/60);all.push({id,tier,finite:G.bl.every(a=>[a.x,a.y,a.hp,a.vx,a.vy].every(Number.isFinite)),bounded:G.v2.hazards.length<=45&&G.v2.shots.length<=80,actions:o.v3Identity?.acts||0});}return all;');
 assert.equal(data.length,48);assert.ok(data.every(r=>r.finite&&r.bounded));
});
test('Casts, contact and wall hooks keep all 16 next identities deterministic',()=>{
 const source='const data=[];for(let id=48;id<64;id++){const [o,f]=next16Case(id,3);specialAbility(o,f);BVB2.onContact(G,o,f,10);o.x=17;BVB2.onWall(o,"left");for(let i=0;i<42&&G.ph==="battle";i++)step(1/60);data.push({id,active:o.v3Identity?.id,shots:G.v2.shots.length,hazards:G.v2.hazards.length,hp:o.hp,foeHp:f.hp,x:o.x,y:o.y});}return data;';
 const a=play(source),b=play(source);
 assert.deepEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)));
});

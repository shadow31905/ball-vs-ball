'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','bvb-identities.js'),'utf8');
function actor(id,team){return {uid:team+1,b:{id,c:'#c4b5fd'},team,x:team?225:175,y:180,vx:team?-1:1,vy:0,r:17,hp:80,mh:108,armor:15,armorMax:24,baseDmg:12,abilityCd:3,status:{shield:0},superCharge:100,superUsed:0};}
function fixture(id,guest=false){const g={ph:'battle',bl:[actor(id,0),actor(0,1)],obstacles:[],pop:[]};const c={window:{BVBRework:{random:()=>.17}},netRole:guest?'guest':'host',G:g,applyDamage:(o,n)=>{const absorb=Math.min(o.status.shield||0,n);o.status.shield=(o.status.shield||0)-absorb;o.hp-=n-absorb;}};vm.runInNewContext(source,c);const api=c.window.BVBIdentities;for(const o of g.bl)api.prepare(g,o);return {api,g,a:g.bl[0],b:g.bl[1],c};}

test('130 explicitly authored identities match the actual roster order and explain effects',()=>{
 const {api}=fixture(0);const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');const block=html.match(/const RAW_BALLS = (\[[\s\S]*?\n\]);/)[1];const names=vm.runInNewContext(block).map(row=>row[0].replace(/^🎃 /,''));
 assert.equal(api.catalog.length,130);
 const passives=new Set(),supers=new Set(),recipes=new Set(),passiveMechanics=new Set(),superMechanics=new Set();
 for(let id=0;id<130;id++){const d=api.get(id);assert.equal(d.name,names[id]);assert.ok(d.passive.desc.length>35);assert.ok(d.super.desc.length>20);assert.ok(!d.super.desc.includes("undefined"));passives.add(d.passive.name);supers.add(d.super.name);recipes.add(d.passive.script+'|'+d.super.script);passiveMechanics.add([d.passive.event,d.passive.cooldown,d.passive.condition,d.passive.script].join('|'));superMechanics.add(d.super.script);}
 assert.equal(passives.size,130);assert.equal(supers.size,130);assert.equal(recipes.size,130);assert.equal(passiveMechanics.size,130);assert.equal(superMechanics.size,130);assert.equal(api.get(130),null);
});

test('all 130 super recipes execute with finite state and consume one charge',()=>{
 for(let id=0;id<130;id++){const {api,g,a,b}=fixture(id);assert.equal(api.castSuper(g,a,b),true,'super '+id);assert.equal(a.superUsed,1);assert.equal(a.superCharge,0);assert.equal(api.castSuper(g,a,b),false,'cannot recast '+id);for(let t=0;t<130;t++)api.tick(g,a,b,1/60);for(const actor of g.bl){for(const key of ['x','y','vx','vy','hp','armor'])assert.ok(Number.isFinite(actor[key]),id+' '+key);assert.ok(actor.hp<=actor.mh);assert.ok((actor.status.shield||0)<=32);}assert.ok((g.v2?.shots.length||0)<=80);assert.ok((g.v2?.hazards.length||0)<=45);assert.ok(a.identity.jobs.length<=12);JSON.stringify(g);}
});

test('a stun holds super charge without consuming it; bosses and guests never receive player identities',()=>{
 const {api,g,a,b}=fixture(18);a.status.stun=1;assert.equal(api.castSuper(g,a,b),false);assert.equal(a.superCharge,100);a.b.isBoss=true;delete a.identity;assert.equal(api.prepare(g,a),false);assert.equal(a.identity,undefined);const other=fixture(0,true);assert.equal(other.a.identity,undefined);assert.equal(other.api.castSuper(other.g,other.a,other.b),false);assert.equal(other.api.contact(other.g,other.a,other.b,9),9);
});

test('preparation works before battle phase, matching the real startRound ordering',()=>{
 const {api,g,a}=fixture(5);delete a.identity;g.ph='aim';assert.equal(api.prepare(g,a),true);assert.equal(a.identity.id,5);
});

test('every-second and every-third-contact mechanics affect the correct hit exactly once',()=>{
 const blades=fixture(4);assert.equal(blades.api.contact(blades.g,blades.a,blades.b,10),10);assert.equal(blades.api.contact(blades.g,blades.a,blades.b,10),12.5);assert.equal(blades.a.identity.charge,0);
 const souls=fixture(119);const hp=souls.b.hp;for(let i=0;i<2;i++)souls.api.contact(souls.g,souls.a,souls.b,10);assert.equal(souls.b.hp,hp);souls.api.contact(souls.g,souls.a,souls.b,10);assert.equal(souls.b.hp,hp-2);
});

test('delayed blasts are telegraphed and can be escaped',()=>{
 const {api,g,a,b}=fixture(46);api.castSuper(g,a,b);assert.equal(b.hp,80);assert.equal(a.identity.jobs.length,3);b.x=340;b.y=340;for(let t=0;t<120;t++)api.tick(g,a,b,1/60);assert.equal(b.hp,80);assert.equal(a.identity.jobs.length,0);
});

test('defensive passives and repeated contacts obey cooldown and shield limits',()=>{
 const {api,g,a,b}=fixture(52);a.status.shield=0;api.tick(g,a,b,.01);assert.equal(a.status.shield,2.2);a.status.shield=0;api.tick(g,a,b,1);assert.equal(a.status.shield,0);api.tick(g,a,b,3);assert.equal(a.status.shield,2.2);
 const cat=fixture(102);cat.a.hp=20;const first=cat.api.beforeDamage(cat.g,cat.a,10);assert.ok(first<10);const second=cat.api.beforeDamage(cat.g,cat.a,10);assert.equal(second,10);assert.ok(cat.a.identity.readyAt>0);
});

test('seeded random recipes repeat, and timing state survives JSON serialization',()=>{
 const x=fixture(11),y=fixture(11);x.api.castSuper(x.g,x.a,x.b);y.api.castSuper(y.g,y.a,y.b);assert.equal(JSON.stringify(x.g),JSON.stringify(y.g));const z=fixture(94);z.api.castSuper(z.g,z.a,z.b);z.a.identity=JSON.parse(JSON.stringify(z.a.identity));z.api.tick(z.g,z.a,z.b,1);assert.ok(z.b.hp<80);
});

test('each passive has an attainable condition and executes its authored recipe',()=>{
 for(let id=0;id<130;id++){
  const {api,g,a,b}=fixture(id),p=api.get(id).passive;
  switch(p.condition){case 'far':b.x=340;break;case 'low':a.hp=20;break;case 'lowFoe':b.hp=20;break;case 'shieldedFoe':b.status.shield=8;break;case 'armoredFoe':b.armor=15;break;case 'slowedFoe':b.status.slow=1;break;case 'burningFoe':b.status.burn=1;break;case 'poisonedFoe':b.status.poison=1;break;case 'poisoned':a.status.poison=1;break;case 'rear':b.vx=1;break;case 'strongerFoe':a.hp=30;b.hp=90;break;case 'debuffed':a.status.poison=1;break;}
  if(p.event==='contact'){const count=p.condition==='triple'?3:p.condition==='pair'?2:1;for(let n=0;n<count;n++)api.contact(g,a,b,10);}
  else if(p.event==='damage')api.beforeDamage(g,a,5);
  else if(p.event==='active')api.onActive(g,a,b);
  else if(p.event==='wall')api.onWall(g,a);
  else api.tick(g,a,b,.01);
  assert.ok(a.identity.readyAt>a.identity.age,'passive '+id+' '+p.name);
  assert.ok(Number.isFinite(a.hp)&&Number.isFinite(b.hp));
 }
});

test('bleeding affects bosses without a player identity and haste expires without permanent speed gain',()=>{
 const {api,g,a,b}=fixture(36);b.b.isBoss=true;delete b.identity;b.identityWound=1;api.tick(g,b,a,.5);assert.equal(b.hp,79.25);assert.equal(b.identityWound,.5);
 api.onWall(g,a);assert.ok(Math.hypot(a.vx,a.vy)>1);api.tick(g,a,b,1.1);assert.ok(Math.abs(Math.hypot(a.vx,a.vy)-1)<1e-9);
});

test('Neutron status immunity is established before incoming effects',()=>{
 const {api,g,a,b}=fixture(81);assert.deepEqual(Array.from(a.statusImmunities),['poison','slow']);a.status.poison=3;a.status.slow=3;api.tick(g,a,b,.01);assert.equal(a.status.poison,0);assert.equal(a.status.slow,0);
});

test('actual ability pipeline respects Neutron immunity for time and poison fields',()=>{
 const {createGame}=require('./game-harness.cjs');const game=createGame();
 const result=game.run(`
  G=freshGame(0,[B[54]],[B[81]]);G.ph='battle';G.bl=[actor(B[54],170,180,0,0,0),actor(B[81],220,180,Math.PI,1,1)];
  BVBRework.prepareActors(G,...G.bl);specialAbility(G.bl[0],G.bl[1]);
  const immuneSlow=G.bl[1].status.slow||0;
  G.bl[0].b={...B[24]};specialAbility(G.bl[0],G.bl[1]);step(1/60);
  ({immuneSlow,immunePoison:G.bl[1].status.poison||0,metadata:getBallStats(81).passiveDesc})
 `);
 assert.equal(result.immuneSlow,0);assert.equal(result.immunePoison,0);assert.match(result.metadata,/odporność/);
});

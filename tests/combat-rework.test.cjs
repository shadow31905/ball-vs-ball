'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'bvb-combat-rework.js'),'utf8');
function actor(id,team,isBoss=false){
  return {b:{id,isBoss},team,x:team?180:170,y:team?60:300,
    r:isBoss?24:17,vx:0,vy:team?1:-1,hp:100,mh:100,
    abilityCd:0,status:{shield:10}};
}
function fixture(random=()=>.5){
  const g={m:0,ph:'battle',rt:0,bl:[actor(0,0),actor(1,1,true)],
    obstacles:[],pop:[],rings:[]};
  let result=null,events=0;
  const context={
    window:{BVB2:{abilities:Array.from({length:130},(_,i)=>({kind:i===0?'charge':'shock'}))},
      BVBCampaign:{onRoundEnd:()=>events++}},
    G:g,netRole:'none',diff:3,Math:Object.assign(Object.create(Math),{random}),
    applyDamage:(target,damage)=>{
      const blocked=Math.min(target.status.shield||0,damage);
      target.status.shield-=blocked;
      target.hp-=damage-blocked;
    },
    roundEnd:w=>{result=w;g.ph='end';}
  };
  vm.runInNewContext(source,context,{filename:'bvb-combat-rework.js'});
  const api=context.window.BVBRework;
  api.prepareActors(g,...g.bl);
  return {g,api,context,getResult:()=>result,getEvents:()=>events};
}

test('shield absorbs raw damage; armor wears down and mitigates HP loss',()=>{
  const {g,context}=fixture();
  const b=g.bl[1],before=b.armor;
  context.applyDamage(b,20);
  assert.equal(b.status.shield,0);
  assert.ok(b.hp>90&&b.hp<100);
  assert.ok(b.armor<before);
});
test('critical contact damage and weakness use controlled multipliers',()=>{
  const {g,api}=fixture(()=>0);
  const [a,b]=g.bl;b.weakTo='physical';
  const damage=api.contactDamage(a,b,10);
  assert.ok(Math.abs(damage-(10*1.32*1.12*1.06))<1e-9);
  assert.equal(a.combatStats.crits,1);
  assert.equal(a.combatStats.contactHits,1);
});
test('AI delays ability only briefly and preserves speed when steering',()=>{
  const {g,api}=fixture();
  const [a,b]=g.bl;a.vx=1.4;a.vy=0;
  assert.equal(api.abilityReady(a,b,g,1/60),false);
  let eventuallyReady=false;
  for(let i=0;i<60;i++)if(api.abilityReady(a,b,g,1/60)){eventuallyReady=true;break;}
  assert.equal(eventuallyReady,true);
  api.beforeStep(g,1/60);
  assert.ok(Math.hypot(a.vx,a.vy)>1.3);
});
test('arena shifts, boss phase and 60s match limit',()=>{
  const {g,api,getResult,getEvents}=fixture(()=>.5);
  g.rt=16;api.beforeStep(g,1/60);
  assert.equal(g.arenaShiftCount,1);
  assert.ok(g.arenaNextShift>16);
  g.bl[1].hp=30;
  api.afterStep(g,1/60);
  assert.equal(g.bl[1].bossPhase,3);
  g.rt=60;api.afterStep(g,1/60);
  assert.equal(g.ph,'end');
  assert.equal(getResult(),0);
  assert.equal(getEvents(),1);
});
test('every one of 130 IDs has a passive/super signature and can charge a super',()=>{
  const signatures=new Set();
  for(let id=0;id<130;id++){
    const {g,api}=fixture();
    g.bl[0].b.id=id;
    api.prepareActors(g,...g.bl);
    const o=g.bl[0];
    assert.ok(o.passiveType>=0&&o.passiveType<10);
    assert.ok(o.superType>=0&&o.superType<10);
    signatures.add(o.passiveType+':'+o.superType+':'+id%7);
    o.superCharge=100;
    api.afterStep(g,1/60);
    assert.equal(o.superUsed,1);
    assert.equal(o.superCharge,0);
  }
  assert.equal(signatures.size,130);
});
test('burn + freeze status reaction damages at most once per second',()=>{
  const {g,api}=fixture();
  const o=g.bl[0];o.status.shield=0;o.status.burn=2;o.status.slow=2;
  const hp=o.hp;
  api.beforeStep(g,1/60);
  assert.ok(o.hp<hp);
  const after=o.hp;
  api.beforeStep(g,1/60);
  assert.equal(o.hp,after);
});
test('six bosses telegraph an arena attack before damage',()=>{
 for(let index=0;index<6;index++){
   const {g,api}=fixture();
   g.m=11;g.bossIndex=index;
   g.rt=7.1;api.afterStep(g,1/60);
   assert.ok(g.bossTelegraph,'missing boss telegraph '+index);
   assert.equal(g.bossTelegraph.index,index);
   g.rt=8.4;api.afterStep(g,1/60);
   assert.equal(g.bossTelegraph,null);
 }
});
test('spectator module and automatic online handshake are wired',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const ui=fs.readFileSync(path.join(root,'bvb-combat-ui.js'),'utf8');
 new vm.Script(ui,{filename:'bvb-combat-ui.js'});
 for(const needle of ['bvb-combat-ui.js','window.BVBReworkUI?.frame?.(G,elapsed)',
  'window.BVBReworkUI?.endRound?.(G,winner)','if(G.m===12)fire();',
  'remoteAimAngle != null) launchMatch(remoteAimAngle)'])
  assert.ok(html.includes(needle),needle);
});
test('seeded RNG repeats across runs and state hashes detect divergence',()=>{
 const a=fixture(),b=fixture();
 const seed=0x51bc35a7;
 a.api.setSeed(a.g,seed);b.api.setSeed(b.g,seed);
 const sequenceA=Array.from({length:100},()=>a.api.random());
 const sequenceB=Array.from({length:100},()=>b.api.random());
 assert.equal(JSON.stringify(sequenceA),JSON.stringify(sequenceB));
 assert.equal(a.api.stateHash(a.g),b.api.stateHash(b.g));
 b.g.bl[0].hp-=1;
 assert.ok(a.api.stateHash(a.g)!==b.api.stateHash(b.g));
 assert.ok(sequenceA.every(n=>n>=0&&n<1));
});
test('five AI profiles have distinct reaction times and target decisions',()=>{
 const clocks=[];
 for(let difficulty=0;difficulty<5;difficulty++){
   const {g,api,context}=fixture();
   context.diff=difficulty;
   g.bl[1].x=90;g.bl[1].y=65;
   g.bl[0].x=260;g.bl[0].y=280;
   api.beforeStep(g,1/60);
   clocks.push(g.bl[1].aiDecisionClock);
   assert.ok(Number.isFinite(g.bl[1].aiTarget.vx));
   assert.ok(Number.isFinite(g.bl[1].aiTarget.vy));
 }
 assert.equal(new Set(clocks.map(n=>n.toFixed(2))).size,5);
 for(let i=1;i<5;i++)assert.ok(clocks[i]<clocks[i-1]);
});
test('bounded combat diagnostics expose seed, hash and recent events',()=>{
 const {g,api}=fixture();
 api.setSeed(g,0x33445566);
 const pair=g.bl;api.contactDamage(pair[0],pair[1],12);
 g.rt=20;api.beforeStep(g,1/60);
 let data=api.diagnostics(g);
 assert.equal(data.schemaVersion,1);
 assert.equal(data.seed,0x33445566);
 assert.ok(data.stateHash.length===8);
 assert.ok(data.events.some(e=>e.type==='ARENA_SHIFT'));
 for(let i=0;i<300;i++)api.trace(g,'TEST',{i});
 data=api.diagnostics(g);
 assert.ok(data.events.length<=250);
});
test('main HTML includes all combat hooks and valid inline JS',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  for(const needle of [
    'bvb-combat-rework.js',
    'window.BVBRework?.prepareActors?.(G,p,e)',
    'window.BVBRework?.beforeStep?.(G,dt)',
    'window.BVBRework?.afterStep?.(G,dt)',
    'window.BVBRework?.contactDamage?.(b,a,impactA)'
  ])assert.ok(html.includes(needle),needle);
  const match=html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(match);
  new vm.Script(match[1],{filename:'index-inline.js'});
});

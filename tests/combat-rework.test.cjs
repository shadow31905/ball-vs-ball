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

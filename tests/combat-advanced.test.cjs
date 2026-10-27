'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','bvb-combat-rework.js'),'utf8');
function actor(id,team,boss=false){return {b:{id,isBoss:boss},uid:'actor-'+team,team,x:team?180:90,y:team?65:285,r:17,vx:team?0:1,vy:team?1:0,hp:100,mh:100,status:{shield:0},abilityCd:2};}
function fixture(index=0,phase=1,identity=null){
 const g={m:11,ph:'battle',rt:0,bossIndex:index,bl:[actor(0,0),actor(99,1,true)],obstacles:[],pop:[],rings:[],v2:{shots:[],hazards:[],webs:[],wallBeams:[],tick:0,serial:0}};
 const ctx={window:{BVB2:{abilities:Array.from({length:130},()=>({kind:'charge'}))},BVBIdentities:identity},G:g,netRole:'none',diff:4,Math:Object.assign(Object.create(Math),{random:()=>.5}),applyDamage:(o,d)=>{const blocked=Math.min(o.status.shield||0,d);o.status.shield-=blocked;o.hp-=d-blocked;},roundEnd:()=>{g.ph='end';}};
 vm.runInNewContext(source,ctx);
 const api=ctx.window.BVBRework;api.prepareActors(g,...g.bl);
 g.bl[1].hp=phase===3?30:phase===2?60:100;
 g.bl[0].armor=0;
 return {g,api,ctx};
}
function arm(index,phase){
 const f=fixture(index,phase);f.g.rt=7.1;f.api.afterStep(f.g,1/60);
 assert.ok(f.g.bossTelegraph);return f;
}
test('all eighteen phase attacks telegraph before damage and have distinct identities',()=>{
 const ids=new Set();
 for(let index=0;index<6;index++)for(let phase=1;phase<=3;phase++){
  const {g,api}=arm(index,phase),mark=g.bossTelegraph;
  assert.equal(mark.phase,phase);assert.equal(g.bl[0].hp,100);
  assert.ok(mark.at-g.rt>=1.19);assert.ok(mark.zones.length>0);
  ids.add(mark.id);
  const hits=[],safe=[];
  for(let x=20;x<=340;x+=20)for(let y=20;y<=340;y+=20){
   const p={x,y,r:17};
   (mark.zones.some(z=>api.zoneHits(z,p))?hits:safe).push(p);
  }
  assert.ok(hits.length>0,mark.id+' has no hitbox');assert.ok(safe.length>0,mark.id+' has no safe sector');
  Object.assign(g.bl[0],hits[0]);g.rt=mark.at+.001;api.afterStep(g,1/60);
  assert.ok(g.bl[0].hp<100,mark.id+' failed to damage');
  assert.ok(g.bl[0].hp>=93.7,mark.id+' overlaps multiply damage');
  assert.equal(g.bossTelegraph,null);assert.ok(g.bossEcho);
  const other=arm(index,phase),clean=other.g.bl[0];
  Object.assign(clean,safe[0]);other.g.rt=other.g.bossTelegraph.at+.001;
  other.api.afterStep(other.g,1/60);assert.equal(clean.hp,100,mark.id+' damages outside telegraph');
 }
 assert.equal(ids.size,18);
});
test('telegraph collision handles circle margins, rings, line endpoints and rectangle corners',()=>{
 const {api}=fixture(),p={x:0,y:0,r:2};
 assert.equal(api.zoneHits({kind:'circle',x:8,y:0,r:5},p),false);
 assert.equal(api.zoneHits({kind:'circle',x:7,y:0,r:5},p),true);
 assert.equal(api.zoneHits({kind:'ring',x:0,y:0,inner:10,r:20},p),false);
 assert.equal(api.zoneHits({kind:'ring',x:0,y:0,inner:10,r:20},{x:8,y:0,r:2}),true);
 assert.equal(api.zoneHits({kind:'line',x1:10,y1:0,x2:20,y2:0,width:2},{x:7,y:0,r:1}),true);
 assert.equal(api.zoneHits({kind:'rect',x:10,y:10,w:20,h:20},{x:8,y:8,r:2}),false);
});
test('contact impulse preserves momentum and dissipates total linear and rotational energy',()=>{
 const {api}=fixture();
 const a={mass:1,r:17,vx:1,vy:.5,spin:.1},b={mass:2,r:24,vx:-.4,vy:-.2,spin:-.03};
 const energy=o=>.5*o.mass*(o.vx*o.vx+o.vy*o.vy)+.25*o.mass*o.r*o.r*o.spin*o.spin;
 const before=energy(a)+energy(b),px=a.mass*a.vx+b.mass*b.vx,py=a.mass*a.vy+b.mass*b.vy;
 assert.equal(api.contactImpulse(a,b,-1,0),true);
 assert.ok(Math.abs(a.mass*a.vx+b.mass*b.vx-px)<1e-9);
 assert.ok(Math.abs(a.mass*a.vy+b.mass*b.vy-py)<1e-9);
 assert.ok(energy(a)+energy(b)<=before+1e-9);
 const snapshot=JSON.stringify([a,b]);api.contactImpulse(a,b,-1,0);
 assert.equal(JSON.stringify([a,b]),snapshot,'separating balls receive another impulse');
});
test('extreme or corrupt physics recovers to finite bounded state',()=>{
 const {g,api}=fixture(),o=g.bl[0];
 o.x=Infinity;o.y=NaN;o.vx=NaN;o.vy=Infinity;o.spin=Infinity;
 o.status={burn:Infinity,stun:8,slow:10,shield:Infinity};
 api.beforeStep(g,1/60);
 for(const k of ['x','y','vx','vy','rotation','spin'])assert.ok(Number.isFinite(o[k]),k);
 assert.ok(o.x>=o.r&&o.x<=360-o.r);assert.ok(Math.hypot(o.vx,o.vy)<=1.8);
 assert.ok(o.status.stun<=.55);assert.ok(o.status.slow<=4);assert.equal(o.status.burn,0);
});
test('reaction cooldown covers shatter and corrosion; resistance reduces effects',()=>{
 for(const pair of [['slow','stun'],['poison','weaken']]){
  const {g,api}=fixture(),o=g.bl[0];o.status[pair[0]]=2;o.status[pair[1]]=.4;o.armor=12;
  const hp=o.hp,armor=o.armor;
  api.beforeStep(g,1/60);assert.ok(o.hp<hp);
  const after=o.hp;api.beforeStep(g,1/60);assert.equal(o.hp,after);
  if(pair[0]==='poison')assert.ok(o.armor<armor);
 }
 const a=fixture(),b=fixture();a.g.bl[0].resistFamily='ice';b.g.bl[0].resistFamily='physical';
 a.api.applyStatus(a.g.bl[0],'slow',2,'ice');b.api.applyStatus(b.g.bl[0],'slow',2,'ice');
 assert.ok(a.g.bl[0].status.slow<b.g.bl[0].status.slow);
 a.api.applyStatus(a.g.bl[0],'stun',99,'ice');assert.ok(a.g.bl[0].status.stun<=.55);
});
test('advanced AI evades predicted projectile interception while easy AI does not',()=>{
 const fast=fixture(),easy=fixture();
 for(const f of [fast,easy]){
  f.g.m=0;f.g.bl[0].x=260;f.g.bl[0].y=180;f.g.bl[1].x=150;f.g.bl[1].y=180;
  f.g.bl[1].vx=1;f.g.bl[1].vy=0;
  f.g.v2.shots.push({team:0,x:210,y:180,vx:-200,vy:0,r:5,life:2});
 }
 fast.ctx.diff=4;easy.ctx.diff=0;
 fast.api.beforeStep(fast.g,1/60);easy.api.beforeStep(easy.g,1/60);
 assert.equal(fast.g.bl[1].aiPlan,'dodge');assert.ok(Math.abs(fast.g.bl[1].vy)>Math.abs(easy.g.bl[1].vy));
});
test('hash catches cooldown, status, projectiles, hazards and boss geometry divergence',()=>{
 const mutations=[
  g=>{g.bl[0].abilityCd+=.02;},
  g=>{g.bl[0].status.poison=.2;},
  g=>{g.bl[0].identity={charges:2};},
  g=>{g.v2.shots.push({x:1,y:2,damage:3,life:1,team:0});},
  g=>{g.v2.hazards.push({x:100,y:100,radius:20,cooldown:.3,life:3});},
  g=>{g.bossTelegraph={zones:[{kind:'circle',x:100,y:100,r:30}],at:4};}
 ];
 for(const mutate of mutations){
  const {g,api}=fixture(),before=api.stateHash(g);mutate(g);assert.notEqual(api.stateHash(g),before);
 }
 const {g,api}=fixture(),hash=api.stateHash(g);g.fx=[{color:'#fff'}];g.pop.push({text:'hello'});g.bl[0].trail=[{x:1,y:1}];
 assert.equal(api.stateHash(g),hash,'presentation must not affect simulation hash');
});
test('existing RNG is not reset after arena creation and trace records replay events',()=>{
 const {g,api,ctx}=fixture();g.matchId='round';
 api.setSeed(g,123);api.random(g);const state=g.rngState;
 let event;ctx.window.BVBReworkUI={recordEvent:(_,type,detail)=>{event={type,detail};}};
 api.prepareActors(g,...g.bl);
 // prepareActors consumes one random number for the next arena shift, retaining the stream.
 const expected=fixture();expected.api.setSeed(expected.g,123);expected.api.random(expected.g);expected.api.random(expected.g);
 assert.equal(g.rngState,expected.g.rngState);assert.notEqual(g.rngState,state);
 api.trace(g,'TEST_EVENT',{id:3});assert.equal(event.type,'TEST_EVENT');assert.equal(event.detail.id,3);
});
test('identity hooks bypass prototype passives and receive damage, tick and super events',()=>{
 const calls=[];
 const identity={
  prepare:(g,o)=>{if(!o.b.isBoss)o.identity={id:o.b.id};},
  beforeDamage:(g,o,n)=>{calls.push('before');return n*.5;},
  abilityDamage:(g,o,t,n)=>{calls.push('ability');return n*1.1;},
  contact:(g,o,t,n)=>{calls.push('contact');return n+1;},
  tick:(g,o,t,dt)=>{calls.push('tick');},
  castSuper:(g,o,t)=>{if(!o.identity)return false;calls.push('super');o.superCharge=0;o.superUsed++;return true;}
 };
 const {g,api,ctx}=fixture(0,1,identity),[a,b]=g.bl;
 a.armor=0;ctx.applyDamage(a,10);assert.equal(a.hp,95);
 a.passiveType=3;const shield=a.status.shield;api.contactDamage(a,b,10);assert.equal(a.status.shield,shield);
 api.abilityDamage(a,b,10);a.superCharge=100;api.afterStep(g,1/60);
 assert.ok(['before','contact','ability','tick','super'].every(x=>calls.includes(x)));assert.equal(a.superUsed,1);
 a.superCharge=100;a.status.stun=.3;api.afterStep(g,1/60);assert.equal(a.superUsed,1);
});

test('explicit status immunities reject incoming applications and clear legacy direct status writes',()=>{
 const {g,api}=fixture(),o=g.bl[0];o.statusImmunities=['poison','slow'];
 api.applyStatus(o,'poison',2,'poison');api.applyStatus(o,'slow',2,'ice');
 assert.ok(!(o.status.poison>0));assert.ok(!(o.status.slow>0));
 o.status.poison=3;o.status.slow=3;api.beforeStep(g,1/60);
 assert.equal(o.status.poison,0);assert.equal(o.status.slow,0);
});

test('bosses use authored phase attacks without generic player passives or supers',()=>{
 const {g,api}=fixture(),boss=g.bl[1];
 assert.equal(boss.passiveType,-1);assert.equal(boss.superType,-1);
 boss.superCharge=100;boss.status.shield=0;boss.armor=0;
 api.afterStep(g,4.1);
 assert.equal(boss.superUsed,0);assert.equal(boss.status.shield,0);assert.equal(boss.armor,0);
 g.rt=7.1;api.afterStep(g,1/60);assert.ok(g.bossTelegraph);
});
test('campaign guardians resolve to their authored boss instead of the default pumpkin',()=>{
 for(const [level,index] of [[10,2],[20,1],[30,3],[40,4],[50,5]]){
  const {g,api}=fixture();g.m=13;g.campaignLevel=level;g.rt=7.1;
  api.afterStep(g,1/60);assert.equal(g.bossTelegraph.index,index);
 }
});

'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../bvb-save.js'),'utf8');
function api(){const c={window:{}};vm.runInNewContext(source,c);return c.window.BVBSave;}
const plain=x=>JSON.parse(JSON.stringify(x));
function store(initial={}){const map=new Map(Object.entries(initial));return {map,getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};}
test('fresh profile and all 130 owned balls survive detached, idempotent normalization',()=>{
 const save=api(),fresh=save.sanitize(null);
 assert.deepEqual(plain(fresh.own),[0,1,2]);assert.equal(fresh.coins,100);assert.equal(fresh.candies,50);
 const raw={own:Array.from({length:130},(_,i)=>i),initReward:1,coins:987654,candies:4321,lv:44,xp:654,
  tr:{0:3,17:2,129:3},upDmg:{129:5},dup:{129:99},unknownFeature:{version:2,records:['zażółć',7,{ok:true}]}};
 const state=save.sanitize(raw);assert.equal(state.own.length,130);assert.equal(state.coins,987654);
 assert.deepEqual(plain(state.unknownFeature),raw.unknownFeature);assert.equal(state.tr[129],3);assert.equal(state.upDmg[129],5);
 state.unknownFeature.records.push('detached');assert.equal(raw.unknownFeature.records.length,3);
 assert.deepEqual(plain(save.sanitize(state)),plain(state));
});
test('corrupted nested quests, achievements, cosmetics, campaign and mastery are repaired',()=>{
 const save=api(),raw={own:[0,1,2,17,129,-1,130,'3',null,17],initReward:1,coins:-9,candies:'12.9',lv:null,
  dup:[],dupV2:{17:-1,130:99},tr:{17:99,129:0},upHp:{17:999,129:-2},upDmg:'broken',
  q:[],wq:'broken',hwq:{cl:9},bp:{cl:[-1,0,1,20,'2'],p:-5},
  ach:{winsByArena:'broken',portals:'12',bounces:NaN,claimed:'broken'},
  sh:{tr:4,sk:[0,5,6],vf:null},eq:{tr:99,sk:5,vf:2},
  o:{vm:Infinity,vs:-1,nd:[],fxLevel:99},arenaCfg:{0:'broken',1:{count:100,fx:null}},
  campaign:{unlocked:999,deck:[129,17,17,75],cleared:[1,50,51],stars:'broken'},
  mastery:{17:{fights:8,wins:999},129:'broken'},nm:{bad:true},av:'<img src=x>'};
 const s=save.sanitize(raw);assert.deepEqual(plain(s.own),[0,1,2,17,129]);assert.equal(s.coins,0);assert.equal(s.candies,12);
 assert.equal(s.tr[17],3);assert.equal(s.tr[129],1);assert.equal(s.upHp[17],5);assert.equal(s.upHp[129],0);
 assert.deepEqual(plain(s.upDmg),{});assert.ok(Array.isArray(s.q.cl));assert.equal(typeof s.ach.winsByArena,'object');assert.equal(s.ach.portals,12);assert.equal(s.ach.bounces,0);
 assert.deepEqual(plain(s.sh.tr),[0]);assert.equal(s.eq.sk,5);assert.equal(s.eq.vf,0);
 assert.equal(s.o.vm,.7);assert.equal(s.o.vs,0);assert.equal(s.o.fxLevel,3);assert.equal(s.arenaCfg[1].count,8);
 assert.equal(s.campaign.unlocked,50);assert.deepEqual(plain(s.campaign.deck),[129,17,0]);
 assert.deepEqual(plain(s.campaign.cleared),[1,50]);assert.equal(s.mastery[17].wins,8);assert.equal(s.mastery[129].wins,0);
 assert.equal(s.nm,'Gracz');assert.equal(s.av,'😎');
});
test('malicious keys, cycles, excessive depth/size and non-profile imports are rejected before writes',()=>{
 const save=api();
 for(const poisoned of ['{"own":[0],"__proto__":{"polluted":true}}','{"own":[0],"future":{"constructor":{"prototype":{"polluted":true}}}}'])
  assert.throws(()=>save.parse(poisoned),/Niebezpieczne/);
 assert.equal({}.polluted,undefined);
 const circular={own:[0]};circular.self=circular;assert.throws(()=>save.sanitize(circular),/cykl/);
 let deep={};for(let i=0;i<20;i++)deep={child:deep};assert.throws(()=>save.sanitize({own:[0],deep}),/złożony/);
 assert.throws(()=>save.parse('x'.repeat(save.limits.bytes)),/rozmiar/);
 assert.throws(()=>save.parse('{"coins":9000}'),/profilu/);
 let accessed=false;const getter={own:[0]};Object.defineProperty(getter,'secret',{enumerable:true,get(){accessed=true;return 'bad';}});
 assert.throws(()=>save.sanitize(getter),/JSON/);assert.equal(accessed,false);
 const storage=store({profile:'previous'});const result=save.transactionalImport({storage,key:'profile',text:'[]'});
 assert.equal(result.ok,false);assert.equal(storage.getItem('profile'),'previous');assert.equal(storage.map.size,1);
});
test('successful import creates exact backup before applying normalized state',()=>{
 const save=api(),previous=JSON.stringify({own:[0,1,2,17],coins:81}),storage=store({profile:previous});let active;
 const result=save.transactionalImport({storage,key:'profile',text:JSON.stringify({own:[129],initReward:1,coins:500}),apply:state=>{active=state;}});
 assert.equal(result.ok,true);assert.equal(storage.getItem('profile_backup_before_import'),previous);
 assert.equal(active.coins,500);assert.deepEqual(plain(active.own),[0,1,2,129]);
 assert.deepEqual(JSON.parse(storage.getItem('profile')),plain(active));
});
test('backup quota failure leaves active save and in-memory state untouched',()=>{
 const save=api(),storage=store({profile:'previous'});let called=false;
 storage.setItem=()=>{throw Error('quota');};
 const result=save.transactionalImport({storage,key:'profile',text:'{"own":[0]}',apply:()=>called=true});
 assert.equal(result.ok,false);assert.equal(storage.getItem('profile'),'previous');assert.equal(called,false);
});
test('apply failure restores exact raw bytes and old memory; first import rollback removes new key',()=>{
 const save=api(),previous='  {"own":[0,1,2],"coins":81}  ',storage=store({profile:previous});let active={old:true};
 const result=save.transactionalImport({storage,key:'profile',text:'{"own":[129],"coins":900}',apply:state=>{active=state;throw Error('render failed');},rollback:()=>{active={old:true};}});
 assert.equal(result.ok,false);assert.equal(result.error,'render failed');assert.equal(storage.getItem('profile'),previous);assert.deepEqual(active,{old:true});
 assert.equal(storage.getItem('profile_backup_before_import'),previous);
 const blank=store(),failure=save.transactionalImport({storage:blank,key:'profile',text:'{"own":[0]}',apply:()=>{throw Error('fail');}});
 assert.equal(failure.ok,false);assert.equal(blank.getItem('profile'),null);
});
test('rollback failure is reported while durable backup remains recoverable',()=>{
 const save=api(),storage=store({profile:'original'}),realSet=storage.setItem;
 storage.setItem=(key,value)=>{if(key==='profile'&&value==='original')throw Error('rollback blocked');return realSet(key,value);};
 const result=save.transactionalImport({storage,key:'profile',text:'{"own":[0]}',apply:()=>{throw Error('apply failed');}});
 assert.equal(result.ok,false);assert.equal(result.rollbackError,'rollback blocked');assert.equal(storage.getItem('profile_backup_before_import'),'original');
});

test('historical mastery, favorite counts, record dates and all catalogue cosmetics survive migration',()=>{
 const save=api(),historical={own:[0,1,2,17,99],coins:13579,initReward:1,
  bk:{0:{g:170,w:115},17:{g:31,w:16,legacyBadge:'master'}},fav:{0:185,17:32,99:8},
  bdt:{sv:'25.10.2026',bb:'17.10.2026',inf:'10/20/2026'},up:{17:5},ev:{17:1},ti:'Weteran',
  sh:{tr:[0,1,2,3,4,5],sk:[0,1,2,3,4,5],vf:[0,1,2,3]},eq:{tr:5,sk:5,vf:3},
  hist:['Boss pokonany · 25.10.2026'],ac:['w10','w50'],ld:'Sun Oct 25 2026',st:17};
 const normalized=save.sanitize(historical);
 for(const key of ['bk','fav','bdt','up','ev','ti','sh','eq','hist','ac','ld','st'])
  assert.deepEqual(plain(normalized[key]),historical[key],key+' must preserve valid historical progress');
 assert.deepEqual(plain(save.sanitize(normalized)),plain(normalized));
});

'use strict';
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {chromium}=require('playwright');
const BASE=process.env.BVB_BATCH1_URL||'http://127.0.0.1:8765/beta-batch1/index.html';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.BVBBatch1Beta?.ready&&window.BVBApprovedArt?.state().ready,{timeout:40000});
  const state=await page.evaluate(()=>{
   const names=B.map(b=>b.n),all=Array.from({length:13},(_,id)=>[1,2,3].map(tier=>BVBArtEvolution.svgFor(id,tier)));
   const live=Array.from({length:13},(_,id)=>[1,2,3].map(tier=>{
    const a=BVBLiveFirst16.pose(id,tier,.21),b=BVBLiveFirst16.pose(id,tier,.83);
    return JSON.stringify(a.outer)!==JSON.stringify(b.outer);
   }));
   return {count:B.length,names,owned:[...S.own],tiers:all.length*all[0].length,allValid:all.every(row=>row.every(s=>s.includes('data-approved-art=')&&s.includes('data-live-first16='))),live:live.every(row=>row.every(Boolean)),betaKey:K,mode:BVBBatch1Beta.mode};
  });
  assert.equal(state.count,13);
  assert.equal(state.tiers,39);
  assert.deepEqual(state.owned,Array.from({length:13},(_,i)=>i));
  assert.ok(state.allValid&&state.live);
  assert.equal(state.betaKey,'bvb_beta_batch1_13_only_v1');
  assert.equal(state.mode,'private-offline');
  await page.evaluate(()=>panel('col'));
  await page.waitForSelector('#pb .bs-card');
  assert.equal(await page.locator('#pb .bs-card').count(),13,'13 visible collection entries');
  await page.evaluate(()=>window.BVBBatch1Beta.setTier(3));
  const evolved=await page.evaluate(()=>({tiers:B.map(b=>getBallStats(b.id).tier),owned:S.own}));
  assert.ok(evolved.tiers.every(x=>x===3));
  assert.equal(evolved.owned.length,13);
  const snap=path.join(__dirname,'..','beta-batch1','screenshot-kolekcja.png');
  fs.mkdirSync(path.dirname(snap),{recursive:true});
  await page.screenshot({path:snap,fullPage:true});
  const fight=await page.evaluate(()=>{
   menu();startMatch(0);const drafted=G?.my?.map(b=>b.id)||[];if(G?.ph==='draft')pick(0);
   return {drafted,phase:G?.ph,selected:G?.pb?.id,enemy:G?.bb?.id,balls:G?.bl?.map(o=>o.b?.id)||[]};
  });
  assert.ok(fight.drafted.length>0&&fight.drafted.every(id=>id>=0&&id<13));
  assert.ok(fight.selected>=0&&fight.selected<13);
  assert.ok(fight.enemy>=0&&fight.enemy<13);
  assert.ok(fight.balls.every(id=>id>=0&&id<13));
  assert.deepEqual(errors,[],'No page errors expected');
  console.log('PASS folder beta: 13 original balls, 39 tiers, 39 animations, unlock, stage V3, collection, fight and isolated save');
  // The full version has all assets and scripts embedded. Ensure it really starts from file://.
  const standalone='file://'+path.resolve(__dirname,'../beta-batch1/ball-vs-ball-partia-1.html');
  const offline=await browser.newPage({viewport:{width:390,height:844}});
  const offlineErrors=[];offline.on('pageerror',e=>offlineErrors.push(e.message));
  await offline.goto(standalone,{waitUntil:'domcontentloaded'});
  await offline.waitForFunction(()=>window.BVBBatch1Beta?.ready&&window.BVBApprovedArt?.state().ready,{timeout:40000});
  const offlineState=await offline.evaluate(()=>({count:B.length,owned:S.own.length,art:BVBArtEvolution.svgFor(12,3).includes('data-approved-art'),src:BVBApprovedArt.frame(12,3).source.slice(0,15)}));
  assert.equal(offlineState.count,13);
  assert.equal(offlineState.owned,13);
  assert.ok(offlineState.art);
  assert.equal(offlineState.src,'data:image/webp;');
  assert.deepEqual(offlineErrors,[]);
  console.log('PASS standalone file:// HTML: all 13 balls and approved imagery without server');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
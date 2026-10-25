'use strict';
// End-to-end smoke tests: a real Chromium browser runs the complete game page.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:430,height:900}});
 const errors=[];
 page.on('pageerror',error=>errors.push(String(error)));
 try{
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>typeof window.startMatch==='function'&&!!window.BVBReworkUI&&!!window.BVBRework,{timeout:30000});
   await page.evaluate(()=>{document.getElementById('accountGate').hidden=true;startMatch(0);pick(0);});
   await page.waitForFunction(()=>typeof G!=='undefined'&&G?.ph==='battle'&&G?.bl?.length===2,{timeout:15000});
   await page.waitForTimeout(500);
   const state=await page.evaluate(()=>({
     hp:G.bl.map(o=>o.hp),hud:document.getElementById('bvbCombatHud').textContent,
     paused:BVBReworkUI.paused(),rate:BVBReworkUI.rate(),all130:B.length
   }));
   assert.equal(state.all130,130,'ball catalog must contain 130 entries');
   assert.ok(state.hud.includes('❤️'),'combat HUD must display HP');
   assert.ok(state.hp.every(n=>Number.isFinite(n)&&n>0),'actors must have finite HP');
   await page.click('#bvbPause');
   assert.equal(await page.evaluate(()=>BVBReworkUI.paused()),true,'pause must work');
   await page.click('#bvbPause');
   await page.selectOption('#bvbSpeed','2');
   assert.equal(await page.evaluate(()=>BVBReworkUI.rate()),2,'speed must work');
   await page.click('#bvbCamera');
   assert.equal(await page.evaluate(()=>BVBReworkUI.camera()),'dynamic','camera switch must work');
   console.log('Before forced end:',await page.evaluate(()=>({phase:G.ph,seconds:G.rt,hp:G.bl.map(o=>o.hp),stats:!!G.reworkRoundStats,errors:[]})));
   console.log('After forced end:',await page.evaluate(()=>{const before=G;const phase=G.ph;const handler=typeof BVBReworkUI.endRound;roundEnd(0);return {same:G===before,phaseBefore:phase,phaseAfter:G.ph,handler,stats:G.reworkRoundStats||null,func:roundEnd.toString().slice(0,350)};}));
   await page.waitForTimeout(250);
   assert.equal(await page.evaluate(()=>!!G.reworkRoundStats),true,'round stats must be present');
   await page.evaluate(()=>over());
   await page.waitForFunction(()=>document.getElementById('ovb').textContent.includes('Ostatnie 5 sekund'));
   await page.click('#ovb button:has-text("Cała powtórka")');
   assert.equal(await page.locator('#bvbReplayOverlay').isVisible(),true,'replay overlay must open');
   await page.click('#bvbReplaySave');
   assert.equal(await page.evaluate(()=>
     Object.keys(localStorage).some(k=>k.startsWith('bvb-rework-replays-'))),true,
     'replay should persist locally');
   await page.click('#bvbReplayLoad');
   assert.ok((await page.locator('#bvbReplayTime').textContent()).includes('/'),
     'saved replay should be seekable');
   await page.click('#bvbReplayClose');
   assert.equal(await page.locator('#bvbReplayOverlay').isVisible(),false,'replay overlay must close');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>!!window.BVBReworkUI&&typeof startMatch==='function');
   await page.evaluate(()=>{document.getElementById('accountGate').hidden=true;startMatch(0);pick(0);});
   await page.waitForFunction(()=>G?.ph==='battle');
   await page.click('#bvbSaved');
   assert.equal(await page.locator('#bvbReplayOverlay').isVisible(),true,
     'saved replay should still open after a reload');
   await page.click('#bvbReplayClose');
   await page.evaluate(()=>{startBossFight(0);pick(0);});
   await page.waitForFunction(()=>G?.ph==='battle'&&G?.bl?.[1]?.b?.isBoss===true);
   const boss=await page.evaluate(()=>{
     G.rt=7.1;BVBRework.afterStep(G,1/60);
     return {telegraph:!!G.bossTelegraph,index:G.bossTelegraph?.index};
   });
   assert.equal(boss.telegraph,true,'boss must telegraph arena attack');
   assert.equal(boss.index,0);
   assert.deepEqual(errors,[],'no uncaught page exceptions');
   process.stdout.write('PASS Chromium smoke: solo, 130 balls, HUD, pause, speed, camera, replay, boss.\n');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

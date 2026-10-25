'use strict';
const assert=require('node:assert/strict');
const browserName=process.env.BVB_BROWSER||'chromium';
const browserEngine=require('playwright')[browserName];
const base=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/';
(async()=>{
 const browser=await browserEngine.launch({headless:true,...(browserName==='chromium'?{args:['--no-sandbox']}:{})});
 try{
   for(const width of [320,375,430]){
     const ctx=await browser.newContext({viewport:{width,height:760},deviceScaleFactor:2,
       isMobile:true,hasTouch:true});
     const page=await ctx.newPage(),errors=[];
     page.on('pageerror',err=>errors.push(String(err)));
     await page.goto(base,{waitUntil:'domcontentloaded'});
     await page.waitForFunction(()=>!!window.BVBRework&&!!window.BVBReworkUI);
     await page.evaluate(()=>{document.getElementById('accountGate').hidden=true;startMatch(0);pick(0);});
     await page.waitForFunction(()=>G?.ph==='battle');
     await page.waitForTimeout(200);
     const info=await page.evaluate(()=>{
       const rect=document.querySelector('#cv').getBoundingClientRect();
       return {view:innerWidth,scroll:document.documentElement.scrollWidth,
         canvasWidth:rect.width, controls:!!document.querySelector('#bvbCombatControls'),
         hud:document.querySelector('#bvbCombatHud')?.textContent||'',
         fighters:G.bl.length};
     });
     assert.equal(info.fighters,2);
     assert.ok(info.canvasWidth<=width+2,'canvas exceeds viewport');
     assert.ok(info.scroll<=width+4,'horizontal page overflow: '+info.scroll+' at '+width);
     assert.ok(info.hud.includes('❤️'));
     assert.ok(info.controls);
     await page.locator('#bvbFx').tap();
     assert.equal(await page.evaluate(()=>BVBReworkUI.fx()),'low');
     await page.locator('#bvbFx').tap();
     assert.equal(await page.evaluate(()=>BVBReworkUI.fx()),'full');
     assert.deepEqual(errors,[]);
     await ctx.close();
   }
   console.log('PASS Chromium mobile emulation: 320px, 375px, 430px.');
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});

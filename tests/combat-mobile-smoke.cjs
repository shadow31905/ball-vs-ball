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
     await page.evaluate(()=>{document.getElementById('accountGate').hidden=true;});
     if(new URL(base).pathname.split('/').includes('beta')){
       await page.waitForSelector('#bvbBetaPanelOpen');
       await page.locator('#bvbBetaPanelOpen').tap();
       assert.equal(await page.locator('#bvbBetaDialog').isVisible(),true);
       assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+4),
         'beta admin modal overflows at '+width+'px');
       await page.selectOption('#bvbBetaTier','3');
       await page.locator('#bvbBetaApplyTier').tap();
       assert.equal(await page.evaluate(()=>S.tr[0]),3);
       await page.locator('#bvbBetaClose').tap();
     }else{
       assert.equal(await page.locator('#bvbBetaPanelOpen').count(),0);
     }
     await page.evaluate(()=>{startMatch(0);pick(0);});
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
     // Training is deliberately removed; its former mode cannot interrupt play.
     const refused=await page.evaluate(()=>{const match=G.matchId;startMatch(4);return G.matchId===match;});
     assert.equal(refused,true,'discontinued training mode must not launch');
     assert.equal(await page.locator('#trainingSearch').count(),0);
     // Verify the actual V3 axe ability using a normal-match fixture.
     await page.evaluate(()=>{startMatch(0);G.my=[B[1]];G.bt=[B[0]];nextRound();pick(0);G.bl[0].tier=3;});
     await page.waitForFunction(()=>G?.ph==='battle'&&G.bl[0].b.id===1&&G.bl[0].tier===3);
     const blades=await page.evaluate(()=>{specialAbility(G.bl[0],G.bl[1]);return G.bl[0].axeOrbit.blades;});
     assert.equal(blades,5,'V3 Topor must actually create five blades');
     // Portrait -> landscape -> portrait should preserve combat state and
     // leave game/controls usable on a resized mobile viewport.
     const portrait=await page.evaluate(()=>({matchId:G.matchId,round:G.rn,mode:G.m}));
     await page.setViewportSize({width:700,height:390});
     await page.waitForTimeout(120);
     const landscape=await page.evaluate(()=>{
       const canvas=document.getElementById('cv').getBoundingClientRect();
       const actions=document.getElementById('bvbCombatControls').getBoundingClientRect();
       return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,
        canvasWidth:canvas.width,controlsWidth:actions.width,phase:G.ph,
        matchId:G.matchId,round:G.rn,mode:G.m};
     });
     assert.ok(landscape.canvasWidth<=landscape.viewport+2,'landscape canvas exceeds viewport');
     assert.ok(landscape.scroll<=landscape.viewport+4,'landscape horizontal overflow');
     assert.ok(landscape.controlsWidth<=landscape.viewport+4,'landscape controls overflow');
     assert.equal(landscape.matchId,portrait.matchId,'rotation must not restart the match');
     assert.equal(landscape.round,portrait.round);
     assert.equal(landscape.mode,portrait.mode);
     await page.setViewportSize({width,height:760});
     await page.waitForTimeout(120);
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+4),
       'portrait layout must recover after rotation');
     assert.deepEqual(errors,[]);
     await ctx.close();
   }
   console.log('PASS Chromium mobile emulation: 320px, 375px, 430px.');
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});

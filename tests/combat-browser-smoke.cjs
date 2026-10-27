'use strict';
// End-to-end smoke tests: a real Chromium browser runs the complete game page.
const assert=require('node:assert/strict');
const browserName=process.env.BVB_BROWSER||'chromium';
const browserEngine=require('playwright')[browserName];
const base=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/';
(async()=>{
 const browser=await browserEngine.launch({headless:true,...(browserName==='chromium'?{args:['--no-sandbox']}:{})});
 const page=await browser.newPage({viewport:{width:430,height:900}});
 const errors=[];
 page.on('pageerror',error=>errors.push(String(error)));
 try{
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>typeof window.startMatch==='function'&&!!window.BVBReworkUI&&!!window.BVBRework,{timeout:30000});
   await page.evaluate(()=>{if(document.getElementById('accountGate'))document.getElementById('accountGate').hidden=true;});
   await require('./approved-art-browser.cjs').checkApprovedArt(page);
   // Inspect the *actual canvas pixels* in each browser. Every one of the
   // five full-arena cinematic storyboards must be different and animate
   // between buildup, impact and aftermath, not simply show a recolored ring.
   const cinematicProof=await page.evaluate(()=>{
     const canvas=document.createElement('canvas');canvas.width=canvas.height=360;
     const ctx=canvas.getContext('2d');
     const hash=()=>{
       const image=ctx.getImageData(0,0,360,360).data;
       let n=2166136261;
       for(let i=0;i<image.length;i+=32){n^=image[i];n=Math.imul(n,16777619);n^=image[i+1];n=Math.imul(n,16777619);}
       return n>>>0;
     };
     const signatures=[];
     for(let variant=0;variant<5;variant++){
       const frames=[];
       for(const age of [.2,.75,1.4]){
         ctx.clearRect(0,0,360,360);
         window.BVBPresentation.renderCutscene(ctx,{
           variant,style:variant,x:230,y:225,fromX:100,fromY:115,
           color:'#ffca44',winnerName:'Testowy zwycięzca',winnerId:1,age,life:1.8
         });
         frames.push(hash());
       }
       signatures.push(frames);
     }
     ctx.clearRect(0,0,360,360);
     window.BVBPresentation.renderCutscene(ctx,{
       variant:4,x:230,y:225,fromX:100,fromY:115,
       color:'#ffca44',winnerName:'Test',winnerId:1,age:.25,life:1.8
     },true);
     const reducedA=hash();
     ctx.clearRect(0,0,360,360);
     window.BVBPresentation.renderCutscene(ctx,{
       variant:4,x:230,y:225,fromX:100,fromY:115,
       color:'#ffca44',winnerName:'Test',winnerId:1,age:1.45,life:1.8
     },true);
     return {signatures,reducedSame:reducedA===hash(),scenes:window.BVBPresentation.scenes.map(s=>s.title)};
   });
   assert.equal(cinematicProof.scenes.length,5);
   assert.equal(new Set(cinematicProof.signatures.map(s=>s.join(':'))).size,5,
     'all 5 cinematic films must have distinct pixel compositions');
   assert.ok(cinematicProof.signatures.every(s=>new Set(s).size===3),
     'each cinematic must have three genuinely different animation frames');
   assert.equal(cinematicProof.reducedSame,true,'reduced motion cutscene must remain static');
   // Reference-sheet 02 portraits must decode as real SVG images in browsers.
   await page.waitForFunction(()=>window.BVB2Sheet02?.ids?.length===6 &&
    window.BVB2Sheet02.ids.every(id=>[1,2,3].every(t=>
     window.BVB2Sheet02.imageForTier(id,t)?.naturalWidth>0)),null,{timeout:10000});
   const sheetArt=await page.evaluate(()=>window.BVB2Sheet02.ids.map(id=>({
    id,svgs:[1,2,3].map(t=>window.BVB2Sheet02.artForTier(id,t)),
    imageWidths:[1,2,3].map(t=>window.BVB2Sheet02.imageForTier(id,t).naturalWidth)
   })));
   assert.equal(sheetArt.length,6);
   for(const ball of sheetArt){
    assert.ok(ball.imageWidths.every(n=>n>0),'SVG must load in browser: '+ball.id);
    assert.equal(new Set(ball.svgs).size,3,'V1/V2/V3 portraits differ: '+ball.id);
    assert.ok(ball.svgs.every((svg,i)=>svg.includes('data-preview-tier="'+(i+1)+'"')));
   }
   // Check authored art actually decodes, including evolved early and late balls.
   const evolvedSamples=[...Array.from({length:16},(_,i)=>i),16,24,...Array.from({length:16},(_,i)=>i+32),...Array.from({length:16},(_,i)=>i+48),...Array.from({length:16},(_,i)=>i+64),98,129];
   await page.waitForFunction(ids=>ids.every(id=>[1,2,3].every(t=>
    window.BVBArtEvolution.imageForTier(id,t)?.naturalWidth>0)),evolvedSamples,{timeout:20000});
   const artDiagnostics=await page.evaluate(ids=>ids.map(id=>[1,2,3].map(t=>
    window.BVBArtEvolution.imageForTier(id,t).naturalWidth)),evolvedSamples);
   assert.ok(artDiagnostics.every(stages=>stages.every(width=>width>0)),
    'every selected evolution must decode as an image');
   const liveAbilityDescriptions=await page.evaluate(()=>Array.from({length:16},(_,i)=>{
    const id=i+48;
    return [2,3].map(t=>window.BVB2.evolutionDescription(id,t));
   }));
   assert.equal(new Set(liveAbilityDescriptions.map(x=>x[0])).size,16,
    '16 new evolution skills must have different descriptions');
   assert.ok(liveAbilityDescriptions.every(x=>x[0].startsWith('V2:')&&
     x[1].startsWith('V3:')&&x[0]!==x[1]));
   const sketch49=await page.evaluate(()=>Array.from({length:16},(_,i)=>{
     const id=48+i;
     return [1,2,3].map(t=>window.BVBArtEvolution.svgFor(id,t));
   }));
   assert.equal(new Set(sketch49.flat()).size,48,'48 separate SVG costumes must decode');
   assert.equal(new Set(sketch49.map(row=>row[0].match(/data-sketch49="([^"]+)"/)?.[1])).size,
     16,'16 visual identities from sketch 49-64 must stay separate');
   assert.ok(sketch49.every((row,i)=>row.every((s,t)=>
     s.includes('data-reference-panel="'+(49+i)+'"')&&
     s.includes('data-evolution="'+(t+1)+'"'))));
   // All 16 REAL ball names/identities 65–80 must be used for the new art.
   const thirdSet=await page.evaluate(()=>Array.from({length:16},(_,i)=>{
     const id=i+64;
     return {name:B[id].n,pictures:[1,2,3].map(t=>window.BVBArtEvolution.svgFor(id,t)),
      upgrades:[2,3].map(t=>window.BVB2.evolutionDescription(id,t))};
   }));
   const thirdKeys=thirdSet.map(v=>v.pictures[0].match(/data-visual-identity="([^"]+)"/)?.[1]);
   assert.equal(new Set(thirdKeys).size,16,'16 real characters keep distinct visual identities');
   assert.equal(new Set(thirdSet.flatMap(v=>v.pictures)).size,48,'48 unique evolution costumes');
   assert.ok(thirdSet.every((v,i)=>v.pictures.every((pic,t)=>
     pic.includes('data-ball-id="'+(i+64)+'"')&&pic.includes('data-evolution="'+(t+1)+'"'))));
   assert.equal(new Set(thirdSet.map(v=>v.upgrades[0])).size,16,'V2 authored skills');
   assert.equal(new Set(thirdSet.map(v=>v.upgrades[1])).size,16,'V3 authored skills');
   const elementTags=await page.evaluate(()=>Array.from({length:16},(_,id)=>
    [1,2,3].map(t=>window.BVBArtEvolution.svgFor(id,t)
      .match(/data-ball-id="([^"]+)"/)?.[1]||'')));
   assert.equal(new Set(elementTags.flat()).size,16,'16 separate approved ball identities in game');
   assert.ok(elementTags.every(row=>row[0]===row[1]&&row[1]===row[2]));
   // The full 33–48 concept-art set must decode as images in every browser.
   const newMotifs=await page.evaluate(()=>Array.from({length:16},(_,i)=>
    [1,2,3].map(t=>window.BVBArtEvolution.svgFor(i+32,t)
      .match(/data-concept="([^"]+)"/)?.[1]||'')));
   assert.equal(new Set(newMotifs.flat()).size,16);
   assert.ok(newMotifs.every(row=>row.every(m=>m===row[0]&&m.length>0)));
   if(new URL(base).pathname.split('/').includes('beta')){
     await page.waitForSelector('#bvbBetaPanelOpen');
     await page.click('#bvbBetaPanelOpen');
     assert.equal(await page.locator('#bvbBetaDialog').isVisible(),true,'beta panel must be accessible');
     await page.fill('#bvbBetaCoins','123456789');
     await page.fill('#bvbBetaCandies','654321');
     await page.click('#bvbBetaSaveCurrencies');
     await page.click('#bvbBetaUnlockAll');
     await page.selectOption('#bvbBetaTarget','all');
     await page.selectOption('#bvbBetaTier','3');
     await page.click('#bvbBetaApplyTier');
     const adminState=await page.evaluate(()=>({
       coins:S.coins,candies:S.candies,unlocked:S.own.length,
       allV3:B.every(b=>S.tr[b.id]===3),
       saved:JSON.parse(localStorage.getItem('bvb_beta_rework_v4')),
       stableKey:localStorage.getItem('bvb_hw_120_v3')
     }));
     assert.equal(adminState.coins,123456789);
     assert.equal(adminState.candies,654321);
     assert.equal(adminState.unlocked,130);
     assert.equal(adminState.allV3,true,'panel must enable actual evolution tier for every ball');
     assert.equal(adminState.saved.tr[0],3);
     assert.equal(adminState.saved.coins,123456789);
     assert.equal(adminState.stableKey,null,'beta panel must not write stable storage');
     await page.selectOption('#bvbBetaTarget','1');
     await page.selectOption('#bvbBetaTier','2');
     await page.click('#bvbBetaApplyTier');
     assert.deepEqual(await page.evaluate(()=>[S.tr[0],S.tr[1],getBallStats(1).tier]),[3,2,2]);
     await page.fill('#bvbBetaCoins','-10');
     await page.click('#bvbBetaSaveCurrencies');
     assert.equal(await page.evaluate(()=>S.coins),123456789,'negative money must be rejected');
     await page.click('#bvbBetaClose');
     assert.equal(await page.locator('#bvbBetaDialog').isVisible(),false);
     // Reduced-motion previews must still show distinct, STATIC V1/V2/V3
     // mechanics for the same ball, while the collection explains next-stage effects.
     await page.emulateMedia({reducedMotion:'reduce'});
     const previews=[];
     for(const tier of [1,2,3]){
       await page.evaluate(t=>{S.tr[16]=t;openBallDetail(16);},tier);
       await page.waitForSelector('#bvb-skill-preview-canvas');
       await page.waitForTimeout(120);
       previews.push({
         image:(await page.locator('#bvb-skill-preview-canvas').screenshot({animations:'disabled'})).toString('base64'),
         detail:await page.locator('#ovb').textContent()
       });
     }
     assert.equal(new Set(previews.map(p=>p.image)).size,3,
       'the same ball must visibly change between V1, V2 and V3 in reduced-motion previews');
     assert.ok(previews[0].detail.includes('pomocnik-kuźnia'),
       'V1 collection panel must describe the actual V2 ability upgrade');
     assert.ok(previews[1].detail.includes('kowadło piorunowe'),
       'V2 collection panel must describe the actual V3 ability upgrade');
     // Twenty-four identity-specific upgrades (24–47) must also be
     // visually distinct in V1, V2 and V3 with reduced motion enabled.
     for(let id=24;id<=47;id++){
       const variants=[];
       for(const tier of [1,2,3]){
         await page.evaluate(([ball,t])=>{S.tr[ball]=t;openBallDetail(ball);},[id,tier]);
         await page.waitForTimeout(80);
         variants.push((await page.locator('#bvb-skill-preview-canvas')
           .screenshot({animations:'disabled'})).toString('base64'));
       }
       assert.equal(new Set(variants).size,3,
         'three evolution previews must be visually different for ball '+id);
       await page.evaluate(ball=>{S.tr[ball]=1;},id);
     }
     await page.evaluate(()=>{S.tr[16]=3;save();menu();});
     await page.emulateMedia({reducedMotion:'no-preference'});
   }else{
     assert.equal(await page.locator('#bvbBetaPanelOpen').count(),0,'stable page must not include admin panel');
     assert.equal(await page.evaluate(()=>typeof window.BVBBetaAdmin),'undefined');
   }
   await page.evaluate(()=>{startMatch(0);pick(0);});
   await page.waitForFunction(()=>typeof G!=='undefined'&&G?.ph==='battle'&&G?.bl?.length===2,{timeout:15000});
   await page.waitForFunction(()=>document.getElementById('bvbCombatHud')?.textContent.includes('❤️'),null,{timeout:15000});
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
   const priorCamera=await page.evaluate(()=>BVBReworkUI.camera());
   await page.evaluate(()=>{
     window.__cameraClickCount=0;
     document.getElementById('bvbCamera').addEventListener('click',()=>window.__cameraClickCount++);
   });
   await page.click('#bvbCamera');
   // Wait for both the real click event and the changed setting in WebKit.
   await page.waitForFunction(previous=>
     window.__cameraClickCount===1&&
     BVBReworkUI.camera()===(previous==='static'?'dynamic':'static'),
   priorCamera,{timeout:5000});
   const cameraDiagnostic=await page.evaluate(()=>({
     reported:BVBReworkUI.camera(),
     label:document.getElementById('bvbCamera').textContent,
     clicks:window.__cameraClickCount,
     overlayHidden:document.getElementById('bvbReplayOverlay')?.hidden,
     live:G?.ph,mode:G?.m,
     stored:JSON.parse(localStorage.getItem('bvb-rework-view-v1')||'{}').camera
   }));
   console.log('Camera browser click:',browserName,priorCamera,cameraDiagnostic);
   assert.equal(cameraDiagnostic.clicks,1,
     'camera button must receive exactly one real pointer click');
   assert.equal(cameraDiagnostic.reported,priorCamera==='static'?'dynamic':'static',
     'camera switch must toggle the actual previous setting');
   console.log('Before forced end:',await page.evaluate(()=>({phase:G.ph,seconds:G.rt,hp:G.bl.map(o=>o.hp),stats:!!G.reworkRoundStats,errors:[]})));
   console.log('After forced end:',await page.evaluate(()=>{const before=G;const phase=G.ph;const handler=typeof BVBReworkUI.endRound;G.bl.find(o=>o.team===1).hp=0;roundEnd(0);return {same:G===before,phaseBefore:phase,phaseAfter:G.ph,handler,stats:G.reworkRoundStats||null,finisher:G.finisher?.variant,func:roundEnd.toString().slice(0,350)};}));
   await page.waitForTimeout(250);
   assert.equal(await page.evaluate(()=>!!G.reworkRoundStats),true,'round stats must be present');
   await page.evaluate(()=>over());
   await page.waitForFunction(()=>document.getElementById('ovb').textContent.includes('Ostatnie 5 sekund'));
   await page.click('#ovb button:has-text("Cała powtórka")');
   assert.equal(await page.locator('#bvbReplayOverlay').isVisible(),true,'replay overlay must open');
   assert.ok(await page.evaluate(()=>{const c=document.getElementById('bvbReplayCanvas');return c.getContext('2d').getImageData(c.width-10,c.height-10,1,1).data[3]>0;}),'native replay renderer must cover its full canvas at any display density');
   await page.click('#bvbReplaySave');
   await page.waitForFunction(()=>document.getElementById('bvbReplaySave').textContent.includes('Zapisano'));
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
   // Decompression runs asynchronously, especially in WebKit. A click event
   // resolves before the imported recording is validated and rendered.
   await page.waitForFunction(()=>{
     const dialog=document.getElementById('bvbReplayOverlay');
     const btn=document.getElementById('bvbSaved');
     return dialog?.hidden===false || btn?.title?.startsWith('Nie można wczytać');
   },null,{timeout:12000});
   assert.equal(await page.locator('#bvbReplayOverlay').isVisible(),true,
     'saved replay should still open after a reload: '+
     await page.locator('#bvbSaved').getAttribute('title'));
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

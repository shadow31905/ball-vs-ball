'use strict';
const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const errors=[];p.on('pageerror',e=>errors.push(String(e.message||e)));
  const file=path.resolve(process.env.BVB_ONLY_OUTPUT||'only-33-48','BALL_VS_BALL_TEST_TYLKO_33-48.html');
  await p.goto(pathToFileURL(file).href,{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>!!window.BVBArtEvolution&&!!window.BVBSketch33to48&&!!window.BVBBetaAdmin&&typeof B!=='undefined',{timeout:12000});
  const r=await p.evaluate(()=>{
   const ids=Array.from({length:16},(_,n)=>n+32);
   const original=S.o.ballVisualStyle;
   const normal={};
   const outside=[];
   const art=BVBArtEvolution;
   for(const id of [0,8,15,16,24,31,48,64,79,129]){
    S.o.ballVisualStyle='detailed';const detailed=art.svgFor(id,3);
    S.o.ballVisualStyle='classic';const classic=art.svgFor(id,3);
    outside.push({id,unchanged:detailed===classic,third:!!detailed.includes('sk33-'),renderable:detailed.startsWith('<svg')});
   }
   for(const id of ids){
    const stages={};
    for(const style of ['detailed','classic']){
     S.o.ballVisualStyle=style;
     stages[style]=[1,2,3].map(t=>art.svgFor(id,t));
    }
    normal[id]={origName:B[id].n,sketchName:BVBSketch33to48.concepts[id-32].name,
      stagesValid:stages.detailed.every((s,j)=>s.includes('data-ball-id="'+id+'"')&&s.includes('data-evolution="'+(j+1)+'"')),
      v2:stages.detailed[1].includes('data-evo-upgrade="V2"'),
      v3:stages.detailed[2].includes('data-evo-upgrade="V3"'),
      styled:stages.detailed.every((s,j)=>s!==stages.classic[j])};
   }
   S.o.ballVisualStyle=original;
   return {title:document.title,marker:!!document.querySelector('meta[name="bvb-only-33-48"]'),
    profileKey:K,allIDs:S.own,numberOfGameBalls:B.length,
    panelOptions:[...document.querySelectorAll('#bvbBetaTarget option')].map(n=>n.value),
    gallery:normal,outside};
  });
  assert.equal(r.marker,true);
  assert.equal(r.profileKey,'bvb_only_rework_33_48_v1');
  assert.equal(r.numberOfGameBalls,130,'Game engine must preserve all original IDs');
  assert.deepEqual(r.allIDs,Array.from({length:16},(_,n)=>n+32),'ONLY 33–48 should be unlocked by default');
  assert.deepEqual(r.panelOptions,['all',...Array.from({length:16},(_,n)=>String(n+32))]);
  assert.ok(r.outside.every(x=>x.unchanged&&!x.third&&x.renderable),'Another batch was visually reworked: '+JSON.stringify(r.outside));
  assert.ok(Object.values(r.gallery).every(x=>x.origName===x.sketchName&&x.stagesValid&&x.v2&&x.v3&&x.styled),
   'Missing 33–48 custom evolutions '+JSON.stringify(Object.entries(r.gallery).filter(([,x])=>!x.stagesValid||!x.v2||!x.v3||!x.styled)));
  await p.locator('#bvbBetaPanelOpen').click();
  await p.locator('#bvbBetaTarget').selectOption('32');
  await p.locator('#bvbBetaTier').selectOption('3');
  await p.locator('#bvbBetaApplyTier').click();
  const after=await p.evaluate(()=>({tier:S.tr?.[32],others:B.filter(x=>x.id<32||x.id>47).some(b=>S.own.includes(b.id)),money:S.coins}));
  assert.equal(after.tier,3,'Could not select V3 of Eliksir');
  assert.equal(after.others,false);
  assert.deepEqual(errors,[],'No browser exceptions: '+errors.join('|'));
  console.log('PASS isolated HTML game: ONLY 33–48 unlocked, 48 V1/V2/V3 evolutions, 2 styles, other 114 visually unchanged, independent profile, V3 selectable, browser file:// playable.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

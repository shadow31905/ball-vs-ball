'use strict';
const assert=require('node:assert/strict');
const browserName=process.env.BVB_BROWSER||'chromium';
const browserEngine=require('playwright')[browserName];
const url=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/beta/';
(async()=>{
 const browser=await browserEngine.launch({headless:true,...(browserName==='chromium'?{args:['--no-sandbox']}:{})});
 try{
  const page=await browser.newPage({viewport:{width:430,height:900},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BVBArtEvolution&&!!window.BVBMotion&&typeof S==='object');
  assert.equal(await page.evaluate(()=>!!document.querySelector('meta[name="bvb-beta-build"]')),true,'must use isolated beta only');
  await page.evaluate(()=>{document.getElementById('accountGate')?.setAttribute('hidden','');});
  const proof=await page.evaluate(async()=>{
   const getStats=()=>JSON.stringify({coins:S.coins,candies:S.candies,own:S.own,upHp:S.upHp,upDmg:S.upDmg,tiers:S.ev,abilityKinds:BVB2.abilities.map(s=>s?.kind)});
   const before=getStats();
   BVBMotion.change('ballStyle','classic');
   const classicSelect=document.querySelector('#bvbBallVisualStyle')?.value;
   const variants=[];
   for(let id=16;id<32;id++)for(let tier=1;tier<=3;tier++){
    const svg=BVBArtEvolution.svgFor(id,tier);
    variants.push({id,tier,classic:svg.includes('data-visual-style="classic"'),hasEyes:svg.includes('bvb-classic-face'),hasGear:svg.includes('bvb-classic-equipment')});
   }
   const imageChecks=[];
   for(const id of [0,16,31,129]){
    const a=BVBArtEvolution.imageForTier(id,3);
    await a.decode();imageChecks.push({id,stage3:a.naturalWidth>0});
   }
   const afterClassic=getStats();
   BVBMotion.change('ballStyle','detailed');
   const detailSelect=document.querySelector('#bvbBallVisualStyle')?.value;
   const changed=[0,16,31,129].map(id=>({id,different:!BVBArtEvolution.svgFor(id,3).includes('data-visual-style="classic"')}));
   const afterDetail=getStats();
   BVBMotion.change('ballStyle','classic');
   return {variants,imageChecks,changed,classicSelect,detailSelect,statsStable:before===afterClassic&&before===afterDetail,stored:S.o.ballVisualStyle};
  });
  assert.equal(proof.variants.length,48);
  assert.ok(proof.variants.every(v=>v.classic&&v.hasEyes&&v.hasGear),JSON.stringify(proof.variants.filter(v=>!v.classic||!v.hasEyes||!v.hasGear)));
  assert.ok(proof.imageChecks.every(x=>x.stage3),'All checked styles must decode as images');
  assert.equal(proof.classicSelect,'classic');
  assert.equal(proof.detailSelect,'detailed');
  assert.ok(proof.changed.every(x=>x.different));
  assert.equal(proof.statsStable,true,'Style must not modify HP, DMG, ownership or abilities');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BVBArtEvolution&&!!window.BVBMotion);
  const persisted=await page.evaluate(()=>({style:BVBArtEvolution.currentStyle(),value:S.o.ballVisualStyle,portrait:BVBArtEvolution.svgFor(16,2).includes('data-visual-style="classic"')}));
  assert.deepEqual(persisted,{style:'classic',value:'classic',portrait:true});
  assert.deepEqual(errors,[]);
  console.log('PASS beta switch:',browserName,'48 classic portraits 17–32, detailed roundtrip, preserved game stats, persistent preference.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

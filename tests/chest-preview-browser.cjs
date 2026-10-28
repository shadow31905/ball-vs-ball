'use strict';
const assert=require('node:assert/strict');
const browserName=process.env.BVB_BROWSER||'chromium';
const engine=require('playwright')[browserName];
const url=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/beta/';
(async()=>{
 const browser=await engine.launch({headless:true,...(browserName==='chromium'?{args:['--no-sandbox']}:{})});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message||String(e)));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BVB2Preview?.mount && !!window.BVBMenu && Array.isArray(B));
  const up=await page.evaluate(()=>{
   document.querySelector('#accountGate').hidden=true;
   S.own=Array.from(new Set([...S.own,43]));
   S.coins=300;S.candies=50;
   menu();BVBMenu.prepare('bot');BVBMenu.chooseDifficulty(0);BVBMenu.chooseBall(43);
   const canvas=document.querySelector('#bvb3-skill-preview-canvas');
   return {canvas:!!canvas,id:canvas?.id,ability:document.querySelector('.bvb3-preview .bvb3-power')?.textContent||''};
  });
  assert.ok(up.canvas && up.ability.includes('Trzy Gwiazdy'),'Pre-fight ability must render a named Shuriken skill');
  const pre=await page.locator('#bvb3-skill-preview-canvas');
  await page.waitForTimeout(440);
  const read=(selector)=>page.locator(selector).evaluate(el=>{
    const d=el.getContext('2d').getImageData(0,0,el.width,el.height).data;
    let hash=2166136261,cyan=0;
    for(let i=0;i<d.length;i+=4){
     hash^=d[i];hash=Math.imul(hash,16777619);hash^=d[i+2];hash=Math.imul(hash,16777619);
     if(d[i+2]>180&&d[i+1]>135&&d[i]<180)cyan++;
    }
    return {hash:hash>>>0,cyan};
  });
  const before=await read('#bvb3-skill-preview-canvas');
  await page.waitForTimeout(510);
  const after=await read('#bvb3-skill-preview-canvas');
  assert.notEqual(before.hash,after.hash,'Shuriken pre-fight animation must visibly change actual pixels');
  assert.ok(Math.max(before.cyan,after.cyan)>20,'Shuriken must emit clearly visible blue projectile pixels');
  await page.locator('.bvb3-preview .bvb3-replay').click();
  await page.waitForTimeout(120);
  // Inventory screen and reward screen must run separately from pre-fight canvas.
  const inv=await page.evaluate(()=>{openBallDetail(43);return {
   canvas:!!document.querySelector('#ovb #bvb-skill-preview-canvas'),
   replay:!!document.querySelector('#ovb #bvbReplaySkill'),
   before:!!document.querySelector('#bvb3-skill-preview-canvas')
  }});
  assert.ok(inv.canvas&&inv.replay,'Inventory needs an independent playable preview');
  await page.locator('#bvbReplaySkill').click();
  const chest=await page.evaluate(()=>{
   document.querySelector('#ov').hidden=true;
   pull(false);skipPull();skipPull();
   const a=document.querySelector('#bvbChestSkill');
   return {coins:S.coins,panel:!!a,canvas:!!a?.querySelector('canvas'),
     replay:!!a?.querySelector('button'),again:!!document.querySelector('#bvbOpenAgain'),
     enabled:!document.querySelector('#bvbOpenAgain')?.disabled};
  });
  assert.deepEqual([chest.coins,chest.panel,chest.canvas,chest.replay,chest.again,chest.enabled],[200,true,true,true,true,true],
   'Chest result must offer playback + safe affordable Open Again without double charges');
  await page.locator('#bvbOpenAgain').click();
  await page.evaluate(()=>skipPull());
  assert.equal(await page.evaluate(()=>S.coins),100,'Open Again must charge once and award a second ball');
  await page.locator('#bvbOpenAgain').click();
  await page.evaluate(()=>skipPull());
  assert.equal(await page.evaluate(()=>S.coins),0);
  assert.equal(await page.locator('#bvbOpenAgain').isDisabled(),true,'No funds means Open Again must disable');
  await page.evaluate(()=>{document.querySelector('#ov').hidden=true;pull(true);skipPull()});
  assert.ok(await page.locator('#bvbChestSkill canvas').count(),'Halloween chest must show the won ability too');
  assert.equal(await page.locator('#bvbOpenAgain').isDisabled(),true,'Halloween Open Again must respect candy cost');
  await page.evaluate(()=>{document.querySelector('#ov').hidden=true});
  assert.deepEqual(errors,[], 'No uncaught browser errors');
  console.log('PASS chest and skill playback '+browserName+': Shuriken projectile pixels, pre-fight, inventory, chest reward, replay, repeated purchases and currency checks.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

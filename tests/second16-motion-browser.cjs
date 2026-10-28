'use strict';
const assert=require('node:assert/strict'),name=process.env.BVB_BROWSER||'chromium';
const engine=require('playwright')[name],url=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/beta/';
(async()=>{
 const browser=await engine.launch({headless:true,...(name==='chromium'?{args:['--no-sandbox']}:{})});
 try{
  const page=await browser.newPage({viewport:{width:430,height:900},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',err=>errors.push(err.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BVBSketch17to32&&!!window.BVBArtEvolution&&!!window.BVBMotion);
  assert.equal(await page.evaluate(()=>!!document.querySelector('meta[name="bvb-beta-build"]')),true);
  const proof=await page.evaluate(async()=>{
   const state=()=>JSON.stringify({own:S.own,coins:S.coins,upHp:S.upHp,upDmg:S.upDmg,settings:S.o,abilities:BVB2.abilities.map(a=>a?.kind)});
   const before=state(),variants=[];
   const host=document.createElement('div');
   host.style.cssText='position:absolute;left:-15000px;top:0;width:128px;pointer-events:none;';
   for(let id=16;id<32;id++)for(let tier=1;tier<=3;tier++)for(const style of ['detailed','classic']){
    const node=document.createElement('div');node.innerHTML=BVBSketch17to32.svgFor(id,tier,style);
    const svg=node.firstElementChild;
    host.appendChild(svg);
    variants.push({id,tier,style,svg,action:svg.querySelector('.sketch-symbol'),fx:svg.querySelector('.sketch-ability-fx')});
   }
   document.body.appendChild(host);
   const read=()=>variants.map(v=>({
    key:v.svg.getAttribute('data-animation-key'),
    name:getComputedStyle(v.action).animationName,
    transform:getComputedStyle(v.action).transform,
    fxName:getComputedStyle(v.fx).animationName,
    fxTransform:getComputedStyle(v.fx).transform,
    motif:v.svg.getAttribute('data-ability-motion')
   }));
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const initial=read();
   await new Promise(resolve=>setTimeout(resolve,490));
   const later=read();
   const animated=initial.map((v,i)=>({
    key:v.key,motif:v.motif,
    named:v.name.startsWith('bvbSkill')&&v.fxName.startsWith('bvbFx'),
    moved:v.transform!==later[i].transform,
    particleMoved:v.fxTransform!==later[i].fxTransform
   }));
   host.remove();
   const cv=document.createElement('canvas');cv.width=cv.height=128;
   const ctx=cv.getContext('2d',{willReadFrequently:true});
   const hash=()=>{let a=ctx.getImageData(0,0,128,128).data,h=2166136261;for(let i=0;i<a.length;i+=8){h^=a[i];h=Math.imul(h,16777619);h^=a[i+3];h=Math.imul(h,16777619);}return h>>>0};
   const arena=[];
   S.o.ballVisualStyle='detailed';
   for(let id=16;id<32;id++)for(let tier=1;tier<=3;tier++){
    const img=BVBArtEvolution.imageForTier(id,tier);await img.decode();
    const sample=[];
    for(const t of [.13,.95]){
     ctx.clearRect(0,0,128,128);
     const drawn=BVBSketch17to32.drawCombatSprite(ctx,id,tier,64,64,24,t,img);
     if(!drawn)throw Error('Sprite not drawn id='+id+' tier='+tier);
     sample.push(hash());
    }
    arena.push({id,tier,changed:sample[0]!==sample[1]});
   }
   return {animations:animated,arena,statUnchanged:before===state()};
  });
  assert.equal(proof.animations.length,96);
  assert.equal(new Set(proof.animations.map(x=>x.key)).size,96,'Each style/tier needs separate animation rules');
  assert.equal(new Set(proof.animations.map(x=>x.motif)).size,16,'Each ball needs unique motion identity');
  assert.ok(proof.animations.every(x=>x.named),'All active CSS animations must have their individual names');
  assert.ok(proof.animations.every(x=>x.moved),'Static equipment animation: '+JSON.stringify(proof.animations.filter(x=>!x.moved).slice(0,10)));
  assert.ok(proof.animations.every(x=>x.particleMoved),'Static ability particles: '+JSON.stringify(proof.animations.filter(x=>!x.particleMoved).slice(0,10)));
  assert.equal(proof.arena.length,48);
  assert.ok(proof.arena.every(x=>x.changed),'Static live canvas sprite: '+JSON.stringify(proof.arena.filter(x=>!x.changed)));
  assert.equal(proof.statUnchanged,true,'Cosmetic frames cannot alter gameplay state');
  assert.deepEqual(errors,[]);
  console.log('PASS second16 motion',name,'96/96 live individual SVG rigs + particles; 48/48 dynamic arena sprites; stable gameplay state.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

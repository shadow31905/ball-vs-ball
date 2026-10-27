'use strict';
const assert=require('node:assert/strict');
const engineName=process.env.BVB_BROWSER||'chromium', engine=require('playwright')[engineName];
const url=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/beta/';
(async()=>{
 const browser=await engine.launch({headless:true,...(engineName==='chromium'?{args:['--no-sandbox']}:{})});
 try{
  const page=await browser.newPage({viewport:{width:430,height:900},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(String(e.message||e)));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BVBSketch33to48&&!!window.BVBArtEvolution&&!!window.BVBMotion&&typeof B!=='undefined');
  assert.equal(await page.evaluate(()=>!!document.querySelector('meta[name="bvb-beta-build"]')),true,'Do not use stable game as beta');
  const result=await page.evaluate(async()=>{
   const original=JSON.stringify({coins:S.coins,own:S.own,upHp:S.upHp,upDmg:S.upDmg,
    ballVisualStyle:S.o.ballVisualStyle,abilities:BVB2.abilities.map(a=>a?.kind)});
   const art=BVBSketch33to48;
   const host=document.createElement('div');
   host.style.cssText='position:absolute;left:-20000px;top:0;width:128px;pointer-events:none;';
   const variants=[];
   for(let id=32;id<48;id++)for(let tier=1;tier<=3;tier++)for(const style of ['detailed','classic']){
    const el=document.createElement('div');el.innerHTML=art.svgFor(id,tier,style);
    const svg=el.firstElementChild;host.appendChild(svg);
    variants.push({id,tier,style,svg,motion:svg.querySelector('.sk33-identity'),particles:svg.querySelector('.sk33-ability-fx')});
   }
   document.body.appendChild(host);
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   function framesAt(milliseconds){
    for(const a of host.getAnimations({subtree:true})){a.pause();a.currentTime=milliseconds;}
    return variants.map(v=>({
     motion:getComputedStyle(v.motion).transform,particles:getComputedStyle(v.particles).transform,
     motionName:getComputedStyle(v.motion).animationName,
     particleName:getComputedStyle(v.particles).animationName,
     key:v.svg.getAttribute('data-animation-key'),
     effect:v.particles.getAttribute('data-skill-effect'),
     validName:v.svg.getAttribute('aria-label')===B[v.id].n+' V'+v.tier
    }));
   }
   const first=framesAt(200),second=framesAt(820);
   const svgMoving=first.map((v,i)=>({
    id:variants[i].id,tier:variants[i].tier,style:variants[i].style,key:v.key,effect:v.effect,
    rightName:v.validName,motionNamed:v.motionName.startsWith('sk33Skill'),
    particleNamed:v.particleName.startsWith('sk33Fx'),
    moving:v.motion!==second[i].motion,particleMoving:v.particles!==second[i].particles
   }));
   host.remove();
   const pixelCanvas=document.createElement('canvas');pixelCanvas.width=pixelCanvas.height=128;
   const ctx=pixelCanvas.getContext('2d',{willReadFrequently:true});
   const hash=()=>{const data=ctx.getImageData(0,0,128,128).data;let v=2166136261;
    for(let k=0;k<data.length;k+=4){v^=data[k];v=Math.imul(v,16777619);v^=data[k+1];v=Math.imul(v,16777619);v^=data[k+3];v=Math.imul(v,16777619);}
    return v>>>0;};
   const rows=[],battle=[];
   for(let id=32;id<48;id++){
    const styles=[];
    for(const style of ['detailed','classic']){
     const stage=[];
     for(let tier=1;tier<=3;tier++){
      const svg=art.svgFor(id,tier,style);
      const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();
      ctx.clearRect(0,0,128,128);ctx.drawImage(img,0,0,128,128);
      stage.push(hash());
      if(style==='detailed'){
       const moveHashes=[];
       for(const time of [.31,1.67]){
        ctx.clearRect(0,0,128,128);
        const drawn=art.drawCombatSprite(ctx,id,tier,64,64,29,time,img);
        if(!drawn)throw Error('Missing live sprite for '+(id+1)+' V'+tier);
        moveHashes.push(hash());
       }
       battle.push({id,tier,moves:moveHashes[0]!==moveHashes[1]});
      }
     }
     styles.push(stage);
    }
    rows.push({id,name:B[id].n,concept:art.concepts[id-32].name,
     uniqueEvolution:styles.every(x=>new Set(x).size===3),
     differentStyles:styles[0].every((x,j)=>x!==styles[1][j])});
   }
   const oldOption=S.o.ballVisualStyle;
   const stylePreserved=[];
   try{
    for(let id=32;id<48;id++)for(let tier=1;tier<=3;tier++){
     S.o.ballVisualStyle='detailed';const d=BVBArtEvolution.svgFor(id,tier);
     S.o.ballVisualStyle='classic';const c=BVBArtEvolution.svgFor(id,tier);
     stylePreserved.push({id,tier,unchanged:d===c,notApproved:!BVBArtEvolution.isCompletedRework(id)});
    }
   }finally{S.o.ballVisualStyle=oldOption;}
   const untouched=original===JSON.stringify({coins:S.coins,own:S.own,upHp:S.upHp,upDmg:S.upDmg,
    ballVisualStyle:S.o.ballVisualStyle,abilities:BVB2.abilities.map(a=>a?.kind)});
   await document.fonts.ready;
   return {variants:svgMoving,rows,battle,stylePreserved,untouched};
  });
  assert.equal(result.variants.length,96);
  assert.equal(new Set(result.variants.map(x=>x.key)).size,96);
  assert.equal(new Set(result.variants.map(x=>x.effect)).size,16);
  assert.ok(result.variants.every(x=>x.rightName&&x.motionNamed&&x.particleNamed),
    'Invalid names or missing animated layer: '+JSON.stringify(result.variants.filter(x=>!x.rightName||!x.motionNamed||!x.particleNamed).slice(0,5)));
  assert.ok(result.variants.every(x=>x.moving&&x.particleMoving),
    'Static SVG animation: '+JSON.stringify(result.variants.filter(x=>!x.moving||!x.particleMoving).slice(0,5)));
  assert.equal(result.rows.length,16);
  assert.ok(result.rows.every(x=>x.name===x.concept&&x.uniqueEvolution&&x.differentStyles),
    'Art mismatch: '+JSON.stringify(result.rows.filter(x=>x.name!==x.concept||!x.uniqueEvolution||!x.differentStyles)));
  assert.equal(result.battle.length,48);
  assert.ok(result.battle.every(x=>x.moves),
    'Static actual canvas sprite: '+JSON.stringify(result.battle.filter(x=>!x.moves)));
  assert.equal(result.stylePreserved.length,48,'All 16 unfinished balls must preserve all three evolution stages');
  assert.ok(result.stylePreserved.every(x=>x.unchanged&&x.notApproved),
    'Unapproved third batch must not switch appearance');
  assert.equal(result.untouched,true,'Visual tests changed user saves or game mechanics');
  await page.emulateMedia({reducedMotion:'reduce'});
  const reduced=await page.evaluate(()=>{
   const el=document.createElement('div');el.innerHTML=BVBSketch33to48.svgFor(32,3);
   document.body.appendChild(el);
   const animation=getComputedStyle(el.querySelector('.sk33-identity')).animationName;
   const particles=getComputedStyle(el.querySelector('.sk33-ability-fx')).animationName;
   el.remove();return {animation,particles};
  });
  assert.equal(reduced.animation,'none');
  assert.equal(reduced.particles,'none');
  assert.deepEqual(errors,[],'No browser exceptions');
  console.log('PASS third-batch animated art '+engineName+': 96/96 SVG rigs and particles; 48/48 live canvas motions; 16 original identities; evolving 2 styles; style gate; reduced motion; no save mutations.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

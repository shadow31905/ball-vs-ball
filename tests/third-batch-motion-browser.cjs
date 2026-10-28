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
    variants.push({id,tier,style,svg,motion:svg.querySelector('.sk33-identity'),particles:svg.querySelector('.sk33-ability-fx'),gear2:svg.querySelector('.sk33-stage2'),gear3:svg.querySelector('.sk33-stage3')});
   }
   document.body.appendChild(host);
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   function framesAt(milliseconds){
    for(const a of host.getAnimations({subtree:true})){a.pause();a.currentTime=milliseconds;}
    return variants.map(v=>({
     motion:getComputedStyle(v.motion).transform,particles:getComputedStyle(v.particles).transform,
     gear2:v.gear2?getComputedStyle(v.gear2).transform:null,gear3:v.gear3?getComputedStyle(v.gear3).transform:null,
     gearName2:v.gear2?getComputedStyle(v.gear2).animationName:null,gearName3:v.gear3?getComputedStyle(v.gear3).animationName:null,
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
    moving:v.motion!==second[i].motion,particleMoving:v.particles!==second[i].particles,
    stagedCorrect:variants[i].tier===1?!variants[i].gear2&&!variants[i].gear3:
     variants[i].tier===2?!!variants[i].gear2&&!variants[i].gear3:!!variants[i].gear2&&!!variants[i].gear3,
    hardwareV2:variants[i].tier===1||v.gearName2?.startsWith('sk33Gear')&&v.gear2!==second[i].gear2,
    hardwareV3:variants[i].tier<3||v.gearName3?.startsWith('sk33Apex')&&v.gear3!==second[i].gear3
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
  assert.ok(result.variants.every(x=>x.stagedCorrect&&x.hardwareV2&&x.hardwareV3),
    'Unfinished or static evolving equipment: '+JSON.stringify(result.variants.filter(x=>!x.stagedCorrect||!x.hardwareV2||!x.hardwareV3).slice(0,8)));
  assert.equal(result.variants.filter(x=>x.tier>=2).length,64,'V2 physical hardware present in both appearances');
  assert.equal(result.variants.filter(x=>x.tier===3).length,32,'V3 physical hardware present in both appearances');
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
  const pref=await page.evaluate(()=>{
   const saved={inventory:S.o.art_inventory,intensity:S.o.artIntensity,interior:S.o.art_interior};
   const parent=document.createElement('div');
   for(const id of [32,35,41,47]){
    for(const tier of [1,3]){
     const div=document.createElement('div');div.innerHTML=BVBSketch33to48.svgFor(id,tier);
     parent.append(div.firstElementChild);
    }
   }
   document.body.appendChild(parent);
   const motion=()=>[...parent.querySelectorAll('.sk33-identity')].map(x=>getComputedStyle(x).animationName);
   const core=()=>[...parent.querySelectorAll('.sk33-core')].map(x=>getComputedStyle(x).animationName);
   let normal,inventoryOff,intensityOff,interiorOff;
   try{
    BVBMotion.sync();normal=motion();
    S.o.art_inventory=0;BVBMotion.sync();inventoryOff=motion();
    S.o.art_inventory=1;S.o.artIntensity=0;BVBMotion.sync();intensityOff=motion();
    S.o.artIntensity=saved.intensity;S.o.art_interior=0;BVBMotion.sync();interiorOff=core();
   }finally{
    S.o.art_inventory=saved.inventory;S.o.artIntensity=saved.intensity;
    S.o.art_interior=saved.interior;BVBMotion.sync();parent.remove();
   }
   return {normal,inventoryOff,intensityOff,interiorOff};
  });
  assert.equal(pref.normal.length,8);
  assert.ok(pref.normal.every(x=>x.startsWith('sk33Skill')));
  assert.ok(pref.inventoryOff.every(x=>x==='none'),'Inventory animation toggle must stop every checked V1/V3 rig');
  assert.ok(pref.intensityOff.every(x=>x==='none'),'Zero intensity must stop every checked V1/V3 rig');
  assert.ok(pref.interiorOff.every(x=>x==='none'),'Interior animation toggle must stop core motion');
  const frozen=await page.evaluate(async()=>{
   const original={artIntensity:S.o.artIntensity,art_fight:S.o.art_fight,art_interior:S.o.art_interior};
   const cv=document.createElement('canvas');cv.width=cv.height=128;
   const ctx=cv.getContext('2d',{willReadFrequently:true});
   const hash=()=>{let px=ctx.getImageData(0,0,128,128).data,n=2166136261;
    for(let j=0;j<px.length;j+=8){n^=px[j];n=Math.imul(n,16777619);n^=px[j+3];n=Math.imul(n,16777619);}return n>>>0;};
   const results=[];
   try{
    for(const id of [16,31,32,47]){
     const image=BVBArtEvolution.imageForTier(id,3);await image.decode();
     const art=id<32?BVBSketch17to32:BVBSketch33to48;
     for(const flag of ['intensity','fight']){
      S.o.artIntensity=flag==='intensity'?0:85;
      S.o.art_fight=flag==='fight'?0:1;
      S.o.art_interior=1;BVBMotion.sync();
      const frames=[];
      for(const t of [.13,1.67]){
       ctx.clearRect(0,0,128,128);
       if(!art.drawCombatSprite(ctx,id,3,64,64,27,t,image))throw Error('No image '+id);
       frames.push(hash());
      }
      results.push({id,flag,stopped:frames[0]===frames[1]});
     }
    }
   }finally{
    S.o.artIntensity=original.artIntensity;S.o.art_fight=original.art_fight;
    S.o.art_interior=original.art_interior;BVBMotion.sync();
   }
   return results;
  });
  assert.equal(frozen.length,8);
  assert.ok(frozen.every(x=>x.stopped),'Disabling action animation must freeze the actual rendered sprite: '+JSON.stringify(frozen.filter(x=>!x.stopped)));
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
  console.log('PASS third-batch animated art '+engineName+': 96/96 SVG rigs and particles; 64 V2 and 32 V3 independently moving hardware stages; 48/48 live canvas motions; 16 original identities; evolving 2 styles; style gate; reduced motion; no save mutations.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

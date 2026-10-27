'use strict';
const assert=require('node:assert/strict');
const browserName=process.env.BVB_BROWSER||'chromium';
const browserEngine=require('playwright')[browserName];
const expected=['Przekuwacz','Komórka','Elektryk','Strefa','Promień','WDC','Jabłko','Armata','Wirus','Wielki Kolec','Łuk','Król Elektryków','Zasięg','Mróz','Harpun','Rój'];
(async()=>{
 const browser=await browserEngine.launch({headless:true,...(browserName==='chromium'?{args:['--no-sandbox']}:{})});
 try{
  const page=await browser.newPage({viewport:{width:430,height:900},reducedMotion:'no-preference'});
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await page.goto(process.env.BVB_TEST_URL||'http://127.0.0.1:8765/beta/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>!!window.BVBSketch17to32&&!!window.BVBMotion&&typeof B!=='undefined');
  const proof=await page.evaluate(async()=>{
   const hash=ctx=>{const a=ctx.getImageData(0,0,128,128).data;let h=2166136261;for(let i=0;i<a.length;i+=4){for(let k=0;k<4;k++){h^=a[i+k];h=Math.imul(h,16777619);}}return h>>>0;};
   const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d',{willReadFrequently:true});
   const saved=S.o;S.o={...S.o,art_fight:1,art_interior:1,artIntensity:85,artQuality:'high'};BVBMotion.sync();
   const rows=[];
   try{
    for(let id=16;id<=31;id++){
     const imgs=[],motions=[];
     for(let tier=1;tier<=3;tier++){
      const svg=BVBSketch17to32.svgFor(id,tier);
      const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
      await im.decode();
      ctx.clearRect(0,0,128,128);ctx.drawImage(im,0,0,128,128);
      imgs.push(hash(ctx));
      const frames=[];
      for(const rt of [.31,1.77]){
       ctx.clearRect(0,0,128,128);
       BVBSketch17to32.renderCombat(ctx,{b:B[id],tier,x:64,y:64,r:24},{rt});
       frames.push(hash(ctx));
      }
      motions.push(frames[0]!==frames[1]);
     }
     rows.push({id,name:BVBSketch17to32.concepts[id-16]?.name,imageDistinct:new Set(imgs).size===3,motions});
    }
   }finally{S.o=saved;BVBMotion.sync();}
   return {beta:!!document.querySelector('meta[name="bvb-beta-build"]'),rows};
  });
  console.log('BETA second16 visual check:',JSON.stringify({beta:proof.beta,uniqueArt:proof.rows.filter(x=>x.imageDistinct).length,movingCombat:proof.rows.flatMap(x=>x.motions).filter(Boolean).length,expected:48}));
  assert.equal(proof.beta,true,'This test must only run against the isolated beta build');
  assert.deepEqual(proof.rows.map(x=>x.name),expected,'Approved identities differ from currently displayed artwork');
  assert.ok(proof.rows.every(x=>x.imageDistinct),'V1, V2, V3 must have visibly different pixel images');
  assert.ok(proof.rows.every(x=>x.motions.every(Boolean)),'All 48 V1–V3 combat motifs must visibly move between frames');
  assert.deepEqual(errors,[],'Unexpected browser exception');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

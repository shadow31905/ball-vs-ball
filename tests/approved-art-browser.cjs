'use strict';
const assert=require('node:assert/strict');
async function checkApprovedArt(page){
  await page.waitForFunction(()=>window.BVBApprovedArt?.state().ready);
  const proof=await page.evaluate(()=>{
   BVBMotion.prefs();settingsForArena(1);
   const prior=JSON.stringify(S),rows=[],drawn=[],hashes=new Set();
   for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){
    const image=BVBArtEvolution.imageForTier(id,tier),frame=BVBApprovedArt.frame(id,tier);
    if(!image.src.endsWith(frame.source.slice(2)))throw new Error('Wrong source '+id+' V'+tier);
    const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);
    const rgba=ctx.getImageData(0,0,256,256).data;let hash=2166136261,alpha=0,opaque=0,border=0;
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){
     const p=(y*256+x)*4;
     if(rgba[p+3]){opaque++;if(x<3||y<3||x>252||y>252)border++;}else alpha++;
     for(let j=0;j<4;j++){hash^=rgba[p+j];hash=Math.imul(hash,16777619);}
    }
    hashes.add(hash>>>0);rows.push({id,tier,opaque,alpha,border});
   }
   const savedGame=G,original=cx.drawImage;
   try{
    cx.drawImage=function(image,...args){if(image?.src)drawn.push(image.src);return original.call(this,image,...args);};
    for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){
     G={m:0,my:[B[id]],bt:[B[16]],sv:false,w:1,h:[3,3],ph:'battle',pa:-Math.PI/2,bl:[],pr:[],z:[],events:[],fx:[],rings:[],pop:[],rt:2,th:1,rare:'',obstacles:[],portal:null,arenaFxTime:0,matchId:'approved-art-fixture',dn:1,score:[0,0],bossIndex:0,rn:0};
     G.bl=[actor(B[id],100,180,0,0,0,tier,0,0),actor(B[16],260,180,Math.PI,1,1,1,0,0)];
     BVBRework.prepareActors(G,...G.bl);draw();
    }
   }finally{cx.drawImage=original;G=savedGame;}
   return {rows,unique:hashes.size,drawn,unchanged:prior===JSON.stringify(S)};
  });
  assert.equal(proof.unique,48);assert.ok(proof.rows.every(r=>r.opaque>2000&&r.alpha>2000&&r.border===0));
  for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++)assert.ok(proof.drawn.some(url=>url.endsWith('ball-'+String(id).padStart(2,'0')+'-v'+tier+'.webp')));
  assert.ok(proof.unchanged);
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.evaluate(()=>BVBApprovedArt.state().frames),48);

  await page.emulateMedia({reducedMotion:'no-preference'});
  return proof;
}
module.exports={checkApprovedArt};
if(require.main===module)(async()=>{
 const name=process.env.BVB_BROWSER||'chromium';
 const browser=await require('playwright')[name].launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:430,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.BVB_TEST_URL||'http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
  await checkApprovedArt(page);assert.deepEqual(errors,[]);
  console.log(name+': all 48 textures decoded and drawn in real battle, with alpha padding and unchanged saves.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

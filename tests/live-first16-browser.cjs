'use strict';
const assert=require('node:assert/strict');
async function checkLiveFirst16(page){
 await page.waitForFunction(()=>window.BVBLiveFirst16&&window.BVBApprovedArt?.state().ready);
 const viewport=page.viewportSize();
 await page.setViewportSize({width:1240,height:760});await page.emulateMedia({reducedMotion:'no-preference'});
 await page.evaluate(()=>{
  window.__bvb16SavedOptions=S.o;S.o={...S.o,art_inventory:1,art_fight:1,art_interior:1,artIntensity:85,artQuality:'high'};BVBMotion.sync();
  const host=document.createElement('div');host.id='bvb16MotionProof';
  host.style.cssText='position:fixed;left:10px;top:10px;z-index:2147483647;width:1200px;padding:8px;background:#101c34;display:grid;grid-template-columns:repeat(4,1fr);gap:6px';
  for(let id=0;id<16;id++){
   const card=document.createElement('div');card.style.cssText='display:flex;gap:0';
   for(let tier=1;tier<=3;tier++){const cell=document.createElement('div');cell.className='qa-variant';cell.dataset.id=id;cell.dataset.tier=tier;cell.style.cssText='width:94px;height:112px;flex-shrink:0';cell.innerHTML='<div style="width:94px;height:94px">'+BVBLiveFirst16.svgFor(id,tier)+'</div><small>'+id+' V'+tier+'</small>';card.appendChild(cell);}
   host.appendChild(card);
  }
  document.body.appendChild(host);
 });
 try{
  const root=page.locator('#bvb16MotionProof');
  const initial=await page.evaluate(()=>{
   const root=document.getElementById('bvb16MotionProof'),animations=root.getAnimations({subtree:true});
   for(const a of animations){a.pause();a.currentTime=210;}
   const box=root.getBoundingClientRect();
   return {animations:animations.length,rects:[...root.querySelectorAll('.qa-variant')].map(e=>{const b=e.getBoundingClientRect();return {id:+e.dataset.id,tier:+e.dataset.tier,x:b.x-box.x,y:b.y-box.y,width:94,height:94};}),
    equipment:[...root.querySelectorAll('.bvb16-outer,.bvb16-left')].map(e=>getComputedStyle(e).transform)};
  });
  assert.ok(initial.animations>=48*3,'every form needs separately animated body/equipment/effects');
  const first=await root.screenshot({animations:'allow'});
  const next=await page.evaluate(()=>{
   const root=document.getElementById('bvb16MotionProof');for(const a of root.getAnimations({subtree:true}))a.currentTime=830;
   return [...root.querySelectorAll('.bvb16-outer,.bvb16-left')].map(e=>getComputedStyle(e).transform);
  });
  const second=await root.screenshot({animations:'allow'});
  const changed=await page.evaluate(async({before,after,rects})=>{
   const canvases=await Promise.all([before,after].map(async uri=>{const im=new Image();im.src=uri;await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;c.getContext('2d').drawImage(im,0,0);return c;}));
   return rects.map(rect=>{const hashes=canvases.map(c=>{const p=c.getContext('2d').getImageData(Math.round(rect.x),Math.round(rect.y),rect.width,rect.height).data;let h=2166136261;for(let i=0;i<p.length;i++){h^=p[i];h=Math.imul(h,16777619);}return h>>>0;});return {...rect,changed:hashes[0]!==hashes[1]};});
  },{before:'data:image/png;base64,'+first.toString('base64'),after:'data:image/png;base64,'+second.toString('base64'),rects:initial.rects});
  assert.equal(changed.length,48);assert.ok(changed.every(row=>row.changed),'static inventory forms: '+JSON.stringify(changed.filter(r=>!r.changed)));
  assert.equal(next.filter((p,i)=>p!==initial.equipment[i]).length,48,'all 48 equipment layers must move independently');
  const canvasProof=await page.evaluate(()=>{
   const c=document.createElement('canvas');c.width=c.height=160;const ctx=c.getContext('2d'),before=JSON.stringify(S),rows=[];
   const hash=()=>{const p=ctx.getImageData(0,0,160,160).data;let h=2166136261;for(let i=0;i<p.length;i++){h^=p[i];h=Math.imul(h,16777619);}return h>>>0;};
   for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){
    const h=[];
    for(const scope of ['battle','preview'])for(const t of [.21,.83]){ctx.clearRect(0,0,160,160);BVBLiveFirst16.draw(ctx,id,tier,80,85,24,t,{scope});h.push(hash());}
    rows.push({id,tier,battle:h[0]!==h[1],preview:h[2]!==h[3]});
   }
   return {rows,intact:before===JSON.stringify(S)};
  });
  assert.ok(canvasProof.rows.every(r=>r.battle&&r.preview));assert.ok(canvasProof.intact);
  await page.emulateMedia({reducedMotion:'reduce'});
  const reduced=await page.evaluate(()=>{
   const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),rows=[];
   for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){
    const frames=[];for(const t of [.21,.83]){ctx.clearRect(0,0,128,128);BVBLiveFirst16.draw(ctx,id,tier,64,70,20,t,{scope:'battle'});frames.push(c.toDataURL());}rows.push(frames[0]===frames[1]);
   }return {rows,animations:document.getElementById('bvb16MotionProof').getAnimations({subtree:true}).length};
  });
  assert.ok(reduced.rows.every(Boolean));assert.equal(reduced.animations,0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  const disabled=await page.evaluate(()=>{S.o.art_inventory=0;BVBMotion.sync();return document.getElementById('bvb16MotionProof').getAnimations({subtree:true}).length;});
  assert.equal(disabled,0);
  const zero=await page.evaluate(()=>{S.o.art_inventory=1;S.o.artIntensity=0;BVBMotion.sync();return document.getElementById('bvb16MotionProof').getAnimations({subtree:true}).length;});
  assert.equal(zero,0,'zero intensity must stop inventory animation');
  console.log('Continuous first16: 48 changing inventory portraits, 48 moving equipment layers, 48 battle + 48 preview pixel checks; reduced-motion/settings honored.');
 }finally{
  await page.evaluate(()=>{document.getElementById('bvb16MotionProof')?.remove();S.o=window.__bvb16SavedOptions;delete window.__bvb16SavedOptions;BVBMotion.sync();});
  await page.emulateMedia({reducedMotion:'no-preference'});if(viewport)await page.setViewportSize(viewport);
 }
}
module.exports={checkLiveFirst16};
if(require.main===module)(async()=>{
 const name=process.env.BVB_BROWSER||'chromium',browser=await require('playwright')[name].launch({headless:true});
 try{const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.BVB_TEST_URL||'http://127.0.0.1:8765/',{waitUntil:'domcontentloaded'});
 await checkLiveFirst16(page);assert.deepEqual(errors,[]);}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

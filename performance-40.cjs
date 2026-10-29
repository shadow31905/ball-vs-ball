module.exports=async function(page){
 const result={duration:0,cases:[],cleanup:[],method:'5+ minutes of real-time rendered previews; headless CI, desktop viewport'};
 await page.setViewportSize({width:1280,height:900});
 const order=[{id:5,tier:3},...Array.from({length:39},(_,i)=>({id:Math.floor(i/3),tier:i%3+1})),{id:5,tier:3}];
 const started=Date.now();
 for(const {id,tier}of order){
  await page.evaluate(({id,tier})=>{BVBBatch1Beta.setTier(tier);panel('col');openBallDetail(id);window.__frameTimes=[];window.__frameStop=false;let last=performance.now();function sample(now){if(window.__frameStop)return;window.__frameTimes.push(now-last);last=now;requestAnimationFrame(sample);}requestAnimationFrame(sample);},{id,tier});
  await page.waitForTimeout(7800);
  const detail=await page.evaluate(()=>{window.__frameStop=true;const times=window.__frameTimes.filter(x=>x>0),total=times.reduce((a,b)=>a+b,0),state=BVBPreviewQA.info();return{frames:times.length,fps:1000*times.length/total,maxFrameMs:Math.max(...times),state};});
  const status=detail.frames>100&&detail.fps>=30&&detail.maxFrameMs<2000&&!detail.state?.error?'PASS':'FAIL';
  result.cases.push({id,tier,status,...detail});
  await page.locator('#bvb-b1-detail-head .bvb-b1-close-top').click();
 }
 for(let n=0;n<10;n++){
  await page.evaluate(()=>{panel('col');openBallDetail(6);});await page.waitForTimeout(80);
  await page.locator('#bvb-b1-detail-head .bvb-b1-close-top').click();
  const detail=await page.evaluate(()=>({frames:BVBPreviewQA.info()?.frames||0,canvases:document.querySelectorAll('canvas').length,previews:document.querySelectorAll('#bvb-b1-preview').length,animations:document.getAnimations().length}));
  await page.waitForTimeout(80);const next=await page.evaluate(()=>BVBPreviewQA.info()?.frames||0);
  result.cleanup.push({...detail,stopped:detail.frames===next});
 }
 const first=result.cases[0],last=result.cases.at(-1);result.retainedPerformance=last.fps>=first.fps*.75;
 result.duration=(Date.now()-started)/1000;
 const baseline=result.cleanup[0];result.status=result.duration>=300&&result.retainedPerformance&&result.cases.every(x=>x.status==='PASS')&&result.cleanup.every(x=>x.stopped&&x.canvases===baseline.canvases&&x.previews===baseline.previews&&x.animations<=baseline.animations+2)?'PASS':'FAIL';
 return result;
};

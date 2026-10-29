const {chromium,firefox,webkit}=require('playwright');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
(async()=>{
 const name=process.argv[2]||'chromium',out='evidence/'+name;fs.mkdirSync(out,{recursive:true});
 const browser=await({chromium,firefox,webkit}[name]).launch({headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const report={browser:name,htmlSha256:crypto.createHash('sha256').update(fs.readFileSync('beta.html')).digest('hex'),preview:[],mobile:[],errors};
 const save=()=>fs.writeFileSync(out+'/new-40.json',JSON.stringify(report,null,2));
 async function open(){await page.goto('file://'+path.resolve('beta.html'));await page.waitForFunction(()=>window.BVBBatch1Beta?.ready&&window.BVBApprovedArt?.state?.().ready);}
 try{
  await page.bringToFront();await open();
  for(let id=0;id<13;id++)for(const tier of [1,2,3]){
   const before=await page.evaluate(({id,tier})=>{BVBBatch1Beta.setTier(tier);panel('col');const save=JSON.stringify(S),game=JSON.stringify(G),storage=JSON.stringify({...localStorage});openBallDetail(id);document.querySelector('#bvb-b1-preview [data-tier="'+tier+'"]').click();return{save,game,storage};},{id,tier});
   await page.waitForFunction(()=>BVBPreviewQA.info()?.frames>1);
   await page.locator('#bvb-b1-pause').evaluate(el=>el.click());
   const paused=await page.evaluate(()=>BVBPreviewQA.info());
   await page.waitForTimeout(100);
   const unchanged=await page.evaluate(()=>BVBPreviewQA.info());
   const simulation=await page.evaluate(()=>{BVBPreviewQA.advance(6);const state=BVBPreviewQA.info(),label=document.querySelector('#bvb-b1-result').textContent;return{state,label,hpSynced:label.includes(state.ownHp.toFixed(1)+' HP')&&label.includes(state.opponentHp.toFixed(1)+' HP rywala'),hasPixels:document.querySelector('#bvb-b1-canvas').getContext('2d').getImageData(0,0,420,420).data.some((v,i)=>i%4===3&&v>0)};});
   await page.locator('#bvb-b1-pause').evaluate(el=>el.click());
   await page.waitForFunction(frames=>BVBPreviewQA.info().frames>frames,simulation.state.frames);
   await page.locator('#bvb-b1-replay').evaluate(el=>el.click());
   await page.waitForFunction(()=>BVBPreviewQA.info()?.frames>=1&&BVBPreviewQA.info()?.frames<30);
   const replay=await page.evaluate(()=>BVBPreviewQA.info());
   await page.locator('#bvb-b1-detail-head .bvb-b1-close-top').click();
   const closed=await page.evaluate(()=>BVBPreviewQA.info());
   await page.waitForTimeout(100);
   const after=await page.evaluate(()=>({save:JSON.stringify(S),game:JSON.stringify(G),storage:JSON.stringify({...localStorage}),closed:document.getElementById('ov').hidden,info:BVBPreviewQA.info()}));
   const checks={correctVariant:simulation.state.id===id&&simulation.state.tier===tier,pause:paused.frames===unchanged.frames,replay:replay.frames<simulation.state.frames&&replay.events.length<simulation.state.events.length,close:after.closed,stoppedAfterClose:closed.frames===after.info.frames,sameSave:before.save===after.save,sameStorage:before.storage===after.storage,sameGame:before.game===after.game,hpSynced:simulation.hpSynced,ability:simulation.state.abilitySeen&&simulation.state.events.length>0,rendered:simulation.hasPixels,noError:!simulation.state.error};
   report.preview.push({id,tier,checks,status:Object.values(checks).every(Boolean)?'PASS':'FAIL',simulation:simulation.state});save();
  }
  console.log('NEW40_PREVIEW='+JSON.stringify({browser:name,total:report.preview.length,passed:report.preview.filter(x=>x.status==='PASS').length,failures:report.preview.filter(x=>x.status!=='PASS')}));
  // Each independent engine scenario starts from a fresh actor/game fixture.
  for(const n of ['006','007','009','critical','regression','ice','dice','shared','parity']){report['scenario'+n]=await page.evaluate(fs.readFileSync('scenario-'+n+'.js','utf8'));save();}
  await open();
  for(const viewport of [{width:360,height:640},{width:640,height:360}]){
   await page.setViewportSize(viewport);
   for(const id of [0,7,12])for(const tier of [1,2,3]){
    await page.evaluate(({id,tier})=>{BVBBatch1Beta.setTier(tier);panel('col');openBallDetail(id);},{id,tier});
    const detail=await page.evaluate(()=>{const r=document.querySelector('#bvb-b1-canvas').getBoundingClientRect();const ov=document.querySelector('#ov'),box=document.querySelector('#ovb');return{canvas:{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right},window:innerWidth,bodyWidth:document.documentElement.scrollWidth,overlay:ov.getBoundingClientRect().toJSON(),content:box.getBoundingClientRect().toJSON()};});
    const b=page.locator('#bvb-b1-preview [data-tier="'+tier+'"]');await b.scrollIntoViewIfNeeded();await b.click();
    await page.locator('#bvb-b1-detail-head .bvb-b1-close-top').click();
    report.mobile.push({id,tier,viewport,detail,closed:await page.locator('#ov').evaluate(x=>x.hidden),horizontalOverflow:detail.canvas.x<0||detail.canvas.right>viewport.width+1});
   }
  }
  if(!process.argv.includes('--mechanics-only')){report.performance=await require('./performance-40.cjs')(page);save();}else report.performanceNote='Dłuższa próba stabilności wykonana w przebiegu 40815409447; ta zmiana dotyczy wyłącznie ograniczenia HP do zera.';
  report.storage=await page.evaluate(()=>{panel('col');S.o.vm=.37;save();return{expected:S.o.vm,storage:JSON.stringify({...localStorage})};});
  await page.reload();await page.waitForFunction(()=>window.BVBBatch1Beta?.ready);report.storage.actual=await page.evaluate(()=>S.o.vm);
  report.storage.status=report.storage.expected===report.storage.actual?'PASS':'FAIL';
 }catch(e){report.exception=e.stack;}
 finally{save();await browser.close();}
 function failures(value){if(!value||typeof value!=='object')return[];if(value.status==='FAIL')return[value];return Object.values(value).flatMap(failures);}
 const failed=failures(report);
 console.log('NEW40_RESULT='+JSON.stringify({browser:name,previewPassed:report.preview.filter(x=>x.status==='PASS').length,previewTotal:report.preview.length,mobileCases:report.mobile.length,mobileOverflow:report.mobile.filter(x=>x.horizontalOverflow),performance:report.performance?{status:report.performance.status,duration:report.performance.duration,cases:report.performance.cases.length,retained:report.performance.retainedPerformance,failures:report.performance.cases.filter(x=>x.status!=='PASS')}:null,storage:report.storage?{expected:report.storage.expected,actual:report.storage.actual,status:report.storage.status}:null,errors,exception:report.exception,failed,scenarios:Object.fromEntries(['006','007','009','critical','regression','ice','dice','shared','parity'].map(n=>[n,Array.isArray(report['scenario'+n])?report['scenario'+n].filter(x=>x.status==='PASS').length:report['scenario'+n]?Object.fromEntries(Object.entries(report['scenario'+n]).map(([k,v])=>[k,v.filter(x=>x.status==='PASS').length])):null]))}));
 if(report.exception||errors.length||failed.length||report.mobile.some(x=>x.horizontalOverflow))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

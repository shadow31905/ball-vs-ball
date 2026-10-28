const {chromium,firefox,webkit}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
(async()=>{
 const name=process.argv[2]||'chromium',out='evidence/'+name;fs.mkdirSync(out,{recursive:true});
 const report={test:'005',name:'Sprawdź animacje kulki w ekwipunku.',browser:name,htmlSha256:crypto.createHash('sha256').update(fs.readFileSync('beta.html')).digest('hex'),cases:[],errors:[]};
 const browser=await({chromium,firefox,webkit}[name]).launch({headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'no-preference'});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.bringToFront();
 await page.goto('file://'+path.resolve('beta.html'),{waitUntil:'load'});
 await page.waitForFunction(()=>window.BVBBatch1Beta?.ready&&window.BVBApprovedArt?.state?.().ready);
 for(const tier of [1,2,3]){
  await page.evaluate(t=>{BVBBatch1Beta.setTier(t);panel('col');document.getElementById('ov').hidden=true;},tier);
  await page.locator('#pb svg[data-live-first16]').first().waitFor({state:'visible'});
  const read=()=>page.locator('#pb svg[data-live-first16]').evaluateAll(nodes=>nodes.map(svg=>({id:Number(svg.dataset.ballId),tier:Number(svg.dataset.evolution),visible:svg.getBoundingClientRect().width>0&&getComputedStyle(svg).visibility!=='hidden',animations:document.getAnimations().filter(a=>a.effect?.target&&svg.contains(a.effect.target)).map(a=>({name:a.animationName,state:a.playState,time:a.currentTime})),transforms:[...svg.querySelectorAll('g[class]')].map(g=>({cls:g.getAttribute('class'),transform:getComputedStyle(g).transform,opacity:getComputedStyle(g).opacity})),sources:[...svg.querySelectorAll('image')].map(im=>im.getAttribute('href'))})));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.waitForFunction(()=>document.getAnimations().some(a=>a.playState==='running'&&a.currentTime>100),{},{timeout:10000});
  const before=await read();
  await page.waitForTimeout(500);const after=await read();
  await page.screenshot({path:out+'/V'+tier+'-after.png',fullPage:true,animations:'allow'});
  report.visibility={state:await page.evaluate(()=>document.visibilityState),timeline:await page.evaluate(()=>document.timeline.currentTime)};
  for(let id=0;id<13;id++){
   const a=before.find(x=>x.id===id),b=after.find(x=>x.id===id);const errors=[];
   if(before.filter(x=>x.id===id).length!==1||!a||!b)errors.push('MISSING_OR_DUPLICATE_CARD');
   if(a&&b){
    if(a.tier!==tier||b.tier!==tier)errors.push('WRONG_EVOLUTION');
    if(!a.visible||!b.visible)errors.push('INVISIBLE');
    if(!b.animations.some(x=>x.state==='running'))errors.push('NO_RUNNING_CSS_ANIMATION');
    if(JSON.stringify(a.transforms)===JSON.stringify(b.transforms))errors.push('NO_RENDERED_CHANGE');
    if(!a.sources.length||a.sources.some(x=>!x?.startsWith('data:image/webp;base64,')))errors.push('MISSING_TEXTURE');
   }
   report.cases.push({id,tier,status:errors.length?'FAIL':'PASS',errors,before:a,after:b});
  }
 }
 report.status=report.cases.length===39&&report.cases.every(x=>x.status==='PASS')&&!report.errors.length?'PASS':'FAIL';
 }catch(e){report.errors.push(e.stack);report.status='FAIL';}finally{await browser.close();fs.writeFileSync(out+'/005.json',JSON.stringify(report,null,2));}
 console.log('TEST005_RESULT='+JSON.stringify({browser:name,status:report.status,cases:report.cases.map(({id,tier,status,errors})=>({id,tier,status,errors})),errors:report.errors}));
 if(report.status!=='PASS')process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

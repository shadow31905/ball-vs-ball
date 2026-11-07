// Chromium integration test — loads the real rework bundle over local HTTP.
// Runs only on disposable local browser storage, not on production.
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.txt':'text/plain; charset=utf-8','.css':'text/css','.mp4':'video/mp4','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const target=path.resolve(root,'.'+name);
 if(!(target===root||target.startsWith(root+path.sep))){res.writeHead(403);res.end('forbidden');return}
 const file=target===root?path.join(root,'index.html'):target;
 try{if(!fs.statSync(file).isFile())throw Error('not a file')}catch(_){res.writeHead(404);res.end('not found');return}
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
 fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 const port=server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const findings=[];
 try{
  for(const setup of [{name:'desktop',width:1280,height:720},{name:'mobile',width:390,height:844}]){
   const ctx=await browser.newContext({viewport:{width:setup.width,height:setup.height},deviceScaleFactor:1});
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   await page.addInitScript(()=>{window.__BVB_QA_NOW=Date.parse('2026-11-07T16:05:00+01:00')});
   try{
    await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded',timeout:180000});
    await page.waitForFunction(()=>document.querySelector('#bvb-film-menu')||
       /nie udało się|błąd uruchamiania/i.test(document.querySelector('#bvb-loading-label')?.textContent||''),null,{timeout:150000});
    const exists=await page.evaluate(()=>Boolean(document.querySelector('#bvb-film-menu')));
    assert.ok(exists,setup.name+': new menu did not initialize');
    findings.push('PASS '+setup.name+': game loaded with V7 menu');
    const hasReplay=await page.evaluate(()=>Boolean(document.querySelector('#bvb-film-menu [data-act="replays"]')));
    assert.equal(hasReplay,false,setup.name+': replays must be absent');
    await page.evaluate(()=>document.querySelector('#bvb-film-menu [data-act="campaign"]')?.click());
    const soon=await page.locator('#bvb-fm-screen').textContent();
    assert.match(soon,/TRYB FABULARNY — WKRÓTCE/);
    findings.push('PASS '+setup.name+': story mode says WKRÓTCE');
    if(setup.name==='desktop'){
     const engine=await page.evaluate(()=>({
      start:typeof window.startMatch==='function',panel:typeof window.panel==='function',
      pull:typeof window.pull==='function',app:!!document.querySelector('#app'),game:!!document.querySelector('#game')
     }));
     findings.push('ENGINE '+JSON.stringify(engine));
     assert.ok(engine.start&&engine.app&&engine.game,'real engine missing core functions');
     const training=await page.evaluate(()=>{
      try{window.startMatch(4);return {error:null,phase:(typeof G!=='undefined'&&G)?G.ph:null,hidden:document.querySelector('#game')?.hidden}}
      catch(e){return {error:String(e)}}
     });
     findings.push('TRAINING '+JSON.stringify(training));
     assert.equal(training.error,null,'training failed to start');
     assert.equal(training.hidden,false,'training screen remained hidden');
     findings.push('PASS desktop: training round launched');
    }
    if(errors.length) findings.push('BROWSER_ERRORS '+setup.name+' '+JSON.stringify(errors.slice(0,8)));
    await page.screenshot({path:path.join(__dirname,'v7-'+setup.name+'-e2e.png'),animations:'disabled',timeout:30000}).catch(()=>{});
   }catch(e){
    findings.push('FAIL '+setup.name+': '+e.message);
    await page.screenshot({path:path.join(__dirname,'v7-'+setup.name+'-failure.png'),timeout:30000}).catch(()=>{});
    throw e;
   }finally{await ctx.close()}
  }
  console.log(findings.join('\n'));
 }finally{
  await browser.close();server.close();
 }
})().catch(e=>{console.error('E2E FAIL:',e.stack||e);process.exitCode=1});

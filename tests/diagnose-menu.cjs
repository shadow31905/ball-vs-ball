const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
 const dest=path.resolve(root,'.'+p);
 if(!(dest===root||dest.startsWith(root+path.sep))){res.writeHead(403);res.end();return}
 const file=dest===root?path.join(root,'index.html'):dest;
 if(!fs.existsSync(file)){res.writeHead(404);res.end();return}
 const ext=path.extname(file),types={'.html':'text/html','.js':'text/javascript','.txt':'text/plain','.mp4':'video/mp4','.webp':'image/webp','.png':'image/png'};
 res.writeHead(200,{'content-type':types[ext]||'application/octet-stream','cache-control':'no-store'});
 fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const viewport of [{width:1280,height:720},{width:390,height:844}]){
   const page=await browser.newPage({viewport});
   const errors=[];page.on('pageerror',x=>errors.push(x.message));
   const url='http://127.0.0.1:'+server.address().port+'/';
   await page.goto(url,{waitUntil:'domcontentloaded',timeout:180000});
   await page.waitForFunction(()=>!!document.querySelector('#bvb-film-menu')||(/nie udało się|błąd/i.test(document.querySelector('#bvb-loading-label')?.textContent||'')),{timeout:150000});
   await page.waitForTimeout(1200);
   const state=async()=>page.evaluate(()=>{
    function info(id){let e=document.getElementById(id);if(!e)return null;
     const rect=e.getBoundingClientRect(),style=getComputedStyle(e);
     return {hidden:e.hidden,display:style.display,visibility:style.visibility,opacity:style.opacity,rect:[Math.round(rect.width),Math.round(rect.height)],parentHidden:e.closest('[hidden]')?.id||'',text:e.textContent?.slice(0,120)}
    }
    return {menu:info('menu'),newMenu:info('bvb-film-menu'),native:info('bvb3Home'),loading:info('bvb-loading-screen'),overlay:info('bvb-v7-premiere'),gate:info('accountGate'),app:info('app'),main:!!window.BVBFilmMenuBeta,ready:document.readyState}
   });
   console.log('BEFORE '+viewport.width+' '+JSON.stringify(await state()));
   if(await page.locator('#bvb-v7-skip').count()){await page.locator('#bvb-v7-skip').click({timeout:12000,force:true});await page.waitForTimeout(500)}
   console.log('AFTER '+viewport.width+' '+JSON.stringify(await state()));
   console.log('JSERRORS '+viewport.width+' '+JSON.stringify(errors.slice(0,10)));
   await page.screenshot({path:'tests/menu-after-film-'+viewport.width+'.png',fullPage:true,timeout:20000}).catch(()=>{});
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(x=>{console.error(x.stack);process.exitCode=1});

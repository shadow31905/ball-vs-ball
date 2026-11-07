const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.txt':'text/plain','.mp4':'video/mp4','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1'),p=decodeURIComponent(url.pathname),dest=path.resolve(root,'.'+p);
 if(!(dest===root||dest.startsWith(root+path.sep))){res.writeHead(403);res.end();return}
 const file=dest===root?path.join(root,'index.html'):dest;
 if(!fs.existsSync(file)){res.writeHead(404);res.end();return}
 res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
 fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let failed=false;
 try{
  for(const viewport of [{width:1280,height:720},{width:390,height:844}]){
   const page=await browser.newPage({viewport});
   const errors=[];page.on('pageerror',err=>errors.push(err.message));
   await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded',timeout:180000});
   await page.waitForSelector('#bvb-film-menu',{state:'attached',timeout:180000});
   await page.waitForTimeout(1000);
   const loading=page.locator('#bvb-loading-screen');
   await loading.waitFor({state:'detached',timeout:150000});
   const skip=page.locator('#bvb-v7-skip');
   if(await skip.count()&&await skip.isVisible())await skip.click();
   const guest=page.locator('#accountGate button').filter({hasText:'Graj bez konta'});
   if(await guest.count()&&await guest.isVisible())await guest.click();
   await page.locator('#bvb-film-menu').waitFor({state:'visible',timeout:30000});
   const rootMenu=page.locator('#bvb-film-menu');
   for(const key of ['play','campaign','training','crates','collection','shop']){
    if(!await rootMenu.locator('[data-act="'+key+'"]').count())throw Error('Missing menu control '+key);
   }
   await rootMenu.locator('[data-act="campaign"]').first().click();
   if(!await rootMenu.getByText('WKRÓTCE').count())throw Error('Campaign should say WKRÓTCE');
   await rootMenu.locator('[data-act="home"]').first().click();
   await rootMenu.locator('[data-act="crates"]').first().click();
   if(!await rootMenu.locator('.cinema-shopcard').count())throw Error('Missing film shop cards');
   await rootMenu.locator('[data-act="collection"]').first().click();
   if(!await rootMenu.locator('.cinema-collection-layout').count())throw Error('Missing film collection');
   if(!await rootMenu.locator('[data-evolution="1"]').count())throw Error('Missing evolution controls');
   await rootMenu.locator('[data-evolution="3"]').click();
   if(!await rootMenu.locator('[data-evolution="3"].selected').count())throw Error('Evolution control failed');
   await page.screenshot({path:'tests/v7-menu-'+viewport.width+'.png',fullPage:true});
   if(errors.length)throw Error('Browser JS errors: '+errors.slice(0,3).join('; '));
   console.log('PASS menu navigation '+viewport.width);
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err.stack);process.exitCode=1});
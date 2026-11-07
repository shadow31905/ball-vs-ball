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
   if(await rootMenu.isVisible()===false)throw Error('Film menu must be visible');
   await page.waitForFunction(()=>[...document.querySelectorAll('#bvb-film-menu .film-chests img')].length===3&&[...document.querySelectorAll('#bvb-film-menu .film-chests img')].every(i=>i.complete&&i.naturalWidth>0),{timeout:15000});
   await page.screenshot({path:'tests/v7-menu-home-'+viewport.width+'.png',fullPage:true});
   const artState=await page.evaluate(()=>{
    try{
     const balls=typeof B!=='undefined'&&Array.isArray(B)?B:[];
     const images=typeof ART_IMAGES!=='undefined'?ART_IMAGES:null;
     return {balls:balls.length,images:images?.size||0,first:images?.get?.(0)?.src?.slice(0,32)||'',last:balls.at(-1)?.n||''};
    }catch(e){return {error:String(e)}}
   });
   console.log('ART '+viewport.width+' '+JSON.stringify(artState));
   if(artState.balls<130)throw Error('Expected at least 130 original balls, got '+artState.balls);

   for(const key of ['play','campaign','training','crates','collection','shop']){
    if(!await rootMenu.locator('[data-act="'+key+'"]').count())throw Error('Missing menu control '+key);
   }
   await rootMenu.locator('[data-act="campaign"]').first().click();
   if(!await rootMenu.getByText('WKRÓTCE').count())throw Error('Campaign should say WKRÓTCE');
   await rootMenu.locator('#bvb-fm-screen [data-act="home"]').first().click();
   await rootMenu.locator('[data-act="crates"]').first().click();
   if(!await rootMenu.locator('.cinema-shopcard').count())throw Error('Missing film shop cards');
   await page.waitForFunction(()=>[...document.querySelectorAll('#bvb-film-menu .cinema-shopcard img')].length===3&&[...document.querySelectorAll('#bvb-film-menu .cinema-shopcard img')].every(i=>i.complete&&i.naturalWidth>0),{timeout:15000});
   await page.waitForTimeout(300);
   await page.screenshot({path:'tests/v7-menu-shop-'+viewport.width+'.png',fullPage:true});
   await rootMenu.locator('#bvb-fm-screen [data-act="home"]').first().click();
   await rootMenu.locator('[data-act="collection"]').first().click();
   if(!await rootMenu.locator('.cinema-collection-layout').count())throw Error('Missing film collection');
   await page.waitForTimeout(300);
   await page.screenshot({path:'tests/v7-menu-collection-'+viewport.width+'.png',fullPage:true});
   const actualPortraits=await rootMenu.locator('.cinema-ball-tile img.cinema-portrait').count();
   if(actualPortraits<2)throw Error('Collection uses no original ball artwork: '+actualPortraits);

   if(!await rootMenu.locator('[data-evolution="1"]').count())throw Error('Missing evolution controls');
   await rootMenu.locator('[data-evolution="3"]').click();
   if(!await rootMenu.locator('[data-evolution="3"].selected').count())throw Error('Evolution control failed');
   await rootMenu.locator('#bvb-fm-screen [data-act="home"]').first().click();
   await page.evaluate(()=>{if(typeof S==='undefined'||typeof save!=='function')throw Error('Native save unavailable');S.coins=5000;save();});
   await rootMenu.locator('[data-act="crates"]').first().click();
   const before=await page.evaluate(()=>({coins:S.coins,owned:S.own.length}));
   await rootMenu.locator('[data-act="purchase-normal"]').click();
   await rootMenu.locator('.cinema-reel-ball.winner').waitFor({state:'attached',timeout:10000});
   const winnerName=await rootMenu.locator('.cinema-reel-ball.winner small').textContent();
   if(await rootMenu.locator('.cinema-reel-ball img.cinema-portrait').count()<10)throw Error('Roulette missing real game artwork');
   await rootMenu.locator('.cinema-outcome').waitFor({state:'visible',timeout:15000});
   const result=await rootMenu.locator('.cinema-outcome').textContent();
   if(!result.includes(winnerName))throw Error('Visual winner and awarded result disagree');
   const after=await page.evaluate(()=>({coins:S.coins,owned:S.own.length,persisted:JSON.parse(localStorage.getItem(K)||'null')?.coins}));
   if(after.coins!==after.persisted||after.coins>before.coins-60||after.owned<before.owned)throw Error('Chest transaction did not persist: '+JSON.stringify({before,after}));
   await page.screenshot({path:'tests/v7-menu-reel-'+viewport.width+'.png',fullPage:true});
   console.log('PASS native chest transaction '+viewport.width+' '+winnerName+' '+JSON.stringify({before,after}));

   await page.screenshot({path:'tests/v7-menu-'+viewport.width+'.png',fullPage:true});
   if(errors.length)throw Error('Browser JS errors: '+errors.slice(0,3).join('; '));
   console.log('PASS menu navigation '+viewport.width);
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err.stack);process.exitCode=1});
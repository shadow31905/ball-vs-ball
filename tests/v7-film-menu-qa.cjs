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
  for(const viewport of [{width:1280,height:720},{width:960,height:540},{width:390,height:844}]){
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
   await page.waitForFunction(()=>{
    const logo=document.querySelector('#bvb-film-menu .film-logo-image');
    const banner=document.querySelector('#bvb-film-menu .film-mystery-banner');
    const icons=[...document.querySelectorAll('#bvb-film-menu .film-art-icon')];
    return logo?.complete&&logo.naturalWidth>0&&banner?.complete&&banner.naturalWidth>0&&icons.length===3&&icons.every(i=>i.complete&&i.naturalWidth>0);
   },{timeout:15000});
   const dimensions=await page.evaluate(()=>({height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,viewportHeight:innerHeight,viewportWidth:innerWidth}));
   if(dimensions.width>dimensions.viewportWidth+6)throw Error('Horizontal overflow: '+JSON.stringify(dimensions));
   if(viewport.width===960&&dimensions.height>dimensions.viewportHeight+6)throw Error('960x540 film menu overflows vertically: '+JSON.stringify(dimensions));
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
   if(artState.images<130)throw Error('Original artwork map missing balls: '+artState.images);
   await page.waitForFunction(()=>{
    if(typeof ART_IMAGES==='undefined')return false;
    return Array.from({length:130},(_,id)=>ART_IMAGES.get(id)).every(img=>img?.complete&&img.naturalWidth>0);
   },{timeout:20000});
   console.log('PASS 130 original V1 portraits loaded '+viewport.width);

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
   await rootMenu.locator('[data-act="shop"]').first().click();
   if(await rootMenu.locator('.cinema-shopcard').count()!==3)throw Error('Shop must show three film chests');
   await rootMenu.locator('#bvb-fm-screen [data-act="home"]').first().click();
   await rootMenu.locator('[data-act="collection"]').first().click();
   if(!await rootMenu.locator('.cinema-collection-layout').count())throw Error('Missing film collection');
   const shownBalls=await rootMenu.locator('.cinema-ball-tile').count();
   if(shownBalls!==artState.balls)throw Error('Collection hides native balls: '+shownBalls+'/'+artState.balls);
   // Search must not keep showing an unrelated, previously selected ball.
   await rootMenu.locator('[data-ball="1"]').first().click();
   const firstName=await page.evaluate(()=>B[0].n);
   const fullOwnedCount=await rootMenu.locator('.cinema-collection-header b span').textContent();
   await rootMenu.locator('#bvb-fm-search').fill(firstName);
   if(await rootMenu.locator('.cinema-collection-header b span').textContent()!==fullOwnedCount)
    throw Error('Search changed total collection progress instead of filtering only visible tiles');
   const filtered=await page.evaluate(()=>({
    tiles:[...document.querySelectorAll('#bvb-film-menu .cinema-ball-tile')].map(e=>Number(e.dataset.ball)),
    chosen:document.querySelector('#bvb-film-menu .cinema-ball-tile.chosen')?.dataset.ball,
    preview:document.querySelector('#bvb-film-menu .cinema-collection-preview')?.textContent||''
   }));
   if(!filtered.tiles.includes(0)||filtered.chosen!=='0'||!filtered.preview.includes(firstName))
    throw Error('Collection search retained stale preview: '+JSON.stringify(filtered));
   await rootMenu.locator('#bvb-fm-search').fill('___NO_SUCH_BALL___');
   if(await rootMenu.locator('.cinema-ball-tile').count()!==0||await rootMenu.locator('.cinema-collection-preview').count()!==0)
    throw Error('Empty collection search must not display unrelated ball');
   await rootMenu.locator('#bvb-fm-search').fill('');
   if(await rootMenu.locator('.cinema-ball-tile').count()!==artState.balls)
    throw Error('Clearing search did not restore all balls');
   await page.waitForTimeout(300);
   await page.screenshot({path:'tests/v7-menu-collection-'+viewport.width+'.png',fullPage:true});
   const actualPortraits=await rootMenu.locator('.cinema-ball-tile img.cinema-portrait').count();
   if(actualPortraits<2)throw Error('Collection uses no original ball artwork: '+actualPortraits);

   if(!await rootMenu.locator('[data-evolution="1"]').count())throw Error('Missing evolution controls');
   await rootMenu.locator('[data-ball="0"]').first().click();
   await rootMenu.locator('[data-evolution="2"]').click();
   await page.waitForFunction(()=>{const img=document.querySelector('#bvb-film-menu .cinema-collection-preview img.cinema-portrait');return img?.complete&&img.naturalWidth>0&&img.src.includes('/assets/approved-first16/ball-00-v2.webp')},{timeout:10000});
   await rootMenu.locator('[data-evolution="3"]').click();
   if(!await rootMenu.locator('[data-evolution="3"].selected').count())throw Error('Evolution control failed');
   await page.waitForFunction(()=>{const img=document.querySelector('#bvb-film-menu .cinema-collection-preview img.cinema-portrait');return img?.complete&&img.naturalWidth>0&&img.src.includes('/assets/approved-first16/ball-00-v3.webp')},{timeout:10000});
   // Verify all 32 approved evolution portraits (16 balls x V2/V3),
   // not just the first ball. The other variants must not be fabricated.
   const missingApproved=await page.evaluate(async()=>{
    const missing=[];
    const menu=document.querySelector('#bvb-film-menu');
    for(let id=0;id<16;id++){
     menu.querySelector('[data-ball="'+id+'"]')?.click();
     for(const evolution of [2,3]){
      menu.querySelector('[data-evolution="'+evolution+'"]')?.click();
      const img=menu.querySelector('.cinema-collection-preview img.cinema-portrait');
      if(!img){missing.push(id+':V'+evolution+':no-img');continue}
      try{await img.decode()}catch(_){missing.push(id+':V'+evolution+':broken')}
     }
    }
    return missing;
   });
   if(missingApproved.length)throw Error('Missing approved evolution portraits: '+missingApproved.join(', '));
   console.log('PASS approved V2/V3 portraits '+viewport.width);

   await rootMenu.locator('#bvb-fm-screen [data-act="home"]').first().click();
   await page.evaluate(()=>{if(typeof S==='undefined'||typeof save!=='function')throw Error('Native save unavailable');S.coins=5000;save();});
   await rootMenu.locator('[data-act="crates"]').first().click();
   // Wallet inside the shop must track external native rewards without reopening it.
   await page.evaluate(()=>{S.coins=5010;save()});
   await page.waitForFunction(()=>Number((document.querySelector('#bvb-fm-wallet')?.textContent||'').replace(/\s/g,''))===5010,{timeout:5000});
   await page.evaluate(()=>{S.coins=0;save()});
   const beforeInsufficient=await page.evaluate(()=>({coins:S.coins,owned:[...S.own]}));
   await rootMenu.locator('[data-act="purchase-normal"]').click();
   if(!await rootMenu.getByText('Za mało monet').count())throw Error('Missing insufficient-funds response');
   const afterInsufficient=await page.evaluate(()=>({coins:S.coins,owned:[...S.own]}));
   if(JSON.stringify(beforeInsufficient)!==JSON.stringify(afterInsufficient))
    throw Error('Insufficient funds mutated native save');
   await rootMenu.locator('#bvb-fm-screen [data-act="home"]').first().click();
   await page.evaluate(()=>{S.coins=5000;save()});
   await rootMenu.locator('[data-act="crates"]').first().click();
   const before=await page.evaluate(()=>({coins:S.coins,owned:S.own.length}));
   await rootMenu.locator('[data-act="purchase-normal"]').click();
   await rootMenu.locator('.cinema-reel-ball.winner').waitFor({state:'attached',timeout:10000});
   const winnerName=await rootMenu.locator('.cinema-reel-ball.winner small').textContent();
   if(await rootMenu.locator('.cinema-reel-ball img.cinema-portrait').count()<10)throw Error('Roulette missing real game artwork');
   await rootMenu.locator('.cinema-outcome').waitFor({state:'visible',timeout:15000});
   if(await rootMenu.locator('.cinema-chest').isVisible())throw Error('Opening chest should transition away before roulette result');
   if(!await rootMenu.locator('.cinema-reel-window').isVisible())throw Error('Roulette reel hidden after chest opens');
   const result=await rootMenu.locator('.cinema-outcome').textContent();
   const reelOffset=await page.evaluate(()=>{
    const marker=document.querySelector('#bvb-film-menu .cinema-marker').getBoundingClientRect();
    const winner=document.querySelector('#bvb-film-menu .cinema-reel-ball.winner').getBoundingClientRect();
    return Math.abs(marker.left+marker.width/2-winner.left-winner.width/2);
   });
   if(reelOffset>3)throw Error('Roulette marker misses saved winner by '+reelOffset.toFixed(2)+'px');
   // Responsive orientation/reflow must never change the awarded ball under
   // the fixed marker once the animation has finished.
   if(viewport.width===1280){
    for(const size of [{width:1000,height:650},viewport]){
     await page.setViewportSize(size);
     await page.waitForTimeout(180);
     const drift=await page.evaluate(()=>{
      const marker=document.querySelector('#bvb-film-menu .cinema-marker').getBoundingClientRect();
      const winner=document.querySelector('#bvb-film-menu .cinema-reel-ball.winner').getBoundingClientRect();
      return Math.abs(marker.left+marker.width/2-winner.left-winner.width/2);
     });
     if(drift>3)throw Error('Roulette marker drift after resize '+JSON.stringify(size)+': '+drift.toFixed(2)+'px');
    }
   }
   if(!result.includes(winnerName))throw Error('Visual winner and awarded result disagree');
   const after=await page.evaluate(()=>({coins:S.coins,owned:S.own.length,persisted:JSON.parse(localStorage.getItem(K)||'null')?.coins}));
   if(after.coins!==after.persisted||after.coins>before.coins-60||after.owned<before.owned)throw Error('Chest transaction did not persist: '+JSON.stringify({before,after}));
   await page.screenshot({path:'tests/v7-menu-reel-'+viewport.width+'.png',fullPage:true});
   console.log('PASS native chest transaction '+viewport.width+' '+winnerName+' '+JSON.stringify({before,after}));
   for(const chest of ['epic','legend']){
    await rootMenu.locator('#bvb-fm-screen [data-act="home"]').first().click();
    await rootMenu.locator('[data-act="crates"]').first().click();
    const previous=await page.evaluate(()=>({coins:S.coins,owned:S.own.length}));
    await rootMenu.locator('[data-act="purchase-'+chest+'"]').click();
    await rootMenu.locator('.cinema-reel-ball.winner').waitFor({state:'attached',timeout:10000});
    const prize=await rootMenu.locator('.cinema-reel-ball.winner small').textContent();
    await rootMenu.locator('.cinema-outcome').waitFor({state:'visible',timeout:15000});
    const outcome=await rootMenu.locator('.cinema-outcome').textContent();
    if(!outcome.includes(prize))throw Error(chest+' prize and reel mismatch');
    const chestOffset=await page.evaluate(()=>{
     const marker=document.querySelector('#bvb-film-menu .cinema-marker').getBoundingClientRect();
     const winner=document.querySelector('#bvb-film-menu .cinema-reel-ball.winner').getBoundingClientRect();
     return Math.abs(marker.left+marker.width/2-winner.left-winner.width/2);
    });
    if(chestOffset>3)throw Error(chest+' roulette marker misses saved winner by '+chestOffset.toFixed(2)+'px');
    const persisted=await page.evaluate(()=>({coins:S.coins,owned:S.own.length,stored:JSON.parse(localStorage.getItem(K)||'null')?.coins}));
    const cost=chest==='epic'?300:750;
    if(persisted.coins!==persisted.stored||persisted.coins>previous.coins-cost+40||persisted.owned<previous.owned)
     throw Error(chest+' transaction not persisted: '+JSON.stringify({previous,persisted}));
    console.log('PASS '+chest+' chest '+viewport.width+' '+prize);
   }

   // One real browser reload verifies that the native save survives a new page,
   // rather than merely updating the in-memory S object or localStorage once.
   if(viewport.width===1280){
    const saved=await page.evaluate(()=>({coins:S.coins,owned:[...S.own].sort((a,b)=>a-b)}));
    await page.reload({waitUntil:'domcontentloaded',timeout:180000});
    await page.locator('#bvb-loading-screen').waitFor({state:'detached',timeout:150000});
    const skipAgain=page.locator('#bvb-v7-skip');
    if(await skipAgain.count()&&await skipAgain.isVisible())await skipAgain.click();
    const guestAgain=page.locator('#accountGate button').filter({hasText:'Graj bez konta'});
    if(await guestAgain.count()&&await guestAgain.isVisible())await guestAgain.click();
    await rootMenu.waitFor({state:'visible',timeout:30000});
    const restored=await page.evaluate(()=>({coins:S.coins,owned:[...S.own].sort((a,b)=>a-b)}));
    if(JSON.stringify(saved)!==JSON.stringify(restored))throw Error('Native chest save lost after reload: '+JSON.stringify({saved,restored}));
    console.log('PASS chest rewards persist after full browser reload '+viewport.width);
   }
   const backToHome=rootMenu.locator('#bvb-fm-screen [data-act="home"]').first();
   if(await backToHome.count()&&await backToHome.isVisible())await backToHome.click();
   await rootMenu.locator('[data-act="training"]').first().click();
   try{await page.locator('#game').waitFor({state:'visible',timeout:5000});}
   catch(_){
    const diagnostic=await page.evaluate(()=>{
     const el=id=>{const e=document.getElementById(id);return e?{hidden:e.hidden,display:getComputedStyle(e).display,parent:e.parentElement?.id}:null};
     return {startMatch:typeof window.startMatch,game:el('game'),menu:el('menu'),film:el('bvb-film-menu'),native:el('bvb3Home'),G:typeof G!=='undefined'?{m:G?.m,ph:G?.ph}:null,screen:document.getElementById('bvb-fm-screen')?.textContent?.slice(0,160)};
    });
    throw Error('Training not visible: '+JSON.stringify(diagnostic));
   }
   const match=await page.evaluate(()=>({mode:typeof G!=='undefined'?G?.m:null,phase:typeof G!=='undefined'?G?.ph:null}));
   if(match.mode!==4)throw Error('Training did not start real native match: '+JSON.stringify(match));
   console.log('PASS real training match '+viewport.width+' '+JSON.stringify(match));
   await page.evaluate(()=>{if(typeof menu==='function')menu();window.BVBMenu?.open?.('home')});
   await rootMenu.waitFor({state:'visible',timeout:10000});
   await rootMenu.locator('[data-act="ranking"]').first().click();
   await page.locator('#pn').waitFor({state:'visible',timeout:10000});
   const achievements=await page.locator('#pb').textContent();
   if(!/osiągnię|achievement|wyzwan/i.test(achievements||''))throw Error('Achievements did not open native panel');
   console.log('PASS real achievements panel '+viewport.width);



   await page.screenshot({path:'tests/v7-menu-'+viewport.width+'.png',fullPage:true});
   if(errors.length)throw Error('Browser JS errors: '+errors.slice(0,3).join('; '));
   console.log('PASS menu navigation '+viewport.width);
   await page.close();
  }
 }finally{await browser.close();server.close()}
})().catch(err=>{console.error(err.stack);process.exitCode=1});
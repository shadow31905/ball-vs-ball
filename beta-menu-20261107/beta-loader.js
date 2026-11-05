/* Test edition only: load actual rework chunks, not the old index-safe.html engine. */
(() => {
 'use strict';
 const files=Array.from({length:32},(_,i)=>'../rework/game-'+i+'.txt');
 const progress=document.getElementById('bvb-loading-fill');
 const label=document.getElementById('bvb-loading-label');
 const bar=document.querySelector('#bvb-loading-screen [role="progressbar"]');
 const actions=document.getElementById('bvb-load-actions');
 let failed=false;
 const setProgress=n=>{if(failed)return;if(label)label.textContent='Ładowanie aktualnych walk · '+n+'%';if(progress)progress.style.width=n+'%';if(bar)bar.setAttribute('aria-valuenow',String(n));};
 function fail(err){failed=true;console.error('BVB beta: rework nie został uruchomiony',err);if(label)label.textContent='Nie udało się uruchomić aktualnych walk.';
  if(actions&&!document.getElementById('bvb-beta-retry')){const b=document.createElement('button');b.id='bvb-beta-retry';b.textContent='Spróbuj jeszcze raz';b.onclick=()=>location.reload();actions.prepend(b);}
 }
 async function load(){const parts=new Array(files.length);let cursor=0,loaded=0;
  async function worker(){for(;;){const i=cursor++;if(i>=files.length)break;const response=await fetch(files[i]+'?v=wielki-rework-preview-2',{cache:'force-cache'});if(!response.ok)throw Error(files[i]+': HTTP '+response.status);parts[i]=await response.text();loaded++;setProgress(Math.min(90,Math.floor(90*loaded/files.length)));}}
  await Promise.all(Array.from({length:4},()=>worker()));
  if(!parts[0]||!/<head(?:\s|>)/i.test(parts[0])||!/<body(?:\s|>)/i.test(parts[0]))throw Error('Nieprawidłowy początek pełnej gry');
  let last=files.length-1;
  const pos=parts[last].toLowerCase().lastIndexOf('</body>');if(pos<0)throw Error('Nie znaleziono końca dokumentu gry');
  const splash=document.getElementById('bvb-loading-screen');const css=document.getElementById('bvb-loading-css');
  const layer=(css?css.outerHTML:'')+(splash?splash.outerHTML:'');
  parts[0]=parts[0].replace(/<head([^>]*)>/i,(_,attrs)=>'<head'+attrs+'><base href="../"><style>#bvb-halloween-countdown{display:none!important}</style>')
    .replace(/<body([^>]*)>/i,m=>m+layer);
  const scripts='<script src="./beta-menu-20261107/skin.js?v=20261105-nowe-menu-bez-iframe-v3"></script>'+ 
    '<script src="./beta-menu-20261107/music-v2.js?v=20261105-music-v1"></script>'+ 
    '<script src="./bvb-ready.js?v=20261105-rework-beta-v1"></script>';
  parts[last]=parts[last].slice(0,pos)+scripts+parts[last].slice(pos);
  document.open();for(let i=0;i<parts.length;i++){document.write(parts[i]);parts[i]=null;}document.close();
 }
 load().catch(fail);
})();
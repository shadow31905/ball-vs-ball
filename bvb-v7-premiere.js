/* BVB 2.5 V7 — scenes 1–12 premiere with full audio, 2026-11-07 15:59:30 PL. */
(()=>{
'use strict';
const START=Date.parse('2026-11-07T15:59:30+01:00');
const EXPIRY=Date.parse('2026-11-08T16:06:45+01:00');
const FILM="https://d2jqrm6oza8nb6.cloudfront.net/datasets/c27085ad-bce8-409b-ab09-9df502898bb2.mp4?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiM2MxNjIxMDU0NWViNzUwNSIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5NDE1MDQwNX0.4gnyFqc53wOWfv6p4SNHOWNK5Lkut-EcyPdiIkJNS2s";
const FLAG='bvb-v7-premiere-played-20261107';
function mount(){
 if(Date.now()<START||Date.now()>EXPIRY||sessionStorage.getItem(FLAG)||document.getElementById('bvb-v7-premiere'))return;
 const overlay=document.createElement('section');
 overlay.id='bvb-v7-premiere';
 overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label','Premiera Ball VS Ball 2.5');
 overlay.innerHTML='<div class="bvb-v7-wrap"><h1>BALL VS BALL 2.5</h1><p class="bvb-v7-heading">UPADEK STAREJ ERY · PREMIERA 12 SCEN</p><video id="bvb-v7-video" playsinline preload="metadata" controls disablepictureinpicture></video><p class="bvb-v7-status" role="status">Film jest przygotowany. Kliknij odtwarzanie z dźwiękiem.</p><div class="bvb-v7-buttons"><button id="bvb-v7-play" type="button">▶ Odtwórz z muzyką</button><button id="bvb-v7-skip" type="button">Przejdź do gry</button></div></div>';
 const css=document.createElement('style');
 css.id='bvb-v7-premiere-css';
 css.textContent='#bvb-v7-premiere{position:fixed;inset:0;z-index:2147483646;background:radial-gradient(ellipse at center,#24234a 0%,#060810 70%);color:#fff;display:grid;place-items:center;padding:16px;box-sizing:border-box;font-family:system-ui,sans-serif;overflow:auto}#bvb-v7-premiere .bvb-v7-wrap{width:min(1100px,100%);text-align:center}#bvb-v7-premiere h1{margin:0;font-size:clamp(24px,5vw,46px);letter-spacing:.08em;color:#f8d48a}#bvb-v7-premiere .bvb-v7-heading{margin:7px 0 13px;font-weight:700}#bvb-v7-video{display:block;background:#000;width:100%;aspect-ratio:16/9;max-height:70vh;object-fit:contain;border:1px solid #896a4c;border-radius:8px}#bvb-v7-premiere .bvb-v7-status{min-height:24px;font-size:14px;color:#c6d5ef}#bvb-v7-premiere .bvb-v7-buttons{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}#bvb-v7-premiere button{cursor:pointer;font-size:16px;font-weight:750;padding:12px 18px;border-radius:8px;color:#fff;background:#254e7c;border:1px solid #75c4fb}#bvb-v7-premiere #bvb-v7-play{background:#8d4b19;border-color:#ffce8a}';
 document.head.append(css);
 document.body.append(overlay);
 const video=overlay.querySelector('#bvb-v7-video');
 const play=overlay.querySelector('#bvb-v7-play');
 const skip=overlay.querySelector('#bvb-v7-skip');
 const status=overlay.querySelector('.bvb-v7-status');
 video.src=FILM;video.muted=false;video.volume=1;
 function close(){video.pause();video.removeAttribute('src');video.load();sessionStorage.setItem(FLAG,'1');overlay.remove();css.remove()}
 play.addEventListener('click',async()=>{
  status.textContent='Włączanie filmu i dźwięku…';
  video.muted=false;video.volume=1;
  try{await video.play();status.textContent='Trwa premiera — muzyka włączona.';play.hidden=true}
  catch(e){status.textContent='Odtwarzanie zostało zablokowane. Użyj ▶ w odtwarzaczu lub spróbuj ponownie.'}
 });
 skip.addEventListener('click',close);
 video.addEventListener('ended',close);
 video.addEventListener('error',()=>{status.textContent='Nie udało się załadować filmu. Możesz przejść do gry.';play.disabled=true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();

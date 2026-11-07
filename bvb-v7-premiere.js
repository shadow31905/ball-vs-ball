/* BVB 2.5 V7 — scenes 1–12 premiere with full audio, 2026-11-07 15:59:30 PL. */
(()=>{
'use strict';
const START=Date.parse('2026-11-07T16:15:00+01:00');
const EXPIRY=Date.parse('2026-11-07T18:00:00+01:00');
const FILM='./rework/v7-scenes-01-12-hq-60fps.mp4';
const FLAG='bvb-v7-premiere-played-20261107-1615';
function mount(){
 if(Date.now()>EXPIRY||sessionStorage.getItem(FLAG)||document.getElementById('bvb-v7-premiere'))return;
 const overlay=document.createElement('section');
 overlay.id='bvb-v7-premiere';
 overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label','Premiera Ball VS Ball 2.5');
 overlay.innerHTML='<div class="bvb-v7-wrap"><h1>BALL VS BALL 2.5</h1><p class="bvb-v7-heading">UPADEK STAREJ ERY · PREMIERA 12 SCEN</p><p id="bvb-v7-clock" style="font-weight:900;color:#ffdb9b;font-size:clamp(22px,4vw,34px);margin:7px">PREMIERA O 16:15</p><video id="bvb-v7-video" playsinline preload="metadata" controls disablepictureinpicture></video><p class="bvb-v7-status" role="status">Film jest przygotowany. Film rozpocznie się o 16:15. Wcześniej kliknij przygotowanie dźwięku.</p><div class="bvb-v7-buttons"><button id="bvb-v7-play" type="button">🔊 Przygotuj dźwięk</button><button id="bvb-v7-skip" type="button">Przejdź do gry</button></div></div>';
 const css=document.createElement('style');
 css.id='bvb-v7-premiere-css';
 css.textContent='#bvb-v7-premiere{position:fixed;inset:0;z-index:2147483646;background:radial-gradient(ellipse at center,#24234a 0%,#060810 70%);color:#fff;display:grid;place-items:center;padding:16px;box-sizing:border-box;font-family:system-ui,sans-serif;overflow:auto}#bvb-v7-premiere .bvb-v7-wrap{width:min(1100px,100%);text-align:center}#bvb-v7-premiere h1{margin:0;font-size:clamp(24px,5vw,46px);letter-spacing:.08em;color:#f8d48a}#bvb-v7-premiere .bvb-v7-heading{margin:7px 0 13px;font-weight:700}#bvb-v7-video{display:block;background:#000;width:100%;aspect-ratio:16/9;max-height:70vh;object-fit:contain;border:1px solid #896a4c;border-radius:8px}#bvb-v7-premiere .bvb-v7-status{min-height:24px;font-size:14px;color:#c6d5ef}#bvb-v7-premiere .bvb-v7-buttons{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}#bvb-v7-premiere button{cursor:pointer;font-size:16px;font-weight:750;padding:12px 18px;border-radius:8px;color:#fff;background:#254e7c;border:1px solid #75c4fb}#bvb-v7-premiere #bvb-v7-play{background:#8d4b19;border-color:#ffce8a}';
 document.head.append(css);
 document.body.append(overlay);
 const video=overlay.querySelector('#bvb-v7-video');
 const play=overlay.querySelector('#bvb-v7-play');
 const skip=overlay.querySelector('#bvb-v7-skip');
 const status=overlay.querySelector('.bvb-v7-status');
 video.src=FILM;video.preload='auto';video.muted=false;video.volume=1;video.controls=false;video.load();
 function close(){if(timer)clearInterval(timer);video.pause();video.removeAttribute('src');video.load();sessionStorage.setItem(FLAG,'1');overlay.remove();css.remove()}

 const clock=overlay.querySelector('#bvb-v7-clock');
 let started=false,armed=false,timer=null;
 function successfulPlay(){
  if(video.paused)return;
  video.controls=true;
  clock.textContent='FILM TRWA';
  status.textContent='Film odtwarzany z muzyką.';
  play.hidden=true;
 }
 async function begin(){
  if(started)return;
  started=true;
  clock.textContent='PREMIERA — 16:15';
  play.textContent='▶ Odtwórz z muzyką';
  play.disabled=false;
  video.controls=true;video.muted=false;video.volume=1;
  try{await video.play();successfulPlay()}
  catch(_){status.textContent='Przeglądarka zablokowała autoplay. Kliknij Odtwórz z muzyką.'}
 }
 function tick(){
  const rem=START-Date.now();
  if(rem<=0){void begin();return}
  const n=Math.ceil(rem/1000);
  clock.textContent='START ZA '+Math.floor(n/60)+':'+String(n%60).padStart(2,'0')+' — 16:15';
 }
 play.addEventListener('click',async()=>{
  if(Date.now()>=START){
   video.muted=false;video.volume=1;video.controls=true;
   try{await video.play();successfulPlay()}
   catch(_){status.textContent='Kliknij ▶ bezpośrednio w odtwarzaczu.'}
   return;
  }
  // User gesture primes audio permissions before the scheduled playback.
  video.muted=false;video.volume=.001;
  try{
   await video.play();video.pause();video.currentTime=0;video.volume=1;
   armed=true;play.disabled=true;play.textContent='✓ Dźwięk przygotowany';
   status.textContent='Gotowe. Film spróbuje wystartować z muzyką dokładnie o 16:15.';
  }catch(_){
   video.pause();video.volume=1;
   status.textContent='Twoja przeglądarka może wymagać kliknięcia ▶ o 16:15.';
  }
 });
 video.addEventListener('playing',()=>{if(Date.now()>=START)successfulPlay()});
 document.addEventListener('visibilitychange',tick);
 timer=setInterval(tick,250);
 tick();
 skip.addEventListener('click',close);
 video.addEventListener('ended',close);
 video.addEventListener('error',()=>{status.textContent='Nie udało się załadować filmu. Możesz przejść do gry.';play.disabled=true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();

/* Ball VS Ball 2.5 — testowe odwzorowanie sceny 11 filmu V7; NIE jest to wydanie produkcyjne. */
(()=>{'use strict';
const TARGET='2026-11-07T16:00:00+01:00';
const CHESTS_AT='2026-11-07T16:02:00+01:00';
const END=Date.parse(TARGET),UNLOCK=Date.parse(CHESTS_AT);
const art={normal:'./assets/v7-chest-normal.webp',epic:'./assets/v7-chest-epic.webp',legend:'./assets/v7-chest-legend.webp'};
const pageId='bvb-film-menu';
const $=s=>document.querySelector(s);
const safe=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const availableAt=ms=>Number(ms)>=UNLOCK;
const endingAt=ms=>Number(ms)>=END;
// In production use the origin HTTP Date header as clock source; never use query parameters to unlock chests.
let serverEpoch=null,monotonicEpoch=null;
function now(){
 if((!location.hostname||/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) && Number.isFinite(window.__BVB_QA_NOW))return window.__BVB_QA_NOW;
 return serverEpoch==null?Date.now():serverEpoch+(performance.now()-monotonicEpoch);
}
async function syncTime(){
 try{
  const start=performance.now(),response=await fetch(location.href,{method:'HEAD',cache:'no-store',credentials:'same-origin'});
  const date=response.headers.get('Date');const t=date?Date.parse(date):NaN;
  if(response.ok&&Number.isFinite(t)){serverEpoch=t+(performance.now()-start)/2;monotonicEpoch=performance.now();}
 }catch(_){}
}
const btn=(a,label,cl='')=>`<button type="button" class="${cl}" data-act="${a}">${label}</button>`;
function init(){
 const root=$('#menu');if(!root){setTimeout(init,300);return}
 if(document.getElementById(pageId))return;
 const native=$('#bvb3Home');
 const style=document.createElement('style');style.id='bvb-film-menu-css';style.textContent=`
 #menu:has(#${pageId}:not([hidden])) > :not(#${pageId}){display:none!important}
 #app:has(#${pageId}:not([hidden])){max-width:1500px!important;width:100%!important;padding:6px!important;box-sizing:border-box}
 #${pageId}{--ink:#fff4e5;--gold:#dba64c;--edge:#365375;--blue:#0b1a37;font:500 14px/1.3 system-ui,Arial,sans-serif;text-align:left;color:var(--ink);position:relative;isolation:isolate;box-sizing:border-box;overflow:hidden;min-height:730px;width:100%;border:1px solid #2c3a65;border-radius:12px;background:radial-gradient(ellipse at 45% 33%,#23162c 0%,transparent 53%),linear-gradient(170deg,#080814,#0a0a19 45%,#090714);box-shadow:inset 0 0 30px #2422473b,0 10px 35px #0009}
 #${pageId} *,#${pageId} *:before,#${pageId} *:after{box-sizing:border-box}
 #${pageId}[hidden],#${pageId} [hidden]{display:none!important}
 #${pageId}:before{content:'';position:absolute;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(circle at 25% 17%,#c3866288 0 1px,transparent 2px),radial-gradient(circle at 66% 61%,#9470e0c9 0 1px,transparent 2px),radial-gradient(circle at 53% 8%,#e8b56c99 0 1px,transparent 3px);background-size:121px 87px,101px 140px,187px 119px;opacity:.65;animation:bvbStars 19s linear infinite}
 #${pageId} button{font-family:inherit;cursor:pointer;transition:transform .18s,filter .18s,border-color .18s,background .18s}
 #${pageId} button:hover:not(:disabled){filter:brightness(1.18);transform:translateY(-2px)}
 #${pageId} button:active:not(:disabled){transform:translateY(1px) scale(.98)}
 #${pageId} button:focus-visible,#${pageId} input:focus-visible{outline:3px solid #fcd78b;outline-offset:2px}
 #${pageId} .head{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:13px 16px;border:1px solid #314c71;border-radius:9px;background:linear-gradient(#0c1828cc,#06101ecf);box-shadow:0 0 13px #1c496a4b;margin:11px 13px 0;font-size:.78rem;min-height:51px}
 #${pageId} .identity{display:flex;align-items:center;gap:12px;min-width:0;white-space:nowrap}#${pageId} .username{font-weight:800;color:#eee5ed;max-width:175px;overflow:hidden;text-overflow:ellipsis}
 #${pageId} .xpbar{width:138px;height:9px;border-radius:9px;background:#152238;box-shadow:inset 0 0 3px #0009;overflow:hidden}
 #${pageId} .xpbar i{display:block;width:38%;height:100%;border-radius:9px;background:linear-gradient(90deg,#117abb,#66d6ee)}
 #${pageId} .topright{display:flex;align-items:center;gap:13px}#${pageId} .money{color:#e9bc64;font-weight:800;font-size:1.05rem}#${pageId} .coin{display:inline-grid;place-items:center;background:radial-gradient(circle at 34% 23%,#ffe190,#c28b1b 65%,#6b3f0e);color:#8f6100;border-radius:50%;height:22px;width:22px;box-shadow:0 0 7px #ffd36550;margin-right:5px}
 #${pageId} .plain{border:0;background:none;color:#d4dae8;font-size:.73rem;padding:6px 4px;text-transform:uppercase;letter-spacing:.05em}
 #${pageId} .title{text-align:center;padding:10px 8px 3px}#${pageId} .title h1{font-family:system-ui,sans-serif;font-weight:1000;letter-spacing:.045em;font-size:clamp(2.0rem,4vw,3.3rem);line-height:1.06;margin:0;color:#ebbc68;text-shadow:0 2px 0 #654219,0 0 12px #d2ab6877;background:none;-webkit-text-fill-color:initial}
 #${pageId} .title p{color:#d4c0d5;font-size:.82rem;margin:7px 0 0;letter-spacing:.07em}
 #${pageId} .columns{display:grid;grid-template-columns:minmax(166px,19%) minmax(290px,1fr) minmax(212px,23%);gap:15px;padding:10px 16px 2px;align-items:stretch;min-height:505px}
 #${pageId} .box{border:1px solid #466187;border-radius:13px;background:linear-gradient(165deg,#11192beb,#081125df);box-shadow:inset 0 0 14px #2a6fa322,0 0 8px #0008;padding:13px}
 #${pageId} .box h2{font-size:1.07rem;color:#e7c27c;margin:0 0 10px;font-weight:900}
 #${pageId} .leftnav{display:flex;flex-direction:column;gap:8px}#${pageId} .leftnav button{width:100%;border:1px solid #3c648e;background:linear-gradient(180deg,#1e3657,#101f35);border-radius:9px;color:#d6dded;padding:10px 8px;text-align:center;font-weight:780;box-shadow:0 2px 4px #0008}
 #${pageId} .leftnav button[data-act=home]{border-color:#438bc0;background:linear-gradient(#1c6ba7,#153250);color:white}
 #${pageId} .center{min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative}
 #${pageId} .fighters{display:flex;justify-content:center;align-items:center;width:100%;gap:3%;min-height:265px;padding:12px 0}
 #${pageId} .fighter{max-width:33%;width:29%;min-width:0;height:200px;object-fit:contain;filter:drop-shadow(0 5px 8px #000b) drop-shadow(0 0 11px #ad5e4455);animation:bvbFloat 3s ease-in-out infinite alternate}
 #${pageId} .fighter:nth-child(2){animation-delay:-1s}#${pageId} .fighter:nth-child(3){animation-delay:-2s}
 #${pageId} .play{width:min(92%,490px);font-weight:1000;letter-spacing:.03em;font-size:clamp(1.6rem,3vw,2.5rem);color:#27190f;border:1px solid #f8d190;border-radius:10px;background:linear-gradient(#e1a536,#c77c16);box-shadow:inset 0 1px 0 #ffe6ad91,0 4px 0 #5a350e,0 0 18px #dc913c44;padding:14px}
 #${pageId} .right{display:flex;flex-direction:column;gap:13px;min-width:0}
 #${pageId} .news-name{font-size:.86rem;color:#d6d3e9}#${pageId} .news-date{font-size:.78rem;color:#bfb5cb;margin:7px 0}#${pageId} .endline{text-align:center;font-size:.75rem;color:#d4ac68;margin:13px 0 4px}
 #${pageId} .count{text-align:center;color:#efb85c;font-size:2rem;line-height:1.1;font-weight:1000;font-variant-numeric:tabular-nums;text-shadow:0 0 7px #b17c2190}
 #${pageId} .chests{display:flex;justify-content:center;gap:6px;align-items:end}#${pageId} .chest{flex:1;min-width:0;background:transparent;border:1px solid transparent;border-radius:8px;color:#c9ccdc;font-size:.72rem;padding:4px 0 3px;display:grid;justify-items:center;gap:4px}
 #${pageId} .chest img{width:75px;max-width:100%;height:79px;object-fit:contain;filter:drop-shadow(0 2px 6px #0007)}
 #${pageId} .chest:hover{border-color:#5c84b5}
 #${pageId} .unlocks{color:#92b9d9;text-align:center;margin:7px 0 0;font-size:.69rem}
 #${pageId} .bottom{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:9px;padding:12px 16px 6px}#${pageId} .bottom button{border:1px solid #465d87;color:#d8dff0;background:linear-gradient(#1b2f4c,#0b1a30);border-radius:8px;padding:10px 3px;min-height:48px;font-weight:800;font-size:.83rem;white-space:nowrap}
 #${pageId} .foot{text-align:center;color:#8a8fa3;font-size:.68rem;padding:8px 0 15px}
 #${pageId} .screen{position:absolute;inset:0;z-index:5;background:linear-gradient(145deg,#060c1bf6,#111027f6);padding:26px 25px;overflow:auto;animation:bvbIn .2s ease-out}
 #${pageId} .screen h2{font-size:1.75rem;color:#e7bd75;margin:4px 0 12px}
 #${pageId} .screen .back{border:1px solid #657a9e;border-radius:9px;background:linear-gradient(#29446d,#102340);color:white;padding:10px 20px;margin:0 0 12px}
 #${pageId} .screen .pane{border:1px solid #526586;border-radius:12px;background:#101b35ef;padding:13px;line-height:1.6;margin:10px 0;color:#e2eafa}
 #${pageId} .screen .tilegrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:10px;margin:17px 0}
 #${pageId} .screen .tile{border:1px solid #3b6593;border-radius:11px;background:linear-gradient(#173b64,#0c1c3e);color:#e9f2ff;padding:15px 8px;min-height:93px;font-weight:850}
 #${pageId} .screen .tile small{display:block;margin-top:6px;font-size:.7rem;color:#bacde3}
 #${pageId} .screen .shopcard{border:1px solid #596994;background:#101a34;border-radius:12px;padding:14px;text-align:center;max-width:245px}
 #${pageId} .screen .shopcard img{height:108px;max-width:100%;object-fit:contain;display:block;margin:0 auto 8px}
 #${pageId} .screen .shopcard button{border:1px solid #a17c5c;border-radius:8px;padding:9px 12px;background:#25456a;color:#fff;font-weight:850;width:100%;margin-top:10px}
 #${pageId} .screen .shopcard button:disabled{opacity:.48;cursor:not-allowed}
 #${pageId} .screen .gift{font-size:1.05rem;text-align:center;border:1px solid #b9913e;border-radius:12px;background:#18223b;padding:14px;max-width:560px;margin:15px auto}
 #${pageId} .screen input{border:1px solid #6580a2;background:#0c1931;color:white;padding:10px;border-radius:9px;max-width:100%;width:350px}
 #${pageId} .screen .balls{display:grid;grid-template-columns:repeat(auto-fit,minmax(138px,1fr));gap:8px;margin-top:16px}
 #${pageId} .screen .ball{border:1px solid #53658b;background:#122141;border-radius:10px;color:#eef4ff;min-height:75px;padding:8px}
 #${pageId} .screen .ball.locked{opacity:.55;filter:grayscale(.6)}
 @keyframes bvbFloat{from{transform:translateY(4px) rotate(-2deg)}to{transform:translateY(-7px) rotate(2deg)}}
 @keyframes bvbStars{from{background-position:0 0,0 0,0 0}to{background-position:120px 90px,-70px 130px,140px -140px}}
 @keyframes bvbIn{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}
 @media(max-width:1020px){#${pageId}{min-height:610px}#${pageId} .columns{grid-template-columns:minmax(113px,19%) minmax(188px,1fr) minmax(140px,23%);gap:7px;padding:9px}#${pageId} .box{padding:9px}#${pageId} .fighters{min-height:180px}#${pageId} .fighter{height:160px}#${pageId} .leftnav{gap:5px}#${pageId} .leftnav button{padding:8px 3px;font-size:.81rem}#${pageId} .right .chest img{height:55px}#${pageId} .bottom{gap:4px;padding:7px}#${pageId} .bottom button{font-size:.71rem;padding:7px 2px}}
 @media(max-width:600px){#${pageId}{min-height:730px}#${pageId} .head{margin:5px 5px 0;padding:9px 7px;gap:8px;font-size:.64rem}#${pageId} .identity{gap:5px}#${pageId} .xpbar{width:64px;height:7px}#${pageId} .topright{gap:3px}#${pageId} .money{font-size:.77rem}#${pageId} .coin{width:15px;height:15px}#${pageId} .title h1{font-size:1.75rem}#${pageId} .title p{font-size:.66rem}#${pageId} .columns{grid-template-columns:minmax(96px,22%) minmax(140px,1fr) minmax(105px,22%);gap:5px;padding:7px 5px;min-height:420px}#${pageId} .box{padding:7px 4px;border-radius:9px}#${pageId} .box h2{font-size:.76rem}#${pageId} .leftnav button{font-size:.63rem;padding:7px 1px;border-radius:6px}#${pageId} .fighters{min-height:185px;gap:0}#${pageId} .fighter{height:110px;width:33%}#${pageId} .center{justify-content:center;gap:9px}#${pageId} .play{width:100%;font-size:1.25rem;padding:8px 5px}#${pageId} .news-name,#${pageId} .news-date{font-size:.60rem}#${pageId} .endline{font-size:.57rem}#${pageId} .count{font-size:1.2rem}#${pageId} .chests{gap:0}#${pageId} .chest{font-size:.53rem}#${pageId} .chest img{height:43px}#${pageId} .unlocks{font-size:.54rem}#${pageId} .bottom{grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;padding:5px}#${pageId} .bottom button{font-size:.66rem;min-height:39px;white-space:normal}#${pageId} .foot{font-size:.54rem}}
 @media(max-width:405px){#${pageId} .columns{grid-template-columns:98px 1fr;min-height:unset}#${pageId} .leftnav button{font-size:.73rem;padding:9px 2px}#${pageId} .right{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr}#${pageId} .center{min-height:270px}#${pageId} .fighters{min-height:152px}#${pageId} .fighter{height:125px}#${pageId} .bottom{grid-template-columns:repeat(3,minmax(0,1fr))}}
 @media(prefers-reduced-motion:reduce){#${pageId} *,#${pageId}:before{animation:none!important;transition:none!important}}
 `;
 style.textContent += `
/* Cinematic menu prototype — isolated to film menu, no game logic changes. */
#${pageId}{min-height:640px!important;background:radial-gradient(ellipse at 50% 0%,#0054a9 0%,transparent 48%),radial-gradient(ellipse at 75% 70%,#9b4309 0%,transparent 46%),linear-gradient(120deg,#020a1b,#081b40 50%,#190c15)!important}
#${pageId} .cinematic-shell{position:relative;min-height:610px;padding:12px 14px 35px;background:linear-gradient(90deg,#00132c55,#0000 40%,#27100444)}
#${pageId} .head{display:flex;justify-content:space-between;align-items:center;margin:0 0 4px!important;padding:0!important;background:transparent!important;border:0!important}
#${pageId} .identity{display:flex;align-items:center;gap:9px}
#${pageId} .avatar{display:grid;place-items:center;border:2px solid #e6a931;border-radius:50%;width:47px;height:47px;background:#171421;font-size:24px;box-shadow:0 0 14px #e8a32b}
#${pageId} .title{text-align:center;margin:-8px auto 22px!important;pointer-events:none}
#${pageId} .title h1{font-size:clamp(2rem,5.4vw,4.3rem)!important;font-weight:1000;font-style:italic;letter-spacing:-.04em;color:#f2f7ff;text-shadow:2px 4px 0 #0a2448,0 0 24px #248fff}
#${pageId} .title h1 em{color:#ffc443;text-shadow:0 0 16px #ec8d16}
#${pageId} .title p{font-size:clamp(1.6rem,4vw,3.2rem)!important;font-weight:1000;font-style:italic;color:#ffbf30;text-shadow:0 4px 0 #6a3104;margin:-12px 0 0}
#${pageId} .film-layout{display:grid;grid-template-columns:clamp(105px,17%,175px) minmax(0,1fr);gap:18px}
#${pageId} .film-nav .leftnav{display:flex;flex-direction:column;gap:8px}
#${pageId} .film-nav button{min-height:43px;text-align:left;border:1px solid #3684be;background:linear-gradient(130deg,#102b53,#030e24);box-shadow:inset 0 0 12px #1379b533;border-radius:9px;color:#edf7ff;font-weight:850;padding:8px!important}
#${pageId} .film-nav button:first-child{background:linear-gradient(#ad7723,#613700);border-color:#f6c65c}
#${pageId} .film-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
#${pageId} .film-card{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;min-height:205px;border:2px solid var(--c);border-radius:17px;color:white;cursor:pointer;background:radial-gradient(ellipse at 50% 30%,var(--glow),transparent 65%),linear-gradient(160deg,#08162e,#020a19);box-shadow:inset 0 0 22px var(--glow),0 0 14px var(--glow);transform:skew(-3deg);transition:transform .2s,filter .2s}
#${pageId} .film-card:hover{transform:skew(-3deg) translateY(-5px);filter:brightness(1.2)}
#${pageId} .film-card.blue{--c:#09baff;--glow:#0877d9a0}#${pageId} .film-card.violet{--c:#a970ff;--glow:#7139c5a0}#${pageId} .film-card.orange{--c:#ff8b28;--glow:#c94c0aa0}
#${pageId} .film-symbol{font-size:clamp(2.5rem,7vw,5.2rem);line-height:1.1;text-shadow:0 0 18px var(--c)}
#${pageId} .film-card strong{font-size:clamp(1.1rem,2.8vw,2.2rem);font-weight:1000;font-style:italic;text-shadow:0 3px 3px #000}
#${pageId} .film-card small{font-size:clamp(.62rem,1.2vw,.86rem);text-align:center;color:#e4edff}
#${pageId} .film-banner{margin-top:15px;border:2px solid #4b83bf;border-radius:13px;overflow:hidden;background:linear-gradient(100deg,#031329,#0c2457,#170b31)}
#${pageId} .film-banner-inner{width:100%;min-height:105px;border:0;background:transparent;color:white;display:flex;align-items:center;gap:12px;padding:12px 17px;text-align:left;cursor:pointer}
#${pageId} .film-banner-copy{display:flex;flex-direction:column;flex:1}#${pageId} .film-banner-copy strong{font-size:clamp(1rem,2.6vw,1.9rem);font-style:italic;font-weight:1000}#${pageId} .film-banner-copy small{color:#cbd8ee}
#${pageId} .new-tag{background:#9c6615;color:#ffe6a2;border:1px solid #ffce67;border-radius:6px;font-weight:900;padding:4px 7px;font-size:.7rem}
#${pageId} .film-chests{font-size:clamp(1.2rem,3.5vw,3rem)}#${pageId} .film-next{font-size:1.5rem}
#${pageId} .foot{text-align:center;margin-top:18px;font-size:.65rem;color:#adbed5}
@media(max-width:650px){#${pageId} .cinematic-shell{padding:8px 5px 18px}#${pageId} .film-layout{grid-template-columns:85px minmax(0,1fr);gap:6px}#${pageId} .film-nav button{font-size:.64rem;min-height:38px;padding:5px!important}#${pageId} .film-cards{gap:4px}#${pageId} .film-card{min-height:155px;border-radius:9px;padding:4px}#${pageId} .film-symbol{font-size:2rem}#${pageId} .film-card strong{font-size:.85rem}#${pageId} .film-card small{font-size:.56rem}#${pageId} .film-banner-inner{padding:6px;gap:4px}#${pageId} .film-chests{font-size:1rem}#${pageId} .new-tag{font-size:.52rem;padding:3px}}
`;
 style.textContent += `
 #${pageId} .film-vector{display:block;width:100%;height:100%;filter:drop-shadow(0 0 9px currentColor)}
 #${pageId} .avatar .film-vector{width:29px;height:29px;color:#ffd45c}
 #${pageId} .coin .film-vector{width:22px;height:22px;color:#ffd45c}
 #${pageId} .film-symbol{display:block;width:clamp(52px,9vw,102px);height:clamp(52px,9vw,102px);margin:0 auto 9px;color:var(--c)}
 #${pageId} .film-chests{display:flex;align-items:center;gap:2px;flex:0 0 43%;justify-content:center}
 #${pageId} .film-chests img{height:clamp(43px,8vw,95px);width:33%;object-fit:contain;filter:drop-shadow(0 0 13px #f5a43d)}
 #${pageId} .film-chests img:nth-child(2){transform:scale(1.2);z-index:1}
 @media(max-width:650px){#${pageId} .film-symbol{width:33px;height:33px;margin-bottom:5px}#${pageId} .film-chests{flex-basis:36%}#${pageId} .film-chests img{height:36px}}
`;
 style.textContent += `
 #${pageId} .cinema-kicker{font-size:11px;letter-spacing:2px;color:#bdad95;text-transform:uppercase}
 #${pageId} .cinema-lead{font-size:14px;color:#a7b6d0;margin:5px 0 12px}
 #${pageId} .cinema-wallet{position:absolute;top:30px;right:22px;border:1px solid #d4a858;border-radius:30px;padding:7px 14px;background:#071426;color:#fff}
 #${pageId} .cinema-shopgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px;margin:22px 0 16px}
 #${pageId} .cinema-shopcard{display:flex;flex-direction:column;align-items:center;gap:7px;min-width:0;border:1px solid #4079b7;border-radius:8px;background:linear-gradient(160deg,#0c1a36,#070d1e);padding:13px 10px 18px;box-shadow:inset 0 0 22px #1c54a127}
 #${pageId} .cinema-shopcard:nth-child(2){border-color:#b262f0;box-shadow:inset 0 0 22px #7b36ad38}
 #${pageId} .cinema-shopcard:nth-child(3){border-color:#d7aa45;box-shadow:inset 0 0 22px #a76e2638}
 #${pageId} .cinema-shopcard img{width:100%;height:clamp(105px,17vw,225px);object-fit:contain;filter:drop-shadow(0 0 14px #568bc45c)}
 #${pageId} .cinema-shopcard strong{font-size:18px;color:white}
 #${pageId} .cinema-shopcard button{border:1px solid #5986c3;border-radius:8px;padding:8px 14px;background:#193454;color:#fff;font-weight:800;font-size:11px}
 #${pageId} .cinema-shopfooter{max-width:350px;text-align:center;margin:auto;padding:9px;border:1px solid #5b7dba;border-radius:20px;font-weight:800}
 #${pageId} .cinema-chest{text-align:center}
 #${pageId} .cinema-chest img{height:150px;max-width:80%;object-fit:contain;filter:drop-shadow(0 0 18px #b266df)}
 #${pageId} .cinema-reel-window{position:relative;overflow:hidden;border:2px solid #5767aa;border-radius:12px;background:#070d22;padding:10px 0;margin:15px auto;max-width:730px}
 #${pageId} .cinema-reel{display:flex;width:max-content;gap:9px;animation:bvbFilmRoll 5.5s cubic-bezier(.08,.63,.12,1) both}
 #${pageId} .cinema-reel-ball{width:94px;height:115px;flex-shrink:0;border:1px solid #6684b3;border-radius:8px;background:linear-gradient(#152a4b,#080d21);display:flex;align-items:center;justify-content:center;flex-direction:column}
 #${pageId} .cinema-reel-ball span{font-size:45px}#${pageId} .cinema-reel-ball small{font-size:11px;text-align:center}#${pageId} .cinema-reel-ball.winner{border:2px solid #ffc956}
 #${pageId} .cinema-marker{position:absolute;top:0;left:50%;height:100%;width:2px;background:#ffc64c;box-shadow:0 0 12px #ffc64c}
 @keyframes bvbFilmRoll{from{transform:translateX(0)}to{transform:translateX(calc(-100% + 54%))}}
 @media(max-width:650px){#${pageId} .cinema-shopgrid{gap:5px}#${pageId} .cinema-shopcard{padding:7px 3px}#${pageId} .cinema-shopcard img{height:83px}#${pageId} .cinema-shopcard strong{font-size:12px}#${pageId} .cinema-shopcard button{padding:6px 3px;font-size:9px}#${pageId} .cinema-wallet{position:static;display:inline-block}}
 `;
 style.textContent += `
 #${pageId} .cinema-collection-header{display:flex;align-items:center;gap:20px;margin:0 0 8px;color:#d3e5fd;font-size:12px}
 #${pageId} .cinema-collection-header>span{flex:0 0 auto}#${pageId} .cinema-collection-header>b{border:1px solid #b98b3a;border-radius:8px;padding:8px;color:#ffd484}
 #${pageId} .cinema-collection-header>b span{display:block;text-align:center;font-size:17px;color:white}
 #${pageId} .cinema-progress{flex:1;height:9px;border:1px solid #233f6b;background:#0d1b33;border-radius:9px;overflow:hidden}
 #${pageId} .cinema-progress i{display:block;height:100%;background:linear-gradient(90deg,#11a887,#64debc)}
 #${pageId} .cinema-collection-layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(190px,1fr);gap:9px;margin-top:8px}
 #${pageId} .cinema-collection-lists section{border:1px solid #27567b;border-radius:9px;background:#09172ce8;padding:9px;margin-bottom:8px}
 #${pageId} .cinema-collection-lists section h3{font-size:12px;letter-spacing:.4px;color:#54d5a9;margin:0 0 10px}
 #${pageId} .cinema-collection-lists section:nth-child(2) h3{color:#e5b454}
 #${pageId} .cinema-collection-lists section h3 small{float:right}
 #${pageId} .cinema-ball-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;max-height:260px;overflow:auto}
 #${pageId} .cinema-ball-tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;padding:5px;background:linear-gradient(#17314c,#07152a);border:1px solid #3668a1;border-radius:5px;color:white}
 #${pageId} .cinema-ball-tile.chosen{border-color:#e3b755;box-shadow:0 0 9px #e8ac3570}
 #${pageId} .cinema-ball-tile .cinema-portrait{width:100%;height:72px;object-fit:contain}
 #${pageId} .cinema-ball-tile b{font-size:10px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 #${pageId} .cinema-ball-tile small{position:absolute;top:3px;right:4px;color:#7de5ac}
 #${pageId} .cinema-collection-preview{display:flex;flex-direction:column;align-items:center;gap:9px;border:1px solid #bb8c3d;border-radius:9px;background:linear-gradient(#0b1930,#070e20);padding:14px 8px;min-width:0}
 #${pageId} .cinema-collection-preview>.cinema-portrait{width:85%;height:180px;object-fit:contain}
 #${pageId} .cinema-collection-preview>b{font-size:18px;color:white}
 #${pageId} .cinema-collection-preview>small{color:#e2b95f;font-weight:800}
 #${pageId} .cinema-evolutions{display:flex;gap:6px;width:100%}
 #${pageId} .cinema-evolutions button{flex:1;background:#0e2845;color:#d9e9ff;border:1px solid #4377ad;border-radius:5px;padding:8px}
 #${pageId} .cinema-evolutions button.selected{background:linear-gradient(#ddad44,#8d5d20);color:#fff;border-color:#ffe19d}
 #${pageId} .cinema-collection-preview p{text-align:center;font-size:11px;color:#9fafc7}
 #${pageId} .cinema-collection-preview>[data-act]{font-size:10px;background:#184369;border:1px solid #398acc;border-radius:5px;color:white;padding:8px}
 #${pageId} .cinema-ball-fallback{display:grid;place-items:center;width:100%;height:72px;font-size:29px}
 @media(max-width:650px){#${pageId} .cinema-collection-layout{grid-template-columns:minmax(0,1fr)}#${pageId} .cinema-collection-header{gap:5px;font-size:9px}#${pageId} .cinema-ball-grid{grid-template-columns:repeat(4,minmax(0,1fr))}#${pageId} .cinema-collection-preview>.cinema-portrait{height:115px}}
 `;
 style.textContent += `
 #${pageId}{min-height:540px;background:radial-gradient(ellipse 48% 64% at 50% 91%,#e6a12f30,transparent 66%),radial-gradient(ellipse 31% 34% at 47% 24%,#174b9c84,transparent 74%),linear-gradient(135deg,#030912,#081a3b 41%,#070f2a 77%,#040816)}
 #${pageId}:after{content:'';z-index:-1;position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 54% 98%,#f3aa3572,transparent 17%),linear-gradient(168deg,transparent 50%,#007eff29 62%,transparent 68%),linear-gradient(18deg,transparent 50%,#ee961b22 63%,transparent 69%);background-repeat:no-repeat}
 #${pageId} .title{padding:0 4px 8px;position:relative}
 #${pageId} .title:before{content:'';position:absolute;left:50%;top:-4px;z-index:-1;width:240px;height:142px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(ellipse,#ffbd273e 22%,#053371 48%,#e7aa2277 52%,#0a63e66e 55%,transparent 60%);filter:drop-shadow(0 0 19px #259bfa)}
 #${pageId} .title h1{font-size:clamp(2.4rem,5vw,4.7rem);font-style:italic;letter-spacing:-.035em;color:#e2ebff;text-shadow:0 2px 0 #334b77,0 5px 0 #0a1d3c,0 9px 12px #000,-1px -1px #fff}
 #${pageId} .title h1 em{color:#ffd56b;font-style:italic;text-shadow:0 3px 0 #965219,0 7px 10px #111}
 #${pageId} .title p{font-size:clamp(1.3rem,3vw,2.4rem);font-weight:1000;font-style:italic;line-height:1;color:#ffc147;text-shadow:0 3px 0 #8a490d,0 7px 12px #000;margin:0}
 #${pageId} .film-layout{padding:6px 22px 7px;grid-template-columns:clamp(110px,16%,158px) minmax(0,1fr);gap:24px}
 #${pageId} .film-cards{gap:14px}
 #${pageId} .film-card{min-height:144px;max-height:162px;border-radius:20px;transform:skew(-7deg);box-shadow:inset 0 0 20px var(--glow),0 0 14px var(--c),0 6px 8px #0009}
 #${pageId} .film-card:hover{transform:skew(-7deg) translateY(-5px) scale(1.02)}
 #${pageId} .film-banner-inner{min-height:90px}
 #${pageId} .film-nav button{min-height:38px}
 #${pageId} .foot{padding:3px 0 9px}
 #${pageId} .cinema-reel{animation:none!important}
 #${pageId} .cinema-reel-ball .cinema-portrait{width:80px;height:77px;object-fit:contain}
 #${pageId} .cinema-reel-ball .cinema-ball-fallback{height:77px}
 #${pageId} .cinema-reel-window .cinema-reel-ball.winner{box-shadow:0 0 15px #f5c755}
 #${pageId} .cinema-outcome{animation:bvbResultIn .3s ease both}
 @keyframes bvbResultIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
 @media(max-width:650px){#${pageId} .film-layout{padding:6px;gap:7px;grid-template-columns:minmax(82px,24%) minmax(0,1fr)}#${pageId} .film-cards{gap:5px}#${pageId} .film-card{min-height:120px}#${pageId} .film-card strong{font-size:12px}#${pageId} .film-card small{font-size:8px}#${pageId} .film-nav button{font-size:10px;min-height:35px}#${pageId} .title h1{font-size:2rem}#${pageId} .film-banner-inner{min-height:82px;padding:6px}}
 `;
 style.textContent += `
 /* The old 2.0.1 changelog is not part of the approved V7 menu and
    must never cover or intercept clicks on the beta film interface. */
 body:has(#${pageId}:not([hidden])) #bvb2ReleaseModal{display:none!important}
 #${pageId} .cinema-art-unavailable{display:flex;align-items:center;justify-content:center;text-align:center;min-height:72px;width:100%;padding:7px;background:radial-gradient(circle,#172b4a,#060d1d);border:1px dashed #53698d;border-radius:7px;color:#92a7c6;font-size:10px;letter-spacing:.4px;line-height:1.5}
 #${pageId} .cinema-collection-preview>.cinema-art-unavailable{height:180px}
 #${pageId} .cinema-reel-ball .cinema-art-unavailable{height:77px}
 `;
 style.textContent += `
 /* The rework engine has its own legacy top bar; hide it only while
    the V7 film menu is active. It remains available in gameplay. */
 #app:has(> #menu:not([hidden]) > #${pageId}:not([hidden])) > :not(#menu){display:none!important}
 #${pageId}{min-height:100dvh!important}
 #${pageId} .cinematic-shell{min-height:100dvh}
 #${pageId} .screen{inset:0;min-height:100%;background:#030b19!important;z-index:10;box-shadow:none}
 #${pageId} .screen:has(.cinema-collection-layout){padding:10px 15px 18px}
 #${pageId} .screen:has(.cinema-collection-layout)>.back{position:absolute;top:8px;right:15px;z-index:2;padding:6px 10px;font-size:12px;margin:0}
 #${pageId} .screen:has(.cinema-collection-layout)>h2{font-size:20px;margin:0 0 4px;line-height:1.2}
 #${pageId} .screen:has(.cinema-collection-layout) .cinema-collection-header{margin:0 0 8px;max-width:calc(100% - 78px)}
 #${pageId} .screen:has(.cinema-collection-layout) #bvb-fm-search{padding:7px 10px;font-size:12px;width:260px}
 @media(max-width:650px){
  #${pageId} .screen{padding:13px 9px}
  #${pageId} .screen:has(.cinema-collection-layout){padding:12px 8px}
  #${pageId} .screen:has(.cinema-collection-layout)>.back{top:8px;right:8px}
  #${pageId} .screen:has(.cinema-collection-layout)>h2{font-size:16px;margin:0 0 8px}
  #${pageId} .screen:has(.cinema-collection-layout) .cinema-collection-header{max-width:100%;margin-top:20px}
  #${pageId} .cinema-collection-preview{min-height:260px}
 }
`;
 style.textContent += `
 #${pageId} .identity>div{display:flex;flex-direction:column;gap:2px;min-width:0}
 #${pageId} .identity .username{display:block;font-size:12px;line-height:1.15;max-width:180px}
 #${pageId} .identity #bvb-fm-level{display:block;font-size:10px;color:#cbd8ee;line-height:1.2}
 #${pageId} .film-nav{transform:translateY(clamp(-95px,-7.5vw,-65px));align-self:start}
 #${pageId} .film-nav .leftnav{gap:clamp(5px,.7vw,10px)}
 #${pageId} .film-nav button{min-height:clamp(39px,4.6vw,58px);font-size:clamp(11px,1.1vw,15px)}
 #${pageId} .film-card{min-height:clamp(145px,14.8vw,190px);max-height:none}
 #${pageId} .film-banner-inner{min-height:clamp(90px,9.3vw,125px)}
 #${pageId} .film-banner{position:relative}
 #${pageId} .film-banner-copy{padding-left:14px}
 #${pageId} .film-chests img{mask-image:radial-gradient(ellipse at center,#000 63%,transparent 99%);-webkit-mask-image:radial-gradient(ellipse at center,#000 63%,transparent 99%)}
 #${pageId} .film-chests img:nth-child(2){transform:scale(1.18)}
 #${pageId} .film-banner:before{content:'❮';display:grid;place-items:center;position:absolute;left:9px;top:50%;transform:translateY(-50%);height:40px;width:30px;border:1px solid #5387c1;border-radius:7px;color:#e5f3ff;background:#091f3f;pointer-events:none;z-index:1}
 #${pageId} .film-banner-inner{padding-left:42px}
 #${pageId} .film-banner .new-tag{position:absolute;top:8px;left:clamp(44px,5vw,70px);z-index:1}
 #${pageId} .film-banner-copy{padding-top:21px}
 #${pageId} .cinema-shopcard img{height:clamp(155px,19vw,255px)}
 #${pageId} .cinema-shopcard{padding-bottom:22px}
 @media(max-width:650px){
  #${pageId} .film-nav{transform:none}
  #${pageId} .film-nav button{min-height:35px;font-size:10px}
  #${pageId} .film-card{min-height:120px}
  #${pageId} .film-banner-inner{min-height:82px;padding-left:17px}
  #${pageId} .film-banner:before{display:none}
  #${pageId} .film-banner .new-tag{left:6px;top:4px}
  #${pageId} .film-banner-copy{padding-left:0;padding-top:15px}
  #${pageId} .cinema-shopcard img{height:83px}
  #${pageId} .cinema-shopcard{padding-bottom:7px}
 }
`;
 style.textContent += `
 #${pageId} .cinema-outcome .tilegrid{max-width:460px;margin:12px auto;grid-template-columns:repeat(2,minmax(0,1fr))}
 #${pageId} .cinema-outcome .tile{min-height:44px;padding:8px 12px}
 #${pageId} .cinema-reel-ball small{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
`;
 style.textContent += `
 /* Procedural V7 arena scenery: separate live layers, never a pasted film frame. */
 #${pageId} .cinematic-shell{isolation:isolate;overflow:hidden}
 #${pageId} .cinematic-shell:before{content:'';position:absolute;left:50%;bottom:-18px;width:min(62vw,760px);height:180px;transform:translateX(-50%) perspective(500px) rotateX(66deg);border:8px solid #e9a737;border-radius:50%;background:radial-gradient(ellipse at center,#ffbc3020,transparent 68%);box-shadow:0 0 14px #f5a727,0 0 34px #e39b2b99,inset 0 0 28px #ffb334;opacity:.75;pointer-events:none;z-index:0}
 #${pageId} .cinematic-shell:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:0;background:linear-gradient(132deg,transparent 15%,#0078ff44 16%,transparent 17% 36%,#3adfff20 37%,transparent 38%),linear-gradient(35deg,transparent 30%,#ffab2033 31%,transparent 32% 75%,#ffbb3333 76%,transparent 77%);mask-image:linear-gradient(#000 0%,transparent 62%);-webkit-mask-image:linear-gradient(#000 0%,transparent 62%);opacity:.8}
 #${pageId} .cinematic-shell>*{position:relative;z-index:1}
 #${pageId} .film-layout{position:relative}
 #${pageId} .film-layout:before,#${pageId} .film-layout:after{content:'♛';position:absolute;top:-153px;width:48px;height:103px;display:block;text-align:center;padding-top:18px;font-size:27px;color:#ffe28d;text-shadow:0 0 12px #e4a736;background:linear-gradient(100deg,#291909,#77511d 45%,#2d1a0d);border:2px solid #a87932;clip-path:polygon(0 0,100% 0,100% 79%,50% 100%,0 79%);opacity:.74;pointer-events:none}
 #${pageId} .film-layout:before{left:12%}
 #${pageId} .film-layout:after{right:1%}
 @media(max-width:650px){#${pageId} .film-layout:before,#${pageId} .film-layout:after{display:none}#${pageId} .cinematic-shell:before{height:80px;bottom:-8px;border-width:4px}}
`;
 style.textContent += `
 #${pageId} .film-nav .film-vector{width:19px;height:19px;display:inline-block;vertical-align:middle;margin-right:8px;filter:drop-shadow(0 0 4px #4bc7ff);color:#a4dfff}
 #${pageId} .film-nav button:first-child .film-vector{color:#ffe18a;filter:drop-shadow(0 0 4px #ffc24a)}
 #${pageId} .topright .plain .film-vector{width:22px;height:22px;color:#c9e5ff}
 @media(max-width:650px){#${pageId} .film-nav .film-vector{width:13px;height:13px;margin-right:3px}}
`;
 style.textContent += `
 #${pageId} .foot{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip-path:inset(50%)!important;white-space:nowrap!important}
 #${pageId} .title h1{position:relative}
 #${pageId} .title h1:before,#${pageId} .title h1:after{content:'';position:absolute;top:83%;height:22px;width:clamp(55px,10vw,135px);background:linear-gradient(180deg,#ffe6a1,#e3a634 50%,#8b4c12 75%,#3b240b);filter:drop-shadow(0 2px 3px #d79a2c);opacity:.95;pointer-events:none}
 #${pageId} .title h1:before{left:calc(50% - 198px);clip-path:polygon(0 12%,100% 0,80% 35%,100% 45%,60% 70%,75% 88%,0 55%)}
 #${pageId} .title h1:after{right:calc(50% - 198px);clip-path:polygon(100% 12%,0 0,20% 35%,0 45%,40% 70%,25% 88%,100% 55%)}
 @media(max-width:650px){#${pageId} .title h1:before,#${pageId} .title h1:after{width:40px;height:9px;top:88%}#${pageId} .title h1:before{left:calc(50% - 78px)}#${pageId} .title h1:after{right:calc(50% - 78px)}}
`;
 style.textContent += `
 /* Match the approved 960×540 film framing without clipping phone layouts. */
 #${pageId}{height:100dvh;min-height:0!important;overflow:hidden}
 #${pageId} .cinematic-shell{height:100dvh;min-height:0!important;overflow:hidden}
 #${pageId} .screen{height:100%;min-height:0;overflow:auto}
 @media(min-width:651px) and (max-width:1050px){
  #${pageId} .cinematic-shell{padding-left:0!important;padding-right:0!important}
  #${pageId} .film-layout{padding-left:11px!important;padding-right:11px!important}
  #${pageId} .film-nav{transform:translateY(-95px)!important}
  #${pageId} .cinematic-shell:before{bottom:12px;height:160px}
 }
 @media(max-height:490px) and (min-width:651px){
  #${pageId}{overflow:auto}
  #${pageId} .cinematic-shell{height:auto;min-height:520px!important}
 }
`;
 style.textContent += `
 #app:has(> #menu:not([hidden]) > #${pageId}:not([hidden])){padding:0!important;margin:0!important}
 #menu:has(> #${pageId}:not([hidden])){margin:0!important;padding:0!important}
`;
 document.head.append(style);
 const page=document.createElement('section');page.id=pageId;page.setAttribute('aria-label','Nowe Menu Ball VS Ball 2.5');
 const filmIcon=(kind)=>{const shapes={
 sword:'<path d="M13 5l6 6-10 10-5 1 1-5L15 7M8 8l8 8M4 4l16 16M7 17l-3 3M17 7l3-3"/>',
 flag:'<path d="M5 22V3m0 1c6-4 8 4 15 0v12c-7 4-9-4-15 0"/><path d="M5 22h7"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>',
 crown:'<path d="M2 7l5 5 5-8 5 8 5-5-2 13H4z"/><path d="M4 20h16"/>',
 coin:'<circle cx="12" cy="12" r="10"/><path d="M12 4l2.4 5 5.6.8-4 4 .9 5.7-4.9-2.7-4.9 2.7.9-5.7-4-4 5.6-.8z"/>'
,
 home:'<path d="M2 11L12 3l10 8"/><path d="M5 10v11h14V10M10 21v-7h4v7"/>',
 bag:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2M3 12h18M10 12v3h4v-3"/>',
 chest:'<rect x="2" y="8" width="20" height="13" rx="2"/><path d="M2 13h20M8 8V5h8v3M10 13v4h4v-4"/>',
 shop:'<path d="M4 9V21h16V9M2 9l2-6h16l2 6-3 2-3-2-4 2-4-2-3 2zM9 21v-8h6v8"/>',
 trophy:'<path d="M7 3h10v7a5 5 0 0 1-10 0zM7 5H3v4a4 4 0 0 0 4 4M17 5h4v4a4 4 0 0 1-4 4M12 15v5M8 20h8"/>',
 progress:'<path d="M3 21V15h4v6M10 21V10h4v11M17 21V4h4v17"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.5 3 2.2 1 2.5-1.5 2.3 3.5-2.3 2v3l2.3 2-2.3 3.5-2.5-1.5-2.2 1-.5 3h-4l-.5-3-2.2-1-2.5 1.5L2.5 15l2.3-2v-3L2.5 8l2.3-3.5L7.3 6l2.2-1z"/>'
 };return '<svg class="film-vector" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(shapes[kind]||'')+'</svg>'};
 page.innerHTML=`<div class="cinematic-shell"><header class="head"><div class="identity"><span class="avatar">${filmIcon("crown")}</span><div><span id="bvb-fm-user" class="username">Gracz</span><span id="bvb-fm-level">Poziom 1</span><div class="xpbar"><i id="bvb-fm-xp"></i></div></div></div><div class="topright"><span class="money"><span class="coin">${filmIcon("coin")}</span><span id="bvb-fm-coins">0</span></span>${btn('settings',filmIcon('settings'),'plain')}</div></header>
 <div class="title"><h1>BALL <em>VS</em> BALL</h1><p id="bvb-fm-subtitle">2.5</p></div>
 <div class="film-layout"><aside class="film-nav"><nav class="leftnav">${btn('home',filmIcon('home')+' Menu')}${btn('collection',filmIcon('bag')+' Ekwipunek')}${btn('crates',filmIcon('chest')+' Skrzynie')}${btn('shop',filmIcon('shop')+' Sklep')}${btn('ranking',filmIcon('trophy')+' Osiągnięcia')}${btn('profile',filmIcon('progress')+' Postęp')}</nav></aside>
 <main class="film-main"><div class="film-cards"><button type="button" class="film-card blue" data-act="play"><span class="film-symbol">${filmIcon("sword")}</span><strong>GRAJ</strong><small>Szybka rozgrywka</small></button><button type="button" class="film-card violet" data-act="campaign"><span class="film-symbol">${filmIcon("flag")}</span><strong>KAMPANIA</strong><small>Walka z bossami · WKRÓTCE</small></button><button type="button" class="film-card orange" data-act="training"><span class="film-symbol">${filmIcon("target")}</span><strong>TRENING</strong><small>Testuj kulki i umiejętności</small></button></div><section class="film-banner"><button type="button" data-act="crates" class="film-banner-inner"><span class="new-tag">NOWOŚĆ!</span><span class="film-banner-copy"><strong>NOWE SKRZYNIE</strong><small>Zdobywaj unikalne kulki!</small></span><span class="film-chests"><img src="${art.normal}" alt="Zwykła skrzynia"><img src="${art.legend}" alt="Legendarna skrzynia"><img src="${art.epic}" alt="Epicka skrzynia"></span><span class="film-next">❯</span></button></section></main></div>
 <div class="foot">BALL VS BALL 2.5 · WERSJA TESTOWA · NIE WSZYSTKIE FUNKCJE SĄ GOTOWE</div></div><section id="bvb-fm-screen" class="screen" hidden aria-live="polite"></section>`;
 root.prepend(page);
 const view=page.querySelector('#bvb-fm-screen');
 const getSave=()=>{try{return typeof S!=='undefined'&&S?S:null}catch(_){return null}};
 const getBalls=()=>{try{return typeof B!=='undefined'&&Array.isArray(B)?B:[]}catch(_){return []}};
 const can=name=>Boolean(window.BVBMenu&&typeof window.BVBMenu.open==='function'&&document.getElementById('bvb3_'+name));
 const openNative=name=>{if(!can(name))return false;window.BVBMenu.open(name);return true};
 function showView(title,content){view.hidden=false;view.innerHTML=`${btn('home','← Wróć','back')}<h2>${safe(title)}</h2>${content}`;view.scrollTop=0;}
 function info(title,desc,links=''){showView(title,`<div class="pane">${desc}</div><div class="tilegrid">${links}</div>`)}
 const chestData=[['normal','Zwykła',100,art.normal],['epic','Epicka',300,art.epic],['legend','Legendarna',750,art.legend]];
 function buttonsAt(t){return chestData.filter(([k])=>k==='normal'||availableAt(t))}
 function chestList(t){return buttonsAt(t).map(([k,n,cost,img])=>`<button type="button" data-act="chest-${k}" class="chest"><img src="${img}" alt="Skrzynia ${n}"><span>${n}</span></button>`).join('')}
 function renderClock(){
  // The cinematic home screen no longer includes the legacy Halloween timer,
  // chestbar or news nodes. Never dereference UI elements removed by the redesign.
  const subtitle=page.querySelector('#bvb-fm-subtitle');
  if(subtitle)subtitle.textContent='2.5';
  if(view.dataset.mode==='crates'&&view.dataset.unlocked!==(availableAt(now())?'yes':'no'))renderCrates();
 }
 function renderCrates(){
  const t=now(),opened=availableAt(t),s=getSave();
  const cards=buttonsAt(t).map(([k,n,cost,img])=>`<article class="cinema-shopcard"><img src="${img}" alt="Skrzynia ${n}"><strong>${n}</strong><button type="button" data-act="purchase-${k}">ZA ${cost} MONET</button></article>`).join('');
  showView('NOWY SKLEP',`<div class="cinema-kicker">BALL VS BALL 2.5 / NOWA ERA</div><p class="cinema-lead">Kulki zdobywasz wyłącznie ze skrzyń</p><div class="cinema-wallet">🪙 <span id="bvb-fm-wallet">${Number(s?.coins||0).toLocaleString('pl-PL')}</span> MONET</div><div class="cinema-shopgrid">${cards}</div><div class="cinema-shopfooter">WYBIERZ SKRZYNIĘ</div>`);
  view.dataset.mode='crates';view.dataset.unlocked=opened?'yes':'no';
 }
 function chooseCrypto(){try{let v=new Uint32Array(1);crypto.getRandomValues(v);return v[0]/4294967296}catch(_){return Math.random()}}
 function selectBall(kind,balls){
  // No manufactured rarity: use b.r from the native game data.
  const chances=kind==='normal'?[[0,.50],[1,.30],[2,.15],[3,.04],[4,.01]]:kind==='epic'?[[2,.70],[3,.25],[4,.05]]:[[3,.80],[4,.20]];
  const usable=chances.filter(([rar])=>balls.some(b=>b?.r===rar));
  if(!usable.length)return null;
  const total=usable.reduce((sum,a)=>sum+a[1],0);let value=chooseCrypto()*total,chosen=usable[usable.length-1][0];
  for(const [rar,chance] of usable){value-=chance;if(value<0){chosen=rar;break}}
  const pool=balls.filter(b=>b?.r===chosen);return pool[Math.floor(chooseCrypto()*pool.length)]||null;
 }
 function purchase(kind){
  const d=chestData.find(x=>x[0]===kind);if(!d)return;
  // Guard purchase itself — not just button visibility — against early availability.
  if(kind!=='normal'&&!availableAt(now())){renderCrates();return;}
  const [key,name,cost]=d,s=getSave();if(!s){info('Nie można otworzyć','Stan gry nie jest dostępny.',btn('crates','Skrzynie','tile'));return}
  if(s.coins<cost){info('Za mało monet','Potrzeba '+cost+' monet. Aktualnie masz '+s.coins+'.',btn('crates','← Skrzynie','tile'));return}
  const balls=getBalls(),winner=selectBall(kind,balls);
  if(!winner){info('Skrzynia niedostępna','W grze brakuje kulek tej rzadkości. Monety nie zostały pobrane.',btn('crates','← Skrzynie','tile'));return}
  const had=Array.isArray(s.own)&&s.own.includes(winner.id);
  const beforeCoins=s.coins,beforeOwn=Array.isArray(s.own)?s.own.slice():[],beforeGacha=s.q?.gacha;
  s.coins=Number(s.coins)-cost+(had?40:0);
  if(!had){s.own ||= [];s.own.push(winner.id)}
  if(s.q)s.q.gacha=(Number(s.q.gacha)||0)+1;
  // The prize and the reel must agree, and a failed save must not spend coins.
  try{
   if(typeof save!=='function')throw Error('Native save unavailable');
   save();
   const key=typeof K!=='undefined'?K:'bvb2';
   const persisted=JSON.parse(localStorage.getItem(key)||'null');
   if(!persisted||Number(persisted.coins)!==Number(s.coins)||!persisted.own?.includes(winner.id))throw Error('Persistence verification failed');
  }catch(err){
   s.coins=beforeCoins;s.own=beforeOwn;if(s.q)s.q.gacha=beforeGacha;
   info('BŁĄD ZAPISU','Nie udało się bezpiecznie zapisać losowania. Monety i kolekcja nie zostały zmienione.',btn('crates','← Skrzynie','tile'));
   return;
  }
  try{if(typeof SFX!=='undefined'&&typeof SFX.rare==='function')SFX.rare()}catch(_){};
  // Keep decorative cards after the predetermined prize so the roulette never
  // ends in an empty right half. The actual saved winner remains card #17.
  const candidates=[
   ...Array.from({length:16},()=>balls[Math.floor(chooseCrypto()*balls.length)]||winner),
   winner,
   ...Array.from({length:8},()=>balls[Math.floor(chooseCrypto()*balls.length)]||winner)
  ];
  const reel=candidates.map((b,i)=>`<div class="cinema-reel-ball${i===16?' winner':''}">${portrait(b)}<small>${safe(b.n)}</small></div>`).join('');
  showView('OTWIERANIE SKRZYNI',`<div class="cinema-kicker">SKRZYNIE / LOSOWANIE</div><div class="cinema-chest"><img src="${d[3]}" alt="Otwarta skrzynia ${name}"></div><div class="cinema-reel-window"><div class="cinema-reel">${reel}</div><i class="cinema-marker"></i></div><h3>LOSOWANIE KULKI</h3><div class="cinema-outcome" hidden><p>Wylosowano: <b>${safe(winner.n)}</b> · ${had?'Duplikat, zwrot 40 monet':'Nowa kulka w kolekcji!'}</p><p>Pozostało ${Number(s.coins).toLocaleString('pl-PL')} monet</p><div class="tilegrid">${btn('crates','Kolejna skrzynia','tile')}${btn('collection','Kolekcja','tile')}</div></div>`);

  const strip=view.querySelector('.cinema-reel'),reelWindow=view.querySelector('.cinema-reel-window');
  if(strip&&reelWindow){
   const resultLine=view.querySelector('.cinema-outcome');
   const prizeTile=strip.querySelector('.cinema-reel-ball.winner');
   const prizeRect=prizeTile.getBoundingClientRect(),stripRect=strip.getBoundingClientRect();
   const finalOffset=reelWindow.clientWidth/2-(prizeRect.left-stripRect.left+prizeRect.width/2);
   const finish=()=>{if(view.contains(strip)&&resultLine)resultLine.hidden=false;};
   if(typeof strip.animate==='function'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    strip.animate([{transform:'translateX(0)'},{transform:'translateX('+finalOffset+'px)'}],{duration:4900,easing:'cubic-bezier(.1,.7,.16,1)',fill:'forwards'}).finished.then(finish,finish);
   }else{strip.style.transform='translateX('+finalOffset+'px)';finish();}
  }
  view.dataset.mode='result';
 }
 const nativeArtwork=(id,evolution=1)=>{
  // ART_IMAGES is the real rework's preloaded SVG artwork map, used by the
  // in-game skill preview. Do not replace its graphics with emoji.
  const keys=evolution===1?[id]:[
   id+':v'+evolution,id+'-v'+evolution,id+'_v'+evolution,
   'v'+evolution+':'+id,'v'+evolution+'-'+id
  ];
  try{
   if(typeof ART_IMAGES!=='undefined'&&ART_IMAGES?.get){
    for(const key of keys){
     const img=ART_IMAGES.get(key);
     if(img?.src&&/^(data:image\/|blob:|https?:\/\/)/.test(img.src))return img.src;
    }
   }
  }catch(_){}
  if(evolution!==1)return null;
  try{
   if(typeof art==='function'){
    const svg=art(id);
    if(typeof svg==='string'&&/^\s*<svg[\s>]/i.test(svg))return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
    if(typeof svg==='string'&&/^(data:image\/|blob:)/.test(svg))return svg;
   }
  }catch(_){}
  return null;
 };
 const portrait=(b,evolution=1)=>{
  if(!b)return '<span class="cinema-art-unavailable">Brak danych</span>';
  const forms=b.evolutions||b.evo||b.variants||b.forms;
  const form=Array.isArray(forms)?forms[evolution-1]:(forms?.['V'+evolution]||forms?.['v'+evolution]||forms?.[evolution]);
  const chosen=form&&typeof form==='object'?form:b;
  const explicit=[
   typeof form==='string'?form:null,
   chosen.image,chosen.img,chosen.portrait,chosen.sprite,chosen.imageUrl,
   b['v'+evolution],b['V'+evolution],b['artV'+evolution]
  ].find(v=>typeof v==='string'&&/^(data:image\/|https?:\/\/|blob:|\.{0,2}\/)/.test(v));
  // First 16 evolution portraits are previously approved WebP, imported
  // from art/accurate-game-sketch-00-48. Do not fabricate the remaining tiers.
  const approved=evolution>1&&Number.isInteger(b.id)&&b.id>=0&&b.id<16?
   './assets/approved-first16/ball-'+String(b.id).padStart(2,'0')+'-v'+evolution+'.webp':null;
  const src=explicit||nativeArtwork(b.id,evolution)||approved;
  if(src)return '<img class="cinema-portrait" loading="lazy" src="'+safe(src)+'" alt="'+safe(b.n||'Kulka')+' V'+evolution+'">';
  return '<span class="cinema-art-unavailable" aria-label="Brak potwierdzonej grafiki V'+evolution+'">GRAFIKA V'+evolution+'<br>NIEDOSTĘPNA</span>';
 };
 let selectedBallId=null,selectedEvolution=1;
 function renderCollection(q=''){
  const list=getBalls(),owned=new Set(getSave()?.own||[]);
  const matches=list.filter(b=>b?.n?.toLowerCase().includes(q.toLowerCase()));
  const unlocked=matches.filter(b=>owned.has(b.id)),locked=matches.filter(b=>!owned.has(b.id));
  const select=list.find(b=>b.id===selectedBallId)||unlocked[0]||locked[0];
  if(select)selectedBallId=select.id;
  const tiles=(items)=>items.slice(0,130).map(b=>`<button type="button" class="cinema-ball-tile${b.id===selectedBallId?' chosen':''}" data-ball="${b.id}">${portrait(b)}<b>${safe(b.n)}</b><small>${owned.has(b.id)?'✓':'🔒'}</small></button>`).join('');
  const pane=select?`<div class="cinema-collection-preview">${portrait(select,selectedEvolution)}<b>${safe(select.n)}</b><small>${owned.has(select.id)?'ODBLOKOWANA':'ZABLOKOWANA'}</small><div class="cinema-evolutions">${[1,2,3].map(n=>`<button data-evolution="${n}" class="${selectedEvolution===n?'selected':''}" type="button">V${n}</button>`).join('')}</div><p>${safe(select.d||'Podgląd umiejętności w grze')}</p><button type="button" data-act="native-col">PEŁNY PODGLĄD W GRZE</button></div>`:'';
  showView('KOLEKCJA KULEK',`<div class="cinema-collection-header"><span>Wszystkie kulki: ${list.length}</span><div class="cinema-progress"><i style="width:${list.length?Math.min(100,owned.size/list.length*100):0}%"></i></div><b>ODBLOKOWANE <span>${owned.size} / ${list.length}</span></b></div><input id="bvb-fm-search" type="search" placeholder="Szukaj kulki…" aria-label="Szukaj kulki" value="${safe(q)}"><div class="cinema-collection-layout"><div class="cinema-collection-lists"><section><h3>● ODBLOKOWANE KULKI <small>${unlocked.length}</small></h3><div class="cinema-ball-grid">${tiles(unlocked)||'<p>Brak odblokowanych kulek</p>'}</div></section><section><h3>● ZABLOKOWANE KULKI <small>${locked.length}</small></h3><div class="cinema-ball-grid">${tiles(locked)||'<p>Wszystkie kulki odblokowane</p>'}</div></section></div>${pane}</div>`);
  view.dataset.mode='collection';
 }
 function renderBall(id){selectedBallId=id;renderCollection($('#bvb-fm-search')?.value||'')}
 function action(key){
  if(key==='home'){view.hidden=true;view.dataset.mode='';if(can('home'))openNative('home');return}
  if(key==='play'||key==='modes'){
   if(openNative('modes'))return;
   info('Tryby gry','Wybierz tryb do rozegrania rundy.',btn('bot','Walka z botem','tile')+btn('training','Trening','tile')+btn('bosses','Bossowie','tile')+btn('campaign','Kampania','tile'));return
  }
  if(key==='bot'){if(typeof window.startMatch==='function')window.startMatch(0);else info('Błąd','Silnik nie obsługuje rozpoczęcia walki.');return}
  if(key==='training'){if(typeof window.startMatch==='function'){window.startMatch(4);return}info('Trening','Ta wersja gry nie obsługuje treningu.',btn('home','← Wróć','tile'));return}
  if(key==='campaign'){info('TRYB FABULARNY — WKRÓTCE','Nowy tryb fabularny z bossami jest w przygotowaniu. Nie uruchamiam niedokończonej kampanii.',btn('home','← Wróć','tile'));return}
  if(key==='bosses'){if(openNative('bosses'))return;info('Bossowie','Tryb bossów nie jest jeszcze udostępniony w tej wersji gry.',btn('home','← Wróć','tile'));return}
  if(key==='multiplayer'){if(typeof window.mpMenu==='function')window.mpMenu();else info('Multiplayer','Nie jest dostępny w tej wersji gry.',btn('home','← Wróć','tile'));return}
  if(key==='collection'){renderCollection();return}
  if(key==='native-col'){if(typeof window.panel==='function')window.panel('col');return}
  if(key==='crates'||key==='shop'||key.startsWith('chest-')){renderCrates();return}
  if(key.startsWith('purchase-')){purchase(key.substring(9));return}
  if(key==='profile'){if(typeof window.panel==='function')window.panel('pr');else info('Profil','Profil nie jest dostępny.',btn('home','← Wróć','tile'));return}
  if(key==='ranking'){
   // Film label is "Osiągnięcia", not the unrelated online ranking.
   if(typeof window.panel==='function'){window.panel('ach');return}
   if(openNative('rewards'))return;
   info('Osiągnięcia','Panel osiągnięć nie jest dostępny w tej wersji gry.',btn('home','← Wróć','tile'));
   return;
  }
  if(key==='quests'){if(typeof window.panel==='function')window.panel('q');else info('Zadania','Funkcja niedostępna.',btn('home','← Wróć','tile'));return}
  if(key==='rewards'){if(openNative('rewards'))return;if(typeof window.panel==='function')window.panel('bp');else info('Nagrody','Funkcja niedostępna.',btn('home','← Wróć','tile'));return}
  if(key==='replays'){
   if(typeof window.replayMenu==='function')window.replayMenu();else info('Powtórki','Zapis i odtwarzanie pełnych rund nie są jeszcze wdrożone w tej wersji silnika. Ten przycisk pokazuje stan funkcji zamiast uruchamiać fałszywe nagranie.',btn('home','← Wróć','tile'));return;
  }
  if(key==='settings'){if(openNative('settings'))return;if(typeof window.panel==='function')window.panel('set');else info('Ustawienia','Funkcja niedostępna.',btn('home','← Wróć','tile'));return}
 }
 page.addEventListener('click',ev=>{
  const ball=ev.target.closest('button[data-ball]');if(ball){renderBall(Number(ball.dataset.ball));return}
  const evolution=ev.target.closest('button[data-evolution]');if(evolution){selectedEvolution=Number(evolution.dataset.evolution)||1;renderCollection($('#bvb-fm-search')?.value||'');return}
  const target=ev.target.closest('button[data-act]');if(target)action(target.dataset.act);
 });
 page.addEventListener('input',e=>{if(e.target.id==='bvb-fm-search'){
  const q=e.target.value,p=e.target.selectionStart;renderCollection(q);const el=$('#bvb-fm-search');el.focus();el.setSelectionRange(p,p)
 }});
 function status(){const s=getSave();if(!s)return;$('#bvb-fm-user').textContent=(s.nm||s.nick||'Gracz');$('#bvb-fm-level').textContent='Poziom '+(s.lv||1);$('#bvb-fm-xp').style.width=Math.max(0,Math.min(100,((Number(s.xp)||0)/Math.max(1,(Number(s.lv)||1)*100)*100)))+'%';$('#bvb-fm-coins').textContent=Number(s.coins||0).toLocaleString('pl-PL')}
 const dismissLegacyNotes=()=>{try{if(!page.hidden&&window.BVB2ReleaseNotes?.hide&&document.getElementById('bvb2ReleaseModal')?.hidden===false)window.BVB2ReleaseNotes.hide()}catch(_){}};
 const sync=()=>{page.hidden=Boolean(native?.hidden);dismissLegacyNotes()};
 if(native)new MutationObserver(sync).observe(native,{attributes:true,attributeFilter:['hidden']});sync();
 function tick(){if(!page.isConnected)return;dismissLegacyNotes();renderClock();status()}
 tick();const timer=setInterval(()=>{if(!page.isConnected)clearInterval(timer);else tick()},1000);
 syncTime().then(tick);
 window.BVBFilmMenuBeta={get countdownTime(){return END},get unlockTime(){return UNLOCK},get clockSource(){return serverEpoch==null?'local-fallback':'server-header'},isUnlockedAt:availableAt,isEndedAt:endingAt,openCrates:renderCrates,openHome:()=>action('home'),version:'v7-scene11-beta-20261107'};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* BVB Halloween menu beta — zmienia tylko widok menu, nie mechaniki. */
(function(){
'use strict';
const DEADLINE=Date.parse('2026-11-07T16:00:00+01:00');
function init(){
 const root=document.getElementById('menu');
 const native=document.getElementById('bvb3Home');
 if(!root){setTimeout(init,350);return;} if(!native&&!root.querySelector('#bvb-safe-note')){setTimeout(init,350);return;}
 if(document.getElementById('bvb-beta-home'))return;
 const css=document.createElement('style');
 css.id='bvb-beta-menu-style';
 css.textContent=`
#menu:not(:has(#bvb3Home)):has(#bvb-beta-home:not([hidden])) > :not(#bvb-beta-home){display:none!important}
#menu:has(#bvb-beta-home:not([hidden])) > #bvb3Home,
#menu:has(#bvb-beta-home:not([hidden])) > #bvb-halloween-countdown{display:none!important}
#app:has(#bvb-beta-home:not([hidden])){max-width:1500px!important;width:min(100%,1530px);box-sizing:border-box;padding:10px!important}
#bvb-beta-home{position:relative;isolation:isolate;overflow:hidden;min-height:760px;border:1px solid #b88fda88;border-radius:22px;color:#fff5eb;background:radial-gradient(circle at 50% 20%,#64327799,transparent 45%),linear-gradient(160deg,#0d0724 0%,#23113d 45%,#11091d 100%);box-shadow:0 20px 80px #070313a9,inset 0 0 90px #ad59d833;font-family:system-ui,Arial,sans-serif}
#bvb-beta-home *{box-sizing:border-box}
#bvb-beta-home[hidden]{display:none!important}
#bvb-beta-home .mist{position:absolute;inset:0;z-index:-1;opacity:.8;background:radial-gradient(ellipse at 70% 105%,#f45b154c,transparent 40%),radial-gradient(circle at 35% 10%,#ff8a3860,transparent 12%);pointer-events:none}
#bvb-beta-home .moon{position:absolute;top:110px;left:25%;width:115px;height:115px;border-radius:50%;background:#ffbb6f;box-shadow:0 0 46px #ff8d38a8,0 0 110px #f3763c44;opacity:.77;z-index:-1}
#bvb-beta-home .trees{position:absolute;bottom:-45px;left:-6%;right:-6%;height:240px;background:radial-gradient(ellipse at 8% 100%,#070510 0 42%,transparent 43%),radial-gradient(ellipse at 92% 100%,#070510 0 42%,transparent 43%);z-index:-1;opacity:.87}
#bvb-beta-home .top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px 22px;border-bottom:1px solid #c6a6e177;background:#0506149e;font-size:.84rem}
#bvb-beta-home .level{width:120px;height:11px;border-radius:20px;display:inline-block;vertical-align:middle;background:linear-gradient(90deg,#51d2ff 60%,#38405f 60%)}
#bvb-beta-home .coins{font-weight:900;color:#ffc65f;font-size:1.3rem}
#bvb-beta-home .top button{color:#eee2fa;background:#1b1c40;border:1px solid #8977b4;border-radius:10px;padding:9px 12px;cursor:pointer}
#bvb-beta-home .heading{text-align:center;padding:14px 10px 10px}
#bvb-beta-home .heading h1{font-size:clamp(2.2rem,5.6vw,5rem);margin:0;line-height:1.03;letter-spacing:.04em;color:#ffbb4f;text-shadow:0 4px 0 #6f290c,0 0 22px #f585328a;background:none;-webkit-text-fill-color:initial}
#bvb-beta-home .heading p{margin:8px 0 4px;letter-spacing:.17em;font-size:.85rem;color:#dec4e3}
#bvb-beta-home .layout{display:grid;grid-template-columns:minmax(160px,24%) minmax(200px,1fr) minmax(190px,26%);gap:18px;padding:12px 22px 22px}
#bvb-beta-home .box{background:linear-gradient(160deg,#0e1229e6,#111126e8);border:1px solid #a28eb4a8;border-radius:19px;padding:18px 15px;box-shadow:inset 0 0 25px #58416d30}
#bvb-beta-home .box h2{margin:0 0 12px;font-size:1.15rem;color:#ffcb6f;letter-spacing:.02em}
#bvb-beta-home .nav{display:flex;flex-direction:column;gap:8px}
#bvb-beta-home button{font-family:inherit}
#bvb-beta-home .nav button,#bvb-beta-home .smallnav button{cursor:pointer;border-radius:12px;border:1px solid #6774a4;color:#f9f2ff;background:linear-gradient(#2a345a,#151b33);padding:11px 7px;font-weight:750;box-shadow:0 3px 0 #050915a1;transition:transform .16s,filter .16s}
#bvb-beta-home button:hover:not(:disabled){filter:brightness(1.22);transform:translateY(-2px)}
#bvb-beta-home button:focus-visible{outline:3px solid #ffbe50;outline-offset:3px}
#bvb-beta-home button:disabled{opacity:.46;cursor:not-allowed}
#bvb-beta-home .nav button:first-child{background:linear-gradient(#1260b1,#132b5e);border-color:#4bcaff}
#bvb-beta-home .center{text-align:center;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;min-width:0}
#bvb-beta-home .orbs{position:relative;display:flex;justify-content:center;align-items:center;gap:2vw;width:100%;min-height:268px;padding:15px 0 25px}
#bvb-beta-home .hero-orb{position:relative;display:grid;place-items:center;flex:none;width:clamp(68px,10vw,145px);height:clamp(68px,10vw,145px);border-radius:50%;font-size:clamp(2rem,5vw,4.6rem);text-shadow:0 0 15px #fff9;box-shadow:inset -13px -15px 25px #140818aa,0 0 28px var(--glow);border:3px solid var(--ring);animation:bvbBetaBob 3s ease-in-out infinite alternate}
#bvb-beta-home .hero-orb:nth-child(2){animation-delay:-1s}
#bvb-beta-home .hero-orb:nth-child(3){animation-delay:-2s}
#bvb-beta-home .hero-orb.chess{--ring:#ffcb72;--glow:#ffb12b88;background:repeating-conic-gradient(#eddfc1 0 25%,#222137 0 50%) 0 0/42px 42px}
#bvb-beta-home .hero-orb.vamp{--ring:#f58546;--glow:#d71b6899;background:radial-gradient(circle at 30% 20%,#f76885,#710c35 70%,#21071c)}
#bvb-beta-home .hero-orb.phoenix{--ring:#ffb83b;--glow:#ff6329ca;background:radial-gradient(circle at 25% 24%,#ffc45c,#ff5c1a 55%,#3c0a13)}
#bvb-beta-home .hero-orb.phoenix:before,#bvb-beta-home .hero-orb.phoenix:after{content:'🔥';position:absolute;font-size:60%;top:8%;z-index:-1}
#bvb-beta-home .hero-orb.phoenix:before{left:-34%;transform:rotate(-34deg)}
#bvb-beta-home .hero-orb.phoenix:after{right:-34%;transform:scaleX(-1) rotate(-34deg)}
@keyframes bvbBetaBob{from{transform:translateY(7px) rotate(-3deg)}to{transform:translateY(-7px) rotate(3deg)}}
#bvb-beta-home .play{min-width:min(85%,440px);padding:18px 30px;margin:10px auto;font-weight:1000;font-size:clamp(1.5rem,3vw,2.4rem);border-radius:16px;border:2px solid #ffe5a2;background:linear-gradient(170deg,#ffdf84,#f19c23);color:#241007;cursor:pointer;box-shadow:0 7px 0 #915011,0 0 24px #f5a62890}
#bvb-beta-home .smallnav{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;padding:6px 22px 22px}
#bvb-beta-home .smallnav button{font-size:.8rem;min-height:46px}
#bvb-beta-home .sidecol{display:flex;flex-direction:column;gap:14px}
#bvb-beta-home .count-title{font-size:.98rem;color:#f9e4db}
#bvb-beta-home .date{text-align:center;color:#ccb5d9;font-size:.82rem;margin:6px 0 13px}
#bvb-beta-home .timer{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
#bvb-beta-home .timer span{display:grid;gap:4px;text-align:center;padding:8px 2px;border:1px solid #cf7f2b;border-radius:9px;background:#1f142c;min-width:0}
#bvb-beta-home .timer strong{color:#ffb747;font-size:clamp(.96rem,1.9vw,1.5rem);font-variant-numeric:tabular-nums}
#bvb-beta-home .timer small{font-size:.59rem;color:#ffdfae}
#bvb-beta-home .chests{display:flex;justify-content:space-around;gap:6px;text-align:center}
#bvb-beta-home .chests .chest{display:flex;flex-direction:column;gap:7px;font-weight:650;font-size:.67rem}
#bvb-beta-home .chests i{font-style:normal;font-size:clamp(1.7rem,3.2vw,3rem);filter:drop-shadow(0 4px 6px #0009)}
#bvb-beta-home .bottom{font-size:.7rem;color:#ba97ca;text-align:center;padding-bottom:17px}
@media(max-width:880px){#bvb-beta-home .layout{grid-template-columns:1fr 1fr;gap:10px;padding:10px}#bvb-beta-home .center{grid-column:1/-1;grid-row:1}#bvb-beta-home .nav{display:grid;grid-template-columns:1fr 1fr}#bvb-beta-home .orbs{min-height:175px}#bvb-beta-home .smallnav{grid-template-columns:repeat(3,1fr);padding:10px}#bvb-beta-home .top{flex-wrap:wrap;padding:10px}}
@media(max-width:480px){#bvb-beta-home .layout{grid-template-columns:1fr}#bvb-beta-home .sidecol{grid-row:3}#bvb-beta-home .orbs{min-height:135px}#bvb-beta-home .smallnav{grid-template-columns:repeat(2,1fr)}#bvb-beta-home .box{padding:12px}}
@media(prefers-reduced-motion:reduce){#bvb-beta-home .hero-orb{animation:none}}
`;
 document.head.appendChild(css);
 const page=document.createElement('section');
 page.id='bvb-beta-home';
 page.setAttribute('aria-label','Menu Halloween Ball VS Ball — beta');
 page.innerHTML='<div class="mist"></div><div class="moon"></div><div class="trees"></div>'
  +'<header class="top"><span id="bvb-beta-profile">Gracz · PODGLĄD&nbsp;&nbsp; Poziom 1 <span class="level"></span></span><span class="coins" id="bvb-beta-coins">🪙 0</span><button data-action="settings">⚙️ Ustawienia</button></header>'
  +'<div class="heading"><h1>BALL VS BALL</h1><p>OSTATNIE CHWILE HALLOWEEN</p></div>'
  +'<div class="layout"><aside class="box"><h2>NAWIGACJA</h2><nav class="nav">'
  +'<button data-action="home">Menu główne</button><button data-action="modes">Tryby gry</button><button data-action="collection">Kolekcja kulek</button><button data-action="crates">Skrzynie</button><button data-action="shop">Sklep</button><button data-action="ranking">Ranking</button><button data-action="profile">Profil</button>'
  +'</nav></aside>'
  +'<div class="center"><div class="orbs"><div class="hero-orb chess" title="Szachy">♛</div><div class="hero-orb vamp" title="Halloween">🦇</div><div class="hero-orb phoenix" title="Feniks">🔥</div></div><button class="play" data-action="play">GRAJ</button></div>'
  +'<aside class="sidecol"><section class="box"><h2>AKTUALNOŚCI</h2><div class="count-title">Odejście Halloween</div><div class="date">07.11.2026 · 16:00 (Polska)</div><div class="timer" role="timer"><span><strong id="bh-d">00</strong><small>DNI</small></span><span><strong id="bh-h">00</strong><small>GODZ.</small></span><span><strong id="bh-m">00</strong><small>MIN.</small></span><span><strong id="bh-s">00</strong><small>SEK.</small></span></div><p id="bh-end" hidden>Halloween dobiegło końca</p></section>'
  +'<section class="box"><h2>SKRZYNIE</h2><div class="chests"><div class="chest"><i>🎁</i>Zwykła</div><div class="chest"><i>📦</i>Epicka</div><div class="chest"><i>🏆</i>Legendarna</div></div></section></aside></div>'
  +'<div class="smallnav"><button data-action="training">Trening</button><button data-action="campaign">Kampania</button><button data-action="bosses">Bossowie</button><button data-action="multiplayer">Multiplayer</button><button data-action="quests">Zadania</button><button data-action="rewards">Nagrody</button><button data-action="settings">Ustawienia</button><button data-action="collection">Ekwipunek</button></div>'
  +'<div class="bottom">WERSJA BETA · ZMIENIONO WYŁĄCZNIE MENU · GRY NIE OPUBLIKOWANO W ORYGINALE</div>';
 root.prepend(page);
 const sync=()=>{page.hidden=native?native.hidden:false;};
 if(native)new MutationObserver(sync).observe(native,{attributes:true,attributeFilter:['hidden']});
 sync();
 const actions={
  home:()=>window.BVBMenu?.open('home'),
  modes:()=>window.BVBMenu?.open('modes')||(!window.BVBMenu&&window.startMatch?.()),
  play:()=>window.BVBMenu?.open('modes')||(!window.BVBMenu&&window.startMatch?.()),
  bosses:()=>window.BVBMenu?.open('bosses')||(!window.BVBMenu&&window.startMatch?.(0)), 
  rewards:()=>window.BVBMenu?.open('rewards')||(!window.BVBMenu&&window.panel?.('q')),
  settings:()=>window.BVBMenu?.open('settings')||(!window.BVBMenu&&window.panel?.('set')),
  collection:()=>window.panel?.('col'),
  crates:()=>window.panel?.('shop'),
  shop:()=>window.panel?.('st'),
  ranking:()=>{window.panel?.(window.BVBMenu?'account':'pr');window.BVBCloud?.ranking?.();},
  profile:()=>window.panel?.('pr'),
  multiplayer:()=>window.mpMenu?.(),
  training:()=>window.startMatch?.(4),
  campaign:()=>window.BVBCampaign?.open?.()||(!window.BVBCampaign&&window.startMatch?.(0)),
  quests:()=>window.panel?.('q')
 };
 page.addEventListener('click',event=>{const b=event.target.closest('button[data-action]');if(!b)return;const f=actions[b.dataset.action];if(f)f();});
 function tick(){
  const seconds=Math.max(0,Math.ceil((DEADLINE-Date.now())/1000));
  const numbers=[Math.floor(seconds/86400),Math.floor((seconds%86400)/3600),Math.floor((seconds%3600)/60),seconds%60];
  ['d','h','m','s'].forEach((unit,i)=>{const el=document.getElementById('bh-'+unit);if(el)el.textContent=String(numbers[i]).padStart(2,'0');});
  document.getElementById('bh-end').hidden=seconds>0;
  try{
   if(typeof S!=='undefined'&&S){document.getElementById('bvb-beta-coins').textContent='🪙 '+Number(S.coins||0).toLocaleString('pl-PL');document.getElementById('bvb-beta-profile').firstChild.textContent='Gracz · PODGLĄD   Poziom '+(S.lv||1)+'  '; }
  }catch(_){}
 }
 tick();setInterval(tick,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();
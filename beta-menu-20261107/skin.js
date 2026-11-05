/* Ball VS Ball 2.5: isolated standard beta menu; no modifications to battle/game state */
(()=>{'use strict';
 const init=()=>{
  const menu=document.getElementById('menu');
  const native=document.getElementById('bvb3Home');
  if(!menu){setTimeout(init,350);return}
  if(document.getElementById('bvb25-home'))return;
  const style=document.createElement('style');style.id='bvb25-style';
  style.textContent=`
  #menu:has(#bvb25-home:not([hidden])) > :not(#bvb25-home){display:none!important}
  #app:has(#bvb25-home:not([hidden])){max-width:1660px!important;width:100%!important;box-sizing:border-box;padding:8px!important}
  #bvb25-home{--gold:#ffce72;--cyan:#4adfff;--line:#61b9ed90;box-sizing:border-box;position:relative;isolation:isolate;width:100%;color:#f6f8ff;min-height:min(860px,95vh);overflow:hidden;border:1px solid #69aaff85;border-radius:23px;background:radial-gradient(ellipse at 53% 65%,#164987d1,transparent 40%),radial-gradient(ellipse at 49% 10%,#23508a55,transparent 55%),linear-gradient(155deg,#040b20,#081d3b 48%,#030b20);box-shadow:0 12px 45px #000b,inset 0 0 80px #3276ac15;font-family:system-ui,'Segoe UI',sans-serif;text-align:left}
  #bvb25-home *,#bvb25-home *::before,#bvb25-home *::after{box-sizing:border-box}
  #bvb25-home[hidden],#bvb25-home [hidden]{display:none!important}
  #bvb25-home:before{content:'';position:absolute;inset:-15%;z-index:-2;pointer-events:none;opacity:.35;background:radial-gradient(circle at 15% 27%,#2985db6e 0 1px,transparent 3px),radial-gradient(circle at 76% 40%,#dcfaffc4 0 1px,transparent 3px),radial-gradient(circle at 63% 11%,#a9cbffc0 0 1px,transparent 3px);background-size:90px 140px,123px 97px,143px 150px;animation:b25space 24s linear infinite}
  #bvb25-home:after{content:'';pointer-events:none;position:absolute;inset:auto 0 0;height:27%;z-index:-1;background:repeating-linear-gradient(104deg,transparent 0 45px,#1e68ad25 46px 47px,transparent 48px 104px),linear-gradient(0deg,#010817c9,#24488629 75%,transparent)}
  #bvb25-home button{font:inherit;cursor:pointer;color:inherit}
  #bvb25-home button:focus-visible,#bvb25-home input:focus-visible,#bvb25-home select:focus-visible{outline:3px solid #ffdf8e;outline-offset:3px}
  #bvb25-home button:hover:not(:disabled){filter:brightness(1.16)}
  #bvb25-home button:active:not(:disabled){transform:translateY(2px) scale(.99)}
  #bvb25-home .head{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:13px 23px;background:linear-gradient(#081329e0,#0d2852b9);border-bottom:1px solid #75b6fa58}
  #bvb25-home .player{display:flex;gap:11px;align-items:center;min-width:0}
  #bvb25-home .portrait{width:48px;height:48px;border-radius:50%;border:2px solid #f4b85d;background:radial-gradient(circle at 32% 30%,#fff3c4,#da8226 26%,#3d270f 70%);box-shadow:0 0 18px #ff9b2e55;display:grid;place-items:center;color:#301b0a;font-size:27px}
  #bvb25-home .username{font-size:1.03rem;font-weight:850}
  #bvb25-home .level{color:#aed0f5;font-size:.74rem;margin:2px 0 5px}
  #bvb25-home .xp{display:block;width:165px;max-width:27vw;height:7px;border:1px solid #558ece;border-radius:8px;background:#0e2145;overflow:hidden}
  #bvb25-home .xp i{display:block;width:40%;height:100%;background:linear-gradient(90deg,#29b4ff,#8defff)}
  #bvb25-home .resources{display:flex;gap:12px;align-items:center;font-size:1.05rem;font-weight:800}
  #bvb25-home .coins{display:flex;align-items:center;gap:9px;padding:9px 18px;background:#07142c;border:1px solid #b99055;border-radius:12px;min-width:115px;justify-content:center}
  #bvb25-home .coins b{color:#ffcb60}
  #bvb25-home .gear{background:#0d254c;border:1px solid #5e8fca;padding:8px 12px;border-radius:10px}
  #bvb25-home .layout{display:grid;grid-template-columns:minmax(150px,19%) minmax(300px,1fr) minmax(204px,24%);gap:13px;padding:13px 18px 5px;min-height:565px}
  #bvb25-home .left{display:flex;flex-direction:column;gap:9px;padding-top:9px}
  #bvb25-home .nav{border:1px solid #5090ca;border-radius:12px;padding:14px 12px;min-height:48px;background:linear-gradient(130deg,#14294d,#081a34);box-shadow:inset 0 0 15px #2d65ad30,0 4px 7px #0007;text-align:left;font-weight:760;transition:filter .2s,transform .2s,border-color .2s,box-shadow .2s}
  #bvb25-home .nav span{font-size:1.2rem;margin-right:8px}
  #bvb25-home .nav.active{border-color:#ffd58a;color:#ffe8b6;background:linear-gradient(120deg,#6c4716,#19263b);box-shadow:0 0 18px #dfa34844}
  #bvb25-home .center{min-width:0;display:flex;align-items:center;flex-direction:column;justify-content:flex-start;position:relative}
  #bvb25-home .logo{text-align:center;font-weight:1000;font-style:italic;letter-spacing:-.06em;font-size:clamp(2rem,4.2vw,4.5rem);line-height:.99;margin:13px 0 8px;filter:drop-shadow(0 4px 0 #020a18);text-shadow:1px 1px 2px #fff8,0 0 20px #3ccaff66}
  #bvb25-home .logo .blue{color:#d6f3ff}#bvb25-home .logo .gold{color:#ffd676}#bvb25-home .logo small{display:block;font-size:.7em;color:#9cdfff;letter-spacing:.04em}
  #bvb25-home .heroes{width:100%;display:flex;align-items:center;justify-content:space-evenly;gap:7px;min-height:245px;margin:12px 0 0;position:relative}
  #bvb25-home .hero-wrap{position:relative;width:31%;display:grid;place-items:center}
  #bvb25-home .platform{width:99%;height:22px;border-radius:50%;background:radial-gradient(ellipse,#89e3ffdd 0,#217bdb80 35%,#12385933 64%,transparent 80%);box-shadow:0 0 22px #31c0ffbb;transform:perspective(110px) rotateX(43deg)}
  #bvb25-home .hero{position:relative;width:min(13vw,156px);height:min(13vw,156px);min-width:78px;min-height:78px;border-radius:50%;display:grid;place-items:center;font-size:clamp(2rem,5vw,4.2rem);text-shadow:0 4px 7px #000a,0 0 13px #fff6;box-shadow:inset -22px -24px 28px #020613b9,inset 12px 12px 20px #fff3,0 6px 30px var(--glow),0 0 0 3px var(--border);animation:b25float 2.9s ease-in-out infinite alternate}
  #bvb25-home .hero:after{content:'';position:absolute;inset:8% 16% auto;height:19%;border-radius:100%;background:linear-gradient(#fff8,transparent);transform:rotate(-18deg);pointer-events:none}
  #bvb25-home .hero.chess{--glow:#f4c865a0;--border:#d7b15d;background:repeating-conic-gradient(#fee3a6 0 12.5%,#27314b 12.5% 25%)}
  #bvb25-home .hero.vamp{--glow:#f64975c7;--border:#f26468;background:radial-gradient(circle at 32% 20%,#fa637e,#9b123f 46%,#240925)}
  #bvb25-home .hero.fire{--glow:#ff8b28dc;--border:#f8ad56;background:radial-gradient(circle at 30% 25%,#fff29c,#fa882d 31%,#ab200f 68%,#271024)}
  #bvb25-home .hero-wrap:nth-child(2) .hero{animation-delay:-.8s}#bvb25-home .hero-wrap:nth-child(3) .hero{animation-delay:-1.6s}
  #bvb25-home .play{width:min(83%,480px);margin:15px 0 0;border:2px solid #ffe3a4;color:#351c02;background:linear-gradient(180deg,#fff0a0,#ffab19 48%,#d07500);padding:16px;border-radius:16px;font-size:clamp(1.6rem,3.1vw,2.55rem);font-weight:1000;letter-spacing:.15em;box-shadow:0 8px 0 #704008,0 0 24px #ffb52695;transition:transform .16s,filter .16s}
  #bvb25-home .shortcut{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;width:100%;margin-top:24px}
  #bvb25-home .short{border:1px solid #368bcc;border-radius:12px;background:linear-gradient(140deg,#153f75,#061b35);padding:11px 2px 10px;min-height:73px;font-weight:800;font-size:.79rem;box-shadow:0 4px 14px #0008;transition:transform .2s}
  #bvb25-home .short span{display:block;font-size:1.7rem;margin-bottom:3px}
  #bvb25-home .right{display:flex;flex-direction:column;gap:13px}
  #bvb25-home .box{border:1px solid #639cd4aa;border-radius:13px;background:linear-gradient(160deg,#091b36ed,#081129ed);padding:13px;box-shadow:inset 0 0 20px #2784ff14}
  #bvb25-home .box h3{margin:0 0 12px;padding-bottom:6px;border-bottom:1px solid #3a6aa588;font-size:.98rem}
  #bvb25-home .news{height:155px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;background:radial-gradient(circle at 55% 60%,#3187dc70,#082748 50%,#051124);border:1px solid #367ab5;font-weight:850}
  #bvb25-home .news span{font-size:2.5rem;filter:drop-shadow(0 0 15px #67d9ff)}
  #bvb25-home .news p{margin:0;font-size:.85rem}#bvb25-home .dots{display:flex;gap:6px;justify-content:center;margin-top:9px}#bvb25-home .dot{height:7px;width:7px;background:#3b648b;border-radius:100%}#bvb25-home .dot.active{background:#4cddff}
  #bvb25-home .chests{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
  #bvb25-home .chest{display:grid;gap:5px;align-items:center;justify-items:center;background:#111e3c;border:1px solid #45689b;border-radius:11px;padding:8px 3px;min-width:0;font-size:.62rem}
  #bvb25-home .chest i{font-size:clamp(1.6rem,2.6vw,2.8rem);font-style:normal;filter:drop-shadow(0 4px 5px #000a)}
  #bvb25-home .bottom{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:3px 18px 16px}
  #bvb25-home .bottom button{padding:12px 5px;border:1px solid #5a9ac8;border-radius:12px;background:linear-gradient(#163660,#081b38);font-size:.85rem;font-weight:760;min-height:55px}
  #bvb25-home .bottom button span{margin-right:6px}
  #bvb25-home .foot{text-align:center;font-size:.65rem;color:#94b2d8;padding-bottom:10px;letter-spacing:.1em}
  #bvb25-home .overlay{position:absolute;inset:0;z-index:4;overflow:auto;background:linear-gradient(160deg,#06132cf7,#0d2346f5);padding:25px;animation:b25enter .25s ease-out}
  #bvb25-home .overlay h2{margin:5px 0 8px;color:#ffdc96}
  #bvb25-home .back{border:1px solid #7cafec;background:#193865;border-radius:9px;padding:9px 16px;margin-bottom:12px}
  #bvb25-home .note{border:1px solid #5378a7;padding:12px;background:#10264a;border-radius:11px;margin:14px 0;color:#cbdffe}
  #bvb25-home .collection-toolbar{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin:14px 0}
  #bvb25-home .collection-toolbar input,#bvb25-home .collection-toolbar select{padding:9px;border:1px solid #5b87c5;border-radius:9px;background:#0b1c3a;color:white;max-width:100%}
  #bvb25-home .ball-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:9px;margin:12px 0}
  #bvb25-home .ball-card{background:#112a4b;border:1px solid #447ba8;border-radius:11px;padding:10px 6px;text-align:center;min-width:0;color:white}
  #bvb25-home .ball-card.locked{opacity:.7}
  #bvb25-home .ball-card .mini{margin:0 auto 6px;display:grid;place-items:center;font-size:1.7rem;width:57px;height:57px;border-radius:50%;border:2px solid #baccf1;background:radial-gradient(circle at 30% 25%,#e3f4ff,#4d7ac5 52%,#10264b);box-shadow:0 0 15px #2daafa44}
  #bvb25-home .ball-card b{display:block;overflow-wrap:anywhere;font-size:.8rem}#bvb25-home .ball-card small{font-size:.7rem;color:#b1c9e9}
  #bvb25-home .view-actions{display:flex;flex-wrap:wrap;gap:9px}
  #bvb25-home .view-actions button{border:1px solid #7aa7c9;background:#1a3d69;border-radius:10px;padding:12px 16px;font-weight:850}
  #bvb25-home .view-actions button:disabled{opacity:.45;cursor:not-allowed}
  @keyframes b25float{from{transform:translateY(5px)}to{transform:translateY(-8px)}}
  @keyframes b25enter{from{opacity:0;transform:translateY(11px)}to{opacity:1;transform:none}}
  @keyframes b25space{from{transform:translateY(0)}to{transform:translateY(60px)}}
  @media(max-width:1100px){#bvb25-home .layout{grid-template-columns:170px minmax(250px,1fr);gap:11px}#bvb25-home .right{grid-column:1/-1;flex-direction:row}#bvb25-home .right>.box{flex:1}#bvb25-home .right .news{height:105px}#bvb25-home .layout{min-height:610px}#bvb25-home .hero{width:130px;height:130px}}
  @media(max-width:650px){#bvb25-home{border-radius:9px;min-height:650px}#bvb25-home .head{padding:8px 10px;gap:8px}#bvb25-home .portrait{width:36px;height:36px;font-size:22px}#bvb25-home .username{font-size:.83rem}#bvb25-home .xp{width:90px}#bvb25-home .coins{padding:7px;min-width:auto;font-size:.85rem}#bvb25-home .layout{display:flex;flex-direction:column;padding:8px}#bvb25-home .left{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}#bvb25-home .nav{min-height:43px;padding:7px 5px;text-align:center;font-size:.7rem}#bvb25-home .nav span{display:block;font-size:1.2rem;margin:0}#bvb25-home .logo{font-size:2.3rem;margin-top:10px}#bvb25-home .heroes{min-height:158px;margin-top:0}#bvb25-home .hero{width:clamp(78px,22vw,118px);height:clamp(78px,22vw,118px);min-width:0;min-height:0;font-size:2rem}#bvb25-home .play{padding:13px;width:83%;font-size:1.6rem}#bvb25-home .shortcut{margin-top:12px}#bvb25-home .short{min-height:60px;padding:6px 0;font-size:.66rem}#bvb25-home .short span{font-size:1.2rem}#bvb25-home .right{display:grid;grid-template-columns:1fr 1fr;gap:8px}#bvb25-home .right .box{padding:9px}#bvb25-home .right .news{height:100px}#bvb25-home .box h3{font-size:.8rem;margin-bottom:5px}#bvb25-home .chest{font-size:.53rem;padding:5px 1px}#bvb25-home .chest i{font-size:1.4rem}#bvb25-home .bottom{padding:8px;gap:4px}#bvb25-home .bottom button{padding:6px 2px;font-size:.65rem;min-height:47px}#bvb25-home .bottom button span{display:block;margin:0}#bvb25-home .overlay{padding:12px}}
  @media(max-width:410px){#bvb25-home .right{grid-template-columns:1fr}#bvb25-home .bottom{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(prefers-reduced-motion:reduce){#bvb25-home *,#bvb25-home::before{animation:none!important;transition:none!important}}
  `;
  document.head.append(style);
  const app=document.createElement('section');app.id='bvb25-home';app.setAttribute('aria-label','Ball VS Ball 2.5 — standardowe menu beta');
  const mkBtn=(a,label,cls='')=>`<button type="button" data-act="${a}" class="${cls}">${label}</button>`;
  app.innerHTML=`<header class="head"><div class="player"><span class="portrait">♛</span><div><div id="b25-name" class="username">Gracz</div><div id="b25-level" class="level">Poziom 1</div><div class="xp"><i id="b25-xp"></i></div></div></div><div class="resources"><div class="coins">🪙 <b id="b25-coins">0</b></div>${mkBtn('settings','⚙️','gear')}</div></header>
  <div class="layout"><aside class="left">${mkBtn('home','<span>⌂</span> Menu główne','nav active')}${mkBtn('modes','<span>⚔</span> Tryby gry','nav')}${mkBtn('collection','<span>◉</span> Kolekcja kulek','nav')}${mkBtn('crates','<span>▣</span> Skrzynie','nav')}${mkBtn('shop','<span>🛒</span> Sklep','nav')}${mkBtn('profile','<span>♙</span> Profil','nav')}</aside>
  <main class="center"><div class="logo"><span class="gold">BALL</span> <span class="blue">VS</span> <span class="gold">BALL</span><small>2.5</small></div><div class="heroes"><div class="hero-wrap"><span class="hero chess" aria-label="Szachy">♛</span><span class="platform"></span></div><div class="hero-wrap"><span class="hero vamp" aria-label="Wampir">🦇</span><span class="platform"></span></div><div class="hero-wrap"><span class="hero fire" aria-label="Feniks">🔥</span><span class="platform"></span></div></div>${mkBtn('play','▶ GRAJ','play')}<div class="shortcut">${mkBtn('training','<span>🎯</span>Trening','short')}${mkBtn('campaign','<span>📖</span>Kampania','short')}${mkBtn('bosses','<span>👑</span>Bossowie','short')}${mkBtn('multiplayer','<span>♟</span>Multiplayer','short')}</div></main>
  <aside class="right"><section class="box"><h3>AKTUALNOŚCI</h3><div class="news"><span>✦</span><p>NOWA ERA<br>BALL VS BALL 2.5</p></div><div class="dots"><i class="dot active"></i><i class="dot"></i><i class="dot"></i></div></section><section class="box"><h3>SKRZYNIE</h3><div class="chests">${mkBtn('chest-normal','<i>🧰</i>Zwykła','chest')}${mkBtn('chest-epic','<i>🎁</i>Epicka','chest')}${mkBtn('chest-legend','<i>👑</i>Legendarna','chest')}</div></section></aside></div>
  <div class="bottom">${mkBtn('quests','<span>📜</span>Zadania')}${mkBtn('rewards','<span>⭐</span>Nagrody')}${mkBtn('replays','<span>🎞</span>Powtórki')}${mkBtn('settings','<span>⚙</span>Ustawienia')}</div><div class="foot">STANDARDOWA BETA 2.5 · MENU INTERAKTYWNE · ORYGINALNA GRA BEZ ZMIAN</div><section class="overlay" id="b25-view" hidden aria-live="polite"></section>`;
  menu.prepend(app);
  const view=app.querySelector('#b25-view');
  const can=(name)=>typeof window.BVBMenu?.open==='function'&&!!document.getElementById('bvb3_'+name);
  const openNative=(name)=>{if(can(name)){window.BVBMenu.open(name);return true}return false};
  const getList=()=>{try{return (typeof B!=='undefined'&&Array.isArray(B))?B:[]}catch(_){return []}};
  const getSave=()=>{try{return typeof S!=='undefined'?S:null}catch(_){return null}};
  const have=(save)=>new Set((save?.own||[]).map(Number));
  const safeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function show(title,body){view.hidden=false;view.innerHTML=`${mkBtn('close','← Wróć','back')}<h2>${safeText(title)}</h2>${body}`;view.scrollTop=0;}
  function viewCollection(query='',sort='owned'){
   const list=getList();const own=have(getSave());
   if(!list.length){show('Kolekcja kulek','<p class="note">Kolekcja nie jest jeszcze dostępna w tej wersji silnika.</p>');return}
   const mapped=list.filter(Boolean).map((b,i)=>({id:Number(b.id??i),name:String(b.n??b.name??('Kulka '+i)),symbol:String(b.e??'◉'),owned:own.has(Number(b.id??i)),rarity:String(b.rar??b.rarity??'')}));
   mapped.sort((a,b)=>(sort==='name'?a.name.localeCompare(b.name,'pl'):(a.owned===b.owned?a.id-b.id:a.owned?-1:1)));
   const kept=mapped.filter(x=>x.name.toLowerCase().includes(query.toLowerCase()));
   const count=mapped.filter(x=>x.owned).length;
   show('Kolekcja kulek',`<p class="note"><b>KULKI ${count}/${mapped.length}</b> · Odblokowane na górze, zablokowane poniżej. Zdobywanie nowych kulek tylko przez skrzynie.</p><div class="collection-toolbar"><input id="b25-search" placeholder="Szukaj kulki" aria-label="Szukaj kulki" value="${safeText(query)}"><select id="b25-sort" aria-label="Sortuj kulki"><option value="owned" ${sort==='owned'?'selected':''}>Odblokowane najpierw</option><option value="name" ${sort==='name'?'selected':''}>Alfabetycznie</option></select></div><div class="ball-grid">${kept.map(x=>`<button type="button" data-ball="${x.id}" class="ball-card${x.owned?'':' locked'}"><span class="mini">${safeText(x.symbol)}</span><b>${safeText(x.name)}</b><small>${x.owned?'✓ Odblokowana':'🔒 Zablokowana'}</small></button>`).join('')}</div><p class="note">Podgląd dokładnych ewolucji i grafiki V1/V2/V3 wymaga pełnych zatwierdzonych zasobów gry — nie są tutaj zastępowane wymyślonymi modelami.</p>`);
  }
  function showBall(id){
   const b=getList().find((ball,i)=>Number(ball?.id??i)===id);if(!b)return;
   const owned=have(getSave()).has(id);const title=b.n??b.name??('Kulka '+id);
   show(title,`<div class="note"><strong>${owned?'✓ W kolekcji':'🔒 Nieodblokowana'}</strong><p>${safeText(b.d??b.desc??'Opis umiejętności znajduje się w grze.')}</p><p>Warianty V1/V2/V3 sprawdzaj w kolekcji pełnej wersji gry; ten ekran nie udaje ich wyglądu.</p></div><div class="view-actions">${mkBtn('collection','← Kolekcja')}${mkBtn('native-collection','Otwórz kolekcję w grze')}</div>`);
  }
  function info(title,description,actions){show(title,`<p class="note">${description}</p><div class="view-actions">${actions}</div>`)};
  function action(type){
   if(type==='home'||type==='close'){view.hidden=true;return}
   if(type==='modes'||type==='play'){
    if(openNative('modes'))return;
    info('Tryby gry','Wybierz tryb, aby rozpocząć walkę.',`${mkBtn('fight','⚔ Walka z botem')}${mkBtn('training','🎯 Trening')}${mkBtn('campaign','📖 Kampania')}`);return
   }
   if(type==='fight'){window.startMatch?.(0);return}
   if(type==='training'){window.startMatch?.(4);if(!document.getElementById('menu')?.hidden)info('Trening','Trening nie jest aktywny w tej wersji silnika. Nie wyświetlam nieistniejącej rundy.',mkBtn('close','Wróć'));return}
   if(type==='campaign'){if(typeof window.BVBCampaign?.open==='function')window.BVBCampaign.open();else info('Kampania','Kampania nie jest dostępna w tej wersji silnika.',mkBtn('close','Wróć'));return}
   if(type==='bosses'){if(!openNative('bosses'))info('Bossowie','Tryb bossów nie jest jeszcze podłączony do tej wersji silnika.',mkBtn('close','Wróć'));return}
   if(type==='collection'){viewCollection();return}
   if(type==='native-collection'){window.panel?.('col');return}
   if(type==='crates'||type.startsWith('chest-')){window.panel?.('shop');return}
   if(type==='shop'){window.panel?.('st');return}
   if(type==='profile'){window.panel?.('pr');return}
   if(type==='multiplayer'){window.mpMenu?.();return}
   if(type==='quests'){window.panel?.('q');return}
   if(type==='rewards'){if(!openNative('rewards'))window.panel?.('bp');return}
   if(type==='replays'){if(typeof window.replayMenu==='function')window.replayMenu();else info('Powtórki','Funkcja powtórek wymaga nagranych rund i nie jest jeszcze podłączona. Nie pokazuję nieistniejących nagrań.',mkBtn('close','Wróć'));return}
   if(type==='settings'){if(!openNative('settings'))window.panel?.('set');return}
  }
  app.addEventListener('click',e=>{
   const card=e.target.closest('[data-ball]');if(card){showBall(Number(card.dataset.ball));return}
   const btn=e.target.closest('button[data-act]');if(!btn)return;
   action(btn.dataset.act);
  });
  app.addEventListener('input',e=>{if(e.target.id==='b25-search'){const p=e.target.selectionStart;const q=e.target.value;const sort=app.querySelector('#b25-sort')?.value||'owned';viewCollection(q,sort);const newInput=app.querySelector('#b25-search');newInput.focus();newInput.setSelectionRange(p,p)}});
  app.addEventListener('change',e=>{if(e.target.id==='b25-sort')viewCollection(app.querySelector('#b25-search')?.value||'',e.target.value)});
  const sync=()=>{app.hidden=Boolean(native?.hidden)};
  if(native)new MutationObserver(sync).observe(native,{attributes:true,attributeFilter:['hidden']});
  sync();
  function state(){const s=getSave();if(!s)return;app.querySelector('#b25-coins').textContent=Number(s.coins||0).toLocaleString('pl-PL');app.querySelector('#b25-level').textContent='Poziom '+String(s.lv||1);try{const n=s.nick||s.name||s.username||'Gracz';app.querySelector('#b25-name').textContent=n;const xp=Number(s.xp||0);app.querySelector('#b25-xp').style.width=Math.min(100,xp%100)+'%'}catch(_){}}
  state();const tick=setInterval(()=>{if(!app.isConnected){clearInterval(tick);return}state()},3000);
  window.BVB25MenuBeta={showHome:()=>{view.hidden=true;if(can('home'))window.BVBMenu.open('home')},get version(){return 'standard-menu-v1'}};
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
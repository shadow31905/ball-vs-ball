/* Ball VS Ball — menu 2.0: cztery animowane kafle i ekrany kategorii.
   Zachowuje oryginalne przyciski i system walk. */
(()=>{
'use strict';
const root=document.querySelector('#menu');if(!root||root.querySelector('#bvb3Home'))return;
const style=document.createElement('style');style.textContent="\n@media(min-width:650px){#app:has(#menu:not([hidden])){max-width:1050px}}\n#menu .bvb3-home[hidden],#menu .bvb3-screen[hidden],#menu .bvb3-legacy[hidden]{display:none!important}\n#menu .bvb3-home{padding:7px 0 16px}\n#menu .bvb3-intro{text-align:center;color:#c1d2f8;font-size:.84rem;margin:3px 0 15px;line-height:1.4}\n#menu .bvb3-grid{display:grid;grid-template-columns:1.13fr 1fr;gap:12px}\n#menu .bvb3-tile{position:relative;display:flex;flex-direction:column;gap:10px;justify-content:space-between;align-items:flex-start;min-width:0;\ntext-align:left;padding:18px;border:2px solid var(--edge);border-radius:21px;\nbackground:radial-gradient(ellipse at 85% 12%,var(--light),transparent 54%),linear-gradient(145deg,var(--bg),#0b1129 85%);\ncolor:white;min-height:196px;cursor:pointer;overflow:hidden;\nbox-shadow:0 0 18px var(--light),0 6px 0 #060b20;transition:transform .2s,box-shadow .2s}\n#menu .bvb3-tile:hover{transform:translateY(-3px);box-shadow:0 0 30px var(--light),0 8px 0 #060b20}\n#menu .bvb3-tile:active{transform:scale(.97);box-shadow:0 0 42px var(--light)}\n#menu .bvb3-tile:focus-visible{outline:3px solid white;outline-offset:3px}\n#menu .bvb3-tile::before{content:\"\";position:absolute;width:70%;height:160%;right:-10%;top:-40%;\nbackground:radial-gradient(ellipse,var(--light),transparent 63%);opacity:.25;\nanimation:bvb3Shine 7s ease-in-out infinite alternate;pointer-events:none}\n@keyframes bvb3Shine{from{transform:translateY(-10px) rotate(-14deg)}to{transform:translateY(20px) rotate(14deg)}}\n#menu .bvb3-tile.modes{--edge:#ff6f50;--light:#ff473e88;--bg:#64221f;min-height:255px}\n#menu .bvb3-tile.balls{--edge:#af68ff;--light:#973cff80;--bg:#39206c}\n#menu .bvb3-tile.rewards{--edge:#ffbe3d;--light:#ffbd4580;--bg:#5d400f}\n#menu .bvb3-tile.account{--edge:#2cdaae;--light:#16d3b480;--bg:#124445}\n#menu .bvb3-title{display:flex;align-items:center;gap:9px;font-weight:950;font-size:clamp(.93rem,2.8vw,1.35rem);line-height:1.15}\n#menu .bvb3-icon{font-size:clamp(1.7rem,4vw,2.6rem);filter:drop-shadow(0 0 7px var(--edge))}\n#menu .bvb3-desc{color:#f0f0fe;line-height:1.45;font-size:clamp(.72rem,2.1vw,.89rem)}\n#menu .bvb3-tags{display:flex;gap:6px;flex-wrap:wrap}\n#menu .bvb3-tags span{background:#07122bb3;border:1px solid #ffffff50;border-radius:8px;padding:5px 7px;font-size:.69rem;white-space:nowrap}\n#menu .bvb3-ghost{position:absolute;right:9px;top:37px;font-size:clamp(2.6rem,9vw,6rem);opacity:.16;\nfilter:drop-shadow(0 0 12px var(--edge));pointer-events:none;animation:bvb3Float 5s ease-in-out infinite alternate}\n@keyframes bvb3Float{from{transform:translateY(4px) rotate(-8deg)}to{transform:translateY(-9px) rotate(8deg)}}\n#menu .bvb3-screen{padding:12px 2px 24px;animation:bvb3In .22s ease-out}\n@keyframes bvb3In{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n#menu .bvb3-heading{text-align:center;margin:7px 0 17px}\n#menu .bvb3-heading h2{font-size:clamp(1.27rem,4vw,1.8rem);margin:0 0 7px}\n#menu .bvb3-heading p{font-size:.82rem;color:#c3d0ed;line-height:1.4}\n#menu .bvb3-back{background:#243b78!important;padding:10px 14px!important;width:auto!important;margin:0 0 10px!important}\n#menu .bvb3-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}\n#menu .bvb3-actions .b{margin:0;min-height:82px;letter-spacing:0}\n#menu .bvb3-actions .bvb-menu-hint{font-size:.76rem}\n#menu .bvb3-actions .bvb3-wide{grid-column:1/-1}\n#menu .bvb3-custom{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:5px}\n#menu .bvb3-custom .bvb-menu-title{font-size:.98rem}\n#menu .bvb3-custom .bvb-menu-hint{font-size:.77rem;color:#dbe5fd;line-height:1.4;font-weight:500}\n#menu .bvb3-note{border:1px solid #425ba4;background:#152149;border-radius:13px;padding:12px;\nmargin:12px 0;color:#dfe7ff;font-size:.8rem;line-height:1.5}\n#menu .bvb3-subtitle{color:#e4eaff;font-size:.95rem;margin:16px 0 10px}\n#menu .bvb3-levels{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}\n#menu .bvb3-level{border:1px solid #657bb4;border-radius:12px;background:#202a53;color:white;\npadding:12px 4px;font-size:.69rem;font-weight:800;word-break:normal;cursor:pointer;min-width:0}\n#menu .bvb3-level[aria-pressed=\"true\"]{background:linear-gradient(145deg,#486ed7,#784bb1);border-color:#facc15;box-shadow:0 0 14px #947ceaaa}\n#menu .bvb3-ball-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:10px 0;\nmax-height:210px;overflow-y:auto;border:1px solid #374d86;border-radius:11px;padding:7px}\n#menu .bvb3-ball{display:flex;gap:6px;align-items:center;min-width:0;text-align:left;padding:7px;\nborder:1px solid #48619a;border-radius:10px;background:#17224c;color:white;cursor:pointer}\n#menu .bvb3-ball[aria-pressed=\"true\"]{border-color:#facc15;background:#354a8b}\n#menu .bvb3-ball .orb{flex:none;--s:37px}\n#menu .bvb3-ball span:last-child{font-size:.73rem;overflow-wrap:anywhere}\n#menu .bvb3-preview{border:1px solid #647dcb;border-radius:15px;padding:14px;\nbackground:linear-gradient(145deg,#22356d,#141c3e);margin:12px 0;min-height:130px}\n#menu .bvb3-preview-top{display:flex;align-items:center;gap:12px;margin-bottom:10px;font-weight:900;font-size:1.1rem}\n#menu .bvb3-preview-top .orb{flex:none;--s:82px}\n#menu .bvb3-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:9px 0}\n#menu .bvb3-stats span{background:#101936;border-radius:9px;padding:8px 4px;text-align:center;font-size:.72rem}\n#menu .bvb3-power{background:#101934;border-left:3px solid #b784ef;padding:9px;border-radius:7px;font-size:.77rem;line-height:1.5}\n#menu .bvb3-boss{background:linear-gradient(145deg,#342051,#1b1934);border:1px solid #9165b1;\ncolor:white;border-radius:13px;padding:13px 7px;cursor:pointer;min-width:0}\n#menu .bvb3-boss span{font-size:2rem;display:block;margin-bottom:7px}\n#menu .bvb3-boss strong{font-size:.83rem;display:block}\n#menu #bvb3Ready:disabled{opacity:.45}\n@media(max-width:650px){#menu .bvb3-grid{gap:9px}#menu .bvb3-tile{padding:12px;min-height:182px}\n#menu .bvb3-tile.modes{min-height:216px}#menu .bvb3-tags span{padding:4px;font-size:.60rem}\n#menu .bvb3-ghost{opacity:.10}}\n@media(max-width:395px){#menu .bvb3-grid{grid-template-columns:1fr}\n#menu .bvb3-tile,#menu .bvb3-tile.modes{min-height:136px}#menu .bvb3-actions{grid-template-columns:1fr}\n#menu .bvb3-actions .bvb3-wide{grid-column:auto}\n#menu .bvb3-levels{grid-template-columns:repeat(2,minmax(0,1fr))}\n#menu .bvb3-level:last-child{grid-column:1/-1}}\n@media(prefers-reduced-motion:reduce){#menu .bvb3-tile::before,#menu .bvb3-ghost{animation:none}\n#menu .bvb3-tile,#menu .bvb3-screen{animation:none;transition:none}}\n";document.head.appendChild(style);
const originals=Array.from(root.querySelectorAll('button[onclick]'));
const sections=Array.from(root.querySelectorAll('.bvb-menu-section'));
const legacy=document.createElement('div');legacy.className='bvb3-legacy';legacy.hidden=true;
const intro=root.querySelector('.bvb-welcome-guide');if(intro)legacy.append(intro);
legacy.append(...sections);
const home=document.createElement('section');home.id='bvb3Home';home.className='bvb3-home';
const introText=document.createElement('p');introText.className='bvb3-intro';
introText.textContent='✨ Wybierz kategorię, aby zobaczyć dostępne funkcje.';home.append(introText);
const grid=document.createElement('div');grid.className='bvb3-grid';home.append(grid);
const screens={};
let active='home',fightType='bot',bossIndex=0,level=null,ballId=null;
function custom(text,hint,callback,extra=''){
 const b=document.createElement('button');b.type='button';b.className='b bvb3-custom '+extra;
 const n=document.createElement('span');n.className='bvb-menu-title';n.textContent=text;
 const h=document.createElement('span');h.className='bvb-menu-hint';h.textContent=hint;
 b.append(n,h);b.addEventListener('click',callback);return b;
}
function page(id,title,sub,parent='home'){
 const el=document.createElement('section');el.id='bvb3_'+id;el.className='bvb3-screen';el.hidden=true;
 el.append(custom('⬅ Wróć','',()=>open(parent),'bvb3-back'));
 const heading=document.createElement('div');heading.className='bvb3-heading';
 const h=document.createElement('h2');h.textContent=title;
 const p=document.createElement('p');p.textContent=sub;heading.append(h,p);el.append(heading);
 const list=document.createElement('div');list.className='bvb3-actions';el.append(list);
 screens[id]={el,list,parent};return screens[id];
}
for(const [key,title,sub,parent] of [
 ['modes','⚔️ TRYBY WALKI','Wybierz tryb i rozpocznij przygodę.','home'],
 ['balls','🔮 KULKI I SKLEP','Zbieraj kulki i poznawaj ich umiejętności.','home'],
 ['rewards','🎁 NAGRODY I WYDARZENIA','Odbieraj nagrody i podejmuj wyzwania.','home'],
 ['account','⚙️ KONTO I USTAWIENIA','Profil, znajomi, ranking i personalizacja.','home'],
 ['extra','✨ WIĘCEJ TRYBÓW','Dodatkowe wyzwania i multiplayer.','modes'],
 ['events','🎃 WYDARZENIA','Specjalne walki i sezonowe nagrody.','rewards'],
 ['settings','⚙️ ARENY I USTAWIENIA','Ustaw wygląd areny, muzykę i efekty.','account'],
 ['bosses','👹 WYBIERZ BOSSA','Wybierz przeciwnika przed ustaleniem trudności.','modes'],
 ['prepare','⚔️ PRZYGOTOWANIE DO WALKI','Wybierz trudność, kulkę i gotowość.','modes']
])page(key,title,sub,parent);
function get(action){return originals.find(x=>x.getAttribute('onclick')===action)}
function move(to,action,title,hint){
 const b=get(action);if(!b)return null;
 const label=b.querySelector('.bvb-menu-title');if(label&&title)label.textContent=title;
 if(hint){b.dataset.bvbMenuDescription=hint;const desc=b.querySelector('.bvb-menu-hint');if(desc)desc.textContent=hint;}
 to.append(b);return b;
}
const bot=move(screens.modes.list,'startMatch(0)','🤖 Walka z botem','Wybierz poziom trudności i kulkę.');
const boss=move(screens.modes.list,'bossMenu()','👹 Walka z bossem','Wybierz bossa, trudność i kulkę.');
if(bot)bot.setAttribute('onclick',"window.BVBMenu.prepare('bot')");
if(boss)boss.setAttribute('onclick',"window.BVBMenu.prepare('boss')");
move(screens.modes.list,'startMatch(4)','🎯 Trening','Ćwicz umiejętności swoich kulek.');
move(screens.modes.list,'window.BVBCampaign?.open?.()','🗺️ Kampania','50 poziomów i bossowie.');
screens.modes.list.append(custom('••• Więcej trybów','Survival, Boss Rush, Chaos, Turniej i PvP.',()=>open('extra'),'bvb3-wide'));
for(const action of ['startMatch(1)','startMatch(7)','startMatch(3)','startMatch(5)','startMatch(6)'])move(screens.extra.list,action);
move(screens.extra.list,'mpMenu()','🌐 Multiplayer','Zaproś znajomego do walki online.');
move(screens.balls.list,"panel('col')",'🔮 Kolekcja','Przeglądaj wszystkie kulki i ulepszenia.');
move(screens.balls.list,"panel('shop')",'📦 Skrzynki','Otwieraj skrzynki i zdobywaj kulki.');
move(screens.balls.list,"panel('st')",'🛒 Sklep','Kupuj przedmioty i dodatki.');
screens.balls.list.append(custom('✨ Podgląd umiejętności','Kliknij kulkę w kolekcji i obejrzyj jej moc.',()=>{
 panel('col');const host=document.getElementById('pb');
 if(host){const tip=document.createElement('p');tip.className='bvb3-note';
 tip.textContent='✨ Wybierz kulkę z kolekcji, aby zobaczyć animowany podgląd umiejętności.';
 host.prepend(tip);}
},'bvb3-wide'));
move(screens.rewards.list,"panel('q')",'📜 Questy','Wykonuj zadania.');
move(screens.rewards.list,"panel('ach')",'🏆 Osiągnięcia','Odblokowuj kolejne wyzwania.');
move(screens.rewards.list,"panel('bp')",'⭐ Sezon','Nagrody za postęp w sezonie.');
screens.rewards.list.append(custom('🎃 Wydarzenia','Specjalne walki i nagrody.',()=>open('events'),'bvb3-wide'));
move(screens.events.list,'startMatch(9)','🎃 Walka Halloween','Pokonaj Króla Dyń.');
move(screens.events.list,"panel('hw')",'🍬 Sklep Halloween','Kupuj i otwieraj skrzynie za cukierki.');
move(screens.account.list,"panel('pr')",'👤 Profil','Poziom i statystyki.');
move(screens.account.list,"panel('account')",'🔐 Konto','Zarządzaj swoim kontem.');
function accountPart(part){
 panel('account');
 if(part==='ranking')window.BVBCloud?.ranking?.();
 const node=document.querySelector(part==='ranking'?'#rankingResults':'#friendSearch');
 node?.scrollIntoView?.({block:'start',behavior:'auto'});
}
screens.account.list.append(custom('👥 Znajomi','Znajdź znajomych i wyślij zaproszenie.',()=>accountPart('friends')));
screens.account.list.append(custom('🏆 Ranking','Zobacz najlepszych graczy.',()=>accountPart('ranking')));
screens.account.list.append(custom('⚙️ Areny i ustawienia','Wybierz arenę, dźwięki i inne opcje.',()=>open('settings'),'bvb3-wide'));
move(screens.settings.list,"panel('arena')",'🏟️ Areny','Wybierz arenę do pojedynków.');
move(screens.settings.list,"panel('set')",'⚙️ Ustawienia','Dostosuj pozostałe opcje.');
move(screens.settings.list,'toggleSfx()','🔊 Efekty','Włącz lub wyłącz dźwięki.');
move(screens.settings.list,'toggleMusic()','🎵 Muzyka','Włącz lub wyłącz muzykę.');
const tileConfig=[
 ['modes','⚔️','TRYBY WALKI','Bot, bossowie, trening i kampania.',['👹 Boss','🤖 Bot','🎯 Trening','🗺️ Kampania'],'💥'],
 ['balls','🔮','KULKI I SKLEP','Odkrywaj kulki i sprawdzaj ich moce.',['🔮 Kolekcja','📦 Skrzynki','🛒 Sklep'],'🔮'],
 ['rewards','🎁','NAGRODY I WYDARZENIA','Zbieraj nagrody i wykonuj questy.',['✅ Questy','🏆 Osiągnięcia','🎃 Eventy'],'🎁'],
 ['account','⚙️','KONTO I USTAWIENIA','Profil, znajomi, ranking i ustawienia.',['👤 Profil','👥 Znajomi','🏟️ Areny'],'⚙️']
];
for(const [id,icon,label,description,tags,ghost] of tileConfig){
 const b=document.createElement('button');b.type='button';b.className='bvb3-tile '+id;
 const title=document.createElement('div');title.className='bvb3-title';
 const ico=document.createElement('span');ico.className='bvb3-icon';ico.textContent=icon;
 const name=document.createElement('strong');name.textContent=label;title.append(ico,name);
 const desc=document.createElement('p');desc.className='bvb3-desc';desc.textContent=description;
 const chipBox=document.createElement('div');chipBox.className='bvb3-tags';
 for(const tag of tags){const chip=document.createElement('span');chip.textContent=tag;chipBox.append(chip);}
 const art=document.createElement('span');art.className='bvb3-ghost';art.textContent=ghost;art.setAttribute('aria-hidden','true');
 b.setAttribute('aria-label',label+': '+description);
 b.append(title,desc,chipBox,art);b.addEventListener('click',()=>open(id));grid.append(b);
}
for(let i=0;i<BOSSD.length;i++){
 const boss=BOSSD[i],b=document.createElement('button');b.type='button';b.className='bvb3-boss';
 const ico=document.createElement('span');ico.textContent=boss.e;
 const title=document.createElement('strong');title.textContent=boss.n;
 b.append(ico,title);b.addEventListener('click',()=>begin('boss',i));screens.bosses.list.append(b);
}
screens.prepare.list.remove();
const prep=screens.prepare.el;
// Back from boss preparation returns to boss selection, not to the modes list.
prep.querySelector('.bvb3-back')?.addEventListener('click',e=>{
 if(fightType==='boss'){e.stopImmediatePropagation();open('bosses');}
},true);
const note=document.createElement('p');note.className='bvb3-note';
note.textContent='1. Wybierz trudność. 2. Wybierz kulkę. 3. Kliknij „Gotowość”.';prep.append(note);
const step1=document.createElement('h3');step1.className='bvb3-subtitle';step1.textContent='1. Poziom trudności';prep.append(step1);
const levels=document.createElement('div');levels.className='bvb3-levels';prep.append(levels);
const diffNames=['Łatwy','Średni','Trudny','Ekstremalny','Koszmar'],diffBtns=[];
for(let i=0;i<5;i++){
 const btn=document.createElement('button');btn.type='button';btn.className='bvb3-level';
 btn.textContent=diffNames[i];btn.setAttribute('aria-pressed','false');btn.addEventListener('click',()=>chooseDifficulty(i));
 levels.append(btn);diffBtns.push(btn);
}
const ballArea=document.createElement('div');ballArea.hidden=true;prep.append(ballArea);
const step2=document.createElement('h3');step2.className='bvb3-subtitle';step2.textContent='2. Wybierz swoją kulkę';ballArea.append(step2);
const ballList=document.createElement('div');ballList.className='bvb3-ball-list';ballArea.append(ballList);
const preview=document.createElement('div');preview.className='bvb3-preview';ballArea.append(preview);
const ready=document.createElement('button');ready.type='button';ready.className='b graj';ready.id='bvb3Ready';
ready.textContent='✅ GOTOWOŚĆ — ROZPOCZNIJ';ready.disabled=true;ready.addEventListener('click',startReady);prep.append(ready);
function owned(){
 const list=Array.from(new Set((S?.own||[]).map(Number).filter(i=>Number.isInteger(i)&&B[i])));
 return list.length?list:[0,1,2].filter(i=>B[i]);
}
function renderBalls(){
 ballList.replaceChildren();
 for(const id of owned()){
  const btn=document.createElement('button');btn.type='button';btn.className='bvb3-ball';
  btn.setAttribute('aria-pressed',String(ballId===id));
  const image=document.createElement('span');image.innerHTML=orb(B[id]);
  const name=document.createElement('span');name.textContent=B[id].n;
  btn.append(image,name);btn.addEventListener('click',()=>chooseBall(id));ballList.append(btn);
 }
}
function chooseBall(id){
 const own=owned();if(!own.includes(id))return;ballId=id;
 Array.from(ballList.children).forEach((el,i)=>el.setAttribute('aria-pressed',String(own[i]===id)));
 const b=B[id],s=getBallStats(id),skill=window.BVB2?.abilities?.[id];
 const header=document.createElement('div');header.className='bvb3-preview-top';
 const orbBox=document.createElement('div');orbBox.innerHTML=orb(b);
 const name=document.createElement('span');name.textContent=b.n;header.append(orbBox,name);
 const stats=document.createElement('div');stats.className='bvb3-stats';
 for(const t of ['❤️ '+s.hp+' HP','⚔️ '+s.dmg+' DMG','⏱️ '+(s.cd?s.cd+' s':'Pasywna')]){
  const item=document.createElement('span');item.textContent=t;stats.append(item);
 }
 const ability=document.createElement('p');ability.className='bvb3-power';
 const label=document.createElement('b');label.textContent=(skill?.title||'✨ Umiejętność')+': ';
 ability.append(label,document.createTextNode(skill?.desc||s.activeDesc||b.d||'Specjalna umiejętność.'));
 preview.replaceChildren(header,stats,ability);ready.disabled=level===null;
}
function chooseDifficulty(i){
 if(i<0||i>4)return;level=i;diff=i;
 diffBtns.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
 ballArea.hidden=false;ready.disabled=ballId===null;
}
function begin(type,index=0){
 fightType=type;bossIndex=index;level=null;ballId=null;
 ballArea.hidden=true;ready.disabled=true;preview.replaceChildren();
 diffBtns.forEach(b=>b.setAttribute('aria-pressed','false'));
 prep.querySelector('h2').textContent=type==='boss'?'👹 WALKA Z BOSSEM — '+BOSSD[index].n:'🤖 WALKA Z BOTEM';
 open('prepare');renderBalls();
}
function startReady(){
 if(level===null||ballId===null||!owned().includes(ballId))return;
 const id=ballId,type=fightType;
 diff=level;
 if(type==='boss')startBossFight(bossIndex);else startMatch(0);
 if(G&&G.ph==='draft'&&G.m===(type==='boss'?11:0)){
  G.my=[B[id],...G.my.filter(b=>b.id!==id)].slice(0,3);
  renderDraft();pick(0);
 }
}
function open(name='home'){
 if(name!=='home'&&!screens[name])name='home';
 active=name;home.hidden=name!=='home';
 for(const [id,v] of Object.entries(screens))v.el.hidden=id!==name;
 if(window.scrollTo)window.scrollTo(0,0);
}
root.replaceChildren(home,...Object.values(screens).map(s=>s.el),legacy);
const previousMenu=menu;
menu=function(){
 const wasInMenu=!root.hidden;
 previousMenu();
 if(!wasInMenu)active='home';
 open(active);
};
window.BVBMenu={open,prepare:mode=>mode==='boss'?open('bosses'):begin('bot'),
 chooseDifficulty,chooseBall,startReady,
 get active(){return active},get selectedDifficulty(){return level}};
open('home');
})();
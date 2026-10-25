/* Ball VS Ball 2.0 — uporządkowane menu dla nowych graczy.
   Zachowujemy oryginalne przyciski i akcje; zmieniamy tylko ich położenie. */
(() => {
 'use strict';
 const root=document.querySelector('#menu');
 if(!root || !window.BVB2UI || root.querySelector('#bvbNavHome'))return;
 const css=document.createElement('style');
 css.textContent=[
  '#menu .bvb-nav-home{display:flex;flex-direction:column;gap:6px}',
  '#menu .bvb-nav-home>.b{margin-bottom:6px}',
  '#menu .bvb-nav-entry{background:linear-gradient(165deg,#273870,#192650);border-color:#5b74b8}',
  '#menu .bvb-nav-category[hidden],#menu .bvb-nav-home[hidden]{display:none!important}',
  '#menu .bvb-nav-header{padding:12px 3px 15px;text-align:center}',
  '#menu .bvb-nav-header h2{font-size:1.22rem;line-height:1.25;margin:0 0 5px;color:#fff}',
  '#menu .bvb-nav-header p{font-size:.8rem;color:#cbd5e1;line-height:1.4}',
  '#menu .bvb-nav-back{margin-bottom:12px!important;background:linear-gradient(140deg,#1c2e65,#162149)!important}',
  '#menu .bvb-nav-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
  '#menu .bvb-nav-list>.b{margin-bottom:0;min-height:80px}',
  '#menu .bvb-nav-list>.b .bvb-menu-title{font-size:.86rem}',
  '#menu .bvb-nav-list>.b .bvb-menu-hint{font-size:.73rem}',
  '#menu .bvb-nav-difficulty{margin-bottom:15px}',
  '#menu .bvb-nav-difficulty>p{font-size:.84rem;color:#e9d5ff;margin-bottom:9px;text-align:center}',
  '#menu .bvb-nav-difficulty .diff-row{margin-bottom:0}',
  '@media(max-width:390px){#menu .bvb-nav-list{grid-template-columns:minmax(0,1fr)}}'
 ].join('');
 document.head.appendChild(css);
 const categories=[
  {key:'modes',name:'🎮 Tryby gry',sub:'Bossowie, survival, multiplayer i inne walki.',
   title:'🎮 Tryby gry',intro:'Wybierz rodzaj pojedynku i poziom trudności.'},
  {key:'balls',name:'🔮 Kulki i sklep',sub:'Kolekcja, skrzynki i zakupy.',
   title:'🔮 Kulki i sklep',intro:'Zobacz swoje kulki lub zdobądź nowe.'},
  {key:'rewards',name:'🎁 Nagrody i wydarzenia',sub:'Zadania, sezon i Halloween.',
   title:'🎁 Nagrody i wydarzenia',intro:'Wykonuj wyzwania i zdobywaj nagrody.'},
  {key:'settings',name:'⚙️ Profil i ustawienia',sub:'Konto, areny, dźwięki i historia zmian.',
   title:'⚙️ Profil i ustawienia',intro:'Dostosuj grę do siebie i przeglądaj profil.'}
 ];
 let current=null;
 const originalButtons=Array.from(root.querySelectorAll('button')).filter(b=>!b.classList.contains('diff-btn'));
 const difficulty=root.querySelector('.diff-row');
 const home=document.createElement('section');
 home.className='bvb-nav-home';home.id='bvbNavHome';
 const groups={};
 function groupFor(btn){
  const action=btn.getAttribute('onclick')||'';
  if(action==='startMatch(0)'||action.includes('BVBCampaign'))return 'home';
  if(/bossMenu\(\)|mpMenu\(\)|startMatch\((1|3|4|5|6|7)\)/.test(action))return 'modes';
  if(/panel\('(shop|col|st)'\)/.test(action))return 'balls';
  if(/startMatch\(9\)|panel\('(hw|q|bp|ach)'\)/.test(action))return 'rewards';
  return 'settings';
 }
 function makeButton(title,description,onClick){
  const btn=document.createElement('button');btn.type='button';
  btn.className='b bvb-menu-button bvb-nav-entry';
  const name=document.createElement('span');name.className='bvb-menu-title';name.textContent=title;
  const hint=document.createElement('span');hint.className='bvb-menu-hint';hint.textContent=description;
  btn.append(name,hint);btn.addEventListener('click',onClick);return btn;
 }
 function go(to=null){
  current=to;home.hidden=to!==null;
  for(const key of Object.keys(groups))groups[key].section.hidden=to!==key;
  if(window.scrollTo)window.scrollTo(0,0);
 }
 for(const config of categories){
  const section=document.createElement('section');section.className='bvb-nav-category';
  section.id='bvbNav_'+config.key;section.hidden=true;
  const back=makeButton('⬅ Wróć do menu','Zobacz inne kategorie.',()=>go());
  back.classList.add('bvb-nav-back');section.appendChild(back);
  const header=document.createElement('div');header.className='bvb-nav-header';
  const heading=document.createElement('h2');heading.textContent=config.title;
  const intro=document.createElement('p');intro.textContent=config.intro;
  header.append(heading,intro);section.appendChild(header);
  if(config.key==='modes'&&difficulty){
   const box=document.createElement('div');box.className='bvb-nav-difficulty';
   const description=document.createElement('p');description.textContent='Poziom trudności:';
   box.append(description,difficulty);section.appendChild(box);
  }
  const list=document.createElement('div');list.className='bvb-nav-list';
  section.appendChild(list);groups[config.key]={section,list};
 }
 const classic=originalButtons.find(btn=>btn.getAttribute('onclick')==='startMatch(0)');
 const campaign=originalButtons.find(btn=>(btn.getAttribute('onclick')||'').includes('BVBCampaign'));
 if(classic)home.appendChild(classic);
 if(campaign){campaign.textContent='🗺️ KAMPANIA';home.appendChild(campaign);}
 for(const config of categories){
  home.appendChild(makeButton(config.name,config.sub,()=>go(config.key)));
 }
 for(const btn of originalButtons){
  const g=groupFor(btn);
  if(g!=='home')groups[g].list.appendChild(btn);
 }
 root.replaceChildren(home,...categories.map(c=>groups[c.key].section));
 // Recreate descriptions after reparenting and re-labeling the campaign button.
 window.BVB2UI.descriptions();
 // Existing menu() resets live labels and game state; preserve an open category
 // only for changes done while already on the menu (difficulty, music).
 const baseMenu=menu;
 menu=function(){
  const alreadyOpen=!root.hidden;
  baseMenu();
  if(!alreadyOpen)current=null;
  go(current);
 };
 window.BVB2Nav={go,groups:categories.map(c=>c.key)};
 go();
})();
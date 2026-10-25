/* Ball VS Ball 2.0 — czytelne opisy i sekcje menu dla nowych graczy. */
(() => {
'use strict';
const css=document.createElement('style');
css.textContent=[
/* Entire menu button stacks title ABOVE the description, never side-by-side. */
'#menu .bvb-menu-button{display:flex!important;flex-direction:column!important;align-items:center;',
'justify-content:center;gap:4px;min-width:0;width:100%;height:auto;padding:13px 10px;',
'text-align:center;white-space:normal;overflow-wrap:normal;word-break:normal;hyphens:none}',
'#menu .bvb-menu-title{display:block;width:100%;font-weight:850;line-height:1.34;',
'font-size:clamp(.83rem,2.8vw,.99rem);white-space:normal;overflow-wrap:normal;',
'word-break:normal;hyphens:none;letter-spacing:0}',
'#menu .bvb-menu-hint{display:block;width:100%;max-width:none;margin:3px 0 0;',
'font-size:clamp(.73rem,2.2vw,.82rem);line-height:1.4;font-weight:500;',
'color:#d5def6;letter-spacing:0;opacity:.96;white-space:normal;',
'overflow-wrap:normal;word-break:normal;hyphens:none;text-wrap:wrap}',
/* A narrow 3-column grid would split even simple words (Ustawienia). */
'#menu .grid-3{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
'#menu .grid-3>button:last-child:nth-child(odd){grid-column:1/-1}',
'#menu .grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}',
'#menu .diff-row{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}',
'#menu .diff-row>button:last-child:nth-child(odd){grid-column:1/-1}',
'#menu .diff-row .bvb-menu-title{font-size:.87rem}',
'#menu .diff-row .bvb-menu-hint{font-size:.75rem;line-height:1.35}',
/* Compact phones: a full-width button per action, no word fragmentation. */
'@media(max-width:380px){#menu .grid-2,#menu .grid-3,#menu .diff-row{grid-template-columns:minmax(0,1fr)}',
'#menu .grid-3>button:last-child:nth-child(odd),#menu .diff-row>button:last-child:nth-child(odd){grid-column:auto}',
'#menu .bvb-menu-button{padding:12px 12px}}',
'#menu .b:focus-visible,#menu .diff-btn:focus-visible{outline:3px solid #facc15;outline-offset:3px}',
/* All content stays visible: visual grouping instead of extra navigation. */
'#menu .bvb-welcome-guide{border:1px solid #4968b7;background:linear-gradient(135deg,#233c76,#131c41);',
'border-radius:17px;padding:15px 14px;margin:0 0 15px;box-shadow:0 4px 12px #0003}',
'#menu .bvb-welcome-guide strong{display:block;color:#fef08a;font-size:1rem;margin-bottom:7px}',
'#menu .bvb-welcome-guide p{font-size:.82rem;line-height:1.55;color:#e2e8f0}',
'#menu .bvb-menu-section{margin:0 0 15px;padding:15px 12px 13px;border-radius:18px;',
'background:linear-gradient(155deg,#171f43,#11162d);border:1px solid #34477f;min-width:0}',
'#menu .bvb-menu-section h2{color:#f5f3ff;text-align:left;font-size:1.06rem;',
'font-weight:900;line-height:1.3;margin:0 0 5px;letter-spacing:0}',
'#menu .bvb-section-caption{font-size:.78rem;line-height:1.5;color:#bfcdee;',
'margin:0 0 14px;text-align:left}',
'#menu .bvb-difficulty-guide{color:#e0e7ff;font-size:.84rem;font-weight:800;',
'text-align:center;margin:13px 0 8px}',
'#menu .bvb-difficulty-guide small{display:block;font-size:.72rem;',
'font-weight:500;color:#aebfe5;margin-top:4px}',
'#menu .bvb-subsection-label{font-size:.92rem;font-weight:800;color:#fed7aa;',
'border-top:1px solid #37406c;padding-top:14px;margin:15px 0 11px}',
'#menu .bvb-menu-section .grid-2,#menu .bvb-menu-section .grid-3{margin-bottom:10px}',
'#menu .bvb-menu-section>.grid-2:last-child,#menu .bvb-menu-section>.grid-3:last-child{margin-bottom:0}',
'#menu .bvb-menu-first{border-color:#6f84dc;background:linear-gradient(155deg,#213361,#141a37)}',
'@media(max-width:360px){#menu .bvb-menu-section{padding:13px 10px}',
'#menu .bvb-welcome-guide{padding:13px 11px}}',
].join('');
document.head.appendChild(css);
const details=[
 ['diff-btn',[
 'Spokojna walka z botem.','Standardowy poziom wyzwania.','Silniejszy i celniejszy przeciwnik.',
 'Wymagające starcie.','Najtrudniejszy poziom bota.']],
 ['startMatch(0)','Klasyczny pojedynek z botem, trzy serca i nagrody.'],
 ['BVBCampaign','50 etapów, gwiazdki, wydarzenia i pięciu bossów.'],
 ['bossMenu()','Wybierz jednego z sześciu specjalnych strażników.'],
 ['startMatch(9)','Walcz z Królem Dyń o cukierki.'],
 ["panel('hw')",'Skrzynie i nagrody halloweenowe za cukierki.'],
 ['mpMenu()','Połącz się ze znajomym i walcz online.'],
 ["panel('account')",'Konto, znajomi, zaproszenia i ranking.'],
 ['startMatch(1)','Przetrwaj jak najwięcej fal.'],
 ['startMatch(7)','Coraz trudniejsi rywale bez końcowego limitu fal.'],
 ['startMatch(3)','Pokonuj kolejnych bossów.'],
 ['startMatch(4)','Ćwicz ustawienie i umiejętności.'],
 ['startMatch(5)','Walka z dodatkowymi niespodziankami.'],
 ['startMatch(6)','Seria walk o zwycięstwo w turnieju.'],
 ["panel('shop')",'Otwieraj skrzynki i zdobywaj nowe kulki.'],
 ["panel('col')",'Przeglądaj wyglądy, statystyki i umiejętności kulek.'],
 ["panel('q')",'Wykonuj zadania i odbieraj nagrody.'],
 ['toggleSfx()','Włącz lub wyłącz dźwięki walki.'],
 ['toggleMusic()','Włącz lub wyłącz muzykę.'],
 ["panel('arena')",'Wybierz arenę i ustaw przeszkody.'],
 ["panel('pr')",'Sprawdź swój poziom, osiągnięcia i statystyki.'],
 ["panel('set')",'Dostosuj wygląd, efekty i ustawienia gry.'],
 ["panel('ach')",'Sprawdź osiągnięcia zdobyte na arenach.'],
 ["panel('st')",'Kupuj przedmioty i dodatki za monety.'],
 ["panel('bp')",'Sprawdź sezon i dostępne nagrody.']
];
function descriptions(){
 const root=document.querySelector('#menu');if(!root)return;
 const all=Array.from(root.querySelectorAll('button'));
 const difficulties=Array.from(root.querySelectorAll('.diff-btn'));
 for(const btn of all){
  const on=btn.getAttribute('onclick')||'';
  let desc=difficulties.includes(btn)?details[0][1][difficulties.indexOf(btn)]:null;
  if(!desc){const spec=details.slice(1).find(d=>on.includes(d[0]));desc=spec?.[1];}
  if(!desc)desc='Otwórz wybraną funkcję gry.';
  btn.classList.add('bvb-menu-button');
  // Preserve original icons and line breaks; wrap all existing title nodes.
  // Some labels (Survival, music, arena) are updated by menu() using textContent/innerHTML.
  // Whenever that happens, rebuild the title+description cleanly.
  let title=Array.from(btn.children).find(el=>el.classList?.contains('bvb-menu-title'));
  if(!title){
   title=document.createElement('span');
   title.className='bvb-menu-title';
   const nodes=Array.from(btn.childNodes).filter(node=>
    !(node.nodeType===1 && node.classList?.contains('bvb-menu-hint')));
   for(const node of nodes)title.appendChild(node);
   btn.insertBefore(title,btn.firstChild);
  }
  let hint=Array.from(btn.children).find(el=>el.classList?.contains('bvb-menu-hint'));
  if(!hint){hint=document.createElement('span');hint.className='bvb-menu-hint';btn.appendChild(hint);}
  hint.textContent=desc;
 }
}
const oldMenu=menu;
menu=function(){oldMenu();descriptions();};
window.BVB2UI={descriptions};
descriptions();
})();

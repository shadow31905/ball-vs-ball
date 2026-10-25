/* Ball VS Ball 2.0 — objaśnienia menu i historia zmian po wejściu do gry */
(() => {
'use strict';
const css=document.createElement('style');
css.textContent=[
'#menu .bvb-menu-hint{display:block;margin:5px auto 0;font-size:clamp(.58rem,1.75vw,.71rem);line-height:1.35;',
'font-weight:500;letter-spacing:0;color:#cbd5e1;max-width:32rem;opacity:.95;text-wrap:balance}',
'#menu .diff-row .bvb-menu-hint{font-size:.55rem;line-height:1.15}',
'#menu .b:focus-visible{outline:3px solid #facc15;outline-offset:3px}',
'#bvbV2Updates{position:fixed;inset:0;z-index:350;background:#040715cc;padding:18px 12px;overflow:auto;display:grid;place-items:center}',
'#bvbV2Updates[hidden]{display:none!important}',
'.bvb-v2-dialog{position:relative;max-height:min(84vh,750px);overflow:auto;width:min(440px,100%);',
'border:1px solid #647cf7;border-radius:19px;background:linear-gradient(150deg,#1b2557,#0b102a);',
'box-shadow:0 18px 65px #000b;padding:22px 18px}',
'.bvb-v2-dialog h2{margin:0 0 8px;color:#fef08a}',
'.bvb-v2-dialog h3{font-size:.88rem;color:#c4b5fd;margin:13px 0 3px}',
'.bvb-v2-dialog ul{margin:5px 0;padding-left:19px;color:#e2e8f0;font-size:.81rem;line-height:1.55}',
'.bvb-v2-dialog .b{width:100%;margin-top:15px}',
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
 ["panel('bp')",'Sprawdź sezon i dostępne nagrody.'],
 ['BVB2UI.open','Zobacz, co dodano, zmieniono i poprawiono.']
];
function descriptions(){
 const menu=document.querySelector('#menu');if(!menu)return;
 const all=Array.from(menu.querySelectorAll('button'));
 const diff=Array.from(menu.querySelectorAll('.diff-btn'));
 for(const btn of all){
  if(btn.querySelector('.bvb-menu-hint'))continue;
  const on=btn.getAttribute('onclick')||'';
  let desc=btn.id==='bvbChangelogBtn'?'Zobacz szczegółowy opis najnowszej aktualizacji.':diff.includes(btn)?details[0][1][diff.indexOf(btn)]:null;
  if(!desc){const spec=details.slice(1).find(d=>on.includes(d[0]));desc=spec?.[1];}
  if(!desc)desc='Otwórz wybraną funkcję gry.';
  const el=document.createElement('span');
  el.className='bvb-menu-hint';el.textContent=desc;btn.appendChild(el);
 }
}
const oldMenu=menu;
menu=function(){oldMenu();descriptions();};
const changeSections=[
 ['Dodano',[
  'Przebudowę umiejętności kulek i nowe, charakterystyczne efekty.',
  'Trwałe pajęczyny Pająka między punktami odbicia od ścian.',
  'Opisy funkcji bezpośrednio pod przyciskami menu.',
  'Nowe projekty graficzne oraz podglądy mocy w kolekcji.'
 ]],
 ['Zmieniono',[
  'Sposoby działania specjalnych ataków i ich tempo.',
  'Parametry zdrowia, szybkości i obrażeń wybranych kulek.'
 ]],
 ['Poprawiono',[
  'Celowanie pocisków, odczytywanie kolizji i kontrolę nad efektami.',
  'Widoczność ataków i rozróżnianie rodzajów umiejętności.'
 ]],
 ['Ulepszono',[
  'Różnorodność pojedynków, animacje i balans.',
  'Czytelność menu na telefonach.'
 ]]
];
const modal=document.createElement('section');
modal.id='bvbV2Updates';modal.hidden=true;
modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Historia zmian Ball VS Ball 2.0');
modal.innerHTML='<div class="bvb-v2-dialog"><h2>🎮 Ball VS Ball 2.0</h2>'+
 '<p style="font-size:.83rem;color:#cbd5e1">Co nowego w grze?</p>'+
 changeSections.map(([title,items])=>'<h3>'+title+'</h3><ul>'+items.map(s=>'<li>'+s+'</li>').join('')+'</ul>').join('')+
 '<button class="b graj" id="bvbV2Close">▶ Przejdź do gry</button></div>';
document.body.appendChild(modal);
modal.querySelector('#bvbV2Close').addEventListener('click',()=>{modal.hidden=true;});
let entranceTimer=null;
function open(){modal.hidden=false;modal.querySelector('#bvbV2Close')?.focus();}
function onEntered(){
 // Every successful re-entry (also after logout/login without refreshing).
 clearTimeout(entranceTimer);
 entranceTimer=setTimeout(()=>{
  if(document.querySelector('#accountGate')?.hidden)open();
 },220);
}
window.addEventListener('bvb-entered-game',onEntered);
const btn=document.createElement('button');btn.className='b';btn.type='button';btn.id='bvbChangelogBtn';
btn.textContent='📋 Historia zmian 2.0';
btn.addEventListener('click',open);
document.querySelector('#menu')?.appendChild(btn);
window.BVB2UI={open,descriptions,onEntered};
descriptions();
})();
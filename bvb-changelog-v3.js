/* Ball VS Ball 2.0 — dziennik aktualizacji po wejściu do gry. */
(()=>{
'use strict';
if(document.getElementById('bvb2ReleaseModal'))return;
const css=document.createElement('style');
css.textContent="\n#bvb2ReleaseModal[hidden]{display:none!important}\n#bvb2ReleaseModal{position:fixed;inset:0;z-index:350;display:grid;place-items:center;\nbackground:#06091dd9;padding:12px;overflow-y:auto}\n.bvb2-release-card{width:min(520px,100%);max-height:min(90vh,880px);overflow-y:auto;\npadding:22px 19px;background:linear-gradient(145deg,#1e2856,#0c1532);\nborder:2px solid #6c7cdb;border-radius:19px;box-shadow:0 0 45px #162f96aa,0 20px 55px #000b}\n.bvb2-release-head{display:block;margin:0 0 13px}\n.bvb2-release-head h2{font-size:1.42rem;letter-spacing:.4px;color:#fef08a;margin-bottom:4px}\n.bvb2-release-head p{font-size:.83rem;color:#cbd5e1}\n.bvb2-release-card h3{font-size:1rem;color:#bcb7ff;margin:13px 0 6px}\n.bvb2-release-card ul{padding-left:19px;font-size:.82rem;line-height:1.55;color:#e6e9ff}\n.bvb2-release-card li{margin:0 0 5px}\n.bvb2-release-card>.b{width:100%;margin:12px 0 0}\n.bvb2-release-card>.bvb2-release-optout{background:#243152;border:1px solid #8993b5;color:#e2e8f0}\n.bvb2-release-card>.bvb2-release-optout:hover{background:#33466c}\n@media(max-width:390px){.bvb2-release-card{padding:16px 13px}.bvb2-release-card h2{font-size:1.15rem}}\n";
document.head.append(css);
const sections=[
 ['🛠️ Naprawiono w 2.0.1',[
  'Topór i pozostałe kulki z orbitującymi ostrzami mają teraz widoczne ostrza w walce, które naprawdę trafiają przeciwnika.',
  'Łatwy bot ma słabsze statystyki, bez ukrytej ewolucji V2 i losowych premii do szarży lub pancerza.',
  'Średni bot nie otrzymuje losowej taktyki Szarża, a jego siła lepiej odpowiada wybranemu poziomowi.',
  'Sześciu bossów korzysta z różnych umiejętności; poprawiono ich zdrowie i obrażenia.',
  'Poprawiono spójność czasów odnowienia umiejętności, osłabienie, ogłuszenie oraz rykoszety w narożnikach.'
 ]],
 ['✨ Dodano',[
  'Nowe menu główne: cztery animowane kafelki z ikonami, opisami i podglądem zawartości.',
  'Osobne ekrany trybów walki, kulek i sklepu, nagród oraz konta i ustawień.',
  'Wybór jednego z pięciu poziomów trudności przed walką z botem lub bossem.',
  'Przygotowanie do walki: wybór kulki, jej statystyki, animowany podgląd umiejętności i przycisk „Gotowość”.',
  'Podmenu „Więcej trybów”, osobny ekran wydarzeń i podmenu aren.',
  'Rozbudowane umiejętności specjalne 130 kulek i animowane podglądy ich działania w kolekcji.',
  'Pajęczyny Pająka utrzymujące się do końca rundy po połączeniu dwóch punktów odbicia.'
 ]],
 ['🔄 Zmieniono',[
  'Uporządkowano funkcje gry według czterech czytelnych kategorii.',
  'Przeniesiono wybór trudności na ekran przygotowania przed walką z botem lub bossem.',
  'Zmieniono wybrane umiejętności, ich czas odnowienia oraz parametry kulek.'
 ]],
 ['🛠️ Poprawiono',[
  'Czytelność napisów na urządzeniach mobilnych: nazwy przycisków znajdują się nad opisami.',
  'Wybrane efekty specjalne, ich widoczność i działanie przy kolizjach.'
 ]],
 ['🚀 Ulepszono',[
  'Efekty wizualne menu: subtelne animacje w spoczynku i mocniejsze po kliknięciu.',
  'Układ czterech kafelków w dwóch kolumnach również na węższych ekranach.',
  'Podgląd kulek, różnorodność ataków i wstępny balans.',
  'Dostęp do konta, znajomych, rankingu i ustawień bez przeszukiwania długiego menu.'
 ]]
];
const modal=document.createElement('div');modal.id='bvb2ReleaseModal';modal.hidden=true;
modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','Historia zmian Ball VS Ball 2.0.1');
const body=document.createElement('div');body.className='bvb2-release-card';
const header=document.createElement('header');header.className='bvb2-release-head';
const title=document.createElement('h2');title.textContent='🎮 BALL VS BALL 2.0.1';
const subtitle=document.createElement('p');subtitle.textContent='Co nowego w aktualizacji?';
header.append(title,subtitle);body.append(header);
for(const [name,lines] of sections){
 const h=document.createElement('h3');h.textContent=name;body.append(h);
 const ul=document.createElement('ul');
 for(const line of lines){const li=document.createElement('li');li.textContent=line;ul.append(li);}
 body.append(ul);
}
const close=document.createElement('button');close.className='b graj';close.type='button';
close.textContent='▶ Przejdź do gry';close.addEventListener('click',hide);body.append(close);
const optOut=document.createElement('button');optOut.type='button';
optOut.className='b bvb2-release-optout';
optOut.addEventListener('click',()=>{
 const disabled=autoDisabled();
 try{if(disabled)localStorage.removeItem(OPTOUT_KEY);else localStorage.setItem(OPTOUT_KEY,'1');}
 catch(e){/* Local storage may be unavailable. */}
 optOutThisSession=!disabled;
 refreshOptOut();hide();
});
body.append(optOut);
modal.append(body);document.body.append(modal);
// Increase RELEASE_VERSION with each future release to show its notes once again.
const RELEASE_VERSION='2.0.1';
const SEEN_KEY='bvb-release-notes-seen-'+RELEASE_VERSION;
const OPTOUT_KEY='bvb-release-notes-optout';
let lastFocused=null,entryTimer=null,seenThisSession=false,optOutThisSession=false;
function autoDisabled(){
 if(optOutThisSession)return true;
 try{return localStorage.getItem(OPTOUT_KEY)==='1';}
 catch(e){return false;}
}
function refreshOptOut(){
 optOut.textContent=autoDisabled()?'🔔 Włącz ponowne pokazywanie Changeloga':'🚫 Nie pokazuj więcej';
 optOut.setAttribute('aria-label',autoDisabled()?'Włącz automatyczne powiadomienia o nowych aktualizacjach':'Nie pokazuj automatycznie Changeloga przy kolejnych aktualizacjach');
}
function alreadySeen(){
 if(seenThisSession)return true;
 try{return localStorage.getItem(SEEN_KEY)==='1';}
 catch(e){return false;}
}
function markSeen(){
 seenThisSession=true;
 try{localStorage.setItem(SEEN_KEY,'1');}
 catch(e){/* Storage blocked: still show only once in the current session. */}
}
function open(automatic=false){
 if(!document.getElementById('accountGate')?.hidden)return;
 if(automatic&&(alreadySeen()||autoDisabled()))return;
 refreshOptOut();
 lastFocused=document.activeElement;modal.hidden=false;close.focus();
 if(automatic)markSeen();
}
function hide(){modal.hidden=true;lastFocused?.focus?.();}
modal.addEventListener('click',e=>{if(e.target===modal)hide();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)hide();});
function entered(){
 clearTimeout(entryTimer);entryTimer=setTimeout(()=>{
  if(document.getElementById('accountGate')?.hidden)open(true);
 },350);
}
window.addEventListener('bvb-entered-game',entered);
// Manual entry from the account/settings page.
const list=document.querySelector('#bvb3_account .bvb3-actions');
if(list){
 const btn=document.createElement('button');btn.type='button';btn.className='b bvb3-custom bvb3-wide';
 const label=document.createElement('span');label.className='bvb-menu-title';label.textContent='📋 Historia zmian 2.0.1';
 const hint=document.createElement('span');hint.className='bvb-menu-hint';hint.textContent='Sprawdź wszystkie nowości w aktualizacji.';
 btn.append(label,hint);btn.addEventListener('click',()=>open());list.append(btn);
}
window.BVB2ReleaseNotes={open,hide,entered};
})();
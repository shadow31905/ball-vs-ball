/* BVB — Kampania 50 poziomów. Osobny tryb offline bez zmian w PvP. */
(() => {
'use strict';
const rows=[
['Pierwszy rykoszet',1,0,'bounce','fast'],
['Neonowa szarża',5,35,'speed','hits'],
['Szafirowa tarcza',4,3,'shield','health'],
['Mgła trucizny',4,2,'toxic','special'],
['Wulkaniczne tempo',2,9,'glass','rush'],
['Labirynt kości',0,16,'maze','hits'],
['Mroźny refleks',3,12,'ice','fast'],
['Niebezpieczny portal',1,15,'portal','portal'],
['Burza nad miastem',5,18,'shock','guard'],
['Strażnik cieni',0,99,'boss','styles'],
['Ściany chaosu',5,27,'bounce','hits'],
['Podwodne ciśnienie',4,30,'wave','health'],
['Krystaliczna pułapka',3,28,'maze','rush'],
['Łowca piorunów',1,26,'shock','special'],
['Czerwony alarm',2,13,'glass','strike'],
['Wyścig o sekundę',5,36,'speed','fast'],
['Trująca komnata',0,23,'toxic','health'],
['Podwójny portal',1,19,'portal','portal'],
['Żelazna próba',2,25,'fortress','guard'],
['Żelazny tytan',5,50,'boss','strike'],
['Wieczny lód',3,38,'ice','health'],
['Fala oceanu',4,40,'wave','long'],
['Kosmiczne odbicia',1,43,'bounce','hits'],
['Rdzeń wulkanu',2,44,'blast','fast'],
['Opary otchłani',0,39,'toxic','special'],
['Demony szybkości',5,35,'speed','rush'],
['Wirujące bariery',4,47,'shield','guard'],
['Zakrzywiony wymiar',1,21,'portal','portal'],
['Ostatnia iskra',2,48,'shock','close'],
['Monarcha mrozu',3,68,'boss','styles'],
['Pancerz ciemności',0,52,'fortress','health'],
['Gwiezdny labirynt',1,53,'maze','hits'],
['Wodny wir',4,54,'wave','rush'],
['Płomienne szkło',2,55,'glass','strike'],
['Cichy łowca',0,56,'bounce','fast'],
['Prąd przeciążeniowy',5,57,'shock','special'],
['Kryształowa forteca',3,58,'shield','guard'],
['Skok przez próżnię',1,59,'portal','portal'],
['Echo otchłani',4,60,'blast','long'],
['Król pustki',0,119,'boss','close'],
['Ognisty sprint',2,61,'speed','fast'],
['Podwójna zasłona',5,62,'fortress','health'],
['Kwasowa burza',4,63,'toxic','special'],
['Odbicie nieskończoności',1,64,'bounce','hits'],
['Lodowa pułapka',3,65,'maze','guard'],
['Nieuchwytny przeciwnik',5,66,'wave','rush'],
['Jądro supernowej',2,67,'blast','strike'],
['Portale przeznaczenia',1,69,'portal','portal'],
['Próba wszystkich stylów',0,70,'shock','styles'],
['Sfera chaosu: finał',5,98,'final','styles']
];
const TWISTS={
bounce:['🎱 Rykoszety','Dodatkowe przeszkody i więcej odbić'],
speed:['⚡ Wyścig','Kulki przyspieszają, rywal ma małą przewagę'],
shield:['🛡️ Bariery','Obie kulki otrzymują tarcze, rywal silniejszą'],
toxic:['☣️ Toksyczny rejon','Rywal częściej używa mocy, gracz dostaje osłonę'],
glass:['💥 Szklane armaty','Mniej HP, więcej obrażeń'],
maze:['🧱 Labirynt','Pięć przeszkód kształtuje nieprzewidywalne trajektorie'],
ice:['❄️ Zimny refleks','Powolny przeciwnik z silniejszym pancerzem'],
portal:['🌀 Wymiar','Na arenie zawsze pojawia się portal'],
shock:['⚡ Przeciążenie','Umiejętności obu kulek szybciej się odnawiają'],
boss:['👑 Strażnik','Trzy serca, duży boss, zwiększone obrażenia'],
wave:['🌊 Fala','Obie kulki są szybsze i mocniejsze'],
blast:['🔥 Reaktor','Większe obrażenia przy niższym HP'],
fortress:['🏰 Forteca','Dodatkowe przeszkody i ciężka tarcza rywala'],
final:['🌌 Finał','Silniejszy boss, tarcze, szybsze zdolności']
};
const GOALS={
fast:'Wygraj rundę w maksymalnie 35 sekund',
hits:'Wykonaj przynajmniej 4 zderzenia w etapie',
health:'Wygraj rundę z minimum 40% HP',
special:'Aktywuj umiejętność minimum 3 razy',
rush:'Wygraj rundę z taktyką Szybkość',
guard:'Wygraj rundę z taktyką Obrona',
strike:'Wygraj rundę z taktyką Atak',
portal:'Przenieś własną kulkę przez portal',
styles:'Wygraj rundy dwiema różnymi taktykami',
long:'Wygraj rundę trwającą minimum 20 sekund',
close:'Wygraj rundę mając maksymalnie 45% HP'
};
const EVENTS=[
{id:'comet',name:'☄️ Deszcz komet',desc:'Obie kulki zadają 15% więcej obrażeń'},
{id:'boost',name:'🚀 Zastrzyk adrenaliny',desc:'Obie kulki mają 15% więcej prędkości'},
{id:'shield',name:'🛡️ Zaklęcie tarczy',desc:'Obie kulki zyskują 12 HP osłony'},
{id:'magic',name:'🔮 Przebudzenie mocy',desc:'Umiejętności obu kulek odnawiają się 25% szybciej'},
{id:'gift',name:'🎁 Szczęśliwy dar',desc:'Twoja kulka zyskuje 16 HP osłony'},
{id:'rival',name:'👹 Zemsta rywala',desc:'Rywal dostaje 12 HP, ale Ty zadajesz 10% więcej obrażeń'},
{id:'portal',name:'🌀 Pęknięcie wymiaru',desc:'Pojawia się portal na arenie'},
{id:'rocks',name:'🪨 Meteoryty',desc:'Dodatkowe przeszkody zmieniają tor kulek'},
{id:'glass',name:'💎 Krucha energia',desc:'Obie kulki tracą 15% HP, lecz zadają 20% większe obrażenia'}
];
const LEVELS=rows.map((r,i)=>({id:i+1,title:r[0],arena:r[1],enemyId:r[2],twist:r[3],goal:r[4],boss:(i+1)%10===0}));
let selected=1;
const styles=document.createElement('style');
styles.textContent='.bvb-level-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:7px;margin:9px 0}.bvb-level{background:#19264b;border:1px solid #606da0;color:#fff;border-radius:10px;padding:9px;min-height:66px;cursor:pointer;text-align:left}.bvb-level:disabled{opacity:.40;cursor:not-allowed}.bvb-level[aria-current=true]{border:2px solid #fde047;background:#344d82}.bvb-level small{font-size:11px;display:block;opacity:.83}.bvb-campaign-head{margin:12px 0;padding:13px;border:1px solid #646cc2;background:linear-gradient(120deg,#192e5a,#271940);border-radius:13px}.bvb-deck{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:8px;margin:9px 0}';
document.head.appendChild(styles);
function saveState(){
 S.campaign ||= {};
 const c=S.campaign;
 c.unlocked=Math.max(1,Math.min(50,Number(c.unlocked)||1));
 c.cleared=Array.isArray(c.cleared)?c.cleared:[];
 c.stars=Array.isArray(c.stars)?c.stars:[];
 c.deck=Array.isArray(c.deck)?c.deck:[0,1,2];
 return c;
}
function stage(n){return LEVELS[(Number(n)||1)-1];}
function ownIds(){const arr=S.own.filter(id=>Number.isInteger(id)&&B[id]);return arr.length>=3?arr:[0,1,2];}
function deck(){
 const chosen=[],c=saveState(),available=ownIds();
 for(const id of c.deck){if(available.includes(id)&&!chosen.includes(id)&&chosen.length<3)chosen.push(id);}
 for(const id of available){if(chosen.length>=3)break;if(!chosen.includes(id))chosen.push(id);}
 return chosen.map(id=>B[id]);
}
function chooseBall(i,value){
 const id=Number(value),chosen=deck().map(b=>b.id);
 if(!ownIds().includes(id)||!Number.isInteger(id)||chosen.some((v,j)=>j!==i&&v===id)){render();return;}
 chosen[i]=id;saveState().deck=chosen;save();render();
}
function bossBall(l){
 const template=B[l.enemyId]||B[0],boss=BOSSD[Math.floor(l.id/10)-1];
 return {...template,n:boss.n,e:boss.e,c:boss.c,isBoss:true};
}
function inspect(n){if(n>saveState().unlocked)return;selected=n;render();}
function open(){
 if(netRole==='guest')return;
 $('#ov').hidden=true;$('#pn').dataset.panel='campaign';show('pn');render();
}
function render(){
 const p=$('#pb');if(!p)return;
 const c=saveState();selected=Math.max(1,Math.min(selected,c.unlocked));const l=stage(selected);
 const opponent=l.boss?bossBall(l):B[l.enemyId];
 const picks=deck().map((ball,i)=>'<label style="font-size:.83rem">Kulka '+(i+1)+
   '<select class="inp" onchange="window.BVBCampaign.chooseBall('+i+',this.value)">'+
   ownIds().map(id=>'<option value="'+id+'"'+(ball.id===id?' selected':'')+'>'+esc(B[id].n)+'</option>').join('')+
   '</select></label>').join('');
 p.innerHTML='<h2>🗺️ Kampania — 50 poziomów</h2><p>✅ '+c.cleared.length+'/50 · ⭐ '+c.stars.length+'/50 · 🔓 '+c.unlocked+'/50</p>'+
  '<div class="cd"><b>🎴 Wybierz 3 posiadane kulki</b><div class="bvb-deck">'+picks+'</div>'+
  '<small>To Ty ustalasz drużynę, a przed walką wybierasz taktykę.</small></div>'+
  '<div class="bvb-campaign-head"><h3>'+selected+'/50 · '+(l.boss?'👑 ':'')+esc(l.title)+'</h3>'+
  '<p>'+TWISTS[l.twist][0]+' — '+TWISTS[l.twist][1]+'</p>'+
  '<p>🏟️ '+esc(ARENAS[l.arena].name)+' · 🎯 '+esc(opponent.n)+'</p>'+
  '<p>⭐ Bonus: '+GOALS[l.goal]+'</p>'+
  '<p style="font-size:.8rem;color:#cbd5e1">Wystarczy wygrać etap, by odblokować następny. Bonus za gwiazdkę jest opcjonalny.</p>'+
  '<button class="b graj" onclick="window.BVBCampaign.start('+l.id+')">⚔️ Graj — poziom '+l.id+'</button></div>'+
  [0,1,2,3,4].map((chapter)=>{
    const names=['Pierwsze starcia','Zmienne areny','Wojna żywiołów','Pęknięte światy','Finałowa próba'];
    return '<h3 style="margin:14px 0 6px;color:#fde68a">Rozdział '+(chapter+1)+' — '+names[chapter]+'</h3>'+
      '<div class="bvb-level-grid">'+LEVELS.slice(chapter*10,chapter*10+10).map(l=>
        '<button class="bvb-level"'+(l.id>c.unlocked?' disabled':'')+' aria-current="'+(l.id===selected)+
        '" onclick="window.BVBCampaign.inspect('+l.id+')">'+
        (l.id>c.unlocked?'🔒 ':c.cleared.includes(l.id)?'✅ ':l.boss?'👑 ':'⚔️ ')+l.id+
        '<small>'+esc(l.title)+(c.stars.includes(l.id)?' ⭐':'')+'</small></button>'
      ).join('')+'</div>';
  }).join('');
}
function start(n){
 if(!Number.isInteger(n)||!stage(n)||n>saveState().unlocked||netRole==='guest')return;
 selected=n;startMatch(13);
}
function prepareMatch(g){
 if(!g||g.m!==13)return;
 const l=stage(selected);
 g.campaignLevel=l.id;g.th=l.arena;g.my=deck();g.bt=[l.boss?bossBall(l):B[l.enemyId]];
 g.h=l.boss?[3,3]:[2,2];
 g.rare=l.boss?'fx':l.id%7===0?'night':'';
 g.campaignGoalMet=false;g.campaignTotals={hits:0,abilities:0,portals:0,styles:[]};
 g.campaignEvent=null;g.campaignEventHandled=-1;g.campaignRewarded=false;
}
function addObstacles(g,n){
 g.obstacles ||= [];
 for(let i=0;i<n&&g.obstacles.length<6;i++){
  const p=randomEmptyPoint(g.obstacles),kind=obstacleKinds(g.th)[(i+g.rn)%obstacleKinds(g.th).length];
  g.obstacles.push({...p,r:16,kind,moving:false,dx:0,dy:0,moveClock:999,moveDuration:0,seed:i*2});
 }
}
function forcePortal(g){
 if(!g.portal){const p=randomEmptyPoint(g.obstacles||[],48);g.portal={...p,r:21,seed:Math.random()*6.28};}
}
function setupRound(g){
 if(!g||g.m!==13)return;
 const l=stage(g.campaignLevel);g.th=l.arena;
 if(['maze','fortress','boss','final','bounce'].includes(l.twist))addObstacles(g,l.twist==='maze'?4:2);
 if(l.twist==='portal'||g.campaignEvent?.id==='portal')forcePortal(g);
 if(g.campaignEvent?.id==='rocks')addObstacles(g,2);
}
function applyActors(g,p,e){
 if(!g||g.m!==13)return;
 const l=stage(g.campaignLevel),both=[p,e];
 const healthScale=1+(l.id-1)*.009;
 e.hp*=healthScale;e.mh*=healthScale;e.baseDmg*=1+(l.id-1)*.006;
 if(l.boss){e.hp*=1.4;e.mh*=1.4;e.baseDmg*=1.13;e.r=Math.max(25,e.r);e.abilityRate*=.83;}
 switch(l.twist){
 case 'bounce':p.speedFactor*=1.08;e.speedFactor*=1.08;break;
 case 'speed':p.speedFactor*=1.12;e.speedFactor*=1.23;break;
 case 'shield':p.status.shield=(p.status.shield||0)+10;e.status.shield=(e.status.shield||0)+18;break;
 case 'toxic':p.status.shield=(p.status.shield||0)+13;e.abilityRate*=.8;break;
 case 'glass':case 'blast':for(const o of both){o.hp*=.77;o.mh*=.77;o.baseDmg*=1.2;}break;
 case 'maze':e.baseDmg*=1.08;break;
 case 'ice':e.speedFactor*=.86;e.status.shield=(e.status.shield||0)+13;break;
 case 'portal':p.speedFactor*=1.1;break;
 case 'shock':for(const o of both)o.abilityRate*=.75;break;
 case 'wave':for(const o of both){o.speedFactor*=1.17;o.baseDmg*=1.08;}break;
 case 'fortress':e.status.shield=(e.status.shield||0)+22;p.baseDmg*=1.08;break;
 case 'final':e.status.shield=(e.status.shield||0)+30;e.speedFactor*=1.18;e.abilityRate*=.73;p.status.shield=(p.status.shield||0)+14;break;
 }
 switch(g.campaignEvent?.id){
 case 'comet':for(const o of both)o.baseDmg*=1.15;break;
 case 'boost':for(const o of both)o.speedFactor*=1.15;break;
 case 'shield':for(const o of both)o.status.shield=(o.status.shield||0)+12;break;
 case 'magic':for(const o of both)o.abilityRate*=.75;break;
 case 'gift':p.status.shield=(p.status.shield||0)+16;break;
 case 'rival':e.hp+=12;e.mh+=12;p.baseDmg*=1.1;break;
 case 'glass':for(const o of both){o.hp*=.85;o.mh*=.85;o.baseDmg*=1.2;}break;
 }
 for(const o of both){
  o.hp=Math.max(1,Math.round(o.hp));o.mh=Math.max(o.hp,Math.round(o.mh));
  o.baseDmg=Math.round(o.baseDmg*100)/100;
  o.abilityCd=Math.max(.3,o.abilityCd*(o.abilityRate||1));
 }
 g.campaignEvent=null;
}
function intermission(g){
 if(!g||g.m!==13||g.rn<1||g.campaignEventHandled===g.rn||g.h[0]<=0||g.h[1]<=0)return false;
 g.campaignEventHandled=g.rn;
 const candidates=EVENTS.filter(e=>e.id!==g.lastEvent);
 const event=candidates[Math.floor(Math.random()*candidates.length)];
 g.lastEvent=event.id;g.campaignEvent=event;g.ph='intermission';
 $('#fire').hidden=true;$('#cards').innerHTML='';
 $('#ov').hidden=false;
 $('#ovb').innerHTML='<h2>'+event.name+'</h2><p style="margin:16px 0">'+event.desc+'</p>'+
   '<p style="color:var(--mu)">Następna runda będzie inna!</p>'+
   '<button class="b graj" onclick="window.BVBCampaign.continueEvent()">⚔️ Następna runda</button>'+
   '<button class="b" onclick="menu()">Menu główne</button>';
 return true;
}
function continueEvent(){if(!G||G.m!==13||G.ph!=='intermission')return;$('#ov').hidden=true;nextRound();}
function onImpact(g){
 if(g?.m!==13)return;g.campaignTotals.hits++;
 if(stage(g.campaignLevel).goal==='hits'&&g.campaignTotals.hits>=4)g.campaignGoalMet=true;
}
function onAbility(g,o){
 if(g?.m!==13||o.team!==0)return;g.campaignTotals.abilities++;
 if(stage(g.campaignLevel).goal==='special'&&g.campaignTotals.abilities>=3)g.campaignGoalMet=true;
}
function onPortal(g,o){
 if(g?.m!==13||o.team!==0)return;g.campaignTotals.portals++;
 if(stage(g.campaignLevel).goal==='portal')g.campaignGoalMet=true;
}
function onRoundEnd(g,winner){
 if(g?.m!==13||winner!==0)return;
 const l=stage(g.campaignLevel),t=g.campaignTotals,p=g.bl.find(o=>o.team===0);if(!p)return;
 const stance=g.tactics?.[0]||'balanced';if(!t.styles.includes(stance))t.styles.push(stance);
 const met={fast:g.rt<=35,hits:t.hits>=4,health:p.hp/Math.max(1,p.mh)>=.4,
 special:t.abilities>=3,rush:stance==='rush',guard:stance==='guard',strike:stance==='strike',
 portal:t.portals>=1,styles:t.styles.length>=2,long:g.rt>=20,close:p.hp/Math.max(1,p.mh)<=.45};
 if(met[l.goal])g.campaignGoalMet=true;
}
function finish(g,won){
 if(g?.m!==13||g.campaignRewarded)return;
 g.campaignRewarded=true;
 const c=saveState(),n=g.campaignLevel,l=stage(n);
 const first=won&&!c.cleared.includes(n);
 let coins=0,stars=0;
 if(won){
  if(first)c.cleared.push(n);
  c.unlocked=Math.max(c.unlocked,Math.min(50,n+1));
  coins=first?45+n*6:10+n;
  if(g.campaignGoalMet&&!c.stars.includes(n)){c.stars.push(n);stars=25+n*2;}
  S.coins+=coins+stars;
  if(n===50)c.finalWon=true;
 }
 save();
 const next=won&&n<50;
 $('#ovb').innerHTML='<h2>'+(won?'🏆 Poziom '+n+' ukończony!':'💔 Spróbuj ponownie')+'</h2>'+
  '<h3>'+esc(l.title)+'</h3>'+
  (won?'<p>+'+coins+' 🪙'+(stars?' · ⭐ Gwiazdka +'+stars+' 🪙':'')+
   '</p><p>'+(next?'🔓 Odblokowano poziom '+(n+1):n===50?'👑 Ukończono 50 poziomów!':'Możesz walczyć o gwiazdkę.')+'</p>':
   '<p>Możesz zmienić skład lub taktykę.</p>')+
  '<button class="b graj" onclick="window.BVBCampaign.start('+(next?n+1:n)+')">'+(next?'➡️ Następny poziom':'🔄 Zagraj ponownie')+'</button>'+
  '<button class="b" onclick="window.BVBCampaign.open()">🗺️ Mapa poziomów</button>'+
  '<button class="b" onclick="menu()">Menu główne</button>';
}
const oldOver=over;
over=function(){
 const campaign=G?.m===13&&!G.finished,g=campaign?G:null;
 oldOver();if(g)finish(g,g.h[0]>0);
};
window.BVBCampaign={LEVELS,TWISTS,GOALS,EVENTS,open,render,inspect,start,chooseBall,deck,
prepareMatch,setupRound,applyActors,intermission,continueEvent,onImpact,onAbility,onPortal,onRoundEnd,saveState};
})();
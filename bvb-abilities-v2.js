/* BVB 2.0 — 130 named abilities, bespoke VFX motifs and arena physics.
   Host authoritative: no client-side damage on multiplayer guests. */
(() => {
'use strict';
const entries=[
['charge','Rozpęd Szarży','Przyspiesza, a następnym zderzeniem zadaje dodatkowe obrażenia.'],
['orbit','Ostrze Topora','Wirujące ostrze zwiększa zasięg, szczególnie przy małym HP.'],
['thorn','Jadowite Ściany','Odbicia zostawiają trujące kolce.'],
['volley','Cienie Złodzieja','Seria magicznych ostrzy jest szybsza przy niskim HP.'],
['orbit','Żywe Ostrza','Coraz więcej wirujących ostrzy trafia pobliskiego rywala.'],
['volley','Mechaniczna Salwa','Krótka seria energetycznych pocisków wycelowanych w przeciwnika.'],
['web','Sieć Między Ścianami','Dwa odbicia od różnych ścian łączą trwałą pajęczynę, która zadaje po 1 HP.'],
['drain','Wampirze Kły','Doskok i wyssanie HP przeciwnika leczą Wampira.'],
['dash','Przebicie Włóczni','Szybka szarża kończy się mocnym odrzutem.'],
['dash','Rozbłysk Uderzenia','Energetyczna szarża tworzy falę uderzeniową.'],
['chess','Mat w Ruchu','Ruch szachowy z nagłym wyprowadzeniem ataku.'],
['dice','Sześć Ścieżek','Losowa kostka zostawia strefę o jednym z sześciu efektów.'],
['frost','Lodowy Wachlarz','Odłamki lodu spowalniają wroga.'],
['beam','Ścienne Lasery','Dotknięcie ściany uruchamia krótki laser energetyczny.'],
['tail','Wężowy Ogon','Wydłużający się ogon odpycha i rani rywala.'],
['tether','Hak Przyciągania','Energetyczny hak przyciąga przeciwnika.'],
['pet','Kuźnia Pomocnika','Odbicia wzmacniają przywołanego pomocnika.'],
['growth','Podział Komórki','Komórka rośnie i odzyskuje część sił w krytycznej chwili.'],
['shock','Impuls Elektryczny','Zderzenie poraża i na moment unieruchamia rywala.'],
['zone','Strefa Nacisku','Świecące pole zadaje regularne niewielkie obrażenia.'],
['beam','Promień Namierzający','Skupiony promień prowadzi do przewidywanego położenia celu.'],
['grid','Siatka WDC','Cyfrowe pola dają różne wartości obrażeń.'],
['healshot','Złote Jabłko','Rzuca jabłkiem, które uderza wroga, a właściciela leczy.'],
['turret','Armata Ścienna','Odbicie przywołuje automatyczną wieżyczkę energii.'],
['poison','Infekcja Wirusa','Kontakt przenosi zatrucie na przeciwnika.'],
['thorn','Kolczasta Ściana','Masywne kolce bronią ścian areny.'],
['arrow','Rykoszet Strzały','Celny pocisk może odbić się od ścian trzykrotnie.'],
['grid','Korona Błyskawic','Siatka energii powstaje po odbiciu od ściany.'],
['pulse','Rosnący Zasięg','Poszerzający się pierścień uderza przeciwnika.'],
['frost','Ślad Szronu','Mroźne smugi pozostają za poruszającą się kulką.'],
['tether','Żelazny Harpun','Harpun przyciąga wroga na krótki dystans.'],
['swarm','Rój Obrońców','Pszczoły śledzą i zatruwają przeciwnika.'],
['potion','Alchemiczny Rzut','Losowy eliksir tworzy jeden z przydatnych efektów.'],
['train','Widmowy Pociąg','Odbicie przywołuje linię torów i przejeżdżający pociąg.'],
['web','Czarna Pajęczyna','Sieć między ścianami dodatkowo lekko zatruwa.'],
['mine','Grób Cieni','Na ziemi pojawia się pułapka z duchową energią.'],
['dash','Lot Światła','Błyskawiczny lot zostawia jasną smugę.'],
['volley','Cukierkowa Burza','Kolorowe pociski lekko spowalniają przeciwnika.'],
['growth','Żywy Szlam','Rosnąca masa tworzy lepką strefę.'],
['mine','Łańcuch Kajdan','Pułapka na chwilę zatrzymuje przeciwnika.'],
['poison','Żrąca Kałuża','Kwaśna strefa stopniowo osłabia rywala.'],
['beam','Świetlne Soczewki','Odbicie przywołuje odbijający się promień.'],
['gas','Trująca Mgła','Gazowa chmura zostawia krótką strefę trucizny.'],
['volley','Trzy Gwiazdy','Trzy obracające się gwiazdki przelatują pod różnymi kątami.'],
['charge','Ciąg Fibonacciego','Wzmocnienie po kolejnych trafieniach rośnie według ciągu.'],
['reflect','Naturalny Pancerz','Kolce odbijają niewielką część obrażeń przy zderzeniu.'],
['mine','Opóźniony Wybuch','Odłożona bomba wybucha energią po krótkim czasie.'],
['orbit','Orbita Satelitów','Małe satelity krążą, strzegąc właściciela.'],
['heal','Błysk Medyka','Leczy właściciela i daje chwilową osłonę.'],
['beam','Promień Prawdy','Prosty promień ignoruje iluzje i chwilowo zwiększa celność.'],
['shard','Pęknięcie Szkła','Zderzenie uwalnia ostre kryształowe odłamki.'],
['blink','Przeskok Portalu','Teleportuje kulkę w pobliże rywala, tworząc impuls.'],
['shield','Kryształowa Tarcza','Tarcza absorbuje część następnych obrażeń.'],
['potion','Kaprys Magika','Losuje korzystny magiczny efekt.'],
['time','Pętla Chronosa','Na krótko spowalnia ruch przeciwnika.'],
['blink','Skok Ninja','Szybko przemieszcza się poza linię ataku.'],
['volley','Salwa Korsarza','Krótka seria kul świetlnych rozchodzi się wachlarzem.'],
['mine','Kopalniany Ładunek','Ustawia świecącą minę na arenie.'],
['tether','Lasso Szeryfa','Chwyta przeciwnika świetlistą liną.'],
['lava','Rzeka Magmy','Gorący strumień zostawia plamę ognia.'],
['beam','Strumień Plazmy','Wiązka plazmy wywołuje energetyczny impuls.'],
['meteor','Deszcz Meteorów','Małe meteory opadają wokół przewidzianej pozycji celu.'],
['cyclone','Wir Cyklonu','Wir powietrza odpycha i zmienia lot przeciwnika.'],
['prism','Pryzmat Barw','Jeden promień rozpada się na trzy barwne wiązki.'],
['echo','Powtórka Echa','Drugi słabszy impuls nadchodzi chwilę po pierwszym.'],
['gravity','Studnia Grawitacji','Przyciąga wroga do energetycznego centrum.'],
['tether','Ciężar Kotwicy','Krótki chwyt spowalnia rywala.'],
['reflect','Odbicie Lustra','Lustrzana tarcza odbija część uderzenia.'],
['void','Sfera Pustki','Ciemny impuls wysysa niewielką porcję energii.'],
['sun','Korona Słońca','Gorący błysk podpala i oświetla arenę.'],
['moon','Sierp Księżyca','Świetlisty sierp przecina drogę rywala.'],
['eclipse','Cień Zaćmienia','Na moment osłabia siłę ataku przeciwnika.'],
['nova','Narodziny Supernowej','Energetyczny wybuch razi w dużym promieniu.'],
['gas','Obłok Mgławicy','Kolorowa mgławica spowalnia cel.'],
['pulse','Puls Pulsara','Seria krótkich, rytmicznych fal.'],
['beam','Strumień Kwazara','Skoncentrowany promień o dużym zasięgu.'],
['meteor','Ogon Komety','Pędzący obiekt zostawia płonącą smugę.'],
['shard','Odłamki Asteroidy','Kosmiczne fragmenty rozlatują się po kontakcie.'],
['blink','Skok Kwantowy','Krótkie przemieszczenie i mylący błysk.'],
['orbit','Orbitalne Powłoki','Elektronowe pierścienie osłaniają kulkę.'],
['pulse','Impuls Protonu','Dodatnio naładowana fala odpycha rywala.'],
['shield','Osłona Neutronu','Ciężka osłona zmniejsza obrażenia.'],
['shock','Ślad Elektronu','Przeskakująca iskra poraża wroga.'],
['shock','Dwie Iskry','Podwójny krótki impuls energii.'],
['lava','Pierścień Piekła','Płomienny krąg na chwilę podpala cel.'],
['wave','Fala Tsunami','Szeroka wodna fala spycha przeciwnika.'],
['quake','Wstrząs Ziemi','Punktowy impuls wywołuje silny odrzut.'],
['storm','Nawałnica Piorunów','Trzy krótkie pioruny w losowych kierunkach.'],
['frost','Zamieć Kryształów','Wir lodu spowalnia wroga.'],
['mirage','Miraż','Iluzja kierunku na chwilę dezorientuje rywala.'],
['shadow','Ślad Widma','Widmowy pocisk omija część przeszkód.'],
['blink','Przeskok Upiora','Niematerialny skok zostawia cień.'],
['drain','Zimna Zjawa','Zabiera niewiele życia i spowalnia wroga.'],
['tether','Sierp Kosiarza','Przyciągający łuk energii.'],
['doom','Znak Zagłady','Oznacza przeciwnika przed opóźnionym uderzeniem.'],
['potion','Chaos Równowagi','Losowa fala: ogień, lód lub osłona.'],
['shield','Pieczęć Porządku','Ochronna pieczęć przywraca kontrolę.'],
['phoenix','Odrodzenie Feniksa','Uderzenie płomieni leczy niewielką ilość zdrowia.'],
['tether','Macki Krakena','Wodne macki przyciągają i spowalniają przeciwnika.'],
['pumpkin','Korona Dyni','Dyniowy błysk i krótka fala energii.'],
['potion','Zaklęcie Wiedźmy','Rzuca zaklęcie o jednym z trzech efektów.'],
['gas','Dym Kotła','Magiczna chmura mąci ruch przeciwnika.'],
['blink','Skok Czarnego Kota','Szybki unik i zaskakujący błysk.'],
['swarm','Lot Nietoperzy','Stado energetycznych nietoperzy szuka celu.'],
['growth','Upór Zombie','Kulka regeneruje niewielką porcję zdrowia.'],
['doom','Klątwa Voodoo','Oznacza rywala przed opóźnioną utratą HP.'],
['mine','Strach na Wróble','Zostawia iluzoryczną pułapkę.'],
['swarm','Taniec Ogników','Małe ogniki podążają za przeciwnikiem.'],
['dash','Zew Wilkołaka','Dzika szarża staje się szybsza przy małym HP.'],
['wave','Krzyk Banshee','Dźwiękowa fala odpycha rywala.'],
['shield','Kamienny Pancerz','Twarda powłoka absorbuje uderzenie.'],
['eclipse','Krwawy Księżyc','Czerwony błysk osłabia cel.'],
['sun','Duch Latarni','Świetlista kula wysyła rozgrzany impuls.'],
['shield','Bandaże Mumii','Owijająca osłona chroni przed kolejnym ciosem.'],
['dash','Lot Gargulca','Kamienna szarża z krótką ochroną.'],
['pet','Widmowy Pomocnik','Przywołuje niewielkiego ducha, który śledzi wroga.'],
['reflect','Przeklęte Odbicie','Lustrzana fala cofa część energii ataku.'],
['web','Sieć Wdowy','Trwała pajęczyna między ścianami lekko zatruwa.'],
['dash','Pęd Bez Głowy','Mroczna szarża kończy się błyskiem.'],
['drain','Żniwa Dusz','Odbiera odrobinę HP rywalowi.'],
['pulse','Dzwon Północy','Rytmiczna fala uderzeniowa.'],
['frost','Lodowy Dotyk Upiora','Widmowy chłód spowalnia cel.'],
['swarm','Kruki Królowej','Małe kruki energii ścigają wroga.'],
['poison','Zgniły Opar','Słaby toksyczny obłok zadaje obrażenia w czasie.'],
['shield','Widmowa Zbroja','Rycerska osłona chwilowo chroni kulkę.'],
['volley','Cukierkowy Koszmar','Słodkie pociski tworzą krótki, mylący wir.'],
['blink','Nocny Lot','Szybka zmiana położenia i księżycowy błysk.'],
['potion','Grobowa Mikstura','Losowe zaklęcie trucizny, lodu lub leczenia.'],
['tether','Sznurki Marionetki','Świetliste nici przyciągają i spowalniają przeciwnika.'],
['shard','Kryształ Zaświatów','Mroźne kryształy rozpryskują się na boki.']
];
if(entries.length!==130)throw new Error('BVB 2.0: expected exactly 130 abilities');
const descriptions={
 charge:'Wzmocnione kolejne zderzenie',orbit:'Obracający się atak wokół kulki',
 thorn:'Kolce pojawiające się przy ścianach',volley:'Kilka celowanych pocisków',
 web:'Trwała sieć między dwiema ścianami',drain:'Wysysanie życia',
 dash:'Szarża w stronę rywala',chess:'Taktyczny ruch po liniach',
 dice:'Losowy, ale zawsze użyteczny efekt',frost:'Lodowy impuls i spowolnienie',
 beam:'Energetyczny promień',tail:'Ogon pozostający za kulką',
 tether:'Przyciągający impuls',pet:'Magiczny pomocnik',growth:'Regeneracja i wzrost',
 shock:'Porażenie elektryczne',zone:'Obszarowe obrażenia',
 grid:'Cyfrowa siatka',healshot:'Leczący pocisk',turret:'Automatyczna wieżyczka',
 poison:'Trucizna',arrow:'Rykoszetujący pocisk',pulse:'Rozszerzająca się fala',
 swarm:'Samonaprowadzające istoty',potion:'Losowy eliksir',train:'Pociąg po odbiciu',
 mine:'Pułapka',gas:'Gazowa strefa',reflect:'Odbicie obrażeń',
 heal:'Leczenie i osłona',shard:'Odłamki przy uderzeniu',blink:'Błyskawiczne przeniesienie',
 shield:'Osłona obronna',time:'Spowolnienie czasu',lava:'Płomienny obszar',
 meteor:'Spadające obiekty',cyclone:'Powietrzny wir',prism:'Rozszczepiony promień',
 echo:'Dwa następujące po sobie impulsy',gravity:'Przyciąganie',
 void:'Ciemny impuls',sun:'Świetlista fala',moon:'Księżycowy sierp',
 eclipse:'Osłabienie',nova:'Silna fala energii',quake:'Wstrząs i odrzut',
 storm:'Burza elektryczna',mirage:'Iluzja',shadow:'Widmowy pocisk',
 doom:'Opóźnione trafienie',phoenix:'Ogień i odnowa',
 pumpkin:'Dyniowy impuls',wave:'Wodna fala'
};
const colors={frost:'#93e9ff',shock:'#fde047',storm:'#fde047',sun:'#ffde70',
 lava:'#ff773d',poison:'#a3e635',gas:'#96e9a0',drain:'#f472b6',
 web:'#b7c8e9',shard:'#9ad6ee',shield:'#67e8f9',blink:'#c4b5fd',
 void:'#a78bfa',tether:'#a9b8ff',beam:'#93c5fd'};
const waveColors=['#fbbf24','#8b5cf6','#22d3ee','#fb7185','#a3e635'];
const oldStats=getBallStats,oldArt=art;
const abilityData=entries.map(([kind,title,desc],id)=>{
 const speed=kind==='dash'||kind==='blink'?1.09:kind==='shield'||kind==='growth'||kind==='mine'?.93:1;
 const baseHp=kind==='shield'||kind==='growth'||kind==='reflect'?123:kind==='dash'||kind==='blink'?96:108;
 const baseDamage=kind==='dash'||kind==='beam'||kind==='nova'?15:kind==='shield'||kind==='heal'?10:12;
 return {id,kind,title,desc,baseHp,baseDamage,speed,cooldown: +(3+(id*17%19)/10).toFixed(1),color:colors[kind]||B[id].c};
});
for(let i=0;i<B.length;i++){
 const data=abilityData[i];B[i].d=data.desc;B[i].skillTitle=data.title;
 BASE_HP_TABLE[i]=data.baseHp;BASE_CD_TABLE[i]=data.cooldown;
}
getBallStats=function(id,...args){
 const st=oldStats(id,...args);const d=abilityData[id]||abilityData[0];
 const tierMult=st.tier===3?1.32:st.tier===2?1.15:1;
 st.dmg=Math.round(d.baseDamage*(1+.08*st.dmgLv)*tierMult);
 st.cd=+(d.cooldown*(st.tier===3?.72:st.tier===2?.85:1)).toFixed(2);
 st.activeDesc=d.desc+(st.tier>1?' · Ewolucja V'+st.tier+': silniejszy efekt.':'');
 return st;
};
function roundState(){
 if(!G)return null;
 G.v2 ||= {shots:[],hazards:[],webs:[],beams:[],effects:[],tick:0,serial:0};
 return G.v2;
}
function visual(owner,point,kind='burst',size=24,color=null,duration=.48){
 const state=roundState();if(!state)return;
 const pos=point||owner;
 state.effects.push({x:pos.x,y:pos.y,kind,size,color:color||owner?.b?.c||'#fff',age:0,life:duration,id:owner?.b?.id||0});
 if(state.effects.length>35)state.effects.splice(0,state.effects.length-35);
 if(owner && typeof burst==='function')burst(owner,effectType(owner.b),4,false);
}
function strike(source,target,amount,options={}){
 if(!alive(target))return;
 applyDamage(target,Math.max(.5,amount));
 if(options.poison)target.status.poison=Math.max(target.status.poison||0,options.poison);
 if(options.burn)target.status.burn=Math.max(target.status.burn||0,options.burn);
 if(options.slow)target.status.slow=Math.max(target.status.slow||0,options.slow);
 if(options.stun)target.status.stun=Math.max(target.status.stun||0,Math.min(.55,options.stun));
 if(options.knock){
  let dx=target.x-(source?.x||180),dy=target.y-(source?.y||180),d=Math.hypot(dx,dy)||1;
  target.vx+=dx/d*options.knock;target.vy+=dy/d*options.knock;
  const sp=Math.hypot(target.vx,target.vy);
  if(sp>1.35){target.vx*=1.35/sp;target.vy*=1.35/sp;}
 }
 visual(source,target,'impact',10,source?.b?.c,.28);
}
function shoot(o,foe,opts={}){
 if(!foe||!alive(foe))return;
 const st=roundState(),count=Math.max(1,Math.min(7,opts.count||1)),speed=opts.speed||145;
 const lead=Math.min(.42,Math.hypot(foe.x-o.x,foe.y-o.y)/Math.max(120,speed))*((opts.homing||0)>.5?.85:.55);
 const targetX=Math.max(18,Math.min(342,foe.x+foe.vx*110*lead));
 const targetY=Math.max(18,Math.min(342,foe.y+foe.vy*110*lead));
 const heading=Math.atan2(targetY-o.y,targetX-o.x);
 for(let i=0;i<count;i++){
  const a=heading+(i-(count-1)/2)*(opts.spread??.18);
  st.shots.push({x:o.x+Math.cos(a)*(o.r+5),y:o.y+Math.sin(a)*(o.r+5),
   px:o.x,py:o.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,
   owner:o.uid,team:o.team,id:o.b.id,damage:opts.damage||o.baseDmg*.45,
   r:opts.r||4,life:opts.life||2.2,age:0,homing:opts.homing||0,bounces:opts.bounces||0,
   slow:opts.slow||0,poison:opts.poison||0,burn:opts.burn||0,stun:opts.stun||0,
   knock:opts.knock||0,color:opts.color||abilityData[o.b.id].color});
 }
 if(st.shots.length>80)st.shots.splice(0,st.shots.length-80);
 visual(o,o,'charge',17,abilityData[o.b.id].color,.34);
}
function zone(o,x,y,kind='zone',radius=29,life=3,power=1){
 const st=roundState();if(!st)return;
 st.hazards.push({x,y,kind,owner:o.uid,team:o.team,id:o.b.id,radius,life,max:life,
  power,age:0,cooldown:0,color:abilityData[o.b.id].color});
 if(st.hazards.length>45)st.hazards.splice(0,st.hazards.length-45);
 visual(o,{x,y},'circle',radius,abilityData[o.b.id].color,.55);
}
function radial(o,foe,mult=.55,opts={}){
 if(!foe||!alive(foe))return;
 visual(o,o,'ring',Math.max(o.r+12,Math.min(110,opts.radius||60)),abilityData[o.b.id].color,.65);
 if(Math.hypot(foe.x-o.x,foe.y-o.y)<(opts.radius||93))strike(o,foe,o.baseDmg*mult,opts);
}
function dash(o,foe,strength=.32,opts={}){
 if(!foe)return;const d=Math.hypot(foe.x-o.x,foe.y-o.y)||1;
 o.vx=(foe.x-o.x)/d*(1+strength);o.vy=(foe.y-o.y)/d*(1+strength);
 o.skillImpact=Math.max(o.skillImpact||0,1.5);
 if(opts.shield)o.status.shield=(o.status.shield||0)+opts.shield;
 visual(o,o,'slash',39,abilityData[o.b.id].color,.55);
}
function webPoint(o,side){
 const st=roundState();if(!st)return;
 const p={x:o.x,y:o.y,side};
 const start=o.v2WallAnchor;
 if(start&&start.side!==side){
  st.webs.push({a:start,b:p,team:o.team,id:o.b.id,owner:o.uid,cooldowns:{},color:o.b.id===34||o.b.id===117?'#aa83da':'#d4e7ff'});
  visual(o,{x:(start.x+p.x)/2,y:(start.y+p.y)/2},'web',38,'#dcecff',.7);
 }
 o.v2WallAnchor=p;
}
function onWall(o,side){
 const d=abilityData[o.b.id];if(!d)return;
 const st=roundState();if(!st)return;
 if(o.v2LastSide===side&&(G.rt-(o.v2LastWallAt||0))<.12)return;
 o.v2LastSide=side;o.v2LastWallAt=G.rt||0;
 if(d.kind==='web')webPoint(o,side);
 if(d.kind==='thorn')zone(o,o.x,o.y,'thorn',15,16,.65);
 if(d.kind==='beam'&&(o.b.id===13||o.b.id===41))zone(o,o.x,o.y,'laser',17,3,.45);
 if(d.kind==='turret'||d.kind==='pet'||d.kind==='train')zone(o,o.x,o.y,d.kind,23,4,.65);
 if(d.kind==='grid'&&o.b.id===27)zone(o,o.x,o.y,'shock',30,2,.55);
 if(d.kind==='frost'&&o.b.id===29)zone(o,o.x,o.y,'frost',19,3,.38);
 if(d.kind==='charge'){o.skillCharge=Math.min(5,(o.skillCharge||0)+1);}
}
function cooldown(o){
 const d=abilityData[o.b.id];const rate=Math.max(.55,Math.min(1.5,o.abilityRate||1));
 return Math.max(2.25,(d?.cooldown||4)*rate*(o.tier===3?.78:o.tier===2?.90:1));
}
function cast(o,foe){
 if(!o||!foe||!alive(foe)||!G)return;
 const d=abilityData[o.b.id]||abilityData[0],kind=d.kind;
 const scale=Math.min(1.26,1+(Math.max(1,o.tier||1)-1)*.12);
 const delta=Math.hypot(foe.x-o.x,foe.y-o.y);
 const lowHp=o.hp/Math.max(1,o.mh)<.35;
 o.attackGlow=.7;G.v2SkillId=o.b.id;
 switch(kind){
 case 'web': visual(o,o,'web',27,d.color,.5);break; // webs form only on actual wall impacts
 case 'charge': o.skillCharge=Math.min(5,(o.skillCharge||0)+1);dash(o,foe,.22);break;
 case 'orbit':
  o.skillSpin=(o.skillSpin||0)+1;
  if(delta<90)strike(o,foe,o.baseDmg*(.28+Math.min(5,o.skillSpin)*.08)*(lowHp?1.18:1),{knock:.19});
  visual(o,o,'orbit',34,d.color,.72);break;
 case 'thorn': visual(o,o,'charge',24,d.color,.5);break; // only walls create spikes
 case 'volley': shoot(o,foe,{count:o.b.id===5?5:o.b.id===43?3:o.b.id===3?2:3,
   damage:o.baseDmg*(o.b.id===5?.2:.36)*scale,homing:.2,spread:.22,
   speed:lowHp&&o.b.id===3?195:168,slow:o.b.id===37?.4:0});break;
 case 'drain':
  if(delta<128){strike(o,foe,Math.min(8,foe.hp*.06)*scale,{slow:.25});
    o.hp=Math.min(o.mh,o.hp+Math.min(7,o.baseDmg*.4));}
  else dash(o,foe,.15);
  visual(o,o,'tether',25,d.color,.58);break;
 case 'dash':dash(o,foe,.35, {shield:o.b.id===114?6:0});break;
 case 'chess':
  o.vx=Math.abs(foe.x-o.x)>Math.abs(foe.y-o.y)?Math.sign(foe.x-o.x)||1:0;
  o.vy=o.vx===0?Math.sign(foe.y-o.y)||1:0;
  visual(o,o,'chess',42,d.color,.65);
  if(delta<96)strike(o,foe,o.baseDmg*.55,{knock:.24});break;
 case 'dice':case 'potion': {
  const roll=Math.floor(Math.random()*3);
  if(roll===0)shoot(o,foe,{damage:o.baseDmg*.45,slow:.65,color:d.color});
  else if(roll===1)zone(o,foe.x,foe.y,'poison',30,2.8,.38);
  else {o.status.shield=(o.status.shield||0)+9;visual(o,o,'shield',33,d.color,.55);}
  break;
 }
 case 'frost':
  shoot(o,foe,{count:o.b.id===12?3:2,damage:o.baseDmg*.24,slow:1.05,spread:.26,color:'#a5f3fc'});break;
 case 'beam':{
  const lead=.19,target={x:foe.x+foe.vx*22*lead,y:foe.y+foe.vy*22*lead};
  roundState().beams.push({x:o.x,y:o.y,x2:target.x,y2:target.y,color:d.color,life:.35,max:.35,id:o.b.id});
  strike(o,foe,o.baseDmg*.43*scale,{stun:o.b.id===20?.12:0});visual(o,o,'beam',23,d.color,.55);break;
 }
 case 'tail':case 'growth':{
  o.skillScale=Math.min(1.23,(o.skillScale||1)+.025);
  o.hp=Math.min(o.mh,o.hp+3.3*scale);
  zone(o,o.x,o.y,kind==='tail'?'tail':'slime',24,3,.29);
  visual(o,o,'growth',28,d.color,.7);break;
 }
 case 'tether':
  if(delta<240){const f=.32;foe.vx+=(o.x-foe.x)/Math.max(1,delta)*f;
   foe.vy+=(o.y-foe.y)/Math.max(1,delta)*f;
   strike(o,foe,o.baseDmg*.4,{slow:.45});}
  roundState().beams.push({x:o.x,y:o.y,x2:foe.x,y2:foe.y,color:d.color,life:.3,max:.3,id:o.b.id});
  visual(o,o,'tether',20,d.color,.4);break;
 case 'pet':case 'turret':case 'train':zone(o,o.x,o.y,kind,22,5,.7);break;
 case 'shock':case 'storm':
  shoot(o,foe,{count:kind==='storm'?3:1,damage:o.baseDmg*.32,stun:.22,homing:.45,color:'#fde047',spread:.23});break;
 case 'zone':case 'gas':case 'poison':
  zone(o,foe.x,foe.y,kind,kind==='gas'?38:30,3,.42);break;
 case 'grid':
  zone(o,foe.x,foe.y,'grid',46,2.8,.45);break;
 case 'healshot':
  o.hp=Math.min(o.mh,o.hp+4.5*scale);
  shoot(o,foe,{damage:o.baseDmg*.38,homing:.13,color:'#fbbf24'});break;
 case 'arrow':
  shoot(o,foe,{damage:o.baseDmg*.6,bounces:3,speed:180,r:3,color:'#fef08a'});break;
 case 'pulse':case 'wave':case 'quake':case 'nova':
  radial(o,foe,kind==='nova'?.73:.5,{radius:kind==='wave'?155:kind==='nova'?130:100,
     knock:kind==='wave'||kind==='quake'?.36:.18,slow:kind==='pulse'?.18:0});break;
 case 'swarm':shoot(o,foe,{count:o.b.id===31?3:2,damage:o.baseDmg*.22,homing:2.5,
   poison:o.b.id===31?.8:0,speed:118,life:3.1,color:d.color});break;
 case 'mine':zone(o,foe.x,foe.y,'mine',24,5,.72);break;
 case 'reflect':case 'shield':
  o.status.shield=Math.min(32,(o.status.shield||0)+(kind==='shield'?13:8)*scale);
  o.skillReflect=kind==='reflect'?1.7:0;
  visual(o,o,'shield',34,d.color,.68);break;
 case 'heal':
  o.hp=Math.min(o.mh,o.hp+7*scale);o.status.shield=Math.min(26,(o.status.shield||0)+5);
  visual(o,o,'heal',30,'#86efac',.62);break;
 case 'shard':
  for(let j=0;j<5;j++){shoot(o,foe,{count:1,damage:o.baseDmg*.25,
     spread:0,speed:155+12*j,bounces:1,color:d.color});}
  visual(o,o,'shard',32,d.color,.5);break;
 case 'blink':{
  const a=Math.atan2(o.y-foe.y,o.x-foe.x)+(Math.random()-.5)*1.1;
  o.x=clamp(foe.x+Math.cos(a)*80,o.r,W-o.r);
  o.y=clamp(foe.y+Math.sin(a)*80,o.r,W-o.r);
  visual(o,o,'blink',33,d.color,.65);break;
 }
 case 'time':case 'eclipse':
  foe.status.slow=Math.max(foe.status.slow||0,kind==='time'?1.2:.7);
  if(kind==='eclipse')foe.status.weaken=Math.max(foe.status.weaken||0,1.6);
  visual(o,foe,'clock',41,d.color,.75);break;
 case 'lava':case 'sun':
  zone(o,foe.x,foe.y,kind==='lava'?'fire':'sun',31,2.8,.52);break;
 case 'meteor':shoot(o,foe,{count:3,damage:o.baseDmg*.29,spread:.36,burn:.65,bounces:1,speed:145});break;
 case 'cyclone':case 'gravity':{
  const dir=kind==='gravity'?-1:1;
  foe.vx+=(foe.x-o.x)/Math.max(1,delta)*.26*dir;foe.vy+=(foe.y-o.y)/Math.max(1,delta)*.26*dir;
  radial(o,foe,.29,{radius:175,knock:kind==='cyclone'?.2:0});break;
 }
 case 'prism':shoot(o,foe,{count:3,damage:o.baseDmg*.3,spread:.33,color:'#a5b4fc'});break;
 case 'echo':{
  radial(o,foe,.32,{radius:130});
  zone(o,foe.x,foe.y,'echo',26,1.8,.38);break;
 }
 case 'void':case 'shadow':
  strike(o,foe,o.baseDmg*.42,{slow:.38});
  if(kind==='void')o.hp=Math.min(o.mh,o.hp+2);
  visual(o,foe,'shadow',32,d.color,.65);break;
 case 'moon':shoot(o,foe,{count:2,damage:o.baseDmg*.38,spread:.17,bounces:1,color:'#c4b5fd'});break;
 case 'mirage':o.status.shield=(o.status.shield||0)+8;dash(o,foe,.12);break;
 case 'doom':zone(o,foe.x,foe.y,'doom',22,2,.65);break;
 case 'phoenix':o.hp=Math.min(o.mh,o.hp+4);zone(o,o.x,o.y,'fire',31,3,.32);break;
 case 'pumpkin':radial(o,foe,.47,{radius:115,knock:.18});break;
 default:shoot(o,foe,{damage:o.baseDmg*.5,homing:.15});
 }
 if(typeof snd==='function'&&o.b.id%5===0)snd(420+(o.b.id*19)%650,.11,'triangle',.018,180);
}
const oldSpecial=specialAbility;
specialAbility=cast;
function closestToSegment(px,py,ax,ay,bx,by){
 const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy||1)));
 return Math.hypot(px-(ax+t*dx),py-(ay+t*dy));
}
function tick(dt){
 if(!G||G.ph!=='battle'||netRole==='guest')return;
 const st=roundState();if(!st)return;
 st.tick+=dt;
 for(const o of G.bl||[]){
  if(!alive(o))continue;
  o.skillReflect=Math.max(0,(o.skillReflect||0)-dt);
  if(o.skillImpact>0)o.skillImpact=Math.max(0,o.skillImpact-dt);
  if(o.status.weaken>0)o.status.weaken=Math.max(0,o.status.weaken-dt);
 }
 for(const s of st.shots){
  s.age+=dt;s.life-=dt;if(s.life<=0)continue;
  s.px=s.x;s.py=s.y;
  if(s.homing){
   const foe=G.bl.find(t=>t.team!==s.team&&alive(t));
   if(foe){
    const angle=Math.atan2(foe.y-s.y,foe.x-s.x),speed=Math.hypot(s.vx,s.vy),turn=Math.min(1,s.homing*dt);
    const dx=Math.cos(angle)*speed,dy=Math.sin(angle)*speed;
    s.vx=s.vx*(1-turn)+dx*turn;s.vy=s.vy*(1-turn)+dy*turn;
   }
  }
  s.x+=s.vx*dt;s.y+=s.vy*dt;
  if(s.x<7||s.x>353){if(s.bounces>0){s.vx*=-1;s.bounces--;s.x=clamp(s.x,7,353);}else s.life=0;}
  if(s.y<7||s.y>353){if(s.bounces>0){s.vy*=-1;s.bounces--;s.y=clamp(s.y,7,353);}else s.life=0;}
  if(s.life<=0)continue;
  const target=G.bl.find(o=>o.team!==s.team&&alive(o)&&closestToSegment(o.x,o.y,s.px,s.py,s.x,s.y)<o.r+s.r);
  if(target){
   const owner=G.bl.find(o=>o.uid===s.owner);
   if(owner)strike(owner,target,s.damage,{slow:s.slow,poison:s.poison,burn:s.burn,stun:s.stun,knock:s.knock});
   s.life=0;
  }
 }
 st.shots=st.shots.filter(p=>p.life>0);
 for(const h of st.hazards){
  h.age+=dt;h.life-=dt;h.cooldown-=dt;
  if(h.life<=0)continue;
  const foe=G.bl.find(o=>o.team!==h.team&&alive(o)&&Math.hypot(o.x-h.x,o.y-h.y)<o.r+h.radius);
  if(!foe||h.cooldown>0)continue;
  const owner=G.bl.find(o=>o.uid===h.owner)||null;
  if(!owner)continue;
  if(h.kind==='shock')strike(owner,foe,3*h.power,{stun:.19});
  else if(h.kind==='frost')strike(owner,foe,2*h.power,{slow:.9});
  else if(h.kind==='poison'||h.kind==='gas'||h.kind==='tail'||h.kind==='slime')
   strike(owner,foe,2*h.power,{poison:.65,slow:h.kind==='slime'?.6:0});
  else if(h.kind==='fire'||h.kind==='sun')strike(owner,foe,3*h.power,{burn:.8});
  else if(h.kind==='mine'||h.kind==='doom'||h.kind==='train')strike(owner,foe,7*h.power,{knock:.28});
  else strike(owner,foe,3*h.power,{knock:h.kind==='zone'?.1:0});
  h.cooldown=h.kind==='mine'||h.kind==='doom'?99:.62;
 }
 st.hazards=st.hazards.filter(h=>h.life>0);
 for(const w of st.webs){
  for(const foe of G.bl||[]){
   if(!alive(foe)||foe.team===w.team)continue;
   const now=G.rt||0,last=w.cooldowns[foe.uid]??-10;
   if(now-last<.5)continue;
   if(closestToSegment(foe.x,foe.y,w.a.x,w.a.y,w.b.x,w.b.y)<=foe.r+2){
    const owner=G.bl.find(o=>o.uid===w.owner)||null;
    if(owner)strike(owner,foe,1,{poison:w.id===34||w.id===117?.4:0});
    w.cooldowns[foe.uid]=now;
   }
  }
 }
 for(const p of st.effects)p.age+=dt;
 st.effects=st.effects.filter(p=>p.age<p.life);
 for(const b of st.beams)b.life-=dt;
 st.beams=st.beams.filter(b=>b.life>0);
}
const oldStep=step;
step=function(dt){
 if(!G||G.ph!=='battle')return;
 const previous=(G.bl||[]).map(o=>({o,x:o.x,y:o.y,vx:o.vx,vy:o.vy}));
 oldStep(dt);
 if(!G||G.ph!=='battle'||netRole==='guest')return;
 for(const p of previous){
  const o=p.o;if(!alive(o))continue;
  let side=null;
  if(p.vx*o.vx<0&&(o.x<=o.r+.3||o.x>=W-o.r-.3))side=o.x<W/2?'left':'right';
  if(p.vy*o.vy<0&&(o.y<=o.r+.3||o.y>=W-o.r-.3))side=o.y<W/2?'top':'bottom';
  if(side)onWall(o,side);
 }
 tick(dt);
};
function drawOverlay(){
 if(!G||!G.v2)return;
 const st=G.v2;
 cx.save();
 for(const w of st.webs||[]){
  const p=w.a,q=w.b;
  cx.lineWidth=1.6;cx.strokeStyle=w.color;cx.shadowColor='#cbd5e1';cx.shadowBlur=6;
  cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke();
  cx.lineWidth=.8;cx.globalAlpha=.7;
  for(let i=1;i<7;i++){
   const t=i/7,x=p.x+(q.x-p.x)*t,y=p.y+(q.y-p.y)*t;
   cx.beginPath();cx.moveTo(x-8,y-6);cx.lineTo(x+8,y+6);cx.stroke();
  }
  cx.globalAlpha=1;
 }
 for(const h of st.hazards||[]){
  cx.globalAlpha=Math.min(.5,.16+.34*Math.min(1,h.life/.6));cx.fillStyle=h.color;cx.strokeStyle=h.color;
  cx.shadowColor=h.color;cx.shadowBlur=10;
  cx.beginPath();cx.arc(h.x,h.y,h.radius,0,Math.PI*2);cx.fill();
  cx.globalAlpha=.9;cx.lineWidth=2;cx.stroke();
 }
 for(const p of st.shots||[]){
  cx.globalAlpha=.4;cx.lineWidth=Math.max(2,p.r*.85);cx.lineCap='round';
  cx.strokeStyle=p.color;cx.beginPath();cx.moveTo(p.px,p.py);cx.lineTo(p.x,p.y);cx.stroke();
  cx.globalAlpha=1;cx.shadowColor=p.color;cx.shadowBlur=14;cx.fillStyle=p.color;
  cx.beginPath();cx.arc(p.x,p.y,p.r,0,Math.PI*2);cx.fill();
  cx.fillStyle='#fff';cx.beginPath();cx.arc(p.x-p.r*.25,p.y-p.r*.3,Math.max(1,p.r*.36),0,Math.PI*2);cx.fill();
 }
 for(const b of st.beams||[]){
  cx.globalAlpha=Math.min(1,b.life/b.max);cx.lineCap='round';cx.strokeStyle=b.color;cx.shadowColor=b.color;
  cx.shadowBlur=17;cx.lineWidth=7;cx.beginPath();cx.moveTo(b.x,b.y);cx.lineTo(b.x2,b.y2);cx.stroke();
  cx.shadowBlur=0;cx.strokeStyle='#f8fafc';cx.lineWidth=2;cx.stroke();
 }
 for(const e of st.effects||[]){
  const t=Math.min(1,e.age/e.life),alpha=(1-t)*(1-t);
  cx.globalAlpha=Math.min(1,alpha);cx.shadowBlur=12;cx.shadowColor=e.color;
  cx.strokeStyle=e.color;cx.lineWidth=Math.max(.7,3*(1-t));
  if(e.kind==='slash'){cx.beginPath();cx.arc(e.x,e.y,e.size*(.45+t),-.6,1.95);cx.stroke();}
  else if(e.kind==='orbit'){for(let i=0;i<3;i++){cx.beginPath();cx.arc(e.x,e.y,e.size*(.4+t),i*2*Math.PI/3+t,i*2*Math.PI/3+.5+t);cx.stroke();}}
  else if(e.kind==='clock'){cx.beginPath();cx.arc(e.x,e.y,e.size*(.5+t),0,7);cx.stroke();cx.beginPath();cx.moveTo(e.x,e.y);cx.lineTo(e.x+e.size*.35,e.y-e.size*.3);cx.stroke();}
  else {cx.beginPath();cx.arc(e.x,e.y,e.size*(.35+t),0,Math.PI*2);cx.stroke();}
 }
 cx.restore();
}
const oldDraw=draw;
draw=function(){oldDraw();drawOverlay();};
function enhanceArt(id){
 const old=oldArt(id),data=abilityData[id];if(!old)return old;
 const col=B[id].c,accent=data.color,grad='g'+id;
 const background='<defs><radialGradient id="'+grad+'" cx="35%" cy="24%" r="78%">'+
 '<stop offset="0" stop-color="#ffffff" stop-opacity=".64"/>'+
 '<stop offset=".17" stop-color="'+col+'" stop-opacity=".95"/>'+
 '<stop offset=".75" stop-color="'+col+'" stop-opacity=".82"/>'+
 '<stop offset="1" stop-color="#090c22"/></radialGradient></defs>'+
 '<circle cx="32" cy="32" r="28" fill="url(#'+grad+')" stroke="'+accent+'" stroke-width="2.4"/>'+
 '<path d="M13 22Q20 9 39 10" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2.4" stroke-linecap="round"/>';
 const shine='<circle cx="47" cy="47" r="5" fill="'+accent+'" opacity=".16"/>';
 let extra='';
 if(id===7)extra='<path d="M24 31L28 45L32 33L37 46L41 31" fill="#fff" stroke="#fff" stroke-width="1"/>'+
 '<ellipse cx="25" cy="24" rx="3.5" ry="2" fill="#f43f5e"/><ellipse cx="39" cy="24" rx="3.5" ry="2" fill="#f43f5e"/>';
 if(id===6||id===34||id===117)extra='<g stroke="#cbd5e1" stroke-width="2" fill="none">'+
 '<path d="M13 22L3 12M11 32L1 30M13 43L2 55M50 22L61 12M52 32L63 30M50 43L62 55"/></g>'+
 '<g fill="#f8fafc"><circle cx="25" cy="27" r="2.4"/><circle cx="32" cy="25" r="2.4"/><circle cx="39" cy="27" r="2.4"/></g>';
 if(id===1)extra+='<path d="M9 48L28 13" fill="none" stroke="#b5a48e" stroke-width="4"/><path d="M24 10L51 8L52 28L32 29Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>';
 if(id===18||id===27||id===83||id===129)extra+='<path d="M32 4L23 27H34L26 50L46 21H34Z" fill="#fde047" stroke="#fff" stroke-width="1.4"/>';
 // All 130 existing unique SVG foreground designs are retained, while the common
 // square backing is replaced with a lighted sphere and character accents.
 const square=/<rect x="1" y="1" width="62" height="62" rx="18"[^>]*\/>/;
 return old.replace(square,background)+'' /* Keep markup valid and self-contained */
   .replace('</svg>',shine+extra+'</svg>');
}
art=function(id){if(!ART.has('v2'+id))ART.set('v2'+id,enhanceArt(id));return ART.get('v2'+id);};
ART_IMAGES.clear();preloadArt();
function prepareActors(g,p,e){
 if(!g||netRole==='guest')return;
 for(const o of [p,e]){
  if(!o)continue;
  const data=abilityData[o.b.id];
  o.speedFactor=(o.speedFactor||1)*(data?.speed||1);
  o.abilityCd=Math.min(o.abilityCd,1.5);
 }
}
function afterLoad(){ART_IMAGES.clear();preloadArt();}
window.BVB2={abilities:abilityData,onWall,cooldown,prepareActors,afterLoad,drawOverlay};
})();
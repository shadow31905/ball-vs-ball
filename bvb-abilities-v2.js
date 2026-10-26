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
['dice','Sześć Ścieżek','Rzut kostką daje jeden z sześciu efektów: pocisk, spowolnienie, tarczę, leczenie, ogień lub truciznę.'],
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
const verifiedDescriptions={"13":"Aktywacja trafia promieniem, a odbicie od ściany tworzy wzdłuż niej laser.","24":"Tworzy toksyczne pole; przez 3 sekundy kontakt dodatkowo zatruwa rywala.","29":"Lodowe pociski spowalniają, a odbicia zostawiają strefy szronu.","41":"Aktywacja trafia promieniem, a odbicia tworzą lasery wzdłuż ścian.","49":"Celuje prostą wiązką i trafia w aktualną pozycję rywala.","51":"Teleportuje kulkę w pobliże rywala, pozostawiając widoczny błysk.","61":"Trzy płonące meteory lecą wachlarzem i mogą raz odbić się od ściany.","65":"Przyciąga rywala do właściciela i uderza pobliski cel falą.","76":"Trzy meteory zostawiają płonące trafienia i raz odbijają się od ściany.","125":"Cukierkowe pociski lecą wachlarzem i lekko naprowadzają się na rywala."};
for(const [id,desc] of Object.entries(verifiedDescriptions))entries[Number(id)][2]=desc;
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
 st.cd=d.kind==='web'?0:+Math.max(2.25,d.cooldown*(st.tier===3?.78:st.tier===2?.90:1)).toFixed(2);
 st.activeDesc=d.title+': '+d.desc+' · '+evolutionDescription(id,st.tier);
 st.evolutionDesc=evolutionDescription(id,st.tier);
 st.speed=d.speed;
 const identity=window.BVBIdentities?.get?.(id);
 if(identity){st.passiveName=identity.passive.name;st.passiveDesc=identity.passive.desc;st.superName=identity.super.name;st.superDesc=identity.super.desc;st.superThreshold=100;st.superLimit=2;}
 return st;
};


/*
 * Per-ball V2/V3 combat upgrades for the 114 identities not covered by the
 * initial 0–15 manual rework. Every listed ball retains its V1 skill.
 * V2 introduces the first extra attack/support mechanic. V3 keeps and
 * strengthens it AND adds a different second mechanic. Both are visible in
 * real combat, not just in the preview. All effects are host authoritative.
 */
const authoredUpgrades=Object.freeze({
 16:['forgeDrone','forgeAnvil'],
 17:['cellBud','mitosisBloom'],
 18:['conductorArc','overloadCircuit'],
 19:['pressureAura','gravityVortex'],
 20:['predictiveRay','reflectionEcho'],
 21:['matrixCenter','matrixRewire'],
 22:['orchardHarvest','goldenOrchard'],
 23:['turretBattery','ricochetShell'],
 24:['virusIncubation','virusMutation'],
 25:['briarWall','briarCitadel'],
 26:['longRicochet','ricochetSplit'],
 27:['crownPylons','crownStorm'],
 28:['growingRipples','returningWave'],
 29:['frostFootprints','iceTrail'],
 30:['harpoonAnchor','harpoonReel'],
 31:['hiveGuard','queenSwarm'],
 32:['cleanse','scatter'],
 33:['shockwave','mineField'],
 34:['slowField','venomField'],
 35:['weaken','mineField'],
 36:['guard','pushwave'],
 37:['frostShot','lure'],
 38:['slowField','healing'],
 39:['stun','mineField'],
 40:['weaken','venomField'],
 41:['bounceShot','pierceShot'],
 42:['venomField','slowField'],
 43:['scatter','bounceShot'],
 44:['pushwave','guard'],
 45:['mirror','thornField'],
 46:['mineField','burnwave'],
 47:['guard','sparkShot'],
 48:['cleanse','healing'],
 49:['pierceShot','stun'],
 50:['scatter','frostField'],
 51:['ghostShot','guard'],
 52:['cleanse','mirror'],
 53:['sparkShot','healing'],
 54:['slowField','stun'],
 55:['ghostShot','stun'],
 56:['bounceShot','slowField'],
 57:['mineField','guard'],
 58:['pull','stun'],
 59:['fireField','burnwave'],
 60:['shockField','sparkShot'],
 61:['fireField','scatterFire'],
 62:['pushwave','slowField'],
 63:['scatter','sparkShot'],
 64:['echo','pushwave'],
 65:['pull','slowField'],
 66:['slowField','pull'],
 67:['mirror','sparkShot'],
 68:['drain','ghostShot'],
 69:['burnwave','guard'],
 70:['bounceShot','slowField'],
 71:['weaken','guard'],
 72:['burnwave','pushwave'],
 73:['slowField','venomShot'],
 74:['echo','sparkShot'],
 75:['pierceShot','shockwave'],
 76:['burnwave','fireField'],
 77:['scatter','mineField'],
 78:['ghostShot','cleanse'],
 79:['guard','mirror'],
 80:['pushwave','sparkShot'],
 81:['cleanse','guard'],
 82:['shockField','sparkShot'],
 83:['sparkShot','shockField'],
 84:['burnwave','fireField'],
 85:['slowField','pushwave'],
 86:['mineField','stun'],
 87:['sparkShot','shockField'],
 88:['frostField','frostShot'],
 89:['lure','ghostShot'],
 90:['ghostShot','weaken'],
 91:['lure','ghostShot'],
 92:['slowField','drain'],
 93:['pull','ghostShot'],
 94:['weaken','mineField'],
 95:['burnwave','frostShot'],
 96:['cleanse','guard'],
 97:['healing','fireField'],
 98:['pull','slowField'],
 99:['burnwave','fireField'],
 100:['venomField','healing'],
 101:['slowField','weaken'],
 102:['lure','guard'],
 103:['ghostShot','venomShot'],
 104:['healing','slowField'],
 105:['weaken','mineField'],
 106:['lure','mineField'],
 107:['sparkShot','scatterFire'],
 108:['pushwave','guard'],
 109:['pushwave','stun'],
 110:['guard','mirror'],
 111:['weaken','venomShot'],
 112:['burnwave','fireField'],
 113:['cleanse','guard'],
 114:['guard','pushwave'],
 115:['ghostShot','guard'],
 116:['mirror','weaken'],
 117:['slowField','venomField'],
 118:['ghostShot','pushwave'],
 119:['drain','weaken'],
 120:['echo','pushwave'],
 121:['frostField','ghostShot'],
 122:['ghostShot','weaken'],
 123:['venomField','venomShot'],
 124:['guard','mirror'],
 125:['scatter','slowField'],
 126:['ghostShot','guard'],
 127:['cleanse','venomField'],
 128:['pull','stun'],
 129:['frostField','scatter'],
});
const upgradeCaptions=Object.freeze({
 forgeDrone:'pomocnik-kuźnia: każde odbicie go rozgrzewa i przyspiesza jego strzały',
 forgeAnvil:'kowadło piorunowe: nagromadzone ciepło zamienia się w tarczę i pole uderzenia',
 cellBud:'pączkowanie: rosnące komórki regenerują i tworzą lepkie ślady',
 mitosisBloom:'awaryjna mitoza pozostawia dodatkowy obszar ochronny i wzmacnia nowe ciało',
 conductorArc:'przewodnik: zmagazynowany ładunek poraża następnym kontaktem',
 overloadCircuit:'obwód przeciążenia: łuk rozdziela się na pułapkę elektrostatyczną',
 pressureAura:'przemieszczająca się strefa ciśnienia rani bliski cel',
 gravityVortex:'wir ciśnienia przyciąga cel do ruchomego pola i uderza silniejszym pulsem',
 predictiveRay:'przewidujący ruch pocisk laserowy przenika przeszkody',
 reflectionEcho:'opóźniony promień odbity od krawędzi areny',
 matrixCenter:'środkowy węzeł WDC pulsuje mocniej od pozostałych pól',
 matrixRewire:'siatka przełącza się i zostawia cztery uzbrajane węzły',
 orchardHarvest:'drzewko jabłoni cyklicznie leczy właściciela i wysyła owoc',
 goldenOrchard:'złote jabłka zapewniają również tarczę i podwójny zbiór',
 turretBattery:'armatnia bateria ładuje wieżyczkę i wystrzeliwuje pocisk',
 ricochetShell:'pocisk rykoszetuje, zostawiając opóźnioną eksplozję',
 virusIncubation:'zakażenie przez kontakt i odroczony puls infekcji',
 virusMutation:'wirus mutuje w chmurę trucizny u ofiary',
 briarWall:'odbicie tworzy kolczasty szereg wzdłuż ściany',
 briarCitadel:'ściana cierni staje się większa i odpycha atakujących',
 longRicochet:'strzała odbija się dłużej od granic areny',
 ricochetSplit:'strzała rozdziela się na rykoszecie na mniejsze pociski',
 crownPylons:'odbicie rozstawia dwa ładunki korony błyskawic',
 crownStorm:'rozgałęziony ładunek wraca opóźnionym piorunem',
 growingRipples:'fala rozchodzi się w coraz większych pierścieniach',
 returningWave:'ostatni pierścień wraca, ściągając przeciwnika',
 frostFootprints:'kulka zostawia mroźne kroki podczas ruchu',
 iceTrail:'mroźne kroki łączą się w twardszy lodowy tor',
 harpoonAnchor:'harpun utrzymuje hak i ponawia przyciąganie',
 harpoonReel:'ostatnie silne szarpnięcie ogłusza cel',
 hiveGuard:'pszczoły zatrzymują wrogie pociski i kontratakują',
 queenSwarm:'królowa roju wypuszcza dodatkowe roje i tarczę',
 petBolt:'pomocniczy elektryczny pocisk',
 guard:'dodatkowa osłona wokół kulki',
 healing:'dodatkowa regeneracja zdrowia',
 sparkShot:'samocelująca elektryczna iskra',
 shockField:'elektryczne pole rażące przeciwnika',
 slowField:'pole spowolnienia przy przeciwniku',
 venomShot:'zatruty pocisk szukający celu',
 pierceShot:'pocisk przenikający przez przeszkody',
 shockwave:'fala uderzeniowa',
 healingShot:'pocisk leczniczy po trafieniu',
 heavyShot:'ciężki pocisk z odrzutem',
 venomField:'toksyczna strefa z obrażeniami',
 thornField:'kolczasta pułapka przy przeciwniku',
 bounceShot:'dodatkowy odbijający się pocisk',
 scatter:'rozproszona salwa wielu pocisków',
 pushwave:'rozszerzona fala z odrzutem',
 echo:'opóźnione kolejne impulsy',
 frostField:'mroźne pole spowalniające',
 frostShot:'lodowy pocisk spowalniający',
 pull:'silniejsze przyciągnięcie przeciwnika',
 stun:'krótkie porażenie przeciwnika',
 cleanse:'oczyszczenie z osłabień i tarcza',
 mineField:'opóźniona mina na arenie',
 lure:'dezorientacja i osłabienie ruchu rywala',
 weaken:'czasowe osłabienie siły ataku',
 mirror:'tarcza odwetowa na czas walki',
 burnwave:'płomienna fala podpalająca',
 ghostShot:'widmowy pocisk omijający przeszkody',
 fireField:'płonący obszar trafień',
 scatterFire:'wachlarz płonących pocisków',
 drain:'dodatkowe wysysanie życia'
});
if(Object.keys(authoredUpgrades).length!==114)throw Error('114 authored V2/V3 profiles expected');
function authoredUpgradeDescription(id,stage){
 const actions=authoredUpgrades[id];
 if(!actions||stage<1)return null;
 const extra=stage===2?' oraz '+upgradeCaptions[actions[1]]:'';
 return 'V'+(stage+1)+': '+upgradeCaptions[actions[0]]+extra+'; mocniejsze efekty aktywnej zdolności.';
}
// First individual-rework batch (16–23): the mechanics here are tied to each
// identity's own V1 skill and its triggers, not selected from shared actions.
// Gameplay events, hazards and movement are stored in the authoritative state.
function applySignatureEvolution(o,foe,level){
 const id=o.b.id,color=abilityData[id].color,st=roundState();
 if(id===16){ // Forge: the existing wall-forged pet gets a heat engine.
  o.v2ForgeHeat=Math.min(6,(o.v2ForgeHeat||0)+1);
  o.v2PetPower=Math.min(3,(o.v2PetPower||1)+.25);
  zone(o,o.x,o.y,'pet',26,6,.85+o.v2ForgeHeat*.12);
  if(level===2){
   o.status.shield=Math.min(32,(o.status.shield||0)+2*o.v2ForgeHeat);
   zone(o,foe.x,foe.y,'shock',27,1.9,.40);
  }
  visual(o,o,'orbit',32+level*5,color,.7);
 }else if(id===17){ // Cell: budding makes sustained recovery, mitosis evolves.
  o.v2CellBud={clock:.65,remaining:2+level*2,heal:1.7*level};
  zone(o,o.x,o.y,'slime',25,2.3,.34);
  if(level===2){
   o.status.shield=Math.min(32,(o.status.shield||0)+4);
   o.v2MitosisBloom=true;
  }
  visual(o,o,'growth',37+level*5,color,.75);
 }else if(id===18){ // Electrician: arc is stored until the next real impact.
  o.v2ArcUntil=G.rt+2.6+level*.4;
  o.v2ArcContactUsed=false;
  shoot(o,foe,{count:1,damage:o.baseDmg*.13,stun:.14*level,homing:.75,color:'#fde047'});
  if(level===2)zone(o,foe.x,foe.y,'shock',29,2.2,.42);
  visual(o,foe,'beam',34+level*5,'#fde047',.6);
 }else if(id===19){ // Pressure Zone: mobile aura; V3 generates gravity.
  o.v2Pressure={remaining:2.2+level*.65,next:.1,radius:48+level*13,
   damage:.13+level*.04,pull:level===2?.19:0};
  zone(o,o.x,o.y,'zone',27,2.5,.28);
  visual(o,o,'ring',o.v2Pressure.radius,color,.75);
 }else if(id===20){ // Foresight ray: predictive piercing shot; delayed echo.
  shoot(o,foe,{damage:o.baseDmg*.22,ghost:true,homing:.15,speed:265,
   slow:.25+level*.1,color:'#60a5fa'});
  if(level===2){
   o.v2BeamEcho={clock:.47,remaining:1,damage:.44,targetX:foe.x,targetY:foe.y};
   visual(o,foe,'beam',48,color,.8);
  }
 }else if(id===21){ // WDC: numbered 3x3 board central amplifier.
  o.v2MatrixCombo=Math.min(4,(o.v2MatrixCombo||0)+1);
  zone(o,foe.x,foe.y,'grid',20,2.5,.13+o.v2MatrixCombo*.035);
  if(level===2){
   for(const [dx,dy] of [[-40,0],[40,0],[0,-40],[0,40]])
    zone(o,Math.max(18,Math.min(342,foe.x+dx)),Math.max(18,Math.min(342,foe.y+dy)),
     'mine',13,2.8,.22);
  }
  visual(o,foe,'clock',41,color,.66);
 }else if(id===22){ // Apple: orchard actually regenerates and grows produce.
  o.v2Orchard={clock:.65,remaining:2+level*2,level};
  shoot(o,foe,{damage:o.baseDmg*.12,healOnHit:2.7*level,speed:135,homing:.25,color:'#f59e0b'});
  if(level===2)o.status.shield=Math.min(32,(o.status.shield||0)+4);
  visual(o,o,'heal',38,color,.75);
 }else if(id===23){ // Cannon: recharge its wall turret, shell marks the impact.
  o.v2TurretCharge=Math.min(5,(o.v2TurretCharge||0)+1);
  zone(o,o.x,o.y,'turret',27,5.2,.95);
  shoot(o,foe,{count:1,damage:o.baseDmg*.18,speed:128,bounces:1+level,
   knock:.16,color:'#fbbf24'});
  if(level===2){
   const d=Math.hypot(foe.x-o.x,foe.y-o.y)||1;
   const lead=Math.min(.42,d/150);
   const x=Math.max(20,Math.min(340,foe.x+foe.vx*80*lead));
   const y=Math.max(20,Math.min(340,foe.y+foe.vy*80*lead));
   zone(o,x,y,'mine',27,3.6,.6);
   visual(o,{x,y},'impact',44,color,.75);
  }
 }else if(id===24){
  o.v2VirusActiveUntil=G.rt+3+level*.6;
  o.v2VirusNextContact=0;
  o.v2VirusMutating=level===2;
  visual(o,o,'growth',38+level*5,color,.75);
 }else if(id===25){
  o.v2BriarUntil=G.rt+3.4+level*.5;
  o.v2BriarGuard=level===2;
  visual(o,o,'shard',35+level*5,color,.72);
 }else if(id===26){
  shoot(o,foe,{damage:o.baseDmg*.22,speed:190,life:3.5,
   bounces:3+level*2,ricochetSplit:level===2?1:0,color:'#fef08a'});
  visual(o,foe,'slash',43+level*5,color,.72);
 }else if(id===27){
  o.v2CrownUntil=G.rt+3+level*.7;
  o.v2CrownArmed=level===2;
  visual(o,o,'orbit',34+level*5,color,.72);
 }else if(id===28){
  o.v2Ripples={next:.22,remaining:level===2?4:3,index:0,level};
  visual(o,o,'ring',34+level*7,color,.7);
 }else if(id===29){
  o.v2FrostSteps={next:.1,remaining:3+level*.7,
   lastX:o.x,lastY:o.y,level};
  visual(o,o,'tail',35+level*6,color,.7);
 }else if(id===30){
  if(Math.hypot(foe.x-o.x,foe.y-o.y)<245){
   o.v2HarpAnchor={uid:foe.uid,remaining:1.3+level*.3,next:.2,level,pulses:0};
   visual(o,foe,'tether',37+level*5,color,.72);
  }
 }else if(id===31){
  o.v2Hive={remaining:2.6+level*.6,next:.18,
   intercepts:level===2?2:1,level};
  if(level===2)o.status.shield=Math.min(32,(o.status.shield||0)+3);
  visual(o,o,'orbit',36+level*5,color,.7);
 }
}
function applyAuthoredUpgrade(o,foe){
 const level=evolutionStage(o),profile=authoredUpgrades[o?.b?.id];
 if(level===0||!profile||!foe||!alive(foe)||netRole==='guest')return;
 const id=o.b.id,boost=level===2?1.28:1,unique=1+(id%5)*.04;
 if(id>=16&&id<=31){applySignatureEvolution(o,foe,level);return;}
 const accent=id>=99?'#d8b4fe':o.b.c;
 function action(kind){
  const color=kind.includes('frost')?'#a5f3fc':kind.includes('venom')?'#bef264':kind.includes('fire')||kind==='burnwave'||kind==='scatterFire'?'#fb923c':accent;
  if(['petBolt','sparkShot','venomShot','pierceShot','healingShot','heavyShot','bounceShot','scatter','frostShot','ghostShot','scatterFire'].includes(kind)){
   const options={damage:o.baseDmg*.18*boost*unique,speed:165,homing:.36,life:2.5,color};
   if(kind==='petBolt'||kind==='sparkShot'){options.stun=.12;options.homing=.65;}
   if(kind==='venomShot')options.poison=.78*boost;
   if(kind==='pierceShot'||kind==='ghostShot'){options.ghost=true;options.homing=.3;}
   if(kind==='healingShot')options.healOnHit=5*boost;
   if(kind==='heavyShot'){options.knock=.24*boost;options.speed=125;}
   if(kind==='bounceShot')options.bounces=2+level;
   if(kind==='scatter'||kind==='scatterFire'){options.count=2;options.spread=.48;}
   if(kind==='frostShot')options.slow=.7*boost;
   if(kind==='scatterFire')options.burn=.65*boost;
   shoot(o,foe,options);
   return;
  }
  if(['shockField','slowField','venomField','thornField','mineField','frostField','fireField'].includes(kind)){
   const name={shockField:'shock',slowField:'slow',venomField:'poison',thornField:'thorn',mineField:'mine',frostField:'frost',fireField:'fire'}[kind];
   const center=kind==='thornField'?o:foe;
   // Existing collision and status systems do the actual work; effects expire
   // through the usual hazard lifecycle and are stored in replay snapshots.
   zone(o,center.x,center.y,name,24+id%7,2.4+level*.25,.27*boost*unique);
   return;
  }
  if(['shockwave','pushwave','burnwave'].includes(kind)){
   const options={radius:kind==='shockwave'?115:kind==='pushwave'?120:108,
    knock:kind==='pushwave'?.18*boost:0,burn:kind==='burnwave'?.6*boost:0,
    stun:kind==='shockwave'?.12:0};
   radial(o,foe,.19*boost*unique,options);
   return;
  }
  if(kind==='guard'||kind==='mirror'||kind==='cleanse'){
   o.status||={};
   o.status.shield=Math.min(32,(o.status.shield||0)+5*boost*unique);
   if(kind==='mirror')o.skillReflect=Math.max(o.skillReflect||0,1.25+level*.4);
   if(kind==='cleanse'){
    for(const key of ['poison','slow','burn','weaken'])o.status[key]=0;
   }
   visual(o,o,'shield',33*boost,color,.55);
   return;
  }
  if(kind==='healing'){
   o.hp=Math.min(o.mh,o.hp+5*boost*unique);
   visual(o,o,'heal',32*boost,color,.55);
   return;
  }
  if(kind==='pull'){
   const distance=Math.hypot(o.x-foe.x,o.y-foe.y)||1;
   if(distance<230){
    const power=.29*boost*unique;
    foe.vx=(foe.vx||0)+(o.x-foe.x)/distance*power;
    foe.vy=(foe.vy||0)+(o.y-foe.y)/distance*power;
    setStatus(o,foe,'slow',.4*boost);
   }
   visual(o,foe,'tether',39,color,.6);
   return;
  }
  if(kind==='stun'||kind==='weaken'||kind==='lure'){
   if(Math.hypot(foe.x-o.x,foe.y-o.y)<220){
    setStatus(o,foe,kind==='stun'?'stun':kind==='weaken'?'weaken':'slow',kind==='stun'?.16:kind==='weaken'?1.0*boost:.6*boost);
    if(kind==='lure'){
     foe.aiTarget={vx:-(foe.vy||0),vy:foe.vx||0};
     foe.aiDecisionClock=Math.max(foe.aiDecisionClock||0,.45*boost);
    }
   }
   visual(o,foe,kind==='lure'?'mirage':'clock',40*boost,color,.6);
   return;
  }
  if(kind==='drain'){
   const distance=Math.hypot(o.x-foe.x,o.y-foe.y);
   if(distance<175){
    strike(o,foe,o.baseDmg*.18*boost*unique,{slow:.2});
    o.hp=Math.min(o.mh,o.hp+3*boost*unique);
   }
   visual(o,foe,'tether',32*boost,color,.5);
   return;
  }
  if(kind==='echo'){
   // V3 includes more pulses: the standard tick() will trigger them later.
   const pulses=1+level;
   o.v2Echo={clock:.4,remaining:Math.max(o.v2Echo?.remaining||0,pulses),power:.18*boost*unique,radius:118};
   visual(o,o,'ring',39*boost,color,.7);
   return;
  }
  throw new Error('Unknown authored evolution '+kind);
 }
 // V3 retains the exact V2 action, strengthened, then adds a second identity
 // upgrade. No additional gameplay rolls: finishing scene RNG is separate.
 action(profile[0]);
 if(level===2)action(profile[1]);
 // A clearer tier-specific ring is presentation-only; changing reduced-motion
 // settings may suppress it without suppressing the combat mechanics.
 visual(o,o,'ring',level===2?48:31,accent,level===2?.75:.55);
}

const evolutionStage=o=>Math.max(0,Math.min(2,(o?.tier||1)-1));
function evolutionDescription(id,tier=1){
 const kind=abilityData[id]?.kind,stage=Math.max(0,Math.min(2,tier-1));
 if(!stage)return 'V1: podstawowa wersja zdolności.';
 const bespoke=authoredUpgradeDescription(id,stage);
 if(bespoke)return bespoke;
 const labels={
 orbit:'więcej ostrzy, większa orbita i dłuższa aktywacja',
 web:'sieć dodatkowo spowalnia'+(stage===2?' i zatruwa':''),
 thorn:'większe i trwalsze kolce przy ścianach',
 charge:'szybsza szarża i więcej ładunków następnego zderzenia',
 dash:'szybszy doskok, dodatkowa osłona i mocniejszy następny kontakt',
 chess:'dodatkowe pociski po ruchu po liniach',
 drain:'większy zasięg wysysania i skuteczniejsze leczenie',
 beam:'dłuższy promień wizualny i dodatkowe spowolnienie; lasery ścienne są szersze',
 tail:'dłuższy jadowity ogon',growth:'większy wzrost i dłuższa strefa szlamu',
 tether:'mocniejsze przyciąganie i dłuższe spowolnienie',
 pet:'pomocnik działa dłużej i strzela silniej',turret:'wieżyczka działa dłużej i strzela silniej',
 train:'większy, trwalszy pociąg',dice:'dłuższe efekty sześciu wyników kostki',
 potion:'większy obszar i trwalsze efekty eliksiru',
 shield:'większa tarcza i oczyszczenie '+(stage===1?'ognia':'ognia, trucizny i spowolnienia'),
 reflect:'większa tarcza i dłuższe odbijanie',heal:'skuteczniejsze leczenie i oczyszczanie statusów',
 blink:stage===1?'pocisk cienia po teleportacji':'dwa pociski cienia i osłona po teleportacji',
 time:'dłuższe zatrzymanie tempa rywala',eclipse:'dłuższe spowolnienie i osłabienie',
 mirage:'większa osłona, silniejszy doskok i dłuższa dezorientacja',
 cyclone:'większy zasięg i mocniejszy odrzut',gravity:'większy zasięg i silniejsze przyciąganie',
 void:'mocniejsze wysysanie energii i leczenie',shadow:'dodatkowe widmowe pociski',
 phoenix:'więcej leczenia i większy pierścień ognia',pumpkin:'większy zasięg fali dyni'
 };
 return 'V'+tier+': '+(labels[kind]||(['zone','gas','poison','grid','mine','doom','lava','sun','echo'].includes(kind)?'większe pola, dłuższe działanie i silniejsze impulsy':'dodatkowe pociski z lepszym naprowadzaniem i podziałem obrażeń salwy'))+'.';
}
function onContact(g,o,foe,base){
 if(!o||!foe||!g||netRole==='guest')return base;
 if(o.v2InfectUntil>g.rt)setStatus(o,foe,'poison',.7+evolutionStage(o)*.2);
 if(o.v2ShockUntil>g.rt)setStatus(o,foe,'stun',.12+evolutionStage(o)*.04);
 if(o.v2ShatterUntil>g.rt){o.v2ShatterUntil=0;shoot(o,foe,{count:3,damage:o.baseDmg*.12,spread:.6,bounces:1});}
 if(o.b.id===8&&(o.skillImpact||0)>0){
  // Spear's finishing thrust applies an actual push on contact.
  // Only the live, recent dash can trigger it; V2/V3 increase its strength.
  const dx=foe.x-o.x,dy=foe.y-o.y,len=Math.hypot(dx,dy)||1;
  const power=.22+evolutionStage(o)*.07;
  foe.vx=(foe.vx||0)+dx/len*power;
  foe.vy=(foe.vy||0)+dy/len*power;
  const speed=Math.hypot(foe.vx,foe.vy);
  if(speed>1.35){foe.vx*=1.35/speed;foe.vy*=1.35/speed;}
  o.skillImpact=0; // One thrust per activation; no repeated bonus on the next hit.
 }
 if(o.b.id===18&&evolutionStage(o)>0&&o.v2ArcUntil>g.rt){
  setStatus(o,foe,'stun',.14+evolutionStage(o)*.075);
  if(evolutionStage(o)===2&&!o.v2ArcContactUsed){
   zone(o,foe.x,foe.y,'shock',30,1.55,.48);
   o.v2ArcContactUsed=true;
  }
 }
 if(o.b.id===44){o.v2FibHit=Math.min(6,(o.v2FibHit||0)+1);base+=Math.min(3,[0,1,1,2,3,5,8][o.v2FibHit]*.5);}
 return base;
}

function abilityFor(o){return abilityData[o?.b?.abilityId ?? o?.b?.id] || abilityData[0];}
function roundState(){
 if(!G)return null;
 G.v2 ||= {shots:[],hazards:[],webs:[],wallBeams:[],beams:[],effects:[],tick:0,serial:0};
 return G.v2;
}
function visual(owner,point,kind='burst',size=24,color=null,duration=.48){
 const state=roundState();if(!state)return;
 const pos=point||owner;
 state.effects.push({x:pos.x,y:pos.y,kind,size,color:color||owner?.b?.c||'#fff',age:0,life:duration,id:owner?.b?.id||0});
 if(state.effects.length>35)state.effects.splice(0,state.effects.length-35);
 if(owner && typeof burst==='function')burst(owner,effectType(owner.b),4,false);
}
function setStatus(source,target,key,seconds){
 const kind=abilityFor(source).kind;
 const family=/lava|sun|phoenix|meteor|pumpkin/.test(kind)?'fire':/frost|shard|moon/.test(kind)?'ice':/shock|storm|beam|grid/.test(kind)?'electric':/poison|gas|thorn|web/.test(kind)?'poison':/void|shadow|mirage|doom|eclipse|prism/.test(kind)?'arcane':'physical';
 if(window.BVBRework?.applyStatus){window.BVBRework.applyStatus(target,key,seconds,family);return;}
 if(target.statusImmunities?.includes(key))return;
 target.status||={};target.status[key]=Math.max(target.status[key]||0,Math.min(key==='stun'?.55:5,seconds));
}
function strike(source,target,amount,options={}){
 if(!alive(target))return;
 const raw=Math.max(.5,amount*(source?.status?.weaken>0?.8:1));
 applyDamage(target,window.BVBRework?.abilityDamage?.(source,target,raw) ?? raw);
 for(const key of ['poison','burn','slow','stun'])if(options[key])setStatus(source,target,key,options[key]);
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
 const stage=evolutionStage(o),st=roundState(),count=Math.max(1,Math.min(7,(opts.count||1)+stage)),speed=(opts.speed||145)*(1+stage*.04);
 const lead=Math.min(.42,Math.hypot(foe.x-o.x,foe.y-o.y)/Math.max(120,speed))*((opts.homing||0)>.5?.85:.55);
 const targetX=Math.max(18,Math.min(342,foe.x+foe.vx*110*lead));
 const targetY=Math.max(18,Math.min(342,foe.y+foe.vy*110*lead));
 const heading=Math.atan2(targetY-o.y,targetX-o.x);
 for(let i=0;i<count;i++){
  const a=(opts.randomAim?(window.BVBRework?.random?.()??Math.random())*Math.PI*2:heading)+(i-(count-1)/2)*(opts.spread??.18);
  st.shots.push({x:o.x+Math.cos(a)*(o.r+5),y:o.y+Math.sin(a)*(o.r+5),
   px:o.x,py:o.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,
   owner:o.uid,team:o.team,id:o.b.id,damage:(opts.damage||o.baseDmg*.45)*(1+stage*.08)*Math.min(1,(opts.count||1)/count),ghost:!!opts.ghost,
   r:opts.r||4,life:opts.life||2.2,age:0,homing:(opts.homing||0)+stage*.18,bounces:(opts.bounces||0)+(abilityFor(o).kind==='arrow'?stage:0),
   healOnHit:(opts.healOnHit||0)*Math.min(1,(opts.count||1)/count),slow:opts.slow||0,poison:opts.poison||0,burn:opts.burn||0,stun:opts.stun||0,
   knock:opts.knock||0,color:opts.color||abilityData[o.b.id].color});
 }
 if(st.shots.length>80)st.shots.splice(0,st.shots.length-80);
 visual(o,o,'charge',17,abilityData[o.b.id].color,.34);
}
function zone(o,x,y,kind='zone',radius=29,life=3,power=1){
 const stage=evolutionStage(o);radius*=1+stage*.1;life*=1+stage*.15;power*=1+stage*.1;
 const st=roundState();if(!st)return;
 if(['pet','turret'].includes(kind)){const old=st.hazards.find(h=>h.owner===o.uid&&h.kind===kind&&h.life>0);if(old){old.life=Math.max(old.life,life);old.max=Math.max(old.max,life);old.power=Math.max(old.power,power);return old;}}
 st.hazards.push({x,y,kind,owner:o.uid,team:o.team,id:o.b.id,radius,life,max:life,
  power,age:0,cooldown:0,armAt:kind==='doom'?1:kind==='mine'?.75:kind==='echo'?.5:0,nextShot:.35,color:abilityData[o.b.id].color});
 if(st.hazards.length>45)st.hazards.splice(0,st.hazards.length-45);
 visual(o,{x,y},'circle',radius,abilityData[o.b.id].color,.55);
}
function radial(o,foe,mult=.55,opts={}){
 opts={...opts,radius:(opts.radius||93)*(1+evolutionStage(o)*.1)};
 if(!foe||!alive(foe))return;
 visual(o,o,'ring',Math.max(o.r+12,Math.min(110,opts.radius||60)),abilityData[o.b.id].color,.65);
 if(Math.hypot(foe.x-o.x,foe.y-o.y)<(opts.radius||93))strike(o,foe,o.baseDmg*mult,opts);
}
function dash(o,foe,strength=.32,opts={}){
 if(!foe)return;const stage=evolutionStage(o);strength+=stage*.1;const d=Math.hypot(foe.x-o.x,foe.y-o.y)||1;
 o.vx=(foe.x-o.x)/d*(1+strength);o.vy=(foe.y-o.y)/d*(1+strength);
 o.skillImpact=Math.max(o.skillImpact||0,1.5+stage*.25);
 if(stage)o.status.shield=Math.min(32,(o.status.shield||0)+stage*2);
 if(opts.shield)o.status.shield=(o.status.shield||0)+opts.shield;
 visual(o,o,'slash',39,abilityData[o.b.id].color,.55);
}
function webPoint(o,side){
 const st=roundState();if(!st)return;
 const p={x:o.x,y:o.y,side};
 const start=o.v2WallAnchor;
 if(start&&start.side!==side){
  st.webs.push({a:start,b:p,team:o.team,id:o.b.id,owner:o.uid,stage:evolutionStage(o),inside:{},color:o.b.id===34||o.b.id===117?'#aa83da':'#d4e7ff'});
  visual(o,{x:(start.x+p.x)/2,y:(start.y+p.y)/2},'web',38,'#dcecff',.7);
 }
 o.v2WallAnchor=p;
}
function onWall(o,side){
 const d=abilityFor(o);if(!d)return;
 const st=roundState();if(!st)return;
 if(o.v2LastSide===side&&(G.rt-(o.v2LastWallAt||0))<.12)return;
 o.v2LastSide=side;o.v2LastWallAt=G.rt||0;
 if(d.kind==='web')webPoint(o,side);
 if(d.kind==='pet')o.v2PetPower=Math.min(1.5,(o.v2PetPower||1)+.1);
 if(d.kind==='thorn')zone(o,o.x,o.y,'thorn',15,16,.65);
 if(d.kind==='beam'&&(o.b.id===13||o.b.id===41)){
  const vertical=side==='left'||side==='right';
  st.wallBeams.push({a:{x:vertical?o.x:0,y:vertical?0:o.y},
   b:{x:vertical?o.x:W,y:vertical?W:o.y},owner:o.uid,
   team:o.team,color:d.color,life:3.4+evolutionStage(o)*.5,width:2+evolutionStage(o)*2,inside:{}});
  if(st.wallBeams.length>12)st.wallBeams.splice(0,st.wallBeams.length-12);
  visual(o,o,'beam',23,d.color,.48);
 }
 if(d.kind==='turret'||d.kind==='pet')zone(o,o.x,o.y,d.kind,23,4,.65);
 if(d.kind==='train'){
  zone(o,o.x,o.y,'train',20,2.5,.65);
  const train=st.hazards[st.hazards.length-1];
  train.vx=side==='left'?160:side==='right'?-160:0;
  train.vy=side==='top'?160:side==='bottom'?-160:0;
 }
 if(d.kind==='grid'&&o.b.id===27)zone(o,o.x,o.y,'shock',30,2,.55);
 if(d.kind==='frost'&&o.b.id===29)zone(o,o.x,o.y,'frost',19,3,.38);
 if(o.b.id===16&&evolutionStage(o)>0){
  o.v2ForgeHeat=Math.min(6,(o.v2ForgeHeat||0)+1);
  const forge=st.hazards.find(h=>h.owner===o.uid&&h.kind==='pet'&&h.life>0);
  if(forge){
   forge.power=Math.min(2.8,forge.power+.11);
   forge.nextShot=Math.min(forge.nextShot||0,.45);
  }
  if(evolutionStage(o)===2){
   o.status.shield=Math.min(32,(o.status.shield||0)+1.5);
   zone(o,o.x,o.y,'shock',19,1.2,.24);
  }
 }
 if(o.b.id===23&&evolutionStage(o)>0){
  const turret=st.hazards.find(h=>h.owner===o.uid&&h.kind==='turret'&&h.life>0);
  if(turret){
   turret.power=Math.min(2.8,turret.power+.12);
   turret.nextShot=Math.min(turret.nextShot||0,.5);
  }
 }
 if(d.kind==='charge'){o.skillCharge=Math.min(5,(o.skillCharge||0)+1);}
}
function cooldown(o){
 const d=abilityFor(o);const rate=Math.max(.55,Math.min(1.5,o.abilityRate||1));
 return Math.max(2.25,(d?.cooldown||4)*rate*(o.tier===3?.78:o.tier===2?.90:1));
}
function cast(o,foe){
 if(!o||!foe||!alive(foe)||!G)return;
 const d=abilityFor(o),kind=d.kind;
 const scale=Math.min(1.26,1+(Math.max(1,o.tier||1)-1)*.12);
 const delta=Math.hypot(foe.x-o.x,foe.y-o.y);
 const lowHp=o.hp/Math.max(1,o.mh)<.35;
 o.attackGlow=.7;G.v2SkillId=o.b.id;
 G.pop ||= [];
 if(G.pop.length<24)G.pop.push({x:o.x,y:Math.max(22,o.y-o.r-24),age:0,life:1.1,
  text:d.title.length>21?d.title.slice(0,20)+'…':d.title,c:d.color});
 switch(kind){
 case 'web': visual(o,o,'web',27,d.color,.5);break; // webs form only on actual wall impacts
 case 'charge': o.skillCharge=Math.min(5,(o.skillCharge||0)+1+evolutionStage(o));dash(o,foe,.22);break;
 case 'orbit':
  // Real gameplay blades: persistent, visible and collision-tested on every tick.
  o.skillSpin=(o.skillSpin||0)+1;
  o.axeOrbit={life:2.35+evolutionStage(o)*.35,angle:0,radius:o.r+20+evolutionStage(o)*6+(o.b.id===1&&lowHp?9:0),blades:Math.min(6,3+evolutionStage(o)+(o.b.id===4?Math.floor(o.skillSpin/2):0)),nextHit:Object.create(null),color:d.color};
  visual(o,o,'orbit',34,d.color,.45);break;
 case 'thorn': visual(o,o,'charge',24,d.color,.5);break; // only walls create spikes
 case 'volley': shoot(o,foe,{count:o.b.id===5?5:o.b.id===43?3:o.b.id===3?2:3,
   damage:o.baseDmg*(o.b.id===5?.2:.36)*scale,homing:.2,spread:.22,
   speed:lowHp&&o.b.id===3?195:168,slow:o.b.id===37?.4:0});break;
 case 'drain':
  if(delta<128+evolutionStage(o)*22){strike(o,foe,Math.min(8,foe.hp*.06)*scale,{slow:.25});
    o.hp=Math.min(o.mh,o.hp+Math.min(9,o.baseDmg*.4)*(1+evolutionStage(o)*.15));}
  else dash(o,foe,.15);
  visual(o,o,'tether',25,d.color,.58);break;
 case 'dash':
  dash(o,foe,o.b.id===108&&lowHp?.6:.35,{shield:o.b.id===114?6:0});
  // The light-ball's advertised impact wave must really hit nearby enemies,
  // not merely recolor the standard dash. Evolutions widen the hit area.
  if(o.b.id===9)radial(o,foe,.32,{radius:90,knock:.24});
  break;
 case 'chess':
  o.vx=Math.abs(foe.x-o.x)>Math.abs(foe.y-o.y)?Math.sign(foe.x-o.x)||1:0;
  o.vy=o.vx===0?Math.sign(foe.y-o.y)||1:0;
  visual(o,o,'chess',42,d.color,.65);
  if(evolutionStage(o))shoot(o,foe,{count:evolutionStage(o),damage:o.baseDmg*.14,spread:.7});
  if(delta<96)strike(o,foe,o.baseDmg*.55,{knock:.24});break;
 case 'dice': {
  const roll=Math.floor((window.BVBRework?.random?.()??Math.random())*6);o.v2LastRoll=roll+1;
  if(roll===0)shoot(o,foe,{damage:o.baseDmg*.45});
  if(roll===1)setStatus(o,foe,'slow',.8+evolutionStage(o)*.2);
  if(roll===2)o.status.shield=Math.min(32,(o.status.shield||0)+9+evolutionStage(o)*2);
  if(roll===3)o.hp=Math.min(o.mh,o.hp+5+evolutionStage(o));
  if(roll===4)zone(o,foe.x,foe.y,'fire',26,2,.45);
  if(roll===5)zone(o,foe.x,foe.y,'poison',30,3,.38);
  visual(o,o,'dice',28,d.color,.6);break;
 }
 case 'potion': {
  const roll=Math.floor((window.BVBRework?.random?.() ?? Math.random())*3);
  if(o.b.id===95){if(roll===0)zone(o,foe.x,foe.y,'fire',30,2.4,.4);else if(roll===1)shoot(o,foe,{damage:o.baseDmg*.35,slow:.85});else o.status.shield=Math.min(32,(o.status.shield||0)+9+evolutionStage(o)*2);}
  else if(o.b.id===127){if(roll===0)zone(o,foe.x,foe.y,'poison',30,2.8,.38);else if(roll===1)shoot(o,foe,{damage:o.baseDmg*.35,slow:.85});else o.hp=Math.min(o.mh,o.hp+6+evolutionStage(o));}
  else if(roll===0)shoot(o,foe,{damage:o.baseDmg*.45,slow:.65,color:d.color});
  else if(roll===1)zone(o,foe.x,foe.y,'poison',30,2.8,.38);
  else {o.status.shield=Math.min(32,(o.status.shield||0)+9+evolutionStage(o)*2);visual(o,o,'shield',33,d.color,.55);}
  break;
 }
 case 'frost':
  shoot(o,foe,{count:o.b.id===12?3:2,damage:o.baseDmg*.24,slow:1.05,spread:.26,color:'#a5f3fc'});break;
 case 'beam':{
  const lead=.19,target={x:foe.x+foe.vx*22*lead,y:foe.y+foe.vy*22*lead};
  roundState().beams.push({x:o.x,y:o.y,x2:target.x,y2:target.y,color:d.color,life:.35+evolutionStage(o)*.1,max:.35+evolutionStage(o)*.1,id:o.b.id});
  strike(o,foe,o.baseDmg*.43*scale,{slow:evolutionStage(o)*.15,stun:o.b.id===20?.12:0});visual(o,o,'beam',23,d.color,.55);break;
 }
 case 'tail':case 'growth':{
  o.skillScale=Math.min(1.23,(o.skillScale||1)+.025+evolutionStage(o)*.01);
  if(kind==='tail')o.v2Tail={life:3.5+evolutionStage(o)*.5,length:Math.min(9,5+evolutionStage(o)*2+Math.floor((o.skillScale-1)*15)),nextHit:0};
  else {o.v2BaseRadius??=o.r;o.r=Math.min(o.v2BaseRadius*1.23,o.v2BaseRadius*o.skillScale);}
  o.hp=Math.min(o.mh,o.hp+3.3*scale);
  zone(o,o.x,o.y,kind==='tail'?'tail':'slime',24,3,.29);
  visual(o,o,'growth',28,d.color,.7);break;
 }
 case 'tether':
  if(delta<240+evolutionStage(o)*15){const f=.32+evolutionStage(o)*.08;foe.vx+=(o.x-foe.x)/Math.max(1,delta)*f;
   foe.vy+=(o.y-foe.y)/Math.max(1,delta)*f;
   strike(o,foe,o.baseDmg*.4,{slow:.45+evolutionStage(o)*.2});}
  roundState().beams.push({x:o.x,y:o.y,x2:foe.x,y2:foe.y,color:d.color,life:.3,max:.3,id:o.b.id});
  visual(o,o,'tether',20,d.color,.4);break;
 case 'pet':case 'turret':zone(o,o.x,o.y,kind,22,5,.7);break;
 case 'train':{zone(o,o.x,o.y,kind,22,3,.7);const h=roundState().hazards.at(-1),a=Math.atan2(foe.y+foe.vy*50-o.y,foe.x+foe.vx*50-o.x);h.vx=Math.cos(a)*160;h.vy=Math.sin(a)*160;break;}
 case 'shock':case 'storm':
  shoot(o,foe,{count:kind==='storm'?3:o.b.id===83?2:1,damage:o.baseDmg*.32,stun:.22,homing:.45,color:'#fde047',spread:.23,randomAim:kind==='storm'});o.v2ShockUntil=G.rt+1.5+evolutionStage(o)*.2;break;
 case 'zone':case 'gas':case 'poison':
  zone(o,foe.x,foe.y,kind,kind==='gas'?38:30,3,.42);if(kind==='poison')o.v2InfectUntil=G.rt+3;break;
 case 'grid':
  for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)zone(o,clamp(foe.x+x*31,12,348),clamp(foe.y+y*31,12,348),'grid',16,2.8,.06+(x+1)*.02+(y+1)*.01);break;
 case 'healshot':
  shoot(o,foe,{damage:o.baseDmg*.38,healOnHit:7*scale,speed:170,homing:.3,color:'#fbbf24'});break;
 case 'arrow':
  shoot(o,foe,{damage:o.baseDmg*.6,bounces:3,speed:180,r:3,color:'#fef08a'});break;
 case 'pulse':case 'wave':case 'quake':case 'nova':
  if(o.b.id===74||o.b.id===120)o.v2Echo={clock:.35,remaining:2+evolutionStage(o),power:.18,radius:100};
  radial(o,foe,kind==='nova'?.73:.5,{radius:kind==='wave'?155:kind==='nova'?130:100,
     knock:kind==='wave'||kind==='quake'?.36:.18,slow:kind==='pulse'?.18:0});break;
 case 'swarm':shoot(o,foe,{count:o.b.id===31?3:2,damage:o.baseDmg*.22,homing:2.5,
   poison:o.b.id===31?.8:0,speed:118,life:3.1,color:d.color});break;
 case 'mine':{const stage=evolutionStage(o),lead=.75*110*(foe.actualPace||1.38);for(let i=0;i<=stage;i++)zone(o,clamp(foe.x+foe.vx*lead+(i-stage/2)*26,20,340),clamp(foe.y+foe.vy*lead,20,340),'mine',24,5,.72/(1+stage*.3));break;}
 case 'reflect':case 'shield':
  if(o.b.id===96){o.status.stun=0;o.status.slow=0;o.status.weaken=0;}
  o.status.shield=Math.min(32,(o.status.shield||0)+(kind==='shield'?13:8)*scale);
  o.skillReflect=kind==='reflect'?1.7+evolutionStage(o)*.4:0;
  if(kind==='shield'&&evolutionStage(o)){o.status.burn=0;if(evolutionStage(o)===2){o.status.poison=0;o.status.slow=0;}}
  visual(o,o,'shield',34,d.color,.68);break;
 case 'heal':
  o.hp=Math.min(o.mh,o.hp+7*scale);o.status.shield=Math.min(26,(o.status.shield||0)+5);
  if(evolutionStage(o))o.status.burn=0;if(evolutionStage(o)===2){o.status.poison=0;o.status.slow=0;}
  visual(o,o,'heal',30,'#86efac',.62);break;
 case 'shard':
  shoot(o,foe,{count:5,damage:o.baseDmg*.25,spread:.28,speed:165,bounces:1,slow:o.b.id===129?.35:0,color:d.color});
  o.v2ShatterUntil=G.rt+2;visual(o,o,'shard',32,d.color,.5);break;
 case 'blink':{
  const a=Math.atan2(o.y-foe.y,o.x-foe.x)+((window.BVBRework?.random?.() ?? Math.random())-.5)*1.1;
  o.x=clamp(foe.x+Math.cos(a)*80,o.r,W-o.r);
  o.y=clamp(foe.y+Math.sin(a)*80,o.r,W-o.r);
  if(evolutionStage(o))shoot(o,foe,{count:1,damage:o.baseDmg*.14,ghost:true,homing:.6});if(evolutionStage(o)===2)o.status.shield=Math.min(32,(o.status.shield||0)+2);
  visual(o,o,'blink',33,d.color,.65);break;
 }
 case 'time':case 'eclipse':
  setStatus(o,foe,'slow',(kind==='time'?1.2:.7)*(1+evolutionStage(o)*.2));
  if(kind==='eclipse')setStatus(o,foe,'weaken',1.6+evolutionStage(o)*.3);
  visual(o,foe,'clock',41,d.color,.75);break;
 case 'lava':case 'sun':
  zone(o,foe.x,foe.y,kind==='lava'?'fire':'sun',31,2.8,.52);break;
 case 'meteor':shoot(o,foe,{count:3,damage:o.baseDmg*.29,spread:.36,burn:.65,bounces:1,speed:145});break;
 case 'cyclone':case 'gravity':{
  const dir=kind==='gravity'?-1:1;
  foe.vx+=(foe.x-o.x)/Math.max(1,delta)*(.26+evolutionStage(o)*.07)*dir;foe.vy+=(foe.y-o.y)/Math.max(1,delta)*(.26+evolutionStage(o)*.07)*dir;
  radial(o,foe,.29,{radius:175,knock:kind==='cyclone'?.2:0});break;
 }
 case 'prism':shoot(o,foe,{count:3,damage:o.baseDmg*.3,spread:.33,color:'#a5b4fc'});break;
 case 'echo':{
  radial(o,foe,.32,{radius:130});
  o.v2Echo={clock:.5,remaining:1+evolutionStage(o),power:.22,radius:130};break;
 }
 case 'shadow':shoot(o,foe,{damage:o.baseDmg*.42,slow:.38,ghost:true,homing:.5,color:d.color});break;
 case 'void':
  strike(o,foe,o.baseDmg*.42,{slow:.38});
  o.hp=Math.min(o.mh,o.hp+2+evolutionStage(o));
  visual(o,foe,'shadow',32,d.color,.65);break;
 case 'moon':shoot(o,foe,{count:2,damage:o.baseDmg*.38,spread:.17,bounces:1,color:'#c4b5fd'});break;
 case 'mirage':o.status.shield=Math.min(32,(o.status.shield||0)+8+evolutionStage(o)*2);foe.aiTarget={vx:-foe.vy,vy:foe.vx};foe.aiDecisionClock=.4+evolutionStage(o)*.2;dash(o,foe,.12);visual(o,o,'mirage',35,d.color,.6);break;
 case 'doom':zone(o,foe.x,foe.y,'doom',22,2,.65);roundState().hazards.at(-1).targetUid=foe.uid;break;
 case 'phoenix':o.hp=Math.min(o.mh,o.hp+4+evolutionStage(o)*2);zone(o,o.x,o.y,'fire',31,3,.32);break;
 case 'pumpkin':radial(o,foe,.47,{radius:115,knock:.18});break;
 default:shoot(o,foe,{damage:o.baseDmg*.5,homing:.15});
 }
 applyAuthoredUpgrade(o,foe);
 if(typeof snd==='function'&&o.b.id%5===0)snd(420+(o.b.id*19)%650,.11,'triangle',.018,180);
}
const oldSpecial=specialAbility;
specialAbility=cast;
// Cell's one-time mitosis is part of its single growth ability.
const previousApply=applyDamage;
applyDamage=function(target,damage){
 previousApply(target,damage);
 if(target?.b?.id===17&&target.hp<=0&&!target.v2MitosisUsed){
  target.v2MitosisUsed=true;target.hp=Math.max(1,Math.round(target.mh*.24));
  target.r=Math.max(10,target.r*.68);
  target.status.shield=(target.status.shield||0)+5;
  if(evolutionStage(target)>0){
   const level=evolutionStage(target);
   target.hp=Math.max(target.hp,Math.round(target.mh*(level===2?.39:.3)));
   target.v2CellBud={clock:.35,remaining:level===2?5:3,heal:level===2?3:2};
   zone(target,target.x,target.y,'slime',level===2?43:30,2.6+level,.48);
   if(level===2&&target.v2MitosisBloom)target.status.shield=Math.min(32,(target.status.shield||0)+9);
  }
  visual(target,target,'growth',32,'#5eead4',.95);
 }
};
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
  // Identity-specific evolution lifecycles: actual periodic attacks, healing
  // and pulling, rather than one-off reused actions or cosmetic rings.
  if(o.b.id===17&&o.v2CellBud){
   const bud=o.v2CellBud;bud.clock-=dt;
   if(bud.clock<=0){
    o.hp=Math.min(o.mh,o.hp+bud.heal);
    visual(o,o,'heal',21,'#5eead4',.36);
    bud.remaining--;bud.clock+=.75;
    if(bud.remaining<=0)o.v2CellBud=null;
   }
  }
  if(o.b.id===19&&o.v2Pressure){
   const aura=o.v2Pressure;aura.remaining-=dt;aura.next-=dt;
   if(aura.remaining<=0)o.v2Pressure=null;
   else if(aura.next<=0){
    const foe=G.bl.find(t=>t.team!==o.team&&alive(t));
    if(foe){
     const dx=o.x-foe.x,dy=o.y-foe.y,dist=Math.hypot(dx,dy)||1;
     if(dist<aura.radius+foe.r){
      strike(o,foe,o.baseDmg*aura.damage,{slow:.22});
      if(aura.pull>0){
       foe.vx=(foe.vx||0)+dx/dist*aura.pull;
       foe.vy=(foe.vy||0)+dy/dist*aura.pull;
      }
     }
    }
    visual(o,o,'ring',aura.radius,abilityData[19].color,.35);
    aura.next+=.4;
   }
  }
  if(o.b.id===20&&o.v2BeamEcho){
   const beam=o.v2BeamEcho;beam.clock-=dt;
   if(beam.clock<=0){
    const foe=G.bl.find(t=>t.team!==o.team&&alive(t));
    if(foe){
     const py=foe.y,px=foe.x;
     st.beams.push({x:o.x,y:o.y,x2:px,y2:py,color:'#60a5fa',life:.36,max:.36,id:20});
     strike(o,foe,o.baseDmg*beam.damage,{slow:.3});
    }
    beam.remaining--;beam.clock+=.6;if(beam.remaining<=0)o.v2BeamEcho=null;
   }
  }
  if(o.b.id===22&&o.v2Orchard){
   const orchard=o.v2Orchard;orchard.clock-=dt;
   if(orchard.clock<=0){
    o.hp=Math.min(o.mh,o.hp+1.8*orchard.level);
    if(orchard.level===2)o.status.shield=Math.min(32,(o.status.shield||0)+.7);
    visual(o,o,'heal',21,'#fbbf24',.44);
    orchard.remaining--;orchard.clock+=.9;
    if(orchard.remaining<=0)o.v2Orchard=null;
   }
  }
  const echo=o.v2Echo;if(echo){echo.clock-=dt;if(echo.clock<=0){const foe=G.bl.find(t=>t.team!==o.team&&alive(t));if(foe)radial(o,foe,echo.power,{radius:echo.radius});echo.remaining--;echo.clock+=.5;if(echo.remaining<=0)o.v2Echo=null;}}
  const tail=o.v2Tail;
  if(tail){tail.life-=dt;tail.nextHit=Math.max(0,tail.nextHit-dt);if(tail.life<=0)o.v2Tail=null;else {const foe=G.bl.find(t=>t.team!==o.team&&alive(t)),points=(o.trail||[]).slice(-tail.length);if(foe&&tail.nextHit<=0&&points.some(p=>Math.hypot(foe.x-p.x,foe.y-p.y)<foe.r+8)){strike(o,foe,o.baseDmg*.16,{poison:.4,knock:.08});tail.nextHit=.6;}}}
  const orbit=o.axeOrbit;
  if(orbit){
   orbit.life-=dt;orbit.angle+=dt*7.5;
   if(orbit.life<=0){o.axeOrbit=null;continue;}
   for(const foe of G.bl||[]){
    if(!alive(foe)||foe.team===o.team||(orbit.nextHit[foe.uid]||0)>G.rt)continue;
    for(let i=0;i<orbit.blades;i++){
     const a=orbit.angle+i*Math.PI*2/orbit.blades;
     const x=o.x+Math.cos(a)*orbit.radius,y=o.y+Math.sin(a)*orbit.radius;
     if(Math.hypot(foe.x-x,foe.y-y)<=foe.r+9){
      strike(o,foe,o.baseDmg*(o.hp/Math.max(1,o.mh)<.35?.29:.24),{knock:.08});
      orbit.nextHit[foe.uid]=G.rt+.38;
      break;
     }
    }
   }
  }
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
  const hitX=s.x<7||s.x>353,hitY=s.y<7||s.y>353;
  if(hitX||hitY){
   if(s.bounces>0){
    if(hitX)s.vx*=-1;
    if(hitY)s.vy*=-1;
    s.bounces--; // A corner counts as one bounce, not two.
    s.x=clamp(s.x,7,353);s.y=clamp(s.y,7,353);
   }else s.life=0;
  }
  if(s.life<=0)continue;
  if(!s.ghost&&(G.obstacles||[]).some(ob=>closestToSegment(ob.x,ob.y,s.px,s.py,s.x,s.y)<ob.r+s.r)){s.life=0;continue;}
  const target=G.bl.find(o=>o.team!==s.team&&alive(o)&&closestToSegment(o.x,o.y,s.px,s.py,s.x,s.y)<o.r+s.r);
  if(target){
   const owner=G.bl.find(o=>o.uid===s.owner);
   if(owner)strike(owner,target,s.damage,{slow:s.slow,poison:s.poison,burn:s.burn,stun:s.stun,knock:s.knock});
   if(owner&&s.healOnHit&&alive(owner))owner.hp=Math.min(owner.mh,owner.hp+s.healOnHit);
   s.life=0;
  }
 }
 st.shots=st.shots.filter(p=>p.life>0);
 for(const h of st.hazards){
  h.age+=dt;h.life-=dt;h.cooldown-=dt;
  if(h.kind==='doom'&&h.age<(h.armAt||0)){const target=G.bl.find(o=>o.uid===h.targetUid&&alive(o));if(target){h.x=target.x;h.y=target.y;}}
  if(h.kind==='train'){h.x+=(h.vx||0)*dt;h.y+=(h.vy||0)*dt;}
  if(h.kind==='train'&&(h.x<-25||h.x>W+25||h.y<-25||h.y>W+25))h.life=0;
  if(h.life<=0)continue;
  const summoner=G.bl.find(o=>o.uid===h.owner&&alive(o));
  if(summoner&&['pet','turret'].includes(h.kind)){
   const target=G.bl.find(o=>o.team!==h.team&&alive(o));
   if(target){if(h.kind==='pet'){const d=Math.hypot(target.x-h.x,target.y-h.y)||1;if(d>42){h.x+=(target.x-h.x)/d*60*dt;h.y+=(target.y-h.y)/d*60*dt;}}
    h.nextShot=(h.nextShot||0)-dt;if(h.nextShot<=0){shoot({...summoner,x:h.x,y:h.y},target,{damage:summoner.baseDmg*.08*h.power*(summoner.v2PetPower||1),homing:.35,speed:145,life:2});h.nextShot=1.0;}}
  }
  if(h.age<(h.armAt||0))continue;
  const foe=G.bl.find(o=>o.team!==h.team&&alive(o)&&Math.hypot(o.x-h.x,o.y-h.y)<o.r+h.radius);
  if(!foe||h.cooldown>0)continue;
  const owner=G.bl.find(o=>o.uid===h.owner)||null;
  if(!owner)continue;
  if(h.kind==='slow')strike(owner,foe,1.6*h.power,{slow:.75});
  else if(h.kind==='thorn')strike(owner,foe,2*h.power,{poison:.6});
  else if(h.kind==='shock')strike(owner,foe,3*h.power,{stun:.19});
  else if(h.kind==='frost')strike(owner,foe,2*h.power,{slow:.9});
  else if(h.kind==='poison'||h.kind==='gas'||h.kind==='tail'||h.kind==='slime')
   strike(owner,foe,2*h.power,{poison:.65,slow:h.kind==='slime'?.6:h.kind==='gas'?.4:0});
  else if(h.kind==='fire'||h.kind==='sun')strike(owner,foe,3*h.power,{burn:.8});
  else if(h.kind==='mine'||h.kind==='doom'||h.kind==='train')strike(owner,foe,7*h.power,{knock:.28,stun:h.id===39?.3:0});
  else strike(owner,foe,3*h.power,{knock:h.kind==='zone'?.1:0});
  if(h.id===40)setStatus(owner,foe,'weaken',.5);
  h.cooldown=h.kind==='mine'||h.kind==='doom'||h.kind==='echo'?99:.62;
 }
 st.hazards=st.hazards.filter(h=>h.life>0);
 for(const beam of st.wallBeams||[]){
  beam.life-=dt;
  if(beam.life<=0)continue;
  for(const foe of G.bl){
   if(!alive(foe)||foe.team===beam.team)continue;
   const touched=closestToSegment(foe.x,foe.y,beam.a.x,beam.a.y,beam.b.x,beam.b.y)<foe.r+(beam.width||2);
   if(touched&&!beam.inside[foe.uid]){
    const owner=G.bl.find(o=>o.uid===beam.owner);
    if(owner)strike(owner,foe,2.5,{slow:.2});
   }
   beam.inside[foe.uid]=touched;
  }
 }
 st.wallBeams=(st.wallBeams||[]).filter(b=>b.life>0);
 for(const w of st.webs){
  for(const foe of G.bl||[]){
   if(!alive(foe)||foe.team===w.team)continue;
   const touched=closestToSegment(foe.x,foe.y,w.a.x,w.a.y,w.b.x,w.b.y)<=foe.r+2;
   if(touched&&!w.inside[foe.uid]){
    const owner=G.bl.find(o=>o.uid===w.owner)||null;
    if(owner)strike(owner,foe,1,{slow:(w.stage||0)*.15,poison:w.id===34||w.id===117||(w.stage||0)===2?.4:0});
   }
   w.inside[foe.uid]=touched;
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
 const detailed=(Number(S?.o?.fxLevel??3)>0);
 cx.save();
 // Draw gameplay tails and active blades even with visual effects disabled.
 for(const o of G.bl||[]){if(!o.v2Tail||!alive(o))continue;const points=(o.trail||[]).slice(-o.v2Tail.length);cx.strokeStyle=o.b.c;cx.lineWidth=6;cx.globalAlpha=.65;cx.beginPath();for(let i=0;i<points.length;i++){const p=points[i];i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y);}cx.lineTo(o.x,o.y);cx.stroke();cx.globalAlpha=1;}
 for(const o of G.bl||[]){
  if(!alive(o)||!o.axeOrbit)continue;
  const orbit=o.axeOrbit;
  for(let i=0;i<orbit.blades;i++){
   const a=orbit.angle+i*Math.PI*2/orbit.blades;
   const x=o.x+Math.cos(a)*orbit.radius,y=o.y+Math.sin(a)*orbit.radius;
   cx.save();cx.translate(x,y);cx.rotate(a+Math.PI/2);
   cx.shadowColor=orbit.color;cx.shadowBlur=12;cx.fillStyle=orbit.color;
   cx.strokeStyle='#fff';cx.lineWidth=1.5;
   cx.beginPath();cx.moveTo(0,-11);cx.lineTo(7,3);cx.lineTo(2,9);
   cx.lineTo(-2,9);cx.lineTo(-7,3);cx.closePath();cx.fill();cx.stroke();
   cx.restore();
  }
 }
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
 for(const beam of st.wallBeams||[]){
  cx.save();cx.globalAlpha=Math.min(.95,beam.life*.6);
  cx.strokeStyle=beam.color;cx.shadowColor=beam.color;cx.shadowBlur=19;cx.lineWidth=5;
  cx.beginPath();cx.moveTo(beam.a.x,beam.a.y);cx.lineTo(beam.b.x,beam.b.y);cx.stroke();
  cx.strokeStyle='#fff';cx.lineWidth=1.2;cx.stroke();cx.restore();
 }
 for(const h of st.hazards||[]){
  cx.globalAlpha=Math.min(.5,.16+.34*Math.min(1,h.life/.6));cx.fillStyle=h.color;cx.strokeStyle=h.color;
  cx.shadowColor=h.color;cx.shadowBlur=10;
  if(h.kind==='train'){
   cx.save();cx.translate(h.x,h.y);cx.rotate(Math.atan2(h.vy||0,h.vx||1));
   cx.fillStyle='#4338ca';cx.strokeStyle=h.color;cx.globalAlpha=.85;
   cx.fillRect(-27,-11,54,22);cx.strokeRect(-27,-11,54,22);
   cx.fillStyle='#c4b5fd';for(let j=0;j<3;j++)cx.fillRect(-20+j*14,-6,9,8);
   cx.restore();
  }else {
   cx.beginPath();cx.arc(h.x,h.y,h.radius,0,Math.PI*2);cx.fill();
   cx.globalAlpha=.9;cx.lineWidth=2;cx.stroke();
  }
 }
 for(const p of st.shots||[]){
  cx.globalAlpha=detailed?.4:.16;cx.lineWidth=Math.max(2,p.r*.85);cx.lineCap='round';
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
 for(const e of detailed?(st.effects||[]):[]){
  const t=Math.min(1,e.age/e.life),alpha=(1-t)*(1-t);
  cx.globalAlpha=Math.min(1,alpha);cx.shadowBlur=12;cx.shadowColor=e.color;
  cx.strokeStyle=e.color;cx.lineWidth=Math.max(.7,3*(1-t));
  if(e.kind==='slash'){cx.beginPath();cx.arc(e.x,e.y,e.size*(.45+t),-.6,1.95);cx.stroke();}
  else if(e.kind==='orbit'){for(let i=0;i<3;i++){cx.beginPath();cx.arc(e.x,e.y,e.size*(.4+t),i*2*Math.PI/3+t,i*2*Math.PI/3+.5+t);cx.stroke();}}
  else if(e.kind==='clock'){cx.beginPath();cx.arc(e.x,e.y,e.size*(.5+t),0,7);cx.stroke();cx.beginPath();cx.moveTo(e.x,e.y);cx.lineTo(e.x+e.size*.35,e.y-e.size*.3);cx.stroke();}
  else {
   cx.beginPath();cx.arc(e.x,e.y,e.size*(.35+t),0,Math.PI*2);cx.stroke();
   // Per-ball rune pattern: every ball uses a different rhythm and geometry.
   const petals=3+(e.id%6),rot=(e.id%2?-1:1)*t*(.7+e.id%5*.16);
   cx.globalAlpha*=.58;
   for(let j=0;j<petals;j++){
    const a=j*Math.PI*2/petals+rot,r=e.size*(.24+t*.63);
    const x=e.x+Math.cos(a)*r,y=e.y+Math.sin(a)*r;
    if(e.id%3===0){cx.strokeRect(x-2,y-2,4,4);}
    else if(e.id%3===1){cx.beginPath();cx.arc(x,y,1.4+(e.id%3),0,7);cx.stroke();}
    else {cx.beginPath();cx.moveTo(x,y-3);cx.lineTo(x+3,y);cx.lineTo(x,y+3);cx.closePath();cx.stroke();}
   }
  }
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
 return old.replace(square,background).replace('</svg>',shine+extra+'</svg>');
}
art=function(id){if(!ART.has('v2'+id))ART.set('v2'+id,enhanceArt(id));return ART.get('v2'+id);};
ART_IMAGES.clear();preloadArt();
function prepareActors(g,p,e){
 if(!g||netRole==='guest')return;
 for(const o of [p,e]){
  if(!o)continue;
  const data=abilityData[o.b.id];
  o.speedFactor=(o.speedFactor||1)*(data?.speed||1);
  // Low difficulty bots should not fire their first ability almost instantly.
  if(o===e&&g.m===0&&typeof diff==='number'){
   o.abilityCd=diff===0?2.9:diff===1?2.4:Math.min(o.abilityCd,1.5);
  }else o.abilityCd=Math.min(o.abilityCd,1.5);
 }
}
function afterLoad(){ART_IMAGES.clear();preloadArt();}
// Render from live mechanics metadata so collection and prematch descriptions agree.
function identityPanel(id){
 const identity=window.BVBIdentities?.get?.(id);if(!identity)return null;
 const box=document.createElement('section');box.className='cd bvb-identity-summary';
 box.setAttribute('aria-label','Pasywna i superumiejętność: '+identity.name);
 box.style.cssText='text-align:left;margin:10px 0;font-size:.79rem;line-height:1.5;overflow-wrap:break-word';
 for(const [label,data] of [['Pasywna',identity.passive],['Super',identity.super]]){
  const title=document.createElement('h3');title.style.cssText='font-size:.88rem;margin:10px 0 4px;color:#c4b5fd';title.textContent=label+' — '+data.name;
  const description=document.createElement('p');description.textContent=data.desc;box.append(title,description);
 }
 const charge=document.createElement('p');charge.style.cssText='margin-top:9px;color:#fde68a';
 charge.textContent='Super uruchamia się automatycznie przy 100 energii, maksymalnie 2 razy w rundzie. Energia: +3,6/s, +10 za własne zderzenie i +5 po trafieniu kontaktem. Ogłuszenie wstrzymuje aktywację.';
 box.append(charge);return box;
}
const originalBallDetail=openBallDetail;
openBallDetail=function(id){originalBallDetail(id);const details=identityPanel(id);if(details)document.querySelector('#ovb')?.appendChild(details);};
window.BVB2={abilities:abilityData,evolutionDescription,authoredUpgrades,onContact,onWall,cooldown,prepareActors,afterLoad,drawOverlay,identityPanel};
})();
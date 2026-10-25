/* Ball VS Ball — explicit identities. All scripts are bounded, deterministic and host authoritative.
   Shared effect primitives are intentional; triggers, positioning and combinations are authored per ball. */
(() => {
'use strict';
// ball | passive name | event | cooldown | condition | effects | super name | effects
const rows = `
Szarża|Bezwładność|tick|3|far|charge:2;dash:1.18|Przełamanie|dash:1.4;charge:8;shield:3
Topór|Wyszczerbiona krawędź|contact|2|near|wound:1.2;charge:1|Krąg egzekutora|orbit:4:43:3;weaken:.7
Trujący kolec|Kolce obronne|damage|3|near|poison:.6;hit:1|Żywopłot|field:poison:58:3:.65:self;shots:5:1.8:130:.3:0:1
Złodziej|Zwinne dłonie|contact|3|shieldedFoe|steal:2;haste:1.2|Skok na skarbiec|steal:6;blink:back;charge:6;weaken:.8
Ostrze|Rytm cięć|contact|0|pair|charge:2.5|Taniec stali|orbit:5:38:2.8;dash:1.2;armor:3
Karabin|Zapasowy magazynek|active|3|far|shots:1:1.8:210:0:0:0|Ogień zaporowy|shots:6:2.4:220:.1:0:1;weaken:.6
Pająk|Wyczucie drgań|tick|4|slowedFoe|cooldown:.3;shield:1.5|Kokon łowcy|field:slime:48:3:.6:foe;shots:3:3:120:.25:1:0
Wampir|Pragnienie|contact|2.8|wounded|heal:1.7|Krwawy bankiet|drain:8:6;dash:1.25;wound:1
Włócznia|Zasięg drzewca|contact|2.5|front|push:.15;charge:1.8|Pchnięcie króla|line:13:18;dash:1.4;armorBreak:3
Rozbłysk|Iskry po uderzeniu|damage|3.5|near|ring:2.1:65|Fala detonacyjna|ring:12:115;push:.4;shield:4
Szachy|Roszada|damage|6|low|blink:away;shield:3|Szach mat|blink:side;line:10:22;delay:.55:5:42
Kostka|Szczęśliwe oczko|active|4|any|roll:1.5|Szóstka|roll:5;shots:6:1.7:140:.45:0:1
Lodowy Stożek|Kruchy lód|contact|3|slowedFoe|armorBreak:1.5|Polarna korona|shots:5:2.2:155:.17:0:0;slow:1.3;field:frost:40:2:.4:foe
Laser|Gorąca soczewka|wall|3|far|charge:1.5;cooldown:.15|Przecięcie areny|line:14:12;burn:.6;shield:2
Wąż|Zrzucenie skóry|damage|5|poisoned|cleanse:poison;armor:2|Splot anakondy|pull:.5;field:tail:42:3:.7:foe;poison:.6
Hak|Napięta lina|contact|3|front|slow:.3;armor:1|Abordaż|pull:.65;charge:6;shield:5
Przekuwacz|Hartowanie|wall|3.5|any|armor:1.8|Mistrz kuźni|armor:9;field:pet:38:4:.9:self;shield:4
Komórka|Metabolizm|tick|5|low|heal:2.5|Podwójna błona|heal:7;shield:8;field:slime:35:2:.5:self
Elektryk|Ładunek statyczny|contact|3|pair|stun:.14;charge:1|Wyładowanie|shots:3:3:225:.14:.6:0;stun:.3;shield:3
Strefa|Ciśnienie pola|tick|3.8|near|push:.1;ring:1.3:78|Horyzont nacisku|field:zone:72:3:.7:self;ring:7:100
Promień|Skupienie|tick|4|far|charge:2.3|Promień zenitu|line:16:10;push:.25
WDC|Pamięć pola|wall|3|any|charge:1;armor:1|Macierz dziewięciu|grid:3:1.5;shield:4
Jabłko|Zdrowa przekąska|active|4|wounded|heal:1.6|Sad życia|heal:8;shots:3:2.5:135:.2:.3:0
Armata|Gruba lufa|contact|3|front|push:.17;armorBreak:1|Oblężenie|shots:2:7:125:.12:0:2;armor:3
Wirus|Inkubacja|tick|4|poisonedFoe|weaken:.5|Pandemia|poison:2;field:gas:60:3:.55:foe;hit:5
Wielki Kolec|Ciężka igła|contact|3|armoredFoe|armorBreak:2;charge:1|Przebicie muru|armorBreak:8;line:11:24;protect:.12:2
Łuk|Napięcie cięciwy|wall|2.8|far|shots:1:1.7:180:0:0:1|Deszcz strzał|shots:5:2.7:195:.12:0:2
Król Elektryków|Napięcie korony|active|4|near|stun:.13;shield:1|Burza tronowa|grid:2:2;stun:.25;field:shock:40:2:.45:self
Zasięg|Drugi pierścień|contact|3|any|ring:1.6:96|Koncentryczne fale|ring:6:70;delay:.4:5:105;delay:.8:4:138
Mróz|Śliski szron|wall|4|any|field:frost:22:1.8:.3:self|Epoka lodowcowa|field:frost:70:3:.55:mid;slow:1.5;shield:3
Harpun|Zadzior|contact|3|slowedFoe|wound:.8;pull:.12|Głębinowy chwyt|pull:.8;slow:1.3;hit:9;armor:4
Rój|Ochrona ula|damage|4|any|shots:1:1.7:125:0:1.2:0|Królowa roju|shots:7:2:135:.3:1.4:0;poison:.6
Eliksir|Pozostałość mikstury|active|4.5|any|roll:1.4|Kamień filozoficzny|cleanse:all;roll:5;heal:4;shots:2:3:150:.3:.5:0
Konduktor|Bilet powrotny|wall|3|wounded|heal:1.4;charge:.5|Ekspres widmo|line:11:30;dash:1.35;shield:5
Czarny Pająk|Jad łowcy|contact|3|slowedFoe|poison:.8|Czarny kokon|slow:1.6;poison:1.3;field:slime:45:3:.65:foe
Grób|Spokój cmentarza|tick|5|far|shield:2|Otwarcie krypty|field:mine:34:3:1:foe;shots:3:2.2:95:.6:1.5:0
Skrzydło Światła|Pióro odwagi|wall|3|any|haste:1.25;cleanse:slow|Świetlny przelot|dash:1.5;charge:7;shots:3:2:230:.1:0:0
Pudełko Cukierków|Lepki lukier|contact|3|any|slow:.35;shield:.6|Słodka kanonada|shots:5:2.5:145:.25:.4:1;slow:.8
Szlam|Lepka warstwa|damage|4|near|slow:.4;heal:1|Wielka plama|heal:5;field:slime:76:3:.65:self;shield:4
Kajdany|Zacisk ogniwa|contact|3.5|slowedFoe|stun:.16|Dożywocie|slow:1.8;pull:.4;delay:.6:8:55;shield:3
Kwas|Korozja|contact|2.8|armoredFoe|armorBreak:1.8|Rozpuszczenie|armorBreak:9;poison:.8;field:poison:52:2.8:.65:foe
Promień Świetlny|Soczewka odbicia|wall|3.5|any|charge:1.2;shots:1:.8:240:0:0:1|Fotoniczny krzyż|cross:3.2:180;line:5:15
Trujący Gaz|Gęsta atmosfera|tick|4.2|near|poison:.45|Toksyczny front|field:gas:85:3:.65:mid;weaken:.9
Shuriken|Powrotna gwiazda|wall|3|far|shots:1:1.5:155:0:.25:2|Tysiąc krawędzi|shots:5:2.4:185:.2:.3:3
Fibonacci|Złota proporcja|contact|0|triple|charge:3|Spirala wzrostu|orbit:5:52:2.3;charge:5;armor:3
Kaktus|Odruch igieł|damage|3|near|hit:1.5;poison:.2|Pustynna forteca|reflect:.2:3;shield:7;shots:4:1.8:160:.4:0:1
Bomba|Odłamkowy zapłon|contact|4|any|delay:.5:2.5:42|Łańcuch detonacji|delay:.45:5:42;delay:.9:5:60;delay:1.35:5:78
Orbita|Osłona satelitów|active|3.5|any|shield:1.7|Układ planetarny|orbit:6:58:3.3;shield:5
Medyk|Pierwsza pomoc|damage|5|low|heal:2.4|Szpital polowy|heal:10;cleanse:all;shield:6
Prawda|Przejrzystość|active|4|shieldedFoe|steal:1.5|Ostateczny werdykt|steal:7;hit:8;cleanse:weaken
Szkło|Ostra rysa|damage|4|near|shots:2:1.1:200:.4:0:0|Rozbicie|shots:7:2.2:210:.45:0:2;protect:.1:1
Portal|Przestrzenna pamięć|wall|5|low|blink:away;charge:1|Przeskok wymiarów|blink:back;ring:9:65;shield:5;delay:.5:4:40
Tarcza|Rezerwa bariery|tick|4|bare|shield:2.2|Bastion|shield:16;armor:5;cleanse:stun
Magik|Znikająca moneta|damage|5|low|evade:2.4|Wielka zamiana|swap:1;shield:7;ring:8:65
Chronos|Oszczędzony moment|active|4|slowedFoe|cooldown:.35|Godzina zero|slow:1.8;delay:.9:10:70;haste:1.3
Ninja|Cios z tyłu|contact|3|rear|charge:2.5|Cień ostrza|blink:back;charge:8;weaken:.7;shield:3
Pirat|Łup|contact|3.5|wounded|heal:1;charge:.7|Salwa burtowa|shots:3:4.5:150:.3:0:1;push:.25
Górnik|Urobek|wall|4|any|armor:1;field:mine:17:2:.2:self|Pole minowe|mines:4:26:3:.65;shield:4
Szeryf|Ostatni nabój|active|4|far|shots:1:2:220:0:0:0|Pojedynek w samo południe|line:12:9;shots:2:2.2:240:.08:.2:1
Magma|Płynna skorupa|damage|3.5|near|burn:.45|Kaldera|field:fire:68:3:.8:self;ring:6:100
Plazma|Nadmiar energii|active|3.5|any|shield:1.2;charge:.5|Reaktor plazmowy|shots:2:6:110:.18:1.1:1;stun:.18;armor:3
Meteor|Ciężki upadek|wall|4|near|ring:1.8:65|Bombardowanie|meteors:4:3.5:34:.3
Cyklon|Podmuch|contact|3|any|push:.22|Oko cyklonu|pull:.6;field:zone:62:3:.6:mid;ring:5:105
Pryzmat|Widmo barw|active|4|any|cycle:1.5|Siedem barw|shots:7:2.2:205:.14:0:1;cycle:3
Echo|Pogłos|contact|3|any|delay:.35:1.9:50|Rezonans|ring:5:85;delay:.5:5:110;delay:1:5:135
Grawitacja|Przyciąganie masy|tick|3|far|pull:.09|Osobliwość|pull:.85;field:zone:55:3:.7:foe;slow:.8
Kotwica|Dno|wall|3|any|armor:1.3;protect:.05:1|Zakotwiczenie|armor:8;shield:6;pull:.65;ring:5:70
Lustro|Srebrna powłoka|damage|4|any|reflect:.16:1.5|Pałac zwierciadeł|reflect:.25:4;shield:8;shots:2:2:180:.2:1:1
Pustka|Głód przestrzeni|active|4|shieldedFoe|steal:1.8|Pożarcie|erase:5;steal:6;pull:.5;hit:6
Słońce|Ciepła korona|tick|3.5|near|burn:.45|Rozbłysk słoneczny|ring:10:125;burn:1.1;shield:3
Księżyc|Fazy|tick|5|any|cycle:1.7|Pełnia|cycle:4;shield:5;shots:3:3:170:.25:.4:1
Zaćmienie|Półcień|contact|3|any|weaken:.45|Całkowite zaćmienie|weaken:1.8;blink:side;shots:4:3:160:.2:.5:0
Supernowa|Gromadzenie gwiazdy|tick|4.5|far|charge:2.5|Wybuch supernowej|ring:16:150;push:.5
Mgławica|Gwiezdny pył|wall|4.5|any|field:gas:25:2:.3:self|Kolebka gwiazd|field:gas:80:3:.7:foe;shots:3:2:110:.5:1:0
Pulsar|Stały rytm|tick|3|near|ring:1.3:85;push:.05|Puls magnetyczny|ring:4:80;delay:.33:4:100;delay:.66:4:120;delay:.99:4:140
Kwazar|Polaryzacja|active|4|far|line:2:10|Biegunowe dżety|line:13:16;cross:1.6:240
Kometa|Zimny warkocz|wall|3.5|any|haste:1.18;slow:.2|Kometa końca|dash:1.45;charge:7;field:frost:42:2.5:.6:self
Asteroida|Skalna gęstość|damage|4|any|armor:1.5|Pas asteroid|shots:5:2.7:120:.5:0:2;armor:5
Kwant|Dwie możliwości|active|4|any|evade:1.5;charge:.6|Superpozycja|shots:2:5:200:.65:1:0;blink:side;shield:4
Atom|Powłoka walencyjna|contact|3|pair|shield:1.5;ring:1:55|Rozszczepienie|ring:9:95;shots:4:2:190:.5:0:1
Proton|Dodatni ładunek|contact|3|any|push:.18;charge:.7|Akcelerator|dash:1.4;charge:6;push:.5;shots:2:3:230:.12:0:1
Neutron|Neutralizacja|tick|4|any|immune:poison:slow;armor:.8|Jądrowa osłona|cleanse:all;armor:10;shield:8
Elektron|Tunelowanie|damage|4.5|low|blink:side;haste:1.2|Skok elektronowy|blink:back;shots:3:3.3:250:.14:.5:1;shield:4
Iskra|Tarcie ścian|wall|2.7|any|charge:1.3;haste:1.12|Łuk iskrowy|cross:3:210;burn:.7;dash:1.3
Piekło|Żar pieca|contact|3|burningFoe|charge:1.5;burn:.2|Dziewiąty krąg|field:fire:90:3:.65:mid;burn:1.4;hit:4
Tsunami|Przypływ|wall|4|any|shield:1.1;push:.07|Wielka fala|line:12:52;push:.65;cleanse:burn
Wstrząs|Naprężenie skał|wall|3.5|near|ring:2:62|Trzęsienie ziemi|ring:7:120;delay:.5:7:145;stun:.22
Nawałnica|Prąd wstępujący|tick|4|near|pull:.1;stun:.1|Front burzowy|pull:.6;grid:2:1.9;stun:.2
Zamieć|Śnieżna zaspa|damage|4|near|slow:.55|Biała cisza|field:frost:95:3:.6:mid;slow:1.7;weaken:.5
Miraż|Załamanie obrazu|damage|4.5|any|evade:1.9|Trzy słońca|blink:side;shots:3:4:145:.7:1.2:0;shield:4
Widmo|Półmaterialność|damage|4|any|protect:.14:1.2|Przejście przez cień|protect:.25:3;blink:back;ring:8:65
Upiór|Niepokój|tick|4|near|weaken:.4;hit:.6|Nawiedzenie|weaken:1.4;field:doom:48:3:.9:foe;drain:3:2
Zjawa|Zimny szept|contact|3|rear|slow:.25;heal:.8|Wyjście z mroku|blink:back;charge:9;protect:.12:1.5
Kosiarz|Ostrze kresu|contact|3|lowFoe|charge:2.6|Ostatnie żniwa|execute:14;drain:4:3
Zagłada|Omen|active|4|any|delay:.7:2.2:45|Odliczanie|delay:.6:5:45;delay:1.2:6:60;delay:1.8:7:75
Chaos|Kaprys|active|4.5|any|roll:1.8|Kontrolowany chaos|roll:5;cycle:4;shots:3:2:160:.4:.4:1
Porządek|Równa miara|contact|3|strongerFoe|charge:2;armor:.8|Wyrok równowagi|equalize:6;line:10:18;cleanse:weaken
Feniks|Gorące popioły|tick|5|low|heal:2;cleanse:burn|Drugie życie|heal:11;ring:7:85;burn:.7
Kraken|Przyssawki|contact|3|any|pull:.16;heal:.6|Cztery macki|shots:4:2.5:130:.4:1.8:0;pull:.6;slow:.8
Król Dyń|Nasiona trwogi|wall|4|any|field:mine:22:2:.3:self|Dyniowa monarchia|meteors:3:3.6:40:.4;burn:.9;shield:4
Wiedźma|Opar zaklęcia|active|4|any|weaken:.4;poison:.2|Sabat czarownic|cycle:4;field:gas:55:3:.7:foe;shots:2:3:130:.3:.7:0
Kocioł|Kwaśny osad|contact|3.2|armoredFoe|armorBreak:2.2|Wrzący wywar|armorBreak:6;field:poison:65:3:.75:self;heal:3
Czarny Kot|Siedem uników|damage|5|low|evade:2.2;charge:.4|Pechowa siódemka|blink:back;shots:7:1.8:175:.17:.7:1;weaken:.8
Nietoperz|Echolokacja|active|4|far|shots:1:1.8:125:0:1.5:0|Nocna kolonia|shots:5:2.4:130:.55:1.6:0;heal:4
Zombie|Uparty krok|tick|5.5|low|heal:2.6;armor:.5|Marsz nieumarłych|heal:9;protect:.2:3;slow:.7
Voodoo|Nić bólu|damage|4|any|hit:1.3;weaken:.2|Lalka cierpienia|reflect:.3:3;drain:6:3;slow:.6
Strach na Wróble|Puste oczy|contact|3.5|front|weaken:.5|Koszmar pola|push:.6;weaken:1.6;field:doom:60:3:.85:foe
Ognik|Błękitny płomień|tick|4|near|burn:.35;armorBreak:.7|Ogień dusz|armorBreak:5;shots:4:3.2:145:.4:1.2:0;burn:.8
Wilkołak|Zapach krwi|contact|3|lowFoe|heal:1.1;haste:1.1|Szał pełni|dash:1.45;charge:7;heal:6;wound:1
Banshee|Pęknięty głos|active|4|near|weaken:.45;push:.08|Krzyk zaświatów|ring:11:130;stun:.32;weaken:1
Golem Cmentarny|Stare granity|wall|4|any|armor:1.7;shield:.6|Strażnik nekropolii|armor:9;field:mine:45:3:1:self;ring:5:70
Krwawy Księżyc|Karmazyn|contact|3|wounded|wound:.6;heal:.7|Krwawa pełnia|wound:2;drain:6:5;ring:5:80
Duch Latarni|Podsycenie knota|active|4|burningFoe|shield:1.4;charge:.8|Procesja lampionów|shots:5:2.5:100:.55:1.4:0;burn:1
Mumia|Nowy bandaż|damage|4.5|bare|shield:2.5|Wieczne owinięcie|shield:11;slow:1.5;drain:4:2;cleanse:poison
Gargulec|Kamienny sen|tick|5|low|armor:2;protect:.08:1|Ożywiona katedra|protect:.25:2;delay:1:10:90;shots:3:2:150:.4:0:1
Nekromanta|Resztka duszy|active|4.5|any|shots:1:1.5:90:0:1.6:0;heal:.4|Armia umarłych|shots:6:2.1:105:.65:1.7:0;shield:5
Przeklęte Lustro|Krzywe odbicie|damage|4.5|near|reflect:.12:2;charge:.4|Doppelgänger|swap:1;reflect:.2:3;shots:2:4:160:.5:1:0
Pająk Wdowa|Jadowy ślub|contact|3|slowedFoe|poison:.65;weaken:.25|Wylęg wdowy|field:slime:50:3:.7:foe;shots:4:2.2:110:.4:1.5:0;poison:.7
Jeździec Bez Głowy|Wieczna pogoń|tick|3.8|far|dash:1.2;charge:1|Galop potępionych|dash:1.5;charge:8;field:fire:42:2.5:.6:self
Żniwiarz Dusz|Trzecia dusza|contact|0|triple|drain:2:1.5|Otchłań dusz|drain:9:7;pull:.4;weaken:.7
Dzwon Północy|Echo godziny|tick|4.2|near|ring:1.5:85;weaken:.15|Dwanaście uderzeń|ring:4:80;delay:.6:4:110;delay:1.2:4:140;drain:3:2
Lodowy Upiór|Szron krypty|contact|3|any|slow:.45;armorBreak:.5|Oddech wiecznej zimy|line:10:38;slow:1.7;field:frost:45:2.5:.45:foe
Królowa Kruków|Czarne pióro|wall|4|far|shots:1:1.9:140:0:1.1:0|Koronacja nocy|shots:5:2.6:150:.45:1.3:0;weaken:.9
Zgniła Dynia|Fermentacja|damage|4|near|poison:.4;burn:.2|Zielona pożoga|field:gas:70:3:.75:mid;burn:.8;poison:.8;hit:3
Widmowy Rycerz|Przysięga|contact|3.5|bare|armor:1.6;shield:.6|Ostatnia warta|armor:8;shield:10;charge:4
Cukierkowy Koszmar|Kwaśny środek|contact|3|pair|slow:.35;charge:1.3|Noc łakoci|shots:6:2:150:.3:1:1;slow:1;weaken:.6
Księżycowy Nietoperz|Cień skrzydła|damage|4.5|low|blink:away;heal:1.2|Lot zaćmienia|blink:back;drain:8:6;shots:2:2.5:180:.3:.8:0
Grobowy Alchemik|Mikstura spokoju|active|4.5|poisonedFoe|heal:1.3;cooldown:.15|Eliksir nekrozy|poison:1.6;weaken:1;heal:5;field:poison:48:2.5:.6:foe
Płacząca Marionetka|Napięta nić|contact|3.5|slowedFoe|pull:.17;weaken:.3|Teatr rozpaczy|pull:.7;slow:1.5;drain:7:3;shield:3
Kryształ Zaświatów|Pęknięcie eteru|damage|4|near|shots:2:1:190:.5:0:1;slow:.2|Serce zaświatów|cross:3.4:200;slow:1.1;stun:.2;shield:4
`.trim().split('\n').map(line=>line.split('|'));
if(rows.length!==130)throw new Error('BVB identities: expected 130 authored rows, got '+rows.length);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const alive=o=>o&&o.hp>0&&!o.gone;
const own=o=>o&&!o.b?.isBoss&&Number.isInteger(o.b?.id)&&o.b.id>=0&&o.b.id<130;
const host=g=>!!g&&g.ph==='battle'&&(typeof netRole==='undefined'||netRole!=='guest');
const commands=script=>script.split(';').filter(Boolean).map(s=>{const [kind,...args]=s.split(':');return {kind,args};});
const eventNames={contact:'Po zderzeniu',damage:'Przy otrzymaniu obrażeń',active:'Po użyciu aktywnej zdolności',wall:'Po odbiciu od ściany',tick:'W trakcie walki'};
const conditionNames={any:'',near:' przy dystansie do 100',far:' przy dystansie ponad 120',low:' poniżej 40% HP',lowFoe:' gdy rywal ma mniej niż 35% HP',wounded:' gdy brakuje HP',shieldedFoe:' gdy rywal ma tarczę',armoredFoe:' gdy rywal ma pancerz',slowedFoe:' gdy rywal jest spowolniony',burningFoe:' gdy rywal płonie',poisonedFoe:' gdy rywal jest zatruty',poisoned:' podczas zatrucia',bare:' bez tarczy',pair:' co drugie zderzenie',triple:' co trzecie zderzenie',front:' przy zderzeniu czołowym',rear:' przy trafieniu z tyłu',strongerFoe:' gdy rywal ma większy procent HP',debuffed:' pod wpływem trucizny lub spowolnienia'};
function effectText({kind,args:a}){
 const n=a[0],v={hit:`${n} obrażeń`,heal:`leczenie ${n} HP`,shield:`${n} tarczy`,armor:`odnowienie ${n} pancerza`,armorBreak:`usunięcie ${n} pancerza rywala`,charge:`+${n} do następnego zderzenia`,slow:`spowolnienie ${n} s`,stun:`ogłuszenie ${n} s`,poison:`trucizna ${n} s`,burn:`ogień ${n} s`,weaken:`osłabienie ${n} s`,wound:`krwawienie ${n} s`,cooldown:`skrócenie odnowienia o ${n} s`,haste:`ruch z prędkością ${n} przez 1 s`,dash:`szarża z prędkością ${n}`,push:`odrzut ${n}`,pull:`przyciągnięcie ${n}`,steal:`przejęcie do ${n} tarczy`,evade:`unik pochłaniający do ${n} obrażeń przez 3 s`,cleanse:`oczyszczenie: ${n==='all'?'wszystkie statusy':n}`,erase:`usunięcie do ${n} wrogich pocisków`,execute:`cios do ${n} obrażeń, mocniejszy przy niskim HP celu`,equalize:`do ${n} leczenia zależnie od różnicy HP`,swap:'zamiana miejsc z rywalem',blink:`przeskok: ${n==='back'?'za rywala':n==='away'?'od rywala':'na bok'}`,cycle:`kolejny z trzech efektów: ogień, lód, tarcza (siła ${n})`,roll:`jeden z czterech seedowanych efektów: cios, leczenie, tarcza, trucizna (siła ${n})`};
 if(v[kind])return v[kind];
 if(kind==='immune')return 'odporność na: '+a.map(k=>({poison:'truciznę',slow:'spowolnienie'}[k]||k)).join(', ');
 if(kind==='shots')return `${n} pocisków po ${a[1]} obrażeń, prędkość ${a[2]}, rozrzut ${a[3]}, naprowadzanie ${a[4]}, odbicia ${a[5]}`;
 if(kind==='ring')return `fala: ${n} obrażeń w promieniu ${a[1]}`;
 if(kind==='line')return `wiązka: ${n} obrażeń, szerokość ${a[1]}`;
 if(kind==='drain')return `${n} obrażeń i ${a[1]} HP leczenia`;
 if(kind==='protect')return `redukcja obrażeń o ${Math.round(Number(n)*100)}% na ${a[1]} s`;
 if(kind==='reflect')return `odbicie ${Math.round(Number(n)*100)}% ciosu na ${a[1]} s (do 3 HP na cios)`;
 if(kind==='field')return `pole ${n}: promień ${a[1]}, czas ${a[2]} s, siła ${a[3]}, miejsce ${a[4]==='foe'?'rywala':a[4]==='mid'?'środek areny':'właściciela'}`;
 if(kind==='delay')return `zapowiedziany wybuch po ${n} s: ${a[1]} obrażeń w promieniu ${a[2]}`;
 if(kind==='orbit')return `${n} ostrzy na orbicie ${a[1]} przez ${a[2]} s`;
 if(kind==='grid')return `siatka ${n}×${n}, siła ${a[1]}`;
 if(kind==='cross')return `4 pociski krzyżowe po ${n} obrażeń, prędkość ${a[1]}`;
 if(kind==='meteors')return `${n} zapowiedzianych meteorów po ${a[1]} obrażeń w promieniu ${a[2]}`;
 if(kind==='mines')return `${n} min o promieniu ${a[1]} na ${a[2]} s, siła ${a[3]}`;
 throw new Error('Undescribed identity command '+kind);
}
const catalog=rows.map((r,id)=>{
 const [name,passiveName,event,cooldown,condition,passiveScript,superName,superScript]=r;
 if(r.length!==8||!(event in eventNames)||!(condition in conditionNames))throw new Error('Bad identity '+id);
 const passiveActions=commands(passiveScript),superActions=commands(superScript);
 return Object.freeze({id,name,passive:Object.freeze({name:passiveName,event,cooldown:+cooldown,condition,script:passiveScript,actions:passiveActions,desc:eventNames[event]+conditionNames[condition]+(Number(cooldown)?` (odstęp ${cooldown} s)`:'')+': '+passiveActions.map(effectText).join('; ')+'.'}),super:Object.freeze({name:superName,script:superScript,actions:superActions,desc:superActions.map(effectText).join('; ')+'.'})});
});
function get(id){return catalog[id]||null;}
function describe(id){const d=get(id);return d?`Pasywna — ${d.passive.name}: ${d.passive.desc} Super — ${d.super.name}: ${d.super.desc}`:'';}
function state(g){
 g.v2||={};
 for(const key of ['shots','hazards','webs','wallBeams','beams','effects'])g.v2[key]||=[];
 if(!Number.isFinite(g.v2.tick))g.v2.tick=0;if(!Number.isFinite(g.v2.serial))g.v2.serial=0;
 return g.v2;
}
function foeOf(g,o){return (g.bl||[]).find(t=>t.team!==o.team&&alive(t));}
function prepare(g,o){
 if(!own(o)||!g||(typeof netRole!=='undefined'&&netRole==='guest'))return false;
 o.status||={};
 o.statusImmunities=catalog[o.b.id].passive.actions.filter(c=>c.kind==='immune').flatMap(c=>c.args);
 o.identity={id:o.b.id,age:0,readyAt:0,contacts:0,wallCount:0,actives:0,cycle:0,charge:0,protect:0,protectTime:0,reflect:0,reflectTime:0,evade:0,evadeTime:0,haste:0,hasteTime:0,wound:0,jobs:[]};
 return true;
}
function condition(o,f,key){
 const d=f?Math.hypot(o.x-f.x,o.y-f.y):Infinity,s=o.identity;
 switch(key){case 'any':return true;case 'near':return d<=100;case 'far':return d>120;case 'low':return o.hp/o.mh<.4;case 'lowFoe':return alive(f)&&f.hp/f.mh<.35;case 'wounded':return o.hp<o.mh;case 'shieldedFoe':return (f?.status?.shield||0)>0;case 'armoredFoe':return (f?.armor||0)>0;case 'slowedFoe':return (f?.status?.slow||0)>0;case 'burningFoe':return (f?.status?.burn||0)>0;case 'poisonedFoe':return (f?.status?.poison||0)>0;case 'poisoned':return (o.status.poison||0)>0;case 'bare':return !(o.status.shield>0);case 'pair':return s.contacts>0&&s.contacts%2===0;case 'triple':return s.contacts>0&&s.contacts%3===0;case 'front':return !!f&&(o.vx*(f.x-o.x)+o.vy*(f.y-o.y)>0)&&(f.vx*(o.x-f.x)+f.vy*(o.y-f.y)>0);case 'rear':return !!f&&(f.vx*(o.x-f.x)+f.vy*(o.y-f.y)<0);case 'strongerFoe':return !!f&&f.hp/f.mh>o.hp/o.mh;case 'debuffed':return o.status.poison>0||o.status.slow>0;default:return false;}
}
let processing=false;
function damage(g,o,f,value){
 if(!alive(f)||!Number.isFinite(value)||value<=0)return;
 const amount=clamp(value,.1,24)*(o.status?.weaken>0?.8:1);
 const adjusted=window.BVBRework?.abilityDamage?.(o,f,amount)??amount;
 const wasProcessing=processing;processing=true;
 try {applyDamage(f,adjusted);} finally {processing=wasProcessing;}
}
function visual(g,o,name,kind='ring',size=42,point=o){
 const v=state(g);v.effects.push({x:point.x,y:point.y,kind,size,color:o.b?.c||'#c4b5fd',age:0,life:.7,id:o.b.id});
 if(v.effects.length>35)v.effects.splice(0,v.effects.length-35);
 if(name){g.pop||=[];if(g.pop.length<24)g.pop.push({x:o.x,y:Math.max(22,o.y-(o.r||17)-24),age:0,life:.9,text:name,c:o.b?.c||'#c4b5fd'});}
}
function push(o,f,value){if(!f)return;const dx=f.x-o.x,dy=f.y-o.y,d=Math.hypot(dx,dy)||1;f.vx=(f.vx||0)+dx/d*value;f.vy=(f.vy||0)+dy/d*value;const speed=Math.hypot(f.vx,f.vy);if(speed>1.6){f.vx*=1.6/speed;f.vy*=1.6/speed;}}
function shot(g,o,f,args,heading){
 if(!alive(f))return;
 const [count,amount,speed,spread,homing,bounces]=args.map(Number),v=state(g),a=heading??Math.atan2(f.y-o.y,f.x-o.x);
 for(let i=0;i<clamp(count,1,7);i++){
 const angle=a+(i-(count-1)/2)*spread;
 v.shots.push({x:o.x+Math.cos(angle)*((o.r||17)+5),y:o.y+Math.sin(angle)*((o.r||17)+5),px:o.x,py:o.y,vx:Math.cos(angle)*clamp(speed,70,260),vy:Math.sin(angle)*clamp(speed,70,260),owner:o.uid,team:o.team,id:o.b.id,damage:clamp(amount,.5,8),r:4,life:2.7,age:0,homing:clamp(homing,0,2),bounces:clamp(bounces,0,3),slow:0,poison:0,burn:0,stun:0,knock:0,color:o.b.c||'#fff'});
 }
 if(v.shots.length>80)v.shots.splice(0,v.shots.length-80);
}
function hazard(g,o,kind,x,y,radius,life,power){const v=state(g);v.hazards.push({x:clamp(x,10,350),y:clamp(y,10,350),kind,owner:o.uid,team:o.team,id:o.b.id,radius:clamp(radius,10,95),life:clamp(life,.2,4),max:clamp(life,.2,4),power:clamp(power,.1,1.2),age:0,cooldown:0,color:o.b.c||'#fff'});if(v.hazards.length>45)v.hazards.splice(0,v.hazards.length-45);}
function delay(g,o,f,time,amount,radius,point=f){if(!point)return;o.identity.jobs.push({left:clamp(time,.1,2),damage:clamp(amount,.1,18),radius:clamp(radius,10,150),x:point.x,y:point.y});if(o.identity.jobs.length>12)o.identity.jobs.shift();visual(g,o,null,'circle',radius,point);}
function run(g,o,f,actions){
 const s=o.identity,st=o.status;
 for(const {kind,args:a} of actions){const n=Number(a[0]);
 switch(kind){
 case 'hit':damage(g,o,f,n);break;
 case 'heal':o.hp=Math.min(o.mh,o.hp+clamp(n,0,12));break;
 case 'shield':st.shield=Math.min(32,(st.shield||0)+clamp(n,0,18));break;
 case 'armor':o.armor=Math.min(o.armorMax||24,(o.armor||0)+clamp(n,0,10));break;
 case 'armorBreak':if(f)f.armor=Math.max(0,(f.armor||0)-clamp(n,0,10));break;
 case 'charge':s.charge=Math.min(10,s.charge+clamp(n,0,9));break;
 case 'slow':case 'stun':case 'poison':case 'burn':case 'weaken':if(alive(f)){f.status||={};const duration=clamp(n,0,kind==='stun'?.4:2);if(window.BVBRework?.applyStatus)window.BVBRework.applyStatus(f,kind,duration);else if(!f.statusImmunities?.includes(kind))f.status[kind]=Math.max(f.status[kind]||0,duration);}break;
 case 'immune':o.statusImmunities=[...new Set([...(o.statusImmunities||[]),...a])];for(const key of o.statusImmunities)st[key]=0;break;
 case 'wound':if(alive(f)){f.identityWound=Math.max(f.identityWound||0,clamp(n,0,2));}break;
 case 'cooldown':o.abilityCd=Math.max(.25,(o.abilityCd||0)-clamp(n,0,.4));break;
 case 'haste':if(!(s.hasteTime>0))s.hasteBase=clamp(Math.hypot(o.vx,o.vy)||1,.65,1.5);s.haste=clamp(n,1,1.35);s.hasteTime=1;{const speed=Math.hypot(o.vx,o.vy)||1;o.vx=o.vx/speed*s.haste;o.vy=o.vy/speed*s.haste;}break;
 case 'dash':if(alive(f)){const d=Math.hypot(f.x-o.x,f.y-o.y)||1;o.vx=(f.x-o.x)/d*clamp(n,1,1.5);o.vy=(f.y-o.y)/d*clamp(n,1,1.5);}break;
 case 'push':push(o,f,clamp(n,0,.7));break;
 case 'pull':push(o,f,-clamp(n,0,.85));break;
 case 'steal':if(alive(f)){const take=Math.min(f.status.shield||0,clamp(n,0,7));f.status.shield=(f.status.shield||0)-take;st.shield=Math.min(32,(st.shield||0)+take);}break;
 case 'evade':s.evade=clamp(n,0,3);s.evadeTime=3;break;
 case 'protect':s.protect=clamp(n,0,.3);s.protectTime=clamp(+a[1],0,4);break;
 case 'reflect':s.reflect=clamp(n,0,.3);s.reflectTime=clamp(+a[1],0,4);break;
 case 'cleanse':for(const key of a[0]==='all'?['slow','stun','poison','burn','weaken']:[a[0]])st[key]=0;if(a[0]==='all')o.identityWound=0;break;
 case 'drain':if(alive(f)){const hp=f.hp;damage(g,o,f,n);o.hp=Math.min(o.mh,o.hp+Math.min(+a[1],Math.max(0,hp-f.hp)));}break;
 case 'blink':if(alive(f)){const v=Math.hypot(f.vx,f.vy)||1,dx=f.vx/v,dy=f.vy/v,away=Math.atan2(o.y-f.y,o.x-f.x);let x,y;if(a[0]==='away'){x=f.x+Math.cos(away)*130;y=f.y+Math.sin(away)*130;}else if(a[0]==='side'){x=f.x-dy*65;y=f.y+dx*65;}else{x=f.x-dx*55;y=f.y-dy*55;}const r=o.r||17;const p={x:clamp(x,r,360-r),y:clamp(y,r,360-r)};if(!(g.obstacles||[]).some(b=>Math.hypot(p.x-b.x,p.y-b.y)<r+b.r+2)){o.x=p.x;o.y=p.y;}}break;
 case 'swap':if(alive(f)){const blocked=(who,p)=>(g.obstacles||[]).some(b=>Math.hypot(p.x-b.x,p.y-b.y)<(who.r||17)+b.r+2);if(!blocked(o,f)&&!blocked(f,o)){[o.x,f.x]=[f.x,o.x];[o.y,f.y]=[f.y,o.y];}}break;
 case 'ring':visual(g,o,null,'ring',+a[1]);if(alive(f)&&Math.hypot(f.x-o.x,f.y-o.y)<=+a[1]+(f.r||17))damage(g,o,f,n);break;
 case 'line':if(alive(f)){const dx=f.x-o.x,dy=f.y-o.y,len=Math.hypot(dx,dy)||1;const aimX=f.x+(f.vx||0)*12,aimY=f.y+(f.vy||0)*12;const ax=aimX-o.x,ay=aimY-o.y,al=Math.hypot(ax,ay)||1;state(g).beams.push({x:o.x,y:o.y,x2:clamp(o.x+ax/al*480,0,360),y2:clamp(o.y+ay/al*480,0,360),color:o.b.c,life:.35,max:.35,id:o.b.id});const side=Math.abs(dx*ay-dy*ax)/al;if(side<+a[1]/2+(f.r||17)&&len<450)damage(g,o,f,n);}break;
 case 'shots':shot(g,o,f,a);break;
 case 'cross':for(let j=0;j<4;j++)shot(g,o,f,[1,n,+a[1],0,0,1],j*Math.PI/2);break;
 case 'field':{const at=a[4]==='foe'?f:a[4]==='mid'?{x:180,y:180}:o;if(at)hazard(g,o,a[0],at.x,at.y,+a[1],+a[2],+a[3]);break;}
 case 'delay':delay(g,o,f,n,+a[1],+a[2]);break;
 case 'orbit':o.axeOrbit={life:clamp(+a[2],.5,3.5),angle:0,radius:clamp(+a[1],28,65),blades:clamp(n,2,6),nextHit:{},color:o.b.c};visual(g,o,null,'orbit',+a[1]);break;
 case 'mines':for(let j=0;j<n;j++){const angle=j*2*Math.PI/n;hazard(g,o,'mine',o.x+Math.cos(angle)*55,o.y+Math.sin(angle)*55,+a[1],+a[2],+a[3]);}break;
 case 'grid':for(let x=0;x<n;x++)for(let y=0;y<n;y++)hazard(g,o,'shock',(x+.5)*360/n,(y+.5)*360/n,28,2,+a[1]);break;
 case 'meteors':if(f)for(let j=0;j<n;j++){const angle=j*2*Math.PI/n;delay(g,o,f,.55+j*+a[3],+a[1],+a[2],{x:clamp(f.x+Math.cos(angle)*22,20,340),y:clamp(f.y+Math.sin(angle)*22,20,340)});}break;
 case 'erase':{const shots=state(g).shots;let left=n;for(const shot of shots)if(shot.team!==o.team&&left>0){shot.life=0;left--;}break;}
 case 'execute':if(alive(f))damage(g,o,f,n*(.45+.55*(1-clamp(f.hp/f.mh,0,1))));break;
 case 'equalize':if(alive(f))o.hp=Math.min(o.mh,o.hp+clamp((f.hp/f.mh-o.hp/o.mh)*o.mh,0,n));break;
 case 'cycle':{s.cycle=(s.cycle+1)%3;if(s.cycle===0)run(g,o,f,commands('shield:'+n));else if(s.cycle===1)run(g,o,f,commands('burn:'+Math.min(1,n*.2)));else run(g,o,f,commands('slow:'+Math.min(1.2,n*.2)));break;}
 case 'roll':{const random=window.BVBRework?.random?.(g)??.5;const result=clamp(Math.floor(random*4),0,3);run(g,o,f,commands(['hit:'+n,'heal:'+n,'shield:'+n,'poison:'+Math.min(1.5,n*.25)][result]));break;}
 default:throw new Error('Unknown identity action '+kind);
 }
 }
}
function trigger(g,o,f,event){if(!host(g)||!o.identity||processing||!alive(o))return;const p=catalog[o.identity.id].passive;if(p.event!==event||o.identity.age+1e-9<o.identity.readyAt||!condition(o,f,p.condition))return;o.identity.readyAt=o.identity.age+Math.max(.12,p.cooldown);run(g,o,f,p.actions);}
function contact(g,o,f,base){if(!host(g)||!o.identity)return base;o.identity.contacts++;trigger(g,o,f,'contact');const bonus=clamp(o.identity.charge,0,10);o.identity.charge=0;return Math.max(0,base)+bonus;}
function abilityDamage(g,o,f,base){return base;}
function onActive(g,o,f){if(!host(g)||!o.identity)return;o.identity.actives++;trigger(g,o,f,'active');}
function onWall(g,o){if(!host(g)||!o.identity)return;o.identity.wallCount++;trigger(g,o,foeOf(g,o),'wall');}
function beforeDamage(g,o,raw){if(!host(g)||!o.identity||!Number.isFinite(raw)||raw<=0)return raw;const s=o.identity;trigger(g,o,foeOf(g,o),'damage');let amount=raw;if(s.protectTime>0)amount*=1-s.protect;if(s.evadeTime>0&&s.evade>0){const absorbed=Math.min(amount,s.evade);amount-=absorbed;s.evade-=absorbed;}if(s.reflectTime>0&&s.reflect>0&&!processing){const f=foeOf(g,o);const back=Math.min(3,amount*s.reflect);if(back>0&&f){s.jobs.push({left:.001,damage:back,radius:500,x:f.x,y:f.y});if(s.jobs.length>12)s.jobs.shift();}}return Math.max(0,amount);}
function tick(g,o,f,dt){
 if(!host(g)||!alive(o)||!Number.isFinite(dt)||dt<=0)return;
 if(o.identityWound>0){const duration=Math.min(dt,o.identityWound);o.identityWound=Math.max(0,o.identityWound-dt);const wasProcessing=processing;processing=true;try{applyDamage(o,duration*1.5);}finally{processing=wasProcessing;}}
 if(!o.identity)return;
 const s=o.identity;s.age+=dt;const hadHaste=s.hasteTime>0;
 for(const field of ['protectTime','reflectTime','evadeTime','hasteTime'])s[field]=Math.max(0,s[field]-dt);
 if(hadHaste&&s.hasteTime===0){const speed=Math.hypot(o.vx,o.vy)||1;const restored=s.hasteBase||1;o.vx=o.vx/speed*restored;o.vy=o.vy/speed*restored;}
 if(s.hasteTime>0&&!(o.status.stun>0)){const speed=Math.hypot(o.vx,o.vy)||1;const target=Math.min(1.5,Math.max(speed,s.haste));o.vx=o.vx/speed*target;o.vy=o.vy/speed*target;}

 const jobs=s.jobs;s.jobs=[];
 for(const job of jobs){job.left-=dt;if(job.left>0){s.jobs.push(job);continue;}visual(g,o,null,'ring',Math.min(150,job.radius),job);if(alive(f)&&Math.hypot(f.x-job.x,f.y-job.y)<=job.radius+(f.r||17))damage(g,o,f,job.damage);}
 trigger(g,o,f,'tick');
}
function castSuper(g,o,f){
 if(!host(g)||!o.identity||!alive(o)||!alive(f)||o.status.stun>0||o.superCharge<100||(o.superUsed||0)>=2)return false;
 const data=catalog[o.identity.id];run(g,o,f,data.super.actions);o.superUsed=(o.superUsed||0)+1;o.superCharge=0;visual(g,o,data.super.name,'orbit',55);window.BVBRework?.trace?.(g,'SUPER',{team:o.team,id:o.b.id,name:data.super.name});return true;
}
window.BVBIdentities={catalog,get,describe,prepare,contact,beforeDamage,abilityDamage,onActive,onWall,tick,castSuper};
})();

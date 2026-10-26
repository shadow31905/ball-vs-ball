# Ball VS Ball 2.0 — weryfikacja kulek i ewolucji

Ta lista śledzi **rzeczywiście sprawdzone mechaniki**, nie tylko istnienie opisów lub animacji. Repozytorium zawiera implementację dla 130 kulek, ale nie wolno z tego wnioskować, że 130/130 mechanik ma już pełną ręczną akceptację.

## Partie 01–02: kulki 0–15 (16/130 objętych testami mechanicznymi)

Testy z kodem gry: `tests/ability-audit-01-08.test.cjs` i `tests/ability-audit-09-16.test.cjs`. Uruchomienie obu wraz z regresją: `node --test tests/*.test.cjs`.

| ID | Kulka/zdolność | Co jest sprawdzane w prawdziwej symulacji |
| --- | --- | --- |
| 0 | Szarża | Przyspieszenie, realny ładunek kolejnego kontaktu, narastanie V1–V3 |
| 1 | Topór | Wirujące ostrza naprawdę trafiają, rosną w liczbie i wygasają |
| 2 | Kolec | Odbicie tworzy strefę obrażeń i zatrucia, V2–V3 zmieniają obszar |
| 3 | Złodziej | Niskie HP przyspiesza realne pociski, V2–V3 zwiększają liczbę |
| 4 | Żywe Ostrza | Kolejne aktywacje tworzą więcej trafiających ostrzy, limit liczby |
| 5 | Robot | Salwa trafia cel, V1–V3 zwiększają liczbę pocisków |
| 6 | Pająk | Dwie różne ściany łączą pajęczynę, przekroczenie zadaje obrażenia; V3 zatruwa |
| 7 | Wampir | Trafienie wysysa HP i leczy; wyższa ewolucja ma większy zasięg |
| 8 | Włócznia | Po aktywacji przy kontakcie faktycznie odpycha rywala, tylko raz; V2/V3 mocniej |
| 9 | Energetyczna szarża | Fala zadaje obrażenia/odpycha w faktycznym promieniu, rosnącym V2/V3 |
| 10 | Szachy | Kierunkowy ruch i atak; ewolucje dodają prawdziwe pociski |
| 11 | Kostka | Wszystkie sześć wyników daje rzeczywisty efekt, poprawiony opis |
| 12 | Lód | Pociski zadają obrażenia i spowalniają, V2–V3 rozszerzają salwę |
| 13 | Laser ścienny | Odbicie tworzy wiązkę trafiającą przeciwnika, rośnie szerokość |
| 14 | Wężowy ogon | Ślad rani i zatruwa oraz wygasa; V2–V3 go wydłużają |
| 15 | Hak | Rzeczywiste przyciągnięcie, obrażenia, spowolnienie i wzrost mocy |

**Aktualny status:** testy pierwszych 16 mechanik zostały dodane do gałęzi reworku. Ich końcowe potwierdzenie zależy od zielonego CI najnowszego commita. To nie jest jeszcze pełna akceptacja opisów i zachowań całej szesnastki w każdej kombinacji.

### Wykryte i poprawione rozbieżności
- Kulka 8: aktywacja dawała doskok, ale nie miała osobnego, jednorazowego odrzutu opisanego w zdolności; dodano prawdziwy efekt kontaktowy.
- Kulka 9: animacja szarży nie realizowała opisanej fali; dodano obszar trafień i odrzut powiększany przez ewolucję.
- Kulka 11: opis błędnie sugerował, że każdy wynik kostki jest strefą; skorygowano go do sześciu rzeczywistych efektów.

### Pozostałe prace
- Kulki **16–129 (114 kulek)** — analogiczny audyt zdolności aktywnych, pasywek, superów i V1/V2/V3.
- Kontrola zgodności opisów kolekcji, treningu, wyboru przed walką i rzeczywistych efektów.
- Dodatkowe testy czasów odnowienia, wielokrotnych trafień, statusów, przeszkód, zgonu w trakcie efektów i starszych powtórek.
- Próby ręczne na urządzeniach mobilnych i test odbioru zgodności obu stron publicznego 1v1.

Nie przywracać usuniętego obowiązku **pełnego balansu** jako bramki wydania. Audyt poprawności zdolności nie jest bilansem siły wszystkich możliwych starć.


## Partie 03–16: nowe reworki ewolucji kulek 16–129 (114 dodatkowych profili)

**Zmiana w kodzie:** `bvb-abilities-v2.js` zawiera teraz 114 jawnych, indywidualnie przypisanych profili. Każda z poniższych kulek zachowuje swoją dotychczasową bazową zdolność V1; V2 dodaje nowy efekt opisany w tabeli, a V3 **zachowuje i wzmacnia efekt V2 oraz dodaje kolejny efekt**. Te efekty działają na poziomie symulacji: przez prawdziwe pociski, pola kolizji, tarcze, leczenie, przyciąganie, osłabianie i statusy. Funkcje zmiany V1/V2/V3 są dostępne w treningu i panelu testowym wewnętrznej bety.

**Weryfikacja:** `tests/authored-evolutions.test.cjs` sprawdza 342 wywołania umiejętności przy identycznych statystykach bazowych, odrębność sąsiednich poziomów, prawidłowe opisy oraz ograniczenia wartości/ilości obiektów. Prawdziwe kolizje i statusy przykładowych zdolności badają wcześniejsze testy. **Nie oznacza to jeszcze pełnego manualnego audytu każdego trafienia i każdej pasywki/superumiejętności wszystkich 130 kulek** — dalsze testy w realnych walkach są potrzebne.

| ID | Umiejętność | V2 — dodatkowa mechanika | V3 — dodana mechanika (zachowuje V2) |
| --- | --- | --- | --- |
| 16 | Kuźnia Pomocnika | pomocnik-kuźnia rozgrzewa się przy odbiciach i przyspiesza strzały | nagromadzone ciepło daje tarczę i pola elektryczne |
| 17 | Podział Komórki | pączkowanie regeneruje cyklicznie HP i pozostawia szlam | awaryjna mitoza tworzy silniejsze nowe ciało oraz tarczę |
| 18 | Impuls Elektryczny | przewodnik gromadzi ładunek, który ogłusza przy kontakcie | przeciążenie rozdziela się na pułapkę elektrostatyczną |
| 19 | Strefa Nacisku | poruszająca się ze Strefą aura regularnie uderza i spowalnia | wir grawitacji przyciąga do aury i wzmacnia impuls |
| 20 | Promień Namierzający | przewidujący ruch laser przebija przeszkody | opóźniony drugi promień pozostawia własny ślad i uderzenie |
| 21 | Siatka WDC | środkowy węzeł cyfrowej siatki zyskuje narastający impuls | matryca zmienia wzór i zostawia cztery uzbrajane węzły |
| 22 | Złote Jabłko | sad cyklicznie zbiera lecznicze owoce i wysyła nowy pocisk | złote jabłka zwiększają zbiory i zapewniają tarczę |
| 23 | Armata Ścienna | ładunek baterii wzmacnia wieżyczkę przy odbiciach i dodaje pocisk | rykoszetujący pocisk zostawia uzbrajany wybuch |
| 24 | Infekcja Wirusa | kontakt przenosi wirusa, który po inkubacji zadaje okresowe obrażenia | mutacja rozwija toksyczną chmurę w miejscu zakażonego przeciwnika |
| 25 | Kolczasta Ściana | po odbiciu tworzy dodatkowe kolce wzdłuż faktycznie trafionej ściany | dłuższa kolczasta warownia, tarcza i kontaktowy odrzut |
| 26 | Rykoszet Strzały | leci dalej dzięki większej liczbie rzeczywistych rykoszetów | przy pierwszym odbiciu dzieli się na kolejne pociski |
| 27 | Korona Błyskawic | trafiona ściana otrzymuje dwa dodatkowe piorunowe węzły | cztery węzły i opóźniony wystrzał błyskawicy |
| 28 | Rosnący Zasięg | rosnące pierścienie oddzielnie trafiają coraz dalsze cele | powracająca fala ściąga cel do centrum |
| 29 | Ślad Szronu | podczas ruchu zostawia strefy mrozu w odwiedzanych miejscach | lodowy tor o silniejszym spowolnieniu i krótkim porażeniu |
| 30 | Żelazny Harpun | utrzymuje kotwicę i wielokrotnie przyciąga przypiętego rywala | mocniejsze szarpnięcie końcowe z ogłuszeniem |
| 31 | Rój Obrońców | ul przechwytuje wrogie pociski i cyklicznie wysyła obrońców | królowa zapewnia tarczę, więcej przechwyceń i dodatkowy rój |
| 32 | Alchemiczny Rzut | reagenty tworzą rzeczywisty katalizator zależny od losowego eliksiru | mieszanka reaguje dodatkowym opóźnionym impulsem |
| 33 | Widmowy Pociąg | jadący pociąg zostawia na arenie uszkadzające tory | widmowy ekspres przejeżdża drugą trasą |
| 34 | Czarna Pajęczyna | odbicia o przeciwległe ściany napinają dodatkową nić | pajęczyna zamienia się w zatrutą kratownicę |
| 35 | Grób Cieni | uzbrojony grób nakłada na ofiarę okresowe nawiedzenie | nawiedzenie zostawia dodatkowe groby |
| 36 | Lot Światła | szarża zostawia uderzający powidok światła | echo powraca trasą lotu i odrzuca rywala |
| 37 | Cukierkowa Burza | pociski losują smak i odpowiedni efekt statusu | cukierki krystalizują się w dodatkową eksplozję |
| 38 | Żywy Szlam | ruch kulki tworzy lepkie rozrastające się pąki | pąki dzielą się na odrębne trujące kałuże |
| 39 | Łańcuch Kajdan | uzbrojona mina zakłada okresowo przyciągające kajdany | łańcuch wraca silniejszym szarpnięciem i ogłuszeniem |
| 40 | Żrąca Kałuża | kontakt z kwaśną kałużą nakłada narastającą korozję | trafienie powoduje przelanie się kwasu do kolejnej kałuży |
| 41 | Świetlne Soczewki | odbicie uruchamia dodatkową ukośną wiązkę | dwie wiązki przecinają się nad areną |
| 42 | Trująca Mgła | trująca chmura przemieszcza się podczas walki | gaz skrapla się w nowym aktywnym obłoku |
| 43 | Trzy Gwiazdy | gwiazdy krążą i po chwili odpalają salwę | rykoszetujące gwiazdy zostawiają elektryczne ślady |
| 44 | Ciąg Fibonacciego | kolejne trafienia rozwijają bonus z ciągu Fibonacciego | co trzecie trafienie uwalnia spiralny impuls |
| 45 | Naturalny Pancerz | kontakt aktywuje kolczasty kontratak | żywy pancerz wysyła odłamki i przyznaje osłonę |
| 46 | Opóźniony Wybuch | odliczający ładunek wywołuje realny impuls | detonacja rozdziela się na kolejne uzbrojone miny |
| 47 | Orbita Satelitów | krążące satelity okresowo ostrzeliwują przeciwnika | satelity przechwytują pociski i wzmacniają tarczę |
| 48 | Błysk Medyka | oczyszczenie z osłabień i tarcza | dodatkowa regeneracja zdrowia |
| 49 | Promień Prawdy | pocisk przenikający przez przeszkody | krótkie porażenie przeciwnika |
| 50 | Pęknięcie Szkła | rozproszona salwa wielu pocisków | mroźne pole spowalniające |
| 51 | Przeskok Portalu | widmowy pocisk omijający przeszkody | dodatkowa osłona wokół kulki |
| 52 | Kryształowa Tarcza | oczyszczenie z osłabień i tarcza | tarcza odwetowa na czas walki |
| 53 | Kaprys Magika | samocelująca elektryczna iskra | dodatkowa regeneracja zdrowia |
| 54 | Pętla Chronosa | pole spowolnienia przy przeciwniku | krótkie porażenie przeciwnika |
| 55 | Skok Ninja | widmowy pocisk omijający przeszkody | krótkie porażenie przeciwnika |
| 56 | Salwa Korsarza | dodatkowy odbijający się pocisk | pole spowolnienia przy przeciwniku |
| 57 | Kopalniany Ładunek | opóźniona mina na arenie | dodatkowa osłona wokół kulki |
| 58 | Lasso Szeryfa | silniejsze przyciągnięcie przeciwnika | krótkie porażenie przeciwnika |
| 59 | Rzeka Magmy | płonący obszar trafień | płomienna fala podpalająca |
| 60 | Strumień Plazmy | elektryczne pole rażące przeciwnika | samocelująca elektryczna iskra |
| 61 | Deszcz Meteorów | płonący obszar trafień | wachlarz płonących pocisków |
| 62 | Wir Cyklonu | rozszerzona fala z odrzutem | pole spowolnienia przy przeciwniku |
| 63 | Pryzmat Barw | rozproszona salwa wielu pocisków | samocelująca elektryczna iskra |
| 64 | Powtórka Echa | opóźnione kolejne impulsy | rozszerzona fala z odrzutem |
| 65 | Studnia Grawitacji | silniejsze przyciągnięcie przeciwnika | pole spowolnienia przy przeciwniku |
| 66 | Ciężar Kotwicy | pole spowolnienia przy przeciwniku | silniejsze przyciągnięcie przeciwnika |
| 67 | Odbicie Lustra | tarcza odwetowa na czas walki | samocelująca elektryczna iskra |
| 68 | Sfera Pustki | dodatkowe wysysanie życia | widmowy pocisk omijający przeszkody |
| 69 | Korona Słońca | płomienna fala podpalająca | dodatkowa osłona wokół kulki |
| 70 | Sierp Księżyca | dodatkowy odbijający się pocisk | pole spowolnienia przy przeciwniku |
| 71 | Cień Zaćmienia | czasowe osłabienie siły ataku | dodatkowa osłona wokół kulki |
| 72 | Narodziny Supernowej | płomienna fala podpalająca | rozszerzona fala z odrzutem |
| 73 | Obłok Mgławicy | pole spowolnienia przy przeciwniku | zatruty pocisk szukający celu |
| 74 | Puls Pulsara | opóźnione kolejne impulsy | samocelująca elektryczna iskra |
| 75 | Strumień Kwazara | pocisk przenikający przez przeszkody | fala uderzeniowa |
| 76 | Ogon Komety | płomienna fala podpalająca | płonący obszar trafień |
| 77 | Odłamki Asteroidy | rozproszona salwa wielu pocisków | opóźniona mina na arenie |
| 78 | Skok Kwantowy | widmowy pocisk omijający przeszkody | oczyszczenie z osłabień i tarcza |
| 79 | Orbitalne Powłoki | dodatkowa osłona wokół kulki | tarcza odwetowa na czas walki |
| 80 | Impuls Protonu | rozszerzona fala z odrzutem | samocelująca elektryczna iskra |
| 81 | Osłona Neutronu | oczyszczenie z osłabień i tarcza | dodatkowa osłona wokół kulki |
| 82 | Ślad Elektronu | elektryczne pole rażące przeciwnika | samocelująca elektryczna iskra |
| 83 | Dwie Iskry | samocelująca elektryczna iskra | elektryczne pole rażące przeciwnika |
| 84 | Pierścień Piekła | płomienna fala podpalająca | płonący obszar trafień |
| 85 | Fala Tsunami | pole spowolnienia przy przeciwniku | rozszerzona fala z odrzutem |
| 86 | Wstrząs Ziemi | opóźniona mina na arenie | krótkie porażenie przeciwnika |
| 87 | Nawałnica Piorunów | samocelująca elektryczna iskra | elektryczne pole rażące przeciwnika |
| 88 | Zamieć Kryształów | mroźne pole spowalniające | lodowy pocisk spowalniający |
| 89 | Miraż | dezorientacja i osłabienie ruchu rywala | widmowy pocisk omijający przeszkody |
| 90 | Ślad Widma | widmowy pocisk omijający przeszkody | czasowe osłabienie siły ataku |
| 91 | Przeskok Upiora | dezorientacja i osłabienie ruchu rywala | widmowy pocisk omijający przeszkody |
| 92 | Zimna Zjawa | pole spowolnienia przy przeciwniku | dodatkowe wysysanie życia |
| 93 | Sierp Kosiarza | silniejsze przyciągnięcie przeciwnika | widmowy pocisk omijający przeszkody |
| 94 | Znak Zagłady | czasowe osłabienie siły ataku | opóźniona mina na arenie |
| 95 | Chaos Równowagi | płomienna fala podpalająca | lodowy pocisk spowalniający |
| 96 | Pieczęć Porządku | oczyszczenie z osłabień i tarcza | dodatkowa osłona wokół kulki |
| 97 | Odrodzenie Feniksa | dodatkowa regeneracja zdrowia | płonący obszar trafień |
| 98 | Macki Krakena | silniejsze przyciągnięcie przeciwnika | pole spowolnienia przy przeciwniku |
| 99 | Korona Dyni | płomienna fala podpalająca | płonący obszar trafień |
| 100 | Zaklęcie Wiedźmy | toksyczna strefa z obrażeniami | dodatkowa regeneracja zdrowia |
| 101 | Dym Kotła | pole spowolnienia przy przeciwniku | czasowe osłabienie siły ataku |
| 102 | Skok Czarnego Kota | dezorientacja i osłabienie ruchu rywala | dodatkowa osłona wokół kulki |
| 103 | Lot Nietoperzy | widmowy pocisk omijający przeszkody | zatruty pocisk szukający celu |
| 104 | Upór Zombie | dodatkowa regeneracja zdrowia | pole spowolnienia przy przeciwniku |
| 105 | Klątwa Voodoo | czasowe osłabienie siły ataku | opóźniona mina na arenie |
| 106 | Strach na Wróble | dezorientacja i osłabienie ruchu rywala | opóźniona mina na arenie |
| 107 | Taniec Ogników | samocelująca elektryczna iskra | wachlarz płonących pocisków |
| 108 | Zew Wilkołaka | rozszerzona fala z odrzutem | dodatkowa osłona wokół kulki |
| 109 | Krzyk Banshee | rozszerzona fala z odrzutem | krótkie porażenie przeciwnika |
| 110 | Kamienny Pancerz | dodatkowa osłona wokół kulki | tarcza odwetowa na czas walki |
| 111 | Krwawy Księżyc | czasowe osłabienie siły ataku | zatruty pocisk szukający celu |
| 112 | Duch Latarni | płomienna fala podpalająca | płonący obszar trafień |
| 113 | Bandaże Mumii | oczyszczenie z osłabień i tarcza | dodatkowa osłona wokół kulki |
| 114 | Lot Gargulca | dodatkowa osłona wokół kulki | rozszerzona fala z odrzutem |
| 115 | Widmowy Pomocnik | widmowy pocisk omijający przeszkody | dodatkowa osłona wokół kulki |
| 116 | Przeklęte Odbicie | tarcza odwetowa na czas walki | czasowe osłabienie siły ataku |
| 117 | Sieć Wdowy | pole spowolnienia przy przeciwniku | toksyczna strefa z obrażeniami |
| 118 | Pęd Bez Głowy | widmowy pocisk omijający przeszkody | rozszerzona fala z odrzutem |
| 119 | Żniwa Dusz | dodatkowe wysysanie życia | czasowe osłabienie siły ataku |
| 120 | Dzwon Północy | opóźnione kolejne impulsy | rozszerzona fala z odrzutem |
| 121 | Lodowy Dotyk Upiora | mroźne pole spowalniające | widmowy pocisk omijający przeszkody |
| 122 | Kruki Królowej | widmowy pocisk omijający przeszkody | czasowe osłabienie siły ataku |
| 123 | Zgniły Opar | toksyczna strefa z obrażeniami | zatruty pocisk szukający celu |
| 124 | Widmowa Zbroja | dodatkowa osłona wokół kulki | tarcza odwetowa na czas walki |
| 125 | Cukierkowy Koszmar | rozproszona salwa wielu pocisków | pole spowolnienia przy przeciwniku |
| 126 | Nocny Lot | widmowy pocisk omijający przeszkody | dodatkowa osłona wokół kulki |
| 127 | Grobowa Mikstura | oczyszczenie z osłabień i tarcza | toksyczna strefa z obrażeniami |
| 128 | Sznurki Marionetki | silniejsze przyciągnięcie przeciwnika | krótkie porażenie przeciwnika |
| 129 | Kryształ Zaświatów | mroźne pole spowalniające | rozproszona salwa wielu pocisków |

### Co pozostaje do ręcznego odbioru

- Przejście testów CI dla commita z 114 profilami V2/V3 we wszystkich przeglądarkach (Chromium, Firefox, WebKit).
- Rzeczywiste trafienia, wszystkie pasywki i superumiejętności, statusy, przeciwdziałania, czas odnowienia i wygasanie w długich walkach każdej kulki.
- Widoczność osobnych ulepszeń V2/V3 przy różnych ustawieniach efektów, w tym zmniejszonych animacjach, i poprawność replayów/multiplayera.
- Testy na fizycznym Androidzie i iPhonie oraz publiczna synchronizacja 1v1, TURN i konta/chmura.


### Indywidualne reworki mechanik, partia ID 16–23

Poprzednie profile tych ośmiu kulek opierały się na przypisaniu gotowych efektów. Zastąpiono je **osobnymi automatami stanów i wyzwalaczami związanymi z pierwotnymi zdolnościami**: rozgrzewanie pomocnika przy ścianie, pączkowanie i wtórna mitoza, przechowywanie ładunku do kontaktu, ruchome pole ciśnienia, drugi promień, przełączanie siatki WDC, okresowe zbiory sadu oraz ładowanie wieżyczki. Efekty są rozliczane podczas autorytatywnej symulacji i zapisywane w stanie powtórki. Podglądy V2/V3 mają charakterystyczne diagramy zamiast wspólnego pierścienia.

Testy: `tests/identity-rework-16-23.test.cjs` sprawdzają osiem mechanik po odbiciu, kolizji, cyklu lub odrodzeniu, a `tests/combat-browser-smoke.cjs` weryfikuje opisy i rysowanie. Naprawiono przy okazji podwójne trafienie dla stref `slow`.

**Pozostałe 82 kulki ID 48–129 nadal mają profile V2/V3 bazujące na kombinacjach wspólnych efektów.** Nie oznaczać ich jako ukończonych indywidualnych reworków — potrzebują osobnych mechanik powiązanych z każdą kulką.

### Indywidualny rework ID 24–31 i wyniki testów

Kolejne osiem kulek otrzymało osobne mechaniki wyzwalane **zakażeniem przy kontakcie, odbiciem od ścian, rozdzieleniem pocisku po rykoszecie, opóźnionym wyładowaniem, kolejnymi falami, rzeczywistym przemieszczaniem się po arenie, utrzymanym hakiem i przechwytywaniem wrogich pocisków**. Każda ma dwa odróżnialne poziomy V2/V3 i osobny podgląd. Testy: `tests/identity-rework-24-31.test.cjs` i dodatkowo obrazy podglądów wszystkich 8 kulek w `tests/combat-browser-smoke.cjs`. W pierwszych testach wykryto trzy błędne asercje chwilowego stanu; poprawiono je i wprowadzono liczniki faktycznych zdarzeń. WebKit ujawnił założenie testu przycisku kamery — też poprawione.

**Postęp indywidualnych reworków:** 32 z 130 kulek z własnymi mechanikami, **98 do dalszej przebudowy**. Testy rzeczywistych sieci i telefonów wciąż nie są zakończone.

### Indywidualny rework ID 32–47 — szesnaście kulek

Rozbudowano każdą z szesnastu kulek o **oryginalny emblemat SVG**, osobny szkic jej podstawowej zdolności V1 i unikalne podglądy V2/V3. Nowe mechaniki obejmują m.in. katalizatory alchemiczne, szkodliwe tory, sieć na ścianach, klątwy min, świetlne echa, zróżnicowane cukierki, pączkujący szlam, żywe kajdany, korozję, laserowe soczewki, wędrujący gaz, gwiazdy, serię Fibonacciego, odwet pancerza, wielostopniową bombę i satelity. To rzeczywiste obiekty, statusy, kolizje i opóźnione efekty, nie samo zwiększenie obrażeń.

Testy: `tests/identity-rework-32-47.test.cjs` (16 scenariuszy V2/V3), `tests/identity-v1-32-47.test.cjs` (każda zdolność V1 w stanie silnika), `tests/ball-art-32-47.test.cjs` (unikalny SVG) i ekranowe porównania V1/V2/V3 w Chromium, Firefox, WebKit. Pełny przebieg [40385626598](https://github.com/shadow31905/ball-vs-ball/actions/runs/40385626598) ma wszystkie cztery zadania **PASS** dla commita `49ab497f`.

**Postęp: 48/130 kulek (36,9%) z indywidualnym reworkiem, pozostało 82 (ID 48–129).** Nadal konieczny fizyczny odbiór telefonu i sieci przed publikacją.

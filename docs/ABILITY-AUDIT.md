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
| 24 | Infekcja Wirusa | zatruty pocisk szukający celu | toksyczna strefa z obrażeniami |
| 25 | Kolczasta Ściana | kolczasta pułapka przy przeciwniku | zatruty pocisk szukający celu |
| 26 | Rykoszet Strzały | dodatkowy odbijający się pocisk | rozproszona salwa wielu pocisków |
| 27 | Korona Błyskawic | elektryczne pole rażące przeciwnika | samocelująca elektryczna iskra |
| 28 | Rosnący Zasięg | rozszerzona fala z odrzutem | opóźnione kolejne impulsy |
| 29 | Ślad Szronu | mroźne pole spowalniające | lodowy pocisk spowalniający |
| 30 | Żelazny Harpun | silniejsze przyciągnięcie przeciwnika | krótkie porażenie przeciwnika |
| 31 | Rój Obrońców | toksyczna strefa z obrażeniami | zatruty pocisk szukający celu |
| 32 | Alchemiczny Rzut | oczyszczenie z osłabień i tarcza | rozproszona salwa wielu pocisków |
| 33 | Widmowy Pociąg | fala uderzeniowa | opóźniona mina na arenie |
| 34 | Czarna Pajęczyna | pole spowolnienia przy przeciwniku | toksyczna strefa z obrażeniami |
| 35 | Grób Cieni | czasowe osłabienie siły ataku | opóźniona mina na arenie |
| 36 | Lot Światła | dodatkowa osłona wokół kulki | rozszerzona fala z odrzutem |
| 37 | Cukierkowa Burza | lodowy pocisk spowalniający | dezorientacja i osłabienie ruchu rywala |
| 38 | Żywy Szlam | pole spowolnienia przy przeciwniku | dodatkowa regeneracja zdrowia |
| 39 | Łańcuch Kajdan | krótkie porażenie przeciwnika | opóźniona mina na arenie |
| 40 | Żrąca Kałuża | czasowe osłabienie siły ataku | toksyczna strefa z obrażeniami |
| 41 | Świetlne Soczewki | dodatkowy odbijający się pocisk | pocisk przenikający przez przeszkody |
| 42 | Trująca Mgła | toksyczna strefa z obrażeniami | pole spowolnienia przy przeciwniku |
| 43 | Trzy Gwiazdy | rozproszona salwa wielu pocisków | dodatkowy odbijający się pocisk |
| 44 | Ciąg Fibonacciego | rozszerzona fala z odrzutem | dodatkowa osłona wokół kulki |
| 45 | Naturalny Pancerz | tarcza odwetowa na czas walki | kolczasta pułapka przy przeciwniku |
| 46 | Opóźniony Wybuch | opóźniona mina na arenie | płomienna fala podpalająca |
| 47 | Orbita Satelitów | dodatkowa osłona wokół kulki | samocelująca elektryczna iskra |
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

**Pozostałe 106 kulek ID 24–129 mają profile V2/V3, ale nadal bazują na kombinacjach wspólnych efektów.** Nie oznaczać ich jako ukończonych indywidualnych reworków — potrzebują osobnych mechanik powiązanych z każdą kulką.

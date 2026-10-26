# Ball VS Ball 2.0 — QA indywidualnego reworku ID 32–47

**Data:** 26.10.2026. **Zakres:** szesnaście kulek 32–47 (jedna partia w granicach zamówionych 16–24). **Gałąź:** `rework/combat-3-foundation`, PR #1. Bez zmian w stabilnym `main` i bez publicznego wdrożenia bety.

## Dla każdej kulki wykonano

1. **Nowy wygląd:** szesnaście indywidualnie narysowanych emblematów SVG na zachowanym modelu kulki (nie tylko inny odcień wspólnego obrazka).
2. **V1:** odrębna ilustracja początkowej umiejętności w podglądzie (związana z istniejącym działaniem V1); niezależny test `tests/identity-v1-32-47.test.cjs` potwierdza rzeczywisty efekt w stanie walki.
3. **V2:** indywidualne mechaniki aktywujące się na odpowiednie zdarzenia, takie jak odbicie, kontakt, ruch, upływ czasu lub wystrzał.
4. **V3:** rozwinięcie V2 z osobną mechaniką, nie tylko przyspieszenie lub wzmocnienie statystyk.
5. **Testy:** `tests/identity-rework-32-47.test.cjs` sprawdza 16 konkretnych przebiegów V2/V3; `tests/ball-art-32-47.test.cjs` sprawdza rozróżnialność i obecność 16 emblematów; test przeglądarki `tests/combat-browser-smoke.cjs` porównuje wizualnie V1/V2/V3 dla kulek 24–47 i niezbędne interakcje.

## Mechaniki

| ID | V1 i motyw nowej grafiki | V2 | V3 |
|---|---|---|---|
| 32 | Alchemik — fiolka i eliksir | Katalizator konkretnego wylosowanego składnika | Dodatkowa odroczona reakcja chemiczna |
| 33 | Widmowy Pociąg — lokomotywa i tory | Zostawia prawdziwe szkodliwe tory | Drugie widmowe przejście pociągu |
| 34 | Czarna Pajęczyna — pajęcza sieć | Dodatkowe nici między rzeczywiście trafionymi ścianami | Zatruta kratownica złożona z osobnych nici |
| 35 | Grób Cieni — nagrobek | Mina nakłada ślad nawiedzenia na trafioną kulkę | Nawiedzenie wytwarza kolejne groby |
| 36 | Lot Światła — świetliste skrzydła | Po szarży pozostaje szkodliwy powidok | Powracająca po trasie błyskawica |
| 37 | Cukierkowa Burza — zawinięty cukierek | Pociski o indywidualnych smakach i efektach | Krystalizująca wtórna eksplozja |
| 38 | Żywy Szlam — żywa błona | Ruch powoduje narastające pączkowanie śluzu | Podział na dodatkowe samodzielne kałuże |
| 39 | Łańcuch Kajdan — połączone ogniwa | Pułapka wiąże i przyciąga przeciwnika | Drugi silniejszy powrót łańcucha |
| 40 | Żrąca Kałuża — kropla kwasu | Dotyk inicjuje postępującą korozję | Kolejna kałuża rozlewa się po trafieniu |
| 41 | Świetlne Soczewki — pryzmat | Odbicie aktywuje dodatkowy ukośny promień | Dwie krzyżujące się wiązki |
| 42 | Trująca Mgła — obłoki | Chmura przemieszcza się po arenie | Kondensuje się w dodatkowy aktywny obłok |
| 43 | Trzy Gwiazdy — trzy gwiazdy | Gwiazdy okrążają, a następnie strzelają | Rykoszet zostawia rzeczywiste elektryczne ślady |
| 44 | Ciąg Fibonacciego — złota spirala | Kolejne kontakty wzmacniają trafienie zgodnie z ciągiem | Spiralny impuls co trzecie trafienie |
| 45 | Naturalny Pancerz — kolce pancerza | Kontakt wywołuje odwet kolcami | Wyrzuca odłamki i przyznaje tarczę |
| 46 | Opóźniony Wybuch — bomba z zapalnikiem | Mina naprawdę odlicza do dodatkowego uderzenia | Wybuch pozostawia kilka dalszych ładunków |
| 47 | Orbita Satelitów — satelity na orbitach | Okrążające satelity ostrzeliwują rywala | Przechwytują wrogie pociski i osłaniają właściciela |

## Potwierdzenie testów

**[GitHub Actions 40385626598](https://github.com/shadow31905/ball-vs-ball/actions/runs/40385626598): wszystkie cztery zadania zakończone sukcesem** — `combat`, Chromium, Firefox i WebKit — dla commita `49ab497f2dc8884e63aa358333bd3278019ca29d` obejmującego mechaniki, nowe SVG, podglądy V1 i nowe testy.

Przy sprawdzaniu wcześniejszych commitów zdarzał się niestabilny test przełączania kamery w WebKit. Późniejszy, kompletny przebieg powyższego commita zakończył się jednak zielonym wynikiem. Nie zastępuje to testów fizycznego urządzenia.

**Postęp:** 48/130 kulek posiada indywidualne mechaniki V1/V2/V3 i nowe podglądy ewolucji; **82 kulki 48–129** nadal czekają na takie opracowanie.

## Co nie jest jeszcze potwierdzone

- Rzeczywisty Android Chrome i iPhone Safari podczas długich walk.
- Publiczny multiplayer 1v1 i prawdziwy TURN z dwóch sieci.
- Konto i zapisy chmurowe na rzeczywistych usługach.
- Pełny ręczny odbiór kombinacji pasywek, superów, statusów, cooldownów i wszystkich par walk.

Raport jest świadectwem testów automatycznych i wyglądu podglądów, **nie** potwierdzeniem stabilnej premiery.

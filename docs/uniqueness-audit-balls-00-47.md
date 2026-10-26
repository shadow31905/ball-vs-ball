# Audyt niepowtarzalności umiejętności — kulki ID 0–47

**Stan audytu:** wykryto powtarzające się podstawowe mechaniki; **NIE** oznaczać tych 48 kulek jako zakończonych według nowego kryterium unikalności.

**Źródła:** `bvb-abilities-v2.js` (`entries`, `cast`, `onWall`, `tick`, `applySignatureEvolution`, `applySignatureEvolution32`), `bvb-identities.js`. Oceniono rzeczywiste ścieżki V1 oraz implementację V2/V3, nie tylko etykiety ani podglądy.

## Wynik pierwszego etapu

- Wszystkie 48 mają różne nazwy zdolności, ale nazwa **nie** wystarcza.
- **32/48 kulek** współdzielą implementację podstawowego rodzaju aktywnej zdolności z co najmniej jedną inną kulką w tej grupie.
- Są to **13 rodzin współdzielonego `kind`**. Pozostałe 16 mają rodzaj bez odpowiednika w ID 0–47, co **nie dowodzi** pełnej unikalności: różne `kind` mogą prowadzić do podobnych działań.
- ID **0–15** nie mają odrębnych wpisów `authoredUpgrades`. W znacznej części V2/V3 zwiększają parametry, liczbę pocisków, czas lub zasięg; należy sprawdzić/zaprojektować rzeczywiście nowe etapy mechaniki.
- ID **16–47** mają osobne gałęzie ewolucji; one również **nie naprawiają automatycznie** powtórzeń V1. Dodatkowe mechaniki wymagają testów zachowania, kolizji i czytelności efektów.
- W repozytorium **nie zmieniono jeszcze żadnej umiejętności** w ramach tego audytu: poniżej są potwierdzone konflikty i zadania do przebudowy, a nie fałszywa deklaracja ukończenia.

## 13 rodzin powtarzających się podstawowych implementacji

| Rodzina | Kulki (ID) | Dlaczego wymaga zmiany |
| --- | --- | --- |
| `charge` | 0 Szarża, 44 Fibonacci | Ten sam aktywny kod ładowania i doskoku; Fibonacci wyróżnia się dopiero dodatkową logiką trafień. |
| `orbit` | 1 Topór, 4 Ostrze, 47 Orbita | Wspólna implementacja wirujących ostrzy; zmienia się głównie liczba/rozmiar, Orbita ma własne satelity dopiero w ewolucjach. |
| `thorn` | 2 Trujący Kolec, 25 Wielki Kolec | Obydwie tworzą standardowe kolce przy odbiciach od ścian, z tym samym typem obrażeń kolców. |
| `volley` | 3 Złodziej, 5 Karabin, 37 Pudełko Cukierków, 43 Shuriken | Ten sam silnik salwy z wariantami liczby, prędkości i spowolnienia; ewolucje 37 i 43 mają dodatkowe cechy, ale V1 jest zbyt podobne. |
| `web` | 6 Pająk, 34 Czarny Pająk | Ten sam algorytm sieci pomiędzy dwiema ścianami; czarna sieć dodatkowo zatruwa. |
| `dash` | 8 Włócznia, 9 Rozbłysk, 36 Skrzydło Światła | Wspólny doskok; 9 ma falę, 36 rozwija powidok w ewolucjach. Potrzebne odrębne sterowanie/trafianie już w V1. |
| `frost` | 12 Lodowy Stożek, 29 Mróz | Obie wystrzeliwują spowalniające odłamki lodu; Mróz zostawia także szron po odbiciach. |
| `beam` | 13 Laser, 20 Promień, 41 Promień Świetlny | Wspólny natychmiastowy promień, a 13 i 41 mają dodatkowo niemal identyczną konstrukcję laserów ściennych w V1. |
| `tether` | 15 Hak, 30 Harpun | **V1 korzysta z tej samej gałęzi** przyciągania i trafienia; Harpun otrzymuje własną kotwicę/dociąganie w V2/V3. |
| `growth` | 17 Komórka, 38 Szlam | Wspólny wzrost, leczenie i strefa szlamu; Komórka ma odrodzenie, Szlam pączkowanie w ewolucjach. |
| `grid` | 21 WDC, 27 Król Elektryków | Standardowy rzut tej samej siatki 3×3; Król ma także elektryczny ślad po ścianie. |
| `poison` | 24 Wirus, 40 Kwas | Obie rzucają ten sam rodzaj toksycznego pola; Wirus rozwija infekcję na kontakcie, Kwas korozję. |
| `mine` | 35 Grób, 39 Kajdany, 46 Bomba | Ten sam bazowy algorytm stawiania min; na V2/V3 dochodzą odpowiednio nawiedzenie, unieruchomienie, eksplozje łańcuchowe. |

**Uwaga:** wspólny system rysowania czy fizyki jest dozwolony. Problemem jest wspólny przebieg działania zdolności, którego nie zmieniają istotnie unikatowe wejścia, warunki, interakcje i skutki.

## Podobieństwa między różnymi rodzinami — do weryfikacji w testach

1. **11 Kostka i 32 Eliksir** — losowanie korzyści; trzeba odróżnić *sposób podejmowania decyzji i konsekwencje*, a nie tylko pulę efektów.
2. **19 Strefa, 40 Kwas, 42 Trujący Gaz** — obszarowe obrażenia/statusy; gas drift i corrosion pojawiają się dopiero w wyższych wersjach.
3. **26 Łuk i 43 Shuriken** — pociski z odbiciami; należy rozróżnić celowanie/odbicia, nie tylko liczbę gwiazdek czy rozszczepienie V3.
4. **16 Przekuwacz, 23 Armata, 31 Rój, 47 Orbita** — autonomiczne źródła ataków / obrona; potrzeba testów wyjątkowych interakcji, np. pet kontra wieżyczka, rój przechwytujący kontra satelity.
5. **7 Wampir, 22 Jabłko, 17 Komórka** — odzyskiwanie HP występuje we wszystkich, ale warunki wykonania są różne. Wspólny wynik „leczenie” nie oznacza sam z siebie powtórzenia mechaniki.

## Priorytety poprawek

**P0 — praktycznie takie samo V1:** (15,30), (6,34), (13,41), (2,25), (0,44), (35,39,46). Rozdzielić faktyczne reguły zdolności *od V1*.

**P1 — wspólny rdzeń i zbyt małe różnice:** (1,4,47), (3,5,37,43), (8,9,36), (12,29), (21,27), (17,38), (24,40), plus Promień (20) w rodzinie `beam`.

**P2 — podobieństwa między rodzinami:** wszystkie przypadki z poprzedniej sekcji; potwierdzić testem zachowania, nie samym porównaniem nazw i kolorów.

## Kryteria akceptacji każdej kulki

1. **V1:** oryginalny wygląd postaci i oryginalna mechanika; unikamy reskinu, samych mnożników i zamiany statusu przy tej samej akcji.
2. **V1 → test działania** w symulacji, kontra reprezentatywna „podobna” kulka, oraz zrzut/preview efektu.
3. **V2:** ulepsza rdzeń V1 przez nową interakcję albo regułę w trakcie walki (stan, warunek, reagowanie na trafienie itd.); test.
4. **V3:** mocniejszy, jakościowo nowy poziom *tej samej* umiejętności, nie przypadkowy dodatkowy pocisk; test regresji V1/V2/V3.
5. Testy węzłowe (obrażenia/HP/statusy/pozycje/hazardy/stan odtwarzania), Chromium, Firefox, WebKit i reduced motion; sprawdzenie autorstwa animacji.
6. **Dopiero po zaliczeniu trzech wersji** przechodzić do kolejnej kulki. Nie zmieniać publicznego `main` ani nie oznaczać audytowanych 48 jako „zweryfikowane unikalne”, dopóki konflikty nie znikną.

## Kolejność

Najpierw ID 0–15 i pary kolidujące z 16–47, potem osobno ID 16–31, 32–47. Jedna kulka na raz: V1 → test → V2 → test → V3 → test. Po zmianach wrócić do pełnego porównania **wszystkich 48**, żeby poprawka jednej nie stworzyła kopii drugiej.

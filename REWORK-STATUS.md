# Ball VS Ball 2.0 — status reworku systemu walki

**Gałąź:** `rework/combat-3-foundation`  
**Wersja publiczna:** `main` pozostaje niezmieniona.  
**Strategia:** osobna gałąź rozwojowa i jedna finalna publikacja po testach.  
**Uzgodnienia:** 40 decyzji projektowych, w tym jedna duża premiera na końcu. Gałąź robocza i beta są etapami testowymi, a nie finalną premierą.

## Wykonane — kod dostępny na gałęzi

- [x] Oddzielny moduł `bvb-combat-rework.js`, połączony z istniejącą pętlą.
- [x] Pancerz, zużywanie pancerza, tarcze, krytyki, słabości i odporności.
- [x] Impulsy zderzeniowe zależne od masy i rotacji.
- [x] Automatyczny ruch wszystkich walczących kulek; AI kieruje się na cel, przewiduje pozycję i omija przeszkody.
- [x] Pięć taktycznych profili AI: od prostego śledzenia po wyprzedzanie, flankowanie, uniki i krótkie planowanie kombinacji. Wycofano dodatkowe bonusy HP/obrażeń zależne od poziomu.
- [x] Reakcje ogień + spowolnienie i ogień + trucizna, ograniczenie częstotliwości.
- [x] Prototyp pasywki i superumiejętności dla każdego ID 0–129, z osobnymi konfiguracjami. **Nie są to jeszcze 130 ręcznie dopracowanych unikalnych mechanik.**
- [x] Istniejące 130 nazwanych zdolności aktywnych z `bvb-abilities-v2.js` zachowane.
- [x] Bossowie: 3 fazy, sygnalizowane ataki areny i 6 różnych typów ataku (prototypy).
- [x] Przemieszczanie przeszkód, mechanizm antyblokady.
- [x] Limit rundy 60 sekund i rozstrzygnięcie przy upływie czasu.
- [x] Automatyczny start walki po wyborze kulki w trybach solo oraz automatyczna wymiana sygnałów gotowości online.
- [x] HUD: HP, pancerz, tarcza, aktywne statusy, zegar.
- [x] Przełącznik kamery statycznej i dynamicznej.
- [x] Pauza i szybkość 0,5×/1×/2× (solo).
- [x] Nagrywanie próbek rundy, przewijanie, renderowanie pocisków, przeszkód i efektów oraz zapis trzech powtórek w przeglądarce i eksport JSON.
- [x] Statystyki ostatniej rundy na ekranie zwycięstwa.
- [x] Ustawienie lekkich efektów ograniczające liczbę cząstek.
- [x] Seedowane losowanie walki, kontrolny hash stanu i bufor diagnostyczny z eksportem błędów.
- [x] Testy Node, Chromium i emulacji dotykowych ekranów 320/375/430 px w GitHub Actions.

## Wciąż do ukończenia przed premierą

- [ ] 130 ręcznie zaprojektowanych i zbalansowanych pasywek oraz 130 superumiejętności; obecne to prototypy wykorzystujące wspólne rodziny mechanik.
- [ ] Każdy z 6 bossów: unikalny zestaw ataków dla każdej z 3 faz, osobne animacje i dopracowana walka.
- [ ] Więcej złożonych reakcji statusów, testy wszystkich odporności, kontr i limitów.
- [ ] Pełna fizyka z tarciem, kątami uderzeń, animacjami rotacji i kontrolą niestabilności.
- [ ] Dalsze testy i balans pięciu profili AI oraz zaawansowane kontry i wieloetapowe kombinacje.
- [ ] Powtórki wierne 1:1 wraz ze ścisłą odtwarzalnością dźwięku i zdarzeń. Obecne odtwarzanie to rozszerzone snapshoty, a nie pełna symulacja oparta na seedzie i zdarzeniach.
- [ ] Kinowy ekran zwycięstwa, odtworzenie ostatniej akcji i prezentacja zwycięskiej kulki.
- [ ] Rozbudowane dźwięki poszczególnych zdolności, ulepszenie muzyki, dopracowanie istniejących suwaków głośności.
- [ ] Pomiar wydajności i testy na fizycznych telefonach (istniejące adaptacyjne efekty i testy emulacji nie zastępują realnych urządzeń).
- [ ] Pełne testy przeglądarkowe i sieciowe host/gość; obecna zmiana online **nie została sprawdzona na dwóch prawdziwych klientach**.
- [ ] Tysiące automatycznych walk testowych: 130 kulek, 6 bossów, balans, czas 30–60 s, wydajność.
- [ ] Testy kampanii, turnieju, survivalu, zapisów i wszystkich pozostałych trybów.
- [ ] Finalny przegląd bezpieczeństwa zapisu stanu i regresji, dopiero potem merge do `main`.

## Kontrola jakości

Składnia i regresje są weryfikowane w GitHub Actions. Zestaw obejmuje m.in. pancerz, krytyki, RNG, sumy kontrolne, reakcje statusów, superumiejętności, pięć profili AI, bossów i timeout. Oddzielne testy Chromium sprawdzają grę w przeglądarce, a emulacja mobilna obejmuje 320/375/430 px.

`node --test tests/combat-rework.test.cjs` uruchamia zestaw regresyjny w środowisku Node; workflow CI dodany, ale jego wynik nie został jeszcze potwierdzony.

**Brak potwierdzonych testów end-to-end w przeglądarce. Nie publikować jako ukończonego reworku.**

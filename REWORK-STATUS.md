# Ball VS Ball 2.0 — status reworku systemu walki

**Gałąź:** `rework/combat-3-foundation`  
**Wersja publiczna:** `main` pozostaje niezmieniona.  
**Strategia:** osobna gałąź rozwojowa i jedna finalna publikacja po testach.  
**Uzgodnienia:** odpowiedzi na pytania 1–19; pytanie 20 o strategię wdrożenia nie miało jednoznacznej odpowiedzi, dlatego przyjęto bezpieczną osobną gałąź.

## Wykonane — kod dostępny na gałęzi

- [x] Oddzielny moduł `bvb-combat-rework.js`, połączony z istniejącą pętlą.
- [x] Pancerz, zużywanie pancerza, tarcze, krytyki, słabości i odporności.
- [x] Impulsy zderzeniowe zależne od masy i rotacji.
- [x] Automatyczny ruch wszystkich walczących kulek; AI kieruje się na cel, przewiduje pozycję i omija przeszkody.
- [x] Pięć poziomów parametrów decyzyjnych AI; wycofano dodatkowe bonusy HP/obrażeń dla zwykłego bota zależne od poziomu.
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
- [x] Nagrywanie próbek przebiegu rundy i oglądanie powtórki z przewijaniem.
- [x] Statystyki ostatniej rundy na ekranie zwycięstwa.
- [x] Ustawienie lekkich efektów ograniczające liczbę cząstek.
- [x] Plik testów `tests/combat-rework.test.cjs` i workflow GitHub Actions.

## Wciąż do ukończenia przed premierą

- [ ] 130 ręcznie zaprojektowanych i zbalansowanych pasywek oraz 130 superumiejętności; obecne to prototypy wykorzystujące wspólne rodziny mechanik.
- [ ] Każdy z 6 bossów: unikalny zestaw ataków dla każdej z 3 faz, osobne animacje i dopracowana walka.
- [ ] Więcej złożonych reakcji statusów, testy wszystkich odporności, kontr i limitów.
- [ ] Pełna fizyka z tarciem, kątami uderzeń, animacjami rotacji i kontrolą niestabilności.
- [ ] Inteligencja przeciwników: pełne profile 5 poziomów z różnymi strategiami i adaptacją, a nie tylko z różną dokładnością/siłą skrętu.
- [ ] Powtórki wierne 1:1 z VFX, areną, pociskami i dźwiękiem. Obecne powtórki to **wizualizacja zapisanych pozycji i HP**, nie pełna rekonstrukcja.
- [ ] Kinowy ekran zwycięstwa, odtworzenie ostatniej akcji i prezentacja zwycięskiej kulki.
- [ ] Rozbudowane dźwięki poszczególnych zdolności, ulepszenie muzyki, dopracowanie istniejących suwaków głośności.
- [ ] Usprawnienia mobilne i automatyczne ustawianie jakości.
- [ ] Pełne testy przeglądarkowe i sieciowe host/gość; obecna zmiana online **nie została sprawdzona na dwóch prawdziwych klientach**.
- [ ] Tysiące automatycznych walk testowych: 130 kulek, 6 bossów, balans, czas 30–60 s, wydajność.
- [ ] Testy kampanii, turnieju, survivalu, zapisów i wszystkich pozostałych trybów.
- [ ] Finalny przegląd bezpieczeństwa zapisu stanu i regresji, dopiero potem merge do `main`.

## Kontrola jakości

Składnia skryptów `index.html`, `bvb-combat-rework.js`, `bvb-combat-ui.js`, `bvb-abilities-v2.js` oraz testów została sprawdzona parserem JS. W izolowanej symulacji przeszły: pancerz, trafienia, reakcje statusów, superumiejętności, ostrzeżenia bossów i timeout.

`node --test tests/combat-rework.test.cjs` uruchamia zestaw regresyjny w środowisku Node; workflow CI dodany, ale jego wynik nie został jeszcze potwierdzony.

**Brak potwierdzonych testów end-to-end w przeglądarce. Nie publikować jako ukończonego reworku.**

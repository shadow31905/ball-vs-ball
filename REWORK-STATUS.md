# Ball VS Ball 2.0 — status wielkiego reworku walki

**Gałąź robocza:** `rework/combat-3-foundation`  
**Publikacja:** jedna duża aktualizacja po zakończeniu i testach; nie scalać częściowych zmian do `main`.  
**Decyzje projektowe:** 1–40 zaakceptowane; pytania 41–60 pozostają bez odpowiedzi.

## Zrobione na gałęzi (pierwszy fundament, nie cały rework)

- [x] Oddzielona gałąź robocza, obecna gra na `main` niezmieniona.
- [x] Osobny moduł `bvb-combat-rework.js` z integracją w pętli walki.
- [x] Tarcze jako dodatkowe HP, stopniowo zużywany pancerz i redukcja obrażeń.
- [x] Krytyczne zderzenia zależne od kulki i stałe słabości wobec rodzin ataków.
- [x] Fizyczne odbicie z uwzględnieniem masy i rotacji.
- [x] Kierowanie AI ku przeciwnikowi, wyprzedzanie ruchu i omijanie przeszkód.
- [x] AI może opóźnić użycie zdolności maksymalnie o 0,75 s.
- [x] Mechanizm antyblokady dla aktorów, którzy pozostają w miejscu.
- [x] Przesunięcia przeszkód co ok. 10–15 s; sygnalizacja zmiany areny.
- [x] Podstawowe przejścia bossów do fazy II i III (efekty i zmiana areny).
- [x] Limit 60 s i rozstrzygnięcie według procentu pozostałego HP; losowanie przy dokładnym remisie.
- [x] Automatyczny start pojedynku po wyborze kulki w trybach solo (bez ręcznej procy).
- [x] Dodane testy regresyjne `tests/combat-rework.test.cjs`.

## Nadal do wykonania — obowiązkowe przed premierą

- [ ] Pełny system AI 5 poziomów: odrębne strategie, taktyka, kontry i uczciwy balans.
- [ ] Wszystkie 130 kulek: **atak + unikalna pasywka + superumiejętność** (390 elementów, z indywidualnymi animacjami).
- [ ] Pełny system reakcji statusów, odporności, ograniczeń efektów i kontr.
- [ ] Dopasowanie fizyki, masy, pędu, tarcia i unikalnych stylów ruchu do każdej kulki.
- [ ] Kompletny rework wszystkich bossów: trzy odrębne fazy, wydarzenia i unikalny finał.
- [ ] Dynamiczne areny z dopracowanymi przeszkodami, bez nieuczciwych obrażeń.
- [ ] Automatyczna walka i poprawna synchronizacja w trybie online.
- [ ] HUD z HP, pancerzem, tarczą, statusami i czasem.
- [ ] Wybór kamery statycznej/dynamicznej.
- [ ] Pauza, zmiana prędkości, restart, zapis i przewijanie powtórek.
- [ ] Ekran zwycięstwa z podsumowaniem i powtórką finałowej akcji.
- [ ] Pełna oprawa VFX, dźwięki zdolności i niezależne suwaki audio.
- [ ] Automatyczna jakość grafiki i optymalizacja mobilna.
- [ ] Powtarzalne symulacje tysięcy walk, testy 130 kulek i bossów oraz testy w przeglądarce.
- [ ] Testy regresji trybów, kampanii, kont, PvP i zapisanych postępów.
- [ ] Jedna finalna publikacja po przejściu testów.

## Sprawdzenie

- Składnia nowego modułu i kodu inline `index.html`: sprawdzona w izolowanym parserze JS.
- Przepływ tarcza → pancerz → HP, krytyki, opóźnienie zdolności, zmiana areny, timeout i hooki: sprawdzone w izolowanej symulacji.
- Testy Node: `node --test tests/combat-rework.test.cjs` (plik testowy dodany; brak uruchomienia Node w tym środowisku).
- **Nie wykonano pełnych testów end-to-end w przeglądarce ani testów mobilnych.**
- Nie publikować gałęzi jako ukończonego reworku.

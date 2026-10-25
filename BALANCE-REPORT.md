# Ball VS Ball — pomiar balansu V1/V2/V3

Źródło gry: 76e1e4878585838a757874a7713c40d5c2395916. Tabela współczynników: wersja 3; wcześniejsze dopasowanie wykorzystało 7800 walk. Po końcowych zmianach zdolności przeprowadzono kolejne 7800 walk — po 2600 dla V1, V2 i V3. SHA-256 wszystkich plików symulacji w raportach zgadza się z opublikowanym źródłem.

Każda kulka ma 40 walk na ewolucję, z 20 różnymi rywalami; pary mają odwrócone strony startowe. Obie strony używają poziomu 4 AI, równych ewolucji, bez ulepszeń statystyk, z taktyką Balans i sześcioma arenami. Remis liczy się jako pół punktu w scoreRate. To próbka, nie wszystkie możliwe zestawienia i nie rozgrywki ludzi.

| Wersja | Walki | Mediana | P10 / P90 | Limit czasu | Poniżej 30 s | Kulki poza 25–75% wyniku |
|---|---:|---:|---:|---:|---:|---:|
| V1 | 2600 | 31.98 s | 19.90 / 58.52 s | 246 | 1115 | 12 |
| V2 | 2600 | 31.53 s | 19.58 / 56.30 s | 209 | 1132 | 13 |
| V3 | 2600 | 31.17 s | 19.25 / 56.48 s | 223 | 1179 | 28 |

Mediany mieszczą się w celu 30–60 s, ale około 43–45% walk kończy się przed 30 s, a około 8–10% rozstrzyga limit czasu. Wyniki na poziomie kulek nadal mają wyraźne skrajności, szczególnie V3. **Pełny balans nie jest jeszcze potwierdzony.** Potrzebne są dalsze korekty, większe próbki, testy graczy i osobny odbiór bossów oraz progresji. Czterdzieści walk nie daje precyzyjnej oceny indywidualnego win rate.

## Najbardziej odstające wyniki tej próbki

- V1: Przekuwacz (90%), WDC (76.3%), Król Elektryków (76.3%), Rój (20%), Fibonacci (77.5%), Pulsar (78.8%), Nawałnica (21.3%), Zagłada (76.3%), 🎃 Gargulec (23.8%), 🎃 Nekromanta (78.8%), 🎃 Grobowy Alchemik (20%), 🎃 Płacząca Marionetka (77.5%).
- V2: Szarża (81.3%), Wampir (77.5%), Włócznia (80%), Komórka (20%), Jabłko (18.8%), Mróz (78.8%), Fibonacci (85%), Pulsar (80%), Widmo (17.5%), 🎃 Duch Latarni (23.8%), 🎃 Nekromanta (76.3%), 🎃 Dzwon Północy (83.8%), 🎃 Widmowy Rycerz (77.5%).
- V3: Szarża (83.8%), Trujący kolec (21.3%), Wampir (83.8%), Włócznia (81.3%), Komórka (22.5%), Promień (77.5%), Jabłko (10%), Armata (17.5%), Rój (22.5%), Czarny Pająk (17.5%), Skrzydło Światła (80%), Szlam (20%), Shuriken (76.3%), Fibonacci (86.3%), Ninja (76.3%), Echo (83.8%), Słońce (22.5%), Pulsar (88.8%), Nawałnica (18.8%), Miraż (77.5%), Widmo (16.3%), Zjawa (83.8%), Porządek (22.5%), 🎃 Ognik (20%), 🎃 Pająk Wdowa (21.3%), 🎃 Żniwiarz Dusz (90%), 🎃 Dzwon Północy (83.8%), 🎃 Zgniła Dynia (22.5%).

## Powtórzenie pomiaru

Z katalogu repozytorium uruchom node --test tests/*.test.cjs, następnie node tests/balance.cjs. Parametry środowiska: BVB_BALANCE_GAMES=2600, BVB_BALANCE_TIER=1, BVB_BALANCE_SEED=900000, BVB_BALANCE_OFFSET=63, BVB_BALANCE_OUT=balance-v1.json. Dla V2 użyj tier=2, seed=910000, offset=71; dla V3 tier=3, seed=920000, offset=77. Raport zapisuje wyniki każdej walki, współczynniki i hashe źródeł. Nie ustawiaj BVB_BALANCE_DISABLE dla pomiaru wersji opublikowanej.

Testy uruchamiają rzeczywisty silnik bez renderowania DOM; płynność urządzeń, publiczny multiplayer, TURN i działanie kont/chmury wymagają odrębnego odbioru. Wartość maksymalna 60,02 s wynika z granicy kroku 1/60 s; nie dodano okresu nietykalności wymuszającego minimalną długość walki.

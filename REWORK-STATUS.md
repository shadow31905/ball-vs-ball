# Ball VS Ball 2.0 — status reworku

Gałąź: `rework/combat-3-foundation`, PR #1. Stabilny punkt wejścia na `main` nie jest scalany przed spełnieniem bramki wydania. Beta jest oddzielną paczką w `/beta/`, z osobnym zapisem i wyłączoną chmurą.

W kodzie zaimplementowano:

- 130 jawnie zaprojektowanych pasywek i superumiejętności; testy wykonują wszystkie receptury i sprawdzają osobno ich unikalność.
- 130 aktywnych zdolności i rzeczywiste ulepszenia V2/V3: pociski, ostrza, zasięg, statusy, pola, oczyszczanie i pomocnicy. Testy porównują 390 wariantów przy identycznym HP/DMG bazowym.
- 6 bossów × 3 autorskie fazy, sygnalizowane obszary ataków, działające również w Boss Rush i kampanii.
- 5 profili AI, uniki pocisków i zagrożeń, kontrola statusów, tarcie, spin, stabilizacja fizyki i hash stanu obejmujący stan zdolności.
- Odtworzenie każdego kroku walki z bezstratnymi deltami, zdarzeniami, dźwiękami i muzyką; import/eksport, gzip, zapis i odczyt po odświeżeniu. To odtwarzanie zapisanych stanów, nie ponowna symulacja; nagrania mogą zostać oznaczone jako niepełne po wyczerpaniu limitu pamięci. Wygląd i wyjście audio zależą od przeglądarki.
- Animowane kwadratowe kategorie, przyciski i przejścia, finisher, rysowanie zwycięskiej kulki oraz respektowanie ograniczania animacji.
- Trening wszystkich 130 kulek: wyszukiwarka bez rozróżniania polskich znaków, sortowanie według rzadkości, wybór obu ewolucji i rywala. Bez zmiany postępu konta.
- Przywrócona progresja Survival, Infinity, Boss Rush, Turnieju, Chaosu i Halloween; testy przechodzą wszystkie 50 poziomów kampanii. W testach progresji zwycięstwa są wymuszane wzmocnieniem gracza, więc nie stanowią certyfikatu balansu kampanii.
- Multiplayer z walidacją, kolejnością i hashem pakietów, pełną zmianą perspektywy, zatrzymaniem hosta przy zerwaniu kanału i ponownym połączeniem. Test dwóch klientów używa rzeczywistych WebRTC DataChannel; publiczna sygnalizacja PeerJS i TURN/WAN wymagają odrębnego odbioru.
- Obsługa opcjonalnego TURN i informacja o wybranej trasie; brak aktywnych poświadczeń TURN w repozytorium.
- Walidacja, migracja i transakcyjny import lokalnego zapisu z kopią oraz wycofaniem błędu. Nie jest to ochrona anty-cheat.
- Pakowanie niezależnej bety, kontrola zależności i izolacji zapisu. Pasek bety pozwala testować wszystkie ewolucje.

## Testy i pomiary

`node --test tests/*.test.cjs` uruchamia wszystkie testy regresyjne. GitHub Actions uruchamia również Chromium, Firefox i WebKit, emulację telefonów 320/375/430 px oraz test dwóch klientów WebRTC. Źródło 76e1e48: 87 testów lokalnych oraz wszystkie joby CI (Chromium, Firefox, WebKit i symulacje) przeszły. CI obejmuje zwykły runtime, oddzielną paczkę beta, trening V3 i dwa rzeczywiste kanały WebRTC. Przebieg: https://github.com/shadow31905/ball-vs-ball/actions/runs/40221214742 . Beta z tego źródła jest opublikowana w /beta/; wdrożenie GitHub Pages zakończyło się sukcesem. Działający interfejs bety sprawdzono również na publicznym adresie w przeglądarce.

Balans ma jawną tabelę 130 współczynników, opartą na tysiącach walk. Po zmianach w aktywnych zdolnościach uruchomiono ponowne pomiary. Aktualne liczby i ograniczenia są w `BALANCE-REPORT.md`. Żaden skończony test nie potwierdza idealnego balansu wszystkich par; potrzebne są również obserwacje graczy.

## Bramka wydania

Pozostałe warunki opisano w `docs/RELEASE-GATE.md`. Nie oznaczać całego reworku jako ukończonego i nie scalać do stabilnego `main`, jeśli testy najnowszego kodu, fizyczne urządzenia i odbiór sieciowy pozostają niepotwierdzone. Publikacja samej bety nie jest finalną premierą.

# Ball VS Ball 2.0 — status reworku

Gałąź: `rework/combat-3-foundation`, PR #1. Stabilny punkt wejścia na `main` nie jest scalany przed spełnieniem bramki wydania. Na prośbę użytkownika **beta przestała być publiczną stroną**: folder `beta/` usunięto z `main` w commicie `75ad553`. Kolejne testy bety odbywają się wyłącznie na tymczasowym serwerze CI z izolowanym zapisem i wyłączoną chmurą; nie wystawiać wersji beta przez GitHub Pages. Repozytorium źródłowe pozostaje publiczne, więc nie stanowi poufnego środowiska dla kodu.

## Aktualny priorytet — poza reworkiem kulek

Na wyraźne życzenie właściciela odłożono indywidualny rework pozostałych 106 kulek na późniejszy etap. W bieżącej sesji **nie zmieniano zdolności ani ewolucji kulek**. Wykonano:

- **Bossowie:** testy `tests/boss-hitboxes.test.cjs` sprawdzają wszystkie 18 nazwanych ostrzeżeń, geometrię oraz faktyczne trafienia po zapowiedzianym czasie. Nie jest to jeszcze odbiór na urządzeniach fizycznych.
- **Sieć / TURN:** tryb `relayOnly` odmawia uruchomienia bez serwera TURN, odrzuca zbyt długie dane uwierzytelniania i wspiera krótkotrwałe dane ICE pobrane po HTTPS. `tests/turn-relay.test.cjs` sprawdza serwer relay, błędy konfiguracji, wybrane kandydaty oraz brak transmisji ciasteczek na obce domeny. Nadal **brakuje potwierdzonego działającego publicznego serwera TURN** i odbioru na różnych sieciach.
- **Konto / chmura:** `bvb-accounts.js` nie przełącza wysyłanych statystyk na inny profil w trakcie operacji asynchronicznej, a wylogowanie czeka na aktywny zapis; wylogowanie na danym urządzeniu nie kończy sesji na innych. `tests/cloud-session.test.cjs` używa symulatora API, **nie jest testem prawdziwej bazy Supabase**.
- **Mobilność:** `tests/combat-mobile-smoke.cjs` sprawdza portret → krajobraz → portret podczas treningu i utrzymanie identyfikatora rundy, elementów sterowania oraz braku poziomego przewijania. To tylko emulacja, nie rzeczywisty Android ani iPhone.
- Zachowano tymczasową betę **tylko w CI** i nietkniętą stabilną stronę.

W kodzie zaimplementowano:

- 130 jawnie zaprojektowanych pasywek i superumiejętności; testy wykonują wszystkie receptury i sprawdzają osobno ich unikalność.
- 130 aktywnych zdolności i rzeczywiste ulepszenia V2/V3: pociski, ostrza, zasięg, statusy, pola, oczyszczanie i pomocnicy. Testy porównują 390 wariantów przy identycznym HP/DMG bazowym.
- Pierwsze **16 kulek (0–15)** zachowuje poprzednie indywidualne poprawki. W najnowszej partii **8 kulek 16–23** otrzymało własne, przypisane tożsamościom mechaniki V2/V3 z wyzwalaczami ściany, kontaktu, pączkowania, aury, echa promienia, matrycy, sadu i wieżyczki. Ich działanie oraz charakterystyczne podglądy sprawdza `tests/identity-rework-16-23.test.cjs` wraz z testami przeglądarek. Dla pozostałych **106 kulek 24–129** działają profile V2/V3 ze wspólnych efektów, lecz **to nie jest jeszcze pełny indywidualny rework**. Test `tests/authored-evolutions.test.cjs` obejmuje 342 aktywacje; raport: `docs/ABILITY-AUDIT.md`. Nadal trzeba projektować unikalne zachowania 106 kulek i potwierdzić interakcje pasywek, superów, kolizji i statusów.
- 6 bossów × 3 autorskie fazy, sygnalizowane obszary ataków, działające również w Boss Rush i kampanii.
- 5 profili AI, uniki pocisków i zagrożeń, kontrola statusów, tarcie, spin, stabilizacja fizyki i hash stanu obejmujący stan zdolności.
- Odtworzenie każdego kroku walki z bezstratnymi deltami, zdarzeniami, dźwiękami i muzyką; import/eksport, gzip, zapis i odczyt po odświeżeniu. To odtwarzanie zapisanych stanów, nie ponowna symulacja; nagrania mogą zostać oznaczone jako niepełne po wyczerpaniu limitu pamięci. Wygląd i wyjście audio zależą od przeglądarki.
- Animowane kwadratowe kategorie, przyciski i przejścia, finisher, rysowanie zwycięskiej kulki oraz respektowanie ograniczania animacji.
- **Pięć specjalnych cutscenek** przy prawdziwym rozstrzygającym K.O., trwających 1,8 s: Fala Tytana, Supernowa, Pęknięcie Czasu, Ostrza Światła i Kryształowy Finał. Każda ma odrębny storyboard, kolor, trzy etapy i równe **20%** teoretycznego prawdopodobieństwa; jedno losowanie spoza RNG walki, bez cutscenki przy remisie, zgonie obu stron albo nieśmiertelnym ciosie. W powtórce zapisuje się wybrany wariant i do 108 dodatkowych klatek, pozycja sceny i wynik pozostają wspólne dla hosta i gościa z odwróceniem areny. Wariant reduced motion to statyczna karta K.O. Dodano testy geometrii pięciu scen, trzech faz w prawdziwym Canvas, przedziałów 20%, synchronizacji lokalnego WebRTC i poprawności pakietów. Szczegóły: `docs/FINISHER-CINEMATICS.md`. **Końcowe CI i testy na fizycznych urządzeniach / sieciach WAN nadal wymagają potwierdzenia**.
- Trening wszystkich 130 kulek: wyszukiwarka bez rozróżniania polskich znaków, sortowanie według rzadkości, wybór obu ewolucji i rywala. Bez zmiany postępu konta.
- Przywrócona progresja Survival, Infinity, Boss Rush, Turnieju, Chaosu i Halloween; testy przechodzą wszystkie 50 poziomów kampanii. W testach progresji zwycięstwa są wymuszane wzmocnieniem gracza, więc nie stanowią certyfikatu balansu kampanii.
- Multiplayer z walidacją, kolejnością i hashem pakietów, pełną zmianą perspektywy, zatrzymaniem hosta przy zerwaniu kanału i ponownym połączeniem. Test dwóch klientów używa rzeczywistych WebRTC DataChannel; publiczna sygnalizacja PeerJS i TURN/WAN wymagają odrębnego odbioru.
- Obsługa opcjonalnego TURN i informacja o wybranej trasie; brak aktywnych poświadczeń TURN w repozytorium.
- Walidacja, migracja i transakcyjny import lokalnego zapisu z kopią oraz wycofaniem błędu. Nie jest to ochrona anty-cheat.
- Pakowanie niezależnej bety, kontrola zależności i izolacji zapisu. **Wyłącznie w paczce beta** działa testowy panel administratora: ustawienie dowolnej bezpiecznej liczby monet/cukierków, odblokowanie wszystkich 130 kulek oraz wybór rzeczywistej ewolucji V1/V2/V3 dla jednej lub wszystkich kulek, z szybkim przejściem do treningu. Panel korzysta wyłącznie z klucza `bvb_beta_rework_v4`, bez konta/chmury. Główna strona nie importuje pliku `bvb-beta-tools.js`; dodatkowe warunki w module i builderze zapobiegają przypadkowemu włączeniu panelu na stabilnej stronie. Jest to panel testowy lokalnego profilu, bez uprawnień serwerowych.
- **Beta prywatna w sensie braku publicznego adresu WWW:** historyczne wdrożenie bety `1cca3a2` zostało cofnięte przez usunięcie katalogu z `main` (`75ad553`, Pages 40352277451: sukces). Po przejściowym publicznym wdrożeniu dalsze paczki są budowane tylko na CI runnerach, bez publikacji folderu i bez publikowania artefaktu z wykonywalną paczką. GitHub repo jest publiczne; dla prawdziwego ograniczenia dostępu do kodu potrzebne byłoby osobne repo prywatne. Stabilne pliki gry pozostają nienaruszone.

- Rozbudowano jednorazowo wyświetlany changelog 2.0.1 o pełniejszy wykaz funkcji reworku i dodano testy zachowania po ponownym wejściu; robocza dokumentacja: `docs/CHANGELOG-2.0-DRAFT.md`. Przy finalnej premierze zaktualizować wykaz wyłącznie o potwierdzone zmiany oraz wersję komunikatu.

## Testy i pomiary

`node --test tests/*.test.cjs` uruchamia wszystkie testy regresyjne. GitHub Actions uruchamia również Chromium, Firefox i WebKit, emulację telefonów 320/375/430 px oraz test dwóch klientów WebRTC. Źródło 76e1e48: 87 testów lokalnych oraz wszystkie joby CI (Chromium, Firefox, WebKit i symulacje) przeszły. CI obejmuje zwykły runtime, oddzielną paczkę beta, trening V3 i dwa rzeczywiste kanały WebRTC. Przebieg: https://github.com/shadow31905/ball-vs-ball/actions/runs/40221214742 . **Uwaga:** dawna beta była publiczna historycznie, lecz obecnie `/beta/` jest usunięte z Pages; nowe testy odbywają się wyłącznie wewnętrznie w CI.

Balans ma jawną tabelę 130 współczynników, opartą na tysiącach walk. Po zmianach w aktywnych zdolnościach uruchomiono ponowne pomiary. Aktualne liczby i ograniczenia są w `BALANCE-REPORT.md`. Żaden skończony test nie potwierdza idealnego balansu wszystkich par; potrzebne są również obserwacje graczy.

## Bramka wydania

Pozostałe warunki opisano w `docs/RELEASE-GATE.md`. Nie oznaczać całego reworku jako ukończonego i nie scalać do stabilnego `main`, jeśli testy najnowszego kodu, fizyczne urządzenia i odbiór sieciowy pozostają niepotwierdzone. Tymczasowa beta jest testowana w CI, bez publicznego adresu. Publiczny adres /beta/ jest wycofany; końcowa publikacja dotyczy wyłącznie stabilnej gry.

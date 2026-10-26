# Ball VS Ball 2.0 — roboczy wykaz zmian

> **Status:** projekt wciąż w trakcie reworku. Ten dokument jest roboczą listą funkcji zaimplementowanych w gałęzi PR #1, **nie** ogłoszeniem ukończenia lub stabilnej premiery. Zanim lista trafi do automatycznego okna dla stabilnego wydania, zweryfikować każde twierdzenie w wydawanym commicie.

## Kulki, umiejętności i ewolucje
- 130 ręcznie zdefiniowanych pasywek i superumiejętności.
- 130 aktywnych zdolności, z osobnymi zachowaniami i efektami.
- Zakończono etap kodowania indywidualnych ulepszeń aktywnych umiejętności **V2/V3 dla wszystkich pozostałych 114 kulek (ID 16–129)**. V2 daje nowy efekt w symulacji walki, a V3 zachowuje i wzmacnia V2, dokładając drugi. Pierwsze 16 umiejętności zachowano. Dodano 342 testowe aktywacje, rozróżnialne schematy podglądów V1/V2/V3, statyczne podglądy dla ograniczonych animacji i rzeczywiste opisy nadchodzących ewolucji w kolekcji. Raport i lista wszystkich 114 ulepszeń: `docs/ABILITY-AUDIT.md`. Nadal wymagana jest pełna weryfikacja zachowań w długich walkach.
- Warianty ewolucji V1, V2 i V3; dodatkowe pociski, ostrza, pola, statusy, modyfikacje zasięgu/czasu, oczyszczanie i przywołania.
- Podglądy zdolności oraz opisy w interfejsie; pełna zgodność każdej zdolności z opisem **wymaga audytu**.

## Bossowie i walka
- Sześciu bossów z trzema fazami każdy (18 faz).
- Ostrzeżenia obszarowe przed atakami bossów.
- Prezentacja zwycięskiej kulki i efekty rozstrzygającego uderzenia.
- **Pięć specjalnych cutscenek ostatniego uderzenia**, każda trwająca 1,8 s i wybierana losowo z równym prawdopodobieństwem 20%: **Fala Tytana** (rozchodzące się fale), **Supernowa** (gwiezdny wybuch), **Pęknięcie Czasu** (wir portali), **Ostrza Światła** (skrzyżowane smugi) i **Kryształowy Finał** (pryzmat i odłamki). Pełny ekran areny K.O., trzy etapy animacji, pokazanie zwycięskiej kulki; efekt występuje tylko po faktycznym rozstrzygającym K.O., nie przy remisie ani zwykłym końcu rundy. Wariant nie wpływa na walkę, synchronizuje się w multiplayerze i jest zapisany w **108 klatkach** powtórki. Dla osób ograniczających animacje dostępna jest karta statyczna. Dodatkowe testy równego losowania i rzeczywistych pikseli pięciu scen. Publiczny multiplayer WAN i telefony wymagają jeszcze odbioru; szczegóły: `docs/FINISHER-CINEMATICS.md`.

## Menu i animacje
- Nowe menu z czterema animowanymi kwadratowymi kategoriami.
- Podmenu trybów, kolekcji, sklepu, konta i ustawień; ekrany wyboru przed walką.
- Animacje przejść, przycisków i prezentacji wyniku.
- Obsługa zmniejszania animacji (prefers-reduced-motion i ustawienia efektów).

## Trening i tryby
- Tryb treningu obejmujący 130 kulek, wyszukiwanie nazw bez polskich znaków i sortowanie według rzadkości.
- Wybór gracza, przeciwnika oraz V1/V2/V3 dla obu stron; trening bez zmiany zwykłego postępu.
- Kampania (50 etapów), Survival, Infinity, Boss Fight, Boss Rush, Turniej, Chaos i Halloween.
- Przywrócenie progresji fal/rund, wyników i nagród w trybach.

## Powtórki
- Odtwarzanie zapisywanych stanów krok po kroku, w tym pozycji, pocisków, pól, statusów i efektów.
- Zapis zdarzeń oraz ścieżek dźwiękowych i muzycznych.
- Przewijanie, trwały zapis, import/eksport, kompresja gzip, oznaczanie niepełnych nagrań.
- Obsługa starszych nagrań i walidacja importowanych danych, w tym uszkodzonych wariantów finishera. Testy sprawdzają ponowne odtworzenie wszystkich pięciu wariantów; odbiór w przeglądarkach i na fizycznych urządzeniach **przed wydaniem**.

## Multiplayer 1v1
- Połączenie dwóch graczy przez WebRTC DataChannel, z walidacją/kolejnością pakietów i hashem stanu.
- Perspektywa gościa, zatrzymanie walki hosta po rozłączeniu oraz mechanizm powrotu.
- Opcjonalna konfiguracja TURN i diagnostyka trasy; **publiczny PeerJS, prawdziwy TURN/relayOnly i Wi-Fi/LTE nie zostały jeszcze potwierdzone**.

## Zapis, konto i beta
- Walidacja i migracja lokalnych zapisów oraz bezpieczny import z kopią i rollbackiem.
- Oddzielna beta z izolowanym profilem, narzędziami do ewolucji i wyłączonym kontem/chmurą.
- **Tylko testowa beta:** panel lokalnych ustawień testowych pozwala nadać monety i cukierki, odblokować 130 kulek, nadać V1/V2/V3 jednej lub wszystkim kulkom oraz otworzyć trening. Nie jest ładowany w stabilnej grze i nie korzysta z kont/chmury. Po zmianie decyzji właściciela **publiczna beta została wycofana z GitHub Pages**; kolejne testy wykonuje tymczasowa paczka tylko na serwerze CI, bez publikowania gotowych artefaktów.
- Funkcje konta/chmury pozostają do odbioru przed stabilną publikacją.
- Okno changelogu 2.0.1: automatyczne pokazanie najwyżej raz dla danej wersji i profilu przeglądarki, ponowne otwarcie ręcznie w ustawieniach. Beta i stabilna gra mają oddzielne znaczniki przeczytania listy.

## Warunki publikacji
- Weryfikacja każdego elementu na aktualnym wydawanym commicie i uzupełnienie listy o wszystkie rzeczywiście skończone poprawki.
- Powtórki, finisher 5/5 i multiplayer: testy regresyjne.
- Odbiór na fizycznych telefonach, dwie sieci i TURN/relayOnly, konto/chmura, zielone CI, sprawdzenie stabilnej strony.
- Nie traktować dalszego rozwoju AI/fizyki/pełnego balansu jako osobnego obowiązkowego punktu.
- Aktualizować numer wydania i identyfikator jednorazowego wyświetlenia **dopiero przy nowym stabilnym wydaniu**.

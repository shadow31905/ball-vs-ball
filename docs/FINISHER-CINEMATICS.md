# Pięć cutscenek ostatniego uderzenia — Ball VS Ball 2.0

## Wymaganie

Gdy prawdziwe, rozstrzygające ostatnie trafienie kończy rundę, uruchamia się **dokładnie jedna** z pięciu różnych, krótkich scen. Zwycięzca już został ustalony przez silnik — cutscenka **nie** zmienia wyniku, HP, obrażeń, nagród, odnowień ani losowości symulacji. Remis i zakończenie bez faktycznego wyeliminowania przeciwnika **nie** powodują cutscenki.

## Scenariusze (1,8 sekundy każdy)

| Wariant | Scena | Rozróżnialna sekwencja |
| --- | --- | --- |
| 0 | **Fala Tytana** | Wstrzymany moment trafienia → cztery rozchodzące się fale → radialne pęknięcia i wielki K.O. |
| 1 | **Supernowa** | Narastający rozbłysk → eksplozja 20 promieni i gwiazdek → migoczące następstwa trafienia |
| 2 | **Pęknięcie Czasu** | Zawirowanie przestrzeni → pięć przeciwbieżnych okręgów z podziałkami → zamknięcie portalu |
| 3 | **Ostrza Światła** | Podejście zwycięskiej kulki → cztery nadchodzące ostrza → dwie przecinające się smugi |
| 4 | **Kryształowy Finał** | Skupienie energii → pięć romboidalnych obwódek → rozsypane kryształowe odłamki |

Każda cutscenka ma osobny kolor przewodni, tekst i pełną planszę wewnątrz pola walki, ciemne cinematic bars, wizualny ruch zwycięskiej kulki i podpis **K.O.** Przebieg zależy wyłącznie od zapisanego czasu sceny, bez nowej losowości.

## Losowość — każda 20%

Jedno losowanie prezentacyjne dzieli zakres [0,1) na pięć równych przedziałów, każdy szerokości **0,2**. Daje to teoretycznie 20% na dowolny wariant, bez ingerencji w generator losowy symulacji. Wariant jest wybierany tylko raz i zapisany w stanie rundy.

## Synchronizacja i powtórki

- Host multiplayera wybiera wariant, gość **nie losuje ponownie**. Perspektywa gościa odwraca współrzędne sceny (w tym początek uderzenia), ale zachowuje identyczny wariant; dźwięk odtwarza się raz.
- Powtórki v3 zachowują wybrany wariant i dopisują **108 prezentacyjnych klatek** (60 FPS x 1,8 s) po zakończeniu walki, bez wykonywania dodatkowej symulacji. Klip da się przewijać, zapisać i eksportować. Przy limicie 65 sekund osi czasu zapisywana jest tylko mieszcząca się końcówka.
- Starsze nagrania mające pole style zamiast variant pozostają obsługiwane.
- Nowa runda resetuje cutscenkę. Wynik pojawia się po 2 sekundach od ostatniego trafienia.
- Przy prefers-reduced-motion lub wyłączonych efektach wizualnych pojawia się czytelna **statyczna** karta K.O.

## Testy

- finisher-cinematics.test.cjs: pięć różnych scen i palet, trzy fazy, deterministyczność, 10 000 kontrolowanych losowań z dokładnym rozkładem 20%, brak ingerencji w RNG walki, wyłącznie po K.O. i statyczna prezentacja reduced motion.
- finisher-replay.test.cjs: 108 klatek, identyczny wariant po odczycie, kompatybilność, limit czasu, mirroring.
- network.test.cjs: pięć poprawnych pakietów hosta, odwrócone współrzędne i odrzucanie uszkodzonych danych.
- combat-network-browser.cjs: lokalne WebRTC z dwoma klientami, synchronizacja po rzeczywistym K.O.
- combat-browser-smoke.cjs: sprawdzanie **rzeczywistych pikseli** każdej z pięciu scen i trzech faz w Chromium, Firefox, WebKit oraz brak animacji przy reduced motion.

**Do końcowej akceptacji:** zielony wynik CI dla aktualnego commita, fizyczne telefony, płynność i dwie sieci z PeerJS/TURN. Test lokalnego WebRTC nie zastępuje testu WAN. Stabilna gra pozostaje bez zmian; beta jest tymczasowa, uruchamiana wyłącznie w CI, bez publicznego adresu.

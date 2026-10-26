# Warunki stabilnego wydania

- [ ] Zielone testy jednostkowe i wszystkie joby Chromium/Firefox/WebKit dla **aktualnego, finalnie wydawanego commita**. Historyczne testy źródła 76e1e48 były zielone; nowe zmiany wymagają ponownego przejścia CI.
- [ ] Testy bety zbudowanej z **finalnego źródła**: zapis po odświeżeniu, V1/V2/V3, wszystkie 5 finisherów, wyszukiwarka, izolacja profilu. Historyczna beta 76e1e48 była sprawdzona, ale nie zawiera najnowszych zmian.
- [ ] Odbiór na fizycznym iPhonie/Safari oraz Androidzie/Chrome: dotyk, orientacja, 320–430 px, dłuższa walka, temperatury i płynność.
- [ ] Dwie rzeczywiste sieci Wi-Fi/LTE: publiczna sygnalizacja, dołączenie, gotowość, runda, rozłączenie i powrót. Skonfigurowany TURN potwierdzony trasą relay w trybie relayOnly.
- [ ] Testy regresji mechanik i ewolucji po ostatnich zmianach, zgodności bossów, trybów, treningu, replayów oraz multiplayera. Dotyczy poprawności działania i braku regresji, **nie** wymaga osobnej pełnej akceptacji balansu wszystkich 130 kulek (ten cel użytkownik wyłączył z zakresu).
- [ ] Weryfikacja konta/chmury w stabilnym środowisku przed włączeniem nowej wersji. Beta ma chmurę wyłączoną.
- [ ] Sprawdzenie pięciu finisherów: równe szanse, jeden wybór na ostatnie trafienie, zgodność powtórki i obu klientów multiplayer, brak ingerencji w walkę, reduced motion.
- [ ] Changelog końcowego wydania: pełny i prawdziwy wykaz dodatków/poprawek, automatyczne pokazanie tylko raz na wersję, możliwość ponownego otwarcia ręcznie.
- [ ] Opublikowanie stabilnej wersji dopiero po spełnieniu powyższych punktów i sprawdzenie działającej strony po wdrożeniu.

Testy automatyczne i emulacja nie są potwierdzeniem testów fizycznego iPhone’a/Androida ani usługi TURN. Nie odhaczaj punktu bez dowodu. Monitor w tej rozmowie ma powiadomić dopiero po potwierdzonym ukończeniu i publikacji; samo wdrożenie bety nie wystarcza.

Historyczne dowody dla źródła 76e1e48 (nie potwierdzają najnowszej wersji): CI 40221214742 (wszystkie joby zielone), wdrożenie Pages 40222153448, izolowany build.json i publiczny interfejs bety. Testy fizycznych urządzeń, WAN/TURN i końcowa akceptacja balansu pozostają nieodhaczone.

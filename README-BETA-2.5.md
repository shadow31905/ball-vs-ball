# Ball VS Ball 2.5 — izolowana beta lokalna

## Co to jest?
Ta gałąź została utworzona **bezpośrednio z `main`**. Zachowuje pliki, oryginalne zasoby i zasady gry. Zmieniony został wyłącznie loader bety oraz dodano odrębny panel testowy.

- 130 kulek: odblokowanie jednym kliknięciem w panelu beta.
- Każda kulka: testowe ustawianie V1, V2 lub V3, pojedynczo albo dla wszystkich.
- Monety i cukierki: dowolne bezpieczne wartości testowe.
- Rozgrywka: mechanika pochodzi z oryginalnego `main`; żadna niezbudowana funkcja nie jest udawana.
- Zapis beta: `bvb_beta_25_isolated_v1`, oddzielny od `bvb_hw_120_v3`.
- Baza produkcyjna Supabase: połączenie z kontami wyłączone z dokumentu gry. Beta przechowuje postęp lokalnie.
- Oryginał: brak modyfikacji `main` oraz brak wdrożenia na GitHub Pages.

## Uruchomienie
Na komputerze z Git i Pythonem:

```bash
git clone --branch beta/2.5-isolated-20261030 --single-branch https://github.com/shadow31905/ball-vs-ball.git bvb-beta-25
cd bvb-beta-25
python -m http.server 8765
```

Otwórz **http://localhost:8765/** w przeglądarce. Wybierz **Panel testowy BETA**. Nie otwieraj przez `file://`, ponieważ gra wczytuje części silnika przez `fetch`.

## Dostęp i prywatność
**Ta beta nie jest wdrożona w Internecie.** Lokalny serwer HTTP należy uruchomić wyłącznie na komputerze właściciela (domyślnie zalecane `--bind 127.0.0.1`). To NIE jest internetowa beta zabezpieczona logowaniem. Repozytorium jest publiczne, dlatego kod gałęzi także jest czytelny publicznie. Aby zapewnić dostęp do online bety tylko właścicielowi, konieczny jest osobny hosting z rzeczywistą kontrolą dostępu (np. weryfikacja konta na serwerze). Nie publikuj jej zwyczajnym linkiem GitHub Pages ani nie stosuj hasła zaszytego w HTML.

## Zakres testów przed akceptacją
1. Ekran startowy, grafiki i animacje vs oryginał.
2. Włączenie panelu, odblokowanie 130 kulek i test V1/V2/V3.
3. Zmiana monet/cukierków i zachowanie danych beta po odświeżeniu.
4. Potwierdzenie, że konto produkcyjne nie łączy się w becie.
5. Walka, trening i zapisy na rzeczywistym Android/Chrome.
6. Dwa urządzenia i różne sieci dla multiplayera: brak dowodu działania = BLOCKED.

Publikacja do oryginalnej gry wyłącznie po zatwierdzeniu przez właściciela.

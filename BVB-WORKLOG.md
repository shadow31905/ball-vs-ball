# Ball VS Ball — notatki do przyszłego Changeloga

Ten plik jest **wewnętrzną listą projektu**, nie jest wczytywany przez stronę i **nie wyświetla się w grze**. Dopisuj tu następne faktycznie wykonane zmiany. Gdy Changelog wróci, przygotuj z nich zwięzły, przejrzysty opis w czterech kategoriach: Dodano / Zmieniono / Poprawiono / Ulepszono.

## Już wprowadzone w kodzie (wymagają dalszej kontroli w przeglądarce)

- Rozbudowano zestaw 130 kulek o nazwane umiejętności o różnorodnych mechanikach, pociskach, efektach i animacjach; dopracowano ich statystyki.
- Dodano sieci Pająka między dwiema różnymi ścianami: pozostają przez całą rundę i zadają 1 HP za nowe dotknięcie, nie w każdej klatce.
- Dodano wyróżniające detale w grafikach kulek oraz animowane podglądy umiejętności w kolekcji.
- Dodano nazwy i krótkie opisy działania pod przyciskami **menu głównego**.
- Wprowadzono poprawki czytelności tekstu na telefonach: nazwa nad opisem, unikanie dzielenia słów, układ responsywny.
- Przetestowano podstawowe uruchamianie 130 umiejętności oraz niektóre mechaniki (Pająk, Komórka, Konduktor). Nie oznacza to pełnych testów wszystkich walk i prawdziwego PvP.
- Na pewnym etapie dodano Changelog pokazywany po zalogowaniu / rejestracji z aktywną sesją / grze jako gość.
- Tymczasowo usunięto Changelog z interfejsu (bez automatycznego otwierania, bez przycisku).
- Przywrócono **jedno przewijane menu**, zamiast oddzielnych ekranów z kategoriami. Dodano w nim widoczne nagłówki sekcji, opis dla początkujących i opisy pod przyciskami.

## Pomysły i warunki przywrócenia Changeloga

- Changelog **na razie nie powinien pojawiać się graczom**. Prowadzić te notatki podczas dalszych zmian.
- Kiedy użytkownik poprosi o przywrócenie Changeloga, pokazać go **dopiero po faktycznym wejściu do gry**: zalogowaniu, utworzeniu konta z aktywną sesją lub wyborze gościa. Nigdy na pierwszym ekranie wyboru konta.
- Pisać rzeczowo, średniej długości, bez powtarzania i bez przypisywania sobie zmian, które pozostają wyłącznie zaplanowane.
- Dalsze usprawnienia interfejsu mają ułatwiać początkującym zrozumienie funkcji bez chowania całej nawigacji za kolejnymi przyciskami.
- Sprawdzić realny wygląd na małych telefonach oraz przetestować działanie wszystkich trybów, synchronizację PvP i balans po przebudowie.

## Zasady prac

- Nie usuwać istniejących trybów / ustawień, jeśli użytkownik prosi tylko o przeorganizowanie menu.
- Odróżniać przetestowane mechaniki od funkcji, które są jedynie obecne w kodzie.
- Aktualizować tę notatkę po następnych zmianach, **bez udostępniania ich w grze** aż do wyraźnej prośby.

## Aktualizacja 2026-10-25 — zaakceptowany nowy szkic wdrożony do kodu

- Zatwierdzony projekt z 15 pytań: 4 animowane kafle, różne rozmiary, najważniejsze Tryby walki, ikona/nazwa/opis/podgląd.
- Podłączono osobne widoki kategorii, dodatkowe tryby, wydarzenia i areny z ustawieniami.
- Przed walką z botem lub bossem dodano wybór 5 poziomów, posiadanej kulki i „Gotowość”; przed walką z bossem również wybór bossa.
- Nowe przygotowanie wstawia wybraną kulkę do dotychczasowego składu i automatycznie przechodzi do celowania; pozostałe tryby używają starej logiki.
- Udostępniono podgląd nazwy, HP, DMG, cooldownu i opisu umiejętności na ekranie przygotowania.
- Wznowiono Changelog w osobnym pliku, który wyświetla się po zdarzeniu „bvb-entered-game” — dopiero po zalogowaniu lub wejściu jako gość.
- Changelog dostępny również ręcznie z kategorii Konto i ustawienia.
- Zaplanowany tekst przed wdrożeniem zapisano w `BVB-CHANGELOG-2.0.md`.
- Składnia JS przeszła walidację. Symulacja menu potwierdziła: 4 kafle, zachowanie 24 oryginalnych przycisków z akcjami, wybór trudności i kulki, gotowość uruchamiającą bot/boss, oraz brak Changeloga przed zamknięciem ekranu logowania.
- **Do sprawdzenia ręcznie**: wygląd na małych telefonach, rzeczywisty przebieg całej walki, PvP i synchronizacja, działania konta z Supabase. Przeglądarka testowa nie uzyskała dostępu do publicznej strony (blokada sieciowa).

- **Dalsza poprawka:** w ekranie przygotowania przed walką dodano odtwarzalną animację umiejętności wybranej kulki, wykorzystując istniejący podgląd z kolekcji; na telefonach cztery kafelki pozostają w układzie 2×2.
- Kontrola statyczna: moduły menu, podglądu i Changeloga oraz skrypt gry nie zawierają błędów składni; pełny test w przeglądarce i test PvP nadal wymagane.

- Optymalizacja: animowany podgląd umiejętności wstrzymuje pracę, kiedy ekran wyboru lub kolekcja jest ukryty, aby nie obciążać urządzenia podczas walki.
- Test wykonany z uproszczoną symulacją interfejsu: wykryto cztery kafelki; ścieżka bot → poziom 2 → kulka ID 1 → Gotowość przeszła do celowania z wybraną kulką, a animacja została uruchomiona. To nie zastępuje rzeczywistego testu w przeglądarce.

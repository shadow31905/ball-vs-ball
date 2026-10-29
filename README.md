# Ball VS Ball — beta testowa ID 0–15

Kopia oryginału z commita `f1ce9dc1e4e9c2846323d44c2cf85d77f90708ae`. Zachowuje układ oryginalnego menu. Dostępne są wyłącznie kulki ID 0–15 i ich V1/V2/V3 po reworku. Multiplayer, PeerJS oraz zapisy do chmury nie są dołączone.

Zapis lokalny: `bvb_beta_original_16_v1`; nie korzysta z zapisu głównej gry. Wszystkie 16 kulek jest odblokowane; na testy ewolucji dostępne jest 10 000 monet i cukierków. Kampania, przeciwnicy i skrzynki używają tylko tych 16 kulek.

Uruchamianie lokalne: `python -m http.server 8765`, następnie otwórz `http://127.0.0.1:8765/`. Hosting wymaga zwykłego serwera statycznego, bez backendu.

Gałąź bety: `beta/original-first16-offline`. Workflow `beta-pages.yml` najpierw testuje Chromium i WebKit, a następnie przygotowuje hosting pod `/beta/`. Do artefaktu kopiuje oryginalne pliki gałęzi `main` bez zmian i sprawdza ich zawartość bajt po bajcie. Nie zapisuje do gałęzi `main`. Wdrożenie zatrzymuje się, jeśli oryginał od czasu przygotowania bety został zmieniony. GitHub Pages i reguły środowiska `github-pages` muszą zezwalać na to wdrożenie.

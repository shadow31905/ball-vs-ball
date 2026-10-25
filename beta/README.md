# Ball VS Ball — publiczna beta reworku walki

**Adres:** https://shadow31905.github.io/ball-vs-ball/beta/  
**Wersja stabilna:** https://shadow31905.github.io/ball-vs-ball/

## Jak testować

- Beta ma **osobny zapis przeglądarkowy** `bvb_hw_120_v3_beta_combat`. Nie korzysta z logowania ani synchronizacji konta głównej gry.
- Wszystkie **130 kulek jest odblokowanych** tylko w becie, aby można było przetestować każdą.
- Wybierz „GRAJ”, następnie kulkę. Walka zaczyna się automatycznie.
- Pod areną są: pauza, szybkość, kamera, jakość efektów i powtórka.
- Ekran zwycięstwa pokazuje statystyki i ostatnie 5 sekund walki.
- W becie można sprawdzać bossów i pozostałe tryby, ale **nie ma gwarancji pełnej kompatybilności**.

## Status jakości

- Testy Node.js (mechanika i składnia) — zielone w gałęzi reworku.
- Test Chromium (solo, HUD, pauza, kamera, powtórka, boss) — zielony w gałęzi reworku.
- Beta w folderze `beta/` została opublikowana w `main`, bez podmiany głównej gry.
- Testy multiplayer na dwóch urządzeniach, szerokie testy balansu, pełne odtworzenie efektów w powtórkach oraz 130 ręcznie dopracowanych, odrębnych zestawów zdolności **pozostają do wykonania**.

**Nie przenosić zmian reworku do głównego `index.html`, dopóki nie przejdą wszystkie testy regresji.**

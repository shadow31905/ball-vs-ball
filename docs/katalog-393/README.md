# Katalog 393 wyglądów — oryginalny Ball VS Ball 2.0

**Status: praca w toku. Nie rozpowszechniać jako kompletnego katalogu.**

Celem jest 131 kulek (ID 0–130) × trzy warianty (V1, V2, V3), czyli **393 indywidualne obrazy i opisy**. Wliczony Trebusz ID 130.

## Źródło i wersja

- Repozytorium: `shadow31905/ball-vs-ball`, gałąź **`main`** (nie gałąź `beta`).
- Zamrożony punkt odniesienia: commit `1de7d74870192bb45896cb5b1e0ecd891aafd5dd`. Po zmianie oryginału trzeba ponownie zweryfikować wyglądy.
- `index.html` jest **loaderem**, nie kompletną grą: na desktopie `bvb-loader.js` wczytuje `rework/game-0.txt` ... `rework/game-31.txt`; na telefonie domyślnie przełącza na `index-safe.html`. Właściwy katalog opisuje pełną oryginalną wersję desktopową, nie uproszczoną wersję mobilną.
- W `rework/game-0.txt` istnieje oryginalna tablica `RAW_BALLS` zawierająca **131** pozycji, ostatnia to `Trebusz` ID 130.
- Część wyglądów jest zakodowana jako obrazy WebP/PNG w skryptach HTML, a część powstaje z rysowania Canvas/SVG. Zawsze trzeba ustalić **ostatni aktywny renderer** danej kulki, a nie ufać pierwszej znalezionej definicji `art()`.
- Nie kopiować opisów i obrazów z gałęzi beta, jeżeli nie są dokładnie tym, co uruchamia `main`.

## Zasady wiarygodności

Każdy wariant ma opis osobny dla V1, V2 i V3. Oznaczenie `oglądane` wolno przypisać wyłącznie po faktycznym wyświetleniu obrazu i jego analizie wizualnej. Pliki dowodowe podają identyfikatory, źródło i hashe źródłowe. **Hashe z metadanych są informacją o źródle, a nie dowodem, że obraz obejrzano.** Brakujące i niedostępne warianty oznaczać jako niezweryfikowane; nie wymyślać brakujących szczegółów.

Opis ma być użyteczny dla Claude/Gemini, ale nawet bardzo dokładny tekst nie daje matematycznej gwarancji odwzorowania 1:1. Wierność 1:1 wymaga dostarczenia oryginalnego obrazu referencyjnego i porównania pikselowego / ludzkiej akceptacji.

## Ukończone pozycje

- **ID 000–006**: [opisy V1/V2/V3](opisy/000-006.md).
- **ID 007–012**: [opisy V1/V2/V3](opisy/007-012.md).
- **ID 000–012**: [dowody pochodzenia i 39 zweryfikowanych wizualnie obrazów](evidence/000-012.json).

Pozostałe **ID 013–130** nie są jeszcze gotowe. Ich opisów nie wolno traktować jako ukończonych. Pracę kontynuować w osobnych plikach i uzupełniać `PROGRESS.json`.

## Zakaz zmian gry

Ta gałąź jest wyłącznie dokumentacyjna. Nie modyfikować plików oryginalnej gry, `main`, grafik, silnika walki, mechanik ani publikacji.
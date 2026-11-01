# Ball VS Ball 2.0 — katalog wszystkich 393 oryginalnych wyglądów

**Status: KOMPLETNY W ZAKRESIE OPISÓW I PRZEGLĄDU ŹRÓDEŁ.** Opracowano **393/393 portretów**: 131 kulek (ID 0–130), po trzy ewolucje V1, V2 i V3. Dla każdego wariantu istnieje osobny opis i zapis o obejrzeniu rzeczywistego obrazu. **Nie jest to gwarancja pikselowego odwzorowania 1:1 przez inne AI.** Do takiej wierności potrzebny jest konkretny obraz referencyjny oraz porównanie rezultatu.

## Główny plik do przekazania Claude / Gemini

**[KATALOG_393_DO_CLAUDE_GEMINI.md](KATALOG_393_DO_CLAUDE_GEMINI.md)** — jeden kompletny dokument: 131 sekcji ID i 393 opisy V1/V2/V3, z kolorami, geometrią, charakterystycznymi elementami, materiałami, efektami i różnicami ewolucji. Poszczególne opisy pozostają również dostępne w 22 plikach `part-*.md` dla łatwiejszego przeglądania. **[manifest.json](manifest.json)** zawiera 393 rekordy z identyfikatorami, źródłami i statusami.

## Potwierdzenie źródła oryginału

Repozytorium: `shadow31905/ball-vs-ball`. Źródło: gałąź **`main`**, konkretny commit **`1de7d74870192bb45896cb5b1e0ecd891aafd5dd`** z 1 listopada 2026 r. Wejście do pełnej gry: `index.html` → `bvb-loader.js` → 32 fragmenty `rework/game-0.txt` … `rework/game-31.txt`. Domyślna wersja mobilna `index-safe.html` jest uproszczona i **nie jest źródłem tych portretów**. **Nie używano zastępczych grafik z gałęzi beta.**

Oryginalna lista `RAW_BALLS` ma **131 kulek**. Dodatkowy **Trebusz (ID 130)** rzeczywiście występuje w pełnej grze i ma osobne trzy obrazy PNG (`130:1`, `130:2`, `130:3`) w `rework/game-31.txt`.

## Skąd pochodzą obrazy

| Zakres ID | Źródło rzeczywistych portretów |
| --- | --- |
| 0–12 | `window.BVBBatch01Frames`, WebP, `rework/game-0.txt`–`game-1.txt` |
| 13–15 | osadzone oryginalne WebP w `game-14.txt`–`game-15.txt`; nie zastępcza funkcja `art(id)` |
| 16–25 | oryginalne PNG z kluczami `<id>:<tier>`, `game-7.txt`–`game-10.txt` |
| 26–38 | `frameData`, 39 portretów WebP, `game-1.txt`–`game-2.txt` |
| 39–86 | oryginalne PNG z kluczami `<id>:<tier>`, rozłożone w plikach `game-2.txt` i kolejnych |
| 87–108 | `PARTY87_ART`, PNG z kluczami `<id>_V<tier>` |
| 109–129 | osadzone oryginalne PNG z kluczami `<id>:<tier>`, końcowe fragmenty gry |
| 130 | `rework/game-31.txt`, oryginalne PNG `130:1`, `130:2`, `130:3` |

**Weryfikacja kompletności:** 131 unikalnych identyfikatorów × 3 warianty = **393**. Wszystkie 393 wpisy mają oznaczenie `verified_visually: true` w manifeście, a 22 dokumenty cząstkowe zawierają łącznie 393 osobne nagłówki ewolucji i opisy. Weryfikacja obrazów i zapisy źródeł zostały wykonane podczas kolejnych etapów opracowania; nie utożsamiać samej obecności base64 z obejrzeniem obrazu.

## Ograniczenia i zasady odtwarzania

- **WYGLĄD NA ZATWIERDZONYM SZKICU = WYGLĄD W GRZE.** Zatwierdzony szkic jest nadrzędnym wzorcem, jeśli różni się od roboczej grafiki. Ten katalog dokumentuje stan faktycznie wdrożony w podanym commicie oryginalnej pełnej gry.
- Dla Claude/Gemini należy przekazać **konkretny opis V1/V2/V3 oraz odpowiadający mu obraz źródłowy**, jeśli wymagane jest odwzorowanie maksymalnie zbliżone do oryginału. Sam tekst może pozostawiać niedookreślone szczegóły.
- Nie zamieniać stylu części wektorowych portretów na fantasy 3D ani odwrotnie; nie dodawać elementów nieobecnych na obrazie. Zachować przezroczyste tło tam, gdzie jest w źródle.
- `part-13-15-static-unverified.md` opisuje historyczne, uproszczone ikony i **nie jest źródłem właściwych portretów 13–15**.
- Katalog dotyczy **wyglądów statycznych**; nie stanowi specyfikacji animacji, mechanik ani VFX w ruchu.
- To osobna gałąź **dokumentacyjna**. Oryginalna gra i `main` pozostały nietknięte.

## Pliki

`KATALOG_393_DO_CLAUDE_GEMINI.md` — kompletny tekst do przekazania innemu AI; `manifest.json` — 393 identyfikatory, źródła i statusy; `part-00-06.md` … `part-130-trebusz.md` — podział na 22 czytelne części.

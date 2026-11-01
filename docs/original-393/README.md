# Oryginalna gra Ball VS Ball 2.0 — katalog 393 wyglądów

**Status: W TRAKCIE.** Zweryfikowano wizualnie **237 z 393 portretów** (ID 0–77 oraz Trebusz ID 130, V1/V2/V3). **Nie publikować jako katalog kompletny** do czasu ukończenia pozostałych 156 wariantów.

## Ustalenie autentycznego źródła

Repozytorium: `shadow31905/ball-vs-ball`. Punkt odniesienia: **`main`, commit `1de7d74870192bb45896cb5b1e0ecd891aafd5dd`** (1 listopada 2026). Publiczny `index.html` na komputerze lub przy `?full=1` uruchamia `bvb-loader.js`, który składa oryginalną pełną grę z **32 fragmentów** `rework/game-0.txt` … `rework/game-31.txt`. Dla telefonów bez `?full=1` `index.html` przekierowuje do lekkiej wersji `index-safe.html`; jej ikony nie są źródłem pełnych portretów. Nie używać obrazów z gałęzi `beta` zamiast portretów z `main`.

W `rework/game-0.txt` jest oryginalna lista `RAW_BALLS` zawierająca **131 wpisów, ID 0–130**, w tym `Trebusz` jako ID 130. Oczekiwany komplet to **393 ewolucje**, nie 390. **Potwierdzono obecność i rzeczywiście obejrzano wszystkie trzy obrazy Trebusza (ID 130) z `rework/game-31.txt`**; opis w `part-130-trebusz.md`.

## Pochodzenie obrazów

- **ID 0–15:** osadzona w HTML tablica `window.BVBBatch01Frames` — oryginalne portrety WebP, każdy opisany `id`, `tier`, `sourceHash`, `width`, `height`, `anchor`, `data`. Fragmenty zaczynają się w `game-0.txt` i przechodzą przez `game-1.txt`.
- **ID 13–15:** pełne, rzeczywiste obrazy WebP V1/V2/V3 znalezione w `game-14.txt`–`game-15.txt` i wszystkie **9 obejrzane**. Stara funkcja `art(id)` zawiera jedynie uproszczone ikony zastępcze, których **nie używać** jako referencji pełnych portretów; `part-13-15.md`.
- **ID 16–25:** osadzone oryginalne PNG z kluczami `"<id>:<tier>"` w `game-7.txt`–`game-10.txt`; wszystkie 30 obejrzane.
- **ID 26–38:** osadzona tablica 39 obrazów WebP `frameData` w `game-1.txt` i `game-2.txt`, indeks `(id-26)*3+(tier-1)`. Wszystkie 39 obrazów obejrzane.
- **ID 39–77:** osadzone oryginalne obrazy PNG z kluczami `"<id>:<tier>"`; wszystkie 117 obejrzane. **ID 78–129:** kolejne obrazy PNG, ich wyglądy i priorytety ostatnich nadpisań wymagają dalszej weryfikacji. ID 130 (Trebusz) zweryfikowany osobno.
- Wszystkie portrety **muszą być faktycznie wyświetlone i obejrzane** przed nadaniem statusu `verified_visually: true`. Samo istnienie base64 lub kodu to za mało.

## Dokumenty

- `manifest.json`: pełne 393 pozycje, nazwy, ewolucje, flagi weryfikacji, hash źródła dla zweryfikowanych.
- `part-00-06.md`: **21** opisów V1/V2/V3, wszystkie obejrzane.
- `part-07-12.md`: **18** opisów V1/V2/V3, wszystkie obejrzane.
- `part-13-15.md`: **9** właściwych portretów WebP V1/V2/V3, wszystkie obejrzane.
- `part-13-15-static-unverified.md`: historyczna dokumentacja uproszczonych ikon SVG, **nie używać do odtwarzania pełnych wyglądów**.
- `part-16-20.md`: **15** opisów V1/V2/V3, wszystkie obejrzane.
- `part-21-25.md`: **15** opisów V1/V2/V3, wszystkie obejrzane.
- `part-26-32.md`: **21** opisów V1/V2/V3, wszystkie obejrzane.
- `part-33-38.md`: **18** opisów V1/V2/V3, wszystkie obejrzane.
- `part-39-44.md`: **18** opisów V1/V2/V3, wszystkie obejrzane.
- `part-45-51.md`: **21** opisów V1/V2/V3, wszystkie obejrzane.
- `part-52-57.md`: **18** opisów V1/V2/V3, wszystkie obejrzane.
- `part-58-64.md`: **21** opisów V1/V2/V3, wszystkie obejrzane.
- `part-65-70.md`: **18** opisów V1/V2/V3, wszystkie obejrzane.
- `part-71-77.md`: **21** opisów V1/V2/V3, wszystkie obejrzane.
- `part-130-trebusz.md`: **3** opisy V1/V2/V3, wszystkie obejrzane.

## Metoda tworzenia opisów

Dla każdego obrazu osobno zapisuj: kształt i sylwetkę, dominujące kolory, rozkład i kierunki elementów, oczy, mimikę, liczbę i geometrię ostrzy/uzbrojenia, tekstury, materiał, światło, widoczne efekty, proporcje, różnice między ewolucjami oraz instrukcje, czego **nie** dodawać. Nie dopisuj niewidocznych elementów. Wyraźnie rozdzielaj statyczne efekty widoczne na portrecie od animacji w rozgrywce.

**Zasada użytkownika:** „WYGLĄD NA ZATWIERDZONYM SZKICU = WYGLĄD W GRZE”. Szkice w Bibliotece mogą być dodatkowym punktem odniesienia, ale nie są dowodem, że dany obraz jest wdrożony w `main`. Nie deklarować zgodności 1:1 na podstawie samego tekstu — należy dołączyć oryginalny obraz i porównać wynik pikselowo/wizualnie.

## Zasada publikacji

To **osobna gałąź dokumentacyjna**, nie zmienia oryginalnej gry. Kontynuować weryfikację, opisy i aktualizowanie manifestu. **Nie wysyłać użytkownikowi raportów częściowych ani powiadomień**, dopóki katalog nie obejmie wszystkich dostępnych 393 portretów, z uczciwie oznaczonymi brakami.

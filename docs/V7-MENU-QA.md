# Ball VS Ball 2.5 — bramka jakości menu V7 (scena 11)
Data audytu: 2026-11-07. **Wyłącznie gałąź testowa** `rework/menu-film-accurate-20261107`.

## Zweryfikowane fakty
- Referencja wizualna: scena 11 (4:52–5:21), kadry 293, 298, 302, 306, 310, 314, 318, 321. Nie używać nieruchomej klatki filmu jako gotowego interfejsu.
- Rework gry zawiera **131 rzeczywistych grafik SVG V1** w `ART_IMAGES` (130 podstawowych + `Trebusz`). Potwierdzone w Playwright: `B.length=131`, `ART_IMAGES.size=131`.
- Kolekcja i losowanie korzystają z `ART_IMAGES`/oryginalnego `art(id)`, nie z emoji. Zewnętrzny test `tests/v7-film-menu-qa.cjs` sprawdza rzeczywiste grafiki.
- Trzy kompletne grafiki skrzyń pochodzą z filmu V7 (kadr 302 s), wycięte skryptem `scripts/extract_chest_art.py` do `assets/v7-chest-{normal,epic,legend}.webp`. To grafiki pojedynczych przedmiotów, a nie statyczne zdjęcie całego menu.
- Wszystkie trzy skrzynie korzystają z jednego losowania wizualnego; **wynik na taśmie jest tym samym obiektem, który zapisano do ekwipunku**. Normalna skrzynia używa oryginalnych szans 50/30/15/4/1, epicka i legendarna mają odrębne pule. Zapis monet i własności w `localStorage` jest weryfikowany; przy błędzie zapisu stan jest cofany.
- Przycisk fabularny pokazuje `WKRÓTCE`. Stary modal changeloga nie blokuje menu ani rozgrywki.
- Testy Playwright na 1280×720 i 390×844 wykonują nawigację, zrzuty ekranu, losowanie z zapisem i kontrolę zgodności wyniku. Udane przebiegi: GitHub Actions `42391803348` oraz wcześniejsze `42391429395` i `42391360089`. Test realnego wejścia do treningu **PASS na desktopie i telefonie**: GitHub Actions `42392049241`, `G.m=4`, `G.ph=draft`. Wcześniejszy błąd blokujący widoczność `#game` naprawiono przez ograniczenie reguły ukrywającej stary interfejs do czasu, gdy `#menu` jest widoczne.
- Żadna z powyższych zmian nie została opublikowana na `main`.

## Blokery ukończenia 1:1
1. **V2/V3**: aktywny rework zawiera mapę `ART_IMAGES` tylko dla 131 bazowych grafik. Nie ma zweryfikowanego zestawu zatwierdzonych V2/V3 dla wszystkich kulek. Zamiast udawać zgodność, interfejs oznacza brak potwierdzonej grafiki. Starsza gałąź `beta/all-130-visuals-20261031` ma 48 WebP dla pierwszych 16 kulek oraz proceduralny generator 390 SVG, lecz jej dokumentacja ostrzega, że nie wszystkie wyglądy są zatwierdzone. **Nie przenosić ich bez weryfikacji z obowiązującymi szkicami.**
2. **Zgodność wizualna**: wymagane dalsze porównania z filmem: logo 3D, profesjonalne ikony kafli, oświetlenie areny, płynność i skala na telefonach.
3. **Regresja**: nadal potrzebne pełne testy profilu, ustawień, sklepu, multiplayer i rzeczywistego telefonu. PASS pojedynczego scenariusza nie oznacza ukończenia gry.
4. **Zakres skrzyń**: film V7 przedstawia trzy (zwykłą, epicką, legendarną), wcześniejszy plan dwie (zwykłą i eventową). Na gałęzi filmowej odtworzono trzy z kadru; publikacja wymaga akceptacji zakresu.

## Reguła wydania
**Nie oznaczać menu jako ukończonego 1:1, dopóki każdy blocker nie zostanie zamknięty testem i porównaniem z referencją. Nie wdrażać na `main` bez zgody użytkownika.**

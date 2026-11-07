# Ball VS Ball 2.5 — bramka jakości menu V7 (scena 11)
Data audytu: 2026-11-07. **Wyłącznie gałąź testowa** `rework/menu-film-accurate-20261107`.

## Zweryfikowane fakty
- Referencja wizualna: scena 11 (4:52–5:21), kadry 293, 298, 302, 306, 310, 314, 318, 321. Nie używać nieruchomej klatki filmu jako gotowego interfejsu.
- Rework gry zawiera **131 rzeczywistych grafik SVG V1** w `ART_IMAGES` (130 podstawowych + `Trebusz`). Potwierdzone w Playwright: `B.length=131`, `ART_IMAGES.size=131`.
- Kolekcja i losowanie korzystają z `ART_IMAGES`/oryginalnego `art(id)`, nie z emoji. Zewnętrzny test `tests/v7-film-menu-qa.cjs` sprawdza rzeczywiste grafiki.
- Trzy kompletne grafiki skrzyń pochodzą z filmu V7 (kadr 302 s), wycięte skryptem `scripts/extract_chest_art.py` do `assets/v7-chest-{normal,epic,legend}.webp`. To grafiki pojedynczych przedmiotów, a nie statyczne zdjęcie całego menu.
- Z klatki 295 s wycięto oddzielne zatwierdzone elementy interfejsu: `assets/v7-menu-{swords,flag,target,banner,logo}.webp`. Kafle, nawigacja, sklep, kolekcja, losowanie, układ i animacje nadal są żywym HTML/CSS/JS, a nie wklejoną klatką filmu.
- Wszystkie trzy skrzynie korzystają z jednego losowania wizualnego; **wynik na taśmie jest tym samym obiektem, który zapisano do ekwipunku**. Normalna skrzynia używa oryginalnych szans 50/30/15/4/1, epicka i legendarna mają odrębne pule. Zapis monet i własności w `localStorage` jest weryfikowany; przy błędzie zapisu stan jest cofany.
- Przycisk fabularny pokazuje `WKRÓTCE`. Stary modal changeloga nie blokuje menu ani rozgrywki.
- Testy Playwright na 1280×720, **960×540** (oryginalny kadr filmu) i 390×844 wykonują nawigację, zrzuty ekranu, losowanie z zapisem i kontrolę zgodności wyniku. Udane przebiegi: GitHub Actions `42392675321`, `42392902770`, `42392567960`, `42392049241` i wcześniejsze. Test wymusza brak przewijania przy 960×540 i brak poziomego overflow. Test realnego wejścia do treningu **PASS na desktopie i telefonie**: GitHub Actions `42392049241`, `G.m=4`, `G.ph=draft`. Wcześniejszy błąd blokujący widoczność `#game` naprawiono przez ograniczenie reguły ukrywającej stary interfejs do czasu, gdy `#menu` jest widoczne.
- Żadna z powyższych zmian nie została opublikowana na `main`.

## Blokery ukończenia 1:1
1. **V2/V3**: aktywny rework zawiera mapę `ART_IMAGES` dla 131 bazowych grafik V1. Dodatkowo skopiowano **32 wcześniej zatwierdzone grafiki WebP V2/V3 dla ID 0–15** z gałęzi `art/accurate-game-sketch-00-48` do `assets/approved-first16/` (wyłącznie na gałąź testową). Pozostałe warianty **ID 16–130** nie mają zweryfikowanych zatwierdzonych obrazów; interfejs oznacza ich brak. Starsza gałąź `beta/all-130-visuals-20261031` ma generator 390 SVG, lecz jej dokumentacja ostrzega, że nie wszystkie wyglądy są zatwierdzone. **Nie przenosić ich bez weryfikacji z obowiązującymi szkicami.**
2. **Zgodność wizualna**: wymagane dalsze porównania z filmem: logo 3D, profesjonalne ikony kafli, oświetlenie areny, płynność i skala na telefonach.
3. **Regresja**: nadal potrzebne pełne testy profilu, ustawień, sklepu, multiplayer i rzeczywistego telefonu. PASS pojedynczego scenariusza nie oznacza ukończenia gry.
4. **Zakres skrzyń**: film V7 przedstawia trzy (zwykłą, epicką, legendarną), wcześniejszy plan dwie (zwykłą i eventową). Na gałęzi filmowej odtworzono trzy z kadru; publikacja wymaga akceptacji zakresu.

## Reguła wydania
**Nie oznaczać menu jako ukończonego 1:1, dopóki każdy blocker nie zostanie zamknięty testem i porównaniem z referencją. Nie wdrażać na `main` bez zgody użytkownika.**

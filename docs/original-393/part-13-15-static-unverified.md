# ID 13–15 — oryginalne statyczne ikony SVG, NIE zweryfikowane trzy warianty walki

**Źródło:** `main`, commit `1de7d74870192bb45896cb5b1e0ecd891aafd5dd`, `rework/game-0.txt`, funkcja `art(id)`. **Trzy ikony zostały rzeczywiście wyrenderowane z oryginalnego kodu SVG i obejrzane**, ale **NIE potwierdzono pełnych wyglądów w walce dla V1/V2/V3**. Funkcja `art(id)` nie przyjmuje poziomu ewolucji; zwraca ten sam statyczny SVG dla każdego z tych ID. Osobny silnik animacji `BVBFirstSixteen` może rysować dodatkowe elementy zależne od poziomu — dopóki nie zostaną obejrzane wszystkie trzy stany w prawdziwym rendererze, **nie wolno oznaczać tych 9 wariantów jako w pełni wizualnie zweryfikowanych**.

## ID 013 — Laser

**Wspólna statyczna ikona (wyrenderowana i obejrzana):** ciemnogranatowy niemal czarny kwadrat o mocno zaokrąglonych narożnikach, bardzo cienka przygaszona czerwona obwódka. Po lewej na środku **mały stalowoszary prostokąt z jasnym srebrnym obrysem**; z jego prawej krawędzi biegnie **pozioma gruba czerwona linia światła**, z wąskim białym rdzeniem, aż do prawego brzegu. Brak oczu, brak dodatkowego pancerza, brak złota. Płaska, prosta grafika wektorowa.

**V1:** ta statyczna ikona; **wygląd dynamiczny niezweryfikowany**. **V2:** w statycznym `art(13)` ta sama ikona; **ewentualne różnice animacji i wyposażenia niezweryfikowane**. **V3:** ta sama ikona w `art(13)`; **ewentualne różnice dynamiczne niezweryfikowane**.

## ID 014 — Wąż

**Wspólna statyczna ikona (wyrenderowana i obejrzana):** ciemnogranatowy kwadrat o zaokrąglonych narożnikach, bardzo cienka zielona obwódka. W środku **gruba, jasnozielona wężowata linia w kształcie litery S**, kończąca się w prawej górnej części **trójkątną zieloną głową** z białym obrysem i jednym małym białym okrągłym okiem. Ciało bez łusek i bez nóg, brak realistycznego cieniowania. Płaski symbol wektorowy.

**V1:** ta statyczna ikona; **wygląd dynamiczny niezweryfikowany**. **V2:** w statycznym `art(14)` ta sama ikona; **ewentualne różnice długości ogona/animacji niezweryfikowane**. **V3:** ta sama ikona w `art(14)`; **ewentualne różnice dynamiczne niezweryfikowane**.

## ID 015 — Hak

**Wspólna statyczna ikona (wyrenderowana i obejrzana):** ciemnogranatowy kwadrat z zaokrąglonymi narożnikami, bardzo cienka szaroniebieska obwódka. W środku **jeden duży stalowoszary hak o kształcie litery J**: długi pionowy trzon od góry, na dole wygięcie w lewo i krótki ukośny koniec. Na szczycie trzonu **ciemny okrągły pierścień**. Brak oczu, brak twarzy, brak dodatkowych ostrzy, płaski styl wektorowy.

**V1:** ta statyczna ikona; **wygląd dynamiczny niezweryfikowany**. **V2:** w statycznym `art(15)` ta sama ikona; **ewentualne różnice dynamiczne niezweryfikowane**. **V3:** ta sama ikona w `art(15)`; **ewentualne różnice dynamiczne niezweryfikowane**.

**Nie mylić:** opis samego statycznego SVG nie stanowi potwierdzenia obejrzenia wszystkich trzech ewolucji w prawdziwym podglądzie walki.

# Techniczne notatki do kontynuacji — katalog oryginalnych 393 wyglądów

**Stan:** 156/393 opisów ukończonych. 126/393 wariantów indywidualnie wyświetlono i obejrzano (ID 0–15, 26–51); 30/393 wariantów obejrzano jako obrazy na oryginalnej planszy, ale bez osobnej weryfikacji wynikowego cropu (ID 16–25). Następne ID 52–64, potem 65–86, 87–108, 109–130. Nie wysyłać użytkownikowi raportów cząstkowych. Nie zmieniać oryginalnej gry.

## Repozytorium i oryginalny renderer

`shadow31905/ball-vs-ball`, gałąź `main`, punkt odniesienia `1de7d74870192bb45896cb5b1e0ecd891aafd5dd`. `index.html` to loader, pełna gra jest złożona przez `bvb-loader.js` z 32 plików `rework/game-0.txt` do `game-31.txt`. Lista `RAW_BALLS` w `game-0.txt` ma 131 pozycji, w tym Trebusz ID 130.

## Źródła wyglądów

- 0–12: `window.BVBBatch01Frames`, 39 WebP 384×384 w `game-0.txt`–`game-1.txt`.
- 13–15: `BVB_PAINTED1315`, 9 WebP w `game-14.txt`–`game-15.txt`.
- 16–25: `BVB_APPEARANCE_ATLASES[0]` — plansza PNG 941×1704, 30 obrazów. W `game-14.txt` renderer wycina i kluczuje ciemne tło.
- 26–38: `const frameData=[...]`, 39 WebP 224×224 w `game-1.txt`–`game-2.txt`, indeks `(id-26)*3+tier-1`.
- 39–51: `window.BVB3951_SPRITE_SOURCES`, 39 PNG w `game-2.txt`–`game-5.txt`, klucze `"39:1":"data:image/png;base64,..."`.
- 52–64: `BVB_APPEARANCE_ATLASES[1]` — drugi oryginalny atlas PNG w `game-12.txt`–`game-14.txt`, base64 długości 4 481 628. Oryginalny renderer w `game-14.txt` wycina 39 obrazów, usuwa granatowe tło i skaluje do 256×256. Nie opisywać ich wyłącznie na podstawie wcześniejszych opisów z Biblioteki bez wizualnej kontroli. Próby bezpośredniego przekazania 4,48 MB base64 do `image()` kończyły się błędem transportu; potrzebne zmniejszenie rozmiaru PNG / osobne kadry.
- 65–86: osadzone PNG w `game-15.txt`–`game-19.txt`, klucze `"65:1"` itd., renderer `BVBParty65`.
- 87–108: osadzone PNG w `game-19.txt`–`game-25.txt`, renderer `BVBParty87`.
- 109–130: osadzone PNG w `game-25.txt`–`game-31.txt`, `LAST_ART`, klucze `"109:1"` … `"130:3"`.

## SHA blobów GitHub dla źródłowych 2 MB części

```
game-0: 771e449f79ee537103d4b27f6eee3c5bf5b26f8a
game-1: 9680972ff1fd7a41bfe6ee69b712228c03f7c8ef
game-2: 76e74529cd33da9a8bed0db541844b48807ccdcf
game-3: c231509376833a52ec1bc768e7e8a63a643cabce
game-4: b05212193ea3df22de9321a934a1f1617993712f
game-5: a9351bdfd7d413c987e770e67515a2e07cd80af4
game-10: ffe3604b2c432943a8bb97514291734b04e793bf
game-11: d0150e0a97703b97b99248c6bf2801a1f36ae284
game-12: 681fef16abd853626a50a6e1abb8367126251f49
game-13: cffeb6fa6810af0a2967c496baf92ecc8bc27a06
game-14: 86303f5a26e2199f15bef1a0ac4b574135cc9109
game-15: 23dab0bd88c4e1af3073cf76d3c96bdfb6ca5fe7
game-16: b566358cb661a6706f3b52d87189d1195b06f162
game-17: ff7006ca16047c116965c3c03bf4cdc7e482486d
game-18: 899db6c6357e01b5b2fcf7e699ea593a5ba9402b
game-19: 296c55f93704e39971f1a2787642ab050660baf9
game-20: d40b356a52e1feaf3f90c60bd89e424797ca2ef5
game-21: cc4ed0b10d25d8121fe4bcfe29f055b3345c7d55
game-22: 31c1cdee1664faf11504165bbdd051205f46ae70
game-23: 03ca21939477a8c56eb3c9deaee893cbdbefb59a
game-24: 8bfe1b83aedcf9f1e301586c606b30c49d041c6d
game-25: a8d45b0b0e2d7d27d80a7b72d4cfb3ed2aeefc50
game-26: cd4733cb0758c3253d803c464210a02d9e6ff544
game-27: 22eeec5a6871d63af1e97dde7d62c903ec5ae5f7
game-28: 0ce67efebe4b6cc804755017f27b3f933461bf60
game-29: e5340f79d654ace04ce0f5157673615fdbef3836
game-30: 46ca23b9e98e89a7c481d057cc06f4cf506829a5
game-31: f79e01f807c547f9a6bb2842f01f3d5e00e8e95c
```

`mcp__GitHub__fetch_file` zwraca pustą treść dla ogromnych `game-N.txt`, ale podaje SHA; `mcp__GitHub__fetch_blob` z SHA zwraca pełną treść pojedynczej części (2 000 000 znaków, ostatnia krótsza). Aby odczytać grafikę przeciętą na granicy plików, pobrać sąsiednie bloby i połączyć ich `result.content` w jednym `functions.exec`.

Dla osobnych obrazów osadzonych w JS używać dopasowania `/"(\\d+):([123])":"data:image\\/png;base64,([A-Za-z0-9+/=]+)"/g` po złączeniu odpowiednich części, następnie `image("data:image/png;base64,"+match[3],"original")` i dopiero po obejrzeniu napisać opis. Dla bardzo dużego drugiego atlasu trzeba znaleźć sposób na wizualizację mniejszych kadrów.

## Dodatkowe materiały

W Bibliotece użytkownika jest `BVB_ORIGINAL_390_WYGLADY_NOTATKI.md` (ok. 32 KB), zawierający krótkie opisy 393 wariantów i mapę źródeł. **Może służyć jako pomoc w rozpoznawaniu nazw, ale NIE jest dowodem indywidualnego obejrzenia źródłowych obrazów.** Inne szkice z Biblioteki bywają alternatywnymi projektami i nie wolno ich mieszać z wyglądami uruchamianymi przez `main`.

Wszystkie nowe opisy i dowody zapisywać wyłącznie w gałęzi `docs/oryginal-393-opisy`, w katalogu `docs/katalog-393`. Po każdym pakiecie aktualizować `PROGRESS.json` i `README.md`. Dopiero po faktycznej kontroli wszystkich 393 i przygotowaniu pełnego katalogu można powiadomić użytkownika.
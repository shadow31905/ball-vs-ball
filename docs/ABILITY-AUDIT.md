# Ball VS Ball 2.0 — weryfikacja kulek i ewolucji

Ta lista śledzi **rzeczywiście sprawdzone mechaniki**, nie tylko istnienie opisów lub animacji. Repozytorium zawiera implementację dla 130 kulek, ale nie wolno z tego wnioskować, że 130/130 mechanik ma już pełną ręczną akceptację.

## Partie 01–02: kulki 0–15 (16/130 objętych testami mechanicznymi)

Testy z kodem gry: `tests/ability-audit-01-08.test.cjs` i `tests/ability-audit-09-16.test.cjs`. Uruchomienie obu wraz z regresją: `node --test tests/*.test.cjs`.

| ID | Kulka/zdolność | Co jest sprawdzane w prawdziwej symulacji |
| --- | --- | --- |
| 0 | Szarża | Przyspieszenie, realny ładunek kolejnego kontaktu, narastanie V1–V3 |
| 1 | Topór | Wirujące ostrza naprawdę trafiają, rosną w liczbie i wygasają |
| 2 | Kolec | Odbicie tworzy strefę obrażeń i zatrucia, V2–V3 zmieniają obszar |
| 3 | Złodziej | Niskie HP przyspiesza realne pociski, V2–V3 zwiększają liczbę |
| 4 | Żywe Ostrza | Kolejne aktywacje tworzą więcej trafiających ostrzy, limit liczby |
| 5 | Robot | Salwa trafia cel, V1–V3 zwiększają liczbę pocisków |
| 6 | Pająk | Dwie różne ściany łączą pajęczynę, przekroczenie zadaje obrażenia; V3 zatruwa |
| 7 | Wampir | Trafienie wysysa HP i leczy; wyższa ewolucja ma większy zasięg |
| 8 | Włócznia | Po aktywacji przy kontakcie faktycznie odpycha rywala, tylko raz; V2/V3 mocniej |
| 9 | Energetyczna szarża | Fala zadaje obrażenia/odpycha w faktycznym promieniu, rosnącym V2/V3 |
| 10 | Szachy | Kierunkowy ruch i atak; ewolucje dodają prawdziwe pociski |
| 11 | Kostka | Wszystkie sześć wyników daje rzeczywisty efekt, poprawiony opis |
| 12 | Lód | Pociski zadają obrażenia i spowalniają, V2–V3 rozszerzają salwę |
| 13 | Laser ścienny | Odbicie tworzy wiązkę trafiającą przeciwnika, rośnie szerokość |
| 14 | Wężowy ogon | Ślad rani i zatruwa oraz wygasa; V2–V3 go wydłużają |
| 15 | Hak | Rzeczywiste przyciągnięcie, obrażenia, spowolnienie i wzrost mocy |

**Aktualny status:** testy pierwszych 16 mechanik zostały dodane do gałęzi reworku. Ich końcowe potwierdzenie zależy od zielonego CI najnowszego commita. To nie jest jeszcze pełna akceptacja opisów i zachowań całej szesnastki w każdej kombinacji.

### Wykryte i poprawione rozbieżności
- Kulka 8: aktywacja dawała doskok, ale nie miała osobnego, jednorazowego odrzutu opisanego w zdolności; dodano prawdziwy efekt kontaktowy.
- Kulka 9: animacja szarży nie realizowała opisanej fali; dodano obszar trafień i odrzut powiększany przez ewolucję.
- Kulka 11: opis błędnie sugerował, że każdy wynik kostki jest strefą; skorygowano go do sześciu rzeczywistych efektów.

### Pozostałe prace
- Kulki **16–129 (114 kulek)** — analogiczny audyt zdolności aktywnych, pasywek, superów i V1/V2/V3.
- Kontrola zgodności opisów kolekcji, treningu, wyboru przed walką i rzeczywistych efektów.
- Dodatkowe testy czasów odnowienia, wielokrotnych trafień, statusów, przeszkód, zgonu w trakcie efektów i starszych powtórek.
- Próby ręczne na urządzeniach mobilnych i test odbioru zgodności obu stron publicznego 1v1.

Nie przywracać usuniętego obowiązku **pełnego balansu** jako bramki wydania. Audyt poprawności zdolności nie jest bilansem siły wszystkich możliwych starć.

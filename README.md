# 🎮 Ball VS Ball (BVB)

**Graj:** https://shadow31905.github.io/ball-vs-ball/

## 🌐 1vs1 przez internet

1. Oboje otwórzcie grę.
2. Host wybiera **Multiplayer online → Utwórz pokój**.
3. Host wysyła koledze link przyciskiem **Kopiuj link dla znajomego** albo (po konfiguracji kont) zaprasza go z listy znajomych.
4. Kolega otwiera link i klika **Dołącz do pokoju**, a host **Rozpocznij 1vs1**.

BVB używa PeerJS/WebRTC. Gracze mogą być na różnych sieciach Wi-Fi, ale zależy to od NAT i zapór; nie ma obecnie serwera TURN. GitHub Pages udostępnia pliki strony, a nie serwer symulacji gry.

## 👤 Konta BVB — uruchomienie (jednorazowe kroki właściciela)

Po otwarciu gry pojawia się ekran **Zaloguj się / Stwórz konto** (oraz opcja **Graj bez konta**, żeby nie blokować dotychczasowej rozgrywki). Kod ma przygotowane: rejestrację i logowanie e-mail + hasło, odzyskanie hasła, prywatne zapisy gry w chmurze, synchronizację między urządzeniami, pseudonimy, kontakty znajomych, zaproszenia do pokoju 1vs1 i **informacyjny** ranking.

**Konta pozostają wyłączone, dopóki nie podłączysz własnego Firebase.** Przyciski rejestracji/logowania są widoczne na ekranie startowym, ale bez konfiguracji wyświetlają stosowny komunikat. Gra bez kont nadal działa z lokalnym zapisem, więc konfiguracja nie usuwa postępu.

1. Otwórz https://console.firebase.google.com/ i utwórz projekt Firebase.
2. W projekcie dodaj **aplikację webową** (`</>`), skopiuj jej *Firebase web app config* (`apiKey`, `authDomain`, `projectId`, `appId`). To identyfikatory publiczne aplikacji, **nie** klucz administracyjny, hasło ani service account.
3. W **Authentication → Sign-in method** włącz **Email/Password**.
4. W **Authentication → Settings → Authorized domains** dodaj `shadow31905.github.io` (jeśli brak). Nie dodawaj nieznanych domen.
5. Utwórz bazę **Cloud Firestore** w trybie produkcyjnym. W zakładce **Rules** wklej **najnowsze** reguły z pliku [`firestore.rules`](firestore.rules) i kliknij **Publish** (to konieczne do wyłącznej rezerwacji nicków). **Nie ustawiaj `allow read, write: if true`.**
6. Edytuj plik [`firebase-config.js`](firebase-config.js) w repozytorium: zamiast `null` wpisz skopiowany publiczny obiekt `firebaseConfig`. Zostaw `window.BVB_FIREBASE_CONFIG =` i średnik; **nie publikuj prywatnych kluczy ani haseł**.
7. GitHub Pages opublikuje zmianę automatycznie. Otwórz stronę, zakładkę **Konto**, na ekranie startowym stwórz testowe konto z unikalnym nickiem, wybierz **Zachowaj ten postęp w chmurze**, zaloguj się na drugim urządzeniu i wybierz **Wczytaj mój zapis z chmury**.

**Zapis na urządzeniu nie zostaje nadpisany bez pytania.** Wczytanie chmury tworzy kopię poprzedniego lokalnego stanu pod kluczem `bvb_cloud_backup_<timestamp>` w Local Storage przeglądarki. Zalecany jest też **Eksport Zapisu** w Ustawieniach gry.

### 🆔 Unikalne nicki

- Nick ma **3–16 znaków**, tylko litery A–Z, cyfry i `_` (np. `SuperGracz_7`).
- **Wielkość liter nie odróżnia nicków:** `Kuba` i `kuba` to ta sama nazwa.
- Rejestracja i zmiana nicku używają **transakcji Firestore** zapisującej profil wraz z rezerwacją w `nicknames/<nick zapisany małymi literami>`.
- Reguły Firestore sprawdzają spójność tych dokumentów. Gdy dwie osoby próbują jednocześnie zająć ten sam nick, tylko jedna transakcja może się udać.
- Zmiana nicku zwalnia poprzednią nazwę. **Przy wdrażaniu tej wersji należy ponownie opublikować reguły Firestore.**
- Gdy dodajesz konta do już istniejącej bazy Firebase, sprawdź ewentualne stare duplikaty nicków. Stary gracz z konfliktem zostanie poproszony o wybór innego nicku.

### Bezpieczeństwo i ograniczenia

- Firestore `saves/<uid>` może odczytywać i modyfikować wyłącznie zalogowany właściciel. Publiczny profil zawiera pseudonim i statystyki, bez e-maila.
- Ranking jest **nieweryfikowany**: zapisywane z przeglądarki zwycięstwa można sfałszować. Ranking rywalizacyjny wymaga zaufanego backendu walidującego mecze.
- Kontakty znajomych są **jednostronną listą** (dodanie kontaktu nie oznacza akceptacji po drugiej stronie). Zaproszenie do pokoju jest widoczne po kliknięciu **Odśwież zaproszenia** w zakładce Konta. Nie ma automatycznych powiadomień push.
- Dodatkowe zabezpieczenia antyspamowe, antycheat, kontrola kosztów Firestore, App Check i obsługa danych osobowych powinny być skonfigurowane przed publicznym zwiększaniem liczby graczy.
- Nie udostępniaj nikomu swojego hasła, kodów logowania, prywatnego klucza Firebase ani danych administratora. Używaj pseudonimu zamiast pełnego imienia i nazwiska.

## Pliki

- [`index.html`](index.html) — gra i przyciski Konto.
- [`bvb-cloud.js`](bvb-cloud.js) — interfejs kont, autoryzacja Firebase, zapisy, znajomi, ranking.
- [`firebase-config.js`](firebase-config.js) — konfiguracja publicznego projektu Firebase (domyślnie wyłączona).
- [`firestore.rules`](firestore.rules) — wymagane reguły bezpieczeństwa bazy danych.
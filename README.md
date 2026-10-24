# 🎮 Ball VS Ball — online

**Gra:** https://shadow31905.github.io/ball-vs-ball/

## 1vs1 z kolegą

Oboje otwórzcie grę. W **Multiplayer online** jeden gracz klika **Utwórz pokój** i wysyła link drugiemu. Kolega otwiera link i klika **Dołącz do pokoju**, a host **Rozpocznij 1vs1**. Gra używa PeerJS / WebRTC. Różne sieci Wi-Fi mogą działać, ale nie w każdej sieci jest możliwe połączenie bez TURN.

## 👤 Konta — bez Firebase, z Supabase

Ekran startowy ma trzy opcje: **Zaloguj się**, **Stwórz konto**, **Graj bez konta**. Konta online potrzebują bazy danych oraz usługi logowania. Ta wersja korzysta z **Supabase**, nie z Firebase. Usunięto kod Firebase.

**Ważne: samo umieszczenie kodu na GitHub Pages nie uruchomi jeszcze rejestracji.** Jednorazowo trzeba podłączyć własny projekt Supabase.

1. Wejdź na https://supabase.com/dashboard i utwórz projekt.
2. W **SQL Editor** uruchom całą zawartość [`supabase-schema.sql`](supabase-schema.sql). To tworzy profile, prywatne zapisy, listy znajomych i zaproszenia oraz zabezpiecza je przez RLS.
3. W **Authentication → Providers → Email** włącz e-mail i hasło (najbezpieczniej z potwierdzeniem e-mail).
4. W **Authentication → URL Configuration** ustaw `Site URL` na `https://shadow31905.github.io/ball-vs-ball/` i dopisz ten adres do `Redirect URLs`.
5. W **Project Settings → API Keys** skopiuj **Project URL** oraz klucz **publishable** (ewentualnie dawny **anon**). Wklej je w publiczny plik [`supabase-config.js`](supabase-config.js) jako `url` i `publishableKey`.
6. **Nigdy nie publikuj** klucza `service_role`, `secret`, żadnego hasła ani tokenu administratora na GitHubie.
7. Odśwież grę i załóż testowe konto. Gdy potwierdzasz e-mail, po potwierdzeniu zaloguj się ponownie. W zakładce Konto wybierz **Zachowaj obecny postęp w chmurze**, potem sprawdź konto na drugim urządzeniu i wybierz **Wczytaj zapis z chmury**.

### 🔐 Nicki niepowtarzalne

- Nick musi mieć 3–16 znaków: litery A–Z, cyfry i `_`.
- `Kuba` oraz `kuba` to ten sam nick.
- Baza Postgres ma unikalny indeks `lower(nick)` i tworzy profil **w tej samej transakcji co nowe konto**. To blokuje duplikaty, również jeśli dwie osoby rejestrują się jednocześnie.
- Zmiana nicku zwalnia stary nick, którego można użyć ponownie.

### ☁️ Postęp i bezpieczeństwo

- Początkowe lokalne zapisy gry pozostają na urządzeniu. Przed wczytaniem chmury powstaje lokalna kopia zapasowa.
- Hasłami zajmuje się **Supabase Auth**. Kod gry nie przechowuje haseł.
- Każdy gracz ma dostęp tylko do **swojego** zapisu w tabeli `saves` (RLS). Publiczne profile zawierają nick i statystyki, bez e-maila.
- Listy znajomych są jednostronne; zaproszenia do pokoju można zobaczyć w zakładce Konto → Zaproszenia.
- Ranking jest informacyjny. Do prawdziwego rankingu rywalizacyjnego potrzebna jest weryfikacja zwycięstw na zaufanym serwerze, ponieważ dane rozgrywki można zmienić w przeglądarce.
- Zachowaj możliwość eksportu zapisu. Nie wpisuj jako nicku prawdziwego imienia i nazwiska.

## Pliki

- `index.html` — gra BVB
- `bvb-accounts.js` — obsługa kont, zapisów i znajomych Supabase
- `supabase-config.js` — publiczne ustawienia nowego projektu (na razie puste)
- `supabase-schema.sql` — schemat i reguły dostępu do bazy
# 🎮 Ball VS Ball (BVB)

**Graj:** https://shadow31905.github.io/ball-vs-ball/

## ✅ Baza Supabase jest podłączona

Projekt **Ball VS Ball** w Supabase działa i został podłączony do gry w pliku `supabase-config.js`. Baza ma włączone reguły RLS chroniące zapisy graczy. Rejestracja, logowanie, prywatny postęp, znajomi i zaproszenia używają Supabase.

**Uwaga o e-mailach:** Supabase domyślnie wymaga potwierdzenia adresu e-mail. Żeby link w mailu prawidłowo wracał do BVB, właściciel projektu powinien jeszcze ustawić adresy przekierowań w panelu Supabase:

1. Otwórz [Auth → URL Configuration](https://supabase.com/dashboard/project/mcmvowcsvcinnmanejeh/auth/url-configuration).
2. W **Site URL** wpisz `https://shadow31905.github.io/ball-vs-ball/`.
3. Dodaj ten sam adres do **Redirect URLs** i zapisz.

Bez tego potwierdzenie e-maila może prowadzić na domyślny adres `localhost:3000`. Po kliknięciu linku w e-mailu można wtedy ręcznie wrócić do strony gry i spróbować się zalogować.

**Nie udostępniaj nikomu swojego hasła ani kluczy tajnych Supabase.** Klucz `sb_publishable_...` w `supabase-config.js` jest publiczny i może być używany w przeglądarce; nigdy nie umieszczaj tam `service_role` ani klucza `secret`.

## 👤 Konta

- Na początku gry: **Zaloguj się / Stwórz konto / Graj bez konta**.
- Nick: 3–16 znaków; litery A–Z, cyfry i `_`.
- Nazwy nie mogą się powtarzać niezależnie od wielkości liter, np. `Kuba` i `kuba` to ten sam nick. Wymusza to unikalny indeks w bazie.
- Gracz sam decyduje o przesłaniu lokalnego postępu do chmury lub pobraniu istniejącego zapisu. Przed pobraniem gry z chmury tworzona jest lokalna kopia zapasowa.
- Publiczny ranking jest informacyjny: nie ma jeszcze ochrony przed fałszowaniem wyników.

## 🌐 1vs1 przez internet

Obaj gracze otwierają stronę. Jeden wybiera **Multiplayer online → Utwórz pokój** i przesyła link zaproszenia, drugi klika **Dołącz do pokoju**. Host rozpoczyna mecz. Połączenie PeerJS/WebRTC może działać między różnymi sieciami Wi-Fi; nie każda sieć je przepuszcza, ponieważ nie ma serwera TURN.

## 📁 Pliki

- `index.html` — gra BVB
- `bvb-accounts.js` — obsługa kont Supabase
- `supabase-config.js` — bezpieczna publiczna konfiguracja Supabase
- `supabase-schema.sql` — schemat i reguły bezpieczeństwa użyte do tworzenia bazy

**Firebase nie jest używany.**

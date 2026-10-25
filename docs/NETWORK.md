# Połączenia internetowe i TURN

Gra używa PeerJS do sygnalizacji i WebRTC DataChannel do wymiany danych. Host prowadzi symulację. Gość otrzymuje numerowane stany z hashem i odwróconą perspektywą. Na czas utraty kanału host zatrzymuje walkę; gość próbuje wznowić kanał.

## Konfiguracja

Przed uruchomieniem pokoju ustaw w swoim skrypcie konfiguracji:

~~~js
window.BVBNetworkConfig = {
  credentialsUrl: 'https://twoj-backend.example/turn-credentials',
  relayOnly: false
};
~~~

Endpoint powinien zwracać:

~~~json
{
  "iceServers": [
    {
      "urls": ["turns:relay.example:5349"],
      "username": "tymczasowy-uzytkownik",
      "credential": "krotko-wazny-token"
    }
  ]
}
~~~

Endpoint i serwer TURN są usługami poza GitHub Pages. Trzymaj sekret dostawcy wyłącznie na backendzie i wydawaj krótkotrwałe poświadczenia, z ograniczeniem dostępu i liczby żądań. Nie zapisuj stałego hasła TURN ani sekretu dostawcy w repozytorium.

Dla lokalnej konfiguracji można przekazać iceServers bezpośrednio do BVBNetworkConfig; w produkcji preferuj credentialsUrl. Brak skonfigurowanego TURN oznacza połączenia bez gwarancji przejścia przez restrykcyjny NAT. Błędy pobierania konfiguracji są wyświetlane przy tworzeniu pokoju.

## Odbiór sieciowy

1. Dwa okna przeglądarki: utworzenie pokoju, dołączenie, wybór obu kulek i automatyczny start.
2. Ruch, HP, pociski, pajęczyny, przeszkody, fazy bossów i wynik zgodne po zmianie perspektywy.
3. Utrata kanału: host nie symuluje samotnie, ponowne połączenie odtwarza gotowość.
4. Dwie różne sieci Wi-Fi/LTE: sprawdź normalny wybór trasy.
5. Powtórz z relayOnly: true i potwierdź w statystykach WebRTC wybraną parę typu relay.
6. Wygasłe poświadczenia: czytelny błąd lub ponowne pobranie przy kolejnym połączeniu.

Test automatyczny combat-network-browser używa rzeczywistych dwóch RTCPeerConnection i kanałów danych z sygnalizacją prowadzoną przez runner. Nie testuje publicznej usługi sygnalizacyjnej PeerJS, realnych operatorów komórkowych ani serwera TURN.

// Publiczny config aplikacji webowej Firebase (Project Settings → Your apps → Web).
// To NIE jest tajny klucz administracyjny! Nigdy nie dodawaj tu serviceAccount/private_key.
// Dopóki jest null, BVB działa bez kont, a postęp przechowuje lokalnie.
window.BVB_FIREBASE_CONFIG = null;
/* Po utworzeniu własnego projektu Firebase zastąp null np.:
window.BVB_FIREBASE_CONFIG = {
  apiKey: 'PUBLICZNY_WEB_API_KEY',
  authDomain: 'TWOJ-PROJEKT.firebaseapp.com',
  projectId: 'TWOJ-PROJEKT',
  appId: '1:...:web:...'
};
*/
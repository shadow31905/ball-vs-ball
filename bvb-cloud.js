/* BVB Cloud — Firebase Authentication + Cloud Firestore.
   Operates only after the site owner configures firebase-config.js and deploys firestore.rules.
   Never collects passwords outside Firebase Authentication. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import {
  getFirestore, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc,
  collection, query, where, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

const CONFIG = window.BVB_FIREBASE_CONFIG;
const READY = Boolean(CONFIG?.apiKey && CONFIG?.authDomain && CONFIG?.projectId && CONFIG?.appId);
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanNick = s => String(s||'').trim().replace(/\s+/g,' ').slice(0,16);
const friendKey = s => String(s||'').trim().toLocaleLowerCase('pl-PL');
const statusText = err => {
  const code = err?.code || '';
  if (/auth\/email-already-in-use/.test(code)) return 'Ten adres jest już zarejestrowany.';
  if (/auth\/weak-password/.test(code)) return 'Hasło jest zbyt słabe (minimum 6 znaków).';
  if (/auth\/invalid-email/.test(code)) return 'Nieprawidłowy adres e-mail.';
  if (/auth\/invalid-credential|auth\/wrong-password|auth\/user-not-found/.test(code)) return 'Nieprawidłowy e-mail lub hasło.';
  if (/auth\/too-many-requests/.test(code)) return 'Za dużo prób. Spróbuj później.';
  if (/auth\/unauthorized-domain/.test(code)) return 'Dodaj tę domenę w Firebase Authentication → Authorized domains.';
  if (/permission-denied/.test(code)) return 'Brak dostępu do bazy. Sprawdź reguły Firestore.';
  return (err?.message || 'Nie udało się wykonać operacji.').slice(0,180);
};
let app, auth, db, user = null, cloudSave = null, cloudActive = false, syncTimer = null, syncBusy = false, syncAfter = false;
let notice = '', signingUpNick = '', lastUserId = null;
const ownSaveRef = () => doc(db,'saves',user.uid);
const ownProfileRef = () => doc(db,'profiles',user.uid);
const activePanel = () => $('#pn')?.dataset.panel === 'account' && !$('#pn').hidden;
function info(msg) { notice=msg; const p=$('#accountMessage'); if(p) p.textContent=msg; }
function refresh() { if(activePanel()) renderAccount(); }
function nick() { return cleanNick(window.S?.nm || window.S?.nickname || 'Gracz'); }
// Classic script globals (S, K, load, etc.) aren't window properties when declared with let.
// The main game exposes narrow safe bridges under BVBGameBridge.
const game = () => window.BVBGameBridge;
const currentNick = () => cleanNick(game()?.getNickname() || 'Gracz');
const currentStats = () => game()?.stats?.() || {wins:0,level:1};

async function writeProfile() {
  if(!user || !cloudActive) return;
  const n=currentNick(), stats=currentStats();
  await setDoc(ownProfileRef(), {
    uid:user.uid, nick:n, nickKey:friendKey(n),
    wins:Math.max(0,Math.floor(Number(stats.wins)||0)),
    level:Math.max(1,Math.floor(Number(stats.level)||1)), updatedAt:serverTimestamp()
  },{merge:true});
}

async function flush() {
  if(!cloudActive || !user || !READY) return;
  if(syncBusy) {syncAfter=true;return;}
  syncBusy=true;
  try {
    const payload=game()?.exportState?.();
    if(!payload || payload.length>350000) throw new Error('Zapis gry przekracza dopuszczalny rozmiar.');
    await setDoc(ownSaveRef(), {state:payload,updatedAt:serverTimestamp()});
    await writeProfile();
    info('☁️ Postęp zapisany w chmurze.');
  } catch(e) {info('⚠️ Chmura: '+statusText(e)+' Zapis lokalny nadal działa.');}
  finally {syncBusy=false;if(syncAfter){syncAfter=false;scheduleSave();}}
}
function scheduleSave() {
  if(!cloudActive || !user) return;
  clearTimeout(syncTimer);
  syncTimer=setTimeout(()=>{syncTimer=null;void flush();},1800);
}
async function checkSave() {
  cloudActive=false; cloudSave=null;
  try {
    const snap=await getDoc(ownSaveRef());
    if(snap.exists() && typeof snap.data().state==='string') cloudSave=snap.data().state;
    info(cloudSave ? '☁️ Znaleziono zapis w chmurze. Wybierz, który zachować.' : '☁️ To konto nie ma jeszcze zapisu w chmurze. Możesz przesłać obecny postęp.');
    const profile=await getDoc(ownProfileRef());
    if(!profile.exists()) {
      const n=signingUpNick || currentNick();
      await setDoc(ownProfileRef(), {uid:user.uid,nick:n,nickKey:friendKey(n),wins:0,level:1,updatedAt:serverTimestamp()});
    }
  } catch(e) { info('⚠️ Nie można odczytać danych: '+statusText(e)); }
  finally { signingUpNick='';refresh(); }
}

async function useLocal() {
  if(!user) return;
  if(cloudSave && !confirm('Zastąpić zapis w chmurze postępem z tego urządzenia? Dotychczasowy zapis w chmurze zostanie nadpisany.')) return;
  cloudActive=true; cloudSave=null; await flush(); refresh();
}
async function useCloud() {
  if(!user || !cloudSave) return;
  if(!confirm('Wczytać zapis z chmury? Obecny zapis lokalny zostanie zachowany w kopii zapasowej na tym urządzeniu.')) return;
  try {
    const state=JSON.parse(cloudSave);
    if(!state || !Array.isArray(state.own)) throw new Error('Uszkodzony zapis chmurowy.');
    game()?.backup?.();
    if(!game()?.importState?.(cloudSave)) throw new Error('Nie udało się wczytać zapisu.');
    cloudSave=null; cloudActive=true;
    info('✅ Wczytano zapis z chmury.');
    game()?.goMenu?.();
    refresh();
  } catch(e) {info('❌ '+statusText(e));}
}

async function accountAction(action) {
  if(!READY) {info('Firebase nie jest skonfigurowany.');return;}
  const email=$('#accountEmail')?.value?.trim(), pass=$('#accountPass')?.value, n=cleanNick($('#accountNick')?.value);
  try {
    if(action==='register') {
      if(n.length<3) {info('Nick powinien mieć 3–16 znaków.');return;}
      signingUpNick=n;
      await createUserWithEmailAndPassword(auth,email,pass);
      game()?.setNickname?.(n);
      info('✅ Konto utworzone. Wybierz sposób zapisania postępu.');
    } else if(action==='login') {
      await signInWithEmailAndPassword(auth,email,pass);
      info('✅ Zalogowano. Wybierz zapis gry.');
    } else if(action==='reset') {
      if(!email) {info('Wpisz e-mail w formularzu.');return;}
      await sendPasswordResetEmail(auth,email);
      info('Jeśli konto istnieje, otrzymasz e-mail z instrukcją resetowania hasła.');
    }
  } catch(e) {signingUpNick=''; info(statusText(e));}
}
async function logout() {
  clearTimeout(syncTimer);syncTimer=null;
  if(cloudActive) await flush();
  cloudActive=false; cloudSave=null;
  try {await signOut(auth); info('Wylogowano. Postęp lokalny pozostał na tym urządzeniu.');}
  catch(e){info(statusText(e));}
  refresh();
}
async function updateNick() {
  if(!user) return;
  const n=cleanNick($('#newAccountNick')?.value);
  if(n.length<3) {info('Nick powinien mieć 3–16 znaków.');return;}
  try {
    const stats=currentStats();
    await setDoc(ownProfileRef(), {uid:user.uid,nick:n,nickKey:friendKey(n),wins:Math.max(0,Number(stats.wins)||0),level:Math.max(1,Number(stats.level)||1),updatedAt:serverTimestamp()},{merge:true});
    game()?.setNickname?.(n);
    info('✅ Nick zapisany.');refresh();
  } catch(e) {info(statusText(e));}
}

async function friendSearch() {
  if(!user) return;
  const value=friendKey($('#friendSearch')?.value);
  const host=$('#friendResults');if(!host)return;
  host.textContent='Szukam…';
  if(value.length<3) {host.textContent='Wpisz minimum 3 znaki nicku.';return;}
  try {
    const found=await getDocs(query(collection(db,'profiles'),where('nickKey','==',value),limit(12)));
    host.innerHTML='';
    if(found.empty){host.textContent='Nie znaleziono gracza o takim nicku.';return;}
    for(const d of found.docs){
      if(d.id===user.uid)continue;
      const o=d.data();
      const row=document.createElement('div');row.className='cd';row.style.margin='6px 0';
      const label=document.createElement('span');label.textContent=`👤 ${o.nick||'Gracz'} · lvl ${o.level||1}`;
      const b=document.createElement('button');b.className='b ac';b.textContent='➕ Dodaj do znajomych';b.style.marginTop='5px';
      b.onclick=()=>void addFriend(d.id,o.nick);
      row.append(label,b);host.append(row);
    }
  } catch(e) {host.textContent=statusText(e);}
}
async function addFriend(uid,n) {
  if(!user || uid===user.uid)return;
  try {
    // Contact list (follow model): the other player doesn't automatically add you.
    await setDoc(doc(db,'profiles',user.uid,'friends',uid),{uid,nick:cleanNick(n||'Gracz'),addedAt:serverTimestamp()});
    info('✅ Dodano do Twojej listy znajomych.');await loadFriends();
  }catch(e){info(statusText(e));}
}
async function removeFriend(uid) {
  if(!user)return;
  try {await deleteDoc(doc(db,'profiles',user.uid,'friends',uid));info('Usunięto z listy.');await loadFriends();}
  catch(e){info(statusText(e));}
}
async function loadFriends(target='#friendList',inviteMode=false) {
  const el=$(target);if(!el || !user) return;
  el.textContent='Wczytywanie…';
  try {
    const found=await getDocs(query(collection(db,'profiles',user.uid,'friends'),limit(40)));
    el.innerHTML='';
    if(found.empty){el.textContent='Lista znajomych jest pusta.';return;}
    for(const d of found.docs){
      const o=d.data(); const row=document.createElement('div');row.className='cd';row.style.margin='6px 0';
      const label=document.createElement('span');label.textContent='👤 '+(o.nick||'Gracz');
      const b=document.createElement('button');b.className='b';b.style.marginTop='6px';
      if(inviteMode){ b.textContent='📨 Wyślij zaproszenie';b.onclick=()=>void sendInvite(d.id); }
      else { b.textContent='Usuń';b.onclick=()=>void removeFriend(d.id); }
      row.append(label,b);el.append(row);
    }
  }catch(e){el.textContent=statusText(e);}
}
async function showLobbyFriends() {
  const node=$('#netFriendsHint');if(!node)return;
  if(!user){node.textContent='Aby zapraszać znajomych w grze, zaloguj się przez zakładkę Konto.';return;}
  if(!window.BVBGameBridge?.getRoom?.())return;
  node.innerHTML='<h3>👥 Zaproś znajomych z konta</h3><div id="netFriendList"></div>';
  await loadFriends('#netFriendList',true);
}
async function sendInvite(uid) {
  if(!user)return;
  const room=game()?.getRoom?.();
  if(!room){info('Najpierw utwórz pokój 1vs1.');return;}
  try {
    const myName=currentNick();
    await addDoc(collection(db,'inbox',uid,'invites'),{from:user.uid,to:uid,fromNick:myName,room,createdAt:serverTimestamp()});
    info('📨 Wysłano zaproszenie. Znajomy zobaczy je w zakładce Konto → Zaproszenia (po odświeżeniu).');
    const n=$('#netStatus');if(n)n.textContent='Zaproszenie wysłane. Znajomy może sprawdzić je w zakładce Konto.';
  }catch(e){info(statusText(e));const n=$('#netStatus');if(n)n.textContent=statusText(e);}
}
async function loadInvites() {
  if(!user)return;
  const el=$('#inviteList');if(!el)return;
  el.textContent='Wczytywanie…';
  try{
    const found=await getDocs(query(collection(db,'inbox',user.uid,'invites'),limit(20)));
    el.innerHTML='';
    if(found.empty){el.textContent='Brak zaproszeń.';return;}
    for(const d of found.docs){
      const o=d.data(), row=document.createElement('div');row.className='cd';row.style.margin='6px 0';
      const label=document.createElement('div');label.textContent=`🌐 ${o.fromNick||'Gracz'} zaprasza do 1vs1`;
      const accept=document.createElement('button');accept.className='b ac';accept.textContent='Dołącz';
      accept.onclick=async()=>{try{await deleteDoc(d.ref);}catch{};window.BVBGameBridge?.joinRoom?.(String(o.room||''));};
      const remove=document.createElement('button');remove.className='b';remove.textContent='Odrzuć';
      remove.onclick=async()=>{await deleteDoc(d.ref);await loadInvites();};
      row.append(label,accept,remove);el.append(row);
    }
  }catch(e){el.textContent=statusText(e);}
}
async function ranking() {
  const el=$('#rankingResults');if(!el||!user)return;
  el.textContent='Wczytywanie rankingu…';
  try{
    const found=await getDocs(query(collection(db,'profiles'),orderBy('wins','desc'),limit(20)));
    el.innerHTML='';let i=0;
    for(const d of found.docs){const o=d.data();const p=document.createElement('div');p.className='cd';p.style.margin='5px 0';p.textContent=`${++i}. ${o.nick||'Gracz'} — 🏆 ${Math.max(0,Number(o.wins)||0)} zwycięstw`;el.append(p);}
    if(!i)el.textContent='Brak wyników.';
  }catch(e){el.textContent=statusText(e);}
}

function renderAccount() {
  const box=$('#pb');if(!box)return;
  if(!READY) {
    box.innerHTML=`<div class="cd"><h2>👤 Konta BVB</h2><p>System kont został przygotowany, ale właściciel gry musi jeszcze podłączyć projekt Firebase i reguły Firestore.</p><p style="color:var(--mu);margin-top:8px">Do tego czasu działa dotychczasowy zapis na urządzeniu i multiplayer 1vs1.</p></div>`;
    return;
  }
  if(!user){
    box.innerHTML=`<div class="cd"><h2>🔐 Konto BVB</h2><p style="font-size:.84rem;color:var(--mu)">Używaj pseudonimu, nie podawaj tu imienia i nazwiska. Hasło obsługuje Firebase Authentication.</p>
    <label>Nick publiczny (przy rejestracji)</label><input class="inp" id="accountNick" maxlength="16" autocomplete="nickname" placeholder="Twój nick" value="${esc(currentNick())}">
    <label>E-mail</label><input class="inp" id="accountEmail" type="email" autocomplete="email" placeholder="E-mail">
    <label>Hasło</label><input class="inp" id="accountPass" type="password" autocomplete="current-password" placeholder="Hasło (min. 6 znaków)">
    <button class="b graj" onclick="BVBCloud.accountAction('login')">Zaloguj się</button>
    <button class="b ac" onclick="BVBCloud.accountAction('register')">Utwórz konto</button>
    <button class="b" onclick="BVBCloud.accountAction('reset')">Nie pamiętam hasła</button>
    <p id="accountMessage" role="status" style="color:#fde68a;margin-top:9px">${esc(notice)}</p></div>`;
    return;
  }
  box.innerHTML=`<div class="cd"><h2>👤 Twoje konto</h2>
    <p>Zalogowano: <b>${esc(user.email||'')}</b></p>
    <p style="font-size:.85rem">${cloudActive?'☁️ Automatyczny zapis w chmurze włączony':'💾 Zapis lokalny. Wybierz synchronizację.'}</p>
    <p id="accountMessage" role="status" style="color:#fde68a;margin-top:7px">${esc(notice)}</p>
    ${!cloudActive?`<button class="b ac" onclick="BVBCloud.useLocal()">⬆️ Zachowaj ten postęp w chmurze</button>
      ${cloudSave?'<button class="b graj" onclick="BVBCloud.useCloud()">⬇️ Wczytaj mój zapis z chmury</button>':''}`:
      '<button class="b" onclick="BVBCloud.flush()">☁️ Zapisz teraz</button>'}
    <button class="b" onclick="BVBCloud.logout()">Wyloguj</button>
    </div>
    <div class="cd"><h3>✏️ Nick gracza</h3><input class="inp" id="newAccountNick" maxlength="16" placeholder="Nowy nick" value="${esc(currentNick())}"><button class="b" onclick="BVBCloud.updateNick()">Zmień nick</button></div>
    <div class="cd"><h3>👥 Znajomi</h3><p style="font-size:.8rem;color:var(--mu)">Dodawanie po nicku tworzy kontakt na Twojej liście.</p>
      <input class="inp" id="friendSearch" maxlength="16" placeholder="Dokładny nick znajomego"><button class="b" onclick="BVBCloud.friendSearch()">🔎 Szukaj</button>
      <div id="friendResults"></div><h3 style="margin-top:14px">Twoja lista</h3><div id="friendList"></div>
    </div><div class="cd"><h3>📨 Zaproszenia 1vs1</h3><p style="font-size:.82rem;color:var(--mu)">Zaproszenia pojawiają się po kliknięciu „Odśwież”.</p><button class="b" onclick="BVBCloud.loadInvites()">Odśwież zaproszenia</button><div id="inviteList"></div></div>
    <div class="cd"><h3>🏆 Ranking graczy</h3><p style="font-size:.78rem;color:var(--mu)">Ranking informacyjny — wyniki nie są jeszcze weryfikowane przez serwer.</p><button class="b" onclick="BVBCloud.ranking()">Zobacz ranking</button><div id="rankingResults"></div></div>`;
  void loadFriends();void loadInvites();
}

const api={configured:READY,accountAction,renderAccount,useLocal,useCloud,logout,updateNick,friendSearch,addFriend,removeFriend,loadFriends,loadInvites,ranking,flush,scheduleSave,showLobbyFriends,sendInvite,get isOnline(){return Boolean(user)},get saving(){return cloudActive}};
window.BVBCloud=api;
if(READY){
  try{
    app=initializeApp(CONFIG);auth=getAuth(app);db=getFirestore(app);
    onAuthStateChanged(auth,u=>{
      clearTimeout(syncTimer);syncTimer=null;cloudActive=false;
      user=u;
      if(u)void checkSave();
      else {cloudSave=null;info('Zaloguj się lub utwórz konto.');refresh();}
    },e=>{info(statusText(e));refresh();});
  }catch(e){info('Błąd konfiguracji Firebase: '+statusText(e));}
}
window.dispatchEvent(new Event('bvb-cloud-ready'));
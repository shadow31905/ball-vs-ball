/* BVB Accounts — Supabase Auth / Postgres. No Firebase dependency.
   Passwords are handled by Supabase Auth, never stored by the game. */
(() => {
  'use strict';
  const config = window.BVB_SUPABASE_CONFIG || {};
  const READY = Boolean(/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.url || '') && config.publishableKey && window.supabase?.createClient);
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanNick = s => String(s||'').trim();
  const validNick = s => /^[A-Za-z0-9_]{3,16}$/.test(s);
  const game = () => window.BVBGameBridge;
  const stats = () => game()?.stats?.() || {wins:0,level:1};
  const errorText = e => {
    if (!e) return 'Nieznany błąd.';
    const c = String(e.code || ''), m = String(e.message || '');
    if (c==='23505' || /unique|already (exists|registered)|duplicate/i.test(m)) return 'Ten nick lub e-mail jest już zajęty.';
    if (/invalid.*credentials|invalid.*password/i.test(m)) return 'Nieprawidłowy e-mail lub hasło.';
    if (/email.*confirm/i.test(m)) return 'Najpierw potwierdź adres e-mail.';
    if (/row.level.security|permission denied|42501/i.test(m+' '+c)) return 'Brak dostępu do bazy. Sprawdź reguły w supabase-schema.sql.';
    if (/database error saving new user/i.test(m)) return 'Nie udało się założyć konta. Sprawdź, czy nick jest wolny i czy uruchomiono schemat SQL.';
    return m.slice(0,160) || 'Wystąpił błąd połączenia.';
  };
  let db=null,user=null,profileNick='',profileReady=false,cloudSave=null,cloudActive=false;
  let notice='',guestChoice=false,syncTimer=null,syncBusy=false,syncAfter=false,activeFlush=null,gateView='welcome',authSerial=0;
  function info(s){notice=s;const p=$('#accountMessage');if(p)p.textContent=s;}
  function refresh(){if($('#pn')?.dataset.panel==='account' && !$('#pn').hidden) renderAccount();}
  function gateMessage(s){const p=$('#gateMessage');if(p)p.textContent=s||'';}
  function hideGate(){
    const p=$('#accountGate');
    if(!p || p.hidden) return;
    p.hidden=true;
    // Announce that the user actually entered the game, never while choosing an account.
    window.dispatchEvent(new Event('bvb-entered-game'));
  }
  function gateMode(mode='welcome'){
    gateView=mode;
    const root=$('#accountGate'),body=$('#gateBody');if(!root||!body)return;
    root.hidden=false;
    const intro=READY?'Zaloguj się, aby korzystać z konta i zachować postęp na różnych urządzeniach.':
      'Konta online będą dostępne po podłączeniu Supabase. Na razie możesz grać bez konta.';
    if(mode==='welcome'){
      body.innerHTML=`<p style="color:#b9c5ef;margin:0 0 18px">${esc(intro)}</p>
        <button class="b graj" onclick="BVBCloud.gateMode('login')">🔐 Zaloguj się</button>
        <button class="b ac" onclick="BVBCloud.gateMode('register')">✨ Stwórz konto</button>
        <button class="b" onclick="BVBCloud.playGuest()">🎮 Graj bez konta</button>`;
    } else {
      const registering=mode==='register';
      body.innerHTML=`<h3 style="margin-bottom:10px">${registering?'✨ Stwórz konto':'🔐 Zaloguj się'}</h3>
        ${registering?'<label for="gateNick">Nick (3–16 znaków, litery A–Z, cyfry, _)</label><input class="inp" id="gateNick" maxlength="16" autocomplete="nickname" placeholder="Twój unikalny nick">':''}
        <label for="gateEmail">E-mail</label><input class="inp" id="gateEmail" type="email" autocomplete="email" placeholder="E-mail">
        <label for="gatePass">Hasło</label><input class="inp" id="gatePass" type="password" autocomplete="${registering?'new-password':'current-password'}" placeholder="Hasło (minimum 8 znaków)">
        <button class="b graj" onclick="BVBCloud.gateSubmit('${registering?'register':'login'}')">${registering?'Utwórz konto':'Zaloguj się'}</button>
        ${!registering?'<button class="b" onclick="BVBCloud.accountAction(\'reset\',{email:document.querySelector(\'#gateEmail\')?.value})">Przypomnij hasło</button>':''}
        <button class="b" onclick="BVBCloud.gateMode('welcome')">⬅ Wstecz</button>
        <button class="b" onclick="BVBCloud.playGuest()">Graj bez konta</button>`;
    }
    gateMessage(notice);
  }
  function playGuest(){guestChoice=true;hideGate();}
  async function gateSubmit(mode){await accountAction(mode,{nick:$('#gateNick')?.value,email:$('#gateEmail')?.value,pass:$('#gatePass')?.value});}
  async function accountAction(action, values={}){
    if(!READY){info('Konta wymagają połączenia z Supabase. Możesz grać bez konta.');gateMessage(notice);return;}
    const email=String(values.email??$('#accountEmail')?.value??'').trim();
    const pass=String(values.pass??$('#accountPass')?.value??'');
    const n=cleanNick(values.nick??$('#accountNick')?.value);
    try{
      if(action==='register'){
        if(!validNick(n)){info('Nick: 3–16 znaków, litery A–Z, cyfry, _.');gateMessage(notice);return;}
        if(!email || pass.length<8){info('Podaj e-mail i hasło mające przynajmniej 8 znaków.');gateMessage(notice);return;}
        // Friendly pre-check only. PostgreSQL UNIQUE(lower(nick)) is authoritative.
        const exists=await db.from('profiles').select('id').ilike('nick',n).limit(1);
        if(exists.error)throw exists.error;
        if(exists.data?.length){info('Ten nick jest zajęty.');gateMessage(notice);return;}
        const {data,error}=await db.auth.signUp({email,password:pass,options:{data:{nick:n},emailRedirectTo:location.origin+location.pathname}});
        if(error)throw error;
        if(!data?.session){
          info('📧 Konto utworzone. Potwierdź e-mail, a następnie zaloguj się.');
          gateMode('login');gateMessage(notice);
        }else{
          info('✅ Konto utworzone. Wybierz sposób zapisania postępu.');
          await updateCurrentUser();
        }
      } else if(action==='login'){
        const {error}=await db.auth.signInWithPassword({email,password:pass});
        if(error)throw error;
        info('✅ Zalogowano.');
        await updateCurrentUser();
      } else if(action==='reset'){
        if(!email){info('Wpisz adres e-mail.');gateMessage(notice);return;}
        const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
        if(error)throw error;
        info('Jeśli konto istnieje, na e-mail wyślemy wiadomość resetującą hasło.');gateMessage(notice);
      }
    }catch(e){info('⚠️ '+errorText(e));gateMessage(notice);}
    refresh();
  }
  async function updateCurrentUser(){
    if(!db)return;
    const seq=++authSerial;
    const {data:{user:who},error}=await db.auth.getUser();
    if(seq!==authSerial)return;
    if(error){info(errorText(error));return;}
    user=who;profileReady=false;profileNick='';cloudActive=false;cloudSave=null;
    clearTimeout(syncTimer);syncTimer=null;
    if(!user){if(!guestChoice)gateMode('welcome');refresh();return;}
    try{
      const profile=await db.from('profiles').select('nick').eq('id',user.id).single();
      if(profile.error)throw profile.error;
      if(seq!==authSerial)return;
      if(!validNick(profile.data.nick))throw new Error('Konto nie ma prawidłowego nicku.');
      profileNick=profile.data.nick;profileReady=true;
      const saved=await db.from('saves').select('state').eq('user_id',user.id).maybeSingle();
      if(saved.error)throw saved.error;
      if(seq!==authSerial)return;
      cloudSave=typeof saved.data?.state==='string'?saved.data.state:null;
      info(cloudSave?'☁️ Znaleziono zapis w chmurze. Wybierz, który zachować.':'☁️ Możesz przesłać swój obecny zapis do chmury.');
      hideGate();
    }catch(e){info('⚠️ '+errorText(e));gateMode('welcome');gateMessage(notice);}
    refresh();
  }
  function scheduleSave(){if(!db||!user||!profileReady||!cloudActive)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>{syncTimer=null;void flush();},1800);}
  async function flush(){
    if(!cloudActive||!user||!profileReady||!db)return false;
    // A second request must wait for the in-flight save; on logout we cannot
    // sign out before the first database operation has finished.
    if(syncBusy){syncAfter=true;return activeFlush||false;}
    syncBusy=true;
    const accountId=user.id,session=authSerial;
    const current=()=>authSerial===session&&user?.id===accountId&&cloudActive&&profileReady;
    const task=(async()=>{
      try{
        const state=game()?.exportState?.();
        if(!state||state.length>350000)throw new Error('Zapis gry jest zbyt duży.');
        const a=await db.from('saves').upsert({user_id:accountId,state,updated_at:new Date().toISOString()},{onConflict:'user_id'});
        if(a.error)throw a.error;
        // A sign-out or change of account during the network request must
        // never write the old player's statistics into the new profile.
        if(!current())return false;
        const statsNow=stats();
        const b=await db.from('profiles').update({
          wins:Math.max(0,statsNow.wins|0),level:Math.max(1,statsNow.level|0),
          updated_at:new Date().toISOString()
        }).eq('id',accountId);
        if(b.error)throw b.error;
        if(!current())return false;
        info('☁️ Postęp zapisany w chmurze.');
        return true;
      }catch(e){
        if(current())info('⚠️ Chmura: '+errorText(e)+' Zapis lokalny nadal działa.');
        return false;
      }finally{
        syncBusy=false;
        if(syncAfter){syncAfter=false;if(current())scheduleSave();}
      }
    })();
    activeFlush=task;
    try{return await task;}
    finally{if(activeFlush===task)activeFlush=null;}
  }
  async function useLocal(){
    if(!user||!profileReady)return;
    if(cloudSave&&!confirm('Zastąpić poprzedni zapis w chmurze postępem z tego urządzenia?'))return;
    cloudActive=true;cloudSave=null;await flush();refresh();
  }
  async function useCloud(){
    if(!user||!profileReady||!cloudSave)return;
    if(!confirm('Wczytać zapis z chmury? Wcześniejszy zapis na tym urządzeniu zostanie zachowany jako kopia zapasowa.'))return;
    try{
      const state=JSON.parse(cloudSave);
      if(!state||!Array.isArray(state.own))throw new Error('Nieprawidłowy zapis w chmurze.');
      game()?.backup?.();
      if(!game()?.importState?.(cloudSave))throw new Error('Nie udało się odtworzyć zapisu.');
      game()?.setNickname?.(profileNick);
      cloudSave=null;cloudActive=true;
      info('✅ Wczytano postęp z chmury.');game()?.goMenu?.();refresh();
    }catch(e){info(errorText(e));}
  }
  async function logout(){
    if(!db)return;
    clearTimeout(syncTimer);syncTimer=null;
    if(cloudActive)await flush();
    // flush() may have queued a debounce while completing. Never let it
    // upload a previous player's local data after signing out.
    clearTimeout(syncTimer);syncTimer=null;syncAfter=false;
    cloudActive=false;profileReady=false;profileNick='';cloudSave=null;
    // Local scope keeps the other player's devices signed in.
    const {error}=await db.auth.signOut({scope:'local'});if(error){info(errorText(error));return;}
    user=null;guestChoice=false;info('Wylogowano. Zapis lokalny nadal istnieje.');gateMode('welcome');refresh();
  }
  async function updateNick(){
    if(!user||!profileReady)return;
    const n=cleanNick($('#newAccountNick')?.value);
    if(!validNick(n)){info('Nick: 3–16 znaków, litery A–Z, cyfry, _.');return;}
    try{
      const {error}=await db.from('profiles').update({nick:n,updated_at:new Date().toISOString()}).eq('id',user.id);
      if(error)throw error;
      profileNick=n;game()?.setNickname?.(n);info('✅ Zmieniono nick. Poprzedni stał się wolny.');refresh();
    }catch(e){info(errorText(e));refresh();}
  }
  async function friendSearch(){
    if(!user)return;
    const n=cleanNick($('#friendSearch')?.value);const el=$('#friendResults');if(!el)return;
    if(!validNick(n)){el.textContent='Wpisz pełny nick (3–16 znaków).';return;}
    const {data,error}=await db.from('profiles').select('id,nick,level').ilike('nick',n).limit(1);
    if(error){el.textContent=errorText(error);return;}
    el.innerHTML='';if(!data?.length){el.textContent='Nie znaleziono takiego gracza.';return;}
    for(const p of data){if(p.id===user.id){el.textContent='To Twoje konto.';continue;}
      const r=document.createElement('div');r.className='cd';
      const title=document.createElement('p');title.textContent=`👤 ${p.nick} · lvl ${p.level}`;
      const b=document.createElement('button');b.className='b';b.textContent='➕ Dodaj do znajomych';b.onclick=()=>void addFriend(p.id);
      r.append(title,b);el.append(r);
    }
  }
  async function addFriend(uid){
    if(!user||uid===user.id)return;
    const {error}=await db.from('friends').upsert({user_id:user.id,friend_id:uid},{onConflict:'user_id,friend_id'});
    info(error?'⚠️ '+errorText(error):'✅ Dodano do listy znajomych.');void loadFriends();
  }
  async function removeFriend(uid){if(!user)return;const {error}=await db.from('friends').delete().eq('user_id',user.id).eq('friend_id',uid);info(error?errorText(error):'Usunięto.');void loadFriends();}
  async function loadFriends(target='#friendList',inviteMode=false){
    const el=$(target);if(!el||!user)return;el.textContent='Wczytywanie…';
    const f=await db.from('friends').select('friend_id').eq('user_id',user.id).limit(40);
    if(f.error){el.textContent=errorText(f.error);return;}
    el.innerHTML='';if(!f.data?.length){el.textContent='Lista znajomych jest pusta.';return;}
    const uids=f.data.map(x=>x.friend_id);
    const p=await db.from('profiles').select('id,nick').in('id',uids);
    if(p.error){el.textContent=errorText(p.error);return;}
    for(const o of p.data||[]){
      const row=document.createElement('div');row.className='cd';row.style.margin='5px 0';
      const title=document.createElement('p');title.textContent='👤 '+o.nick;
      const b=document.createElement('button');b.className='b';b.textContent=inviteMode?'📨 Wyślij zaproszenie':'Usuń';
      b.onclick=()=>void (inviteMode?sendInvite(o.id):removeFriend(o.id));row.append(title,b);el.append(row);
    }
  }
  async function showLobbyFriends(){
    const node=$('#netFriendsHint');if(!node)return;
    if(!user){node.textContent='Aby zapraszać znajomych z listy, zaloguj się w zakładce Konto.';return;}
    if(!game()?.getRoom?.())return;
    node.innerHTML='<h3>👥 Zaproś znajomego</h3><div id="netFriendList"></div>';
    await loadFriends('#netFriendList',true);
  }
  async function sendInvite(uid){
    if(!user)return;const room=game()?.getRoom?.();
    if(!room){info('Utwórz najpierw pokój 1vs1.');return;}
    const {error}=await db.from('invites').insert({sender_id:user.id,recipient_id:uid,room_code:room});
    info(error?errorText(error):'📨 Zaproszenie wysłane. Znajomy zobaczy je w zakładce Konto.');
    const el=$('#netStatus');if(el)el.textContent=notice;
  }
  async function loadInvites(){
    const el=$('#inviteList');if(!el||!user)return;el.textContent='Wczytywanie…';
    const r=await db.from('invites').select('id,sender_id,room_code').eq('recipient_id',user.id).order('created_at',{ascending:false}).limit(20);
    if(r.error){el.textContent=errorText(r.error);return;}
    el.innerHTML='';if(!r.data?.length){el.textContent='Brak zaproszeń.';return;}
    const ids=[...new Set(r.data.map(x=>x.sender_id))];
    const names=await db.from('profiles').select('id,nick').in('id',ids);
    const byId=new Map((names.data||[]).map(x=>[x.id,x.nick]));
    for(const o of r.data){
      const row=document.createElement('div');row.className='cd';
      const title=document.createElement('p');title.textContent='🌐 '+(byId.get(o.sender_id)||'Gracz')+' zaprasza do 1vs1';
      const accept=document.createElement('button');accept.className='b ac';accept.textContent='Dołącz';
      accept.onclick=async()=>{await db.from('invites').delete().eq('id',o.id);game()?.joinRoom?.(o.room_code);};
      const reject=document.createElement('button');reject.className='b';reject.textContent='Odrzuć';reject.onclick=async()=>{await db.from('invites').delete().eq('id',o.id);void loadInvites();};
      row.append(title,accept,reject);el.append(row);
    }
  }
  async function ranking(){
    const el=$('#rankingResults');if(!el||!user)return;el.textContent='Wczytywanie…';
    const {data,error}=await db.from('profiles').select('nick,wins').order('wins',{ascending:false}).limit(20);
    if(error){el.textContent=errorText(error);return;}
    el.innerHTML='';if(!data?.length){el.textContent='Brak wyników.';return;}
    for(const [i,o] of data.entries()){const p=document.createElement('div');p.className='cd';p.style.margin='5px 0';p.textContent=`${i+1}. ${o.nick} — 🏆 ${o.wins} zwycięstw`;el.append(p);}
  }
  function renderAccount(){
    const box=$('#pb');if(!box)return;
    if(!READY){box.innerHTML='<div class="cd"><h2>👤 Konta BVB</h2><p>Rejestracja i logowanie pojawią się po podłączeniu Supabase. Gra bez konta i 1vs1 działają normalnie.</p></div>';return;}
    if(!user){
      box.innerHTML=`<div class="cd"><h2>🔐 Konto BVB</h2><p>Nicki są unikalne na całym serwerze (Kuba = kuba).</p>
      <label>Nick (przy rejestracji)</label><input class="inp" id="accountNick" maxlength="16" placeholder="Unikalny nick">
      <label>E-mail</label><input class="inp" id="accountEmail" type="email" autocomplete="email" placeholder="E-mail">
      <label>Hasło</label><input class="inp" id="accountPass" type="password" autocomplete="current-password" placeholder="Minimum 8 znaków">
      <button class="b graj" onclick="BVBCloud.accountAction('login')">Zaloguj się</button>
      <button class="b ac" onclick="BVBCloud.accountAction('register')">Stwórz konto</button>
      <button class="b" onclick="BVBCloud.accountAction('reset')">Odzyskaj hasło</button>
      <p id="accountMessage" role="status" style="color:#fde68a;margin-top:8px">${esc(notice)}</p></div>`;
      return;
    }
    box.innerHTML=`<div class="cd"><h2>👤 Twoje konto</h2>
      <p>Zalogowano jako: <b>${esc(profileNick||user.email||'Gracz')}</b></p>
      <p>${cloudActive?'☁️ Zapis w chmurze aktywny':'💾 Wybierz postęp do zachowania.'}</p>
      <p id="accountMessage" role="status" style="color:#fde68a;margin-top:7px">${esc(notice)}</p>
      ${!cloudActive?`<button class="b ac" onclick="BVBCloud.useLocal()">⬆️ Zachowaj obecny postęp w chmurze</button>
        ${cloudSave?'<button class="b graj" onclick="BVBCloud.useCloud()">⬇️ Wczytaj zapis z chmury</button>':''}`:
        '<button class="b" onclick="BVBCloud.flush()">☁️ Zapisz teraz</button>'}
      <button class="b" onclick="BVBCloud.logout()">Wyloguj się</button></div>
      <div class="cd"><h3>✏️ Zmień nick</h3><input class="inp" id="newAccountNick" maxlength="16" value="${esc(profileNick)}"><button class="b" onclick="BVBCloud.updateNick()">Zmień nick</button></div>
      <div class="cd"><h3>👥 Znajomi</h3><input class="inp" id="friendSearch" maxlength="16" placeholder="Nick znajomego"><button class="b" onclick="BVBCloud.friendSearch()">🔎 Szukaj</button><div id="friendResults"></div><h3>Lista znajomych</h3><div id="friendList"></div></div>
      <div class="cd"><h3>📨 Zaproszenia 1vs1</h3><button class="b" onclick="BVBCloud.loadInvites()">Odśwież zaproszenia</button><div id="inviteList"></div></div>
      <div class="cd"><h3>🏆 Ranking graczy</h3><p style="font-size:.78rem;color:var(--mu)">Ranking informacyjny: statystyki nie są weryfikowane przez serwer.</p><button class="b" onclick="BVBCloud.ranking()">Zobacz ranking</button><div id="rankingResults"></div></div>`;
    void loadFriends();void loadInvites();
  }
  const api={configured:READY,accountAction,gateSubmit,gateMode,playGuest,renderAccount,scheduleSave,flush,useLocal,useCloud,logout,updateNick,friendSearch,addFriend,removeFriend,loadFriends,loadInvites,ranking,showLobbyFriends,sendInvite,
    get isOnline(){return Boolean(user&&profileReady)},get nickname(){return profileReady?profileNick:''},get saving(){return cloudActive}};
  window.BVBCloud=api;
  gateMode('welcome');
  if(READY){
    try{
      db=window.supabase.createClient(config.url,config.publishableKey,{
        auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
      });
      db.auth.onAuthStateChange((event,session)=>{
        if(!['INITIAL_SESSION','SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))return;
        if(session?.user?.id && session.user.id===user?.id && profileReady)return;
        setTimeout(()=>void updateCurrentUser(),0);
      });
      void updateCurrentUser();
    }catch(e){info('Błąd połączenia z Supabase: '+errorText(e));gateMode('welcome');}
  }
  window.dispatchEvent(new Event('bvb-cloud-ready'));
})();
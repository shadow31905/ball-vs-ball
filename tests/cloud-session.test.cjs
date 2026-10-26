'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const script=fs.readFileSync(path.join(__dirname,'../bvb-accounts.js'),'utf8');
const tick=()=>new Promise(done=>setTimeout(done,0));
function setup(){
 const events=[],rows=[],profileWrites=[],signedOut=[];
 let account={id:'playerA',email:'a@example.test'},authCallback=null,pauseNext=null;
 const nodes=new Map(),element=selector=>{
  if(!nodes.has(selector))nodes.set(selector,{hidden:false,dataset:{},textContent:'',innerHTML:'',style:{}});
  return nodes.get(selector);
 };
 const db={
  auth:{
   getUser:async()=>({data:{user:account},error:null}),
   onAuthStateChange:callback=>{authCallback=callback;return {data:{subscription:{unsubscribe(){}}}};},
   signOut:async options=>{signedOut.push(options);account=null;authCallback?.('SIGNED_OUT',null);return {error:null};}
  },
  from:table=>{
   if(table==='profiles'){
    return {
     select:()=>({eq:()=>({single:async()=>({data:{nick:'TestPlayer'},error:null})})}),
     update:values=>({eq:async(field,id)=>{profileWrites.push({field,id,values});return {error:null};}})
    };
   }
   if(table==='saves'){
    return {
     select:()=>({eq:()=>({maybeSingle:async()=>({data:null,error:null})})}),
     upsert:async data=>{
      rows.push(data);
      if(pauseNext){const p=pauseNext;pauseNext=null;await p;}
      return {error:null};
     }
    };
   }
   throw Error('Unexpected table '+table);
  }
 };
 const window={
  BVB_SUPABASE_CONFIG:{url:'https://example.supabase.co',publishableKey:'sb_publishable_test'},
  supabase:{createClient:()=>db},
  BVBGameBridge:{exportState:()=>JSON.stringify({own:[0,1,2],coins:17}),stats:()=>({wins:8,level:4})},
  dispatchEvent(type){events.push(type);}
 };
 const context={window,document:{querySelector:element},location:{origin:'https://game.example.test',pathname:'/'},
  Event:class Event{constructor(type){this.type=type;}},setTimeout,clearTimeout,Date,confirm:()=>true};
 vm.runInNewContext(script,context);
 return {
  api:window.BVBCloud,rows,profileWrites,signedOut,events,
  async ready(){for(let n=0;n<6&&!window.BVBCloud.isOnline;n++)await tick();assert.equal(window.BVBCloud.isOnline,true);},
  blockNext(){
   let release;pauseNext=new Promise(done=>release=done);
   return ()=>release();
  },
  changeAccount(id){
   account={id,email:id+'@example.test'};
   authCallback?.('SIGNED_IN',{user:account});
  }
 };
}
test('cloud write binds statistics and progress to the original signed-in account',async()=>{
 const f=setup();await f.ready();
 assert.equal(await f.api.useLocal(),undefined);
 assert.equal(f.rows.length,1);
 assert.equal(f.rows[0].user_id,'playerA');
 assert.equal(f.profileWrites[0].id,'playerA');
 const release=f.blockNext(),pending=f.api.flush();
 await tick();
 assert.equal(f.rows.length,2);
 f.changeAccount('playerB');
 await tick();await tick();
 release();
 await pending;
 assert.equal(f.profileWrites.length,1,'old save response may not write stats to the new profile');
 assert.equal(f.api.isOnline,true);
 assert.equal(f.api.saving,false,'new account must choose its own cloud progress');
});
test('logout waits for an in-progress write before ending the local session',async()=>{
 const f=setup();await f.ready();await f.api.useLocal();
 const release=f.blockNext(),save=f.api.flush();
 await tick();
 const signout=f.api.logout();
 await tick();
 assert.equal(f.signedOut.length,0,'logout must not race a pending save');
 release();
 await Promise.all([save,signout]);
 assert.equal(f.signedOut.length,1);
 assert.equal(f.signedOut[0].scope,'local','do not sign out other devices');
 assert.equal(f.api.saving,false);
 assert.equal(f.profileWrites.length,2);
});

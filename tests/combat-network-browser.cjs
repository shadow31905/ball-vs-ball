'use strict';
// Two isolated Chromium clients communicate through native RTCPeerConnection and
// RTCDataChannel. Only SDP (including gathered ICE candidates) crosses the Node
// test runner. Game packets travel over WebRTC, never through a mocked send().
// This exercises the local RTC transport and BVB protocol. It does not validate
// PeerJS's public signaling service, TURN credentials, NAT traversal, or WAN loss.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.BVB_TEST_URL||'http://127.0.0.1:8765/';
function installRTCAdapter(label){
 const peers=new Map();let peerNumber=0,connectionNumber=0;
 const audit={connections:[],errors:[],lastState:null};
 class Emitter{
  constructor(){this.listeners=new Map();}
  on(type,callback){if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push(callback);return this;}
  emit(type,...args){for(const fn of this.listeners.get(type)||[])fn(...args);}
 }
 async function gather(pc){
  if(pc.iceGatheringState==='complete')return;
  await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{pc.removeEventListener('icegatheringstatechange',changed);reject(new Error('ICE gathering timed out'));},7000);
   function changed(){if(pc.iceGatheringState==='complete'){clearTimeout(timer);pc.removeEventListener('icegatheringstatechange',changed);resolve();}}
   pc.addEventListener('icegatheringstatechange',changed);changed();
  });
 }
 class Connection extends Emitter{
  constructor(owner,remote,id){
   super();this.owner=owner;this.peer=remote;this.id=id;this.open=false;this.closed=false;
   // Loopback-only ICE is intentional: no public STUN/TURN dependency in CI.
   this.pc=new RTCPeerConnection({iceServers:[]});audit.connections.push(this);owner.connections.set(id,this);
   this.pc.addEventListener('connectionstatechange',()=>{
    if(['failed','closed'].includes(this.pc.connectionState))this.close();
   });
  }
  attach(channel){
   this.channel=channel;
   channel.addEventListener('open',()=>{if(this.closed)return;this.open=true;this.emit('open');});
   channel.addEventListener('message',event=>{
    try{const data=JSON.parse(event.data);if(data.type==='state')audit.lastState=data;this.emit('data',data);}
    catch(error){this.emit('error',error);}
   });
   channel.addEventListener('close',()=>this.close());
   channel.addEventListener('error',event=>this.emit('error',new Error(event.error?.message||'RTC data channel error')));
  }
  send(data){
   if(!this.open||this.channel.readyState!=='open')throw new Error('RTC channel is not open');
   this.channel.send(JSON.stringify(data));
  }
  close(){
   if(this.closed)return;this.closed=true;this.open=false;
   try{this.channel?.close();}catch(_){}
   try{this.pc.close();}catch(_){}
   this.emit('close');
  }
 }
 class Peer extends Emitter{
  constructor(){
   super();this.id=label+'-'+(++peerNumber);this.destroyed=false;this.disconnected=false;this.connections=new Map();peers.set(this.id,this);
   window.__bvbSignal({kind:'register',from:this.id}).then(()=>{if(!this.destroyed)this.emit('open',this.id);})
    .catch(error=>this.emit('error',error));
  }
  connect(remote){
   const c=new Connection(this,remote,this.id+':'+(++connectionNumber));
   c.attach(c.pc.createDataChannel('bvb-game',{ordered:true}));
   (async()=>{
    await c.pc.setLocalDescription(await c.pc.createOffer());await gather(c.pc);
    if(!c.closed)await window.__bvbSignal({kind:'offer',from:this.id,to:remote,id:c.id,description:c.pc.localDescription.toJSON()});
   })().catch(error=>{if(!c.closed){audit.errors.push(error.message);c.emit('error',error);}});
   return c;
  }
  reconnect(){this.disconnected=false;this.emit('open',this.id);}
  destroy(){this.destroyed=true;for(const c of this.connections.values())c.close();peers.delete(this.id);}
 }
 async function receive(message){
  const owner=peers.get(message.to);if(!owner||owner.destroyed)throw new Error('Unknown RTC peer '+message.to);
  if(message.kind==='offer'){
   const c=new Connection(owner,message.from,message.id);
   c.pc.addEventListener('datachannel',event=>c.attach(event.channel));
   owner.emit('connection',c);
   await c.pc.setRemoteDescription(message.description);
   await c.pc.setLocalDescription(await c.pc.createAnswer());await gather(c.pc);
   if(!c.closed)await window.__bvbSignal({kind:'answer',from:owner.id,to:message.from,id:c.id,description:c.pc.localDescription.toJSON()});
  }else if(message.kind==='answer'){
   const c=owner.connections.get(message.id);if(!c||c.closed)throw new Error('Unknown RTC connection '+message.id);
   await c.pc.setRemoteDescription(message.description);
  }else throw new Error('Unknown signaling message');
 }
 window.__bvbRTC={receive,audit,peers};
 window.Peer=Peer;
}
// Compare one actually received authoritative packet against the guest game,
// rather than comparing clients at different wall-clock times.
function perspectiveEvidence(){
 const packet=window.__bvbRTC.audit.lastState,s=packet?.state,g=G;
 if(!s||!g||g.matchId!==s.matchId||g.rn!==s.rn||g.rt!==s.rt)return {ok:false,reason:'waiting for accepted state'};
 for(const actor of s.bl){
  const guest=g.bl.find(o=>o.uid===actor.uid);
  if(!guest||guest.hp!==actor.hp||guest.mh!==actor.mh||guest.team!==1-actor.team||
     guest.x!==actor.x||guest.y!==360-actor.y||guest.vx!==actor.vx||guest.vy!==-actor.vy)
   return {ok:false,reason:'fighter perspective mismatch',actor,guest};
 }
 const shot=(s.v2?.shots||[]).find(p=>p.testMarker==='rtc-probe');
 if(!shot)return {ok:false,reason:'waiting for probe projectile'};
 const remote=(g.v2?.shots||[]).find(p=>p.testMarker==='rtc-probe');
 if(!remote||remote.x!==shot.x||remote.y!==360-shot.y||remote.py!==360-shot.py||
    remote.vx!==shot.vx||remote.vy!==-shot.vy||remote.team!==1-shot.team)
  return {ok:false,reason:'projectile perspective mismatch',shot,remote};
 return {ok:true,seq:packet.seq,seconds:g.rt,actors:g.bl.length,hp:g.bl.map(o=>o.hp),probe:true};
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-features=WebRtcHideLocalIpsWithMdns'],
  ...(process.env.BVB_CHROMIUM_PATH?{executablePath:process.env.BVB_CHROMIUM_PATH}:{})});
 const pages=[],contexts=[],errors=[],registry=new Map(),held=[];
 const signaling={offers:0,answers:0,candidates:0};let holdOffers=false;
 async function deliver(message){
  const page=registry.get(message.to);if(!page)throw new Error('No signaling registration for '+message.to);
  return page.evaluate(message=>window.__bvbRTC.receive(message),message);
 }
 async function signal(source,message){
  if(message.kind==='register'){registry.set(message.from,source.page);return true;}
  if(message.kind==='offer')signaling.offers++;else if(message.kind==='answer')signaling.answers++;
  else throw new Error('Unexpected signaling type');
  signaling.candidates+=(message.description.sdp.match(/^a=candidate:/gm)||[]).length;
  if(holdOffers&&message.kind==='offer'){held.push(message);return true;}
  return deliver(message);
 }
 try{
  for(const label of ['host','guest']){
   const context=await browser.newContext({viewport:{width:430,height:900},serviceWorkers:'block'});contexts.push(context);
   await context.exposeBinding('__bvbSignal',signal);
   await context.addInitScript({content:'('+installRTCAdapter.toString()+')('+JSON.stringify(label)+')'});
   // The adapter replaces only signaling/PeerJS API shape. RTC transport stays native.
   // Account cloud access is outside this local multiplayer test.
   await context.route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.origin!==new URL(base).origin&&['http:','https:'].includes(url.protocol))
     return route.fulfill({status:200,contentType:'application/javascript',body:'/* isolated RTC test: external dependency disabled */'});
    return route.continue();
   });
   const page=await context.newPage();pages.push(page);
   page.on('pageerror',error=>errors.push(label+': '+String(error)));
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>typeof hostNet==='function'&&!!window.BVBNetwork&&!!window.BVBRework,null,{timeout:30000});
   await page.evaluate(()=>{document.getElementById('accountGate').hidden=true;mpMenu();});
  }
  const [host,guest]=pages;
  assert.notEqual(contexts[0],contexts[1],'clients need separate storage and page globals');
  await host.evaluate(()=>hostNet());
  await host.waitForFunction(()=>netRole==='host'&&!!peer?.id);
  const room=await host.evaluate(()=>peer.id);
  await guest.evaluate(async code=>{document.getElementById('peerCode').value=code;await joinNet();},room);
  await Promise.all([host.waitForFunction(()=>activeConn?.open&&guestOnlineDeck?.length===3),
   guest.waitForFunction(()=>netRole==='guest'&&activeConn?.open)]);
  await host.click('#netStart');
  await Promise.all([host.waitForFunction(()=>G?.m===12&&G.ph==='draft'),guest.waitForFunction(()=>G?.m===12&&G.ph==='draft')]);
  // Guest sends pick + readiness first; host must retain it while still in draft.
  await guest.evaluate(()=>pick(0));
  await host.waitForFunction(()=>remoteBallId!=null&&remoteAimAngle!=null);
  assert.equal(await host.evaluate(()=>G.ph),'draft');
  await host.evaluate(()=>pick(0));
  await Promise.all([host.waitForFunction(()=>G?.ph==='battle'),guest.waitForFunction(()=>G?.ph==='battle')]);
  const identity=await host.evaluate(()=>({matchId:G.matchId,round:G.rn}));
  assert.deepEqual(await guest.evaluate(()=>({matchId:G.matchId,round:G.rn})),identity,'one shared authoritative round');
  await host.evaluate(()=>{
   G.v2||={shots:[],hazards:[],webs:[],wallBeams:[],beams:[],effects:[],tick:0,serial:0};
   G.v2.shots.push({x:41,y:43,px:40,py:42,vx:13,vy:17,owner:G.bl[0].uid,team:0,id:G.bl[0].b.id,
    damage:.1,r:2,life:8,age:0,homing:0,bounces:0,slow:0,poison:0,burn:0,stun:0,color:'#fff',testMarker:'rtc-probe'});
   broadcastState();
  });
  await guest.waitForFunction('('+perspectiveEvidence.toString()+')().ok',null,{timeout:15000});
  const evidence=await guest.evaluate(perspectiveEvidence);assert.equal(evidence.ok,true,JSON.stringify(evidence));
  assert.equal(evidence.actors,2);assert.equal(evidence.probe,true);
  const transport=await host.evaluate(async()=>{
   const conn=activeConn,stats=Array.from((await conn.pc.getStats()).values());
   return {nativePC:conn.pc instanceof RTCPeerConnection,nativeChannel:conn.channel instanceof RTCDataChannel,
    connection:conn.pc.connectionState,ordered:conn.channel.ordered,
    channels:stats.filter(x=>x.type==='data-channel').map(x=>({messagesSent:x.messagesSent,bytesSent:x.bytesSent}))};
  });
  assert.equal(transport.nativePC,true);assert.equal(transport.nativeChannel,true);assert.equal(transport.connection,'connected');assert.equal(transport.ordered,true);
  assert.ok(transport.channels.some(x=>x.messagesSent>0&&x.bytesSent>0),'game packets must cross actual RTC channel');
  assert.ok(signaling.offers>=1&&signaling.answers>=1&&signaling.candidates>=2,'SDP exchange must carry real ICE candidates');
  // Hold the next SDP offer, allowing a measurable pause before reconnection.
  holdOffers=true;
  await guest.evaluate(()=>activeConn.close());
  await host.waitForFunction(()=>!activeConn?.open);
  const pausedAt=await host.evaluate(()=>G.rt);
  await host.waitForTimeout(350);
  assert.equal(await host.evaluate(()=>G.rt),pausedAt,'authoritative simulation must pause when its guest disconnects');
  await host.waitForFunction(()=>G.ph==='battle');
  const deadline=Date.now()+6000;
  while(!held.length&&Date.now()<deadline)await host.waitForTimeout(50);
  assert.ok(held.length,'guest must automatically attempt reconnection');
  assert.equal(await host.evaluate(()=>G.rt),pausedAt,'host stays paused during incomplete RTC negotiation');
  holdOffers=false;
  for(const message of held.splice(0))await deliver(message);
  await Promise.all([host.waitForFunction(()=>activeConn?.open),guest.waitForFunction(()=>activeConn?.open)]);
  await host.waitForFunction(t=>G.rt>t+.1,pausedAt,{timeout:10000});
  assert.deepEqual(await host.evaluate(()=>({matchId:G.matchId,round:G.rn})),identity,'reconnect resumes the existing round');
  await guest.waitForFunction('('+perspectiveEvidence.toString()+')().ok',null,{timeout:10000});
  assert.deepEqual(await guest.evaluate(()=>({matchId:G.matchId,round:G.rn})),identity);
  const adapterErrors=await Promise.all(pages.map(p=>p.evaluate(()=>window.__bvbRTC.audit.errors)));
  assert.deepEqual(adapterErrors,[[],[]]);assert.deepEqual(errors,[],'no uncaught browser exceptions');
  process.stdout.write('PASS two-client native WebRTC: deck, guest-first readiness, automatic start, HP/position/projectile perspective, disconnect pause and reconnection.\\n');
  process.stdout.write('Coverage: local RTC transport + BVB protocol; public PeerJS signaling and TURN/WAN require separate tests.\\n');
 }catch(error){
  for(let i=0;i<pages.length;i++){
   const status=await pages[i].evaluate(()=>({role:netRole,phase:G?.ph,rt:G?.rt,open:activeConn?.open,status:document.getElementById('netStatus')?.textContent,adapterErrors:window.__bvbRTC.audit.errors})).catch(()=>({closed:true}));
   console.error('Client '+i+' diagnostic:',status);
  }
  throw error;
 }finally{for(const context of contexts)await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

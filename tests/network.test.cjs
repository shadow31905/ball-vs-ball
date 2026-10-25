'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function api(extra={}){const window={...extra};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../bvb-network.js'),'utf8'),{window,URL,location:{href:'https://example.test/game/',origin:'https://example.test'}});return window.BVBNetwork;}
function state(){const b=id=>({id,n:'Kulka '+id});return {m:12,ph:'battle',matchId:'test',rn:1,h:[3,2],rt:1,my:[b(0)],bt:[b(1)],pb:b(0),bb:b(1),bl:[{b:b(0),team:0,x:180,y:300,vx:1,vy:-1,hp:50,mh:100,r:17,status:{}}],v2:{shots:[{team:0,x:10,y:50,py:48,vy:100}],webs:[{team:1,a:{x:1,y:30},b:{x:359,y:60}}],beams:[{y:20,y2:90}],effects:[],hazards:[]},obstacles:[{x:100,y:120,dy:2}],bossTelegraph:{x:50,y:80,zones:[{shape:'circle',x:20,y:50}]}};}
test('host perspective maps all nested projectiles, webs, beams, obstacles and boss marks without mutation',()=>{const n=api(),host=state(),s=n.guestState(host);assert.equal(host.bl[0].y,300);assert.equal(s.bl[0].y,60);assert.equal(s.bl[0].team,1);assert.equal(s.v2.shots[0].y,310);assert.equal(s.v2.shots[0].py,312);assert.equal(s.v2.shots[0].vy,-100);assert.equal(s.v2.webs[0].a.y,330);assert.equal(s.v2.beams[0].y2,270);assert.equal(s.obstacles[0].dy,-2);assert.equal(s.bossTelegraph.zones[0].y,310);assert.equal(s.my[0].id,1);assert.equal(s.h[0],2);});
test('protocol rejects old sequence, wrong version, malformed fighters and oversized payload',()=>{const n=api(),r=n.receiver(),packet=seq=>({protocol:2,seq,state:state()});assert.equal(r.accept(packet(1)),true);assert.equal(r.accept(packet(1)),false);assert.equal(r.accept({...packet(2),protocol:1}),false);let bad=packet(2);bad.state.bl[0].hp=NaN;assert.equal(r.accept(bad),false);bad=packet(2);bad.state.fx=Array(201).fill({});assert.equal(r.accept(bad),false);bad=packet(2);bad.state.extra='x'.repeat(850001);assert.equal(r.accept(bad),false);assert.equal(r.accept(packet(3)),true);r.reset();assert.equal(r.accept(packet(1)),true);});
test('TURN is opt-in and only valid ICE URLs enter PeerJS configuration',()=>{const n=api();const p=n.peerOptions({relayOnly:true,iceServers:[{urls:['turns:relay.example.test:5349'],username:'short-lived',credential:'token'},{urls:'https://unsafe.test'}]});assert.equal(p.config.iceTransportPolicy,'relay');assert.equal(p.config.iceServers.length,2);assert.equal(p.config.iceServers[1].username,'short-lived');});

test('perspective reflects rectangle extents and both line endpoints; mirroring twice restores geometry',()=>{
 const n=api(),mark={zones:[
  {kind:'rect',x:7,y:97,w:76,h:76},
  {kind:'line',x1:10,y1:20,x2:350,y2:300,width:17},
  {kind:'ring',x:180,y:90,inner:40,r:90},
  {kind:'circle',x:50,y:80,r:30}
 ]};
 const guest=n.mirror(mark);
 assert.equal(guest.zones[0].y,187);
 assert.equal(guest.zones[1].y1,340);assert.equal(guest.zones[1].y2,60);
 assert.equal(guest.zones[2].y,270);assert.equal(guest.zones[2].inner,40);
 assert.equal(JSON.stringify(n.mirror(guest)),JSON.stringify(mark));
});
test('validation rejects nested nonfinite data, unsafe prototypes, cycles and excessive depth',()=>{
 const n=api();
 const cases=[
  s=>{s.v2.shots[0].vx=Infinity;},
  s=>{s.obstacles[0].dy=NaN;},
  s=>{s.bl[0].status=null;},
  s=>{s.bl[0].x=1e8;},
  s=>{s.my[0].c='#fff" onmouseover="alert(1)';},
  s=>{s.my.push({id:2,n:'2'},{id:3,n:'3'},{id:4,n:'4'});},
  s=>{s.extra=JSON.parse('{"__proto__":{"polluted":true}}');},
  s=>{s.extra=s;},
  s=>{let v=s;for(let i=0;i<30;i++){v.extra={};v=v.extra;}}
 ];
 for(const mutate of cases){const s=state();mutate(s);assert.equal(n.validState(s),false);}
 const s=state();assert.equal(n.validState(s),true);
});
test('receiver rejects time, phase, round rollback and resurrected matches even at newer sequence numbers',()=>{
 const n=api(),r=n.receiver(),packet=(seq,changes={})=>({protocol:2,seq,state:{...state(),...changes}});
 assert.equal(r.accept(packet(1)),true);
 assert.equal(r.accept(packet(2,{rt:.8})),false);
 assert.equal(r.accept(packet(3,{ph:'aim'})),false);
 assert.equal(r.accept(packet(4,{rn:0})),false);
 assert.equal(r.accept(packet(5,{ph:'end',rt:2})),true);
 assert.equal(r.accept(packet(6,{rn:2,ph:'draft',rt:0})),true);
 assert.equal(r.accept(packet(7,{matchId:'rematch',rn:1,ph:'draft',rt:0})),true);
 assert.equal(r.accept(packet(8,{rn:3,ph:'draft',rt:0})),false);
 r.reset();assert.equal(r.accept(packet(0)),true);
});
test('receiver checks provided state hashes and does not throw for hostile packets',()=>{
 const n=api({BVBRework:{stateHash:()=> '1234abcd'}}),r=n.receiver();
 assert.equal(r.accept({protocol:2,seq:1,state:state(),hash:'bad'}),false);
 assert.equal(r.accept({protocol:2,seq:1,state:state(),hash:'ffffffff'}),false);
 assert.equal(r.accept({protocol:2,seq:1,state:state(),hash:'1234abcd'}),true);
 assert.equal(r.accept({get protocol(){throw Error('bad getter');}}),false);
});
test('malformed optional ICE entries are ignored without crashing setup',()=>{
 const n=api();
 assert.equal(n.peerOptions(null).config.iceServers.length,1);
 assert.equal(n.peerOptions({iceServers:{bad:true}}).config.iceServers.length,1);
 const p=n.peerOptions({iceServers:[null,{},'turn:bad',{urls:['turns:ok.test:5349','https://bad.test']},{urls:'turn:ok.test:3478?transport=udp'}]});
 assert.equal(p.config.iceServers.length,2);
});

test('real game snapshots including uint32 RNG and identity jobs survive protocol validation',()=>{
 const {createGame}=require('./game-harness.cjs'),game=createGame();
 game.run("startMatch(0);pick(0);G.m=12;BVBRework.setSeed(G,0xffffffff)");
 for(let i=0;i<5;i++){
  assert.equal(game.run("BVBNetwork.validState(JSON.parse(JSON.stringify(G)))"),true);
  game.run("for(let i=0;i<120&&G.ph==='battle';i++)step(1/60)");
 }
});

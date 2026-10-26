'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../bvb-network.js'),'utf8');
function setup(config={},fetcher=async()=>{throw Error('unexpected request')}){
 const window={BVBNetworkConfig:config};
 const requests=[];
 const ctx={window,URL,location:{href:'https://game.example.test/ball-vs-ball/',origin:'https://game.example.test'},
  AbortSignal:{timeout:n=>({testTimeout:n})},
  fetch:async(url,options)=>{requests.push({url:String(url),options});return fetcher(url,options);}};
 vm.runInNewContext(source,ctx);
 return {api:window.BVBNetwork,requests};
}
test('relayOnly cannot silently start with STUN-only configuration',()=>{
 const {api}=setup();
 assert.throws(()=>api.peerOptions({relayOnly:true}),/TURN-only/);
 assert.throws(()=>api.peerOptions({relayOnly:true,iceServers:[{urls:'stun:stun.example.test:3478'}]}),/TURN-only/);
 const config=api.peerOptions({relayOnly:true,iceServers:[{urls:['stun:stun.example.test:3478','turns:relay.example.test:5349'],username:'short',credential:'secret'}]});
 assert.equal(config.config.iceTransportPolicy,'relay');
 assert.equal(config.config.iceServers.length,2);
 assert.equal(config.config.iceServers[1].credential,'secret');
 assert.equal(api.peerOptions().config.iceTransportPolicy,'all');
});
test('ephemeral TURN credentials are fetched over HTTPS with no-store, not through public JS',async()=>{
 const {api,requests}=setup({relayOnly:true,credentialsUrl:'https://ice.example.test/session'},async()=>({
  ok:true,json:async()=>({iceServers:[{urls:['turn:relay.example.test:3478?transport=udp','turns:relay.example.test:5349'],username:'temporary',credential:'temporary-token'}]})
 }));
 const value=await api.refreshIce();
 assert.equal(requests.length,1);
 assert.equal(requests[0].url,'https://ice.example.test/session');
 assert.equal(requests[0].options.credentials,'omit');
 assert.equal(requests[0].options.cache,'no-store');
 assert.equal(requests[0].options.signal.testTimeout,8000);
 assert.equal(value.config.iceTransportPolicy,'relay');
 assert.equal(value.config.iceServers[1].username,'temporary');
});
test('TURN refuses unsafe credential endpoints, unavailable responses and non-TURN data',async()=>{
 for(const url of ['http://ice.example.test/session','javascript:alert(1)']){
  const {api,requests}=setup({relayOnly:true,credentialsUrl:url});
  await assert.rejects(()=>api.refreshIce(),/HTTPS/);
  assert.equal(requests.length,0);
 }
 const {api:badHttp}=setup({relayOnly:true,credentialsUrl:'/session'},async()=>({ok:false,status:503}));
 await assert.rejects(()=>badHttp.refreshIce(),/TURN/);
 const {api:badShape}=setup({relayOnly:true,credentialsUrl:'/session'},async()=>({ok:true,json:async()=>({iceServers:{urls:'turn:invalid'}})}));
 await assert.rejects(()=>badShape.refreshIce(),/TURN/);
 const {api:stunOnly}=setup({relayOnly:true,credentialsUrl:'/session'},async()=>({ok:true,json:async()=>({iceServers:[{urls:'stun:example.test:3478'}]})}));
 await assert.rejects(()=>stunOnly.refreshIce(),/TURN-only/);
});
test('relay diagnostics inspect the nominated candidate pair rather than guessing the transport',async()=>{
 const {api}=setup();
 const stats=types=>new Map([
  ['transport',{id:'transport',type:'transport',selectedCandidatePairId:'pair'}],
  ['pair',{id:'pair',type:'candidate-pair',state:'succeeded',nominated:true,localCandidateId:'local',remoteCandidateId:'remote',currentRoundTripTime:.045}],
  ['local',{id:'local',type:'local-candidate',candidateType:types[0],protocol:'udp'}],
  ['remote',{id:'remote',type:'remote-candidate',candidateType:types[1]}]
 ]);
 const pc=(a,b)=>({peerConnection:{getStats:async()=>stats([a,b])}});
 assert.equal((await api.connectionReport(pc('relay','srflx'))).route,'relay');
 assert.equal((await api.connectionReport(pc('srflx','relay'))).route,'relay');
 const direct=await api.connectionReport(pc('host','srflx'));
 assert.equal(direct.route,'direct');assert.equal(direct.rttMs,45);
 assert.equal((await api.connectionReport({})).route,'unknown');
});

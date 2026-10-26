/* Host-authoritative network protocol and perspective transforms. */
(() => {
'use strict';
const VERSION=2, MAX_BYTES=850000;
const clone=x=>JSON.parse(JSON.stringify(x));
function peerOptions(config=window.BVBNetworkConfig||{}) {
  config=config&&typeof config==='object'?config:{};
  const servers=[{urls:'stun:stun.l.google.com:19302'}];
  for(const item of (Array.isArray(config.iceServers)?config.iceServers:[]).slice(0,32)) {
    if(!item||typeof item!=='object')continue;
    const urls=Array.isArray(item.urls)?item.urls:[item.urls];
    if(!urls.length||urls.length>16||!urls.every(u=>typeof u==='string'&&u.length<=1024&&/^(stun|turn|turns):[^@\s]+$/.test(u)))continue;
    servers.push({urls, ...(typeof item.username==='string'?{username:item.username}:{}),
      ...(typeof item.credential==='string'?{credential:item.credential}:{})});
  }
  return {config:{iceServers:servers,iceTransportPolicy:config.relayOnly?'relay':'all'}};
}
async function refreshIce(config=window.BVBNetworkConfig||{}) {
  if(!config.credentialsUrl)return peerOptions(config);
  const url=new URL(config.credentialsUrl,location.href);
  if(url.origin!==location.origin&&url.protocol!=='https:')throw Error('TURN wymaga HTTPS.');
  const response=await fetch(url,{credentials:url.origin===location.origin?'same-origin':'omit',cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw Error('Nie udało się pobrać konfiguracji TURN.');
  const body=await response.json();
  if(!Array.isArray(body.iceServers))throw Error('Nieprawidłowa konfiguracja TURN.');
  return peerOptions({...config,iceServers:body.iceServers});
}
// Peer data is untrusted even when the transport is connected. Bound traversal
// before cloning/rendering, and reject non-JSON objects and dangerous keys.
function safeTree(value) {
  let nodes=0;
  function visit(v,depth) {
    if(++nodes>24000||depth>24)return false;
    if(v==null||typeof v==='boolean')return true;
    if(typeof v==='number')return Number.isFinite(v)&&Math.abs(v)<=1e15;
    if(typeof v==='string')return v.length<=6000;
    if(typeof v!=='object'||Object.prototype.toString.call(v)!==(Array.isArray(v)?'[object Array]':'[object Object]'))return false;
    const keys=Object.keys(v);
    if(keys.length>1200)return false;
    for(const key of keys){
      if(['__proto__','constructor','prototype'].includes(key)||key.length>160||!visit(v[key],depth+1))return false;
      if(['r','radius','inner','width','size'].includes(key)&&(!Number.isFinite(v[key])||v[key]<0||v[key]>10000))return false;
      if(['x','y','x1','y1','x2','y2','px','py'].includes(key)&&(!Number.isFinite(v[key])||Math.abs(v[key])>1000000))return false;
    }
    return true;
  }
  try{return visit(value,0);}catch(_){return false;}
}
function validState(s) {
  if(!safeTree(s))return false;
  if(!s||typeof s!=='object'||s.m!==12||!['draft','aim','battle','end'].includes(s.ph))return false;
  if(typeof s.matchId!=='string'||!s.matchId.length||s.matchId.length>100||!Number.isInteger(s.rn)||s.rn<0||s.rn>10000)return false;
  if(!Array.isArray(s.h)||s.h.length!==2||!s.h.every(n=>Number.isInteger(n)&&n>=0&&n<=100))return false;
  const ball=b=>b&&Number.isInteger(b.id)&&b.id>=0&&b.id<130&&typeof b.n==='string'&&b.n.length<100&&(b.c==null||(typeof b.c==='string'&&/^#[0-9a-f]{3,8}$/i.test(b.c)));
  if(![s.my,s.bt].every(a=>Array.isArray(a)&&a.length>0&&a.length<=3&&a.every(ball)))return false;
  if([s.pb,s.bb].some(b=>b!=null&&!ball(b)))return false;
  if(!Array.isArray(s.bl)||s.bl.length>2||!s.bl.every(o=>ball(o.b)&&[o.x,o.y,o.vx,o.vy,o.hp,o.mh,o.r].every(Number.isFinite)&&[0,1].includes(o.team)&&o.r>0&&o.r<=80&&o.mh>0&&Math.abs(o.x)<=1000&&Math.abs(o.y)<=1000&&Math.abs(o.vx)<=1000&&Math.abs(o.vy)<=1000&&o.status&&typeof o.status==='object'&&!Array.isArray(o.status)))return false;
  if(!Number.isFinite(s.rt)||s.rt<0||s.rt>65)return false;
  const caps={pr:96,z:48,fx:200,rings:64,pop:64,obstacles:12,events:100,lightning:16};
  for(const [key,max] of Object.entries(caps))if(s[key]!=null&&(!Array.isArray(s[key])||s[key].length>max))return false;
  const v=s.v2;
  if(v)for(const key of ['shots','hazards','webs','wallBeams','beams','effects'])if(v[key]!=null&&(!Array.isArray(v[key])||v[key].length>250))return false;
  try{return JSON.stringify(s).length<=MAX_BYTES;}catch(_){return false;}
}
// Recursively mirror geometric fields, never IDs, durations or scalar metadata.
function mirror(value) {
  if(Array.isArray(value))return value.map(mirror);
  if(!value||typeof value!=='object')return value;
  const out={};
  for(const [key,v] of Object.entries(value)){
    if(['__proto__','constructor','prototype'].includes(key))continue;
    if(key==='y'&&value.kind==='rect'&&Number.isFinite(v)&&Number.isFinite(value.h))out[key]=360-v-value.h;
    else if(['y','y1','y2','py','_lastY','targetY','fromY','toY'].includes(key)&&Number.isFinite(v))out[key]=360-v;
    else if(['vy','dy','spin','angle','rotation','angularVelocity'].includes(key)&&Number.isFinite(v))out[key]=-v;
    else if(key==='team'&&[0,1].includes(v))out[key]=1-v;
    else out[key]=mirror(v);
  }
  return out;
}
function guestState(host) {
  const s=mirror(host);
  s.my=clone(host.bt);s.bt=clone(host.my);
  s.pb=host.bb?clone(host.bb):null;s.bb=host.pb?clone(host.pb):null;
  s.h=[host.h[1],host.h[0]];
  s.lastRoundWinner=[0,1].includes(host.lastRoundWinner)?1-host.lastRoundWinner:-1;
  if(host.tactics)s.tactics={0:host.tactics[1],1:host.tactics[0]};
  return s;
}
function receiver() {
  let last=-1,match=null,round=-1,phase=-1,time=0;
  const retired=new Set(),phases={draft:0,aim:1,battle:2,end:3};
  return {
    reset(){last=-1;match=null;round=-1;phase=-1;time=0;retired.clear();},
    accept(packet){
      try{
        if(!packet||packet.protocol!==VERSION||!Number.isSafeInteger(packet.seq)||packet.seq<0||packet.seq<=last||!validState(packet.state))return false;
        const s=packet.state;
        if(packet.hash!=null&&(typeof packet.hash!=='string'||!/^[a-f0-9]{8}$/.test(packet.hash)||window.BVBRework?.stateHash?.(s)!==packet.hash))return false;
        if(retired.has(s.matchId))return false;
        if(s.matchId===match&&(s.rn<round||(s.rn===round&&(phases[s.ph]<phase||s.rt+1e-6<time))))return false;
        if(match&&s.matchId!==match){retired.add(match);if(retired.size>16)retired.delete(retired.values().next().value);}
        last=packet.seq;match=s.matchId;round=s.rn;phase=phases[s.ph];time=s.rt;return true;
      }catch(_){return false;}
    },
    get sequence(){return last;}
  };
}
async function connectionReport(conn) {
 const pc=conn?.peerConnection||conn?.pc;
 if(!pc?.getStats)return {route:'unknown'};
 const rows=Array.from((await pc.getStats()).values()),byId=new Map(rows.map(r=>[r.id,r]));
 const transport=rows.find(r=>r.type==='transport'&&r.selectedCandidatePairId);
 const pair=transport?byId.get(transport.selectedCandidatePairId):rows.find(r=>r.type==='candidate-pair'&&r.state==='succeeded'&&(r.nominated||r.selected));
 if(!pair)return {route:'connecting'};
 const local=byId.get(pair.localCandidateId),remote=byId.get(pair.remoteCandidateId);
 return {route:local?.candidateType==='relay'||remote?.candidateType==='relay'?'relay':'direct',protocol:local?.protocol||null,rttMs:Number.isFinite(pair.currentRoundTripTime)?Math.round(pair.currentRoundTripTime*1000):null};
}
window.BVBNetwork={VERSION,connectionReport,peerOptions,refreshIce,validState,guestState,mirror,receiver};
})();

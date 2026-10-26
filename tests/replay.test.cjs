'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib');
const src=fs.readFileSync(require('node:path').join(__dirname,'../bvb-combat-ui.js'),'utf8');
function codec(){const box={window:{}};vm.runInNewContext(src.split('/* BVB Combat Rework')[0],box);return box.window.BVBReplayCodec;}
function game(t=0){return {m:0,ph:'battle',rt:t,th:2,rn:1,bl:[
 {uid:4,b:{id:0,n:'Topór',c:'#facc15'},team:0,x:30+Math.sin(t)*20,y:160,r:17,hp:108-t,mh:108,status:{shield:2.75},trail:[{x:29,y:158}],axeOrbit:{angle:t*6,blades:3,radius:34,color:'#fff'}},
 {uid:7,b:{id:17,n:'Komórka',c:'#4ade80'},team:1,x:300-t*2,y:Math.cos(t)*40+180,r:17,hp:120-t,mh:120,status:{}}
 ],v2:{shots:[{owner:4,x:32.12345678901234+t,y:90,r:4,color:'#fff',px:30,py:90}],webs:[{a:{x:0,y:16},b:{x:360,y:350},color:'#aaa'}],wallBeams:[],hazards:[],effects:[]},fx:[],rings:[],pop:[],obstacles:[{x:180,y:180,r:20,kind:'rock'}],portal:{x:90,y:60,r:16,seed:.12345678},arenaFxTime:t};}
const plain=x=>JSON.parse(JSON.stringify(x));
test('lossless deltas preserve every numeric bit, new/deleted fields and nested arrays',()=>{
 const c=codec(),a={x:0.1234567890123456,extra:4,nest:{arr:[{n:2},{n:4}]}},b={x:Number.MIN_VALUE,nest:{arr:[{n:3},{n:4}],new:'zażółć'}};
 assert.deepEqual(plain(c.applyDelta(a,c.difference(a,b))),b);
 assert.deepEqual(a,{x:0.1234567890123456,extra:4,nest:{arr:[{n:2},{n:4}]}},'applying deltas must not mutate captured source');
});
test('all 3601 authoritative ticks of a 60s round can be recovered exactly and seek backwards',()=>{
 const c=codec(),r=new c.Recording({seed:123}),expected=[];
 for(let i=0;i<=3600;i++){const g=game(i/60);if(i%37===0)g.v2.effects.push({kind:'slash',x:90,y:110,size:30,age:.1,life:.4,color:'#fff'});r.capture(g);
  if(i%120===0||[1,119,121,3599].includes(i))expected.push([i,plain(c.visualState(g))]);}
 const data=r.export();assert.equal(data.frames.length,3601);assert.equal(data.meta.complete,true);
 assert.equal(c.validate(data),data);
 for(const [i,state] of expected.reverse())assert.deepEqual(plain(c.stateAt(data,i)),state);
 const json=JSON.stringify(data),unzipped=JSON.parse(zlib.gunzipSync(zlib.gzipSync(json)));
 assert.deepEqual(plain(c.stateAt(c.validate(unzipped),3599)),plain(c.visualState(game(3599/60))));
 assert.ok(zlib.gzipSync(json).length<1024*1024,'standard 60s recording should fit browser storage compressed');
});
test('sound score preserves SFX, standard music and filtered music synthesis parameters',()=>{
 const c=codec(),r=new c.Recording();r.capture(game());
 r.sound(.25,{f:880,d:.07,type:'square',v:.035,s:380,m:0});r.sound(.3,{f:200,d:.3,type:'sine',v:.1,m:1});
 r.music(.4,{freq:220,duration:.6,type:'sine',volume:.025,cutoff:1300,detune:-8});
 r.event(.25,'ABILITY',{actor:0,id:15});r.capture(game(1));const data=r.export();
 assert.equal(data.sounds.length,3);
 assert.deepEqual(plain(data.sounds[0]),{t:.25,kind:'tone',f:880,d:.07,type:'square',v:.035,s:380,m:0});
 assert.deepEqual(plain(data.sounds[1]),{t:.3,kind:'tone',f:200,d:.3,type:'sine',v:.1,m:1});
 assert.deepEqual(plain(data.sounds[2]),{t:.4,kind:'spooky',freq:220,duration:.6,type:'sine',volume:.025,cutoff:1300,detune:-8,m:true});
 assert.deepEqual(plain(data.events[0]),{t:.25,type:'ABILITY',detail:{actor:0,id:15}});c.validate(data);
 const roundtrip=JSON.parse(zlib.gunzipSync(zlib.gzipSync(JSON.stringify(data))));
 assert.deepEqual(plain(c.validate(roundtrip).sounds),plain(data.sounds));
 const bad=plain(data);bad.sounds[2].detune=99999;assert.throws(()=>c.validate(bad),/synteza/);
 bad.sounds[2].detune=0;bad.sounds[2].cutoff=-10;assert.throws(()=>c.validate(bad),/synteza/);
 bad.sounds[2].cutoff=100;bad.sounds[2].type='audio-url';assert.throws(()=>c.validate(bad),/dźwięk/);
});
test('recording rejects backward time and reports exhausted frame budget',()=>{
 const c=codec(),r=new c.Recording();r.capture(game(1));assert.throws(()=>r.capture(game(0)),/cofnął/);
 const full=new c.Recording();for(let i=0;i<c.limits.MAX_FRAMES+2;i++)full.capture(game(i/62));
 assert.equal(full.frames.length,c.limits.MAX_FRAMES);assert.equal(full.meta.complete,false);
});
test('malformed imports, prototype paths, invalid actors and audio are rejected',()=>{
 const c=codec(),r=new c.Recording();r.capture(game());r.capture(game(1));const good=()=>plain(r.export());
 const pollution=good();pollution.frames[1].delta=[[['__proto__','polluted'],true]];
 assert.throws(()=>c.validate(pollution),/Niebezpieczna/);assert.equal({}.polluted,undefined);
 const invalid=good();invalid.frames[0].key.bl[0].x=null;assert.throws(()=>c.validate(invalid),/kulka/);
 const backwards=good();backwards.frames[1].t=-1;assert.throws(()=>c.validate(backwards),/oś czasu/);
 const missing=good();delete missing.frames[0].key;missing.frames[0].delta=[];assert.throws(()=>c.validate(missing),/oś czasu/);
 const audio=good();audio.sounds=[{t:0,f:440,d:999,type:'square',v:.1}];assert.throws(()=>c.validate(audio),/dźwięk/);
 const unsafe=JSON.parse('{"version":3,"tickRate":60,"kind":"state-deltas","frames":[],"events":[],"sounds":[]}');assert.throws(()=>c.validate(unsafe));
});

function uiFixture(storage=new Map()){
 const nodes=new Map(),raf=[],draws=[];let doc;
 class Node{
  constructor(tag){this.tag=tag;this.style={};this.dataset={};this.listeners={};this.hidden=false;this.disabled=false;this.isConnected=true;}
  set id(v){this._id=v;nodes.set(v,this);}get id(){return this._id;}
  set innerHTML(v){this._html=v;for(const m of v.matchAll(/id="([^"]+)"/g)){const n=new Node('div');n.id=m[1];}}
  get innerHTML(){return this._html||'';}
  setAttribute(){}after(){}appendChild(n){return n;}remove(){}focus(){doc.activeElement=this;}
  addEventListener(type,fn){this.listeners[type]=fn;}
  getContext(){return {};}
  click(){return this.listeners.click?.({target:this});}
  querySelectorAll(){return [];}
 }
 doc={head:new Node('head'),body:new Node('body'),activeElement:null,createElement:t=>new Node(t),getElementById:id=>nodes.get(id),querySelector:s=>nodes.get(s.slice(1)),addEventListener(){}};
 for(const id of ['game','cv','bset']){const n=new Node('div');n.id=id;}
 doc.activeElement=nodes.get('cv');
 const g=game(),context={window:{},document:doc,location:{pathname:'/beta/'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},requestAnimationFrame:fn=>raf.push(fn),setTimeout,Blob,Response,CompressionStream,DecompressionStream,TextDecoder,Uint8Array,btoa,atob,
  G:g,S:{o:{vs:1,vm:1},playerAura:'#abc'},snd(){},URL:{createObjectURL(){return 'blob:test';},revokeObjectURL(){}}};
 context.window.BVBRenderReplay=(state,ctx,meta)=>draws.push({state,meta});
 vm.runInNewContext(src,context);return {api:context.window.BVBReworkUI,codec:context.window.BVBReplayCodec,nodes,g,storage,context,draws,raf};
}
test('terminal effects, sound and metadata survive compressed save, reload and backward seek',async()=>{
 const f=uiFixture(),g=f.g;g.matchId='fixture';g.rn=1;
 f.api.startRound(g);
 f.api.recordSound(g,{f:880,d:.1,type:'square',v:.05,s:220});
 g.rt=1/60;g.bl[0].x=37.123456789012345;f.api.captureStep(g);
 g.rt=2/60;g.ph='end';f.api.endRound(g,0);
 // A wrapped projectile update can create a final effect after roundEnd.
 g.bl[1].hp=0;g.v2.effects.push({kind:'impact',x:22,y:44,size:12,age:0,life:.4,color:'#fff'});
 f.api.captureStep(g);
 f.api.openReplay();f.nodes.get('bvbReplaySeek').listeners.input({target:{value:'1000'}});
 assert.equal(f.draws.at(-1).state.bl[1].hp,0);assert.equal(f.draws.at(-1).state.v2.effects.length,1);
 await f.nodes.get('bvbReplaySave').click();
 const saved=JSON.parse([...f.storage].find(([k])=>k.startsWith('bvb-rework-replays-'))[1]);
 assert.equal(saved[0].version,3);assert.equal(saved[0].encoding,'gzip-base64');
 const decoded=JSON.parse(zlib.gunzipSync(Buffer.from(saved[0].payload,'base64')));
 assert.equal(decoded.frames.length,4);assert.equal(decoded.sounds.length,1);
 assert.equal(decoded.meta.playerAura,'#abc');
 const reloaded=uiFixture(f.storage);await reloaded.nodes.get('bvbSaved').click();
 assert.equal(reloaded.nodes.get('bvbReplayOverlay').hidden,false);
 reloaded.nodes.get('bvbReplaySeek').listeners.input({target:{value:'1000'}});
 assert.equal(reloaded.draws.at(-1).state.bl[1].hp,0);
 reloaded.nodes.get('bvbReplaySeek').listeners.input({target:{value:'0'}});
 assert.equal(reloaded.draws.at(-1).state.bl[1].hp,120);
 assert.equal(reloaded.draws.at(-1).state.bl[0].x,30);
});
test('corrupt stored replay is recoverable and JSON import does not replace valid playback',async()=>{
 const f=uiFixture(new Map([['bvb-rework-replays-beta-v2',JSON.stringify([{version:3,encoding:'json',payload:'{"version":3}',label:'broken'}])]]));
 await f.nodes.get('bvbSaved').click();assert.match(f.nodes.get('bvbSaved').title,/Nie można wczytać/);
 f.g.matchId='ok';f.api.startRound(f.g);f.g.rt=1;f.api.captureStep(f.g);f.api.endRound(f.g,0);f.api.openReplay();
 await f.nodes.get('bvbReplayFile').listeners.change({target:{files:[{size:12,text:async()=>'{bad-json'}],value:'bad.json'}});
 assert.match(f.nodes.get('bvbReplayNotice').textContent,/Nie można zaimportować/);
 assert.equal(f.nodes.get('bvbReplayOverlay').hidden,false);
 f.nodes.get('bvbReplayClose').click();assert.equal(f.api.isReplaying(),false);
});

test('recording corruption does not stop combat and retains the last valid partial playback',()=>{
 const f=uiFixture();f.g.matchId='broken-state';f.api.startRound(f.g);
 f.g.rt=1;f.g.bl[0].x=NaN;assert.doesNotThrow(()=>f.api.captureStep(f.g));
 assert.doesNotThrow(()=>f.api.endRound(f.g,0));f.api.openReplay();
 assert.equal(f.nodes.get('bvbReplayOverlay').hidden,false);
 assert.match(f.nodes.get('bvbReplayNotice').textContent,/niepełne/);
 assert.equal(f.draws.at(-1).state.bl[0].x,30);
});

test('replay calls original music synthesis under audio guard and its toggle mutes the whole score',()=>{
 const f=uiFixture(),heard=[];
 f.context.snd=(...args)=>heard.push({kind:'tone',args,guard:f.api.isPlayingAudio()});
 f.context.spookyTone=(...args)=>heard.push({kind:'spooky',args,guard:f.api.isPlayingAudio()});
 f.g.matchId='music-score';f.api.startRound(f.g);
 f.api.recordSound(f.g,{f:220,d:.3,type:'triangle',v:.03,s:0,m:1});
 f.api.recordMusic(f.g,{freq:110,duration:1.2,type:'sawtooth',volume:.03,cutoff:280,detune:-5});
 f.g.rt=1;f.api.endRound(f.g,0);f.api.captureStep(f.g);f.api.openReplay();
 f.raf.shift()(1000);
 assert.deepEqual(heard.map(e=>e.kind),['tone','spooky']);
 assert.ok(heard.every(e=>e.guard));assert.equal(f.api.isPlayingAudio(),false);
 assert.deepEqual(heard[0].args,[220,.3,'triangle',.03,0,1]);
 assert.deepEqual(heard[1].args,[110,1.2,'sawtooth',.03,280,-5]);
 f.nodes.get('bvbReplayClose').click();f.nodes.get('bvbReplaySound').click();f.api.openReplay();
 f.raf.shift()(1017);assert.equal(heard.length,2,'muted replay must not call either synthesis path');
});

test('HUD is rendered on round start without waiting for animation frames',()=>{const f=uiFixture();f.api.startRound(f.g);assert.ok(f.nodes.get('bvbCombatHud').innerHTML.includes('❤️'));});

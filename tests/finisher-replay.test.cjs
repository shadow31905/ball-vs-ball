'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');

function codec(){
 const src=fs.readFileSync(path.join(root,'bvb-combat-ui.js'),'utf8');
 const mark='window.BVBReplayCodec=';
 const end=src.indexOf('\n})();',src.indexOf(mark));
 assert.ok(end>0,'codec module must exist');
 const context={window:{}};
 vm.runInNewContext(src.slice(0,end+5),context);
 return context.window.BVBReplayCodec;
}
function actors(){
 return [
  {team:0,x:110,y:120,r:14,hp:25,mh:25,b:{id:1,n:'A',c:'#ffcc33'}},
  {team:1,x:230,y:245,r:14,hp:0,mh:30,b:{id:2,n:'B',c:'#77ffaa'}}
 ];
}
function match(variant=0){
 return {m:0,th:0,rt:14,ph:'end',bl:actors(),finisher:{
  x:230,y:245,fromX:110,fromY:120,color:'#ffcc33',winnerId:1,variant,style:variant,age:0,life:1.2
 }};
}
function presentation(randomValue){
 const js=fs.readFileSync(path.join(root,'bvb-presentation.js'),'utf8');
 const choiceMath=Object.create(Math);
 choiceMath.random=()=>randomValue;
 let effects=0,rng=0,boom=0;
 const context={
  Math:choiceMath,document:{createElement:()=>({textContent:''}),head:{appendChild(){}}},
  window:{matchMedia:()=>({matches:false}),BVBRework:{random(){rng++;return .8;},trace(){effects++;}}},
  S:{o:{fxLevel:3}},SFX:{boom(){boom++;}},draw(){},G:null,cx:null
 };
 vm.runInNewContext(js,context);
 return {...context.window.BVBPresentation,stats:()=>({effects,rng,boom})};
}
function fakeContext(){
 let strokes=0;
 const ctx={
  save(){},restore(){},fillRect(){},translate(){},rotate(){},
  beginPath(){},arc(){},stroke(){strokes++;},moveTo(){},lineTo(){},
  closePath(){},fill(){},strokeText(){},fillText(){}
 };
 return {ctx,strokes:()=>strokes};
}
test('five finishing scenes occupy five equal random intervals, without combat RNG',()=>{
 for(let i=0;i<5;i++){
  const f=presentation((i+.5)/5),g=match();
  delete g.finisher;g.ph='battle';
  f.finish(g,0);
  assert.equal(g.finisher.variant,i);
  assert.equal(g.finisher.style,i);
  assert.equal(f.stats().rng,0,'combat RNG must remain untouched');
  assert.equal(f.stats().effects,1);
  assert.equal(f.stats().boom,1);
  f.finish(g,0);
  assert.equal(f.stats().effects,1,'do not trigger a finisher twice');
  const canvas=fakeContext();
  f.render(canvas.ctx,g);
  assert.ok(canvas.strokes()>0,'a visible scene should be drawn');
 }
});
test('draw and invalid endings must not create a finisher',()=>{
 const f=presentation(.9),g=match();delete g.finisher;
 f.finish(g,-1);
 assert.equal(g.finisher,undefined);
 f.finish(g,17);
 assert.equal(g.finisher,undefined);
 g.bl[1].team=0;
 f.finish(g,0);
 assert.equal(g.finisher,undefined);
});
test('recording extends the terminal K.O. by 72 visual frames, without mutating real battle state',()=>{
 const c=codec();
 for(let variant=0;variant<5;variant++){
  const g=match(variant),original=JSON.stringify(g),r=new c.Recording({kind:'unit'});
  assert.equal(r.capture(g),true);
  assert.equal(c.captureFinisherTail(r,g),72);
  assert.equal(JSON.stringify(g),original,'visual replay extension must not change the game');
  const stored=JSON.parse(JSON.stringify(r.export()));
  assert.equal(c.validate(stored).frames.length,73);
  const first=c.stateAt(stored,0),last=c.stateAt(stored,stored.frames.length-1);
  assert.equal(first.finisher.variant,variant);
  assert.equal(last.finisher.variant,variant);
  assert.equal(first.finisher.age,0);
  assert.ok(Math.abs(last.finisher.age-1.2)<1e-9);
  assert.ok(Math.abs(last.rt-(g.rt+1.2))<1e-9);
 }
});
test('finish tails are absent for ties and capped at the replay time limit',()=>{
 const c=codec(),record=new c.Recording();
 let g=match();delete g.finisher;
 record.capture(g);
 assert.equal(c.captureFinisherTail(record,g),0);
 assert.equal(record.frames.length,1);
 g=match(2);g.rt=64.5;
 record.capture(g);
 assert.equal(c.captureFinisherTail(record,g),30);
 assert.equal(c.stateAt(record.export(),record.frames.length-1).rt,65);
});
test('guest mirrors coordinates but keeps exactly the host finisher variant',()=>{
 const src=fs.readFileSync(path.join(root,'bvb-network.js'),'utf8');
 const context={window:{},URL,AbortSignal};
 vm.runInNewContext(src,context);
 for(let variant=0;variant<5;variant++){
  const host=match(variant);
  host.my=host.bl.map(o=>o.b).slice(0,1);host.bt=host.bl.map(o=>o.b).slice(1);
  host.h=[2,1];host.lastRoundWinner=0;
  const guest=context.window.BVBNetwork.guestState(host);
  assert.equal(guest.finisher.variant,variant);
  assert.equal(guest.finisher.y,360-host.finisher.y);
  assert.equal(guest.finisher.fromY,360-host.finisher.fromY);
  assert.equal(guest.finisher.age,host.finisher.age);
  assert.equal(guest.lastRoundWinner,1);
  assert.equal(guest.bl[0].team,1);
  assert.equal(guest.bl[1].team,0);
 }
});

test('corrupt imported finishing variants and coordinates are rejected, old style-only recordings still load',()=>{
 const c=codec();
 const legacy=match();delete legacy.finisher.variant;
 const old=new c.Recording();old.capture(legacy);
 assert.equal(c.validate(JSON.parse(JSON.stringify(old.export()))).frames.length,1);
 for(const changed of [{variant:5},{variant:-1},{fromY:Infinity},{age:-1},{age:6}]){
  const g=match(0);
  Object.assign(g.finisher,changed);
  const record=new c.Recording();
  assert.throws(()=>record.capture(g),/animacja końcowego uderzenia|Nieprawidłowa liczba/);
 }
});
test('random interval boundaries choose the expected scene',()=>{
 for(let i=0;i<5;i++){
  const testValues=[i/5,Math.min(.999999999,(i+1)/5-1e-8)];
  for(const value of testValues){
   const g=match();delete g.finisher;
   presentation(value).finish(g,0);
   assert.equal(g.finisher.variant,i);
  }
 }
});

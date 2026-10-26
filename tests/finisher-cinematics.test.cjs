'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
function loadScene(randomValue=.5){
 const src=fs.readFileSync(path.join(root,'bvb-presentation.js'),'utf8');
 let gameRng=0,presentationRng=0,boom=0,events=0;
 const math=Object.create(Math);
 math.random=()=>{presentationRng++;return randomValue;};
 const mock={Math:math,window:{matchMedia:()=>({matches:false}),
  BVBRework:{random(){gameRng++;return .6;},trace(){events++;}}},
  S:{o:{fxLevel:3}},SFX:{boom(){boom++;}},
  document:{createElement:()=>({}),head:{appendChild(){}}},
  draw(){},G:null,cx:null};
 vm.runInNewContext(src,mock);
 return {...mock.window.BVBPresentation,stats:()=>({gameRng,presentationRng,boom,events})};
}
function match(){
 return {ph:'battle',m:0,rt:15,bl:[
  {x:82,y:140,hp:85,team:0,b:{id:1,n:'Topór',c:'#fcd34d'}},
  {x:270,y:215,hp:0,team:1,b:{id:2,n:'Kolec',c:'#16a34a'}}
 ]};
}
function tracer(){
 const ops=[];let stack=0;
 const ctx={};
 const keys=['save','restore','fillRect','strokeRect','beginPath','arc','stroke','moveTo','lineTo',
  'closePath','fill','translate','rotate','fillText','strokeText'];
 for(const key of keys){
  ctx[key]=(...args)=>{
   if(key==='save')stack++;if(key==='restore')stack--;
   ops.push([key,...args.map(x=>typeof x==='number'?+x.toFixed(5):x)]);
  };
 }
 return {ctx,ops,stack:()=>stack};
}
test('five mutually distinct cinematic storyboards, names and palette are available',()=>{
 const c=loadScene(.5);
 assert.equal(c.scenes.length,5);
 assert.equal(new Set(c.scenes.map(x=>x.title)).size,5);
 assert.equal(new Set(c.scenes.map(x=>x.tag)).size,5);
 assert.equal(new Set(c.scenes.map(x=>x.color)).size,5);
 for(const age of [.2,.85,1.45]){
  const signatures=[];
  for(let variant=0;variant<5;variant++){
   const f={variant,style:variant,x:270,y:215,fromX:82,fromY:140,
    color:'#fcd34d',winnerName:'Topór',winnerId:1,age,life:1.8};
   const {ctx,ops,stack}=tracer();
   c.renderCutscene(ctx,f);
   assert.equal(stack(),0,'save/restore balanced on scene '+variant);
   assert.ok(ops.length>60,'cinematic has more than a simple KO ring');
   assert.ok(ops.some(x=>x[0]==='fillText'&&x[1]==='K.O.'));
   assert.ok(ops.some(x=>x[0]==='fillText'&&x[1]===c.scenes[variant].tag));
   signatures.push(JSON.stringify(ops));
  }
  assert.equal(new Set(signatures).size,5,'scene storyboards must not be copies');
 }
 assert.deepEqual(c.stats(),{gameRng:0,presentationRng:0,boom:0,events:0});
});
test('scene is scripted through build-up, collision and finish; deterministic for replay',()=>{
 const c=loadScene(),f={variant:2,x:260,y:200,fromX:80,fromY:120,
  color:'#ec4899',winnerId:1,winnerName:'Topór',age:0,life:1.8};
 const stages=[.13,.50,1.0,1.6].map(age=>{
  const canvas=tracer();c.renderCutscene(canvas.ctx,{...f,age});
  return JSON.stringify(canvas.ops);
 });
 assert.equal(new Set(stages).size,stages.length,'the cutscene must animate, not be a static K.O. label');
 for(let i=0;i<4;i++){
  const a=tracer(),b=tracer();
  c.renderCutscene(a.ctx,{...f,age:[.13,.50,1.0,1.6][i]});
  c.renderCutscene(b.ctx,{...f,age:[.13,.50,1.0,1.6][i]});
  assert.equal(JSON.stringify(a.ops),JSON.stringify(b.ops),'seek/replay must show identical frame');
 }
 const done=tracer();c.renderCutscene(done.ctx,{...f,age:1.8});
 assert.equal(done.ops.length,0,'no effects continue after cutscene is over');
});
test('uniform 20% intervals across all five scene variants, no hidden bias',()=>{
 const c=loadScene();
 const histogram=Array(5).fill(0);
 for(let i=0;i<10000;i++)histogram[c.chooseVariant(()=>(i+.5)/10000)]++;
 assert.deepEqual(histogram,[2000,2000,2000,2000,2000]);
 assert.equal(c.chooseVariant(()=>0),0);
 assert.equal(c.chooseVariant(()=>.999999999),4);
 assert.equal(c.chooseVariant(()=>1),4,'clamp broken mock RNG rather than accessing undefined scene');
});
test('trigger exactly once and only after decisive lethal hit, with no battle RNG',()=>{
 for(let variant=0;variant<5;variant++){
  const c=loadScene((variant+.5)/5),g=match();
  g.bl[1].hp=1;
  c.finish(g,0);assert.equal(g.finisher,undefined,'non-lethal impact cannot start a cutscene');
  g.bl[1].hp=0;c.finish(g,0);
  assert.equal(g.finisher.variant,variant);
  assert.equal(g.finisher.life,1.8);
  assert.equal(g.finisher.winnerName,'Topór');
  const original=JSON.stringify(g.bl);
  c.finish(g,0);assert.equal(c.stats().events,1);
  assert.deepEqual(c.stats(),{gameRng:0,presentationRng:1,boom:1,events:1});
  c.tick(g,.5);assert.ok(Math.abs(g.finisher.age-.12)<1e-9,'per-frame tick safely capped');
  assert.equal(JSON.stringify(g.bl),original,'cutscenes cannot modify fighter state');
  const draw=match();draw.bl[0].hp=0;
  c.finish(draw,-1);assert.equal(draw.finisher,undefined,'tie must not trigger a cinematic');
  c.finish(draw,0);assert.equal(draw.finisher,undefined,'mutual KO must not declare a winner');
 }
});
test('reduced motion keeps a readable static scene without rapidly changing artwork',()=>{
 const c=loadScene(.1),f={variant:4,x:190,y:170,fromX:95,fromY:180,
  color:'#a3e635',winnerId:1,winnerName:'Topór',age:.1,life:1.8};
 const a=tracer(),b=tracer();
 c.renderCutscene(a.ctx,{...f,age:.1},true);
 c.renderCutscene(b.ctx,{...f,age:1.5},true);
 assert.equal(JSON.stringify(a.ops),JSON.stringify(b.ops));
 assert.ok(a.ops.some(x=>x[0]==='fillText'&&x[1]==='K.O.'));
 assert.ok(a.ops.some(x=>x[0]==='fillText'&&x[1]===c.scenes[4].tag));
});

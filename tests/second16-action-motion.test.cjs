'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const types=['hammer-strike','mitosis','chain-bolt','gravity-field','beam-recoil','saw-spin',
 'apple-grow','cannon-kick','virus-mutate','thorn-extend','bow-release','electric-crown',
 'range-scan','frost-crystal','harpoon-thrust','bee-flight'];
for(let id=16;id<32;id++){
 test('personal animated second16 identity '+(id+1)+' across V1-V3, detailed and classic',()=>{
  const g=createGame();
  const result=g.run(`(()=>{
   const id=${id};
   const original=JSON.stringify({coins:S.coins,own:S.own,upHp:S.upHp,upDmg:S.upDmg,profile:S.o});
   const stages=[1,2,3].map(tier=>['detailed','classic'].map(style=>BVBSketch17to32.svgFor(id,tier,style)));
   const positions=[1,2,3].map(tier=>[.13,.95].map(time=>BVBSketch17to32.combatPose(id,tier,time)));
   const img={complete:true,naturalWidth:128};
   const drawn=BVBSketch17to32.drawCombatSprite(cx,id,3,80,100,20,.95,img);
   return {stages,positions,drawn,untouched:original===JSON.stringify({coins:S.coins,own:S.own,upHp:S.upHp,upDmg:S.upDmg,profile:S.o})};
  })()`);
  assert.equal(result.drawn,true);
  assert.equal(result.untouched,true);
  const keys=new Set();
  for(let stage=1;stage<=3;stage++){
   assert.notDeepEqual(result.positions[stage-1][0],result.positions[stage-1][1],'canvas pose must visibly animate');
   for(let k=0;k<2;k++){
    const pic=result.stages[stage-1][k],style=k?'classic':'detailed';
    assert.ok(pic.includes('data-ability-motion="'+types[id-16]+'"'));
    assert.ok(pic.includes('data-visual-style="'+style+'"'));
    assert.ok(pic.includes('class="sketch-ability-fx"'));
    assert.ok(pic.includes('class="sketch-symbol"'));
    assert.ok(pic.includes('@keyframes bvbSkill'));
    assert.ok(pic.includes('data-evolution="'+stage+'"'));
    assert.ok(!pic.includes('undefined')&&!pic.includes('NaN'));
    assert.ok(!/<script\b/i.test(pic));
    const key=pic.match(/data-animation-key="([^"]+)"/)?.[1];
    assert.ok(key);
    assert.ok(pic.includes('svg[data-animation-key="'+key+'"] .sketch-symbol'));
    assert.ok(pic.includes('svg[data-animation-key="'+key+'"] .sketch-ability-fx'));
    assert.ok(!keys.has(key),'animation selector collision');
    keys.add(key);
   }
  }
  assert.equal(keys.size,6);
 });
}
test('second16 motion capabilities reject unloaded images and out-of-range ID',()=>{
 const g=createGame();
 const s=g.run(`(()=>({
  noImage:BVBSketch17to32.drawCombatSprite(cx,16,1,64,64,18,0,null),
  unloaded:BVBSketch17to32.drawCombatSprite(cx,16,1,64,64,18,0,{complete:false,naturalWidth:0}),
  old:BVBSketch17to32.drawCombatSprite(cx,15,1,64,64,18,0,{complete:true,naturalWidth:128}),
  future:BVBSketch17to32.drawCombatSprite(cx,32,1,64,64,18,0,{complete:true,naturalWidth:128})
 }))()`);
 assert.deepEqual([s.noImage,s.unloaded,s.old,s.future],[false,false,false,false]);
});

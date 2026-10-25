'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createGame}=require('./game-harness.cjs');
const modeSource=fs.readFileSync(path.join(__dirname,'..','bvb-modes.js'),'utf8');
function game(){
 const g=createGame();
 if(!g.run("!!window.BVBModes"))g.run(modeSource);
 return g;
}
function launch(g,mode){g.run("startMatch("+mode+");pick(0)");assert.equal(g.run("G.ph"),'battle');}
function winRound(g){
 g.run("G.bl[0].hp=G.bl[0].mh=100000;G.bl[0].baseDmg=100000;G.bl[0].x=G.bl[1].x=180;G.bl[0].y=G.bl[1].y=180;G.bl[0].vx=G.bl[1].vx=0;G.bl[0].vy=G.bl[1].vy=0;for(let i=0;i<7200&&G.ph==='battle';i++)step(1/60)");
 assert.equal(g.run("G.ph"),'end');
}
function loseRound(g){g.run("G.bl[0].hp=0;step(1/60)");assert.equal(g.run("G.ph"),'end');}
function next(g){
 g.run("nextRound();if(G.ph==='intermission')BVBCampaign.continueEvent();pick(0)");
 assert.equal(g.run("G.ph"),'battle');
}
test('every finite offline mode completes actual full matches and awards only once',()=>{
 for(const mode of [0,2,5,8,9,11]){
  const g=game();launch(g,mode);
  let rounds=0;
  while(g.run("G.h[0]>0&&G.h[1]>0")&&rounds++<8){
   g.run("for(let i=0;i<7200&&G.ph==='battle';i++)step(1/60)");
   assert.equal(g.run("G.ph"),'end','mode '+mode+' stalled');
   assert.ok(g.run("G.rt<=60.02"),'round timeout mode '+mode);
   assert.ok(g.run("G.bl.every(o=>[o.x,o.y,o.hp,o.vx,o.vy].every(Number.isFinite))"));
   if(g.run("G.h[0]>0&&G.h[1]>0"))next(g);
  }
  assert.ok(rounds<=5,'best of five mode '+mode);
  g.run("over()");assert.equal(g.run("G.finished"),true);
  const balances=g.run("JSON.stringify({coins:S.coins,candies:S.candies,xp:S.xp})");
  g.run("over()");assert.equal(g.run("JSON.stringify({coins:S.coins,candies:S.candies,xp:S.xp})"),balances);
 }
});
test('Survival, Infinity, Boss Rush and Halloween advance waves, preserve lost hearts and settle earned progress once',()=>{
 for(const mode of [1,3,7,10]){
  const g=game();launch(g,mode);
  assert.equal(g.run("JSON.stringify(G.h)"),'[3,1]');
  for(let i=0;i<2;i++){
   winRound(g);assert.equal(g.run("G.w"),i+2);assert.equal(g.run("G.h[1]"),1);next(g);
  }
  const hp=g.run("G.h[0]");loseRound(g);assert.equal(g.run("G.h[0]"),hp-1);
  while(g.run("G.h[0]>0")){next(g);loseRound(g);}
  g.run("over()");
  assert.equal(g.run("G.finished"),true);
  const expected=mode===3?120:mode===7?50:40;
  assert.equal(g.run("G.modeRewards.coins"),expected);
  assert.equal(g.run("G.modeRewards.candies"),mode===10?20:0);
  if(mode===1)assert.equal(g.run("S.best"),3);
  if(mode===7)assert.equal(g.run("S.binf"),2);
  if(mode===3){assert.equal(g.run("S.bb"),2);assert.equal(g.run("S.bossWins[0]+S.bossWins[1]"),2);}
  const before=g.run("S.coins");g.run("over()");assert.equal(g.run("S.coins"),before);
 }
});
test('Boss Rush cycles all six authored bosses with phase attacks',()=>{
 const g=game();launch(g,3);
 for(let index=0;index<6;index++){
  assert.equal(g.run("G.bossIndex"),index);
  assert.equal(g.run("G.bl[1].b.isBoss"),true);
  assert.equal(g.run("G.bl[1].b.bi"),index);
  g.run("G.rt=7.1;BVBRework.afterStep(G,1/60)");
  assert.equal(g.run("G.bossTelegraph.index"),index);
  winRound(g);next(g);
 }
 assert.equal(g.run("G.bossIndex"),0);assert.equal(g.run("G.w"),7);
});
test('Infinity scales HP quadratically, damage linearly and unlocks opponent rarity by wave',()=>{
 const g=game();launch(g,7);
 const value=g.run("(()=>{const g={m:7,w:6,st:0},p={hp:100,mh:100,baseDmg:10,r:17,speedFactor:1},e={hp:100,mh:100,baseDmg:10,r:17,speedFactor:1};BVBModes.prepareActors(g,p,e);return {hp:e.hp,damage:e.baseDmg}})()");
 assert.equal(value.hp,100*(1+.22*5+.03*25));assert.equal(value.damage,15);
 assert.ok(g.run("G.bt.every(b=>b.r<=1)"));
 g.run("G.w=7;G.nb=true;G.ph='end';nextRound()");
 assert.ok(g.run("G.bt.every(b=>b.r<=4)"));
});
test('Tournament requires defeating three opponents and restores hearts between stages',()=>{
 const g=game();launch(g,6);
 for(let round=0;round<9;round++){
  const stage=Math.floor(round/3);assert.equal(g.run("G.st"),stage);
  winRound(g);
  if(round<8){
   if(round%3===2){assert.equal(g.run("G.st"),stage+1);assert.equal(g.run("JSON.stringify(G.h)"),'[3,3]');}
   next(g);
  }
 }
 assert.equal(g.run("G.h[1]"),0);g.run("over()");
 assert.equal(g.run("S.tw"),1);assert.equal(g.run("G.modeRewards.coins"),g.run("DIFF_REW[diff]+150"));
 assert.equal(g.run("G.modeStats.rounds"),9);
});
test('Training supports repeated practice rounds without losing hearts or earning progression',()=>{
 const g=game();launch(g,4);
 const coins=g.run("S.coins");
 for(let i=0;i<3;i++){winRound(g);assert.equal(g.run("JSON.stringify(G.h)"),'[3,1]');next(g);}
 g.run("over()");
 assert.equal(g.run("G.modeRewards.coins"),0);assert.equal(g.run("G.modeRewards.candies"),0);
 assert.equal(g.run("S.coins"),coins);assert.equal(g.run("Object.keys(S.mastery||{}).length"),0);
});
test('Chaos chooses reproducible changing modifiers and applies physical size/speed/damage',()=>{
 const a=game(),b=game(),modifiers=[];
 for(const g of [a,b])g.run("startMatch(5);G.matchId='chaos-fixture';G.rn=0;nextRound();pick(0)");
 assert.equal(a.run("G.mod.n"),b.run("G.mod.n"));
 for(let i=0;i<3;i++){
  modifiers.push(a.run("G.mod.n"));
  assert.ok(a.run("G.bl.every(o=>o.r>=8&&o.r<=45&&o.speedFactor>0&&o.baseDmg>0)"));
  winRound(a);next(a);
 }
 assert.notEqual(modifiers[0],modifiers[1]);assert.notEqual(modifiers[1],modifiers[2]);
 const scaled=a.run("(()=>{const g={m:5,mod:{sp:1.45,sz:1.45,dm:1.6}},p={hp:100,mh:100,baseDmg:10,r:17,speedFactor:1},e={...p};BVBModes.prepareActors(g,p,e);return p})()");
 assert.equal(scaled.r,17*1.45);assert.equal(scaled.speedFactor,1.45);assert.equal(scaled.baseDmg,16);
});
test('all fifty campaign stages play complete winning matches, unlock in order and settle the final trophy once',()=>{
 const g=game();
 for(let level=1;level<=50;level++){
  g.run("BVBCampaign.start("+level+");pick(0)");
  assert.equal(g.run("G.campaignLevel"),level);
  for(let i=0;i<3&&g.run("G.h[1]>0");i++){
   winRound(g);
   if(g.run("G.h[1]>0"))next(g);
  }
  assert.equal(g.run("G.h[1]"),0,'level '+level);
  g.run("over()");
  assert.equal(g.run("S.campaign.unlocked"),Math.min(50,level+1));
  assert.equal(g.run("S.campaign.cleared.includes("+level+")"),true);
 }
 assert.equal(g.run("S.campaign.cleared.length"),50);assert.equal(g.run("S.campaign.finalWon"),true);
 const after=g.run("S.coins");g.run("over()");assert.equal(g.run("S.coins"),after);
 const persisted=g.run("JSON.stringify({coins:S.coins,cleared:S.campaign.cleared,finalWon:S.campaign.finalWon})");
 g.run("save();load()");
 assert.equal(g.run("JSON.stringify({coins:S.coins,cleared:S.campaign.cleared,finalWon:S.campaign.finalWon})"),persisted);
});
test('all six real bosses expose all three authored phases before detonation',()=>{
 const g=game();
 for(let index=0;index<6;index++)for(let phase=1;phase<=3;phase++){
  g.run("pendingBossIndex="+index+";startMatch(11);pick(0);G.bl[1].hp=G.bl[1].mh*"+(phase===1?1:phase===2?.6:.3)+";G.rt=7.1;BVBRework.afterStep(G,1/60)");
  assert.equal(g.run("G.bossTelegraph.index"),index);assert.equal(g.run("G.bossTelegraph.phase"),phase);
  assert.equal(g.run("G.bl[1].superUsed"),0);
 }
});
test('same seed, roster, arena and inputs reproduce full simulation hashes and HP despite presentation randomness',()=>{
 function record(){
  const g=game();
  g.run("startMatch(4);G.m=0;G.my=[B[11]];G.bt=[B[53]];G.matchId='deterministic';G.th=1;G.rn=0;nextRound();pick(0)");
  const hashes=[g.run("BVBRework.stateHash(G)")];
  for(let i=0;i<8;i++){g.run("for(let j=0;j<180&&G.ph==='battle';j++)step(1/60)");hashes.push(g.run("BVBRework.stateHash(G)"));}
  return {hashes,hp:g.run("G.bl.map(o=>o.hp).join(',')"),rng:g.run("G.rngCalls")};
 }
 assert.deepEqual(record(),record());
});

test('seeded simulation repeats web, revival, status and high-tier matchups across arenas',()=>{
 for(const [id,foe,arena] of [[6,34,0],[17,52,3],[99,129,4],[44,72,5],[110,116,2],[1,4,1]]){
  function run(){
   const g=game();
   g.run("startMatch(4);diff=4;G.m=0;G.my=[B["+id+"]];G.bt=[B["+foe+"]];G.matchId='edge-"+id+"';G.th="+arena+";G.rn=0;nextRound();pick(0)");
   const checkpoints=[];
   for(let i=0;i<12;i++){
    g.run("for(let j=0;j<300&&G.ph==='battle';j++)step(1/60)");
    checkpoints.push(g.run("BVBRework.stateHash(G)"));
    if(g.run("G.ph!=='battle'"))break;
   }
   return checkpoints.join('|')+':'+g.run("G.bl.map(o=>o.hp).join(',')");
  }
  assert.equal(run(),run(),'divergent seeded matchup '+id+'/'+foe);
 }
});
test('campaign intermission choices, portal placement and subsequent round hashes are reproducible',()=>{
 function run(){
  const g=game();g.run("S.campaign={unlocked:50,cleared:[],stars:[],deck:[0,1,2]};BVBCampaign.start(8);G.matchId='campaign-events';G.rn=0;nextRound();pick(0);for(let i=0;i<300&&G.ph==='battle';i++)step(1/60);G.ph='end';G.h=[2,2];nextRound()");
  assert.equal(g.run("G.ph"),'intermission');
  const event=g.run("G.campaignEvent.id");
  g.run("BVBCampaign.continueEvent();pick(0);for(let i=0;i<300&&G.ph==='battle';i++)step(1/60)");
  return event+':'+g.run("BVBRework.stateHash(G)")+':'+g.run("JSON.stringify({x:G.portal.x,y:G.portal.y})");
 }
 assert.equal(run(),run());
});

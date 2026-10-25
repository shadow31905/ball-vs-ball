'use strict';
const fs=require('node:fs'),path=require('node:path'),{createGame}=require('./game-harness.cjs');
const games=Number(process.env.BVB_BALANCE_GAMES||2600);
const fixture=createGame();
const snapshot=process.env.BVB_BALANCE_SNAPSHOT;
if(snapshot){fixture.context.BVBBalance.enabled=false;fixture.run(fs.readFileSync(snapshot,'utf8'));}
const crypto=require('node:crypto');
const engineSources=Object.fromEntries(['index.html','bvb-anime-update.js','bvb-gameplay.js','bvb-campaign.js','bvb-abilities-v2.js','bvb-identities.js','bvb-balance.js','bvb-combat-rework.js'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',file))).digest('hex')]));
if(snapshot)engineSources.balanceSnapshot=crypto.createHash('sha256').update(fs.readFileSync(snapshot)).digest('hex');
function tournament(total,options){
 const fights=[],perBall=Array.from({length:130},(_,id)=>({id,name:B[id].n,wins:0,draws:0,fights:0,timeouts:0}));
 diff=3;S.o.fxLevel=0;MU.s=MU.m=1;
 const originalActor=actor;actor=function(...args){if(!args[0]?.isBoss){args[6]=options.tier||1;args[7]=args[8]=0;}return originalActor(...args);};
 if(window.BVBBalance)window.BVBBalance.enabled=!options.disable;
 for(let i=0;i<total;i++){
  const pair=options.mirrored?Math.floor(i/2):i;
  const source=pair%130,cycle=Math.floor(pair/130),offset=1+((cycle*17+options.opponentOffset)%129),target=(source+offset)%130;
  const flip=options.mirrored&&i%2===1,a=flip?target:source,b=flip?source:target,seed=options.baseSeed+pair;
  serial=0;G=freshGame(0,[B[a]],[B[b]]);G.matchId='balance-'+seed;G.th=seed%6;nextRound();
  G.modifier='standard';G.tactics={0:'balanced',1:'balanced'};
  pick(0);
  let ticks=0;
  while(G.ph==='battle'&&ticks++<4200)step(1/60);
  const winner=G.lastRoundWinner??-1,time=G.rt;
  if(G.ph==='battle'||G.bl.some(o=>![o.x,o.y,o.hp,o.vx,o.vy].every(Number.isFinite)))throw Error('Invalid fight '+i);
  for(const id of [a,b]){perBall[id].fights++;if(time>=60)perBall[id].timeouts++;}
  if(winner<0){perBall[a].draws++;perBall[b].draws++;}else perBall[winner===0?a:b].wins++;
  fights.push({a,b,seed,winner,seconds:Math.round(time*100)/100,ticks});
  if(i%130===129)console.log('Balance: '+(i+1)+'/'+total);
 }
 const times=fights.map(f=>f.seconds).sort((a,b)=>a-b),n=times.length;
 return {schemaVersion:2,options,balanced:window.BVBBalance?.enabled||false,description:'Actual full game simulation, level 4 AI, V1, no upgrades, balanced tactics, six arenas. Sampled matchups; not a claim of perfect balance.',games:n,
  summary:{min:times[0],p10:times[Math.floor(n*.1)],median:times[Math.floor(n*.5)],p90:times[Math.floor(n*.9)],max:times[n-1],timeouts:fights.filter(f=>f.seconds>=60).length,under30:fights.filter(f=>f.seconds<30).length},
  perBall:perBall.map(b=>({...b,winRate:Math.round(b.wins/b.fights*1000)/10,scoreRate:Math.round((b.wins+b.draws*.5)/b.fights*1000)/10})),fights};
}
const options={tier:Math.max(1,Math.min(3,Number(process.env.BVB_BALANCE_TIER||1))),baseSeed:Number(process.env.BVB_BALANCE_SEED||1000),mirrored:process.env.BVB_BALANCE_MIRROR!=='0',disable:process.env.BVB_BALANCE_DISABLE==='1',opponentOffset:Number(process.env.BVB_BALANCE_OFFSET||0)};
if(!Number.isInteger(games)||games<1||!Number.isInteger(options.baseSeed)||!Number.isInteger(options.opponentOffset)||options.opponentOffset<0||options.opponentOffset>128)throw new Error('Invalid balance run options');
const result=fixture.run('('+tournament.toString()+')('+games+','+JSON.stringify(options)+')');
const dest=process.env.BVB_BALANCE_OUT||path.join(__dirname,'../balance-report.json');
result.engineSources=engineSources;
result.calibration={version:fixture.context.BVBBalance?.version,tempoHp:fixture.context.BVBBalance?.tempoHp,calibrationGames:fixture.context.BVBBalance?.calibrationGames,table:fixture.context.BVBBalance?.calibration};
const rates=result.perBall.filter(b=>b.fights).map(b=>b.scoreRate).sort((a,b)=>a-b);
Object.assign(result.summary,{scoreRateMin:rates[0],scoreRateP10:rates[Math.floor(rates.length*.1)],scoreRateP90:rates[Math.floor(rates.length*.9)],scoreRateMax:rates.at(-1),rosterOutside25to75:rates.filter(p=>p<25||p>75).length,meanAbsoluteScoreRateDistance:Math.round(rates.reduce((sum,p)=>sum+Math.abs(p-50),0)/rates.length*100)/100});
fs.writeFileSync(dest,JSON.stringify(result,null,2));
console.log(JSON.stringify(result.summary));
console.log('Lowest:',result.perBall.filter(b=>b.fights).sort((a,b)=>a.winRate-b.winRate).slice(0,6));
console.log('Highest:',result.perBall.filter(b=>b.fights).sort((a,b)=>b.winRate-a.winRate).slice(0,6));

/* Restored offline mode progression. The authoritative game owns rounds and damage. */
(() => {
'use strict';
const WAVE_MODES=[1,3,7,10], finite=(n,f=0)=>Number.isFinite(n)?n:f;
const random=g=>window.BVBRework?.random?.(g) ?? Math.random();
const active=g=>g&&g.m!==12&&g.m!==13;
const wave=g=>WAVE_MODES.includes(g.m);
const cleared=g=>Math.max(0,Math.floor(finite(g.w,1))-1);
function shuffled(g,list){
 const a=list.slice();
 for(let i=a.length-1;i>0;i--){const j=Math.floor(random(g)*(i+1));[a[i],a[j]]=[a[j],a[i]];}
 return a;
}
function bossBall(index){
 const boss=BOSSD[Math.max(0,Math.min(BOSSD.length-1,index))];
 return {...B[99],...boss,isBoss:true};
}
function newMatch(g){
 if(!active(g))return;
 g.w=1;g.st=0;g.sv=wave(g);g.nb=true;
 g.h=wave(g)||g.m===4?[3,1]:[3,3];
 g.modeRoundApplied=-1;g.modeRoundCompleted=-1;g.modeRewardsClaimed=false;
 g.modeStats={rounds:0,wins:0,bosses:[]};
 if(g.m!==4){
  S.g=Math.max(0,Math.floor(finite(S.g)))+1;
  S.q ||= {};S.q.play=Math.max(0,Math.floor(finite(S.q.play)))+1;
  if(g.m===9||g.m===10){S.hwq ||= {};S.hwq.hwplay=Math.max(0,Math.floor(finite(S.hwq.hwplay)))+1;}
 }
}
function newRound(g){
 if(!active(g)||g.modeRoundApplied===g.rn)return;
 g.modeRoundApplied=g.rn;
 if(g.m===3){
  g.bossIndex=(Math.max(1,g.w)-1)%BOSSD.length;g.bt=[bossBall(g.bossIndex)];
 }else if(g.m===9){
  g.bossIndex=0;g.bt=[bossBall(0)];
 }else if((g.sv||g.m===6)&&g.nb){
  const cap=g.m===7?Math.min(4,1+Math.floor((g.w-1)/2)):4;
  const pool=B.filter(b=>g.m===10?b.id>=99:b.r<=cap);
  g.bt=shuffled(g,pool).slice(0,3);g.nb=false;
 }
 if(g.m===5){
  const candidates=MODS.filter(m=>m.n!==g.mod?.n);
  g.mod={...candidates[Math.floor(random(g)*candidates.length)]};
  g.th=Math.floor(random(g)*ARENAS.length);
 }else g.mod=null;
}
function prepareActors(g,p,e){
 if(!active(g)||!p||!e)return;
 let hpScale=1,dmgScale=1;
 if(g.m===7){hpScale=infHp(g.w);dmgScale=infDmg(g.w);}
 else if(wave(g)){hpScale=1+.15*(g.w-1);}
 else if(g.m===6)hpScale=.9+.15*g.st;
 hpScale=Math.max(.1,Math.min(1e7,hpScale));dmgScale=Math.max(.1,Math.min(1000,dmgScale));
 e.hp*=hpScale;e.mh*=hpScale;e.baseDmg*=dmgScale;
 if(g.m===3||g.m===9){e.b={...e.b,isBoss:true};e.r=Math.max(25,e.r);}
 if(g.m===5&&g.mod){
  for(const o of [p,e]){
   o.speedFactor*=g.mod.sp||1;o.baseDmg*=g.mod.dm||1;
   o.r=Math.max(8,Math.min(45,o.r*(g.mod.sz||1)));
  }
 }
}
function onRoundEnd(g,winner){
 if(!active(g)||g.modeRoundCompleted===g.rn)return;
 g.modeRoundCompleted=g.rn;
 const stats=g.modeStats ||= {rounds:0,wins:0,bosses:[]};
 stats.rounds++;if(winner===0)stats.wins++;
 if(g.m===4){g.h=[3,1];return;}
 if(wave(g)&&winner===0){
  if(g.m===3)stats.bosses.push(g.bossIndex);
  g.w=Math.min(100000,g.w+1);g.h[1]=1;g.nb=true;
 }else if(g.m===6&&winner===0&&g.h[1]<=0&&g.st<2){
  g.st++;g.h=[3,3];g.nb=true;
 }
}
function rewards(g,won,defaultCoins=0,defaultCandies=0){
 if(g?.m===13)return {coins:Math.max(0,Math.round(finite(defaultCoins))),candies:Math.max(0,Math.round(finite(defaultCandies)))};
 if(!active(g)||g.modeRewardsClaimed)return {coins:0,candies:0};
 g.modeRewardsClaimed=true;
 if(g.m===4)return g.modeRewards={coins:0,candies:0};
 const wins=cleared(g),day=new Date().toLocaleDateString('pl-PL');
 let coins=Math.max(0,Math.round(finite(defaultCoins))),candies=Math.max(0,Math.round(finite(defaultCandies)));
 S.bdt ||= {};
 if(wave(g)){
  coins=wins*(g.m===3?60:g.m===7?INF_REWARD_PER_WAVE:20);
  candies=g.m===10?wins*10:0;
  if(g.m===1&&g.w>finite(S.best)){S.best=g.w;S.bdt.sv=day;}
  if(g.m===3){
   if(wins>finite(S.bb)){S.bb=wins;S.bdt.bb=day;}
   S.bossWins ||= {};
   for(const id of g.modeStats?.bosses||[])S.bossWins[id]=Math.max(0,Math.floor(finite(S.bossWins[id])))+1;
  }
  if(g.m===7&&wins>finite(S.binf)){S.binf=wins;S.bdt.inf=day;}
 }else if(g.m===6&&won){coins+=150;S.tw=Math.max(0,Math.floor(finite(S.tw)))+1;S.q ||= {};S.q.tw=Math.max(0,Math.floor(finite(S.q.tw)))+1;}
 if(won){
  S.wins=Math.max(0,Math.floor(finite(S.wins)))+1;S.ws=Math.max(0,Math.floor(finite(S.ws)))+1;S.bs=Math.max(finite(S.bs),S.ws);
  S.q ||= {};S.q.win=Math.max(0,Math.floor(finite(S.q.win)))+1;
  if(g.m===9||g.m===10){S.hwq ||= {};S.hwq.hwwin=Math.max(0,Math.floor(finite(S.hwq.hwwin)))+1;}
 }else S.ws=0;
 S.xp=Math.max(0,finite(S.xp))+(wave(g)?wins*(g.m===7?12:g.m===3?30:10):won?40:15);
 S.lv=Math.max(1,Math.floor(finite(S.lv,1)));
 let levels=0;
 while(S.xp>=S.lv*100&&levels<10000){S.xp-=S.lv*100;S.lv++;coins+=50;levels++;}
 S.bp ||= {p:0,cl:[]};S.bp.p=Math.max(0,finite(S.bp.p))+(won?25:10)+(wave(g)?wins*3:0);
 return g.modeRewards={coins,candies};
}
function summary(g){
 if(!g)return '';
 if(g.m===4)return 'Trening — bez nagród i utraty serc';
 if(g.m===3)return 'Boss Rush · pokonani bossowie: '+cleared(g);
 if(g.m===7)return 'Nieskończoność · pokonane fale: '+cleared(g);
 if(g.m===10)return 'Halloween Survival · pokonane fale: '+cleared(g);
 if(g.m===1)return 'Survival · fala '+Math.max(1,g.w||1)+' · pokonane: '+cleared(g);
 if(g.m===6)return 'Turniej · przeciwnik '+Math.min(3,(g.st||0)+1)+'/3';
 if(g.m===5)return 'Chaos'+(g.mod?' · '+g.mod.n:'');
 return '';
}
function abandon(g){
 if(!active(g)||g.finished||!wave(g))return false;
 g.h[0]=0;g.ph='end';over();return true;
}
window.BVBModes={newMatch,newRound,prepareActors,onRoundEnd,rewards,summary,abandon};
})();

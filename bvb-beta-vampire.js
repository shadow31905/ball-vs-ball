/* Approved test-only contact bite. The host owns damage, healing and release;
 * presentation never changes HP or positions. No production entrypoint loads it. */
(()=>{
'use strict';
if(typeof K==='undefined'||K!=='bvb_beta_original_16_v1'||!document.querySelector('meta[name="bvb-beta-build"]')||!window.BVBFirstSixteen)return;
const old=window.BVBFirstSixteen;
function onContact(g,o,foe,base,h){
 const result=old.onContact(g,o,foe,base,h);
 if(netRole==='guest'||o.b.id!==7||!h.alive(o)||!h.alive(foe)||g.rt<(o.bvbBetaBiteReady||0))return result;
 const angle=Math.atan2(o.y-foe.y,o.x-foe.x),duration=.9;
 o.bvbBetaBite={target:foe.uid,until:g.rt+duration,next:g.rt,angle,pulses:0,drained:0,healed:0};
 o.bvbBetaBiteReady=g.rt+2.8;window.BVBBatch01Animation?.notifyAbility(o,g,'bite');return result;
}
function tick(g,o,dt,h){
 old.tick(g,o,dt,h);if(netRole==='guest'||o.b.id!==7)return;
 const bite=o.bvbBetaBite;if(!bite)return;const foe=g.bl.find(a=>a.uid===bite.target);
 if(g.rt>=bite.until||!h.alive(o)||!foe||!h.alive(foe)||(o.status?.stun||0)>0){o.bvbBetaLastBite={...bite};o.bvbBetaBite=null;return;}
 const distance=(o.r+foe.r)*1.01;
 o.x=Math.max(o.r,Math.min(360-o.r,foe.x+Math.cos(bite.angle)*distance));
 o.y=Math.max(o.r,Math.min(360-o.r,foe.y+Math.sin(bite.angle)*distance));o.vx=foe.vx;o.vy=foe.vy;
 if(g.rt>=bite.next&&bite.pulses<3){
  const before=foe.hp,own=o.hp;h.strike(o,foe,1.5+(o.tier||1)*.5,{});
  const taken=Math.max(0,before-foe.hp);o.hp=Math.min(o.mh,o.hp+taken);
  bite.drained+=taken;bite.healed+=o.hp-own;bite.pulses++;bite.next+=.28;
 }
}
window.BVBFirstSixteen={...old,onContact,tick};
window.BVBBetaVampire=Object.freeze({duration:.9,cooldown:2.8,pulses:3});
})();

/* Separate beta profile, no cloud writes, and no developer workshop. */
(()=>{'use strict';
function clean(){S.own=B.map(b=>b.id);for(const key of ['tr','dup','dupV2','upDmg','upHp','mastery']){if(!S[key]||typeof S[key]!=='object')continue;for(const id of Object.keys(S[key]))if(!Number.isInteger(Number(id))||!B[Number(id)])delete S[key][id];}if(!S.betaOriginal16){S.betaOriginal16=1;S.coins=10000;S.candies=10000;}S.q.tb=B[S.q.tb]?S.q.tb:0;}
const previousLoad=load;load=function(){previousLoad();clean();};clean();save();
const badge=document.createElement('div');badge.id='bvbBetaIdentity';badge.textContent='BETA · 16 kulek po reworku · testy bez multiplayer';badge.style.cssText='text-align:center;padding:7px;background:#24304f;color:#d7ecff;font:700 12px system-ui';document.getElementById('app').prepend(badge);
const gate=document.getElementById('accountGate');if(gate){gate.hidden=true;for(const b of gate.querySelectorAll('button'))if(!b.textContent.includes('Graj bez konta')){b.disabled=true;b.title='Beta korzysta z osobnego zapisu lokalnego';}const p=document.createElement('p');p.textContent='Beta ID 0–15. Wybierz „Graj bez konta”. Zapis bety jest oddzielony od głównej gry.';p.style.cssText='color:#bce4ff;font-size:13px;margin:10px';gate.querySelector('div')?.appendChild(p);}
window.BVBBetaRoster=Object.freeze({ids:Object.freeze(B.map(b=>b.id)),source:'f1ce9dc1e4e9c2846323d44c2cf85d77f90708ae',storageKey:K});menu();
})();

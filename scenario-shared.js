(()=>{
const out={damage:[],statuses:[],arenas:[],ends:[]};
function setup(id,tier){const p=actor(B[id],70,180,0,0,0,tier,0,0),e=actor(B[id===0?1:0],290,180,0,1,1,1,0,0);for(const o of [p,e]){o.hp=o.mh=500;o.vx=o.vy=0;o.abilityCd=Infinity;o.aiTarget={vx:0,vy:0};o.aiDecisionClock=Infinity;}G={m:0,ph:'battle',my:[B[id]],bt:[e.b],h:[3,3],score:[0,0],rn:1,rt:0,simTick:0,bl:[p,e],fx:[],pop:[],rings:[],z:[],pr:[],events:[],obstacles:[],portal:null,th:1,rare:'',matchId:'shared-'+id+'-'+tier};BVBRework.setSeed(G,42);return[p,e];}
for(let id=0;id<13;id++)for(const tier of [1,2,3]){
 const[p,e]=setup(id,tier);const data=[];
 for(const spec of [{name:'normal',shield:0,armor:0,raw:20,loss:20},{name:'shield',shield:40,armor:0,raw:20,loss:0},{name:'mixed',shield:10,armor:100,raw:20,loss:8.2},{name:'armor',shield:0,armor:100,raw:20,loss:16.4},{name:'lethal',shield:0,armor:0,raw:2000,loss:500}]){e.hp=e.mh=500;e.status.shield=spec.shield;e.armor=spec.armor;e.armorMax=100;p.comboHits=0;applyDamage(e,spec.raw,{critical:false});const loss=500-e.hp;data.push({name:spec.name,loss,status:Math.abs(loss-spec.loss)<1e-6&&e.hp>=0?'PASS':'FAIL'});}
 e.hp=500;e.status={};BVBRework.applyStatus(e,'slow',100,'ice');const capped=e.status.slow;e.statusImmunities=['stun'];BVBRework.applyStatus(e,'stun',1,'electric');const immune=!e.status.stun;e.statusImmunities=[];e.status={};
 for(const key of ['slow','stun','poison','burn','weaken'])BVBRework.applyStatus(e,key,.2,'physical');for(let i=0;i<120;i++){G.simTick++;step(1/60);}const expired=['slow','stun','poison','burn','weaken'].every(k=>!(e.status[k]>0));
 out.damage.push({id,tier,cases:data,status:data.every(x=>x.status==='PASS')?'PASS':'FAIL'});out.statuses.push({id,tier,capped,immune,expired,status:capped<=4&&immune&&expired?'PASS':'FAIL'});
}
for(let arena=0;arena<ARENAS.length;arena++){
 S.arenaPick='manual';S.th=arena;const g=freshGame(0,[B[0]],[B[1]]);G=g;G.ph='battle';const p=actor(B[0],80,180,0,0,0,1,0,0),e=actor(B[1],280,180,0,1,1,1,0,0);G.bl=[p,e];let error=null;try{draw();for(let i=0;i<60;i++){G.simTick=(G.simTick||0)+1;step(1/60);}}catch(err){error=err.message;}out.arenas.push({arena,name:ARENAS[arena].name,obstacles:G.obstacles?.length||0,error,status:error?'FAIL':'PASS'});
}
for(const scenario of ['winner','loser','draw']){setup(0,1);roundEnd(scenario==='draw'?-1:scenario==='winner'?0:1);const expected=scenario==='draw'?[3,3]:scenario==='winner'?[3,2]:[2,3];out.ends.push({scenario,phase:G.ph,winner:G.lastRoundWinner,hearts:G.h,status:G.ph==='end'&&JSON.stringify(G.h)===JSON.stringify(expected)?'PASS':'FAIL'});}
return out;})()
(()=>{
const results=[];
function setup(id,tier){const p=actor(B[id],90,180,0,0,0,tier,0,0),e=actor(B[0],210,180,0,1,1,1,0,0);p.hp=200;p.mh=e.hp=e.mh=500;p.vx=p.vy=e.vx=e.vy=0;p.abilityCd=e.abilityCd=Infinity;p.aiTarget=e.aiTarget={vx:0,vy:0};p.aiDecisionClock=e.aiDecisionClock=Infinity;
G={m:0,ph:'battle',my:[B[id]],bt:[B[0]],h:[3,3],score:[0,0],rn:1,rt:0,simTick:0,bl:[p,e],fx:[],pop:[],rings:[],z:[],pr:[],events:[],obstacles:[],portal:null,th:1,rare:'',matchId:'test-006-'+id+'-'+tier};BVBRework.setSeed(G,1234);return[p,e];}
let peakSlow=0,peakShield=0;function advance(seconds){for(let i=0;i<seconds*60&&G.ph==='battle';i++){G.simTick++;step(1/60);peakSlow=Math.max(peakSlow,G.bl[1].status.slow||0);peakShield=Math.max(peakShield,G.bl[0].status.shield||0);}}
function evaluate(id,tier){const[p,e]=setup(id,tier);let detail={};peakSlow=peakShield=0;
if(id===0){e.x=210;e.y=210;specialAbility(p,e);const x=p.x,y=p.y;advance(.15);detail={vx:p.vx,vy:p.vy,moved:Math.hypot(p.x-x,p.y-y),angle:Math.atan2(p.vy,p.vx)};}
if(id===1){specialAbility(p,e);advance(.72);detail={returnShots:G.v2.shots.filter(s=>s.owner===p.uid&&s.id===1).length};}
if(id===2){specialAbility(p,e);p.x=17;p.y=60;BVB2.onWall(p,'left');G.rt+=.2;p.x=180;p.y=17;BVB2.onWall(p,'top');p.x=300;p.y=300;e.x=98.5;e.y=38.5;advance(.12);detail={damage:500-e.hp,branches:p.bvbBriarBranches||0,hazards:G.v2.hazards.length};}
if(id===3){specialAbility(p,e);const bounce=G.v2.shots.filter(s=>s.id===3).some(s=>s.bounces>0);advance(1.2);detail={heal:p.hp-200,damage:500-e.hp,returning:bounce};}
if(id===4){e.x=180;specialAbility(p,e);advance(1.45);detail={damage:500-e.hp,slow:peakSlow};}
if(id===5){specialAbility(p,e);advance(1.9);detail={shots:p.bvbRifleLastBurst?.shots||0,hits:p.bvbRifleHits||0,damage:500-e.hp};}
if(id===6){specialAbility(p,e);p.x=17;p.y=60;BVB2.onWall(p,'left');G.rt+=.2;p.x=180;p.y=17;BVB2.onWall(p,'top');p.x=300;p.y=300;e.x=98.5;e.y=38.5;advance(.12);detail={damage:500-e.hp,slow:e.status.slow||0,vibrations:p.bvbSilkVibrations||0};}
if(id===7){p.x=120;e.x=160;p.hp=80;specialAbility(p,e);advance(1.5);detail={shield:peakShield,bank:p.bvbBloodBank||0,bites:p.bvbVampireLast?.hits||0,hp:p.hp};}
if(id===8){specialAbility(p,e);p.x=17;p.y=180;BVB2.onWall(p,'left');p.x=120;e.x=151;p.vx=1;e.vx=-1;advance(.08);detail={anchorShots:G.v2.shots.filter(s=>s.id===8&&s.x<80).length,anchor:p.bvbSpearAnchor||null,damage:500-e.hp};}
if(id===9){p.x=17;e.x=80;specialAbility(p,e);const before=e.hp;BVB2.onWall(p,'left');detail={extraDamage:before-e.hp,reflections:p.bvbReflectedWaves||0};}
if(id===10){specialAbility(p,e);const hazards=G.v2.hazards.filter(h=>h.owner===p.uid);detail={rook:hazards.length,combo:p.bvbChessCombo||null};}
if(id===11){let seed=1;for(;seed<1000;seed++){BVBRework.setSeed(G,seed);if(BVBRework.random()>=5/6)break;}BVBRework.setSeed(G,seed);specialAbility(p,e);detail={roll:p.v2LastRoll,shield:p.status.shield||0,remembered:p.bvbDiceSeen||[]};}
if(id===12){specialAbility(p,e);p.x=17;p.y=180;BVB2.onWall(p,'left');detail={icicles:p.bvbIcicles||0,frost:G.v2.hazards.filter(h=>h.kind==='frost').length};}
return detail;}
for(let id=0;id<13;id++){
 const v1=evaluate(id,1),v2=evaluate(id,2);let ok=false;
 switch(id){case 0:ok=v2.moved>0&&Math.abs(v2.angle-v1.angle)>.05;break;case 1:ok=v2.returnShots>v1.returnShots;break;case 2:ok=v2.branches>0&&v2.damage>v1.damage;break;case 3:ok=v2.returning&&!v1.returning&&v2.heal>v1.heal;break;case 4:ok=v2.damage>v1.damage&&v2.slow>0;break;case 5:ok=v1.shots===6&&v2.shots===7&&v2.hits===7;break;case 6:ok=v2.vibrations>0&&v2.slow>v1.slow;break;case 7:ok=v2.bites===3&&v2.shield>v1.shield;break;case 8:ok=v2.anchorShots>v1.anchorShots;break;case 9:ok=v2.extraDamage>v1.extraDamage&&v2.reflections>0;break;case 10:ok=v2.rook>v1.rook&&v2.combo==='knight-rook';break;case 11:ok=v1.roll===6&&v2.roll===6&&v2.shield>v1.shield&&v2.remembered.includes(6);break;case 12:ok=v2.icicles>0&&v2.frost>v1.frost;break;}
 results.push({id,v1,v2,status:ok?'PASS':'FAIL'});
}
return results;
})()

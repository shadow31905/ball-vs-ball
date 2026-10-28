(()=>{
const results=[];
function setup(id,tier){const p=actor(B[id],90,180,0,0,0,tier,0,0),e=actor(B[0],210,180,0,1,1,1,0,0);p.hp=200;p.mh=e.hp=e.mh=500;p.vx=p.vy=e.vx=e.vy=0;p.abilityCd=e.abilityCd=Infinity;p.aiTarget=e.aiTarget={vx:0,vy:0};p.aiDecisionClock=e.aiDecisionClock=Infinity;
G={m:0,ph:'battle',my:[B[id]],bt:[B[0]],h:[3,3],score:[0,0],rn:1,rt:0,simTick:0,bl:[p,e],fx:[],pop:[],rings:[],z:[],pr:[],events:[],obstacles:[],portal:null,th:1,rare:'',matchId:'test-006-'+id+'-'+tier};BVBRework.setSeed(G,1234);return[p,e];}
let peakSlow=0,peakShield=0,peakStun=0,seenShots=new WeakSet(),seenFx=new WeakSet(),birthTimes=new Set();function advance(seconds){const end=G.rt+seconds;for(let i=0;i<seconds*600&&G.rt<end&&G.ph==='battle';i++){G.simTick++;step(1/60);peakSlow=Math.max(peakSlow,G.bl[1].status.slow||0);peakShield=Math.max(peakShield,G.bl[0].status.shield||0);peakStun=Math.max(peakStun,G.bl[1].status.stun||0);for(const shot of G.v2?.shots||[])if(shot.owner===G.bl[0].uid&&!seenShots.has(shot)){seenShots.add(shot);birthTimes.add(G.simTick);}for(const fx of G.v2?.effects||[])if(fx.id===1&&fx.kind==='charge'&&!seenFx.has(fx)){seenFx.add(fx);birthTimes.add(G.simTick);}}}
function evaluate(id,tier){const[p,e]=setup(id,tier);let detail={};peakSlow=peakShield=peakStun=0;seenShots=new WeakSet();seenFx=new WeakSet();birthTimes=new Set();
if(id===0){p.x=17;e.x=65;specialAbility(p,e);const hp=e.hp;BVB2.onWall(p,'left');detail={reflections:p.bvbRicochets||0,extraDamage:hp-e.hp};}
if(id===1){specialAbility(p,e);advance(2);detail={returnBatches:birthTimes.size,damage:500-e.hp};}
if(id===2){specialAbility(p,e);p.x=17;p.y=60;BVB2.onWall(p,'left');G.rt+=.2;p.x=180;p.y=17;BVB2.onWall(p,'top');p.x=300;p.y=300;e.x=98.5;e.y=38.5;advance(.12);detail={damage:500-e.hp,branches:p.bvbBriarBranches||0,hazards:G.v2.hazards.length};}
if(id===3){specialAbility(p,e);const bounce=G.v2.shots.filter(s=>s.id===3).some(s=>s.bounces>0);p.bvbTestGhost=G.v2.shots.some(s=>s.id===3&&s.ghost);advance(1.2);detail={heal:p.hp-200,damage:500-e.hp,returning:bounce,ghost:!!p.bvbTestGhost};}
if(id===4){e.x=180;specialAbility(p,e);advance(1.7);detail={damage:500-e.hp,slow:peakSlow,stun:peakStun};}
if(id===5){for(let i=0;i<3;i++){specialAbility(p,e);advance(1.5);}detail={heat:p.bvbRifleHeat||0,burn:e.status.burn||0,shots:p.bvbRifleLastBurst?.shots||0};}
if(id===6){specialAbility(p,e);p.x=17;p.y=60;BVB2.onWall(p,'left');G.rt+=.2;p.x=180;p.y=17;BVB2.onWall(p,'top');G.rt+=.2;p.x=343;p.y=300;BVB2.onWall(p,'right');p.x=300;p.y=300;e.x=98.5;e.y=38.5;advance(.12);detail={cocoons:p.bvbCocoons||0,slow:e.status.slow||0,vibrations:p.bvbSilkVibrations||0};}
if(id===7){p.x=120;e.x=160;p.hp=80;specialAbility(p,e);advance(1.5);detail={shield:peakShield,bank:p.bvbBloodBank||0,bites:p.bvbVampireLast?.hits||0,hp:p.hp,slow:peakSlow};}
if(id===8){specialAbility(p,e);p.x=17;p.y=180;BVB2.onWall(p,'left');p.x=120;e.x=151;p.vx=1;e.vx=-1;advance(.08);detail={second:p.bvbSecondThrusts||0,ghost:G.v2.shots.filter(s=>s.id===8&&s.ghost).length,anchorShots:G.v2.shots.filter(s=>s.id===8&&s.x<80).length,anchor:p.bvbSpearAnchor||null,damage:500-e.hp};}
if(id===9){p.x=17;e.x=80;specialAbility(p,e);const before=e.hp;BVB2.onWall(p,'left');detail={extraDamage:before-e.hp,reflections:p.bvbReflectedWaves||0,fire:G.v2.hazards.filter(h=>h.kind==='fire').length};}
if(id===10){specialAbility(p,e);const hazards=G.v2.hazards.filter(h=>h.owner===p.uid);detail={rook:hazards.length,combo:p.bvbChessCombo||null};}
if(id===11){let seed=1;for(let roll=1;roll<=6;roll++){for(seed=1;seed<1000;seed++){BVBRework.setSeed(G,seed);if(1+Math.floor(BVBRework.random()*6)===roll)break;}BVBRework.setSeed(G,seed);specialAbility(p,e);}detail={jackpots:p.bvbDiceJackpots||0,remembered:p.bvbDiceSeen||[]};}
if(id===12){specialAbility(p,e);p.x=17;p.y=180;BVB2.onWall(p,'left');detail={icicles:p.bvbIcicles||0,frost:G.v2.hazards.filter(h=>h.kind==='frost').length};}
return detail;}
for(let id=0;id<13;id++){
 const v1=evaluate(id,2),v2=evaluate(id,3);let ok=false;
 switch(id){case 0:ok=v2.reflections>v1.reflections&&v2.extraDamage>v1.extraDamage;break;case 1:ok=v2.returnBatches>v1.returnBatches&&v2.damage>v1.damage;break;case 2:ok=v2.hazards>v1.hazards&&v2.damage>v1.damage;break;case 3:ok=v2.ghost&&!v1.ghost;break;case 4:ok=v2.stun>v1.stun;break;case 5:ok=v2.shots===8&&v1.shots===7&&v2.burn>v1.burn;break;case 6:ok=v2.cocoons>v1.cocoons;break;case 7:ok=v2.bites===3&&v2.slow>v1.slow;break;case 8:ok=v2.second>v1.second&&v2.damage>v1.damage;break;case 9:ok=v2.fire>v1.fire;break;case 10:ok=v2.rook>v1.rook&&v2.combo==='knight-rook-queen';break;case 11:ok=v2.jackpots>v1.jackpots;break;case 12:ok=v2.icicles>v1.icicles&&v2.frost>v1.frost;break;}
 results.push({id,v2:v1,v3:v2,status:ok?'PASS':'FAIL'});
}
return results;
})()

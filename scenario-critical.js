(()=>{
 const out={critical:[],rifle:[],spider:[]};
 function setup(id,tier,shield=0){const p=actor(B[id],70,180,0,0,0,tier,0,0),e=actor(B[0],275,180,0,1,1,1,0,0);p.hp=p.mh=e.hp=e.mh=500;p.vx=p.vy=e.vx=e.vy=0;p.abilityCd=e.abilityCd=Infinity;p.aiTarget=e.aiTarget={vx:0,vy:0};p.aiDecisionClock=e.aiDecisionClock=Infinity;e.status.shield=shield;
 G={m:0,ph:'battle',my:[B[id]],bt:[B[0]],h:[3,3],score:[0,0],rn:1,rt:0,simTick:0,bl:[p,e],fx:[],pop:[],rings:[],z:[],pr:[],events:[],obstacles:[],portal:null,th:1,rare:'',matchId:'regression-'+id+'-'+tier};BVBRework.setSeed(G,1);return[p,e];}
 for(const noCrit of [false,true]){const[p,e]=setup(5,1);let critSeed=1;for(;critSeed<1000;critSeed++){BVBRework.setSeed(G,critSeed);if(BVBRework.random()<.11)break;}BVBRework.setSeed(G,critSeed);const before=e.hp;applyDamage(e,20,noCrit?{critical:false}:{});const lost=before-e.hp;out.critical.push({noCrit,lost,status:lost===(noCrit?20:30)?'PASS':'FAIL'});}
 for(let tier=1;tier<=3;tier++)for(const scenario of ['target','shield','obstacle']){
  const[p,e]=setup(5,tier,scenario==='shield'?1000:0);if(scenario==='shield')p.baseDmg=1;if(scenario==='obstacle')G.obstacles=[{x:175,y:180,r:40}];
  specialAbility(p,e);for(let i=0;i<210&&G.ph==='battle';i++){G.simTick++;step(1/60);}
  const fired=p.bvbRifleLastBurst?.shots,hits=p.bvbRifleHits||0,lost=500-e.hp;
  const good=fired===5+tier&&(scenario==='target'?hits===5+tier&&lost>0:scenario==='shield'?hits===5+tier&&lost===0:hits===0&&lost===0);
  out.rifle.push({tier,scenario,fired,hits,lost,status:good?'PASS':'FAIL'});
 }
 for(let tier=1;tier<=3;tier++){
  const[p,e]=setup(6,tier);p.x=17;p.y=60;BVB2.onWall(p,'left');G.rt+=.2;p.x=180;p.y=17;BVB2.onWall(p,'top');p.x=30;p.y=300;e.x=300;e.y=300;
  const initial=e.hp;for(let i=0;i<20;i++){G.simTick++;step(1/60);}const offLoss=initial-e.hp;
  e.x=(17+180)/2;e.y=(60+17)/2;const pre=e.hp;G.simTick++;step(1/60);const onLoss=pre-e.hp;
  const webs=G.v2.webs.length;out.spider.push({tier,webs,offLoss,onLoss,status:webs>=1&&offLoss===0&&onLoss>0?'PASS':'FAIL'});
 }
 return out;})()
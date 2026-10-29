(()=>{
 const out={follow:[],drain:[]};
 const rot=(x,y,k)=>{for(let i=0;i<k;i++)[x,y]=[360-y,x];return[x,y]};
 for(let tier=1;tier<=3;tier++)for(let rotation=0;rotation<4;rotation++)for(const diagonal of [false,true])for(const speed of [1.45,3,5]){
  const[tX,tY]=rot(240,diagonal?240:100,rotation),[pX,pY]=rot(282,diagonal?240:100,rotation);
  const p=actor(B[7],pX,pY,0,0,0,tier,0,0),e=actor(B[0],tX,tY,0,1,1,1,0,0);p.hp=p.mh=e.hp=e.mh=500;
  G={m:0,ph:'battle',rt:0,bl:[p,e],fx:[],pop:[],rings:[]};
  p.bvbVampireLatch={targetUid:e.uid,remaining:3,hits:0,totalStolen:0,phase:'latched',next:Infinity,angle:rotation*Math.PI/2,resumeVx:1,resumeVy:0};
  let maxJump=0,minGap=Infinity;const errors=[];
  for(let i=0;i<=Math.ceil(100/speed);i++){
   const off=Math.min(100,i*speed);[e.x,e.y]=rot(240+off,(diagonal?240+off:100),rotation);const prev=[p.x,p.y];G.rt+=1/60;
   BVBFirstBatchEnhanced.tickVampire(G,1/60);maxJump=Math.max(maxJump,Math.hypot(p.x-prev[0],p.y-prev[1]));minGap=Math.min(minGap,Math.hypot(p.x-e.x,p.y-e.y));
   if(p.x<p.r-1e-6||p.x>360-p.r+1e-6||p.y<p.r-1e-6||p.y>360-p.r+1e-6)errors.push('OUTSIDE');
  }
  if(minGap<35-1e-6)errors.push('OVERLAP');if(maxJump>15)errors.push('JUMP');
  out.follow.push({tier,rotation,diagonal,speed,maxJump,minGap,status:errors.length?'FAIL':'PASS',errors});
 }
 for(let tier=1;tier<=3;tier++)for(const shield of [0,100])for(const hp of [450,499,500])for(const targetHp of [1,10,500]){
  const p=actor(B[7],140,180,0,0,0,tier,0,0),e=actor(B[0],180,180,0,1,1,1,0,0);p.hp=hp;p.mh=500;e.hp=targetHp;e.mh=500;e.status.shield=shield;
  G={m:0,ph:'battle',rt:0,bl:[p,e],fx:[],pop:[],rings:[]};BVBRework?.setSeed?.(G,1234+tier);BVBFirstBatchEnhanced.castVampire(p,e);
  let hits=0,lastHp=p.hp,totalHeal=0,violations=[];
  for(let i=0;i<150;i++){
   const before=e.hp,beforeOwn=p.hp;G.rt+=1/60;BVBFirstBatchEnhanced.tickVampire(G,1/60);
   const taken=before-e.hp,heal=p.hp-beforeOwn;
   if(heal>taken+1e-6||heal<0||taken>20+1e-6||p.hp>p.mh||e.hp<0)violations.push('HP_INVARIANT');
   if(p.bvbVampireLast)hits=p.bvbVampireLast.hits;else hits=p.bvbVampireLatch?.hits||0;
   totalHeal+=heal;lastHp=p.hp;
  }
  if(targetHp===500&&hits!==3)violations.push('NOT_3_STRIKES');if(p.bvbVampireLatch)violations.push('NOT_RELEASED');
  if(shield===100&&(totalHeal!==0||e.hp!==targetHp))violations.push('SHIELD_HEAL');
  out.drain.push({tier,shield,hp,targetHp,hits,totalHeal,remainingHp:e.hp,status:violations.length?'FAIL':'PASS',violations});
 }
 return out;})()
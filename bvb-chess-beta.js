/* Ball VS Ball 2.0 — Chess Ball beta rework (ID 10).
   Host-authoritative gameplay; presentation works with replayed states.
   Never publish this branch as the stable game without approval. */
(() => {
  'use strict';
  if(typeof specialAbility!=='function'||typeof step!=='function'||!window.BVB2)return;
  const ID=10, CENTER=180, FIELD=360, MARGIN=20, KNIGHT_TILE=43;
  const PIECES=['rook','bishop','knight','queen'];
  const label={rook:'WIEŻA',bishop:'GONIEC',knight:'SKOCZEK',queen:'KRÓLOWA'};
  const pickRandom=()=>window.BVBRework?.random?.()??Math.random();
  const choose=a=>a[Math.min(a.length-1,Math.floor(pickRandom()*a.length))];
  const clampCoord=n=>Math.max(MARGIN,Math.min(FIELD-MARGIN,n));
  function shuffle(a) {
    a=a.slice();
    for(let i=a.length-1;i>0;i--){const j=Math.floor(pickRandom()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  }
  // Knight geometry deliberately has six selected legal L moves. Never show
  // their lines simultaneously, which could form an unwanted visual symbol.
  function paths(piece) {
    if(piece==='knight'){
      const offsets=shuffle([[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]).slice(0,6);
      return offsets.map(([dx,dy])=>({
        piece,points:[{x:CENTER,y:CENTER},
          {x:clampCoord(CENTER+(Math.abs(dx)===2?dx:0)*KNIGHT_TILE),
           y:clampCoord(CENTER+(Math.abs(dy)===2?dy:0)*KNIGHT_TILE)},
          {x:clampCoord(CENTER+dx*KNIGHT_TILE),y:clampCoord(CENTER+dy*KNIGHT_TILE)}]
      }));
    }
    let d=[[1,0],[-1,0],[0,1],[0,-1]];
    if(piece==='bishop')d=[[1,1],[1,-1],[-1,1],[-1,-1]];
    if(piece==='queen')d=d.concat([[1,1],[1,-1],[-1,1],[-1,-1]]);
    return shuffle(d).map(([dx,dy])=>({piece,points:[{x:CENTER,y:CENTER},
      {x:clampCoord(CENTER+dx*150),y:clampCoord(CENTER+dy*150)}]}));
  }
  function routeLength(points) {
    let length=0;
    for(let i=1;i<points.length;i++)length+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);
    return length;
  }
  function positionAt(points,distance) {
    for(let i=1;i<points.length;i++){
      const a=points[i-1],b=points[i],len=Math.hypot(b.x-a.x,b.y-a.y);
      if(distance<=len||i===points.length-1){const t=len?Math.max(0,Math.min(1,distance/len)):1;
        return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};}
      distance-=len;
    }
    return points[points.length-1];
  }
  function closestSegment(px,py,ax,ay,bx,by){
    const dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy;
    const t=len?Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/len)):0;
    return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));
  }
  function putEffect(o,text,color) {
    if(!G)return;
    G.pop||=[];G.rings||=[];
    G.pop.push({x:o.x,y:Math.max(24,o.y-o.r-24),text,c:color,age:0,life:.85});
    if(G.pop.length>24)G.pop.splice(0,G.pop.length-24);
    G.rings.push({x:o.x,y:o.y,radius:o.r+7,c:color,age:0,life:.5});
    if(G.rings.length>24)G.rings.splice(0,G.rings.length-24);
  }
  function plan(o,foe) {
    const tier=Math.max(1,Math.min(3,o.tier||1));
    const first=choose(PIECES.slice(0,tier===1?3:4));
    const result=paths(first).map(p=>({...p,damage:tier===3?9:7,speed:390,phase:1}));
    if(tier>=2){
      const pool=tier===3?PIECES.filter(p=>p!==first):PIECES;
      const second=choose(pool),secondPaths=paths(second);
      if(tier===3){
        // V3 reads the foe's velocity and prioritises routes likely to intercept it.
        const tx=clampCoord(foe.x+(foe.vx||0)*22),ty=clampCoord(foe.y+(foe.vy||0)*22);
        const proximity=r=>Math.min(...r.points.slice(1).map((p,i)=>{
          const a=r.points[i];return closestSegment(tx,ty,a.x,a.y,p.x,p.y);
        }));
        secondPaths.sort((a,b)=>proximity(a)-proximity(b));
      }
      for(let n=0;n<6;n++)result.push({...secondPaths[n%secondPaths.length],
        damage:tier===3?12:10,speed:tier===3?550:480,phase:2});
    }
    if(tier===3){
      // Smart queen: order candidate lanes toward the projected enemy position.
      const aimX=clampCoord(foe.x+(foe.vx||0)*25),aimY=clampCoord(foe.y+(foe.vy||0)*25);
      const vx=aimX-CENTER,vy=aimY-CENTER,mag=Math.hypot(vx,vy)||1;
      const queen=paths('queen').sort((a,b)=>{
        const pa=a.points.at(-1),pb=b.points.at(-1);
        return ((pb.x-CENTER)*vx+(pb.y-CENTER)*vy)/Math.max(1,Math.hypot(pb.x-CENTER,pb.y-CENTER))/mag-
               ((pa.x-CENTER)*vx+(pa.y-CENTER)*vy)/Math.max(1,Math.hypot(pa.x-CENTER,pa.y-CENTER))/mag;
      });
      for(const p of queen.slice(0,3))result.push({...p,damage:15,speed:630,phase:3,finale:true});
    }
    return result;
  }
  const previousSpecial=specialAbility;
  specialAbility=function(o,foe) {
    if(o?.b?.id!==ID)return previousSpecial(o,foe);
    if(!foe||!alive(foe)||netRole==='guest'||o.chess?.active)return;
    o.chess={active:true,phase:'center',routes:plan(o,foe),index:0,
      dist:0,warning:0,hit:false,lastPhase:0,origin:{x:o.x,y:o.y}};
    o.vx=0;o.vy=0;
    putEffect(o,'CHESS DASH','#fde68a');
  };
  function complete(o) {
    o.chess=null;o.abilityCd=5;
    putEffect(o,'TARCZA ZNIKA','#fcd34d');
    if(o.b.id===ID){const a=pickRandom()*Math.PI*2;o.vx=Math.cos(a)*.8;o.vy=Math.sin(a)*.8;}
  }
  function hit(o,foe,route,x1,y1,x2,y2) {
    if(!foe||!alive(foe)||route.hit||closestSegment(foe.x,foe.y,x1,y1,x2,y2)>o.r+foe.r)return;
    route.hit=true;
    const damage=window.BVBRework?.abilityDamage?.(o,foe,route.damage)??route.damage;
    applyDamage(foe,damage);
    const dx=foe.x-o.x,dy=foe.y-o.y,length=Math.hypot(dx,dy)||1;
    const push=route.finale?.38:.20;
    foe.vx=(foe.vx||0)+dx/length*push;
    foe.vy=(foe.vy||0)+dy/length*push;
    if(o.combatStats){o.combatStats.damageDealt=(o.combatStats.damageDealt||0)+damage;o.combatStats.contactHits=(o.combatStats.contactHits||0)+1;}
    putEffect(foe,route.finale?'SZACH-MAT!':'-'+Math.round(damage),'#f87171');
    if(typeof SFX?.hit==='function')SFX.hit();
  }
  function advance(o,foe,dt) {
    const c=o.chess;if(!c?.active)return;
    o.vx=0;o.vy=0;o.abilityCd=999;
    if(c.phase==='center'){
      const dx=CENTER-o.x,dy=CENTER-o.y,d=Math.hypot(dx,dy),move=Math.min(d,500*dt);
      if(d>0){o.x+=dx/d*move;o.y+=dy/d*move;}
      if(d<=move+.01){o.x=o.y=CENTER;c.phase='warn';c.warning=.25;}
      return;
    }
    const route=c.routes[c.index];
    if(!route){complete(o);return;}
    if(route.phase!==c.lastPhase){c.lastPhase=route.phase;putEffect(o,
      route.phase===3?'SZACH-MAT':label[route.piece],route.phase===3?'#c084fc':'#fbbf24');}
    if(c.phase==='warn'){
      c.warning-=dt;
      if(c.warning<=0){c.phase='out';c.dist=0;route.hit=false;}
      return;
    }
    if(c.phase==='out'||c.phase==='back'){
      const len=routeLength(route.points),prevX=o.x,prevY=o.y;
      c.dist=Math.max(0,Math.min(len,c.dist+(c.phase==='out'?1:-1)*route.speed*dt*(c.phase==='back'?1.3:1)));
      const pos=positionAt(route.points,c.dist);o.x=pos.x;o.y=pos.y;
      o.rotation=(o.rotation||0)+dt*(c.phase==='out'?13:7);
      if(c.phase==='out')hit(o,foe,route,prevX,prevY,o.x,o.y);
      if(c.phase==='out'&&c.dist>=len-.01)c.phase='back';
      else if(c.phase==='back'&&c.dist<=.01){c.index++;c.phase='warn';c.warning=.22;
        if(c.index>=c.routes.length)complete(o);}
    }
  }
  // Our dash positions are advanced on authoritative fixed simulation ticks.
  // No teleports between turns: every trip to/from the centre is traversed.
  const previousStep=step;
  step=function(dt){
    if(!G||G.ph!=='battle')return previousStep(dt);
    const oldHp=(G.bl||[]).filter(o=>o.b?.id===ID&&o.chess?.active).map(o=>[o,o.hp]);
    for(const [o] of oldHp){o.vx=0;o.vy=0;}
    previousStep(dt);
    if(!G||G.ph!=='battle'||netRole==='guest')return;
    for(const [o,hp] of oldHp){if(o.chess?.active)o.hp=Math.max(o.hp,hp);}
    for(const o of G.bl||[]){
      if(o.b?.id!==ID||!o.chess?.active||!alive(o))continue;
      const foe=G.bl.find(f=>f!==o&&alive(f));
      advance(o,foe,dt);
    }
  };
  // The invulnerable state affects damage, not the opponent's hit reactions.
  const previousDamage=applyDamage;
  applyDamage=function(target,amount) {
    if(target?.b?.id===ID&&target.chess?.active)return;
    return previousDamage(target,amount);
  };
  const oldStats=getBallStats;
  getBallStats=function(id,...args){
    const st=oldStats(id,...args);
    if(id===ID){const tier=st.tier||1;st.cd=5;
      const name=tier===1?'Chess Dash':tier===2?'Chess Combo':'Royal Checkmate';
      const sub=tier===1?'1 figura: wieża (4), goniec (4), skoczek (6 tras L).':
        tier===2?'2 fazy: losowe figury (także królowa), potem 6 mocniejszych szarż.':
        '3 fazy: figury, 6 szarż i finał Szach-Mat (3 wybrane tory królowej).';
      st.activeDesc=name+': '+sub+' Tarcza 100% tylko podczas umiejętności. Obrażenia wyłącznie po trafieniu.';
      st.evolutionDesc=st.activeDesc;
    }return st;
  };
  if(window.BVB2.abilities?.[ID]){
    Object.assign(window.BVB2.abilities[ID],{title:'Chess Dash / Chess Combo / Royal Checkmate',
      desc:'Szarże po trasach figur, pojedyncze czerwone ostrzeżenia i tarcza 100% tylko podczas umiejętności.',cooldown:5});
    if(B?.[ID]){B[ID].d=window.BVB2.abilities[ID].desc;B[ID].skillTitle='Chess Ball';}
  }
  const oldPrepare=window.BVB2.prepareActors;
  window.BVB2.prepareActors=function(g,p,e){
    oldPrepare?.(g,p,e);
    for(const o of [p,e])if(o?.b?.id===ID&&!o.chessSizeAdjusted){
      o.r=Math.max(9,o.r*.85);o.chessSizeAdjusted=true;
    }
  };
  // VFX are cosmetic; never mutate HP or path selection from draw().
  const oldDraw=draw;
  draw=function(){
    oldDraw();
    if(!G||!cx)return;
    const time=Number(G.rt)||0;
    for(const o of G.bl||[]){
      if(o?.b?.id!==ID||!alive(o))continue;
      const tier=Math.max(1,Math.min(3,o.tier||1));
      const count=tier===1?2:tier===2?4:6,glow=tier===3?'#c084fc':'#fbbf24';
      cx.save();
      // Two counter-rotating aura layers; all rings follow the moving actor.
      for(let ring=0;ring<(tier===3?3:2);ring++){
        cx.strokeStyle=ring%2?'#f8fafc':glow;cx.globalAlpha=.34+Math.sin(time*3+ring)*.13;
        cx.lineWidth=1.5;cx.beginPath();
        cx.ellipse(o.x,o.y,o.r+8+ring*5,o.r+3+ring*4,time*(ring%2?-1:1)*.7,0,Math.PI*2);cx.stroke();
      }
      // Pawn figures orbit in front of the sphere and animate independently.
      for(let n=0;n<count;n++){
        const a=time*(tier===3?1.65:1.2)+n*Math.PI*2/count;
        const x=o.x+Math.cos(a)*(o.r+7),y=o.y+Math.sin(a)*(o.r+5);
        cx.globalAlpha=.92;cx.fillStyle=n%2?'#e2e8f0':'#fbbf24';
        cx.shadowColor=glow;cx.shadowBlur=5;
        cx.beginPath();cx.arc(x,y-2.5,2.4,0,7);cx.fill();
        cx.fillRect(x-2.5,y,5,5);cx.fillRect(x-4,y+4.2,8,1.8);
      }
      if(tier>=2){
        cx.shadowBlur=6;cx.fillStyle='#fde68a';cx.font='bold 15px serif';
        cx.textAlign='center';cx.fillText('♜',o.x+Math.cos(time)*4,o.y-o.r-17);
      }
      if(tier===3){
        cx.font='bold 19px serif';cx.fillStyle='#fcd34d';cx.fillText('♛',o.x,o.y-o.r-29+Math.sin(time*3)*2);
        for(let i=0;i<4;i++){const a=time*.7+i*Math.PI/2;
          cx.font='12px serif';cx.fillStyle='#e9d5ff';
          cx.fillText(['♜','♝','♞','♛'][i],o.x+Math.cos(a)*(o.r+25),o.y+Math.sin(a)*(o.r+22));}
      }
      if(o.chess?.active){
        cx.shadowBlur=13;cx.strokeStyle=glow;cx.lineWidth=2.4;cx.globalAlpha=.9;
        cx.beginPath();cx.arc(o.x,o.y,o.r+11+Math.sin(time*8)*2,0,Math.PI*2);cx.stroke();
        const c=o.chess,route=c.routes?.[c.index];
        if(c.phase==='warn'&&route){
          cx.strokeStyle='#ff334a';cx.shadowColor='#ff123e';cx.shadowBlur=14;
          cx.globalAlpha=.7+.24*Math.sin(time*24);cx.lineWidth=3.4;cx.lineCap='round';
          cx.beginPath();
          for(let i=0;i<route.points.length;i++){
            const p=route.points[i];i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y);
          }cx.stroke();
        }
      }
      cx.restore();
    }
  };
  window.BVBChessBeta={id:ID,paths,plan,routeLength,positionAt,closestSegment};
})();

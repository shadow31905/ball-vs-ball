/* BALL VS BALL · beta 26–38 · Konduktor #33
   Separate race-track physics. The body artwork can be replaced independently. */
(function(){
'use strict';
const ID=33;
const cap=(n,min,max)=>Math.max(min,Math.min(max,n));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const tier=o=>cap(Number(o.tier||S?.tr?.[ID]||1),1,3);
const point=(x,y)=>({x,y});
function route(raw){
 let d=0;const p=[{...raw[0],d:0}];
 for(let i=1;i<raw.length;i++){const add=dist(raw[i],raw[i-1]);if(add<.01)continue;d+=add;p.push({...raw[i],d});}
 return {p,length:d};
}
function at(rail,s){
 const p=rail.p;if(!p.length)return null;
 if(s<0||s>rail.length)return null;
 let lo=0,hi=p.length-1;
 while(lo<hi){const mid=(lo+hi)>>1;if(p[mid].d<s)lo=mid+1;else hi=mid;}
 const k=Math.max(1,lo),a=p[k-1],b=p[k]||a;
 const t=(s-a.d)/Math.max(.0001,b.d-a.d);
 return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,a:Math.atan2(b.y-a.y,b.x-a.x)};
}
function branch(raw){
 const from=Math.floor(raw.length*.43),out=raw.slice(0,from+1).map(v=>({...v}));
 for(let i=from+1;i<raw.length;i++){
  const a=raw[i-1],b=raw[i],m=Math.hypot(b.x-a.x,b.y-a.y)||1;
  const shift=25*Math.min(1,(i-from)/6);
  out.push(point(cap(b.x-(b.y-a.y)/m*shift,16,344),cap(b.y+(b.x-a.x)/m*shift,16,344)));
 }
 return out;
}
function spawn(o,raw,lv){
 const st=G.v2;if(!st)return;
 st.conductorTrains ||= [];
 const tracks=[route(raw)];
 if(lv===3)tracks.push(route(branch(raw)));
 for(let i=0;i<tracks.length;i++)st.conductorTrains.push({
  owner:o.uid,team:o.team,tier:lv,track:tracks[i],s:0,
  speed:lv===1?124:lv===2?147:166,carCount:lv===1?2:lv===2?3:3,
  gap:23,inside:{},trapNext:64,secondary:i===1
 });
 if(st.conductorTrains.length>12)st.conductorTrains.splice(0,st.conductorTrains.length-12);
}
function update(dt){
 if(!G||G.ph!=='battle'||!G.v2||netRole==='guest')return;
 const st=G.v2;
 st.conductorTrains ||= [];st.conductorTraps ||= [];
 for(const o of G.bl||[]){
  if(o?.b?.id!==ID||o.hp<=0)continue;
  const lv=tier(o),max=lv===1?215:lv===2?258:287;
  const p=point(o.x,o.y);
  o.conductorRail ||= {points:[p],length:0,last:p};
  const r=o.conductorRail,delta=dist(p,r.last);
  // Avoid constructing enormous rails after a teleport or a replay seek.
  if(delta>65){o.conductorRail={points:[p],length:0,last:p};continue;}
  if(delta>=1.4){r.points.push(p);r.length+=delta;r.last=p;}
  if(r.length>=max&&r.points.length>=5){
    spawn(o,r.points.slice(),lv);
    o.conductorRail={points:[p],length:0,last:p};
  }
 }
 for(const tr of st.conductorTrains){
  const owner=(G.bl||[]).find(o=>o.uid===tr.owner&&o.hp>0);
  if(!owner){tr.done=true;continue;}
  const old=tr.s;tr.s+=tr.speed*dt;
  if(tr.tier>=2&&tr.s>tr.trapNext&&!tr.secondary){
    const p=at(tr.track,tr.trapNext);
    if(p)st.conductorTraps.push({x:p.x,y:p.y,life:2.2,team:tr.team,owner:tr.owner,inside:{}});
    tr.trapNext+=75;
  }
  for(let j=0;j<tr.carCount;j++){
   const carriage=at(tr.track,tr.s-j*tr.gap);
   if(!carriage)continue;
   for(const foe of G.bl||[]){
    if(foe.team===tr.team||foe.hp<=0)continue;
    const key=j+':'+foe.uid,over=Math.hypot(foe.x-carriage.x,foe.y-carriage.y)<foe.r+10;
    if(over&&!tr.inside[key]){
      applyDamage(foe,4.4+(tr.tier-1)*.9);
      const nx=Math.cos(carriage.a),ny=Math.sin(carriage.a);
      foe.vx=(foe.vx||0)+nx*.23;foe.vy=(foe.vy||0)+ny*.23;
    }
    tr.inside[key]=over;
   }
  }
  if(tr.s>tr.track.length+(tr.carCount-1)*tr.gap+12)tr.done=true;
 }
 st.conductorTrains=st.conductorTrains.filter(t=>!t.done);
 for(const trap of st.conductorTraps){
  trap.life-=dt;
  for(const foe of G.bl||[]){
   if(foe.team===trap.team||foe.hp<=0)continue;
   const over=Math.hypot(foe.x-trap.x,foe.y-trap.y)<foe.r+9;
   if(over&&!trap.inside[foe.uid]){
    applyDamage(foe,2.3);foe.vx=(foe.vx||0)*.85;foe.vy=(foe.vy||0)*.85;
   }
   trap.inside[foe.uid]=over;
  }
 }
 st.conductorTraps=st.conductorTraps.filter(t=>t.life>0);
}
function drawRails(rail,from,to,color){
 const cx0=cx;if(to<=from+2)return;
 cx0.save();cx0.lineJoin='round';cx0.lineCap='round';
 const pts=[];
 for(let s=from;s<=to;s+=4){const p=at(rail,s);if(p)pts.push(p);}
 const end=at(rail,to);if(end)pts.push(end);
 if(pts.length<2){cx0.restore();return;}
 // Sleepers are placed per true arclength, including at sharp turns.
 for(let s=Math.ceil(from/12)*12;s<=to;s+=12){
  const p=at(rail,s);if(!p)continue;const nx=-Math.sin(p.a),ny=Math.cos(p.a);
  cx0.strokeStyle='#654c39';cx0.lineWidth=5;cx0.beginPath();
  cx0.moveTo(p.x+nx*8,p.y+ny*8);cx0.lineTo(p.x-nx*8,p.y-ny*8);cx0.stroke();
 }
 for(const offset of [-5,5]){
  cx0.beginPath();for(let i=0;i<pts.length;i++){
   const p=pts[i],x=p.x-Math.sin(p.a)*offset,y=p.y+Math.cos(p.a)*offset;
   if(!i)cx0.moveTo(x,y);else cx0.lineTo(x,y);
  }
  cx0.strokeStyle='#253449';cx0.lineWidth=4;cx0.stroke();
  cx0.strokeStyle=color;cx0.lineWidth=2.1;cx0.stroke();
 }
 cx0.restore();
}
function drawCarriage(p,engine,lv,index,secondary){
 cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);
 const tint=lv===1?'#ae774d':lv===2?'#db8772':'#3dbfd5';
 cx.shadowColor=tint;cx.shadowBlur=7;
 cx.fillStyle='#182a38';cx.strokeStyle='#d9b16e';cx.lineWidth=1.5;
 cx.beginPath();cx.roundRect(-12,-8,24,16,4);cx.fill();cx.stroke();
 cx.fillStyle=engine?'#2e5566':'#4e343f';
 cx.fillRect(-7,-6,15,12);
 cx.fillStyle=tint;cx.fillRect(-6,-4,10,8);
 if(engine){
  cx.fillStyle='#263240';cx.fillRect(-9,-3,6,6);
  cx.fillStyle='#f8e7ab';cx.beginPath();cx.arc(11,0,3,0,Math.PI*2);cx.fill();
  cx.fillStyle='#c6a56e';cx.fillRect(-7,-12,5,5);
 }else{cx.strokeStyle='#ffe7b2';cx.strokeRect(-4,-3,9,6);}
 cx.shadowBlur=0;cx.fillStyle='#101820';
 for(const x of [-7,7])for(const y of [-8,8]){
  cx.beginPath();cx.arc(x,y,2.8,0,Math.PI*2);cx.fill();
  cx.strokeStyle='#bcc9d5';cx.lineWidth=1;cx.stroke();
 }
 if(lv===3&&secondary){cx.fillStyle='#aaf9ff';cx.fillRect(-4,-2,8,4);}
 cx.restore();
}
function render(){
 if(!G||G.ph!=='battle'||!G.v2)return;
 const st=G.v2;
 cx.save();
 for(const o of G.bl||[]){
  if(o?.b?.id!==ID||o.hp<=0||!o.conductorRail)continue;
  const r=route(o.conductorRail.points);
  if(r.length>2)drawRails(r,0,r.length,'#b0a192');
 }
 for(const tr of st.conductorTrains||[]){
  const head=cap(tr.s,0,tr.track.length);
  const end=cap(tr.s-(tr.carCount-1)*tr.gap-15,0,tr.track.length);
  drawRails(tr.track,end,tr.track.length,tr.tier===3?'#63e6f2':tr.tier===2?'#e3a27e':'#d3b58b');
  for(let j=tr.carCount-1;j>=0;j--){
   const p=at(tr.track,tr.s-j*tr.gap);
   if(p)drawCarriage(p,j===0,tr.tier,j,tr.secondary);
  }
 }
 for(const t of st.conductorTraps||[]){
  cx.fillStyle='#e7a979';cx.strokeStyle='#5b2c21';cx.lineWidth=1.5;
  cx.save();cx.translate(t.x,t.y);cx.rotate(Math.PI/4);cx.fillRect(-6,-6,12,12);cx.strokeRect(-6,-6,12,12);cx.restore();
 }
 cx.restore();
}
const previousStep=step;
step=function(dt){previousStep(dt);if(Number.isFinite(dt)&&dt>0&&dt<.25)update(dt);};
const previousDraw=draw;
draw=function(){previousDraw();render();};
const previousSpecial=specialAbility;
specialAbility=function(o,foe){
 if(o?.b?.id===ID){o.attackGlow=Math.max(o.attackGlow||0,.35);return;}
 return previousSpecial(o,foe);
};
window.BVBConductorTracksBeta={version:1,inspect:()=>G?.v2?.conductorTrains?.map(t=>({tier:t.tier,dist:t.s,route:t.track.length}))||[]};
})();
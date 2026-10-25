/* BVB 2.0 — Animated skill preview in collection, keeps base inventory UI. */
(() => {
'use strict';
if(!window.BVB2?.abilities)return;
const css=document.createElement('style');
css.textContent=[
'.bvb-skill-preview{margin-top:14px;border:1px solid #555fc6;background:#090f2a;',
'border-radius:15px;padding:12px;text-align:left}',
'.bvb-skill-preview h3{margin:0 0 6px;color:#c4b5fd;font-size:.93rem}',
'.bvb-skill-preview canvas{display:block;max-width:100%;height:auto;border-radius:12px;',
'background:linear-gradient(140deg,#0b1840,#1e1945);border:1px solid #53619e;margin:9px auto}',
'.bvb-skill-preview p{font-size:.79rem;line-height:1.5;color:#cbd5e1}',
'.bvb-skill-preview button{margin:8px 0 0;width:100%}'
].join('');
document.head.appendChild(css);
const defensive=new Set(['shield','reflect','heal','growth','time','eclipse','mirage']);
const zones=new Set(['poison','gas','mine','zone','lava','sun','frost','thorn','grid','pet','turret','train']);
const beams=new Set(['beam','prism','tether','ray']);
const dashes=new Set(['dash','blink','charge','chess']);
const colors={frost:'#9ee9ff',shield:'#67e8f9',heal:'#86efac',shock:'#facc15',poison:'#b5f574',lava:'#fb923c'};
let ticket=0;
function play(id){
 const canvas=document.getElementById('bvb-skill-preview-canvas');
 if(!canvas||!B[id])return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const evolution=getBallStats(id).tier,skill=window.BVB2.abilities[id],type=skill.kind,color=colors[type]||skill.color||'#c4b5fd';
 const token=++ticket,start=performance.now(),W=320,H=150;
 function circle(x,y,r,c){
  ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 function glowingLine(x,y,x2,y2,w,c,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.shadowColor=c;ctx.shadowBlur=10;
  ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
 }
 function sprite(ball,x,y,r){
  const img=ART_IMAGES.get(ball);
  if(img?.complete&&img.naturalWidth)ctx.drawImage(img,x-r,y-r,r*2,r*2);
  else circle(x,y,r,B[ball]?.c||'#fff');
 }
 function frame(now){
  // Stop the preview when the menu, collection window or its parent view is hidden.
  // Otherwise requestAnimationFrame would keep rendering during the actual fight on phones.
  if(token!==ticket||canvas!==document.getElementById('bvb-skill-preview-canvas')||canvas.closest?.('[hidden]'))return;
  const phase=((now-start)/1000)%2.9,t=Math.min(1,Math.max(0,(phase-.35)/1.2));
  ctx.clearRect(0,0,W,H);
  const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#0b1433');grad.addColorStop(1,'#1c1647');
  ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#52639a';ctx.lineWidth=3;ctx.strokeRect(3,3,W-6,H-6);
  for(let j=0;j<18;j++){
   const x=(j*73+13)%W,y=(j*47+29)%H;
   circle(x,y,j%4===0?1.7:1,'#596ca5');
  }
  const ox=dashes.has(type)?65+Math.max(0,t-.1)*76:67,ex=248,oy=H/2,ey=H/2;
  const opacity=phase>2.3?Math.max(.05,(2.9-phase)/.6):1;
  ctx.save();ctx.globalAlpha=opacity;
  if(type==='web'){
   const startX=12,startY=42,endX=W-12,endY=111;
   if(phase>.38)circle(startX,startY,4,'#fef9c3');
   if(phase>.9)circle(endX,endY,4,'#fef9c3');
   if(phase>.9){
    glowingLine(startX,startY,endX,endY,2,'#cbd5e1');
    for(let i=1;i<8;i++){const p=i/8,x=startX+(endX-startX)*p,y=startY+(endY-startY)*p;
     glowingLine(x-7,y-7,x+7,y+7,.75,'#dbeafe',.7);}
   }
  }else if(defensive.has(type)){
   if(phase>.5){
    ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=18;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(ox,oy,24+12*Math.sin(t*Math.PI),0,7);ctx.stroke();
   }
  }else if(zones.has(type)){
   if(phase>.42){
    const radius=15+30*t;ctx.save();ctx.globalAlpha=.23;
    circle(ex,ey,radius,color);ctx.restore();
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ex,ey,radius,0,7);ctx.stroke();
   }
  }else if(beams.has(type)){
   if(phase>.48){
    glowingLine(ox+13,oy,ex-12,ey,8,color,.55);
    glowingLine(ox+13,oy,ex-12,ey,2,'#ffffff',.85);
   }
  }else if(dashes.has(type)){
   if(phase>.38)glowingLine(ox-55,oy,ox-12,oy,4,color,.5);
  }else if(phase>.35){
   let px=ox+25+Math.min(1,t)*155,py=oy+Math.sin(t*Math.PI*2)*8;
   glowingLine(px-23,py,px,py,3,color,.65);circle(px,py,6,color);
   circle(px-1,py-2,2,'#ffffff');
  }
  if(type==='orbit'||type==='shard'||type==='swarm'){
    for(let i=0;i<evolution+2;i++){
     const angle=(now-start)/500+i*2*Math.PI/(evolution+2);
     circle(ox+Math.cos(angle)*27,oy+Math.sin(angle)*27,4,color);
    }
  }
  sprite(1,ex,ey,16);
  sprite(id,ox,oy,18);
  if(phase>1.2 && phase<2.15 && !defensive.has(type)){
   ctx.strokeStyle='#ffffff';ctx.globalAlpha=.75*Math.sin((phase-1.2)/.95*Math.PI);
   ctx.lineWidth=2;ctx.beginPath();ctx.arc(ex,ey,20+(phase-1.2)*15,0,7);ctx.stroke();
  }
  ctx.restore();
  if(phase<2.9)requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
}
const prev=openBallDetail;
openBallDetail=function(id){
 prev(id);
 const ball=B[id],d=window.BVB2.abilities[id],s=getBallStats(id);
 if(!ball||!d)return;
 const box=document.createElement('section');
 box.className='bvb-skill-preview';
 const fast=d.speed>1.02,heavy=d.baseHp>112;
 const strength=heavy?'wytrzymałość':fast?'mobilność':d.kind==='beam'||d.kind==='volley'?'zasięg':'specjalne działanie';
 const weakness=heavy?'wolniejszy ruch':fast?'mniej zdrowia':'wymaga właściwego trafienia lub ustawienia';
 box.innerHTML='<h3>✨ '+esc(d.title)+' — podgląd animacji</h3>'+
  '<canvas id="bvb-skill-preview-canvas" width="320" height="150" aria-label="Animowany podgląd umiejętności"></canvas>'+
  '<p><b>⚔️ Działanie:</b> '+esc(d.desc)+'</p>'+'<p>'+esc(s.evolutionDesc||'')+'</p>'+
  '<p><b>⏱️ Odnowienie:</b> '+(d.kind==='web'?'pasywna (odbicia)':s.cd+' s')+
  ' · <b>💨 Prędkość:</b> '+(d.speed>1?'+':'')+Math.round((d.speed-1)*100)+'%</p>'+
  '<p><b>✅ Zaleta:</b> '+strength+' · <b>⚠️ Słabość:</b> '+weakness+'</p>'+
  '<button class="b ac" type="button" id="bvbReplaySkill">🔄 Odtwórz podgląd</button>'+
  '<p style="font-size:.7rem;opacity:.7">Schemat umiejętności; animacja w walce zależy od położenia kulek.</p>';
 document.querySelector('#ovb')?.appendChild(box);
 box.querySelector('#bvbReplaySkill').addEventListener('click',()=>play(id));
 requestAnimationFrame(()=>play(id));
};
window.BVB2Preview={play};
})();
/* Five distinct, deterministic final-hit cutscenes. Host chooses one fair
 * 20% variant; render only reads recorded data, never combat state or RNG. */
(() => {
'use strict';
const SCENES=Object.freeze([
 {title:'FALA TYTANA',tag:'FALA UDERZENIOWA',color:'#38bdf8',shade:'#061b39'},
 {title:'SUPERNOWA',tag:'GWIEZDNY BŁYSK',color:'#fbbf24',shade:'#3c1b07'},
 {title:'PĘKNIĘCIE CZASU',tag:'WIR CZASOPRZESTRZENI',color:'#c084fc',shade:'#22113e'},
 {title:'OSTRZA ŚWIATŁA',tag:'PODWÓJNE CIĘCIE',color:'#fb7185',shade:'#3b1025'},
 {title:'KRYSZTAŁOWY FINAŁ',tag:'ROZBŁYSK PRYZMATU',color:'#34d399',shade:'#082b29'}
]);
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const ease=t=>{const u=clamp(t);return u*u*(3-2*u);};
function chooseVariant(random=Math.random){
 // The same half-open interval width (1/5) for each scene.
 const value=random();
 return Number.isFinite(value)?Math.min(4,Math.max(0,Math.floor(clamp(value,0,.999999999999)*5))):0;
}
function finish(g,winner){
 if(!g||!Array.isArray(g.bl)||![0,1].includes(winner)||g.finisher)return;
 const victor=g.bl.find(o=>o.team===winner&&o.b),loser=g.bl.find(o=>o.team!==winner&&o.b);
 if(!victor||!loser||!(victor.hp>0)||!(loser.hp<=0)||![victor.x,victor.y,loser.x,loser.y].every(Number.isFinite))return;
 // No game RNG and no change to the winner, rewards, HP or ongoing damage.
 const variant=chooseVariant();
 g.finisher={x:loser.x,y:loser.y,fromX:victor.x,fromY:victor.y,
  color:victor.b.c||'#fbbf24',loserColor:loser.b.c||'#94a3b8',
  winnerId:victor.b.id,winnerName:String(victor.b.n||'Kulka').slice(0,36),
  variant,style:variant,age:0,life:1.8};
 window.BVBRework?.trace?.(g,'FINISHER',{winner,id:victor.b.id,variant});
 if(typeof SFX!=='undefined')SFX.boom?.();
}
function tick(g,dt){
 if(g?.finisher&&Number.isFinite(dt))
  g.finisher.age=Math.min(g.finisher.life,g.finisher.age+clamp(dt,0,.12));
}
function line(ctx,x,y,x2,y2,color,width=2,alpha=1){
 ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;
 ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();
}
function ring(ctx,x,y,r,color,width=2,alpha=1,start=0,end=Math.PI*2){
 if(r<=0)return;
 ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=width;
 ctx.beginPath();ctx.arc(x,y,r,start,end);ctx.stroke();
}
function diamond(ctx,x,y,r,color,width=2,alpha=1,filled=false){
 ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=width;
 ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();
 if(filled)ctx.fill();else ctx.stroke();
}
function glowOrb(ctx,x,y,r,color,alpha){
 ctx.globalAlpha=alpha;ctx.shadowColor=color;ctx.shadowBlur=17;
 ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 ctx.shadowBlur=0;
 ring(ctx,x,y,r+3,'#ffffff',1,alpha*.8);
}
function star(ctx,x,y,r,color,alpha){
 ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=2;
 ctx.beginPath();
 for(let i=0;i<10;i++){
  const a=i*Math.PI/5-Math.PI/2,d=i%2?r*.39:r;
  const px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;
  if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
 }
 ctx.closePath();ctx.stroke();
}
// One self-contained full-arena cinematographic composition per variant.
// The draw is deterministic given (variant,age,impact position, winner color);
// no random particles, hit logic, timers, state changes, or gameplay callbacks.
function renderCutscene(ctx,f,reduced=false){
 if(!f||!Number.isFinite(f.age)||!Number.isFinite(f.life)||f.life<=0||f.age>=f.life)return;
 const variant=Number.isInteger(f.variant)?clamp(f.variant,0,4):(Number.isInteger(f.style)?clamp(f.style,0,4):0);
 const scene=SCENES[variant],t=clamp(f.age/f.life),buildup=ease(t/.22),
  clash=ease((t-.16)/.46),outro=ease((t-.72)/.28);
 const fadeIn=reduced?1:ease(t/.085),fadeOut=reduced?1:1-ease((t-.88)/.12);
 const alpha=clamp(fadeIn*fadeOut),cx=clamp(Number(f.x)||180,15,345),cy=clamp(Number(f.y)||180,15,345);
 const sx=clamp(Number(f.fromX)||110,0,360),sy=clamp(Number(f.fromY)||180,0,360);
 ctx.save();
 ctx.globalAlpha=.96*alpha;ctx.fillStyle=scene.shade;ctx.fillRect(0,0,360,360);
 ctx.globalAlpha=.15*alpha;ctx.fillStyle=scene.color;
 ctx.fillRect(0,0,360,5);ctx.fillRect(0,355,360,5);
 // Cinematic bars, not a transparent ring over the normal fight.
 ctx.globalAlpha=alpha;ctx.fillStyle='#030711';ctx.fillRect(0,0,360,35);ctx.fillRect(0,325,360,35);
 ctx.textAlign='center';ctx.shadowBlur=0;ctx.fillStyle='#ffffff';ctx.globalAlpha=alpha;
 ctx.font='700 11px system-ui, sans-serif';ctx.fillText('✦  OSTATECZNE UDERZENIE  ✦',180,21);
 ctx.fillStyle=scene.color;ctx.font='700 13px system-ui, sans-serif';ctx.fillText(scene.tag,180,345);
 if(reduced){
  // Static readable card. No flashing, zooming, shake or rapidly rotating arcs.
  glowOrb(ctx,sx,sy,18,f.color||scene.color,.75*alpha);
  ring(ctx,cx,cy,45,scene.color,4,alpha);
  ctx.fillStyle='#ffffff';ctx.globalAlpha=alpha;ctx.font='900 42px system-ui';
  ctx.fillText('K.O.',180,188);
  ctx.restore();return;
 }
 const focus=clash*.92+(.08*buildup),endX=sx+(cx-sx)*focus,endY=sy+(cy-sy)*focus;
 ctx.save();ctx.translate(cx,cy);ctx.shadowColor=scene.color;ctx.shadowBlur=14;
 // All five scenes use unique geometric storyboards, not recolored copies.
 if(variant===0){ // 1. Frozen impact => four concentric shockwaves and ground cracks.
  for(let k=0;k<4;k++){
   const p=clamp((clash-k*.12)/(.82-k*.07));
   if(p>0)ring(ctx,0,0,14+p*(68+k*11),k%2?'#ffffff':scene.color,5-k*.65,(1-p)*.9*alpha);
  }
  for(let k=0;k<12;k++){
   const a=k*Math.PI/6,dis=12+clash*(44+k%3*17);
   line(ctx,Math.cos(a)*dis,Math.sin(a)*dis,
    Math.cos(a+.055)*(dis+14),Math.sin(a+.055)*(dis+14),scene.color,2.2,(1-outro)*alpha);
  }
  ring(ctx,0,0,10+clash*18,'#ffffff',7*(1-clash)+1,(1-outro)*alpha);
 }else if(variant===1){ // 2. Star accretion => 20-ray supernova burst.
  const spin=t*.16;
  for(let k=0;k<20;k++){
   const a=k*Math.PI/10+spin,dist=15+clash*(35+k%4*10);
   line(ctx,Math.cos(a)*dist,Math.sin(a)*dist,Math.cos(a)*(dist+24*(1-outro)),
    Math.sin(a)*(dist+24*(1-outro)),k%2?scene.color:'#fff7d6',k%3===0?4:2,(1-outro)*alpha);
  }
  for(let k=0;k<6;k++){
   const a=k*Math.PI/3+t*.8;
   star(ctx,Math.cos(a)*(28+clash*76),Math.sin(a)*(28+clash*76),
    9+(k%3)*3,scene.color,(1-outro)*alpha);
  }
  star(ctx,0,0,8+clash*45,'#fff6c6',(1-outro)*alpha);
 }else if(variant===2){ // 3. Time rift => double counter-rotating clock portals.
  for(let k=0;k<5;k++){
   const r=22+k*15+clash*18;
   const angle=t*(k%2?4:-4)+k*.3;
   ring(ctx,0,0,r,k%2?'#e9d5ff':scene.color,3,(1-outro)*alpha,angle,angle+Math.PI*1.42);
   for(let j=0;j<4;j++){
    const a=angle+j*Math.PI/2;
    line(ctx,Math.cos(a)*r,Math.sin(a)*r,
     Math.cos(a)*(r+8),Math.sin(a)*(r+8),'#ffffff',1.8,(1-outro)*alpha);
   }
  }
  line(ctx,0,0,Math.cos(t*9)*55,Math.sin(t*9)*55,'#ffffff',5,(1-outro)*alpha);
  ring(ctx,0,0,10+clash*9,'#ffffff',3,(1-outro)*alpha);
 }else if(variant===3){ // 4. Four blades => paired crossing light slashes.
  ctx.rotate(clash*.12);
  for(let k=0;k<4;k++){
   ctx.save();ctx.rotate(k*Math.PI/2);
   const length=clash*140;
   line(ctx,-125+length,0,95-length*.42,0,k%2?'#fff1f2':scene.color,
    8-k*.5,(1-outro)*alpha);
   line(ctx,-125+length,-7,95-length*.42,-7,scene.color,2,(1-outro)*alpha);
   ctx.restore();
  }
  for(let k=-1;k<=1;k++){
   line(ctx,-85,-85+k*11,85,85+k*11,'#fff1f2',3,(1-outro)*alpha);
   line(ctx,-85,85+k*11,85,-85+k*11,scene.color,3,(1-outro)*alpha);
  }
 }else{ // 5. Faceted prism => diamond collapse and crystal shrapnel.
  for(let k=0;k<5;k++){
   const phase=clamp((clash-k*.09)/(.9-k*.06));
   diamond(ctx,0,0,14+phase*(33+k*15),k%2?'#ffffff':scene.color,4-k*.35,
    (1-outro)*(1-k*.11)*alpha);
  }
  for(let k=0;k<12;k++){
   const a=k*Math.PI/6+t*.25,dis=18+clash*(50+k%3*13);
   ctx.save();ctx.translate(Math.cos(a)*dis,Math.sin(a)*dis);ctx.rotate(a);
   diamond(ctx,0,0,4+k%3*2,'#bbf7d0',1.5,(1-outro)*alpha,k%4===0);
   ctx.restore();
  }
  diamond(ctx,0,0,12+clash*14,'#ffffff',3,(1-outro)*alpha,true);
 }
 ctx.restore();
 // The winning ball is shown approaching the exact impact, independent of scene.
 line(ctx,sx,sy,endX,endY,scene.color,Math.max(1,4-3*outro),alpha*(1-outro));
 glowOrb(ctx,endX,endY,13+(1-clash)*6,f.color||scene.color,alpha*(1-outro*.75));
 // Dramatic beat: impact flash is brief and confined to the canvas.
 const flash=Math.max(0,1-Math.abs(t-.43)/.085)*.37;
 ctx.globalAlpha=flash*alpha;ctx.fillStyle='#ffffff';ctx.fillRect(0,35,360,290);
 // Actual last hit moment -> big KO text; caption stays visible to the end.
 ctx.textAlign='center';ctx.globalAlpha=alpha*(.3+.7*buildup);
 ctx.shadowBlur=13;ctx.shadowColor=scene.color;
 ctx.strokeStyle='#050b1a';ctx.lineWidth=7;ctx.font='900 48px system-ui';
 ctx.strokeText('K.O.',180,184);ctx.fillStyle='#ffffff';ctx.fillText('K.O.',180,184);
 ctx.shadowBlur=0;
 if(typeof f.winnerName==='string'){
  ctx.globalAlpha=alpha;ctx.font='700 12px system-ui';
  ctx.fillStyle='#e2e8f0';ctx.fillText(f.winnerName.slice(0,36),180,207);
 }
 ctx.restore();
}
function render(ctx,g){
 const f=g?.finisher;if(!f)return;
 const reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||
  Number(typeof S==='undefined'?3:(S?.o?.fxLevel??3))===0;
 renderCutscene(ctx,f,reduced);
}
const oldDraw=draw;
draw=function(){oldDraw();if(G)render(cx,G);};

const css=document.createElement('style');css.textContent="#menu .bvb3-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:780px;margin-inline:auto}\n#menu .bvb3-tile,#menu .bvb3-tile.modes{aspect-ratio:1;min-height:0!important;isolation:isolate}\n#menu .bvb3-desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n#menu .bvb3-home:not([hidden]) .bvb3-tile{animation:bvbTileArrival .5s both}\n#menu .bvb3-tile:nth-child(2){animation-delay:.07s!important}#menu .bvb3-tile:nth-child(3){animation-delay:.14s!important}#menu .bvb3-tile:nth-child(4){animation-delay:.21s!important}\n#menu .bvb3-tile::after{content:'';position:absolute;inset:6px;border:1px solid #ffffff18;border-radius:inherit;pointer-events:none;animation:bvbTileBreath 3.6s ease-in-out infinite}\n#menu .bvb3-tile:hover::after,#menu .bvb3-tile:focus-visible::after{border-color:#ffffff90}\n#menu button{transition:transform .15s ease,filter .15s ease,box-shadow .15s ease}\n#menu button:active{transform:scale(.965);filter:brightness(1.12)}\n#menu .bvb3-screen:not([hidden]){animation:bvbPanelArrival .24s ease-out}\n@keyframes bvbTileArrival{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}\n@keyframes bvbTileBreath{50%{opacity:.3;transform:scale(.96)}}\n@keyframes bvbPanelArrival{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}\n@media(max-width:395px){#menu .bvb3-tile{padding:10px;gap:5px}#menu .bvb3-desc{font-size:.67rem;-webkit-line-clamp:3}#menu .bvb3-tags{gap:2px}#menu .bvb3-tags span{font-size:.54rem;padding:2px 3px}#menu .bvb3-title{font-size:.78rem}}\n@media(prefers-reduced-motion:reduce){#menu .bvb3-tile,#menu .bvb3-tile::after,#menu .bvb3-screen,#menu button{animation:none!important;transition:none!important}}";
document.head.appendChild(css);
window.BVBPresentation={finish,tick,render,renderCutscene,chooseVariant,scenes:SCENES};
})();

/* Presentation only: no damage, reward, RNG or match outcome changes. */
(() => {
'use strict';
function finish(g,winner){
 if(!g||!Array.isArray(g.bl)||![0,1].includes(winner)||g.finisher)return;
 const victor=g.bl.find(o=>o.team===winner),loser=g.bl.find(o=>o.team!==winner);
 if(!victor||!loser)return;
 // Presentation-only randomness: never consume the combat RNG.
 const variant=Math.floor(Math.random()*5);
 g.finisher={x:loser.x,y:loser.y,fromX:victor.x,fromY:victor.y,color:victor.b.c||'#fbbf24',
  winnerId:victor.b.id,variant,style:variant,age:0,life:1.2};
 window.BVBRework?.trace?.(g,'FINISHER',{winner,id:victor.b.id,variant});
 if(typeof SFX!=='undefined')SFX.boom?.();
}
function tick(g,dt){if(g?.finisher)g.finisher.age=Math.min(g.finisher.life,g.finisher.age+Math.max(0,dt));}
function render(ctx,g){
 const f=g?.finisher;if(!f||f.age>=f.life)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||Number(S?.o?.fxLevel??3)===0;
 const t=Math.min(1,f.age/f.life),fade=Math.max(0,1-t),v=Number.isInteger(f.variant)?f.variant:(f.style||0)%5;
 ctx.save();
 if(!reduced){
  ctx.globalAlpha=fade*.12;ctx.fillStyle=f.color;ctx.fillRect(0,0,360,360);
  ctx.translate(f.x,f.y);ctx.strokeStyle=f.color;ctx.fillStyle=f.color;ctx.shadowColor=f.color;ctx.shadowBlur=16;ctx.lineWidth=3;
  if(v===0){ // Shockwave: three expanding rings.
   for(let i=0;i<3;i++){ctx.globalAlpha=fade*(1-i*.2);ctx.beginPath();ctx.arc(0,0,12+t*125+i*18,0,Math.PI*2);ctx.stroke();}
  }else if(v===1){ // Starburst: sixteen outward sparks.
   for(let i=0;i<16;i++){const a=i*Math.PI/8,inner=10+t*72,outer=inner+32*(1-t);ctx.globalAlpha=fade;ctx.beginPath();ctx.moveTo(Math.cos(a)*inner,Math.sin(a)*inner);ctx.lineTo(Math.cos(a)*outer,Math.sin(a)*outer);ctx.stroke();}
  }else if(v===2){ // Spiral: rotating arcs.
   for(let i=0;i<4;i++){ctx.globalAlpha=fade;ctx.beginPath();ctx.arc(0,0,15+t*85+i*9,t*7+i*Math.PI/2,t*7+i*Math.PI/2+Math.PI*.8);ctx.stroke();}
  }else if(v===3){ // Cross impact: converging blades.
   ctx.rotate(t*Math.PI*.5);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.globalAlpha=fade;ctx.beginPath();ctx.moveTo(0,8);ctx.lineTo(16*(1-t),95*(1-t)+15);ctx.lineTo(0,42*(1-t)+8);ctx.closePath();ctx.stroke();}
  }else{ // Pulse: expanding diamond and core.
   for(let i=0;i<3;i++){const r=15+t*110+i*16;ctx.globalAlpha=fade*(1-i*.2);ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(r,0);ctx.lineTo(0,r);ctx.lineTo(-r,0);ctx.closePath();ctx.stroke();}
   ctx.globalAlpha=fade;ctx.beginPath();ctx.arc(0,0,12*(1-t),0,Math.PI*2);ctx.fill();
  }
  ctx.translate(-f.x,-f.y);
  if(v===1||v===3){ctx.globalAlpha=fade*.85;ctx.lineWidth=5*(1-t)+1;ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(f.fromX,f.fromY);ctx.lineTo(f.x,f.y);ctx.stroke();}
 }
 ctx.globalAlpha=Math.min(1,fade*2);ctx.shadowBlur=0;ctx.textAlign='center';ctx.font='900 34px Segoe UI, sans-serif';ctx.lineWidth=6;ctx.strokeStyle='#090e20';ctx.strokeText('K.O.',180,173);ctx.fillStyle='#fff4b8';ctx.fillText('K.O.',180,173);
 ctx.restore();
}
const oldDraw=draw;draw=function(){oldDraw();if(G)render(cx,G);};
const css=document.createElement('style');css.textContent="#menu .bvb3-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:780px;margin-inline:auto}\n#menu .bvb3-tile,#menu .bvb3-tile.modes{aspect-ratio:1;min-height:0!important;isolation:isolate}\n#menu .bvb3-desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n#menu .bvb3-home:not([hidden]) .bvb3-tile{animation:bvbTileArrival .5s both}\n#menu .bvb3-tile:nth-child(2){animation-delay:.07s!important}#menu .bvb3-tile:nth-child(3){animation-delay:.14s!important}#menu .bvb3-tile:nth-child(4){animation-delay:.21s!important}\n#menu .bvb3-tile::after{content:'';position:absolute;inset:6px;border:1px solid #ffffff18;border-radius:inherit;pointer-events:none;animation:bvbTileBreath 3.6s ease-in-out infinite}\n#menu .bvb3-tile:hover::after,#menu .bvb3-tile:focus-visible::after{border-color:#ffffff90}\n#menu button{transition:transform .15s ease,filter .15s ease,box-shadow .15s ease}\n#menu button:active{transform:scale(.965);filter:brightness(1.12)}\n#menu .bvb3-screen:not([hidden]){animation:bvbPanelArrival .24s ease-out}\n@keyframes bvbTileArrival{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}\n@keyframes bvbTileBreath{50%{opacity:.3;transform:scale(.96)}}\n@keyframes bvbPanelArrival{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}\n@media(max-width:395px){#menu .bvb3-tile{padding:10px;gap:5px}#menu .bvb3-desc{font-size:.67rem;-webkit-line-clamp:3}#menu .bvb3-tags{gap:2px}#menu .bvb3-tags span{font-size:.54rem;padding:2px 3px}#menu .bvb3-title{font-size:.78rem}}\n@media(prefers-reduced-motion:reduce){#menu .bvb3-tile,#menu .bvb3-tile::after,#menu .bvb3-screen,#menu button{animation:none!important;transition:none!important}}";
document.head.appendChild(css);
window.BVBPresentation={finish,tick,render};
})();

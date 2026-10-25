/* Presentation only: no damage, reward, RNG or match outcome changes. */
(() => {
'use strict';
function finish(g,winner){
 if(!g||!Array.isArray(g.bl)||![0,1].includes(winner))return;
 const victor=g.bl.find(o=>o.team===winner),loser=g.bl.find(o=>o.team!==winner);
 if(!victor||!loser)return;
 g.finisher={x:loser.x,y:loser.y,fromX:victor.x,fromY:victor.y,color:victor.b.c||'#fbbf24',
  winnerId:victor.b.id,style:victor.b.id%3,age:0,life:1.2};
 window.BVBRework?.trace?.(g,'FINISHER',{winner,id:victor.b.id});
 if(typeof SFX!=='undefined')SFX.boom?.();
}
function tick(g,dt){if(g?.finisher)g.finisher.age=Math.min(g.finisher.life,g.finisher.age+Math.max(0,dt));}
function render(ctx,g){
 const f=g?.finisher;if(!f||f.age>=f.life)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||Number(S?.o?.fxLevel??3)===0;
 const t=Math.min(1,f.age/f.life),fade=Math.max(0,1-t);
 ctx.save();
 if(!reduced){
  ctx.globalAlpha=fade*.18;ctx.fillStyle=f.color;ctx.fillRect(0,0,360,360);
  ctx.translate(f.x,f.y);ctx.globalAlpha=fade;ctx.strokeStyle=f.color;ctx.shadowColor=f.color;ctx.shadowBlur=18;ctx.lineWidth=4*(1-t)+1;
  for(let ring=0;ring<3;ring++){ctx.beginPath();ctx.arc(0,0,12+t*145+ring*15,0,Math.PI*2);ctx.stroke();}
  for(let i=0;i<16;i++){const angle=i*Math.PI/8+f.style*.3,inner=15+t*80,outer=inner+20*(1-t);ctx.beginPath();ctx.moveTo(Math.cos(angle)*inner,Math.sin(angle)*inner);ctx.lineTo(Math.cos(angle)*outer,Math.sin(angle)*outer);ctx.stroke();}
  ctx.translate(-f.x,-f.y);
  if(f.style!==1){ctx.globalAlpha=fade*.85;ctx.lineWidth=7*(1-t)+1;ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(f.fromX,f.fromY);ctx.lineTo(f.x,f.y);ctx.stroke();}
 }
 ctx.globalAlpha=Math.min(1,fade*2);ctx.shadowBlur=0;ctx.textAlign='center';ctx.font='900 34px Segoe UI, sans-serif';ctx.lineWidth=6;ctx.strokeStyle='#090e20';ctx.strokeText('K.O.',180,173);ctx.fillStyle='#fff4b8';ctx.fillText('K.O.',180,173);
 ctx.restore();
}
const oldDraw=draw;draw=function(){oldDraw();if(G)render(cx,G);};
const css=document.createElement('style');css.textContent="#menu .bvb3-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:780px;margin-inline:auto}\n#menu .bvb3-tile,#menu .bvb3-tile.modes{aspect-ratio:1;min-height:0!important;isolation:isolate}\n#menu .bvb3-desc{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}\n#menu .bvb3-home:not([hidden]) .bvb3-tile{animation:bvbTileArrival .5s both}\n#menu .bvb3-tile:nth-child(2){animation-delay:.07s!important}#menu .bvb3-tile:nth-child(3){animation-delay:.14s!important}#menu .bvb3-tile:nth-child(4){animation-delay:.21s!important}\n#menu .bvb3-tile::after{content:'';position:absolute;inset:6px;border:1px solid #ffffff18;border-radius:inherit;pointer-events:none;animation:bvbTileBreath 3.6s ease-in-out infinite}\n#menu .bvb3-tile:hover::after,#menu .bvb3-tile:focus-visible::after{border-color:#ffffff90}\n#menu button{transition:transform .15s ease,filter .15s ease,box-shadow .15s ease}\n#menu button:active{transform:scale(.965);filter:brightness(1.12)}\n#menu .bvb3-screen:not([hidden]){animation:bvbPanelArrival .24s ease-out}\n@keyframes bvbTileArrival{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}\n@keyframes bvbTileBreath{50%{opacity:.3;transform:scale(.96)}}\n@keyframes bvbPanelArrival{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}\n@media(max-width:395px){#menu .bvb3-tile{padding:10px;gap:5px}#menu .bvb3-desc{font-size:.67rem;-webkit-line-clamp:3}#menu .bvb3-tags{gap:2px}#menu .bvb3-tags span{font-size:.54rem;padding:2px 3px}#menu .bvb3-title{font-size:.78rem}}\n@media(prefers-reduced-motion:reduce){#menu .bvb3-tile,#menu .bvb3-tile::after,#menu .bvb3-screen,#menu button{animation:none!important;transition:none!important}}";
document.head.appendChild(css);
window.BVBPresentation={finish,tick,render};
})();

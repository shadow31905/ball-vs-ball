/* Continuous first-sixteen animation rig. The approved raster pixels are
 * split into body/equipment masks; all motion is cosmetic and time-based.
 * CSS drives collection portraits, Canvas drives previews and real fights.
 */
(()=>{
'use strict';
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const names=['rush','axe','venom','thief','blades','rifle','spider','vampire','spear','burst','chess','dice','ice','laser','snake','hook'];
const periods=[1.8,3.2,2.6,3.7,2.7,2.2,2.8,2.4,2.9,2.1,3.6,3.3,3.8,4.2,3.1,3.5];
const svgCache=new Map(),events=new WeakMap();
const has=id=>window.BVBApprovedArt?.has(id);
function layout(id,tier){return window.BVBApprovedRigLayout?.[id*3+tier-1]||{cx:64,cy:74,r:31};}
function duration(id,tier){return periods[id]/(1+(tier-1)*.09);}
function pose(id,tier,time,attack=0,hit=0){
 const t=Number.isFinite(time)?time:0,p=t*TAU/duration(id,tier),s=Math.sin(p),c=Math.cos(p),g=1+(tier-1)*.16;
 const core={x:hit?-hit*2:0,y:.42*s,angle:.65*Math.sin(p*.5),sx:1+.009*s,sy:1-.009*s};
 let outer={x:0,y:0,angle:0,sx:1,sy:1};
 switch(id){
 case 0:outer={x:-2*s*g,y:.5*c,angle:-4*s,sx:1+.035*s,sy:1-.02*s};break;
 case 1:outer.angle=p*180/Math.PI;break;
 case 2:outer={x:0,y:0,angle:2*s,sx:1+.045*s*g,sy:1+.04*c*g};break;
 case 3:outer={x:1.7*s,y:-.6*Math.sin(p*2),angle:3*c,sx:1,sy:1};break;
 case 4:outer.angle=-p*180/Math.PI;break;
 case 5:outer={x:-1.7*Math.pow(Math.max(0,s),8),y:.3*c,angle:1.3*s,sx:1,sy:1};break;
 case 6:outer={x:0,y:.55*s,angle:3.5*s,sx:1+.025*c,sy:1+.04*s};break;
 case 7:outer={x:0,y:0,angle:5*s,sx:1+.095*s,sy:1-.055*s};break;
 case 8:outer={x:1.9*s,y:-1.9*s,angle:1.5*s,sx:1,sy:1};break;
 case 9:outer={x:0,y:0,angle:3*s,sx:1+.055*s*g,sy:1+.055*s*g};break;
 case 10:outer={x:0,y:-2*Math.sin(p),angle:2.6*Math.sin(p*2),sx:1,sy:1};break;
 case 11:outer={x:0,y:0,angle:p*180/Math.PI,sx:1+.02*s,sy:1-.02*s};break;
 case 12:outer={x:0,y:-1.1*s,angle:1.4*Math.sin(p*2),sx:1+.023*c,sy:1+.032*s};break;
 case 13:outer.angle=11*s;break;
 case 14:outer={x:1.8*Math.sin(p*2),y:.65*c,angle:7*s,sx:1,sy:1};break;
 case 15:outer={x:.8*c,y:1.4*s,angle:8.5*s,sx:1,sy:1};break;
 }
 if(attack){
  core.sx+=attack*.035;core.sy-=attack*.02;
  outer.x+=(id===5?-4:id===8?6:id===15?4:1)*attack;
  outer.y+=(id===8?-5:0)*attack;
 }
 const left={...outer},right={...outer};
 if(id===6||id===7){left.angle=-outer.angle;right.angle=outer.angle;
  left.sx=outer.sx;right.sx=outer.sx;left.y+=.35*c;right.y-=.35*c;}
 return {core,outer,left,right,phase:p,attack,hit};
}
function motif(id,tier,phase,cx,cy,r,attack=0){
 const s=Math.sin(phase),c=Math.cos(phase),a=.26+.14*(s+1)/2,n=[];
 const line=(points,opacity=a,width=.85)=>n.push({type:'line',points,opacity,width});
 const dot=(x,y,radius=1.3,opacity=a)=>n.push({type:'circle',x,y,r:radius,opacity,width:.65});
 const arc=(x,y,radius,start,end,opacity=a)=>n.push({type:'arc',x,y,r:radius,start,end,opacity,width:.8});
 switch(id){
 case 0:for(let j=0;j<3;j++){const x=cx-r-5-j*4;line([[x+4,cy-7],[x,cy],[x+4,cy+7]],a*(1-j*.2));}break;
 case 1:arc(cx,cy,r+5,phase,phase+1.3,a+.08);break;
 case 2:for(let j=0;j<3;j++)dot(cx+(j-1)*r*.6,cy+r+3+(s+j)%2*3,1+j*.23);break;
 case 3:line([[cx-r-2,cy+8],[cx-r-7,cy],[cx-r-2,cy-8]],a);dot(cx+r+4,cy-7,1.7,a);break;
 case 4:for(let j=0;j<2+tier;j++)arc(cx,cy,r+4+j*1.8,-phase+j*1.5,-phase+j*1.5+.65,a);break;
 case 5:for(let j=0;j<3;j++)line([[cx+8+j*3,cy-r-1],[cx+8+j*3,cy-r-5-(j+s)%2*2]],a);break;
 case 6:line([[cx-r-7,cy-12],[cx-4,cy-r-5],[cx+r+7,cy-10]],a);line([[cx-r-5,cy+10],[cx,cy+r+3],[cx+r+5,cy+10]],a*.8);break;
 case 7:for(let j=0;j<tier+1;j++){const p=phase*.6+j*TAU/(tier+1);dot(cx+Math.cos(p)*(r+5),cy+Math.sin(p)*(r+3),1.5,a);}break;
 case 8:line([[cx+r*.7,cy-r*.7],[cx+r+10+attack*9,cy-r-10-attack*9]],a+.2);break;
 case 9:arc(cx,cy,r+3+(s+1)*2,0,TAU,a*.65);if(tier>1)arc(cx,cy,r+8,phase,phase+2.1,a*.5);break;
 case 10:{const x=cx-r-4,y=cy+r-2;line([[x,y],[x+7,y],[x+7,y-8],[x+14,y-8]],a+.1);break;}
 case 11:for(let j=0;j<3;j++){const p=phase+j*TAU/3;dot(cx+Math.cos(p)*(r+6),cy+Math.sin(p)*(r+6),1.1,a);}break;
 case 12:for(let j=0;j<3;j++){const p=j*2.3+phase*.1,x=cx+Math.cos(p)*(r+4),y=cy+Math.sin(p)*(r+4);line([[x-2,y],[x+2,y]],a);line([[x,y-2],[x,y+2]],a);}break;
 case 13:{const p=phase*.18;line([[cx-4,cy-r],[cx+Math.cos(p)*(r+12),cy-r+Math.sin(p)*9]],a+.06);break;}
 case 14:for(let j=0;j<2;j++)arc(cx+(j?5:-5),cy+7,r+1,phase*.12+j,phase*.12+j+1.1,a);break;
 case 15:for(let j=0;j<3;j++){const x=cx+r-2+j*3,y=cy-r+Math.sin(phase+j*.4)*2;dot(x,y,1.4,a);}break;
 }
 return n;
}
function reduced(){return !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;}
function options(scope){
 const o=typeof S==='object'&&S?.o||{},flag=scope==='battle'?'fight':scope==='preview'?'interior':'inventory';
 return {still:reduced()||o['art_'+flag]===0||o.artIntensity===0,
  interior:o.art_interior!==0,low:o.artQuality==='low',intensity:Number.isFinite(o.artIntensity)?clamp(o.artIntensity/100,0,1):.85};
}
function observe(actor,time){
 if(!actor)return {attack:0,hit:0};
 let e=events.get(actor);
 if(!e||time<e.time){e={hp:actor.hp,cd:actor.abilityCd,time,cast:-100,hit:-100};events.set(actor,e);}
 if(Number.isFinite(actor.abilityCd)&&Number.isFinite(e.cd)&&actor.abilityCd>e.cd+.5)e.cast=time;
 if(Number.isFinite(actor.hp)&&Number.isFinite(e.hp)&&actor.hp<e.hp-.01)e.hit=time;
 e.hp=actor.hp;e.cd=actor.abilityCd;e.time=time;
 return {attack:clamp(1-(time-e.cast)/.36,0,1),hit:clamp(1-(time-e.hit)/.2,0,1)};
}
function apply(ctx,p,cx,cy){
 ctx.translate(cx+p.x,cy+p.y);ctx.rotate(p.angle*Math.PI/180);ctx.scale(p.sx,p.sy);ctx.translate(-cx,-cy);
}
function paintMotif(ctx,items,color,intensity,low){
 ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineCap='round';
 for(const item of (low?items.slice(0,2):items)){
  ctx.globalAlpha=item.opacity*intensity;ctx.lineWidth=item.width;ctx.beginPath();
  if(item.type==='circle'){ctx.arc(item.x,item.y,item.r,0,TAU);ctx.fill();}
  else if(item.type==='arc'){ctx.arc(item.x,item.y,item.r,item.start,item.end);ctx.stroke();}
  else{item.points.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
 }
 ctx.restore();
}
function draw(ctx,id,tier,x,y,r,time,config={}){
 if(!has(id)||!ctx||![x,y,r].every(Number.isFinite)||r<=0)return false;
 tier=clamp(Math.trunc(Number(tier)||1),1,3);
 const image=window.BVBApprovedArt.imageForTier(id,tier);if(!image?.complete||!image.naturalWidth)return false;
 const rig=layout(id,tier),pref=options(config.scope||'battle'),obs=observe(config.actor,time);
 const t=pref.low?Math.floor(time*15)/15:time;
 const p=pose(id,tier,t,obs.attack,obs.hit);if(!pref.interior)p.core={x:0,y:0,angle:0,sx:1,sy:1};const scale=Math.min(r*.86/rig.r,r*3.8/128);
 ctx.save();ctx.translate(x-rig.cx*scale,y-rig.cy*scale);ctx.scale(scale,scale);
 ctx.shadowBlur=0;
 if(pref.still){ctx.drawImage(image,0,0,128,128);ctx.restore();return true;}
 const layer=(part,side)=>{
  ctx.save();
  if(side){ctx.beginPath();ctx.rect(side==='left'?0:rig.cx,0,side==='left'?rig.cx:128-rig.cx,128);ctx.clip();}
  apply(ctx,part,rig.cx,rig.cy);ctx.beginPath();ctx.rect(0,0,128,128);ctx.arc(rig.cx,rig.cy,rig.r*.97,0,TAU,true);ctx.clip('evenodd');
  ctx.drawImage(image,0,0,128,128);ctx.restore();
 };
 if(id===6||id===7){layer(p.left,'left');layer(p.right,'right');}else layer(p.outer);
 ctx.save();apply(ctx,p.core,rig.cx,rig.cy);ctx.beginPath();ctx.arc(rig.cx,rig.cy,rig.r*1.035,0,TAU);ctx.clip();ctx.drawImage(image,0,0,128,128);ctx.restore();
 paintMotif(ctx,motif(id,tier,p.phase,rig.cx,rig.cy,rig.r,obs.attack),window.BVBApprovedArt.colors[id],pref.intensity,pref.low);
 ctx.restore();return true;
}
function transform(p,cx,cy){return 'translate('+p.x.toFixed(3)+'px,'+p.y.toFixed(3)+'px) rotate('+p.angle.toFixed(3)+'deg) scale('+p.sx.toFixed(4)+','+p.sy.toFixed(4)+')';}
function keyframes(id,tier,part){
 const rig=layout(id,tier),d=duration(id,tier);let text='';
 for(const f of [0,.125,.25,.375,.5,.625,.75,.875,1])text+=(f*100)+'%{transform:'+transform(pose(id,tier,f*d)[part],rig.cx,rig.cy)+'}';
 return text;
}
function motifSVG(items){
 return items.map(i=>{
  const style='opacity="'+i.opacity.toFixed(3)+'" stroke-width="'+i.width+'"';
  if(i.type==='circle')return '<circle cx="'+i.x+'" cy="'+i.y+'" r="'+i.r+'" '+style+' fill="currentColor" stroke="none"/>';
  if(i.type==='arc'){const startX=i.x+Math.cos(i.start)*i.r,startY=i.y+Math.sin(i.start)*i.r,endX=i.x+Math.cos(i.end)*i.r,endY=i.y+Math.sin(i.end)*i.r;
   if(i.end-i.start>=TAU-.01)return '<circle cx="'+i.x+'" cy="'+i.y+'" r="'+i.r+'" '+style+'/>';
   return '<path d="M'+startX+' '+startY+'A'+i.r+' '+i.r+' 0 '+(i.end-i.start>Math.PI?1:0)+' 1 '+endX+' '+endY+'" '+style+'/>';
  }
  return '<polyline points="'+i.points.map(p=>p.join(',')).join(' ')+'" '+style+'/>';
 }).join('');
}
function svgFor(id,tier){
 const f=window.BVBApprovedArt.frame(id,tier);if(!f)return '';
 const key=id*3+f.tier-1;if(svgCache.has(key))return svgCache.get(key);
 const rig=layout(id,f.tier),prefix='bvb16-'+id+'-'+f.tier,cx=rig.cx,cy=rig.cy,r=rig.r;
 const image='<image href="'+f.source+'" width="128" height="128" preserveAspectRatio="xMidYMid meet"/>';
 const masked='<g mask="url(#'+prefix+'-outer)">'+image+'</g>';
 let equipment='';
 if(id===6||id===7)equipment='<g clip-path="url(#'+prefix+'-left)"><g class="bvb16-left">'+masked+'</g></g><g clip-path="url(#'+prefix+'-right)"><g class="bvb16-right">'+masked+'</g></g>';
 else equipment='<g class="bvb16-outer">'+masked+'</g>';
 const html='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="'+f.name+' V'+f.tier+'" data-bvb-art-v2="1" data-approved-art="1" data-live-first16="'+names[id]+'" data-ball-id="'+id+'" data-evolution="'+f.tier+'" class="bvb16-'+key+'" style="color:'+window.BVBApprovedArt.colors[id]+'">'+
 '<defs><clipPath id="'+prefix+'-core"><circle cx="'+cx+'" cy="'+cy+'" r="'+r*1.035+'"/></clipPath><mask id="'+prefix+'-outer" maskUnits="userSpaceOnUse" x="0" y="0" width="128" height="128" style="mask-type:luminance"><rect width="128" height="128" fill="white"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r*.97+'" fill="black"/></mask>'+
 '<clipPath id="'+prefix+'-left"><rect width="'+cx+'" height="128"/></clipPath><clipPath id="'+prefix+'-right"><rect x="'+cx+'" width="'+(128-cx)+'" height="128"/></clipPath></defs>'+
 equipment+'<g class="bvb16-core" clip-path="url(#'+prefix+'-core)">'+image+'</g>'+
 '<g class="bvb16-fx" fill="none" stroke="currentColor" stroke-linecap="round">'+motifSVG(motif(id,f.tier,0,cx,cy,r))+'</g></svg>';
 svgCache.set(key,html);return html;
}
const style=document.createElement('style');let css='';
for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){
 const key=id*3+tier-1,rig=layout(id,tier),d=duration(id,tier);
 for(const part of ['core','outer','left','right']){
  const name='bvb16k'+key+part;
  css+='@keyframes '+name+'{'+keyframes(id,tier,part)+'}'+
   '.bvb16-'+key+' .bvb16-'+part+'{transform-origin:'+rig.cx+'px '+rig.cy+'px;animation:'+name+' '+d.toFixed(3)+'s linear infinite;animation-delay:-'+((id*.137+tier*.11)%d).toFixed(3)+'s}';
 }
 css+='.bvb16-'+key+' .bvb16-fx{transform-origin:'+rig.cx+'px '+rig.cy+'px;animation:bvb16glimmer '+(d*1.13).toFixed(3)+'s ease-in-out infinite alternate}';
}
css+='@keyframes bvb16glimmer{from{opacity:calc(.4 * var(--bvb-intensity,.85));transform:scale(.98)}to{opacity:var(--bvb-intensity,.85);transform:scale(1.02)}}'+
 'body.bvb-quality-low [data-live-first16] .bvb16-fx{display:none}'+
 'body.bvb-quality-low [data-live-first16] g{animation-timing-function:steps(8)!important}'+
 'body.bvb-effects-off [data-live-first16] g,body.bvb-intensity-zero [data-live-first16] g{animation:none!important}'+
 'body.bvb-interior-motion-off [data-live-first16] .bvb16-core{animation:none!important}'+
 'body.bvb-result-motion-off .bvb-result-deck [data-live-first16] g{animation:none!important}'+
 '@media(prefers-reduced-motion:reduce){[data-live-first16] g{animation:none!important;transform:none!important}}';
style.textContent=css;document.head.appendChild(style);
window.BVBLiveFirst16=Object.freeze({count:16,tiers:3,names:Object.freeze(names),duration,pose,motif,draw,svgFor,layout});
function upgrade(){for(const node of document.querySelectorAll('svg[data-approved-art]:not([data-live-first16])')){
 const id=Number(node.getAttribute('data-ball-id')),tier=Number(node.getAttribute('data-evolution'));if(has(id))node.outerHTML=svgFor(id,tier);}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade,{once:true});else upgrade();
})();

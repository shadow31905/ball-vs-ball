/* 48 distinct animated vector character drawings for balls 65–80.
 * The generated neon sketch is a COLOR / SHAPE reference, but its incorrect
 * panel names are not copied onto the real roster (Echo through Atom).
 * One real in-game ID -> one visual identity, in V1 / V2 / V3.
 */
(()=>{
'use strict';
const themes=Object.freeze([
 ['Echo','echo','#2de5fa','#bdfdff','#064361'],
 ['Grawitacja','gravity','#9b42fd','#f8bfff','#110329'],
 ['Kotwica','anchor','#3782dd','#d8f0ff','#153456'],
 ['Lustro','mirror','#a7d9ef','#ffffff','#475d83'],
 ['Pustka','void','#a33bed','#eeaaff','#0d0318'],
 ['Słońce','sun','#ffac19','#fff4a2','#a12212'],
 ['Księżyc','moon','#8aaaff','#f5faff','#0e2554'],
 ['Zaćmienie','eclipse','#9c60ef','#f8dafa','#15102f'],
 ['Supernowa','nova','#ff7a1b','#fff3a4','#871318'],
 ['Mgławica','nebula','#b849fa','#f9a5f6','#28104e'],
 ['Pulsar','pulsar','#26dffd','#eeffff','#065d86'],
 ['Kwazar','quasar','#2b9bf5','#ccf7ff','#271b84'],
 ['Kometa','comet','#48d3fa','#efffff','#145b8f'],
 ['Asteroida','asteroid','#a2a6a9','#f5dfba','#3b3c46'],
 ['Kwant','quantum','#33f2da','#e1ffff','#125a6f'],
 ['Atom','atom','#63f3aa','#e7fff2','#0a4a49']
].map((d,i)=>Object.freeze({id:i+64,name:d[0],key:d[1],main:d[2],light:d[3],dark:d[4]})));
const tau=Math.PI*2,num=x=>Number(x).toFixed(2);
const circ=(x,y,r,fill,edge='none',w=1)=>'<circle cx="'+num(x)+'" cy="'+num(y)+'" r="'+num(r)+'" fill="'+fill+'" stroke="'+edge+'" stroke-width="'+w+'"/>';
const oval=(x,y,rx,ry,stroke,w=2,rot=0,fill='none')=>'<ellipse cx="'+num(x)+'" cy="'+num(y)+'" rx="'+num(rx)+'" ry="'+num(ry)+'" transform="rotate('+rot+' '+num(x)+' '+num(y)+')" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'"/>';
const line=(d,col,w=2,fill='none')=>'<path d="'+d+'" fill="'+fill+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
const poly=(pts,fill,stroke='none',w=1)=>'<polygon points="'+pts.map(a=>a.map(num).join(',')).join(' ')+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round"/>';
const group=(x,y,turn,scale,s)=>'<g transform="translate('+num(x)+' '+num(y)+') rotate('+turn+') scale('+num(scale)+')">'+s+'</g>';
function star(x,y,n,R,r,fill,stroke='none',w=1){
 const p=[];for(let j=0;j<2*n;j++){const a=j*Math.PI/n-Math.PI/2,z=j%2?r:R;p.push([x+Math.cos(a)*z,y+Math.sin(a)*z]);}
 return poly(p,fill,stroke,w);
}
function flame(x,y,turn,scale,col){
 return group(x,y,turn,scale,line('M-7 12Q-14-1-3-17Q0-7 7-20Q20-5 12 12Q2 22-7 12Z','#fff5ba',1.1,col));
}
function stone(x,y,k,sc,fill){
 return group(x,y,k*29,sc,poly([[-12,-4],[-5,-13],[8,-13],[14,-1],[8,12],[-8,10]],fill,'#e2e8f0',1.5)+line('M-5-13L0-1L14-1M0-1L-8 10','#4e5264',1));
}
function crack(x,y,turn,s,col){return group(x,y,turn,s,line('M-8-18L2-7L-4 3L11 12','#e4faff',1.4)+line('M2-7L11-10',col,2));}
function at(i,n,r,cx=64,cy=64,shift=0){let a=i*tau/n+shift;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
function glyph(i,t,col){
 let s='';
 switch(i){
 case 0: // Echo: speaker with concentric audible waves (sketch #78)
  s+=circ(64,61,7,'#0e75a4','#ddffff',2);
  for(let j=0;j<1+t;j++)s+=line('M'+(42-j*5)+' '+(48-j*3)+'Q'+(27-j*6)+' 61 '+(42-j*5)+' '+(76+j*3),'#bbfaff',2.1)+line('M'+(87+j*4)+' '+(48-j*3)+'Q'+(102+j*4)+' 61 '+(87+j*4)+' '+(76+j*3),'#bbfaff',2.1);
  break;
 case 1: // Gravity: singularity and rocky orbits.
  s+=circ(64,63,t===3?19:13,'#08041a','#dd83ff',3);
  for(let k=0;k<1+t;k++)s+=oval(64,63,23+k*4,11+k*2,'#c678ff',2,(k*36)-35);
  break;
 case 2: // Anchor, with marine heavy iron head and chains.
  s+=line('M64 35V83M45 48H83M44 72Q37 97 63 103Q91 98 84 72M44 72L35 83M84 72L92 83','#d1efff',t===3?6:4);
  s+=circ(64,33,8,'#305579','#f7ffff',2);
  if(t>=2)s+=line('M47 53L38 42L43 35M81 53L90 42L86 35','#c7f9ff',2.5);
  break;
 case 3: // Mirror: reflective facets and bright V3 kaleidoscope.
  s+=poly([[64,30],[88,51],[83,84],[64,100],[45,83],[39,52]],'url(#sk65mir-'+(i+64)+'-'+t+')','#f4ffff',2.2);
  s+=line('M64 30L64 100M39 52L64 63L88 51M64 63L83 84','#fdffff',2.5);
  if(t===3)s+=poly([[64,28],[96,44],[101,84],[64,106],[29,84],[35,43]],'none','#e8ffff',3);
  break;
 case 4: // Void black-hole iris with shiny accretion.
  s+=circ(64,64,t===3?22:15,'#040011','#c555ff',3);
  for(let k=0;k<t;k++)s+=oval(64,64,27+k*3,10+k*2,'#ed77ff',2,28+k*28);
  break;
 case 5: // Sun: corona and orange faceted hot surface
  s+=star(64,64,8,25+t*3,16+t*2,'#ff8b10','#fff69c',1.6);
  s+=circ(64,64,16,'#ffda46','#fff5b5',1.3);
  break;
 case 6: // Moon: crescent, silver pocked craters
  s+=circ(64,64,23,'#d9e9ff','#faffff',2);
  s+=circ(72,56,18,'#274b8b','#274b8b',2);
  s+=circ(48,80,3,'#a8c7f2')+circ(51,57,2.2,'#a3c1ee');
  if(t>=2)s+=oval(64,64,32,32,'#d0deff',1.6);
  break;
 case 7: // Eclipse: gold rim around black disc and lunar phase halo
  s+=circ(64,64,21,'#160b37','#ffcd8e',2.7);
  s+=circ(70,58,18,'#0b0523','#caa7ff',1.5);
  if(t===3)s+=oval(64,64,31,31,'#ffd7a2',2);
  break;
 case 8: // Nova: 12-point star with inner detonator
  s+=star(64,64,12,25+t*2,10+t,'#fa5522','#ffe68d',2);
  s+=star(64,64,6,16,6,'#fff6a0','#fff',1);
  break;
 case 9: // Nebula: swirl and colorful vapor billows
  s+=line('M43 51Q77 23 88 56Q103 83 63 88Q33 91 41 71Q49 53 70 57','#ffc5fd',3);
  for(let k=0;k<2+t;k++){let [x,y]=at(k,2+t,18);s+=circ(x,y,4+k%2,'#bd60f8','#f8ddff',.9);}
  break;
 case 10: // Pulsar: magnetic concentric rings and axis
  for(let k=0;k<t+1;k++)s+=oval(64,64,16+k*6,28+k*2,'#b7ffff',1.5,35+k*27);
  s+=line('M64 37V92M48 65H80','#dfffff',2.8)+circ(64,65,6,'#32ccfb','#f3ffff',2);
  break;
 case 11: // Quasar, two intense opposing jets
  s+=circ(64,64,12,'#1540a9','#e4ffff',3);
  s+=poly([[59,45],[64,20],[71,46]],'#afffff','#fff',1);
  s+=poly([[59,84],[64,109],[71,84]],'#78bdff','#fff',1);
  for(let k=0;k<t;k++)s+=line('M'+(45-k*4)+' 62Q64 '+(25-k*5)+' '+(83+k*4)+' 62','#82dbff',1.7);
  break;
 case 12: // Comet: crystal nose and icy frozen stellar tail
  s+=poly([[49,73],[57,42],[75,29],[86,53],[74,88]],'#97ecff','#f5ffff',2.3);
  s+=line('M49 73L74 29L74 88','#faffff',2);
  break;
 case 13: // Asteroid, basalt stone shell with heavy spines
  s+=poly([[42,56],[50,37],[72,32],[87,50],[93,76],[73,96],[45,83]],'#686977','#d1c8b4',2.8);
  s+=line('M50 37L57 65L87 50M57 65L45 83M57 65L73 96','#e5d8c4',1.5);
  s+=stone(81,57,0,.35,'#b2a99b');
  break;
 case 14: // Quantum, bright twin and a quantum phase tunnel
  s+=circ(55,61,15,'#1fcabf','#f7ffff',2);
  s+=circ(78,69,15,'#386bd6','#eaffff',2);
  s+=oval(64,66,35,14,'#ccffff',2,-35);
  if(t===3)s+=circ(65,37,11,'#32fae1','#f4ffff',2);
  break;
 case 15: // Atom: crossing electron orbits and electron dots
  for(let k=0;k<3;k++){
   s+=oval(64,64,29,11,'#d1ffe7',1.9,k*60);
   let [x,y]=at(k,3,28);s+=circ(x,y,4,'#97ffe1','#fff',1.2);
  }
  s+=circ(64,64,11,'#148b69','#eeffef',2)+star(64,64,6,9,4,'#aeffbd');
  break;
 }
 return s;
}
function halo(i,t,m){
 let s='';const green=['#92ffa1','#d2ff8f','#ffe2aa'],n=4+t*2;
 // The first evolution is recognizably less ornamented than later evolutions.
 if(t>=2)s+=oval(64,64,38+t*3,38+t*3,m.main,2);
 if(t===3)s+=oval(64,64,45,33,m.light,2,35);
 for(let k=0;k<n;k++){
  const [x,y]=at(k,n,40+t*2,64,64,(i*17+k%2*8)*Math.PI/180);
  switch(i){
  case 0:s+=oval(x,y,3+k%2*2,5,m.light,1,k*25);break; // acoustic pulses
  case 1:case 4:s+=stone(x,y,k,.27+t*.07,k%2?'#462260':'#1b1429');break;
  case 2:s+=circ(x,y,3+t%2,'#e5f4ff','#607b9c',1);break; // chain studs
  case 3:s+=poly([[x,y-5],[x+4,y],[x,y+5],[x-4,y]],'#e2feff','#fff',1.2);break;
  case 5:case 8:s+=flame(x,y,k*36,.32+t*.04,k%2?'#ff8514':'#ffd143');break;
  case 6:case 7:s+=star(x,y,4,2.9+t*.6,1.4,'#fff7e2');break;
  case 9:s+=circ(x,y,2.6+t*.5,k%2?'#fc8aff':'#7bd8ff');break;
  case 10:case 11:s+=star(x,y,4,4+t*.4,1.5,'#baffff');break;
  case 12:s+=poly([[x-4,y-4],[x+4,y],[x,y+7]],'#e4ffff','#fff',.8);break;
  case 13:s+=stone(x,y,k,.33+t*.04,'#7b7c8b');break;
  case 14:s+=circ(x,y,3,'#b6ffed','#8efafc',1);break;
  case 15:s+=circ(x,y,3.4,'#d5ffe8','#60cfa4',1.3);break;
  }
 }
 if(t>=2){
  switch(i){
  case 0:s+=oval(64,64,47,16,'#c0ffff',2,-19);break;
  case 1:case 4:s+=oval(64,64,50,18,'#ad5cf8',3,-35);break;
  case 2:s+=line('M36 29L31 19M92 29L97 19','#d8efff',3);break;
  case 3:s+=poly([[64,6],[73,17],[64,27],[55,17]],'#d8ffff','#fff',1);break;
  case 5:case 8:s+=star(64,65,10,50,45,'none','#ffc65c',2);break;
  case 6:case 7:s+=star(64,16,8,8,3,'#f1f6ff');break;
  case 9:s+=oval(64,64,53,28,'#f58dff',2,32);break;
  case 10:case 11:s+=oval(64,64,52,16,'#8ffcff',2,-35);break;
  case 12:s+=line('M16 95Q34 67 43 44M23 101Q39 77 50 55','#b2f9ff',3);break;
  case 13:s+=stone(30,34,4,.66,'#646471');break;
  case 14:s+=circ(24,49,12,'#137e9a','#abffef',2);break;
  case 15:s+=oval(64,64,51,18,'#baffda',2,40);break;
  }
 }
 if(t===3){
  if([0,10,11,14,15].includes(i)){
   s+=star(64,8,6,10,4,m.light)+star(15,65,4,7,2,m.light)+star(115,65,4,7,2,m.light);
  }else if([5,8,12].includes(i)){
   s+=flame(64,10,0,1.0,'#ffbb25')+flame(26,30,-27,.7,'#ff6d19')+flame(104,30,22,.7,'#ff9d16');
  }else if(i===13){
   s+=stone(64,14,0,.9,'#777582')+stone(26,34,2,.75,'#5c5a63')+stone(105,36,3,.73,'#696975');
  }else{
   s+=star(64,11,8,11,5,m.light)+star(22,34,5,6,2,m.main)+star(105,35,5,6,2,m.main);
  }
 }
 return s;
}
function eyes(i,t){
 let s='<g class="sk65-eyes">';
 for(const side of [-1,1]){
  const x=64+side*13,y=i===2?83:78,ed='#0e1328';
  s+=line('M'+(x-10)+' '+(y-11)+'L'+(x+9)+' '+(y-5),ed,3.9);
  s+=line('M'+(x-9)+' '+(y-6)+'Q'+x+' '+(y-12)+' '+(x+9)+' '+(y-5)+'L'+(x+5)+' '+(y+7)+'Q'+x+' '+(y+9)+' '+(x-9)+' '+(y+3)+'Z',ed,1.4,i===4||i===1?'#edbfff':'#ffffff');
  s+=oval(x+side, y+1,3.0,3.4,ed,1,0,ed);
 }
 return s+'</g>';
}
const cache=new Map();
function portrait(id,tier){
 id=Number(id);if(!Number.isInteger(id)||id<64||id>79)return '';
 const t=Math.max(1,Math.min(3,Math.round(Number(tier)||1)));
 const key=id*4+t;if(cache.has(key))return cache.get(key);
 const i=id-64,m=themes[i],grad='sk65g'+id+'-'+t,glow='sk65f'+id+'-'+t;
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-ball-id="'+id+'" data-evolution="'+t+'" data-visual-identity="'+m.key+'" data-reference-style="neon-sketch-65-80" aria-label="'+m.name+' V'+t+'">';
 s+='<defs><radialGradient id="'+grad+'" cx="28%" cy="21%" r="84%"><stop stop-color="'+m.light+'"/><stop offset=".28" stop-color="'+m.main+'"/><stop offset=".76" stop-color="'+m.main+'"/><stop offset="1" stop-color="'+m.dark+'"/></radialGradient><filter id="'+glow+'" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="'+(2.2+t*.4)+'"/></filter>';
 if(i===3)s+='<linearGradient id="sk65mir-'+id+'-'+t+'" x1="0%" y1="0%" x2="100%" y2="100%"><stop stop-color="#ecfeff"/><stop offset=".3" stop-color="#719bd4"/><stop offset=".6" stop-color="#ffffff"/><stop offset="1" stop-color="#7192bf"/></linearGradient>';
 s+='</defs><style>.sk65-halo{transform-origin:64px 64px;animation:sk65Turn '+(6+(i%4)*.7)+'s linear infinite}.sk65-core{transform-origin:64px 64px;animation:sk65Pulse '+(2.25+(i%5)*.22)+'s ease-in-out infinite alternate}.sk65-eyes{animation:sk65Look 4.5s ease-in-out infinite}@keyframes sk65Turn{to{transform:rotate(360deg)}}@keyframes sk65Pulse{to{transform:scale(1.045)}}@keyframes sk65Look{0%,39%,61%,100%{transform:translateX(0)}45%,54%{transform:translateX(2px)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
 s+='<g class="sk65-halo">'+halo(i,t,m)+'</g>';
 s+=circ(64,64,37+t*2,m.main,'none',0).replace('stroke-width="0"','opacity=".25" filter="url(#'+glow+')"');
 s+='<g class="sk65-core">'+circ(64,64,29+t*.65,'url(#'+grad+')',m.light,2.6)+oval(53,45,13,6,'#ffffff',.6,-30,'#ffffff').replace('fill="#ffffff"','fill="#ffffff" opacity=".19"')+glyph(i,t,m.main)+eyes(i,t)+'</g></svg>';
 cache.set(key,s);return s;
}
function paintCombat(ctx,o,g){
 if(!o?.b||o.b.id<64||o.b.id>79||!ctx)return;
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
 if(window.BVBMotion?.enabled?.('fight')===false||window.BVBMotion?.enabled?.('interior')===false)return;
 const pref=window.BVBMotion?.prefs?.()||{};if(pref.artQuality==='low'||pref.artIntensity===0)return;
 const id=o.b.id,i=id-64,m=themes[i],t=(g?.rt||0),r=Math.max(10,o.r||17),level=Math.max(1,Math.min(3,o.tier||1));
 ctx.save();ctx.translate(o.x,o.y);ctx.lineWidth=1.6;
 ctx.globalAlpha=Math.min(.66,(.2+level*.1)*(Number.isFinite(pref.artIntensity)?pref.artIntensity/100:1));
 ctx.strokeStyle=m.light;ctx.fillStyle=m.main;ctx.shadowColor=m.main;ctx.shadowBlur=pref.artQuality==='ultra'?10:3;
 const ring=(rx,ry,theta)=>{ctx.save();ctx.rotate(theta);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,tau);ctx.stroke();ctx.restore();};
 const dot=(x,y,rad)=>{ctx.beginPath();ctx.arc(x,y,rad,0,tau);ctx.fill();};
 const seg=(x,y,X,Y)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(X,Y);ctx.stroke();};
 switch(i){
 case 0:case 10:for(let k=0;k<level+2;k++)ring(r+4+k*4,r*.4,t*.35+k*.6);break;
 case 1:case 4:for(let k=0;k<level+2;k++){ring(r+5+k*3,9,t*.22+k*.4);dot(Math.cos(t+k)*r,Math.sin(t+k)*r,2);}break;
 case 2:case 13:for(let k=0;k<level+3;k++){let [x,y]=at(k,level+3,r+6,0,0,t*.12);seg(x-4,y-3,x+4,y+4);}break;
 case 3:for(let k=0;k<level+2;k++)ring(r+3+k*4,r*.55,t*.13+k*.8);break;
 case 5:case 8:case 12:for(let k=0;k<level+5;k++){let [x,y]=at(k,level+5,r+6,0,0,t*.15);seg(x,y,x+Math.cos(k)*7,y+Math.sin(k)*7);}break;
 case 6:case 7:for(let k=0;k<level+3;k++){let [x,y]=at(k,level+3,r+6,0,0);dot(x,y,1.6);}break;
 case 9:for(let k=0;k<level+2;k++)ring(r+2+k*4,r*.5,t*.18+k*.33);break;
 case 11:for(let k=0;k<level+2;k++){let a=k*tau/(level+2)+t*.17;seg(Math.cos(a)*r,Math.sin(a)*r,Math.cos(a)*(r+15),Math.sin(a)*(r+15));}break;
 case 14:for(let k=0;k<level+2;k++)ring(r+4+k*3,9,t*.2+k*1.1);break;
 case 15:for(let k=0;k<3;k++){ring(r+4+k*3,r*.37,t*.28+k*tau/3);dot(Math.cos(t+k*tau/3)*(r+6),Math.sin(t+k*tau/3)*(r+6),2.6);}break;
 }
 ctx.restore();
}
window.BVBSketch65to80=Object.freeze({count:16,tiers:3,firstId:64,lastId:79,
 concepts:themes,svgFor:portrait,paintCombat});
})();
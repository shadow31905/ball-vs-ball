/* Portrait reference panels 33–48. Visual motifs only; ball names
 * and original skills are taken from game data, not the concept art.
 * Each panel has its own progression and silhouette through V1/V2/V3.
 */
(()=>{
'use strict';
const motifs=Object.freeze([["Eliksir","alchemy","#2bdec5","#ecffe0","#145b66"],["Konduktor","ghosttrain","#6998ff","#e9ffff","#182d77"],["Czarny Pająk","blackspider","#7c32ad","#ff8ed5","#1a092b"],["Grób","grave","#8596c2","#d2dcf5","#253050"],["Skrzydło Światła","lightwing","#ffce58","#fffddb","#966d1b"],["Pudełko Cukierków","candybox","#fa679a","#fff0b9","#6e1750"],["Szlam","slime","#47e8a7","#ceff85","#114e58"],["Kajdany","shackles","#a5b5db","#f0f7ff","#344467"],["Kwas","acid","#94f431","#efff7d","#2a771a"],["Promień Świetlny","lightbeam","#61eafc","#f0ffff","#136ba7"],["Trujący Gaz","poisongas","#87e23c","#f1ff93","#365d17"],["Shuriken","shuriken","#8ca8fb","#e9f7ff","#343d74"],["Fibonacci","fibonacci","#e4bc5d","#fff3c2","#7a5430"],["Kaktus","cactus","#5fc44f","#dbff84","#276333"],["Bomba","bomb","#ff8538","#ffe4a1","#7b291b"],["Orbita","orbit","#8d96fc","#faf6ff","#293e86"]].map((m,i)=>Object.freeze({id:32+i,ref:33+i,name:m[0],key:m[1],base:m[2],light:m[3],dark:m[4]})));
const f=n=>(+n).toFixed(2),TAU=Math.PI*2;
const line=(d,s='#ffffff',w=2,fill='none',extra='')=>'<path d="'+d+'" stroke="'+s+'" stroke-width="'+w+'" fill="'+fill+'" stroke-linejoin="round" stroke-linecap="round" '+extra+'/>';
const circle=(x,y,r,c,extra='')=>'<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="'+c+'" '+extra+'/>';
const ellipse=(x,y,rx,ry,fill='none',stroke='#fff',width=2,rotation=0)=>'<ellipse cx="'+f(x)+'" cy="'+f(y)+'" rx="'+f(rx)+'" ry="'+f(ry)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'" transform="rotate('+rotation+' '+f(x)+' '+f(y)+')"/>';
const poly=(coords,fill,stroke='#e9f8ff',w=1.5)=>'<polygon points="'+coords.map(p=>p.map(f).join(',')).join(' ')+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round"/>';
const star=(x,y,n,R,r,c)=>{const pts=[];for(let j=0;j<2*n;j++){const a=j*Math.PI/n-Math.PI/2,v=j%2?r:R;pts.push([x+Math.cos(a)*v,y+Math.sin(a)*v]);}return poly(pts,c,c,.65);};
const shard=(x,y,rotation,scale,col)=>'<g transform="translate('+f(x)+' '+f(y)+') rotate('+rotation+') scale('+f(scale)+')">'+poly([[0,-20],[11,-5],[8,14],[-4,20],[-13,2]],col,'#effbff',1.25)+line('M0-20L-4 20M-13 2L11-5','#ffffff',1.4)+'</g>';
const rock=(x,y,rotation,scale,col)=>'<g transform="translate('+f(x)+' '+f(y)+') rotate('+rotation+') scale('+f(scale)+')">'+poly([[-13,-5],[-5,-15],[12,-9],[16,7],[2,16],[-12,9]],col,'#c7b3a8',1.4)+line('M-5-15L1 1L16 7M1 1L-12 9','#4c3f3b',1.3)+'</g>';
const flame=(x,y,angle,scale,col)=>'<g transform="translate('+f(x)+' '+f(y)+') rotate('+angle+') scale('+f(scale)+')">'+line('M-11 15Q-18-1-4-13Q-7-4 0-25Q19-8 12 9Q3 23-11 15Z','none',0,col)+'</g>';
const leaf=(x,y,angle,scale,col)=>'<g transform="translate('+f(x)+' '+f(y)+') rotate('+angle+') scale('+f(scale)+')">'+line('M0 0Q-20-22-3-34Q20-29 16-13Q12-3 0 0Z','#d5ff8d',1.4,col)+line('M0 0L-2-30','#32791a',1.8)+'</g>';
const sparkle=(x,y,s,col)=>star(x,y,4,s,s*.18,col);

/* Every ID is tied to the original ability identity. These visual components
 * are ability-specific and V1/V2/V3 are authored with added real geometry. */
function outside(index,t,m){
 let out='',col=m.light,base=m.base;
 const orbit=(rx,ry,ang=0,c=col)=>ellipse(64,65,rx,ry,'none',c,2+(t-1)*.4,ang);
 const dot=(x,y,r,c=col)=>circle(x,y,r,c);
 const P=(coords,fill=base)=>poly(coords,fill,col,2);
 const L=(d,w=2,c=col)=>line(d,c,w);
 const points=(n,R,ang=0)=>Array.from({length:n},(_,k)=>{const a=TAU*k/n+ang;return [64+R*Math.cos(a),65+R*Math.sin(a)];});
 switch(index){
 case 0:{ // ELIXIR: vial / reactive catalysts / philosopher alchemy
   out+=P([[48,21],[80,21],[78,32],[74,35],[92,96],[84,108],[44,108],[36,95],[54,35],[50,32]],'#c0f6ed');
   out+=P([[45,82],[83,82],[90,96],[81,102],[47,102],[40,96]],'#21cbad');
   out+=L('M46 21H82M53 32H75',3,'#e8fffa');
   for(let k=0;k<t+2;k++)out+=dot(47+k*10,86+(k%2)*8,2.5+(k%3),'#f8fc8c');
   if(t>=2){out+=orbit(47,23,-28,'#8fffe9')+dot(20,51,5,'#6dfbdd');}
   if(t===3){out+=star(64,13,7,11,4,'#fff4a2')+orbit(51,29,34,'#f8ffb7');}
   break;
 }
 case 1:{ // CONDUCTOR: ghost train / moving tracks / duplicate train
   out+=P([[18,43],[39,29],[89,29],[110,43],[110,79],[18,79]],'#3b4e78');
   for(let x of [39,65,89])out+=P([[x-9,40],[x+8,40],[x+8,57],[x-9,57]],'#b6e9ff');
   out+=dot(41,82,8,'#a2b6d2')+dot(89,82,8,'#a2b6d2');
   out+=L('M20 97H107M30 104H98',2,'#a4d9f8');
   if(t>=2)for(let k=0;k<3;k++)out+=L('M'+(18+k*28)+' 108L'+(29+k*28)+' 119',2,'#bcf3ff');
   if(t===3)out+=P([[26,8],[41,12],[42,23],[84,23],[97,12],[110,20],[101,34],[27,34]],'#99bdf5')+orbit(51,18,17,'#ffffff');
   break;
 }
 case 2:{ // BLACK SPIDER: distinct spider body + black-lace web
   for(let k=0;k<4+t*2;k++){const a=k*TAU/(4+t*2);out+=L('M64 65L'+(64+49*Math.cos(a)).toFixed(1)+' '+(65+49*Math.sin(a)).toFixed(1),1.4,'#a97acc');}
   for(let k=0;k<3;k++)out+=orbit(25+k*10,23+k*9,k*22,'#8b5bd6');
   out+=ellipse(64,49,13,14,'#23182f','#ed9be9',2)+ellipse(64,82,19,22,'#151321','#ba85d4',2);
   for(let sign of [-1,1])for(let k=0;k<4;k++){let y=58+k*9;out+=L('M'+(64+sign*12)+' '+y+'L'+(64+sign*(30+k*3))+' '+(y-12)+ 'L'+(64+sign*(42+k))+' '+(y-7),2.7,'#ab8cd7');}
   out+=dot(59,47,2.8,'#ff78ae')+dot(69,47,2.8,'#ff78ae');
   if(t===3)out+=star(64,15,8,12,4,'#d0a2fb');
   break;
 }
 case 3:{ // GRAVE: cross / haunted tombstone / chain of spectral graves
   out+=P([[42,105],[42,44],[49,34],[79,34],[87,44],[87,105]],'#677389');
   out+=L('M64 48V83M53 63H75',4,'#e4e7f1');
   out+=L('M34 108H94',3,'#c7d3f0');
   for(let k=0;k<t+1;k++)out+=flame(29+k*27,24-(k%2)*6,0,.29+t*.07,'#acd8ff');
   if(t>=2)out+=orbit(48,20,-20,'#c6b4ff');
   if(t===3)out+=P([[12,100],[12,64],[20,56],[35,56],[42,64],[42,103]],'#535f81')+P([[86,103],[86,64],[94,56],[110,56],[118,64],[118,103]],'#5b658a');
   break;
 }
 case 4:{ // LIGHT WING: unmistakable feather wings and radiant flight
   for(let sign of [-1,1]){
    out+=P([[64,64],[64+sign*15,39],[64+sign*42,16],[64+sign*48,42],[64+sign*41,58],[64+sign*54,69],[64+sign*25,84]],'#fff3b1');
    for(let k=0;k<3+t;k++)out+=L('M64 65Q'+(64+sign*(26+k*3))+' '+(30+k*12)+' '+(64+sign*(39+k*2))+' '+(17+k*13),1.7,'#f7bc50');
   }
   if(t>=2)out+=orbit(42,20,-15,'#fffed6');
   if(t===3)for(let k=0;k<7;k++)out+=star(16+k*16,11+(k%2)*8,5,4,2,'#fffbe3');
   break;
 }
 case 5:{ // CANDY BOX: bright striped gift and wrapped candies
   out+=P([[39,45],[89,45],[89,96],[39,96]],'#f65b93');
   out+=P([[34,37],[94,37],[94,51],[34,51]],'#fff5b3');
   out+=P([[57,45],[70,45],[70,97],[57,97]],'#f9ebaf');
   out+=L('M64 42Q45 17 39 34Q51 44 64 42Q85 11 90 30Q83 40 64 42',3,'#fff9c4');
   for(let k=0;k<t+1;k++){const x=19+k*28;out+=dot(x,108-k%2*8,6,k%2?'#7ee8fb':'#f7c45c');}
   if(t>=2)out+=orbit(52,26,16,'#ffcfe5');
   if(t===3)out+=star(106,18,6,12,4,'#ffef89');
   break;
 }
 case 6:{ // SLIME: organic dripping jelly and splitting buds
   out+=L('M31 52Q40 33 56 44Q66 25 81 43Q96 37 102 56L101 85Q97 97 87 88Q75 108 66 91Q49 101 40 89Q27 90 31 52Z',2,'#b8ff9e');
   out+=P([[31,54],[40,42],[57,44],[70,39],[82,44],[98,55],[98,88],[85,92],[73,83],[56,96],[39,88]],'#5ceaaf');
   for(let k=0;k<3+t;k++){const x=29+k*17;out+=dot(x,111-k%2*6,3.6+k%3,'#78f7ac');}
   if(t>=2)out+=ellipse(20,72,11,14,'#56e39d','#e4ffbd',2);
   if(t===3)out+=ellipse(107,77,12,16,'#73f39d','#e8ffc6',2);
   break;
 }
 case 7:{ // SHACKLES: two steel manacles joined with physical chains
   for(let x of [42,86])out+=ellipse(x,62,16,25,'none','#eef7ff',5);
   for(let k=0;k<2+t;k++)out+=ellipse(52+k*8,83+(k%2)*2,8,4,'none','#a7bce2',3,k*30);
   out+=L('M25 35L34 31L43 36M95 35L104 32L113 38',3,'#e9fbff');
   if(t>=2)out+=ellipse(64,17,13,5,'none','#b6caff',3);
   if(t===3)out+=orbit(53,24,-18,'#b2c6e7');
   break;
 }
 case 8:{ // ACID: bubbling flask, drips, corrosive splash
   out+=P([[54,22],[74,22],[74,42],[93,92],[87,106],[41,106],[35,92],[54,42]],'#9df3dc');
   out+=P([[45,73],[82,73],[89,94],[81,99],[46,99],[39,92]],'#b3ff2e');
   for(let k=0;k<t*3;k++)out+=dot(43+(k*13)%45,65+(k%3)*10,2.3+k%3,'#e5ff72');
   if(t>=2)out+=L('M37 112Q50 104 57 118M79 112Q92 107 105 118',4,'#c9ff3d');
   if(t===3)out+=orbit(48,24,-26,'#b0ff49');
   break;
 }
 case 9:{ // LIGHT BEAM: focused lens and actual rays
   out+=ellipse(63,62,27,27,'#2295cc','#e3fbff',5);
   out+=ellipse(63,62,14,14,'#69ecff','#f5ffff',2.5);
   out+=L('M83 58L123 31M84 65L125 65M83 73L123 96',t+2,'#ddffff');
   if(t>=2)out+=L('M45 39L18 13M41 83L16 110',3,'#f2ffff');
   if(t===3)out+=orbit(51,22,-32,'#c9feff')+star(112,65,6,11,4,'#ffffff');
   break;
 }
 case 10:{ // POISON GAS: clouds carrying warning toxic spikes
   for(let k=0;k<3+t*2;k++){let a=k*TAU/(3+t*2),x=64+43*Math.cos(a),y=65+38*Math.sin(a);out+=ellipse(x,y,8+t,5+t,'#82d84a','#c5fb75',1.5,k*21);}
   out+=ellipse(60,55,32,20,'#7fb934','#d0ff80',2)+ellipse(78,69,29,22,'#70b739','#c0fa65',2);
   for(let k=0;k<t*2;k++)out+=shard(30+k*14,102-k%3*4,k*21,.20+t*.04,'#b6e84f');
   if(t===3)out+=orbit(54,30,15,'#e0ff8d');
   break;
 }
 case 11:{ // SHURIKEN: overlapping star blades spinning
   for(let k=0;k<t+1;k++){
    const x=64+(k%2?20:-20),y=62+(k%3-1)*19;
    out+=shard(x,y,k*56,.6+t*.13,'#a9c0fc');
    out+=star(x,y,4,12+t*3,4,'#d8e7ff')+dot(x,y,3,'#435a9a');
   }
   if(t===3)out+=orbit(52,27,23,'#f5faff');
   break;
 }
 case 12:{ // FIBONACCI: golden spiral + stepped petals
   out+=L('M64 65Q95 52 83 39Q61 16 41 42Q15 71 53 100Q105 116 112 60Q113 19 78 13',2.5,'#ffe4a8');
   for(let k=0;k<t*3;k++){let a=k*2.399,r=17+3*k;out+=leaf(64+r*Math.cos(a),65+r*Math.sin(a),k*43,.21+t*.09,k%2?'#ffc965':'#f7e1a6');}
   if(t>=2)out+=orbit(45,34,30,'#ffde7d');
   if(t===3)out+=star(64,17,8,11,5,'#ffe4a4');
   break;
 }
 case 13:{ // CACTUS: main stalk and two thorny arms
   out+=P([[53,108],[53,35],[61,25],[73,31],[76,109]],'#55a94c');
   out+=P([[52,79],[28,79],[22,72],[22,43],[29,36],[38,43],[38,66],[53,66]],'#5bc759');
   out+=P([[75,89],[99,89],[108,80],[108,57],[100,51],[91,60],[91,75],[75,75]],'#60d35b');
   for(let k=0;k<5+t*3;k++){let a=k*TAU/(5+t*3);out+=L('M'+(64+32*Math.cos(a)).toFixed(1)+' '+(65+32*Math.sin(a)).toFixed(1)+'l'+(4*Math.cos(a)).toFixed(1)+' '+(4*Math.sin(a)).toFixed(1),1.7,'#ecfcbc');}
   if(t>=2)out+=orbit(51,20,-20,'#d8ff91');
   if(t===3)out+=star(64,17,6,13,5,'#ffdd76');
   break;
 }
 case 14:{ // BOMB: dark shell, fuse, ticking sparks and chain detonations
   out+=circle(64,72,29,'#394251','stroke="#ffba77" stroke-width="3"');
   out+=L('M64 42L76 28L70 15',4,'#c5b4a4')+star(72,12,6,8,3,'#ffe8a0');
   for(let k=0;k<t*3;k++){let a=k*TAU/(t*3);out+=star(64+47*Math.cos(a),64+42*Math.sin(a),5,3+t*.7,1.5,k%2?'#ffb144':'#ffe184');}
   if(t>=2)out+=orbit(49,24,33,'#ffc275');
   if(t===3)out+=flame(66,9,0,1,'#ffc638');
   break;
 }
 case 15:{ // ORBITA: multiple satellites on planetary orbits
   out+=circle(64,65,24,'#567bcb','stroke="#eef3ff" stroke-width="3"');
   for(let k=0;k<t+2;k++){let a=k*TAU/(t+2);out+=orbit(31+7*k,16+(k%2)*5,k*40,'#b4c2ff');out+=dot(64+44*Math.cos(a),65+40*Math.sin(a),5+k%3,'#e6eaff');}
   if(t===3)out+=star(20,21,7,8,3,'#fafaff');
   break;
 }
 }
 return out;
}
function skillMotion(i,t,key){
 const types=['alchemy','train','spider','grave','wing','candy','slime','chains','acid',
              'ray','gas','shuriken','fibonacci','cactus','bomb','satellites'];
 const degrees=[-6,2,10,-3,15,-4,0,-8,6,-7,12,180,22,-4,9,360];
 const angle=degrees[i]*(1+(t-1)*.3),duration=(3.05-(t-1)*.16+(i%4)*.15).toFixed(2);
 const kf='sk33Skill'+key.replace(/[^a-zA-Z0-9]/g,'');
 const transformA=(i===1||i===7?'translate(-3px,1px) rotate(':-1); // motion identity names below
 const transforms=[
  ['rotate(-4deg) scale(.97)','rotate(6deg) scale(1.08)'],
  ['translate(-3px,0px)','translate(4px,-2px)'],
  ['rotate(-9deg)','rotate(12deg)'],
  ['translate(0px,2px)','translate(0px,-4px)'],
  ['rotate(-12deg) translate(-2px,0px)','rotate(13deg) translate(4px,-3px)'],
  ['rotate(-5deg)','rotate(7deg)'],
  ['scale(.93) translate(0px,3px)','scale(1.12) translate(0px,-2px)'],
  ['rotate(-6deg) translate(-2px,1px)','rotate(6deg) translate(3px,-1px)'],
  ['translate(-2px,0px) scale(.95)','translate(3px,-4px) scale(1.07)'],
  ['translate(-3px,0px) scale(.96)','translate(5px,0px) scale(1.04)'],
  ['translate(-3px,1px) scale(.95)','translate(5px,-4px) scale(1.07)'],
  ['rotate(0deg)','rotate(180deg)'],
  ['rotate(-12deg) scale(.93)','rotate(22deg) scale(1.09)'],
  ['translate(0px,3px)','translate(0px,-3px)'],
  ['rotate(-7deg) scale(.94)','rotate(12deg) scale(1.12)'],
  ['rotate(-10deg)','rotate(35deg)']
 ];
 const tr=transforms[i];
 const css='@keyframes '+kf+'{0%,100%{transform:'+tr[0]+'}50%{transform:'+tr[1]+'}}';
 return {name:types[i],css:'.sk33-identity{transform-origin:64px 65px;animation:'+kf+' '+duration+'s ease-in-out infinite}'+css};
}
function portrait(id,tier,style='detailed'){
 id=Number(id);if(!Number.isInteger(id)||id<32||id>47)return '';
 const t=Math.min(3,Math.max(1,Math.round(Number(tier)||1))),i=id-32,m=motifs[i],classic=style==='classic';
 const move=skillMotion(i,t,'sk33-'+id+'-'+t);
 const key='sk33-'+id+'-'+t,g='grad-'+key,gl='glow-'+key,wide='data-reference-panel="'+m.ref+'"';
 let art='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-ball-id="'+id+'" data-evolution="'+t+'" '+wide+' data-concept="'+m.key+'" data-visual-style="'+(classic?'classic':'detailed')+'" data-ability-animation="'+move.name+'" aria-label="'+m.name+' V'+t+'">';
 art+='<defs><radialGradient id="'+g+'" cx="28%" cy="22%" r="81%"><stop stop-color="'+m.light+'"/><stop offset=".3" stop-color="'+m.base+'"/><stop offset=".76" stop-color="'+m.base+'"/><stop offset="1" stop-color="'+m.dark+'"/></radialGradient><filter id="'+gl+'" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="'+(2.5+t)+'"/></filter></defs>';
 art+='<style>.sk33-aura{transform-origin:64px 64px;animation:sk33Rotate '+(5+(i%5)*.67)+'s linear infinite}.sk33-core{transform-origin:64px 64px;animation:sk33Pulse '+(2.15+(i%7)*.14)+'s ease-in-out infinite alternate} .sk33-eyes{animation:sk33Blink 4.6s ease-in-out infinite}'+move.css+'@keyframes sk33Rotate{to{transform:rotate(360deg)}}@keyframes sk33Pulse{to{transform:scale(1.05)}}@keyframes sk33Blink{0%,38%,62%,100%{transform:translateX(0)}44%,55%{transform:translateX(2px)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
 art+='<g class="sk33-aura">'+outside(i,t,m)+'</g>';
 art+=circle(64,65,36,m.base,'opacity=".22" filter="url(#'+gl+')"');
 art+='<g class="sk33-core">';
 const core=classic?'#222b3c':'url(#'+g+')';
 art+=circle(64,65,27+t*1.35,core,'stroke="'+m.light+'" stroke-width="'+(2.1+t*.4)+'"');
 art+='<g class="sk33-identity">'+outside(i,t,m)+'</g>';
 if(classic)art+=ellipse(64,64,31+t*1.1,30+t*.8,'none','#070b18',2.4);
 {let face='<g class="sk33-eyes">';
 for(let side of [-1,1]){
  const x=64+side*12,y=73;
  face+=line('M'+(x-10)+' '+(y-10+(side<0?-2:2))+'L'+(x+9)+' '+(y-5+(side<0?2:-2)),'#11162c',3.8);
  face+=line('M'+(x-9)+' '+(y-5)+'Q'+(x-1)+' '+(y-10)+' '+(x+9)+' '+(y-5)+'L'+(x+5)+' '+(y+7)+'Q'+x+' '+(y+10)+' '+(x-8)+' '+(y+2)+'Z','#101629',1.5,'#fafdff');
  face+=ellipse(x+side*(i%2),y+1,2.9,3.5,'#17223c','#17223c',1)+circle(x-1+side*(i%2),y-1,1.1,'#fff');
 }
 art+=face+'</g>';}
 art+=ellipse(53,46,13,5,'#fff','none',0,-26).replace('fill="#fff"','fill="#fff" opacity=".22"')+'</g>';
 if(t===3)art+='<g class="sk33-sparks">'+sparkle(15,14,7,m.light)+sparkle(113,23,5,m.light)+'</g>';
 art+='</svg>';return art;
}
function combat(ctx,o,g){
 const id=o?.b?.id;if(id<32||id>47||!ctx||!window.BVBMotion?.enabled?.('fight'))return;
 if(window.BVBMotion?.enabled?.('interior')===false||window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
 const settings=window.BVBMotion?.prefs?.()||{};
 if(settings.artQuality==='low'||settings.artIntensity===0)return;
 const t=g?.rt||0,i=id-32,st=Math.max(1,Math.min(3,o.tier||1)),r=Math.max(9,o.r||17);
 const m=motifs[i],a=t*(.7+(i%5)*.2);
 ctx.save();ctx.translate(o.x,o.y);ctx.strokeStyle=m.light;ctx.fillStyle=m.base;
 ctx.lineWidth=1+st*.4;ctx.globalAlpha=Math.min(.7,.16+st*.11)*(Number(settings.artIntensity)||100)/100;
 ctx.shadowColor=m.base;ctx.shadowBlur=settings.artQuality==='ultra'?10:4;
 const arc=(x,y,R,start=0,end=TAU)=>{ctx.beginPath();ctx.arc(x,y,R,start,end);ctx.stroke();};
 const orbital=(R,angle)=>{ctx.save();ctx.rotate(angle);ctx.scale(1,.45);arc(0,0,R);ctx.restore();};
 const dot=(x,y,R)=>{ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.fill();};
 const stroke=pts=>{ctx.beginPath();pts.forEach(([x,y],k)=>k?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const point=(k,n,radius)=>[Math.cos(TAU*k/n+a*.2)*radius,Math.sin(TAU*k/n+a*.2)*radius];

 switch(i){
 case 0: // alchemy bubbles
  for(let k=0;k<st+3;k++){const [x,y]=point(k,st+3,r+7);dot(x,y,2.3+(k%3));}orbital(r+6,a*.22);break;
 case 1: // train tracks
  stroke([[-r-6,10],[-r-6,-4],[-r+11,-4],[r+8,-4],[r+8,10]]);
  for(let k=0;k<st+2;k++){let x=-r+7+k*11;stroke([[x,r+3],[x+4+3*Math.sin(a+k),r+10],[x+10,r+13]]);}break;
 case 2: // spider webs
  for(let k=0;k<4+st;k++){const p=point(k,4+st,r+6);stroke([[0,0],[p[0],p[1]],[p[0]*1.24+3*Math.sin(a),p[1]*1.24]]);}break;
 case 3: // grave and ghost fire
  for(let k=0;k<st+2;k++){let x=-r+k*16;stroke([[x,r+9],[x+4*Math.sin(a+k),r-1],[x+4*Math.cos(a+k),r-11]]);}break;
 case 4: // flying light feathers
  for(let k=0;k<st+3;k++){let p=point(k,st+3,r+9);stroke([[p[0]-4,p[1]-6],[p[0],p[1]+2],[p[0]+7,p[1]-2]]);}break;
 case 5: // candy explosions
  for(let k=0;k<st+4;k++){let p=point(k,st+4,r+6+2*Math.sin(a*1.8+k));dot(p[0],p[1],2.8+k%2);}break;
 case 6: // slime buds
  for(let k=0;k<st+3;k++){let p=point(k,st+3,r+5);dot(p[0],p[1],2.6+2*Math.sin(a+k));}break;
 case 7: // shackle links
  for(let k=0;k<st+2;k++){let p=point(k,st+2,r+9);ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(a*.26+k);ctx.strokeRect(-5,-3,10,6);ctx.restore();}break;
 case 8: // acid drops
  for(let k=0;k<st+4;k++){let p=point(k,st+4,r+7);dot(p[0],p[1]+3*Math.sin(a+k),2.4);}break;
 case 9: // laser
  for(let k=0;k<st+3;k++){let angle=a*.34+k*TAU/(st+3);stroke([[10*Math.cos(angle),10*Math.sin(angle)],[Math.cos(angle)*(r+12),Math.sin(angle)*(r+12)]]);}break;
 case 10: // poison cloud
  for(let k=0;k<st+4;k++){let p=point(k,st+4,r+9);arc(p[0]+4*Math.sin(a*.6+k),p[1],3.7,0,TAU);}break;
 case 11: // shuriken
  for(let k=0;k<st+4;k++){let angle=a*.85+k*TAU/(st+4);stroke([[8*Math.cos(angle),8*Math.sin(angle)],[(r+10)*Math.cos(angle+.23),(r+10)*Math.sin(angle+.23)]]);}break;
 case 12: // Fibonacci spiral
  for(let k=0;k<st+6;k++){let radius=5+k*2.8;arc(0,0,radius,a*.1+k*.62,a*.1+(k+1)*.62);}break;
 case 13: // cactus spines
  for(let k=0;k<st+6;k++){let p=point(k,st+6,r+5);stroke([[p[0]*.83,p[1]*.83],[p[0]*1.27,p[1]*1.27]]);}break;
 case 14: // bomb sparks
  for(let k=0;k<st+4;k++){let p=point(k,st+4,r+9);dot(p[0],p[1],2+Math.max(0,Math.sin(a+k))*2.5);}break;
 case 15: // orbiting satellites
  orbital(r+9,a*.32);orbital(r+13,-a*.28);
  for(let k=0;k<st+2;k++){let p=point(k,st+2,r+10);dot(p[0],p[1],3);}break;
 }
 ctx.restore();
}
window.BVBSketch33to48={count:16,tiers:3,firstId:32,lastId:47,concepts:motifs,svgFor:portrait,renderCombat:combat};
})();
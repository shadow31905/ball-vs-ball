/* Portrait reference panels 33–48. Visual motifs only; ball names
 * and original skills are taken from game data, not the concept art.
 * Each panel has its own progression and silhouette through V1/V2/V3.
 */
(()=>{
'use strict';
const motifs=Object.freeze([["Eliksir","alchemy","#b748fa","#fff0ff","#43115f"],["Konduktor","ghosttrain","#ffbe39","#fff6bb","#69400f"],["Czarny Pająk","blackspider","#7c32ad","#ff8ed5","#1a092b"],["Grób","grave","#8596c2","#d2dcf5","#253050"],["Skrzydło Światła","lightwing","#ffce58","#fffddb","#966d1b"],["Pudełko Cukierków","candybox","#fa679a","#fff0b9","#6e1750"],["Szlam","slime","#47e8a7","#ceff85","#114e58"],["Kajdany","shackles","#a5b5db","#f0f7ff","#344467"],["Kwas","acid","#94f431","#efff7d","#2a771a"],["Promień Świetlny","lightbeam","#61eafc","#f0ffff","#136ba7"],["Trujący Gaz","poisongas","#87e23c","#f1ff93","#365d17"],["Shuriken","shuriken","#8ca8fb","#e9f7ff","#343d74"],["Fibonacci","fibonacci","#e4bc5d","#fff3c2","#7a5430"],["Kaktus","cactus","#5fc44f","#dbff84","#276333"],["Bomba","bomb","#ff8538","#ffe4a1","#7b291b"],["Orbita","orbit","#8d96fc","#faf6ff","#293e86"]].map((m,i)=>Object.freeze({id:32+i,ref:33+i,name:m[0],key:m[1],base:m[2],light:m[3],dark:m[4]})));
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
 const duration=(3.05-(t-1)*.21+(i%4)*.15).toFixed(2);
 const kf='sk33Skill'+key.replace(/[^a-zA-Z0-9]/g,'');
 // Each silhouette has its own active silhouette trajectory.
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
 const css='@keyframes '+kf+'{0%,100%{transform:'+tr[0]+' scale('+(1+(t-1)*.015).toFixed(3)+')}50%{transform:'+tr[1]+' scale('+(1+(t-1)*.045).toFixed(3)+')}}';
 return {name:types[i],css:'svg[data-animation-key="'+key+'"] .sk33-identity{transform-origin:64px 65px;animation:'+kf+' '+duration+'s ease-in-out infinite}'+css};
}
/* Sixteen different ability particle families with V1/V2/V3 escalation.
 * Presentation only: no random calls and no mutation of combat/save state. */
function abilityFx(i,t,m,key){
 const types=['alchemy-bubbles','train-sparks','silk-web','ghost-fires','light-feathers',
  'candy-bursts','living-buds','chain-links','acid-drips','laser-streaks','poison-vapour',
  'spinning-shuriken','golden-spiral','cactus-thorns','bomb-sparks','orbiting-satellites'];
 const count=2+2*t,items=[];
 for(let n=0;n<count;n++){
  const angle=TAU*n/count,rad=39+t*3+(n%3)*2;
  const x=64+Math.cos(angle)*rad,y=65+Math.sin(angle)*rad;
  switch(i){
   case 0:items.push(circle(x,y,2+n%3,n%2?'#ffc8ff':'#fdf1b7'));break;
   case 1:items.push(star(x,y,4,3+n%2,1,m.light));break;
   case 2:items.push(line('M'+f(x-4)+' '+f(y-4)+'L'+f(x)+' '+f(y)+'L'+f(x+4)+' '+f(y-4),m.light,1.4));break;
   case 3:items.push(flame(x,y,n*20,.19+.07*t,'#b1dcff'));break;
   case 4:items.push(leaf(x,y,n*35,.12+t*.03,'#fffae1'));break;
   case 5:items.push(star(x,y,6,2.5+n%3,1,n%2?'#ffb1e3':'#fff3a9'));break;
   case 6:items.push(ellipse(x,y,3+n%3,3+n%2,'#a1ff9b',m.light,1));break;
   case 7:items.push(ellipse(x,y,4,2.5,'none','#eff8ff',1.7,n*41));break;
   case 8:items.push(line('M'+f(x)+' '+f(y-5)+'q-4 7 0 9q4 -2 0 -9Z',m.light,1,'#c2ff51'));break;
   case 9:items.push(line('M'+f(x-7)+' '+f(y)+'L'+f(x+7)+' '+f(y),m.light,1.7));break;
   case 10:items.push(ellipse(x,y,5+n%3,3.2,'#94c94d',m.light,1.2));break;
   case 11:items.push(star(x,y,4,4.5+n%2,1.5,m.light));break;
   case 12:items.push(star(x,y,5,2.5+n%3,1.5,'#ffe5a0'));break;
   case 13:items.push(line('M'+f(x-2)+' '+f(y+4)+'L'+f(x)+' '+f(y-5)+'L'+f(x+3)+' '+f(y+4),m.light,1.3));break;
   case 14:items.push(star(x,y,7,3.5+n%2,1.3,n%2?'#ffdb5b':'#fff6d2'));break;
   case 15:items.push(circle(x,y,2.5+n%3,'#eff0ff'));break;
  }
 }
 const name='sk33Fx'+key.replace(/[^a-zA-Z0-9]/g,''),
  scope='svg[data-animation-key="'+key+'"]',
  duration=(2.9-(t-1)*.18+(i%4)*.12).toFixed(2);
 const css=scope+' .sk33-ability-fx{transform-origin:64px 65px;animation:'+name+' '+duration+'s ease-in-out infinite}'+
 '@keyframes '+name+'{0%,100%{opacity:.45;transform:translateY(2px) rotate(-6deg) scale(.92)}'+
 '45%{opacity:1;transform:translateY(-'+(3+t)+'px) rotate(8deg) scale('+(1+.035*t).toFixed(3)+')}'+
 '75%{opacity:.7;transform:translateY(-1px) rotate(-2deg) scale(1)}}';
 return {type:types[i],css,markup:'<g class="sk33-ability-fx" data-skill-effect="'+types[i]+'">'+items.join('')+'</g>'};
}

/* Artist-authored, identity-specific physical evolution hardware.
 * Each V2 keeps V1 silhouette, then adds one new recognizable device.
 * V3 retains V2 and introduces a DIFFERENT, larger device.
 * Keep bolts, sparks and chains outside the eye-readability area.
 */
function stagedHardware(i,t,m,key){
 if(t===1)return {v2:'',v3:'',css:''};
 const c=m.light,b=m.base;
 const ring=(x,y,rx,ry,color=c,width=2,angle=0)=>ellipse(x,y,rx,ry,'none',color,width,angle);
 const dot=(x,y,r,color=c)=>circle(x,y,r,color);
 const L=(d,color=c,width=2)=>line(d,color,width);
 const S=(x,y,k=6,R=6,color=c)=>star(x,y,k,R,Math.max(1,R*.28),color);
 const P=(xy,color=b)=>poly(xy,color,c,1.5);
 let v2='',v3='';
 switch(i){
 case 0: // Eliksir: reacting flasks → alchemical synthesis array
  v2=ring(21,34,9,13,'#ffe0ff',2,-22)+P([[17,16],[25,16],[25,21],[30,29],[27,38],[16,38],[12,28],[17,22]],'#9d4be2')+dot(22,30,3,'#fff6a2');
  v3=ring(64,15,28,8,'#ffcfef',3)+S(100,19,8,10,'#ffe681')+dot(106,39,5,'#fff0b2')+L('M102 20L106 34L99 45','#ffd7f9',2.5);
  break;
 case 1: // Konduktor: second carriage → parallel locomotive route
  v2=P([[10,42],[31,42],[35,48],[35,61],[10,61]],'#7eabd3')+
    dot(16,65,5,'#d9edff')+dot(29,65,5,'#d9edff')+L('M9 71H47','#fff1a6',3);
  v3=P([[91,21],[118,21],[119,43],[90,43]],'#f6c053')+
    ring(105,34,18,12,'#fff5bc',2)+L('M12 103L114 103M20 113L106 113','#fbe1a0',3);
  break;
 case 2: // Czarny Pająk: new eye cluster → double web trap
  v2=ring(64,29,16,9,'#f2b2f4',2)+
    dot(58,28,3,'#fb4c9d')+dot(66,25,3,'#fb4c9d')+dot(74,28,3,'#fb4c9d')+
    L('M35 17L11 37L35 45M93 17L116 37L93 45','#d9a6f8',2);
  v3=ring(64,64,55,43,'#c888e9',2,35)+
    L('M8 33L35 53L14 97M120 33L94 53L113 97','#e0baff',2.5)+S(64,12,8,8,'#ff7dae');
  break;
 case 3: // Grób: gravestone reliquary → haunted graveyard portals
  v2=P([[10,96],[10,52],[19,44],[33,52],[33,96]],'#59647d')+
    L('M22 55V79M15 67H29','#e1e9ff',2.5)+flame(26,22,6,.33,'#92d5ff');
  v3=P([[93,99],[93,52],[104,42],[115,52],[115,99]],'#7080a6')+
    L('M104 52V81M96 65H112','#e5ecff',2.6)+ring(64,18,40,14,'#b9a3f7',2);
  break;
 case 4: // Skrzydło Światła: feather afterimage → radiant wing crown
  v2=leaf(23,49,-40,.58,'#fff4be')+leaf(110,51,40,.58,'#fff4be')+
    S(64,17,8,7,'#fff9d1');
  v3=P([[35,13],[43,24],[53,12],[64,24],[75,12],[84,24],[93,13],[90,34],[38,34]],'#ffe698')+
    ring(64,24,38,9,'#fff8df',2)+S(64,6,8,6,'#fff9de');
  break;
 case 5: // Pudełko Cukierków: wrapped drops → candy shower
  v2=dot(19,35,7,'#a3f6ff')+P([[8,35],[13,28],[13,42]],'#ff8dd1')+
    P([[25,28],[31,34],[25,42]],'#ff8dd1')+S(102,33,6,8,'#fff49c');
  v3=dot(108,19,8,'#ffcd64')+P([[91,19],[98,10],[98,28]],'#ff87be')+
    P([[118,10],[125,19],[118,28]],'#ff87be')+
    S(22,17,6,8,'#ffffff')+S(76,10,5,6,'#fff2aa');
  break;
 case 6: // Szlam: budding cell → autonomous split
  v2=ellipse(21,78,13,16,'#49e6a0','#d6ffaf',2)+
    dot(18,74,3,'#faffdb')+dot(25,78,3,'#faffdb');
  v3=ellipse(109,82,16,18,'#61ed8f','#e8ffc0',2.5)+
    dot(105,75,3,'#faffdb')+dot(114,80,3,'#faffdb')+
    L('M16 108Q64 93 115 109','#a8ffb2',2.8);
  break;
 case 7: // Kajdany: extra shackle locks → cross-link anchor
  v2=ring(25,39,9,16,'#e9faff',4,25)+
    L('M33 47L42 58L50 63','#a4c6f2',3)+dot(27,36,3,'#ffeeba');
  v3=ring(103,32,12,20,'#e9faff',4,-25)+
    L('M38 30L91 48M37 44L92 26','#cadcff',3)+
    P([[57,15],[71,15],[76,30],[64,40],[53,30]],'#98b9e3');
  break;
 case 8: // Kwas: reactive catalyst → active acid floor
  v2=ring(20,42,9,16,'#dfff93',2,-18)+
    L('M19 58Q8 73 18 83','#c8ff4e',3)+dot(14,87,4,'#d6ff6f');
  v3=L('M14 110Q37 98 59 110Q81 118 114 107','#caff45',5)+
    L('M27 118Q65 108 103 118','#efff87',3)+dot(110,95,7,'#d9ff47');
  break;
 case 9: // Promień Świetlny: ricochet lens → crossing prism beams
  v2=ring(24,31,12,12,'#ffffff',3)+
    L('M16 39L3 55M24 18L17 4','#b4f8ff',3);
  v3=P([[107,17],[122,39],[108,55],[91,35]],'#68e8ff')+
    L('M91 30L120 7M91 43L127 75','#f5ffff',3)+S(116,24,7,8,'#ffffff');
  break;
 case 10: // Trujący Gaz: emitted vapour → expanding poisonous fog
  v2=ellipse(22,33,17,11,'#8acb4d','#d7ff80',2)+
    ellipse(12,44,8,7,'#a4d85a','#efff9d',1.5);
  v3=ellipse(107,22,18,14,'#8cce59','#e2ff9a',2)+
    ellipse(119,37,8,8,'#9eea61','#e8ff9b',1.5)+
    ring(64,65,57,45,'#dcff8c',2);
  break;
 case 11: // Shuriken: extra spinning blade → giant crossed shurikens
  v2=S(23,39,4,12,'#e6efff')+dot(23,39,3,'#354b78');
  v3=S(105,27,4,17,'#dce6ff')+dot(105,27,4,'#354b78')+
    S(65,11,4,9,'#f0f8ff');
  break;
 case 12: // Fibonacci: sequence symbols → golden ratio crown
  v2=ring(22,30,13,13,'#ffdf8c',2)+S(22,30,5,9,'#fff2c2')+
    L('M28 109Q64 120 99 104','#ffcf67',3);
  v3=ring(64,21,31,15,'#ffe6ab',3)+
    L('M37 20Q69 -4 89 26Q103 47 72 48','#fff2c2',3)+S(105,42,8,9,'#ffdc84');
  break;
 case 13: // Kaktus: reactive spines → crystalline blooming cactus
  v2=leaf(24,42,-37,.48,'#7fe06d')+
    S(26,33,7,9,'#ffbada')+S(109,75,6,7,'#eeffbc');
  v3=leaf(106,35,37,.51,'#83ec70')+
    S(105,20,8,13,'#ffd7ea')+S(14,75,8,11,'#efffc3')+
    L('M52 10L56 25M75 10L72 25','#eeffd1',2.5);
  break;
 case 14: // Bomba: secondary trigger → three chain charges
  v2=P([[18,34],[22,22],[31,27],[34,40],[28,47],[18,44]],'#40495c')+
    L('M25 24L19 13','#f4bc8a',3)+S(18,9,7,7,'#fff49d');
  v3=dot(111,88,12,'#364155')+dot(18,92,11,'#364155')+
    L('M111 76L114 64M18 81L16 70','#ffd596',3)+
    S(113,59,7,8,'#ffe28f')+S(15,66,7,7,'#ffe28f');
  break;
 case 15: // Orbita: new moon → satellite interception constellation
  v2=ring(64,65,53,24,'#c9d0ff',2.8,25)+
    dot(19,47,7,'#d9e5ff')+dot(105,86,6,'#d9e5ff');
  v3=ring(64,65,60,36,'#e5e8ff',3,-27)+
    dot(115,30,7,'#f7efff')+dot(18,99,6,'#f7efff')+S(64,8,7,8,'#ffffff');
  break;
 }
 const name='sk33Gear'+key.replace(/[^a-zA-Z0-9]/g,''),
  extra='sk33Apex'+key.replace(/[^a-zA-Z0-9]/g,''),
  scope='svg[data-animation-key="'+key+'"]';
 const css=scope+' .sk33-stage2{transform-origin:64px 65px;animation:'+name+' '+(3.7-i%3*.21).toFixed(2)+'s ease-in-out infinite}'+
  scope+' .sk33-stage3{transform-origin:64px 65px;animation:'+extra+' '+(3.1-i%4*.13).toFixed(2)+'s ease-in-out infinite}'+
  '@keyframes '+name+'{0%,100%{opacity:.8;transform:rotate(-3deg) scale(.97)}50%{opacity:1;transform:rotate(3deg) scale(1.03)}}'+
  '@keyframes '+extra+'{0%,100%{opacity:.85;transform:rotate(-4deg) scale(.96)}50%{opacity:1;transform:rotate(5deg) scale(1.08)}}';
 return {v2,v3,css};
}

function portrait(id,tier,style='detailed'){
 id=Number(id);if(!Number.isInteger(id)||id<32||id>47)return '';
 const t=Math.min(3,Math.max(1,Math.round(Number(tier)||1))),i=id-32,m=motifs[i],classic=style==='classic';
 const key='sk33-'+id+'-'+t+'-'+(classic?'c':'d'),move=skillMotion(i,t,key),fx=abilityFx(i,t,m,key),gear=stagedHardware(i,t,m,key);
 const g='grad-'+key,gl='glow-'+key,wide='data-reference-panel="'+m.ref+'"';
 let art='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-ball-id="'+id+'" data-evolution="'+t+'" '+wide+' data-concept="'+m.key+'" data-animation-key="'+key+'" data-visual-style="'+(classic?'classic':'detailed')+'" data-ability-animation="'+move.name+'" aria-label="'+m.name+' V'+t+'">';
 art+='<defs><radialGradient id="'+g+'" cx="28%" cy="22%" r="81%"><stop stop-color="'+m.light+'"/><stop offset=".3" stop-color="'+m.base+'"/><stop offset=".76" stop-color="'+m.base+'"/><stop offset="1" stop-color="'+m.dark+'"/></radialGradient><filter id="'+gl+'" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="'+(2.5+t)+'"/></filter></defs>';
 const scope='svg[data-animation-key="'+key+'"]';
 art+='<style>'+scope+' .sk33-aura{transform-origin:64px 65px;animation:sk33Rotate '+(6+(i%5)*.67)+'s linear infinite}'+
  scope+' .sk33-core{transform-origin:64px 65px;animation:sk33Pulse '+(2.15+(i%7)*.14)+'s ease-in-out infinite alternate}'+
  scope+' .sk33-eyes{animation:sk33Blink 4.6s ease-in-out infinite}'+move.css+fx.css+gear.css+
  '@keyframes sk33Rotate{to{transform:rotate(360deg)}}@keyframes sk33Pulse{to{transform:scale(1.05)}}'+
  '@keyframes sk33Blink{0%,38%,62%,100%{transform:translateX(0)}44%,55%{transform:translateX(2px)}}'+
  'body.bvb-effects-off '+scope+' g,body.bvb-intensity-zero '+scope+' g{animation:none!important}'+
  'body.bvb-interior-motion-off '+scope+' .sk33-core,body.bvb-interior-motion-off '+scope+' .sk33-eyes{animation:none!important}'+
  'body.bvb-quality-low '+scope+' g{animation-timing-function:steps(8)!important}'+
  '@media(prefers-reduced-motion:reduce){'+scope+' *{animation:none!important}}</style>';
 art+='<g class="sk33-aura">'+ellipse(64,65,40+t*2,22+t,'none',m.light,1.6,i*17)+ellipse(64,65,45+t*2,27+t,'none',m.base,1.8,90-i*11)+'</g>';
 art+=circle(64,65,36,m.base,'opacity=".22" filter="url(#'+gl+')"');
 art+='<g class="sk33-core">';
 const core=classic?'#222b3c':'url(#'+g+')';
 art+=circle(64,65,27+t*1.35,core,'stroke="'+m.light+'" stroke-width="'+(2.1+t*.4)+'"');
 art+='<g class="sk33-identity">'+outside(i,t,m)+'</g>';
 if(t>=2)art+='<g class="sk33-stage2" data-evo-upgrade="V2">'+gear.v2+'</g>';
 if(t===3)art+='<g class="sk33-stage3" data-evo-upgrade="V3">'+gear.v3+'</g>';
 art+=fx.markup;
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
/* Animated real-battle and training sprites, not merely CSS in gallery.
 * Pure visual transform; does not change actor coordinates, physics or cooldown.
 */
function combatPose(id,tier,time){
 const i=id-32,stage=Math.max(1,Math.min(3,Number(tier)||1));
 const boost=1+(stage-1)*.23,clock=Number.isFinite(time)?time:0;
 const a=clock*(2.1+i*.12),v=Math.sin(a),w=Math.cos(a),hit=Math.max(0,v);
 let x=0,y=0,angle=0,sx=1,sy=1;
 switch(i){
  case 0:angle=v*5*boost;sx=1+w*.035*boost;sy=1-v*.03*boost;break; // potion swirls
  case 1:x=v*1.9*boost;angle=w*2.5*boost;break; // moving train
  case 2:angle=v*4*boost;sy=1+w*.05*boost;break; // web vibration
  case 3:y=-hit*2*boost;angle=v*2*boost;break; // rising ghosts
  case 4:y=-v*2.1*boost;angle=w*5*boost;break; // wingbeat
  case 5:angle=v*6*boost;y=-hit*1.2*boost;break; // bursting sweets
  case 6:sx=1+w*.06*boost;sy=1-w*.04*boost;break; // amoebic pulse
  case 7:x=v*1.6*boost;angle=w*5*boost;break; // taut chains
  case 8:sy=1+v*.04*boost;y=hit*1.3*boost;break; // dripping acid
  case 9:x=-hit*2*boost;sx=1+w*.022*boost;break; // firing recoil
  case 10:x=v*1.6*boost;y=w*.9*boost;angle=v*3*boost;break; // drifting gas
  case 11:angle=clock*46*boost;break; // shuriken spin
  case 12:angle=clock*20*boost;sx=1+v*.025*boost;sy=sx;break; // spiral
  case 13:sx=1+v*.035*boost;angle=w*3*boost;break; // reactive thorns
  case 14:sx=1+hit*.075*boost;sy=sx;angle=v*3.5*boost;break; // bomb detonation
  case 15:angle=clock*15*boost;x=v*1.2*boost;y=w*.9*boost;break; // orbit
 }
 return {x,y,angle,sx,sy};
}
function drawCombatSprite(ctx,id,tier,x,y,r,time,img,rotation=0){
 if(!ctx||id<32||id>47||!img?.complete||!img.naturalWidth)return false;
 if(![x,y,r].every(Number.isFinite)||r<=0)return false;
 const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||
  window.BVBMotion?.enabled?.('fight')===false||
  window.BVBMotion?.enabled?.('interior')===false||
  window.BVBMotion?.prefs?.()?.artIntensity===0;
 const p=combatPose(id,tier,reduceMotion?0:time);
 ctx.save();ctx.translate(x+p.x,y+p.y);
 ctx.rotate((Number.isFinite(rotation)?rotation:0)+p.angle*Math.PI/180);
 ctx.scale(p.sx,p.sy);
 ctx.drawImage(img,-r,-r,r*2,r*2);
 ctx.restore();
 return true;
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
window.BVBSketch33to48={count:16,tiers:3,firstId:32,lastId:47,concepts:motifs,svgFor:portrait,renderCombat:combat,combatPose,drawCombatSprite};
})();
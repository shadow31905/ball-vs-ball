/* Portrait reference panels 33–48. Visual motifs only; ball names
 * and original skills are taken from game data, not the concept art.
 * Each panel has its own progression and silhouette through V1/V2/V3.
 */
(()=>{
'use strict';
const motifs=Object.freeze([
 ['Spokój','calm','#65dafa','#edfbff','#0e69b6'],
 ['Pożarcie','devour','#8a26ce','#f29bff','#21052c'],
 ['Ewolucja','evolve','#53c928','#d4ff75','#2d4f17'],
 ['Rozpad','decay','#95715b','#ffc28c','#292023'],
 ['Budowa','build','#9bacba','#ffffff','#303c50'],
 ['Kontrola','control','#ff7b18','#ffe979','#50337e'],
 ['Wybuch','explosion','#ff7119','#ffe182','#621519'],
 ['Zamiana','swap','#37cdf8','#f5b1ff','#5029a7'],
 ['Antymateria','antimatter','#8421ce','#f15cff','#10041b'],
 ['Promieniowanie','radiation','#6dda10','#f0ff64','#195d0d'],
 ['Lodowata Mgła','frostfog','#a9efff','#f0ffff','#3670b7'],
 ['Burza','storm','#368bfe','#d3fbff','#132b76'],
 ['Kamienny Pancerz','stonearmor','#9f958a','#f4e4d6','#33313a'],
 ['Eteryczny','ether','#a6eaff','#ffffff','#698cdd'],
 ['Pustka','void','#6420bb','#ed7aff','#090215'],
 ['Gwiazda','star','#ffa61c','#fff8a6','#ad3105']
].map((m,i)=>Object.freeze({id:32+i,ref:33+i,name:m[0],key:m[1],base:m[2],light:m[3],dark:m[4]})));
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
function outside(index,t,m){
 const col=m.light,b=m.base;let o='';
 switch(index){
 case 0: // CALM: quiet blue light -> peaceful orbital field -> giant lotus serenity
  for(let k=0;k<3+t*2;k++){const a=k*TAU/(3+t*2);o+=sparkle(64+42*Math.cos(a),65+41*Math.sin(a),2+t*.65,k%2?col:'#42ccff');}
  if(t>=2){for(let k=0;k<3;k++)o+=ellipse(64,63,36+k*4,13+k*3,'none','#74ddff',2,15+k*45);}
  if(t===3){for(let k=0;k<7;k++){let a=k*TAU/7;o+=shard(64+36*Math.cos(a),58+39*Math.sin(a),k*360/7,.48+(k%2)*.12,'#bcf7ff');}
   o+=star(64,22,8,18,7,'#def9ff')+sparkle(64,11,6,'#b8ffff');}
  break;
 case 1: // DEVOUR: shadow whirl -> dark vortex -> crowned ravenous abyss
  for(let k=0;k<4+t*2;k++){const a=k*TAU/(4+t*2);o+=flame(64+37*Math.cos(a),66+37*Math.sin(a),k*45,.33+t*.13,k%2?'#ed5df5':'#8b18c2');}
  if(t>=2)o+=ellipse(64,64,41,20,'none','#e04df2',3.2,-29)+ellipse(64,64,43,16,'none','#9f3be0',2.5,38);
  if(t===3){o+=poly([[24,46],[37,17],[49,39],[64,8],[81,35],[96,13],[107,56],[91,99],[66,113],[33,94]],'#270536','#cb43ee',3);o+=flame(64,18,0,1.15,'#db4afa');}
  break;
 case 2: // EVOLUTION: buds -> vines -> giant golden branch and crown
  for(let k=0;k<3+t*3;k++){let a=k*TAU/(3+t*3),r=34+(k%2)*3;o+=leaf(64+r*Math.sin(a),65+r*Math.cos(a),k*37,.4+t*.09,k%2?'#83f63b':'#c8f65b');}
  if(t>=2)o+=line('M36 99Q30 60 54 29M93 97Q92 57 72 26','#a56c2f',4)+leaf(42,41,-29,.73,'#8fe53a')+leaf(91,44,25,.75,'#a8e932');
  if(t===3){o+=poly([[43,104],[48,67],[39,53],[59,36],[56,17],[67,32],[80,14],[82,42],[96,58],[83,79],[93,100]],'#86501e','#d6ad36',2.5);o+=leaf(64,9,-3,1.1,'#a2ff45')+leaf(32,38,-48,.84,'#ceff67');}
  break;
 case 3: // DECAY: cracks -> fragments -> crumbling black volcanic armour
  for(let k=0;k<3+t*2;k++){let a=k*TAU/(3+t*2);o+=rock(64+41*Math.cos(a),64+40*Math.sin(a),k*37,.22+t*.09,k%2?'#c49e86':'#3b3438');}
  if(t>=2)o+=line('M38 34L49 40L54 25M83 25L76 40L98 47M32 76L49 83L39 97','#ffa65b',2.5);
  if(t===3){o+=poly([[30,48],[43,18],[62,36],[82,11],[104,36],[111,77],[88,102],[58,109],[31,89]],'#302b2d','#bc8f78',3);o+=line('M40 35L52 56L63 46L70 70L93 81','#fa8536',3);}
  break;
 case 4: // BUILD: floating blocks -> protective bricks -> fortified castle
  for(let k=0;k<3+t*3;k++){let a=k*TAU/(3+t*3);let x=64+45*Math.cos(a),y=64+41*Math.sin(a),q=4+(t>1?1:0);o+=poly([[x-q,y-q],[x+q,y-q],[x+q,y+q],[x-q,y+q]],k%2?'#778b9e':'#c0cbd6','#f4f5f9',1);}
  if(t>=2){o+=poly([[28,53],[39,42],[49,53],[49,88],[33,87]],'#596e80','#dde6eb',2)+poly([[83,53],[94,42],[105,53],[103,90],[84,86]],'#768b9c','#effaff',2);}
  if(t===3){for(let k=0;k<3;k++){let x=39+k*25;o+=poly([[x-9,48],[x-9,20],[x-12,20],[x-12,13],[x-4,13],[x-4,19],[x+4,19],[x+4,13],[x+12,13],[x+12,21],[x+9,21],[x+9,48]],'#c5d2d9','#f9fdff',1.6);}o+=poly([[22,77],[64,28],[105,77],[94,102],[33,102]],'#9faebb','#eaf5ff',2);}
  break;
 case 5: // CONTROL: power orbit -> multiple runes -> domination crown
  for(let k=0;k<3+t*2;k++){let a=k*TAU/(3+t*2);o+=circle(64+42*Math.cos(a),63+42*Math.sin(a),2.6+(k%2)*.8,k%2?'#ed6afe':'#ffe457');}
  if(t>=2)o+=ellipse(64,62,41,15,'none','#ffb22c',2.6,-20)+ellipse(64,62,39,20,'none','#c978ff',2.2,45);
  if(t===3){o+=poly([[37,32],[38,13],[51,28],[65,8],[78,27],[91,11],[94,39]],'#f59c21','#fff5a6',2.5);
   for(let k=0;k<5;k++)o+=sparkle(28+k*18,21-(k%2)*10,4.4,'#ffed7e');}
  break;
 case 6: // EXPLOSION: amber spark -> chain reactions -> lava eruption
  for(let k=0;k<4+t*3;k++){let a=k*TAU/(4+t*3);o+=flame(64+37*Math.cos(a),64+37*Math.sin(a),k*49,.32+t*.12,k%2?'#ffa025':'#f83213');}
  if(t>=2)for(let k=0;k<3;k++)o+=rock(28+k*35,26+(k%2)*12,15+k*38,.32+t*.12,'#703328');
  if(t===3){o+=poly([[26,62],[38,27],[51,44],[63,10],[79,41],[96,13],[108,62],[96,97],[65,109],[28,98]],'#3b1113','#ff7621',3);o+=flame(64,14,0,1.1,'#ffdb39');}
  break;
 case 7: // SWAP: two-tone orb -> looping rainbow arrows -> portal exchange
  o+=ellipse(64,64,36,15,'none','#e88cff',t>=2?3.4:2.3,35);
  if(t>=2){o+=ellipse(64,65,42,18,'none','#53e3ff',3.2,-40);o+=poly([[27,43],[19,48],[27,52]],'#fff6a4','#fff6a4')+poly([[101,81],[109,76],[101,71]],'#fdb2ff','#fdb2ff');}
  if(t===3){o+=ellipse(64,63,47,24,'none','#fe9fff',4,65);o+=ellipse(64,63,46,19,'none','#80fdff',4,-20);o+=sparkle(91,15,10,'#fff1bd');}
  break;
 case 8: // ANTIMATTER: orb -> disrupted field -> black-hole horizon
  for(let k=0;k<4+t*2;k++){const a=k*TAU/(4+t*2);o+=rock(64+44*Math.cos(a),62+43*Math.sin(a),k*44,.29+t*.07,'#2e123d');}
  if(t>=2)o+=ellipse(64,63,39,22,'none','#ed4af3',3.3,-28)+ellipse(64,63,44,13,'none','#7d31d9',2.5,34);
  if(t===3)o+=circle(64,61,32,'#090217','stroke="#fc74fa" stroke-width="4"')+ellipse(64,61,47,24,'none','#db59ff',4.3,-32)+sparkle(26,18,7,'#eab6ff');
  break;
 case 9: // RADIATION: green particles -> gamma shield -> toxic reactor
  for(let k=0;k<5+t*3;k++){let a=k*TAU/(5+t*3);o+=shard(64+41*Math.cos(a),64+41*Math.sin(a),k*33,.22+t*.055,k%2?'#bdff23':'#5ae722');}
  if(t>=2){o+=ellipse(64,63,38,37,'none','#c3fd54',2.5);for(let k=0;k<3;k++)o+=star(64+28*Math.cos(k*TAU/3),65+28*Math.sin(k*TAU/3),3,6,2,'#ddff65');}
  if(t===3)o+=poly([[36,33],[54,18],[73,34],[92,13],[105,57],[99,88],[64,110],[28,84]],'#4b8c1f','#b6fa32',2.5)+shard(64,13,0,.8,'#dfff54');
  break;
 case 10: // ICE FOG: low vapor -> wisps + snow -> glacier crown
  for(let k=0;k<3+t*2;k++){let x=28+(k*29)%78,y=38+(k%3)*23;o+=ellipse(x,y,18+t*2,7+t,'#bff0ff','#f5ffff',1.2,(k%2?15:-13));}
  for(let k=0;k<3+t*2;k++){let a=k*TAU/(3+t*2);o+=sparkle(64+42*Math.cos(a),64+41*Math.sin(a),2+t*.7,'#ffffff');}
  if(t>=2)o+=ellipse(65,84,44,15,'#d4f4ff','#f7ffff',2,0);
  if(t===3){for(let k=0;k<5;k++){let x=31+k*16;o+=shard(x,25+(k%2)*6,k*12,.55+(k===2?.6:0),'#82e5ff');}o+=star(64,10,6,11,3.2,'#ffffff');}
  break;
 case 11: // STORM: wind rain -> voltage arcs -> thundercloud crown
  for(let k=0;k<3+t*3;k++){let x=20+(k*27)%96,y=22+(k%3)*31;o+=line('M'+f(x+2)+' '+f(y-4)+'l-5 14','#a8e4ff',1.7);}
  if(t>=2){o+=line('M30 34L41 25L37 46L51 43L41 63M96 23L82 42L94 44L79 61','#c5f5ff',3);o+=ellipse(64,22,30,13,'#4072b8','#c6e8ff',2.1);}
  if(t===3){o+=ellipse(48,21,24,15,'#365590','#e2f4ff',2)+ellipse(75,16,30,20,'#25477f','#d4e5ff',2)+ellipse(94,29,19,13,'#335c98','#c5e3ff',2);o+=line('M61 25L50 53L65 49L53 74','#ebf8ff',4.1);}
  break;
 case 12: // STONE ARMOUR: little rocks -> layering -> fortress of tall spikes
  for(let k=0;k<4+t*3;k++){let a=k*TAU/(4+t*3);o+=rock(64+41*Math.cos(a),64+41*Math.sin(a),k*21,.23+t*.075,k%2?'#756b68':'#bbb2a4');}
  if(t>=2)o+=poly([[26,47],[40,22],[59,37],[83,16],[103,48],[103,91],[80,106],[45,106],[24,83]],'#736a68','#d4c5b5',2.5);
  if(t===3){for(let k=0;k<6;k++){let x=26+k*14;o+=shard(x,21+(k%2)*11,k*7-20,k===3?1.15:.75,'#b2ada5');}o+=poly([[24,66],[45,40],[63,49],[85,35],[109,67],[96,99],[70,110],[37,105]],'#595451','#e6d5c7',3);}
  break;
 case 13: // ETHER: translucent plume -> airy ribbons -> sapphire spectral flame
  for(let k=0;k<3+t*3;k++){let a=k*TAU/(3+t*3);o+=flame(64+36*Math.cos(a),66+38*Math.sin(a),k*40,.37+t*.16,k%2?'#a7f0ff':'#e2faff');}
  if(t>=2)o+=ellipse(64,64,43,19,'none','#ffffff',2.3,-31)+ellipse(64,64,40,16,'none','#75cfff',2.4,29);
  if(t===3){o+=flame(64,21,0,1.4,'#d9faff')+flame(39,31,-28,.94,'#bdedff')+flame(94,29,35,.98,'#9fe7ff');o+=sparkle(64,10,8,'#ffffff');}
  break;
 case 14: // VOID: solid darkness -> shrinking orbits -> engulfing abyss
  for(let k=0;k<4+t*3;k++){let a=k*TAU/(4+t*3);o+=rock(64+44*Math.cos(a),64+44*Math.sin(a),k*29,.2+t*.09,'#210b30');}
  o+=circle(64,64,27+t*2,'#07000d','stroke="#b94bfb" stroke-width="'+(2+t*.4)+'"');
  if(t>=2)o+=ellipse(64,65,42,18,'none','#fa54fb',3,-25);
  if(t===3){o+=circle(64,64,34,'#04000a','stroke="#9c32ea" stroke-width="4"')+ellipse(64,64,50,24,'none','#e770ff',4.4,-28)+ellipse(64,64,45,16,'none','#7431b1',2.7,29);}
  break;
 case 15: // STAR: golden orb -> orbiting meteors -> full solar supernova
  for(let k=0;k<4+t*4;k++){let a=k*TAU/(4+t*4);o+=star(64+41*Math.cos(a),64+40*Math.sin(a),5,2+t*.45,1,'#fff7b0');}
  if(t>=2){for(let k=0;k<3;k++){let a=k*TAU/3;o+=rock(64+44*Math.cos(a),64+38*Math.sin(a),k*36,.36,'#b66a24');}o+=ellipse(64,63,43,15,'none','#ffe78d',3,18);}
  if(t===3){for(let k=0;k<11;k++){let a=k*TAU/11;o+=flame(64+35*Math.cos(a),63+35*Math.sin(a),k*33,.42+(k%3)*.1,k%2?'#fff09d':'#ff9c18');}o+=star(64,63,12,51,33,'#ffcf37');o+=circle(64,64,37,'#ffc034','stroke="#fff49c" stroke-width="3"');}
  break;
 }
 return o;
}
function portrait(id,tier){
 id=Number(id);if(!Number.isInteger(id)||id<32||id>47)return '';
 const t=Math.min(3,Math.max(1,Math.round(Number(tier)||1))),i=id-32,m=motifs[i];
 const key='sk33-'+id+'-'+t,g='grad-'+key,gl='glow-'+key,wide='data-reference-panel="'+m.ref+'"';
 let art='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-ball-id="'+id+'" data-evolution="'+t+'" '+wide+' data-concept="'+m.key+'" aria-label="'+m.name+' V'+t+'">';
 art+='<defs><radialGradient id="'+g+'" cx="28%" cy="22%" r="81%"><stop stop-color="'+m.light+'"/><stop offset=".3" stop-color="'+m.base+'"/><stop offset=".76" stop-color="'+m.base+'"/><stop offset="1" stop-color="'+m.dark+'"/></radialGradient><filter id="'+gl+'" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="'+(2.5+t)+'"/></filter></defs>';
 art+='<style>.sk33-aura{transform-origin:64px 64px;animation:sk33Rotate '+(5+(i%5)*.67)+'s linear infinite}.sk33-core{transform-origin:64px 64px;animation:sk33Pulse '+(2.15+(i%7)*.14)+'s ease-in-out infinite alternate}.sk33-eyes{animation:sk33Blink 4.6s ease-in-out infinite}@keyframes sk33Rotate{to{transform:rotate(360deg)}}@keyframes sk33Pulse{to{transform:scale(1.05)}}@keyframes sk33Blink{0%,38%,62%,100%{transform:translateX(0)}44%,55%{transform:translateX(2px)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
 art+='<g class="sk33-aura">'+outside(i,t,m)+'</g>';
 art+=circle(64,65,36,m.base,'opacity=".22" filter="url(#'+gl+')"');
 art+='<g class="sk33-core">';
 const darkCore=(i===8||i===14)&&t===3,core=darkCore?'#090215':'url(#'+g+')';
 art+=circle(64,65,27+t*1.35,core,'stroke="'+m.light+'" stroke-width="'+(2.1+t*.4)+'"');
 if(i===7)art+=line('M65 38Q47 62 65 94','none',0,'#ec99fa')+line('M65 38Q81 64 65 94','#b9f8ff',2);
 if(i===2)art+=line('M53 90Q64 60 62 38M63 50L48 39M62 60L78 41','#33752a',2.5);
 if(i===3||i===12)art+=line('M41 49L57 44L65 63L84 45M45 90L59 75L72 93','#59443b',2.6);
 if(i===9)art+=star(64,50,3,8,3,'#d8ff5f')+circle(64,51,4,'#82e52d');
 if(i===10)art+=ellipse(62,45,14,5,'#ffffff','none',0,-20);
 if(i===15)art+=ellipse(51,42,12,5,'#fffbe5','none',0,-20);
 if(!((i===8||i===14)&&t===3)){let face='<g class="sk33-eyes">';
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
 case 0:for(let k=0;k<st+2;k++)orbital(r+5+k*4,k*.58+a*.14);break;
 case 1:for(let k=0;k<st+3;k++)arc(0,0,r+k*3,a+k, a+k+1.5);break;
 case 2:for(let k=0;k<st+3;k++){let [x,y]=point(k,st+3,r+5);stroke([[x,y],[x+3,y-8],[x+7,y-12]]);}break;
 case 3:for(let k=0;k<st+3;k++){let [x,y]=point(k,st+3,r+8);stroke([[x-3,y+4],[x-4,y-3],[x+4,y-7],[x+7,y+2]]);}break;
 case 4:for(let k=0;k<st+3;k++){let [x,y]=point(k,st+3,r+6);ctx.strokeRect(x-3,y-3,6,6);}break;
 case 5:for(let k=0;k<st+1;k++)orbital(r+8+k*3,k*.9+a*.22);break;
 case 6:for(let k=0;k<st+4;k++){let [x,y]=point(k,st+4,r+7);stroke([[x-4,y+3],[x,y-8],[x+4,y+3]]);}break;
 case 7:orbital(r+11,a*.4);orbital(r+11,-a*.4);break;
 case 8:orbital(r+7,a*.23);orbital(r+12,-a*.2);break;
 case 9:for(let k=0;k<st+5;k++){let [x,y]=point(k,st+5,r+7);dot(x,y,2);}break;
 case 10:for(let k=0;k<st+3;k++)orbital(r+5+k*2,k*.3);break;
 case 11:for(let k=0;k<st+6;k++){let [x,y]=point(k,st+6,r+5);stroke([[x,y],[x-4,y+10]]);}break;
 case 12:for(let k=0;k<st+4;k++){let [x,y]=point(k,st+4,r+8);stroke([[x-4,y+6],[x,y-8],[x+4,y+6]]);}break;
 case 13:for(let k=0;k<st+3;k++){let [x,y]=point(k,st+3,r+7);arc(x,y,4,a,a+Math.PI);}break;
 case 14:orbital(r+9,a*.38);orbital(r+14,-a*.27);break;
 case 15:for(let k=0;k<st+6;k++){let [x,y]=point(k,st+6,r+6);stroke([[x,y],[x*1.25,y*1.25]]);}break;
 }
 ctx.restore();
}
window.BVBSketch33to48={count:16,tiers:3,firstId:32,lastId:47,concepts:motifs,svgFor:portrait,renderCombat:combat};
})();
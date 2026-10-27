/* Original scalable vector portraits for user sketch "Neonowy atlas ewolucji", 
 * panels 49-64; visual presentation ONLY. In-game ball IDs 48-63.
 * V1/V2/V3 use individually authored costumes and ornaments.
 * These portraits are redrawings of the reference, not the source PNG itself.
 */
(()=>{
'use strict';
const chars=Object.freeze([
 ['Medyk','medic','#44e89d','#effff7','#0c7c4d'],
 ['Prawda','truth','#ffb933','#fff7bd','#95510b'],
 ['Szkło','glass','#2bb2fc','#d8f8ff','#063f96'],
 ['Portal','portal','#b535ef','#f7b4ff','#26064b'],
 ['Tarcza','shield','#36bcff','#f7ffff','#0647a7'],
 ['Magik','mage','#b337f5','#ffc2ff','#341077'],
 ['Chronos','chronos','#f5b83d','#fff6bd','#995515'],
 ['Ninja','ninja','#2757c6','#bcdaff','#060e37'],
 ['Pirat','pirate','#da5927','#ffe0a0','#4d1011'],
 ['Górnik','miner','#c28b4e','#fff2aa','#463122'],
 ['Szeryf','sheriff','#df8b25','#fff2a2','#6e3218'],
 ['Magma','magma','#f63e16','#ffb335','#3b1012'],
 ['Plazma','plasma','#159bff','#c4ffff','#07287e'],
 ['Meteor','meteor','#e35d1a','#ffcf5c','#372323'],
 ['Cyklon','cyclone','#32d5cf','#c5fff9','#054f64'],
 ['Pryzmat','prism','#b648fb','#fdfbff','#1456e0']
].map((a,i)=>Object.freeze({id:i+48,panel:i+49,name:a[0],key:a[1],main:a[2],light:a[3],dark:a[4]})));
const fmt=n=>Number(n).toFixed(2),TAU=Math.PI*2;
const path=(d,fill='none',stroke='none',w=1,extra='')=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round" '+extra+'/>';
const circle=(x,y,r,fill,extra='')=>'<circle cx="'+fmt(x)+'" cy="'+fmt(y)+'" r="'+fmt(r)+'" fill="'+fill+'" '+extra+'/>';
const ellipse=(x,y,rx,ry,fill,stroke='none',w=1,rotate=0)=>'<ellipse cx="'+fmt(x)+'" cy="'+fmt(y)+'" rx="'+fmt(rx)+'" ry="'+fmt(ry)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" transform="rotate('+rotate+' '+fmt(x)+' '+fmt(y)+')"/>';
const polygon=(points,fill,stroke='none',w=1)=>'<polygon points="'+points.map(p=>p.map(fmt).join(',')).join(' ')+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round"/>';
const star=(x,y,N,outer,inner,fill,stroke='none')=>{let a=[];for(let i=0;i<2*N;i++){let rad=i*Math.PI/N-Math.PI/2,r=i%2?inner:outer;a.push([x+Math.cos(rad)*r,y+Math.sin(rad)*r]);}return polygon(a,fill,stroke,.8);};
const transformed=(x,y,ang,scale,inner)=>'<g transform="translate('+fmt(x)+' '+fmt(y)+') rotate('+ang+') scale('+fmt(scale)+')">'+inner+'</g>';
const spark=(x,y,s,color)=>star(x,y,4,s,s*.22,color);
const wave=(x,y,rx,ry,angle,color,w=2)=>ellipse(x,y,rx,ry,'none',color,w,angle);
function flame(x,y,ang,sz,col){return transformed(x,y,ang,sz,path('M-10 15Q-17 1-3-13L-1-25Q4-13 7-20Q21 5 11 15Q0 25-10 15Z',col));}
function shard(x,y,ang,sc,c){return transformed(x,y,ang,sc,polygon([[0,-22],[11,-8],[8,13],[-4,22],[-13,0]],c,'#eaffff',1.7)+path('M0-22L-4 22M-13 0L11-8','none','#fff',1.2));}
function rock(x,y,ang,sc,c){return transformed(x,y,ang,sc,polygon([[-13,-7],[-2,-16],[14,-9],[17,7],[2,16],[-12,10]],c,'#edaf82',1.5)+path('M-2-16L1 1L17 7M1 1L-12 10','none','#553026',1.2));}
function ring(cx,cy,r,color,width=2,tilt=0){return wave(cx,cy,r,r*.49,tilt,color,width);}
function point(k,n,r,cx=64,cy=65,rotation=0){const a=k*TAU/n+rotation;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];}
function wheel(x,y,r,t){
 let s=circle(x,y,r,'#f5d18a','stroke="#c18c25" stroke-width="3"')+circle(x,y,r-5,t===3?'#5d4022':'#faf0cf','stroke="#fff1a8" stroke-width="1.4"');
 for(let k=0;k<12;k++){let a=k*TAU/12;s+=path('M'+fmt(x+Math.sin(a)*(r-8))+' '+fmt(y-Math.cos(a)*(r-8))+'L'+fmt(x+Math.sin(a)*(r-3))+' '+fmt(y-Math.cos(a)*(r-3)),'none','#855420',1.8);}
 return s+path('M'+x+' '+y+'l0-'+fmt(r*.56)+'m0 '+fmt(r*.56)+'l'+fmt(r*.34)+' -'+fmt(r*.31),'none',t===3?'#fff4a8':'#604229',2.7)+circle(x,y,2.3,'#513b28');
}
function aura(i,t,m){
 let s='',r=35;
 const scatter=(num,fn)=>{for(let k=0;k<num;k++){const pt=point(k,num,r+(k%3)*4,64,65,i*.13);s+=fn(pt[0],pt[1],k);}};
 switch(i){
 case 0: // medic: hovering medical pluses, white bandage, emergency glow
  scatter(3+t*2,(x,y,k)=>'<g opacity=".96">'+path('M'+fmt(x-2)+' '+fmt(y-7)+'h4v5h5v4h-5v5h-4v-5h-5v-4h5Z','#b4ffbd')+'</g>');
  if(t>1)s+=ring(64,65,39,'#4dffa8',3,-15)+ring(64,65,42,'#d0ffee',1.5,33);
  if(t===3)s+=spark(64,8,10,'#aaffcf')+spark(29,26,6,'#53ff9b')+spark(103,30,6,'#79ffa9');
  break;
 case 1: // justice: gold crown, floating scales of justice 
  scatter(3+t*2,(x,y,k)=>spark(x,y,3+(k%2)*2,'#ffdc61'));
  if(t>=2)s+=path('M31 40L43 18L54 34L65 12L77 34L92 17L100 43Z','#df9021','#ffef94',2)+ring(64,66,40,'#ffcc65',2,20);
  if(t===3)s+=star(65,12,9,17,7,'#ffe282')+path('M17 32L26 22L36 29M95 26L105 13L114 27','none','#ffec89',2.6);
  break;
 case 2: // fractured glass, crystal coronet, giant blue stalactites
  scatter(3+t*2,(x,y,k)=>shard(x,y,k*37,.32+t*.12,k%2?'#b8faff':'#33b9ff'));
  if(t>=2)s+=shard(44,31,-25,.76,'#b5eaff')+shard(88,30,23,.85,'#4dc6ff');
  if(t===3)s+=shard(65,19,0,1.42,'#d3fcff')+shard(34,31,-39,.93,'#36b9ff')+shard(102,35,35,.94,'#82e7ff');
  break;
 case 3: // dimensional whirl, violet portal iris
  for(let k=0;k<2+t;k++)s+=ring(64,65,30+k*5,k%2?'#ce57ff':'#7922d8',2.8,k*41-32);
  scatter(2+t*2,(x,y,k)=>shard(x,y,k*33,.2+t*.09,'#9b43e4'));
  if(t===3)s+=circle(90,29,11,'#120324','stroke="#df72ff" stroke-width="3"')+ring(64,65,46,'#e8afff',3.2,-22);
  break;
 case 4: // protector: concentric blue shields, crystalline bastion battlements
  scatter(2+t*2,(x,y,k)=>spark(x,y,3+k%3,'#8cffff'));
  if(t>=2)s+=path('M35 55L37 36L46 26L64 33L83 26L94 38L95 57','none','#9cefff',3);
  if(t===3)s+=path('M23 56L23 28L32 21L41 30L50 17L63 26L76 16L89 26L101 18L111 31L111 70','none','#ebffff',4)+shard(39,21,-17,.77,'#7ddfff')+shard(89,21,13,.74,'#b8ffff');
  break;
 case 5: // spell stars, sorcerer copying doubles
  scatter(3+t*2,(x,y,k)=>spark(x,y,2+k%3,'#f5a8ff'));
  if(t>=2)s+=ring(64,64,41,'#e252fd',2.7,-30)+spark(96,19,10,'#d958fc');
  if(t===3)s+=ring(64,63,47,'#b64dff',3.2,27)+circle(106,37,10,'#a02fe4','stroke="#f7b9ff" stroke-width="2"')+spark(113,19,8,'#fff6af');
  break;
 case 6: // timepieces, clock hands and golden spiral
  for(let k=0;k<t+1;k++)s+=ring(64,64,34+k*5,'#fed671',2.1,k*36-26);
  scatter(3+t,(x,y,k)=>spark(x,y,2.5+(k%2)*2,'#ffe6a2'));
  if(t===3)s+=wheel(90,28,15,3)+wheel(36,29,10,2)+star(64,11,8,13,5,'#ffce54');
  break;
 case 7: // stealth: midnight blue flowing cloak and ghost trails
  scatter(2+t*2,(x,y,k)=>path('M'+fmt(x-7)+' '+fmt(y+5)+'Q'+fmt(x+4)+' '+fmt(y-10)+' '+fmt(x+13)+' '+fmt(y-17),'none','#3b7cff',1.9));
  if(t>=2)s+=path('M27 90Q6 42 41 21Q79 10 97 33M88 38Q122 20 112 9','none','#2c6afe',3.3);
  if(t===3)s+=path('M13 40Q60 2 117 18Q92 49 109 72L121 101Q81 86 72 62','none','#4d9dff',4)+ring(64,60,45,'#1f62e9',2,-34);
  break;
 case 8: // pirate sea flame, cannons, cursed gold
  scatter(3+t*2,(x,y,k)=>flame(x,y,k*37,.27+t*.05,k%2?'#ff8b18':'#eb4d10'));
  if(t>=2)s+=spark(99,32,6,'#ffbd5c')+circle(105,38,3,'#d89e45');
  if(t===3)s+=flame(64,14,0,1,'#ed6e17')+flame(37,29,-24,.7,'#ffa23a')+flame(99,26,29,.76,'#ff4c1e');
  break;
 case 9: // stone fragments and prospecting lamps, growing ore mass
  scatter(3+t*3,(x,y,k)=>rock(x,y,k*30,.26+t*.08,k%2?'#6c5848':'#a99372'));
  if(t>=2)s+=shard(94,38,22,.63,'#ffa52d')+shard(37,38,-32,.56,'#a7ecff');
  if(t===3)s+=rock(96,22,20,1.02,'#57443a')+rock(33,28,-22,.89,'#675346')+shard(63,18,0,.85,'#ffb733');
  break;
 case 10: // cowboy bullets/sheriff stars, revolver sparks
  scatter(3+t*2,(x,y,k)=>spark(x,y,3+(k%3),k%2?'#ffdb73':'#fff4ad'));
  if(t>=2)s+=ring(64,66,42,'#efbf51',2,15)+star(98,21,5,10,4.5,'#fff0a1');
  if(t===3)s+=path('M22 38Q64 9 103 36','none','#ffd173',4)+star(65,11,6,9,4,'#fff1a0');
  break;
 case 11: // basalt stones, blazing magma flow and volcanic crown
  scatter(4+t*2,(x,y,k)=>flame(x,y,k*40,.36+t*.11,k%2?'#fb3e0b':'#ffc532'));
  if(t>=2)s+=rock(35,36,-27,.62,'#342426')+rock(97,33,34,.72,'#552828');
  if(t===3)s+=path('M34 42L43 11L60 31L73 9L85 32L98 18L107 56','none','#ffae21',4.2)+flame(65,14,0,1.18,'#ffc13b');
  break;
 case 12: // plasma arcs and magnetic loop apparatus
  scatter(4+t*3,(x,y,k)=>path('M'+fmt(x-7)+' '+fmt(y-7)+'l9 -6 -2 9 9 -2 -15 13 4 -10','none','#b5f7ff',2.1));
  if(t>=2)s+=ring(64,65,40,'#4bd9ff',3,-27)+ring(64,65,43,'#baffff',2,41);
  if(t===3)s+=shard(65,17,0,.67,'#5bffff')+ring(64,63,50,'#76efff',3,14)+ring(64,63,47,'#3ac7ff',2,-41);
  break;
 case 13: // meteor fragments -> fiery comet -> catastrophic blazing train
  scatter(3+t*2,(x,y,k)=>rock(x,y,k*39,.23+t*.11,k%2?'#6d3a27':'#392627'));
  if(t>=2)s+=flame(42,30,-27,.92,'#ff841a')+flame(85,26,16,.99,'#ffb02a');
  if(t===3)s+=path('M14 47Q29 15 45 9L87 0L102 16L93 45','none','#ff8e14',5)+flame(64,15,10,1.6,'#ff5c0c')+flame(100,30,26,1.03,'#ffca39');
  break;
 case 14: // air whirlwinds and visible turquoise funnels
  for(let k=0;k<2+t;k++)s+=ring(64,64,32+k*6,'#64ffeb',2.6,k*29-30);
  if(t>=2)s+=path('M26 46Q69 14 104 39M26 85Q66 107 102 84','none','#aafff2',3);
  if(t===3)s+=path('M44 13Q89 4 102 27Q117 58 90 103Q59 119 36 103','none','#42f1df',4.2)+spark(64,12,9,'#bafffa');
  break;
 case 15: // faceted diamond catches all colors of a rainbow
  scatter(3+t*2,(x,y,k)=>shard(x,y,k*30,.24+t*.08,['#fa88f7','#77e8ff','#fae27b'][k%3]));
  if(t>=2)s+=polygon([[25,35],[39,16],[65,30],[93,17],[108,42]],'none','#f8b3ff',2.1);
  if(t===3)s+=polygon([[18,42],[41,8],[64,27],[86,7],[112,38],[98,92],[61,113],[24,91]],'#6a4ed2','#a6f8ff',2.4)+path('M18 42L64 27L112 38M64 27L61 113','none','#fcffff',2.5);
  break;
 }
 return s;
}
function helmet(i,t,m){ // ornaments installed ON TOP of each unique orb
 let s='';
 switch(i){
 case 0:
  if(t===1){s+=path('M38 49Q64 27 91 49L90 55L38 55Z','#f2fcf7','#36c98b',2);s+=path('M56 37H70V31H76V37H82V43H76V49H70V43H56Z','#4bdf86');}
  if(t===2){s+=path('M34 55Q32 28 53 27Q73 20 93 42L92 55','none','#fbfffe',7)+path('M33 51Q64 44 95 51','none','#72d5bd',3)+path('M58 32h13v-6h6v6h12v7h-12v6h-6v-6h-13Z','#45ffa5');}
  if(t===3){s+=path('M27 53Q29 23 52 17L76 17Q103 30 103 54L95 58L29 58Z','#1a9a6e','#b3ffdd',3.2)+path('M39 29Q65 20 90 34','none','#c5fff3',3)+path('M58 24h12v-9h8v9h11v8H78v10h-8V32H58Z','#e7fff1');}
  break;
 case 1:
  if(t===1)s+=star(64,33,4,10,4,'#fff4a0');
  if(t>=2){s+=path('M31 47L38 29L52 40L64 18L79 38L91 28L99 51L78 57L51 57Z','#c68122','#ffe99e',2.3)+circle(64,31,4,'#fff9d4');
   if(t===3)s+=path('M65 15v-14M45 25L32 13M83 23L97 11','none','#fff2a2',2.6);}
  break;
 case 2:
  if(t>=2)s+=shard(64,30,0,t===3?1.1:.72,'#aaf5ff')+shard(41,39,-25,.52,'#60cfff')+shard(88,38,24,.57,'#baffff');
  break;
 case 3:
  s+=ring(64,64,29+t*3,t===3?'#ee91ff':'#c357fd',2.8,-27);
  if(t===3){s+=circle(64,35,10,'#120522','stroke="#e479ff" stroke-width="2"')+spark(64,35,6,'#f4b9ff');}
  break;
 case 4:
  s+=path(t===3?'M24 54L33 37L65 23L96 35L105 54L98 90L64 108L30 90Z':t===2?'M29 53L42 37L64 34L89 40L97 54L93 84L64 101L34 84Z':'M34 55L43 41L64 37L85 43L94 55L88 82L64 98L39 82Z',t===3?'#174a9c':'#2675d0','#b7efff',3);
  s+=path('M41 54L64 45L88 55L82 79L64 91L47 80Z',t===3?'#2dc5f4':'#195aa8','#e4ffff',2.4);
  if(t===3)s+=shard(64,29,0,.43,'#c4f8ff');
  break;
 case 5:
  s+=path(t===3?'M33 43Q44 27 51 4Q59 12 79 17Q91 32 103 43Z':'M36 46Q49 29 55 13Q72 27 79 19Q91 27 95 47Z',t===1?'#60118f':'#7114bc','#ea86fd',2.4);
  s+=ellipse(64,44,t===3?44:39,7,'#3c0a7a','#ea66ff',2.8);
  if(t>=2)s+=star(73,28,5,5,2.2,'#ffe881');
  if(t===3)s+=spark(52,9,6,'#ffb6ff')+circle(88,36,5,'#9c33cc');
  break;
 case 6:
  s+=wheel(64,64,t===1?29:t===2?31:33,t);
  if(t>=2)s+=path('M32 38L48 26L64 31L79 24L97 39','none','#ffe5a0',3);
  if(t===3)s+=path('M38 38L40 16L51 29L63 7L75 28L89 14L93 39','#b87923',3,'#d19a39');
  break;
 case 7:
  s+=path('M33 61Q39 40 59 39Q75 38 94 55L92 65L35 68Z',t===1?'#142767':'#09163e','#4c92ff',2.2);
  s+=path('M34 61L95 60L88 74L41 75Z','#0b153b','#3159aa',2);
  if(t>=2)s+=path('M43 46Q62 35 84 49','none','#9cc0ff',2);
  if(t===3)s+=polygon([[84,36],[97,20],[103,33],[115,36],[104,47],[99,62]],'#152c60','#99d3ff',2);
  break;
 case 8:
  if(t===1)s+=path('M29 50Q37 28 62 39L95 53L95 61L29 58Z','#c3292a','#f78854',2);
  if(t>=2){
   s+=path('M25 55L34 31L52 29L64 13L79 29L98 25L109 55L92 63L36 63Z','#231821','#ffad44',2.4);
   s+=ellipse(64,56,45,9,'#2c1b1d','#faab4d',2);
   s+=circle(65,35,8,'#fff5d6')+circle(62,34,2.4,'#1d1321')+circle(68,34,2.4,'#1d1321')+path('M60 38l9 0M56 41l-4 6M73 41l4 6','none','#2b161d',1.7);
   if(t===3)s+=flame(65,12,0,.57,'#ff9320');
  }
  break;
 case 9:
  s+=path('M28 52Q31 31 46 31L54 21L74 21L83 31Q96 35 98 54Z','#cd8a2a','#f7d18f',3);
  s+=ellipse(64,53,36,8,'#b97b25','#fff0ae',2);
  s+=circle(64,37,t===1?8:11,'#fff5a0','stroke="#8a532a" stroke-width="3"')+circle(64,37,5,'#ffc53a');
  if(t>=2)s+=circle(83,40,7,'#ffd864','stroke="#854e20" stroke-width="2"');
  if(t===3)s+=rock(93,35,12,.6,'#5b4335');
  break;
 case 10:
  s+=path('M30 47Q40 25 63 30Q83 19 98 47L105 57L91 63L36 60L23 55Z','#75502c','#ffd488',2.3);
  s+=ellipse(64,55,46,8,'#79502a','#ffc05e',2.4);
  s+=star(64,46,5,8,3.4,'#ffe089','#a85f22');
  if(t>=2)s+=path('M48 35Q65 29 83 34','none','#f4c36b',2);
  if(t===3)s+=star(65,27,5,9,3.2,'#ffe382')+spark(93,32,5,'#fff2b0');
  break;
 case 11:
  s+=rock(43,42,19,.58,'#39262c')+rock(87,39,-23,.64,'#4c2d29');
  if(t>=2)s+=path('M37 42L48 17L61 37L78 16L95 42','none','#ffae32',3);
  if(t===3)s+=rock(65,23,0,.94,'#2c2225')+flame(65,13,0,.7,'#ffc436');
  break;
 case 12:
  s+=path('M64 35L64 16M48 30L38 17M81 29L92 17','none','#bcffff',2.8);
  if(t>=2)s+=circle(64,18,6,'#7cdbff','stroke="#e5ffff" stroke-width="2"')+ring(64,53,38,'#5bcbff',2.3,15);
  if(t===3)s+=shard(64,26,0,.7,'#d9ffff')+ring(64,64,44,'#a1ffff',3,-18);
  break;
 case 13:
  s+=rock(64,38,13,t===3?1.15:.81,'#432e2d');
  if(t>=2)s+=rock(43,40,-21,.53,'#4b332e')+rock(87,38,21,.58,'#3d2629');
  if(t===3)s+=flame(64,21,0,1,'#ffad1b');
  break;
 case 14:
  for(let k=0;k<t+1;k++)s+=ring(64,62,29+k*3.5,'#7effef',2,k*37-25);
  if(t>=2)s+=path('M35 44Q55 23 86 40M34 87Q65 100 94 84','none','#d1ffff',2.3);
  if(t===3)s+=path('M44 39Q70 1 98 38','none','#a9fff3',4);
  break;
 case 15:
  s+=polygon(t===3?[[65,19],[94,42],[99,77],[65,104],[33,79],[35,42]]:t===2?[[65,26],[91,45],[90,80],[65,98],[37,79],[39,45]]:[[65,31],[88,48],[85,81],[64,96],[43,79],[44,49]],'url(#prism-'+(48+i)+'-'+t+')','#dcfaff',2.5);
  s+=path('M65 26L65 97M40 48L65 58L92 48M65 58L86 81','none','#ffffff',2.1);
  if(t===3)s+=path('M33 39L64 17L99 42','none','#ff9fff',3);
  break;
 }
 return s;
}
function face(i,t){
 if(i===4&&t>=2){} // Eyes are painted on the shield front, not discarded.
 if(i===6){} // The Chronos clock retains living eyes on its dial.
 let out='<g class="sk49-eyes">';
 const black=i===7?'#020613':'#0b1327';
 for(const side of [-1,1]){
  const x=64+side*13, y=i===6?76:78;
  out+=path('M'+(x-10)+' '+(y-12+(side===-1?-2:2))+'L'+(x+10)+' '+(y-6+(side===-1?2:-2)),'none',black,3.8);
  out+=path('M'+(x-9)+' '+(y-7)+'Q'+(x-1)+' '+(y-12)+' '+(x+9)+' '+(y-6)+'L'+(x+5)+' '+(y+7)+'Q'+x+' '+(y+10)+' '+(x-9)+' '+(y+2)+'Z',i===7?'#d1e9ff':'#fffef9',black,1.5);
  out+=ellipse(x+side*(i%3),y+1,3.2,3.7,black)+circle(x+side*(i%3)-1,y-1,1.1,'#fff');
 }
 if(i===7)out+=path('M41 91Q64 95 88 91','none','#4b79db',2);
 return out+'</g>';
}
function portrait(id,stage){
 id=Number(id);if(!Number.isInteger(id)||id<48||id>63)return '';
 stage=Number(stage);const t=Math.min(3,Math.max(1,Math.round(Number.isFinite(stage)?stage:1))),i=id-48,m=chars[i];
 const token=id+'-'+t,g='sk49g-'+token,gl='sk49gl-'+token;
 let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-ball-id="'+id+'" data-evolution="'+t+'" data-reference-panel="'+(id+1)+'" data-sketch49="'+m.key+'" aria-label="'+m.name+' V'+t+'">';
 svg+='<defs><radialGradient id="'+g+'" cx="28%" cy="20%" r="88%"><stop offset="0" stop-color="'+m.light+'"/><stop offset=".24" stop-color="'+m.main+'"/><stop offset=".75" stop-color="'+m.main+'"/><stop offset="1" stop-color="'+m.dark+'"/></radialGradient><filter id="'+gl+'" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="'+(2+t)+'"/></filter>';
 if(i===15)svg+='<linearGradient id="prism-'+token+'" x1="0%" y1="0%" x2="100%" y2="70%"><stop stop-color="#ff6acb"/><stop offset=".25" stop-color="#67dfff"/><stop offset=".5" stop-color="#fff0a1"/><stop offset=".73" stop-color="#5a69ee"/><stop offset="1" stop-color="#d98aff"/></linearGradient>';
 svg+='</defs><style>.sk49-aura{transform-origin:64px 64px;animation:sk49Turn '+(5+i%6*.69)+'s linear infinite}.sk49-core{transform-origin:64px 64px;animation:sk49Breathe '+(2.1+i%5*.21)+'s ease-in-out infinite alternate}.sk49-eyes{animation:sk49Glance 4.8s ease-in-out infinite}@keyframes sk49Turn{to{transform:rotate(360deg)}}@keyframes sk49Breathe{to{transform:scale(1.045)}}@keyframes sk49Glance{0%,39%,62%,100%{transform:translateX(0)}45%,54%{transform:translateX(2px)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
 svg+='<g class="sk49-aura">'+aura(i,t,m)+'</g>';
 svg+=circle(64,65,36,m.main,'opacity=".32" filter="url(#'+gl+')"');
 svg+='<g class="sk49-core">';
 const core=i===7?'#10204b':i===3&&t===3?'#180428':'url(#'+g+')';
 svg+=circle(64,65,28+(t-1)*1.4,core,'stroke="'+m.light+'" stroke-width="'+(2+t*.43)+'"');
 if(i===2)svg+=path('M43 47L57 41L68 57L86 42M44 89L56 79L76 90','none','#e3f9ff',2);
 if(i===11)svg+=path('M42 49L57 57L66 40L85 54M45 91L64 77L82 93','none','#ff951c',3.5);
 if(i===12)svg+=ring(64,65,21,'#ecffff',1.8,-15);
 if(i===14)svg+=ring(64,63,21,'#affff5',2.8,-30);
 if(i===15)svg+=polygon([[43,50],[65,36],[84,51],[91,80],[64,94],[40,78]],'url(#prism-'+token+')','#fcffff',2);
 if(i===9)svg+=path('M40 57L64 44L88 58','none','#e9bd79',2.2);
 svg+=ellipse(53,47,13,5,'#ffffff','none',.5,-21).replace('fill="#ffffff"','fill="#ffffff" opacity=".27"');
 svg+=helmet(i,t,m)+face(i,t)+'</g>';
 svg+='<g class="sk49-sparks">'+spark(18,19,3+t,m.light)+(t>=2?spark(107,21,4+t,m.light):'')+(t===3?spark(23,100,5,m.light):'')+'</g></svg>';
 return svg;
}
function paintCombat(ctx,actor,g){
 const id=actor?.b?.id;
 if(id<48||id>63||!ctx||window.BVBMotion?.enabled?.('fight')===false||window.BVBMotion?.enabled?.('interior')===false)return;
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
 const quality=window.BVBMotion?.prefs?.()||{};if(quality.artQuality==='low'||quality.artIntensity===0)return;
 const i=id-48,m=chars[i],t=Number(g?.rt||0),stage=Math.max(1,Math.min(3,actor.tier||1)),
 radius=Math.max(9,actor.r||16),opacity=(Number.isFinite(quality.artIntensity)?quality.artIntensity/100:1);
 ctx.save();ctx.translate(actor.x,actor.y);ctx.strokeStyle=m.light;ctx.fillStyle=m.main;ctx.globalAlpha=Math.min(.67,opacity*(.2+stage*.11));
 ctx.shadowBlur=quality.artQuality==='ultra'?11:4;ctx.shadowColor=m.main;ctx.lineWidth=1+stage*.32;
 const dash=(coords)=>{ctx.beginPath();coords.forEach(([x,y],k)=>k?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const orb=(r,angle)=>{ctx.save();ctx.rotate(angle);ctx.scale(1,.48);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();ctx.restore();};
 const dot=(x,y,r)=>{ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();};
 const N=3+stage;
 switch(i){
 case 0:for(let k=0;k<N+2;k++){let [x,y]=point(k,N+2,radius+8,0,0,t*.35);dash([[x-2,y],[x+2,y]]);dash([[x,y-2],[x,y+2]]);}break;
 case 1:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+7,0,0);dash([[x-4,y+3],[x,y-6],[x+4,y+3]]);}break;
 case 2:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+9,0,0,t*.25);dash([[x-4,y+5],[x,y-7],[x+4,y+5]]);}break;
 case 3:for(let k=0;k<stage+2;k++)orb(radius+5+k*4,t*.18+k*.8);break;
 case 4:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+7,0,0);dash([[x-4,y-5],[x+4,y-5],[x+4,y+4],[x-4,y+4],[x-4,y-5]]);}break;
 case 5:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+6,0,0,t*.3);dot(x,y,2.1);}break;
 case 6:for(let k=0;k<stage+2;k++)orb(radius+5+k*3,t*.08+k*.64);break;
 case 7:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+6,0,0,t*.18);dash([[x-6,y+4],[x+5,y-5]]);}break;
 case 8:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+5,0,0,t*.19);dash([[x-3,y+4],[x,y-6],[x+3,y+4]]);}break;
 case 9:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+8,0,0);dash([[x-4,y+4],[x,y-5],[x+4,y+4],[x-4,y+4]]);}break;
 case 10:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+8,0,0);dot(x,y,1.5);}break;
 case 11:for(let k=0;k<N+2;k++){let [x,y]=point(k,N+2,radius+5,0,0,t*.12);dash([[x-4,y+4],[x,y-9],[x+4,y+4]]);}break;
 case 12:for(let k=0;k<N;k++)orb(radius+5+k*3,t*.2+k*.4);break;
 case 13:for(let k=0;k<N+2;k++){let [x,y]=point(k,N+2,radius+7,0,0);dash([[x-4,y+3],[x,y-6],[x+4,y+3]]);}break;
 case 14:for(let k=0;k<stage+3;k++)orb(radius+5+k*4,t*.19+k*.3);break;
 case 15:for(let k=0;k<N;k++){let [x,y]=point(k,N,radius+5,0,0);dash([[x-4,y+2],[x,y-5],[x+4,y+2]]);}break;
 }
 ctx.restore();
}
window.BVBSketch49to64=Object.freeze({count:16,tiers:3,firstId:48,lastId:63,concepts:chars,svgFor:portrait,paintCombat});
})();
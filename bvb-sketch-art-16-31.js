/* Reference sketch #2, panels 17-32: 16 different worlds of artwork, 
 * three bespoke visual evolutions per ball, mapped to internal IDs 16-31.
 * Display identities and fighting skills deliberately remain independent.
 */
(()=>{
'use strict';
const themes=Object.freeze([["Przekuwacz","forge","#ff852b","#ffe0a3","#572107"],["Komórka","cell","#3ade38","#c6ff81","#084629"],["Elektryk","lightning","#277eff","#ffe85b","#0b256c"],["Strefa","zone","#ae37fa","#f5b4ff","#36075e"],["Promień","beam","#11d3ff","#ccf9ff","#075194"],["WDC","discs","#ff3458","#ffbaad","#650e32"],["Jabłko","apple","#f22f4c","#9cff58","#760f18"],["Armata","cannon","#ff722f","#ffe07c","#612011"],["Wirus","virus","#84ed20","#d8ff62","#39104f"],["Wielki Kolec","spike","#ba49fa","#ffb2fb","#42115b"],["Łuk","bow","#53ea39","#d9ff59","#155d2f"],["Król Elektryków","crown","#228bff","#ffe66a","#123e84"],["Zasięg","radar","#209fff","#ff62ef","#1454ab"],["Mróz","frost","#45cafa","#e8ffff","#0f5c98"],["Harpun","harpoon","#27bbf9","#d2f8ff","#0c537e"],["Rój","swarm","#ffbb0a","#fff281","#563c03"]].map((t,i)=>Object.freeze({id:i+16,name:t[0],motif:t[1],main:t[2],glow:t[3],shadow:t[4]})));
const fixed=x=>Number(x).toFixed(2);
const p=(d,stroke,sw=2,fill='none',extra='')=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round" '+extra+'/>';
const c=(x,y,r,col,extra='')=>'<circle cx="'+fixed(x)+'" cy="'+fixed(y)+'" r="'+fixed(r)+'" fill="'+col+'" '+extra+'/>';
const el=(x,y,a,b,col,line='none',strokeWidth=1,extra='')=>'<ellipse cx="'+fixed(x)+'" cy="'+fixed(y)+'" rx="'+fixed(a)+'" ry="'+fixed(b)+'" fill="'+col+'" stroke="'+line+'" stroke-width="'+strokeWidth+'" '+extra+'/>';
const star=(x,y,points,large,small,col)=>{let coords=[];for(let j=0;j<points*2;j++){let a=j*Math.PI/points-Math.PI/2,r=j%2?small:large;coords.push(fixed(x+Math.cos(a)*r)+','+fixed(y+Math.sin(a)*r));}return '<polygon points="'+coords.join(' ')+'" fill="'+col+'"/>';};
const rotate=(a,x=64,y=64)=>' transform="rotate('+a+' '+x+' '+y+')"';
const leave=(x,y,a,color,scale=1)=>'<g transform="translate('+x+' '+y+') rotate('+a+') scale('+scale+')">'+p('M0 0Q-13-25 3-33Q23-10 0 0Z','#d9ffa6',1,color)+p('M0 0L3-29','#397b2f',1.5)+'</g>';
const shard=(x,y,a,size,col)=>'<g transform="translate('+x+' '+y+') rotate('+a+') scale('+size+')">'+p('M0-19L12-1L4 18L-11 11L-12-5Z','#f6fbff',1.7,col)+p('M0-19L4 18M-12-5L12-1','#ffffff',1)+'</g>';
const flame=(x,y,a,sz,color)=>'<g transform="translate('+fixed(x)+' '+fixed(y)+') rotate('+a+') scale('+sz+')">'+p('M0 16Q-16 5-5-8L-2-21Q2-10 6-19Q22 6 0 16Z','none',0,color)+'</g>';
const ghost=(x,y,s,color)=>'<g transform="translate('+fixed(x)+' '+fixed(y)+') scale('+s+')">'+p('M-11 12Q-15-15 0-19Q15-14 11 12L6 7L0 13L-6 7Z','#f9eaff',1.5,color)+c(-4,-4,2.3,'#23103a')+c(5,-4,2.3,'#23103a')+'</g>';
function symbol(tag,t){
 const glow=t===3?1.25:t===2?1:0.78;
 const k=(x,y,z,color)=>star(x,y,5,z,z*.37,color);
 let out='',col=themes[tag].glow,main=themes[tag].main;
 switch(tag){
 case 0:{ // gravity -> orbital mass -> collapse into a black hole
   out+=el(64,66,34+t*3,15+t*3,'none','#cb7aff',2.8,rotate(-25));
   if(t>=2)out+=el(64,66,40,18,'none','#e27fff',3,rotate(27));
   for(let i=0;i<3+t*2;i++){let a=i*2.399;out+=shard(fixed(64+43*Math.cos(a)),fixed(65+38*Math.sin(a)),i*42,.32+(t===3?.22:0),'#6c39bc');}
   if(t===3)out+=c(64,63,32,'#0b031a','stroke="#aa48ff" stroke-width="3"')+el(64,63,43,21,'none','#e68aff',4,rotate(-29))+k(100,18,8,'#e3abff');
   break;
 }
 case 1:{ // acoustic amplitude -> resonance -> bright sonic shock dome
   for(let i=0;i<t+2;i++){let r=26+8*i;out+=p('M'+fixed(64-r)+' 54Q'+fixed(64-r-7)+' 65 '+fixed(64-r)+' 76M'+fixed(64+r)+' 54Q'+fixed(64+r+7)+' 65 '+fixed(64+r)+' 76',col,2.3);}
   out+=k(64,27,7,'#8df1ff');
   if(t>=2)out+=p('M26 47Q64 9 101 47','none',0,'#74eaff');
   if(t===3){out+=shard(64,20,0,1.05,'#19a2ff')+shard(42,29,-25,.67,'#a7edff')+shard(84,30,28,.67,'#a1eeff');for(let i=0;i<5;i++)out+=k(20+i*21,19+i%2*5,3,'#76dafe');}
   break;
 }
 case 2:{ // energized core -> corona -> lightning inferno
   for(let i=0;i<3+t*3;i++){let a=i*2*Math.PI/(3+t*3),x=64+35*Math.cos(a),y=64+35*Math.sin(a);
     out+=p('M'+fixed(x)+' '+fixed(y)+'l-5 -9 7 1 -3 -12 14 17 -7 -2', '#fffbb3',2.1);}
   if(t>=2)out+=el(64,62,38,38,'none','#ffcf4c',3);
   if(t===3){out+=shard(64,16,0,1.25,'#ffe768');out+=shard(38,30,-25,.68,'#fff19c')+shard(92,30,25,.68,'#ffe357');}
   break;
 }
 case 3:{ // stolen souls -> spectral armor -> army of spirits
   out+=ghost(26,36,.64+(t-1)*.13,'#b861fe')+ghost(99,35,.72,'#dd9dff');
   for(let i=0;i<t+2;i++){let a=i*2*Math.PI/(t+2);out+=ghost(64+45*Math.cos(a),65+38*Math.sin(a),.35+t*.1,i%2?'#d781ff':'#9f40ed');}
   if(t>=2)out+=flame(64,22,0,.84,'#9e2bdf')+p('M42 37Q63 10 86 39','none',0,'#ad7bff');
   if(t===3)out+=p('M29 42L39 12L51 33L64 8L77 33L93 14L103 48','#f2bdff',3,'#270541');
   break;
 }
 case 4:{ // chaotic chromatic polygon shards -> dimensional rupture
   const colors=['#ff3d51','#17e5ff','#92ff4e','#ec60ff','#ffc34c'];
   for(let i=0;i<5+t*4;i++){const a=i*2.4,r=31+i%3*6;out+=shard(fixed(64+r*Math.cos(a)),fixed(64+r*Math.sin(a)),i*32,.23+(i%3)*.12,colors[i%5]);}
   if(t>=2)out+=el(64,64,43,16,'none','#f42be5',3,rotate(36));
   if(t===3)out+=flame(39,26,0,1.03,'#e537e9')+flame(92,23,0,1.06,'#ff8b34')+
      el(64,59,41,41,'none','#4dffff',3);
   break;
 }
 case 5:{ // order: clean white compass -> sacred mandala -> pure geometry
   for(let i=0;i<4+t*2;i++){const a=i*Math.PI*2/(4+t*2);out+=shard(fixed(64+42*Math.cos(a)),fixed(64+42*Math.sin(a)),i*360/(4+t*2),.3+t*.11,'#b9efff');}
   out+=el(64,64,33+t*3,33+t*3,'none','#e0f8ff',2.3);
   out+=star(64,64,8,39,18,'#b6e6ff')+star(64,64,8,31,21,'#3979bc');
   if(t>=2)out+=el(64,64,47,47,'none','#e1ffff',2);
   if(t===3)out+=k(64,10,9,'#ffffff')+shard(64,24,0,1.05,'#d6f9ff');
   break;
 }
 case 6:{ // dreams -> sleepy stars -> cloudscape and crescent
   for(let i=0;i<t*3+2;i++){let x=17+i*21%91,y=15+i*13%43;out+=star(x,y,i%2?4:5,3+t*.8,1.4,'#ffedff');}
   out+=p('M28 92Q18 76 40 69Q44 53 58 65Q74 52 82 69Q102 62 107 82Q117 101 89 102L38 103Z','#fff1ff',2,'#f6a3ed');
   if(t>=2)out+=c(96,23,12,'#ffeed6')+c(101,18,12,'#7d297a')+ghost(32,38,.48,'#fff4ff');
   if(t===3)out+=c(37,56,11,'#ed93ef')+c(92,56,10,'#f7bbfa')+k(68,15,10,'#fff5fd');
   break;
 }
 case 7:{ // nightmares: sinister mask -> dark horns -> monstrous crown
   for(let i=0;i<4+t*2;i++){let a=i*2*Math.PI/(4+t*2);out+=flame(64+39*Math.cos(a),64+37*Math.sin(a),i*33,.45+t*.1,i%3?'#df0a27':'#ff6d43');}
   out+=p('M38 43L26 17L44 31L55 21L64 34L75 16L87 32L105 16L95 49','none',3,'#370309');
   if(t>=2)out+=p('M32 46Q12 5 42 17L51 42M96 46Q116 7 85 15L76 42','#f63849',4,'#3b0308');
   if(t===3)out+=p('M27 49L29 11L46 32L62 4L80 33L100 9L100 52','#fc563a',4,'#20060c')+star(65,15,7,8,2,'#fb4b4e');
   break;
 }
 case 8:{ // illusion -> multiple false copies -> reflecting pink crystals
   for(let i=0;i<t+1;i++){let a=i*Math.PI*2/(t+1);out+=c(64+35*Math.cos(a),64+35*Math.sin(a),7+t*1.6,i%2?'#f2b4ff':'#dc86fb','stroke="#fff8ff" stroke-width="1.1"');}
   if(t>=2){out+=shard(38,30,-14,.7,'#e481ff')+shard(92,33,25,.76,'#c794ff')+el(64,63,44,28,'none','#ef8fff',3,rotate(-34));}
   if(t===3){out+=shard(28,52,-20,1.05,'#ee9fff')+shard(104,46,18,1.07,'#d97fff')+shard(65,17,0,1.18,'#b39fff');}
   break;
 }
 case 9:{ // mirror: steel orb -> polished facets -> cathedral of reflection
   out+=shard(64,24,0,.75,'#b6f4ff')+el(64,64,37,37,'none','#dceeff',2.5);
   if(t>=2){out+=shard(34,50,-23,.92,'#aedfff')+shard(94,47,19,.87,'#dbf3ff');
    out+=p('M35 36L58 15L81 34L92 73L65 109L36 77Z','#e3f8ff',2,'none');}
   if(t===3){out+=p('M28 36L44 11L62 21L82 8L104 39L96 93L64 115L26 88Z','#f6ffff',3,'#a4d9fc')+shard(64,17,0,1.1,'#ffffff');}
   break;
 }
 case 10:{ // morph: amber pure form -> many copied avatars -> spectrum flames
   out+=el(64,66,33,33,'none','#ffe1ab',2.5);
   if(t>=2){for(let i=0;i<4;i++){const a=i*Math.PI/2;out+=c(64+44*Math.cos(a),62+40*Math.sin(a),8,['#f1504c','#53c9ff','#68ed79','#ffef65'][i]);}}
   if(t===3)for(let i=0;i<7;i++){let a=i*Math.PI*2/7;out+=flame(64+37*Math.cos(a),62+37*Math.sin(a),i*51,.48,['#f84023','#ffd443','#2dc9ff','#48df78','#e3a1ff'][i%5]);}
   break;
 }
 case 11:{ // camouflage: leaf veil -> bushes -> ivy-covered fortress
   for(let i=0;i<3+t*3;i++){let a=i*2*Math.PI/(3+t*3),rr=33+4*(i%2);out+=leave(fixed(64+rr*Math.sin(a)),fixed(64+rr*Math.cos(a)),i*30,.6+(t===3?.3:0),i%2?'#a0fb5b':'#368e2a');}
   if(t>=2)out+=p('M30 89Q18 45 42 33L53 15M95 94Q103 42 87 22','#a2f873',4);
   if(t===3){out+=shard(64,22,0,1.3,'#616961')+shard(34,45,-20,.72,'#868d86')+shard(96,41,24,.75,'#808a7d');}
   break;
 }
 case 12:{ // life: green leaves -> flowers -> blessing bloom
   for(let i=0;i<4+t*3;i++){let a=i*2*Math.PI/(4+t*3),rr=34+(i%2)*4;out+=leave(fixed(64+rr*Math.sin(a)),fixed(64+rr*Math.cos(a)),i*30,.54+t*.12,i%2?'#c1ff83':'#5acb34');}
   if(t>=2)for(let i=0;i<5;i++){let a=i*2*Math.PI/5;let x=64+39*Math.cos(a),y=64+35*Math.sin(a);out+=star(x,y,5,5.2,3.2,'#fffaf5')+c(x,y,1.8,'#f6ce4e');}
   if(t===3)out+=leave(64,22,-15,1.22,'#b1f768')+leave(32,37,-50,.95,'#7ef44c')+leave(95,34,38,.96,'#d6ffa3');
   break;
 }
 case 13:{ // death: purple ghosts -> chained soul -> grim reaper and scythe
   for(let i=0;i<3+t*2;i++){const a=i*2*Math.PI/(3+t*2);out+=flame(64+37*Math.cos(a),64+37*Math.sin(a),i*28,.36+t*.12,'#a03cff');}
   if(t>=2)out+=p('M33 31Q61 15 91 32M28 93Q64 112 102 93','#b86aff',3.5);
   if(t===3){out+=p('M31 98L101 21','#e2ddf8',6)+p('M93 28Q101 2 120 24Q108 40 92 40','#e5ebff',3,'#c5bfcd')+
      star(64,13,7,12,5,'#b65cff');}
   break;
 }
 case 14:{ // balance: pastel halves -> equinox scales -> halo with dual orbits
   out+=el(64,64,37,37,'none','#d2fbff',2.3);
   out+=p('M64 30V96','#ffffff',2);
   if(t>=2)for(let i=0;i<3;i++)out+=el(64,64,40+i*3,14+i*3,'none',i%2?'#ffa8ff':'#96eaff',2,rotate(28+i*60));
   if(t===3){out+=star(64,15,8,13,6,'#f4e9ff')+shard(35,36,-28,.48,'#8ae9ff')+shard(95,38,27,.48,'#e59fff');}
   break;
 }
 case 15:{ // rage: red-hot core -> serrated crown -> unstoppable fire beast
   for(let i=0;i<3+t*3;i++){let a=i*2*Math.PI/(3+t*3);out+=flame(64+38*Math.cos(a),64+38*Math.sin(a),i*39,.45+t*.12,i%2?'#ff4a13':'#ffb520');}
   if(t>=2)out+=p('M25 43L38 22L52 37L64 17L76 36L91 15L105 45','#ff542e',3.8,'#451012');
   if(t===3){out+=p('M27 42L38 9L53 31L64 2L80 33L98 8L106 50','#ffc039',5,'#480806')+flame(64,19,0,1.2,'#ffe046');}
   break;
 }
 }
 return out;
}
function eyes(tag,t){
 const brow='#0b1733';
 // V3 must retain clearly visible eyes, even with the maximum aura.
 if(tag===5&&t===3)return '<g class="sketch-eyes">'+p('M44 71L60 65M68 65L84 71',brow,5)+p('M44 72L55 82M84 72L73 82','#ffffff',3)+'</g>';
 let out='<g class="sketch-eyes">';
 for(const side of [-1,1]){
  const x=64+side*12,y=74,slant=side===-1?-3:3;
  out+=p('M'+(x-10)+' '+(y-11+slant)+'L'+(x+9)+' '+(y-6-slant),brow,4);
  out+=p('M'+(x-9)+' '+(y-6)+'Q'+x+' '+(y-12)+' '+(x+10)+' '+(y-5)+'L'+(x+5)+' '+(y+7)+'Q'+x+' '+(y+9)+' '+(x-8)+' '+(y+2)+'Z',brow,1.4,'#f8fcff');
  out+=el(x+side*(tag%3),y+1,3.1,3.9,brow)+c(x+side*(tag%3)-1,y-1,1.1,'#ffffff');
 }
 return out+'</g>';
}

function identitySymbol(tag,t,classic){
 const v=themes[tag],col=v.glow,main=v.main;
 const line=(d,w=3,color=col)=>p(d,color,w);
 const shape=(d,fill=main,stroke=col,width=2)=>p(d,stroke,width,fill);
 const dot=(x,y,r,color=col)=>c(x,y,r,color);
 const tip=(x,y,rot,scale=1,color=main)=>'<g transform="translate('+x+' '+y+') rotate('+rot+') scale('+scale+')">'+shape('M0-19L12-2L2 19L-11 6Z',color,'#fbf9ff',1.5)+'</g>';
 const ring=(rx,ry,angle=0,color=col)=>el(64,66,rx,ry,'none',color,2.5,rotate(angle));
 const count=t===1?2:t===2?4:6;
 let s='';
 switch(tag){
 case 0: // glowing forged armor, anvil and progressively larger hammers
   s+=shape('M44 32L48 22H72L77 33L70 40H48Z','#7d8793','#f8dac4',2);
   s+=shape('M80 31L104 31L107 42L95 46L95 52L87 52L87 45L80 43Z','#a9afb5','#f1e0c7',2);
   s+=line('M98 44L111 61',4,'#a1a8b0')+line('M97 51L85 62',3,'#ffb74e');
   if(t>=2)s+=shape('M19 24L35 13L41 25L34 35L21 39Z','#bcc4d5','#fef1d8',2)+line('M26 37L15 56',4,'#b3a9a0');
   if(t===3)s+=shape('M47 13L59 8L68 13L66 27L50 28Z','#bfc6d2','#ffdc96',2)+shape('M38 103L42 92H84L88 103L78 110H46Z','#777e90','#ffe18f',2);
   for(let j=0;j<count;j++)s+=flame(22+j*17,102-j%2*4,j*23,.36+j*.035,'#ff952d');
   break;
 case 1: // cell budding, membrane and a mitosis cloud
   for(let i=0;i<count+1;i++){let a=2.39*i,r=37+(i%2)*9,x=64+Math.cos(a)*r,y=65+Math.sin(a)*r;s+=dot(x.toFixed(1),y.toFixed(1),2.5+i%3,'#95ff57');s+=c((x-1.2).toFixed(1),(y-1.2).toFixed(1),1,'#eaffde');}
   if(t>=2)s+=el(44,45,13,9,'#4df065','#c0ff7a',1.5)+el(91,43,10,11,'#45ef61','#c0ff7a',1.5);
   if(t===3)s+=el(64,16,12,10,'#56e844','#dfff93',2)+el(102,87,12,10,'#54db51','#dfff93',2);
   break;
 case 2: // bolts -> arcs -> cyclone
   for(let j=0;j<3+t*3;j++){const a=(j/(3+t*3))*Math.PI*2,r=38+t*2,x=64+r*Math.cos(a),y=65+r*Math.sin(a);s+=line('M'+x.toFixed(1)+' '+y.toFixed(1)+'l-4 -12 9 3 -1 -10 11 16',2+(t===3),j%2?'#ffe96d':'#a9f0ff');}
   if(t>=2)s+=ring(47,24,27,'#ffe85b');
   if(t===3)s+=tip(66,12,0,1,'#ffe866')+tip(106,30,25,.7,'#fff4af');
   break;
 case 3: // purple time/space zone as concentric orbit rings
   for(let j=0;j<t+1;j++)s+=ring(34+j*7,13+j*6,j*31,'#e877ff');
   for(let j=0;j<count;j++){const a=j*2.4;s+=star(64+47*Math.cos(a),65+40*Math.sin(a),5,4+j%3,1.8,'#ef9bff');}
   if(t===3)s+=ring(55,48,0,'#ffb4ff');
   break;
 case 4: // energy emitter and beam
   s+=shape('M80 46L111 35L115 44L112 59L82 69Z','#3086c7','#b7f4ff',2)+el(105,48,11,15,'#0652a1','#cefcff',3);
   s+=line('M111 46L127 41',t+1,'#b3ffff');
   if(t>=2)s+=el(105,48,15,20,'none','#71dcff',3)+line('M114 39L127 29',4,'#7af5ff');
   if(t===3)s+=el(105,48,20,25,'none','#e9ffff',3)+ring(44,17,-23,'#5bddff');
   break;
 case 5: // three red steel spinning discs
   for(let i=0;i<1+t;i++){const a=(i*2.45+t*.3),x=64+Math.cos(a)*37,y=65+Math.sin(a)*32;s+='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+(i*32+t*20)+')">'+star(0,0,8,15+t*2,7,'#c0cad2')+dot(0,0,6,'#fd3459')+dot(0,0,3,'#5a6573')+'</g>';}
   if(t===3)s+=ring(49,38,25,'#ff6279');
   break;
 case 6: // organic red apple with leaf and stem
   s+=shape('M59 40Q49 15 58 14L66 37','#69451b','#a7ff3a',3);
   s+=shape('M61 28Q81 5 91 21Q79 42 61 28Z','#5de636','#d1ff87',2);
   if(t>=2)s+=shape('M26 40Q16 25 25 17Q38 14 49 33','#57d431','#cfff75',2)+dot(106,31,6,'#fa2a36');
   if(t===3)for(let i=0;i<5;i++)s+=shape('M'+(19+i*22)+' '+(100-i%2*6)+'q9 -10 16 0q-8 14 -16 0','#81e927','#d4ff76',1);
   break;
 case 7: // giant orange artillery cannon
   s+=shape('M78 38L104 23L118 29L116 58L91 70L77 55Z','#6f7485','#ffdd91',2)+el(109,41,13,16,'#121828','#dae7f0',4);
   if(t>=2)s+=shape('M93 22L100 13L122 18L126 27L118 34Z','#888f9f','#ffe19a',2)+ring(40,21,-35,'#ffad4a');
   if(t===3)s+=flame(122,38,90,.9,'#ffd66f')+shape('M36 95L83 95L76 108H44Z','#727984','#ffad4a',2);
   break;
 case 8: // viral spikes and green pathogens
   for(let j=0;j<5+t*3;j++){const a=j*Math.PI*2/(5+t*3),x=64+Math.cos(a)*35,y=65+Math.sin(a)*35;s+=tip(x.toFixed(1),y.toFixed(1),a*180/Math.PI+90,.42+(t-1)*.16,j%2?'#76e51e':'#bb53f0');}
   for(let j=0;j<count;j++){const a=j*2.399;s+=dot(64+Math.cos(a)*49,65+Math.sin(a)*47,3.6,'#9dff2f');}
   break;
 case 9: // wall thorn super spikes
   for(let j=0;j<4+t*2;j++){const a=j*Math.PI*2/(4+t*2);s+=tip((64+34*Math.cos(a)).toFixed(1),(65+34*Math.sin(a)).toFixed(1),a*180/Math.PI+90,.65+(t-1)*.18,'#7c44bc');}
   if(t>=2)s+=tip(64,17,0,1,'#db70ff');
   break;
 case 10: // wooden bow and growing spread of arrows
   s+=line('M103 21Q59 53 105 101',4,'#d9a044')+line('M104 20L103 101',1.7,'#d8ff9f');
   for(let j=0;j<t;j++){const y=44+j*12;s+=line('M75 '+y+'L117 '+y,3,'#bffcc6')+shape('M117 '+y+'l-11 -6v12Z','#e9fcff','#65bd64',1);}
   if(t===3)s+=shape('M81 20Q91 5 101 19','#56d346','#e7ff91',2);
   break;
 case 11: // three electric crown tiers
   s+=shape('M38 39L36 23L48 30L63 15L77 30L92 21L89 40Z','#ffbb35','#ffe68e',2);
   if(t>=2)s+=shape('M40 16L48 7L56 18L66 7L75 17L86 9L91 25Z','#ffd54a','#fff3b0',2);
   if(t===3)s+=ring(48,31,7,'#ffe966')+dot(64,8,5,'#fffa8a');
   for(let j=0;j<t*3;j++){const a=j*Math.PI*2/(t*3);s+=line('M'+(64+47*Math.cos(a)).toFixed(1)+' '+(65+47*Math.sin(a)).toFixed(1)+'l-4 -11 8 3',2,'#9aedff');}
   break;
 case 12: // circular target/range rings
   for(let j=0;j<t+2;j++)s+=ring(33+j*6,30+j*6,j*16,j%2?'#fd67f4':'#6ae4ff');
   s+=line('M93 23V44M83 34H103',2,'#e1fcff');
   if(t===3)s+=ring(54,54,0,'#f6b6ff');
   break;
 case 13: // tiered frost crystals
   for(let j=0;j<2+t*2;j++){let a=j*Math.PI*2/(2+t*2);s+=tip((64+34*Math.cos(a)).toFixed(1),(65+35*Math.sin(a)).toFixed(1),a*180/Math.PI+90,.43+(t-1)*.21,'#a3eaff');}
   if(t>=2)s+=tip(64,20,0,1.3,'#c8fcff');
   if(t===3)s+=tip(43,25,-25,.9,'#d2f9ff')+tip(88,26,24,.9,'#b9ffff');
   break;
 case 14: // harpoon + tether
   s+=line('M79 41L119 21',5,'#5e7c9d')+shape('M119 21L110 20L116 11L127 14L123 28Z','#d8f6ff','#2a577a',2);
   s+=line('M94 34Q69 21 53 39',2,'#d5dce7');
   if(t>=2)s+=line('M73 52L115 59',5,'#7083a3')+shape('M115 59L107 50L122 51L127 61L111 66Z','#e0f5ff','#3986ba',2);
   if(t===3)s+=ring(53,33,-18,'#9edbfa');
   break;
 case 15: // increasingly dense guard bees
   for(let j=0;j<3+t*2;j++){const a=j*Math.PI*2/(3+t*2)+.31,x=64+46*Math.cos(a),y=65+41*Math.sin(a);s+='<g transform="translate('+x.toFixed(2)+' '+y.toFixed(2)+')">'+el(-4,-4,5,3,'#dbfbff','#71ccff',1)+el(4,-4,5,3,'#dbfbff','#71ccff',1)+el(0,0,5+t*.4,5,'#ffb81c','#7c4b08',1)+line('M-3 0H3',1.5,'#31323f')+'</g>';}
   if(t===3)s+=ring(54,45,0,'#ffe365');
   break;
 }
 if(classic)return s.replace(/opacity="\.29"/g,'opacity=".13"');
 return s;
}

/* Per-ball, per-evolution ability choreography: movement reflects the actual
 * skill, not a single generic rotation. All animation stays visual-only.
 * Inline SVGs use unique keyframe names to avoid CSS collisions in inventory.
 */
const motionType=Object.freeze(['hammer-strike','mitosis','chain-bolt','gravity-field',
 'beam-recoil','saw-spin','apple-grow','cannon-kick','virus-mutate','thorn-extend',
 'bow-release','electric-crown','range-scan','frost-crystal','harpoon-thrust','bee-flight']);
function actionMotion(tag,t,key){
 const pow=1+(t-1)*.5;
 const p2=n=>(n*pow).toFixed(2);
 const frames=[
  [['0%','translate(0px,0px) rotate(-4deg)'],['45%','translate(2px,-4px) rotate(-16deg)'],['62%','translate('+p2(4)+'px,'+p2(3)+'px) rotate(13deg)'],['100%','translate(0px,0px) rotate(-4deg)']],
  [['0%','scale(.94) translate(-1px,0px)'],['35%','scale(1.04) translate('+p2(2)+'px,-2px)'],['70%','scale(1.11) translate(-'+p2(2)+'px,1px)'],['100%','scale(.94) translate(-1px,0px)']],
  [['0%','translate(-2px,0px) skewX(-3deg)'],['27%','translate('+p2(3)+'px,-2px) skewX(9deg)'],['51%','translate(-'+p2(4)+'px,1px) skewX(-10deg)'],['100%','translate(-2px,0px) skewX(-3deg)']],
  [['0%','rotate(-13deg) scale(.94)'],['40%','rotate(7deg) scale(1.05)'],['78%','rotate(22deg) scale(1.09)'],['100%','rotate(-13deg) scale(.94)']],
  [['0%','translate(0px,0px) scale(1)'],['28%','translate(-'+p2(5)+'px,0px) scale(.94)'],['46%','translate('+p2(3)+'px,0px) scale(1.05)'],['100%','translate(0px,0px) scale(1)']],
  [['0%','rotate(0deg)'],['50%','rotate(180deg)'],['100%','rotate(360deg)']],
  [['0%','translate(0px,2px) rotate(-3deg) scale(.97)'],['45%','translate(0px,-'+p2(3)+'px) rotate(3deg) scale(1.03)'],['100%','translate(0px,2px) rotate(-3deg) scale(.97)']],
  [['0%','translate(0px,0px) rotate(0deg)'],['16%','translate(-'+p2(6)+'px,'+p2(2)+'px) rotate(-5deg)'],['36%','translate('+p2(2)+'px,-1px) rotate(2deg)'],['100%','translate(0px,0px) rotate(0deg)']],
  [['0%','rotate(-6deg) scale(.94)'],['45%','rotate(10deg) scale(1.1)'],['67%','rotate(-4deg) scale(1.04)'],['100%','rotate(-6deg) scale(.94)']],
  [['0%','scale(.9)'],['38%','scale(1.14)'],['75%','scale(1.07)'],['100%','scale(.9)']],
  [['0%','translate(-2px,0px) rotate(-8deg)'],['42%','translate('+p2(4)+'px,-1px) rotate(12deg)'],['57%','translate(-'+p2(3)+'px,0px) rotate(-5deg)'],['100%','translate(-2px,0px) rotate(-8deg)']],
  [['0%','rotate(-8deg) translate(0px,2px)'],['45%','rotate(8deg) translate(0px,-'+p2(3)+'px)'],['74%','rotate(-3deg) translate(0px,0px)'],['100%','rotate(-8deg) translate(0px,2px)']],
  [['0%','rotate(-28deg) scale(.94)'],['50%','rotate(5deg) scale(1.1)'],['100%','rotate(32deg) scale(.96)']],
  [['0%','rotate(-3deg) scale(.97)'],['33%','rotate(8deg) scale(1.07)'],['70%','rotate(-9deg) scale(1.12)'],['100%','rotate(-3deg) scale(.97)']],
  [['0%','translate(-'+p2(4)+'px,0px) rotate(-9deg)'],['36%','translate('+p2(7)+'px,-1px) rotate(10deg)'],['63%','translate(0px,1px) rotate(-4deg)'],['100%','translate(-'+p2(4)+'px,0px) rotate(-9deg)']],
  [['0%','translate(-3px,-2px) rotate(-8deg)'],['25%','translate('+p2(5)+'px,-'+p2(4)+'px) rotate(12deg)'],['57%','translate(-'+p2(4)+'px,'+p2(3)+'px) rotate(-14deg)'],['100%','translate(-3px,-2px) rotate(-8deg)']]
 ];
 const source=frames[tag],kf='bvbSkill'+key.replace(/[^a-zA-Z0-9]/g,'');
 const css='@keyframes '+kf+'{'+source.map(([pct,x])=>pct+'{transform:'+x+'}').join('')+'}';
 const duration=(3.3-(t-1)*.35+(tag%5)*.13).toFixed(2);
 return {type:motionType[tag],style:'.sketch-symbol{transform-origin:64px 65px;animation:'+kf+' '+duration+'s ease-in-out infinite}'+css};
}
function abilityParticles(tag,t,key){
 const v=themes[tag],f=v.glow,a=[];
 const count=2+t*2;
 for(let j=0;j<count;j++){
  const ang=j*Math.PI*2/count,rad=37+t*3+(j%2)*5,x=64+rad*Math.cos(ang),y=65+rad*Math.sin(ang);
  const xx=x.toFixed(2),yy=y.toFixed(2);
  if(tag===0||tag===7)a.push(star(x,y,5,2+j%2,1,'#ffd275'));
  else if(tag===1)a.push(c(xx,yy,2+(j%3),'#adff7b'));
  else if(tag===2||tag===11)a.push(p('M'+xx+' '+yy+'l-3 -6 5 1 -2 -5 7 8','#f6e98b',1.4));
  else if(tag===3||tag===12)a.push(el(xx,yy,3+j%2,1.5,'none',f,1.2));
  else if(tag===4||tag===14)a.push(p('M'+xx+' '+yy+'l8 -2',f,2));
  else if(tag===5)a.push(star(x,y,6,4,1.8,'#ccd4ed'));
  else if(tag===6)a.push(leave(xx,yy,j*31,'#63c92e',.18));
  else if(tag===8)a.push(c(xx,yy,1.7+j%2,'#a2ff28'));
  else if(tag===9||tag===13)a.push(star(x,y,5,3+t*.3,1.1,f));
  else if(tag===10)a.push(p('M'+xx+' '+yy+'l9 -3m-3 -4l4 4 -4 4',f,1.3));
  else if(tag===15)a.push(el(xx,yy,3,2,'#ffc42f','#fff5a6',1));
 }
 const kf='bvbFx'+key.replace(/[^a-zA-Z0-9]/g,'');
 const css='@keyframes '+kf+'{0%,100%{opacity:.3;transform:scale(.9) rotate(-5deg)}45%{opacity:1;transform:scale(1.08) rotate(6deg)}75%{opacity:.7;transform:scale(1) rotate(2deg)}}';
 return {markup:'<g class="sketch-ability-fx" data-effect="'+motionType[tag]+'">'+a.join('')+'</g>',style:'.sketch-ability-fx{transform-origin:64px 65px;animation:'+kf+' '+(2.6-(t-1)*.24+(tag%3)*.15).toFixed(2)+'s ease-in-out infinite}'+css};
}

function portrait(id,tier,style='detailed'){
 if(!Number.isInteger(Number(id))||id<16||id>31)return '';
 id=Number(id);const tag=id-16,v=themes[tag];
 const t=Math.max(1,Math.min(3,Math.round(Number(tier)||1)));
 const classic=style==='classic',key='second16-'+id+'-'+t+'-'+(classic?'c':'d'),g='paint-'+key,b='glow-'+key;
 const movement=actionMotion(tag,t,key),particles=abilityParticles(tag,t,key);
 let out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-art-approved-series="17-32" data-reference-panel="'+(id+1)+'" data-ball-id="'+id+'" data-evolution="'+t+'" data-visual-style="'+(classic?'classic':'detailed')+'" data-motif="'+v.motif+'" data-ability-motion="'+movement.type+'" aria-label="'+v.name+' V'+t+' '+(classic?'Klasyczny':'Szczegółowy')+'">';
 out+='<defs><radialGradient id="'+g+'" cx="25%" cy="18%" r="86%"><stop stop-color="'+(classic?'#485360':v.glow)+'"/><stop offset=".40" stop-color="'+(classic?'#242c3b':v.main)+'"/><stop offset=".83" stop-color="'+(classic?'#111522':v.main)+'"/><stop offset="1" stop-color="'+v.shadow+'"/></radialGradient><filter id="'+b+'" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="'+(classic?2:3+t)+'"/></filter></defs>';
 out+='<style>.sketch-aura{transform-origin:64px 64px;animation:sketchHalo '+(5+tag%5*.55)+'s linear infinite}.sketch-heart{transform-origin:64px 65px;animation:sketchBeat '+(2.3+tag%4*.22)+'s ease-in-out infinite alternate}.sketch-eyes{animation:sketchGaze 4.7s ease-in-out infinite}'+movement.style+particles.style+'@keyframes sketchHalo{to{transform:rotate(360deg)}}@keyframes sketchBeat{to{transform:scale(1.047)}}@keyframes sketchGaze{0%,35%,60%,100%{transform:translateX(0)}45%,51%{transform:translateX(2px)}}@keyframes sketchSway{to{transform:rotate(4deg)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
 out+='<g class="sketch-aura">'+el(64,65,38+t*3,19+t*2,'none',v.glow,(classic?1.3:2.4),rotate(tag*19))+'</g>';
 if(t>=2)out+='<g class="sketch-aura">'+el(64,65,44+t*2,25+t*3,'none',v.main,(classic?1.5:2.5),rotate(28+tag*13))+'</g>';
 if(t===3)out+=star(105,13,7,8,3,v.glow)+star(20,25,5,5,2,v.glow);
 out+=c(64,65,38+(t-1)*1.4,v.main,'opacity="'+(classic?'.12':'.24')+'" filter="url(#'+b+')"');
 out+='<g class="sketch-heart">'+c(64,65,30+(t-1)*1.3,'url(#'+g+')','stroke="'+v.glow+'" stroke-width="'+(classic?2.1:2.9)+'"')+el(54,49,13,5,'#ffffff','none',1,'opacity="'+(classic?'.12':'.33')+'" transform="rotate(-26 54 49)"')+'</g>';
 out+='<g class="sketch-symbol">'+identitySymbol(tag,t,classic)+'</g>';
 out+=particles.markup;
 if(classic){out+='<g class="sketch-eyes">'+p('M44 68L57 73L54 82L42 75Z',v.glow,1.5,v.glow)+p('M84 68L71 73L74 82L86 75Z',v.glow,1.5,v.glow)+p('M43 67L57 71M85 67L71 71','#090d18',2.3)+'</g>';}
 else out+=eyes(tag,t);
 if(t===3)out+='<g class="sketch-sparks">'+star(14,105,6,6,2,v.glow)+star(109,102,5,6,2,v.glow)+'</g>';
 return out+'</svg>';
}
function renderCombat(ctx,actor,g){
 const id=actor?.b?.id;if(id<16||id>31||!ctx)return;
 const opt=window.BVBMotion?.prefs?.()||{};
 if(opt.artQuality==='low'||opt.artIntensity===0||window.BVBMotion?.enabled?.('fight')===false)return;
 const t=(g?.rt||0),stage=Math.max(1,Math.min(3,actor.tier||1)),r=Math.max(9,actor.r||17),
  v=themes[id-16],a=t*(.9+(id%7)*.1),strength=Number.isFinite(opt.artIntensity)?opt.artIntensity/100:1;
 ctx.save();ctx.translate(actor.x,actor.y);ctx.strokeStyle=v.glow;ctx.fillStyle=v.main;
 ctx.globalAlpha=strength*.65;ctx.lineWidth=1+stage*.4;ctx.shadowColor=v.main;ctx.shadowBlur=opt.artQuality==='ultra'?11:4;
 const line=(coords)=>{ctx.beginPath();coords.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const orbit=(radius,rx=1,offset=0)=>{ctx.beginPath();ctx.ellipse(0,0,radius,radius*rx,offset,0,Math.PI*2);ctx.stroke();};
 const dot=(x,y,rr)=>{ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.fill();};
 const N=2+stage;
 switch(id){
 case 16:ctx.rotate(a*.25);orbit(r+6,.48,-.5);orbit(r+10,.32,.8);break;
 case 17:for(let i=0;i<N;i++){const pulse=2.8*Math.sin(a*1.1-i*.9);orbit(r+4+i*5+pulse,1,Math.sin(a*.35+i)*.08);}break;
 case 18:for(let i=0;i<N+2;i++){let p=i*6.28/(N+2)+a*.2;line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.2)*(r+9),Math.sin(p+.2)*(r+9)],[Math.cos(p+.1)*(r+12),Math.sin(p+.1)*(r+12)]]);}break;
 case 19:for(let i=0;i<N;i++){let p=a*.7+i*6.28/N;dot(Math.cos(p)*(r+10),Math.sin(p)*(r+5),2.5);}break;
 case 20:for(let i=0;i<N*2;i++){let p=i*6.28/(N*2)+a*.26,x=Math.cos(p)*(r+7),y=Math.sin(p)*(r+7);line([[x-3,y+3],[x,y-5],[x+3,y+3]]);}break;
 case 21:for(let i=0;i<8;i++){let p=i*.785+a*.28;line([[Math.cos(p)*(r+2),Math.sin(p)*(r+2)],[Math.cos(p)*(r+8),Math.sin(p)*(r+8)]]);}break;
 case 22:for(let i=0;i<N;i++){let p=a*.2+i*2.09;dot(Math.cos(p)*(r+8),Math.sin(p)*(r+6),3);}break;
 case 23:for(let i=0;i<N+2;i++){const p=i*6.28/(N+2),recoil=4*Math.max(0,Math.sin(a*2-i*.37));line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.1)*(r+9+recoil),Math.sin(p+.1)*(r+10+recoil)]]);}break;
 case 24:for(let i=0;i<N;i++){let p=a*.5+i*2.1;orbit(r+5+i*2,.3,p);}break;
 case 25:for(let i=0;i<N+2;i++){const p=i*6.28/(N+2),extension=4+3*Math.sin(a*1.4+i*.85);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p)*(r+7+extension),Math.sin(p)*(r+7+extension)]]);}break;
 case 26:for(let i=0;i<N;i++){let p=a+i*2.09;dot(Math.cos(p)*(r+8),Math.sin(p)*(r+8),3);}break;
 case 27:for(let i=0;i<N;i++){let p=i*2.09+a*.1,x=Math.cos(p)*r,y=Math.sin(p)*r;line([[x-4,y+3],[x+5,y-5],[x+3,y-8]]);}break;
 case 28:for(let i=0;i<N+2;i++){let p=i*6.28/(N+2)+a*.12;dot(Math.cos(p)*(r+7),Math.sin(p)*(r+7),2.2);}break;
 case 29:for(let i=0;i<N+3;i++){const p=i*6.28/(N+3),frost=3*Math.sin(a*.9+i*.6);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.2)*(r+12+frost),Math.sin(p+.2)*(r+11+frost)]]);}break;
 case 30:ctx.rotate(a*.12);orbit(r+9,.37,.6);orbit(r+9,.37,-.6);break;
 case 31:for(let i=0;i<N+4;i++){const p=i*6.28/(N+4)+a*.24,wobble=Math.sin(a*1.2+i)*3;line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.08)*(r+6+wobble),Math.sin(p+.08)*(r+15+wobble)]]);}break;
 }
 ctx.restore();
}
window.BVBSketch17to32={count:16,tiers:3,firstId:16,lastId:31,concepts:themes,svgFor:portrait,renderCombat};
})();
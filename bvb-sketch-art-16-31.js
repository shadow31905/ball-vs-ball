/* Reference sketch #2, panels 17-32: 16 different worlds of artwork, 
 * three bespoke visual evolutions per ball, mapped to internal IDs 16-31.
 * Display identities and fighting skills deliberately remain independent.
 */
(()=>{
'use strict';
const themes=Object.freeze([
 ['Grawitacja','gravity','#7831c5','#e9a1ff','#150529'],
 ['Dźwięk','sound','#0789ed','#bcf7ff','#061a6e'],
 ['Energia','energy','#fbbd25','#fff6b3','#713208'],
 ['Dusza','soul','#811ef3','#e3afff','#1c063a'],
 ['Chaos','chaos','#ff3079','#5dffea','#1e073c'],
 ['Porządek','order','#89dbff','#ffffff','#133a86'],
 ['Sen','dream','#f898e9','#fff2ff','#6d206b'],
 ['Koszmar','nightmare','#dc1727','#ffab60','#20050a'],
 ['Iluzja','illusion','#f674f5','#d2f7ff','#441063'],
 ['Odbicie','mirror','#78bdff','#ffffff','#233e85'],
 ['Przemiana','morph','#ffd65e','#d9eaff','#511b64'],
 ['Kamuflaż','camo','#5acb4c','#d3ff92','#204b29'],
 ['Życie','life','#87eb4d','#edff9f','#175f1f'],
 ['Śmierć','death','#5e21b5','#cb97ff','#0a041c'],
 ['Równowaga','balance','#3cc9ff','#ffa6fc','#121f80'],
 ['Furia','fury','#f83213','#ffe16d','#420707']
].map((t,i)=>Object.freeze({id:i+16,name:t[0],motif:t[1],main:t[2],glow:t[3],shadow:t[4]})));
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
 if(tag===0&&t===3)return '';
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
function portrait(id,tier){
 if(!Number.isInteger(Number(id))||id<16||id>31)return '';
 id=Number(id);const tag=id-16;
 const t=Math.max(1,Math.min(3,Math.round(Number(tier)||1))),v=themes[tag],key='concept-'+id+'-'+t,g='paint-'+key,b='glow-'+key;
 let out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-reference-panel="'+(id+1)+'" data-ball-id="'+id+'" data-evolution="'+t+'" data-motif="'+v.motif+'" aria-label="'+v.name+' V'+t+'">';
 out+='<defs><radialGradient id="'+g+'" cx="27%" cy="19%" r="89%"><stop stop-color="'+v.glow+'"/><stop offset=".37" stop-color="'+v.main+'"/><stop offset=".82" stop-color="'+v.main+'"/><stop offset="1" stop-color="'+v.shadow+'"/></radialGradient><filter id="'+b+'" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="'+(2+t)+'"/></filter></defs>';
 out+='<style>.sketch-aura{transform-origin:64px 64px;animation:sketchHalo '+(6+(tag%6)*.6)+'s linear infinite}.sketch-heart{transform-origin:64px 64px;animation:sketchBeat '+(2.1+tag%4*.25)+'s ease-in-out infinite alternate}.sketch-eyes{animation:sketchGaze 4.9s ease-in-out infinite}@keyframes sketchHalo{to{transform:rotate(360deg)}}@keyframes sketchBeat{to{transform:scale(1.05)}}@keyframes sketchGaze{0%,39%,62%,100%{transform:translateX(0)}45%,53%{transform:translateX(2px)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
 const effects=symbol(tag,t);
 out+='<g class="sketch-aura">'+effects+'</g>';
 out+=c(64,65,37,v.main,'opacity=".29" filter="url(#'+b+')"');
 out+='<g class="sketch-heart">'+c(64,65,28+(t-1)*1.7,'url(#'+g+'"','stroke="'+v.glow+'" stroke-width="'+(2+t*.38)+'"');
 if(tag===14){out+=p('M64 38Q55 62 64 65T64 93','#eaf9ff',2.3);out+=p('M64 39Q85 54 64 65Q42 82 64 93','none',0,'#faabec');}
 if(tag===6)out+=p('M51 40Q65 35 75 42','none',0,'#fffcff');
 if(tag===11&&t===3)out+=p('M45 47L61 42L78 53L91 73L74 96L49 90L37 69Z','#414844',2,'#7b8671');
 if(tag===8&&t===3)out+=star(64,65,6,28,17,'#e9b0ff');
 if(tag===9&&t===3)out+=p('M44 45L63 37L84 48L92 73L66 98L37 80Z','#f1fcff',2,'#b2dfff');
 if(tag===7&&t===3)out+=p('M41 44L51 30L64 44L78 29L88 50L97 69L73 100L45 96L31 70Z','#ae2c37',2,'#240910');
 if(tag===15&&t===3)out+=p('M38 47L53 27L62 37L74 17L86 39L95 61L86 94L47 98L33 69Z','#f98339',2,'#3e080a');
 out+=el(53,47,12,5,'#ffffff','none',1,'opacity=".3" transform="rotate(-23 53 47)"')+eyes(tag,t)+'</g>';
 if(t===3)out+='<g class="sketch-sparks">'+star(18,18,6,5,2,v.glow)+star(112,42,5,4,1.5,v.glow)+'</g>';
 out+='</svg>';
 return out;
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
 case 17:for(let i=0;i<N;i++)orbit(r+4+i*5,1,0);break;
 case 18:for(let i=0;i<N+2;i++){let p=i*6.28/(N+2)+a*.2;line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.2)*(r+9),Math.sin(p+.2)*(r+9)],[Math.cos(p+.1)*(r+12),Math.sin(p+.1)*(r+12)]]);}break;
 case 19:for(let i=0;i<N;i++){let p=a*.7+i*6.28/N;dot(Math.cos(p)*(r+10),Math.sin(p)*(r+5),2.5);}break;
 case 20:for(let i=0;i<N*2;i++){let p=i*6.28/(N*2)+a*.26,x=Math.cos(p)*(r+7),y=Math.sin(p)*(r+7);line([[x-3,y+3],[x,y-5],[x+3,y+3]]);}break;
 case 21:for(let i=0;i<8;i++){let p=i*.785;line([[Math.cos(p)*(r+2),Math.sin(p)*(r+2)],[Math.cos(p)*(r+8),Math.sin(p)*(r+8)]]);}break;
 case 22:for(let i=0;i<N;i++){let p=a*.2+i*2.09;dot(Math.cos(p)*(r+8),Math.sin(p)*(r+6),3);}break;
 case 23:for(let i=0;i<N+2;i++){let p=i*6.28/(N+2);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.1)*(r+9),Math.sin(p+.1)*(r+10)]]);}break;
 case 24:for(let i=0;i<N;i++){let p=a*.5+i*2.1;orbit(r+5+i*2,.3,p);}break;
 case 25:for(let i=0;i<N+2;i++){let p=i*6.28/(N+2);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p)*(r+7),Math.sin(p)*(r+7)]]);}break;
 case 26:for(let i=0;i<N;i++){let p=a+i*2.09;dot(Math.cos(p)*(r+8),Math.sin(p)*(r+8),3);}break;
 case 27:for(let i=0;i<N;i++){let p=i*2.09+a*.1,x=Math.cos(p)*r,y=Math.sin(p)*r;line([[x-4,y+3],[x+5,y-5],[x+3,y-8]]);}break;
 case 28:for(let i=0;i<N+2;i++){let p=i*6.28/(N+2)+a*.12;dot(Math.cos(p)*(r+7),Math.sin(p)*(r+7),2.2);}break;
 case 29:for(let i=0;i<N+3;i++){let p=i*6.28/(N+3);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.2)*(r+12),Math.sin(p+.2)*(r+11)]]);}break;
 case 30:ctx.rotate(a*.12);orbit(r+9,.37,.6);orbit(r+9,.37,-.6);break;
 case 31:for(let i=0;i<N+4;i++){let p=i*6.28/(N+4);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.08)*(r+6),Math.sin(p+.08)*(r+15)]]);}break;
 }
 ctx.restore();
}
window.BVBSketch17to32={count:16,tiers:3,firstId:16,lastId:31,concepts:themes,svgFor:portrait,renderCombat};
})();
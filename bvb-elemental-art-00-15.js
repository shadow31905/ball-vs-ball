/* Sixteen bespoke elemental portraits based on the user's second visual sketch.
 * Visual-only: abilities, damage, physics and RNG remain unchanged.
 * IDs 0–15 correspond to Fire, Ice, Lightning, Earth, Wind, Darkness,
 * Light, Water, Plant, Metal, Sand, Magma, Crystal, Poison, Time, Space.
 * Each has a separately authored V1/V2/V3 silhouette.
 */
(()=>{
'use strict';
const THEMES=Object.freeze([
 {name:'Płomień',tag:'fire',base:'#fa3916',hot:'#ffe274',dark:'#6e0807'},
 {name:'Lód',tag:'ice',base:'#19a8f6',hot:'#d8fbff',dark:'#053a91'},
 {name:'Błyskawica',tag:'lightning',base:'#1c6ae5',hot:'#ffe764',dark:'#102163'},
 {name:'Ziemia',tag:'earth',base:'#96704d',hot:'#e5c09b',dark:'#4a332a'},
 {name:'Wiatr',tag:'wind',base:'#29c7a2',hot:'#d5ffed',dark:'#105c52'},
 {name:'Ciemność',tag:'darkness',base:'#5515a5',hot:'#f064ff',dark:'#13072e'},
 {name:'Światło',tag:'light',base:'#ffce54',hot:'#ffffff',dark:'#be720a'},
 {name:'Woda',tag:'water',base:'#0289f3',hot:'#a9f6ff',dark:'#043b9a'},
 {name:'Roślina',tag:'plant',base:'#49aa2d',hot:'#b9ff7d',dark:'#195522'},
 {name:'Metal',tag:'metal',base:'#8193a5',hot:'#eff8ff',dark:'#263447'},
 {name:'Piasek',tag:'sand',base:'#e3b344',hot:'#fff0a9',dark:'#805321'},
 {name:'Magma',tag:'magma',base:'#bb2614',hot:'#ffb130',dark:'#300b0b'},
 {name:'Kryształ',tag:'crystal',base:'#39bbf5',hot:'#d0baff',dark:'#182f99'},
 {name:'Trucizna',tag:'poison',base:'#47bf19',hot:'#dfff50',dark:'#174514'},
 {name:'Czas',tag:'time',base:'#d4a43c',hot:'#fff2ab',dark:'#674220'},
 {name:'Przestrzeń',tag:'space',base:'#5125b3',hot:'#e8a9ff',dark:'#0c103c'}
]);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const f=n=>Number(n).toFixed(2);
const path=(d,fill='none',stroke='none',w=1,extra='')=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round" '+extra+'/>';
const circle=(x,y,r,fill,extra='')=>'<circle cx="'+f(x)+'" cy="'+f(y)+'" r="'+f(r)+'" fill="'+fill+'" '+extra+'/>';
const ellipse=(x,y,rx,ry,fill,stroke='none',w=1,extra='')=>'<ellipse cx="'+f(x)+'" cy="'+f(y)+'" rx="'+f(rx)+'" ry="'+f(ry)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" '+extra+'/>';
const star=(x,y,k,a,b,col)=>{let coords='';for(let j=0;j<k*2;j++){const ang=j*Math.PI/k-Math.PI/2,r=j%2?b:a;coords+=f(x+Math.cos(ang)*r)+','+f(y+Math.sin(ang)*r)+' ';}return '<polygon points="'+coords+'" fill="'+col+'"/>';};
const turn=(d,x,y)=>'<g transform="rotate('+d+' '+x+' '+y+')">';
function flame(x,y,scale,fill){return '<g transform="translate('+f(x)+' '+f(y)+') scale('+f(scale)+')">'+path('M0 13C-13 3-9-5-2-17C-3-6 4-9 2-25C17-10 16 2 8 11Q2 17 0 13Z',fill)+'</g>';}
function crystal(x,y,s,c){return '<g transform="translate('+f(x)+' '+f(y)+') scale('+f(s)+')">'+path('M0-23L10-8L8 12L0 24L-10 12L-9-8Z',c,'#effaff',1.1)+path('M0-23V24M-9-8H10M0-23L-9-8', 'none','#ffffff',1.2)+'</g>';}
function leaf(x,y,a,s,col){return '<g transform="translate('+f(x)+' '+f(y)+') rotate('+a+') scale('+s+')">'+path('M0 0Q-13-23 4-31Q24-11 0 0Z',col,'#deffd0',1)+path('M0 0L4-29','none','#215e24',1.8)+'</g>';}
function rock(x,y,size,c){return '<g transform="translate('+x+' '+y+') scale('+size+')">'+path('M-13 5L-9-8L1-14L14-6L12 10L-5 14Z',c,'#eadac4',1.4)+path('M1-14L4 0L12 10M4 0L-13 5','none','#46392e',1.2)+'</g>';}
function bolt(x,y,a,scale,c){return '<g transform="translate('+x+' '+y+') rotate('+a+') scale('+scale+')">'+path('M-3-18L9-18L0-2L12-2L-12 24L-5 3L-13 3Z',c,'#fff5c0',1.3)+'</g>';}
function clock(x,y,r){let s=circle(x,y,r,'#fce6a4','stroke="#9a6319" stroke-width="3"')+circle(x,y,r-4,'#fdf0c6','stroke="#ffe390" stroke-width="1.2"');for(let i=0;i<12;i++){let a=i*Math.PI/6;s+=path('M'+f(x+Math.sin(a)*(r-8))+' '+f(y-Math.cos(a)*(r-8))+'L'+f(x+Math.sin(a)*(r-4))+' '+f(y-Math.cos(a)*(r-4)),'none','#7a4d2e',1.5);}return s+path('M'+x+' '+y+'l-8-7m8 7l11-11','none','#5b3e29',2.7)+circle(x,y,2.6,'#342b30');}
function orbital(cx,cy,r,rotation,color,w=2){return '<g transform="rotate('+rotation+' '+cx+' '+cy+')">'+ellipse(cx,cy,r,r*.45,'none',color,w)+'</g>';}
function rings(x,y,count,col){let o='';for(let i=0;i<count;i++)o+=orbital(x,y,29+i*4,i*28,col,1.5+(i%2)*.8);return o;}
function details(id,t){
 const c=THEMES[id],v=t===3?3:t===2?2:1;
 let out='',col=c.hot;
 switch(id){
 case 0: // fire — licking flames -> fire wreath -> hellfire meteor
  for(let i=0;i<4+t*3;i++){const a=i*Math.PI*2/(4+t*3),r=28+(t-1)*4;out+=flame(64+r*Math.cos(a),64+r*Math.sin(a),(.38+.12*t)*(Math.sin(a)<0?1.15:.8),i%3?c.base:c.hot);}
  if(t>=2)out+=flame(42,40,.8,'#ffb122')+flame(83,36,.98,'#ff5a0b');
  if(t===3)out+=flame(65,16,1.7,'#ff4d06')+flame(42,21,1,'#ffbb23')+path('M34 28Q64 5 95 29','none','#ffdf5e',2.5);
  break;
 case 1: // ice — sharp spike crown, then frosted shards, then glacier fortress
  for(let i=0;i<3+t*2;i++){let a=2*Math.PI*i/(3+t*2);let r=t===3?35:29;out+=crystal(64+r*Math.sin(a),64+r*Math.cos(a),(.38+.08*t),i%2?'#2dcfff':'#8ff8ff');}
  out+=crystal(64,29,t===3?1.15:t===2?.86:.56,'#72dafe');
  if(t>=2)out+=crystal(44,34,.6,'#2c91f6')+crystal(84,35,.62,'#3fe6ff');
  if(t===3)out+=star(64,9,6,10,3,'#f0fdff');
  break;
 case 2: // lightning — electric forks, coil network, thundercrown
  for(let i=0;i<2+t*3;i++){let a=i*360/(2+t*3);out+=bolt(64+Math.sin(a*Math.PI/180)*35,64-Math.cos(a*Math.PI/180)*35,a,.43+t*.1,i%2?'#fffca1':'#ffc122');}
  if(t>=2)out+=path('M28 73Q16 42 55 18L80 40Q108 60 89 91','none','#fff48a',2.8);
  if(t===3)out+=bolt(65,22,12,1.18,'#fff27c')+bolt(41,32,-35,.84,'#ffe03f')+bolt(88,34,37,.82,'#fff3a1');
  break;
 case 3: // earth — small rock particles, moss, massive faceted stone armor
  for(let i=0;i<t*3;i++){let a=2*Math.PI*i/(t*3),r=33+4*(i%2);out+=rock(f(64+Math.sin(a)*r),f(64+Math.cos(a)*r),.32+t*.09,i%3?'#9b7250':'#e5b78e');}
  if(t>=2)out+=leaf(48,33,-30,.65,'#4fae30')+leaf(84,41,30,.55,'#71cd3d');
  if(t===3)out+=path('M34 34L45 15L63 29L79 10L95 34L88 80L62 104L37 83Z','#897260','#e6caa9',2.5)+
    path('M34 34L63 29L62 104M95 34L63 29','none','#4b382c',2.5);
  break;
 case 4: // wind — mint eddies then whirling bands then cyclone itself
  for(let i=0;i<2+t;i++)out+=orbital(64,64,30+(i*5),i*21,'#b4ffe4',2.8-i*.25);
  out+=path('M35 42Q80 12 89 44Q97 62 61 68Q25 75 34 85','none','#a9fff0',t===3?5:3.3);
  if(t>=2)out+=path('M40 32Q77 7 93 36M30 81Q70 107 89 76','none','#dcfff5',3.2);
  if(t===3)out+=path('M62 15Q100 24 94 45Q116 77 64 103Q42 86 54 66','none','#61fce3',5);
  break;
 case 5: // darkness — smoke, abyss flames, demonic crest
  for(let i=0;i<3+t*2;i++){let a=i*2*Math.PI/(3+t*2),r=32;out+=flame(64+r*Math.cos(a),64+r*Math.sin(a),.38+t*.16,i%2?'#7d1cb4':'#e043ff');}
  if(t>=2)out+=path('M23 41Q42 8 48 39M77 39Q82 4 107 37','none','#bd48ff',5);
  if(t===3)out+=path('M28 37L45 8L55 30L64 3L77 30L95 10L103 45','none','#ff54ff',4)+star(64,9,7,7,2,'#e77cff');
  break;
 case 6: // light — bright halo, celestial wings, radiant god rays
  for(let i=0;i<t*5+3;i++){let a=i*2*Math.PI/(t*5+3);out+=path('M'+f(64+Math.cos(a)*31)+' '+f(64+Math.sin(a)*31)+'L'+f(64+Math.cos(a)*(39+t*3))+' '+f(64+Math.sin(a)*(39+t*3)),'none',t===3?'#ffffff':'#ffe9a7',t===3?3:1.8);}
  out+=orbital(64,36,22+(t-1)*4,-12,'#fff5c8',t===3?4:2.7);
  if(t>=2)out+=path('M38 53Q1 14 17 79L38 82M90 53Q126 14 110 79L90 82','none','#fff9eb',t===3?5:3.5);
  if(t===3)out+=star(64,16,8,19,8,'#fffef3');
  break;
 case 7: // water — dancing drops, waves, tsunami crest
  for(let i=0;i<t*4+3;i++){const a=i*2*Math.PI/(t*4+3),r=35+(i%2)*4;out+=circle(64+r*Math.cos(a),64+r*Math.sin(a),1.9+(i%3),i%2?'#acfbff':'#58cbff');}
  out+=path('M26 62Q51 28 67 51Q90 74 103 37Q110 95 79 99','none','#8bffff',t===3?5:3);
  if(t>=2)out+=path('M26 45Q48 15 79 29Q112 40 103 66','none','#bafcff',3);
  if(t===3)out+=path('M42 29Q63 6 82 19Q112 29 111 49Q91 40 82 69','none','#f0ffff',5);
  break;
 case 8: // plant — budding leaves, vines, full thorn guardian
  for(let i=0;i<2+t*3;i++){const a=i*360/(2+t*3),rad=(30+4*(i%2)),q=a*Math.PI/180;out+=leaf(64+rad*Math.sin(q),64-rad*Math.cos(q),a,.32+t*.16,i%2?'#50c44a':'#b8ff4c');}
  if(t>=2)out+=path('M32 97Q15 50 48 29Q65 15 84 38Q109 66 90 94','none','#5b9033',4);
  if(t===3)out+=path('M30 89Q37 43 48 28L57 15M83 90Q88 39 72 18','none','#a6dc50',4)+leaf(64,15,0,1.15,'#77da36');
  break;
 case 9: // metal — rivets, plated shell and steel crest
  for(let i=0;i<t*3+5;i++){let a=i*2*Math.PI/(t*3+5),r=33;out+=circle(64+r*Math.cos(a),64+r*Math.sin(a),2.2,'#ebf4ff','stroke="#425b76" stroke-width="1.1"');}
  out+=path('M33 43L46 29L66 33L88 26L99 50L88 89L54 105L30 81Z','none','#d6e0ed',t===3?4.5:2);
  if(t>=2)out+=path('M39 36L51 21L64 33L78 17L92 35','none','#e2e9f3',4);
  if(t===3)out+=path('M29 39L41 7L58 28L74 4L88 31L110 17L98 67','none','#f0f5fa',4.8)+rock(64,20,.72,'#9ca9bb');
  break;
 case 10: // sand — golden grains, swept whirl and majestic layered funnel
  for(let i=0;i<t*8+8;i++){let a=i*2.399,r=29+(i%3)*6;out+=circle(64+r*Math.cos(a),64+r*Math.sin(a),.9+(i%3)*.6,'#ffda6b');}
  for(let i=0;i<t+1;i++)out+=orbital(64,64,31+i*4,33+i*22,'#fff0b9',1.7+t*.3);
  if(t>=2)out+=path('M25 39Q80 12 98 43Q77 68 35 76M38 87Q68 105 96 71','none','#ffe4a0',3.4);
  if(t===3)out+=path('M20 28Q70 3 109 33M27 89Q55 116 93 88','none','#fff2ad',4.3);
  break;
 case 11: // magma — volcanic cracks, molten vent, eruption crown
  for(let i=0;i<4+t*2;i++){let a=i*Math.PI*2/(4+t*2);out+=flame(64+33*Math.cos(a),64+33*Math.sin(a),.39+t*.13,i%2?'#ff7b18':'#ffe04b');}
  out+=path('M37 47L57 55L65 37L88 50M44 86L65 72L82 91M59 27L64 37L78 18','none','#ff6b21',t===3?5:3);
  if(t>=2)out+=rock(38,35,.75,'#362324')+rock(88,38,.65,'#4f2420');
  if(t===3)out+=path('M29 32L48 7L63 31L79 4L100 37','none','#ffb443',5)+flame(65,13,.95,'#ffe569');
  break;
 case 12: // crystal — blue prisms, violet corona and enormous faceted crown
  for(let i=0;i<t*3+3;i++){const a=i*2*Math.PI/(t*3+3),rr=32+(i%2)*3;out+=crystal(64+rr*Math.cos(a),64+rr*Math.sin(a),.36+t*.12,i%2?'#b25aff':'#64f7ff');}
  if(t>=2)out+=crystal(47,30,.85,'#be80ff')+crystal(81,32,.9,'#80fdff');
  if(t===3)out+=crystal(64,16,1.25,'#c68eff')+crystal(33,34,.82,'#42f0ff')+crystal(96,34,.83,'#cf77ff');
  break;
 case 13: // poison — acid bubbles, acid drizzle, toxic thorn fumes
  for(let i=0;i<3+t*5;i++){let a=i*2.4,rr=30+(i%3)*4;out+=circle(64+rr*Math.cos(a),64+rr*Math.sin(a),1+(i%4),'#abff56','stroke="#e1ff89" stroke-width=".9"');}
  if(t>=2)out+=path('M28 41Q15 10 40 16M80 24Q99 5 106 43M42 92Q15 105 23 79','none','#76ff35',4);
  if(t===3)out+=flame(41,30,.75,'#65e51e')+flame(85,28,.82,'#b2ff29')+crystal(65,19,.7,'#74f94c');
  break;
 case 14: // time — ornate watch gears then monumental blue clock
  out+=clock(64,64,30+t*1.5);
  if(t>=2)for(let i=0;i<3+t;i++){const a=i*Math.PI*2/(3+t),rr=42;out+=star(64+rr*Math.cos(a),64+rr*Math.sin(a),8,4+(t===3?2:0),2,'#ffe4a7');}
  if(t===3)out+=clock(64,64,31).replace(/#fce6a4/g,'#71b7ff').replace(/#fdf0c6/g,'#173f9b')+
    orbital(64,64,42,35,'#f8d05c',2.7);
  break;
 case 15: // space — planetary halo, teleport arcs, abyss portal
  out+=rings(64,64,t,c.hot);
  for(let i=0;i<t*3+3;i++){let a=i*2*Math.PI/(t*3+3);out+=star(64+37*Math.cos(a),64+37*Math.sin(a),4,3+t*.45,1.5,i%2?'#e28aff':'#a5b9ff');}
  if(t>=2)out+=orbital(64,64,44,66,'#b06bff',3);
  if(t===3)out+=circle(64,55,28,'#120b36','stroke="#a73fff" stroke-width="3"')+orbital(64,55,34,25,'#df80ff',4)+star(64,25,6,8,3,'#fc9cff');
  break;
 }
 return out;
}
function face(id,t){
 // Huge scowling eyes are the consistent character feature of the sketch.
 // The eye sockets and brow tilt are not shared decorative stickers; they
 // are part of the rounded character's own face, foreground of each motif.
 const dark='#0b1730',white='#fefefe',y=id===14?73:69,r=t===3?1.05:1;
 let out='<g class="element-eyes">';
 for(const dir of [-1,1]){
  const x=64+dir*12;
  out+=path('M'+f(x-10)+' '+f(y-10)+'L'+f(x+8)+' '+f(y-5),'none',dark,3.5);
  out+=path('M'+f(x-8)+' '+f(y-5)+'Q'+f(x+2)+' '+f(y-9)+' '+f(x+10)+' '+f(y-3)+'L'+f(x+4)+' '+f(y+8)+'Q'+f(x-2)+' '+f(y+8)+' '+f(x-8)+' '+f(y+2)+'Z',white,dark,1.7);
  out+=circle(x+dir*1.6,y+2,3.5*r,dark)+circle(x+dir*1.6-1.2,y+.5,1.2,'#ffffff');
 }
 return out+path('M57 '+(y+17)+'Q64 '+(y+16)+' 72 '+(y+16),'none',dark,1.7)+'</g>';
}
function portrait(id,tier){
 id=Number(id);tier=Number(tier);
 if(!Number.isInteger(id)||id<0||id>=16)return '';
 tier=clamp(Number.isFinite(tier)?Math.round(tier):1,1,3);
 const cfg=THEMES[id],tag=cfg.tag,uid='element-'+id+'-'+tier;
 const spread=tier===3?38:tier===2?35:32,radius=28+(tier-1)*2;
 const grad='g-'+uid,glow='gl-'+uid;
 let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-element="'+tag+'" data-ball-id="'+id+'" data-evolution="'+tier+'" aria-label="'+cfg.name+' V'+tier+'">';
 svg+='<defs><radialGradient id="'+grad+'" cx="28%" cy="17%" r="88%"><stop offset="0" stop-color="'+cfg.hot+'"/><stop offset=".28" stop-color="'+cfg.base+'"/><stop offset=".76" stop-color="'+cfg.base+'"/><stop offset="1" stop-color="'+cfg.dark+'"/></radialGradient><filter id="'+glow+'" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="'+(tier===3?5:3.1)+'"/></filter></defs>';
 svg+='<style>.element-aura{transform-origin:64px 64px;animation:bvbAuraSpin '+f(5.5+(id%6)*.8)+'s linear infinite}.element-pulse{transform-origin:64px 64px;animation:bvbPulse '+f(2.1+(id%7)*.25)+'s ease-in-out infinite alternate}.element-eyes{animation:bvbEyes 5.2s ease-in-out infinite}.element-spark{animation:bvbSpark 2.7s ease-in-out infinite alternate}@keyframes bvbAuraSpin{to{transform:rotate(360deg)}}@keyframes bvbPulse{to{transform:scale(1.045)}}@keyframes bvbEyes{0%,38%,49%,100%{transform:translateX(0)}43%{transform:translateX(2px)}}@keyframes bvbSpark{to{opacity:.35;transform:translateY(-3px)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>';
 // The outer decorations, silhouettes and material patterns are specific to the element.
 svg+='<g class="element-aura">'+details(id,tier)+'</g>';
 svg+=circle(64,64,radius+9,cfg.base,'opacity=".38" filter="url(#'+glow+')"');
 // Clock and portal have their own core treatment to match the sketch.
 svg+='<g class="element-pulse">';
 if(id===14)svg+=circle(64,64,radius,'url(#'+grad+')','stroke="'+cfg.hot+'" stroke-width="3"');
 else if(id===15&&tier===3)svg+=circle(64,64,radius,'#11052b','stroke="#d68bff" stroke-width="3.5"');
 else svg+=circle(64,64,radius,'url(#'+grad+')','stroke="'+cfg.hot+'" stroke-width="'+(tier===3?3.3:2.5)+'"');
 if([3,9,11,12].includes(id)){
  const lines=id===3?'M40 47L53 39L69 48L86 40M40 88L53 77L81 84':id===9?'M43 42L78 48L90 63L78 88M45 88L54 52':id===11?'M45 41L57 55L76 48M48 85L68 71L82 85':'M42 43L56 56L68 38L88 50';
  svg+=path(lines,'none',id===11?'#ff9f38':id===12?'#c7a9ff':cfg.dark,id===12?2:2.8);
 }
 if(id===4)svg+=orbital(64,60,22,-24,'#d3fff5',2.2);
 if(id===5)svg+=path('M43 49Q64 36 89 49','none','#b65fff',2);
 if(id===7)svg+=path('M41 45Q64 35 86 47','none','#c4ffff',2.5);
 if(id===8)svg+=path('M42 52Q64 35 85 54','none','#98ea56',2);
 if(id===10)svg+=orbital(64,60,22,35,'#fff3b1',1.9);
 if(id===15)svg+=orbital(64,64,23,15,'#8e7aff',1.6);
 svg+=ellipse(54,44,11,5,'#ffffff','none',1,'opacity=".35" transform="rotate(-25 54 44)"')+face(id,tier)+'</g>';
 svg+='<g class="element-spark">';
 for(let i=0;i<tier*3;i++){const ang=i*2.399+id*.42;let rr=42+i%3*5;svg+=star(64+rr*Math.cos(ang),64+rr*Math.sin(ang),4,1.9+(i%3),.6,i%2?cfg.hot:cfg.base);}
 svg+='</g></svg>';
 return svg;
}
const keys=Object.freeze(THEMES.map(x=>x.tag));
function paintCombat(ctx,actor,g){
 if(!ctx||!actor?.b||actor.b.id<0||actor.b.id>=16)return;
 const id=actor.b.id,t=Math.max(0,Number(g?.rt)||0),tier=clamp(actor.tier||1,1,3);
 const setting=window.BVBMotion?.prefs?.()||{};
 if(setting.artQuality==='low'||setting.artIntensity===0)return;
 const intensity=Number.isFinite(setting.artIntensity)?setting.artIntensity/100:1;
 if(window.BVBMotion?.enabled?.('fight')===false)return;
 const cfg=THEMES[id],size=Math.max(9,Number(actor.r)||18);
 ctx.save();ctx.translate(actor.x,actor.y);
 ctx.lineWidth=1.3+tier*.3;ctx.strokeStyle=cfg.hot;ctx.fillStyle=cfg.base;
 ctx.globalAlpha=.35*intensity+.07*tier;ctx.shadowColor=cfg.base;
 ctx.shadowBlur=setting.artQuality==='ultra'?10:4;
 const phase=t*(.7+(id%5)*.18)+id*.3,r=size+4+tier*2;
 const dot=(x,y,rr)=>{ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.fill();};
 const arc=(x,y,rad,a=0,b=Math.PI*2)=>{ctx.beginPath();ctx.arc(x,y,rad,a,b);ctx.stroke();};
 const line=(points)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const a=i=>phase+i*.9;
 switch(id){
 case 0:for(let i=0;i<4+tier;i++){let p=a(i);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.18)*(r+5),Math.sin(p+.18)*(r+9)],[Math.cos(p+.3)*(r+2),Math.sin(p+.3)*(r+3)]]);}break;
 case 1:for(let i=0;i<4+tier;i++){let p=i*Math.PI*2/(4+tier)+phase*.1;line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p)*(r+7),Math.sin(p)*(r+7)]]);line([[Math.cos(p-.1)*(r+4),Math.sin(p-.1)*(r+4)],[Math.cos(p+.1)*(r+4),Math.sin(p+.1)*(r+4)]]);}break;
 case 2:for(let i=0;i<3+tier;i++){let p=a(i),x=Math.cos(p)*r,y=Math.sin(p)*r;line([[x,y],[x+Math.sin(p)*5,y-8],[x-Math.cos(p)*3,y-12]]);}break;
 case 3:for(let i=0;i<2+tier;i++){let p=a(i),x=Math.cos(p)*r,y=Math.sin(p)*r;line([[x-4,y+2],[x-2,y-4],[x+4,y-2],[x+5,y+3],[x-4,y+2]]);}break;
 case 4:for(let i=0;i<tier+2;i++)arc(0,0,r+2*i,phase+i*.4,phase+1.5+i*.4);break;
 case 5:for(let i=0;i<2+tier;i++){let p=a(i),x=Math.cos(p)*r,y=Math.sin(p)*r;line([[x-3,y+5],[x,y-6],[x+3,y-12]]);}break;
 case 6:for(let i=0;i<4+tier*3;i++){let p=i*Math.PI*2/(4+tier*3)+phase*.1;line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p)*(r+7),Math.sin(p)*(r+7)]]);}break;
 case 7:for(let i=0;i<3+tier*2;i++){let p=a(i),rr=r+2*Math.sin(phase+i);dot(Math.cos(p)*rr,Math.sin(p)*rr,1.6+(i%3));}break;
 case 8:for(let i=0;i<3+tier;i++){let p=a(i),x=Math.cos(p)*r,y=Math.sin(p)*r;line([[x-3,y+5],[x+5,y-5],[x+3,y-8],[x-3,y+5]]);}break;
 case 9:for(let i=0;i<4+tier;i++){let p=i*Math.PI*2/(4+tier)+phase*.15;dot(Math.cos(p)*r,Math.sin(p)*r,2.2);}break;
 case 10:for(let i=0;i<7+tier*3;i++){let p=i*2.399+phase,rr=r+i%5;dot(Math.cos(p)*rr,Math.sin(p)*rr,.8+(i%3)*.3);}break;
 case 11:for(let i=0;i<3+tier;i++){let p=a(i);line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p+.12)*(r+6),Math.sin(p+.12)*(r+6)],[Math.cos(p+.21)*(r+11),Math.sin(p+.21)*(r+11)]]);}break;
 case 12:for(let i=0;i<3+tier;i++){let p=a(i),x=Math.cos(p)*r,y=Math.sin(p)*r;line([[x-4,y],[x,y-8],[x+4,y],[x,y+8],[x-4,y]]);}break;
 case 13:for(let i=0;i<3+tier*2;i++){let p=a(i);arc(Math.cos(p)*r,Math.sin(p)*r,1.7+(i%3));}break;
 case 14:for(let i=0;i<8+tier*2;i++){let p=i*Math.PI*2/(8+tier*2)+phase*.05;line([[Math.cos(p)*r,Math.sin(p)*r],[Math.cos(p)*(r+4),Math.sin(p)*(r+4)]]);}break;
 case 15:for(let i=0;i<tier;i++){ctx.save();ctx.rotate(phase*.15+i*.6);ctx.scale(1,.45);arc(0,0,r+i*4);ctx.restore();}break;
 }
 ctx.restore();
}
window.BVBElementalArt={count:16,tiers:3,keys,themes:THEMES,svgFor:portrait,paintCombat};
})();
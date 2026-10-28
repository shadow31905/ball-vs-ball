/* Ball VS Ball: individually authored sketches for the ORIGINAL balls 00–15.
 * Each design has an independently authored V1/V2/V3 silhouette and motion.
 * No crops from a reference sheet, no gameplay/stat/network writes.
 * Loaded after bvb-elemental-art-00-15.js and before bvb-art-evolution.js.
 */
(()=>{
'use strict';
const THEMES=Object.freeze([
 {name:'Szarża',tag:'rush',base:'#087cfa',hot:'#a5efff',dark:'#071b65'},
 {name:'Topór',tag:'axe',base:'#da2839',hot:'#ffb4aa',dark:'#530b22'},
 {name:'Trujący kolec',tag:'poison-spines',base:'#68cb18',hot:'#d7ff67',dark:'#164c18'},
 {name:'Złodziej',tag:'thief',base:'#7122bf',hot:'#f3a2ff',dark:'#190733'},
 {name:'Ostrze',tag:'blade',base:'#aabdd9',hot:'#f8ffff',dark:'#344664'},
 {name:'Karabin',tag:'rifle',base:'#eaa227',hot:'#fff0aa',dark:'#69341a'},
 {name:'Pająk',tag:'spider',base:'#58657e',hot:'#ecf7ff',dark:'#11152c'},
 {name:'Wampir',tag:'vampire',base:'#ca204a',hot:'#ffc1d8',dark:'#330819'},
 {name:'Włócznia',tag:'spear',base:'#f5b62b',hot:'#fff3bc',dark:'#6f3810'},
 {name:'Rozbłysk',tag:'burst',base:'#ff7a19',hot:'#fffdce',dark:'#9d2616'},
 {name:'Szachy',tag:'chess',base:'#dde2f3',hot:'#ffffff',dark:'#40445e'},
 {name:'Kostka',tag:'dice',base:'#f44a49',hot:'#fff3f4',dark:'#7c0d24'},
 {name:'Lodowy Stożek',tag:'ice-cone',base:'#22b5f1',hot:'#ebffff',dark:'#154a9a'},
 {name:'Laser',tag:'laser',base:'#ee293c',hot:'#ffd9e1',dark:'#620a2c'},
 {name:'Wąż',tag:'snake',base:'#45ba32',hot:'#c9ff72',dark:'#15592b'},
 {name:'Hak',tag:'hook',base:'#9daec8',hot:'#f3fbff',dark:'#243c5b'}
]);
const MOTIONS=Object.freeze([
 '0%,100%{transform:translateX(-8px) scaleX(.92);opacity:.4}50%{transform:translateX(9px) scaleX(1.12);opacity:1}',
 '0%,100%{transform:rotate(-24deg)}50%{transform:rotate(35deg)}',
 '0%,100%{transform:scale(.9);opacity:.6}50%{transform:scale(1.18);opacity:1}',
 '0%,100%{transform:translate(-4px,2px);opacity:.4}50%{transform:translate(4px,-3px);opacity:1}',
 '0%,100%{transform:rotate(-32deg)}50%{transform:rotate(48deg)}',
 '0%,100%{transform:translateX(-3px);opacity:.8}30%{transform:translateX(7px);opacity:1}38%{transform:translateX(-5px)}',
 '0%,100%{transform:scaleX(.95) scaleY(1.05)}50%{transform:scaleX(1.12) scaleY(.92)}',
 '0%,100%{transform:scale(.92) translateY(2px);opacity:.7}50%{transform:scale(1.12) translateY(-4px);opacity:1}',
 '0%,100%{transform:translateX(-8px) rotate(-10deg)}50%{transform:translateX(9px) rotate(12deg)}',
 '0%,100%{transform:scale(.75);opacity:.25}48%{transform:scale(1.22);opacity:1}60%{transform:scale(.9);opacity:.5}',
 '0%,100%{transform:translate(0,0)}30%{transform:translate(12px,-4px)}58%{transform:translate(-6px,-8px)}',
 '0%,100%{transform:rotate(-12deg)}35%{transform:rotate(30deg)}65%{transform:rotate(-20deg)}',
 '0%,100%{transform:translateY(6px);opacity:.55}50%{transform:translateY(-8px);opacity:1}',
 '0%,100%{transform:rotate(-8deg) scaleX(.92)}50%{transform:rotate(18deg) scaleX(1.12)}',
 '0%,100%{transform:rotate(-22deg) scale(.95)}40%{transform:rotate(22deg) scale(1.08)}75%{transform:rotate(4deg) scale(1.03)}',
 '0%,100%{transform:rotate(-34deg) translateX(-3px)}50%{transform:rotate(27deg) translateX(5px)}'
]);
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=x=>Number(x).toFixed(2);
const path=(d,fill='none',stroke='none',w=1)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
const circ=(x,y,r,fill,stroke='none',w=1)=>'<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'"/>';
const ellipse=(x,y,rx,ry,fill,stroke='none',w=1)=>'<ellipse cx="'+n(x)+'" cy="'+n(y)+'" rx="'+n(rx)+'" ry="'+n(ry)+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'"/>';
const group=(angle,x=64,y=64)=>'<g transform="rotate('+n(angle)+' '+n(x)+' '+n(y)+')">';
const star=(x,y,k,outer,inner,fill)=>{let points='';for(let i=0;i<k*2;i++){const a=i*Math.PI/k-Math.PI/2,r=i%2?inner:outer;points+=n(x+Math.cos(a)*r)+','+n(y+Math.sin(a)*r)+' ';}return '<polygon points="'+points.trim()+'" fill="'+fill+'"/>';};
const spike=(x,y,angle,size,color)=>group(angle,x,y)+path('M'+n(x-6)+' '+n(y+2)+'L'+n(x)+' '+n(y-size)+'L'+n(x+6)+' '+n(y+2)+'Z',color,'#e4f9ff',1.5)+'</g>';
function motif(id,t,c){
 let s='',i,a,x,y;
 switch(id){
 case 0: // speed: white aero fins -> blue shock trails -> supersonic arrow armor
  for(i=0;i<2+t*3;i++){y=24+i*12;s+=path('M'+(15-i%3*6)+' '+y+'L'+(34+t*6)+' '+(y-6)+'L'+(27+t*4)+' '+(y+4),'none',i%2?c.hot:'#34b8ff',2+t*.55);}
  s+=path('M40 37L62 18L84 39L72 51L89 64L63 56L43 69L50 52Z','#1275e6',c.hot,2.4);
  if(t>=2)s+=path('M85 34L113 29L94 44L115 51L89 56','none','#dbfaff',3.8);
  if(t===3)s+=path('M15 69L50 67L75 88L58 70L108 82L83 61','none','#efffff',4);
  break;
 case 1: // rotating combat axe crescents; three different silhouettes
  for(i=0;i<t;i++){a=24+i*360/t;s+=group(a)+path('M78 29Q116 9 110 43Q99 35 88 54L77 60L69 48Q88 34 78 29Z','#f9e4eb','#78131f',2.7)+path('M82 34Q102 25 101 42','none','#fffafa',2.5)+'</g>';}
  if(t>=2)s+=path('M31 29L50 10L57 26M32 91L20 106L51 102','none','#ff5868',3.5);
  if(t===3)s+=star(64,14,6,11,4,'#ffd9a1')+path('M22 82Q37 110 64 116Q95 107 107 74','none','#ff6a4e',4);
  break;
 case 2: // organic poisonous spikes + acid droplets
  for(i=0;i<3+t*3;i++){a=i*360/(3+t*3);x=64+Math.sin(a*Math.PI/180)*32;y=64-Math.cos(a*Math.PI/180)*32;s+=spike(x,y,a,11+t*3,i%2?c.hot:'#53cf28');}
  s+=path('M41 78Q58 91 86 76','none','#dbff6a',2.5);
  if(t>=2)for(i=0;i<5+t;i++)s+=circ(25+i*15,105-(i%3)*10,2+i%2,'#a5ed25');
  if(t===3)s+=path('M28 35Q17 55 30 63M98 29Q116 48 104 67','none','#b4ff43',5);
  break;
 case 3: // masked thief with disappearing purple shadow ribbons
  s+=path('M33 48Q27 17 64 25Q98 18 94 50L83 80Q57 95 38 77Z','#241333','#a74ce2',2.4);
  s+=path('M40 56L58 57L50 63Z M70 57L89 54L80 64Z','#f3a3ff');
  for(i=0;i<t+2;i++){a=i*360/(t+2);s+=group(a)+path('M91 35L105 15L101 42L114 51L91 48Z','#9138da',c.hot,1.7)+'</g>';}
  if(t>=2)s+=path('M25 29Q0 54 30 82M98 37Q122 68 97 96','none','#b574f5',3.4);
  if(t===3)s+=path('M49 21L61 9L76 21L94 19M37 91L20 109L43 99','none','#efd0ff',3.2);
  break;
 case 4: // floating independent silver sabres, visibly tier-increasing
  for(i=0;i<1+t*2;i++){a=i*360/(1+t*2);s+=group(a)+path('M54 4Q77 4 87 15L75 38L65 21L59 25Z','#e7f8ff','#4b739c',2.2)+path('M67 22L90 38M60 29L67 22','none','#ffffff',2)+'</g>';}
  if(t>=2)s+=ellipse(64,64,45,27,'none','#76b7ff',2.3);
  if(t===3)s+=path('M13 85L31 64M115 85L97 64M64 7L64 19','none','#dffaff',4);
  break;
 case 5: // futuristic stylized turret: multiple distinct muzzle clusters
  s+=path('M38 38L49 29L74 29L87 40L90 79L77 91L50 92L38 82Z','#b77b24','#ffe1a2',2);
  for(i=0;i<2+t*2;i++){a=(i-(1+t*2)/2)*11;x=71+i*3;y=31+i*9;s+=group(a,x,y)+path('M'+x+' '+y+'L'+(x+24+t*3)+' '+y+'L'+(x+24+t*3)+' '+(y+7)+'L'+x+' '+(y+7)+'Z','#e99d20','#fff0ae',2)+circ(x+24+t*3,y+3.5,2,'#6a4215')+'</g>';}
  if(t>=2)s+=path('M43 24L57 18L76 22M42 98L78 98','none',c.hot,3);
  if(t===3)s+=star(107,54,8,9,4,'#ffe185');
  break;
 case 6: // spider: six -> eight -> eight armored legs and web cocoon
  for(i=0;i<(t===1?6:8);i++){const side=i%2?-1:1,row=Math.floor(i/2),yy=40+row*12;s+=path('M'+(64+side*18)+' '+yy+'L'+(64+side*(35+t*2))+' '+(yy-14+row*2)+'L'+(64+side*(48+t*2))+' '+(yy+12), 'none',t===3?'#f4f9ff':'#b8c6d7',t===3?4.5:3);}
  s+=ellipse(64,61,24,28,'#293448','#e4ecf3',2);
  for(i=0;i<3;i++)s+=circ(53+i*11,51-(i===1?4:0),3.8,t===3?'#ff394e':'#f6fdff');
  if(t>=2)for(i=0;i<4+t;i++)s+=path('M'+(15+i*17)+' 12L'+(113-i*15)+' 111','none','#d2e4f5',.8);
  if(t===3)s+=path('M47 26L64 12L79 26M43 88L64 108L83 87','none','#ff6e78',3);
  break;
 case 7: // vampire: white fangs, bat wings, then horned demon wings
  s+=path('M43 53L53 53L49 70Z M73 53L84 53L77 70Z','#fffafa','#f6b9c4',1.5);
  s+=path('M35 44L49 49M78 48L91 43','none','#ffd5de',4);
  if(t>=2){s+=path('M39 49Q15 15 8 29L19 48L7 60L30 65L39 57Z','#90112f','#ff8fab',2.5)+path('M90 49Q113 14 121 30L109 46L121 60L100 65L90 57Z','#90112f','#ff8fab',2.5);}
  if(t===3)s+=path('M45 29L49 8L59 31M68 29L81 7L83 31','none','#ffa2b2',4)+path('M17 84Q64 121 112 83','none','#ff6681',3);
  break;
 case 8: // long spear: lance -> twin lances -> triad crown
  for(i=0;i<t;i++){a=(i-(t-1)/2)*36;s+=group(a)+path('M62 86L67 27M67 29L56 45L64 8L79 44L69 29','none','#fff3cb',4)+path('M64 8L79 44L67 29Z','#fbd05b','#fff9e0',2)+'</g>';}
  s+=path('M38 79L88 79M50 89L79 89','none','#fff1a8',2.5);
  if(t>=2)s+=ellipse(64,65,45,19,'none','#ffe285',2);
  if(t===3)s+=star(64,7,8,12,5,'#fff2b4');
  break;
 case 9: // pulsar, expanding shockwave and blast shards
  for(i=0;i<6+t*3;i++){a=i*360/(6+t*3);s+=group(a)+path('M58 26L64 '+(6-t*3)+'L70 26Z',i%2?'#fff4bc':'#ff9d20')+'</g>';}
  s+=circ(64,64,13+t*2,'#ffb42f','#fff8cd',3)+star(64,64,8,12+t*3,5,'#fff9ce');
  if(t>=2)s+=circ(64,64,46,'none','#ffd788',3);
  if(t===3)s+=circ(64,64,55,'none','#fff4ae',2)+star(64,64,12,38,23,'#ff8c21');
  break;
 case 10: // chess: knight / twin rook / crowned queen; changing tactical shapes
  s+=path('M40 86H90V78H83L80 51L89 37L65 24L53 37L45 33L39 46L52 56L46 77H40Z','#f9fcff','#454d60',2.5);
  s+=circ(64,39,2.8,'#232945');
  if(t>=2)s+=path('M22 83L23 40L31 40L31 47L36 47L36 40L42 40L42 83Z','#d7e0ee','#3c465c',2)+path('M88 80L87 41L95 41L95 48L100 48L100 41L107 41L107 83Z','#e6eaf5','#3c465c',2);
  if(t===3)s+=path('M32 26L42 35L51 21L64 36L77 20L87 35L98 26L93 52H38Z','#f7d277','#fff9de',2.7);
  break;
 case 11: // random dice core + independent orbiting mini dice
  s+='<rect x="43" y="41" width="42" height="42" rx="7" fill="#fff6ec" stroke="#82182c" stroke-width="3"/>';
  for(const [dx,dy] of t===1?[[-10,-10],[0,0],[10,10]]:t===2?[[-10,-10],[10,-10],[0,0],[-10,10],[10,10]]:[[-10,-10],[10,-10],[-10,0],[10,0],[-10,10],[10,10]])s+=circ(64+dx,62+dy,3,'#b9233c');
  if(t>=2)for(i=0;i<t+1;i++){a=i*360/(t+1);x=64+43*Math.sin(a*Math.PI/180);y=64-43*Math.cos(a*Math.PI/180);s+='<rect x="'+n(x-7)+'" y="'+n(y-7)+'" width="14" height="14" rx="3" fill="#ffe9e3" stroke="#ec526b" stroke-width="2"/>'+circ(x,y,2,'#ce304b');}
  if(t===3)s+=path('M25 36L33 28L41 36M91 98L101 107L112 97','none','#fff2f0',3);
  break;
 case 12: // ice cone becomes crystalline fortress with tier-specific layers
  for(i=0;i<3+t*3;i++){a=i*360/(3+t*3);s+=group(a)+path('M58 28L64 '+(4-t*3)+'L70 28L67 44L62 44Z',i%2?'#a7f1ff':'#4bbfff','#f4ffff',1.8)+'</g>';}
  s+=path('M43 80L59 24L72 55L84 32L95 85L67 104Z','#33baf8','#eafaff',2.5);
  if(t>=2)s+=path('M22 86L36 42L45 76M87 78L101 38L110 88','none','#c8fbff',4);
  if(t===3)s+=path('M64 4L72 41M35 19L52 52M94 19L78 52','none','#ffffff',4.3);
  break;
 case 13: // laser lens + articulated emitter rings, crosshair upgrade
  s+=ellipse(64,64,31,31,'#801c30','#ff8594',3)+circ(64,64,20,'#f6324b','#ffd2df',3)+circ(64,64,7,'#fff5f5','#ff647f',2);
  if(t>=2)s+=ellipse(64,64,49,20,'none','#ff6b89',3)+path('M11 64H117M64 14V115','none','#ffb7c7',2.3);
  if(t===3)s+=ellipse(64,64,19,49,'none','#ff8393',3)+path('M24 24L104 104M24 104L104 24','none','#ffe6eb',2.5);
  break;
 case 14: // snake coils -> visible head -> huge fanged basilisk with tail
  s+=path('M26 78C14 47 51 33 67 57S92 88 87 47Q78 22 60 35','none','#7af65b',9+t*1.5);
  s+=path('M58 35Q74 17 92 29L104 37L94 49L72 49Z','#3fba36','#d0ff88',2.5)+circ(87,34,3,'#ff6b62')+path('M94 48L99 59L103 47','none','#f7fff2',2.2);
  if(t>=2)s+=path('M30 86Q13 109 7 79M75 23L78 9M94 26L104 11','none','#c1ff76',4);
  if(t===3)s+=path('M23 76Q6 65 12 42M93 44L118 40L106 52L113 68','none','#86ff49',6)+path('M98 46L101 60L108 48Z','#ffffff');
  break;
 case 15: // hook on articulated chain; tier3 massive grappling anchor
  for(i=0;i<3+t*2;i++){a=i*.55;x=28+i*9;y=26+(i%2)*8;s+=ellipse(x,y,9,5,'none','#e7f2fb',2.6);}
  s+=path('M87 43L95 22L108 31L112 49Q120 63 104 82Q89 93 74 81L84 70Q96 79 102 66Q105 57 98 52Z','#9bb6cf','#eafaff',2.5);
  if(t>=2)s+=path('M32 87Q19 90 17 102L34 104L43 90M97 29L113 16','none','#c7e9ff',3.5);
  if(t===3)s+=path('M103 82L119 98L102 110L88 95M88 43L104 9L115 13','none','#ecfbff',5);
  break;
 }
 return s;
}
function face(id,t,c){
 // This preserves the game's ball-based character language. Special creatures
 // still retain their own facial parts inside motif(), not substituted emojis.
 let s='<g class="bvb-ind-eyes">';
 if([6,10,11,13].includes(id))return s+'</g>';
 const eye= id===7?'#ffdddd':id===14?'#ffe16b':'#ecfbff';
 for(const side of [-1,1]){
  const x=64+side*13;
  s+=path('M'+(x-11)+' 60Q'+x+' 53 '+(x+9)+' 57L'+(x+6)+' 68Q'+x+' 72 '+(x-9)+' 68Z',eye,'#152039',2)+
  circ(x+side*2,64,3.2,id===3?'#b31fff':id===7?'#f53c55':'#142340');
 }
 return s+'</g>';
}
function svgFor(id,tier){
 id=Number(id);tier=Math.max(1,Math.min(3,Math.trunc(Number(tier)||1)));
 if(!Number.isInteger(id)||id<0||id>=16)return '';
 const c=THEMES[id],uid='ind-'+id+'-'+tier;
 let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" data-bvb-art-v2="1" data-ball-id="'+id+'" data-evolution="'+tier+'" data-original-name="'+esc(c.name)+'" data-concept="'+c.tag+'" aria-label="'+esc(c.name)+' V'+tier+'">';
 s+='<title>'+esc(c.name)+' V'+tier+'</title><defs><radialGradient id="'+uid+'-core" cx="25%" cy="19%" r="84%"><stop stop-color="'+c.hot+'"/><stop offset=".28" stop-color="'+c.base+'"/><stop offset=".83" stop-color="'+c.base+'"/><stop offset="1" stop-color="'+c.dark+'"/></radialGradient><filter id="'+uid+'-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3"/></filter></defs>';
 s+='<style>.bvb-ind-aura{transform-origin:64px 64px;animation:bvbIndMotion'+id+' '+(1.7+id*.16).toFixed(2)+'s ease-in-out infinite}'+
 '@keyframes bvbIndMotion'+id+'{'+MOTIONS[id]+'}'+
 '.bvb-ind-core{transform-origin:64px 64px;animation:bvbIndBreath'+id+' '+(2+id*.09).toFixed(2)+'s ease-in-out infinite alternate}'+
 '@keyframes bvbIndBreath'+id+'{to{transform:scale('+(1.02+tier*.012).toFixed(3)+')}}'+
 '@media(prefers-reduced-motion:reduce){.bvb-ind-aura,.bvb-ind-core{animation:none!important}}</style>';
 s+=circ(64,64,43,c.base,'none',0).replace('/>',' opacity=".30" filter="url(#'+uid+'-glow)"/>');
 s+='<g class="bvb-ind-core">'+circ(64,64,31+tier,'url(#'+uid+'-core)',c.hot,tier===3?3.5:2.2)+path('M41 43Q53 25 72 30','none','#ffffff',2.5)+'</g>';
 // Individual identity marks must be visible ABOVE the ball, never buried under the core.
 s+='<g class="bvb-ind-aura">'+motif(id,tier,c)+'</g>'+face(id,tier,c);
 if(tier>=2)s+='<g class="bvb-ind-upgrade">'+path('M20 83Q64 '+(112+tier*2)+' 108 83','none',c.hot,1.4+tier*.7)+'</g>';
 if(tier===3)s+='<g class="bvb-ind-master">'+star(64,13,6,9,3,c.hot)+'</g>';
 return s+'</svg>';
}
function paintCombat(ctx,actor,g){
 if(!ctx||!actor||!actor.b||!Number.isInteger(actor.b.id)||actor.b.id>=16||actor.b.id<0)return;
 const prefs=window.BVBMotion?.prefs?.()||{};
 if(prefs.artQuality==='low'||prefs.artIntensity===0||window.BVBMotion?.enabled?.('fight')===false)return;
 const id=actor.b.id,tier=Math.max(1,Math.min(3,actor.tier||1)),t=Number(g?.rt)||0,c=THEMES[id],r=(actor.r||18)+tier*3+3,ph=t*(1+id*.083);
 ctx.save();
 ctx.translate(actor.x,actor.y);ctx.strokeStyle=c.hot;ctx.fillStyle=c.base;ctx.lineWidth=1.1+tier*.35;ctx.globalAlpha=.25+.35*(Number(prefs.artIntensity??100)/100);
 function line(coords){ctx.beginPath();coords.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
 function dot(x,y,rad){ctx.beginPath();ctx.arc(x,y,rad,0,Math.PI*2);ctx.fill();}
 function arc(x,y,rad,a=0,b=Math.PI*2){ctx.beginPath();ctx.arc(x,y,rad,a,b);ctx.stroke();}
 switch(id){
 case 0: for(let i=0;i<3+tier;i++)line([[-r-i*5,Math.sin(ph+i)*7],[-r-i*8-13,Math.sin(ph+i)*7]]);break;
 case 1: for(let i=0;i<2+tier;i++){let a=ph+i*2*Math.PI/(tier+2);line([[Math.cos(a)*r,Math.sin(a)*r],[Math.cos(a+.4)*(r+8),Math.sin(a+.4)*(r+8)]]);}break;
 case 2: for(let i=0;i<3+tier*2;i++)dot(Math.cos(i*2+ph)*r,Math.sin(i*2+ph)*r,2+i%2);break;
 case 3: for(let i=0;i<2+tier;i++){let a=ph+i;line([[Math.cos(a)*r,Math.sin(a)*r],[Math.cos(a+.5)*(r+9),Math.sin(a+.5)*(r+9)]]);}break;
 case 4: for(let i=0;i<2+tier;i++)arc(0,0,r+i*2,ph+i,ph+i+1.1);break;
 case 5: for(let i=0;i<3+tier;i++)dot(r+i*7,Math.sin(ph*7+i)*4,1.2+i%2);break;
 case 6: for(let i=0;i<3+tier;i++)line([[0,0],[Math.cos(i*2)*r,Math.sin(i*2)*r]]);break;
 case 7: arc(0,0,r+4*Math.sin(ph),Math.PI+.4,Math.PI*2-.4);break;
 case 8: for(let i=0;i<2+tier;i++)line([[r,0],[r+8+i*7,(i-(tier+1)/2)*6]]);break;
 case 9: for(let i=0;i<2+tier;i++)arc(0,0,r+6*i,ph,ph+2.8);break;
 case 10: line([[-r,-r],[r,-r],[r,r],[-r,r],[-r,-r]]);break;
 case 11: for(let i=0;i<3+tier;i++)dot(Math.cos(ph+i)*r,Math.sin(ph+i)*r,2+i%3);break;
 case 12: for(let i=0;i<3+tier;i++)line([[Math.cos(i*2)*r,Math.sin(i*2)*r],[Math.cos(i*2)*(r+12),Math.sin(i*2)*(r+12)]]);break;
 case 13: line([[-r,0],[r,0]]);arc(0,0,r,ph,ph+1.2);break;
 case 14: for(let i=0;i<8+tier;i++)dot(Math.cos(ph+i*.35)*(r-i*1.4),Math.sin(ph+i*.35)*(r-i*1.4),2);break;
 case 15: for(let i=0;i<4+tier;i++)arc(Math.cos(ph+i*.4)*r,Math.sin(ph+i*.4)*r,3,-1,1.5);break;
 }
 ctx.restore();
}
window.BVBElementalArt={count:16,tiers:3,keys:Object.freeze(THEMES.map(t=>t.tag)),themes:THEMES,svgFor,paintCombat,source:'individual-16-approved-20261028'};
window.BVBIndependentFirst16={count:16,tiers:3,designs:THEMES,svgFor,motionNames:Object.freeze(MOTIONS.map((_,id)=>'bvbIndMotion'+id))};
})();
/* Ball VS Ball 2.0 — faithful, tier-specific in-game designs from preview sheet 02.
 * Six identities: Pająk, Wampir, Włócznia, Rozbłysk, Szachy, Kostka (IDs 6–11).
 * Pure SVG; no external assets, HTML handlers, per-frame image allocation or timers.
 */
(() => {
'use strict';
const specs={
  6:{name:'Pająk',color:'#e5f7ff',v:['Pajęcza nić','Sieć drgań','Kokon łowcy']},
  7:{name:'Wampir',color:'#ff5a86',v:['Krwawy dług','Bankiet nocy','Serce ciemności']},
  8:{name:'Włócznia',color:'#f3d383',v:['Królewskie pchnięcie','Przebicie linii','Droga zdobywcy']},
  9:{name:'Rozbłysk',color:'#ffe28b',v:['Punkt detonacji','Odbita detonacja','Reakcja łańcuchowa']},
 10:{name:'Szachy',color:'#ddd5c4',v:['Ruch skoczka','Roszada','Mat królowej']},
 11:{name:'Kostka',color:'#fff5d8',v:['Rzut przeznaczenia','Zatrzymane oczko','Wielka szóstka']}
};
const previousArt=art,cache=new Map(),images=new Map();
const ring=(r,color,w=1.5)=>'<circle cx="48" cy="48" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+w+'"/>';
const path=(d,color,w=2)=>'<path d="'+d+'" stroke="'+color+'" stroke-width="'+w+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
function star(cx,cy,count,outer,inner,color,rotation=-Math.PI/2){
 let points='';
 for(let i=0;i<count*2;i++){
  const a=rotation+i*Math.PI/count,r=i%2?inner:outer;
  points+=(cx+Math.cos(a)*r).toFixed(2)+','+(cy+Math.sin(a)*r).toFixed(2)+' ';
 }
 return '<polygon points="'+points+'" fill="'+color+'"/>';
}
function portrait(id,stage){
 const light='#f8fdff',dark='#10192d',c=specs[id].color;
 if(id===6){
  // Screenshot: three pearl eyes, six silvery legs and thin silk filaments.
  let legs='';
  for(const side of [-1,1]){
   for(let i=0;i<3;i++){
    const y=37+i*11;
    legs+=path('M'+(48+side*15)+' '+y+'L'+(48+side*24)+' '+(y-7+i*5)+'L'+(48+side*30)+' '+(y-9+i*6),'#f6feff',2);
   }
  }
  return legs+[38,48,58].map((x,i)=>'<circle cx="'+x+'" cy="'+(46-(i===1?2:0))+'" r="3.1" fill="'+light+'"/>').join('')+
   path('M38 59Q48 52 58 59','#daeef7',1.5);
 }
 if(id===7){
  // Screenshot: two downward white vampire fangs on a rose-pink glass sphere.
  return '<path d="M33 39L43 39L39 55Z M53 39L63 39L58 55Z" fill="'+light+'"/>'+
   path('M34 34Q48 28 62 34','#fff0f4',1.2)+
   path('M35 59Q48 64 61 59','#fa91a8',1.3);
 }
 if(id===8){
  return path('M28 68L63 32','#fdfdf3',4)+
   '<polygon points="62,30 68,23 69,37 61,35" fill="'+light+'"/>'+
   path('M29 68L26 70M28 64L23 62','#fef4d1',2.5);
 }
 if(id===9){
  return star(48,48,12,23,5,'#fffefd')+star(48,48,8,11,3,'#fff6c9');
 }
 if(id===10){
  // Screenshot: unmistakable white chess knight, with a small black eye.
  return '<path d="M33 65H64V58H59L58 44L64 36L48 28L38 36L34 33L29 41L37 49L33 58Z" fill="'+light+'"/>'+
   '<circle cx="46" cy="38" r="2.3" fill="'+dark+'"/>'+
   path('M31 66H65','#fefefe',2);
 }
 if(id===11){
  const pips=stage===1?[[-7,-7],[0,0],[7,7]]:
    [[-7,-7],[7,-7],[0,0],[-7,7],[7,7]];
  return '<rect x="30" y="29" width="36" height="36" rx="5" fill="'+light+'" stroke="#f6ead2" stroke-width="1.2"/>'+
    pips.map(([x,y])=>'<circle cx="'+(48+x)+'" cy="'+(47+y)+'" r="2.1" fill="'+dark+'"/>').join('');
 }
 return '';
}
function token(id,side){
 // Reuse the same V2/V3 motifs placed next to the central sphere in preview 02.
 const x=side===2?12:84,y=48,c=specs[id].color;
 let mark='';
 if(id===6){
  mark=side===2?path('M-8 7L0 -7L8 7Z','#f4faff',1.7)+path('M0 -4L0 3M-4 4L4 4','#dce9ff',1):
   path('M-7 3C-9 -8 9 -8 7 2C5 8 -5 8 -5 1C-5 -4 4 -3 3 2','#f4faff',1.6);
 }else if(id===7){
  mark=side===2?path('M-8 2L-2 2L0 -6L4 7L6 1L9 1','#fff6fa',1.8):
   star(0,0,5,8,3,'#ffe6ee');
 }else if(id===8){
  mark=side===2?path('M-8 5L8 5M-8 -4L8 -4M0 -8L0 9','#fff8db',1.5):
   path('M-8 0H8M0 -8V8M-6 7L-6 -7','#fff8db',1.5);
 }else if(id===9){
  mark=side===2?star(0,0,8,9,3,'#fff9d8'):
   star(0,0,5,9,4,'#fff9d8');
 }else if(id===10){
  mark=side===2?'<path d="M-8 8H8V4H6V-4L9 -7H4L2 -9L0 -6L-2 -9L-4 -6L-8 -7L-5 -3V4H-8Z" fill="#fff"/>':
   '<path d="M-8 8H8V4H6V-5H4V-9H0V-5H-3V-9H-7V-4H-5V4H-8Z" fill="#fff"/>';
 }else if(id===11){
  mark='<rect x="-8" y="-8" width="16" height="16" rx="2" fill="#fff8e7"/>'+
   (side===2?[[-4,-4],[4,-4],[-4,4],[4,4]]:[[-4,-4],[4,-4],[0,0],[-4,4],[4,4]])
     .map(([a,b])=>'<circle cx="'+a+'" cy="'+b+'" r="1.5" fill="#121a2a"/>').join('');
 }
 return '<g transform="translate('+x+' '+y+')">'+
  '<circle r="11" fill="#101a30" stroke="'+c+'" stroke-width="1.3"/>'+mark+'</g>';
}
function visual(id,tier){
 const spec=specs[id];if(!spec)return previousArt(id);
 const stage=Math.min(3,Math.max(1,Math.floor(Number(tier)||1)));
 const key=id+':'+stage;if(cache.has(key))return cache.get(key);
 const c=spec.color,grad='sheet02-g'+id+'-'+stage,glow='sheet02-blur'+id+'-'+stage;
 let drawing='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" '+
   'data-preview-sheet="02" data-preview-ball="'+id+'" data-preview-tier="'+stage+'" aria-label="'+spec.name+' V'+stage+'">'+
   '<title>'+spec.name+' V'+stage+' — '+spec.v[stage-1]+'</title>'+
   '<defs><radialGradient id="'+grad+'" cx="30%" cy="23%" r="76%">'+
   '<stop offset="0" stop-color="#fff" stop-opacity=".95"/>'+
   '<stop offset=".22" stop-color="'+c+'"/>'+
   '<stop offset=".70" stop-color="'+c+'" stop-opacity=".78"/>'+
   '<stop offset="1" stop-color="#101729"/></radialGradient>'+
   '<filter id="'+glow+'" x="-60%" y="-60%" width="220%" height="220%">'+
   '<feGaussianBlur stdDeviation="3"/></filter></defs>';
 if(id===6){
  // Thread radiates beyond the body in all three reference snapshots.
  for(let i=0;i<4;i++){
   drawing+=path('M6 '+(21+i*17)+'L90 '+(77-i*16),c,stage===3?1.1:.75);
  }
 }else if(id===8||id===9){
  for(let i=0;i<4;i++)drawing+=path('M4 '+(32+i*9)+'L22 '+(26+i*8),c,1.35);
 }
 if(stage>=2){
  drawing+='<circle cx="48" cy="48" r="37" fill="none" stroke="'+c+'" opacity=".40" stroke-width="5" filter="url(#'+glow+')"/>';
  drawing+=path('M78 23A38 38 0 1 0 76 75',c,stage===2?2:2.7);
  drawing+=path('M74 19L81 25L72 28',c,1.8);
 }
 if(stage===3){
  drawing+=path('M20 19A40 40 0 0 1 75 22M21 75A40 40 0 0 0 76 71','#ffffff',1);
  for(let i=0;i<7;i++){
   const a=i*Math.PI*2/7+id*.17,x=48+38*Math.cos(a),y=48+38*Math.sin(a);
   drawing+=star(x,y,4,3.5,1.8,c);
  }
 }
 drawing+='<circle cx="48" cy="48" r="29" fill="'+c+'" opacity=".23" filter="url(#'+glow+')"/>'+
  '<circle cx="48" cy="48" r="27" fill="url(#'+grad+')" stroke="#f7fcff" stroke-width="1.5"/>'+
  path('M27 37Q34 23 47 24','#ffffff',1.8)+
  '<circle cx="40" cy="27" r="1.3" fill="#fff" opacity=".8"/>'+
  portrait(id,stage);
 if(stage>=2)drawing+=token(id,1);
 if(stage===3)drawing+=token(id,2);
 drawing+='</svg>';
 cache.set(key,drawing);return drawing;
}
art=function(id,tier){
 if(!Object.prototype.hasOwnProperty.call(specs,id))return previousArt(id);
 const stage=tier??getBallStats(id).tier;
 return visual(id,stage);
};
function imageForTier(id,tier){
 if(!Object.prototype.hasOwnProperty.call(specs,id))return null;
 const stage=Math.min(3,Math.max(1,Number(tier)||1)),key=id+':'+stage;
 if(!images.has(key)){
  const img=new Image();
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(visual(id,stage));
  images.set(key,img);
 }
 return images.get(key);
}
function imageFor(actor){
 if(!actor?.b)return null;
 const img=imageForTier(actor.b.id,actor.tier);
 return img?.complete&&img.naturalWidth?img:null;
}
window.BVB2Sheet02={ids:Object.freeze([6,7,8,9,10,11]),artForTier:visual,imageForTier,imageFor};
for(let id=6;id<=11;id++)for(let tier=1;tier<=3;tier++)imageForTier(id,tier);
ART_IMAGES.clear();preloadArt();
})();

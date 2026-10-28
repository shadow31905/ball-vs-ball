/* Evolving artwork: 130 identities, three visual stages each.
 * Preserves every identity's original symbol and the six hand-drawn sheet-02
 * portraits. No combat state, random numbers, network or timers are touched.
 */
(()=>{
'use strict';
const previous=art,svgCache=new Map(),imageCache=new Map();
const palette=['#39dfff','#ff8560','#91fb67','#bd98ff','#b8edff','#ffc36d',
 '#d7f6ff','#ff6085','#ffe898','#fff5a1','#f2f7ff','#fff1c5',
 '#8deaff','#f7659e','#a8ff93','#81a8ff','#ffb65d','#81ffd1',
 '#fff07c','#b1a8ff','#d5aaff','#92fdff','#ff6a67','#ffc06d',
 '#9eff6f','#d8c0ff','#b0dfff','#ffe580','#7dfff7','#a8efff',
 '#7ad6ff','#ffdc78','#e7ff95','#e9c5f8','#af89ec','#c7c6e9',
 '#fff2a1','#fbb2e4','#baff73','#ccadff','#b7ff66','#eaffff',
 '#acff85','#e8ecff','#ffee8e','#9dfc80','#ff7c6c','#99deff'];
palette.splice(0,16,...(window.BVBApprovedArt?.colors||window.BVBElementalArt.themes.map(t=>t.base)));
palette.splice(16,16,...window.BVBSketch17to32.concepts.map(t=>t.main));
palette.splice(32,16,...window.BVBSketch33to48.concepts.map(t=>t.base));
palette.splice(48,16,...window.BVBSketch49to64.concepts.map(t=>t.main));
palette.splice(64,16,...window.BVBSketch65to80.concepts.map(t=>t.main));
const sig=[
 'rush','axe','poison-spines','steal','blade','rifle','web','fangs','spear','burst','chess','dice',
 'icicle','laser','snake','hook','forge','cell','shock','compression','future','matrix','apple','cannon',
 'virus','wall-spike','bow','crown','rings','frost','harpoon','hive','potion','rail','black-web','tomb',
 'wings','candy','slime','chains','acid','prism','gas','shuriken','fibonacci','cactus','bomb','satellite'
];
const glyphs=[
 'M22 33L36 47L22 61M39 33L53 47L39 61M56 33L70 47L56 61',
 'M27 71L62 24M51 25L75 20L74 42L56 47',
 'M48 12L58 34L81 47L59 57L48 82L38 59L15 48L38 36Z',
 'M24 42Q47 15 72 42L66 65Q48 75 30 65ZM31 49L41 52M55 52L65 49',
 'M22 68L70 21L78 24L64 36L33 76Z',
 'M20 39H70V54H43L35 68H27L31 53H20Z',
 '', '', '', '', '', '',
 'M48 11L72 58L48 83L24 58ZM48 11V80M24 58H72',
 'M48 14V82M14 48H82M26 26L70 70M70 26L26 70',
 'M25 63C9 32 75 16 69 51S31 78 38 36',
 'M50 16V53C50 78 20 79 23 54L32 62',
 'M26 68H72L66 75H33ZM39 57L66 23M51 21L75 31L68 46L46 36',
 'M26 42Q27 22 46 28Q63 17 69 39Q82 60 58 70Q37 83 25 62',
 'M55 13L28 49H49L40 83L69 39H49Z',
 'M18 33Q48 8 77 33M18 46Q48 19 77 46M18 59Q48 32 77 59',
 'M19 74L73 22M24 72L74 34',
 'M23 24H73V74H23ZM40 24V74M56 24V74M23 40H73M23 56H73',
 'M47 39C20 23 17 64 39 72Q48 79 56 72C78 63 71 20 47 39ZM47 39L47 20M47 24Q60 13 69 23',
 'M21 39L68 29L77 45L29 55ZM27 68H70',
 'M48 13V82M13 48H82M23 23L73 73M73 23L23 73',
 'M48 9L57 35L79 44L56 58L48 85L39 59L17 48L39 36Z',
 'M27 18Q70 48 27 78M27 18L27 78M26 48H80',
 'M24 38L30 65H67L74 38L61 46L48 23L35 46Z',
 'M48 12V84M12 48H84',
 'M18 48H78M48 18V78M27 27L69 69M69 27L27 69',
 'M24 75L70 24M68 23L70 12L80 25L66 34',
 'M28 38Q38 25 48 40Q60 27 70 41M25 55Q37 40 48 55Q61 42 72 56',
 'M39 17H57M44 17V38L24 71H73L53 38V17',
 'M24 32H72V61H24ZM32 67H65M30 37V55M44 37V55M58 37V55',
 'M16 31L80 65M16 65L80 31M48 11V85M11 48H85',
 'M30 75V43A18 18 0 0 1 66 43V75ZM48 39V65M39 52H57',
 'M45 43Q8 11 9 61L32 68M51 43Q89 11 87 61L64 68',
 'M25 24H71V72H25ZM34 33L45 44L34 55M62 33L51 44L62 55',
 'M48 17Q24 43 28 64Q45 87 69 64Q73 44 48 17',
 'M18 27Q37 13 54 37Q70 60 79 70M79 27Q60 13 42 37Q27 60 18 70',
 'M48 17Q22 39 29 67Q48 78 67 67Q74 39 48 17',
 'M48 11L76 64L21 64ZM48 11V64M21 64L76 64',
 'M19 58Q9 21 43 20Q78 14 78 52Q80 82 49 76Q27 70 36 48',
 'M48 16V75M48 46L33 45V32M48 53H63V39',
 'M48 30A21 21 0 1 1 47 30M48 30L60 16',
 'M48 48m-22 0a22 22 0 1 0 44 0a22 22 0 1 0 -44 0M18 48Q48 20 78 48Q48 77 18 48'
];
const round=(x)=>Number(x).toFixed(2);
const stroke=(d,color,width=2)=>'<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+width+'" stroke-linejoin="round" stroke-linecap="round"/>';
const circle=(x,y,r,col,extra='')=>'<circle cx="'+round(x)+'" cy="'+round(y)+'" r="'+r+'" fill="'+col+'" '+extra+'/>';
function star(x,y,k,outer,inner,col){
 let pts='';for(let i=0;i<k*2;i++){const a=i*Math.PI/k-Math.PI/2,r=i%2?inner:outer;pts+=round(x+Math.cos(a)*r)+','+round(y+Math.sin(a)*r)+' ';}
 return '<polygon points="'+pts+'" fill="'+col+'"/>';
}
function core(id){
 if(id<32)return stroke(glyphs[id]||'', '#f9ffff',id%4===1?4:2.6);
 // Original SVG art is preserved inside each orb, retaining the existing
 // unique iconography of balls 48–129.
 const src=previous(id,1);
 const m=src.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
 return '<g transform="translate(21 21) scale(.85)">'+(m?m[1]:'')+'</g>'+
   (id<48?stroke(glyphs[id]||'', '#f9ffff',2.2):'');
}
function angryFace(id,tier){
 if(id>=48)return '';
 const yy=50+id%3,brow='#172037',iris='#17233f',white=tier===3?'#fff3c3':'#f8fdff';
 let out='<g class="bvb-cartoon-face" data-face-id="'+id+'">';
 for(const side of [-1,1]){
  const x=48+side*11,tilt=side*(id%4-1);
  out+='<path d="M'+(x-8)+' '+(yy-9+tilt)+'L'+(x+8)+' '+(yy-6-tilt)+
   '" fill="none" stroke="'+brow+'" stroke-width="3.5" stroke-linecap="round"/>';
  out+='<path d="M'+(x-7)+' '+(yy-3)+'Q'+x+' '+(yy-9)+' '+(x+8)+' '+(yy-3)+
   'L'+(x+5)+' '+(yy+6)+'Q'+x+' '+(yy+7)+' '+(x-6)+' '+(yy+4)+'Z" fill="'+white+
   '" stroke="'+brow+'" stroke-width="1.1"/>';
  out+='<g class="bvb-cartoon-iris"><ellipse cx="'+(x+side*(id%3))+'" cy="'+(yy+1)+'" rx="2.5" ry="3.3" fill="'+iris+'"/>'+
   '<circle cx="'+(x+side*(id%3)-1)+'" cy="'+(yy-1)+'" r="1" fill="white"/></g>';
 }
 return out+'<path d="M40 '+(yy+11)+'Q48 '+(yy+8+id%4)+' 56 '+(yy+11)+
  '" stroke="#27334d" stroke-width="1.5" fill="none"/></g>';
}

/* This is a cosmetic view preference, never part of actor state or battle RNG.
 * Classic portraits are a temporary identity-preserving vector layer until
 * every approved classic source sprite is exported and reviewed.
 */
const classicCache=new Map();
const completedReworkIds=new Set(Array.from({length:32},(_,id)=>id));
function isCompletedRework(id){return Number.isInteger(id)&&completedReworkIds.has(id);}
function currentStyle(){return S?.o?.ballVisualStyle==='classic'?'classic':'detailed';}
function classicSvg(id,tier){
 if(id>=16&&id<32)return window.BVBSketch17to32.svgFor(id,tier,'classic');
 const key=id*4+tier;
 if(classicCache.has(key))return classicCache.get(key);
 const base=previous(id,1);
 const source=(base.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)||[])[1]||'';
 const motif=source.replace(/^\s*<rect\b[^>]*\/>/i,'');
 const color=palette[id]||B[id]?.c||'#72ddff';
 const eyeColor=['#44caff','#ff4d6e','#95ff4d','#c777ff'][id%4];
 const angle=id*17%360;
 const speed=(3.3+(id%7)*.25-(tier-1)*.2).toFixed(2);
 const ring='<g class="bvb-classic-orbit" transform-origin="32px 32px"><ellipse cx="32" cy="32" rx="'+(27+tier*.8)+'" ry="'+(24+tier)+'" transform="rotate('+angle+' 32 32)" fill="none" stroke="'+color+'" stroke-width="'+(1+tier*.4)+'" opacity=".92"/>'+
  (tier>=2?'<path d="M9 22L4 18 12 9M51 45L59 52 50 59" fill="none" stroke="'+color+'" stroke-width="2"/>':'')+
  (tier===3?'<path d="M32 1L36 9L32 6L28 9ZM32 63L28 55L32 58L36 55Z" fill="'+color+'"/>':'')+'</g>';
 const face='<g class="bvb-classic-face"><path d="M15 28L27 34L25 39L14 33ZM49 28L37 34L39 39L50 33Z" fill="'+eyeColor+'" stroke="#080d18" stroke-width="1.4"/>'+
  '<path d="M16 29L27 34M48 29L37 34" stroke="#f4ffff" stroke-width=".7" opacity=".78"/></g>';
 const core='<g class="bvb-classic-core"><circle cx="32" cy="32" r="23.7" fill="#232832" stroke="#070b14" stroke-width="3"/>'+
  '<path d="M15 17Q21 10 34 11" fill="none" stroke="#ffffff" stroke-opacity=".28" stroke-width="2"/></g>';
 const equipment='<g class="bvb-classic-equipment">'+motif+'</g>';
 const extra=tier===3?'<g class="bvb-classic-final"><circle cx="12" cy="11" r="2" fill="'+eyeColor+'"/><circle cx="52" cy="15" r="2.8" fill="'+color+'"/></g>':'';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="'+B[id].n+' V'+tier+' Klasyczny" data-bvb-art-v2="1" data-visual-style="classic" data-ball-id="'+id+'" data-evolution="'+tier+'">'+
  '<style>.bvb-classic-orbit{animation:bvbClassicOrbit '+speed+'s linear infinite}.bvb-classic-equipment{transform-origin:32px 32px;animation:bvbClassicEquip '+(2.3+id%4*.35).toFixed(2)+'s ease-in-out infinite alternate}.bvb-classic-core{transform-origin:32px 32px;animation:bvbClassicBeat 2.8s ease-in-out infinite alternate}'+
  '@keyframes bvbClassicOrbit{to{transform:rotate(360deg)}}@keyframes bvbClassicEquip{to{transform:rotate(5deg)}}@keyframes bvbClassicBeat{to{transform:scale(1.02)}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}</style>'+
  ring+core+equipment+face+extra+'</svg>';
 classicCache.set(key,svg);return svg;
}
function refreshVisualStyle(){
 imageCache.clear();
 ART_IMAGES.clear();preloadArt();
 const nodes=document.querySelectorAll?.('.orb svg[data-bvb-art-v2],.bvb-evo-preview svg[data-bvb-art-v2]')||[];
 for(const node of nodes){
  const id=Number(node.getAttribute('data-ball-id'));
  const tier=Number(node.getAttribute('data-evolution'));
  if(Number.isInteger(id)&&isCompletedRework(id)&&tier>=1&&tier<=3)node.outerHTML=svgFor(id,tier);
 }
}

function svgFor(id,tier){
 id=Number(id);if(!Number.isInteger(id)||id<0||id>=B.length)return '';
 tier=Math.max(1,Math.min(3,Math.trunc(Number(tier)||1)));
 if(currentStyle()==='classic'&&isCompletedRework(id))return classicSvg(id,tier);
 if(window.BVBApprovedArt?.has(id))return window.BVBApprovedArt.svgFor(id,tier);
 if(id<16)return window.BVBElementalArt.svgFor(id,tier);
 if(id>=16&&id<32)return window.BVBSketch17to32.svgFor(id,tier);
 if(id>=32&&id<48)return window.BVBSketch33to48.svgFor(id,tier);
 if(id>=48&&id<64)return window.BVBSketch49to64.svgFor(id,tier);
 if(id>=64&&id<80)return window.BVBSketch65to80.svgFor(id,tier);
 const key=id*4+tier;if(svgCache.has(key))return svgCache.get(key);
 const col=palette[id]||B[id].c||'#94a3b8',grad='evo'+id+'_'+tier,blur='blur'+id+'_'+tier;
 const count=5+(id%8),offset=id*.347;
 let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" data-bvb-art-v2="1" data-ball-id="'+id+'" data-evolution="'+tier+'" style="--bvb-cycle:'+(2.2+(id%11)*.17)+'s">';
 svg+='<defs><radialGradient id="'+grad+'" cx="30%" cy="22%" r="80%"><stop stop-color="#fff"/><stop offset=".25" stop-color="'+col+'"/><stop offset=".78" stop-color="'+col+'" stop-opacity=".88"/><stop offset="1" stop-color="#0c1226"/></radialGradient><filter id="'+blur+'" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="3.2"/></filter></defs>';
 // Distinct points, proportions, halo orientation and geometry for each ID.
 for(let k=0;k<count;k++){const a=k*Math.PI*2/count+offset;svg+=circle(48+Math.cos(a)*36,48+Math.sin(a)*36,1.3+tier*.35,col);}
 svg+=circle(48,48,33,col,'filter="url(#'+blur+')" opacity=".22"');
 if(tier>=2){
  const a=id*17%180;svg+='<g class="bvb-evo-halo"><ellipse cx="48" cy="48" rx="'+(35+tier*2)+'" ry="'+(30+tier*2)+'" fill="none" stroke="'+col+'" stroke-width="'+tier+'" transform="rotate('+a+' 48 48)"/>';
  svg+=star(48,7,5,6+tier,3,'#fff9cf')+'</g>';
 }
 if(tier===3){svg+='<g class="bvb-evo-crown">'+[0,1,2,3,4,5,6].map(j=>{const a=j*2*Math.PI/7+offset;return star(48+42*Math.cos(a),48+42*Math.sin(a),5,4+(id%3),1.5,col)}).join('')+'</g>';}
 svg+='<g class="bvb-evo-core"><circle cx="48" cy="48" r="27.5" fill="url(#'+grad+')" stroke="'+col+'" stroke-width="2.3"/>';
 svg+=stroke('M30 35Q35 25 47 23','#fff',1.9)+core(id);
 // Eyes remain separate from the motif for per-ball independent animation.
 svg+='<g class="bvb-evo-eyes">'+angryFace(id,tier)+'</g></g>';
 if(tier>=2){svg+='<g class="bvb-evo-satellite">'+star(79,23,5,6+tier,2.7,col)+'</g>';}
 if(tier===3){svg+='<g class="bvb-evo-final">'+star(19,18,6,10,3.6,'#fff4b5')+stroke('M26 18Q49 4 73 18',col,2)+'</g>';}
 svg+='</svg>';svgCache.set(key,svg);return svg;
}
art=function(id,tier){return svgFor(id,tier==null?getBallStats(id).tier:tier);};
function imageForTier(id,tier){
 if(!Number.isInteger(id)||id<0||id>=B.length)return null;
 if(currentStyle()==='detailed'&&window.BVBApprovedArt?.has(id))return window.BVBApprovedArt.imageForTier(id,tier);
 const stage=Math.max(1,Math.min(3,Math.trunc(Number(tier)||1)));
 const key=(isCompletedRework(id)?currentStyle():'unchanged')+':'+id*4+':'+stage;
 if(!imageCache.has(key)){
  const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgFor(id,stage));imageCache.set(key,img);
 }
 return imageCache.get(key);
}
function imageFor(actor){
 if(!actor?.b)return null;
 const im=imageForTier(actor.b.id,actor.tier||getBallStats(actor.b.id).tier);
 return im?.complete&&im.naturalWidth?im:null;
}
const css=document.createElement('style');
css.textContent=[
 '.orb svg[data-bvb-art-v2]{overflow:visible}',
 '.orb svg[data-bvb-art-v2] .bvb-evo-core{transform-origin:48px 48px;animation:bvbHeart var(--bvb-cycle,3s) ease-in-out infinite alternate}',
 '.orb svg[data-bvb-art-v2] .bvb-evo-eyes{animation:bvbGlance 4.3s ease-in-out infinite}',
 '.orb svg[data-bvb-art-v2] .bvb-evo-halo{transform-origin:48px 48px;animation:bvbSpin 7s linear infinite}',
 '.orb svg[data-bvb-art-v2] .bvb-evo-satellite{transform-origin:48px 48px;animation:bvbSpin 4s linear infinite reverse}',
 '.orb{animation:bvbFloat 3.6s ease-in-out infinite alternate}',
 '.bs-card:nth-child(3n) .orb{animation-duration:4.2s}',
 '@keyframes bvbHeart{to{transform:scale(1.045)}}',
 '@keyframes bvbGlance{0%,24%,50%,100%{transform:translateX(0)}37%{transform:translateX(3px)}}',
 '.orb .bvb-cartoon-iris{animation:bvbEyeSearch 5s ease-in-out infinite}',
 '@keyframes bvbEyeSearch{0%,22%,55%,100%{transform:translateX(0)}33%,46%{transform:translateX(2px)}}',
 '@keyframes bvbSpin{to{transform:rotate(360deg)}}',
 '@keyframes bvbFloat{to{transform:translateY(-4px) rotate(3deg)}}',
 '@media(prefers-reduced-motion:reduce){.orb,.orb svg[data-bvb-art-v2] *{animation:none!important}}',
 'body.bvb-effects-off .orb,body.bvb-effects-off .orb *{animation:none!important}',
 'body.bvb-quality-low .orb,body.bvb-quality-low .orb *{animation:none!important}',
 'body.bvb-quality-low .bvb-evo-halo,body.bvb-quality-low .bvb-evo-crown,body.bvb-quality-low .bvb-evo-final{display:none}',
 'body.bvb-quality-medium .bvb-evo-crown,body.bvb-quality-medium .bvb-evo-final{opacity:.35}',
 'body .bvb-evo-halo,body .bvb-evo-crown,body .bvb-evo-final{opacity:var(--bvb-intensity,1)}',
 '.orb svg[data-preview-sheet] > circle{animation:bvbHeart 3.5s ease-in-out infinite alternate;transform-origin:48px 48px}',
 '.orb svg[data-bvb-art-v2][data-evolution="2"],.orb svg[data-bvb-art-v2][data-evolution="3"]{animation:bvbArrival .75s cubic-bezier(.16,1,.2,1) both}',
 '@keyframes bvbArrival{from{opacity:.35;transform:scale(.64) rotate(-18deg)}to{opacity:1;transform:scale(1) rotate(0)}}'
].join('\n');
document.head.appendChild(css);
function galleryHtml(id){
 id=Number(id);if(!Number.isInteger(id)||id<0||id>=B.length)return '';
 return '<section class="bvb-evo-gallery" aria-label="Wygląd trzech ewolucji">'+
  '<h3 style="margin:8px 0">🎨 Wygląd V1 / V2 / V3</h3>'+
  '<div class="bvb-evo-triptych">'+[1,2,3].map(t=>
   '<div class="bvb-evo-preview" data-stage="'+t+'"><strong>V'+t+'</strong>'+
   '<span class="orb" style="--s:76px;--oc:'+B[id].c+'">'+svgFor(id,t)+'</span></div>'
  ).join('')+'</div></section>';
}
const detailBeforeArt=openBallDetail;
openBallDetail=function(id){
 detailBeforeArt(id);
 const host=document.querySelector('#ovb');
 if(!host||!B[id])return;
 const preview=document.createElement('section');
 preview.innerHTML=galleryHtml(id);
 host.appendChild(preview);
};
css.textContent+='\n.bvb-evo-triptych{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin:10px 0 14px}'+
 '\n.bvb-evo-preview{min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;background:#121c37;border:1px solid #566aab;border-radius:12px;padding:9px 2px}'+
 '\n.bvb-evo-preview strong{color:#f8fafc}'+
 '\n.bvb-evo-preview .orb{--s:70px!important;max-width:100%}'+
 '\n.bvb-evo-preview[data-stage="3"]{border-color:#f7cf6b;box-shadow:0 0 12px #fbbf2450}';
window.BVBArtEvolution={count:B.length,tiers:3,signatures:Object.freeze(sig),svgFor,imageForTier,imageFor,colors:palette,galleryHtml,currentStyle,isCompletedRework,refreshVisualStyle};
ART_IMAGES.clear();preloadArt();
})();
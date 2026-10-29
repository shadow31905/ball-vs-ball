/* Presentation adapter; original menu and inventory remain intact. */
(()=>{'use strict';
const previous=art,frames=window.BVBBatch01Frames,images=new Map(),svgs=new Map();
function imageForTier(id,tier){const key=id*3+tier-1,f=frames[key];if(!f||f.id!==id)return null;if(!images.has(key)){const im=new Image();im.src='data:image/webp;base64,'+f.data;images.set(key,im);}return images.get(key);}
function svgFor(id,tier){if(!B[id])return '';tier=Math.max(1,Math.min(3,tier||1));const key=id*3+tier-1;if(svgs.has(key))return svgs.get(key);const f=frames[key];let svg=f&&f.id===id?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><image width="256" height="256" href="data:image/webp;base64,'+f.data+'"/></svg>':previous(id);svg=svg.replace('<svg ','<svg data-ball-id="'+id+'" data-evolution="'+tier+'" ');svgs.set(key,svg);return svg;}
window.BVBBatch01Art={imageForTier,svgFor};art=id=>svgFor(id,S.tr[id]||1);ART_IMAGES.clear();preloadArt();
const style=document.createElement('style');style.textContent='.orb{position:relative}.orb:has(>svg[data-ball-id]){background:transparent!important;box-shadow:none!important}.orb>svg[data-ball-id]{width:100%;height:100%}';document.head.appendChild(style);
window.BVBBetaArtReady=Promise.all(Array.from({length:13},(_,id)=>[1,2,3].map(t=>imageForTier(id,t).decode())).flat());
})();

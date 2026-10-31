/* Raster sprites prepared from the approved first-sixteen concept designs.
 * One small alpha texture per ball and evolution, shared by collection,
 * previews and combat. Presentation only: no simulation or save mutations.
 */
(()=>{
'use strict';
const names=Object.freeze(['Szarża','Topór','Trujący kolec','Złodziej','Ostrze','Karabin','Pająk','Wampir',
 'Włócznia','Rozbłysk','Szachy','Kostka','Lodowy Stożek','Laser','Wąż','Hak']);
const colors=Object.freeze(['#39dfff','#f95050','#96ed35','#b073ff','#83d5ff','#f8a346','#ae8aff','#fb345a',
 '#6ce5ec','#ffc64d','#ee4e56','#6de681','#76dbff','#ed4264','#85d95c','#83c8ef']);
const has=id=>Number.isInteger(id)&&id>=0&&id<16;
const stage=tier=>Math.max(1,Math.min(3,Math.trunc(Number(tier)||1)));
const frames=Object.freeze(names.flatMap((name,id)=>[1,2,3].map(tier=>Object.freeze({
 id,tier,name,width:256,height:256,
 source:'https://raw.githubusercontent.com/shadow31905/ball-vs-ball/c530aefe0b1546e24e181f0394c0da9501257438/assets/approved-first16/ball-'+String(id).padStart(2,'0')+'-v'+tier+'.webp'
}))));
const cache=new Map();
function frame(id,tier){return has(id)?frames[id*3+stage(tier)-1]:null;}
function imageForTier(id,tier){
 const f=frame(id,tier);if(!f)return null;
 const key=id*3+f.tier-1;
 if(!cache.has(key)){
  const image=new Image();image.crossOrigin='anonymous';image.decoding='async';image.src=f.source;cache.set(key,image);
 }
 return cache.get(key);
}
function svgFor(id,tier){
 if(window.BVBLiveFirst16)return window.BVBLiveFirst16.svgFor(id,tier);
 const f=frame(id,tier);if(!f)return '';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" '+
  'aria-label="'+f.name+' V'+f.tier+'" data-bvb-art-v2="1" data-approved-art="1" '+
  'data-ball-id="'+f.id+'" data-evolution="'+f.tier+'">'+
  '<image href="'+f.source+'" width="128" height="128" preserveAspectRatio="xMidYMid meet"/></svg>';
}
function state(){
 const loaded=[...cache.values()].filter(image=>image.complete&&image.naturalWidth>0).length;
 return {ready:loaded===48,frames:loaded,cached:cache.size};
}
// Preload once; all subsequent callers reuse exactly these 48 images.
function preload(){
 return Promise.all(frames.map(f=>{
  const image=imageForTier(f.id,f.tier);
  if(image.complete)return Promise.resolve(image.naturalWidth>0);
  return new Promise(resolve=>{
   image.addEventListener?.('load',()=>resolve(true),{once:true});
   image.addEventListener?.('error',()=>resolve(false),{once:true});
  });
 }));
}
window.BVBApprovedArt=Object.freeze({count:16,tiers:3,names,colors,frames,has,frame,svgFor,imageForTier,state,ready:preload()});
})();

'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const out=path.join(__dirname,'..','out-game-source-sketch');
fs.mkdirSync(out,{recursive:true});
const win={};
const context=vm.createContext({window:win,console,Math,Number,String,Array,Object,Set,Map});
for(const file of ['bvb-sketch-art-16-31.js','bvb-sketch-art-32-47.js','bvb-sketch-art-48-63.js']){
 vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context,{filename:file,timeout:15000});
}
const baseNames=['Szarża','Topór','Trujący kolec','Złodziej','Ostrze','Karabin','Pająk','Wampir','Włócznia','Rozbłysk','Szachy','Kostka','Lodowy Stożek','Laser','Wąż','Hak'];
const baseColors=['#39dfff','#f95050','#96ed35','#b073ff','#83d5ff','#f8a346','#ae8aff','#fb345a','#6ce5ec','#ffc64d','#ee4e56','#6de681','#76dbff','#ed4264','#85d95c','#83c8ef'];
const catalog=[];
const dest=path.join(out,'svg');
fs.mkdirSync(dest,{recursive:true});
for(let id=0;id<=48;id++){
 let name,color,origin='actual-game';
 let api;
 if(id<16){name=baseNames[id];color=baseColors[id];origin='approved-first16-raster';}
 else if(id<32){api=win.BVBSketch17to32;const c=api.concepts[id-16];name=c.name;color=c.main;origin='beta-17-32-svg';}
 else if(id<48){api=win.BVBSketch33to48;const c=api.concepts[id-32];name=c.name;color=c.base;origin='beta-33-48-svg';}
 else {api=win.BVBSketch49to64;const c=api.concepts[0];name=c.name;color=c.main;origin='beta-49-svg';}
 const paths=[];
 for(let tier=1;tier<=3;tier++){
  const stem='ball-'+String(id).padStart(2,'0')+'-v'+tier;
  let src;
  if(id<16){
   src='assets/approved-first16/'+stem+'.webp';
   if(!fs.existsSync(path.join(__dirname,'..',src)))throw Error('Missing actual sprite '+src);
  }else{
   const svg=api.svgFor(id,tier,'detailed');
   if(!svg.includes('<svg')||!svg.includes('</svg>'))throw Error('Invalid SVG '+stem);
   src='svg/'+stem+'.svg';fs.writeFileSync(path.join(out,src),svg);
  }
  paths.push(src);
 }
 catalog.push({id,name,color,origin,paths});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({title:'BALL VS BALL 0–48 — real in-game sprites',balls:catalog},null,2));
console.log('Actual 0–48 game identities and 147 V1/V2/V3 sprites prepared:',catalog.map(x=>x.id+' '+x.name).join('; '));

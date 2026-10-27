'use strict';
// Runs the actual game and all combat wrappers without rendering or timers.
// This checks simulation behavior, not DOM layout or browser compatibility.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..');
function createGame(){
 const elements=new Map(),storage=new Map();
 const noop=()=>{};
 const context2d=new Proxy({measureText:t=>({width:String(t).length*7}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]||noop});
 function element(id=''){
   if(elements.has(id))return elements.get(id);
   const e={id,hidden:false,innerHTML:'',textContent:'',value:'',dataset:{},style:{setProperty:noop,removeProperty:noop},classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},
    append:noop,appendChild:noop,prepend:noop,remove:noop,replaceChildren:noop,insertAdjacentElement:noop,insertAdjacentHTML:noop,addEventListener:noop,removeEventListener:noop,
    setAttribute:noop,getAttribute:()=>null,removeAttribute:noop,querySelector:selector=>element(selector),querySelectorAll:()=>[],getBoundingClientRect:()=>({x:0,y:0,width:360,height:360,left:0,top:0}),
    getContext:()=>context2d,contains:()=>false,closest:()=>null,focus:noop,click:noop,width:360,height:360};
   elements.set(id,e);return e;
 }
 const document={querySelector:element,querySelectorAll:()=>[],getElementById:id=>element('#'+id),createElement:()=>element(Symbol()),addEventListener:noop,head:element('head'),body:element('body'),documentElement:element('html'),hidden:false};
 const c={console,document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)},
  location:{pathname:'/',search:'',href:'http://localhost/',origin:'http://localhost',protocol:'http:'},
  navigator:{vibrate:noop},crypto:{randomUUID:()=> 'fixture-match'},performance:{now:()=>0},
  requestAnimationFrame:noop,cancelAnimationFrame:noop,setTimeout:()=>0,clearTimeout:noop,setInterval:()=>0,clearInterval:noop,
  URL,URLSearchParams,AbortSignal,structuredClone,Date,Math,innerWidth:430,innerHeight:900,devicePixelRatio:1,
  Image:class{constructor(){this.complete=false;this.naturalWidth=0;}},addEventListener:noop,dispatchEvent:noop,CustomEvent:class{},confirm:()=>true,alert:noop,matchMedia:()=>({matches:false,addEventListener:noop})};
 c.window=c;vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(root,'bvb-save.js'),'utf8'),c,{filename:'bvb-save.js'});
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g))if(m[1].trim())vm.runInContext(m[1],c,{filename:'index.html'});
 for(const file of ['bvb-anime-update.js','bvb-gameplay.js','bvb-campaign.js','bvb-abilities-v2.js','bvb-abilities-00-15.js','bvb-art-preview-02.js','bvb-art-evolution.js','bvb-motion-results.js','bvb-signature-motion.js','bvb-identities.js','bvb-balance.js','bvb-modes.js','bvb-network.js','bvb-combat-rework.js','bvb-presentation.js']){
  if(fs.existsSync(path.join(root,file)))vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});
 }
 return {context:c,run:code=>vm.runInContext(code,c),storage};
}
module.exports={createGame};
if(require.main===module){const game=createGame();console.log(game.run("({balls:B.length,mode:G?.m,profile:!!S})"));game.run("startMatch(0);pick(0);for(let i=0;i<3600&&G.ph==='battle';i++)step(1/60)");console.log(game.run("({phase:G.ph,time:G.rt,hp:G.bl.map(o=>o.hp)})"));}

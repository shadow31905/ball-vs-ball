/* Local profile integrity and safe import. Client validation is not anti-cheat:
   a trusted server must authorize ranked results and account-owned rewards. */
(() => {
'use strict';
const LIMITS=Object.freeze({bytes:1024*1024,nodes:50000,depth:16,array:10000,string:65536});
const dangerous=new Set(['__proto__','prototype','constructor']);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x,k);
function copyJSON(raw){
 let nodes=0;const stack=new Set();
 function copy(value,depth){
  if(++nodes>LIMITS.nodes||depth>LIMITS.depth)throw new Error('Zapis jest zbyt złożony.');
  if(value===null||typeof value==='boolean')return value;
  if(typeof value==='number')return Number.isFinite(value)?value:null;
  if(typeof value==='string'){if(value.length>LIMITS.string)throw new Error('Pole zapisu jest za długie.');return value;}
  if(typeof value!=='object')return undefined;
  if(stack.has(value))throw new Error('Zapis zawiera cykl.');
  stack.add(value);let out;
  if(Array.isArray(value)){
   if(value.length>LIMITS.array)throw new Error('Tablica zapisu jest za duża.');
   out=value.map(v=>copy(v,depth+1)??null);
  }else{
   out={};
   const keys=Object.keys(value);if(keys.length>4096)throw new Error('Zapis zawiera zbyt wiele pól.');
   for(const key of keys){
    if(dangerous.has(key))throw new Error('Niebezpieczne pole w zapisie.');
    if(key.length>128)throw new Error('Nazwa pola zapisu jest za długa.');
    const descriptor=Object.getOwnPropertyDescriptor(value,key);
    if(descriptor.get||descriptor.set)throw new Error('Zapis musi zawierać wyłącznie dane JSON.');
    const next=copy(descriptor.value,depth+1);if(next!==undefined)out[key]=next;
   }
  }
  stack.delete(value);return out;
 }
 const clean=copy(raw,0);
 if(JSON.stringify(clean??null).length*2>LIMITS.bytes)throw new Error('Zapis przekracza limit rozmiaru.');
 return clean;
}
function integer(value,fallback=0,min=0,max=Number.MAX_SAFE_INTEGER){
 const n=typeof value==='number'?value:typeof value==='string'&&value.trim()!==''?Number(value):NaN;
 return Number.isFinite(n)?Math.max(min,Math.min(max,Math.floor(n))):fallback;
}
const flag=(v,otherwise=false)=>v===true||v===1?true:v===false||v===0?false:otherwise;
const record=v=>obj(v)?v:{};
const text=(v,fallback='',limit=128)=>typeof v==='string'?v.slice(0,limit):fallback;
function ints(value,min,max,base=[]){
 return [...new Set([...base,...(Array.isArray(value)?value:[]).filter(v=>Number.isInteger(v)&&v>=min&&v<=max)])];
}
function idMap(value,transform,max=129){
 const out={};
 for(const [key,v] of Object.entries(record(value)))if(/^(0|[1-9][0-9]*)$/.test(key)&&+key<=max)out[key]=transform(v,+key);
 return out;
}
function counterMap(value,max=129){return idMap(value,v=>integer(v,0,0,2147483647),max);}
function quests(value,keys,claimedMax){
 const q=record(value);
 for(const key of keys)q[key]=integer(q[key],0,0,2147483647);
 q.cl=ints(q.cl,0,claimedMax);return q;
}
function sanitize(raw){
 const source=copyJSON(obj(raw)?raw:{}),s=source;
 const initial=!!source.initReward;
 s.ver=integer(s.ver,4,1,100);s.initReward=1;
 s.coins=integer(s.coins,initial?0:100);s.candies=integer(s.candies,initial?0:50);
 for(const key of ['xp','wins','g','best','binf','bb'])s[key]=integer(s[key],0,0,2147483647);
 s.lv=integer(s.lv,1,1,2147483647);
 s.own=ints(s.own,0,129,[0,1,2]);
 for(const key of ['dup','dupV2'])s[key]=counterMap(s[key]);
 s.tr=idMap(s.tr,v=>integer(v,1,1,3));
 for(const key of ['upDmg','upHp'])s[key]=idMap(s[key],v=>integer(v,0,0,5));
 s.bk=idMap(s.bk,v=>{const stats=record(v);stats.g=integer(stats.g,0,0,2147483647);stats.w=integer(stats.w,0,0,2147483647);return stats;});
 s.fav=counterMap(s.fav);
 s.bossWins=counterMap(s.bossWins,5);
 s.bdt=record(s.bdt);
 for(const key of Object.keys(s.bdt)){const value=s.bdt[key];s.bdt[key]=typeof value==='string'&&!/[<>]/.test(value)?value.slice(0,128):typeof value==='number'&&Number.isFinite(value)?value:'';}
 for(const key of ['ac','hist','rewardIds'])s[key]=Array.isArray(s[key])?s[key]:[];
 s.q=quests(s.q,['play','win','gacha','bn','rare','tw'],99);s.q.d=text(s.q.d,'',64);
 s.q.tb=s.own.includes(s.q.tb)?s.q.tb:s.own[0];
 s.hwq=quests(s.hwq,['hwwin','hwplay','hwbox'],99);
 s.wq=quests(s.wq,['win','play','boss'],99);s.wq.k=integer(s.wq.k,-1,-1);
 s.bp=quests(s.bp,['p'],19);s.bp.m=integer(s.bp.m,-1,-1);
 s.ach=record(s.ach);s.ach.winsByArena=idMap(s.ach.winsByArena,v=>flag(v),5);
 s.ach.portals=integer(s.ach.portals);s.ach.bounces=integer(s.ach.bounces);
 s.ach.claimed=Array.isArray(s.ach.claimed)?[...new Set(s.ach.claimed.filter(v=>typeof v==='string'&&v.length<=80))]:[];
 s.playerTitle=text(s.playerTitle,'',128);
 s.playerAura=typeof s.playerAura==='string'&&/^#[0-9a-f]{3,8}$/i.test(s.playerAura)?s.playerAura:'';
 s.nm=text(s.nm,'Gracz',16);s.av=text(s.av,'😎',32);
 // The avatar is interpolated as HTML by legacy profile rendering.
 if(/[<>&"']/.test(s.av))s.av='😎';
 s.ms=flag(s.ms)?1:0;s.mm=flag(s.mm)?1:0;
 s.o=record(s.o);
 for(const [key,fallback] of Object.entries({vm:.7,vs:.8})){
  const value=typeof s.o[key]==='number'?s.o[key]:Number(s.o[key]);
  s.o[key]=Number.isFinite(value)&&s.o[key]!==null?Math.max(0,Math.min(1,value)):fallback;
 }
 for(const key of ['nd','sk','pq','vb'])s.o[key]=flag(s.o[key],true)?1:0;
 if(own(s.o,'fxLevel'))s.o.fxLevel=integer(s.o.fxLevel,3,0,3);
 s.arenaCfg=idMap(s.arenaCfg,v=>{
  const cfg=record(v);cfg.obstacles=flag(cfg.obstacles,true);cfg.fx=flag(cfg.fx,true);cfg.count=integer(cfg.count,3,0,8);return cfg;
 },5);
 s.arenaPick=s.arenaPick==='manual'?'manual':'random';
 s.th=integer(s.th,0,0,5);s.lastArena=integer(s.lastArena,-1,-1,5);
 s.sh=record(s.sh);s.eq=record(s.eq);
 for(const [key,max] of [['tr',5],['sk',5],['vf',3]]){
  s.sh[key]=ints(s.sh[key],0,max,[0]);s.eq[key]=s.sh[key].includes(s.eq[key])?s.eq[key]:0;
 }
 s.campaign=record(s.campaign);
 s.campaign.unlocked=integer(s.campaign.unlocked,1,1,50);
 s.campaign.cleared=ints(s.campaign.cleared,1,50);
 s.campaign.stars=ints(s.campaign.stars,1,50);
 s.campaign.deck=ints(s.campaign.deck,0,129).filter(id=>s.own.includes(id)).slice(0,3);
 for(const id of s.own){if(s.campaign.deck.length>=3)break;if(!s.campaign.deck.includes(id))s.campaign.deck.push(id);}
 s.campaign.finalWon=flag(s.campaign.finalWon);
 s.mastery=idMap(s.mastery,v=>{
  const m=record(v);m.fights=integer(m.fights,0,0,2147483647);m.wins=Math.min(m.fights,integer(m.wins,0,0,2147483647));return m;
 });
 return s;
}
function parse(text){
 if(typeof text!=='string'||text.length*2>LIMITS.bytes)throw new Error('Nieprawidłowy rozmiar zapisu.');
 const raw=JSON.parse(text);
 if(!obj(raw)||!Array.isArray(raw.own))throw new Error('Plik nie zawiera profilu Ball VS Ball.');
 return sanitize(raw);
}
function transactionalImport({storage,key,text,apply=()=>{},rollback=()=>{},backupKey=key+'_backup_before_import'}){
 let previous,hadPrevious=false,wrote=false;
 try{
  const state=parse(text),serialized=JSON.stringify(state);
  previous=storage.getItem(key);hadPrevious=previous!==null;
  // A failed backup aborts the import before the active save is touched.
  if(hadPrevious)storage.setItem(backupKey,previous);
  storage.setItem(key,serialized);wrote=true;
  apply(state);return {ok:true,state,backupKey:hadPrevious?backupKey:null};
 }catch(error){
  let rollbackError;
  if(wrote){
   try{if(hadPrevious)storage.setItem(key,previous);else storage.removeItem(key);}catch(e){rollbackError=e;}
   try{rollback();}catch(e){rollbackError=rollbackError||e;}
  }
  return {ok:false,error:String(error.message||error),rollbackError:rollbackError?String(rollbackError.message||rollbackError):null};
 }
}
window.BVBSave={sanitize,parse,transactionalImport,limits:LIMITS};
})();
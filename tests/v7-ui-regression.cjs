// Regression smoke tests for V7 beta menu, using a synthetic DOM/game state.
// They do NOT replace full browser and multiplayer E2E testing.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const script=fs.readFileSync(path.join(__dirname,'..','bvb-menu-2-5.js'),'utf8');
const nativeMenu=fs.readFileSync(path.join(__dirname,'..','bvb-main-menu-v3.js'),'utf8');
new Function(script);new Function(nativeMenu);
function game({coins=1250,owned=[],date='2026-11-07T16:05:00+01:00'}={}){
 const S={coins,own:[...owned],q:{gacha:0},lv:1,xp:0,nm:'Tester'};
 const B=[{id:0,n:'Pryzmat',e:'💎',r:2},{id:1,n:'Wampir',e:'🧛',r:3},{id:2,n:'Feniks',e:'🔥',r:4}];
 const timers=[],saves=[],events=[];
 class Element{
  constructor(){Object.assign(this,{dataset:{},style:{},children:[],hidden:false,isConnected:true,innerHTML:'',textContent:'',handlers:{},clientWidth:500,offsetLeft:0,offsetWidth:101})}
  setAttribute(){}append(...x){this.children.push(...x)}prepend(...x){this.children.unshift(...x)}
  addEventListener(name,cb){this.handlers[name]=cb}
  querySelector(q){return q==='#bvb-fm-screen'?view:q==='.bvb-roll-track'?track:q==='.bvb-roll-window'?viewport:q==='[data-n="23"]'?target:null}
 }
 const root=new Element(),native=new Element(),view=new Element(),track=new Element(),viewport=new Element(),target=new Element(),elements={};
 target.offsetLeft=23*108;
 const document={readyState:'complete',head:{append(){}},createElement:()=>new Element(),
  getElementById:id=>id==='bvb-film-menu'?root.children[0]||null:null,
  querySelector:q=>q==='#menu'?root:q==='#bvb3Home'?native:(elements[q] ||=new Element()),
  addEventListener(){}};
 const window={__BVB_QA_NOW:Date.parse(date),SFX:{rare:()=>events.push('rare')},
  setTimeout:(cb)=>{timers.push(cb);return timers.length},panel:(where)=>events.push('panel:'+where),pull:()=>events.push('pull')};
 new Function('window','document','S','B','crypto','fetch','MutationObserver','location','performance','requestAnimationFrame','setInterval','setTimeout','save','orb',script)(
  window,document,S,B,{getRandomValues:a=>{a[0]=0}},
  async()=>({ok:false,headers:{get:()=>null}}),class{observe(){}},
  {hostname:'localhost',href:'http://localhost'}, {now:()=>0}, cb=>cb(),()=>1,()=>1,
  ()=>saves.push({coins:S.coins,owned:[...S.own]}),b=>'<div class="orb">'+b.n+'</div>');
 const page=root.children[0];
 return {S,B,view,window,saves,events,timers,click:k=>page.handlers.click({target:{closest:sel=>sel==='button[data-act]'?{dataset:{act:k}}:null}})};
}
let n=0;
function test(label,fn){fn();n++;process.stdout.write('PASS '+label+'\n')}
test('Campaign is coming soon and spends no currency',()=>{
 const h=game();h.click('campaign');assert.match(h.view.innerHTML,/WKRÓTCE/);assert.equal(h.S.coins,1250);
});
test('Native collection is used',()=>{
 const h=game();h.click('collection');assert.ok(h.events.includes('panel:col'));
});
test('Epic draw is saved once, reel matches actual win and finishes',()=>{
 const h=game();h.click('purchase-epic');assert.equal(h.S.coins,950);assert.deepEqual(h.S.own,[0]);assert.equal(h.saves.length,1);
 assert.equal(h.view.dataset.mode,'rolling');assert.match(h.view.innerHTML,/data-n="23"/);h.timers.forEach(f=>f());assert.equal(h.view.dataset.mode,'result');assert.match(h.view.innerHTML,/Pryzmat/);
});
test('No money means no reward and no save',()=>{
 const h=game({coins:10});h.click('purchase-epic');assert.equal(h.S.coins,10);assert.equal(h.saves.length,0);
});
test('Duplicates refund exactly 40 coins',()=>{
 const h=game({coins:1000,owned:[0]});h.click('purchase-epic');assert.equal(h.S.coins,740);assert.deepEqual(h.S.own,[0]);assert.equal(h.saves.length,1);
});
test('Locked chest is not purchasable before unlock',()=>{
 const h=game({coins:1000,date:'2026-11-07T15:59:00+01:00'});h.click('purchase-epic');assert.equal(h.S.coins,1000);assert.equal(h.saves.length,0);
});
test('Normal chest keeps original gacha handler',()=>{
 const h=game({coins:200});h.click('purchase-normal');assert.ok(h.events.includes('pull'));assert.equal(h.saves.length,0);
});
test('Old reel timer cannot overwrite a second reel',()=>{
 const h=game({coins:1000});h.click('purchase-epic');h.click('crates');h.click('purchase-epic');
 assert.equal(h.S.coins,440);h.timers[0]();assert.equal(h.view.dataset.mode,'rolling');h.timers[1]();assert.equal(h.view.dataset.mode,'result');
});
test('Native mode does not bypass WKRÓTCE screen',()=>{
 assert.match(nativeMenu,/window.BVBFilmMenuBeta\?\.openCampaignSoon/);
 assert.match(script,/openCampaignSoon:\(\)=>action\('campaign'\)/);
});
test('Replay entry is absent from the new menu',()=>{
 assert.ok(!script.includes("${btn('replays','Powtórki')}"));
});
process.stdout.write(n+' synthetic smoke tests passed; real-world gameplay/E2E remains required.\n');
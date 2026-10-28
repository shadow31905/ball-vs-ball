'use strict';
/* Offline, ONE-FILE, isolated user playtest. This never touches the stable
 * game or Pages deployment. Every other ball uses the base game's original
 * portrait; only actual game IDs 32..47 use the third batch rework.
 */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
const {buildBeta}=require('./build-beta.cjs');
const root=path.resolve(__dirname,'..');
const output=path.resolve(process.env.BVB_ONLY_OUTPUT||path.join(root,'only-33-48'));
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'bvb-33-48-'));
buildBeta(scratch,process.env.BVB_SOURCE_REVISION||'isolated-33-48');
const load=name=>fs.readFileSync(path.join(scratch,name),'utf8');
const isolatedKey='bvb_only_rework_33_48_v1';
const changes=[];
function replace(source,before,after,label){
 assert.ok(source.includes(before),'Cannot safely isolate game: '+label);
 changes.push(label);
 return source.replace(before,after);
}
const scripts={};
for(const name of fs.readdirSync(scratch).filter(x=>/^bvb-.*\.js$/.test(x))){
 scripts[name]=load(name);
}
// 0–15: the original sprites are not replaced with previous rework textures.
scripts['bvb-approved-art-00-15.js']=String.raw`
(()=>{window.BVBApprovedArt=Object.freeze({
  count:0,colors:null,frames:[],has:()=>false,frame:()=>null,
  svgFor:()=>'',imageForTier:()=>null,state:()=>({ready:true}),ready:Promise.resolve()
});})();
`;
// 17–32: never invoke this rework in battle or preview; keep the original art.
scripts['bvb-sketch-art-16-31.js']+="\n;window.BVBSketch17to32.drawCombatSprite=()=>false;window.BVBSketch17to32.renderCombat=()=>{};\n";
// The only active evolution portraits must be game IDs 32..47 (labels 33–48).
let art=scripts['bvb-art-evolution.js'];
art=replace(art,
 'const completedReworkIds=new Set(Array.from({length:32},(_,id)=>id));',
 'const completedReworkIds=new Set(Array.from({length:16},(_,n)=>n+32));','exclusive visual stage gate');
const tierMark='tier=Math.max(1,Math.min(3,Math.trunc(Number(tier)||1)));';
const at=art.indexOf('function svgFor(id,tier){');
assert.ok(at>=0,'Missing artwork renderer');
const prefix=art.slice(0,at),renderer=art.slice(at);
const override=String.raw`
 // 33–48 ONLY: other IDs show the untouched original game's artwork.
 if(id<32||id>=48)return previous(id,1);
 return window.BVBSketch33to48.svgFor(id,tier,currentStyle());
`;
assert.ok(renderer.includes(tierMark));
scripts['bvb-art-evolution.js']=prefix+renderer.replace(tierMark,tierMark+override);
// No rework effects from earlier/later art batches; keep only 33–48.
let signatures=scripts['bvb-signature-motion.js'];
signatures=replace(signatures,
 'function draw(ctx,o,g){\n if(window.BVBApprovedArt?.has(o?.b?.id))return;',
 'function draw(ctx,o,g){\n if(!o?.b||o.b.id<32||o.b.id>=48)return old(ctx,o,g);\n if(window.BVBApprovedArt?.has(o?.b?.id))return;',
 'disable other batches combat art');
scripts['bvb-signature-motion.js']=signatures;
// Dedicated test panel with just 16 original IDs, isolated skill stages.
let tools=scripts['bvb-beta-tools.js'];
tools=replace(tools,
 "if(!/(?:^|\\/)beta(?:\\/|$)/.test(location.pathname) ||",
 "if(!document.querySelector('meta[name=\"bvb-only-33-48\"]') ||",'single-file beta test panel');
tools=replace(tools,
 "typeof K==='undefined'||K!=='bvb_beta_rework_v4'",
 "typeof K==='undefined'||K!=='"+isolatedKey+"'",
 'separate test save key');
tools=replace(tools,"const target=byId('bvbBetaTarget');",
 "const target=byId('bvbBetaTarget');\nconst subset=B.filter(b=>b.id>=32&&b.id<48);",
 'only sixteen selectable balls');
tools=replace(tools,"for(const b of B){","for(const b of subset){",'panel options restricted');
tools=replace(tools,"S.own=B.map(b=>b.id);save();","S.own=subset.map(b=>b.id);save();",'only sixteen unlocked');
tools=replace(tools,"for(const b of B)S.tr[b.id]=value;","for(const b of subset)S.tr[b.id]=value;",'only sixteen evolution presets');
tools=replace(tools,"B.every(b=>(S.tr?.[b.id]||1)===t)","subset.every(b=>(S.tr?.[b.id]||1)===t)",'only sixteen preset selection');
tools=replace(tools,"const selected=target.value;",
 "const selected=target.value;",'selected target unchanged');
tools=tools.replaceAll("130 kulek","16 kulek").replaceAll("130 kulek","16 kulek").replaceAll("wszystkich 130","wszystkich 16");
tools=tools.replaceAll("130 kulek", "16 kulek");
tools=replace(tools,
 "selected!=='all'&&(!/^\\d+$/.test(selected)||!B[Number(selected)])",
 "selected!=='all'&&(!/^\\d+$/.test(selected)||!subset.some(b=>b.id===Number(selected)))",
 'reject balls outside 33–48 in test panel');
tools=replace(tools,
 "if(target.value!=='all'&&B[Number(target.value)])G.trainingOpponentId=Number(target.value);",
 "if(target.value!=='all'&&subset.some(b=>b.id===Number(target.value)))G.trainingOpponentId=Number(target.value);",
 'training opponent restricted');
tools=replace(tools,"window.BVBBetaAdmin={open,close};",
 "if(!subset.every(b=>S.own.includes(b.id))||S.own.some(id=>id<32||id>=48))unlockAll();\nwindow.BVBBetaAdmin={open,close};",
 'only 16 unlocked by default');
scripts['bvb-beta-tools.js']=tools;
// No cloud or PeerJS network dependency; local training/combat remain available.
let html=load('index.html');
// The isolated offline playtest has no cloud login. Never block the test menu.
html=replace(html,'<div id="accountGate" class="account-gate"',
 '<div id="accountGate" hidden class="account-gate"','skip cloud-only login gate');
html=replace(html,"let K = 'bvb_beta_rework_v4';",
  "let K = '"+isolatedKey+"';",'separate player profile');
html=html.replace(/<script\s+src="https:\/\/unpkg\.com\/peerjs[^"]*"\s*><\/script>\s*/ig,'');
// The standalone version opens from file:// or content:// without CORS scripts.
let inlined=0;
html=html.replace(/<script\s+src="\.\/(bvb-[a-z0-9-]+\.js)"\s*(?:defer\s*)?><\/script>/gi,
 (full,name)=>{
   assert.ok(Object.prototype.hasOwnProperty.call(scripts,name),'Missing required game file '+name);
   inlined++;
   return '<script data-inlined-game="'+name+'">\n'+scripts[name].replace(/<\/script/gi,'<\\/script')+'\n</script>';
 });
assert.ok(inlined>=25,'Did not inline full game; scripts remaining='+inlined);
assert.ok(!/<script[^>]+src="\.\/bvb-/i.test(html),'Found external JS requirement in standalone game');
html=replace(html,'<meta name="bvb-beta-build"',
 '<meta name="bvb-only-33-48" content="ONLY 33–48"><meta name="bvb-beta-build"',
 'isolated build marker');
html=html.replace(/<title>[^<]*<\/title>/,'<title>Ball VS Ball · TEST TYLKO 33–48</title>');
// Standalone beta menu presents a single test build, not earlier rework reports.
html=replace(html,'</body>',
 '<style>#bvbOnlyNotice{position:fixed;bottom:0;left:0;right:0;z-index:125;'+
 'padding:5px 10px;text-align:center;font:12px system-ui;color:#e6faff;'+
 'background:#142344ed;border-top:1px solid #43e6a2;pointer-events:none}'+
 '</style><div id="bvbOnlyNotice">TEST: TYLKO REWORK KULEK 33–48 · V1/V2/V3 · BEZ CHMURY</div></body>',
 'clearly marked third batch only');
fs.mkdirSync(output,{recursive:true});
const filename='BALL_VS_BALL_TEST_TYLKO_33-48.html';
fs.writeFileSync(path.join(output,filename),html);
fs.writeFileSync(path.join(output,'JAK_URUCHOMIC.txt'),
 'BALL VS BALL — TEST TYLKO KULEK 33–48\n\n'+
 'Otwórz plik BALL_VS_BALL_TEST_TYLKO_33-48.html w przeglądarce (komputer lub telefon).\n'+
 'W grze dostępny jest panel TEST z kulkami 33–48 oraz V1, V2 i V3.\n'+
 'To osobny lokalny zapis, bez chmury; główna gra pozostaje bez zmian.\n'+
 'Wersja offline: multiplayer internetowy wymaga osobnej wersji sieciowej.\n');
console.log(JSON.stringify({
 output,html:filename,htmlBytes:Buffer.byteLength(html,'utf8'),
 inlinedScripts:inlined,artRestrictedTo:'IDs 32–47 only',
 sourceRevision:process.env.BVB_SOURCE_REVISION||'isolated-33-48',
 transformed:changes
},null,2));

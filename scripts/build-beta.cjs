'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
function buildBeta(out,revision='working-tree'){
 fs.mkdirSync(out,{recursive:true});
 const names=fs.readdirSync(root).filter(n=>/^bvb-.*\.js$/.test(n)&&n!=='bvb-accounts.js');
 const manifest={sourceRevision:revision,builtAt:new Date().toISOString(),files:{}};
 for(const name of names){
 let source=fs.readFileSync(path.join(root,name),'utf8');
 if(name==='bvb-abilities-v2.js'){
  // Replace only the BETA copy. The normal game/engine stays untouched.
  const label="['train','Widmowy Pociąg','Odbicie przywołuje linię torów i przejeżdżający pociąg.']";
  if(!source.includes(label)||!source.includes("if(d.kind==='train'){"))throw Error('Conductor beta integration markers missing');
  source=source.replace(label,"['train','Żelazny Szlak','Tory powstają za kulką aż do limitu. Pociąg jedzie po całej trasie i jej zakrętach, usuwając za sobą szyny.']")
   .replace("if(d.kind==='train'){","if(d.kind==='train'&&o.b.id!==33){")
   .replace("case 'train':{zone(o,o.x,o.y,kind,22,3,.7);","case 'train':{if(o.b.id===33)break;zone(o,o.x,o.y,kind,22,3,.7);");
 }
 if(name==='bvb-combat-ui.js')source=source.replace("const storeKey='bvb-rework-view-v1';","const storeKey='bvb-beta-rework-view-v1';");fs.writeFileSync(path.join(out,name),source);manifest.files[name]=crypto.createHash('sha256').update(source).digest('hex');}
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 // Never accidentally ship beta-only controls through the stable entrypoint.
 if(html.includes('<script src="./bvb-beta-tools.js"></script>')||
    html.includes('id="bvbBetaPanelOpen"'))throw Error('Beta admin panel leaked into stable index.html');
 if(!names.includes('bvb-beta-tools.js'))throw Error('Beta admin module missing from bundle');
 for(const name of ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','./supabase-config.js','./bvb-accounts.js']){
  html=html.split('\n').filter(line=>!line.includes('<script src="'+name+'"')).join('\n');
 }
 if(!html.includes("let K = 'bvb_hw_120_v3';"))throw Error('Profile key marker missing: beta isolation cannot be guaranteed');
 html=html.replace("let K = 'bvb_hw_120_v3';","let K = 'bvb_beta_rework_v4';");
 const conductorOld="['Konduktor','ϟ',2,'#fde047','Leczy się od ścian, a co 4 odbicia wyzwala falę uderzeniową.']";
 const tierMarker="  S.tr = (S.tr && typeof S.tr === 'object') ? S.tr : {};";
 if(!html.includes(conductorOld)||!html.includes(tierMarker))throw Error('Beta Conductor / unlock integration marker missing');
 html=html.replace(conductorOld,"['Konduktor','🚂',2,'#c28f56','Po osiągnięciu limitu torów ułożonych za kulką pociąg przejeżdża po ich rzeczywistej trasie, także na zakrętach.']")
  .replace(tierMarker,tierMarker+'\n'+
   '  // BETA ONLY: every ball and all 3 evolutions are available to test.\n'+
   '  S.own = B.map(b => b.id);\n'+
   '  S.coins = Math.max(100000, Number(S.coins) || 0);\n'+
   '  S.candies = Math.max(100000, Number(S.candies) || 0);\n'+
   '  for(const b of B){S.dup[b.id]=Math.max(20,Number(S.dup[b.id])||0);S.dupV2[b.id]=Math.max(20,Number(S.dupV2[b.id])||0);}')
  .replace('</body>','<script src="./bvb-conductor-tracks-beta.js"></script>\n<script src="./bvb-beta-batch26-38-controls.js"></script>\n<script src="./bvb-beta-batch39-51.js"></script>\n<script src="./bvb-beta-tools.js"></script>\n</body>')
  .replace('<title>','<meta name="bvb-beta-build" content="'+String(revision).replace(/[^a-zA-Z0-9._/-]/g,'')+'"><title>BETA · ');
 fs.writeFileSync(path.join(out,'index.html'),html);manifest.files['index.html']=crypto.createHash('sha256').update(html).digest('hex');
 fs.writeFileSync(path.join(out,'build.json'),JSON.stringify(manifest,null,2));
 fs.writeFileSync(path.join(out,'README.md'),'# Ball VS Ball — beta\n\nOsobny zapis bvb_beta_rework_v4; brak logowania i połączenia z chmurą. Panel administratora dostępny TYLKO w becie umożliwia nadawanie monet/cukierków, odblokowanie 130 kulek i przełączanie rzeczywistych V1/V2/V3 (pojedynczo lub zbiorczo). Stabilna gra i jej zapis nie są zmieniane.\n\nŹródło: '+revision+'\n');
 return manifest;
}
module.exports={buildBeta};
if(require.main===module){const out=process.env.BVB_BETA_OUTPUT||path.join(root,'../beta-build');console.log(JSON.stringify({out,...buildBeta(out,process.env.BVB_SOURCE_REVISION||'working-tree')},null,2));}

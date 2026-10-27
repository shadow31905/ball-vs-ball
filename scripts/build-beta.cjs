'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..');
function buildBeta(out,revision='working-tree'){
 fs.mkdirSync(out,{recursive:true});
 const names=fs.readdirSync(root).filter(n=>/^bvb-.*\.js$/.test(n)&&n!=='bvb-accounts.js');
 const manifest={sourceRevision:revision,builtAt:new Date().toISOString(),files:{}};
 for(const name of names){let source=fs.readFileSync(path.join(root,name),'utf8');if(name==='bvb-combat-ui.js')source=source.replace("const storeKey='bvb-rework-view-v1';","const storeKey='bvb-beta-rework-view-v1';");fs.writeFileSync(path.join(out,name),source);manifest.files[name]=crypto.createHash('sha256').update(source).digest('hex');}
 // Raster textures are runtime dependencies just like the scripts.
 const assetDir=path.join(root,'assets','approved-first16');
 for(const name of fs.readdirSync(assetDir).filter(n=>/^ball-\d{2}-v[123]\.webp$/.test(n))){
  const rel='assets/approved-first16/'+name,bytes=fs.readFileSync(path.join(assetDir,name));
  fs.mkdirSync(path.join(out,'assets','approved-first16'),{recursive:true});
  fs.writeFileSync(path.join(out,rel),bytes);
  manifest.files[rel]=crypto.createHash('sha256').update(bytes).digest('hex');
 }
 let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 // Never accidentally ship beta-only controls through the stable entrypoint.
 if(html.includes('<script src="./bvb-beta-tools.js"></script>')||
    html.includes('id="bvbBetaPanelOpen"'))throw Error('Beta admin panel leaked into stable index.html');
 if(!names.includes('bvb-beta-tools.js'))throw Error('Beta admin module missing from bundle');
 for(const name of ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','./supabase-config.js','./bvb-accounts.js']){
  html=html.split('\n').filter(line=>!line.includes('<script src="'+name+'"')).join('\n');
 }
 if(!html.includes("let K = 'bvb_hw_120_v3';"))throw Error('Profile key marker missing: beta isolation cannot be guaranteed');
 html=html.replace("let K = 'bvb_hw_120_v3';","let K = 'bvb_beta_rework_v4';")
  .replace('</body>','<script src="./bvb-beta-tools.js"></script>\n</body>')
  .replace('<title>','<meta name="bvb-beta-build" content="'+String(revision).replace(/[^a-zA-Z0-9._/-]/g,'')+'"><title>BETA · ');
 fs.writeFileSync(path.join(out,'index.html'),html);manifest.files['index.html']=crypto.createHash('sha256').update(html).digest('hex');
 fs.writeFileSync(path.join(out,'build.json'),JSON.stringify(manifest,null,2));
 fs.writeFileSync(path.join(out,'README.md'),'# Ball VS Ball — beta\n\nOsobny zapis bvb_beta_rework_v4; brak logowania i połączenia z chmurą. Panel administratora dostępny TYLKO w becie umożliwia nadawanie monet/cukierków, odblokowanie 130 kulek i przełączanie rzeczywistych V1/V2/V3 (pojedynczo lub zbiorczo). Stabilna gra i jej zapis nie są zmieniane.\n\nŹródło: '+revision+'\n');
 return manifest;
}
module.exports={buildBeta};
if(require.main===module){const out=process.env.BVB_BETA_OUTPUT||path.join(root,'../beta-build');console.log(JSON.stringify({out,...buildBeta(out,process.env.BVB_SOURCE_REVISION||'working-tree')},null,2));}

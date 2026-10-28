'use strict';
// Private, isolated first-batch beta. Source game and stable branch are unchanged.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {buildBeta}=require('./build-beta.cjs');
const root=path.join(__dirname,'..');
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
const ensure=(x,why)=>{if(!x)throw new Error(why)};
function buildBatch1(out=path.join(root,'beta-batch1'),revision='working-tree'){
 const manifest=buildBeta(out,revision);
 const htmlPath=path.join(out,'index.html');
 let html=fs.readFileSync(htmlPath,'utf8');
 const needle='const B = RAW_BALLS.map(([n, e, r, c, d], id) => ({ id, n, e, r, c, d }));';
 ensure(html.includes(needle),'Ball list structure changed; cannot guarantee 13-only content');
 html=html.replace(needle,needle.replace('RAW_BALLS.map','RAW_BALLS.slice(0, 13).map'));
 const keyNeedle="let K = 'bvb_beta_rework_v4';";
 ensure(html.includes(keyNeedle),'Beta save isolation marker missing');
 html=html.replace(keyNeedle,"let K = 'bvb_beta_batch1_13_only_v1';");
 // No public multiplayer or account integration is needed for this offline visual beta.
 html=html.split('\n').filter(line=>!line.includes('src="https://unpkg.com/peerjs@')).join('\n');
 ensure(html.includes('</body>'),'HTML body marker missing');
 html=html.replace('</body>','<script src="./bvb-batch1-beta.js"></script>\n</body>');
 fs.writeFileSync(htmlPath,html);
 manifest.files['index.html']=digest(html);
 const mode=fs.readFileSync(path.join(root,'bvb-batch1-beta.js'),'utf8');
 fs.writeFileSync(path.join(out,'bvb-batch1-beta.js'),mode);
 manifest.files['bvb-batch1-beta.js']=digest(mode);
 const names=fs.readdirSync(path.join(out,'assets','approved-first16')).filter(n=>/^ball-\d{2}-v[123]\.webp$/.test(n));
 ensure(names.length===48,'Expected 48 raster textures from approved first16 source');
 // Single HTML file also works as a standalone download on a phone, without a server.
 const assets={};
 for(const file of names){
  const m=/ball-(\d{2})-v([123])\.webp/.exec(file);
  assets[Number(m[1])+'-'+m[2]]='data:image/webp;base64,'+fs.readFileSync(path.join(out,'assets','approved-first16',file)).toString('base64');
 }
 let single=html.replace('</head>','<script>window.__BVB_BATCH1_ASSETS='+JSON.stringify(assets).replace(/</g,'\\u003c')+';</script>\n</head>');
 let bundled=0;
 single=single.replace(/<script src="\.\/([^"]+\.js)"><\/script>/g,(_,file)=>{
  const filePath=path.join(out,file);
  ensure(fs.existsSync(filePath),'Missing script: '+file);
  let code=fs.readFileSync(filePath,'utf8');
  if(file==='bvb-approved-art-00-15.js'){
   const old="source:'./assets/approved-first16/ball-'+String(id).padStart(2,'0')+'-v'+tier+'.webp'";
   ensure(code.includes(old),'Approved-art source expression changed');
   code=code.replace(old,"source:window.__BVB_BATCH1_ASSETS[id+'-'+tier]");
  }
  bundled++;
  return '<script>\n'+code.replace(/<\/script/gi,'<\\/script')+'\n</script>';
 });
 ensure(bundled>=20,'Standalone bundler missed local scripts: '+bundled);
 ensure(!/<script[^>]+src=["']\.\/[^"']+/.test(single),'Standalone file still has external local scripts');
 ensure(single.includes('bvb_beta_batch1_13_only_v1'),'Standalone save isolation missing');
 const standalone=path.join(out,'ball-vs-ball-partia-1.html');
 fs.writeFileSync(standalone,single);
 manifest.files['ball-vs-ball-partia-1.html']=digest(single);
 const readme=[
 'BALL VS BALL - BETA PARTIA 1',
 '13 kulek ID 0-12: Szarża, Topór, Trujący kolec, Złodziej, Ostrze, Karabin, Pająk, Wampir, Włócznia, Rozbłysk, Szachy, Kostka, Lodowy Stożek.',
 'NA TELEFONIE: Otwórz plik ball-vs-ball-partia-1.html w przeglądarce obsługującej lokalny HTML. Wszystkie grafiki i animacje są w środku.',
 'NA KOMPUTERZE: Otwórz plik HTML albo użyj lokalnego serwera: python -m http.server 8765.',
 'W menu wybierz Kolekcja. Panel V1 / V2 / V3 przełącza etapy. Przycisk GRAJ uruchamia normalną walkę z kulkami tylko z tej partii.',
 'Jest to izolowana beta bez logowania i bez publikacji online. Postęp ma osobny klucz zapisu. To prawdziwy kod gry, nie animowana makieta.',
 'UWAGA: szczegółowy odbiór graficzny nadal wymaga oceny. Mechanika potrójnego ataku Wampira 1-20 HP nie jest jeszcze wdrożona.',
 'Źródło: '+revision,
 ].join('\n')+'\n';
 fs.writeFileSync(path.join(out,'README.txt'),readme);
 manifest.files['README.txt']=digest(readme);
 fs.writeFileSync(path.join(out,'build.json'),JSON.stringify(manifest,null,2));
 return {revision,count:13,tiers:3,variants:39,standalone,standaloneBytes:Buffer.byteLength(single),bundledScripts:bundled,manifest};
}
module.exports={buildBatch1};
if(require.main===module)console.log(JSON.stringify(buildBatch1(process.env.BVB_BATCH1_OUTPUT||path.join(root,'beta-batch1'),process.env.BVB_SOURCE_REVISION||'working-tree'),null,2));
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const loader=fs.readFileSync(path.join(root,'index.html'),'utf8');
const admin=fs.readFileSync(path.join(root,'bvb-beta-tools.js'),'utf8');

test('beta bootloader contains syntactically valid JavaScript',()=>{
 const found=loader.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(found,'bootloader must have exactly one inline script');
 new vm.Script(found[1],{filename:'beta-loader.js'});
});

test('beta inherits all 32 original game fragments',()=>{
 const paths=[...loader.matchAll(/rework\/game-(\d+)\.txt/g)].map(x=>Number(x[1]));
 assert.deepEqual(paths,Array.from({length:32},(_,i)=>i));
});

test('beta cannot reuse live-game localStorage key',()=>{
 assert.ok(loader.includes('bvb_beta_25_isolated_v1'));
 assert.ok(loader.includes('if(source.split(stableKey).length!==2)'));
 assert.ok(loader.includes('source=source.replace(stableKey'));
 assert.ok(loader.includes('bvb_backup_before_wielki_rework_v1'));
});

test('beta strips cloud scripts before rendering',()=>{
 for(const p of ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','./supabase-config.js','./bvb-accounts.js'])
   assert.ok(loader.includes(p));
 assert.ok(loader.includes("source=source.replaceAll(originalTag,'')"));
});

test('test panel is guarded and isolated from stable game',()=>{
 assert.ok(loader.includes('bvb-beta-tools.js'));
 assert.ok(loader.includes('bvb-beta-build'));
 assert.ok(admin.includes("K!=='bvb_beta_25_isolated_v1'"));
 assert.ok(admin.includes('bvbBetaUnlockAll'));
 assert.ok(admin.includes('bvbBetaApplyTier'));
 assert.ok(admin.includes('bvbBetaSaveCurrencies'));
 assert.ok(!admin.includes("K!=='bvb_beta_rework_v4'"));
});

test('beta is not deployed by its own workflow',()=>{
 assert.ok(!fs.existsSync(path.join(root,'beta','index.html')));
});

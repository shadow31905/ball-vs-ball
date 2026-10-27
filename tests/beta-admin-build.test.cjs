'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {buildBeta}=require('../scripts/build-beta.cjs');
const root=path.join(__dirname,'..');

test('beta-only admin panel is injected into isolated bundle, never stable HTML',()=>{
 const original=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.equal(original.includes('<script src="./bvb-beta-tools.js"></script>'),false,
  'stable index must never load the admin panel');
 assert.equal(original.includes('bvbBetaPanelOpen'),false,
  'stable HTML must not render beta admin controls');
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'ball-vs-ball-beta-test-'));
 try{
  const result=buildBeta(dir,'unit-beta-admin');
  assert.equal(result.sourceRevision,'unit-beta-admin');
  const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  const admin=fs.readFileSync(path.join(dir,'bvb-beta-tools.js'),'utf8');
  const info=JSON.parse(fs.readFileSync(path.join(dir,'build.json'),'utf8'));
  assert.equal(html.split('<script src="./bvb-beta-tools.js"></script>').length-1,1,
   'beta must load the admin module exactly once');
  assert.ok(html.includes("let K = 'bvb_beta_rework_v4';"),'beta needs a distinct save key');
  assert.ok(!html.includes("let K = 'bvb_hw_120_v3';"),'stable key must not be used by beta');
  assert.ok(html.includes('name="bvb-beta-build"'));
  assert.ok(!html.includes('<script src="./bvb-accounts.js"></script>'));
  assert.ok(admin.includes("K!=='bvb_beta_rework_v4'"),'module must require isolated profile');
  assert.ok(admin.includes('meta[name="bvb-beta-build"]'),'module must verify beta marker');
  assert.ok(admin.includes('bvbBetaSaveCurrencies'));
  assert.ok(admin.includes('bvbBetaUnlockAll'));
  assert.ok(admin.includes('bvbBetaApplyTier'));
  assert.ok(info.files['bvb-beta-tools.js']&&info.files['index.html']);
  const textures=Object.keys(info.files).filter(n=>n.endsWith('.webp'));
  assert.equal(textures.length,48,'beta must contain all evolution textures');
  for(const name of textures)assert.deepEqual(fs.readFileSync(path.join(dir,name)),fs.readFileSync(path.join(root,name)));

  assert.equal(fs.readFileSync(path.join(root,'index.html'),'utf8'),original,
   'the packager must never modify stable index');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

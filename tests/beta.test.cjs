'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {buildBeta}=require('../scripts/build-beta.cjs');
test('beta packages every local runtime dependency and isolates profile, cloud and replay preferences',()=>{
 const out=fs.mkdtempSync(path.join(os.tmpdir(),'bvb-beta-'));
 try{
  const manifest=buildBeta(out,'verified-test-source'),html=fs.readFileSync(path.join(out,'index.html'),'utf8');
  assert.ok(html.includes("let K = 'bvb_beta_rework_v4'"));assert.ok(!html.includes("let K = 'bvb_hw_120_v3'"));
  assert.ok(!html.includes('bvb-accounts.js'));assert.ok(!html.includes('supabase-config.js'));assert.ok(!html.includes('supabase-js'));
  for(const m of html.matchAll(/<script src="\.\/([^"]+)"/g))assert.ok(fs.existsSync(path.join(out,m[1])),'missing runtime '+m[1]);
  assert.ok(html.includes('bvb-training.js'));assert.ok(html.includes('bvb-presentation.js'));
  assert.ok(fs.readFileSync(path.join(out,'bvb-combat-ui.js'),'utf8').includes("storeKey='bvb-beta-rework-view-v1'"));
  assert.equal(manifest.sourceRevision,'verified-test-source');assert.equal(manifest.files['index.html'].length,64);
 }finally{assert.ok(path.resolve(out).startsWith(path.resolve(os.tmpdir())+path.sep+'bvb-beta-'));fs.rmSync(out,{recursive:true,force:true});}
});

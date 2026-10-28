'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const {buildBatch1}=require('../scripts/build-batch1-beta.cjs');
const expected=['Szarża','Topór','Trujący kolec','Złodziej','Ostrze','Karabin','Pająk','Wampir','Włócznia','Rozbłysk','Szachy','Kostka','Lodowy Stożek'];
test('beta exports exactly 13 actual balls, 39 accessible evolutions, isolated persistence',()=>{
 const out=fs.mkdtempSync(path.join(os.tmpdir(),'bvb-batch1-'));
 try{
  const result=buildBatch1(out,'automated-test');
  assert.equal(result.count,13);
  assert.equal(result.variants,39);
  assert.ok(result.bundledScripts>=20);
  const html=fs.readFileSync(path.join(out,'index.html'),'utf8');
  const single=fs.readFileSync(path.join(out,'ball-vs-ball-partia-1.html'),'utf8');
  assert.ok(html.includes('const B = RAW_BALLS.slice(0, 13).map'));
  assert.ok(!html.includes('const B = RAW_BALLS.map('));
  assert.ok(html.includes("let K = 'bvb_beta_batch1_13_only_v1'"));
  assert.ok(!html.includes('bvb_hw_120_v3'));
  assert.ok(!html.includes('bvb_beta_rework_v4'));
  assert.ok(!html.includes('src="https://unpkg.com/peerjs@'));
  assert.ok(!html.includes('supabase-js@2'));
  assert.ok(!html.includes('src="./bvb-accounts.js"'));
  assert.ok(single.includes('window.BVBBatch1Beta'));
  assert.ok(!/<script[^>]*src=["']\.\/[^"']+\.js/.test(single));
  assert.equal((single.match(/data:image\/webp;base64,/g)||[]).length,48);
  assert.ok(fs.statSync(path.join(out,'assets','approved-first16','ball-12-v3.webp')).size>0);
  const listed=[...html.matchAll(/^\s*\['([^']+)','/gm)].slice(0,13).map(m=>m[1]);
  assert.deepEqual(listed,expected);
  const m=JSON.parse(fs.readFileSync(path.join(out,'build.json'),'utf8'));
  for(const [rel,hash] of Object.entries(m.files)){
   const bytes=fs.readFileSync(path.join(out,rel));
   assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),hash,rel);
  }
  assert.ok(result.standaloneBytes>100000);
  assert.ok(!single.includes('src="./bvb-approved-art-00-15.js"'));
 }finally{fs.rmSync(out,{recursive:true,force:true});}
});
const {chromium,firefox,webkit}=require('playwright');const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
(async()=>{const name=process.argv[2]||'chromium',out='evidence/'+name;fs.mkdirSync(out,{recursive:true});const b=await({chromium,firefox,webkit}[name]).launch({headless:true});const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('file://'+path.resolve('beta.html'));await p.waitForFunction(()=>window.BVBBatch1Beta?.ready);const hash=crypto.createHash('sha256').update(fs.readFileSync('beta.html')).digest('hex');
const evaluate=num=>p.evaluate(fs.readFileSync('scenario-'+num+'.js','utf8'));
try{
 for(const num of ['007','008','009']){
  let cases;
  if(num==='008'){
   const a=await evaluate('006'),c=await evaluate('007');
   const mechanisms=['zmiana toru i odbicie','kolejne powroty topora','ciernie między ścianami i rozgałęzienia','powracające/przenikające sztylety oraz kradzież','spowolnienie spiralą i końcowe ogłuszenie','osobne salwy i zapalające przegrzanie','lepkie pułapki i kokon','bank krwi oraz impuls grozy','odtworzenie przebicia z kotwicy i drugi cios','odbicie fali i reakcja łańcuchowa','wieża i królowa','pamięć rzutu i kombinacja sześciu wyników','iglice tworzone przy ścianie'];
   cases=a.map((x,i)=>({id:x.id,mechanism:mechanisms[i],v1ToV2:x,v2ToV3:c.find(y=>y.id===x.id),status:x.status==='PASS'&&c.find(y=>y.id===x.id)?.status==='PASS'?'PASS':'FAIL'}));
  }else cases=await evaluate(num);
  const status=cases.length===(num==='009'?39:13)&&cases.every(c=>c.status==='PASS')&&!errors.length?'PASS':'FAIL';
  const report={test:num,browser:name,htmlSha256:hash,scope:'Scenariusze kontrolowane; bez pełnej macierzy rywali, aren i urządzeń',status,cases,errors:[...errors]};
  fs.writeFileSync(out+'/'+num+'.json',JSON.stringify(report,null,2));console.log('TEST'+num+'_RESULT='+JSON.stringify({browser:name,status,total:cases.length,passed:cases.filter(x=>x.status==='PASS').length,failures:cases.filter(x=>x.status!=='PASS'),errors}));
  if(status!=='PASS'){process.exitCode=1;break;}
 }
}finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

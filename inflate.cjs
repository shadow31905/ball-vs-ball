const fs=require('node:fs'),zlib=require('node:zlib'),crypto=require('node:crypto');
let text=zlib.gunzipSync(Buffer.from(fs.readFileSync('qa-beta.html.gz.b64','utf8'),'base64')).toString('utf8');
text=text.replace(/window\.__BVB_BATCH1_ASSETS=(\{.*?\});/s,(whole,raw)=>{
const assets=JSON.parse(raw);for(const key of Object.keys(assets))assets[key]='data:image/webp;base64,'+fs.readFileSync(assets[key]).toString('base64');return 'window.__BVB_BATCH1_ASSETS='+JSON.stringify(assets)+';';});
const hash=crypto.createHash('sha256').update(text).digest('hex');
const expected=process.env.BVB_EXPECTED_SHA256;
if(expected&&hash!==expected)throw Error('Wrong beta SHA256: '+hash+' expected '+expected);
fs.writeFileSync('beta.html',text);console.log('BETA_SHA256='+hash);

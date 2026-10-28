const fs=require('node:fs'),crypto=require('node:crypto');const patch=JSON.parse(fs.readFileSync('patch-007.json','utf8'));let text=fs.readFileSync('beta.html','utf8');
for(const c of patch.changes){if(text.split(c.from).length!==2)throw Error('Patch does not match source');text=text.replace(c.from,c.to);}
const hash=crypto.createHash('sha256').update(text).digest('hex');if(hash!==patch.expectedSha256)throw Error('Patched beta SHA256 mismatch');fs.writeFileSync('beta.html',text);console.log('PATCHED_BETA_SHA256='+hash);

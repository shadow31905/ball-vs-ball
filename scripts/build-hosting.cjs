'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),stable=path.join(root,'stable-original'),out=path.join(root,'_site');
const expected='f1ce9dc1e4e9c2846323d44c2cf85d77f90708ae';
const sha=cp.execFileSync('git',['-C',stable,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(sha!==expected)throw Error('Original main changed. Review its latest version before hosting; no deployment made.');
if(fs.existsSync(out))throw Error('Refuse to overwrite an existing build directory');
fs.mkdirSync(out);const hashes={};
function original(dir,relative=''){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(entry.name==='.git')continue;const rel=path.posix.join(relative,entry.name),src=path.join(dir,entry.name),dst=path.join(out,rel);if(entry.isDirectory()){fs.mkdirSync(dst,{recursive:true});original(src,rel);}else if(entry.isFile()){fs.copyFileSync(src,dst);const source=fs.readFileSync(src),copy=fs.readFileSync(dst);if(!source.equals(copy))throw Error('Original file changed while copying: '+rel);hashes[rel]=crypto.createHash('sha256').update(copy).digest('hex');}else throw Error('Unexpected non-file in original snapshot');}}
original(stable);const beta=path.join(out,'beta');if(fs.existsSync(beta))throw Error('Original already owns /beta/; do not replace it');fs.mkdirSync(beta);
for(const name of fs.readdirSync(root))if(name==='index.html'||/^bvb-.*\.js$/.test(name))fs.copyFileSync(path.join(root,name),path.join(beta,name));
fs.writeFileSync(path.join(beta,'build.json'),JSON.stringify({betaRevision:process.env.GITHUB_SHA||'local',originalRevision:expected,ballIds:Array.from({length:16},(_,i)=>i),multiplayer:false,originalFilesSHA256:hashes},null,2));
console.log('Original files verified byte-for-byte; 16-ball offline beta added only under /beta/.');

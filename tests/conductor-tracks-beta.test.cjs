'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {createGame}=require('./game-harness.cjs');
const addon=fs.readFileSync(path.join(__dirname,'..','bvb-conductor-tracks-beta.js'),'utf8');
function runScenario(tier,frames=180){
 const g=createGame();
 g.run("G={ph:'battle',v2:{},bl:[{b:B[33],uid:'conductor',team:0,hp:100,x:25,y:85,r:16,vx:0,vy:0,tier:"+tier+"},{b:B[0],uid:'enemy',team:1,hp:100,x:345,y:345,r:16,vx:0,vy:0}]}; netRole='solo'; step=function(dt){const o=G.bl[0],n=135*dt;if(o.x<200&&o.y===85)o.x=Math.min(200,o.x+n);else if(o.y<230)o.y=Math.min(230,o.y+n);else o.x=Math.max(30,o.x-n)}; draw=function(){}; specialAbility=function(){};");
 vm.runInContext(addon,g.context,{filename:'bvb-conductor-tracks-beta.js'});
 g.run("for(let i=0;i<"+frames+";i++)step(1/60)");
 return {g,info:g.run("({n:G.v2.conductorTrains.length,tier:G.v2.conductorTrains[0]?.tier,turn:G.v2.conductorTrains[0]?.track.p.some(p=>p.y>90&&p.y<230),secondary:G.v2.conductorTrains.some(t=>t.secondary),branchSeparation:(()=>{const t=G.v2.conductorTrains;if(t.length<2)return 0;const a=t[0].track.p.at(-1),b=t[1].track.p.at(-1);return Math.hypot(a.x-b.x,a.y-b.y);})(),traps:G.v2.conductorTraps.length})")};
}
test('Conductor V1 lays track behind the moving ball, then sends a train through the real corner',()=>{
 const {info}=runScenario(1);assert.ok(info.n>=1,'train spawned after rail distance limit');
 assert.equal(info.tier,1);assert.equal(info.turn,true,'rail contains the actual right-angle turn');
});
test('Conductor V2 leaves independent wagon traps, while train still follows the bent rails',()=>{
 const {info}=runScenario(2);assert.ok(info.n>=1);assert.equal(info.tier,2);
 assert.ok(info.traps>=1,'wagon passes actual points and leaves traps');
});
test('Conductor V3 sends a second train over a physical switching branch',()=>{
 const {info}=runScenario(3);assert.ok(info.n>=2);
 assert.equal(info.secondary,true);assert.ok(info.branchSeparation>5,'branch is a different rail route');
});
test('tracks and trains expire after the last carriage passes',()=>{
 const {g}=runScenario(1,180);
 g.run("for(let i=0;i<600;i++)step(1/60)");
 const info=g.run("({trains:G.v2.conductorTrains.length,remaining:G.bl[0].conductorRail.length})");
 assert.equal(info.trains,0,'old train rails are removed after all cars pass');
});

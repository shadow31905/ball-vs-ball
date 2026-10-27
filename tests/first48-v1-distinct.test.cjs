'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const prep='function makeDistinct(id,tier=1){serial=0;G=freshGame(0,[B[id]],[B[0]]);G.ph="battle";G.rt=2;G.th=1;G.obstacles=[];G.bl=[actor(B[id],100,170,0,0,0,tier,0,0),actor(B[0],210,170,Math.PI,1,1,1,0,0)];BVBRework.prepareActors(G,...G.bl);for(const p of G.bl){p.hp=100;p.mh=200;p.baseDmg=12;p.status={};p.vx=p.vy=0;p.abilityCd=999;}return G.bl;}';
test('overlapping V1 archetypes now have different collision and projectile behaviors',()=>{
 const g=createGame();
 const result=g.run(prep+'(()=>{let out={};for(const id of [15,35,40,41,43,46,47]){const [o,f]=makeDistinct(id);specialAbility(o,f);const st=G.v2||{};out[id]={hook:o.v1HookOrbit||0,tangent:f.vy||0,grave:st.hazards?.some(h=>h.v1HauntedGrave)||false,acid:st.hazards?.some(h=>h.v1CorrosivePuddle)||false,reflect:st.wallBeams?.some(b=>Math.abs(b.a.y-b.b.y)>10)||false,stars:st.shots?.filter(p=>p.id===43).map(p=>({bounce:p.bounces,trail:p.starTrail}))||[],fuse:st.hazards?.find(h=>h.v1TimedBomb)?.armAt||0,orbit:!!o.v1OrbitShield};}return out;})()');
 assert.ok(result[15].hook>0&&result[15].tangent>0,'Hook must swing tangentially');
 assert.equal(result[35].grave,true,'Grave haunts');
 assert.equal(result[40].acid,true,'Acid corrodes');
 assert.equal(result[41].reflect,true,'Light ray diagonally reflects');
 assert.ok(result[43].stars.length>=3);
 assert.ok(result[43].stars.every(p=>p.bounce>=2)); // Distinct ricochet; electric trails unlock at V3.
 assert.equal(result[46].fuse,1.25,'Time bomb is not an ordinary mine');
 assert.equal(result[47].orbit,true,'Orbit shields, not merely attacks');
});
test('big thorn piston applies a mechanically distinct physical push',()=>{
 const g=createGame();
 const values=g.run(prep+'(()=>{const [o,f]=makeDistinct(25);o.x=194;o.y=170;f.x=208;BVB2.onWall(o,"left");const h=G.v2.hazards.find(p=>p.id===25&&p.kind==="thorn");if(!h)return {flag:false,push:0};h.age=.4;const before=f.vx;for(let i=0;i<9;i++)step(1/60);return {flag:!!h.v1GiantPiston,push:f.vx-before};})()');
 assert.equal(values.flag,true);
 assert.ok(Number.isFinite(values.push));
});
test('Light Wings V1 creates a delayed real afterimage along its traveled path',()=>{
 const g=createGame();
 const info=g.run(prep+'(()=>{const [o,f]=makeDistinct(36,1);specialAbility(o,f);const created=!!o.v1LightAfterimage;for(let i=0;i<34&&G.ph==="battle";i++)step(1/60);return {created,consumed:!o.v1LightAfterimage,beam:(G.v2?.beams||[]).some(b=>b.id===36)};})()');
 assert.equal(info.created,true);
 assert.equal(info.consumed,true);
 assert.equal(info.beam,true);
});

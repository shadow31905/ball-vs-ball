'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const fixture=`
function chessCase(tier=1){
 serial=0;G=freshGame(4,[B[10]],[B[0]]);G.ph='battle';G.m=4;G.th=1;G.rt=0;
 G.obstacles=[];G.fx=[];G.pop=[];G.rings=[];
 G.bl=[actor(B[10],105,180,0,0,0,tier,0,0),actor(B[0],310,290,Math.PI,1,1,1,0,0)];
 BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,1010+tier);
 for(const o of G.bl){o.hp=300;o.mh=300;o.abilityCd=999;o.contact=999;o.vx=0;o.vy=0;
  o.baseDmg=10;o.identity=null;o.status={};o.armor=0;}
 return G.bl;
}
`;
const run=expr=>createGame().run(fixture+'('+expr+')()');
test('Skoczek: six genuine two-segment L routes',()=>{
 const r=run(`()=>{
  chessCase(1);
  const routes=BVBChessBeta.paths('knight');
  return {count:routes.length,valid:routes.every(r=>{
    const [a,b,c]=r.points;
    const dx=b.x-a.x,dy=b.y-a.y,ex=c.x-b.x,ey=c.y-b.y;
    return (dx===0||dy===0)&&(ex===0||ey===0)&&(dx*ex+dy*ey===0)&&
      Math.abs(Math.hypot(dx,dy)-86)<.001&&Math.abs(Math.hypot(ex,ey)-43)<.001;
  })};
 }`);
 assert.equal(r.count,6);assert.equal(r.valid,true);
});
test('V1/V2/V3 add real phases and 100% attack immunity',()=>{
 const rows=run(`()=>{
  const result=[];
  for(const tier of [1,2,3]){
   const [o,foe]=chessCase(tier);specialAbility(o,foe);
   const c=o.chess,hp=o.hp;applyDamage(o,100);
   result.push({tier,active:c.active,phases:[...new Set(c.routes.map(p=>p.phase))],
     count:c.routes.length,shield:o.hp===hp,first:c.routes[0].piece,
     second:c.routes.find(p=>p.phase===2)?.piece,finishing:c.routes.filter(p=>p.phase===3).length});
  }return result;
 }`);
 assert.ok(rows.every(x=>x.active&&x.shield));
 assert.deepEqual(Array.from(rows[0].phases),[1]);
 assert.deepEqual(Array.from(rows[1].phases),[1,2]);
 assert.deepEqual(Array.from(rows[2].phases),[1,2,3]);
 assert.equal(rows[2].finishing,3);assert.notEqual(rows[2].first,rows[2].second);
 assert.ok(rows[1].count>=10&&rows[2].count>=13);
});
test('warnings never inflict damage, missing a route never inflicts damage',()=>{
 const r=run(`()=>{
  const [o,foe]=chessCase(1);o.x=180;o.y=180;
  // Keep a moving-AI opponent outside every segment to isolate a true miss.
  const park=()=>{foe.x=330;foe.y=330;foe.vx=0;foe.vy=0;};
  park();
  const hp=foe.hp;
  o.chess={active:true,phase:'warn',routes:[{piece:'knight',phase:1,speed:390,damage:7,
   points:[{x:180,y:180},{x:266,y:180},{x:266,y:223}]}],
   index:0,dist:0,warning:.25,lastPhase:0};
  for(let i=0;i<10;i++){park();step(1/60);}
  const warningHP=foe.hp;
  for(let i=0;i<120&&o.chess?.active;i++){park();step(1/60);}
  return{hp,warningHP,finalHP:foe.hp,finished:!o.chess,cooldown:o.abilityCd};
 }`);
 assert.equal(r.warningHP,r.hp);assert.equal(r.finalHP,r.hp);
 assert.ok(r.finished);assert.ok(r.cooldown>4.7);
});

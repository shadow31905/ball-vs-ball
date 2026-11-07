'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
const setup=`
function medicFixture(tier,hp=60){
 serial=0;G=freshGame(4,[B[48]],[B[0]]);G.ph='battle';G.m=4;G.th=1;G.rt=2;
 G.obstacles=[];G.pop=[];G.fx=[];G.rings=[];
 G.bl=[actor(B[48],85,175,0,0,0,tier,0,0),actor(B[0],290,175,Math.PI,1,1,1,0,0)];
 BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,3048);
 for(const a of G.bl){a.hp=100;a.mh=100;a.baseDmg=12;a.abilityCd=999;
  a.contact=999;a.vx=0;a.vy=0;a.status={};a.identity=null;}
 G.bl[0].hp=hp;return G.bl;
}
function medicAdvance(seconds){for(let i=0;i<seconds*60&&G.ph==='battle';i++)step(1/60);}
`;
function run(code){return createGame().run(setup+'(()=>{'+code+'})()');}
test('Medyk 48 V1 heals and shields but does not create an evolved object',()=>{
 const x=run("const [o,f]=medicFixture(1);const hp=o.hp;specialAbility(o,f);return {heal:o.hp-hp,shield:o.status.shield,station:o.v2MedicStation||null};");
 assert.ok(x.heal>=7&&x.shield>=5);assert.equal(x.station,null);
});
test('Medyk 48 V2 station heals its owner in range with strictly limited charges',()=>{
 const x=run("const [o,f]=medicFixture(2);specialAbility(o,f);const before=o.hp;const station={...o.v2MedicStation};medicAdvance(.45);return {before,after:o.hp,station,charges:o.v2MedicStation?.charges};");
 assert.equal(x.station.level,1);assert.equal(x.station.charges,3);
 assert.equal(x.station.life,3.5);assert.ok(x.after>x.before);
 assert.ok(x.charges<x.station.charges);
 const away=run("const [o,f]=medicFixture(2);specialAbility(o,f);o.x=320;o.y=320;medicAdvance(.45);return {charges:o.v2MedicStation?.charges};");
 assert.equal(away.charges,3,'leaving the marked area must prevent healing');
});
test('Medyk 48 V3 rescues exactly once at critical health, preserves stronger station',()=>{
 const x=run("const [o,f]=medicFixture(3,18);o.status.poison=1;specialAbility(o,f);const initial=o.hp;medicAdvance(.08);const first=o.hp;const shield=o.status.shield;const used=o.v2MedicStation?.emergencyUsed;medicAdvance(.08);return {initial,first,after:o.hp,shield,used,poison:o.status.poison,level:o.v2MedicStation?.level,charges:o.v2MedicStation?.charges};");
 assert.equal(x.level,2);assert.equal(x.charges,4);
 assert.ok(x.first>=x.initial+8);assert.equal(x.used,true);
 assert.ok(x.shield>=13);assert.equal(x.poison,0);
 assert.equal(x.after,x.first,'rescue must trigger at most once');
});
test('Medyk 48 station expires and new SVG / descriptions match V2 and V3',()=>{
 const x=run("const [o,f]=medicFixture(3);specialAbility(o,f);o.hp=o.mh=20000;f.hp=f.mh=20000;medicAdvance(4.1);return {station:o.v2MedicStation||null,svg:art(48),v2:BVB2.evolutionDescription(48,2),v3:BVB2.evolutionDescription(48,3)};");
 assert.equal(x.station,null);assert.ok(x.svg.includes('data-signature-id="48"'));
 assert.match(x.v2,/stacja pierwszej pomocy/);assert.match(x.v3,/defibrylator/);
});

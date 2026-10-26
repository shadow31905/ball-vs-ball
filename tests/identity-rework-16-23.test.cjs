'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

// These are per-identity mechanical acceptance tests, not only a comparison
// of colorful VFX or the JSON snapshots from authored-evolutions.test.cjs.
const fixture=`
function personalCase(id,tier,distance=75){
 serial=0;G=freshGame(4,[B[id]],[B[0]]);
 G.ph='battle';G.m=4;G.th=1;G.rt=2;
 G.obstacles=[];G.fx=[];G.pop=[];G.rings=[];
 G.bl=[actor(B[id],95,180,0,0,0,tier,0,0),
       actor(B[0],95+distance,180,Math.PI,1,1,1,0,0)];
 BVBRework.prepareActors(G,...G.bl);BVBRework.setSeed(G,1730+id);
 for(const o of G.bl){
  o.hp=90;o.mh=200;o.baseDmg=12;o.abilityCd=999;o.contact=999;
  o.vx=0;o.vy=0;o.status={};o.identity=null;
 }
 return G.bl;
}
function timeline(seconds){
 for(let i=0;i<seconds*60&&G.ph==='battle';i++)step(1/60);
}
`;
function play(body){
 const g=createGame();
 return g.run(fixture+'(()=>{'+body+'})()');
}
test('Przekuwacz: V2 heats its summoned forge on rebounds, V3 forges a shield and shock anvil',()=>{
 const states=play(`
  const rows=[];
  for(let tier=1;tier<=3;tier++){
   const [o,foe]=personalCase(16,tier);
   specialAbility(o,foe);
   const heatBefore=o.v2ForgeHeat||0;
   BVB2.onWall(o,'left');
   const pet=G.v2.hazards.find(h=>h.kind==='pet');
   rows.push({tier,heatBefore,heat:o.v2ForgeHeat||0,
    power:pet.power,shield:o.status.shield||0,
    anvil:G.v2.hazards.some(h=>h.kind==='shock')});
  }
  return rows;`);
 assert.equal(states[0].heat,0);
 assert.ok(states[1].heat>states[1].heatBefore);
 assert.ok(states[1].power>states[0].power);
 assert.equal(states[1].anvil,false);
 assert.ok(states[2].shield>states[1].shield);
 assert.equal(states[2].anvil,true);
});
test('Komórka: V2 buds heal repeatedly; V3 mitosis creates a stronger protected second body',()=>{
 const r=play(`
  const rows=[];
  for(let tier=1;tier<=3;tier++){
   const [o,foe]=personalCase(17,tier);
   specialAbility(o,foe);
   const buds=o.v2CellBud?.remaining||0;
   timeline(1);
   const healed=o.hp;
   applyDamage(o,1000);
   rows.push({tier,buds,healed,alive:o.hp>0,
     newHp:o.hp,radius:o.r,shield:o.status.shield||0,
     slime:G.v2.hazards.filter(h=>h.kind==='slime').length});
  }
  return rows;`);
 assert.equal(r[0].buds,0);
 assert.ok(r[1].buds>=4&&r[2].buds>r[1].buds);
 assert.ok(r[2].healed>r[1].healed);
 assert.ok(r.every(s=>s.alive));
 assert.ok(r[2].newHp>r[1].newHp);
 assert.ok(r[2].shield>r[1].shield);
 assert.ok(r[2].slime>=r[1].slime);
});
test('Elektryk: V2 stores a real charged contact; V3 adds a separate shock trap',()=>{
 const r=play(`
 const rows=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(18,tier);
  specialAbility(o,foe);
  const shots=G.v2.shots.length,fields=G.v2.hazards.filter(h=>h.kind==='shock').length;
  BVB2.onContact(G,o,foe,10);
  rows.push({tier,shots,fieldsAfter:G.v2.hazards.filter(h=>h.kind==='shock').length,
    fields,stun:foe.status.stun||0,charge:o.v2ArcUntil||0});
 }
 return rows;`);
 assert.equal(r[0].charge,0);
 assert.ok(r[1].charge>2);
 assert.ok(r[1].shots>r[0].shots);
 assert.ok(r[2].fieldsAfter>r[1].fieldsAfter);
 assert.ok(r[2].stun>r[1].stun);
});
test('Strefa: V2 moves damage aura with owner, V3 adds an actual gravity pull and stronger pulse',()=>{
 const r=play(`
 const rows=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(19,tier,60);
  specialAbility(o,foe);
  const aura=o.v2Pressure;
  o.x+=15;
  const hp=foe.hp,oldVx=foe.vx;
  timeline(.3);
  rows.push({tier,aura:aura?{radius:aura.radius,pull:aura.pull}:null,
    damage:hp-foe.hp,pull:foe.vx-oldVx});
 }
 return rows;`);
 assert.equal(r[0].aura,null);
 assert.ok(r[1].aura?.radius>0);
 assert.equal(r[1].aura.pull,0);
 assert.ok(r[1].damage>0);
 assert.ok(r[2].damage>r[1].damage);
 assert.ok(r[2].pull<r[1].pull);
});
test('Promień: V2 adds an actual predictive piercing laser, V3 schedules an echoing hit',()=>{
 const r=play(`
 const rows=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(20,tier,110);
  specialAbility(o,foe);
  const shots=G.v2.shots.filter(s=>s.ghost).length,echo=!!o.v2BeamEcho;
  const before=foe.hp;
  timeline(.6);
  rows.push({tier,shots,echo,beams:G.v2.beams.length,damage:before-foe.hp});
 }
 return rows;`);
 assert.equal(r[0].echo,false);
 assert.ok(r[1].shots>r[0].shots);
 assert.equal(r[1].echo,false);
 assert.equal(r[2].echo,true);
 assert.ok(r[2].beams>r[1].beams);
 assert.ok(r[2].damage>=r[1].damage);
});
test('WDC: V2 boosts center grid pulse, V3 rewires four corners with timed mines',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(21,tier);
  specialAbility(o,foe);
  r.push({tier,combo:o.v2MatrixCombo||0,
   grid:G.v2.hazards.filter(h=>h.kind==='grid').length,
   mines:G.v2.hazards.filter(h=>h.kind==='mine').length});
 }
 return r;`);
 assert.equal(rows[0].combo,0);
 assert.ok(rows[1].combo>0&&rows[2].combo>0);
 assert.ok(rows[1].grid>rows[0].grid);
 assert.ok(rows[2].mines>=4&&rows[1].mines===0);
});
test('Jabłko: V2 has a timed regenerative orchard; V3 doubles the harvest and grows a shield',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(22,tier,120);
  specialAbility(o,foe);
  const harvest=o.v2Orchard?.remaining||0,shieldBefore=o.status.shield||0;
  const hp=o.hp;
  timeline(.8);
  r.push({tier,harvest,healed:o.hp-hp,shieldBefore,shieldAfter:o.status.shield||0});
 }return r;`);
 assert.equal(rows[0].harvest,0);
 assert.ok(rows[1].harvest>0&&rows[2].harvest>rows[1].harvest);
 assert.ok(rows[2].healed>rows[1].healed);
 assert.ok(rows[2].shieldBefore>rows[1].shieldBefore);
});
test('Armata: V2 charges a real wall turret; V3 launches ricochet shell and timed crater',()=>{
 const rows=play(`
 const r=[];
 for(let tier=1;tier<=3;tier++){
  const [o,foe]=personalCase(23,tier,110);
  specialAbility(o,foe);
  const charge=o.v2TurretCharge||0,shots=G.v2.shots.length,
   mines=G.v2.hazards.filter(h=>h.kind==='mine').length;
  BVB2.onWall(o,'left');
  const turret=G.v2.hazards.find(h=>h.kind==='turret');
  r.push({tier,charge,shots,mines,power:turret.power});
 }return r;`);
 assert.equal(rows[0].charge,0);
 assert.ok(rows[1].charge>0&&rows[2].charge>0);
 assert.ok(rows[1].shots>rows[0].shots);
 assert.ok(rows[1].power>rows[0].power);
 assert.equal(rows[1].mines,0);
 assert.ok(rows[2].mines>0);
});

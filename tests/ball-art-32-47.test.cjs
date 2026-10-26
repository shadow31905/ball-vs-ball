'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');

// These checks audit the actual SVG returned by the collection's public art()
// function, not merely an unused design map or a screenshot mock.
test('all sixteen balls 32-47 have original, recognizable signature artwork',()=>{
 const page=createGame();
 const entries=page.run(`Array.from({length:16},(_,i)=>{
  const id=32+i;return {id,name:B[id].n,svg:art(id)};
 })`);
 assert.equal(entries.length,16);
 const glyphs=new Set();
 for(const {id,name,svg} of entries){
  assert.equal(typeof name,'string');
  assert.ok(name.length>1);
  assert.ok(svg.startsWith('<svg')||svg.includes('<svg'),'SVG document missing: '+id);
  assert.ok(svg.endsWith('</svg>'),'SVG should close correctly: '+id);
  assert.ok(svg.includes('data-signature-id="'+id+'"'),
   'missing new bespoke visual for '+id);
  const badge=svg.match(/<g data-signature-id="[0-9]+" class="bvb-signature-badge"[\s\S]*?<\/g>/);
  assert.ok(badge,'unique emblem should be drawable for '+id);
  assert.ok(badge[0].includes('stroke=')&&badge[0].includes('fill='),
   'badge must have visible foreground shapes: '+id);
  assert.ok(!/<script|onerror=|onload=|foreignObject/i.test(badge[0]),
   'SVG must not contain executable content');
  glyphs.add(badge[0].replace(/data-signature-id="[0-9]+"/,''));
 }
 assert.equal(glyphs.size,16,'each ball should have a different SVG motif, not just an ID');
});
test('signature emblems extend to Medyk ID48 while preserving earlier ball designs',()=>{
 const g=createGame();
 const value=g.run(`({prior:art(31),first:art(32),last:art(47),after:art(48),next:art(49),
  data:Array.from({length:16},(_,i)=>BVB2.authoredUpgrades[i+32])})`);
 assert.equal(value.prior.includes('data-signature-id='),false);
 assert.ok(value.after.includes('data-signature-id="48"'));
 assert.equal(value.next.includes('data-signature-id='),false);
 assert.ok(value.first.includes('data-signature-id="32"'));
 assert.ok(value.last.includes('data-signature-id="47"'));
 assert.ok(value.data.every(actions=>actions.length===2&&
  actions[0]!==actions[1]),'V3 must add a different mechanic after V2');
});

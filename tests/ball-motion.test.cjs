'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {createGame}=require('./game-harness.cjs');
test('48 different combat signatures render without altering match state',()=>{
 const g=createGame();
 const data=g.run('(()=>{const before=JSON.stringify(S),first=BVBMotion.identityEffects;for(let id=0;id<48;id++){let actor={b:B[id],x:180,y:180,r:18,tier:id%3+1,hp:80,mh:100};BVBMotion.drawActor(cx,actor,{rt:12.25});}return {n:first.length,unique:new Set(first.map(f=>f.toString())).size,intact:before===JSON.stringify(S)};})()');
 assert.equal(data.n,48);
 assert.equal(data.unique,48);
 assert.equal(data.intact,true);
});
test('three chosen balls react differently to victory and defeat',()=>{
 const g=createGame();
 const result=g.run('(()=>{const p={my:[B[6],B[7],B[8]]};return {win:BVBMotion.resultBalls(p,true),lose:BVBMotion.resultBalls(p,false)};})()');
 assert.ok(result.win.includes('bvb-result-deck won'));
 assert.ok(result.lose.includes('bvb-result-deck lost'));
 assert.equal((result.win.match(/class="bvb-result-ball"/g)||[]).length,3);
 assert.equal((result.lose.match(/class="bvb-result-ball"/g)||[]).length,3);
 assert.ok(result.win.includes('Pająk')&&result.win.includes('Wampir')&&result.win.includes('Włócznia'));
 assert.notEqual(result.win,result.lose);
});
test('quality preset, animation switches and intensity are in settings',()=>{
 const g=createGame();
 const settings=g.run('BVBMotion.settingsHtml()');
 for(const s of ['bvbArtQuality','bvbArtIntensity','data-motion="interior"','data-motion="fight"','data-motion="inventory"','data-motion="menu"','data-motion="results"','data-motion="cutscenes"'])assert.ok(settings.includes(s),s);
 const update=g.run('(()=>{S.o.artQuality="high";S.o.artIntensity=45;S.o.art_fight=0;BVBMotion.sync();save();load();return {quality:S.o.artQuality,intensity:S.o.artIntensity,fight:BVBMotion.enabled("fight")};})()');
 assert.equal(update.quality,'high');assert.equal(update.intensity,45);assert.equal(update.fight,false);
});
test('training mode is removed from menu and cannot be launched',()=>{
 const g=createGame();
 g.run('startMatch(4)');
 assert.equal(g.run('G'),null);
 assert.equal(g.run('typeof window.BVBTraining'),'undefined');
});
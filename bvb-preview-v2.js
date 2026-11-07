/* BVB 2.0 — Animated skill preview in collection, keeps base inventory UI. */
(() => {
'use strict';
if(!window.BVB2?.abilities)return;
const css=document.createElement('style');
css.textContent=[
'.bvb-skill-preview{margin-top:14px;border:1px solid #555fc6;background:#090f2a;',
'border-radius:15px;padding:12px;text-align:left}',
'.bvb-skill-preview h3{margin:0 0 6px;color:#c4b5fd;font-size:.93rem}',
'.bvb-skill-preview canvas{display:block;max-width:100%;height:auto;border-radius:12px;',
'background:linear-gradient(140deg,#0b1840,#1e1945);border:1px solid #53619e;margin:9px auto}',
'.bvb-skill-preview p{font-size:.79rem;line-height:1.5;color:#cbd5e1}',
'.bvb-skill-preview button{margin:8px 0 0;width:100%}'
].join('');
document.head.appendChild(css);
const defensive=new Set(['shield','reflect','heal','growth','time','eclipse','mirage']);
const zones=new Set(['poison','gas','mine','zone','lava','sun','frost','thorn','grid','pet','turret','train']);
const beams=new Set(['beam','prism','tether','ray']);
const dashes=new Set(['dash','blink','charge','chess']);
const colors={frost:'#9ee9ff',shield:'#67e8f9',heal:'#86efac',shock:'#facc15',poison:'#b5f574',lava:'#fb923c'};
let ticket=0;
function play(id){
 const canvas=document.getElementById('bvb-skill-preview-canvas');
 if(!canvas||!B[id])return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const evolution=getBallStats(id).tier,skill=window.BVB2.abilities[id],type=skill.kind,color=colors[type]||skill.color||'#c4b5fd';
 const authored=window.BVB2.authoredUpgrades?.[id]||null;
 const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
 const token=++ticket,start=performance.now(),W=320,H=150;
 function circle(x,y,r,c){
  ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 }
 function glowingLine(x,y,x2,y2,w,c,alpha=1){
  ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.shadowColor=c;ctx.shadowBlur=10;
  ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();ctx.restore();
 }
 function sprite(ball,x,y,r){
  const img=ART_IMAGES.get(ball);
  if(img?.complete&&img.naturalWidth)ctx.drawImage(img,x-r,y-r,r*2,r*2);
  else circle(x,y,r,B[ball]?.c||'#fff');
 }
 // Sixteen different V1 skill silhouettes in the collection.
 // They illustrate the original ability, NOT its locked V2/V3 additions.
 function drawV1Signature32(id,t,ox,oy,ex,ey,color){
  ctx.save();ctx.globalAlpha=.48+.30*t;ctx.strokeStyle=color;ctx.lineWidth=2;
  const x=ox+33+t*120,y=oy,sp=Math.sin(t*Math.PI);
  if(id===32){
   for(let j=0;j<3;j++)circle(x+j*14,y+(j%2?11:-11),3+j,color);
  }else if(id===33){
   glowingLine(ox+20,oy+21,ex-20,ey+21,2,color,.65);
   for(let j=0;j<5;j++)glowingLine(ox+25+j*32,oy+15,ox+25+j*32,oy+27,2,color,.7);
  }else if(id===34){
   glowingLine(ox+16,oy-22,ex-18,ey+27,2,color,.7);
   glowingLine(ox+16,oy+22,ex-18,ey-27,2,color,.7);
   for(let j=0;j<4;j++)circle(ox+40+j*31,y,2,color);
  }else if(id===35){
   ctx.beginPath();ctx.arc(ex,ey+9,23,Math.PI,Math.PI*2);ctx.stroke();
   glowingLine(ex-22,ey+9,ex+22,ey+9,2,color,.8);
   circle(ex,ey+7,5,color);
  }else if(id===36){
   for(let j=0;j<4;j++)glowingLine(ox+23-j*10,oy+8-j*7,
    ox+30+j*11,oy-15-j*4,2,color,.6);
  }else if(id===37){
   for(let j=0;j<5;j++)circle(ox+34+j*30,oy+(j%2?-12:12),4+j%3,
    ['#f9a8d4','#fde68a','#86efac','#a5f3fc','#c4b5fd'][j]);
  }else if(id===38){
   for(let j=0;j<5;j++)circle(ox+22+j*30,oy+16+j%2*7,8-j%3*2,color);
  }else if(id===39){
   for(let j=0;j<5;j++){const xx=ox+27+j*31;
    ctx.beginPath();ctx.ellipse(xx,y,j%2?7:11,j%2?11:7,Math.PI/4,0,Math.PI*2);ctx.stroke();}
  }else if(id===40){
   for(let j=0;j<4;j++)circle(ex-28+j*18,ey+19,8+j%2*4,color);
   circle(ex,ey-15+5*t,3,color);
  }else if(id===41){
   glowingLine(ox+21,oy-4,ex-30,13,4,color,.6);
   glowingLine(ex-30,13,ex+9,ey,3,color,.7);
   ctx.strokeRect(ex-37,5,13,16);
  }else if(id===42){
   for(let j=0;j<5;j++)circle(ex-40+j*18,ey-8+Math.sin(j+t)*14,15,color);
  }else if(id===43){
   for(let j=0;j<3;j++){
    const a=j*2*Math.PI/3+t*2;
    circle(ox+Math.cos(a)*38,oy+Math.sin(a)*34,6,color);
   }
  }else if(id===44){
   ctx.beginPath();ctx.moveTo(ox+23,oy+30);
   ctx.bezierCurveTo(ox+52,oy-34,ox+94,oy+32,ox+116,oy-3);ctx.stroke();
   for(const a of [13,21,34,55])circle(ox+23+a*1.3,oy+18-a*.35,2,color);
  }else if(id===45){
   ctx.beginPath();ctx.arc(ox,oy,28+sp*5,0,Math.PI*2);ctx.stroke();
   for(let j=0;j<7;j++){const a=j*Math.PI*2/7;
    glowingLine(ox+Math.cos(a)*27,oy+Math.sin(a)*27,
      ox+Math.cos(a)*38,oy+Math.sin(a)*38,2,color,.8);}
  }else if(id===46){
   circle(ex,ey,18,color);glowingLine(ex,ey,ex+12*sp,ey-10,2,'#fff',.8);
   for(let j=0;j<4;j++)circle(ex-14+j*9,ey-30,1.5,color);
  }else if(id===47){
   ctx.beginPath();ctx.ellipse(ox,oy,40,20,Math.PI/5,0,Math.PI*2);ctx.stroke();
   circle(ox+34*Math.cos(t*4),oy+19*Math.sin(t*4),5,color);
   circle(ox-34*Math.cos(t*4),oy-19*Math.sin(t*4),5,color);
  }
  ctx.restore();
 }
 function drawEvolvedEffect(action,layer,t,ox,oy,ex,ey){
  // Schematycznie pokazuje faktyczny typ nowego obiektu/statusu, nie udaje
  // identycznego przebiegu trafienia. Warstwa V3 ma osobny motyw.
  const accent=layer===2?'#facc15':'#7dd3fc',scale=layer===2?1.2:1;
  ctx.save();
  ctx.globalAlpha=.42+.48*t;
  // The signature evolutions get distinctive diagrams rather than the shared
  // default ring: V2 and V3 depict different pieces of the actual mechanic.
  if(action==='triageStation'||action==='emergencyProtocol'){
   const x=ox+41,y=oy+12,r=action==='emergencyProtocol'?39:30;
   ctx.strokeStyle=accent;ctx.lineWidth=action==='emergencyProtocol'?4:2.5;
   ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
   ctx.fillStyle='#f8fafc';ctx.fillRect(x-3,y-12,6,24);
   ctx.fillRect(x-12,y-3,24,6);
   if(action==='emergencyProtocol'){
    glowingLine(x+28,y-10,x+45,y-24,3,'#fef08a',.85);
    circle(x+45,y-24,5,'#fef08a');
   }
  }else if(action==='forgeDrone'||action==='forgeAnvil'){
   const cx=action==='forgeDrone'?ox+35:ex-20,cy=oy-27;
   const count=action==='forgeDrone'?6:8,r=action==='forgeDrone'?11:20;
   ctx.strokeStyle=accent;ctx.lineWidth=3;
   ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
   for(let i=0;i<count;i++){
    const a=2*Math.PI*i/count+t;
    glowingLine(cx+Math.cos(a)*r,cy+Math.sin(a)*r,
     cx+Math.cos(a)*(r+7),cy+Math.sin(a)*(r+7),2,accent,.8);
   }
   if(action==='forgeAnvil')glowingLine(cx-15,cy+25,cx+15,cy+25,6,accent);
  }else if(action==='cellBud'||action==='mitosisBloom'){
   for(let i=0;i<(action==='cellBud'?3:6);i++){
    const a=i*2*Math.PI/(action==='cellBud'?3:6)+t;
    ctx.strokeStyle=accent;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(ox+Math.cos(a)*(25+9*t),
     oy+Math.sin(a)*(25+9*t),action==='cellBud'?7:10,0,Math.PI*2);ctx.stroke();
   }
  }else if(action==='conductorArc'||action==='overloadCircuit'){
   const n=action==='conductorArc'?5:9;
   for(let i=0;i<n;i++){
    const x=ox+22+i*21,y=oy+(i%2?-13:13);
    if(i)glowingLine(x-21,oy+((i-1)%2?-13:13),x,y,
      action==='conductorArc'?3:5,accent,.85);
   }
   if(action==='overloadCircuit')circle(ex,ey,8,accent);
  }else if(action==='pressureAura'||action==='gravityVortex'){
   ctx.strokeStyle=accent;ctx.lineWidth=action==='pressureAura'?3:5;
   for(let i=0;i<(action==='pressureAura'?2:4);i++){
    const rad=25+i*13+t*6;
    ctx.beginPath();ctx.arc(ox,oy,rad,0,Math.PI*2);ctx.stroke();
   }
   if(action==='gravityVortex')glowingLine(ex-35,ey,ox+45,oy,4,accent,.7);
  }else if(action==='predictiveRay'||action==='reflectionEcho'){
   glowingLine(ox+17,oy,ex-10,ey,action==='predictiveRay'?3:5,accent,.75);
   if(action==='reflectionEcho'){
    glowingLine(ex-10,ey,ex-33,13,3,accent,.8);
    glowingLine(ex-33,13,ox+28,oy-14,3,accent,.7);
   }
  }else if(action==='matrixCenter'||action==='matrixRewire'){
   for(let i=0;i<3;i++)for(let j=0;j<3;j++){
    ctx.strokeStyle=(action==='matrixCenter'&&i===1&&j===1)||action==='matrixRewire'?accent:'#64748b';
    ctx.lineWidth=action==='matrixRewire'?2:1;
    ctx.strokeRect(ex-31+i*20,ey-31+j*20,17,17);
    if(action==='matrixRewire'&&(i===1||j===1))circle(ex-22+i*20,ey-22+j*20,2.5,accent);
   }
  }else if(action==='orchardHarvest'||action==='goldenOrchard'){
   const apples=action==='orchardHarvest'?3:5;
   for(let i=0;i<apples;i++){
    const x=ox+20+(i%3)*24,y=oy+25-Math.floor(i/3)*42;
    circle(x,y,6,accent);glowingLine(x,y-7,x+2,y-12,1.5,accent);
   }
   if(action==='goldenOrchard'){
    ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();ctx.arc(ox,oy,41,0,Math.PI*2);ctx.stroke();
   }
  }else if(action==='turretBattery'||action==='ricochetShell'){
   ctx.strokeStyle=accent;ctx.lineWidth=3;
   ctx.strokeRect(ox+16,oy-23,23,23);
   glowingLine(ox+31,oy-18,ox+50,oy-18,5,accent);
   if(action==='ricochetShell'){
    glowingLine(ox+45,oy-18,ex-28,9,2,accent,.8);
    glowingLine(ex-28,9,ex,ey,3,accent,.8);
    ctx.beginPath();ctx.arc(ex,ey,26*t+12,0,Math.PI*2);ctx.stroke();
   }else{
    circle(ox+61+t*125,oy-18,6,accent);
   }
  }else if(action==='virusIncubation'||action==='virusMutation'){
   const count=action==='virusIncubation'?4:9;
   for(let i=0;i<count;i++){
    const a=i*2*Math.PI/count+t*1.3,r=12+(i%3)*6+14*t;
    circle(ex+Math.cos(a)*r,ey+Math.sin(a)*r,
     action==='virusMutation'?4:2.8,accent);
   }
   if(action==='virusMutation'){ctx.strokeStyle=accent;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(ex,ey,41*t,0,7);ctx.stroke();}
  }else if(action==='briarWall'||action==='briarCitadel'){
   const n=action==='briarWall'?3:6;
   for(let i=0;i<n;i++){
    const y=20+i*(110/(n-1)),x=290;
    glowingLine(x-9,y+6,x,y-8,action==='briarCitadel'?4:2,accent,.9);
    glowingLine(x+9,y+6,x,y-8,2,accent,.75);
   }
  }else if(action==='longRicochet'||action==='ricochetSplit'){
   glowingLine(ox+23,oy,ex-28,16,2.8,accent,.8);
   glowingLine(ex-28,16,ex,ey,3.2,accent,.8);
   circle(ex-28,16,5,accent);
   if(action==='ricochetSplit'){
    glowingLine(ex-28,16,ex-12,ey-28,2,accent,.9);
    glowingLine(ex-28,16,ex+15,ey+24,2,accent,.9);
   }
  }else if(action==='crownPylons'||action==='crownStorm'){
   const n=action==='crownPylons'?2:4;
   for(let i=0;i<n;i++){
    const y=25+i*(100/(n-1));
    glowingLine(286,y-9,290,y+9,3,accent,.8);
    circle(290,y,4,accent);
   }
   if(action==='crownStorm')glowingLine(285,20,ex-20,ey,4,accent,.9);
  }else if(action==='growingRipples'||action==='returningWave'){
   ctx.strokeStyle=accent;ctx.lineWidth=2.8;
   for(let i=0;i<(action==='growingRipples'?3:5);i++){
    ctx.beginPath();ctx.arc(ox,oy,14+i*13+8*t,0,7);ctx.stroke();
   }
   if(action==='returningWave')glowingLine(ex,ey,ox+20,oy,4,accent,.7);
  }else if(action==='frostFootprints'||action==='iceTrail'){
   const n=action==='frostFootprints'?3:6;
   for(let i=0;i<n;i++){
    const x=ox+18+i*24,y=oy+(i%2?9:-9);
    ctx.strokeStyle=accent;ctx.lineWidth=2;
    ctx.strokeRect(x-5,y-5,10,10);
    if(action==='iceTrail'&&i)glowingLine(x-24,y+(i%2?-18:18),x,y,2,accent,.7);
   }
  }else if(action==='harpoonAnchor'||action==='harpoonReel'){
   glowingLine(ox+17,oy,ex-17,ey,action==='harpoonReel'?5:2.6,accent,.85);
   ctx.strokeStyle=accent;ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(ex-15,ey,action==='harpoonReel'?17:11,0,Math.PI*1.65);ctx.stroke();
   if(action==='harpoonReel')glowingLine(ex-15,ey,ox+25,oy,3,accent);
  }else if(action==='hiveGuard'||action==='queenSwarm'){
   const n=action==='hiveGuard'?4:8;
   for(let i=0;i<n;i++){
    const a=i*2*Math.PI/n+t,r=25+(i%2)*8;
    circle(ox+Math.cos(a)*r,oy+Math.sin(a)*r,3.2,accent);
   }
   if(action==='queenSwarm'){ctx.strokeStyle=accent;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(ox,oy,42,0,7);ctx.stroke();}
  }else if(action==='alchemistCatalyst'||action==='volatileMixture'){
   for(let i=0;i<(action==='volatileMixture'?5:3);i++){
    const x=ox+25+i*23,y=oy+Math.sin(t*4+i)*12;
    circle(x,y,6,action==='volatileMixture'&&i%2?'#f87171':accent);
    ctx.strokeStyle=accent;ctx.strokeRect(x-5,y-17,10,9);
   }
   if(action==='volatileMixture')glowingLine(ox+22,oy+30,ex,ey,3,accent);
  }else if(action==='ghostRail'||action==='phantomExpress'){
   const n=action==='ghostRail'?1:2;
   for(let k=0;k<n;k++){
    const y=oy+(k?27:-11);
    glowingLine(ox+20,y,ex+16,y,3,accent);
    for(let i=0;i<7;i++)glowingLine(ox+28+i*25,y-6,ox+28+i*25,y+6,2,accent);
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.strokeRect(ox+35+t*65,y-13,42,20);
   }
  }else if(action==='widowStrands'||action==='venomLattice'){
   const lines=action==='venomLattice'?5:2;
   for(let i=0;i<lines;i++)
    glowingLine(ox+20,oy-37+i*15,ex+15,ey+35-i*15,1.5,accent,.8);
   circle(ex-20,ey,action==='venomLattice'?8:4,accent);
  }else if(action==='graveBait'||action==='hauntingChain'){
   const n=action==='graveBait'?1:4;
   for(let i=0;i<n;i++){
    const x=ex-45+i*24,y=ey+(i%2?15:-15);
    ctx.strokeStyle=accent;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(x,y-7,9,Math.PI,0);ctx.lineTo(x+9,y+11);
    ctx.lineTo(x-9,y+11);ctx.closePath();ctx.stroke();
   }
   if(action==='hauntingChain')glowingLine(ex-45,ey,ox+25,oy,3,accent);
  }else if(action==='lightAfterimage'||action==='prismaticReturn'){
   for(let i=0;i<(action==='lightAfterimage'?3:5);i++)
    circle(ox+15+i*25,oy+Math.sin(t*6+i)*14,7-i*.8,accent);
   if(action==='prismaticReturn'){
    glowingLine(ex,ey,ox+15,oy,4,accent,.8);
    ctx.strokeStyle=accent;ctx.beginPath();ctx.arc(ox,oy,35,0,7);ctx.stroke();
   }
  }else if(action==='candyFlavors'||action==='sugarCrystal'){
   const n=action==='candyFlavors'?3:6;
   const colors=['#a5f3fc','#bef264','#fcd34d'];
   for(let i=0;i<n;i++){
    const a=i*2*Math.PI/n+t;
    const x=ex-20+Math.cos(a)*(15+i%2*18),y=ey+Math.sin(a)*(15+i%2*18);
    if(action==='sugarCrystal'){
     ctx.strokeStyle=colors[i%3];ctx.strokeRect(x-5,y-5,10,10);
    }else circle(x,y,6,colors[i%3]);
   }
  }else if(action==='slimeBudding'||action==='slimeDivision'){
   const n=action==='slimeBudding'?3:7;
   for(let i=0;i<n;i++){
    const x=ox+20+(i%4)*29,y=oy+8-Math.floor(i/4)*27;
    circle(x,y,7+5*t,accent);
    if(action==='slimeDivision')circle(x+9,y-10,3,accent);
   }
  }else if(action==='shackleTrap'||action==='shackleEcho'){
   const n=action==='shackleTrap'?4:7;
   for(let i=0;i<n;i++){
    const x=ox+20+i*27,y=oy+Math.sin(i*.8)*10;
    ctx.strokeStyle=accent;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.ellipse(x,y,12,7,i*.25,0,7);ctx.stroke();
   }
   if(action==='shackleEcho')circle(ex,ey,14,accent);
  }else if(action==='acidCorrosion'||action==='acidOverflow'){
   const n=action==='acidCorrosion'?2:5;
   for(let i=0;i<n;i++){
    const x=ex-25+(i%3)*20,y=ey+15-Math.floor(i/3)*17;
    ctx.strokeStyle=accent;ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(x,y,15+5*t,8,0,0,7);ctx.stroke();
   }
  }else if(action==='lensPrism'||action==='lensCrossfire'){
   glowingLine(ox+18,oy-15,ex+16,ey+35,3,accent,.85);
   circle(ox+34,oy,10,accent);
   if(action==='lensCrossfire'){
    glowingLine(ox+18,oy+26,ex+20,ey-35,4,accent,.8);
    ctx.strokeStyle=accent;ctx.beginPath();ctx.arc(ex-16,ey,17,0,7);ctx.stroke();
   }
  }else if(action==='gasDrift'||action==='gasCondensation'){
   const n=action==='gasDrift'?4:7;
   for(let i=0;i<n;i++){
    const x=ex-40+i*11+t*19,y=ey+Math.sin(i*1.5+t*4)*20;
    circle(x,y,6+(i%3)*3,accent);
   }
   if(action==='gasCondensation'){
    ctx.strokeStyle=accent;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(ex+15,ey,26*t,0,7);ctx.stroke();
   }
  }else if(action==='orbitingStars'||action==='cometSplinter'){
   for(let i=0;i<3;i++){
    const a=i*2*Math.PI/3+t*2,rad=32+12*t;
    const x=ox+Math.cos(a)*rad,y=oy+Math.sin(a)*rad;
    circle(x,y,6,accent);
    if(action==='cometSplinter')glowingLine(x,y,x+Math.cos(a)*19,y+Math.sin(a)*19,2,accent);
   }
  }else if(action==='fibonacciSequence'||action==='goldenSpiral'){
   let x=ox,y=oy;
   const n=action==='fibonacciSequence'?6:11;
   for(let i=0;i<n;i++){
    const a=i*2.39996+t,r=3+i*4;
    const nx=ox+Math.cos(a)*r,ny=oy+Math.sin(a)*r;
    glowingLine(x,y,nx,ny,2.5,accent,.85);x=nx;y=ny;
   }
   if(action==='goldenSpiral')circle(ex,ey,11,accent);
  }else if(action==='thornRetaliation'||action==='livingArmor'){
   const n=action==='thornRetaliation'?5:9;
   for(let i=0;i<n;i++){
    const a=i*2*Math.PI/n;
    glowingLine(ox+Math.cos(a)*23,oy+Math.sin(a)*23,
      ox+Math.cos(a)*(action==='livingArmor'?49:36),
      oy+Math.sin(a)*(action==='livingArmor'?49:36),3,accent);
   }
   if(action==='livingArmor'){ctx.strokeStyle=accent;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(ox,oy,40,0,7);ctx.stroke();}
  }else if(action==='timerCharge'||action==='clusterDetonation'){
   circle(ex,ey,16,accent);
   glowingLine(ex,ey,ex+12*Math.cos(t*6),ey+12*Math.sin(t*6),3,accent);
   if(action==='clusterDetonation')
    for(const [dx,dy] of [[-27,0],[27,0],[0,-28]])circle(ex+dx,ey+dy,9,accent);
  }else if(action==='satelliteLasers'||action==='satelliteIntercept'){
   const n=action==='satelliteLasers'?3:5;
   for(let i=0;i<n;i++){
    const a=i*2*Math.PI/n+t,rad=33;
    const x=ox+Math.cos(a)*rad,y=oy+Math.sin(a)*rad;
    circle(x,y,5,accent);
    if(i<2)glowingLine(x,y,ex-12,ey,1.8,accent,.7);
   }
   if(action==='satelliteIntercept'){ctx.strokeStyle=accent;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(ox,oy,48,0,7);ctx.stroke();}
  }else if(/Shot|Bolt|scatter|pierce|bounce|ghost/.test(action)){
   const count=layer===2?3:2;
   for(let n=0;n<count;n++){
    const y=ey+(n-(count-1)/2)*24;
    const x=ox+35+t*(ex-ox-57);
    glowingLine(x-24,y,x,y,2.5,accent,.7);
    circle(x,y,3.6*scale,accent);
   }
  }else if(/Field|wave|echo/.test(action)){
   const x=/pushwave|burnwave|shockwave|echo/.test(action)?ox:ex;
   const radius=(14+26*t)*(layer===2?1.22:1);
   ctx.strokeStyle=accent;ctx.lineWidth=layer===2?4:2;
   ctx.beginPath();ctx.arc(x,oy,radius,0,Math.PI*2);ctx.stroke();
   if(layer===2){ctx.beginPath();ctx.arc(x,oy,radius*.65,0,Math.PI*2);ctx.stroke();}
  }else if(/guard|mirror|cleanse|healing/.test(action)){
   ctx.strokeStyle=accent;ctx.lineWidth=2.5;
   ctx.beginPath();ctx.arc(ox,oy,(24+11*t)*scale,0,Math.PI*2);ctx.stroke();
   if(layer===2){ctx.beginPath();ctx.arc(ox,oy,(32+10*t)*scale,0,Math.PI*2);ctx.stroke();}
  }else if(/pull|stun|weaken|lure|drain/.test(action)){
   glowingLine(ox+15,oy,ex-15,ey,layer===2?5:3,accent,.55);
   circle(ex-15,ey,layer===2?6:4,accent);
  }else{
   // A fallback remains visible for any new upgrade type.
   ctx.strokeStyle=accent;ctx.lineWidth=3;
   ctx.beginPath();ctx.arc(ex,ey,18+20*t,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
 }
 function frame(now){
  // Stop the preview when the menu, collection window or its parent view is hidden.
  // Otherwise requestAnimationFrame would keep rendering during the actual fight on phones.
  if(token!==ticket||canvas!==document.getElementById('bvb-skill-preview-canvas')||canvas.closest?.('[hidden]'))return;
  const phase=reduceMotion?1.45:((now-start)/1000)%2.9,t=Math.min(1,Math.max(0,(phase-.35)/1.2));
  ctx.clearRect(0,0,W,H);
  const grad=ctx.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#0b1433');grad.addColorStop(1,'#1c1647');
  ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#52639a';ctx.lineWidth=3;ctx.strokeRect(3,3,W-6,H-6);
  for(let j=0;j<18;j++){
   const x=(j*73+13)%W,y=(j*47+29)%H;
   circle(x,y,j%4===0?1.7:1,'#596ca5');
  }
  const ox=dashes.has(type)?65+Math.max(0,t-.1)*76:67,ex=248,oy=H/2,ey=H/2;
  const opacity=phase>2.3?Math.max(.05,(2.9-phase)/.6):1;
  ctx.save();ctx.globalAlpha=opacity;
  if(type==='web'){
   const startX=12,startY=42,endX=W-12,endY=111;
   if(phase>.38)circle(startX,startY,4,'#fef9c3');
   if(phase>.9)circle(endX,endY,4,'#fef9c3');
   if(phase>.9){
    glowingLine(startX,startY,endX,endY,2,'#cbd5e1');
    for(let i=1;i<8;i++){const p=i/8,x=startX+(endX-startX)*p,y=startY+(endY-startY)*p;
     glowingLine(x-7,y-7,x+7,y+7,.75,'#dbeafe',.7);}
   }
  }else if(defensive.has(type)){
   if(phase>.5){
    ctx.strokeStyle=color;ctx.shadowColor=color;ctx.shadowBlur=18;ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(ox,oy,24+12*Math.sin(t*Math.PI),0,7);ctx.stroke();
   }
  }else if(zones.has(type)){
   if(phase>.42){
    const radius=15+30*t;ctx.save();ctx.globalAlpha=.23;
    circle(ex,ey,radius,color);ctx.restore();
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(ex,ey,radius,0,7);ctx.stroke();
   }
  }else if(beams.has(type)){
   if(phase>.48){
    glowingLine(ox+13,oy,ex-12,ey,8,color,.55);
    glowingLine(ox+13,oy,ex-12,ey,2,'#ffffff',.85);
   }
  }else if(dashes.has(type)){
   if(phase>.38)glowingLine(ox-55,oy,ox-12,oy,4,color,.5);
  }else if(phase>.35){
   let px=ox+25+Math.min(1,t)*155,py=oy+Math.sin(t*Math.PI*2)*8;
   glowingLine(px-23,py,px,py,3,color,.65);circle(px,py,6,color);
   circle(px-1,py-2,2,'#ffffff');
  }
  if(type==='orbit'||type==='shard'||type==='swarm'){
    for(let i=0;i<evolution+2;i++){
     const angle=(now-start)/500+i*2*Math.PI/(evolution+2);
     circle(ox+Math.cos(angle)*27,oy+Math.sin(angle)*27,4,color);
    }
  }
  if(id>=32&&id<=47&&phase>.35)drawV1Signature32(id,t,ox,oy,ex,ey,color);
  if(id===48&&phase>.35){
   ctx.fillStyle='#f8fafc';
   ctx.fillRect(ox+22,oy-12,6,24);ctx.fillRect(ox+13,oy-3,24,6);
  }
  if(authored&&evolution>=2&&phase>.48){
   drawEvolvedEffect(authored[0],1,t,ox,oy,ex,ey);
   if(evolution>=3)drawEvolvedEffect(authored[1],2,t,ox,oy,ex,ey);
  }
  sprite(1,ex,ey,16);
  sprite(id,ox,oy,18);
  if(phase>1.2 && phase<2.15 && !defensive.has(type)){
   ctx.strokeStyle='#ffffff';ctx.globalAlpha=.75*Math.sin((phase-1.2)/.95*Math.PI);
   ctx.lineWidth=2;ctx.beginPath();ctx.arc(ex,ey,20+(phase-1.2)*15,0,7);ctx.stroke();
  }
  ctx.restore();
  if(!reduceMotion&&phase<2.9)requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
}
const prev=openBallDetail;
openBallDetail=function(id){
 prev(id);
 const ball=B[id],d=window.BVB2.abilities[id],s=getBallStats(id);
 if(!ball||!d)return;
 const box=document.createElement('section');
 box.className='bvb-skill-preview';
 const fast=d.speed>1.02,heavy=d.baseHp>112;
 const strength=heavy?'wytrzymałość':fast?'mobilność':d.kind==='beam'||d.kind==='volley'?'zasięg':'specjalne działanie';
 const weakness=heavy?'wolniejszy ruch':fast?'mniej zdrowia':'wymaga właściwego trafienia lub ustawienia';
 box.innerHTML='<h3>✨ '+esc(d.title)+' — podgląd animacji</h3>'+
  '<canvas id="bvb-skill-preview-canvas" width="320" height="150" aria-label="Animowany podgląd umiejętności"></canvas>'+
  '<p><b>⚔️ Działanie:</b> '+esc(d.desc)+'</p>'+'<p>'+esc(s.evolutionDesc||'')+'</p>'+
  '<p><b>⏱️ Odnowienie:</b> '+(d.kind==='web'?'pasywna (odbicia)':s.cd+' s')+
  ' · <b>💨 Prędkość:</b> '+(d.speed>1?'+':'')+Math.round((d.speed-1)*100)+'%</p>'+
  '<p><b>✅ Zaleta:</b> '+strength+' · <b>⚠️ Słabość:</b> '+weakness+'</p>'+
  '<button class="b ac" type="button" id="bvbReplaySkill">🔄 Odtwórz podgląd</button>'+
  '<p style="font-size:.7rem;opacity:.7">Schemat umiejętności; animacja w walce zależy od położenia kulek.</p>';
 document.querySelector('#ovb')?.appendChild(box);
 box.querySelector('#bvbReplaySkill').addEventListener('click',()=>play(id));
 requestAnimationFrame(()=>play(id));
};
window.BVB2Preview={play};
})();
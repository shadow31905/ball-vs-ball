/* The first 48 balls have individual, actively drawn battle signatures.
 * Each painter is visually tied to its own identity rather than a copied aura.
 * Cosmetic-only, deterministic and independent of combat RNG.
 */
(()=>{
'use strict';
if(!window.BVBMotion)return;
const old=window.BVBMotion.drawActor;
const line=(c,a,b,x,y)=>{c.beginPath();c.moveTo(a,b);c.lineTo(x,y);c.stroke();};
const arc=(c,x,y,r,a=0,b=6.283)=>{c.beginPath();c.arc(x,y,r,a,b);c.stroke();};
const dot=(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,6.283);c.fill();};
const poly=(c,points)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.stroke();};
const glyph=(c,ch,x=0,y=0,size=13)=>{c.save();c.font='bold '+size+'px sans-serif';c.textAlign='center';c.fillText(ch,x,y);c.restore();};
const s=Math.sin,k=Math.cos;
const painters=[
 // 0–5: kinetic rush, swinging axe, poison thorns, stealth theft, dancing
 // blades and machine-gun burst all have different visual trajectories.
 (c,t)=>{for(let i=0;i<3;i++)line(c,-17-i*3,-9+i*8,-5+i*2,-9+i*8);},
 (c,t)=>{arc(c,1,-1,15,t,t+1.75);line(c,9,9,15,-11);},
 (c,t)=>{for(let i=0;i<4;i++){const a=i*1.57+t*.3;poly(c,[[14*k(a),14*s(a)],[18*k(a-.2),18*s(a-.2)],[20*k(a+.2),20*s(a+.2)]]);}},
 (c,t)=>{c.save();c.translate(4*s(t),-3);glyph(c,'◈',-8,4,14);glyph(c,'◇',8,-1,9);c.restore();},
 (c,t)=>{for(let i=0;i<4;i++){const a=t*.9+i*1.57;line(c,12*k(a),12*s(a),20*k(a+.3),20*s(a+.3));}},
 (c,t)=>{line(c,-13,0,11,0);for(let j=0;j<3;j++)dot(c,13+j*5,3*s(t+j),1.8);},
 // 6–11: web strands, vampire pulse, spear thrust, sunburst, chess moves, dice.
 (c,t)=>{for(let i=-1;i<=1;i++)line(c,-17,i*6,17,-i*6);arc(c,0,0,9,0,3.14);},
 (c,t)=>{arc(c,0,0,7+3*s(t*2),0,6.283);glyph(c,'♥',0,5,12);},
 (c,t)=>{line(c,-18,11,17,-11);poly(c,[[15,-15],[23,-17],[18,-8]]);},
 (c,t)=>{for(let i=0;i<9;i++){const a=i*.698+t*.25;line(c,14*k(a),14*s(a),22*k(a),22*s(a));}},
 (c,t)=>{poly(c,[[-15,12],[-15,-7],[1,-7],[1,-16]]);glyph(c,'♞',11,9,13);},
 (c,t)=>{c.save();c.rotate(t*.4);c.strokeRect(-9,-9,18,18);[[-4,-4],[4,4],[0,0]].forEach(q=>dot(c,q[0],q[1],1.8));c.restore();},
 // 12–17: ice, scanning beam, serpent, swinging hook, forge and mitosis.
 (c,t)=>{poly(c,[[0,-20],[11,1],[0,19],[-11,1]]);line(c,0,-16,0,16);},
 (c,t)=>{const a=t*.35;line(c,-20*k(a),-20*s(a),20*k(a),20*s(a));arc(c,0,0,4);},
 (c,t)=>{c.beginPath();c.moveTo(-18,10);c.bezierCurveTo(-7,-20,7,19,18,-8);c.stroke();dot(c,18,-8,2.2);},
 (c,t)=>{c.beginPath();c.moveTo(-14,-12);c.quadraticCurveTo(23,-19,12,10);c.quadraticCurveTo(0,22,-8,12);c.stroke();},
 (c,t)=>{glyph(c,'⚒',3,6,18);for(let i=0;i<3;i++)dot(c,-10+i*10,15*s(t+i),1.7);},
 (c,t)=>{for(const [x,y,r] of [[-10,-5,6],[10,5,5],[0,12,3]])arc(c,x+2*s(t),y,r);},
 // 18–23: shock, pressure, predictive ray, digital grid, fruit, artillery.
 (c,t)=>{poly(c,[[-12,-16],[0,-4],[-5,3],[12,17],[5,2],[12,-2]]);},
 (c,t)=>{for(let i=0;i<3;i++)arc(c,0,0,8+i*4-2*s(t));},
 (c,t)=>{arc(c,6,-3,9);line(c,-17,15,15,-12);dot(c,15,-12,2);},
 (c,t)=>{for(let p=-1;p<=2;p++){line(c,-12,p*8-4,12,p*8-4);line(c,p*8-4,-12,p*8-4,12);}},
 (c,t)=>{glyph(c,'♥',0,8,17);c.beginPath();c.moveTo(0,-5);c.quadraticCurveTo(9,-18,15,-12);c.stroke();},
 (c,t)=>{c.strokeRect(-13,-5,22,12);arc(c,-7,10,4);arc(c,9,10,4);line(c,9,0,19,0);},
 // 24–29: virus, massive spike, ricochet arrow, lightning crown, radius, frost.
 (c,t)=>{for(let j=0;j<6;j++){let a=j*1.047+t*.15;dot(c,15*k(a),15*s(a),2.4);}arc(c,0,0,6);},
 (c,t)=>{for(let i=0;i<5;i++){let a=t*.18+i*1.256;poly(c,[[10*k(a),10*s(a)],[22*k(a-.18),22*s(a-.18)],[22*k(a+.18),22*s(a+.18)]]);}},
 (c,t)=>{line(c,-17,7,14,-13);line(c,14,-13,10,-4);line(c,14,-13,6,-12);line(c,15,12,-9,12);},
 (c,t)=>{poly(c,[[-17,-11],[-11,13],[12,13],[18,-11],[6,-3],[0,-18],[-6,-3]]);},
 (c,t)=>{for(let i=0;i<3;i++)arc(c,0,0,6+i*5+2*s(t+i));},
 (c,t)=>{for(let j=0;j<6;j++){let a=j*1.047;line(c,0,0,18*k(a),18*s(a));}},
 // 30–35: anchor, bees, flask chemistry, train, black spider, haunted grave.
 (c,t)=>{line(c,-17,-12,7,10);poly(c,[[5,10],[14,12],[10,3]]);arc(c,4,8,4);},
 (c,t)=>{for(let i=0;i<3;i++){let a=t*.6+i*2.094;dot(c,14*k(a),11*s(a),3);line(c,14*k(a)-3,11*s(a),14*k(a)+3,11*s(a));}},
 (c,t)=>{poly(c,[[-6,-18],[6,-18],[3,-7],[13,14],[-13,14],[-3,-7]]);for(let i=0;i<4;i++)dot(c,3*s(t+i),10-5*i,1.4);},
 (c,t)=>{c.strokeRect(-16,-8,32,15);for(let i=0;i<3;i++)arc(c,-10+10*i,11,3);line(c,-18,16,19,16);},
 (c,t)=>{poly(c,[[0,-19],[20,15],[-20,15]]);for(let i=-2;i<3;i++)line(c,i*4,-6,i*7,10);},
 (c,t)=>{poly(c,[[-10,18],[-10,-7],[-5,-14],[5,-14],[10,-7],[10,18]]);glyph(c,'✦',0,4,14);},
 // 36–41: luminous feathers, sweets, slime, chains, corrosive acid, prism.
 (c,t)=>{for(let i=0;i<4;i++)arc(c,(-1)**i*7,2,10+i*3,t*.2+i*.15,t*.2+i*.8);},
 (c,t)=>{for(let i=0;i<3;i++){c.save();c.translate((i-1)*12,4*s(t+i));c.rotate((i-1)*.3);c.strokeRect(-5,-5,10,10);c.restore();}},
 (c,t)=>{for(let i=0;i<3;i++){let a=i*2.09+t*.12;arc(c,9*k(a),9*s(a),7+i*2);}},
 (c,t)=>{for(let i=0;i<3;i++){c.save();c.translate((i-1)*9,(i%2)*7);c.rotate(.75);c.strokeRect(-5,-3,10,6);c.restore();}},
 (c,t)=>{for(let i=0;i<4;i++)dot(c,(i-1.5)*9,7*s(t+i),2+i);glyph(c,'⌄',0,-6,16);},
 (c,t)=>{poly(c,[[0,-16],[16,13],[-16,13]]);line(c,-19,0,0,0);line(c,0,0,19,-11);line(c,0,0,19,10);},
 // 42–47: drifting toxic gas, shuriken, Fibonacci, cactus, bomb and orbit.
 (c,t)=>{for(let i=0;i<4;i++)arc(c,(i-1.5)*9,4*s(t+i),8,Math.PI,Math.PI*2);},
 (c,t)=>{c.save();c.rotate(t*.5);poly(c,[[0,-17],[5,-5],[17,0],[5,5],[0,17],[-5,5],[-17,0],[-5,-5]]);c.restore();},
 (c,t)=>{c.beginPath();for(let i=0;i<50;i++){const a=i*.23,r=i*.34;i?c.lineTo(r*k(a),r*s(a)):c.moveTo(0,0);}c.stroke();},
 (c,t)=>{line(c,0,-17,0,17);line(c,0,2,-11,2);line(c,-11,2,-11,-7);line(c,0,7,12,7);line(c,12,7,12,-3);},
 (c,t)=>{arc(c,0,2,13);glyph(c,String(3-Math.floor(t*1.2)%3),0,7,13);line(c,0,-12,7,-20);},
 (c,t)=>{c.save();c.rotate(t*.3);c.beginPath();c.ellipse(0,0,21,9,-.5,0,6.283);c.stroke();dot(c,16,-12,3.4);c.restore();}
];
function draw(ctx,o,g){
 old(ctx,o,g);
 if(!o?.b||!window.BVBMotion.enabled('fight')||!window.BVBMotion.enabled('interior'))return;
 const id=o.b.id,fn=painters[id];
 if(id>=0&&id<16){window.BVBElementalArt?.paintCombat?.(ctx,o,g);return;}
 if(typeof fn!=='function'||window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches)return;
 const p=window.BVBMotion.prefs(),q=p.artQuality;
 if(q==='low'||p.artIntensity===0)return;
 const t=(g?.rt||0)*(1.15+(id%17)*.13)+id*.43;
 const r=Math.max(9,o.r||16),col=window.BVBArtEvolution?.colors?.[id]||o.b.c||'#fff';
 ctx.save();ctx.translate(o.x,o.y);ctx.scale(r/22,r/22);
 ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=q==='ultra'?1.7:1.2;
 ctx.globalAlpha=Math.min(.6,.14+(o.tier||1)*.09)*p.artIntensity/100;
 ctx.shadowColor=col;ctx.shadowBlur=q==='ultra'?8:3;
 fn(ctx,t);
 if(o.tier===3){
  // V3 preserves the original signature, adds a smaller time-offset echo.
  ctx.globalAlpha*=.25;ctx.scale(.73,.73);ctx.rotate(.27);fn(ctx,t-.5);
 }
 ctx.restore();
}
window.BVBMotion.drawActor=draw;
window.BVBMotion.identityEffects=Object.freeze(painters);
})();
/* Local beta: articulated parts, 3D dice and real combat event choreography.
 * Individual approved textures supply the central bodies; moving equipment is
 * drawn separately. No texture mesh warping, no presentation RNG or timers. */
(()=>{
'use strict';
if(typeof K==='undefined'||K!=='bvb_beta_original_16_v1'||!document.querySelector('meta[name="bvb-beta-build"]'))return;
const TAU=Math.PI*2,SIZE=384,R=76,clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const slots=new Map(),events=new WeakMap(),sin=Math.sin,cos=Math.cos;
const names=[
 ['Napięcie i wyrzut','Lotki kierujące skrętem','Pancerz drugiego impetu'],
 ['Zamach i cięcie','Obrót powracającego topora','Cięcie i przeciwny powrót'],
 ['Wstrzyknięcie jadu','Rozkładanie cierni','Rozgałęzianie żywych kolców'],
 ['Dłoń i sakiewka','Rzut i chwyt sztyletów','Peleryna i sobowtór'],
 ['Szerokie cięcie','Zaciskająca spirala','Zamknięcie segmentów ostrza'],
 ['Zamek, odrzut i magazynek','Seria i przeciągnięcie zamka','Salwa, chłodzenie i zasobnik'],
 ['Osiem nóg ze stawami','Nogi rozpinające sieć','Nogi oplatające kokon'],
 ['Skrzydła i ugryzienie','Obejmujące skrzydła i bank krwi','Rozpostarcie skrzydeł i serce'],
 ['Pchnięcie i wycofanie','Rozkładane zadziory','Teleskopowy podwójny cios'],
 ['Otwieranie skorupy','Sekwencja płyt i odbita fala','Uniesiony rdzeń i kolejne fale'],
 ['Skok skoczka','Wysuwana wieża','Kombinacja królowej'],
 ['Obrót bryły i wynik','Podskok przez krawędzie','Rozłożenie i składanie ścian'],
 ['Narastanie i odpryski','Rozkładane lodowe żebra','Zamknięcie kopuły'],
 ['Obrotowa soczewka i przesłona','Skanujący emiter','Dwa przeciwbieżne emitery'],
 ['Falowanie i paszcza','Zsuwanie skóry','Zaciskająca pętla ogona'],
 ['Wyrzut i zwijanie łańcucha','Zaczepienie i ruch po łuku','Dodatkowy łańcuch i drugi zamach']
];
const notes=[
 'Rogi i lotki pracują niezależnie od korpusu.', 'Topór porusza się na własnym uchwycie; trafienie zatrzymuje cięcie.',
 'Jad płynie do ruchomych końcówek.', 'Ręka, łup, sztylety i peleryna są osobnymi elementami.',
 'Każde ostrze ma własną pozycję i kąt.', 'Podgląd pokazuje pełen cykl: celowanie → strzał → wymiana magazynka → zamek.',
 'Osiem nóg, po dwa ruchome odcinki i staw kolanowy.', 'Kontakt uruchamia przyczepienie, odbieranie HP i leczenie ograniczone do maksymalnego HP.',
 'Drzewce, grot i zadziory poruszają się osobno.', 'Płyty otwierają się, odsłaniając rdzeń.',
 'Figury unoszą się i poruszają w różnych kierunkach.', 'Bryła obraca się w trzech wymiarach; wynik zostaje pokazany po rzucie.',
 'Kryształy rosną i składają konstrukcję.', 'Głowice obracają się; przesłona odsłania soczewkę.',
 'Ciało składa się z ruchomych segmentów; głowa ma osobną szczękę.', 'Widoczne ogniwa łączą uchwyt z poruszającym się hakiem.'
];
const catalogue=names.flatMap((row,id)=>row.map((name,i)=>({id,tier:i+1,name,period:6,duration:4.8,note:notes[id]})));
const entry=(id,tier)=>catalogue[id*3+clamp((tier||1)-1,0,2)];
function enabled(place){const p=window.BVBMotion?.prefs?.()||{};return !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches&&p.artQuality!=='low'&&p.artIntensity!==0&&window.BVBMotion?.enabled?.(place)!==false&&window.BVBMotion?.enabled?.('interior')!==false;}
const hump=(t,a,b)=>t<a||t>b?0:sin(Math.PI*(t-a)/(b-a));
function poseFor(id,tier,time,age=-100,extra={}){
 const preview=!!extra.preview,phase=((age%6)+6)%6,active=age>=0&&age<4.8;
 const a=active?hump(age,0,2.8):0,p=time*TAU;
 const reload=active?hump(age,.85,2.1):0,shot=active&&age<.75?Math.max(0,sin(age*(tier===1?19:tier===2?32:49))):0;
 const wings=(.25+.75*(.5+.5*sin(p*(tier===1?1.15:tier===2?.8:.62))))*(extra.strength??1);
 const legs=[];for(let side of [-1,1])for(let i=0;i<4;i++){
  const step=sin(time*(tier===1?7:tier===2?5:4)+i*1.8+(side===1?Math.PI:0)),grasp=active&&tier>1?a:0;
  const hip=[side*.65,-.66+i*.42],knee=[side*(1.32+.13*step-.25*grasp),-.95+i*.48-.22*step],foot=[side*(1.83-.25*grasp),-.58+i*.5+.24*step-.4*grasp];legs.push({hip,knee,foot});
 }
 return {id,tier,time,age,active,phase,a,reload,shot,wings,legs,roll:extra.roll||((Math.floor(time)%6)+1),attached:!!extra.attached,bloodLink:!!extra.bloodLink,preview,strength:extra.strength??1};
}
function poly(ctx,points,fill,stroke='#0b1025',width=.045){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function line(ctx,points,color,width=.04){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineCap=ctx.lineJoin='round';ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function circle(ctx,x,y,r,color,stroke=null,width=.025){ctx.beginPath();ctx.arc(x,y,Math.max(.001,r),0,TAU);ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function metal(ctx,a='#faf7d4',b='#b87920',c='#44274b'){const g=ctx.createLinearGradient(-1,-1,1,1);g.addColorStop(0,a);g.addColorStop(.4,b);g.addColorStop(.55,a);g.addColorStop(1,c);return g;}
function joint(ctx,x,y,r=.09){circle(ctx,x,y,r,metal(ctx),'#17142a',.035);circle(ctx,x,y,r*.43,'#af68fb');}
function crystal(ctx,x,y,length,angle,color='#8defff'){ctx.save();ctx.translate(x,y);ctx.rotate(angle);poly(ctx,[[-.09,0],[0,-length],[.11,-.05],[0,.13]],color,'#dafaff',.025);line(ctx,[[0,.1],[0,-length]],'#ffffff',.015);ctx.restore();}
function body(ctx,id,tier,scale=1){
 ctx.save();ctx.scale(scale,scale);
 const frame=window.BVBBatch01Frames?.[id*3+tier-1],image=id<13?window.BVBBatch01Art?.imageForTier(id,tier):null;
 if(frame&&image?.complete&&image.naturalWidth){
  // Only the central body of the individual source image. Static appendages are
  // deliberately excluded; their articulated replacements are rendered below.
  ctx.beginPath();ctx.arc(0,0,.98,0,TAU);ctx.clip();const {cx,cy,r}=frame.anchor;
  ctx.drawImage(image,-cx/r,-cy/r,1/r,1/r);
 }else{const colors=['#155bda','#b22240','#5d9d19','#562180','#718cac','#936a22','#592195','#b61640','#d79c20','#d45d17','#dfe8f5','#b62a3a','#2499d2','#a91d43','#399f35','#637c9d'];const g=ctx.createRadialGradient(-.3,-.45,.1,0,0,1);g.addColorStop(0,'#ffffff');g.addColorStop(.17,colors[id]);g.addColorStop(1,'#111526');circle(ctx,0,0,.94,g,'#c4d3e3',.035);}
 ctx.restore();
}
function eyes(ctx,color='#f7f1ff'){for(const side of [-1,1]){poly(ctx,[[side*.13,-.13],[side*.62,-.36],[side*.5,.1],[side*.19,.13]],color,'#111324',.05);circle(ctx,side*.34,-.02,.08,'#651c88');}}
function blade(ctx,angle,radius,length=.9){ctx.save();ctx.rotate(angle);ctx.translate(radius,0);poly(ctx,[[0,-.08],[length,-.18],[length*.7,.07],[.14,.16]],metal(ctx,'#ffffff','#8eacc7','#283b66'));line(ctx,[[.05,-.08],[length*.87,-.14]],'#ffffff',.023);joint(ctx,0,0,.07);ctx.restore();}
function wing(ctx,side,p){
 ctx.save();ctx.translate(side*.66,-.3);ctx.scale(side,1);ctx.rotate(-.27+p.wings*.56-(p.attached?.7:0));ctx.scale(.36+.64*p.wings,1);
 const spread=1.2+p.tier*.13;const g=ctx.createLinearGradient(0,-1,1,.5);g.addColorStop(0,'#f94770');g.addColorStop(.4,'#8f0a2b');g.addColorStop(1,'#280f2c');
 ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(.3,-1.1,spread,-1.05);ctx.quadraticCurveTo(.8,-.45,spread,.18);ctx.quadraticCurveTo(.6,-.1,.72,.62);ctx.quadraticCurveTo(.25,.18,0,.35);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#f6bd5d';ctx.lineWidth=.045;ctx.stroke();
 line(ctx,[[0,.25],[.25,-.68],[spread,-1.05]],'#211323',.09);line(ctx,[[.25,-.68],[spread,.18]],'#35122b',.05);line(ctx,[[.25,-.68],[.72,.62]],'#35122b',.05);
 if(p.tier===3)crystal(ctx,.25,-.68,.28,.1,'#ffdd83');ctx.restore();
}
function drawSpider(ctx,p){
 for(const leg of p.legs){line(ctx,[leg.hip,leg.knee,leg.foot],'#090c1e',.18);line(ctx,[leg.hip,leg.knee],metal(ctx,'#d5b2ff','#6220ae','#201439'),.12);line(ctx,[leg.knee,leg.foot],metal(ctx,'#ede3ff','#923ce1','#2a1753'),.10);line(ctx,[[leg.knee[0]-.02,leg.knee[1]],leg.foot],'#bce6ff',.024);joint(ctx,...leg.knee,.1);}
 if(p.tier>1&&p.active){const pull=p.a;for(let i=0;i<8;i++){const f=p.legs[i].foot;line(ctx,[f,[1.5+cos(i*TAU/8)*(.65-.35*pull),sin(i*TAU/8)*(.65-.35*pull)]],'#d9dcff',.012);}
 if(p.tier===3)for(let k=0;k<5;k++){ctx.beginPath();ctx.ellipse(1.5,0,.6-.04*k,.65-k*.09,0,0,TAU);ctx.strokeStyle='#dee4ff';ctx.lineWidth=.014;ctx.stroke();}}
 body(ctx,6,p.tier,.9);
}
function gun(ctx,p){
 const a=p.age,fire=p.shot,reload=p.reload,aim=p.tier===1?0:sin(p.time)*.05;ctx.save();ctx.translate(.1,-.32);ctx.rotate(aim-fire*.08);ctx.translate(-fire*.12,0);
 const steel=metal(ctx,'#f4dfa4','#8c651e','#20283a');poly(ctx,[[-.65,-.29],[.6,-.29],[.74,.05],[.42,.28],[-.7,.22]],steel);
 const count=p.tier===3?3:p.tier===2?2:1;for(let j=0;j<count;j++){const y=-.12+j*.16;poly(ctx,[[.25,y-.06],[1.54,y-.06],[1.54,y+.07],[.25,y+.07]],metal(ctx,'#d5e7f9','#3a5165','#152331'));circle(ctx,1.54,y,.08,'#121322','#b9e5ef',.025);
  if(fire>.48){poly(ctx,[[1.58,y],[1.77,y-.17*fire],[1.8,y-.05],[2.05,y],[1.78,y+.1],[1.77,y+.18*fire]],'#fff2a2','#ff921f',.02);}}
 // The magazine physically exits, tilts, returns; the bolt then travels.
 const magDrop=hump(a,1.05,1.85);ctx.save();ctx.translate(-.12,.15+magDrop*.73);ctx.rotate(-magDrop*.65);poly(ctx,[[-.17,0],[.21,0],[.17,.53],[-.2,.5]],steel);for(let i=0;i<3;i++)line(ctx,[[-.13,.13+i*.1],[.12,.15+i*.1]],'#17283a',.025);ctx.restore();
 const bolt=hump(a,1.85,2.15);line(ctx,[[-.3-bolt*.38,-.05],[.05-bolt*.38,-.05]],'#fff8cc',.065);joint(ctx,-.3-bolt*.38,-.05,.055);
 if(p.tier===3)for(let j=0;j<3;j++){ctx.save();ctx.translate(-.36+j*.23,-.31);ctx.rotate(-reload*.9);poly(ctx,[[0,0],[.15,0],[.16,-.25],[.03,-.3]],steel);ctx.restore();if(reload>.3)line(ctx,[[-.26+j*.23,-.5],[-.21+j*.23+sin(p.time*4+j)*.04,-.8-reload*.2]],'#b9eaff',.02);}
 if(fire>.2){ctx.save();ctx.translate(.1+fire*.22,-.38-fire*.35);ctx.rotate(a*13);poly(ctx,[[-.05,-.03],[.09,-.03],[.09,.03],[-.05,.03]],'#eec264','#704516',.015);ctx.restore();}ctx.restore();
}
// Real 3D cube, back-face culling and per-face pips. V3 hinges are geometric.
const cubeFaces=[{n:[0,0,1],u:[1,0,0],v:[0,1,0],pip:1},{n:[0,0,-1],u:[-1,0,0],v:[0,1,0],pip:6},{n:[1,0,0],u:[0,0,-1],v:[0,1,0],pip:3},{n:[-1,0,0],u:[0,0,1],v:[0,1,0],pip:4},{n:[0,1,0],u:[1,0,0],v:[0,0,-1],pip:2},{n:[0,-1,0],u:[1,0,0],v:[0,0,1],pip:5}];
const pipPositions=n=>n===1?[[0,0]]:n===2?[[-.42,-.42],[.42,.42]]:n===3?[[-.42,-.42],[0,0],[.42,.42]]:n===4?[[-.42,-.42],[.42,-.42],[-.42,.42],[.42,.42]]:n===5?[[-.42,-.42],[.42,-.42],[0,0],[-.42,.42],[.42,.42]]:[[-.42,-.45],[.42,-.45],[-.42,0],[.42,0],[-.42,.45],[.42,.45]];
function diceGeometry(p){
 const moving=p.active,spin=moving?Math.min(p.age,2.5):p.time*.16;
 const endAngles=[[0,0],[Math.PI,0],[-Math.PI/2,0],[Math.PI/2,0],[0,Math.PI/2],[0,-Math.PI/2]][(p.roll-1)%6];
 const stop=moving?clamp((p.age-2.2)/.8):0,yaw=(.55+spin*(p.tier===1?2.8:4))*(1-stop)+endAngles[0]*stop, pitch=(.37+spin*2.1)*(1-stop)+endAngles[1]*stop;
 const roll=p.tier===2&&moving?sin(Math.min(p.age,3)*3)*(.4*(1-stop)):0;
 const rot=([x,y,z])=>{const X=x*cos(yaw)+z*sin(yaw),Z=-x*sin(yaw)+z*cos(yaw),Y=y*cos(pitch)-Z*sin(pitch),ZZ=y*sin(pitch)+Z*cos(pitch);return [X*cos(roll)-Y*sin(roll),X*sin(roll)+Y*cos(roll),ZZ];};
 const opening=p.tier===3&&moving?hump(p.age,.3,2.7)*1.1:0;
 const project=([x,y,z])=>{const k=4.5/(4.5-z);return [x*k,y*k-(p.tier===2&&moving?Math.abs(sin(p.age*4))*.35*(1-stop):0),z];};
 return cubeFaces.map(f=>{const make=(u,v)=>{const hingeV=opening?((v+1)*cos(opening)-1):v;const normal=1+(opening?(v+1)*sin(opening):0);return project(rot(f.n.map((n,i)=>(n*normal+f.u[i]*u+f.v[i]*hingeV)*.7)));};const normal=rot(f.n);return {...f,normal,points:[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>make(u,v)),pips:pipPositions(f.pip).map(([u,v])=>make(u,v)),z:rot(f.n)[2],visible:normal[2]>.03||opening>.1};}).sort((a,b)=>a.z-b.z);
}
function dice(ctx,p){for(const face of diceGeometry(p)){if(!face.visible)continue;const brightness=clamp(.55+face.z*.4),color=`rgb(${Math.round(150+105*brightness)},${Math.round(78+150*brightness)},${Math.round(85+145*brightness)})`;poly(ctx,face.points,color,'#6d1735',.045);for(const point of face.pips)circle(ctx,point[0],point[1],.085,'#841b40','#fff1d4',.012);}
 if(p.active&&p.age>3){ctx.font='bold .33px system-ui';ctx.textAlign='center';ctx.fillStyle='#fff0cb';ctx.fillText(String(p.roll),0,1.28);}}
function snake(ctx,p){
 const shed=p.tier>1&&p.active?p.a:0;
 if(shed){ctx.save();ctx.globalAlpha=.4*shed;const pts=[];for(let j=0;j<24;j++){const q=j/23;pts.push([-1.5+q*2.7,.48+sin(q*TAU)*.5+shed*.45]);}line(ctx,pts,'#d5ffc9',.27);ctx.restore();}
 const parts=[];for(let j=0;j<29;j++){const q=j/28,coil=p.tier===3&&p.active?p.a:0;const angle=q*TAU*(1+coil*.35);const x=-1.3+q*2.5+cos(angle)*coil*.5,y=sin(q*TAU*1.15-p.time*3)*(.43+.12*p.tier)+sin(angle)*coil*.45;parts.push([x,y]);}
 for(let j=0;j<parts.length;j++){const [x,y]=parts[j];circle(ctx,x,y,.08+j/28*.17,metal(ctx,'#d5ff7a','#3e9c31','#133e2c'),'#173a28',.025);if(j%2===0)line(ctx,[[x-.06,y-.08],[x+.06,y-.04]],'#a2d65b',.02);}
 const head=parts[28];ctx.save();ctx.translate(...head);const jaw=.1+(p.active?p.a*.24:0);poly(ctx,[[-.4,-.25],[.05,-.32],[.38,-.08],[.06,.04],[-.35,.01]],metal(ctx,'#deff87','#3a9c27','#123c22'));ctx.save();ctx.translate(-.25,0);ctx.rotate(jaw);poly(ctx,[[0,0],[.58,.04],[.3,.18],[-.05,.15]],'#48aa31','#163929',.035);ctx.restore();circle(ctx,.02,-.17,.07,'#ffdd5d','#171926',.025);poly(ctx,[[.14,0],[.2,.21],[.25,0]],'#ffffff',null);const tongue=.1+.23*Math.max(0,sin(p.time*7));line(ctx,[[.28,.04],[.28+tongue,.07],[.36+tongue,.01]],'#fb5477',.025);line(ctx,[[.28+tongue,.07],[.36+tongue,.13]],'#fb5477',.025);ctx.restore();
}
function hook(ctx,p){
 const active=p.active?clamp(p.age/1.2):.12,back=p.active?clamp((p.age-2.8)/1.5):0;
 const extend=(.45+active*1.2)*(1-back)+.45*back,angle=p.tier===1?-.8+p.a*.7:p.tier===2?-.9+p.a*1.8:-.9+sin(p.age*2)*p.a*1.6;
 const x=cos(angle)*extend,y=sin(angle)*extend;const points=[];for(let i=0;i<13;i++){const q=i/12;const xx=q*x,yy=q*y+sin(q*Math.PI)*.2*(1-p.a);points.push([xx,yy]);ctx.save();ctx.translate(xx,yy);ctx.rotate(angle+(i%2?Math.PI/3:0));ctx.beginPath();ctx.ellipse(0,0,.11,.055,0,0,TAU);ctx.strokeStyle=i%2?'#9eaec6':'#f1f5ff';ctx.lineWidth=.035;ctx.stroke();ctx.restore();}
 ctx.save();ctx.translate(x,y);ctx.rotate(angle+Math.PI/2);line(ctx,[[0,-.26],[0,.17]],'#d9e5ff',.11);ctx.beginPath();ctx.arc(-.22,.17,.23,-.05,Math.PI*1.3);ctx.strokeStyle=metal(ctx,'#ffffff','#8aabc9','#354963');ctx.lineWidth=.13;ctx.stroke();poly(ctx,[[-.39,-.02],[-.34,-.28],[-.18,-.08]],'#e2efff');if(p.tier===3)poly(ctx,[[.07,-.06],[.38,.22],[.27,.33],[.04,.17]],'#b1cce9');ctx.restore();
}
function draw(ctx,p){
 const {id,tier:t,time,a}=p;
 if(id===11){dice(ctx,p);return;}if(id===14){snake(ctx,p);return;}if(id===6){drawSpider(ctx,p);return;}
 if(id===7){wing(ctx,-1,p);wing(ctx,1,p);}
 if(id===0){for(let side of [-1,1]){ctx.save();ctx.translate(side*.64,-.38);ctx.rotate(side*(.2+sin(time*3)*.15-a*.55));poly(ctx,[[0,0],[side*.55,-.8],[side*.1,-.62],[-side*.13,.2]],metal(ctx,'#c2f9ff','#127ed4','#101f55'));ctx.restore();}}
 if(id===2){for(let i=0;i<5+t*2;i++){const q=i*TAU/(5+t*2),grow=.28+a*(t===3?.6:.3)+.04*sin(time*3+i);crystal(ctx,cos(q)*.86,sin(q)*.86,grow,q+Math.PI/2,'#9beb37');if(t===3&&a>.2){crystal(ctx,cos(q)*1.1,sin(q)*1.1,.3*a,q+1,'#ccff64');}}}
 if(id===4){const count=t===1?1:t===2?3:5;for(let i=0;i<count;i++){const q=i*TAU/count+(t===1?-.9+a*2:time*.6+a*2),rr=t===1?.9:1.45-a*.45;blade(ctx,q,rr,t===1?1:.65);}}
 if(id===9||id===12){const count=id===9?6+t*2:4+t*2;for(let i=0;i<count;i++){const q=i*TAU/count,delay=t===2?sin(i*.9+time*2)*.1:0,open=a+(t===3?sin(time*2+i)*.08:0);ctx.save();ctx.rotate(q);ctx.translate(0,-.86-open*.5-delay);ctx.rotate((i%2?1:-1)*open*.7);poly(ctx,[[-.16,.14],[0,-.45-t*.08],[.17,.12],[0,.3]],metal(ctx,id===9?'#fff2b5':'#edffff',id===9?'#ec8c20':'#50bff2',id===9?'#68292b':'#183f8c'));ctx.restore();}}
 if(id===7&&t===3){ctx.save();ctx.translate(0,-1.03);ctx.scale(1+p.a*.22,1+p.a*.22);poly(ctx,[[0,.27],[-.25,.02],[-.2,-.18],[0,-.06],[.2,-.18],[.25,.02]],'#ee3154','#ffd274',.045);ctx.restore();}
 // Body is kept stable; equipment above and below has its own transforms.
 ctx.save();if(id===0)ctx.scale(1-a*.12,1+a*.06);if(id===9&&t===3)ctx.translate(0,-a*.35);body(ctx,id,t);ctx.restore();
 if(id===1){const swing=t===1?-.8+a*2.4:t===2?-.8+(p.active?p.age*3:sin(time)*.12):-.8+a*3.4+sin(p.age*3)*a;ctx.save();ctx.rotate(swing);const r=t>1?1+a*.35:1;line(ctx,[[0,.1],[r,-1.1]],'#542b22',.13);line(ctx,[[.04,.06],[r+.03,-1.06]],'#ebc675',.035);ctx.translate(r,-1.1);poly(ctx,[[-.17,-.1],[.15,-.53],[.73,-.25],[.62,.31],[.19,.19]],metal(ctx,'#fff5e6','#929db1','#4a253e'));line(ctx,[[.73,-.25],[.62,.31]],'#ffffff',.05);if(t===3)poly(ctx,[[-.15,-.1],[-.55,-.29],[-.63,.23],[-.16,.19]],metal(ctx));ctx.restore();}
 if(id===3){const hand=t===1?a:sin(p.age*4)*a;for(let side of [-1,1]){ctx.save();ctx.translate(side*.65,.15);ctx.rotate(side*(.13+sin(time*3)*.07+(t===3?a*.8:0)));poly(ctx,[[0,-.3],[side*(.14+(t===3?a*.7:0)),.63],[side*.2,.96],[-side*.23,.69]],metal(ctx,'#af64e3','#54216e','#191331'));ctx.restore();}ctx.save();ctx.translate(.58,.32);ctx.rotate(-hand*.8);line(ctx,[[0,0],[.58*hand,.12]],'#552474',.2);circle(ctx,.58*hand,.12,.12,'#d6afec','#2b163b',.035);if(a>.2)circle(ctx,.58*hand,.08,.065,'#ffda64');ctx.restore();poly(ctx,[[-.57,.55],[-.25,.53],[-.17,.97],[-.66,.97]],'#53234f','#e4ac58',.025);if(t>1)for(let i=0;i<t;i++)blade(ctx,-.6+i*1.8+p.age*4*a,1+a*.7,.4);if(t===3&&a>.2){ctx.save();ctx.globalAlpha=.4;ctx.translate(-1.2*a,.06);body(ctx,id,t,.75);eyes(ctx);ctx.restore();}}
 if(id===5)gun(ctx,p);
 if(id===0&&t===3)for(let side of [-1,1]){ctx.save();ctx.translate(side*.71,.3);ctx.rotate(side*a*.85);poly(ctx,[[0,-.4],[side*.3,-.15],[side*.2,.56],[-side*.15,.42]],metal(ctx,'#e1ffff','#168edc','#132f66'));ctx.restore();}
 if(id===2&&p.active){for(let j=0;j<t+1;j++){const q=(p.age*.7+j/(t+1))%1;circle(ctx,-.35+j*.3,.6+q*.8,.025+.02*q,'#b2f835');}}
 if(id===7){const bite=p.attached||p.bloodLink||p.preview&&p.active&&p.age<2.6;for(let side of [-1,1])poly(ctx,[[side*.16,.25],[side*.29,.23],[side*.2,.52+(bite?.13:0)]],'#fff9ea','#381226',.02);if(t===2){for(let j=0;j<3;j++)circle(ctx,-.6+j*.6,-.7,.1,'#a90037','#f1bb59',.03);}if(bite){for(let j=0;j<5;j++){const q=(time*1.3+j/5)%1;circle(ctx,1.8*(1-q),.15+sin(q*Math.PI)*.25,.035,'#fc456b');}if(p.preview){ctx.font='bold .21px system-ui';ctx.textAlign='center';ctx.fillStyle='#a9f8b5';ctx.fillText('+HP',0,1.33);}}}
 if(id===8){for(let i=0;i<t;i++){ctx.save();ctx.rotate((i-(t-1)/2)*.44);const push=t===3?Math.abs(sin(p.age*3))*a:a;ctx.translate(0,.25-push*.4);line(ctx,[[0,.7],[0,-1.5-t*.1]],metal(ctx),.1);crystal(ctx,0,-1.5-t*.1,.55,0,'#ffe8a3');if(t>1)for(let side of [-1,1]){ctx.save();ctx.translate(0,-1.25);ctx.rotate(side*a*.8);poly(ctx,[[0,0],[side*.33,.15],[side*.12,-.25]],'#d2bc6f');ctx.restore();}ctx.restore();}}
 if(id===9){circle(ctx,0,t===3?-a*.35:0,.35+a*.08,'#fff3bb','#ff9c2d',.08);if(p.active)for(let j=0;j<t;j++){const rr=.6+((p.age*.8+j/t)%1)*1.3;ctx.beginPath();ctx.arc(0,0,rr,0,TAU);ctx.strokeStyle='#ffd98c';ctx.lineWidth=.03;ctx.stroke();}}
 if(id===10){ctx.save();ctx.translate(0,-(t===1?Math.abs(sin(p.age*3))*a*.7:a*.12));poly(ctx,[[-.4,.65],[.42,.65],[.3,.46],[.24,-.3],[.38,-.48],[.02,-.8],[-.2,-.51],[-.4,-.6],[-.5,-.3],[-.19,-.14],[-.28,.43]],metal(ctx,'#ffffff','#d9d7df','#4a4561'));circle(ctx,.07,-.49,.045,'#181b32');ctx.restore();if(t>1)for(let side of [-1,1]){ctx.save();ctx.translate(side*.81,-a*.5);poly(ctx,[[-.2,.65],[.2,.65],[.16,-.4],[.26,-.4],[.26,-.7],[.1,-.7],[.1,-.52],[-.1,-.52],[-.1,-.7],[-.26,-.7],[-.26,-.4],[-.16,-.4]],metal(ctx,'#ffffff','#adb9cf','#3d4462'));ctx.restore();}if(t===3){ctx.save();ctx.translate(a*.5,-1.02-a*.25);poly(ctx,[[-.52,.16],[-.64,-.25],[-.24,-.05],[0,-.47],[.24,-.05],[.64,-.25],[.52,.16]],metal(ctx));ctx.restore();}}
 if(id===12&&t===3&&p.active)for(let i=0;i<7;i++){const q=-Math.PI+i*Math.PI/6;crystal(ctx,cos(q)*(1.5-.5*a),sin(q)*(1.5-.5*a),.7*a,q+Math.PI/2,'#8bdeff');}
 if(id===12&&p.age>2.8&&p.age<4.2){ctx.save();ctx.globalAlpha=clamp(1-(p.age-2.8)/1.4);for(let j=0;j<4+t;j++){const q=j*TAU/(4+t);crystal(ctx,cos(q)*(1+(p.age-2.8)*.6),sin(q)+(p.age-2.8)*.5,.16,q+p.age,'#d9fdff');}ctx.restore();}
 if(id===13){const count=t===3?2:1;for(let j=0;j<count;j++){ctx.save();ctx.translate((j-(count-1)/2)*1.25,-.1);ctx.rotate(t===1?sin(time)*.22:(j%2?-1:1)*sin(p.age*1.7)*a);poly(ctx,[[-.35,-.48],[.38,-.43],[.52,.38],[-.45,.42]],metal(ctx,'#ffcbd5','#9d2e54','#30152e'));circle(ctx,.04,-.02,.27,'#fe4a72','#ffc6d9',.045);const open=p.active?a:.06;for(let i=0;i<6;i++){ctx.save();ctx.translate(.04,-.02);ctx.rotate(i*TAU/6);poly(ctx,[[0,-open*.24],[.25,-.3],[.36,-.04],[.05,-open*.24]],'#303044','#e890a9',.015);ctx.restore();}if(p.active&&a>.25)line(ctx,[[.04,0],[1.9,0]],'#ff80a3',.04);ctx.restore();}}
 if(id===15)hook(ctx,p);
}
function renderFrame(id,tier,extra={}){
 if(!Number.isInteger(id)||id<0||id>15)return null;tier=clamp(Math.trunc(tier||1),1,3);
 const time=Number(extra.time)||0,age=extra.age??(extra.attack>0?extra.attack*2.7:-100),p=poseFor(id,tier,time,age,extra);
 const key=[Math.floor(time*30),Math.floor(age*30),p.roll,p.attached,p.bloodLink,extra.strength].join(':'),n=id*3+tier-1;
 let slot=slots.get(n);if(!slot){const canvas=document.createElement('canvas');canvas.width=canvas.height=SIZE;slot={canvas,ctx:canvas.getContext('2d')};slots.set(n,slot);}if(slot.key===key)return slot.canvas;slot.key=key;
 const ctx=slot.ctx;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,SIZE,SIZE);ctx.translate(SIZE/2,SIZE/2);ctx.scale(R,R);ctx.lineJoin=ctx.lineCap='round';draw(ctx,p);return slot.canvas;
}
function remember(o,g,kind='ability'){if(o?.b?.id>=0&&o.b.id<16&&g?.ph==='battle'){const previous=events.get(o)||{};events.set(o,{...previous,at:g.rt||0,kind});}}
const original=specialAbility;specialAbility=function(o,foe){const result=original.apply(this,arguments);if(netRole!=='guest')remember(o,G);return result;};
function stateFor(o,g){const time=Number(g?.rt)||0;let e=events.get(o);if(!e){e={at:-100,wall:o.v2LastWallAt,shots:new WeakSet()};events.set(o,e);}if(o.v2LastWallAt!==e.wall){e.wall=o.v2LastWallAt;if([0,2,6,12,13,15].includes(o.b.id))e.at=time;}
 // Visible gunfire is keyed to actual spawned projectiles, including follow-up salvos.
 if(o.b.id===5)for(const shot of g?.v2?.shots||[])if(shot.owner===o.uid&&shot.age<.12&&!e.shots?.has(shot)){e.shots||=new WeakSet();e.shots.add(shot);e.at=time;}
 return {time,age:time-e.at,roll:o.v2LastRoll||1,attached:o.bvbBetaBite?.until>time,bloodLink:!!o.bvbBloodLink,strength:clamp((window.BVBMotion?.prefs?.().artIntensity??85)/100)};}
function drawActor(ctx,o,g){if(!ctx||!o?.b||o.b.id>15||o.b.id<0||!enabled('fight'))return false;const p=stateFor(o,g),cv=renderFrame(o.b.id,o.tier||1,p);if(!cv)return false;const side=o.r*SIZE/R;ctx.save();ctx.rotate(-(o.rotation||0));if(p.attached){const target=g.bl?.find(a=>a.uid===o.bvbBetaBite?.target);if(target)ctx.rotate(Math.atan2(target.y-o.y,target.x-o.x)-Math.PI/2);}ctx.drawImage(cv,-side/2,-side/2,side,side);ctx.restore();return true;}
let lastUI=-1000;
function renderPortraits(now){if(now-lastUI<33)return;lastUI=now;for(const svg of document.querySelectorAll('svg[data-ball-id][data-evolution]')){const id=Number(svg.dataset.ballId),tier=Number(svg.dataset.evolution);if(id<0||id>15)continue;const host=svg.parentElement;if(!host?.classList.contains('orb'))continue;const box=host.getBoundingClientRect();if(box.width<=0||box.height<=0||box.bottom<0||box.top>innerHeight)continue;let cv=host.querySelector('canvas.bvb-motion-portrait');if(!enabled('inventory')){svg.style.visibility='';if(cv)cv.hidden=true;continue;}
 const time=now/1000,mode=host.closest('[data-animation-preview]')?.dataset.animationPreview||'idle';const age=mode==='ability'?time%6:-100;const frame=renderFrame(id,tier,{time,age,preview:true});if(!cv){cv=document.createElement('canvas');cv.width=cv.height=SIZE;cv.className='bvb-motion-portrait';cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';host.appendChild(cv);}cv.hidden=false;svg.style.visibility='hidden';const ctx=cv.getContext('2d');ctx.clearRect(0,0,SIZE,SIZE);ctx.drawImage(frame,0,0);}}
const style=document.createElement('style');style.textContent='.orb:has(>svg[data-ball-id]){animation:none!important}.orb>svg[data-ball-id] *{animation:none!important}.orb canvas.bvb-motion-portrait{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}#labAnimations button,#labAnimations select{padding:10px;border:1px solid #79a2bc;background:#243d5b;color:white;border-radius:8px;font:inherit}';document.head.appendChild(style);
window.BVBBatch01Animation=Object.freeze({count:48,catalogue,entry,poseFor,diceGeometry,renderFrame,drawActor,renderPortraits,notifyAbility:remember,cacheSize:()=>slots.size,stateFor});
})();

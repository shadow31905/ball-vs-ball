'use strict';
// Texture packaging from the approved board; no redraw or recoloring.
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('sharp');
const root=path.join(__dirname,'..'),source=process.argv[2]||path.join(root,'art-source','first16-board.png');
const colors=['#39dfff','#ff4949','#a4ed2c','#c17cff','#9cdcff','#e9ae65','#af8aff','#ff4565','#57e2dd','#ffc442','#ffe6a1','#a6ed70','#78dfff','#ff6487','#64e987','#71bdf5'];
const rowStarts=[52,367,678,992],rowEnds=[187,508,821,1135];
const xBounds=[[5,312],[318,625],[632,939],[946,1251]];
const centersY=[141,468,782,1098];
function removeBackground(data,w,h){
 const q=new Int32Array(w*h),seen=new Uint8Array(w*h);let a=0,b=0;
 const visit=p=>{if(seen[p])return;seen[p]=1;const n=p*4;if(Math.max(data[n],data[n+1],data[n+2])>64)return;q[b++]=p;};
 for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x);}
 for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1);}
 while(a<b){const p=q[a++],x=p%w,y=Math.floor(p/w);data[p*4+3]=0;if(x)visit(p-1);if(x+1<w)visit(p+1);if(y)visit(p-w);if(y+1<h)visit(p+w);}
 // Remove card separators, badge remnants and isolated subpixel noise.
 const checked=new Uint8Array(w*h);
 for(let start=0;start<w*h;start++){
  if(checked[start]||!data[start*4+3])continue;
  let read=0,write=0,l=w,t=h,r=-1,bot=-1;q[write++]=start;checked[start]=1;
  while(read<write){const p=q[read++],x=p%w,y=Math.floor(p/w);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);bot=Math.max(bot,y);
   for(const n of [x?p-1:-1,x+1<w?p+1:-1,y?p-w:-1,y+1<h?p+w:-1])if(n>=0&&!checked[n]&&data[n*4+3]){checked[n]=1;q[write++]=n;}
  }
  const ww=r-l+1,hh=bot-t+1;
  if(write<3||(hh<=5&&ww>22)||(ww<=3&&hh>30)||(t<9&&hh<14&&ww>18))for(let j=0;j<write;j++)data[q[j]*4+3]=0;
 }
 return data;
}
(async()=>{
 const png=await fs.readFile(source),info=await sharp(png).metadata(),rigs=[];
 if(info.width!==1254||info.height!==1254)throw new Error('Source board dimensions changed');
 const out=path.join(root,'assets/approved-first16');await fs.mkdir(out,{recursive:true});
 for(let id=0;id<16;id++)for(let tier=1;tier<=3;tier++){
  const row=id>>2,col=id%4,[left,right]=xBounds[col],innerL=left+4,innerR=right-4;
  const x=Math.round(innerL+(tier-1)*(innerR-innerL)/3),end=Math.round(innerL+tier*(innerR-innerL)/3);
  const y=rowStarts[row],w=end-x,h=rowEnds[row]-y;
  const rgba=await sharp(png).extract({left:x,top:y,width:w,height:h}).ensureAlpha().raw().toBuffer();
  removeBackground(rgba,w,h);
  const sourceCX=left+(tier-.5)*(right-left)/3,sourceCY=centersY[row],cardTop=[3,317,632,946][row];
  for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
   const p=(yy*w+xx)*4,gx=x+xx,gy=y+yy,dist=Math.hypot(gx-sourceCX,gy-sourceCY);
   if(tier===1&&gx<left+76&&gy<cardTop+65){rgba[p+3]=0;continue;}
   const edge=Math.min(xx,yy,w-1-xx,h-1-yy),feather=Math.max(0,Math.min(1,edge/7));
   const reach=[80,92,70,75,75,65,75,85,96,80,100,90,100,100,110,110][id];
   const radial=Math.hypot((gx-sourceCX)/52,(gy-sourceCY)/reach),edgeAlpha=Math.max(0,Math.min(1,(1.05-radial)/.30));
   if(dist<30)rgba[p+3]=255;
   else rgba[p+3]=Math.round(rgba[p+3]*Math.max(0,Math.min(1,(Math.max(rgba[p],rgba[p+1],rgba[p+2])-45)/150)));
   rgba[p+3]=Math.round(rgba[p+3]*feather*(dist<30?1:edgeAlpha));
  }
  let l=w,t=h,r=-1,b=-1;
  for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(rgba[(yy*w+xx)*4+3]){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);}
  if(r<l)throw new Error('Empty frame '+id+' V'+tier);
  const ww=r-l+1,hh=b-t+1,side=Math.max(ww,hh)+8,dx=Math.floor((side-ww)/2),dy=Math.floor((side-hh)/2);
  const output=Buffer.alloc(side*side*4);
  for(let yy=0;yy<hh;yy++)for(let xx=0;xx<ww;xx++){
   const a=((yy+t)*w+xx+l)*4,d=((yy+dy)*side+xx+dx)*4;rgba.copy(output,d,a,a+4);
  }
  const cx=(left+[(right-left)/6,(right-left)/2,5*(right-left)/6][tier-1]-x-l+dx)*128/side;
  const cy=(centersY[row]-y-t+dy)*128/side;
  rigs.push({id,tier,cx:+cx.toFixed(2),cy:+cy.toFixed(2),r:+(31.5*128/side).toFixed(2)});
  await sharp(output,{raw:{width:side,height:side,channels:4}}).resize(256,256,{kernel:'nearest'}).webp({lossless:true}).toFile(path.join(out,'ball-'+String(id).padStart(2,'0')+'-v'+tier+'.webp'));
 }
 const hash=crypto.createHash('sha256').update(png).digest('hex');
 await fs.writeFile(path.join(root,'bvb-approved-rig-layout.js'),"/* Approved board SHA256: "+hash+". Source-pixel texture rig coordinates. */\nwindow.BVBApprovedRigLayout=Object.freeze("+JSON.stringify(rigs)+");\n");
 console.log(JSON.stringify({frames:rigs.length,sourceHash:hash}));
})().catch(error=>{console.error(error);process.exitCode=1;});

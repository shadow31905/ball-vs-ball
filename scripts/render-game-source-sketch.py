#!/usr/bin/env python3
"""Reference boards from the game's real pixel assets and real authored SVGs.
DO NOT generate or invent replacement character art here. Sprite atlas uses
transparent 256x256 tiles with an exact manifest for later in-game integration.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps
import json,io,zipfile,math,sys,shutil
import cairosvg
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'out-game-source-sketch'
MAN=json.loads((OUT/'manifest.json').read_text())
BALLS=MAN['balls']
assert len(BALLS)==49 and [x['id'] for x in BALLS]==list(range(49))
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(size,bold=True):return ImageFont.truetype(BOLD if bold else FONT,size)
def hex_color(v):
 try:return tuple(int(v.lstrip('#')[i:i+2],16) for i in (0,2,4))
 except Exception:return (150,190,255)
def rgb_trans(c):return (*c,255)
PNG=OUT/'separate-transparent-pngs';PNG.mkdir(exist_ok=True)
art={}
for ball in BALLS:
 for stage,path in enumerate(ball['paths'],1):
  source=ROOT/path if ball['id']<16 else OUT/path
  if ball['id']<16:
   im=Image.open(source).convert('RGBA')
  else:
   svg=source.read_text()
   raw=cairosvg.svg2png(bytestring=svg.encode('utf-8'),output_width=256,output_height=256)
   im=Image.open(io.BytesIO(raw)).convert('RGBA')
  if im.size!=(256,256):
   im=im.resize((256,256),Image.Resampling.LANCZOS)
  alpha=im.getchannel('A')
  bbox=alpha.getbbox()
  assert bbox is not None and bbox[2]-bbox[0]>=12 and bbox[3]-bbox[1]>=12,('empty',ball['id'],stage)
  name=f"ball_{ball['id']:02d}_V{stage}.png"
  im.save(PNG/name,optimize=True)
  art[(ball['id'],stage)]=im

cardsize=(608,538);margin=16;gap=14
canvasW=margin*2+4*cardsize[0]+gap*3
canvasH=margin*2+4*cardsize[1]+gap*3
font_title=font(29)
font_num=font(32)
font_small=font(25)
font_note=font(18,False)
font_top=font(22)
def crop_and_fit(im,size=172):
 # Keep ALL authored contours, highlights, weapons and visible VFX inside its
 # assigned box. No neighbouring ball may cover another ball's alpha.
 box=im.getchannel('A').getbbox()
 if not box:return im
 x0,y0,x1,y1=box
 px=max(x1-x0,y1-y0)
 padx=max(0,int(px*.045))
 x0=max(0,x0-padx);y0=max(0,y0-padx);x1=min(im.width,x1+padx);y1=min(im.height,y1+padx)
 cropped=im.crop((x0,y0,x1,y1))
 cropped.thumbnail((size,size),Image.Resampling.LANCZOS)
 return cropped
def rounded_rectangle(draw,xy,fill,outline=None,width=1,radius=11):
 draw.rounded_rectangle(xy,radius=radius,fill=fill,outline=outline,width=width)
def draw_card(sheet,ball,x,y):
 num=ball['id'];r,g,b=hex_color(ball['color'])
 border=(r,g,b);soft=tuple(min(255,int(v*.48+10)) for v in border)
 W,H=cardsize; d=ImageDraw.Draw(sheet)
 rounded_rectangle(d,(x,y,x+W,y+H),fill='#060710',outline=border,width=4,radius=18)
 d.rectangle((x+6,y+65,x+W-6,y+69),fill=border)
 rounded_rectangle(d,(x+11,y+12,x+69,y+60),fill='#02030a',outline=border,width=3,radius=10)
 d.text((x+40,y+34),str(num),font=font_num,fill='white',anchor='mm')
 title=ball['name']
 size=32
 while size>19 and d.textbbox((0,0),title,font=font(size))[2]>W-160:size-=1
 d.text((x+W//2+26,y+35),title,fill='white',font=font(size),anchor='mm')
 tile_size=174;between=19
 spots=[x+17+j*(tile_size+between) for j in range(3)]
 for idx,stage in enumerate((1,2,3)):
  xx=spots[idx];yy=y+91
  rounded_rectangle(d,(xx,yy,xx+tile_size,yy+tile_size),fill='#000000',outline=soft,width=1,radius=12)
  sprite=crop_and_fit(art[(num,stage)],166)
  sx=xx+(tile_size-sprite.width)//2;sy=yy+(tile_size-sprite.height)//2
  sheet.alpha_composite(sprite,(sx,sy))
  d.text((xx+tile_size//2,yy+tile_size+21),'V'+str(stage),
   font=font_small,fill='white',anchor='mm')
 d.line([(x+18,y+306),(x+W-18,y+306)],fill=border,width=2)
 d.text((x+23,y+330),'ORYGINALNE WARIANTY W GRZE',
        font=font(20),fill=border,anchor='lm')
 origin={'approved-first16-raster':'Raster gry • zatwierdzone grafiki V1–V3',
         'beta-17-32-svg':'Obecne grafiki SVG z bety • V1–V3',
         'beta-33-48-svg':'Obecne grafiki SVG z bety • V1–V3',
         'beta-49-svg':'Obecna grafika SVG z bety • V1–V3'}.get(ball['origin'],'Gra V1–V3')
 d.text((x+23,y+368),origin,font=font(21,False),fill='#e2e6ff',anchor='lm')
 d.text((x+23,y+407),'Zachowano wygląd postaci bez wymyślania nowych motywów.',
         font=font(16,False),fill='#b7c4e0',anchor='lm')
 d.text((x+23,y+450),'Do wycinania użyj plików PNG 256 × 256 z paczki.',
        font=font(16,False),fill='#a0aac4',anchor='lm')
 d.text((x+23,y+493),'Tło sprite’ów: przezroczyste',font=font(16,False),fill='#b8e4d7',anchor='lm')
for group,(start,end) in enumerate([(0,15),(16,31),(32,47)]):
 sheet=Image.new('RGBA',(canvasW,canvasH),(0,0,0,255))
 for k,id in enumerate(range(start,end+1)):
  x=margin+(k%4)*(cardsize[0]+gap);y=margin+(k//4)*(cardsize[1]+gap)
  draw_card(sheet,BALLS[id],x,y)
 filename=f'BVB_SZKIC_Z_GRY_{start:02d}-{end:02d}.png'
 sheet.convert('RGB').save(OUT/filename,optimize=True)
 print('SOURCE SHEET',filename,sheet.size)
# extra #48
single=Image.new('RGBA',(cardsize[0]+2*margin,cardsize[1]+2*margin),(0,0,0,255))
draw_card(single,BALLS[48],margin,margin)
single.convert('RGB').save(OUT/'BVB_SZKIC_Z_GRY_48.png',optimize=True)
# Sprite atlas: first16 48 sprites, layout 3 columns x 16 rows, transparent.
for start,end in [(0,15),(16,31),(32,47),(48,48)]:
 atlas=Image.new('RGBA',(3*256,(end-start+1)*256),(0,0,0,0))
 places=[]
 for j,id in enumerate(range(start,end+1)):
  for tier in (1,2,3):
   pos=((tier-1)*256,j*256)
   atlas.alpha_composite(art[(id,tier)],pos)
   places.append(dict(id=id,tier=tier,x=pos[0],y=pos[1],w=256,h=256,
      name=BALLS[id]['name'],original_source=BALLS[id]['origin']))
 fname=f'BVB_ATLAS_ORYGINALNYCH_SPRITOW_{start:02d}-{end:02d}.png'
 atlas.save(OUT/fname,optimize=True)
 (OUT/(fname+'.json')).write_text(json.dumps(places,ensure_ascii=False,indent=2))
 print('ALPHA ATLAS',fname,atlas.size)
assert len(list(PNG.glob('ball_*.png')))==147
with zipfile.ZipFile(OUT/'BVB_0-48_ORYGINALNE_GRAFIKI_DO_GRY.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.write(OUT/'manifest.json','manifest.json')
 for png in sorted(PNG.glob('ball_*.png')):z.write(png,'sprites/'+png.name)
 for path in sorted(OUT.glob('BVB_ATLAS_ORYGINALNYCH_SPRITOW*')):
  z.write(path,path.name)
print('PASS: 49 balls; 147 actual-source stages; no invented names; isolated transparent sprites and clean source reference sheets')

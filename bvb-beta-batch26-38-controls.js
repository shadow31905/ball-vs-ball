/* Ball VS Ball · beta-only shortcut for batch 26–38.
   Keeps full collection unlock and a separate beta save, never shipped to main. */
(function(){
'use strict';
const choices=[
[26,'Łuk'],[27,'Król Elektryków'],[28,'Zasięg'],[29,'Mróz'],
[30,'Harpun'],[31,'Rój'],[32,'Eliksir'],[33,'Konduktor'],
[34,'Czarny Pająk'],[35,'Grób'],[36,'Skrzydło Światła'],
[37,'Pudełko Cukierków'],[38,'Szlam']
];
const wrap=document.createElement('aside');
wrap.id='bvb-beta-2638';
wrap.style.cssText='position:fixed;z-index:99999;bottom:12px;left:12px;max-width:calc(100vw - 24px);font:14px system-ui,sans-serif;color:#e9f5ff;';
const toggle=document.createElement('button');
toggle.textContent='🧪 BETA · PARTIA 26–38';
toggle.style.cssText='padding:10px 14px;border-radius:12px;background:#0e5877;color:#fff;border:2px solid #6dd9f1;font:700 13px system-ui;cursor:pointer;box-shadow:0 4px 18px #0009;';
toggle.setAttribute('aria-expanded','false');
const pane=document.createElement('div');
pane.style.cssText='display:none;max-width:390px;margin-top:5px;padding:14px;border:1px solid #517f96;border-radius:14px;background:#11243a;box-shadow:0 10px 25px #000a;';
const head=document.createElement('div');
head.textContent='🎮 Testy 13 kulek · 39 ewolucji';
head.style.cssText='font-weight:850;margin-bottom:10px;';
const row=document.createElement('div');
row.style.cssText='display:flex;gap:6px;flex-wrap:wrap;';
const ball=document.createElement('select');
for(const [id,name] of choices){const opt=document.createElement('option');opt.value=String(id);opt.textContent='#'+id+' · '+name;ball.appendChild(opt);}
ball.value='33';
const stage=document.createElement('select');
for(const level of [1,2,3]){const opt=document.createElement('option');opt.value=String(level);opt.textContent='V'+level;stage.appendChild(opt);}
stage.value='1';
for(const el of [ball,stage]){el.style.cssText='background:#203c56;border:1px solid #6a8fa8;border-radius:8px;padding:9px;color:#f7fbff;font:inherit;max-width:100%;';row.appendChild(el);}
const action=document.createElement('button');
action.textContent='▶ Testuj z botem';
action.style.cssText='margin-top:9px;background:#0a839a;color:white;border:1px solid #6be2f5;border-radius:9px;padding:10px 12px;cursor:pointer;font:700 13px system-ui;';
const help=document.createElement('p');
help.style.cssText='font:12px/1.5 system-ui;color:#b3cbe0;margin:9px 0 0;';
help.textContent='Wszystkie 130 kulek i ewolucje są dostępne w tej becie. Wybierz kulkę i V1/V2/V3 do pojedynku.';
action.addEventListener('click',()=>{
 const id=Number(ball.value),lv=Number(stage.value);
 if(!B[id]||id<26||id>38)return;
 S.tr ||= {};S.tr[id]=lv;
 if(typeof save==='function')save();
 if(typeof startMatch!=='function')return;
 startMatch(0);
 if(G&&Array.isArray(G.my)&&G.ph==='draft'){
   G.my=[B[id],B[id],B[id]];
   if(typeof renderDraft==='function')renderDraft();
 }
 toggle.click();
});
toggle.addEventListener('click',()=>{
 const open=pane.style.display==='none';
 pane.style.display=open?'block':'none';
 toggle.setAttribute('aria-expanded',String(open));
});
pane.append(head,row,action,help);wrap.append(toggle,pane);
document.body.appendChild(wrap);
})();
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const source=fs.readFileSync(path.join(__dirname,'..','bvb-changelog-v3.js'),'utf8');

function loadReleaseNotes(storage){
 const byId=new Map(),events=new Map();
 const document={
  activeElement:null,
  getElementById(id){return byId.get(id)||null;},
  createElement(tag){
   const el={tag,children:[],hidden:false,textContent:'',style:{},listeners:new Map(),
    append(...nodes){this.children.push(...nodes);},
    appendChild(node){this.children.push(node);},
    setAttribute(){},
    addEventListener(name,fn){this.listeners.set(name,fn);},
    focus(){document.activeElement=this;},
    click(){this.listeners.get('click')?.({target:this});}
   };
   Object.defineProperty(el,'id',{get(){return this._id;},set(id){this._id=id;byId.set(id,el);}});
   return el;
  },
  head:null,body:null,
  querySelector(selector){return selector==='#bvb3_account .bvb3-actions'?actions:null;}
 };
 document.head=document.createElement('head');
 document.body=document.createElement('body');
 const actions=document.createElement('section');
 const gate=document.createElement('div');gate.id='accountGate';gate.hidden=true;
 const window={
  addEventListener(name,fn){events.set(name,fn);},
  dispatchEvent(event){events.get(event.type)?.(event);}
 };
 const localStorage={
  getItem(key){return storage.has(key)?storage.get(key):null;},
  setItem(key,value){storage.set(key,String(value));},
  removeItem(key){storage.delete(key);}
 };
 vm.runInNewContext(source,{window,document,localStorage,setTimeout:fn=>{fn();return 1;},clearTimeout:()=>{}},{filename:'bvb-changelog-v3.js'});
 return {window,document,actions,modal:document.getElementById('bvb2ReleaseModal'),enter(){window.dispatchEvent({type:'bvb-entered-game'});}};
}

test('changelog opens automatically once per release and not again on game entry',()=>{
 const storage=new Map();
 const first=loadReleaseNotes(storage);
 assert.equal(first.modal.hidden,true);
 first.enter();
 assert.equal(first.modal.hidden,false);
 assert.equal(storage.get('bvb-release-notes-seen-2.0.1'),'1');
 first.window.BVB2ReleaseNotes.hide();
 first.enter();
 assert.equal(first.modal.hidden,true);
 const next=loadReleaseNotes(storage);
 next.enter();
 assert.equal(next.modal.hidden,true,'reloading the game must not reopen the release notes');
 assert.equal(next.actions.children.length,1,'a manual history button should remain available');
 next.actions.children[0].click();
 assert.equal(next.modal.hidden,false,'manual reopening must work even after automatic display');
});

test('opt-out disables automatic changelog without blocking manual opening',()=>{
 const storage=new Map([['bvb-release-notes-optout','1']]);
 const h=loadReleaseNotes(storage);
 h.enter();
 assert.equal(h.modal.hidden,true);
 h.window.BVB2ReleaseNotes.open();
 assert.equal(h.modal.hidden,false);
});

test('full rework changelog has several categories and an accessible dialog',()=>{
 const h=loadReleaseNotes(new Map());
 assert.equal(h.modal.tag,'div');
 assert.equal(h.modal.children[0].children.filter(n=>n.tag==='h3').length>=7,true);
 const full=h.modal.children[0].children.flatMap(n=>n.children||[]).map(n=>n.textContent).join(' ');
 assert.match(full,/130/);
 assert.match(full,/V1\/V2\/V3/);
 assert.match(full,/TURN/);
 assert.match(full,/powtór/);
});

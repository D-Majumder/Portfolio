const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function bootHarness() {
  let now=0;
  const timers=[];
  const errors=[];
  class Element {
    constructor(){this.value='';this.style={};this.textContent='';this.listeners=new Map(); const classes=new Set();this.classList={add:(...items)=>items.forEach(x=>classes.add(x)),remove:(...items)=>items.forEach(x=>classes.delete(x)),contains:x=>classes.has(x)};}
    addEventListener(type,fn,options){const list=this.listeners.get(type)||[];list.push({fn,once:options?.once});this.listeners.set(type,list);}
    removeEventListener(type,fn){this.listeners.set(type,(this.listeners.get(type)||[]).filter(item=>item.fn!==fn));}
    dispatch(type,values={}){for(const item of [...(this.listeners.get(type)||[])]){if(item.once)this.removeEventListener(type,item.fn);item.fn({type,preventDefault(){},...values});}}
    focus(){}
  }
  const elements=Object.fromEntries(['boot-screen','boot-mark','type-line-1','type-line-2','name-entry','username-input','boot-continue','boot-status'].map(id=>[id,new Element()]));
  const ctx=vm.createContext({Date,console:{error:(...args)=>errors.push(args)},document:{getElementById:id=>elements[id]},setTimeout:(fn,ms)=>{timers.push({fn,at:now+ms});}});
  const file=process.env.BOOT_SOURCE || path.join(__dirname,'../js/shared.js');
  vm.runInContext(fs.readFileSync(file,'utf8')+'\nglobalThis.boot=runBootSequence;globalThis.username=()=>CURRENT_USERNAME;',ctx);
  const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
  async function drain(){for(let i=0;i<10000;i++){await flush();if(!timers.length)return;timers.sort((a,b)=>a.at-b.at);const timer=timers.shift();now=timer.at;timer.fn();}throw Error('Timer loop did not settle');}
  return {ctx,e:elements,errors,drain,flush};
}
test('arrow opens on first attempt and keeps boot visible while the app callback runs',async()=>{
  const h=bootHarness();let calls=0,covered=false;
  const done=h.ctx.boot(()=>{calls++;covered=!h.e['boot-screen'].classList.contains('hidden');});
  await h.drain();h.e['username-input'].value='Dhruba';h.e['boot-continue'].dispatch('click');await h.drain();await done;
  assert.equal(calls,1);assert.equal(covered,true);assert.equal(h.ctx.username(),'Dhruba');assert.equal(h.e['boot-screen'].classList.contains('hidden'),true);
});
test('early arrow/keyboard submission during the animation is not lost',async()=>{
  for(const method of ['click','keydown']){
    const h=bootHarness();let calls=0;h.ctx.boot(()=>calls++);h.e['username-input'].value='Early visitor';
    h.e[method==='click'?'boot-continue':'username-input'].dispatch(method,{key:'Enter'});await h.drain();
    assert.equal(calls,1);assert.equal(h.ctx.username(),'Early visitor');
  }
});
test('rapid repeated arrow and Enter submit only once',async()=>{
  const h=bootHarness();let calls=0;const done=h.ctx.boot(()=>calls++);await h.drain();
  h.e['boot-continue'].dispatch('click');h.e['boot-continue'].dispatch('click');h.e['username-input'].dispatch('keydown',{key:'Enter'});await h.drain();await done;assert.equal(calls,1);
});
test('blank name opens as Guest, ordinary keys do not submit',async()=>{
  const h=bootHarness();let calls=0;h.ctx.boot(()=>calls++);await h.drain();h.e['username-input'].dispatch('keydown',{key:'a'});await h.drain();assert.equal(calls,0);
  h.e['username-input'].value='   ';h.e['username-input'].dispatch('keydown',{key:'Enter'});await h.drain();assert.equal(h.ctx.username(),'Guest');assert.equal(calls,1);
});
test('reboot/logout entry cycles clean up both handlers and use the new name',async()=>{
  const h=bootHarness();let calls=0;
  for(let i=0;i<4;i++){
    const done=h.ctx.boot(()=>calls++);await h.drain();h.e['username-input'].value='Visitor '+i;
    if(i%2)h.e['username-input'].dispatch('keydown',{key:'Enter'});else h.e['boot-continue'].dispatch('click');
    await h.drain();await done;assert.equal(h.ctx.username(),'Visitor '+i);
    assert.equal(h.e['boot-continue'].listeners.get('click').length,0);assert.equal(h.e['username-input'].listeners.get('keydown').length,0);
  }
  assert.equal(calls,4);
});
test('failed startup stays visible with a working retry instead of a blank page',async()=>{
  const h=bootHarness();let attempts=0;const done=h.ctx.boot(()=>{if(++attempts===1)throw Error('simulated missing script');});await h.drain();
  h.e['username-input'].value='Retry';h.e['boot-continue'].dispatch('click');await h.drain();
  assert.equal(h.e['boot-screen'].classList.contains('hidden'),false);assert.match(h.e['boot-status'].textContent,/try Continue again/);assert.equal(h.e['boot-continue'].disabled,false);assert.equal(h.e['username-input'].readOnly,false);
  h.e['boot-continue'].dispatch('click');await h.drain();await done;assert.equal(attempts,2);assert.equal(h.e['boot-screen'].classList.contains('hidden'),true);assert.equal(h.errors.length,1);
});
test('async initialization finishes before boot is dismissed',async()=>{
  const h=bootHarness();let release;const initialized=new Promise(resolve=>release=resolve);const done=h.ctx.boot(()=>initialized);await h.drain();h.e['boot-continue'].dispatch('click');await h.drain();
  assert.equal(h.e['boot-screen'].classList.contains('hidden'),false);assert.equal(h.e['boot-continue'].disabled,true);release();await h.drain();await done;assert.equal(h.e['boot-screen'].classList.contains('hidden'),true);
});

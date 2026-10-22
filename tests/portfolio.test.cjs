const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const root = require('node:path').join(__dirname, '..');
const source = name => fs.readFileSync(require('node:path').join(root, 'js', name), 'utf8');
function context(fetch) {
  const cache = new Map();
  const ctx = vm.createContext({fetch, console, URL, Date, setTimeout, clearTimeout,
    localStorage: {getItem: key => cache.get(key), setItem: (key,value) => cache.set(key,value)},
    document: {createElement: () => ({set textContent(value) {this.innerHTML = String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');}})}
  });
  vm.runInContext(source('github.js') + '\nglobalThis.projects = GitHubProjects;', ctx);
  return ctx;
}
const repo = (full_name, extra = {}) => ({name: full_name.split('/')[1], full_name, html_url: 'https://github.com/'+full_name, description:'Example', language:'Python', pushed_at:new Date().toISOString(), stargazers_count:0, forks_count:0, ...extra});
test('merges selected company projects, deduplicates, pins case-insensitively, hides forks and private repos', async () => {
  const selected = repo('ANABHAY-VENTURES/Witnessgraph');
  const ctx = context(async url => ({ok:true,json:async () => url.includes('/users/') ? [repo('D-Majumder/gesture-board'), selected, repo('D-Majumder/private',{private:true}),repo('D-Majumder/fork',{fork:true})] : selected}));
  const el = {};
  await ctx.projects.renderInto(el,{username:'D-Majumder',selectedRepos:['ANABHAY-VENTURES/Witnessgraph'],pinnedOverride:['D-Majumder/Gesture-Board']});
  assert.match(el.innerHTML,/Featured/);
  assert.equal((el.innerHTML.match(/<h4>ANABHAY-VENTURES\/Witnessgraph<\/h4>/g)||[]).length,1);
  assert.doesNotMatch(el.innerHTML, /<h4>D-Majumder\/(private|fork)/);
});
test('personal feed remains available when a selected repository fails', async () => {
  const ctx = context(async url => { if(!url.includes('/users/')) throw Error('offline'); return {ok:true,json:async () => [repo('D-Majumder/pulse')]}; });
  const el = {};
  await ctx.projects.renderInto(el,{username:'D-Majumder',selectedRepos:['ANABHAY-VENTURES/Witnessgraph']});
  assert.match(el.innerHTML,/Some GitHub updates are unavailable/);
  assert.match(el.innerHTML,/<h4>D-Majumder\/pulse/);
});
test('complete API failure offers a direct GitHub link', async () => {
  const ctx=context(async () => {throw Error('offline');});
  const el={};
  await ctx.projects.renderInto(el,{username:'D-Majumder'});
  assert.match(el.innerHTML,/View repos directly on GitHub/);
});
test('desktop and mobile share updated profile, company and project content', () => {
  const ctx = vm.createContext({Date, window: {addEventListener() {}}, document: {addEventListener() {}}});
  vm.runInContext(['data.js','shared.js','desktop.js','mobile.js'].map(source).join('\n')+'\nglobalThis.apps = [buildApps(),buildMobileApps()]; globalThis.commands = terminalCommands();',ctx);
  for(const apps of ctx.apps) {
    assert.match(apps.find(a=>a.id==='about').render(), /Founder, ANABHAY VENTURES/);
    assert.match(apps.find(a=>a.id==='contact').render(), /dhrubamajumder@proton.me/);
    assert.match(apps.find(a=>a.id==='contact').render(), /https:\/\/anabhay.in\//);
    assert.match(apps.find(a=>a.id==='projects').render(), /Witnessgraph/);
    assert.match(apps.find(a=>a.id==='projects').render(), /Physical safety validation remains outstanding/);
  }
  assert.match(ctx.commands.company(),/Founder, ANABHAY VENTURES/);
});



test('home screen actions dispatch the requested app without accumulating reboot listeners', () => {
  const ctx = vm.createContext({Date});
  vm.runInContext(source('data.js')+'\n'+source('shared.js')+'\nglobalThis.home=studioHomeHTML; globalThis.wire=wireStudioHome;',ctx);
  const html = ctx.home();
  for(const id of ['projects','about','contact']) assert.match(html,new RegExp('data-open-app="'+id+'"'));
  const calls=[];
  const container={contains:()=>true};
  ctx.wire(container,id=>calls.push('old:'+id));
  ctx.wire(container,id=>calls.push(id));
  container.onclick({target:{closest:()=>({dataset:{openApp:'projects'}})}});
  assert.deepEqual(calls,['projects']);
});

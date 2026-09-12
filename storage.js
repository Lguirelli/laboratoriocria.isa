(() => {
  'use strict';
  const NS='psd-editor-store:v4';
  const DB_NAME='psd-editor-db';
  const STORE='kv';
  const NAME_PREFIX='__PSD_EDITOR_STATE__:';
  let memory={};
  let db=null;

  const parse=(x,f={})=>{try{const v=JSON.parse(x);return v==null?f:v}catch{return f}};
  function readWindowName(){
    if(!window.name||!window.name.startsWith(NAME_PREFIX))return {};
    return parse(window.name.slice(NAME_PREFIX.length),{});
  }
  function writeWindowName(bundle){try{window.name=NAME_PREFIX+JSON.stringify(bundle)}catch{}}
  function canLocal(){try{const k='__store_test__';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch{return false}}
  const localOK=canLocal();
  if(localOK) memory=parse(localStorage.getItem(NS),{});
  memory={...readWindowName(),...memory};

  function persistFallback(){
    if(localOK){try{localStorage.setItem(NS,JSON.stringify(memory))}catch{}}
    writeWindowName(memory);
  }
  function openDB(){
    return new Promise(resolve=>{
      if(!('indexedDB' in window)){resolve(null);return}
      try{
        const req=indexedDB.open(DB_NAME,1);
        req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE)};
        req.onsuccess=()=>resolve(req.result);
        req.onerror=()=>resolve(null);
        req.onblocked=()=>resolve(null);
      }catch{resolve(null)}
    });
  }
  function idbGetAll(){return new Promise(resolve=>{
    if(!db){resolve({});return}
    try{
      const tx=db.transaction(STORE,'readonly'),os=tx.objectStore(STORE),keys=os.getAllKeys(),vals=os.getAll();
      tx.oncomplete=()=>{const out={};(keys.result||[]).forEach((k,i)=>out[k]=vals.result[i]);resolve(out)};
      tx.onerror=()=>resolve({});
    }catch{resolve({})}
  })}
  function idbPut(key,val){return new Promise(resolve=>{
    if(!db){resolve(false);return}
    try{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(val,key);tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false)}catch{resolve(false)}
  })}
  function idbDelete(key){return new Promise(resolve=>{
    if(!db){resolve(false);return}
    try{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key);tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false)}catch{resolve(false)}
  })}

  const ready=(async()=>{
    db=await openDB();
    if(db){
      const remote=await idbGetAll();
      memory={...memory,...remote};
      persistFallback();
      await Promise.all(Object.entries(memory).map(([k,v])=>idbPut(k,v)));
    }
    // Legacy migration.
    if(!memory.projects && localOK){
      try{const legacy=parse(localStorage.getItem('prescricao-editor:projects:v1'),null);if(Array.isArray(legacy))memory.projects=legacy}catch{}
      persistFallback();
      if(memory.projects)await idbPut('projects',memory.projects);
    }
    return true;
  })();

  function get(key,fallback=null){return Object.prototype.hasOwnProperty.call(memory,key)?memory[key]:fallback}
  function set(key,value){memory[key]=value;persistFallback();void idbPut(key,value);return value}
  function remove(key){delete memory[key];persistFallback();void idbDelete(key)}
  function getProjects(){const x=get('projects',[]);return Array.isArray(x)?x:[]}
  function setProjects(items){return set('projects',Array.isArray(items)?items:[])}
  async function getAsync(key,fallback=null){await ready;return get(key,fallback)}
  async function setAsync(key,value){await ready;set(key,value);if(db)await idbPut(key,value);return value}
  async function getProjectsAsync(){await ready;return getProjects()}
  async function setProjectsAsync(items){await ready;const v=Array.isArray(items)?items:[];setProjects(v);if(db)await idbPut('projects',v);return v}
  function mode(){return db?'IndexedDB + fallback local':localOK?'localStorage + sessão':'sessão desta aba'}

  window.ProjectStorage={get,set,remove,getProjects,setProjects,getAsync,setAsync,getProjectsAsync,setProjectsAsync,ready,mode,get persistent(){return !!db||localOK}};
})();

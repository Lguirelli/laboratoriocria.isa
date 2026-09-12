(() => {
  'use strict';
  const DB_NAME = 'editable-files-studio';
  const STORE = 'keyval';
  const DB_VERSION = 1;
  const cache = new Map();
  let db = null;
  let mode = 'memory';
  let ready = false;

  function lsAvailable(){
    try{const k='__studio_storage_test__';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch{return false}
  }
  function openDb(){
    return new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)) return reject(new Error('IndexedDB indisponível'));
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE)};
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error||new Error('Falha ao abrir IndexedDB'));
      req.onblocked=()=>reject(new Error('IndexedDB bloqueado'));
    });
  }
  function loadAllFromDb(){
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly'),store=tx.objectStore(STORE);
      const keysReq=store.getAllKeys(), valsReq=store.getAll();
      tx.oncomplete=()=>{const keys=keysReq.result||[],vals=valsReq.result||[];keys.forEach((k,i)=>cache.set(String(k),String(vals[i]??'')));resolve()};
      tx.onerror=()=>reject(tx.error);
    });
  }
  function idbPut(key,value){
    if(!db)return Promise.resolve();
    return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(String(value),String(key));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
  }
  function idbDelete(key){
    if(!db)return Promise.resolve();
    return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(String(key));tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
  }
  async function migrateLocalStorage(){
    if(!lsAvailable())return;
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i); if(!k||cache.has(k))continue;
      const v=localStorage.getItem(k); if(v!=null){cache.set(k,v);try{await idbPut(k,v)}catch{}}
    }
  }
  async function init(){
    if(ready)return api;
    try{
      db=await openDb();
      await loadAllFromDb();
      mode='indexedDB';
      await migrateLocalStorage();
    }catch(e){
      if(lsAvailable()){
        mode='localStorage';
        for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k){const v=localStorage.getItem(k);if(v!=null)cache.set(k,v)}}
      } else mode='memory';
    }
    ready=true;
    window.dispatchEvent(new CustomEvent('appstorage-ready',{detail:{mode}}));
    return api;
  }
  function getItem(key){return cache.has(String(key))?cache.get(String(key)):null}
  function setItem(key,value){
    key=String(key);value=String(value);cache.set(key,value);
    if(mode==='indexedDB') idbPut(key,value).catch(e=>console.error(e));
    else if(mode==='localStorage'){try{localStorage.setItem(key,value)}catch(e){console.error(e)}}
    window.dispatchEvent(new CustomEvent('appstorage-change',{detail:{key}}));
  }
  function removeItem(key){
    key=String(key);cache.delete(key);
    if(mode==='indexedDB')idbDelete(key).catch(e=>console.error(e));
    else if(mode==='localStorage'){try{localStorage.removeItem(key)}catch(e){console.error(e)}}
    window.dispatchEvent(new CustomEvent('appstorage-change',{detail:{key}}));
  }
  async function flush(){
    if(mode!=='indexedDB'||!db)return;
    await new Promise(resolve=>{const tx=db.transaction(STORE,'readonly');tx.oncomplete=resolve;tx.onerror=resolve;tx.objectStore(STORE).count()});
  }
  const api={init,getItem,setItem,removeItem,flush,get mode(){return mode},get persistent(){return mode==='indexedDB'||mode==='localStorage'}};
  window.AppStorage=api;
})();

(() => {
  'use strict';
  const NS='psd-editor-store:v3';
  const NAME_PREFIX='__PSD_EDITOR_STATE__:';
  let memory={};
  function parse(x,fallback){try{const v=JSON.parse(x);return v==null?fallback:v}catch{return fallback}}
  function readWindowName(){
    if(!window.name || !window.name.startsWith(NAME_PREFIX)) return {};
    return parse(window.name.slice(NAME_PREFIX.length),{});
  }
  function writeWindowName(bundle){try{window.name=NAME_PREFIX+JSON.stringify(bundle)}catch{}}
  function canLocal(){try{const k='__store_test__';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch{return false}}
  const localOK=canLocal();
  function readBundle(){
    let b={};
    if(localOK) b=parse(localStorage.getItem(NS),{});
    const w=readWindowName();
    // window.name bridges separate file:// pages in the same tab; localStorage wins by timestamp per key.
    return {...w,...b,...memory};
  }
  function writeBundle(b){
    memory={...b};
    if(localOK){try{localStorage.setItem(NS,JSON.stringify(b))}catch{}}
    writeWindowName(b);
  }
  function get(key,fallback=null){const b=readBundle();return Object.prototype.hasOwnProperty.call(b,key)?b[key]:fallback}
  function set(key,value){const b=readBundle();b[key]=value;writeBundle(b);return value}
  function remove(key){const b=readBundle();delete b[key];writeBundle(b)}
  function getProjects(){const x=get('projects',[]);return Array.isArray(x)?x:[]}
  function setProjects(items){set('projects',Array.isArray(items)?items:[]);return getProjects()}
  function mode(){return localOK?'localStorage + window.name':'window.name (sessão desta aba)'}
  if(localOK && !get('projects',null)){
    try{const legacy=JSON.parse(localStorage.getItem('prescricao-editor:projects:v1')||'null');if(Array.isArray(legacy))set('projects',legacy)}catch{}
  }
  window.ProjectStorage={get,set,remove,getProjects,setProjects,mode,persistent:localOK};
})();

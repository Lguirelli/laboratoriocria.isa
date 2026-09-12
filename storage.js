(() => {
  'use strict';

  // O navegador guarda somente RASCUNHOS. Projetos salvos vivem exclusivamente em projects/*.json.
  const NS = 'psd-editor-drafts:v1';
  const DB_NAME = 'psd-editor-drafts-db';
  const STORE = 'drafts';
  let memory = {};
  let db = null;

  const parse = (value, fallback = {}) => {
    try { const parsed = JSON.parse(value); return parsed == null ? fallback : parsed; }
    catch { return fallback; }
  };

  function canUseLocalStorage() {
    try {
      const key = '__draft_store_test__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch { return false; }
  }

  const localOK = canUseLocalStorage();
  if (localOK) memory = parse(localStorage.getItem(NS), {});

  function persistLocalFallback() {
    if (!localOK) return;
    try { localStorage.setItem(NS, JSON.stringify(memory)); } catch {}
  }

  function openDB() {
    return new Promise(resolve => {
      if (!('indexedDB' in window)) return resolve(null);
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
        req.onblocked = () => resolve(null);
      } catch { resolve(null); }
    });
  }

  function idbGetAll() {
    return new Promise(resolve => {
      if (!db) return resolve({});
      try {
        const tx = db.transaction(STORE, 'readonly');
        const store = tx.objectStore(STORE);
        const keys = store.getAllKeys();
        const values = store.getAll();
        tx.oncomplete = () => {
          const out = {};
          (keys.result || []).forEach((key, index) => { out[key] = values.result[index]; });
          resolve(out);
        };
        tx.onerror = () => resolve({});
      } catch { resolve({}); }
    });
  }

  function idbPut(key, value) {
    return new Promise(resolve => {
      if (!db) return resolve(false);
      try {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(value, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch { resolve(false); }
    });
  }

  function idbDelete(key) {
    return new Promise(resolve => {
      if (!db) return resolve(false);
      try {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch { resolve(false); }
    });
  }

  const ready = (async () => {
    db = await openDB();
    if (db) {
      const indexed = await idbGetAll();
      // IndexedDB é a fonte preferida; localStorage serve apenas de fallback do mesmo rascunho.
      memory = { ...memory, ...indexed };
      persistLocalFallback();
      await Promise.all(Object.entries(memory).map(([key, value]) => idbPut(key, value)));
    }
    return true;
  })();

  function get(key, fallback = null) {
    return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback;
  }
  function set(key, value) {
    memory[key] = value;
    persistLocalFallback();
    void idbPut(key, value);
    return value;
  }
  function remove(key) {
    delete memory[key];
    persistLocalFallback();
    void idbDelete(key);
  }
  async function getAsync(key, fallback = null) { await ready; return get(key, fallback); }
  async function setAsync(key, value) { await ready; memory[key] = value; persistLocalFallback(); await idbPut(key, value); return value; }
  async function removeAsync(key) { await ready; remove(key); if (db) await idbDelete(key); }
  function mode() { return db ? 'IndexedDB' : localOK ? 'localStorage' : 'memória da sessão'; }

  window.ProjectStorage = Object.freeze({
    get, set, remove, getAsync, setAsync, removeAsync, ready, mode,
    get persistent() { return !!db || localOK; }
  });
})();

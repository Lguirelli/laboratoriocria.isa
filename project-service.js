(() => {
  'use strict';

  const S = window.ProjectStorage;
  const ACTIVE_KEY = '__saved_projects_catalog_v2__';
  const ARCHIVED_KEY = '__archived_projects_catalog_v2__';
  let serverState = 'unknown'; // unknown | available | unavailable

  async function rawRequest(url, options = {}) {
    let response;
    try {
      response = await fetch(url, { cache: 'no-store', ...options });
    } catch (error) {
      serverState = 'unavailable';
      const e = new Error('Servidor de projetos indisponível.');
      e.code = 'SERVER_UNAVAILABLE';
      throw e;
    }
    let payload = {};
    try { payload = await response.json(); } catch {}
    if (!response.ok || payload?.ok === false) {
      const e = new Error(payload?.error || `Falha no servidor (${response.status}).`);
      e.status = response.status;
      if ([405, 501].includes(response.status)) serverState = 'unavailable';
      throw e;
    }
    serverState = 'available';
    return payload;
  }

  async function localRead(key) {
    await S?.ready;
    const value = await S?.getAsync?.(key, []);
    return Array.isArray(value) ? value : [];
  }
  async function localWrite(key, value) {
    await S?.ready;
    if (S?.setAsync) await S.setAsync(key, value);
    else S?.set?.(key, value);
    return value;
  }
  const dedupe = arr => [...new Map((arr || []).filter(Boolean).map(x => [x.id, x])).values()];

  async function localList() {
    const [projects, archived] = await Promise.all([localRead(ACTIVE_KEY), localRead(ARCHIVED_KEY)]);
    return { projects: dedupe(projects), archived: dedupe(archived) };
  }
  async function localGet(id) {
    const { projects, archived } = await localList();
    return projects.find(x => x.id === id) || archived.find(x => x.id === id) || null;
  }
  async function localSave(record) {
    const projects = await localRead(ACTIVE_KEY);
    const next = dedupe([...projects.filter(x => x.id !== record.id), record]);
    await localWrite(ACTIVE_KEY, next);
    // If it was archived, saving makes it active again.
    const archived = await localRead(ARCHIVED_KEY);
    await localWrite(ARCHIVED_KEY, archived.filter(x => x.id !== record.id));
    return record;
  }
  async function localArchive(id) {
    const projects = await localRead(ACTIVE_KEY);
    const record = projects.find(x => x.id === id);
    if (!record) throw new Error('Projeto não encontrado.');
    await localWrite(ACTIVE_KEY, projects.filter(x => x.id !== id));
    const archived = await localRead(ARCHIVED_KEY);
    const moved = { ...record, archivedAt: new Date().toISOString() };
    await localWrite(ARCHIVED_KEY, dedupe([...archived.filter(x => x.id !== id), moved]));
    return moved;
  }
  async function localRestore(id) {
    const archived = await localRead(ARCHIVED_KEY);
    const record = archived.find(x => x.id === id);
    if (!record) throw new Error('Projeto arquivado não encontrado.');
    await localWrite(ARCHIVED_KEY, archived.filter(x => x.id !== id));
    const projects = await localRead(ACTIVE_KEY);
    const moved = { ...record };
    delete moved.archivedAt;
    await localWrite(ACTIVE_KEY, dedupe([...projects.filter(x => x.id !== id), moved]));
    return moved;
  }
  async function localRemove(id) {
    const [projects, archived] = await Promise.all([localRead(ACTIVE_KEY), localRead(ARCHIVED_KEY)]);
    await Promise.all([
      localWrite(ACTIVE_KEY, projects.filter(x => x.id !== id)),
      localWrite(ARCHIVED_KEY, archived.filter(x => x.id !== id))
    ]);
    return true;
  }

  function shouldFallback(error) {
    return serverState === 'unavailable' || error?.code === 'SERVER_UNAVAILABLE' || [405, 501].includes(error?.status);
  }

  async function list() {
    if (serverState !== 'unavailable') {
      try {
        const payload = await rawRequest('/api/projects');
        return { projects: Array.isArray(payload.projects) ? payload.projects : [], archived: Array.isArray(payload.archived) ? payload.archived : [] };
      } catch (error) { if (error?.status === 404) serverState = 'unavailable'; else if (!shouldFallback(error)) throw error; }
    }
    return localList();
  }
  async function get(id) {
    if (!id) return null;
    if (serverState !== 'unavailable') {
      try { return (await rawRequest(`/api/projects/${encodeURIComponent(id)}`)).project || null; }
      catch (error) {
        if (error?.status === 404 && serverState !== 'unavailable') return null;
        if (!shouldFallback(error)) throw error;
      }
    }
    return localGet(id);
  }
  async function save(record) {
    if (serverState !== 'unavailable') {
      try {
        return (await rawRequest('/api/projects', { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(record) })).project;
      } catch (error) { if (!shouldFallback(error)) throw error; }
    }
    return localSave(record);
  }
  async function archive(id) {
    if (serverState !== 'unavailable') {
      try { return (await rawRequest(`/api/projects/${encodeURIComponent(id)}/archive`, {method:'POST'})).project; }
      catch (error) { if (!shouldFallback(error)) throw error; }
    }
    return localArchive(id);
  }
  async function restore(id) {
    if (serverState !== 'unavailable') {
      try { return (await rawRequest(`/api/projects/${encodeURIComponent(id)}/restore`, {method:'POST'})).project; }
      catch (error) { if (!shouldFallback(error)) throw error; }
    }
    return localRestore(id);
  }
  async function remove(id) {
    if (serverState !== 'unavailable') {
      try { await rawRequest(`/api/projects/${encodeURIComponent(id)}`, {method:'DELETE'}); return true; }
      catch (error) { if (!shouldFallback(error)) throw error; }
    }
    return localRemove(id);
  }
  function mode() { return serverState === 'available' ? 'repository' : 'browser'; }

  window.ProjectService = Object.freeze({ list, get, save, archive, restore, remove, mode });
})();

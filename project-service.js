(() => {
  'use strict';

  async function request(url, options = {}) {
    let response;
    try {
      response = await fetch(url, { cache: 'no-store', ...options });
    } catch (error) {
      throw new Error('Servidor de projetos indisponível. Execute o repositório com “npm start”.');
    }
    let payload = {};
    try { payload = await response.json(); } catch {}
    if (!response.ok || payload?.ok === false) {
      throw new Error(payload?.error || `Falha no servidor (${response.status}).`);
    }
    return payload;
  }

  async function list() {
    const payload = await request('/api/projects');
    return {
      projects: Array.isArray(payload.projects) ? payload.projects : [],
      archived: Array.isArray(payload.archived) ? payload.archived : []
    };
  }

  async function get(id) {
    if (!id) return null;
    try {
      const payload = await request(`/api/projects/${encodeURIComponent(id)}`);
      return payload.project || null;
    } catch (error) {
      if (/não encontrado|404/i.test(error.message)) return null;
      throw error;
    }
  }

  async function save(record) {
    const payload = await request('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(record)
    });
    return payload.project;
  }

  async function archive(id) {
    const payload = await request(`/api/projects/${encodeURIComponent(id)}/archive`, { method: 'POST' });
    return payload.project;
  }

  async function restore(id) {
    const payload = await request(`/api/projects/${encodeURIComponent(id)}/restore`, { method: 'POST' });
    return payload.project;
  }

  async function remove(id) {
    await request(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  }

  window.ProjectService = Object.freeze({ list, get, save, archive, restore, remove });
})();

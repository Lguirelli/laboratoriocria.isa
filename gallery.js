(() => {
  'use strict';
  const savedGrid = document.getElementById('savedGrid');
  const savedGroup = document.getElementById('savedGroup');
  const templateGrid = document.getElementById('templateGrid');
  const archivedGrid = document.getElementById('archivedGrid');
  const archivedGroup = document.getElementById('archivedGroup');
  const tpl = document.getElementById('templateCard');
  const toast = document.getElementById('toast');
  const rawTemplates = Array.isArray(window.EDITABLE_TEMPLATES) ? window.EDITABLE_TEMPLATES : [];
  const templates = [...new Map(rawTemplates.map(item => [item.id, item])).values()];
  const ProjectService = window.ProjectService;
  let toastTimer;
  let renderGeneration = 0;

  function showToast(message, kind = 'ok') {
    toast.textContent = message;
    toast.dataset.kind = kind;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function formatSavedDate(iso) {
    const date = iso ? new Date(iso) : new Date();
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(date).replace('.', '');
  }

  const templateById = id => templates.find(item => item.id === id);

  function projectToCard(project, archived = false) {
    const base = templateById(project.template) || {};
    const preview = project.preview
      ? `${project.preview}${project.preview.includes('?') ? '&' : '?'}v=${encodeURIComponent(project.updatedAt || project.savedAt || '1')}`
      : (base.preview || 'assets/images/modelo1-preview.jpg');
    return {
      id: project.id,
      title: project.title || project.fileName || base.title || 'Projeto sem nome',
      date: formatSavedDate(archived ? (project.archivedAt || project.updatedAt || project.savedAt) : (project.updatedAt || project.savedAt)),
      preview,
      editor: project.editor || `${(base.editor || '').split('?')[0]}?project=${encodeURIComponent(project.id)}`,
      project: true,
      archived
    };
  }

  function renderCard(item, container) {
    const wrap = tpl.content.firstElementChild.cloneNode(true);
    const card = wrap.querySelector('.template-card');
    card.href = item.editor;
    card.dataset.templateId = item.id;
    const image = wrap.querySelector('.template-preview');
    image.src = item.preview;
    image.alt = `Visual do arquivo ${item.title}`;
    wrap.querySelector('.template-title').textContent = item.title;
    wrap.querySelector('.template-date').textContent = item.date || '';

    const controls = wrap.querySelector('.card-controls');
    if (item.project) {
      controls.hidden = false;
      const archiveButton = wrap.querySelector('.archive-btn');
      const restoreButton = wrap.querySelector('.restore-btn');
      const deleteButton = wrap.querySelector('.delete-btn');
      archiveButton.hidden = !!item.archived;
      restoreButton.hidden = !item.archived;

      archiveButton.addEventListener('click', async () => {
        archiveButton.disabled = true;
        try { await ProjectService.archive(item.id); showToast('Projeto arquivado.'); await renderGallery(); }
        catch (error) { showToast(error.message || 'Erro ao arquivar.', 'error'); }
        finally { archiveButton.disabled = false; }
      });
      restoreButton.addEventListener('click', async () => {
        restoreButton.disabled = true;
        try { await ProjectService.restore(item.id); showToast('Projeto restaurado.'); await renderGallery(); }
        catch (error) { showToast(error.message || 'Erro ao restaurar.', 'error'); }
        finally { restoreButton.disabled = false; }
      });
      deleteButton.addEventListener('click', async () => {
        if (!confirm(`Excluir “${item.title}” definitivamente? Esta ação não pode ser desfeita.`)) return;
        deleteButton.disabled = true;
        try { await ProjectService.remove(item.id); showToast('Projeto excluído.'); await renderGallery(); }
        catch (error) { showToast(error.message || 'Erro ao excluir.', 'error'); }
        finally { deleteButton.disabled = false; }
      });
    }
    container.appendChild(wrap);
  }

  function renderEmpty(container, text) {
    const element = document.createElement('div');
    element.className = 'empty-state';
    element.textContent = text;
    container.appendChild(element);
  }

  async function renderGallery() {
    const generation = ++renderGeneration;
    let repository = { projects: [], archived: [] };
    let loadError = null;
    try {
      repository = await ProjectService.list();
    } catch (error) {
      loadError = error;
    }
    // Se outra renderização começou enquanto aguardávamos a API, esta resposta é descartada.
    if (generation !== renderGeneration) return;

    savedGrid.replaceChildren();
    templateGrid.replaceChildren();
    archivedGrid.replaceChildren();

    const active = [...new Map((repository.projects || []).map(project => [project.id, project])).values()];
    const archived = [...new Map((repository.archived || []).map(project => [project.id, project])).values()];

    active
      .sort((a, b) => new Date(b.updatedAt || b.savedAt || 0) - new Date(a.updatedAt || a.savedAt || 0))
      .map(project => projectToCard(project, false))
      .forEach(item => renderCard(item, savedGrid));

    templates.forEach(item => renderCard({ ...item, project: false }, templateGrid));

    archived
      .sort((a, b) => new Date(b.archivedAt || b.updatedAt || 0) - new Date(a.archivedAt || a.updatedAt || 0))
      .map(project => projectToCard(project, true))
      .forEach(item => renderCard(item, archivedGrid));

    savedGroup.hidden = !active.length && !loadError;
    archivedGroup.hidden = !archived.length;
    if (loadError) {
      savedGroup.hidden = false;
      renderEmpty(savedGrid, 'Não foi possível carregar os projetos salvos. Execute o repositório com npm start.');
      showToast(loadError.message, 'error');
    }

    document.getElementById('savedCount').textContent = active.length ? String(active.length) : '';
    document.getElementById('templateCount').textContent = templates.length ? String(templates.length) : '';
    document.getElementById('archivedCount').textContent = archived.length ? String(archived.length) : '';
  }

  renderGallery();
  addEventListener('pageshow', event => { if (event.persisted) renderGallery(); });
  addEventListener('focus', () => renderGallery());
})();

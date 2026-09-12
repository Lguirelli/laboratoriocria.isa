(() => {
  'use strict';
  const PROJECTS_KEY = 'prescricao-editor:projects:v1';
  const grid = document.getElementById('templateGrid');
  const tpl = document.getElementById('templateCard');
  const templates = Array.isArray(window.EDITABLE_TEMPLATES) ? window.EDITABLE_TEMPLATES : [];

  function readProjects(){
    try{
      const value = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch { return []; }
  }
  function formatSavedDate(iso){
    const d = iso ? new Date(iso) : new Date();
    if(Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(d).replace('.','');
  }
  function renderCard(item){
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.href = item.editor;
    node.dataset.templateId = item.id;
    node.querySelector('.template-preview').src = item.preview;
    node.querySelector('.template-preview').alt = `Visual do arquivo ${item.title}`;
    node.querySelector('.template-title').textContent = item.title;
    node.querySelector('.template-date').textContent = item.date;
    grid.appendChild(node);
  }

  const savedProjects = readProjects().map(project => ({
    id: project.id,
    title: project.title || `Prescrição médica · ${project.patientName || 'Sem nome'}`,
    date: formatSavedDate(project.savedAt),
    preview: 'assets/images/prescricao-preview.jpg',
    editor: `editor.html?project=${encodeURIComponent(project.id)}`
  }));

  const items = [...savedProjects, ...templates];
  if (!items.length) {
    grid.innerHTML = '<p class="empty-state">Nenhum arquivo editável disponível.</p>';
    return;
  }
  items.forEach(renderCard);
})();

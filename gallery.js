(() => {
  'use strict';
  const grid = document.getElementById('templateGrid');
  const tpl = document.getElementById('templateCard');
  const templates = Array.isArray(window.EDITABLE_TEMPLATES) ? window.EDITABLE_TEMPLATES : [];

  function readProjects(){ return window.ProjectStorage?.getProjects?.() || []; }
  function formatSavedDate(iso){
    const d=iso?new Date(iso):new Date();
    if(Number.isNaN(d.getTime()))return '';
    return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(d).replace('.','');
  }
  function renderCard(item){
    const node=tpl.content.firstElementChild.cloneNode(true);
    node.href=item.editor; node.dataset.templateId=item.id;
    node.querySelector('.template-preview').src=item.preview;
    node.querySelector('.template-preview').alt=`Visual do arquivo ${item.title}`;
    node.querySelector('.template-title').textContent=item.title;
    node.querySelector('.template-date').textContent=item.date;
    grid.appendChild(node);
  }
  function templateById(id){return templates.find(item=>item.id===id)}
  function renderGallery(){
    grid.innerHTML='';
    const savedProjects=readProjects()
      .sort((a,b)=>new Date(b.updatedAt||b.savedAt||0)-new Date(a.updatedAt||a.savedAt||0))
      .map(project=>{
        const base=templateById(project.template)||{};
        const isPrescription=project.template==='prescricao';
        return {
          id:project.id,
          title:project.title || (isPrescription?`Prescrição médica · ${project.patientName||'Sem nome'}`:(project.fileName||base.title||'Projeto sem nome')),
          date:formatSavedDate(project.updatedAt||project.savedAt),
          preview:project.preview||base.preview||'assets/images/modelo1-preview.jpg',
          editor:project.editor||base.editor?.split('?')[0]+`?project=${encodeURIComponent(project.id)}`
        }
      });
    const items=[...savedProjects,...templates];
    if(!items.length){grid.innerHTML='<p class="empty-state">Nenhum arquivo editável disponível.</p>';return}
    items.forEach(renderCard);
  }
  renderGallery();
  window.addEventListener('pageshow',renderGallery);
  window.addEventListener('storage',renderGallery);
})();

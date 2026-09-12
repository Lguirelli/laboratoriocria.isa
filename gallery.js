(() => {
  'use strict';
  const grid=document.getElementById('templateGrid');
  const tpl=document.getElementById('templateCard');
  const templates=Array.isArray(window.EDITABLE_TEMPLATES)?window.EDITABLE_TEMPLATES:[];
  const S=window.ProjectStorage;
  function formatSavedDate(iso){const d=iso?new Date(iso):new Date();if(Number.isNaN(d.getTime()))return '';return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(d).replace('.','')}
  function renderCard(item){const node=tpl.content.firstElementChild.cloneNode(true);node.href=item.editor;node.dataset.templateId=item.id;node.querySelector('.template-preview').src=item.preview;node.querySelector('.template-preview').alt=`Visual do arquivo ${item.title}`;node.querySelector('.template-title').textContent=item.title;node.querySelector('.template-date').textContent=item.date;grid.appendChild(node)}
  const templateById=id=>templates.find(x=>x.id===id);
  async function renderGallery(){
    await S?.ready;
    grid.innerHTML='';
    const projects=(await S?.getProjectsAsync?.())||S?.getProjects?.()||[];
    const saved=projects.slice().sort((a,b)=>new Date(b.updatedAt||b.savedAt||0)-new Date(a.updatedAt||a.savedAt||0)).map(p=>{
      const base=templateById(p.template)||{};
      return {id:p.id,title:p.title||p.fileName||base.title||'Projeto sem nome',date:formatSavedDate(p.updatedAt||p.savedAt),preview:p.preview||base.preview||'assets/images/modelo1-preview.jpg',editor:p.editor||`${(base.editor||'').split('?')[0]}?project=${encodeURIComponent(p.id)}`};
    });
    [...saved,...templates].forEach(renderCard);
  }
  renderGallery();
  addEventListener('pageshow',()=>renderGallery());
  addEventListener('storage',()=>renderGallery());
})();

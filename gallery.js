(() => {
  'use strict';
  const savedGrid=document.getElementById('savedGrid');
  const savedGroup=document.getElementById('savedGroup');
  const templateGrid=document.getElementById('templateGrid');
  const archivedGrid=document.getElementById('archivedGrid');
  const archivedGroup=document.getElementById('archivedGroup');
  const tpl=document.getElementById('templateCard');
  const toast=document.getElementById('toast');
  const rawTemplates=Array.isArray(window.EDITABLE_TEMPLATES)?window.EDITABLE_TEMPLATES:[];
  const templates=[...new Map(rawTemplates.map(item=>[item.id,item])).values()];
  const S=window.ProjectStorage;
  let toastTimer;

  function showToast(message,kind='ok'){
    toast.textContent=message;toast.dataset.kind=kind;toast.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);
  }
  function formatSavedDate(iso){const d=iso?new Date(iso):new Date();if(Number.isNaN(d.getTime()))return '';return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(d).replace('.','')}
  const templateById=id=>templates.find(x=>x.id===id);
  function projectToCard(p,archived=false){
    const base=templateById(p.template)||{};
    return {id:p.id,title:p.title||p.fileName||base.title||'Projeto sem nome',date:formatSavedDate(archived?(p.archivedAt||p.updatedAt||p.savedAt):(p.updatedAt||p.savedAt)),preview:(p.preview?`${p.preview}${p.preview.includes('?')?'&':'?'}v=${encodeURIComponent(p.updatedAt||p.savedAt||'1')}`:base.preview)||'assets/images/modelo1-preview.jpg',editor:p.editor||`${(base.editor||'').split('?')[0]}?project=${encodeURIComponent(p.id)}`,project:true,archived};
  }
  async function fetchRepoProjects(){
    try{const r=await fetch('/api/projects',{cache:'no-store'});if(!r.ok)return null;const j=await r.json();return {projects:Array.isArray(j.projects)?j.projects:[],archived:Array.isArray(j.archived)?j.archived:[]}}
    catch{return null}
  }
  async function fallbackArchive(id,restore=false){
    const projects=(await S?.getProjectsAsync?.())||S?.getProjects?.()||[];
    const next=projects.map(p=>p.id===id?{...p,archived:!restore,archivedAt:restore?null:new Date().toISOString()}:p);
    await S?.setProjectsAsync?.(next);return true;
  }
  async function fallbackDelete(id){
    const projects=(await S?.getProjectsAsync?.())||S?.getProjects?.()||[];
    await S?.setProjectsAsync?.(projects.filter(p=>p.id!==id));return true;
  }
  async function apiAction(id,action){
    try{
      const url=action==='delete'?`/api/projects/${encodeURIComponent(id)}`:`/api/projects/${encodeURIComponent(id)}/${action}`;
      const r=await fetch(url,{method:action==='delete'?'DELETE':'POST',headers:{'Accept':'application/json'}});
      if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||'Não foi possível concluir a ação.');
      return true;
    }catch(e){
      if(action==='archive')return fallbackArchive(id,false);
      if(action==='restore')return fallbackArchive(id,true);
      if(action==='delete')return fallbackDelete(id);
      throw e;
    }
  }
  function renderCard(item,container){
    const wrap=tpl.content.firstElementChild.cloneNode(true);
    const card=wrap.querySelector('.template-card');
    card.href=item.editor;card.dataset.templateId=item.id;
    wrap.querySelector('.template-preview').src=item.preview;wrap.querySelector('.template-preview').alt=`Visual do arquivo ${item.title}`;
    wrap.querySelector('.template-title').textContent=item.title;wrap.querySelector('.template-date').textContent=item.date;
    const controls=wrap.querySelector('.card-controls');
    if(item.project){
      controls.hidden=false;
      const archive=wrap.querySelector('.archive-btn'),restore=wrap.querySelector('.restore-btn'),del=wrap.querySelector('.delete-btn');
      archive.hidden=!!item.archived;restore.hidden=!item.archived;
      archive.addEventListener('click',async()=>{archive.disabled=true;try{await apiAction(item.id,'archive');showToast('Projeto arquivado.');await renderGallery()}catch(e){showToast(e.message||'Erro ao arquivar.','error')}finally{archive.disabled=false}});
      restore.addEventListener('click',async()=>{restore.disabled=true;try{await apiAction(item.id,'restore');showToast('Projeto restaurado.');await renderGallery()}catch(e){showToast(e.message||'Erro ao restaurar.','error')}finally{restore.disabled=false}});
      del.addEventListener('click',async()=>{
        if(!confirm(`Excluir “${item.title}” definitivamente? Esta ação não pode ser desfeita.`))return;
        del.disabled=true;try{await apiAction(item.id,'delete');showToast('Projeto excluído.');await renderGallery()}catch(e){showToast(e.message||'Erro ao excluir.','error')}finally{del.disabled=false}
      });
    }
    container.appendChild(wrap);
  }
  function renderEmpty(container,text){const el=document.createElement('div');el.className='empty-state';el.textContent=text;container.appendChild(el)}
  async function renderGallery(){
    await S?.ready;
    savedGrid.innerHTML='';templateGrid.innerHTML='';archivedGrid.innerHTML='';
    const repo=await fetchRepoProjects();
    let active=[],archived=[];
    if(repo){active=repo.projects;archived=repo.archived}else{
      const projects=(await S?.getProjectsAsync?.())||S?.getProjects?.()||[];
      active=projects.filter(p=>!p.archived);archived=projects.filter(p=>p.archived);
    }
    active.slice().sort((a,b)=>new Date(b.updatedAt||b.savedAt||0)-new Date(a.updatedAt||a.savedAt||0)).map(p=>projectToCard(p,false)).forEach(x=>renderCard(x,savedGrid));
    savedGroup.hidden=!active.length;
    templates.forEach(x=>renderCard({...x,project:false},templateGrid));
    archived.slice().sort((a,b)=>new Date(b.archivedAt||b.updatedAt||0)-new Date(a.archivedAt||a.updatedAt||0)).map(p=>projectToCard(p,true)).forEach(x=>renderCard(x,archivedGrid));
    archivedGroup.hidden=!archived.length;
    document.getElementById('savedCount').textContent=active.length?String(active.length):'';
    document.getElementById('templateCount').textContent=templates.length?String(templates.length):'';
    document.getElementById('archivedCount').textContent=archived.length?String(archived.length):'';
  }
  renderGallery();
  addEventListener('pageshow',()=>renderGallery());
  addEventListener('storage',()=>renderGallery());
})();

(() => {
  'use strict';
  let active = null;
  const css = `
  .project-dialog-backdrop{position:fixed;inset:0;z-index:9999;background:rgba(18,20,24,.38);backdrop-filter:blur(8px);display:grid;place-items:center;padding:24px;opacity:0;transition:opacity .18s ease}
  .project-dialog-backdrop.is-open{opacity:1}.project-dialog{width:min(440px,100%);background:#fff;border:1px solid rgba(20,22,28,.12);border-radius:22px;padding:22px;box-shadow:0 26px 80px rgba(16,18,24,.24);transform:translateY(12px) scale(.985);transition:transform .2s cubic-bezier(.22,1,.36,1)}
  .project-dialog-backdrop.is-open .project-dialog{transform:none}.project-dialog h2{margin:0 0 8px;font:700 22px/1.1 Inter,ui-sans-serif,system-ui;color:#1d1f23;letter-spacing:-.025em}.project-dialog p{margin:0 0 18px;color:#72757d;font:400 13px/1.5 Inter,ui-sans-serif,system-ui}.project-dialog label{display:grid;gap:7px;color:#40434a;font:700 12px/1.2 Inter,ui-sans-serif,system-ui}.project-dialog input{width:100%;border:1px solid #d4d6db;border-radius:12px;padding:12px 13px;outline:none;font:500 15px/1.2 Inter,ui-sans-serif,system-ui;color:#202124}.project-dialog input:focus{border-color:#5d616b;box-shadow:0 0 0 3px rgba(70,74,84,.10)}.project-dialog-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:20px}.project-dialog button{border:1px solid #d5d7dc;background:#fff;border-radius:11px;padding:10px 14px;font:700 13px/1 Inter,ui-sans-serif,system-ui;cursor:pointer}.project-dialog button.primary{background:#202124;border-color:#202124;color:#fff}.project-dialog-error{min-height:16px;margin-top:8px;color:#a02b2b;font:600 11px/1.3 Inter,ui-sans-serif,system-ui}`;
  function ensureStyle(){if(document.getElementById('project-dialog-style'))return;const s=document.createElement('style');s.id='project-dialog-style';s.textContent=css;document.head.appendChild(s)}
  function close(value){if(!active)return;const {root,resolve}=active;active=null;root.classList.remove('is-open');setTimeout(()=>root.remove(),180);resolve(value)}
  function open({title='Nome do projeto',description='Defina como este projeto aparecerá no index.',value='',confirmText='Salvar'}={}){
    ensureStyle();if(active)close(null);
    return new Promise(resolve=>{
      const root=document.createElement('div');root.className='project-dialog-backdrop';root.innerHTML=`<form class="project-dialog" role="dialog" aria-modal="true" aria-labelledby="projectDialogTitle"><h2 id="projectDialogTitle"></h2><p class="dialog-description"></p><label>Nome do projeto<input type="text" maxlength="90" autocomplete="off"></label><div class="project-dialog-error" aria-live="polite"></div><div class="project-dialog-actions"><button type="button" class="cancel">Cancelar</button><button type="submit" class="primary"></button></div></form>`;
      document.body.appendChild(root);active={root,resolve};
      root.querySelector('h2').textContent=title;root.querySelector('.dialog-description').textContent=description;const input=root.querySelector('input');input.value=value||'';root.querySelector('.primary').textContent=confirmText;
      root.querySelector('.cancel').onclick=()=>close(null);root.addEventListener('mousedown',e=>{if(e.target===root)close(null)});root.querySelector('form').onsubmit=e=>{e.preventDefault();const name=input.value.trim();if(!name){root.querySelector('.project-dialog-error').textContent='Digite um nome para continuar.';input.focus();return}close(name)};
      const onKey=e=>{if(e.key==='Escape'){document.removeEventListener('keydown',onKey);close(null)}};document.addEventListener('keydown',onKey,{once:false});
      requestAnimationFrame(()=>{root.classList.add('is-open');input.focus();input.select()});
    });
  }
  window.ProjectNameDialog={open};
})();

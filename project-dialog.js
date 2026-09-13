(() => {
  'use strict';
  let active = null;
  const css = `
  .project-dialog{width:min(440px,calc(100vw - 32px));border:1px solid rgba(20,22,28,.12);border-radius:20px;padding:0;background:#fff;color:#1d1f23;box-shadow:0 26px 80px rgba(16,18,24,.24)}
  .project-dialog::backdrop{background:rgba(18,20,24,.42);backdrop-filter:blur(6px)}
  .project-dialog-inner{padding:24px}.project-dialog h2{margin:0 0 8px;font:700 22px/1.15 Inter,ui-sans-serif,system-ui;letter-spacing:-.025em}.project-dialog p{margin:0 0 18px;color:#72757d;font:400 13px/1.5 Inter,ui-sans-serif,system-ui}.project-dialog label{display:grid;gap:7px;color:#40434a;font:700 12px/1.2 Inter,ui-sans-serif,system-ui}.project-dialog input{width:100%;min-height:44px;border:1px solid #d4d6db;border-radius:12px;padding:11px 13px;outline:none;font:500 15px/1.2 Inter,ui-sans-serif,system-ui;color:#202124}.project-dialog input:focus-visible{border-color:#2457d6;box-shadow:0 0 0 3px rgba(36,87,214,.14)}.project-dialog-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:20px}.project-dialog button{min-height:44px;border:1px solid #d5d7dc;background:#fff;border-radius:11px;padding:10px 14px;font:700 13px/1 Inter,ui-sans-serif,system-ui;cursor:pointer}.project-dialog button.primary{background:#202124;border-color:#202124;color:#fff}.project-dialog button.danger{background:#9d2525;border-color:#9d2525;color:#fff}.project-dialog button:focus-visible{outline:3px solid #2457d6;outline-offset:2px}.project-dialog-error{min-height:18px;margin-top:8px;color:#9d2525;font:600 12px/1.35 Inter,ui-sans-serif,system-ui}`;
  function ensureStyle(){if(document.getElementById('project-dialog-style'))return;const s=document.createElement('style');s.id='project-dialog-style';s.textContent=css;document.head.appendChild(s)}
  function finish(value){if(!active)return;const {dialog,resolve,returnFocus}=active;active=null;dialog.close();dialog.remove();if(returnFocus?.isConnected)returnFocus.focus();resolve(value)}
  function createDialog({title,description,label='Nome do projeto',value='',confirmText,kind='primary',requireExact=''}){
    ensureStyle(); if(active) finish(null);
    return new Promise(resolve=>{
      const returnFocus=document.activeElement;
      const dialog=document.createElement('dialog');dialog.className='project-dialog';dialog.innerHTML=`<form method="dialog" class="project-dialog-inner"><h2></h2><p class="dialog-description"></p><label><span></span><input type="text" maxlength="90" autocomplete="off"></label><div class="project-dialog-error" aria-live="polite"></div><div class="project-dialog-actions"><button type="button" class="cancel">Cancelar</button><button type="submit" class="confirm"></button></div></form>`;
      document.body.appendChild(dialog);active={dialog,resolve,returnFocus};
      dialog.querySelector('h2').textContent=title;dialog.querySelector('.dialog-description').textContent=description;dialog.querySelector('label span').textContent=label;
      const input=dialog.querySelector('input');input.value=value||'';const confirm=dialog.querySelector('.confirm');confirm.textContent=confirmText;confirm.classList.add(kind);
      const error=dialog.querySelector('.project-dialog-error');
      dialog.querySelector('.cancel').addEventListener('click',()=>finish(null));
      dialog.addEventListener('cancel',event=>{event.preventDefault();finish(null)});
      dialog.addEventListener('click',event=>{if(event.target===dialog)finish(null)});
      dialog.querySelector('form').addEventListener('submit',event=>{event.preventDefault();const text=input.value.trim();if(!text){error.textContent='Digite um nome para continuar.';input.focus();return}if(requireExact && text!==requireExact){error.textContent=`Digite exatamente “${requireExact}”.`;input.focus();input.select();return}finish(text)});
      input.addEventListener('input',()=>{error.textContent=''});
      dialog.showModal();requestAnimationFrame(()=>{input.focus();input.select()});
    });
  }
  function open({title='Nome do projeto',description='Defina como este projeto aparecerá no index.',value='',confirmText='Salvar'}={}){return createDialog({title,description,value,confirmText,kind:'primary'})}
  function confirmDelete({name}){return createDialog({title:'Excluir projeto permanentemente?',description:'Esta ação não pode ser desfeita. Para confirmar, digite o nome do projeto.',label:'Nome do projeto',value:'',confirmText:'Excluir permanentemente',kind:'danger',requireExact:name})}
  window.ProjectNameDialog={open,confirmDelete};
})();

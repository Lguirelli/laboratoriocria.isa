(() => {
  'use strict';
  function setupTabs(){
    document.querySelectorAll('.tabs').forEach((tabs, groupIndex)=>{
      tabs.setAttribute('role','tablist');
      if(!tabs.getAttribute('aria-label')) tabs.setAttribute('aria-label','Seções do editor');
      const buttons=[...tabs.querySelectorAll('.tab')];
      const panels=[...document.querySelectorAll('.panel')];
      const activate=(tab,focus=true)=>{
        buttons.forEach((button,index)=>{
          const active=button===tab;
          button.classList.toggle('is-active',active);
          button.setAttribute('aria-selected',String(active));
          button.tabIndex=active?0:-1;
          const id=button.dataset.panel;
          const panel=panels.find(p=>p.dataset.panelContent===id);
          if(panel){panel.classList.toggle('is-active',active);panel.hidden=!active;panel.setAttribute('aria-hidden',String(!active));}
        });
        if(focus) tab.focus();
      };
      buttons.forEach((button,index)=>{
        const key=button.dataset.panel||String(index);
        const tabId=`editor-tab-${groupIndex}-${key}`;
        const panel=panels.find(p=>p.dataset.panelContent===button.dataset.panel);
        button.id=button.id||tabId;
        button.setAttribute('role','tab');
        button.setAttribute('aria-selected',String(button.classList.contains('is-active')));
        button.tabIndex=button.classList.contains('is-active')?0:-1;
        if(panel){
          panel.id=panel.id||`editor-panel-${groupIndex}-${key}`;
          panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);panel.tabIndex=0;
          button.setAttribute('aria-controls',panel.id);
          panel.hidden=!button.classList.contains('is-active');
        }
        button.addEventListener('click',()=>activate(button,false));
        button.addEventListener('keydown',event=>{
          let next=null;
          if(event.key==='ArrowRight'||event.key==='ArrowDown') next=buttons[(index+1)%buttons.length];
          if(event.key==='ArrowLeft'||event.key==='ArrowUp') next=buttons[(index-1+buttons.length)%buttons.length];
          if(event.key==='Home') next=buttons[0];
          if(event.key==='End') next=buttons[buttons.length-1];
          if(next){event.preventDefault();activate(next,true);}
        });
      });
    });
  }
  function setupActionFeedback(){
    document.querySelectorAll('#saveProject,#duplicateProject,#exportFile').forEach(button=>{
      button.addEventListener('click',()=>{
        button.setAttribute('aria-busy','true');
        setTimeout(()=>button.removeAttribute('aria-busy'),1200);
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>{setupTabs();setupActionFeedback()});
  else {setupTabs();setupActionFeedback()}
})();

(async () => {
  'use strict';
  await window.AppStorage.init();
  const storage = window.AppStorage;
  const PROJECTS_KEY='prescricao-editor:projects:v1';
  const DRAFT_KEY='modelo1isa:draft:v1';
  const PROJECT_DRAFT_PREFIX='modelo1isa:project-draft:';
  const params=new URLSearchParams(location.search);
  let currentProjectId=params.get('project');

  const ICONS=[
    {name:'favorite',label:'Coração',path:'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6.01 6.01 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z'},
    {name:'check_circle',label:'Check',path:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'},
    {name:'health_and_safety',label:'Saúde',path:'M12 2 4 5v6c0 5.05 3.41 9.76 8 11 4.59-1.24 8-5.95 8-11V5l-8-3zm4 11h-3v3h-2v-3H8v-2h3V8h2v3h3v2z'},
    {name:'medical_services',label:'Médico',path:'M19 6h-3V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H5a3 3 0 0 0-3 3v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a3 3 0 0 0-3-3zm-9-2h4v2h-4V4zm5 10h-2v2h-2v-2H9v-2h2v-2h2v2h2v2z'},
    {name:'science',label:'Ciência',path:'M9 2v2h1v5.59l-5.7 7.32A3.2 3.2 0 0 0 6.82 22h10.36a3.2 3.2 0 0 0 2.52-5.09L14 9.59V4h1V2H9zm3 9.1 2.25 2.9h-4.5L12 11.1z'},
    {name:'spa',label:'Spa',path:'M12 21c-4.42 0-8-3.58-8-8 4.42 0 8 3.58 8 8zm0 0c0-4.42 3.58-8 8-8 0 4.42-3.58 8-8 8zm0-8c-2.76 0-5-2.24-5-5 2.76 0 5 2.24 5 5zm0 0c0-2.76 2.24-5 5-5 0 2.76-2.24 5-5 5z'},
    {name:'healing',label:'Cuidado',path:'M17.73 12.73 12 18.46l-5.73-5.73a6 6 0 0 1 8.49-8.49L12 7l-2.76-2.76a6 6 0 0 1 8.49 8.49z'},
    {name:'water_drop',label:'Gota',path:'M12 2s-7 7.24-7 12a7 7 0 0 0 14 0c0-4.76-7-12-7-12zm0 16a4 4 0 0 1-4-4c0-.78.32-1.72.82-2.7A6 6 0 0 0 15 17.18 3.98 3.98 0 0 1 12 18z'},
    {name:'eco',label:'Folha',path:'M17.5 3C12 3 7.5 5 5 9c-2 3.2-1.4 7.2 1.4 9.5C9.2 20.8 13.2 20 15 17c2.6-4.2 1.7-9.7 2.5-14zM7 17c2-5 5-8 9-11-3 4-5 7-6 12l-3-1z'},
    {name:'bolt',label:'Energia',path:'M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.4 0 .62.19.4.66C12.97 17.53 11 21 11 21z'},
    {name:'star',label:'Estrela',path:'m12 17.27 6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'},
    {name:'psychology',label:'Bem-estar',path:'M13 3a5 5 0 0 0-4.9 4H7a4 4 0 0 0-1 7.87V17a4 4 0 0 0 7.87 1H15a4 4 0 0 0 1-7.87V8a5 5 0 0 0-3-5zm-1 12H9v-2h3v2zm3-4H9V9h6v2z'}
  ];
  const FOOTER_ICONS={
    instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    whatsapp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.5 4.1 1.6 5.9L0 24l6.5-1.7a11.8 11.8 0 0 0 5.6 1.4c6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6.1-3.4-8.4zm-8.4 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 1 1 8.3 4.6zm5.3-7.2c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-1.9-1-3.2-1.8-4.5-4-.3-.6.3-.6.9-1.4.1-.2.1-.4 0-.6L7.5 6.8c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.6c.2.2 2.4 3.7 5.9 5.2 2.2.9 3.1 1 4.3.8 1.4-.2 2.7-1.1 3.1-2.2.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.7-.4z"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><rect x="11" y="10" width="2" height="7" fill="#5b7e4e"/><circle cx="12" cy="7" r="1.2" fill="#5b7e4e"/></svg>'
  };
  const defaults={
    version:1,fileName:'modelo 1 isa',title:'Microagulhamento na Tricologia',subtitle:'Uma técnica minimamente invasiva que promove estímulos importantes para a saúde do couro cabeludo e dos fios.',subtitleGap:28,pageBackground:'#f3f0eb',
    box:{title:'O que é?',body:'É um procedimento minimamente invasivo que cria microperfurações controladas no couro cabeludo para estimular a regeneração tecidual e potencializar a absorção de ativos.',background:'#dfddd2',padding:28,autoPalette:true,icon:'favorite',iconSize:60,iconGap:28},
    benefitsTitle:'Principais benefícios:',bodyCopy:'Estimular o crescimento dos fios\nMelhorar a circulação sanguínea\nAumentar a absorção de ativos\nFortalecer fios enfraquecidos\nRecuperar a densidade capilar\nReduzir queda\nEstimular regeneração tecidual\nMelhorar aparência de cicatrizes',bodyIsList:true,
    infoText:'O microagulhamento é uma ferramenta terapêutica segura e baseada em evidências para melhorar a saúde do couro cabeludo e potencializar tratamentos capilares.',
    footer:{heading:'Entre em contato',instagram:'@isadoraguirelli',whatsapp:'(19) 99910-3510',info:'Atendimento apenas com agendamento prévio',gap:12}
  };
  const clone=o=>JSON.parse(JSON.stringify(o));
  const deepMerge=(base,patch)=>{const out=clone(base);for(const [k,v] of Object.entries(patch||{})){if(v&&typeof v==='object'&&!Array.isArray(v)&&out[k]&&typeof out[k]==='object')out[k]=deepMerge(out[k],v);else out[k]=v}return out};
  const readProjects=()=>{try{const x=JSON.parse(storage.getItem(PROJECTS_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return []}};
  const writeProjects=x=>storage.setItem(PROJECTS_KEY,JSON.stringify(x));
  const newId=()=>`modelo1isa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const projectRecord=id=>readProjects().find(p=>p.id===id);
  let state=loadInitial();
  function loadInitial(){
    try{
      if(currentProjectId){const p=projectRecord(currentProjectId);const draft=storage.getItem(PROJECT_DRAFT_PREFIX+currentProjectId);return deepMerge(defaults,draft?JSON.parse(draft):(p?.state||{}))}
      const raw=storage.getItem(DRAFT_KEY);return raw?deepMerge(defaults,JSON.parse(raw)):clone(defaults)
    }catch{return clone(defaults)}
  }
  const $=id=>document.getElementById(id);
  const els=['fileName','title','subtitle','subtitleGap','subtitleGapOut','pageBackground','benefitsTitle','bodyCopy','bodyIsList','infoText','boxTitle','boxBody','boxBackground','boxPadding','boxPaddingOut','autoPalette','iconSearch','iconResults','iconSize','iconSizeOut','iconGap','iconGapOut','footerHeading','instagramText','whatsappText','footerInfo','footerGap','footerGapOut','exportFormat','exportFile','saveProject','duplicateProject','projectFeedback'].reduce((a,id)=>(a[id]=$(id),a),{});

  function svgIcon(name){const icon=ICONS.find(x=>x.name===name)||ICONS[0];return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${icon.path}"/></svg>`}
  function luminance(hex){const h=hex.replace('#','');const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]}
  function palette(bg){return luminance(bg)<.34?{title:'#869159',text:'#ffffff',iconBg:'#f4f3ef',icon:'#014744'}:{title:'#014744',text:'#262e34',iconBg:'#c4c9b3',icon:'#ffffff'}}
  function safeName(s){return String(s||'arquivo').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase()||'arquivo'}
  function persist(){try{const key=currentProjectId?PROJECT_DRAFT_PREFIX+currentProjectId:DRAFT_KEY;storage.setItem(key,JSON.stringify({...state,updatedAt:new Date().toISOString()}));els.projectFeedback.textContent='Alterações salvas automaticamente.'}catch{els.projectFeedback.textContent='Não foi possível salvar automaticamente neste navegador.'}}
  function syncInputs(){
    els.fileName.value=state.fileName;els.title.value=state.title;els.subtitle.value=state.subtitle;els.subtitleGap.value=state.subtitleGap;els.pageBackground.value=state.pageBackground;els.benefitsTitle.value=state.benefitsTitle;els.bodyCopy.value=state.bodyCopy;els.bodyIsList.checked=state.bodyIsList;els.infoText.value=state.infoText;els.boxTitle.value=state.box.title;els.boxBody.value=state.box.body;els.boxBackground.value=state.box.background;els.boxPadding.value=state.box.padding;els.autoPalette.checked=state.box.autoPalette;els.iconSize.value=state.box.iconSize;els.iconGap.value=state.box.iconGap;els.footerHeading.value=state.footer.heading;els.instagramText.value=state.footer.instagram;els.whatsappText.value=state.footer.whatsapp;els.footerInfo.value=state.footer.info;els.footerGap.value=state.footer.gap;updateOutputs();renderIconResults('')
  }
  function updateOutputs(){els.subtitleGapOut.textContent=`${state.subtitleGap}px`;els.boxPaddingOut.textContent=`${state.box.padding}px`;els.iconSizeOut.textContent=`${state.box.iconSize}px`;els.iconGapOut.textContent=`${state.box.iconGap}px`;els.footerGapOut.textContent=`${state.footer.gap}px`}
  function renderPreview(){
    const d=$('design'),pal=palette(state.box.background);d.style.setProperty('--page-bg',state.pageBackground);d.style.setProperty('--subtitle-gap',`${state.subtitleGap}px`);d.style.setProperty('--box-bg',state.box.background);d.style.setProperty('--box-padding',`${state.box.padding}px`);d.style.setProperty('--icon-size',`${state.box.iconSize}px`);d.style.setProperty('--icon-gap',`${state.box.iconGap}px`);d.style.setProperty('--footer-gap',`${state.footer.gap}px`);
    if(state.box.autoPalette){d.style.setProperty('--box-title',pal.title);d.style.setProperty('--box-text',pal.text);d.style.setProperty('--icon-bg',pal.iconBg);d.style.setProperty('--icon-color',pal.icon)}
    $('previewTitle').textContent=state.title;$('previewSubtitle').textContent=state.subtitle;$('previewBoxTitle').textContent=state.box.title;$('previewBoxBody').textContent=state.box.body;$('previewIcon').innerHTML=svgIcon(state.box.icon);$('previewBenefitsTitle').textContent=state.benefitsTitle;$('previewInfoText').textContent=state.infoText;$('previewFooterHeading').textContent=state.footer.heading;$('previewInstagram').textContent=state.footer.instagram;$('previewWhatsapp').textContent=state.footer.whatsapp;$('previewFooterInfo').textContent=state.footer.info;
    document.querySelectorAll('.footer-svg').forEach(n=>n.innerHTML=FOOTER_ICONS[n.dataset.icon]||'');
    const bc=$('previewBodyCopy');bc.className='body-copy'+(state.bodyIsList?' is-list':'');bc.innerHTML='';
    if(state.bodyIsList){String(state.bodyCopy).split('\n').filter(x=>x.trim()).forEach(line=>{const row=document.createElement('div');row.className='list-line';row.innerHTML=`<span class="list-check">✓</span><span></span>`;row.lastElementChild.textContent=line;bc.appendChild(row)})}else bc.textContent=state.bodyCopy;
    document.title=`Editar ${state.fileName||'modelo 1 isa'}`;
  }
  function commit(){updateOutputs();renderPreview();persist()}
  function bindInput(el,fn,event='input'){el.addEventListener(event,()=>{fn(el);commit()})}
  function wire(){
    document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('is-active',x===btn));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('is-active',p.dataset.panelContent===btn.dataset.panel))}));
    bindInput(els.fileName,e=>state.fileName=e.value);bindInput(els.title,e=>state.title=e.value);bindInput(els.subtitle,e=>state.subtitle=e.value);bindInput(els.subtitleGap,e=>state.subtitleGap=+e.value);bindInput(els.pageBackground,e=>state.pageBackground=e.value);bindInput(els.benefitsTitle,e=>state.benefitsTitle=e.value);bindInput(els.bodyCopy,e=>state.bodyCopy=e.value);bindInput(els.bodyIsList,e=>state.bodyIsList=e.checked,'change');bindInput(els.infoText,e=>state.infoText=e.value);bindInput(els.boxTitle,e=>state.box.title=e.value);bindInput(els.boxBody,e=>state.box.body=e.value);bindInput(els.boxBackground,e=>state.box.background=e.value);bindInput(els.boxPadding,e=>state.box.padding=+e.value);bindInput(els.autoPalette,e=>state.box.autoPalette=e.checked,'change');bindInput(els.iconSize,e=>state.box.iconSize=+e.value);bindInput(els.iconGap,e=>state.box.iconGap=+e.value);bindInput(els.footerHeading,e=>state.footer.heading=e.value);bindInput(els.instagramText,e=>state.footer.instagram=e.value);bindInput(els.whatsappText,e=>state.footer.whatsapp=e.value);bindInput(els.footerInfo,e=>state.footer.info=e.value);bindInput(els.footerGap,e=>state.footer.gap=+e.value);
    els.iconSearch.addEventListener('input',()=>renderIconResults(els.iconSearch.value));els.saveProject.addEventListener('click',saveProject);els.duplicateProject.addEventListener('click',duplicateProject);els.exportFormat.addEventListener('change',()=>els.exportFile.textContent=`Baixar ${els.exportFormat.value.toUpperCase()}`);els.exportFile.addEventListener('click',exportFile)
  }
  function renderIconResults(q){const term=String(q||'').trim().toLowerCase();els.iconResults.innerHTML='';ICONS.filter(i=>!term||i.name.includes(term)||i.label.toLowerCase().includes(term)).forEach(icon=>{const b=document.createElement('button');b.type='button';b.className='icon-choice'+(state.box.icon===icon.name?' is-selected':'');b.title=`${icon.name} · ${icon.label}`;b.innerHTML=svgIcon(icon.name);b.addEventListener('click',()=>{state.box.icon=icon.name;renderIconResults(els.iconSearch.value);commit()});els.iconResults.appendChild(b)});if(!els.iconResults.children.length)els.iconResults.innerHTML='<small>Nenhum ícone encontrado.</small>'}
  function saveProject(){
    try{if(!currentProjectId)currentProjectId=newId();const now=new Date().toISOString(),record={id:currentProjectId,template:'modelo1isa',title:state.fileName||'modelo 1 isa',fileName:state.fileName||'modelo 1 isa',preview:'assets/images/modelo1-preview.jpg',editor:`modelo-editor.html?project=${encodeURIComponent(currentProjectId)}`,savedAt:now,updatedAt:now,state:clone(state)};const items=readProjects(),idx=items.findIndex(p=>p.id===currentProjectId);if(idx>=0)items[idx]=record;else items.unshift(record);writeProjects(items);storage.setItem(PROJECT_DRAFT_PREFIX+currentProjectId,JSON.stringify(state));history.replaceState({},'',`modelo-editor.html?project=${encodeURIComponent(currentProjectId)}`);flash(els.saveProject,'Salvo ✓');els.projectFeedback.textContent=`Projeto “${record.title}” salvo.`;return currentProjectId}catch(err){els.projectFeedback.textContent='Erro ao salvar projeto.';console.error(err);return null}}
  function duplicateProject(){
    const source=currentProjectId||saveProject();if(!source)return;try{const sourceRecord=projectRecord(source);const id=newId(),now=new Date().toISOString(),copy=clone(state);copy.fileName=`${state.fileName||'modelo 1 isa'} - cópia`;const record={id,template:'modelo1isa',title:copy.fileName,fileName:copy.fileName,preview:'assets/images/modelo1-preview.jpg',editor:`modelo-editor.html?project=${encodeURIComponent(id)}`,savedAt:now,updatedAt:now,duplicatedFrom:source,state:copy};const items=readProjects();items.unshift(record);writeProjects(items);currentProjectId=id;state=copy;storage.setItem(PROJECT_DRAFT_PREFIX+id,JSON.stringify(state));history.replaceState({},'',`modelo-editor.html?project=${encodeURIComponent(id)}`);syncInputs();renderPreview();flash(els.duplicateProject,'Cópia criada ✓');els.projectFeedback.textContent=`Cópia criada. “${sourceRecord?.title||'Original'}” foi preservado.`}catch(err){els.projectFeedback.textContent='Erro ao duplicar projeto.';console.error(err)}}
  function flash(btn,text){const old=btn.dataset.old||btn.textContent;btn.dataset.old=old;btn.textContent=text;btn.classList.add('is-success');setTimeout(()=>{btn.textContent=old;btn.classList.remove('is-success')},1500)}

  function wrap(ctx,text,maxWidth){const out=[];String(text||'').split('\n').forEach(p=>{if(!p){out.push('');return}const words=p.split(/\s+/);let line='';words.forEach(w=>{const t=line?line+' '+w:w;if(ctx.measureText(t).width<=maxWidth||!line)line=t;else{out.push(line);line=w}});if(line)out.push(line)});return out}
  function drawLines(ctx,lines,x,y,lineHeight,align='left'){ctx.textAlign=align;lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));return lines.length*lineHeight}
  function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
  async function loadImg(src){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=src})}
  async function svgImage(markup){return loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup))}
  async function renderCanvas(){
    await document.fonts.ready;const c=document.createElement('canvas');c.width=1080;c.height=1920;const ctx=c.getContext('2d');ctx.fillStyle=state.pageBackground;ctx.fillRect(0,0,1080,1920);
    const logo=await loadImg('assets/images/modelo1-logo.png');ctx.drawImage(logo,632,99,384,110);ctx.fillStyle='#638253';ctx.fillRect(67,149,96,5);
    ctx.font='italic 600 64px "Cormorant Garamond",serif';ctx.fillStyle='#014744';ctx.textAlign='center';drawLines(ctx,wrap(ctx,state.title,950),540,250,64,'center');
    ctx.font='400 26px Arial,sans-serif';const sub=wrap(ctx,state.subtitle,760),subY=345;ctx.fillStyle='#014744';drawLines(ctx,sub,540,subY,30,'center');const boxY=subY+sub.length*30+state.subtitleGap;
    const pal=palette(state.box.background);ctx.font='400 27px Arial,sans-serif';const titleLines=wrap(ctx,state.box.title,520),bodyFont='400 21px Arial,sans-serif';ctx.font=bodyFont;const bodyLines=wrap(ctx,state.box.body,560);const contentH=titleLines.length*31+12+bodyLines.length*24;const boxH=Math.max(190,contentH+state.box.padding*2);ctx.fillStyle=state.box.background;roundRect(ctx,64,boxY,952,boxH,25);
    const iconR=(state.box.iconSize+40)/2,cx=154,cy=boxY+boxH/2;ctx.fillStyle=pal.iconBg;ctx.beginPath();ctx.arc(cx,cy,iconR,0,Math.PI*2);ctx.fill();const iconSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="${pal.icon}"><path d="${(ICONS.find(i=>i.name===state.box.icon)||ICONS[0]).path}"/></svg>`;const iconImg=await svgImage(iconSvg);ctx.drawImage(iconImg,cx-state.box.iconSize/2,cy-state.box.iconSize/2,state.box.iconSize,state.box.iconSize);
    const tx=250;ctx.textAlign='left';ctx.fillStyle=pal.title;ctx.font='500 30px Arial,sans-serif';drawLines(ctx,titleLines,tx,boxY+state.box.padding,32);ctx.fillStyle=pal.text;ctx.font=bodyFont;drawLines(ctx,bodyLines,tx,boxY+state.box.padding+titleLines.length*31+12,24);
    const benefitY=boxY+boxH+58;ctx.fillStyle='#014744';ctx.font='italic 600 51px "Cormorant Garamond",serif';ctx.fillText(state.benefitsTitle,96,benefitY);ctx.font='400 27px Arial,sans-serif';let y=benefitY+58;if(state.bodyIsList){for(const line of String(state.bodyCopy).split('\n').filter(x=>x.trim())){ctx.font='700 27px Arial';ctx.fillText('✓',70,y);ctx.font='400 27px Arial';ctx.fillText(line,100,y);y+=35}}else{drawLines(ctx,wrap(ctx,state.bodyCopy,600),70,y,34)}
    const photo=await loadImg('assets/images/modelo1-main-image.png');ctx.save();ctx.beginPath();ctx.moveTo(680,1120);ctx.quadraticCurveTo(980,1180,1080,1050);ctx.lineTo(1080,1785);ctx.lineTo(690,1785);ctx.closePath();ctx.clip();ctx.drawImage(photo,600,1090,560,760);ctx.restore();
    ctx.font='600 17px Arial';ctx.fillStyle='#014744';drawLines(ctx,wrap(ctx,state.infoText.toUpperCase(),540),80,1580,23);
    ctx.textAlign='center';ctx.font='500 24px Arial';ctx.fillText(state.footer.heading.toUpperCase(),540,1755);ctx.fillStyle='#5b7e4e';ctx.fillRect(0,1783,1080,137);ctx.fillStyle='#fff';ctx.font='700 20px Arial';ctx.textAlign='left';ctx.fillText(state.footer.instagram,220,1830);ctx.fillText(state.footer.whatsapp,700,1830);ctx.font='500 16px Arial';ctx.fillText(state.footer.info.toUpperCase(),285,1880);return c
  }
  function dl(blob,name){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
  function toBlob(c,type,q){return new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('Falha')),type,q))}
  function jpegPdf(jpeg,w,h){const enc=s=>new TextEncoder().encode(s),parts=[],offs=[0];let pos=0;const push=b=>{parts.push(b);pos+=b.length},obj=(n,arr)=>{offs[n]=pos;push(enc(`${n} 0 obj\n`));arr.forEach(p=>push(typeof p==='string'?enc(p):p));push(enc('\nendobj\n'))};push(enc('%PDF-1.4\n'));obj(1,['<< /Type /Catalog /Pages 2 0 R >>']);obj(2,['<< /Type /Pages /Kids [3 0 R] /Count 1 >>']);obj(3,['<< /Type /Page /Parent 2 0 R /MediaBox [0 0 405 720] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>']);obj(4,[`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,jpeg,'\nendstream']);const s='q\n405 0 0 720 0 0 cm\n/Im0 Do\nQ\n';obj(5,[`<< /Length ${s.length} >>\nstream\n${s}endstream`]);const x=pos;push(enc('xref\n0 6\n0000000000 65535 f \n'));for(let i=1;i<=5;i++)push(enc(`${String(offs[i]).padStart(10,'0')} 00000 n \n`));push(enc(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`));return new Blob(parts,{type:'application/pdf'})}
  async function exportFile(){els.exportFile.disabled=true;try{const c=await renderCanvas(),fmt=els.exportFormat.value,base=safeName(state.fileName);if(fmt==='png')dl(await toBlob(c,'image/png',1),`${base}.png`);else if(fmt==='jpg')dl(await toBlob(c,'image/jpeg',.95),`${base}.jpg`);else{const b=await toBlob(c,'image/jpeg',.95),arr=new Uint8Array(await b.arrayBuffer());dl(jpegPdf(arr,c.width,c.height),`${base}.pdf`)}}catch(e){alert('Não foi possível exportar: '+e.message)}finally{els.exportFile.disabled=false;els.exportFile.textContent=`Baixar ${els.exportFormat.value.toUpperCase()}`}}
  syncInputs();wire();renderPreview();persist();
})();

(async () => {
  'use strict';
  await window.AppStorage.init();
  const storage = window.AppStorage;

  const LEGACY_STORAGE_KEY = 'prescricao-editor:v2';
  const PROJECTS_KEY = 'prescricao-editor:projects:v1';
  const TEMPLATE_DRAFT_KEY = 'prescricao-editor:draft:template';
  const PROJECT_DRAFT_PREFIX = 'prescricao-editor:draft:project:';
  const DESIGN = {
    width:2480, height:3508,
    medsLeft:165, medsTop:865, medsWidth:2171,
    warningLeft:224, warningWidth:2030,
    stampPositions:{ left:442, center:1230, right:2018 },
    stampY:{ date:2842, name:2885, registration:2941 }
  };

  const defaultTypography = {
    patient:{family:'Cormorant Garamond',size:82,weight:500,letterSpacing:0,lineHeight:1.08,color:'#111111'},
    medicineName:{family:'Montserrat',size:64,weight:700,letterSpacing:0,lineHeight:1.12,color:'#111111'},
    medicineUsage:{family:'Montserrat',size:52,weight:400,letterSpacing:0,lineHeight:1.28,color:'#111111'},
    warning:{family:'Montserrat',size:48,weight:400,letterSpacing:0,lineHeight:1.35,color:'#111111'},
    stampDate:{family:'Cormorant Garamond',size:48,weight:700,letterSpacing:.2,lineHeight:1,color:'#111111'},
    stampName:{family:'Cormorant Garamond',size:52,weight:600,letterSpacing:0,lineHeight:1,color:'#111111'},
    stampRegistration:{family:'Arial',size:32,weight:400,letterSpacing:4.5,lineHeight:1,color:'#111111'}
  };

  const todayISO=()=>{const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
  const newId=()=>{try{if(globalThis.crypto&&typeof globalThis.crypto.randomUUID==='function')return globalThis.crypto.randomUUID()}catch{}return `p-${Date.now()}-${Math.random().toString(36).slice(2,10)}`};
  const initialState=()=>({
    patientName:'Nome do paciente',
    medicines:[{id:newId(),name:'Nome do medicamento',usage:'Modo de uso'}],
    warning:'avisos',
    stamp:{autoDate:true,date:todayISO(),professional:'Isadora Mitestainer Guirelli',registration:'CRF-SP 92908',x:2018},
    typography:JSON.parse(JSON.stringify(defaultTypography)),
    layout:{gap:72,paddingX:54,paddingY:44,radius:26,nameUsageGap:18}
  });

  const $=id=>document.getElementById(id);
  const els={
    patientName:$('patientName'),medicineList:$('medicineList'),addMedicine:$('addMedicine'),warningText:$('warningText'),
    stampDate:$('stampDate'),autoDate:$('autoDate'),professionalName:$('professionalName'),registration:$('registration'),stampPosition:$('stampPosition'),stampPositionValue:$('stampPositionValue'),
    styleTarget:$('styleTarget'),fontFamily:$('fontFamily'),fontWeight:$('fontWeight'),fontSize:$('fontSize'),fontSizeValue:$('fontSizeValue'),
    letterSpacing:$('letterSpacing'),letterSpacingValue:$('letterSpacingValue'),lineHeight:$('lineHeight'),lineHeightValue:$('lineHeightValue'),textColor:$('textColor'),
    medicineGap:$('medicineGap'),medicineGapValue:$('medicineGapValue'),boxPaddingX:$('boxPaddingX'),boxPaddingXValue:$('boxPaddingXValue'),
    boxPaddingY:$('boxPaddingY'),boxPaddingYValue:$('boxPaddingYValue'),boxRadius:$('boxRadius'),boxRadiusValue:$('boxRadiusValue'),
    patientPreview:$('patientPreview'),medicinesPreview:$('medicinesPreview'),warningPreview:$('warningPreview'),stampPreview:$('stampPreview'),
    stampDatePreview:$('stampDatePreview'),professionalPreview:$('professionalPreview'),registrationPreview:$('registrationPreview'),
    stageViewport:$('stageViewport'),stageSizer:$('stageSizer'),artboard:$('artboard'),exportScale:$('exportScale'),exportFormat:$('exportFormat'),exportFile:$('exportFile'),
    saveProject:$('saveProject'),duplicateProject:$('duplicateProject'),projectStatus:$('projectStatus'),medicineEditorTemplate:$('medicineEditorTemplate'),autosaveStatus:$('autosaveStatus')
  };

  const params=new URLSearchParams(location.search);
  let currentProjectId=params.get('project')||'';
  let lastLayout={medicineHeights:[],warningTop:2793};
  let saveTimer=null;

  const HAS_STORAGE=storage.persistent;
  function readProjects(){
    if(!HAS_STORAGE)return [];
    try{const value=JSON.parse(storage.getItem(PROJECTS_KEY)||'[]');return Array.isArray(value)?value:[]}catch{return []}
  }
  function writeProjects(items){
    if(!HAS_STORAGE)throw new Error('O navegador bloqueou os dois mecanismos persistentes disponíveis.');
    storage.setItem(PROJECTS_KEY,JSON.stringify(items));
    const check=JSON.parse(storage.getItem(PROJECTS_KEY)||'[]');
    if(!Array.isArray(check)||check.length!==items.length)throw new Error('A gravação do projeto não pôde ser confirmada.');
    return check;
  }
  function findProject(id){return readProjects().find(item=>item.id===id)||null}
  function draftKey(){return currentProjectId?`${PROJECT_DRAFT_PREFIX}${currentProjectId}`:TEMPLATE_DRAFT_KEY}
  function cloneState(value){return JSON.parse(JSON.stringify(value))}
  function patientLabel(){return String(state.patientName||'').trim()||'Sem nome'}
  function projectTitle(copy=false){return `Prescrição médica · ${patientLabel()}${copy?' · Cópia':''}`}
  function safeFilePart(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase()||'sem-nome'}
  function setProjectFeedback(message){if(!els.projectStatus)return;els.projectStatus.textContent=message;clearTimeout(setProjectFeedback.timer);setProjectFeedback.timer=setTimeout(()=>{els.projectStatus.textContent=''},2200)}
  function updateDocumentTitle(){document.title=`${projectTitle(false)} · Editor`}

  function mergeState(data){
    const base=initialState();
    if(!data||typeof data!=='object') return base;
    const legacyStamp=data.typography?.stamp;
    const typography={...base.typography,...(data.typography||{})};
    if(legacyStamp){
      typography.stampDate={...base.typography.stampDate,...legacyStamp};
      typography.stampName={...base.typography.stampName,...legacyStamp};
      typography.stampRegistration={...base.typography.stampRegistration,...legacyStamp,family:'Arial',letterSpacing:4.5};
      delete typography.stamp;
    }
    const incomingStamp={...(data.stamp||{})};
    if(!Number.isFinite(Number(incomingStamp.x)) && incomingStamp.position){
      incomingStamp.x=DESIGN.stampPositions[incomingStamp.position]??base.stamp.x;
    }
    delete incomingStamp.position;
    return {
      ...base,...data,
      medicines:Array.isArray(data.medicines)?data.medicines:base.medicines,
      stamp:{...base.stamp,...incomingStamp},
      typography,
      layout:{...base.layout,...(data.layout||{})}
    };
  }
  function loadPersistedState(){
    try{
      const draft=JSON.parse(storage.getItem(draftKey())||'null');
      if(draft)return mergeState(draft);
      if(currentProjectId){const project=findProject(currentProjectId);if(project?.state)return mergeState(project.state)}
      const templateDraft=JSON.parse(storage.getItem(TEMPLATE_DRAFT_KEY)||'null');
      if(templateDraft)return mergeState(templateDraft);
      const legacy=JSON.parse(storage.getItem(LEGACY_STORAGE_KEY)||'null');
      if(legacy)return mergeState(legacy);
    }catch{}
    return initialState();
  }
  let state=loadPersistedState();
  function persistState(){
    try{
      if(!HAS_STORAGE)throw new Error('storage unavailable');
      storage.setItem(draftKey(),JSON.stringify({...state,version:4,savedAt:new Date().toISOString()}));
      updateDocumentTitle();
      if(els.autosaveStatus){els.autosaveStatus.textContent='Salvo automaticamente agora.';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{els.autosaveStatus.textContent='Alterações salvas automaticamente neste navegador.'},1300)}
    }catch(e){if(els.autosaveStatus)els.autosaveStatus.textContent='Não foi possível salvar localmente neste navegador.'}
  }

  function formatDate(iso){if(!iso)return '';const [y,m,d]=iso.split('-');return `${d}.${m}.${y}`}
  function cssFont(t){return `'${t.family}', ${t.family==='Cormorant Garamond'||t.family==='Georgia'?'serif':'sans-serif'}`}
  function applyTextStyle(el,t){el.style.fontFamily=cssFont(t);el.style.fontSize=`${t.size}px`;el.style.fontWeight=t.weight;el.style.letterSpacing=`${t.letterSpacing}px`;el.style.lineHeight=t.lineHeight;el.style.color=t.color}

  function renderMedicineEditors(){
    els.medicineList.innerHTML='';
    state.medicines.forEach((med,index)=>{
      const node=els.medicineEditorTemplate.content.firstElementChild.cloneNode(true);
      node.dataset.id=med.id;node.querySelector('.medicine-number').textContent=`Medicamento ${index+1}`;
      const name=node.querySelector('.medicine-name-input'),usage=node.querySelector('.medicine-usage-input');name.value=med.name;usage.value=med.usage;
      name.addEventListener('input',()=>{med.name=name.value;changed()});usage.addEventListener('input',()=>{med.usage=usage.value;changed()});
      node.querySelector('.duplicate-medicine').addEventListener('click',()=>{state.medicines.splice(index+1,0,{...med,id:newId()});renderMedicineEditors();changed()});
      node.querySelector('.remove-medicine').addEventListener('click',()=>{state.medicines.splice(index,1);renderMedicineEditors();changed()});
      els.medicineList.appendChild(node);
    });
  }

  function renderPreview(){
    els.patientPreview.textContent=state.patientName;applyTextStyle(els.patientPreview,state.typography.patient);
    els.medicinesPreview.style.gap=`${state.layout.gap}px`;els.medicinesPreview.innerHTML='';
    state.medicines.forEach(med=>{
      const box=document.createElement('div');box.className='medicine-preview-box';box.style.padding=`${state.layout.paddingY}px ${state.layout.paddingX}px`;box.style.borderRadius=`${state.layout.radius}px`;
      const name=document.createElement('p');name.className='medicine-preview-name';name.textContent=med.name;applyTextStyle(name,state.typography.medicineName);
      const usage=document.createElement('p');usage.className='medicine-preview-usage';usage.textContent=med.usage;applyTextStyle(usage,state.typography.medicineUsage);usage.style.marginTop=`${state.layout.nameUsageGap}px`;
      box.append(name,usage);els.medicinesPreview.appendChild(box);
    });
    requestAnimationFrame(()=>{
      const boxes=[...els.medicinesPreview.children];lastLayout.medicineHeights=boxes.map(b=>b.offsetHeight);
      const total=lastLayout.medicineHeights.reduce((a,b)=>a+b,0)+Math.max(0,boxes.length-1)*state.layout.gap;
      lastLayout.warningTop=DESIGN.medsTop+total+(boxes.length?state.layout.gap:0);
      els.warningPreview.style.top=`${lastLayout.warningTop}px`;els.warningPreview.textContent=state.warning;applyTextStyle(els.warningPreview,state.typography.warning);
      const center=Number(state.stamp.x)||DESIGN.stampPositions.right;
      els.stampPreview.style.left=`${center-360}px`;els.stampPreview.style.top=`${DESIGN.stampY.date}px`;
      els.stampDatePreview.textContent=formatDate(state.stamp.autoDate?todayISO():state.stamp.date);els.professionalPreview.textContent=state.stamp.professional;els.registrationPreview.textContent=state.stamp.registration;
      applyTextStyle(els.stampDatePreview,state.typography.stampDate);applyTextStyle(els.professionalPreview,state.typography.stampName);applyTextStyle(els.registrationPreview,state.typography.stampRegistration);
      els.professionalPreview.style.marginTop=`${DESIGN.stampY.name-DESIGN.stampY.date-state.typography.stampDate.size}px`;
      els.registrationPreview.style.marginTop=`${DESIGN.stampY.registration-DESIGN.stampY.name-state.typography.stampName.size}px`;
      $('layoutStatus').textContent=lastLayout.warningTop>2700?'Atenção: conteúdo próximo à área do carimbo':'Layout automático ativo';
    });
  }
  function changed(){persistState();renderPreview()}
  function updateStampPositionLabel(){
    if(!els.stampPositionValue)return;
    const x=Number(state.stamp.x)||DESIGN.stampPositions.right,center=DESIGN.stampPositions.center;
    const label=Math.abs(x-center)<1?'Centro':`${Math.round(((x-DESIGN.stampPositions.left)/(DESIGN.stampPositions.right-DESIGN.stampPositions.left))*100)}%`;
    els.stampPositionValue.value=label;
  }

  function syncContentControls(){
    els.patientName.value=state.patientName;els.warningText.value=state.warning;els.autoDate.checked=state.stamp.autoDate;els.stampPosition.value=state.stamp.x;updateStampPositionLabel();
    els.stampDate.value=state.stamp.autoDate?todayISO():state.stamp.date;els.stampDate.disabled=state.stamp.autoDate;els.professionalName.value=state.stamp.professional;els.registration.value=state.stamp.registration;
  }
  function syncStyleControls(){
    const t=state.typography[els.styleTarget.value];els.fontFamily.value=t.family;els.fontWeight.value=String(t.weight);els.fontSize.value=t.size;els.letterSpacing.value=t.letterSpacing;els.lineHeight.value=t.lineHeight;els.textColor.value=t.color;
    els.fontSizeValue.value=`${t.size}px`;els.letterSpacingValue.value=`${t.letterSpacing}px`;els.lineHeightValue.value=Number(t.lineHeight).toFixed(2);
  }
  function syncLayoutControls(){
    els.medicineGap.value=state.layout.gap;els.boxPaddingX.value=state.layout.paddingX;els.boxPaddingY.value=state.layout.paddingY;els.boxRadius.value=state.layout.radius;
    els.medicineGapValue.value=`${state.layout.gap}px`;els.boxPaddingXValue.value=`${state.layout.paddingX}px`;els.boxPaddingYValue.value=`${state.layout.paddingY}px`;els.boxRadiusValue.value=`${state.layout.radius}px`;
  }
  function fitStage(){const maxW=Math.max(280,els.stageViewport.clientWidth-56),maxH=Math.max(360,els.stageViewport.clientHeight-56),scale=Math.min(maxW/DESIGN.width,maxH/DESIGN.height,1);els.artboard.style.transform=`scale(${scale})`;els.stageSizer.style.width=`${DESIGN.width*scale}px`;els.stageSizer.style.height=`${DESIGN.height*scale}px`}

  function wire(){
    // Ações de projeto são ligadas primeiro para não depender dos demais controles do editor.
    if(els.saveProject)els.saveProject.addEventListener('click',saveProject);
    if(els.duplicateProject)els.duplicateProject.addEventListener('click',duplicateProject);
    document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('is-active',t===tab));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('is-active',p.dataset.panelContent===tab.dataset.panel))}));
    els.patientName.addEventListener('input',()=>{state.patientName=els.patientName.value;changed()});els.warningText.addEventListener('input',()=>{state.warning=els.warningText.value;changed()});
    els.addMedicine.addEventListener('click',()=>{state.medicines.push({id:newId(),name:'Novo medicamento',usage:'Modo de uso'});renderMedicineEditors();changed()});
    els.autoDate.addEventListener('change',()=>{state.stamp.autoDate=els.autoDate.checked;els.stampDate.disabled=state.stamp.autoDate;if(state.stamp.autoDate)els.stampDate.value=todayISO();changed()});
    els.stampDate.addEventListener('change',()=>{state.stamp.date=els.stampDate.value;changed()});els.professionalName.addEventListener('input',()=>{state.stamp.professional=els.professionalName.value;changed()});els.registration.addEventListener('input',()=>{state.stamp.registration=els.registration.value;changed()});
    els.stampPosition.addEventListener('input',()=>{let x=Number(els.stampPosition.value);const center=DESIGN.stampPositions.center;const snapRadius=32;if(Math.abs(x-center)<=snapRadius){x=center;els.stampPosition.value=String(center)}state.stamp.x=x;updateStampPositionLabel();changed()});
    els.styleTarget.addEventListener('change',syncStyleControls);
    [['fontFamily','family'],['fontWeight','weight'],['fontSize','size'],['letterSpacing','letterSpacing'],['lineHeight','lineHeight'],['textColor','color']].forEach(([id,key])=>els[id].addEventListener('input',()=>{let v=els[id].value;if(['weight','size','letterSpacing','lineHeight'].includes(key))v=Number(v);state.typography[els.styleTarget.value][key]=v;syncStyleControls();changed()}));
    [['medicineGap','gap'],['boxPaddingX','paddingX'],['boxPaddingY','paddingY'],['boxRadius','radius']].forEach(([id,key])=>els[id].addEventListener('input',()=>{state.layout[key]=Number(els[id].value);syncLayoutControls();changed()}));
    els.exportFormat.addEventListener('change',()=>{els.exportFile.textContent=`Baixar ${els.exportFormat.value.toUpperCase()}`});els.exportFile.addEventListener('click',exportCurrent);window.addEventListener('resize',fitStage);
  }

  function textFont(t,scale=1){return `${t.weight} ${Math.round(t.size*scale)}px "${t.family}"`}
  function measureSpaced(ctx,text,spacing){return ctx.measureText(text).width+Math.max(0,text.length-1)*spacing}
  function splitTextWithLetterSpacing(ctx,text,maxWidth,t,scale){const paragraphs=String(text||'').split('\n'),out=[];for(const para of paragraphs){if(!para){out.push('');continue}const words=para.split(/\s+/);let line='';for(const word of words){const test=line?`${line} ${word}`:word;if(measureSpaced(ctx,test,t.letterSpacing*scale)<=maxWidth||!line)line=test;else{out.push(line);line=word}}if(line)out.push(line)}return out}
  function drawSpacedText(ctx,text,x,y,t,scale){const spacing=t.letterSpacing*scale;if(!spacing){ctx.fillText(text,x,y);return}let px=x;for(const ch of text){ctx.fillText(ch,px,y);px+=ctx.measureText(ch).width+spacing}}
  function drawCenteredText(ctx,text,cx,y,t,S){ctx.font=textFont(t,S);ctx.fillStyle=t.color;ctx.textBaseline='top';drawSpacedText(ctx,text,cx-measureSpaced(ctx,text,t.letterSpacing*S)/2,y,t,S)}
  function drawTextBlock(ctx,text,x,y,maxWidth,t,S){ctx.font=textFont(t,S);ctx.fillStyle=t.color;ctx.textBaseline='top';const lines=splitTextWithLetterSpacing(ctx,text,maxWidth,t,S),linePx=t.size*t.lineHeight*S;lines.forEach((line,i)=>drawSpacedText(ctx,line,x,y+i*linePx,t,S));return lines.length*linePx}
  function roundedRect(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
  async function loadImage(src){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=src})}

  async function renderCanvas(scale){
    await document.fonts.ready;const c=document.createElement('canvas');c.width=DESIGN.width*scale;c.height=DESIGN.height*scale;const ctx=c.getContext('2d'),S=scale,bg=await loadImage('assets/images/prescription-background.png');ctx.drawImage(bg,0,0,c.width,c.height);
    const pt=state.typography.patient;ctx.textAlign='left';ctx.font=textFont(pt,S);ctx.fillStyle=pt.color;ctx.textBaseline='top';const patientLines=splitTextWithLetterSpacing(ctx,state.patientName,1880*S,pt,S),pLine=pt.size*pt.lineHeight*S;patientLines.forEach((line,i)=>drawSpacedText(ctx,line,1240*S-measureSpaced(ctx,line,pt.letterSpacing*S)/2,615*S+i*pLine,pt,S));
    let y=DESIGN.medsTop*S;
    for(const med of state.medicines){const px=state.layout.paddingX*S,py=state.layout.paddingY*S,inner=DESIGN.medsWidth*S-2*px,nt=state.typography.medicineName,ut=state.typography.medicineUsage;ctx.font=textFont(nt,S);const nlines=splitTextWithLetterSpacing(ctx,med.name,inner,nt,S),nh=nlines.length*nt.size*nt.lineHeight*S;ctx.font=textFont(ut,S);const ulines=splitTextWithLetterSpacing(ctx,med.usage,inner,ut,S),uh=ulines.length*ut.size*ut.lineHeight*S,h=2*py+nh+state.layout.nameUsageGap*S+uh;ctx.strokeStyle='#111';ctx.lineWidth=4*S;roundedRect(ctx,DESIGN.medsLeft*S,y,DESIGN.medsWidth*S,h,state.layout.radius*S);ctx.stroke();ctx.font=textFont(nt,S);ctx.fillStyle=nt.color;ctx.textBaseline='top';nlines.forEach((line,i)=>drawSpacedText(ctx,line,DESIGN.medsLeft*S+px,y+py+i*nt.size*nt.lineHeight*S,nt,S));ctx.font=textFont(ut,S);ctx.fillStyle=ut.color;const uy=y+py+nh+state.layout.nameUsageGap*S;ulines.forEach((line,i)=>drawSpacedText(ctx,line,DESIGN.medsLeft*S+px,uy+i*ut.size*ut.lineHeight*S,ut,S));y+=h+state.layout.gap*S}
    drawTextBlock(ctx,state.warning,DESIGN.warningLeft*S,y,DESIGN.warningWidth*S,state.typography.warning,S);
    const cx=(Number(state.stamp.x)||DESIGN.stampPositions.right)*S;drawCenteredText(ctx,formatDate(state.stamp.autoDate?todayISO():state.stamp.date),cx,DESIGN.stampY.date*S,state.typography.stampDate,S);drawCenteredText(ctx,state.stamp.professional,cx,DESIGN.stampY.name*S,state.typography.stampName,S);drawCenteredText(ctx,state.stamp.registration,cx,DESIGN.stampY.registration*S,state.typography.stampRegistration,S);
    return c;
  }

  function downloadBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
  async function canvasToBlob(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Falha ao gerar arquivo.')),type,quality))}
  function dataUrlBytes(dataUrl){const b64=dataUrl.split(',')[1],bin=atob(b64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return bytes}
  function concatBytes(parts){const len=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(len);let o=0;for(const p of parts){out.set(p,o);o+=p.length}return out}
  function makePdfFromJpeg(jpeg,w,h){
    const enc=s=>new TextEncoder().encode(s),chunks=[],offsets=[0];let pos=0;const push=b=>{chunks.push(b);pos+=b.length},obj=(n,parts)=>{offsets[n]=pos;push(enc(`${n} 0 obj\n`));for(const p of parts)push(typeof p==='string'?enc(p):p);push(enc('\nendobj\n'))};
    push(enc('%PDF-1.4\n'));
    obj(1,['<< /Type /Catalog /Pages 2 0 R >>']);obj(2,['<< /Type /Pages /Kids [3 0 R] /Count 1 >>']);
    obj(3,['<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.276 841.89] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>']);
    obj(4,[`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,jpeg,'\nendstream']);
    const stream='q\n595.276 0 0 841.89 0 0 cm\n/Im0 Do\nQ\n';obj(5,[`<< /Length ${stream.length} >>\nstream\n${stream}endstream`]);
    const xref=pos;push(enc('xref\n0 6\n0000000000 65535 f \n'));for(let i=1;i<=5;i++)push(enc(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`));push(enc(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));return new Blob([concatBytes(chunks)],{type:'application/pdf'});
  }
  async function exportCurrent(){
    const fmt=els.exportFormat.value,scale=Number(els.exportScale.value);els.exportFile.disabled=true;els.exportFile.textContent='Gerando…';
    try{const canvas=await renderCanvas(scale),base=`prescricao-${safeFilePart(patientLabel())}-${todayISO()}-${scale}x`;if(fmt==='png')downloadBlob(await canvasToBlob(canvas,'image/png',1),`${base}.png`);else if(fmt==='jpg')downloadBlob(await canvasToBlob(canvas,'image/jpeg',.96),`${base}.jpg`);else{const jpeg=dataUrlBytes(canvas.toDataURL('image/jpeg',.96));downloadBlob(makePdfFromJpeg(jpeg,canvas.width,canvas.height),`${base}.pdf`)}}catch(err){alert('Não foi possível gerar o arquivo. '+err.message)}finally{els.exportFile.disabled=false;els.exportFile.textContent=`Baixar ${fmt.toUpperCase()}`}
  }
  function flashProjectButton(button,label){
    if(!button)return;
    const original=button.dataset.defaultLabel||button.textContent;
    button.dataset.defaultLabel=original;button.textContent=label;button.classList.add('is-success');
    clearTimeout(button._feedbackTimer);button._feedbackTimer=setTimeout(()=>{button.textContent=button.dataset.defaultLabel;button.classList.remove('is-success')},1600);
  }
  function persistProjectRecord(record){
    const items=readProjects();
    const index=items.findIndex(item=>item.id===record.id);
    if(index>=0)items[index]=record;else items.unshift(record);
    writeProjects(items);
    const confirmed=findProject(record.id);
    if(!confirmed)throw new Error('O projeto não apareceu no catálogo após a gravação.');
    return confirmed;
  }
  function saveProject(){
    try{
      const now=new Date().toISOString();
      if(!currentProjectId)currentProjectId=newId();
      const record={id:currentProjectId,template:'prescricao',title:projectTitle(false),patientName:patientLabel(),savedAt:now,updatedAt:now,state:cloneState(state)};
      persistProjectRecord(record);
      storage.setItem(`${PROJECT_DRAFT_PREFIX}${currentProjectId}`,JSON.stringify({...state,version:4,savedAt:now}));
      history.replaceState({project:currentProjectId},'',`editor.html?project=${encodeURIComponent(currentProjectId)}`);
      setProjectFeedback(`Salvo como “${record.title}”.`);flashProjectButton(els.saveProject,'Salvo ✓');updateDocumentTitle();
      return currentProjectId;
    }catch(err){
      console.error('Falha ao salvar projeto',err);
      setProjectFeedback(err?.message||'Não foi possível salvar o projeto.');
      if(els.saveProject)flashProjectButton(els.saveProject,'Erro ao salvar');
      return null;
    }
  }
  function duplicateProject(){
    try{
      const sourceId=currentProjectId||saveProject();
      if(!sourceId)throw new Error('Salve o projeto original antes de criar a cópia.');
      const source=findProject(sourceId);
      const id=newId(),now=new Date().toISOString();
      const copyTitle=`Prescrição médica · ${patientLabel()} · Cópia`;
      const record={id,template:'prescricao',title:copyTitle,patientName:patientLabel(),savedAt:now,updatedAt:now,duplicatedFrom:sourceId,state:cloneState(state)};
      persistProjectRecord(record);
      storage.setItem(`${PROJECT_DRAFT_PREFIX}${id}`,JSON.stringify({...state,version:4,savedAt:now}));
      currentProjectId=id;
      history.replaceState({project:id},'',`editor.html?project=${encodeURIComponent(id)}`);
      setProjectFeedback(`Cópia criada. O original “${source?.title||projectTitle(false)}” foi preservado.`);
      flashProjectButton(els.duplicateProject,'Cópia criada ✓');updateDocumentTitle();
      return id;
    }catch(err){
      console.error('Falha ao duplicar projeto',err);
      setProjectFeedback(err?.message||'Não foi possível duplicar o projeto.');
      if(els.duplicateProject)flashProjectButton(els.duplicateProject,'Erro ao duplicar');
      return null;
    }
  }
  function tickDate(){if(state.stamp.autoDate){const now=todayISO();if(els.stampDate.value!==now){els.stampDate.value=now;state.stamp.date=now;persistState();renderPreview()}}}
  function init(){syncContentControls();renderMedicineEditors();syncStyleControls();syncLayoutControls();wire();renderPreview();fitStage();updateDocumentTitle();setInterval(tickDate,60000)}
  init();
})();

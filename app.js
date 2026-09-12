(() => {
  'use strict';
  const DESIGN = { width: 2480, height: 3508, medsLeft: 165, medsTop: 865, medsWidth: 2171, warningLeft: 224, warningWidth: 2030 };
  const defaultTypography = {
    patient: { family:'Cormorant Garamond', size:82, weight:500, letterSpacing:0, lineHeight:1.08, color:'#111111' },
    medicineName: { family:'Montserrat', size:64, weight:700, letterSpacing:0, lineHeight:1.12, color:'#111111' },
    medicineUsage: { family:'Montserrat', size:52, weight:400, letterSpacing:0, lineHeight:1.28, color:'#111111' },
    warning: { family:'Montserrat', size:48, weight:400, letterSpacing:0, lineHeight:1.35, color:'#111111' },
    stamp: { family:'Cormorant Garamond', size:45, weight:600, letterSpacing:0, lineHeight:1.05, color:'#111111' }
  };
  const todayISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };
  const initialState = () => ({
    patientName: 'Nome do paciente',
    medicines: [{ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name: 'Nome do medicamento', usage: 'Modo de uso' }],
    warning: 'avisos',
    stamp: { autoDate:true, date:todayISO(), professional:'Isadora Mitestainer Guirelli', registration:'CRF-SP 92908' },
    typography: JSON.parse(JSON.stringify(defaultTypography)),
    layout: { gap:72, paddingX:54, paddingY:44, radius:26, nameUsageGap:18 }
  });
  let state = initialState();
  let lastLayout = { medicineHeights:[], warningTop:2793 };

  const $ = (id) => document.getElementById(id);
  const els = {
    patientName:$('patientName'), medicineList:$('medicineList'), addMedicine:$('addMedicine'), warningText:$('warningText'),
    stampDate:$('stampDate'), autoDate:$('autoDate'), professionalName:$('professionalName'), registration:$('registration'),
    styleTarget:$('styleTarget'), fontFamily:$('fontFamily'), fontWeight:$('fontWeight'), fontSize:$('fontSize'), fontSizeValue:$('fontSizeValue'),
    letterSpacing:$('letterSpacing'), letterSpacingValue:$('letterSpacingValue'), lineHeight:$('lineHeight'), lineHeightValue:$('lineHeightValue'), textColor:$('textColor'),
    medicineGap:$('medicineGap'), medicineGapValue:$('medicineGapValue'), boxPaddingX:$('boxPaddingX'), boxPaddingXValue:$('boxPaddingXValue'),
    boxPaddingY:$('boxPaddingY'), boxPaddingYValue:$('boxPaddingYValue'), boxRadius:$('boxRadius'), boxRadiusValue:$('boxRadiusValue'),
    patientPreview:$('patientPreview'), medicinesPreview:$('medicinesPreview'), warningPreview:$('warningPreview'), stampPreview:$('stampPreview'),
    stampDatePreview:$('stampDatePreview'), professionalPreview:$('professionalPreview'), registrationPreview:$('registrationPreview'),
    stageViewport:$('stageViewport'), stageSizer:$('stageSizer'), artboard:$('artboard'), exportScale:$('exportScale'), exportPng:$('exportPng'), saveProject:$('saveProject'), loadProject:$('loadProject'),
    medicineEditorTemplate:$('medicineEditorTemplate')
  };

  function formatDate(iso){
    if(!iso) return '';
    const [y,m,d]=iso.split('-');
    return `${d}.${m}.${y}`;
  }
  function cssFont(t){return `'${t.family}', ${t.family==='Cormorant Garamond'?'serif':'sans-serif'}`}
  function applyTextStyle(el,t){
    el.style.fontFamily=cssFont(t); el.style.fontSize=`${t.size}px`; el.style.fontWeight=t.weight;
    el.style.letterSpacing=`${t.letterSpacing}px`; el.style.lineHeight=t.lineHeight; el.style.color=t.color;
  }
  function renderMedicineEditors(){
    els.medicineList.innerHTML='';
    state.medicines.forEach((med,index)=>{
      const node=els.medicineEditorTemplate.content.firstElementChild.cloneNode(true);
      node.dataset.id=med.id; node.querySelector('.medicine-number').textContent=`Medicamento ${index+1}`;
      const name=node.querySelector('.medicine-name-input'); const usage=node.querySelector('.medicine-usage-input');
      name.value=med.name; usage.value=med.usage;
      name.addEventListener('input',()=>{med.name=name.value; renderPreview()});
      usage.addEventListener('input',()=>{med.usage=usage.value; renderPreview()});
      node.querySelector('.duplicate-medicine').addEventListener('click',()=>{
        const clone={...med,id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random())};
        state.medicines.splice(index+1,0,clone); renderMedicineEditors(); renderPreview();
      });
      node.querySelector('.remove-medicine').addEventListener('click',()=>{
        state.medicines.splice(index,1); renderMedicineEditors(); renderPreview();
      });
      els.medicineList.appendChild(node);
    });
  }
  function renderPreview(){
    els.patientPreview.textContent=state.patientName; applyTextStyle(els.patientPreview,state.typography.patient);
    els.medicinesPreview.style.gap=`${state.layout.gap}px`;
    els.medicinesPreview.innerHTML='';
    state.medicines.forEach(med=>{
      const box=document.createElement('div'); box.className='medicine-preview-box';
      box.style.padding=`${state.layout.paddingY}px ${state.layout.paddingX}px`; box.style.borderRadius=`${state.layout.radius}px`;
      const name=document.createElement('p'); name.className='medicine-preview-name'; name.textContent=med.name; applyTextStyle(name,state.typography.medicineName);
      const usage=document.createElement('p'); usage.className='medicine-preview-usage'; usage.textContent=med.usage; applyTextStyle(usage,state.typography.medicineUsage);
      usage.style.marginTop=`${state.layout.nameUsageGap}px`; box.append(name,usage); els.medicinesPreview.appendChild(box);
    });
    requestAnimationFrame(()=>{
      const boxes=[...els.medicinesPreview.children];
      lastLayout.medicineHeights=boxes.map(b=>b.offsetHeight);
      let total=lastLayout.medicineHeights.reduce((a,b)=>a+b,0)+Math.max(0,boxes.length-1)*state.layout.gap;
      lastLayout.warningTop=DESIGN.medsTop+total+(boxes.length?state.layout.gap:0);
      els.warningPreview.style.top=`${lastLayout.warningTop}px`;
      els.warningPreview.textContent=state.warning; applyTextStyle(els.warningPreview,state.typography.warning);
      els.stampDatePreview.textContent=formatDate(state.stamp.autoDate?todayISO():state.stamp.date);
      els.professionalPreview.textContent=state.stamp.professional; els.registrationPreview.textContent=state.stamp.registration;
      applyTextStyle(els.stampPreview,state.typography.stamp);
      $('layoutStatus').textContent= lastLayout.warningTop > 2920 ? 'Atenção: conteúdo próximo ao carimbo' : 'Layout automático ativo';
    });
  }
  function syncContentControls(){
    els.patientName.value=state.patientName; els.warningText.value=state.warning; els.autoDate.checked=state.stamp.autoDate;
    els.stampDate.value=state.stamp.autoDate?todayISO():state.stamp.date; els.stampDate.disabled=state.stamp.autoDate;
    els.professionalName.value=state.stamp.professional; els.registration.value=state.stamp.registration;
  }
  function syncStyleControls(){
    const t=state.typography[els.styleTarget.value]; els.fontFamily.value=t.family; els.fontWeight.value=String(t.weight); els.fontSize.value=t.size;
    els.letterSpacing.value=t.letterSpacing; els.lineHeight.value=t.lineHeight; els.textColor.value=t.color;
    els.fontSizeValue.value=`${t.size}px`; els.letterSpacingValue.value=`${t.letterSpacing}px`; els.lineHeightValue.value=t.lineHeight.toFixed(2);
  }
  function syncLayoutControls(){
    els.medicineGap.value=state.layout.gap; els.boxPaddingX.value=state.layout.paddingX; els.boxPaddingY.value=state.layout.paddingY; els.boxRadius.value=state.layout.radius;
    els.medicineGapValue.value=`${state.layout.gap}px`; els.boxPaddingXValue.value=`${state.layout.paddingX}px`; els.boxPaddingYValue.value=`${state.layout.paddingY}px`; els.boxRadiusValue.value=`${state.layout.radius}px`;
  }
  function fitStage(){
    const maxW=Math.max(280,els.stageViewport.clientWidth-56); const maxH=Math.max(360,els.stageViewport.clientHeight-56);
    const scale=Math.min(maxW/DESIGN.width,maxH/DESIGN.height,1);
    els.artboard.style.transform=`scale(${scale})`; els.stageSizer.style.width=`${DESIGN.width*scale}px`; els.stageSizer.style.height=`${DESIGN.height*scale}px`;
  }
  function wire(){
    document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('is-active',t===tab));
      document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('is-active',p.dataset.panelContent===tab.dataset.panel));
    }));
    els.patientName.addEventListener('input',()=>{state.patientName=els.patientName.value;renderPreview()});
    els.warningText.addEventListener('input',()=>{state.warning=els.warningText.value;renderPreview()});
    els.addMedicine.addEventListener('click',()=>{state.medicines.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:'Novo medicamento',usage:'Modo de uso'});renderMedicineEditors();renderPreview()});
    els.autoDate.addEventListener('change',()=>{state.stamp.autoDate=els.autoDate.checked;els.stampDate.disabled=state.stamp.autoDate;if(state.stamp.autoDate)els.stampDate.value=todayISO();renderPreview()});
    els.stampDate.addEventListener('change',()=>{state.stamp.date=els.stampDate.value;renderPreview()});
    els.professionalName.addEventListener('input',()=>{state.stamp.professional=els.professionalName.value;renderPreview()});
    els.registration.addEventListener('input',()=>{state.stamp.registration=els.registration.value;renderPreview()});
    els.styleTarget.addEventListener('change',syncStyleControls);
    [['fontFamily','family'],['fontWeight','weight'],['fontSize','size'],['letterSpacing','letterSpacing'],['lineHeight','lineHeight'],['textColor','color']].forEach(([id,key])=>{
      els[id].addEventListener('input',()=>{let v=els[id].value;if(['weight','size','letterSpacing','lineHeight'].includes(key))v=Number(v);state.typography[els.styleTarget.value][key]=v;syncStyleControls();renderPreview()});
    });
    [['medicineGap','gap'],['boxPaddingX','paddingX'],['boxPaddingY','paddingY'],['boxRadius','radius']].forEach(([id,key])=>{
      els[id].addEventListener('input',()=>{state.layout[key]=Number(els[id].value);syncLayoutControls();renderPreview()});
    });
    window.addEventListener('resize',fitStage);
    els.exportPng.addEventListener('click',exportPNG); els.saveProject.addEventListener('click',saveProject);
    els.loadProject.addEventListener('change',loadProject);
  }

  function textFont(t,scale=1){return `${t.weight} ${Math.round(t.size*scale)}px "${t.family}"`}
  function splitTextWithLetterSpacing(ctx,text,maxWidth,t,scale){
    const paragraphs=String(text||'').split('\n'); const out=[];
    for(const para of paragraphs){
      if(!para){out.push('');continue}
      const words=para.split(/\s+/); let line='';
      for(const word of words){
        const test=line?`${line} ${word}`:word;
        if(measureSpaced(ctx,test,t.letterSpacing*scale)<=maxWidth||!line) line=test; else {out.push(line);line=word;}
      }
      if(line)out.push(line);
    } return out;
  }
  function measureSpaced(ctx,text,spacing){return ctx.measureText(text).width+Math.max(0,text.length-1)*spacing}
  function drawSpacedText(ctx,text,x,y,t,scale){
    const spacing=t.letterSpacing*scale; if(!spacing){ctx.fillText(text,x,y);return}
    let px=x; for(const ch of text){ctx.fillText(ch,px,y);px+=ctx.measureText(ch).width+spacing}
  }
  function drawTextBlock(ctx,text,x,y,maxWidth,t,scale){
    ctx.font=textFont(t,scale); ctx.fillStyle=t.color; ctx.textBaseline='top';
    const lines=splitTextWithLetterSpacing(ctx,text,maxWidth,t,scale); const linePx=t.size*t.lineHeight*scale;
    lines.forEach((line,i)=>drawSpacedText(ctx,line,x,y+i*linePx,t,scale));
    return lines.length*linePx;
  }
  function roundedRect(ctx,x,y,w,h,r){
    r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
  }
  async function loadImage(src){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=src})}
  async function exportPNG(){
    els.exportPng.disabled=true; els.exportPng.textContent='Gerando…';
    try{
      await document.fonts.ready; const exportScale=Number(els.exportScale.value); const c=document.createElement('canvas'); c.width=DESIGN.width*exportScale; c.height=DESIGN.height*exportScale;
      const ctx=c.getContext('2d'); const bg=await loadImage('assets/images/prescription-background.png'); ctx.drawImage(bg,0,0,c.width,c.height);
      const S=exportScale;
      const pt=state.typography.patient; ctx.textAlign='center'; ctx.font=textFont(pt,S);ctx.fillStyle=pt.color;ctx.textBaseline='top';
      const patientLines=splitTextWithLetterSpacing(ctx,state.patientName,1880*S,pt,S);const pLine=pt.size*pt.lineHeight*S;
      patientLines.forEach((line,i)=>drawSpacedText(ctx,line,1240*S-(measureSpaced(ctx,line,pt.letterSpacing*S)/2),615*S+i*pLine,pt,S));
      ctx.textAlign='left'; let y=DESIGN.medsTop*S;
      for(const med of state.medicines){
        const px=state.layout.paddingX*S, py=state.layout.paddingY*S, inner=DESIGN.medsWidth*S-2*px;
        const nt=state.typography.medicineName, ut=state.typography.medicineUsage;
        ctx.font=textFont(nt,S);const nlines=splitTextWithLetterSpacing(ctx,med.name,inner,nt,S);const nh=nlines.length*nt.size*nt.lineHeight*S;
        ctx.font=textFont(ut,S);const ulines=splitTextWithLetterSpacing(ctx,med.usage,inner,ut,S);const uh=ulines.length*ut.size*ut.lineHeight*S;
        const h=2*py+nh+state.layout.nameUsageGap*S+uh;
        ctx.strokeStyle='#111';ctx.lineWidth=4*S;roundedRect(ctx,DESIGN.medsLeft*S,y,DESIGN.medsWidth*S,h,state.layout.radius*S);ctx.stroke();
        ctx.font=textFont(nt,S);ctx.fillStyle=nt.color;ctx.textBaseline='top';nlines.forEach((line,i)=>drawSpacedText(ctx,line,(DESIGN.medsLeft*S)+px,y+py+i*nt.size*nt.lineHeight*S,nt,S));
        ctx.font=textFont(ut,S);ctx.fillStyle=ut.color;const uy=y+py+nh+state.layout.nameUsageGap*S;ulines.forEach((line,i)=>drawSpacedText(ctx,line,(DESIGN.medsLeft*S)+px,uy+i*ut.size*ut.lineHeight*S,ut,S));
        y+=h+state.layout.gap*S;
      }
      const wt=state.typography.warning; drawTextBlock(ctx,state.warning,DESIGN.warningLeft*S,y,DESIGN.warningWidth*S,wt,S);
      const st=state.typography.stamp;ctx.font=textFont(st,S);ctx.fillStyle=st.color;ctx.textAlign='center';ctx.textBaseline='top';const sx=2000*S;let sy=3000*S;
      [formatDate(state.stamp.autoDate?todayISO():state.stamp.date),state.stamp.professional,state.stamp.registration].forEach((line)=>{drawSpacedText(ctx,line,sx-measureSpaced(ctx,line,st.letterSpacing*S)/2,sy,st,S);sy+=st.size*st.lineHeight*S});
      const a=document.createElement('a');a.download=`prescricao-${todayISO()}-${exportScale}x.png`;a.href=c.toDataURL('image/png',1);a.click();
    }catch(err){alert('Não foi possível gerar o PNG. '+err.message)}finally{els.exportPng.disabled=false;els.exportPng.textContent='Baixar PNG'}
  }
  function saveProject(){
    const blob=new Blob([JSON.stringify({...state,version:1},null,2)],{type:'application/json'});const a=document.createElement('a');a.download=`prescricao-projeto-${todayISO()}.json`;a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
  }
  async function loadProject(e){
    const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());state={...initialState(),...data,typography:{...defaultTypography,...data.typography},layout:{...initialState().layout,...data.layout}};syncContentControls();syncStyleControls();syncLayoutControls();renderMedicineEditors();renderPreview()}catch{alert('Arquivo de projeto inválido.')}e.target.value=''
  }
  function tickDate(){if(state.stamp.autoDate){const now=todayISO();if(els.stampDate.value!==now){els.stampDate.value=now;renderPreview()}}}
  function init(){syncContentControls();renderMedicineEditors();syncStyleControls();syncLayoutControls();wire();renderPreview();fitStage();setInterval(tickDate,60000)}
  init();
})();

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PROJECTS_DIR = path.join(ROOT, 'projects');
const ARCHIVE_DIR = path.join(PROJECTS_DIR, 'archive');
const PREVIEWS_DIR = path.join(PROJECTS_DIR, 'previews');
const PORT = Number(process.env.PORT || 4173);
fs.mkdirSync(PROJECTS_DIR, { recursive: true });
fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
fs.mkdirSync(PREVIEWS_DIR, { recursive: true });

const MIME = {
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.otf':'font/otf','.pdf':'application/pdf'
};
const safeId = v => String(v || '').replace(/[^a-zA-Z0-9_-]/g, '');
const sendJson = (res, code, obj) => { const body = JSON.stringify(obj); res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store'}); res.end(body); };
const projectPath = (id, archived=false) => path.join(archived ? ARCHIVE_DIR : PROJECTS_DIR, `${safeId(id)}.json`);

function readProjectFile(file, dir = PROJECTS_DIR) {
  try { return JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); } catch { return null; }
}
function listDir(dir, archived=false) {
  return fs.readdirSync(dir, { withFileTypes:true })
    .filter(e => e.isFile() && e.name.endsWith('.json'))
    .map(e => readProjectFile(e.name, dir))
    .filter(Boolean)
    .map(p => archived ? {...p, archived:true} : p)
    .sort((a,b)=>new Date(b.updatedAt||b.savedAt||b.archivedAt||0)-new Date(a.updatedAt||a.savedAt||a.archivedAt||0));
}
function listProjects() {
  const items = listDir(PROJECTS_DIR, false);
  return [...new Map(items.map(item => [item.id, item])).values()];
}
function listArchived() {
  const activeIds = new Set(listProjects().map(item => item.id));
  const items = listDir(ARCHIVE_DIR, true).filter(item => !activeIds.has(item.id));
  return [...new Map(items.map(item => [item.id, item])).values()];
}
function writeProject(project) {
  const id = safeId(project?.id);
  if (!id) throw new Error('ID de projeto inválido.');
  const record = {...project, id};
  delete record.archived;
  delete record.archivedAt;
  if (record.previewData && /^data:image\/(jpeg|jpg|png);base64,/i.test(record.previewData)) {
    const match = record.previewData.match(/^data:image\/(jpeg|jpg|png);base64,(.+)$/i);
    const ext = /png/i.test(match[1]) ? 'png' : 'jpg';
    const previewFile = `${id}.${ext}`;
    for (const oldExt of ['jpg','png']) {
      const oldPreview = path.join(PREVIEWS_DIR, `${id}.${oldExt}`);
      if (fs.existsSync(oldPreview) && oldExt !== ext) fs.unlinkSync(oldPreview);
    }
    fs.writeFileSync(path.join(PREVIEWS_DIR, previewFile), Buffer.from(match[2], 'base64'));
    record.preview = `/api/project-previews/${previewFile}`;
  }
  delete record.previewData;
  const target = projectPath(id, false);
  const tmp = `${target}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(record, null, 2), 'utf8');
  fs.renameSync(tmp, target);
  const archivedTarget = projectPath(id, true);
  if (fs.existsSync(archivedTarget)) fs.unlinkSync(archivedTarget);
  return record;
}
function archiveProject(id) {
  id=safeId(id); if(!id) throw new Error('ID inválido.');
  const src=projectPath(id,false), dst=projectPath(id,true);
  if(!fs.existsSync(src)) throw new Error('Projeto não encontrado.');
  const record=readProjectFile(path.basename(src),PROJECTS_DIR)||{id};
  const archived={...record,id,archived:true,archivedAt:new Date().toISOString()};
  const tmp=`${dst}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify(archived,null,2),'utf8');
  fs.renameSync(tmp,dst);
  fs.unlinkSync(src);
  return archived;
}
function restoreProject(id) {
  id=safeId(id); if(!id) throw new Error('ID inválido.');
  const src=projectPath(id,true), dst=projectPath(id,false);
  if(!fs.existsSync(src)) throw new Error('Projeto arquivado não encontrado.');
  const record=readProjectFile(path.basename(src),ARCHIVE_DIR)||{id};
  const restored={...record,id,updatedAt:new Date().toISOString()};
  delete restored.archived; delete restored.archivedAt;
  const tmp=`${dst}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify(restored,null,2),'utf8');
  fs.renameSync(tmp,dst);
  fs.unlinkSync(src);
  return restored;
}
function deleteProject(id) {
  id=safeId(id); if(!id) throw new Error('ID inválido.');
  let deleted=false;
  for(const file of [projectPath(id,false),projectPath(id,true)]){
    if(fs.existsSync(file)){fs.unlinkSync(file);deleted=true;}
  }
  for(const ext of ['jpg','png']){
    const preview=path.join(PREVIEWS_DIR, `${id}.${ext}`);
    if(fs.existsSync(preview))fs.unlinkSync(preview);
  }
  if(!deleted) throw new Error('Projeto não encontrado.');
  return true;
}
function readBody(req) {
  return new Promise((resolve,reject)=>{ let data=''; req.on('data',c=>{data+=c;if(data.length>20*1024*1024){reject(new Error('Payload muito grande'));req.destroy();}}); req.on('end',()=>resolve(data)); req.on('error',reject); });
}
function serveStatic(req,res,urlPath) {
  let rel = decodeURIComponent(urlPath === '/' ? '/index.html' : urlPath);
  const target = path.resolve(ROOT, '.' + rel);
  if (!target.startsWith(ROOT) || target.startsWith(PROJECTS_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(target,(err,st)=>{
    if(err || !st.isFile()){res.writeHead(404);return res.end('Not found');}
    const ext=path.extname(target).toLowerCase();res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream','Cache-Control':ext==='.html'||ext==='.js'||ext==='.css'?'no-cache':'public, max-age=3600'});fs.createReadStream(target).pipe(res);
  });
}

const server=http.createServer(async(req,res)=>{
  const u=new URL(req.url,`http://${req.headers.host||'localhost'}`);
  const previewMatch=u.pathname.match(/^\/api\/project-previews\/([a-zA-Z0-9_-]+\.(?:jpg|png))$/i);
  if(previewMatch && req.method==='GET'){
    const target=path.join(PREVIEWS_DIR,path.basename(previewMatch[1]));
    if(!fs.existsSync(target)){res.writeHead(404);return res.end('Not found');}
    const ext=path.extname(target).toLowerCase();
    res.writeHead(200,{'Content-Type':MIME[ext]||'image/jpeg','Cache-Control':'no-store'});
    return fs.createReadStream(target).pipe(res);
  }
  if(u.pathname==='/api/projects' && req.method==='GET') return sendJson(res,200,{projects:listProjects(),archived:listArchived()});
  if(u.pathname==='/api/projects' && req.method==='POST') {
    try { const body=JSON.parse(await readBody(req)||'{}'); const rec=writeProject(body); return sendJson(res,200,{ok:true,project:rec}); }
    catch(e){return sendJson(res,400,{ok:false,error:e.message});}
  }
  const action=u.pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)\/(archive|restore)$/);
  if(action && req.method==='POST'){
    try{
      const rec=action[2]==='archive'?archiveProject(action[1]):restoreProject(action[1]);
      return sendJson(res,200,{ok:true,project:rec});
    }catch(e){return sendJson(res,404,{ok:false,error:e.message});}
  }
  const m=u.pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)$/);
  if(m && req.method==='GET') {
    const active=projectPath(m[1],false), archived=projectPath(m[1],true);
    const f=fs.existsSync(active)?active:archived;
    if(!fs.existsSync(f))return sendJson(res,404,{error:'Projeto não encontrado'});
    return sendJson(res,200,{project:readProjectFile(path.basename(f),path.dirname(f))});
  }
  if(m && req.method==='DELETE'){
    try{deleteProject(m[1]);return sendJson(res,200,{ok:true});}
    catch(e){return sendJson(res,404,{ok:false,error:e.message});}
  }
  return serveStatic(req,res,u.pathname);
});
server.listen(PORT,()=>console.log(`Editor: http://localhost:${PORT}\nProjetos físicos: ${PROJECTS_DIR}\nArquivados: ${ARCHIVE_DIR}`));

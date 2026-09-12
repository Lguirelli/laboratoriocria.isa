'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PROJECTS_DIR = path.join(ROOT, 'projects');
const PORT = Number(process.env.PORT || 4173);
fs.mkdirSync(PROJECTS_DIR, { recursive: true });

const MIME = {
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.otf':'font/otf','.pdf':'application/pdf'
};
const safeId = v => String(v || '').replace(/[^a-zA-Z0-9_-]/g, '');
const sendJson = (res, code, obj) => { const body = JSON.stringify(obj); res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store'}); res.end(body); };

function readProjectFile(file) {
  try { return JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf8')); } catch { return null; }
}
function listProjects() {
  return fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json')).map(readProjectFile).filter(Boolean)
    .sort((a,b)=>new Date(b.updatedAt||b.savedAt||0)-new Date(a.updatedAt||a.savedAt||0));
}
function writeProject(project) {
  const id = safeId(project?.id);
  if (!id) throw new Error('ID de projeto inválido.');
  const record = {...project, id};
  const target = path.join(PROJECTS_DIR, `${id}.json`);
  const tmp = `${target}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(record, null, 2), 'utf8');
  fs.renameSync(tmp, target);
  return record;
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
  if(u.pathname==='/api/projects' && req.method==='GET') return sendJson(res,200,{projects:listProjects()});
  if(u.pathname==='/api/projects' && req.method==='POST') {
    try { const body=JSON.parse(await readBody(req)||'{}'); const rec=writeProject(body); return sendJson(res,200,{ok:true,project:rec}); }
    catch(e){return sendJson(res,400,{ok:false,error:e.message});}
  }
  const m=u.pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)$/);
  if(m && req.method==='GET') {
    const f=path.join(PROJECTS_DIR,`${safeId(m[1])}.json`); if(!fs.existsSync(f))return sendJson(res,404,{error:'Projeto não encontrado'}); return sendJson(res,200,{project:readProjectFile(path.basename(f))});
  }
  return serveStatic(req,res,u.pathname);
});
server.listen(PORT,()=>console.log(`Editor: http://localhost:${PORT}\nProjetos físicos: ${PROJECTS_DIR}`));

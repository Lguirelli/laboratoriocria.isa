'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const templates = read('templates.js');
const ids = [...templates.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
assert(ids.length === 3, `Esperados 3 modelos-base; encontrados ${ids.length}.`);
assert(new Set(ids).size === 3, 'IDs duplicados em templates.js.');

const gallery = read('gallery.js');
assert(gallery.includes('let renderGeneration = 0'), 'gallery.js sem proteção contra corrida de renderização.');
assert(!gallery.includes("addEventListener('storage'"), 'gallery.js ainda reage ao catálogo local antigo.');
assert(!gallery.includes('getProjects'), 'gallery.js ainda lê projetos do armazenamento do navegador.');

const css = read('gallery.css');
assert(/\[hidden\]\s*\{\s*display\s*:\s*none\s*!important/i.test(css), 'Regra global [hidden] ausente.');

const storage = read('storage.js');
assert(!storage.includes('window.name'), 'storage.js ainda usa window.name.');
assert(!storage.includes('prescricao-editor:projects:v1'), 'storage.js ainda migra catálogo legado.');
assert(!storage.includes('getProjects'), 'storage.js ainda expõe catálogo de projetos.');

for (const file of ['app.js', 'modelo-app.js', 'modelo2-app.js']) {
  const src = read(file);
  assert(src.includes('ProjectService'), `${file} não usa ProjectService.`);
  assert(!src.includes('getProjects'), `${file} ainda mantém catálogo local de projetos.`);
  assert(!src.includes('setProjects'), `${file} ainda replica catálogo local de projetos.`);
  assert(!src.includes('prescricao-editor:projects:v1'), `${file} ainda usa chave legada de catálogo.`);
}

for (const file of ['editor.html','modelo-editor.html','modelo2-editor.html']) {
  const html = read(file);
  assert(html.includes('project-service.js'), `${file} não carrega project-service.js.`);
}

if (failures.length) {
  console.error('VALIDAÇÃO FALHOU');
  failures.forEach(item => console.error(' - ' + item));
  process.exit(1);
}
console.log('Validação estrutural concluída: OK');

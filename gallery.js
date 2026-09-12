(() => {
  const grid = document.getElementById('templateGrid');
  const tpl = document.getElementById('templateCard');
  const items = Array.isArray(window.EDITABLE_TEMPLATES) ? window.EDITABLE_TEMPLATES : [];

  if (!items.length) {
    grid.innerHTML = '<p class="empty-state">Nenhum arquivo editável disponível.</p>';
    return;
  }

  items.forEach((item) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.href = item.editor;
    node.dataset.templateId = item.id;
    node.querySelector('.template-preview').src = item.preview;
    node.querySelector('.template-preview').alt = `Visual do arquivo ${item.title}`;
    node.querySelector('.template-title').textContent = item.title;
    node.querySelector('.template-date').textContent = item.date;
    grid.appendChild(node);
  });
})();

# Auditoria UX/UI — versão global

Esta versão aplica as regras de `docs/UX_UI_RULES.md` sem alterar a lógica visual dos PSDs.

## CRITICAL / HIGH corrigidos

- Modais de nome de projeto migrados para `dialog` nativo, com retorno de foco e Escape.
- Exclusão permanente exige digitar o nome exato do projeto.
- Arquivar é reversível via ação **Desfazer** no feedback.
- Foco visível e navegação por teclado foram padronizados.
- Tabs receberam semântica `tablist/tab/tabpanel`, setas, Home e End.
- Targets de interação principais têm mínimo aproximado de 44 px.
- `prefers-reduced-motion` é respeitado globalmente.

## MEDIUM corrigidos

- Hierarquia das ações do editor: **Salvar projeto** é primária; Duplicar e exportar são secundárias.
- Feedbacks de projeto ganharam estados visuais de sucesso e erro.
- Ações do index têm hierarquia mais clara e targets maiores.
- Cards reduziram movimento de hover e removem deslocamento em dispositivos sem hover.
- Controles e navegação receberam comportamento responsivo mais resiliente.
- Foram adicionados links de salto para o conteúdo principal.

## Preservado deliberadamente

- Geometria, composição e assets dos PSDs.
- Regras funcionais dos três modelos.
- Persistência em `projects/` quando o servidor Node está disponível e fallback local em host estático.
- Paletas e limitações próprias dos modelos.

## Aceitação

Executar:

```bash
npm test
npm start
```

Validar também manualmente:

- Tab / Shift+Tab;
- setas entre tabs;
- Escape nos diálogos;
- touch e viewport estreito;
- `prefers-reduced-motion`;
- salvar, duplicar, arquivar, desfazer arquivamento, restaurar e excluir.

# Laboratório Cria ISA — Editor de modelos

Editor visual com três modelos-base e projetos persistidos fisicamente no repositório.

## Executar

Requer Node.js 18 ou superior.

```bash
npm start
```

Abra `http://localhost:4173`.

## Arquitetura de persistência

Existe uma única fonte de verdade para **projetos salvos**:

```text
projects/*.json
projects/previews/*.{jpg,png}
projects/archive/*.json
```

O navegador usa `IndexedDB` (com `localStorage` apenas como fallback) **somente para rascunhos automáticos**. O catálogo do index nunca é reconstruído a partir do armazenamento local.

Isso evita projetos duplicados, projetos antigos reaparecendo e divergência entre o que existe no repositório e o que aparece no index.

## Index

O catálogo contém exatamente três modelos-base definidos em `templates.js`:

- Prescrição médica
- Modelo 1
- Modelo 2

Projetos salvos aparecem separadamente em **Projetos**. Projetos arquivados aparecem em **Arquivados**.

O snapshot do projeto salvo é gravado em `projects/previews/` e usado como imagem do card.

## Fluxo de projeto

- **Salvar projeto**: pede um nome, grava/atualiza `projects/<id>.json` e o snapshot.
- **Duplicar**: pede um nome e cria um novo ID, preservando o original.
- **Arquivar**: move o JSON para `projects/archive/`.
- **Restaurar**: devolve o JSON para `projects/`.
- **Excluir**: remove o JSON e o snapshot.
- Autosave local serve apenas como rascunho de segurança.

## Arquivos compartilhados

- `project-service.js`: única camada de acesso à API de projetos.
- `storage.js`: armazenamento exclusivo de rascunhos.
- `project-dialog.js`: modal compartilhado para nomear projetos.
- `gallery.js`: renderização do catálogo com proteção contra renderizações concorrentes.
- `server.js`: API e persistência física em disco.

## Validação

```bash
npm test
```

A validação verifica, entre outros pontos:

- exatamente três modelos-base;
- ausência de catálogo de projetos em armazenamento local;
- ausência de `window.name` e migração de catálogo legado;
- proteção contra corrida de renderização no index;
- regra `[hidden]` efetiva;
- uso da camada compartilhada `ProjectService` pelos três editores.

Mais detalhes em `docs/STABILIZATION_REPORT.md`.


## Ajustes v10

- A edição rica pode ser feita selecionando texto diretamente no canvas do modelo ou no campo lateral.
- Modelo 1 e Modelo 2 aceitam até 3 boxes, com largura fixa e compactação vertical leve somente quando necessária.
- Os blocos de texto abaixo dos boxes usam fluxo vertical com espaçamentos constantes.
- `npm start` continua salvando fisicamente em `projects/`. Em hospedagem estática que bloqueie POST (`405`), o editor usa armazenamento persistente do navegador como fallback para não perder a função Salvar/Duplicar.

## Sistema global de UX/UI

A especificação de interface do projeto está em `docs/UX_UI_RULES.md` e deve ser usada como checklist nas próximas alterações. A aplicação desta rodada está documentada em `docs/UX_AUDIT.md`.

A hierarquia de ações dos editores agora prioriza **Salvar projeto**. Arquivamento possui recuperação rápida por **Desfazer**, enquanto exclusão permanente exige confirmação pelo nome do projeto. Tabs, foco, teclado, touch targets e reduced motion receberam tratamento global compartilhado em `ux-base.css` e `ux-common.js`.

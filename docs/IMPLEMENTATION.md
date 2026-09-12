# Implementação atual

## Fontes de dados

### Projetos salvos

A fonte oficial é o filesystem controlado por `server.js`:

- ativos: `projects/*.json`;
- snapshots: `projects/previews/`;
- arquivados: `projects/archive/*.json`.

O index consulta apenas `GET /api/projects`.

### Rascunhos

`storage.js` guarda somente rascunhos dos editores em IndexedDB, com fallback para localStorage. Rascunhos não entram no catálogo e não são tratados como projetos salvos.

## Catálogo

`templates.js` contém exatamente três modelos-base. `gallery.js` deduplica por ID e usa um token de geração para descartar respostas assíncronas antigas, impedindo que duas renderizações concorrentes acrescentem os mesmos cards duas vezes.

O atributo HTML `hidden` é protegido por `[hidden]{display:none!important}`, portanto controles de projeto não aparecem em modelos-base e Arquivar/Restaurar não aparecem simultaneamente.

## Serviços compartilhados

`project-service.js` concentra listagem, leitura, salvamento, arquivamento, restauração e exclusão. Os três editores usam essa camada, evitando implementações diferentes para o mesmo fluxo.

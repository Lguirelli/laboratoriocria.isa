# Relatório de estabilização

## Problemas corrigidos

1. **Modelos duplicados visualmente no index**
   - causa: duas chamadas assíncronas de `renderGallery()` podiam concluir em sequência e acrescentar os mesmos cards;
   - correção: token `renderGeneration`; respostas antigas são descartadas e o DOM só é substituído pela renderização mais recente.

2. **Controles Arquivar/Restaurar/Excluir aparecendo nos modelos-base**
   - causa: CSS com `display:flex`/`inline-flex` sobre elementos com atributo `hidden`;
   - correção: regra global `[hidden]{display:none!important}`.

3. **Duas fontes de verdade para projetos**
   - removido o fallback de catálogo por IndexedDB/localStorage;
   - `projects/*.json` passou a ser a única fonte oficial do index.

4. **Prescrição com sistema próprio de catálogo em localStorage**
   - removidas as chaves e funções de lista local de projetos;
   - Prescrição usa `ProjectService`, como os Modelos 1 e 2.

5. **Estado replicado em vários catálogos**
   - o navegador mantém apenas rascunhos;
   - salvar/duplicar grava somente pela API no repositório.

6. **Migração automática de catálogo legado**
   - removida para impedir que projetos antigos reapareçam.

7. **Uso de `window.name` como armazenamento**
   - removido.

8. **Lógica de API duplicada entre editores**
   - criada `project-service.js` e adotada nos três editores.

9. **Risco de cards duplicados por dados repetidos**
   - templates e projetos são deduplicados por ID antes da renderização.

10. **Documentação conflitante**
   - README e documentação de implementação foram reescritos para refletir a arquitetura atual.

## Responsabilidades finais

```text
templates.js       -> somente os 3 modelos-base
project-service.js -> operações com projetos físicos
server.js          -> filesystem/API
storage.js         -> somente rascunhos
project-dialog.js  -> nomeação ao salvar/duplicar
gallery.js         -> visualização do catálogo
```

## Regra de operação

Use `npm start`. Abrir os HTMLs diretamente por `file://` permite visualizar partes estáticas, mas não oferece a API necessária para projetos físicos.

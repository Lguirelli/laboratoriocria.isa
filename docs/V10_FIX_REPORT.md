# V10 Fix Report

## Corrigido

- Rich text: seleção feita diretamente no canvas do modelo agora é o alvo real para cor, peso e tamanho.
- Campos laterais e canvas compartilham a mesma identidade de conteúdo, evitando aplicar estilo apenas no menu.
- Modelo 1 e Modelo 2: até 3 boxes.
- Largura dos boxes permanece fixa; somente densidade vertical e elementos internos reduzem quando falta espaço.
- A redução é limitada para preservar legibilidade; novo box é bloqueado quando não há área segura.
- Modelo 1: blocos `Principais benefícios`, body copy e informação adicional passam a seguir fluxo vertical com gaps constantes desde o último box.
- Modelo 2: CTA fica a distância constante do último box e a lista final fica a distância constante do CTA.
- Salvamento: servidor Node continua persistindo fisicamente em `projects/`.
- Hospedagem estática: respostas 405/501 ou ausência de API ativam fallback persistente no navegador em vez de interromper Salvar/Duplicar.
- Index passa a ler também os snapshots em fallback local.
- API ganhou `/api/health` e tratamento OPTIONS.

## Validação

- `node --check` nos scripts alterados.
- `npm test` concluído com sucesso.
- POST real em `/api/projects` validado, com criação física de JSON em `projects/` e remoção posterior.

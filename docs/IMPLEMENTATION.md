# Implementação

## Documento base

- Tamanho lógico: `2480 × 3508 px`.
- Fundo: camada fixa em `assets/images/prescription-background.png`.
- Conteúdo: renderizado em HTML no preview e novamente em Canvas durante a exportação.

## Coordenadas principais

- Paciente: região superior central.
- Lista de medicamentos: `x=165`, `y=865`, largura `2171`.
- Aviso: `x=224`, largura `2030`, posição Y calculada pelo fluxo.
- Carimbo: região inferior direita.

## Box de medicamento

A altura não é fixa. É calculada pela soma de:

```text
padding superior
+ altura real do nome do medicamento
+ distância interna
+ altura real do modo de uso
+ padding inferior
```

O box seguinte começa após `altura do box atual + gap`.

O aviso começa após `altura total da lista + gap`, portanto mantém a mesma distância física aplicada entre medicamentos.

## Data

Quando `autoDate=true`, a data é obtida de `new Date()` e revalidada a cada minuto. O formato visual é `DD.MM.AAAA`.

## Exportação

A exportação não captura a tela. Ela reconstrói o documento num `<canvas>` com as dimensões finais. Isso evita perda de resolução causada pelo zoom do preview.

Escalas disponíveis:

- 1×: `2480 × 3508`.
- 2×: `4960 × 7016`.

## Persistência

`Salvar projeto` gera um JSON contendo conteúdo, tipografia, layout e carimbo. `Abrir projeto` restaura o estado no navegador.

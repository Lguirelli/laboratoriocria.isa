# Implementação v2

## Referência

O layout foi atualizado com base em `PRESCRIÇÃO(3).psd` enviado na conversa atual.

## Carimbo

O PSD contém três instâncias equivalentes do carimbo. Seus centros horizontais foram mapeados aproximadamente em:

- esquerda: `x = 442 px`;
- centro: `x = 1230 px`;
- direita: `x = 2018 px`.

As linhas usam Y independentes, preservando a separação da composição:

- data: `y = 2842 px`;
- nome profissional: `y = 2885 px`;
- registro: `y = 2941 px`.

Cada linha possui tipografia independente no estado do editor.

## Persistência

O estado completo é salvo automaticamente em `localStorage` usando a chave `prescricao-editor:v2`.

## Exportação

O mesmo renderer de canvas é usado para PNG, JPG e PDF. O PDF é criado localmente como A4 e incorpora a renderização raster na resolução escolhida.

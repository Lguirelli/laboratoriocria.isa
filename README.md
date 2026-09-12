# Editor de Prescrição

Editor web com servidor Node leve para persistir projetos como arquivos físicos dentro do repositório.

## Recursos

- Fundo bloqueado extraído do PSD em A4, 2480 × 3508 px, 300 DPI.
- Nome do paciente, medicamentos, aviso e carimbo editáveis.
- Boxes de medicamentos com altura dinâmica e padding constante.
- Adição, duplicação e exclusão de medicamentos.
- O aviso mantém o mesmo gap utilizado entre os medicamentos.
- Carimbo com data automática do dia.
- Três posições oficiais de carimbo extraídas do PSD: esquerda, centro e direita.
- Data, nome profissional e registro possuem estilos tipográficos independentes.
- Controles de fonte, peso, tamanho, tracking, entrelinha e cor.
- Persistência automática em `localStorage`: recarregar ou voltar ao editor preserva a edição no mesmo navegador.
- Exportação em PDF, PNG e JPG.
- Exportação A4 300 DPI ou alta resolução 2×.
- Backup manual opcional em JSON.
- Sem botão de abertura/importação de projeto.
- Sem build obrigatório: HTML, CSS e JavaScript puro.

## Hospedagem

Para que **Salvar projeto** e **Duplicar** criem arquivos dentro de `projects/`, execute com Node (`npm start`) ou hospede em um ambiente Node com disco persistente. GitHub Pages pode servir apenas a interface estática e não possui permissão para gravar novos arquivos no repositório.

## Persistência

A edição é salva automaticamente no armazenamento local do navegador. Isso significa que os textos e configurações permanecem após recarregar ou fechar a página, desde que o armazenamento do site não seja apagado e o editor seja aberto no mesmo navegador/origem.

## PDF

O PDF é gerado localmente no navegador em tamanho A4. O conteúdo é renderizado na resolução selecionada e incorporado ao PDF sem envio para servidor.


## Ajuste v3 do carimbo

- Data ampliada para 48 px por padrão, mantendo proporção visual mais próxima do nome profissional (52 px).
- A posição horizontal do carimbo agora usa slider contínuo entre X=442 e X=2018.
- Há snap suave ao centro em X=1230 dentro de uma pequena zona de 32 px.
- A posição escolhida permanece persistida automaticamente no navegador.

## Biblioteca de arquivos

O `index.html` agora é a página inicial do repositório e exibe os arquivos disponíveis para edição em cards visuais. Cada card usa um preview do documento como fundo e mostra título e data no box inferior.

O editor de prescrição fica em `editor.html?template=prescricao`. Novos arquivos podem ser adicionados ao catálogo em `templates.js`, informando `id`, `title`, `date`, `preview` e `editor`.

Arquivos da biblioteca:

- `index.html` — galeria de arquivos editáveis;
- `gallery.css` — visual da galeria;
- `gallery.js` — renderização dos cards;
- `templates.js` — catálogo de templates;
- `editor.html` — editor da prescrição;
- `app.js` — lógica do editor.


## Projetos salvos

- O editor mantém um rascunho automático no `localStorage`, inclusive após recarregar ou fechar a página.
- **Salvar projeto** registra uma versão no catálogo da página inicial.
- O título do projeto salvo inclui o nome do paciente, por exemplo `Prescrição médica · Maria Silva`.
- **Duplicar** cria um novo projeto independente e preserva o projeto original.
- Os arquivos exportados também incluem o nome do paciente no nome do arquivo.
- O botão de backup JSON não faz mais parte da interface.
- O botão **Adicionar medicamento** fica sempre após o último medicamento da fila.

## Correção de persistência de projetos

- **Salvar projeto** agora grava e confirma a leitura do registro antes de exibir sucesso.
- **Duplicar** garante um original salvo, cria um novo ID independente e registra a origem da cópia.
- O catálogo é renderizado novamente no evento `pageshow`, inclusive ao voltar pelo cache do navegador.
- Os botões exibem feedback visual de sucesso ou erro.
- Para persistência confiável, publique via GitHub Pages ou execute por servidor HTTP local; não dependa de abrir `editor.html` diretamente por `file://`.

## Segundo modelo: `modelo 1 isa`

O repositório agora inclui `modelo-editor.html`, construído a partir do PSD enviado na conversa atual.

Regras implementadas no segundo modelo:

- o nome do arquivo é usado como título do card salvo no `index`;
- `Salvar projeto` cria/atualiza um projeto persistente no catálogo;
- `Duplicar` cria novo ID e mantém o original intacto;
- autosave local continua ativo durante a edição;
- o espaço entre subtítulo e box 1 permanece constante mesmo quando o subtítulo aumenta;
- box 1 cresce conforme o conteúdo e mantém padding interno constante;
- ícone do box é SVG real, selecionado por busca no catálogo de Material/Google Fonts icons incluído no editor;
- ícone e textos do box usam alinhamento horizontal estável (`flex`, `align-items:center`) e gap controlado;
- a cor do box ativa uma paleta automática de contraste: a versão escura segue a lógica visual observada no box 2 do PSD, sem renderizar o box 2;
- body copy alterna entre parágrafo e lista; em modo lista cada linha recebe um check;
- rodapé mantém o mesmo gap entre todos os ícones e seus textos;
- exportação disponível em PDF, PNG e JPG.

### Arquivos do segundo modelo

- `modelo-editor.html`
- `modelo-app.js`
- `modelo-styles.css`
- `assets/images/modelo1-preview.jpg`
- `assets/images/modelo1-main-image.png`
- `assets/images/modelo1-logo.png`

## Modelo 1 — fidelidade ao PSD

A implementação do `modelo-editor.html` foi recalibrada usando `modelo 1 isa(2).psd` como referência final (1080 × 1920 px).

- O arquivo aparece como **Modelo 1** no catálogo.
- O Box 2 do PSD não é renderizado; ele é somente referência da paleta escura.
- Novos boxes podem ser adicionados pelo editor e respeitam o mesmo padding e espaçamento.
- Fundos de boxes usam apenas paletas predefinidas do PSD.
- Cores de texto são limitadas à paleta original.
- Título possui tamanho máximo editável e ajuste automático para caber na largura original.
- A imagem ilustrativa aceita upload e reposicionamento por arraste, preservando a máscara e a posição do recorte.
- Rodapé, logotipo e demais camadas não mencionadas permanecem fixos e usam os assets extraídos do PSD, inclusive os ícones originais.

## Atualização de tipografia e edição parcial

- Títulos editáveis usam a família Cormorant Garamond fornecida com o projeto.
- Textos corridos, subtítulos e body copy dos blocos usam Montserrat.
- Campos de texto são rich text: selecione um trecho e aplique cor, peso ou tamanho somente à seleção.
- As cores permanecem restritas à paleta do PSD.
- A exportação do Modelo 1 é sempre limitada ao canvas original de 1080 × 1920 px, inclusive PDF/PNG/JPG.
- O armazenamento compartilhado usa `storage.js`; em HTTP/GitHub Pages persiste via localStorage e também replica o estado em `window.name` para navegação na mesma aba.


## Modelo 1 — atualização PSD isa(3)

- Informação adicional editável com o ícone original alinhado à primeira linha.
- Título separado em dois campos: título e trecho em destaque.
- Ícones dos boxes são enviados pelo usuário em SVG ou PNG; SVG é colorizado pela paleta do box e PNG funciona como máscara cromática.
- Ícones do rodapé são os assets extraídos do PSD mais recente.
- Salvamento do Modelo 1 aguarda IndexedDB e grava também em fallback local.
- Exportação permanece limitada a 1080 × 1920 px, o tamanho original do PSD.

## Projetos físicos dentro do repositório

A partir desta versão, os botões **Salvar projeto** e **Duplicar** gravam arquivos `.json` reais em `projects/`.

Estrutura:

```text
projects/
├── README.md
├── <id-projeto>.json
└── <id-copia>.json
```

O `index.html` consulta `GET /api/projects` e cria automaticamente um card para cada arquivo salvo nessa pasta. Ao abrir um card, o editor carrega o estado diretamente do JSON correspondente.

### Executar

Requer Node.js 18 ou superior:

```bash
npm start
```

Depois abra:

```text
http://localhost:4173
```

O autosave no navegador continua existindo como rascunho de segurança, mas **Salvar projeto** e **Duplicar** passam a persistir fisicamente em `projects/`.

### GitHub

O navegador não pode alterar arquivos do repositório remoto via GitHub Pages. Os JSONs criados em `projects/` fazem parte da cópia local do repositório. Para enviá-los ao GitHub, faça `git add`, `git commit` e `git push` normalmente. Em hospedagem com Node e disco persistente, o mesmo servidor pode manter esses arquivos no diretório do projeto.

## Arquivar e excluir projetos

O index permite gerenciar projetos salvos:

- **Arquivar** move fisicamente o JSON de `projects/` para `projects/archive/` e o remove da lista principal.
- **Restaurar** devolve o JSON arquivado para `projects/`.
- **Excluir** remove definitivamente o JSON, esteja ele ativo ou arquivado.
- Os modelos-base não podem ser arquivados nem excluídos pelo index.

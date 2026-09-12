# Editor de Prescrição

Editor web estático baseado no template `PRESCRIÇÃO(3).psd`, pronto para GitHub Pages.

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

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todo o conteúdo desta pasta para a raiz do repositório.
3. Em **Settings → Pages**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/ (root)`.
5. Salve e aguarde a publicação.

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

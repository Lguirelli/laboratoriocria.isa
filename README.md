# Editor Online de Prescrição

Editor web estático criado a partir do PSD de prescrição fornecido no projeto. O **fundo é a única camada bloqueada**; paciente, medicamentos, aviso e carimbo são reconstruídos como elementos dinâmicos.

## Recursos

- nome do paciente editável;
- medicamentos em lista dinâmica;
- adicionar, duplicar e excluir medicamentos;
- cada box cresce conforme nome e modo de uso;
- padding constante em relação ao conteúdo;
- distância uniforme entre boxes;
- aviso sempre posicionado à mesma distância do último medicamento;
- data do carimbo atualizada automaticamente pelo calendário do dispositivo;
- opção de data manual;
- nome profissional e registro editáveis;
- tipografia configurável por tipo de elemento: família, peso, tamanho, tracking, entrelinha e cor;
- fundo bloqueado e preservado;
- exportação PNG na resolução original `2480 × 3508`;
- exportação PNG em `2×`, `4960 × 7016`;
- salvar e reabrir projeto em JSON;
- sem framework e sem etapa de build.

## Como executar

Por segurança dos navegadores, abra por um servidor HTTP local em vez de clicar diretamente em `index.html`.

```bash
python -m http.server 8080
```

Acesse:

```text
http://localhost:8080
```

Também funciona com qualquer servidor estático, GitHub Pages, Netlify, Vercel ou Cloudflare Pages.

## GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste diretório para a branch principal.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch principal e a pasta `/ (root)`.

Não há dependências Node nem segredos.

## Estrutura

```text
.
├── index.html
├── styles.css
├── app.js
├── assets/
│   ├── images/
│   │   └── prescription-background.png
│   └── fonts/
│       └── cormorant/
├── docs/
│   └── IMPLEMENTATION.md
└── README.md
```

## Fonte do fundo

O PNG em `assets/images/prescription-background.png` corresponde apenas à camada visual de fundo do PSD. Os elementos editáveis não foram rasterizados sobre ele.

## Tipografia

Cormorant Garamond é incluída localmente com licença OFL. Montserrat é carregada pelo Google Fonts e tem fallbacks locais. Se o editor for usado sem internet, os textos Montserrat cairão para Arial até que uma versão local da fonte seja adicionada.

## Observação de layout

O aviso pertence ao mesmo fluxo vertical dos medicamentos. Assim, ao adicionar, remover ou expandir um medicamento, a posição do aviso é recalculada automaticamente.

O carimbo permanece na região inferior direita definida pelo template. Quando o conteúdo de medicamentos se aproxima dessa área, a interface exibe um alerta visual de espaço.

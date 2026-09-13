# COMANDO GLOBAL DE UX/UI

## SISTEMA DE REGRAS DE INTERFACE, INTERAÇÃO, ACESSIBILIDADE E EXPERIÊNCIA

Este documento deve ser tratado como um **sistema permanente de regras de UX/UI**.

As regras abaixo devem orientar toda decisão de:

- arquitetura de interface;
- layout;
- hierarquia;
- navegação;
- responsividade;
- componentes;
- controles;
- formulários;
- conteúdo;
- tipografia;
- cores;
- materiais;
- ícones;
- imagens;
- estados;
- feedback;
- loading;
- animações;
- transições;
- acessibilidade;
- permissões;
- privacidade;
- onboarding;
- busca;
- modais;
- menus;
- toolbars;
- tabs;
- sidebars;
- empty states;
- erros;
- confirmações;
- interações por touch;
- mouse;
- teclado;
- pointer;
- tecnologias assistivas;
- comportamento entre diferentes dispositivos e tamanhos de tela.

Estas regras devem ser aplicadas **contextualmente e de forma sistêmica**, e não de maneira mecânica.

Quando houver conflito entre uma solução visualmente atraente e uma solução mais clara, previsível, acessível ou funcional, priorize a segunda.

---

# 1. PRINCÍPIO CENTRAL

Toda interface deve ser construída segundo esta ordem de prioridade:

**propósito → conteúdo → tarefa → hierarquia → interação → feedback → acabamento → decoração**

Nunca inverter essa ordem.

Antes de criar, alterar ou sofisticar qualquer elemento, determinar:

1. qual problema ele resolve;
2. qual tarefa ele facilita;
3. qual informação ele comunica;
4. qual prioridade possui;
5. se sua presença é realmente necessária.

Se um elemento não contribuir de maneira significativa para a tarefa, compreensão ou experiência, removê-lo ou reduzir sua importância.

---

# 2. PROPÓSITO ANTES DE FEATURE

Não construir interfaces com base na quantidade de funcionalidades disponíveis.

Construir a interface com base no que a pessoa precisa realizar.

A funcionalidade deve servir à experiência, e não o contrário.

Sempre:

- identificar a ação principal;
- identificar informações essenciais;
- identificar ações secundárias;
- eliminar distrações;
- reduzir escolhas simultâneas;
- organizar funcionalidades em níveis de prioridade.

Não apresentar toda a capacidade do sistema em uma única tela apenas porque ela existe.

---

# 3. AUTONOMIA DO USUÁRIO

O usuário deve sentir que está controlando a experiência.

Evitar:

- fluxos sem saída clara;
- decisões tomadas silenciosamente pelo sistema;
- navegação que prende a pessoa;
- modais desnecessariamente obrigatórios;
- etapas artificiais;
- bloqueios sem justificativa;
- ações irreversíveis sem necessidade.

Sempre que tecnicamente possível:

- permitir voltar;
- cancelar;
- editar;
- desfazer;
- recuperar;
- tentar novamente.

Priorizar recuperação de erros em vez de prevenção excessivamente restritiva.

---

# 4. SIMPLICIDADE

Simplicidade não significa ausência de funcionalidades.

Significa apresentar apenas o que é necessário em cada momento.

Aplicar:

- progressive disclosure;
- redução de ruído;
- agrupamento lógico;
- hierarquia forte;
- menor número possível de decisões simultâneas;
- ações avançadas reveladas apenas quando necessárias.

Não simplificar removendo capacidades importantes.

Simplificar a forma como elas são apresentadas.

---

# 5. CONTEÚDO ANTES DA INTERFACE

O conteúdo deve ser protagonista.

Controles, navegação, efeitos, fundos, materiais e decoração devem apoiar o conteúdo.

Nunca permitir que:

- headers;
- cards;
- blur;
- transparências;
- animações;
- gradientes;
- elementos decorativos;
- barras;
- botões;

tenham mais peso visual do que o conteúdo principal sem motivo funcional.

---

# 6. HIERARQUIA VISUAL

Toda tela deve possuir uma hierarquia imediatamente compreensível.

Utilizar:

- tamanho;
- posição;
- peso;
- contraste;
- espaçamento;
- agrupamento;
- profundidade;
- tipografia;
- cor;

para diferenciar prioridades.

Estruturar os elementos segundo níveis claros:

- P1: ação ou conteúdo principal;
- P2: suporte direto à tarefa;
- P3: conteúdo secundário;
- P4: informações auxiliares.

Não permitir que elementos P3 ou P4 concorram visualmente com P1.

---

# 7. ORDEM NATURAL DE LEITURA

Posicionar informações importantes no início natural do fluxo de leitura.

O usuário não deve precisar procurar a informação principal.

Em páginas extensas:

- começar pelo contexto essencial;
- depois conteúdo principal;
- depois aprofundamento;
- depois ações secundárias;
- depois informações auxiliares.

Não exigir leitura completa da tela para entender sua função.

---

# 8. ESPAÇO É PARTE DA INTERFACE

Usar espaço em branco como ferramenta estrutural.

Não preencher espaço vazio apenas porque ele existe.

O espaçamento deve:

- separar grupos;
- reforçar hierarquia;
- aumentar legibilidade;
- melhorar área de interação;
- criar ritmo visual.

Elementos relacionados ficam próximos.

Elementos distintos recebem separação proporcional.

---

# 9. CONSISTÊNCIA ANTES DE NOVIDADE

Elementos visualmente semelhantes devem possuir comportamentos semelhantes.

Ações equivalentes devem ser representadas de maneira equivalente.

Não criar novos padrões quando um padrão conhecido já resolve a tarefa adequadamente.

Consistência deve existir em:

- cores;
- radius;
- espaçamentos;
- ícones;
- botões;
- menus;
- cards;
- estados;
- feedback;
- navegação;
- textos;
- animações;
- gestos.

Evitar exceções locais sem justificativa clara.

---

# 10. FAMILIARIDADE

Usar padrões conhecidos sempre que possível.

A pessoa deve conseguir transferir conhecimento de outras interfaces para o produto.

Não reinventar:

- botão voltar;
- busca;
- menu;
- toggle;
- tabs;
- modal;
- accordion;
- seleção;
- filtros;
- navegação;
- gestos comuns;

sem benefício real e comprovável.

---

# 11. SISTEMA ANTES DE EXCEÇÃO

Antes de criar um componente novo, verificar se já existe um componente reutilizável equivalente.

Manter:

- tokens;
- design tokens;
- spacing system;
- radius system;
- color system;
- typography scale;
- component library;
- interaction patterns;
- animation tokens;
- icon system.

Evitar CSS, estilos ou componentes isolados quando a solução deveria pertencer ao sistema.

---

# 12. RESPONSIVIDADE ADAPTATIVA

Não apenas reduzir um layout desktop.

Adaptar a experiência.

Considerar:

- largura;
- altura;
- orientação;
- touch;
- pointer;
- teclado;
- densidade;
- área segura;
- multitarefa;
- viewport variável;
- textos ampliados.

O layout deve sobreviver a variações extremas.

Nunca projetar apenas para um viewport ideal.

---

# 13. SAFE AREAS

Respeitar áreas ocupadas ou reservadas pelo sistema e pelo dispositivo.

Não posicionar informações ou controles essenciais em regiões comprometidas por:

- recortes de tela;
- câmeras;
- barras do sistema;
- gestos do sistema;
- bordas arredondadas;
- áreas de navegação;
- barras do navegador.

---

# 14. CONTROLES DEVEM PARECER INTERATIVOS

Qualquer elemento clicável, tocável ou selecionável deve comunicar essa possibilidade.

Nunca criar elementos interativos que pareçam apenas texto ou decoração sem uma pista contextual suficiente.

Fornecer estados como:

- default;
- hover;
- focus;
- pressed;
- selected;
- disabled;
- loading;

quando aplicáveis.

---

# 15. TAMANHO DE ALVO

Áreas interativas devem possuir aproximadamente **44 × 44 px ou equivalente funcional**, sempre que aplicável.

Não confundir tamanho visual com área clicável.

Ícones pequenos podem manter aparência compacta, mas devem possuir hit area confortável.

---

# 16. NÃO TRANSFORMAR TUDO EM CTA

A quantidade de destaque visual deve refletir a prioridade da ação.

Evitar:

- vários botões primários na mesma região;
- excesso de preenchimentos fortes;
- cor de destaque em todos os controles;
- competição visual entre CTAs.

Uma tela deve possuir uma ação dominante quando existir claramente uma tarefa principal.

---

# 17. COR COM FUNÇÃO SEMÂNTICA

Cor deve comunicar significado de maneira consistente.

Não usar uma mesma cor para significados contraditórios.

Definir papéis como:

- primary;
- secondary;
- success;
- warning;
- danger;
- info;
- selected;
- disabled;
- background;
- surface;
- border.

Não depender exclusivamente de cor para comunicar significado.

Combinar com:

- texto;
- ícone;
- estado;
- forma;
- posição.

---

# 18. CONTRASTE

Garantir contraste adequado entre texto, controles e fundo.

Como referência geral:

- textos pequenos: aproximadamente 4.5:1;
- textos maiores ou bold: aproximadamente 3:1.

Validar:

- light mode;
- dark mode;
- increased contrast;
- fundos sobre imagens;
- estados disabled;
- hover;
- seleção.

Não sacrificar legibilidade para preservar estética.

---

# 19. DARK MODE É UM SISTEMA

Não implementar dark mode simplesmente invertendo cores.

Reavaliar:

- contraste;
- elevação;
- opacidade;
- sombras;
- materiais;
- bordas;
- imagens;
- superfícies;
- cores semânticas.

Preservar a mesma hierarquia visual do light mode.

---

# 20. TIPOGRAFIA

Tipografia existe primeiro para comunicar.

Priorizar:

- legibilidade;
- hierarquia;
- ritmo;
- escala;
- contraste;
- comprimento de linha;
- espaçamento.

Evitar:

- pesos excessivamente finos;
- textos pequenos demais;
- número excessivo de famílias;
- escalas arbitrárias;
- headings usados apenas como decoração.

---

# 21. TEXTO REDIMENSIONÁVEL

A interface deve continuar funcional quando o usuário aumenta significativamente o tamanho do texto.

Evitar containers com alturas fixas incompatíveis com expansão.

Permitir:

- wrap;
- crescimento vertical;
- reflow;
- mudança de distribuição;
- adaptação de componentes.

Nunca truncar conteúdo essencial apenas para preservar composição visual.

---

# 22. ÍCONES

Ícones devem ser reconhecíveis antes de serem originais.

Preferir ícones familiares para funções familiares.

Ícones personalizados devem ser:

- simples;
- consistentes;
- legíveis;
- semanticamente claros.

Não usar ícone sozinho quando seu significado não for evidente.

Adicionar label quando necessário.

---

# 23. ÍCONE E TEXTO

Combinar texto e ícone quando isso reduzir ambiguidade.

Não remover labels importantes apenas em nome de uma estética minimalista.

Em grupos de controles, manter coerência no uso de ícones.

---

# 24. NAVEGAÇÃO REPRESENTA ARQUITETURA

Não misturar navegação com ação.

Usar:

- tabs para destinos principais;
- sidebar para grandes estruturas;
- toolbar para ações;
- menus para ações secundárias;
- breadcrumbs quando aplicáveis;
- navigation stacks para profundidade.

Não usar tab como botão.

Não usar toolbar como navegação principal sem justificativa.

---

# 25. NAVEGAÇÃO ESTÁVEL

Elementos principais de navegação não devem:

- desaparecer arbitrariamente;
- mudar de posição sem contexto;
- alterar significado entre páginas.

O usuário deve sempre conseguir responder:

- onde estou?
- de onde vim?
- para onde posso ir?

---

# 26. PRESERVAR ESTADO

Ao alternar entre áreas, preservar contexto quando possível.

Exemplos:

- posição de scroll;
- filtros;
- seleção;
- tab atual;
- formulário parcialmente preenchido;
- página interna.

Não reinicializar a experiência sem necessidade.

---

# 27. PROGRESSIVE DISCLOSURE

Revelar complexidade progressivamente.

Não exibir todas as opções avançadas inicialmente.

Esconder elementos secundários apenas quando existir um meio claro de encontrá-los.

Progressive disclosure não significa esconder recursos sem pistas.

---

# 28. MENUS

Menus devem reduzir densidade.

Colocar ações mais importantes e frequentes primeiro.

Evitar menus gigantes ou usados como depósito de funcionalidades.

Ações críticas ou frequentes não devem existir exclusivamente em um menu oculto.

---

# 29. MODAIS

Utilizar modal somente quando a interrupção de contexto for realmente necessária.

Todo modal deve possuir:

- propósito único;
- ação principal clara;
- forma clara de cancelar ou sair;
- foco adequado;
- comportamento de teclado;
- tratamento responsivo.

Evitar modal sobre modal.

---

# 30. ALERTAS

Não usar alertas para mensagens comuns.

Reservar alertas para:

- situações críticas;
- erros importantes;
- risco;
- ações destrutivas;
- decisões relevantes.

Não pedir confirmação para toda pequena ação.

---

# 31. RECUPERAÇÃO ANTES DE CONFIRMAÇÃO

Quando possível:

**permitir desfazer > pedir confirmação**

Não criar fluxo cheio de:

“Tem certeza?”

se a ação pode simplesmente ser revertida.

Confirmações devem ser proporcionais ao risco e irreversibilidade.

---

# 32. FEEDBACK

Toda interação significativa deve gerar feedback.

Informar:

- ação recebida;
- processamento;
- sucesso;
- falha;
- mudança de estado.

Nunca permitir que uma ação pareça ter sido ignorada.

---

# 33. FEEDBACK PROPORCIONAL

Pequena ação → pequeno feedback.

Grande consequência → feedback mais evidente.

Não abrir alertas para interações triviais.

Não usar feedback discreto demais para erros graves.

---

# 34. LOADING

Nunca deixar o usuário diante de silêncio operacional.

Se algo demora:

- mostrar skeleton;
- progress;
- spinner;
- estado de carregamento;
- conteúdo progressivo;
- feedback contextual.

Mostrar conteúdo útil assim que estiver disponível.

---

# 35. PROGRESSO HONESTO

Não criar barras de progresso artificiais ou enganosas.

Se o tempo restante for conhecido, utilizar progresso determinado.

Se não for conhecido, utilizar indicador indeterminado.

Quando passar a ser calculável, migrar para progresso determinado.

---

# 36. CANCELAMENTO

Se uma operação demorada puder ser interrompida de maneira segura, fornecer opção de cancelamento.

Não prender a pessoa a processos longos desnecessariamente.

---

# 37. ANIMAÇÃO TEM FUNÇÃO

Toda animação deve cumprir pelo menos uma função:

- orientar;
- explicar;
- conectar estados;
- fornecer feedback;
- comunicar hierarquia;
- preservar contexto espacial.

Não animar apenas para ornamentação.

---

# 38. MOVIMENTO DEVE TER CONTINUIDADE

Transições precisam respeitar origem e destino.

Se um objeto entra por determinado eixo ou região, sua saída deve ser coerente quando aplicável.

Evitar animações desconectadas da geometria da interface.

---

# 39. INTERAÇÕES FREQUENTES DEVEM SER RÁPIDAS

Quanto mais frequente uma ação, menor deve ser o tempo e intensidade de sua animação.

Não obrigar o usuário a assistir repetidamente transições longas.

---

# 40. ANIMAÇÕES DEVEM SER INTERROMPÍVEIS

Sempre que fizer sentido, permitir que uma nova ação interrompa ou substitua uma animação em andamento.

Não bloquear interface apenas para aguardar animação terminar.

---

# 41. REDUCED MOTION

Respeitar `prefers-reduced-motion` e equivalentes.

Quando ativo:

- remover movimentos grandes;
- reduzir paralaxe;
- evitar zooms intensos;
- evitar movimentos periféricos repetitivos;
- reduzir deslocamentos automáticos.

Preferir fades e mudanças mais discretas quando necessário.

---

# 42. NÃO DEPENDER DE MOTION

Nenhuma informação essencial pode existir apenas na animação.

Estados, posição e significado precisam permanecer compreensíveis sem movimento.

---

# 43. TOUCH, POINTER E TECLADO

Não projetar pensando apenas em mouse.

Toda função principal deve ser utilizável por métodos compatíveis com o ambiente.

Considerar:

- touch;
- mouse;
- trackpad;
- keyboard;
- assistive technologies.

---

# 44. HOVER NÃO É FUNCIONALIDADE

Hover é feedback complementar.

Nunca depender exclusivamente de hover para:

- revelar ação crítica;
- mostrar informação indispensável;
- permitir navegação;
- executar tarefa principal.

---

# 45. TECLADO

Quando aplicável:

- fornecer ordem de foco lógica;
- mostrar foco visível;
- permitir navegação via Tab;
- permitir Enter/Space;
- permitir Escape para fechar overlays;
- não sequestrar atalhos conhecidos.

---

# 46. GESTOS

Gestos ocultos podem acelerar tarefas, mas não devem ser a única forma de executar ações importantes.

Exemplos:

- swipe;
- long press;
- drag;
- pinch.

Quando necessários, fornecer pistas ou alternativas.

---

# 47. FORMULÁRIOS

Solicitar apenas dados realmente necessários.

Não pedir novamente dados que o sistema já possui.

Usar:

- campo adequado;
- tipo correto;
- autocomplete;
- máscara quando necessária;
- validação contextual;
- mensagens específicas.

Não criar formulários maiores do que a tarefa exige.

---

# 48. VALIDAÇÃO DE FORMULÁRIO

Erros devem indicar:

- o que aconteceu;
- onde está o problema;
- como corrigir.

Não usar apenas:

“Erro.”

Não limpar campos corretos por causa de outro campo inválido.

---

# 49. TOGGLES

Toggles representam estado.

Usar para:

- ligado/desligado;
- ativo/inativo;
- permitir/bloquear.

Não usar toggle para executar comandos pontuais.

O estado precisa ser perceptível sem depender apenas de cor.

---

# 50. BUSCA

Busca deve acelerar descoberta.

Quando apropriado, fornecer:

- sugestões;
- autocomplete;
- histórico;
- filtros;
- scopes;
- correção;
- resultados recentes.

Não usar busca como correção para arquitetura de informação ruim.

---

# 51. ONBOARDING

O produto deve ser compreensível sem tutorial sempre que possível.

Quando onboarding for necessário:

- curto;
- focado;
- contextual;
- opcional quando possível.

Não criar uma apresentação longa antes de permitir uso.

---

# 52. ENSINAR NO CONTEXTO

Preferir dicas no momento em que a funcionalidade se torna relevante.

Não exigir que a pessoa memorize um tutorial exibido muito antes de utilizar o recurso.

---

# 53. ESCRITA É UX

Todo texto de interface deve ajudar a pessoa a compreender ou agir.

Usar linguagem:

- direta;
- curta;
- humana;
- consistente;
- familiar.

Evitar jargão desnecessário.

---

# 54. LABELS DE AÇÃO

Botões devem preferencialmente indicar a ação.

Preferir:

- Salvar alterações
- Criar roteiro
- Reservar agora
- Remover ponto

em vez de labels vagos como:

- OK
- Continuar
- Confirmar

quando o contexto permitir maior precisão.

---

# 55. INCLUSÃO

Usar linguagem e representação inclusivas.

Evitar assumir:

- capacidades;
- contexto;
- conhecimento;
- gênero;
- cultura;
- experiência técnica.

Projetar para diversidade de pessoas e contextos.

---

# 56. ACESSIBILIDADE DESDE O INÍCIO

Acessibilidade não deve ser uma auditoria posterior.

Considerar desde a construção:

- semântica;
- headings;
- landmarks;
- labels;
- foco;
- teclado;
- contraste;
- texto escalável;
- alt text;
- estados;
- mensagens;
- touch target;
- reduced motion.

---

# 57. TECNOLOGIAS ASSISTIVAS

Componentes devem possuir:

- nome;
- função;
- estado;
- valor;
- ordem lógica.

Elementos puramente decorativos devem ser ignorados por leitores de tela quando adequado.

---

# 58. CARGA COGNITIVA

Dividir tarefas extensas.

Reduzir elementos simultâneos.

Manter uma ação principal clara por etapa quando aplicável.

Evitar interfaces excessivamente densas ou cheias de decisões concorrentes.

---

# 59. PRIVACIDADE

Coletar apenas o necessário.

Sempre explicar, quando apropriado:

- o que será coletado;
- por que;
- para que será utilizado.

Não solicitar permissões antecipadamente apenas por conveniência de implementação.

---

# 60. PERMISSÕES NO CONTEXTO

Solicitar:

- localização;
- câmera;
- microfone;
- contatos;
- notificações;

somente quando a pessoa iniciar ou se aproximar da funcionalidade que depende dessa permissão.

Explicar o benefício antes da solicitação do sistema quando necessário.

---

# 61. IMAGENS

Preservar:

- aspect ratio;
- qualidade;
- legibilidade;
- ponto focal.

Não distorcer imagem apenas para preencher um container.

Adaptar crop conforme viewport quando necessário.

---

# 62. VETORES E ÍCONES

Utilizar assets escaláveis para iconografia e elementos que precisam adaptar-se a múltiplas densidades.

Não utilizar imagens rasterizadas desnecessariamente para elementos simples de interface.

---

# 63. NÃO DEPENDER DE PIXEL FÍSICO

Construir interfaces com unidades e constraints adequadas ao ambiente.

Não criar layout perfeitamente posicionado apenas para uma única resolução.

---

# 64. PROJETAR ESTADOS, NÃO APENAS TELAS

Todo componente deve prever estados relevantes.

Considerar:

- default;
- hover;
- focus;
- active;
- pressed;
- selected;
- disabled;
- loading;
- error;
- success;
- warning;
- empty.

Nunca entregar componente considerando apenas seu estado ideal.

---

# 65. EMPTY STATES

Uma região vazia deve comunicar:

1. por que está vazia;
2. o que pode acontecer ali;
3. qual ação pode iniciar o fluxo.

Não esconder navegação principal apenas porque ainda não existe conteúdo.

---

# 66. PRESERVAR CONTEXTO NAS TRANSIÇÕES

Mudanças de layout, viewport, orientação ou navegação devem preservar o máximo de continuidade possível.

Não fazer conteúdo “teleportar” sem necessidade.

Usar movimento, posição e transição para mostrar relação entre estados quando isso ajudar compreensão.

---

# 67. QUALIDADE NOS DETALHES

Tratar como problemas reais:

- desalinhamentos;
- inconsistências de radius;
- diferenças de espaçamento;
- ícones incorretos;
- hover incompleto;
- foco ausente;
- quebra de textos;
- overflow;
- transições abruptas;
- truncamentos;
- estados esquecidos.

Acabamento é parte da UX.

---

# 68. DELIGHT

Personalidade e prazer de uso são desejáveis, mas somente depois de:

- clareza;
- funcionalidade;
- acessibilidade;
- previsibilidade;
- performance.

Delight pode surgir de:

- microinterações;
- transições;
- feedback;
- pequenos detalhes;
- motion;
- copy;
- respostas contextuais.

Nunca sacrificar usabilidade em nome de espetáculo.

---

# 69. CAMADA DE CONTEÚDO E CAMADA FUNCIONAL

Diferenciar conceitualmente:

**camada de conteúdo**

- imagens;
- texto;
- mídia;
- informações;
- dados.

**camada funcional**

- navegação;
- controles;
- toolbars;
- menus;
- overlays;
- ações.

A camada funcional deve apoiar o conteúdo e poder recuar visualmente quando não estiver em uso.

---

# 70. HARMONIA GEOMÉTRICA

Formas, curvas e containers devem possuir relações coerentes.

Evitar:

- dezenas de radii diferentes;
- formas sem relação;
- bordas arbitrárias;
- curvas conflitantes.

Buscar uma linguagem geométrica consistente.

---

# 71. PESO VISUAL PROPORCIONAL À IMPORTÂNCIA

O peso visual de um elemento deve ser proporcional ao seu valor funcional.

Elementos decorativos devem possuir menos peso do que:

- título;
- ação principal;
- informação crítica;
- navegação essencial.

---

# 72. FRICÇÃO PROPORCIONAL AO RISCO

Baixo risco → baixa fricção.

Alto risco → maior confirmação e proteção.

Não adicionar etapas extras a ações rotineiras.

Não tornar ações destrutivas irreversíveis fáceis demais.

---

# 73. ESTADO DO SISTEMA DEVE SER VISÍVEL

O usuário deve compreender:

- carregando;
- offline;
- salvo;
- não salvo;
- sincronizando;
- erro;
- selecionado;
- desabilitado;
- concluído.

Nunca depender de comportamento invisível.

---

# 74. PERFORMANCE PERCEBIDA

Uma interface deve parecer rápida além de ser tecnicamente rápida.

Usar:

- resposta imediata;
- optimistic UI quando seguro;
- skeleton;
- progressive rendering;
- feedback instantâneo.

Evitar telas vazias durante processamento.

---

# 75. NÃO INTERROMPER SEM MOTIVO

Notificações, banners, modais e tooltips devem respeitar o fluxo.

Não interromper uma tarefa importante com:

- promoções;
- dicas irrelevantes;
- pedidos de avaliação;
- mensagens sem urgência.

---

# 76. UMA AÇÃO PRINCIPAL POR CONTEXTO

Sempre identificar a ação dominante da tela ou região.

Outras ações devem receber nível visual menor.

Se tudo é importante, nada é importante.

---

# 77. PRIORIDADE DE CONTEÚDO

Em decisões de layout, priorizar:

1. conteúdo necessário à tarefa;
2. ação principal;
3. contexto;
4. navegação;
5. ações secundárias;
6. decoração.

---

# 78. TESTAR EXTREMOS

Não validar somente cenário ideal.

Testar:

- viewport muito pequeno;
- viewport muito grande;
- texto longo;
- idioma maior;
- zero resultados;
- muitos resultados;
- erro;
- conexão lenta;
- teclado;
- reduced motion;
- dark mode;
- zoom;
- contraste;
- dados faltantes.

---

# 79. TESTAR COM CONTEÚDO REALISTA

Não depender exclusivamente de lorem ipsum ou placeholders curtos.

Utilizar textos longos, nomes extensos, números e imagens com proporções variadas para identificar falhas reais.

---

# 80. COMPONENTES DEVEM SER RESILIENTES

Componentes não podem depender de:

- número fixo de caracteres;
- quantidade fixa de itens;
- altura rígida desnecessária;
- imagem perfeita;
- texto sempre curto.

Projetar para variação.

---

# 81. RESPONSABILIDADE

Não usar padrões manipulativos para induzir decisões.

Evitar:

- dark patterns;
- opt-out escondido;
- cancelamento artificialmente difícil;
- botão principal enganoso;
- urgência falsa;
- consentimento manipulado.

---

# 82. NÃO USAR DESIGN PARA ENGANAR

Hierarquia visual deve refletir a importância real das escolhas.

Não destacar visualmente uma escolha apenas porque ela beneficia o negócio quando isso prejudica autonomia do usuário.

---

# 83. A INTERFACE DEVE EXPLICAR-SE

Sempre que possível, a própria estrutura deve revelar:

- o que é;
- onde estou;
- o que posso fazer;
- o que acontecerá depois.

Não depender de tutoriais para explicar toda a navegação.

---

# 84. EVITAR DENSIDADE SEM HIERARQUIA

Muita informação pode existir em uma tela, desde que esteja organizada.

O problema não é densidade isoladamente.

O problema é densidade sem hierarquia.

---

# 85. NÃO SACRIFICAR FUNÇÃO POR MINIMALISMO

Minimalismo não deve remover:

- labels necessários;
- estados;
- feedback;
- controles;
- contraste;
- affordance.

Minimalismo deve remover ruído, não entendimento.

---

# 86. INTERAÇÕES DEVEM SER PREVISÍVEIS

Antes de uma ação, o usuário deve conseguir prever aproximadamente seu resultado.

Depois da ação, o resultado deve corresponder à expectativa.

Evitar efeitos surpresa que alterem estrutura ou conteúdo sem contexto.

---

# 87. NÃO GERAR LAYOUT SHIFT DESNECESSÁRIO

Hover, focus, loading e mudança de estado não devem deslocar elementos ao redor sem motivo.

Preferir:

- transform;
- opacity;
- propriedades que não alterem fluxo;

para microinterações.

---

# 88. ESTADOS DE HOVER

Hover deve:

- ser perceptível;
- ser discreto;
- reforçar interatividade.

Não usar movimentos tão grandes que alterem composição ou causem instabilidade.

---

# 89. ESTADOS DE FOCUS

Focus deve ser visível.

Não remover `outline` sem fornecer substituição acessível.

Focus não precisa copiar hover.

Ele deve ser desenhado para navegação por teclado.

---

# 90. DISABLED

Estado disabled precisa parecer indisponível, mas continuar legível.

Quando possível, explicar por que determinada ação está indisponível.

Evitar controles que simplesmente deixam de funcionar sem indicação.

---

# 91. ERRO

Mensagens de erro devem ser:

- específicas;
- próximas do problema;
- recuperáveis;
- escritas em linguagem humana.

Evitar códigos técnicos para usuários finais.

---

# 92. SUCESSO

Não transformar toda ação bem-sucedida em modal.

Preferir feedback contextual ou toast quando suficiente.

A confirmação deve ser proporcional à relevância da ação.

---

# 93. DESTRUTIVO

Ações destrutivas devem possuir tratamento semântico claro.

Usar linguagem específica.

Evitar labels genéricos como “Confirmar” quando “Excluir conta” ou “Remover arquivo” forem mais claros.

---

# 94. ORDEM DAS AÇÕES

Em componentes com várias ações:

- destacar principal;
- manter secundária visível;
- diferenciar destrutiva;
- evitar ordem confusa.

A hierarquia deve refletir consequência e frequência.

---

# 95. COMPONENTES NATIVOS E SEMÂNTICOS

Quando possível, preferir componentes nativos ou semanticamente corretos.

Na web:

- `button` para botão;
- `a` para link;
- `input` para entrada;
- `dialog` para diálogo quando adequado;
- `nav` para navegação;
- `main`;
- `header`;
- `footer`;
- headings corretos.

Não reconstruir tudo com `div`.

---

# 96. ACESSIBILIDADE NÃO É APENAS ARIA

Primeiro usar HTML e controles semânticos adequados.

Adicionar ARIA apenas quando necessário.

Não usar ARIA para corrigir estrutura fundamentalmente incorreta.

---

# 97. NÃO CRIAR DEPENDÊNCIA DE MOUSE

Tudo que for essencial deve possuir alternativa funcional para touch e teclado quando aplicável.

---

# 98. NÃO CRIAR DEPENDÊNCIA DE COR

Seleção, erro, sucesso ou status devem possuir ao menos outra pista visual além da cor.

---

# 99. NÃO CRIAR DEPENDÊNCIA DE SOM

Informações transmitidas por som precisam possuir alternativa visual quando forem importantes.

---

# 100. NÃO CRIAR DEPENDÊNCIA DE ANIMAÇÃO

Informações transmitidas por movimento precisam possuir alternativa estática.

---

# 101. IMAGENS DECORATIVAS

Imagens exclusivamente decorativas não devem poluir navegação assistiva.

---

# 102. TEXTOS SOBRE IMAGENS

Quando texto estiver sobre imagem:

- controlar contraste;
- utilizar overlay quando necessário;
- garantir legibilidade independentemente da imagem;
- evitar depender da imagem específica para manter contraste.

---

# 103. OVERLAYS

Overlay deve reforçar foco, não apenas escurecer a tela.

Garantir:

- contraste;
- escape;
- focus trap quando necessário;
- retorno de foco ao elemento de origem.

---

# 104. DRAWERS E BOTTOM SHEETS

Utilizar quando preservam contexto melhor que uma página nova.

Não empilhar repetidamente drawers e sheets.

Permitir saída clara.

---

# 105. TOOLTIP

Tooltip deve complementar.

Não esconder instrução indispensável exclusivamente em tooltip.

Não depender de hover em dispositivos touch.

---

# 106. ACCORDION

Accordion deve:

- indicar expandido/fechado;
- possuir hit area adequada;
- suportar teclado;
- animar sem impedir leitura;
- comportar conteúdo de altura variável.

---

# 107. CARDS

Card não é componente obrigatório.

Utilizar quando o agrupamento visual possui significado.

Evitar transformar cada bloco de informação em card sem necessidade.

Cards clicáveis devem deixar clara sua interatividade.

---

# 108. LISTAS

Quando itens possuem estrutura semelhante, considerar lista antes de card grid.

Priorizar escaneabilidade.

---

# 109. BARRAS E TOOLBARS

Ferramentas frequentes e relacionadas ao contexto podem ficar visíveis.

Ações raras podem migrar para menus.

Não sobrecarregar toolbars.

---

# 110. TAB BAR

Tabs representam áreas irmãs de primeiro nível.

Não usar tabs para filtros comuns ou ações.

Quantidade deve permanecer administrável e compreensível.

---

# 111. SIDEBAR

Sidebar deve estruturar áreas amplas sem roubar atenção do conteúdo.

Deve poder adaptar-se em viewports menores.

---

# 112. BUSCA, FILTRO E ORDENAÇÃO

Não misturar suas funções.

Busca encontra.

Filtro restringe.

Ordenação muda ordem.

A interface precisa comunicar claramente essa diferença.

---

# 113. FILTROS ATIVOS

Filtros ativos devem ficar visíveis e removíveis.

O usuário deve entender por que determinado resultado está sendo exibido.

---

# 114. ZERO RESULTADOS

Quando não houver resultados:

- dizer que nada foi encontrado;
- mostrar filtros ativos relevantes;
- oferecer remoção ou ajuste;
- sugerir próximo passo.

---

# 115. ESTADOS OFFLINE

Se o produto depender de rede, prever:

- ausência de conexão;
- reconexão;
- conteúdo em cache;
- retry;
- conflitos de sincronização.

---

# 116. INTERRUPÇÕES EXTERNAS

Projetar fluxos para sobreviver a:

- mudança de aba;
- navegador em background;
- tela bloqueada;
- retomada posterior.

Quando aplicável, preservar progresso.

---

# 117. DADOS NÃO SALVOS

Se houver risco real de perda de trabalho, comunicar claramente.

Não mostrar confirmação de saída se nada significativo foi alterado.

---

# 118. ERROS DO SISTEMA

Não culpar o usuário.

Explicar a situação de maneira objetiva e indicar solução possível.

---

# 119. REGRA FINAL DE DECISÃO

Quando existir dúvida entre duas soluções, escolher a que melhor satisfizer esta sequência:

1. resolve melhor a tarefa;
2. é mais clara;
3. exige menos esforço;
4. é mais previsível;
5. oferece melhor feedback;
6. preserva melhor o contexto;
7. é mais acessível;
8. é mais consistente com o sistema;
9. é mais adaptável;
10. possui melhor acabamento;
11. somente depois, é mais visualmente sofisticada.

---

# REGRA-MÃE

Aplicar permanentemente:

**propósito antes de feature;**
**conteúdo antes de ornamentação;**
**clareza antes de estética;**
**hierarquia antes de densidade;**
**consistência antes de novidade;**
**familiaridade antes de reinvenção;**
**ação antes de animação;**
**feedback antes de silêncio;**
**recuperação antes de confirmação excessiva;**
**acessibilidade antes de dependência visual;**
**contexto antes de regra mecânica;**
**sistema antes de exceção;**
**autonomia antes de manipulação;**
**privacidade antes de coleta;**
**adaptação antes de layout fixo;**
**fricção proporcional ao risco;**
**peso visual proporcional à importância;**
**qualidade nos detalhes antes de efeitos gratuitos.**

---

# COMANDO DE EXECUÇÃO

Ao analisar, criar, editar, revisar ou refatorar qualquer interface:

1. leia estas regras antes de tomar decisões visuais;
2. identifique os princípios aplicáveis ao contexto;
3. preserve componentes e comportamentos válidos;
4. corrija violações sem redesenhar desnecessariamente;
5. não aplique regras mecanicamente quando prejudicarem o contexto;
6. prefira componentes compartilhados;
7. valide desktop, tablet e mobile quando aplicável;
8. valide teclado, foco e acessibilidade;
9. valide light e dark mode quando existentes;
10. valide estados extremos e de erro;
11. elimine inconsistências entre páginas;
12. documente qualquer exceção relevante;
13. não introduza complexidade sem benefício mensurável;
14. não introduza animação sem função;
15. não introduza decoração que prejudique conteúdo;
16. não reduza acessibilidade para preservar estética;
17. não altere arquitetura válida apenas para aplicar tendência visual;
18. não replique mecanicamente padrões de uma plataforma quando não forem adequados ao contexto;
19. utilize estas regras como sistema de decisão, e não como obrigação de copiar qualquer linguagem visual específica;
20. ao finalizar, revisar a interface utilizando este documento como checklist de aceitação.

Toda interface final deve parecer:

**clara, previsível, consistente, adaptável, acessível, refinada, responsiva e deliberadamente simples.**
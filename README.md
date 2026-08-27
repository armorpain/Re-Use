# ReUse | Mobile | Sprint 1: Visão Inicial da Plataforma

## 📌 Contexto da Sprint

Este repositório contém a entrega da **Sprint 1** do projeto **ReUse**, uma plataforma digital voltada à economia sustentável, reutilização de produtos e consumo consciente.

O foco desta fase não está na complexidade técnica, mas em construir o **primeiro contato do usuário** com o produto: uma tela inicial clara, bem estruturada e já alinhada a uma identidade visual própria, capaz de comunicar a proposta de valor do ReUse e o problema que ele busca resolver.

## 💡 O problema

Todos os anos, uma grande quantidade de produtos em bom estado é descartada por falta de um destino adequado, seja por desconhecimento de onde doar, trocar ou vender, seja pela falta de uma plataforma simples que conecte quem quer se desfazer de um item com quem precisa dele. Isso gera desperdício de recursos e agrava o impacto ambiental do consumo.

## 🌱 Proposta de valor

O **ReUse** é um aplicativo que conecta pessoas para **reutilizar, trocar e doar produtos**, incentivando o consumo consciente e reduzindo o desperdício, de forma simples e acessível a partir do celular.

## 🎨 Identidade visual

A tela foi construída em cima de um **Sistema de Identidade Visual** próprio, documentado em [`docs/design-system.html`](./docs/design-system.html) (abra no navegador para visualizar). O conceito: em vez do verde genérico de "sustentabilidade", a linguagem visual vem do universo físico do re-uso, com **etiquetas de brechó** e **carimbos de verificação** de processos de doação.

**Paleta**
| Cor | Hex | Uso |
|---|---|---|
| Musgo | `#33502A` | Cor primária, usada em botões, títulos, ícone |
| Mostarda | `#D6A23C` | Accent de atenção, badges "usado/seminovo" |
| Argila | `#A65639` | Accent raro, carimbos e estados críticos |
| Tinta | `#202B1C` | Texto principal |
| Papel | `#F8F6EC` | Superfície de cards |
| Fundo | `#ECEFE2` | Fundo de tela |

**Tipografia:** Fraunces (display, títulos), Inter (corpo/UI), IBM Plex Mono (tags, códigos, metadados).

**Elemento de assinatura:** o *carimbo de re-uso*, um selo circular de borda tracejada, levemente rotacionado, repetido em pontos-chave da interface (`StampBadge`).

Todos os tokens (cores, fontes, espaçamento) estão centralizados em `theme/` para que qualquer nova tela do app siga o mesmo padrão.

## 🎨 Decisões de interface e organização do app

- **Estrutura em tela única (scrollável):** por ser a primeira Sprint, optamos por uma única tela (`App.js`) organizada verticalmente com `ScrollView`, deixando a navegação entre telas como evolução futura (opcional nesta fase).
- **Layout responsivo:** em telas largas (o app aberto no navegador do computador), o conteúdo fica centralizado dentro de um cartão com largura máxima e sombra, simulando a moldura de um celular em vez de esticar o texto de ponta a ponta da janela.
- **Hierarquia guiada por "etiquetas de seção":** cada bloco de conteúdo é precedido por um `SectionEyebrow` (rótulo tracejado com ✂), reforçando visualmente a metáfora de etiqueta destacável do sistema.
- **Cards com "furo de picote":** o `TagCard` substitui um card genérico por um componente com um pequeno furo no canto esquerdo, referência ao destacável de uma etiqueta física.
- **Aplicação real do sistema:** a seção "Na prática" usa o `ItemPreviewCard` para mostrar como o design system se comporta em um caso de uso real (um anúncio de item), e não apenas em blocos de texto institucional.
- **Confiança via carimbo:** a seção "Selo ReUse" usa três `StampBadge` para comunicar, de forma visual e coerente com a marca, as etapas de verificação do processo (uso, verificação, doação).
- **Tipografia com três papéis:** Fraunces para personalidade (título e frase de efeito em itálico), Inter para leitura confortável no corpo, e IBM Plex Mono para tudo que remete a etiqueta/código (código do item, rótulos de seção).
- **Tokens centralizados:** cores, fontes e espaçamento vêm de `theme/colors.js`, `theme/typography.js` e `theme/spacing.js`, sem nenhum valor "mágico" solto nos componentes, facilitando consistência em telas futuras.

## 🧩 Estrutura do projeto

```
reuse-app/
├── App.js                       # Tela inicial (composição dos componentes do design system)
├── app.json                     # Configuração do Expo (splash já com a cor de fundo da marca)
├── babel.config.js
├── package.json
├── docs/
│   └── design-system.html       # Guia visual completo (paleta, tipografia, componentes)
├── theme/
│   ├── colors.js                 # Tokens de cor
│   ├── typography.js             # Tokens de fonte
│   └── spacing.js                # Escala de espaçamento e raio
├── components/
│   ├── Header.js                 # Nome do app + carimbo de assinatura
│   ├── SectionEyebrow.js         # Rótulo de seção (estilo etiqueta)
│   ├── TagCard.js                # Card com "furo de picote"
│   ├── Chip.js                   # Tag de condição do item (novo/usado/peças)
│   ├── StampBadge.js             # Selo circular, elemento de assinatura
│   ├── ItemPreviewCard.js        # Card de item real (TagCard + Chip combinados)
│   └── PrimaryButton.js          # Botão (variantes primary/secondary)
└── assets/                       # Pasta reservada para imagens/ícones do projeto
```

### Componentes reutilizáveis

| Componente | Onde é usado | Por que é reutilizável |
|---|---|---|
| `Header` | Topo da tela | `title`/`subtitle` podem mudar em outras telas (login, perfil) |
| `SectionEyebrow` | Antes de cada bloco de conteúdo | Um único componente padroniza todos os rótulos de seção |
| `TagCard` | Blocos "proposta"/"problema" e base do `ItemPreviewCard` | Aceita qualquer conteúdo como children, com ou sem destaque |
| `Chip` | Condição do item no `ItemPreviewCard` | Reutilizável em qualquer lista de itens futura |
| `StampBadge` | Seção "Selo ReUse" | Três variantes de cor a partir do mesmo componente |
| `ItemPreviewCard` | Seção "Na prática" | Pronto para ser repetido em uma futura lista/feed de itens |
| `PrimaryButton` | Botões "Começar agora"/"Saiba mais" | Prop `variant` alterna entre estilo principal e secundário |

## 🛠️ Tecnologias

- React Native + Expo
- `@expo-google-fonts` (Fraunces, Inter, IBM Plex Mono) para carregar as fontes da marca

## ▶️ Como executar o projeto

```bash
# instalar dependências
npm install

# iniciar o projeto com Expo
npm start
```

Em seguida, escaneie o QR Code com o app **Expo Go** (Android/iOS), pressione `w` para abrir no navegador, ou `a`/`i` para um emulador.

## 🚫 Fora do escopo desta Sprint

Conforme definido no desafio, não fazem parte desta fase:
- Motion design ou animações
- Microinterações avançadas
- Backend ou APIs externas
- Banco de dados ou persistência de dados
- Autenticação real de usuários

## 👥 Equipe

_(preencher com os nomes dos integrantes do time)_

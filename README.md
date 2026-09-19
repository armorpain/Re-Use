# ReUse | Mobile 

##  O problema

Todos os anos, uma grande quantidade de produtos em bom estado é descartada por falta de um destino adequado, seja por desconhecimento de onde doar, trocar ou vender, seja pela falta de uma plataforma simples que conecte quem quer se desfazer de um item com quem precisa dele. Isso gera desperdício de recursos e agrava o impacto ambiental do consumo.

##  Proposta de valor

O **ReUse** é um aplicativo que conecta pessoas para **reutilizar, trocar e doar produtos**, incentivando o consumo consciente e reduzindo o desperdício, de forma simples e acessível a partir do celular.

## Doação, troca e venda

Todo anúncio tem um tipo: **Doação** (grátis), **Troca** ou **Venda**. Na venda:

- preço em reais e, opcionalmente, quanto custa novo, para mostrar a economia (por exemplo, -76%);
- **preço sugerido** pela condição do item (até 70% do valor de loja para "Como novo", 50% para "Usado" e 25% para "Para reparo"), com aviso quando o preço passa disso;
- opção "Aceito ofertas", que habilita o botão **Fazer uma oferta** para o comprador;
- filtros por tipo, faixa de preço ("Até R$ 50", "Até R$ 100", "Até R$ 200") e ordenação por menor preço;
- pagamento combinado direto entre as partes, na retirada, com dicas de compra segura no chat.

O dono pode marcar o anúncio como **vendido, doado ou trocado**, e ele recebe o carimbo do ReUse.

## Responsividade

| Largura | Dispositivo | Navegação | Conteúdo |
|---|---|---|---|
| menos de 600 | celular | barra de abas embaixo | 1 coluna, grade de 2 itens, filtros em janela |
| 600 a 1023 | tablet | menu lateral compacto | grade de 3 itens, formulários em 2 colunas |
| 1024 ou mais | computador | menu lateral completo | grade de 4 a 6 itens, detalhe e formulários em 2 colunas, conversas em lista + chat |

O conteúdo tem largura máxima para o texto nunca esticar de ponta a ponta. No navegador, cada tela tem URL própria (`/favoritos`, `/item/s1`, `/conversas`).

## Identidade visual

Documentada em [`docs/design-system.html`](./docs/design-system.html). Paleta Musgo, Mostarda e Argila, com Fraunces (títulos), Inter (texto) e IBM Plex Mono (etiquetas, códigos e preços pequenos). Elemento de assinatura: o **carimbo de re-uso** (`StampBadge`). O app não usa emojis: todos os símbolos são ícones (Feather e Ionicons).

O único token novo de cor é `alert` (vermelho), usado apenas na bolinha de mensagem nova.

## Recursos nativos

**Async Storage** (`utils/storage.js`, `context/AppContext.js`): primeira visita, sessão, contas, anúncios do usuário, favoritos, conversas (com mensagens não lidas), rascunho do anúncio e configurações.

**Câmera** (`screens/CameraScreen.js`): fotos do anúncio (até 3, moldura grande e centralizada) e foto de perfil (moldura circular, câmera frontal). Também é possível escolher da galeria.

## Estrutura do projeto

```
reuse-app/
├── App.js                      # fontes, providers e navegação
├── app.json
├── package.json
├── docs/
│   ├── design-system.html      # guia visual completo
│   └── ENTREGA_SPRINT2.md      # texto pronto para o PDF da entrega
├── theme/                      # colors, typography, spacing, layout (breakpoints)
├── hooks/                      # useBreakpoint, useGrid
├── utils/                      # storage, format, filters, media, image, share
├── data/                       # catalog (tipos, condições, categorias) e seed (itens de exemplo)
├── context/                    # AppContext (estado + Async Storage) e DialogContext (janelas e avisos)
├── navigation/                 # AppNavigator, ref, sections
├── components/                 # design system + componentes do app
└── screens/                    # 13 telas
```

## Tecnologias

- React Native + Expo (SDK 51) e React Navigation
- `@react-native-async-storage/async-storage`, `expo-camera`, `expo-image-picker`, `expo-haptics`
- `react-native-web` para rodar no navegador
- `@expo-google-fonts` (Fraunces, Inter, IBM Plex Mono) e `@expo/vector-icons`

## Como executar

```bash
npm install
npx expo install --fix   # alinha as versões ao SDK instalado
npm start
```

Em seguida, escaneie o QR Code com o **Expo Go**, pressione `w` para abrir no navegador, ou `a`/`i` para um emulador.

## 👥 Equipe

Gabriela Guedes, Isabela Almeida, Victor Nogueira e Felipe Xavier.

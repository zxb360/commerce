# SpotCommerce - Frontend (React + Vite + Tailwind CSS)

Aplicação web moderna com **Split Screen Responsivo** para exploração de estabelecimentos comerciais locais, com sincronização bidirecional entre lista e mapa interativo.

---

## 🛠️ Tecnologias Utilizadas

- **React 19 + TypeScript**: Base sólida com tipagem estrita.
- **Vite**: Bundler ultra-rápido para desenvolvimento e build.
- **Tailwind CSS v4**: Estilização moderna e responsiva orientada a utilitários.
- **Leaflet**: Motor de mapas interativos de alto desempenho com suporte a tiles CartoDB Positron / Voyager.
- **Lucide React**: Biblioteca de ícones elegantes e coesos.
- **Vitest & React Testing Library**: Suíte de testes unitários rápidos e confiáveis com jsdom.

---

## 📐 Estrutura de Pastas

```text
commerce-frontend/
├── public/                 # Favicons e arquivos estáticos
├── src/
│   ├── assets/             # Imagens e logotipos estáticos
│   ├── components/
│   │   ├── Header/         # Header fixo (80px), barra de busca fictícia e avatar
│   │   │   └── Header.tsx
│   │   ├── Map/            # Mapa interativo com Leaflet e Custom DivIcons
│   │   │   └── InteractiveMap.tsx
│   │   ├── MobileToggle/   # Botão flutuante mobile "Ver Mapa / Ver Lista"
│   │   │   └── ViewToggleButton.tsx
│   │   ├── PlacesList/     # Coluna esquerda rolável, filtros e cards
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── PlaceCard.tsx
│   │   │   └── PlacesList.tsx
│   │   └── common/         # Componentes compartilhados
│   │       └── RatingBadge.tsx
│   ├── data/               # Dados de seed mockados com geolocalização e fotos
│   │   └── seedPlaces.ts
│   ├── test/               # Configuração e testes unitários Vitest
│   │   ├── Header.test.tsx
│   │   ├── PlaceCard.test.tsx
│   │   ├── PlacesList.test.tsx
│   │   ├── ViewToggleButton.test.tsx
│   │   └── setup.ts
│   ├── types/              # Definições de tipos TypeScript (Establishment, ViewMode)
│   │   └── commerce.ts
│   ├── App.tsx             # Layout principal Split Screen (calc(100vh - 80px))
│   ├── index.css           # Tailwind CSS v4 e estilos de Custom DivIcons
│   └── main.tsx            # Ponto de entrada React com StrictMode
├── package.json            # Scripts e dependências
├── tsconfig.json           # Configuração de TypeScript
├── tsconfig.app.json       # Compilador TS da aplicação e types de teste
├── vite.config.ts          # Configurações do Vite, Tailwind e Vitest
└── README.md
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- Node.js versão 18+ (recomendado 20 ou 22+)
- npm ou pnpm

### 2. Instalação das dependências
Se você acabou de clonar o projeto:
```bash
npm install
```

### 3. Rodar em modo de desenvolvimento
```bash
npm run dev
```
O servidor iniciará em `http://localhost:5173`.

### 4. Rodar os testes automatizados
```bash
# Execução única dos testes:
npm run test:run

# Modo interativo com watch:
npm run test
```

### 5. Compilar para produção (Build)
```bash
npm run build
```

---

## 🎯 Funcionalidades Implementadas

### 1. Layout Split Screen Responsivo
- **Header fixo (80px de altura)**:
  - Marca `SpotCommerce` com indicador da região (SP).
  - Barra de busca fictícia moderna com atalho `⌘K` e limpeza rápida.
  - Ações do usuário: filtro rápido, favoritos, notificações com badge e avatar com status online.
- **Container Principal (`calc(100vh - 80px)`)**:
  - **Coluna Esquerda (~60% de largura no desktop)**:
    - Área rolável com scroll suave (`overflow-y-auto`).
    - Barra de controle de estabelecimentos (total de locais, filtro por "Abertos agora" e ordenação).
    - Carrossel de categorias ("Todos", "Cafeteria", "Restaurante Italiano", "Hamburgueria", "Padaria Artesanal", etc.).
    - Grid responsivo de 2 colunas para os cards de estabelecimentos.
  - **Coluna Direita (~40% de largura no desktop)**:
    - Container fixo com mapa preenchendo 100% da largura e altura da coluna.
  - **Modo Mobile**:
    - Alternância suave entre a lista de locais e o mapa em tela cheia através do botão flutuante `"Ver Mapa / Ver Lista"`.

### 2. Cards de Estabelecimentos (Coluna Esquerda)
- Foto de capa com proporção consistente `aspect-video`, cantos arredondados e zoom suave no hover.
- Miniatura circular do logotipo (`logo_image_url`) com borda branca sobreposta na parte inferior da foto de capa.
- Badge de status em tempo real ("Aberto agora" / "Fechado") e faixa de preço (`$$`, `$$$`).
- Avaliação destacada com estrela e número de reviews.
- Categoria em destaque, nome comercial, endereço resumido, telefone e tags de destaques (ex: Pet Friendly, Wi-Fi, etc.).

### 3. Mapa Interativo e Sincronização Bidirecional (Coluna Direita)
- **Marcadores Customizados (Custom DivIcons)**:
  - Cada pin do mapa exibe o logotipo circular de 42x42px do comércio, com moldura branca elegante, sombra suave e tooltip flutuante ao aproximar o mouse.
- **Hover/Foco na Lista**:
  - Passar o mouse ou navegar com teclado (`Tab`/`Focus`) em qualquer card na lista lateral destaca imediatamente o marcador correspondente no mapa (aumentando a escala para 122%, aplicando contorno azul vibrante e elevando o `z-index`).
- **Clique no Marcador**:
  - Centraliza o mapa suavemente nas coordenadas do local (`map.flyTo(...)`).
  - Realiza um scroll suave automático até o card correspondente na lista lateral (`scrollIntoView({ behavior: 'smooth', block: 'center' })`).
  - Abre uma prévia flutuante rápida no canto inferior do mapa com foto, detalhes e atalho para o card.

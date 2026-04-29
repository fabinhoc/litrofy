# Litrofy

Aplicativo Quasar/Vue 3 + TypeScript para calcular consumo médio de combustível (km/L) baseado em abastecimentos. Usa Supabase como backend e apresenta um design moderno com glassmorphism.

## ✨ Características

- **Design Inspirado no Genesis.live**: Interface dark elegante com paleta de cores profissional
- **Glassmorphism Refinado**: Efeitos de vidro sutis com transparências mínimas
- **Paleta Genesis**: Azul escuro (#111827), verde azulado (#16c79a), e laranja (#f97316)
- **CRUD Completo**: Gerenciamento de veículos e abastecimentos
- **Cálculos Automáticos**: Consumo por abastecimento, média e consumo total
- **Backend Supabase**: Banco de dados PostgreSQL com Row Level Security
- **TypeScript**: Tipagem estática completa
- **Responsivo**: Funciona em desktop e mobile

## 🚀 Como Executar

### Pré-requisitos

- Node.js ^28 || ^26 || ^24 || ^22.12
- pnpm >= 10.0.0

### Instalação

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Design System Inspirado no Genesis.live

O app utiliza um sistema de design inspirado no Genesis.live, com paleta de cores profissional e glassmorphism refinado:

- **GlassCard**: Componente de cartão com efeito de vidro em fundo azul escuro
- **GlassButton**: Botão com efeitos translúcidos usando cores Genesis
- **Variáveis CSS**: Sistema de cores baseado na paleta do Genesis
- **Backdrop-filter**: Efeitos de blur sutis para profundidade visual
- **Tema Dark Profissional**: Fundo gradiente de azul escuro para uma experiência imersiva

#### Paleta de Cores Genesis

As cores podem ser ajustadas em `src/css/quasar.variables.scss`:

```scss
--glass-bg-primary: rgba(0, 0, 0, 0.08); // Preto translúcido principal
--glass-bg-secondary: rgba(0, 0, 0, 0.05); // Preto translúcido secundário
--glass-text-primary: #ffffff; // Texto branco
--glass-text-secondary: rgba(255, 255, 255, 0.8); // Texto opaco
--glass-page-bg: linear-gradient(135deg, #111827 0%, #0e120b 50%, #051332 100%);

// Cores Quasar baseadas no Genesis:
$primary: #1677ff; // Azul Genesis
$secondary: #16c79a; // Verde azulado Genesis
$accent: #f97316; // Laranja Genesis
$positive: #16a34a; // Verde Genesis
$negative: #dc2626; // Vermelho Genesis
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: `vehicles`

```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT,
  year_model INTEGER,
  mileage INTEGER NOT NULL DEFAULT 0
);
```

### Tabela: `fuel_supplies`

```sql
CREATE TABLE fuel_supplies (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  mileage INTEGER NOT NULL,
  qtd DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2),
  price_per_liter DECIMAL(10,2),
  fuel TEXT NOT NULL
);
```

## 🧮 Cálculos de Consumo

### Consumo por Abastecimento

```
consumo = (km_atual - km_anterior) / litros_abastecidos
```

### Consumo Médio Geral

```
media = soma(consumos) / quantidade_de_consumos
```

### Consumo Total

```
consumo_total = (km_final - km_inicial) / soma_litros
```

## 📱 Funcionalidades

### ✅ Gerenciamento de Veículos

- Listar veículos com cards glassmorphism
- Adicionar novo veículo
- Editar informações do veículo
- Excluir veículo
- Atualização automática da quilometragem

### ✅ Gerenciamento de Abastecimentos

- Listar abastecimentos por veículo
- Adicionar abastecimento com validação
- Editar abastecimento existente
- Excluir abastecimento
- Cálculo automático de preço/litro

### ✅ Interface Moderna

- Design glassmorphism responsivo
- Animações suaves e transições
- Notificações com tema glass
- Formulários com inputs translúcidos
- Menus e diálogos com efeitos de blur

## 🛠️ Tecnologias

- **Frontend**: Quasar 2.19.3 (Vue 3 + TypeScript)
- **Estado**: Pinia 3.0.4
- **Roteamento**: Vue Router 5.0.6
- **Backend**: Supabase 2.105.0
- **Build**: Vite 8.0.10
- **Styling**: SCSS com variáveis CSS customizadas

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Lint
pnpm lint

# Type check
pnpm run type-check

# Formatar código
pnpm run format
```

## 🎨 Design System

### Componentes Glassmorphism

#### GlassCard

```vue
<glass-card :blur="20" :opacity="0.8">
  <q-card-section>
    Conteúdo do cartão
  </q-card-section>
</glass-card>
```

#### GlassButton

```vue
<glass-button variant="primary" @click="action">
  Ação
</glass-button>
```

### Variáveis CSS

- `--glass-bg-primary`: Cor de fundo primária
- `--glass-bg-secondary`: Cor de fundo secundária
- `--glass-text-primary`: Cor do texto principal
- `--glass-text-secondary`: Cor do texto secundário
- `--glass-blur`: Intensidade do blur
- `--glass-border`: Cor da borda
- `--glass-shadow`: Sombra do componente

## 🔧 Desenvolvimento

### Estrutura de Pastas

```
src/
├── components/     # Componentes reutilizáveis
│   ├── GlassCard.vue
│   └── GlassButton.vue
├── pages/          # Páginas da aplicação
├── stores/         # Estado Pinia
├── css/            # Estilos globais
└── layouts/        # Layouts da aplicação
```

### Adicionando Novos Componentes

1. Criar componente em `src/components/`
2. Importar no arquivo que vai usar
3. Usar variáveis CSS para consistência

## 📄 Licença

Este projeto está sob a licença MIT.

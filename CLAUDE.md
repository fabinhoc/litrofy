# Litrofy - App de Consumo de Combustível

## 📋 Visão Geral

Aplicativo Quasar/Vue 3 + TypeScript para calcular consumo médio de combustível (km/L) baseado em abastecimentos. Usa Supabase como backend.

**Status**: MVP funcional com CRUD completo de veículos e abastecimentos, cálculos automáticos de consumo.

## 🗄️ Estrutura do Banco de Dados (Supabase)

### Tabela: `vehicles`
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT,
  year_model INTEGER,
  mileage INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  fuel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Políticas RLS (Row Level Security)
```sql
-- Habilitar RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_supplies ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Allow all operations for authenticated users on vehicles"
  ON vehicles FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users on fuel_supplies"
  ON fuel_supplies FOR ALL USING (auth.role() = 'authenticated');
```

## 🧮 Regras de Cálculo de Consumo

### Consumo por Abastecimento
```
consumo = (km_atual - km_anterior) / litros_abastecidos
```
- Primeiro abastecimento: consumo = undefined
- Quilometragem deve ser > anterior
- Quantidade deve ser > 0

### Consumo Médio Geral
```
media = soma(consumos) / quantidade_de_consumos
```

### Consumo Total
```
consumo_total = (km_final - km_inicial) / soma_litros
```

## 🏗️ Arquitetura Técnica

### Frontend
- **Framework**: Quasar 2.19.3 (Vue 3 + TypeScript)
- **Estado**: Pinia 3.0.4
- **Roteamento**: Vue Router 5.0.6
- **Backend**: Supabase 2.105.0
- **Build**: Vite 8.0.10

### Estrutura de Pastas
```
src/
├── boot/           # Inicialização (Supabase)
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
│   ├── IndexPage.vue     # Lista de veículos
│   └── VehiclePage.vue   # Detalhes do veículo + abastecimentos
├── router/         # Configuração de rotas
├── stores/         # Estado Pinia
│   ├── vehicles.ts       # Store de veículos
│   └── supplies.ts       # Store de abastecimentos
└── layouts/        # Layouts da aplicação
```

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
# ou
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

### Quasar Config (quasar.config.ts)
- Plugins: Notify
- Boot: supabase
- DevServer: open=true

## 📦 Dependências Principais

### Produção
- @quasar/extras: ^1.18.0
- @supabase/supabase-js: ^2.105.0
- pinia: ^3.0.4
- quasar: ^2.19.3
- vue: ^3.5.33
- vue-router: ^5.0.6

### Desenvolvimento
- @quasar/app-vite: ^2.6.0
- @types/node: ^22.19.17
- eslint: ^9.39.4
- typescript: ^5.9.3
- vite-plugin-checker: ^0.12.0

## 🔧 Funcionalidades Implementadas

### ✅ CRUD Veículos
- Listar veículos
- Adicionar veículo
- Editar veículo
- Excluir veículo
- Validação de campos obrigatórios

### ✅ CRUD Abastecimentos
- Listar abastecimentos por veículo
- Adicionar abastecimento
- Editar abastecimento
- Excluir abastecimento
- Validação de quilometragem crescente
- Cálculo automático de preço/litro e total

### ✅ Cálculos de Consumo
- Consumo por abastecimento
- Média de consumo por abastecimento
- Consumo total do veículo
- Atualização automática da quilometragem do veículo

### ✅ Interface
- Design responsivo com Quasar
- Notificações de sucesso/erro
- Loading states
- Navegação entre páginas
- Formulários com validação

## 🐛 Problemas Comuns e Soluções

### 1. Erro RLS (42501)
**Sintoma**: "new row violates row-level security policy"
**Solução**: Verificar políticas RLS no Supabase ou usar chave autenticada

### 2. Erro Supabase URL
**Sintoma**: "Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL"
**Solução**: Usar URL completa (https://xxx.supabase.co) no .env

### 3. Notify não funciona
**Sintoma**: "Notify.create is not a function"
**Solução**: Verificar se 'Notify' está na lista de plugins em quasar.config.ts

### 4. Erro TypeScript exactOptionalPropertyTypes
**Sintoma**: Erros com propriedades opcionais undefined
**Solução**: Usar `number | undefined` em interfaces, filtrar arrays, usar `!` assertion

### 5. Yarn PnP conflitos
**Sintoma**: Erros de filesystem read-only
**Solução**: Usar pnpm ou configurar nodeLinker: node-modules no .yarnrc.yaml

## 📋 Checklist MVP

- [x] Estrutura do banco de dados
- [x] Integração Supabase
- [x] CRUD veículos
- [x] CRUD abastecimentos
- [x] Cálculos de consumo
- [x] Interface responsiva
- [x] Validações
- [x] Tratamento de erros
- [x] TypeScript strict
- [x] ESLint configuração

## 🔮 Extensões Futuras

- Autenticação de usuários
- Gráficos de consumo
- Separação por tipo de combustível
- Custo por km rodado
- Alertas de consumo anormal
- Exportação de dados
- Backup/restore

## 📞 Comandos Úteis

```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml && pnpm install

# Verificar tipos
pnpm run type-check

# Formatar código
pnpm run format

# Limpar build
pnpm run clean

# Executar testes (quando implementados)
pnpm run test
```

## 🎯 Pontos de Atenção

1. **Quilometragem**: Sempre crescente por veículo
2. **Primeiro abastecimento**: Não gera consumo
3. **Cálculos**: Usar apenas abastecimentos válidos
4. **RLS**: Configurar políticas adequadas para produção
5. **Performance**: Índices nas colunas mileage e vehicle_id
6. **Validação**: Cliente + servidor (Supabase constraints)

---

**Última atualização**: Abril 2026
**Versão**: 0.0.1
**Status**: MVP Completo
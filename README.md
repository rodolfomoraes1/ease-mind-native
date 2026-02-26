# Mind Ease — Mobile 📱
Hackaton final - Postech Fiap

## Escopo do projeto
Aplicativo mobile do **MindEase** — plataforma de foco e gestão de rotinas para pessoas neurodivergentes e/ou com desafios de processamento cognitivo. Compartilha o mesmo banco de dados Firebase do app web.

## Competências aplicadas
- Arquitetura (Clean Architecture, Componentização)
- Desenvolvimento Mobile (React Native, Expo)
- Acessibilidade digital e cognitiva
- Boas práticas de código (TypeScript, Clean Code)

## Requisitos funcionais

### 1. Painel Cognitivo Personalizável
Dashboard onde o usuário visualiza:

- Resumo de tarefas e estatísticas
- Navegação rápida para Kanban e Pomodoro
- Alertas cognitivos configuráveis (ex.: "você está muito tempo nesta tarefa")
- Adaptação visual baseada no perfil cognitivo do usuário

### 2. Organizador de Tarefas com Suporte Cognitivo
Sistema de tarefas com:

- Etapas visuais em Kanban (A Fazer / Em Andamento / Concluído)
- Carga cognitiva por tarefa (Leve 🟢 / Moderada 🟡 / Intensa 🔴)
- Subtarefas, tags e estimativa de Pomodoros
- Limite de tarefas por coluna baseado no perfil do usuário
- Timer com controle de foco (método Pomodoro adaptado)
- Registro histórico de sessões no Firestore

### 3. Perfil do Usuário + Configurações Persistentes
Armazenar preferências como:

- Perfil de navegação: Iniciante / Intermediário / Avançado
- Modo Foco e Modo Resumo
- Tamanho de fonte e espaçamento
- Complexidade da interface (Simplificado / Completo)
- Alertas cognitivos configuráveis

## Tecnologias utilizadas

### Stack principal

| Tecnologia | Versão |
|---|---|
| Expo | ~54.0.33 |
| React Native | 0.81.5 |
| TypeScript | ~5.9.2 |
| NativeWind | ^4.2.2 |
| Firebase | ^12.9.0 |
| React Navigation | v7 |
| react-native-reanimated | ~4.1.1 |
| react-native-svg | 15.12.1 |

### Clean Architecture

```
src/
├── shared/               # Tipos, constantes, utilitários e tema
├── domain/               # Entidades, interfaces e casos de uso
├── infrastructure/       # Firebase (config + repositories)
└── presentation/         # UI (contexts, hooks, components, screens, navigation)
```

- Camada de domínio isolada
- Casos de uso independentes de UI
- Adaptadores e interfaces claras
- Repositórios desacoplados (authRepository, taskRepository, userRepository, pomodoroRepository)

## Acessibilidade cognitiva
- Níveis ajustáveis de complexidade da interface
- Componentes de foco (Modo Foco esconde distrações)
- Timer Pomodoro com ciclos guiados (Foco → Pausa Curta → Pausa Longa)
- Carga cognitiva visual por tarefa
- Limite de WIP (work in progress) por coluna do Kanban
- Espaçamento, fonte e contraste configuráveis

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

> As credenciais são as mesmas do projeto web `mind-ease`.

### 3. Executar

```bash
# Expo Go
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

## Firebase — Coleções compartilhadas com o web

| Coleção | Descrição |
|---|---|
| `users/{uid}` | Perfil do usuário e preferências cognitivas |
| `tasks/` | Tarefas do Kanban |
| `pomodoroSessions/` | Histórico de sessões Pomodoro |

## Entregável
- Projeto no GitHub
- Subir o link do vídeo e do projeto na plataforma da FIAP em um arquivo `.docx` ou `.txt`

## Checklist de funcionalidades
- [x] Painel cognitivo personalizável
- [x] Organizador de tarefas com suporte cognitivo (Kanban + Pomodoro)
- [x] Perfil do usuário + configurações persistentes
- [x] Acessibilidade cognitiva (níveis, foco, ritmos, carga cognitiva, WIP)

## Checklist técnico
- [x] Separação clara entre módulos (domínio, infraestrutura, apresentação)
- [x] Clean Architecture com domínio isolado
- [x] Casos de uso independentes de UI
- [x] Mobile em React Native + Expo
- [x] Design System (tokens, tipografia, cores, espaçamentos via NativeWind)
- [x] Acessibilidade cognitiva implementada
- [x] State management com Context API
- [x] Segurança: autenticação via Firebase Auth, variáveis de ambiente para credenciais
- [x] Eficiência: memoização (useCallback, useMemo), hooks otimizados
- [x] Performance: cache local com AsyncStorage, lazy loading de telas

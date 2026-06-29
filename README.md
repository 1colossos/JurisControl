<div align="center">

<img src="assets/img/favicon.svg" width="84" alt="JurisControl" />

# ⚖️ JurisControl

### Sistema Web de Controle e Notificação de Prazos Processuais

**Nenhum prazo perdido. Toda atenção ao caso.**

Plataforma de gestão jurídica voltada a advogados autônomos de **São Luís** e **Itapecuru-Mirim/MA**, com contagem de prazos em dias úteis, alertas cromáticos de urgência e notificações automatizadas por e-mail e WhatsApp.

![status](https://img.shields.io/badge/status-frontend%20conclu%C3%ADdo-2ea44f?style=flat-square)
![stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS%20vanilla-e0a83a?style=flat-square)
![build](https://img.shields.io/badge/build-sem%20depend%C3%AAncias-16213e?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Principais funcionalidades](#-principais-funcionalidades)
- [As 9 telas do sistema](#-as-9-telas-do-sistema)
- [Identidade visual](#-identidade-visual)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como executar](#-como-executar)
- [Mapa de navegação](#-mapa-de-navegação)
- [Decisões de arquitetura](#-decisões-de-arquitetura)
- [Roadmap (próximas etapas)](#-roadmap-próximas-etapas)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 🎯 Sobre o projeto

O **JurisControl** centraliza, em um único ambiente, o acompanhamento de **processos**, **clientes** e **prazos processuais**, reduzindo o risco de perda de prazos — uma das principais causas de responsabilização do advogado.

Este repositório contém a **implementação completa do front-end** desenvolvida como atividade da disciplina de **Desenvolvimento Web** do curso de **Análise e Desenvolvimento de Sistemas** da **Universidade Estadual do Maranhão (UEMA) – Campus Itapecuru-Mirim**.

> O front-end foi construído fielmente a partir da documentação do TCC: descrição das telas, mapa de navegação e wireframe de baixa fidelidade — agora elevados a uma interface de alta fidelidade, moderna e responsiva.

---

## ✨ Principais funcionalidades

- 🔐 **Autenticação** — tela de login com acesso seguro ao painel.
- 📊 **Dashboard unificado** — indicadores de desempenho e sinalização cromática de urgência.
- 📁 **Gestão de processos** — listagem com busca e filtros, cadastro/edição, detalhes com linha do tempo e exclusão com confirmação.
- 👥 **Gestão de clientes** — base de contatos com cadastro em modal flutuante.
- 📅 **Calendário interativo** — navegação por mês, marcadores de eventos, feriados/suspensões e painel de detalhes do dia.
- 📈 **Relatórios e exportação** — KPIs de produtividade, gráfico de volume mensal, distribuição por urgência e exportação em PDF.
- ⚙️ **Configurações e integrações** — perfil do advogado, SMTP, Z-API (WhatsApp) e toggles de notificações globais.
- 🟢 **Contagem em dias úteis** e **alertas cromáticos** (crítico, alto, médio, baixo).
- 📱 **Layout responsivo** — adapta-se a desktop, tablet e celular.

---

## 🖥️ As 9 telas do sistema

| # | Tela | Rota | Descrição |
|---|------|------|-----------|
| 1 | **Login e Autenticação** | `#/login` | Acesso seguro com e-mail e senha; links de recuperação e cadastro. |
| 2 | **Dashboard (Visão Geral)** | `#/dashboard` | Indicadores, termos críticos, legenda de urgência e painel de notificações. |
| 3 | **Listagem de Processos** | `#/processos` | Busca, filtros por urgência/status, grade paginada e ações por linha. |
| 4 | **Cadastro / Edição de Processo** | `#/processos/novo` · `#/processos/:id/editar` | Dados do processo, prazos em dias úteis e toggles de lembretes. |
| 5 | **Detalhes do Processo** | `#/processos/:id` | Painel da causa, linha do tempo vertical, dados do cliente e arquivos. |
| 6 | **Clientes** | `#/clientes` | Tabela de contratantes, filtros e cadastro em modal flutuante. |
| 7 | **Calendário Interativo** | `#/calendario` | Malha mensal dinâmica, eventos, feriados e detalhes do dia. |
| 8 | **Relatórios e Exportação** | `#/relatorios` | Filtros de período, KPIs, gráficos e exportação em PDF. |
| 9 | **Configurações e Integrações** | `#/configuracoes` | Abas de Perfil, E-mail (SMTP), WhatsApp (Z-API) e Alertas. |

---

## 🎨 Identidade visual

| Token | Cor | Uso |
|-------|-----|-----|
| Navy profundo | `#0e1a36` → `#16213e` | Barra lateral, botões primários, títulos |
| Dourado | `#e0a83a` | Acento, item ativo, marca |
| Crítico | `#e0413a` | Prazos ≤ 3 dias úteis |
| Alto | `#e0a83a` | Prazos ≤ 7 dias úteis |
| Médio | `#3b5bdb` | Prazos ≤ 15 dias úteis |
| Baixo | `#1f9d57` | Prazos > 15 dias |

**Tipografia:** *Playfair Display* (títulos, serifada e sóbria) + *Inter* (corpo) + *JetBrains Mono* (números de processo).

---

## 🧰 Tecnologias

- **HTML5** semântico
- **CSS3** com *design system* próprio (variáveis, grid, flexbox, responsividade)
- **JavaScript (ES5/ES6) puro** — sem frameworks e **sem etapa de build**
- **SPA com roteamento por hash** (`#/rota`)
- **Google Fonts** (Playfair Display, Inter, JetBrains Mono)
- **SVG inline** para ícones e logotipo

> Escolha intencional por **zero dependências**: o projeto abre direto no navegador, é leve, auditável e fácil de hospedar (GitHub Pages, Netlify, Vercel ou qualquer servidor estático).

---

## 📂 Estrutura do projeto

```
JurisControl/
├── index.html              # Casca da aplicação (carrega CSS e scripts)
├── assets/
│   ├── css/
│   │   └── styles.css      # Design system completo
│   ├── img/
│   │   └── favicon.svg     # Logotipo (balança da justiça)
│   └── js/
│       ├── data.js         # Camada de dados (mock) — processos, clientes, eventos
│       ├── icons.js        # Biblioteca de ícones SVG
│       ├── ui.js           # Componentes compartilhados (sidebar, topbar, modal, toast)
│       ├── pages.js        # Renderizadores das 9 telas
│       └── app.js          # Roteador (hash) e interações globais
├── LICENSE
└── README.md
```

---

## ▶️ Como executar

Por ser um site estático, **não há instalação de dependências**.

### Opção 1 — Abrir direto
Basta abrir o arquivo `index.html` no navegador (duplo clique).

### Opção 2 — Servidor local (recomendado)
Para uma experiência idêntica à de produção:

```bash
# Com Python 3
python3 -m http.server 8080

# ou com Node.js
npx serve .
```
Depois acesse **http://localhost:8080**.

### Acesso
A tela de login já vem com credenciais de demonstração preenchidas — clique em **Entrar** (ou em **"Ver demonstração"**) para acessar o painel.

---

## 🗺️ Mapa de navegação

```
                         ┌──────────────────────┐
                         │  1. Login / Autent.   │
                         └───────────┬──────────┘
                                     │
                         ┌───────────▼──────────┐
                         │  2. Dashboard         │
                         └───────────┬──────────┘
        ┌──────────────┬─────────────┼──────────────┬───────────────┐
        ▼              ▼             ▼              ▼               ▼
 3. Processos     6. Clientes   7. Calendário  8. Relatórios   9. Configurações
   │     │
   ▼     ▼
 4. Cadastro/   5. Detalhes
    Edição         do Processo
```

---

## 🏗️ Decisões de arquitetura

- **SPA sem framework:** todo o estado de UI (filtros, paginação, aba ativa, dia selecionado) vive em um objeto `JA_STATE`; o roteador re-renderiza a tela ativa a cada mudança de hash ou de filtro.
- **Renderização por funções puras:** cada tela é uma função que devolve HTML como *string*, facilitando leitura e manutenção.
- **Delegação de eventos:** um único *listener* de clique trata navegação, ações nomeadas (`data-action`), o calendário e as linhas clicáveis — eficiente e sem *memory leaks*.
- **Dados isolados:** `data.js` simula a resposta de uma API; a futura integração com back-end troca apenas essa camada.
- **Acessibilidade:** uso de `aria-label`, foco visível e contraste adequado.

---

## 🚀 Roadmap (próximas etapas)

- [ ] Integração com **API back-end** (autenticação real e persistência).
- [ ] Cálculo automático de prazos com **calendário oficial de feriados** do TJMA.
- [ ] Disparo real de notificações via **SMTP** e **Z-API (WhatsApp)**.
- [ ] Geração de **PDF** dos relatórios no servidor.
- [ ] Upload e visualização de **documentos** dos processos.

---

## 👨‍💻 Autores

- **Afonso Gabriel Ferreira Bezerra**
- **Andrey Nicollas Costa de Sousa**

Orientação: **Prof. Wesley Batista Dominices de Araujo**
Universidade Estadual do Maranhão (UEMA) — Campus Itapecuru-Mirim
Curso de Análise e Desenvolvimento de Sistemas · 2026

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

<div align="center">
<sub>Feito com ⚖️ e ☕ para advogados que não podem perder um único prazo.</sub>
</div>

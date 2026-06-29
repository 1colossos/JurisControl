/* ============================================================
   JurisControl — Camada de dados (mock)
   Dados fictícios coerentes com o wireframe do TCC. Servem para
   demonstrar a interface; em produção viriam de uma API/back-end.
   ============================================================ */
(function () {
  "use strict";

  // Perfil do advogado autenticado (Dra. Helena Carvalho).
  const usuario = {
    nome: "Dra. Helena Carvalho",
    iniciais: "HC",
    oab: "OAB/SP 123.456",
    email: "helena@carvalhoadvogados.com.br",
    telefone: "(11) 99988-7766",
    escritorio: "Carvalho & Associados Advocacia",
    uf: "SP",
  };

  // Indicadores do Dashboard.
  const kpis = [
    { id: "ativos",     icon: "file",    box: "box-doc",  num: 5,  label: "Processos ativos",  trend: "+3 este mês" },
    { id: "criticos",   icon: "alert",   box: "box-crit", num: 2,  label: "Prazos críticos",   trend: "≤ 3 dias úteis" },
    { id: "proximos",   icon: "clock",   box: "box-warn", num: 1,  label: "Prazos próximos",   trend: "≤ 7 dias úteis" },
    { id: "concluidos", icon: "check",   box: "box-ok",   num: 24, label: "Concluídos no mês", trend: "+12% vs anterior" },
  ];

  // Clientes do escritório.
  const clientes = [
    { id: "c1", nome: "Construtora Aurora Ltda.", doc: "12.345.678/0001-90", email: "contato@aurora.com.br",       tel: "(11) 3344-5566",  tipo: "PJ", processos: 4 },
    { id: "c2", nome: "Marina Vasconcelos",        doc: "123.456.789-00",      email: "marina.v@email.com",          tel: "(11) 98877-6655", tipo: "PF", processos: 2 },
    { id: "c3", nome: "Pedro Henrique Sales",      doc: "987.654.321-00",      email: "pedrohs@gmail.com",           tel: "(11) 99988-1122", tipo: "PF", processos: 1 },
    { id: "c4", nome: "Tech Holding S.A.",         doc: "98.765.432/0001-10",  email: "juridico@techholding.com",    tel: "(11) 4002-8922",  tipo: "PJ", processos: 7 },
    { id: "c5", nome: "Família Antunes",           doc: "456.789.123-00",      email: "antunes.familia@email.com",   tel: "(11) 97766-3344", tipo: "PF", processos: 1 },
  ];

  // Processos (a urgência é derivada dos dias úteis até o prazo).
  const processos = [
    { id: "p1", numero: "0001234-56.2024.8.26.0100", cliente: "Construtora Aurora Ltda.", tipo: "Contestação",     vara: "3ª Vara Cível - SP",          prazo: "2026-06-13", diasUteis: 1,  urgencia: "critico", status: "Em andamento", objeto: "Ação de cobrança — débitos de obra", valor: "R$ 25.000,00" },
    { id: "p2", numero: "0009876-54.2024.5.02.0070", cliente: "Marina Vasconcelos",       tipo: "Recurso Ordinário", vara: "70ª Vara do Trabalho - SP",  prazo: "2026-06-16", diasUteis: 4,  urgencia: "alto",    status: "Em andamento", objeto: "Reclamação trabalhista — verbas rescisórias", valor: "R$ 48.300,00" },
    { id: "p3", numero: "0004567-89.2023.8.26.0011", cliente: "Pedro Henrique Sales",     tipo: "Réplica",         vara: "11ª Vara Cível - SP",         prazo: "2026-06-22", diasUteis: 10, urgencia: "medio",   status: "Em andamento", objeto: "Ação de indenização por danos morais", valor: "R$ 15.000,00" },
    { id: "p4", numero: "0007890-12.2024.8.26.0224", cliente: "Tech Holding S.A.",        tipo: "Memoriais",       vara: "2ª Vara Empresarial - SP",    prazo: "2026-07-01", diasUteis: 19, urgencia: "baixo",   status: "Em andamento", objeto: "Dissolução parcial de sociedade", valor: "R$ 320.000,00" },
    { id: "p5", numero: "0002345-67.2025.8.26.0053", cliente: "Família Antunes",          tipo: "Contrarrazões",   vara: "5ª Vara de Família - SP",     prazo: "2026-06-14", diasUteis: 2,  urgencia: "critico", status: "Em andamento", objeto: "Ação de alimentos", valor: "R$ 3.600,00" },
    { id: "p6", numero: "0008765-43.2024.4.03.6100", cliente: "ImportaBrasil Comércio",   tipo: "Embargos",        vara: "8ª Vara Federal - SP",        prazo: "2026-06-28", diasUteis: 16, urgencia: "baixo",   status: "Suspenso",     objeto: "Embargos à execução fiscal", valor: "R$ 92.450,00" },
  ];

  // Notificações automáticas enviadas na semana (painel do Dashboard).
  const notificacoes = [
    { canal: "E-mail (SMTP)",      valor: "32 enviados" },
    { canal: "WhatsApp (Z-API)",   valor: "18 enviados" },
    { canal: "Notificações no app", valor: "47 entregues" },
  ];

  // Legenda cromática de urgência.
  const legenda = [
    { key: "critico", titulo: "Crítico", desc: "Vencimento em até 3 dias úteis" },
    { key: "alto",    titulo: "Alto",    desc: "Vencimento em até 7 dias úteis" },
    { key: "medio",   titulo: "Médio",   desc: "Vencimento em até 15 dias úteis" },
    { key: "baixo",   titulo: "Baixo",   desc: "Vencimento superior a 15 dias" },
  ];

  // Eventos do calendário — chave AAAA-MM-DD.
  const eventos = {
    "2026-06-04": [{ tipo: "prazo", nome: "Prazo: Embargos de declaração" }],
    "2026-06-12": [{ tipo: "feriado", nome: "Ponto facultativo — Forum (suspensão)" }],
    "2026-06-13": [{ tipo: "prazo", nome: "Prazo: Contestação — Aurora" }],
    "2026-06-14": [{ tipo: "prazo", nome: "Prazo: Contrarrazões — Família Antunes" }],
    "2026-06-16": [{ tipo: "prazo", nome: "Prazo: Recurso Ordinário — Marina V." }],
    "2026-06-18": [{ tipo: "audiencia", nome: "Audiência de instrução — Pedro H. Sales" }],
    "2026-06-22": [{ tipo: "prazo", nome: "Prazo: Réplica — Pedro Henrique Sales" }],
    "2026-06-25": [{ tipo: "reuniao", nome: "Reunião com cliente — Tech Holding" }],
    "2026-06-28": [{ tipo: "prazo", nome: "Prazo: Embargos — ImportaBrasil" }],
  };

  // Feriados / dias de suspensão (destacam a célula do calendário).
  const feriados = ["2026-06-12"];

  // Linha do tempo de um processo (tela de Detalhes).
  const timeline = [
    { data: "10/02/2024", titulo: "Distribuição", desc: "Processo distribuído para a 3ª Vara Cível de São Paulo.", done: true },
    { data: "20/03/2024", titulo: "Despacho",     desc: "Despacho inicial proferido; determinada a citação da parte requerida.", done: true },
    { data: "05/05/2024", titulo: "Audiência",    desc: "Audiência de conciliação realizada — sem acordo.", done: true },
    { data: "15/05/2024", titulo: "Manifestação", desc: "Prazo para manifestação da parte requerida.", done: false },
  ];

  const arquivos = [
    { nome: "Petição inicial.pdf", tamanho: "1,2 MB" },
    { nome: "Procuração.pdf",      tamanho: "320 KB" },
    { nome: "Comprovantes.pdf",    tamanho: "2,8 MB" },
  ];

  // Relatórios.
  const relatorio = {
    totais: { total: 30, cumpridos: 24, pendentes: 4, perdidos: 0 },
    volumeMensal: [
      { mes: "Jan", v: 18 }, { mes: "Fev", v: 22 }, { mes: "Mar", v: 31 },
      { mes: "Abr", v: 27 }, { mes: "Mai", v: 34 }, { mes: "Jun", v: 41 },
    ],
    distribuicao: [
      { key: "critico", titulo: "Crítico", qtd: 2, pct: 33 },
      { key: "alto",    titulo: "Alto",    qtd: 1, pct: 17 },
      { key: "medio",   titulo: "Médio",   qtd: 1, pct: 17 },
      { key: "baixo",   titulo: "Baixo",   qtd: 2, pct: 33 },
    ],
  };

  const rotulosUrgencia = { critico: "Crítico", alto: "Alto", medio: "Médio", baixo: "Baixo" };

  // Exposto globalmente para os demais scripts.
  window.JA_DATA = {
    usuario, kpis, clientes, processos, notificacoes, legenda,
    eventos, feriados, timeline, arquivos, relatorio, rotulosUrgencia,
  };
})();

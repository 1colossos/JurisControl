/* ============================================================
   JurisAlerta — Renderizadores de telas (9 telas do TCC)
   Cada função devolve o HTML da tela. O estado de filtros vive
   em JA_STATE; o roteador (app.js) decide qual tela montar.
   ============================================================ */
(function () {
  "use strict";

  const D = window.JA_DATA;
  const U = window.JA_UI;
  const esc = U.esc;

  // Estado de UI volátil (filtros, paginação, etc.).
  const state = {
    procBusca: "", procUrg: "", procStatus: "", procPagina: 1,
    cliBusca: "", cliTipo: "",
    calMes: 5, calAno: 2026, calSel: "2026-06-13",
    configTab: "perfil",
    notifGlobal: true,
  };
  window.JA_STATE = state;

  const PAGE_SIZE = 6;

  /* =====================================================
     TELA 1 — LOGIN E AUTENTICAÇÃO
     ===================================================== */
  function login() {
    return (
      '<div class="login">' +
        '<aside class="login-aside">' +
          U.brand(true) +
          '<div class="lp-content">' +
            "<h1>Nenhum prazo perdido.<span class=\"accent\">Toda atenção ao caso.</span></h1>" +
            '<p class="lead">Controle inteligente de prazos processuais com contagem em dias úteis, alertas cromáticos de urgência e integração com calendários oficiais.</p>' +
          "</div>" +
          '<div class="login-foot">© 2026 JurisAlerta. Todos os direitos reservados.</div>' +
        "</aside>" +
        '<main class="login-main">' +
          '<form class="login-form" data-form="login">' +
            "<h2>Entrar</h2>" +
            '<p class="sub">Acesso seguro à plataforma do escritório.</p>' +
            '<div class="field"><label for="email">E-mail</label>' +
              '<div class="input-wrap">' + icon("mail", "lead-ic") +
                '<input id="email" type="email" value="advogado@escritorio.adv.br" autocomplete="username" /></div>' +
            "</div>" +
            '<div class="field"><div class="field-row"><label for="senha">Senha</label>' +
              '<a href="#/recuperar" class="link-gold">Esqueci minha senha</a></div>' +
              '<div class="input-wrap">' + icon("lock", "lead-ic") +
                '<input id="senha" type="password" value="senha123" autocomplete="current-password" />' +
                '<span class="trail-ic" data-action="toggle-pass">' + icon("eye") + "</span></div>" +
            "</div>" +
            '<button type="submit" class="btn btn-primary btn-block btn-lg">Entrar ' + icon("arrowRight") + "</button>" +
            '<p style="text-align:center;margin:18px 0 0;color:var(--text-2)">Não possui conta? ' +
              '<a href="#/cadastro" class="link-gold">Criar nova conta</a></p>' +
            '<p style="text-align:center;margin:22px 0 0"><a href="#/dashboard" class="link-gold">Ver demonstração →</a></p>' +
          "</form>" +
        "</main>" +
      "</div>"
    );
  }

  /* =====================================================
     TELA 2 — DASHBOARD (VISÃO GERAL)
     ===================================================== */
  function dashboard() {
    const kpis = D.kpis
      .map(
        (k) =>
          '<div class="kpi"><div class="top">' +
            '<div class="ic-box ' + k.box + '">' + icon(k.icon) + "</div>" +
            '<span class="trend">' + icon("trendUp") + esc(k.trend) + "</span></div>" +
          '<div class="num">' + k.num + '</div><div class="lbl">' + esc(k.label) + "</div></div>"
      )
      .join("");

    // Termos críticos: ordena por dias úteis (mais urgente primeiro).
    const ordenados = D.processos.slice().sort((a, b) => a.diasUteis - b.diasUteis);
    const critRows = ordenados
      .map(
        (p) =>
          '<a class="crit-row row-link" href="#/processos/' + p.id + '">' +
            '<span class="udot" style="background:var(--' + p.urgencia + ')"></span>' +
            '<div class="meta"><div class="line1"><span class="num mono">' + esc(p.numero) + "</span>" +
              U.badgeUrgencia(p.urgencia) + "</div>" +
              '<div class="ttl">' + esc(p.tipo) + " — " + esc(p.cliente) + "</div></div>" +
            '<div class="date"><div class="d">' + U.fmtData(p.prazo) + "</div>" +
              '<div class="u">' + U.diasUteisLabel(p.diasUteis) + "</div></div>" +
          "</a>"
      )
      .join("");

    const legenda = D.legenda
      .map(
        (l) =>
          '<div class="legend-row"><span class="udot" style="background:var(--' + l.key + ')"></span>' +
            "<div><div class=\"lt\">" + esc(l.titulo) + '</div><div class="ls">' + esc(l.desc) + "</div></div></div>"
      )
      .join("");

    const notifs = D.notificacoes
      .map(
        (n) =>
          '<div class="stat-row"><span>' + esc(n.canal) + '</span><span class="v">' + esc(n.valor) + "</span></div>"
      )
      .join("");

    const content =
      '<div class="kpis mb-20">' + kpis + "</div>" +
      '<div class="grid" style="grid-template-columns:1.7fr 1fr;align-items:start">' +
        '<div class="card card-pad">' +
          U.sectionHead("Termos críticos", "Processos com prazos sinalizados por cor de urgência",
            '<a class="see-all" href="#/processos">Ver todos ' + icon("arrowUpRight") + "</a>") +
          '<div class="crit-list mt-8">' + critRows + "</div>" +
        "</div>" +
        '<div class="grid">' +
          '<div class="card card-pad"><h3 style="font-size:20px;margin-bottom:8px">Legenda de urgência</h3>' + legenda + "</div>" +
          '<div class="dark-panel"><h3>Notificações ativas</h3>' +
            '<p class="sub">Lembretes automáticos enviados nesta semana</p>' + notifs +
            '<a href="#/configuracoes" class="btn btn-gold btn-block mt-16">Configurar integrações</a>' +
          "</div>" +
        "</div>" +
      "</div>";

    return U.shell("dashboard", "Visão Geral", "Painel unificado de prioridades processuais", content);
  }

  /* =====================================================
     TELA 3 — LISTAGEM DE PROCESSOS
     ===================================================== */
  function filtrarProcessos() {
    const q = state.procBusca.trim().toLowerCase();
    return D.processos.filter((p) => {
      if (state.procUrg && p.urgencia !== state.procUrg) return false;
      if (state.procStatus && p.status !== state.procStatus) return false;
      if (q && !(p.numero.toLowerCase().includes(q) || p.cliente.toLowerCase().includes(q) || p.objeto.toLowerCase().includes(q) || p.tipo.toLowerCase().includes(q))) return false;
      return true;
    });
  }

  function processos() {
    const lista = filtrarProcessos();
    const rows =
      lista.length === 0
        ? '<tr><td colspan="7"><div class="empty">' + icon("file") + "<div>Nenhum processo encontrado com os filtros atuais.</div></div></td></tr>"
        : lista
            .map(
              (p) =>
                '<tr class="row-link" data-goto="#/processos/' + p.id + '">' +
                  '<td><span class="mono t-strong">' + esc(p.numero) + "</span></td>" +
                  '<td class="t-strong">' + esc(p.cliente) + "</td>" +
                  '<td class="t-sub">' + esc(p.tipo) + "</td>" +
                  '<td class="t-sub">' + esc(p.vara) + "</td>" +
                  "<td><div class=\"t-strong\">" + U.fmtData(p.prazo) + '</div><div class="t-sub" style="font-size:12px">' + U.diasUteisLabel(p.diasUteis) + "</div></td>" +
                  "<td>" + U.badgeUrgencia(p.urgencia) + "</td>" +
                  "<td>" + U.badgeStatus(p.status) +
                    '<span class="row-actions" style="margin-left:8px" data-stop>' +
                      '<button data-goto="#/processos/' + p.id + '" title="Ver detalhes">' + icon("eye") + "</button>" +
                      '<button data-goto="#/processos/' + p.id + '/editar" title="Editar">' + icon("edit") + "</button>" +
                      '<button class="del" data-del-proc="' + p.id + '" title="Excluir">' + icon("trash") + "</button>" +
                    "</span>" +
                  "</td>" +
                "</tr>"
            )
            .join("");

    const content =
      '<div class="flex justify-between items-center mb-20 wrap gap-12">' +
        "<div></div>" +
        '<a href="#/processos/novo" class="btn btn-primary">' + icon("plus") + "Novo processo</a>" +
      "</div>" +
      '<div class="card card-pad mb-20">' +
        '<div class="toolbar">' +
          '<div class="search-input">' + icon("search") +
            '<input type="text" placeholder="Buscar por número, cliente ou objeto..." data-filter="procBusca" value="' + esc(state.procBusca) + '" /></div>' +
          '<select class="select" data-filter="procUrg">' +
            opts([["", "Todas urgências"], ["critico", "Crítico"], ["alto", "Alto"], ["medio", "Médio"], ["baixo", "Baixo"]], state.procUrg) +
          "</select>" +
          '<select class="select" data-filter="procStatus">' +
            opts([["", "Todos status"], ["Em andamento", "Em andamento"], ["Suspenso", "Suspenso"]], state.procStatus) +
          "</select>" +
          '<button class="btn btn-ghost btn-icon" title="Mais filtros">' + icon("filter") + "</button>" +
        "</div>" +
      "</div>" +
      '<div class="card">' +
        '<div class="table-wrap"><table class="data"><thead><tr>' +
          "<th>Número</th><th>Cliente</th><th>Tipo</th><th>Vara</th><th>Prazo</th><th>Urgência</th><th>Status</th>" +
        "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
        '<div class="table-foot"><span>Mostrando ' + lista.length + " de " + D.processos.length + " processos</span>" +
          '<div class="pager"><button disabled>Anterior</button><button class="active">1</button><button>2</button><button>Próxima</button></div>' +
        "</div>" +
      "</div>";

    return U.shell("processos", "Processos", "Portfólio completo de demandas do escritório", content);
  }

  /* =====================================================
     TELA 4 — CADASTRO / EDIÇÃO DE PROCESSO E PRAZOS
     ===================================================== */
  function processoForm(id) {
    const p = id ? D.processos.find((x) => x.id === id) : null;
    const titulo = p ? "Editar Processo" : "Novo Processo";
    const v = (x) => (p ? esc(p[x] || "") : "");

    const clientesOpts = D.clientes
      .map((c) => '<option ' + (p && p.cliente === c.nome ? "selected" : "") + ">" + esc(c.nome) + "</option>")
      .join("");

    const content =
      '<a class="page-back" data-goto="#/processos">' + icon("arrowLeft") + "Voltar para processos</a>" +
      '<form data-form="processo" data-id="' + (id || "") + '">' +
        '<div class="card card-pad mb-20">' +
          '<div class="form-grid">' +
            // Coluna 1 — dados do processo
            '<div class="form-section">' +
              "<h3>Dados do processo</h3><p class=\"desc\">Identificação e vínculo do feito.</p>" +
              '<div class="field"><label>Número do processo *</label>' +
                '<input type="text" placeholder="0000000-00.0000.0.00.0000" value="' + v("numero") + '" required></div>' +
              '<div class="field"><label>Cliente vinculado *</label>' +
                '<select required><option value="" disabled ' + (p ? "" : "selected") + ">Selecione o cliente</option>" + clientesOpts + "</select></div>" +
              '<div class="form-2col">' +
                '<div class="field"><label>Tipo / Assunto *</label>' +
                  '<select>' + opts([["Contestação"], ["Réplica"], ["Recurso Ordinário"], ["Contrarrazões"], ["Memoriais"], ["Embargos"]].map((a) => [a[0], a[0]]), p ? p.tipo : "") + "</select></div>" +
                '<div class="field"><label>Vara / Órgão</label>' +
                  '<input type="text" placeholder="Ex.: 3ª Vara Cível - SP" value="' + v("vara") + '"></div>' +
              "</div>" +
              '<div class="field"><label>Objeto do processo</label>' +
                '<textarea rows="2" placeholder="Breve descrição do objeto da ação">' + v("objeto") + "</textarea></div>" +
            "</div>" +
            // Coluna 2 — prazos e lembretes
            '<div class="form-section">' +
              "<h3>Prazos e lembretes</h3><p class=\"desc\">Contagem em dias úteis com calendário oficial.</p>" +
              '<div class="form-2col">' +
                '<div class="field"><label>Termo inicial</label><input type="date" value="2026-06-02"></div>' +
                '<div class="field"><label>Regra de contagem</label><select>' + opts([["uteis", "Dias úteis"], ["corridos", "Dias corridos"]], "uteis") + "</select></div>" +
              "</div>" +
              '<div class="form-2col">' +
                '<div class="field"><label>Prazo final *</label><input type="date" value="' + v("prazo") + '"></div>' +
                '<div class="field"><label>Valor da causa</label><input type="text" placeholder="R$ 0,00" value="' + v("valor") + '"></div>' +
              "</div>" +
              '<label style="font-weight:600;font-size:13px;display:block;margin:8px 0 8px">Ativar lembretes automáticos</label>' +
              toggleRow("Lembrete — 15 dias antes", "E-mail e WhatsApp", true) +
              toggleRow("Lembrete — 7 dias antes", "E-mail e WhatsApp", true) +
              toggleRow("Lembrete — 3 dias antes", "Alerta crítico no app", true) +
              toggleRow("Lembrete — 1 dia antes", "Notificação push", false) +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="flex justify-between items-center">' +
          '<button type="button" class="btn btn-ghost" data-goto="#/processos">Cancelar</button>' +
          '<button type="submit" class="btn btn-primary">' + icon("save") + "Salvar processo</button>" +
        "</div>" +
      "</form>";

    return U.shell("processos", titulo, "Cadastro de processo e configuração de prazos", content, true);
  }

  /* =====================================================
     TELA 5 — DETALHES DO PROCESSO
     ===================================================== */
  function processoDetalhe(id) {
    const p = D.processos.find((x) => x.id === id);
    if (!p) return U.shell("processos", "Processo não encontrado", "", '<div class="card card-pad"><div class="empty">' + icon("file") + "<div>Processo inexistente.</div></div></div>");

    const cli = D.clientes.find((c) => c.nome === p.cliente);

    const tl = D.timeline
      .map(
        (t) =>
          '<div class="tl-item' + (t.done ? " done" : "") + '">' +
            '<div class="tl-date">' + esc(t.data) + "</div>" +
            '<div class="tl-ttl">' + esc(t.titulo) + "</div>" +
            '<div class="tl-desc">' + esc(t.desc) + "</div></div>"
      )
      .join("");

    const files = D.arquivos
      .map(
        (a) =>
          '<div class="file-row">' + icon("pdf") + '<span class="fn">' + esc(a.nome) + "</span>" +
            '<span class="fs">' + esc(a.tamanho) + "</span></div>"
      )
      .join("");

    const info = [
      ["Número do processo", '<span class="mono">' + esc(p.numero) + "</span>"],
      ["Cliente", esc(p.cliente)],
      ["Tipo / Assunto", esc(p.tipo)],
      ["Vara / Órgão", esc(p.vara)],
      ["Objeto", esc(p.objeto)],
      ["Valor da causa", esc(p.valor)],
    ]
      .map((r) => '<div class="info-pair"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + "</span></div>")
      .join("");

    const content =
      '<a class="page-back" data-goto="#/processos">' + icon("arrowLeft") + "Voltar para processos</a>" +
      '<div class="flex justify-between items-center mb-20 wrap gap-12">' +
        "<div class=\"flex items-center gap-12\">" + U.badgeUrgencia(p.urgencia) + U.badgeStatus(p.status) +
          '<span class="t-sub">Prazo: <strong style="color:var(--ink)">' + U.fmtData(p.prazo) + "</strong> · " + U.diasUteisLabel(p.diasUteis) + "</span></div>" +
        "<div class=\"flex gap-8\">" +
          '<a href="#/processos/' + p.id + '/editar" class="btn btn-ghost">' + icon("edit") + "Editar</a>" +
          '<button class="btn btn-danger" data-del-proc="' + p.id + '">' + icon("trash") + "Excluir</button>" +
        "</div>" +
      "</div>" +
      '<div class="detail-grid">' +
        "<div class=\"grid\">" +
          '<div class="card card-pad"><h3 style="font-size:18px;margin-bottom:6px">' + esc(p.tipo) + "</h3>" +
            '<p class="t-sub" style="margin:0 0 6px">' + esc(p.objeto) + "</p>" + info + "</div>" +
          '<div class="card card-pad">' + U.sectionHead("Linha do tempo", "Andamentos do processo") +
            '<div class="timeline mt-16">' + tl + "</div></div>" +
        "</div>" +
        "<div class=\"grid\">" +
          '<div class="card card-pad"><h3 style="font-size:18px;margin-bottom:14px">Dados do cliente</h3>' +
            (cli
              ? '<div class="cli-cell" style="margin-bottom:14px"><span class="cli-avatar">' + iniciais(cli.nome) + '</span><div><div class="t-strong">' + esc(cli.nome) + '</div><div class="t-sub" style="font-size:12px">' + esc(cli.doc) + "</div></div></div>" +
                '<div class="contact-line" style="margin-bottom:8px">' + icon("mail") + esc(cli.email) + "</div>" +
                '<div class="contact-line">' + icon("phone") + esc(cli.tel) + "</div>"
              : '<p class="t-sub">Cliente não localizado.</p>") +
          "</div>" +
          '<div class="card card-pad"><h3 style="font-size:18px;margin-bottom:14px">Arquivos anexados</h3>' + files +
            '<button class="btn btn-ghost btn-block mt-8">' + icon("plus") + "Adicionar arquivo</button></div>" +
        "</div>" +
      "</div>";

    return U.shell("processos", "Processo " + p.numero, "Detalhes e andamentos da demanda", content, true);
  }

  /* =====================================================
     TELA 6 — LISTAGEM E CADASTRO DE CLIENTES
     ===================================================== */
  function filtrarClientes() {
    const q = state.cliBusca.trim().toLowerCase();
    return D.clientes.filter((c) => {
      if (state.cliTipo && c.tipo !== state.cliTipo) return false;
      if (q && !(c.nome.toLowerCase().includes(q) || c.doc.toLowerCase().includes(q))) return false;
      return true;
    });
  }

  function clientes() {
    const lista = filtrarClientes();
    const rows =
      lista.length === 0
        ? '<tr><td colspan="5"><div class="empty">' + icon("users") + "<div>Nenhum cliente encontrado.</div></div></td></tr>"
        : lista
            .map(
              (c) =>
                "<tr>" +
                  '<td><div class="cli-cell"><span class="cli-avatar">' + iniciais(c.nome) + '</span><span class="t-strong">' + esc(c.nome) + "</span></div></td>" +
                  '<td><span class="mono t-sub">' + esc(c.doc) + "</span></td>" +
                  '<td><div class="contact-line">' + icon("mail") + esc(c.email) + "</div>" +
                    '<div class="contact-line" style="margin-top:4px">' + icon("phone") + esc(c.tel) + "</div></td>" +
                  "<td>" + tipoBadge(c.tipo) + "</td>" +
                  '<td style="text-align:right"><span class="t-strong" style="font-size:16px">' + c.processos + "</span></td>" +
                "</tr>"
            )
            .join("");

    const content =
      '<div class="flex justify-between items-center mb-20 wrap gap-12"><div></div>' +
        '<button class="btn btn-primary" data-action="novo-cliente">' + icon("plus") + "Novo cliente</button></div>" +
      '<div class="card card-pad mb-20"><div class="toolbar">' +
        '<div class="search-input">' + icon("search") +
          '<input type="text" placeholder="Buscar por nome ou documento..." data-filter="cliBusca" value="' + esc(state.cliBusca) + '" /></div>' +
        '<select class="select" data-filter="cliTipo">' +
          opts([["", "Todos tipos"], ["PF", "Pessoa Física"], ["PJ", "Pessoa Jurídica"]], state.cliTipo) + "</select>" +
      "</div></div>" +
      '<div class="card"><div class="table-wrap"><table class="data"><thead><tr>' +
        "<th>Cliente</th><th>Documento</th><th>Contato</th><th>Tipo</th><th style=\"text-align:right\">Processos</th>" +
      "</tr></thead><tbody>" + rows + "</tbody></table></div>" +
      '<div class="table-foot"><span>' + lista.length + " cliente(s)</span></div></div>";

    return U.shell("clientes", "Clientes", "Base de contatos e contratantes do escritório", content);
  }

  function modalCliente() {
    const body =
      '<form data-form="cliente">' +
        '<div class="form-2col">' +
          '<div class="field"><label>Nome / Razão social *</label><input type="text" placeholder="Nome completo" required></div>' +
          '<div class="field"><label>Tipo</label><select>' + opts([["PF", "Pessoa Física"], ["PJ", "Pessoa Jurídica"]], "PF") + "</select></div>" +
        "</div>" +
        '<div class="field"><label>CPF / CNPJ *</label><input type="text" placeholder="000.000.000-00" required></div>' +
        '<div class="form-2col">' +
          '<div class="field"><label>E-mail</label><input type="email" placeholder="cliente@email.com"></div>' +
          '<div class="field"><label>Telefone</label><input type="tel" placeholder="(00) 00000-0000"></div>' +
        "</div>" +
      "</form>";
    const foot =
      '<button class="btn btn-ghost" data-action="close-modal">Cancelar</button>' +
      '<button class="btn btn-primary" data-action="salvar-cliente">' + icon("save") + "Salvar cliente</button>";
    U.openModal("Novo cliente", body, foot);
  }

  /* =====================================================
     TELA 7 — CALENDÁRIO INTERATIVO
     ===================================================== */
  const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const TIPO_LABEL = { prazo: "Prazo processual", audiencia: "Audiência", reuniao: "Reunião", feriado: "Feriado / suspensão" };

  function calendario() {
    const ano = state.calAno, mes = state.calMes;
    const primeiroDia = new Date(ano, mes, 1).getDay(); // 0=Dom
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const hoje = "2026-06-29";

    let cells = "";
    for (let i = 0; i < primeiroDia; i++) cells += '<div class="cal-cell muted-cell"></div>';
    for (let d = 1; d <= diasNoMes; d++) {
      const iso = ano + "-" + String(mes + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
      const dow = new Date(ano, mes, d).getDay();
      const evs = D.eventos[iso] || [];
      const isHoliday = D.feriados.includes(iso);
      const classes = ["cal-cell"];
      if (dow === 0 || dow === 6) classes.push("weekend");
      if (isHoliday) classes.push("holiday");
      if (iso === hoje) classes.push("today");
      if (iso === state.calSel) classes.push("selected");
      const dots = evs
        .filter((e) => e.tipo !== "feriado")
        .map((e) => '<span class="d d-' + e.tipo + '"></span>')
        .join("");
      cells +=
        '<div class="' + classes.join(" ") + '" data-cal-day="' + iso + '">' +
          '<span class="dn">' + d + "</span>" +
          (dots ? '<span class="cal-dots">' + dots + "</span>" : "") +
        "</div>";
    }

    const legend = [
      ["d-prazo", "Prazo processual", ""], ["d-audiencia", "Audiência", ""],
      ["d-reuniao", "Reunião", ""], ["", "Feriado / suspensão", "holiday"], ["", "Fim de semana", "weekend"],
    ]
      .map((l) => {
        const sw = l[2] === "holiday"
          ? '<span class="sw box" style="background:var(--critico-bg);border:1px solid #f3c9c7"></span>'
          : l[2] === "weekend"
          ? '<span class="sw box" style="background:#eef2f8;border:1px solid var(--border-2)"></span>'
          : '<span class="sw ' + l[0] + '" style="background:var(--' + (l[0] === "d-prazo" ? "critico" : l[0] === "d-audiencia" ? "alto" : "navy-700") + ')"></span>';
        return '<span class="li">' + sw + esc(l[1]) + "</span>";
      })
      .join("");

    const sel = state.calSel;
    const selEvs = D.eventos[sel] || [];
    const panelEvs =
      selEvs.length === 0
        ? '<div class="empty" style="padding:30px 10px">' + icon("calendar") + "<div>Nenhum evento nesta data.</div></div>"
        : selEvs
            .map(
              (e) =>
                '<div class="event-card ev-' + e.tipo + '"><div class="et"><span class="dot"></span>' +
                  esc(TIPO_LABEL[e.tipo]) + '</div><div class="en">' + esc(e.nome) + "</div></div>"
            )
            .join("");

    const content =
      '<div class="cal-grid">' +
        '<div class="card card-pad">' +
          '<div class="cal-head"><h2>' + MESES[mes] + " " + ano + "</h2>" +
            '<div class="cal-nav">' +
              '<button class="icon-btn" data-cal-nav="-1" aria-label="Mês anterior">' + icon("chevronLeft") + "</button>" +
              '<button class="btn btn-ghost" data-cal-nav="hoje">Hoje</button>' +
              '<button class="icon-btn" data-cal-nav="1" aria-label="Próximo mês">' + icon("chevronRight") + "</button>" +
            "</div></div>" +
          '<div class="cal-dow"><span>DOM</span><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span></div>' +
          '<div class="cal-cells">' + cells + "</div>" +
          '<div class="cal-legend">' + legend + "</div>" +
        "</div>" +
        '<div class="card card-pad day-panel">' +
          '<div class="dp-eyebrow">Detalhes do dia</div>' +
          "<h2>" + diaPorExtenso(sel) + "</h2>" + panelEvs +
        "</div>" +
      "</div>";

    return U.shell("calendario", "Calendário", "Expedientes, feriados e prazos processuais", content);
  }

  /* =====================================================
     TELA 8 — RELATÓRIOS E EXPORTAÇÃO
     ===================================================== */
  function relatorios() {
    const r = D.relatorio;
    const maxV = Math.max.apply(null, r.volumeMensal.map((m) => m.v));
    const bars = r.volumeMensal
      .map(
        (m) =>
          '<div class="bar-col"><div class="bar" style="height:' + Math.round((m.v / maxV) * 100) + '%"></div>' +
            '<div class="bv">' + m.v + '</div><div class="bx">' + esc(m.mes) + "</div></div>"
      )
      .join("");

    const dist = r.distribuicao
      .map(
        (d) =>
          '<div class="dist-row"><div class="dh"><span class="lt"><span class="dot" style="background:var(--' + d.key + ')"></span>' +
            esc(d.titulo) + "</span><span class=\"t-sub\">" + d.qtd + " (" + d.pct + "%)</span></div>" +
            '<div class="track"><div class="fill" style="width:' + d.pct + "%;background:var(--" + d.key + ')"></div></div></div>'
      )
      .join("");

    const previewRows = D.processos
      .map(
        (p) =>
          "<tr><td><span class=\"mono t-sub\">" + esc(p.numero) + "</span></td>" +
            '<td class="t-strong">' + esc(p.cliente) + "</td>" +
            '<td class="t-sub">' + esc(p.tipo) + "</td>" +
            "<td>" + U.fmtData(p.prazo) + "</td>" +
            "<td>" + (p.status === "Suspenso" ? '<span class="badge badge-outline">Suspenso</span>' : '<span class="badge badge-baixo"><span class="dot"></span>No prazo</span>') + "</td></tr>"
      )
      .join("");

    const content =
      '<div class="flex justify-between items-center mb-20 wrap gap-12"><div></div>' +
        '<button class="btn btn-primary" data-action="exportar-pdf">' + icon("pdf") + "Exportar em PDF</button></div>" +
      '<div class="card card-pad mb-20"><div class="report-filters">' +
        '<div class="field"><label>Data inicial</label><input type="date" value="2026-01-01"></div>' +
        '<div class="field"><label>Data final</label><input type="date" value="2026-06-30"></div>' +
        '<div class="field"><label>Tipo de prazo</label><select>' + opts([["", "Todos"], ["Contestação"], ["Recurso"], ["Réplica"]].map((a) => [a[0], a[1] || a[0]]), "") + "</select></div>" +
        '<div class="field"><label>Cliente</label><select>' + opts([["", "Todos clientes"]].concat(D.clientes.map((c) => [c.nome, c.nome])), "") + "</select></div>" +
      "</div></div>" +
      '<div class="report-kpis mb-20">' +
        rkpi("Total no período", r.totais.total, "") +
        rkpi("Prazos cumpridos", r.totais.cumpridos, "ok") +
        rkpi("Pendentes", r.totais.pendentes, "warn") +
        rkpi("Perdidos", r.totais.perdidos, "bad") +
      "</div>" +
      '<div class="chart-grid mb-20">' +
        '<div class="card card-pad">' + U.sectionHead("Volume de prazos por mês", "Primeiro semestre de 2026") +
          '<div class="bars mt-24">' + bars + "</div></div>" +
        '<div class="card card-pad"><h3 style="font-size:20px">Distribuição por urgência</h3>' +
          '<p class="t-sub" style="margin:3px 0 8px">Processos ativos</p>' + dist + "</div>" +
      "</div>" +
      '<div class="card">' +
        '<div class="card-pad" style="padding-bottom:0">' + U.sectionHead("Pré-visualização do relatório", "Os dados abaixo serão incluídos na exportação",
          '<button class="btn btn-ghost" data-action="exportar-pdf">' + icon("download") + "Baixar PDF</button>") + "</div>" +
        '<div class="table-wrap mt-16"><table class="data"><thead><tr>' +
          "<th>Processo</th><th>Cliente</th><th>Tipo</th><th>Prazo</th><th>Resultado</th>" +
        "</tr></thead><tbody>" + previewRows + "</tbody></table></div></div>";

    return U.shell("relatorios", "Relatórios e Exportação", "Análise de produtividade e histórico do escritório", content);
  }

  /* =====================================================
     TELA 9 — CONFIGURAÇÕES E INTEGRAÇÕES
     ===================================================== */
  function configuracoes() {
    const u = D.usuario;
    const tab = state.configTab;
    const tabs = [
      ["perfil", "Perfil", "user"], ["email", "E-mail", "mail"],
      ["whatsapp", "WhatsApp", "message"], ["alertas", "Alertas", "bell"],
    ]
      .map(
        (t) =>
          '<a class="tab' + (tab === t[0] ? " active" : "") + '" href="#/configuracoes/' + t[0] + '">' + icon(t[2]) + t[1] + "</a>"
      )
      .join("");

    let painel = "";
    if (tab === "perfil") {
      painel =
        '<div class="card card-pad"><h3 style="font-size:20px">Dados do advogado</h3>' +
          '<p class="t-sub" style="margin:3px 0 18px">Informações pessoais e profissionais</p>' +
          '<div class="form-2col">' +
            field("Nome completo", u.nome) + field("OAB", u.oab) +
            field("E-mail profissional", u.email, "email") + field("Telefone", u.telefone, "tel") +
            field("Escritório", u.escritorio) + field("UF de atuação", u.uf) +
          "</div></div>";
    } else if (tab === "email") {
      painel =
        '<div class="card card-pad"><h3 style="font-size:20px">Configuração de e-mail (SMTP)</h3>' +
          '<p class="t-sub" style="margin:3px 0 18px">Servidor usado para o envio automático de lembretes</p>' +
          '<div class="form-2col">' +
            field("Servidor SMTP", "smtp.gmail.com") + field("Porta", "587", "number") +
            field("Usuário", "alertas@carvalhoadvogados.com.br", "email") + fieldPass("Senha / App password", "••••••••••") +
            field("E-mail do remetente", "alertas@carvalhoadvogados.com.br", "email") + field("Nome do remetente", "JurisAlerta") +
          "</div>" +
          '<button class="btn btn-ghost mt-16">' + icon("checkCircle") + "Testar conexão</button></div>";
    } else if (tab === "whatsapp") {
      painel =
        '<div class="card card-pad"><h3 style="font-size:20px">Integração WhatsApp (Z-API)</h3>' +
          '<p class="t-sub" style="margin:3px 0 18px">Tokens da Z-API para disparo de mensagens automáticas</p>' +
          '<div class="form-2col">' +
            field("URL da instância", "https://api.z-api.io/instances/...") + field("ID da instância", "3DXXXX-XXXX") +
            fieldPass("Token", "••••••••••••••••") + fieldPass("Client-Token", "••••••••••••") +
          "</div>" +
          '<button class="btn btn-ghost mt-16">' + icon("message") + "Enviar mensagem de teste</button></div>";
    } else {
      painel =
        '<div class="card card-pad"><h3 style="font-size:20px">Notificações globais</h3>' +
          '<p class="t-sub" style="margin:3px 0 18px">Ative ou desative os canais e os gatilhos de aviso</p>' +
          toggleRow("Notificações por e-mail", "Envia lembretes de prazos por e-mail", true) +
          toggleRow("Notificações por WhatsApp", "Dispara mensagens via Z-API", true) +
          toggleRow("Notificações no aplicativo", "Alertas dentro do painel", true) +
          toggleRow("Resumo diário", "Recebe um panorama dos prazos do dia às 8h", false) +
          toggleRow("Alerta crítico (≤ 3 dias úteis)", "Destaque vermelho e push imediato", true) +
        "</div>";
    }

    const content =
      '<div class="flex justify-between items-center mb-20 wrap gap-12"><div class="tabs">' + tabs + "</div>" +
        '<button class="btn btn-primary" data-action="salvar-config">' + icon("save") + "Salvar alterações</button></div>" +
      '<form data-form="config">' + painel +
        '<p class="hint">As configurações são aplicadas para todos os canais de notificação do sistema.</p>' +
      "</form>";

    return U.shell("configuracoes", "Configurações e Integrações", "Perfil do usuário e ajustes para notificações automatizadas", content, true);
  }

  /* ---------- Helpers internos de markup ---------- */
  function opts(pairs, sel) {
    return pairs
      .map((p) => '<option value="' + esc(p[0]) + '"' + (p[0] === sel ? " selected" : "") + ">" + esc(p[1]) + "</option>")
      .join("");
  }
  function field(label, val, type) {
    return '<div class="field"><label>' + esc(label) + '</label><input type="' + (type || "text") + '" value="' + esc(val) + '"></div>';
  }
  function fieldPass(label, val) {
    return '<div class="field"><label>' + esc(label) + '</label><input type="password" value="' + esc(val) + '"></div>';
  }
  function toggleRow(t, s, on) {
    return (
      '<div class="toggle-row"><div><div class="tt">' + esc(t) + '</div><div class="ts">' + esc(s) + "</div></div>" +
      '<label class="switch"><input type="checkbox"' + (on ? " checked" : "") + '><span class="slider"></span></label></div>'
    );
  }
  function rkpi(label, num, cls) {
    return '<div class="rkpi ' + (cls || "") + '"><div class="lbl">' + esc(label) + '</div><div class="num">' + num + "</div></div>";
  }
  function tipoBadge(t) {
    return t === "PJ"
      ? '<span class="badge badge-outline">Pessoa Jurídica</span>'
      : '<span class="badge badge-outline">Pessoa Física</span>';
  }
  function iniciais(nome) {
    const parts = nome.replace(/\b(Ltda|S\.A|\.)\b/gi, "").trim().split(/\s+/);
    return ((parts[0] || "")[0] || "") + ((parts[1] || "")[0] || "");
  }
  function diaPorExtenso(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return d + " de " + MESES[m - 1].toLowerCase() + " de " + y;
  }

  window.JA_PAGES = {
    login, dashboard, processos, processoForm, processoDetalhe,
    clientes, modalCliente, calendario, relatorios, configuracoes,
  };
})();

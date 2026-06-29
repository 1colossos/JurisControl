/* ============================================================
   JurisControl — Roteador (hash router) e interações globais
   ============================================================ */
(function () {
  "use strict";

  const P = window.JA_PAGES;
  const U = window.JA_UI;
  const D = window.JA_DATA;
  const S = window.JA_STATE;
  const app = document.getElementById("app");

  /* ---------- Roteamento por hash ---------- */
  function parseHash() {
    let h = location.hash.replace(/^#/, "");
    if (!h || h === "/") h = "/login";
    return h.split("/").filter(Boolean); // ex.: ["processos","p1","editar"]
  }

  function render() {
    const seg = parseHash();
    const root = seg[0];
    let html;

    switch (root) {
      case "login":
      case "recuperar":
      case "cadastro":
        html = P.login();
        break;
      case "dashboard":
        html = P.dashboard();
        break;
      case "processos":
        if (seg[1] === "novo") html = P.processoForm(null);
        else if (seg[1] && seg[2] === "editar") html = P.processoForm(seg[1]);
        else if (seg[1]) html = P.processoDetalhe(seg[1]);
        else html = P.processos();
        break;
      case "clientes":
        html = P.clientes();
        break;
      case "calendario":
        html = P.calendario();
        break;
      case "relatorios":
        html = P.relatorios();
        break;
      case "configuracoes":
        if (seg[1]) S.configTab = seg[1];
        html = P.configuracoes();
        break;
      default:
        html = P.dashboard();
    }

    app.innerHTML = html;
    U.closeModal();
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);

  /* ---------- Navegação programática (data-goto) ---------- */
  function goto(route) {
    location.hash = route;
  }

  /* ---------- Delegação de cliques ----------
     Ordem importa: botões específicos (excluir, ações) são tratados
     antes da navegação genérica de linha (data-goto). */
  document.addEventListener("click", function (e) {
    const t = e.target;

    // 1) Excluir processo (botão dentro de uma linha clicável)
    const delEl = t.closest("[data-del-proc]");
    if (delEl) {
      e.preventDefault();
      confirmarExclusao(delEl.getAttribute("data-del-proc"));
      return;
    }

    // 2) Ações nomeadas
    const actionEl = t.closest("[data-action]");
    if (actionEl) {
      handleAction(actionEl.getAttribute("data-action"), actionEl, e);
      return;
    }

    // 3) Navegação do calendário
    const navBtn = t.closest("[data-cal-nav]");
    if (navBtn) {
      const v = navBtn.getAttribute("data-cal-nav");
      if (v === "hoje") { S.calMes = 5; S.calAno = 2026; S.calSel = "2026-06-29"; }
      else {
        S.calMes += parseInt(v, 10);
        if (S.calMes < 0) { S.calMes = 11; S.calAno--; }
        if (S.calMes > 11) { S.calMes = 0; S.calAno++; }
      }
      render();
      return;
    }
    const dayCell = t.closest("[data-cal-day]");
    if (dayCell) {
      S.calSel = dayCell.getAttribute("data-cal-day");
      render();
      return;
    }

    // 4) Navegação genérica (data-goto): linhas de tabela e botões.
    const gotoEl = t.closest("[data-goto]");
    if (gotoEl) {
      const stopZone = t.closest("[data-stop]");
      // Dentro de uma zona de ações, só navega se o gatilho estiver nela.
      if (stopZone && !stopZone.contains(gotoEl)) return;
      e.preventDefault();
      goto(gotoEl.getAttribute("data-goto"));
    }
  });

  /* ---------- Ações nomeadas ---------- */
  function handleAction(action, el, e) {
    switch (action) {
      case "logout":
        e.preventDefault();
        U.toast("Sessão encerrada com segurança.", "warn");
        goto("#/login");
        break;

      case "toggle-nav":
        document.getElementById("shell").classList.toggle("nav-open");
        break;

      case "toggle-pass": {
        const inp = document.getElementById("senha");
        if (inp) {
          const show = inp.type === "password";
          inp.type = show ? "text" : "password";
          el.innerHTML = icon(show ? "eyeOff" : "eye");
        }
        break;
      }

      case "novo-cliente":
        P.modalCliente();
        break;

      case "close-modal":
        // Fecha ao clicar no fundo (overlay), no "X" ou em um botão do rodapé;
        // nunca ao clicar no interior da caixa (inputs, textos).
        if (e.target === el || e.target.closest(".modal-close") || e.target.closest(".modal-foot")) {
          U.closeModal();
        }
        break;

      case "salvar-cliente":
        U.closeModal();
        U.toast("Cliente cadastrado com sucesso!", "ok");
        break;

      case "salvar-config":
        e.preventDefault();
        U.toast("Configurações salvas com sucesso!", "ok");
        break;

      case "exportar-pdf":
        U.toast("Gerando relatório em PDF...", "ok");
        break;
    }
  }

  function confirmarExclusao(id) {
    const p = D.processos.find((x) => x.id === id);
    const body =
      '<p style="margin:0">Tem certeza que deseja excluir o processo <strong class="mono">' +
      U.esc(p ? p.numero : "") + "</strong>?</p>" +
      '<p class="hint" style="margin-top:10px">A exclusão deve ser feita com cautela, pois remove informações importantes do sistema.</p>';
    const foot =
      '<button class="btn btn-ghost" data-action="close-modal">Cancelar</button>' +
      '<button class="btn btn-danger" id="confirm-del">' + icon("trash") + "Excluir processo</button>";
    U.openModal("Excluir processo", body, foot);
    const btn = document.getElementById("confirm-del");
    if (btn) btn.addEventListener("click", function () {
      U.closeModal();
      U.toast("Processo excluído.", "warn");
      if (parseHash()[0] === "processos" && parseHash()[1]) goto("#/processos");
    });
  }

  /* ---------- Submissão de formulários ---------- */
  document.addEventListener("submit", function (e) {
    const form = e.target.closest("[data-form]");
    if (!form) return;
    e.preventDefault();
    const kind = form.getAttribute("data-form");

    if (kind === "login") {
      goto("#/dashboard");
    } else if (kind === "processo") {
      U.toast("Processo salvo com sucesso!", "ok");
      goto("#/processos");
    } else if (kind === "cliente") {
      U.closeModal();
      U.toast("Cliente cadastrado com sucesso!", "ok");
    } else if (kind === "config") {
      U.toast("Configurações salvas com sucesso!", "ok");
    }
  });

  /* ---------- Filtros reativos (input/select com data-filter) ---------- */
  document.addEventListener("input", onFilter);
  document.addEventListener("change", onFilter);
  function onFilter(e) {
    const el = e.target.closest("[data-filter]");
    if (!el) return;
    const key = el.getAttribute("data-filter");
    S[key] = el.value;
    // Preserva o foco e o cursor ao re-renderizar a partir de um campo de texto.
    const isText = el.tagName === "INPUT" && el.type === "text";
    const pos = isText ? el.selectionStart : null;
    render();
    if (isText) {
      const again = document.querySelector('[data-filter="' + key + '"]');
      if (again) { again.focus(); try { again.setSelectionRange(pos, pos); } catch (_) {} }
    }
  }

  /* ---------- Inicialização ---------- */
  if (!location.hash) location.hash = "#/login";
  render();
})();

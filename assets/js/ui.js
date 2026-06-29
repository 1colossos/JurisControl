/* ============================================================
   JurisAlerta — Componentes de UI compartilhados e utilidades
   ============================================================ */
(function () {
  "use strict";

  const D = window.JA_DATA;

  /* ---------- Helpers ---------- */
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  // "2026-06-13" -> "13/06/2026"
  const fmtData = (iso) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return d + "/" + m + "/" + y;
  };

  const diasUteisLabel = (n) => n + (n === 1 ? " dia útil" : " dias úteis");

  /* ---------- Badges de urgência / status ---------- */
  function badgeUrgencia(key) {
    const rot = D.rotulosUrgencia[key] || key;
    return '<span class="badge badge-' + key + '"><span class="dot"></span>' + esc(rot) + "</span>";
  }
  function badgeStatus(status) {
    const cls = status === "Suspenso" ? "badge-outline" : "badge-neutral";
    return '<span class="badge ' + cls + '">' + esc(status) + "</span>";
  }

  /* ---------- Definição da navegação ---------- */
  const NAV = [
    { id: "dashboard",     label: "Dashboard",     icon: "dashboard", route: "#/dashboard" },
    { id: "processos",     label: "Processos",     icon: "file",      route: "#/processos" },
    { id: "clientes",      label: "Clientes",      icon: "users",     route: "#/clientes" },
    { id: "calendario",    label: "Calendário",    icon: "calendar",  route: "#/calendario" },
    { id: "relatorios",    label: "Relatórios",    icon: "chart",     route: "#/relatorios" },
    { id: "configuracoes", label: "Configurações", icon: "settings",  route: "#/configuracoes" },
  ];

  /* ---------- Marca ---------- */
  function brand(dark) {
    return (
      '<a href="#/dashboard" class="brand-logo">' +
        '<img src="assets/img/favicon.svg" alt="JurisAlerta" />' +
        "<span><span class=\"bt\">JurisAlerta</span><br><span class=\"bs\">Gestão Jurídica</span></span>" +
      "</a>"
    );
  }

  /* ---------- Sidebar ---------- */
  function sidebar(active) {
    const items = NAV.map(
      (n) =>
        '<a href="' + n.route + '" class="nav-item' + (n.id === active ? " active" : "") + '">' +
        icon(n.icon) + "<span>" + n.label + "</span></a>"
    ).join("");
    return (
      '<aside class="sidebar">' +
        '<div class="brand">' + brand(true) + "</div>" +
        "<nav>" + items + "</nav>" +
        '<div class="nav-foot">' +
          '<a href="#/login" class="nav-item" data-action="logout">' + icon("logout") + "<span>Sair</span></a>" +
        "</div>" +
      "</aside>"
    );
  }

  /* ---------- Topbar ---------- */
  function topbar(title, subtitle) {
    return (
      '<header class="topbar">' +
        '<button class="icon-btn menu-toggle" data-action="toggle-nav" aria-label="Menu">' + icon("menu") + "</button>" +
        '<div class="page-title"><h1>' + esc(title) + "</h1><p>" + esc(subtitle) + "</p></div>" +
        '<div class="spacer"></div>' +
        '<div class="searchbar">' + icon("search") +
          '<input type="text" placeholder="Buscar processos, clientes..." aria-label="Busca global" />' +
        "</div>" +
        '<button class="icon-btn" aria-label="Notificações">' + icon("bell") + '<span class="ping"></span></button>' +
        '<div class="avatar" title="' + esc(D.usuario.nome) + '">' + esc(D.usuario.iniciais) + "</div>" +
      "</header>"
    );
  }

  /* ---------- Shell (sidebar + topbar + conteúdo) ---------- */
  function shell(active, title, subtitle, contentHtml, narrow) {
    return (
      '<div class="app-shell" id="shell">' +
        '<div class="scrim" data-action="toggle-nav"></div>' +
        sidebar(active) +
        '<div class="main">' +
          topbar(title, subtitle) +
          '<div class="content' + (narrow ? " content-narrow" : "") + '">' + contentHtml + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  /* ---------- Cabeçalho de seção ---------- */
  function sectionHead(title, sub, action) {
    return (
      '<div class="section-head"><div><h3>' + esc(title) + "</h3>" +
      (sub ? "<p>" + esc(sub) + "</p>" : "") + "</div>" +
      (action || "") + "</div>"
    );
  }

  /* ---------- Toasts ---------- */
  function toast(msg, kind) {
    const layer = document.getElementById("toast-layer");
    const el = document.createElement("div");
    el.className = "toast " + (kind || "");
    el.innerHTML = icon("checkCircle") + "<span>" + esc(msg) + "</span>";
    layer.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .25s, transform .25s";
      el.style.opacity = "0";
      el.style.transform = "translateX(20px)";
      setTimeout(() => el.remove(), 250);
    }, 2600);
  }

  /* ---------- Modal ---------- */
  function openModal(title, bodyHtml, footHtml) {
    const root = document.getElementById("modal-root");
    root.innerHTML =
      '<div class="modal-overlay" data-action="close-modal">' +
        '<div class="modal" role="dialog" aria-modal="true" data-stop>' +
          '<div class="modal-head"><h3>' + esc(title) + "</h3>" +
            '<button class="modal-close" data-action="close-modal" aria-label="Fechar">' + icon("x") + "</button></div>" +
          '<div class="modal-body">' + bodyHtml + "</div>" +
          (footHtml ? '<div class="modal-foot">' + footHtml + "</div>" : "") +
        "</div>" +
      "</div>";
  }
  function closeModal() {
    document.getElementById("modal-root").innerHTML = "";
  }

  window.JA_UI = {
    esc, fmtData, diasUteisLabel,
    badgeUrgencia, badgeStatus,
    sidebar, topbar, shell, brand, sectionHead,
    toast, openModal, closeModal, NAV,
  };
})();

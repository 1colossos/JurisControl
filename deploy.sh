#!/usr/bin/env bash
# ============================================================
#  JurisControl — Script de deploy
#  Envia o projeto para o GitHub e (opcionalmente) ativa o
#  GitHub Pages, publicando o site automaticamente.
#
#  Uso:
#     ./deploy.sh
#
#  Pré-requisitos:
#     - git instalado
#     - um Personal Access Token (PAT) do GitHub com escopo "repo"
#       Gere em: GitHub > Settings > Developer settings >
#                Personal access tokens > Tokens (classic)
# ============================================================

set -e

# ----- Configuração do repositório -----
GH_USER="1colossos"
GH_REPO="JurisControl"
BRANCH="main"
REMOTE_URL="https://github.com/${GH_USER}/${GH_REPO}.git"

# Cores para as mensagens
AZUL="\033[1;34m"; VERDE="\033[1;32m"; AMARELO="\033[1;33m"; VERMELHO="\033[1;31m"; FIM="\033[0m"

info()  { echo -e "${AZUL}➜${FIM} $1"; }
ok()    { echo -e "${VERDE}✔${FIM} $1"; }
aviso() { echo -e "${AMARELO}⚠${FIM} $1"; }
erro()  { echo -e "${VERMELHO}✖${FIM} $1"; }

echo -e "${AZUL}========================================${FIM}"
echo -e "${AZUL}   Deploy do JurisControl${FIM}"
echo -e "${AZUL}========================================${FIM}\n"

# ----- 1. Verifica se é um repositório git -----
if [ ! -d ".git" ]; then
  info "Inicializando repositório git..."
  git init -q
  git checkout -q -b "$BRANCH" 2>/dev/null || git branch -M "$BRANCH"
fi

# ----- 2. Garante que o remoto 'origin' existe -----
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi
ok "Remoto: $REMOTE_URL"

# ----- 3. Garante que há um commit -----
if ! git rev-parse HEAD >/dev/null 2>&1; then
  info "Criando commit inicial..."
  git add -A
  git commit -q -m "feat: frontend do JurisControl"
fi

# ----- 4. Pede o token (não fica salvo em disco) -----
echo
aviso "Informe suas credenciais do GitHub."
read -rp "Usuário do GitHub [${GH_USER}]: " INPUT_USER
GH_USER="${INPUT_USER:-$GH_USER}"
read -rsp "Personal Access Token (não aparece ao digitar): " GH_TOKEN
echo

if [ -z "$GH_TOKEN" ]; then
  erro "Token não informado. Abortando."
  exit 1
fi

# ----- 5. Push usando o token na URL (temporário, não persistido) -----
info "Enviando para o GitHub (branch ${BRANCH})..."
PUSH_URL="https://${GH_USER}:${GH_TOKEN}@github.com/${GH_USER}/${GH_REPO}.git"
if git push "$PUSH_URL" "$BRANCH" -u 2>/dev/null; then
  ok "Código enviado com sucesso!"
else
  erro "Falha no push. Verifique o token (escopo 'repo') e se o repositório existe."
  exit 1
fi

# ----- 6. Oferece ativar o GitHub Pages -----
echo
read -rp "Deseja ativar o GitHub Pages agora? [s/N]: " ATIVAR
if [[ "$ATIVAR" =~ ^[sSyY]$ ]]; then
  info "Ativando GitHub Pages (branch ${BRANCH}, pasta raiz)..."
  HTTP=$(curl -s -o /tmp/pages_resp.json -w "%{http_code}" \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${GH_TOKEN}" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/${GH_USER}/${GH_REPO}/pages" \
    -d "{\"source\":{\"branch\":\"${BRANCH}\",\"path\":\"/\"}}" 2>/dev/null || echo "000")

  if [ "$HTTP" = "201" ] || [ "$HTTP" = "204" ]; then
    ok "GitHub Pages ativado!"
  elif [ "$HTTP" = "409" ]; then
    ok "GitHub Pages já estava ativado."
  else
    aviso "Não foi possível ativar automaticamente (HTTP ${HTTP})."
    aviso "Ative manualmente em: Settings > Pages > Branch '${BRANCH}' / root."
  fi
  echo
  ok "Site (disponível em 1-2 min): https://${GH_USER}.github.io/${GH_REPO}/"
fi

echo
ok "Repositório: https://github.com/${GH_USER}/${GH_REPO}"
echo -e "${VERDE}Concluído! 🚀${FIM}"

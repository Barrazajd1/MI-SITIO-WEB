#!/usr/bin/env bash
# sync-and-deploy.sh
# Flujo completo: export desde Strapi → validar → build → commit → push
# Uso: bash scripts/sync-and-deploy.sh "mensaje del commit"

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

COMMIT_MSG="${1:-"content: sync from Strapi $(date +'%Y-%m-%d %H:%M')"}"

echo -e "${YELLOW}▶ 1/5  Exportando contenido desde Strapi...${NC}"
node scripts/export-from-strapi.js
echo -e "${GREEN}✓ Exportación completada${NC}"

echo ""
echo -e "${YELLOW}▶ 2/5  Validando claves entre idiomas...${NC}"
npm run validate
echo -e "${GREEN}✓ Contenido consistente${NC}"

echo ""
echo -e "${YELLOW}▶ 3/5  Compilando Next.js...${NC}"
npm run build
echo -e "${GREEN}✓ Build exitoso${NC}"

echo ""
echo -e "${YELLOW}▶ 4/5  Agregando cambios a git...${NC}"
git add data/
CHANGED=$(git diff --cached --name-only | wc -l | tr -d ' ')

if [ "$CHANGED" -eq 0 ]; then
  echo -e "${GREEN}✓ No hay cambios de contenido nuevos. Nada que commitear.${NC}"
  exit 0
fi

echo -e "   ${CHANGED} archivo(s) con cambios"

echo ""
echo -e "${YELLOW}▶ 5/5  Commiteando y haciendo push...${NC}"
git commit -m "$COMMIT_MSG"
git push
echo -e "${GREEN}✓ Push completado — Vercel empezará el deploy automáticamente${NC}"

echo ""
echo -e "${GREEN}🚀 ¡Listo! El sitio se actualizará en ~1 minuto.${NC}"

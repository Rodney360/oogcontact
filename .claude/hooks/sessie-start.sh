#!/usr/bin/env bash
# Wordt gedraaid zodra een Claude Code-sessie begint.
#
# In de cloud (Claude Code on the web) start elke sessie met een verse kopie van
# de repo: daar moeten de pakketten en de testbrowser nog geïnstalleerd worden.
# Op de Mac van Gerard staat dat er meestal al; daar doen we alleen een snelle
# controle, zodat het starten niet onnodig lang duurt.

set -uo pipefail
cd "$(dirname "$0")/../.." || exit 0

if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  echo "[sessie-start] cloudomgeving: pakketten installeren"
  npm ci --no-audit --no-fund 2>&1 | tail -3

  # De testbrowser voor Playwright. In deze cloudomgeving staat Chromium er al
  # (PLAYWRIGHT_BROWSERS_PATH wijst hem aan); dan hoeft er niets gedownload te
  # worden. Staat hij er niet, dan halen we hem alsnog op.
  if [ -n "${PLAYWRIGHT_BROWSERS_PATH:-}" ] && [ -d "${PLAYWRIGHT_BROWSERS_PATH}" ]; then
    echo "[sessie-start] testbrowser staat al klaar in ${PLAYWRIGHT_BROWSERS_PATH}"
  else
    echo "[sessie-start] testbrowser ophalen"
    npx --yes playwright install --with-deps chromium 2>&1 | tail -5 \
      || echo "[sessie-start] LET OP: de testbrowser kon niet opgehaald worden. Lukt dit niet, meld dan welk domein aan de netwerklijst toegevoegd moet worden (meestal cdn.playwright.dev)."
  fi
else
  if [ ! -d node_modules ]; then
    echo "[sessie-start] node_modules ontbreekt. Draai eerst: npm install"
  else
    echo "[sessie-start] alles staat klaar. Start de site met: npm run dev"
  fi
fi

exit 0

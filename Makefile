# pd-ui — shared TS/React/Vite component library
# Usage: make <target> [AI=1]
#
# AI=1 captures verbose output to .ci-ai.log; stdout shows pass/fail.

.PHONY: install lint typecheck test build frontend-build codegen codegen-check theme-check ci help \
        mise-download mise-setup mise-doctor

LOG_FILE := .ci-ai.log

# Prefer mise exec so tool versions match mise.toml.
# Falls back to plain pnpm on PATH for contributors who manage Node themselves.
MISE := $(shell command -v mise 2>/dev/null || echo $$HOME/.local/bin/mise)
define _pnpm
	@if [ -x "$(MISE)" ] && "$(MISE)" current node >/dev/null 2>&1; then \
		"$(MISE)" exec -- pnpm $(1); \
	elif command -v pnpm >/dev/null 2>&1; then \
		pnpm $(1); \
	else \
		echo "No pnpm available. Run 'make mise-setup' or install pnpm."; exit 1; \
	fi
endef

ifdef AI
  LOG_FLAGS := 2>&1 | tee -a $(LOG_FILE)
  QUIET := @
else
  LOG_FLAGS :=
  QUIET :=
endif

help:
	@echo "Targets:"
	@echo "  install        pnpm install --frozen-lockfile"
	@echo "  lint           ESLint flat config"
	@echo "  typecheck      tsc --noEmit"
	@echo "  test           vitest run"
	@echo "  build          vite library build"
	@echo "  frontend-build alias for build"
	@echo "  codegen        fetch wheels + emit JSON + generate TS (placeholder)"
	@echo "  codegen-check  run codegen and check git diff (placeholder)"
	@echo "  ci             install + lint + typecheck + test + build + codegen-check"
	@echo ""
	@echo "  mise-download  Download the mise binary"
	@echo "  mise-setup     Install pinned tools from mise.toml"
	@echo "  mise-doctor    Show resolved tool versions"

install:
	$(call _pnpm,install --frozen-lockfile)

lint:
	$(call _pnpm,run lint)

typecheck:
	$(call _pnpm,run typecheck)

test:
	$(call _pnpm,run test)

build:
	$(call _pnpm,run build)

frontend-build: build

codegen:
	@echo "codegen placeholder — wired in M4"

codegen-check:
	@echo "codegen-check placeholder — wired in M4"

theme-check:
	$(call _pnpm,run codegen:theme-check)

ci: install lint typecheck test build codegen-check theme-check

mise-download:
	@if [ -x "$(MISE)" ]; then \
		echo "mise already installed at $(MISE)"; \
	else \
		echo "Downloading mise to $$HOME/.local/bin/mise..."; \
		curl -fsSL https://mise.run | sh; \
		echo "mise downloaded. Run 'make mise-setup' next to install pinned tools."; \
	fi

mise-setup: mise-download
	@echo "Installing tools from mise.toml..."
	@"$(MISE)" install
	@echo "mise tools installed."

mise-doctor:
	@echo "-- mise binary --"
	@if [ -x "$(MISE)" ]; then \
		echo "  path: $(MISE)"; \
		"$(MISE)" current 2>/dev/null | sed 's/^/  /' || echo "  (no mise.toml resolved)"; \
	else \
		echo "  not installed (run 'make mise-setup')"; \
	fi
	@echo "-- tools on PATH --"
	@command -v node  >/dev/null 2>&1 && echo "  node:  $$(node --version)"  || echo "  node:  not on PATH"
	@command -v pnpm  >/dev/null 2>&1 && echo "  pnpm:  $$(pnpm --version)"  || echo "  pnpm:  not on PATH"

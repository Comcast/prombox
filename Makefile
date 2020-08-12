# Copyright 2020 Comcast Cable Communications Management, LLC
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

PREFIX       ?= $(shell pwd)
LOCAL_OS	 ?= $(shell uname)

GO           ?= go
GOFMT        ?= $(GO)fmt
GOOPTS       ?=

BINARY_CF_LINUX_AMD64=prombox-cflinuxfs3
BINARY_LOCAL_AMD64=prombox-${LOCAL_OS}

BUILD_TIME=`date +%FT%T%z`
BUILD_HOST=`hostname`
MAIN_VERSION=v0.0.1
GIT_COMMIT=`git rev-parse --short HEAD`
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`
VERSION=${MAIN_VERSION}.${GIT_COMMIT}

LDFLAGS=-ldflags "-X main.Version=${VERSION} -X main.BuildTime=${BUILD_TIME} -X main.BuildHost=${BUILD_HOST} -X main.GitHash=${GIT_COMMIT} -X main.GitBranch=${GIT_BRANCH} -s -w"

# Run prombox production binary artifact in local with config.local.prod.json
.PHONY: run
run:
	./${BINARY_LOCAL_AMD64}

# Build prombox production binary artifacts including ui, api
.PHONY: build
build: clean build-ui build-assets build-api

.PHONY: build-dev
build-dev: clean build-ui-dev build-assets build-api

.PHONY: clean
clean:
	rm -rf ui/dist
	rm -rf ui/assets_vfsdata.go
	rm -rf ui/node_modules
	rm -rf ${BINARY_CF_LINUX_AMD64}
	rm -rf ${BINARY_LOCAL_AMD64}

.PHONY: build-ui
build-ui: install-ui-pkgs
	npm run --prefix ui build -- --modern > npm.log
	cat npm.log

.PHONY: build-ui-dev
build-ui-dev: install-ui-pkgs
	npm run --prefix ui build -- --mode development --modern > npm.log
	cat npm.log

.PHONY: install-ui-pkgs
install-ui-pkgs:
	npm install --prefix ui

.PHONY: build-assets
build-assets:
	@echo ">> writing assets"
	cd $(PREFIX)/ui && $(GO) generate -x -v $(GOOPTS)

.PHONY: check_assets
check_assets: build-assets
	@echo ">> checking that assets are up-to-date"
	@if ! (cd $(PREFIX)/ui && git diff --exit-code); then \
		echo "Run 'make assets' and commit the changes to fix the error."; \
		exit 1; \
	fi

.PHONY: build-api
build-api:
	env GOOS=linux GOARCH=amd64 $(GO) build ${LDFLAGS} -o ${BINARY_CF_LINUX_AMD64} .
	env GOOS=darwin GOARCH=amd64 $(GO) build ${LDFLAGS} -o ${BINARY_LOCAL_AMD64} .

# Run/Serve API and UI in Development Mode
.PHONY: run-api-dev
run-api-dev:
	$(GO) run main.go

.PHONY: run-ui-dev
run-ui-dev:
	npm run --prefix ui serve

# Formatting/Linting
.PHONY: lint
lint: lint-ui fmt-api lint-api

.PHONY: lint-api
lint-api: vet-api
	$(GO)lint -set_exit_status ./...

.PHONY: vet-api
# vet runs the Go source code static analysis tool `vet` to find any common errors.
vet-api:
	@go vet 2>/dev/null ; if [ $$? -eq 3 ]; then \
		$(GO) get golang.org/x/tools/cmd/vet; \
	fi
	@echo "go vet ./..."
	@go vet ./... ; if [ $$? -eq 1 ]; then \
		echo ""; \
		echo "Vet found suspicious constructs. Please check the reported constructs"; \
		echo "and fix them if necessary before submitting the code for review."; \
		exit 1; \
	fi

.PHONY: fmt-api
fmt-api:
	$(GO) fmt ./...

.PHONY: lint-ui
lint-ui:
	npm run --prefix ui lint

# Testing

.PHONY: test
test: test-ui test-api

.PHONY: test-ui
test-ui:
	npm run --prefix ui test:unit

.PHONY: test-api
test-api:
	$(GO) test ./... -coverprofile cp.out

.PHONY: coverage-report
coverage-report:
	go tool cover -html=cp.out -o coverage.html

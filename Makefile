BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

branch:
	git checkout $(ARGS) > /dev/null 2>&1 || git checkout -b $(ARGS)
build:
	rm -rf dist
	NODE_ENV=development npx webpack
dev:
	npm run dev
history:
	git log
install-deps:
	npm ci
install:
	install-deps
lint:
	npx eslint .
publish:
	npm publish --dry-run
pull:
	git pull origin $(BRANCH)
push:
	git push origin $(BRANCH)
s:
	systemctl restart httpd.service
uncommit:
	git reset --soft HEAD^
upd:
	git merge master --no-edit
webpack:
	npx webpack serve --mode development --env development

.PHONY: test
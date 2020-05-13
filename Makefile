sha=$(shell git rev-parse HEAD)

all: build push_app push_db deploy

vars:
	echo ${sha}

build:
	yarn build

push_app:
	docker build -t gcr.io/web-online-ventures/cthdb-vue:${sha} -f config/docker/web/Dockerfile .
	docker push gcr.io/web-online-ventures/cthdb-vue:${sha}

push_db:
	docker build -t gcr.io/web-online-ventures/cthdb-api:${sha} -f config/docker/db/Dockerfile .
	docker push gcr.io/web-online-ventures/cthdb-api:${sha}

deploy:
	kubectl set image deploy/cthvue vue=gcr.io/web-online-ventures/cthdb-vue:${sha} hasura=gcr.io/web-online-ventures/cthdb-api:${sha}

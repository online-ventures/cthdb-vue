sha=$(shell git rev-parse HEAD)

all: deploy

vars:
	echo ${sha}

deploy:
	yarn build
	docker build -t gcr.io/web-online-ventures/cthdb-vue:${sha} -f config/docker/web/Dockerfile .
	docker push gcr.io/web-online-ventures/cthdb-vue:${sha}
	docker build -t gcr.io/web-online-ventures/cthdb-api:${sha} -f config/docker/db/Dockerfile .
	docker push gcr.io/web-online-ventures/cthdb-api:${sha}
	kubectl set image deploy/cthvue vue=gcr.io/web-online-ventures/cthdb-vue:${sha} hasura=gcr.io/web-online-ventures/cthdb-api:${sha}

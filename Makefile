export DC=docker-compose --env-file .env
export DCI=docker-compose

build:
	$(DC) -f compose.yaml build

dev: 
	$(DC) -f compose.yaml up

makemigrations:
	docker exec backend python manage.py makemigrations

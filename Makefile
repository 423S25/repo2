export DC=docker-compose --env-file .env
export DCI=docker-compose

build:
	$(DC) -f compose.yaml build

dev: 
	$(DC) -f compose.yaml up

makemigrations:
	docker exec repo2-1-backend-1 python manage.py makemigrations

migrate:
	docker exec repo2-1-backend-1 python manage.py migrate
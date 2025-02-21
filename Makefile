export DC=docker-compose --env-file .env
export DCI=docker-compose
# Older version of docker compose did not have a dash so set old docker compose variable
export DC_old= docker compoes --env-file .env

# Build the containers for our application based on our docker compose.yaml file
build:
	$(DC) -f compose.yaml build

# Run the development version for our docker containers
dev: 
	$(DC) -f compose.yaml up

# Set our build to also work with the older command, probably better way to do this but
# Dont know enough about bash and makefiles currently
build_old:
	$(DC_old) -f compose.yaml build

dev_old: 
	$(DC_old) -f compose.yaml up

# Command that will make the migrations for the database dependent on our models for the DJango application
makemigrations:
# Currently this only works if the container name matches "backend". The list of containers
# availble can be seen with Docker ps. For now change to 
# TODO add use agnostic way to set or find the container name for backend
	docker exec backend python manage.py makemigrations

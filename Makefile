run: 
	docker-compose build
	docker-compose up

down:
	docker-compose down

.PHONY: run
.PHONY: down
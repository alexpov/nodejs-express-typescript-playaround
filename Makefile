build:
	docker build -t ${tag} .
clean:
	docker rmi -f ${tag}
run:
	docker run --rm -d -p ${port}:${port} --name ${name} ${tag}

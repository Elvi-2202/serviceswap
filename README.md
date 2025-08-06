# symfony_react_docker_compose_deployment

Adapter les commandes suivantes avec vos images et repositories.

Symfony = Backend + API
NEXT = Frontend

Se connecter au serveur distant et déployer le projet
```bash
ssh <utilisateur>@<IP_adresse>
curl https://raw.githubusercontent.com/fredericBui/symfony_react_docker_compose_deployment/refs/heads/main/compose.yaml -o compose.yaml
docker compose up -d
```

Entrer dans le container et réaliser les migrations
```bash
docker exec -it symfony_backend_container bash
rm -Rf migrations
mkdir migrations
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

Voir le backend et le frontend
http://<IP_Adresse>:8089/
http://<IP_Adresse>:3000/

Requêter l'API
```bash
curl -X 'POST' \
  'http://<IP_Adresse>/api/posts' \
  -H 'accept: application/ld+json' \
  -H 'Content-Type: application/ld+json' \
  -d '{
  "content": "hello world"
}'

curl -X 'GET' \
  'http://<IP_Adresse>:8089/api/posts?page=1' \
  -H 'accept: application/ld+json'
```

Pour automatiser les déploiements
```bash
cd cicd
docker compose up -d
docker logs jenkins_container
docker build . -t jenkins_agent
docker inspect jenkins_container
docker run --init --name jenkins_agent_container --network cicd_network -v /var/run/docker.sock:/var/run/docker.sock jenkins_agent -url http://<IP_adress_jenkins_container>:8080 <secret> <agent name>
```

Pour supprimer les déploiements
```bash
docker compose down
docker volume rm root_db_data
```
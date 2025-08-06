Symfony Docker deployment exemple

Pour reproduire ce déploiement dans votre projet Symfony :
1. Créer un dossier docker avec le fichier suivant :
- apache.conf

2. Créer un fichier Dockerfile

4. Créer une image de votre projet
```bash
docker build . -t kuissu/symfony-deployment
```

5. Héberger l'image sur dockerhub
```bash
docker login -u kuissu
docker login -u kuissu -p <VOTRE_MOT_DE_PASSE>
docker push kuissu/symfony-deployment
```

Adapter le projet avec votre version de PHP
Changer l'adresse IP de la base de données

Projet minimum avec :
- User entity
- Register & login
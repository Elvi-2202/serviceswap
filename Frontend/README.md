React Docker deployment exemple

Pour reproduire ce déploiement dans votre projet Symfony :
1. Créer un fichier Dockerfile

2. 
```bash
npm run build
```

2. Créer une image de votre projet
```bash
docker build . -t kuissu/react-deployment
```

3. Héberger l'image sur dockerhub
```bash
docker login -u kuissu
docker login -u kuissu -p <VOTRE_MOT_DE_PASSE>
docker push kuissu/react-deployment 
```

Adapter le projet avec votre version de Node
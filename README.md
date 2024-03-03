# TpNodeJs

Le projet TpNodeJs est une application Web utilisanat des technologies backend  telles que Node.js, RabbitMQ, et MySQL. Cette application sert de plateforme pour gérer un catalogue de films, permettant aux utilisateurs d'ajouter, de mettre à jour, et de consulter des informations détaillées sur différents films. De plus, elle intègre des fonctionnalités avancées telles que l'exportation de données au format CSV et la notification par e-mail, enrichissant ainsi l'expérience utilisateur et facilitant la gestion des données.

## Caractéristiques Principales
Gestion de Films : Les utilisateurs peuvent ajouter de nouveaux films au catalogue, mettre à jour les informations existantes et parcourir la collection de films disponible. Chaque film est associé à des détails tels que le titre, la description, la date de sortie, et le réalisateur.

Exportation CSV : Un outil puissant permet aux administrateurs d'exporter l'ensemble du catalogue de films en un fichier CSV, envoyé directement par e-mail grâce à l'intégration avec RabbitMQ. Cela simplifie le processus d'analyse des données et leur partage.

Authentification et Autorisation : Le système d'authentification sécurise l'accès à certaines fonctionnalités, distinguant les rôles entre les utilisateurs normaux et les administrateurs.

Gestion des Favoris : Les utilisateurs peuvent marquer des films comme favoris, permettant une récupération rapide et personnalisée de leur liste de films préférés.

Notifications par E-mail : Le système utilise RabbitMQ pour déclencher l'envoi de notifications par e-mail aux utilisateurs pour divers événements, tels que l'ajout de nouveaux films ou les mises à jour des films existants, ainsi que pour l'envoi de l'exportation CSV aux administrateurs.

Architecture Microservices : L'application est conçue autour d'une architecture microservices, où RabbitMQ sert de broker de messages pour décupler les opérations d'envoi d'e-mails, permettant ainsi une meilleure scalabilité et une gestion efficace des tâches en arrière-plan.

Documentation Swagger : L'API est entièrement documentée avec Swagger, offrant une interface interactive pour explorer et tester les différents endpoints de manière intuitive.

## Technologies Utilisées
Node.js : Choisi pour sa performance et sa facilité d'utilisation dans la construction d'applications réseau rapides et scalables.

RabbitMQ : Un broker de messages avancé qui facilite le traitement asynchrone des tâches, améliorant la réactivité et l'efficacité de l'application.

MySQL : Une base de données relationnelle robuste utilisée pour stocker et gérer les informations sur les films de manière structurée.

Docker : Utilisé pour containeriser et déployer l'application et ses services de manière isolée, garantissant ainsi la cohérence des environnements de développement, de test, et de production.

# Guide d'Installation du Projet TpNodeJs
Ce guide vous expliquera comment configurer et exécuter le projet TpNodeJs, qui utilise RabbitMQ pour le message broker et MySQL comme base de données.

## Prérequis
Avant de commencer, assurez-vous d'avoir installé sur votre système :

Docker

Node.js

npm (gestionnaire de paquets pour Node.js)

## Cloner le Répertoire
Commencez par cloner le répertoire du projet TpNodeJs depuis GitHub :
```
git clone https://github.com/TheoMestries/TpNodeJs.git
```

Naviguez dans le répertoire du projet :

```
cd TpNodeJs
``` 

## Configuration des Conteneurs Docker
Vous aurez besoin d'exécuter RabbitMQ et MySQL dans des conteneurs Docker. Utilisez les commandes suivantes pour configurer les conteneurs :

### RabbitMQ
```
docker run -p 5672:5672 -p 15672:15672 -d --name rabbitmq rabbitmq:3-management
```
Cette commande exécute RabbitMQ et expose l'interface de gestion sur votre machine locale.

### MySQL
```
docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d mysql:5.7
```
Cette commande exécute un conteneur MySQL avec une base de données pré-créée nommée user.

## Installation des Dépendances du Projet
### iut-project
Naviguez vers le répertoire iut-project et installez les dépendances Node.js :
```
cd iut-project
npm install
```

Démarrez l'application :

```
npm start
```

### Consommateur RabbitMQ
Ouvrez un nouveau terminal dans le projet et naviguez vers le répertoire RabbitMq :

```
cd RabbitMq
```

Installez les dépendances Node.js nécessaires :

```
npm install
```

Avant d'exécuter le consommateur RabbitMQ, mettez à jour la configuration du transporter dans received.js avec vos détails d'email Ethereal (https://ethereal.email/) :

```
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "votre_utilisateur_ethereal",
        pass: "votre_mot_de_passe_ethereal",
    },
});
```
Assurez-vous de remplacer "votre_utilisateur_ethereal" et "votre_mot_de_passe_ethereal" par vos véritables identifiants d'email Ethereal que vous obtenez en appuyant sur le bouton "CREATE ETHEREAL ACCOUNT"

Exécutez le consommateur RabbitMQ :

```
node received.js
```

## Accès à l'Application
Une fois que tout est configuré et en cours d'exécution, vous pouvez accéder à la documentation Swagger de votre API à l'adresse :
```
http://localhost:3000/documentation
```
Cette interface utilisateur Swagger vous permettra d'interagir directement avec votre API depuis votre navigateur. Et n'oubliez pas un compte Administrateur a été créer pour vous permettre d'utiliser certaine fonctionnalité , l'email étant admin@admin.com et le mot de passe Admin123 . Lorsque vous vous connectez n'oubliez pas de mettre Bearer devant votre token afin que celui-ci soit pris en compte.

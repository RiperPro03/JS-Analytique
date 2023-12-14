# JS-Analytique : Visualisation des Données de StackOverflow

## À propos du projet
JS-Analytique est un outil d'analyse et de visualisation de données qui tire parti de la puissante bibliothèque Chart.js. 
Ce projet se concentre spécifiquement sur la présentation des résultats de l'enquête annuelle menée par StackOverflow en 2023. 
Il vise à fournir des insights clairs et interactifs sur les tendances, les préférences et les comportements des développeurs 
de la communauté StackOverflow.

## Objectif général:
L'objectif de JS-Analytique est de transformer les données brutes de l'enquête StackOverflow en visualisations graphiques 
intuitives. Ces visualisations permettront aux utilisateurs de comprendre facilement les modèles et les tendances parmi 
les réponses des développeurs, offrant ainsi des perspectives précieuses sur l'industrie du développement logiciel.

## Guide d'installation
Pour mettre en place et utiliser JS-Analytique, suivez ces étapes simples :

### Prérequis
- Un serveur web local ou distant avec un dossier www pour héberger les fichiers.
- Une connexion Internet pour charger les bibliothèques Chart.js, jQuery, Bootstrap 5.

### Installation
- Placement du Projet :
  - Téléchargez ou clonez le projet JS-Analytique.
  - Placez l'intégralité du dossier du projet dans le dossier www de votre serveur.

- Configuration des Données :
  - Créez un dossier data à la racine du dossier www.
  - Placez les fichiers de données de l'enquête StackOverflow dans le dossier data.

- Paramétrage du Chemin d'Accès aux Données :
  - Ouvrez le fichier `config.js`.
  - Modifiez les lignes 6 et 7 pour configurer les chemins d'accès aux fichiers de données. Les constantes `datasetNA_Path` et `datasetWE_Path`.

# Crash d'avions

## Description

En utilisant les données disponibles sur [FiveThirtyEight](https://github.com/fivethirtyeight/data/tree/master/airline-safety), ce programme permet, à l'aide de la librairie d3.js, de visualiser différentes statistiques touchant à la sûreté d'une cinquantaine de compagnies aériennes.

Disponible à l'adresse : https://crashdavions.github.io/

## Interface

Le graphique sur la page permet d'afficher une variable en fonction d'une autre. Quatre variables sont disponiles : Kilomètres par semaines, nombre d'accidents, nombre d'accidents mortels, et nombre de morts.
Il est également possible de choisir entre 3 périodes temporelles : 1985-2000, 1985-2014, ou bien 2000-2014.

Lorsque l'on choisit, à l'aide du 4e menu déroulant, une compagnie aérienne en particulier, le point qui lui est associé sur le graphique devient rouge, et des statistiques apparaissent sous le graphique.

## Utilisation

Pour lancer le programme

### MacOS

1. Télécharger les fichiers et les extraire dans un dossier
2. Lancer une fenêtre terminal
3. Taper cd /chemin_du_dossier (ex : cd /Users/votre_username/Desktop/crash)
4. Taper python -m SimpleHTTPServer
5. Le terminal devrait afficher : Serving HTTP on 0.0.0.0 port 8000
6. Lancer un navigateur, et dans la barre d'adresse taper : 127.0.0.1:8000

### Windows

1. Télécharger les fichiers et les extraire dans un dossier
2. Lancer une invite de commande
3. Taper cd /chemin_du_dossier (ex : C:\User\votre_username\Desktop\crash)
4. Taper python3 -m http.server
5. Le terminal devrait afficher : Serving HTTP on 0.0.0.0 port 8000
6. Lancer un navigateur, et dans la barre d'adresse taper : 127.0.0.1:8000


## Auteur

Ce programme a été créé par Arnaud STEPHAN dans le cadre du cours "Visualisation de données", sous la supervision d'Isaac PANTE, section SLI, Faculté des lettres, UNIL, lors du semestre de printemps 2017 à l'Université de Lausanne.


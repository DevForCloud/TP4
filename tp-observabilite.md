# TP — Observabilité (Logs + Metrics + Health) — Node/Express/Postgres (Docker)

## Partie 1 — Remplacer `console.log` par un logger (Pino)

> Objectif : passer de “texte brut” à **logs structurés JSON**.

### Travail demandé

* Installer [Pino](https://getpino.io/#/)
* Créer un logger
  * Création du fichier `src/logger.js`
  * Exposition d'une fonction `logger` qui pourra être utilisée dans toute l'application et génère des JSON de log
* Utiliser le logger
  * Remplacer dans le code les `console.log` par `logger`
* Comparer avec `console.log`

### Niveaux de logs
- `info` pour le flux normal
- `warn` si un param est suspect
- `error` pour exception/500

Tester en changeant `LOG_LEVEL=warn` dans l’environnement.

### Question théorique

> À quoi ressemble un log issu de `console.log` ?

Fetching all notes

> À quoi ressemble un log issu de `logger` ?
info
{"level":30,"time":1776065981309,"pid":19,"hostname":"c4cb5e6b9ddc","msg":"Fetching all notes"}


> Quelles sont les différences entre les deux ?

Les logs de `console.log` sont du texte brut, tandis que les logs de `logger` sont des objets JSON structurés. Les logs de `logger` contiennent des métadonnées supplémentaires telles que le niveau de log, l'heure, le PID et le nom d'hôte, ce qui les rend plus exploitables pour l'analyse et la surveillance.

> Pourquoi ne peut-on pas stocker ces logs dans un fichier de log sur le cloud ?

Parce que les fichiers de log sur le cloud peuvent être difficiles à gérer et à analyser, surtout à grande échelle. Les logs structurés en JSON peuvent être facilement ingérés par des systèmes de gestion de logs et d'analyse, tandis que les logs en texte brut nécessitent souvent une transformation supplémentaire pour être exploitables. De plus, les fichiers de log peuvent devenir volumineux et difficiles à stocker et à consulter efficacement sur le cloud.

## Partie 2 — Metrics Prometheus dans une API Node.js

> Objectif : Instrumenter une API Node.js pour exposer des métriques exploitables par Prometheus.

### Travail demandé

À l’aide d’une bibliothèque Node.js [prom-client](https://github.com/siimon/prom-client) adaptée à l’écosystème Prometheus :

* Créez un module dédié aux métriques
* Exposez un endpoint `/metrics`
* Collectez les métriques techniques par défaut du process
* Ajoutez au moins :
  * une métrique représentant le volume total de requêtes HTTP
  * Une métrique représentant la distribution des temps de réponse
* Ces métriques doivent être segmentées par :

  * Méthode HTTP
  * Route
  * Code de statut

### Contraintes techniques

* Les métriques doivent être centralisées dans un module dédié
* Elles doivent être enregistrées puis exposées par l’application
* L’instrumentation doit être branchée à la fin du traitement de la requête
* Le code doit rester simple et maintenable

### Validation attendue

Après plusieurs appels à l’API, l’endpoint `/metrics` doit faire apparaître vos métriques personnalisées ainsi que des métriques système.

### Question théorique

> Quelle différence entre `Counter` et `Histogram` ?

## Partie 3 — Health check /health (simple puis DB-ready)

Permettre à une application de signaler son état à un système externe (load balancer, orchestrateur, etc.).

### Travail demandé

* Implémentez un endpoint permettant de vérifier que votre application est en fonctionnement.
* Votre application dépend d’une base de données, implémentez un mécanisme permettant de vérifier si cette dépendance est accessible.
* Votre système doit être capable de distinguer : 
  * Un service actif
  * Un service incapable de répondre correctement aux requêtes

### Validation attendue
Vous devez démontrer :
  * Le comportement du service lorsque tout fonctionne
  * Le comportement lorsque la base de données devient indisponible

### Contraintes

* Les réponses doivent être exploitables par un système automatisé
* Les statuts HTTP doivent être cohérents avec l’état du service
* Le système doit rester simple et lisible

### Question théorique

> À quoi sert `/health/db` comparé à `/health` ? 


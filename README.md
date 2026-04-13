# notes_app-CI_CD
#TP4

## Partie 1 — Questions théoriques

**À quoi ressemble un log issu de `console.log` ?**
Texte brut sans structure : `Fetching all notes` ou `Creating note { title: 'test' }`.

**À quoi ressemble un log issu de `logger` (Pino) ?**
Un objet JSON : `{"level":30,"time":1712345678,"pid":19,"hostname":"api","msg":"Fetching all notes"}`.

**Quelles sont les différences entre les deux ?**
`console.log` produit du texte libre non parseable. Pino produit du JSON structuré avec timestamp, niveau, et contexte — filtrable et exploitable par des outils de log.

**Pourquoi ne peut-on pas stocker ces logs dans un fichier de log sur le cloud ?**
Les conteneurs sont éphémères : à chaque redéploiement le fichier est perdu. Sur le cloud, les logs doivent être émis sur `stdout` et collectés par la plateforme (CloudWatch, Datadog…).

## Partie 2 — Questions théoriques

**Quelle différence entre `Counter` et `Histogram` ?**
`Counter` compte un total cumulatif (ex: nombre de requêtes). `Histogram` mesure la distribution de valeurs (ex: temps de réponse) en les répartissant dans des buckets — il permet de calculer des percentiles (p95, p99).

## Partie 3 — Questions théoriques

**À quoi sert `/health/db` comparé à `/health` ?**
`/health` vérifie que le process tourne (liveness). `/health/db` vérifie en plus que la base de données est accessible (readiness). Un load balancer utilise le premier pour savoir si le conteneur est vivant, et le second pour savoir s'il peut recevoir du trafic.
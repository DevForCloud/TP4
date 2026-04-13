# TP Observabilite - Notes API

Nicolas PATINO - Jean Paul LALANDE
## Prerequis

- Docker
- Docker Compose

## Configuration

Creer le fichier `.env` a partir de l'exemple :

```bash
cp .env.example .env
```

Le fichier `.env.example` contient les variables necessaires :

```env
PORT=3000
LOG_LEVEL=info

DB_HOST=db
DB_PORT=5432
DB_NAME=notes_app
DB_USER=notes_user
DB_PASSWORD=notes_password

POSTGRES_DB=notes_app
POSTGRES_USER=notes_user
POSTGRES_PASSWORD=notes_password
```

## Lancer le projet

Depuis la racine du projet :

```bash
docker compose up --build
```

L'API est disponible sur :

```text
http://localhost:3000
```

Pour arreter les conteneurs :

```bash
docker compose down
```

Au premier demarrage d'un volume Postgres neuf, le fichier `db/init.sql` cree automatiquement la table `notes`.

Si un ancien volume existe deja et que la table `notes` n'a pas ete creee, supprimer le volume puis relancer :

```bash
docker compose down -v
docker compose up --build
```

## Commandes utiles

Tester que l'application repond :

```bash
curl http://localhost:3000/health
```

Tester que la base de donnees est accessible :

```bash
curl http://localhost:3000/health/db
```

Voir les metriques Prometheus :

```bash
curl http://localhost:3000/metrics
```

Creer une note :

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Ma note","content":"Contenu de test"}'
```

Lister les notes :

```bash
curl http://localhost:3000/notes
```

## Tester les logs

Les logs utilisent `LOG_LEVEL`.

Exemple avec les logs normaux :

```env
LOG_LEVEL=info
```

Pour avoir les logs d'avertissement et d'erreur uniquement changer la valeur par `warn` ou `error`


## Tester la base indisponible

Demarrer le projet :

```bash
docker compose up --build
```

Dans un autre terminal, couper uniquement la base :

```bash
docker compose stop db
```

Tester le health check DB :

```bash
curl -i http://localhost:3000/health/db
```

Remettre la base :

```bash
docker compose start db
```

## Questions

### Partie 1 - Logs

A quoi ressemble un log issu de `console.log` ?

Un log issu de `console.log` est du texte  brut, par exemple pour la requete qui recupere les notes, on a: ```
Fetching all notes
```

A quoi ressemble un log issu de `logger` ?

Il est plus complet et structuré, il contient des metadonnees comme le niveau de log, l'heure, le PID et le nom d'hote. Par exemple pour la meme requete, on a : 
```
{"level":30,"time":1776065981309,"pid":19,"hostname":"c4cb5e6b9ddc","msg":"Fetching all notes"}
```

Quelles sont les differences entre les deux ?

Les logs de `console.log` sont du texte brut, tandis que les logs de `logger` sont des objets JSON structurés. Les logs de `logger` contiennent des données supplémentaires qui les rend plus exploitables pour l'analyse et la surveillance.


Pourquoi ne peut-on pas stocker ces logs dans un fichier de log sur le cloud ?

Parce que les fichiers de log sur le cloud peuvent être difficiles à gérer et à analyser, surtout à grande échelle. Les logs structurés en JSON peuvent être facilement digérés par des systèmes de gestion de logs et d'analyse, tandis que les logs en texte brut nécessitent souvent une transformation supplémentaire pour être exploitables. De plus, les fichiers de log peuvent devenir volumineux et difficiles à stocker et à consulter efficacement sur le cloud.

### Partie 2 - Metrics

Quelle difference entre `Counter` et `Histogram` ?

Un `Counter` est une métrique qui ne peut que croître, elle est utilisée pour compter des événements ou des occurrences (compteur). Par exemple, le nombre total de requêtes HTTP reçues. Un `Histogram`, en revanche, est utilisé pour mesurer la distribution d'une valeur, comme les temps de réponse. Il permet de calculer des statistiques telles que la moyenne, les percentiles, etc., ce qui est utile pour analyser les performances d'une application.

### Partie 3 - Health check

A quoi sert `/health/db` compare a `/health` ?

`/health` est un endpoint de vérification de l'état général du service, tandis que `/health/db` est spécifiquement conçu pour vérifier la connectivité et la disponibilité de la base de données. 
`/health` peut indiquer que le service est actif, mais si `/health/db` retourne une erreur, cela signifie que le service ne peut pas accéder à sa base de données, ce qui peut affecter son fonctionnement global.

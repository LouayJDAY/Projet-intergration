# Plan DevOps pour Projet-Integration

Ce document détaille le plan de mise en œuvre des pratiques DevOps pour le projet, couvrant la conteneurisation, l'intégration continue (CI) et le déploiement continu (CD).

## Phase 1 : Conteneurisation (Docker)

L'objectif est de rendre l'application portable et facile à exécuter sur n'importe quelle machine.

### 1.1 Backend (`/backend`)
*   Créer un `Dockerfile` pour l'application Node.js/Express.
*   Utiliser une image de base légère (ex: `node:18-alpine`).
*   Configurer les variables d'environnement nécessaires.

### 1.2 Frontend (`/frontend`)
*   Créer un `Dockerfile` pour l'application React/Vite.
*   Configurer une construction multi-étapes (Multi-stage build) :
    *   **Stage 1 (Build)** : Compiler l'application avec Vite.
    *   **Stage 2 (Serve)** : Servir les fichiers statiques avec un serveur léger (ex: Nginx ou serve).

### 1.3 Orchestration Locale (`docker-compose.yml`)
*   Créer un fichier `docker-compose.yml` à la racine du projet.
*   Définir les services : `backend`, `frontend`, et éventuellement une base de données locale pour les tests (bien que NeonDB soit utilisé).
*   Configurer les réseaux pour permettre la communication entre le frontend et le backend.

## Phase 2 : Intégration Continue (CI - GitHub Actions)

L'objectif est d'automatiser les tests et la vérification du code à chaque modification.

### 2.1 Workflow de Validation (`.github/workflows/ci.yml`)
*   Déclencheur : `push` et `pull_request` sur la branche `main`.
*   **Job Backend** :
    *   Installer les dépendances (`npm install`).
    *   Linter le code (si configuré).
    *   Exécuter les tests unitaires (si existants).
*   **Job Frontend** :
    *   Installer les dépendances.
    *   Linter le code (`npm run lint`).
    *   Vérifier que le build fonctionne (`npm run build`).

## Phase 3 : Livraison Continue & Déploiement (CD)

L'objectif est d'automatiser la création des images Docker et le déploiement.

### 3.1 Build & Push Docker (`.github/workflows/docker-publish.yml`)
*   Déclencheur : `push` sur la branche `main`.
*   Construire les images Docker pour le frontend et le backend.
*   Pousser les images sur un registre (ex: Docker Hub ou GitHub Container Registry).

### 3.2 Stratégie de Déploiement (Suggestions)
*   **Option A (Simple - PaaS)** : Déployer sur Render, Railway ou Vercel (Frontend) + Render (Backend).
*   **Option B (Docker)** : Déployer les conteneurs sur un VPS (ex: AWS EC2, DigitalOcean) via Docker Compose ou Kubernetes.

## Résumé des Tâches Immédiates

1.  [ ] Créer `backend/Dockerfile`
2.  [ ] Créer `frontend/Dockerfile`
3.  [ ] Créer `docker-compose.yml`
4.  [ ] Configurer GitHub Actions pour la CI.

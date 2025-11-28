# 🚀 Projet-Integration

Application web full-stack moderne avec backend Node.js/Express et frontend React/Vite, incluant une infrastructure DevOps complète.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Développement](#développement)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Déploiement](#déploiement)
- [Configuration](#configuration)

---

## 🎯 Aperçu

Ce projet est une application web complète avec :
- **Backend** : API REST Node.js avec Express et PostgreSQL (NeonDB)
- **Frontend** : Application React avec Vite, Tailwind CSS et Clerk (authentification)
- **DevOps** : Docker, Docker Compose, GitHub Actions CI/CD

---

## 🛠 Technologies

### Backend
- **Runtime** : Node.js 18
- **Framework** : Express 5
- **Base de données** : PostgreSQL (NeonDB Serverless)
- **Email** : Nodemailer
- **Upload** : Multer
- **CSV** : fast-csv

### Frontend
- **Framework** : React 19
- **Build Tool** : Vite 7
- **Styling** : Tailwind CSS 4 + DaisyUI
- **Authentification** : Clerk
- **Routing** : React Router v7
- **State Management** : Zustand
- **Icons** : React Icons
- **Notifications** : React Hot Toast

### DevOps
- **Conteneurisation** : Docker
- **Orchestration** : Docker Compose
- **CI/CD** : GitHub Actions
- **Registry** : GitHub Container Registry (GHCR)

---

## 🏗 Architecture

```
Projet-intergration/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── index.js        # Point d'entrée
│   │   └── lib/            # Modules (DB, etc.)
│   ├── Dockerfile          # Image Docker backend
│   ├── package.json
│   └── .env               # Variables d'environnement
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── main.jsx       # Point d'entrée React
│   │   └── ...
│   ├── Dockerfile         # Image Docker frontend
│   ├── nginx.conf         # Configuration Nginx
│   ├── package.json
│   └── .env              # Variables d'environnement
│
├── .github/
│   ├── workflows/        # Workflows CI/CD
│   │   ├── ci.yml       # Tests & Build
│   │   ├── docker-publish.yml  # Build & Push images
│   │   └── deploy.yml   # Déploiement
│   └── CODEOWNERS       # Code ownership
│
├── docker-compose.yml   # Orchestration locale
├── .dockerignore       # Fichiers ignorés par Docker
├── DEVOPS_PLAN.md      # Plan DevOps détaillé
└── GITHUB_SETUP.md     # Guide configuration GitHub
```

---

## 📦 Installation

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Cloner le repository
```bash
git clone git@github.com:LouayJDAY/Projet-intergration.git
cd Projet-intergration
```

### 2. Configuration des variables d'environnement

**Backend** (`backend/.env`) :
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**Frontend** (`frontend/.env`) :
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### 3. Installation des dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 💻 Développement

### Lancer en mode développement

#### Option 1 : Séparément
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Option 2 : Avec Docker Compose
```bash
docker compose up
```

### Accès
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3000

---

## 🐳 Docker

### Construire les images
```bash
# Backend uniquement
docker build -t projet-backend ./backend

# Frontend uniquement
docker build -t projet-frontend ./frontend

# Tout avec Docker Compose
docker compose build
```

### Lancer les conteneurs
```bash
# Mode détaché (background)
docker compose up -d

# Mode interactif (avec logs)
docker compose up

# Arrêter les conteneurs
docker compose down
```

### Commandes utiles
```bash
# Voir les logs
docker compose logs -f

# Voir les conteneurs en cours
docker compose ps

# Redémarrer un service
docker compose restart backend

# Reconstruire et relancer
docker compose up --build -d
```

---

## 🔄 CI/CD

Le projet utilise **GitHub Actions** pour l'automatisation.

### Workflows disponibles

#### 1. **CI - Build & Test** (`ci.yml`)
- **Déclenchement** : Push ou Pull Request sur `main` / `develop`
- **Actions** :
  - ✅ Lint du code
  - ✅ Build du frontend
  - ✅ Tests unitaires (si configurés)

#### 2. **Docker Build & Push** (`docker-publish.yml`)
- **Déclenchement** : Push sur `main` ou tags `v*`
- **Actions** :
  - 🐳 Build des images Docker
  - 📦 Push vers GitHub Container Registry
  - 🏷️ Tagging automatique

#### 3. **Deploy to Production** (`deploy.yml`)
- **Déclenchement** : Manuel (workflow_dispatch)
- **Actions** :
  - 🚀 Déploiement vers l'environnement choisi

### Configuration requise

1. **Secrets GitHub** (Settings → Secrets → Actions) :
   - `VITE_CLERK_PUBLISHABLE_KEY` : Clé publique Clerk

2. **Permissions** (Settings → Actions → General) :
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

---

## 🌐 Déploiement

### Option 1 : VPS avec Docker

1. **Sur le serveur** :
```bash
git clone git@github.com:LouayJDAY/Projet-intergration.git
cd Projet-intergration
```

2. **Configurer les .env**

3. **Lancer avec Docker Compose** :
```bash
docker compose up -d
```

4. **Configurer Nginx reverse proxy** (optionnel) :
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

### Option 2 : Services Cloud

#### **Render** (Recommandé)
- Backend : Web Service (Docker)
- Frontend : Static Site

#### **Railway**
- Deploy automatique depuis GitHub

#### **Vercel** (Frontend seulement)
```bash
cd frontend
npm run build
vercel --prod
```

---

## ⚙️ Configuration

### Variables d'environnement

#### Backend
| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur | `3000` |
| `DATABASE_URL` | URL PostgreSQL | `postgresql://...` |

#### Frontend
| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clé publique Clerk | `pk_test_...` |

---

## 📚 Documentation complémentaire

- **[DEVOPS_PLAN.md](./DEVOPS_PLAN.md)** : Plan DevOps complet
- **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** : Guide de configuration GitHub

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👥 Auteurs

- **Louay JDAY** - [@LouayJDAY](https://github.com/LouayJDAY)
- **Malek Bacouch** - [@malekbacouch90210](https://github.com/malekbacouch90210)

---

## 🆘 Support

Pour toute question ou problème, ouvrez une [issue](https://github.com/LouayJDAY/Projet-intergration/issues).

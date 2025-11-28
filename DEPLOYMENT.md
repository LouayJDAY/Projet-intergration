# Guide de Déploiement

Ce document détaille les différentes options de déploiement pour l'application.

---

## 🎯 Stratégies de Déploiement

### 1. **Déploiement sur VPS** (Recommandé pour production)

#### Prérequis
- VPS (Ubuntu/Debian recommandé)
- Docker & Docker Compose installés
- Nom de domaine (optionnel)

#### Étapes

**1. Se connecter au VPS**
```bash
ssh user@your-vps-ip
```

**2. Installer Docker**
```bash
# Mettre à jour les paquets
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo apt install docker-compose-plugin -y

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER
```

**3. Cloner le projet**
```bash
git clone git@github.com:LouayJDAY/Projet-intergration.git
cd Projet-intergration
```

**4. Configurer les variables d'environnement**
```bash
# Backend
cat > backend/.env << EOF
PORT=3000
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
EOF

# Frontend
cat > frontend/.env << EOF
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
EOF
```

**5. Lancer l'application**
```bash
docker compose up -d
```

**6. Configurer Nginx (reverse proxy)**
```bash
sudo apt install nginx -y

sudo nano /etc/nginx/sites-available/projet
```

Contenu :
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**7. Activer le site**
```bash
sudo ln -s /etc/nginx/sites-available/projet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**8. Configurer SSL avec Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

### 2. **Déploiement sur Render**

#### Backend

1. Aller sur [Render.com](https://render.com)
2. Créer un nouveau **Web Service**
3. Connecter le repository GitHub
4. Configuration :
   - **Root Directory** : `backend`
   - **Environment** : `Docker`
   - **Docker Command** : (automatique)
5. Ajouter les variables d'environnement :
   - `DATABASE_URL`
   - `PORT` → `3000`

#### Frontend

1. Créer un nouveau **Static Site**
2. Configuration :
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Publish Directory** : `dist`
3. Ajouter les variables d'environnement :
   - `VITE_CLERK_PUBLISHABLE_KEY`

---

### 3. **Déploiement sur Railway**

1. Aller sur [Railway.app](https://railway.app)
2. Créer un nouveau projet
3. **Deploy from GitHub repo**
4. Sélectionner le repository
5. Railway détectera automatiquement les services
6. Configurer les variables d'environnement dans chaque service

---

### 4. **Déploiement sur Vercel (Frontend uniquement)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd frontend
vercel --prod
```

Configuration `vercel.json` :
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_CLERK_PUBLISHABLE_KEY": "@vite-clerk-key"
  }
}
```

---

### 5. **Déploiement AWS EC2**

**1. Lancer une instance EC2**
- AMI : Ubuntu 22.04
- Type : t2.micro (ou supérieur)
- Security Group : Ouvrir ports 22, 80, 443

**2. Se connecter**
```bash
ssh -i your-key.pem ubuntu@ec2-ip
```

**3. Suivre les étapes VPS ci-dessus**

**4. Optionnel : Utiliser ECS avec les images Docker**
- Pousser les images sur ECR
- Créer un cluster ECS
- Définir les services

---

## 🔄 Déploiement Automatique avec GitHub Actions

### Configuration

1. **Ajouter les secrets GitHub** :
   - `VPS_HOST` : Adresse IP du VPS
   - `VPS_USERNAME` : Nom d'utilisateur SSH
   - `VPS_SSH_KEY` : Clé privée SSH

2. **Modifier `.github/workflows/deploy.yml`** :

```yaml
- name: Deploy to VPS
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.VPS_HOST }}
    username: ${{ secrets.VPS_USERNAME }}
    key: ${{ secrets.VPS_SSH_KEY }}
    script: |
      cd ~/Projet-intergration
      git pull origin main
      docker compose down
      docker compose up -d --build
      docker system prune -f
```

3. **Déclencher le déploiement** :
   - Aller dans **Actions**
   - Cliquer sur **Deploy to Production**
   - Cliquer sur **Run workflow**

---

## 🔍 Vérification Post-Déploiement

### Health Checks

**Backend** :
```bash
curl http://your-domain.com/api/health
```

**Frontend** :
```bash
curl http://your-domain.com
```

### Monitoring des conteneurs
```bash
# Voir les logs
docker compose logs -f

# Vérifier l'état
docker compose ps

# Ressources utilisées
docker stats
```

---

## 🛠 Maintenance

### Mise à jour du code
```bash
cd ~/Projet-intergration
git pull origin main
docker compose up -d --build
```

### Backup de la base de données
```bash
# Si base locale (pas applicable avec NeonDB)
docker compose exec backend pg_dump -U user database > backup.sql
```

### Nettoyage Docker
```bash
# Supprimer les images inutilisées
docker system prune -a

# Supprimer les volumes non utilisés
docker volume prune
```

---

## 🚨 Troubleshooting

### Container ne démarre pas
```bash
docker compose logs backend
docker compose logs frontend
```

### Port déjà utilisé
```bash
# Trouver le processus
sudo lsof -i :3000
# Tuer le processus
kill -9 PID
```

### Problème de permissions
```bash
sudo chown -R $USER:$USER ~/Projet-intergration
```

---

## 📊 Monitoring (Avancé)

### Option 1 : Portainer
```bash
docker volume create portainer_data
docker run -d -p 9000:9000 \
  --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

### Option 2 : Grafana + Prometheus
Voir la documentation officielle pour l'installation.

---

## 💡 Best Practices

1. **Toujours utiliser HTTPS** en production
2. **Configurer les backups automatiques** de la base de données
3. **Mettre en place un monitoring** (uptime, erreurs)
4. **Utiliser des secrets manager** pour les variables sensibles
5. **Tester le déploiement** sur un environnement de staging d'abord

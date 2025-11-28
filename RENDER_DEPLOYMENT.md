# 🚀 Guide de Déploiement sur Render.com

## Pourquoi Render ?

- ✅ **Gratuit** pour commencer (plan Free)
- ✅ **Support Docker natif**
- ✅ **Déploiement automatique** depuis GitHub
- ✅ **Base de données PostgreSQL incluse**
- ✅ **SSL automatique**
- ✅ **Très simple à configurer**

---

## 📋 Prérequis

- [x] Compte GitHub (déjà fait)
- [ ] Compte Render.com (gratuit)
- [ ] Repository GitHub public ou compte Render payant

---

## Étape 1 : Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **Get Started**
3. Connectez-vous avec votre compte GitHub
4. Autorisez Render à accéder à vos repositories

---

## Étape 2 : Déployer le Backend

### 2.1 Créer un Web Service

1. Dans le dashboard Render, cliquez sur **New +** → **Web Service**
2. Connectez votre repository : `LouayJDAY/Projet-intergration`
3. Configuration :

   ```
   Name:                projet-backend
   Region:              Frankfurt (EU) ou Oregon (US)
   Branch:              main
   Root Directory:      backend
   Runtime:             Docker
   Instance Type:       Free
   ```

### 2.2 Configurer les variables d'environnement

Dans la section **Environment Variables**, ajoutez :

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_izysDf48tlBL@ep-shiny-mud-adhm27gf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |

### 2.3 Créer le service

1. Cliquez sur **Create Web Service**
2. Render va :
   - Cloner votre repository
   - Builder l'image Docker
   - Déployer le backend
   - Vous donner une URL : `https://projet-backend.onrender.com`

⏱️ **Temps estimé** : 3-5 minutes

---

## Étape 3 : Déployer le Frontend

### 3.1 Créer un Static Site

1. Cliquez sur **New +** → **Static Site**
2. Sélectionnez le même repository
3. Configuration :

   ```
   Name:                projet-frontend
   Branch:              main
   Root Directory:      frontend
   Build Command:       npm install && npm run build
   Publish Directory:   dist
   ```

### 3.2 Configurer les variables d'environnement

| Key | Value |
|-----|-------|
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_d2lyZWQtc2hlZXBkb2ctNjguY2xlcmsuYWNjb3VudHMuZGV2JA` |
| `VITE_API_URL` | `https://projet-backend.onrender.com` |

### 3.3 Créer le site

1. Cliquez sur **Create Static Site**
2. Render va builder et déployer le frontend
3. URL générée : `https://projet-frontend.onrender.com`

---

## Étape 4 : Connecter Frontend et Backend

### 4.1 Mettre à jour le frontend

Si votre frontend utilise une URL d'API :

**Dans `frontend/src/config.js`** (ou équivalent) :
```javascript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### 4.2 Configurer CORS dans le backend

**Dans `backend/src/index.js`** :
```javascript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'https://projet-frontend.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### 4.3 Redéployer

Après les modifications :
```bash
git add .
git commit -m "feat: Configure production URLs"
git push origin main
```

Render redéploiera automatiquement ! 🎉

---

## Étape 5 : Vérification

### Backend
1. Ouvrez : `https://projet-backend.onrender.com`
2. Vous devriez voir votre API

### Frontend
1. Ouvrez : `https://projet-frontend.onrender.com`
2. Votre application devrait fonctionner

---

## ⚠️ Limitations du plan gratuit

- **Backend** : Se met en veille après 15 min d'inactivité (redémarre au premier accès ~30s)
- **Frontend** : Toujours actif
- **Bande passante** : 100 GB/mois
- **Build** : 500h/mois

### 💡 Astuce pour éviter le sleep

Utilisez un service de ping comme [UptimeRobot](https://uptimerobot.com) pour pinger votre backend toutes les 10 minutes.

---

## 🔄 Déploiement automatique

Render détecte automatiquement les pushs sur GitHub :

```bash
# Faire des modifications
git add .
git commit -m "fix: update something"
git push origin main

# Render redéploie automatiquement en 2-3 minutes
```

---

## 📊 Monitoring

### Logs en temps réel

1. Allez dans votre service sur Render
2. Cliquez sur **Logs**
3. Vous verrez tous les logs en temps réel

### Redéploiement manuel

1. Allez dans **Settings**
2. Cliquez sur **Manual Deploy** → **Deploy latest commit**

---

## 🎯 URLs finales

Une fois déployé :

- **Frontend** : `https://projet-frontend.onrender.com`
- **Backend** : `https://projet-backend.onrender.com`

Vous pouvez personnaliser ces URLs dans les settings ou ajouter un domaine personnalisé.

---

## ✅ Checklist de déploiement

- [ ] Compte Render créé
- [ ] Backend déployé avec variables d'environnement
- [ ] Frontend déployé avec variables d'environnement
- [ ] CORS configuré
- [ ] URLs de production ajoutées au code
- [ ] Changements poussés sur GitHub
- [ ] Application testée en production

---

## 🆘 Troubleshooting

### Build échoue
- Vérifiez les logs dans Render
- Assurez-vous que le Dockerfile est correct
- Vérifiez que les variables d'environnement sont bien configurées

### Backend ne répond pas
- Vérifiez que le PORT est bien configuré à 3000
- Vérifiez la DATABASE_URL
- Regardez les logs

### Frontend ne se connecte pas au backend
- Vérifiez VITE_API_URL
- Vérifiez la configuration CORS
- Vérifiez que le backend est bien déployé

---

## 💰 Passer au plan payant (optionnel)

Pour éviter le sleep et avoir plus de ressources :

**Starter** ($7/mois par service) :
- Pas de sleep
- Plus de mémoire/CPU
- Repositories privés

---

## 🎉 Prochaines étapes

Après le déploiement :

1. Ajouter un **domaine personnalisé**
2. Configurer **Google Analytics**
3. Mettre en place **monitoring** (Sentry, LogRocket)
4. Configurer **les backups** automatiques

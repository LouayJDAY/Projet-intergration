# Guide de Configuration GitHub pour DevOps

Ce guide vous explique comment configurer GitHub pour activer les workflows CI/CD.

## 📝 Étape 1 : Configurer les Secrets GitHub

Les secrets permettent de stocker des informations sensibles (clés API, mots de passe) de manière sécurisée.

### 1.1 Accéder aux Secrets

1. Allez sur votre repository GitHub : `github.com/malekbacouch90210/Projet-intergration`
2. Cliquez sur **Settings** (⚙️ en haut à droite)
3. Dans le menu latéral, cliquez sur **Secrets and variables** > **Actions**

### 1.2 Ajouter les Secrets Nécessaires

Cliquez sur **New repository secret** et ajoutez les secrets suivants :

#### Secret 1 : Clé Clerk (pour le Frontend)
- **Name** : `VITE_CLERK_PUBLISHABLE_KEY`
- **Value** : `pk_test_d2lyZWQtc2hlZXBkb2ctNjguY2xlcmsuYWNjb3VudHMuZGV2JA`

#### Secret 2 : URL de la Base de Données (optionnel, pour backend en production)
- **Name** : `DATABASE_URL`
- **Value** : `postgresql://neondb_owner:npg_izysDf48tlBL@ep-shiny-mud-adhm27gf-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

> ⚠️ **Important** : Ne partagez jamais ces secrets publiquement !

---

## 🔒 Étape 2 : Activer GitHub Container Registry (GHCR)

Pour publier les images Docker sur GHCR :

### 2.1 Activer les Packages
1. Allez dans **Settings** > **Actions** > **General**
2. Sous **Workflow permissions**, sélectionnez :
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Cliquez sur **Save**

### 2.2 Rendre les Packages Publics (optionnel)
1. Après le premier build, allez sur votre profil GitHub
2. Cliquez sur **Packages**
3. Sélectionnez le package créé
4. Allez dans **Package settings**
5. Changez la visibilité en **Public** si souhaité

---

## ⚙️ Étape 3 : Activer les GitHub Actions

### 3.1 Vérifier que les Actions sont activées
1. Allez dans **Settings** > **Actions** > **General**
2. Sous **Actions permissions**, sélectionnez :
   - ✅ **Allow all actions and reusable workflows**
3. Cliquez sur **Save**

### 3.2 Première exécution
Après avoir push les workflows vers GitHub :

1. Allez dans l'onglet **Actions** de votre repository
2. Vous verrez vos workflows listés
3. Le workflow **CI - Build & Test** se lancera automatiquement au prochain `git push`

---

## 🚀 Étape 4 : Pousser les Changements sur GitHub

Maintenant que tout est configuré, poussez vos modifications :

```bash
cd /home/louay/.gemini/antigravity/scratch/Projet-intergration
git add .
git commit -m "feat: Add DevOps configuration (Docker + CI/CD)"
git push origin main
```

---

## 📊 Étape 5 : Vérifier les Workflows

1. Allez dans **Actions**
2. Vous verrez le workflow **CI - Build & Test** en cours d'exécution
3. Cliquez dessus pour voir les détails et logs

### Workflows disponibles :

| Workflow | Déclenchement | Description |
|----------|---------------|-------------|
| **CI - Build & Test** | Automatique (push/PR) | Teste et build le code |
| **Docker Build & Push** | Automatique (push main) | Crée et publie les images Docker |
| **Deploy to Production** | Manuel | Déploie l'application |

---

## 🔧 Étape 6 : Configuration pour le Déploiement (Optionnel)

Si vous voulez déployer automatiquement sur un VPS ou service cloud :

### Option A : Déploiement sur VPS

Ajoutez ces secrets supplémentaires :
- `VPS_HOST` : Adresse IP de votre serveur
- `VPS_USERNAME` : Nom d'utilisateur SSH
- `VPS_SSH_KEY` : Clé privée SSH (tout le contenu du fichier)

### Option B : Déploiement sur Render/Railway

Ajoutez le secret :
- `RENDER_DEPLOY_HOOK` : URL du webhook de déploiement

---

## ✅ Checklist de Configuration

- [ ] Secrets GitHub configurés (`VITE_CLERK_PUBLISHABLE_KEY`)
- [ ] Workflow permissions activées (Read & Write)
- [ ] GitHub Actions activées
- [ ] Code poussé sur GitHub (`git push`)
- [ ] Premier workflow CI exécuté avec succès
- [ ] Images Docker publiées sur GHCR (après push sur main)

---

## 📞 Dépannage

### Problème : Workflow échoue lors du build Docker
**Solution** : Vérifiez que les permissions sont bien configurées dans Settings > Actions

### Problème : Secret non trouvé
**Solution** : Assurez-vous que le nom du secret correspond exactement (sensible à la casse)

### Problème : Push vers GHCR refusé
**Solution** : Activez les permissions d'écriture dans Settings > Actions > General

---

## 🎯 Prochaines Étapes

Une fois la configuration terminée :
1. ✅ Chaque push déclenchera automatiquement les tests
2. ✅ Les images Docker seront créées et publiées
3. ✅ Vous pourrez déployer en un clic via l'onglet Actions

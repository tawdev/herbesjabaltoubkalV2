# Guide Complet : Déploiement GitHub & Auto-Update VPS

Ce guide vous explique comment configurer votre projet pour qu'il se mette à jour automatiquement sur votre VPS dès que vous "pushez" sur GitHub.

## 1. Préparer GitHub

### Créer le dépot
1. Créez un nouveau dépôt sur GitHub (ex: `herbesV2`).
2. Dans votre terminal local :
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USER/herbesV2.git
   git push -u origin main
   ```

### Configurer les Secrets
Allez dans **Settings > Secrets and variables > Actions** sur votre dépôt GitHub et ajoutez ces 3 secrets :
- `VPS_HOST` : L'adresse IP de votre VPS.
- `VPS_USERNAME` : Votre nom d'utilisateur (souvent `root` ou `ubuntu`).
- `SSH_PRIVATE_KEY` : Le contenu de votre clé privée SSH (utilisée pour se connecter sans mot de passe).

---

## 2. Préparer le VPS (Première fois uniquement)

Connectez-vous à votre VPS et installez **Node.js 20** (Obligatoire pour Next.js 16) :

```bash
# Installer Node 20 sur Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Puis préparez le terrain :

### Cloner le projet
```bash
cd ~
git clone https://github.com/VOTRE_USER/herbesV2.git
cd herbesV2
```

### Configurer les environnements (.env)
Vous devez créer les fichiers `.env` manuellement sur le serveur la première fois car ils sont ignorés par git.

**Backend (`backend/.env`) :**
```bash
nano backend/.env
# Ajoutez DATABASE_URL, JWT_SECRET, etc.
```

**Frontend (`frontend/.env.local`) :**
```bash
nano frontend/.env.local
# Ajoutez NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
```

### Installation Initiale
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 3. Fonctionnement de GitHub Actions

Le fichier `.github/workflows/deploy.yml` que j'ai créé fait tout le travail :
1. **Validation** : Il vérifie que le code compile (build) sans erreurs.
2. **Transfert** : Il se connecte en SSH à votre VPS.
3. **Mise à jour** :
   - Fait un `git pull` pour récupérer le nouveau code.
   - Installe les nouvelles dépendances (`npm install`).
   - Génère Prisma (`npx prisma generate`).
   - Re-build le backend et le frontend.
   - Redémarre vos serveurs avec PM2.

---

## 4. Comment mettre à jour votre site ?

Désormais, tout est simple :
1. Faites vos modifications localement.
2. Enregistrez et pushez :
   ```bash
   git add .
   git commit -m "Description de ma modif"
   git push origin main
   ```
3. Allez dans l'onglet **Actions** sur GitHub pour voir le déploiement en direct. En 2-3 minutes, votre VPS sera à jour !

---

## 5. Notes Importantes
- **Migrations Prisma** : Si vous modifiez la base de données, l'action automatisée ne fait pas le push automatique pour éviter de casser les données. Si besoin, lancez `npx prisma migrate deploy` manuellement sur le VPS dans le dossier backend.
- **Dossier Images** : Assurez-vous que le dossier `frontend/public/images` est accessible en écriture par le processus Node.

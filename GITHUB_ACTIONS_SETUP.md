# GitHub Actions Setup for Suled Frontend

This guide walks you through setting up automated deployment to Azure Static Web Apps using GitHub Actions.

## Prerequisites

- Azure subscription
- GitHub account and repository
- Azure CLI installed (`winget install Microsoft.AzureCLI`)
- GitHub CLI installed (optional, for automated secret setup): `winget install GitHub.cli`

## Quick Setup with PowerShell Script

### 1. Login to Azure

```powershell
az login
```

### 2. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens/new
2. Select scopes: `repo` (Full control of private repositories)
3. Generate token and copy it

### 3. Run Setup Script

```powershell
cd d:\Projects\Software\Suled\suled-frontend\scripts

.\setup-azure-static-web-app.ps1 `
  -ResourceGroupName "rg-suled-frontend" `
  -StaticWebAppName "suled-frontend" `
  -Location "eastus2" `
  -GitHubRepo "YourUsername/suled-frontend" `
  -GitHubToken "your-github-token" `
  -ApiBaseUrl "https://your-function-app.azurewebsites.net/api"
```

**Parameters:**
- `ResourceGroupName` - Azure resource group name (will be created if doesn't exist)
- `StaticWebAppName` - Name for your Static Web App
- `Location` - Azure region (e.g., eastus2, westus2)
- `GitHubRepo` - Your GitHub repository (format: owner/repo-name)
- `GitHubToken` - GitHub Personal Access Token
- `ApiBaseUrl` - (Optional) Your backend API URL

The script will:
- ✅ Create Azure resource group
- ✅ Create Azure Static Web App
- ✅ Configure GitHub secrets automatically
- ✅ Display deployment URL

## Manual Setup

If you prefer to set up manually or the script fails:

### 1. Create Azure Static Web App

```powershell
# Login to Azure
az login

# Create resource group
az group create `
  --name rg-suled-frontend `
  --location eastus2

# Create Static Web App
az staticwebapp create `
  --name suled-frontend `
  --resource-group rg-suled-frontend `
  --location eastus2 `
  --sku Free `
  --branch main
```

### 2. Get Deployment Token

```powershell
az staticwebapp secrets list `
  --name suled-frontend `
  --resource-group rg-suled-frontend `
  --query "properties.apiKey" -o tsv
```

Copy this token - you'll need it for GitHub secrets.

### 3. Configure GitHub Repository Secrets

Go to your GitHub repository: `https://github.com/YourUsername/suled-frontend/settings/secrets/actions`

Add these secrets:

#### AZURE_STATIC_WEB_APPS_API_TOKEN
- Value: The deployment token from step 2
- Required for GitHub Actions to deploy to Azure

#### VITE_API_BASE_URL
- Value: Your backend API URL (e.g., `https://your-function-app.azurewebsites.net/api`)
- Required for the frontend to connect to your backend

### 4. Configure CORS on Backend

Allow your Static Web App to call your Azure Functions:

```powershell
az functionapp cors add `
  --name your-function-app-name `
  --resource-group your-backend-rg `
  --allowed-origins https://suled-frontend.azurestaticapps.net
```

## GitHub Repository Setup

### 1. Create GitHub Repository

```powershell
# Navigate to frontend folder
cd d:\Projects\Software\Suled\suled-frontend

# Create repository on GitHub using gh CLI
gh repo create suled-frontend --public --source=. --remote=origin

# Or create manually at: https://github.com/new
```

### 2. Set Up Branches

```powershell
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Vue 3 frontend for Suled"

# Rename master to main
git branch -M main

# Push to GitHub
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop

# Set develop as default branch for development
git checkout develop
```

### 3. Verify GitHub Actions

After pushing, GitHub Actions should automatically:
1. Detect the workflow file (`.github/workflows/azure-static-web-apps.yml`)
2. Build your Vue application
3. Deploy to Azure Static Web Apps

Check workflow status: `https://github.com/YourUsername/suled-frontend/actions`

## Workflow Explained

The GitHub Actions workflow (`.github/workflows/azure-static-web-apps.yml`) triggers on:

- **Push to main** - Deploys to production
- **Push to develop** - Deploys to staging environment
- **Pull requests** - Creates preview deployment

### Workflow Steps:

1. **Checkout code** - Gets the latest code
2. **Setup Node.js** - Installs Node.js 18
3. **Install dependencies** - Runs `npm ci`
4. **Build** - Runs `npm run build` with environment variables
5. **Deploy** - Uploads to Azure Static Web Apps

## Branch Strategy

- **main** - Production branch
  - Protected branch
  - Deploys to production environment
  - Requires PR review before merge

- **develop** - Development branch
  - Active development happens here
  - Deploys to staging environment
  - Create feature branches from develop

### Example Workflow:

```powershell
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/tournament-filters

# Make changes, commit
git add .
git commit -m "Add tournament filters"

# Push and create PR
git push -u origin feature/tournament-filters

# Create PR on GitHub: feature/tournament-filters → develop
# After approval, merge to develop
# Later, create PR: develop → main for production release
```

## Environment URLs

After deployment, you'll have:

- **Production**: `https://suled-frontend.azurestaticapps.net`
- **Staging** (develop): `https://suled-frontend-staging.azurestaticapps.net` (if configured)
- **PR Previews**: `https://suled-frontend-<pr-number>.azurestaticapps.net`

## Monitoring and Logs

### View Deployment Status

```powershell
# Get Static Web App details
az staticwebapp show `
  --name suled-frontend `
  --resource-group rg-suled-frontend
```

### View GitHub Actions Logs

1. Go to: `https://github.com/YourUsername/suled-frontend/actions`
2. Click on the workflow run
3. View logs for each step

### View Application Logs

In Azure Portal:
1. Navigate to your Static Web App
2. Go to "Application Insights" (if configured)
3. View logs and metrics

## Troubleshooting

### Build Fails in GitHub Actions

**Problem**: Build fails with "Module not found"
**Solution**: Ensure all dependencies are in `package.json`, not just in `node_modules`

```powershell
# Regenerate package-lock.json
Remove-Item package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Deployment Token Invalid

**Problem**: "Invalid deployment token"
**Solution**: Regenerate and update the secret

```powershell
# Get new token
az staticwebapp secrets list `
  --name suled-frontend `
  --resource-group rg-suled-frontend `
  --query "properties.apiKey" -o tsv

# Update GitHub secret manually or using gh CLI
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo YourUsername/suled-frontend
```

### API Calls Fail

**Problem**: Frontend can't connect to backend
**Solutions**:
1. Check `VITE_API_BASE_URL` secret is set correctly
2. Verify CORS is configured on Function App
3. Ensure Function App is running

### Workflow Not Triggering

**Problem**: Push to branch doesn't trigger workflow
**Solutions**:
1. Check workflow file is in `.github/workflows/`
2. Verify branch name matches workflow trigger
3. Check GitHub Actions are enabled for repo

## Security Best Practices

1. **Never commit secrets** - Always use GitHub Secrets
2. **Use separate environments** - Production (main) and staging (develop)
3. **Require PR reviews** - Protect main branch
4. **Keep dependencies updated** - Regularly run `npm update`
5. **Monitor deployments** - Set up alerts for failures

## Updating the Workflow

To modify the deployment workflow:

1. Edit `.github/workflows/azure-static-web-apps.yml`
2. Commit and push changes
3. GitHub Actions will use the updated workflow on next trigger

## Rolling Back

If a deployment causes issues:

### Option 1: Redeploy Previous Commit

```powershell
git checkout main
git reset --hard <previous-commit-hash>
git push --force origin main
```

### Option 2: Revert Commit

```powershell
git checkout main
git revert <bad-commit-hash>
git push origin main
```

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Vue.js Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

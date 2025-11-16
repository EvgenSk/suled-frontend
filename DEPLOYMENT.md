# Suled Frontend - Azure Deployment Guide

This guide covers deploying the Vue 3 frontend to Azure Static Web Apps.

## Prerequisites

- Azure subscription
- Azure CLI installed (`az --version`)
- GitHub repository for CI/CD
- Backend Azure Functions app deployed

## Option 1: Azure Static Web Apps (Recommended)

Azure Static Web Apps is perfect for Vue.js applications with automatic CI/CD.

### Step 1: Create Static Web App

```powershell
# Login to Azure
az login

# Set your subscription
az account set --subscription "Your-Subscription-Name"

# Create resource group (if needed)
az group create `
  --name rg-suled `
  --location "East US 2"

# Create Static Web App
az staticwebapp create `
  --name suled-frontend `
  --resource-group rg-suled `
  --location "East US 2" `
  --sku Free
```

### Step 2: Configure GitHub Actions

1. Fork or use your repository
2. Get deployment token:
   ```powershell
   az staticwebapp secrets list `
     --name suled-frontend `
     --resource-group rg-suled `
     --query "properties.apiKey" -o tsv
   ```

3. Add secret to GitHub:
   - Go to repository Settings → Secrets and variables → Actions
   - Add secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`

4. Create `.github/workflows/azure-static-web-apps.yml`:
   ```yaml
   name: Azure Static Web Apps Deploy

   on:
     push:
       branches:
         - main
       paths:
         - 'suled-frontend/**'
     pull_request:
       types: [opened, synchronize, reopened, closed]
       branches:
         - main

   jobs:
     build_and_deploy_job:
       if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
       runs-on: ubuntu-latest
       name: Build and Deploy
       steps:
         - uses: actions/checkout@v3
           with:
             submodules: true

         - name: Build And Deploy
           id: builddeploy
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             repo_token: ${{ secrets.GITHUB_TOKEN }}
             action: "upload"
             app_location: "/suled-frontend"
             api_location: ""
             output_location: "dist"

     close_pull_request_job:
       if: github.event_name == 'pull_request' && github.event.action == 'closed'
       runs-on: ubuntu-latest
       name: Close Pull Request
       steps:
         - name: Close Pull Request
           id: closepullrequest
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             action: "close"
   ```

### Step 3: Configure Environment Variables

Set the backend API URL in Azure Portal:

```powershell
# Via Azure CLI
az staticwebapp appsettings set `
  --name suled-frontend `
  --resource-group rg-suled `
  --setting-names VITE_API_BASE_URL="https://your-function-app.azurewebsites.net/api"
```

Or in Azure Portal:
1. Navigate to your Static Web App
2. Go to Settings → Configuration
3. Add application setting:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-function-app.azurewebsites.net/api`

### Step 4: Configure Custom Domain (Optional)

```powershell
# Add custom domain
az staticwebapp hostname set `
  --name suled-frontend `
  --resource-group rg-suled `
  --hostname "suled.yourdomain.com"
```

### Step 5: Link to Backend API

Configure CORS in your Function App to allow Static Web App:

```powershell
az functionapp cors add `
  --name your-function-app `
  --resource-group rg-suled `
  --allowed-origins "https://suled-frontend.azurestaticapps.net"
```

## Option 2: Azure App Service (Alternative)

If you prefer App Service over Static Web Apps:

### Step 1: Create App Service

```powershell
# Create App Service Plan
az appservice plan create `
  --name asp-suled-frontend `
  --resource-group rg-suled `
  --sku B1 `
  --is-linux

# Create Web App
az webapp create `
  --name suled-frontend `
  --resource-group rg-suled `
  --plan asp-suled-frontend `
  --runtime "NODE:18-lts"
```

### Step 2: Configure Deployment

```powershell
# Configure GitHub Actions deployment
az webapp deployment github-actions add `
  --name suled-frontend `
  --resource-group rg-suled `
  --repo "your-org/your-repo" `
  --branch main `
  --token "your-github-pat"
```

### Step 3: Configure Environment

```powershell
az webapp config appsettings set `
  --name suled-frontend `
  --resource-group rg-suled `
  --settings VITE_API_BASE_URL="https://your-function-app.azurewebsites.net/api"
```

## Verification

After deployment:

1. **Check deployment status**:
   ```powershell
   az staticwebapp show `
     --name suled-frontend `
     --resource-group rg-suled `
     --query "defaultHostname" -o tsv
   ```

2. **Visit your site**: `https://suled-frontend.azurestaticapps.net`

3. **Test functionality**:
   - Upload tournament Excel file
   - View tournaments list
   - Navigate to tournament details
   - View games for pairs

## Monitoring

### View Logs

```powershell
# Static Web Apps logs
az staticwebapp logs show `
  --name suled-frontend `
  --resource-group rg-suled
```

### Application Insights

Link Application Insights for detailed monitoring:

```powershell
# Create Application Insights
az monitor app-insights component create `
  --app suled-frontend-insights `
  --location "East US 2" `
  --resource-group rg-suled `
  --application-type web

# Link to Static Web App (via portal)
```

## Troubleshooting

### Build Fails

1. Check Node.js version in workflow (should be 18+)
2. Verify `package.json` scripts are correct
3. Check build logs in GitHub Actions

### API Connection Issues

1. Verify CORS settings on Function App
2. Check `VITE_API_BASE_URL` is set correctly
3. Ensure Function App is running

### Environment Variables Not Working

Static Web Apps require `VITE_` prefix for build-time variables. Runtime configuration requires different approach.

## Cost Optimization

- **Static Web Apps Free Tier**: Perfect for small projects (100GB bandwidth/month)
- **Function Consumption Plan**: Pay only for executions
- **App Service B1**: ~$13/month if you need more control

## Security Best Practices

1. **Enable HTTPS only**:
   ```powershell
   az staticwebapp update `
     --name suled-frontend `
     --resource-group rg-suled `
     --https-only true
   ```

2. **Configure authentication** (if needed)

3. **Set up private endpoint** for Function App connection (production)

## Rollback

If deployment fails:

```powershell
# List deployments
az staticwebapp environment list `
  --name suled-frontend `
  --resource-group rg-suled

# Rollback via portal or redeploy previous commit
```

## Next Steps

- Set up staging environments (Static Web Apps supports PR previews)
- Configure custom domain with SSL
- Add Application Insights for monitoring
- Set up alerts for errors

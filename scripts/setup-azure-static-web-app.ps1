# Azure Static Web App Setup Script for Suled Frontend
# This script creates the Azure Static Web App and configures GitHub secrets

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$StaticWebAppName,
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "eastus2",
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepo,  # Format: owner/repo-name
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$false)]
    [string]$ApiBaseUrl = ""  # Your Azure Function App URL
)

Write-Host "🚀 Setting up Azure Static Web App for Suled Frontend" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI is not installed. Please install it first." -ForegroundColor Red
    Write-Host "   Run: winget install Microsoft.AzureCLI" -ForegroundColor Yellow
    exit 1
}

# Check if logged in to Azure
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
$accountInfo = az account show 2>$null
if (-not $accountInfo) {
    Write-Host "❌ Not logged in to Azure. Logging in..." -ForegroundColor Red
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to login to Azure" -ForegroundColor Red
        exit 1
    }
}

$account = az account show | ConvertFrom-Json
Write-Host "✅ Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host "   Subscription: $($account.name)" -ForegroundColor Green
Write-Host ""

# Create resource group if it doesn't exist
Write-Host "Checking resource group: $ResourceGroupName" -ForegroundColor Yellow
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    Write-Host "Creating resource group..." -ForegroundColor Yellow
    az group create --name $ResourceGroupName --location $Location
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create resource group" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Resource group created" -ForegroundColor Green
} else {
    Write-Host "✅ Resource group already exists" -ForegroundColor Green
}
Write-Host ""

# Create Static Web App
Write-Host "Creating Azure Static Web App: $StaticWebAppName" -ForegroundColor Yellow
$swaExists = az staticwebapp show --name $StaticWebAppName --resource-group $ResourceGroupName 2>$null
if (-not $swaExists) {
    az staticwebapp create `
        --name $StaticWebAppName `
        --resource-group $ResourceGroupName `
        --location $Location `
        --sku Free `
        --branch main
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create Static Web App" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Static Web App created" -ForegroundColor Green
} else {
    Write-Host "✅ Static Web App already exists" -ForegroundColor Green
}
Write-Host ""

# Get deployment token
Write-Host "Retrieving deployment token..." -ForegroundColor Yellow
$deploymentToken = az staticwebapp secrets list `
    --name $StaticWebAppName `
    --resource-group $ResourceGroupName `
    --query "properties.apiKey" -o tsv

if (-not $deploymentToken) {
    Write-Host "❌ Failed to retrieve deployment token" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Deployment token retrieved" -ForegroundColor Green
Write-Host ""

# Configure GitHub secrets
Write-Host "Configuring GitHub secrets..." -ForegroundColor Yellow

# Check if GitHub CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  GitHub CLI not installed. Please install it to set secrets automatically:" -ForegroundColor Yellow
    Write-Host "   Run: winget install GitHub.cli" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Manual Steps Required:" -ForegroundColor Cyan
    Write-Host "   1. Go to: https://github.com/$GitHubRepo/settings/secrets/actions" -ForegroundColor White
    Write-Host "   2. Add secret: AZURE_STATIC_WEB_APPS_API_TOKEN" -ForegroundColor White
    Write-Host "      Value: $deploymentToken" -ForegroundColor Gray
    if ($ApiBaseUrl) {
        Write-Host "   3. Add secret: VITE_API_BASE_URL" -ForegroundColor White
        Write-Host "      Value: $ApiBaseUrl" -ForegroundColor Gray
    }
} else {
    # Set GitHub token
    $env:GH_TOKEN = $GitHubToken
    
    # Set secrets
    Write-Host "Setting AZURE_STATIC_WEB_APPS_API_TOKEN..." -ForegroundColor Yellow
    echo $deploymentToken | gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo $GitHubRepo
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AZURE_STATIC_WEB_APPS_API_TOKEN set" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to set AZURE_STATIC_WEB_APPS_API_TOKEN" -ForegroundColor Red
    }
    
    if ($ApiBaseUrl) {
        Write-Host "Setting VITE_API_BASE_URL..." -ForegroundColor Yellow
        echo $ApiBaseUrl | gh secret set VITE_API_BASE_URL --repo $GitHubRepo
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ VITE_API_BASE_URL set" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to set VITE_API_BASE_URL" -ForegroundColor Red
        }
    }
}
Write-Host ""

# Get Static Web App URL
Write-Host "Retrieving Static Web App URL..." -ForegroundColor Yellow
$swaInfo = az staticwebapp show `
    --name $StaticWebAppName `
    --resource-group $ResourceGroupName | ConvertFrom-Json

$swaUrl = $swaInfo.defaultHostname

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "   Resource Group: $ResourceGroupName" -ForegroundColor White
Write-Host "   Static Web App: $StaticWebAppName" -ForegroundColor White
Write-Host "   URL: https://$swaUrl" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Push code to GitHub repository: $GitHubRepo" -ForegroundColor White
Write-Host "   2. GitHub Actions will automatically deploy" -ForegroundColor White
Write-Host "   3. Visit: https://$swaUrl" -ForegroundColor White
Write-Host ""

# Configure CORS on Function App (if API URL provided)
if ($ApiBaseUrl) {
    Write-Host "⚠️  Don't forget to configure CORS on your Function App:" -ForegroundColor Yellow
    Write-Host "   az functionapp cors add --name <function-app-name> --resource-group <rg> --allowed-origins https://$swaUrl" -ForegroundColor Gray
    Write-Host ""
}

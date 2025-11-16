# Suled Frontend

Vue 3 + TypeScript web application for managing beach volleyball tournaments.

## 🚀 Features

- **Upload Tournaments**: Upload Excel files to create new tournaments
- **View Tournaments**: Browse all tournaments with key information
- **View Games**: See game schedules organized by pairs
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API calls

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- Backend API running (see `suled-backend` project)

## 🔧 Setup

### 1. Install Node.js

Download and install from [nodejs.org](https://nodejs.org/)

Verify installation:
```powershell
node --version
npm --version
```

### 2. Install Dependencies

```powershell
cd suled-frontend
npm install
```

### 3. Configure Environment

Copy the example environment file:
```powershell
Copy-Item .env.example .env
```

Edit `.env` and set your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:7071/api
```

For production, use your Azure Function App URL:
```env
VITE_API_BASE_URL=https://your-function-app.azurewebsites.net/api
```

## 🏃 Running Locally

### Development Server

```powershell
npm run dev
```

The app will be available at `http://localhost:3000`

### Type Checking

```powershell
npm run type-check
```

### Build for Production

```powershell
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```powershell
npm run preview
```

## 📁 Project Structure

```
suled-frontend/
├── src/
│   ├── api/
│   │   └── client.ts          # API client for backend calls
│   ├── assets/                # Static assets
│   ├── components/
│   │   ├── GamesList.vue      # Display games for a pair
│   │   ├── TournamentList.vue # List all tournaments
│   │   └── TournamentUpload.vue # Upload Excel files
│   ├── router/
│   │   └── index.ts           # Vue Router configuration
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   ├── views/
│   │   ├── HomeView.vue       # Home page
│   │   └── TournamentDetailView.vue # Tournament details
│   ├── App.vue                # Root component
│   ├── main.ts                # Application entry point
│   └── vite-env.d.ts          # Vite type declarations
├── public/                    # Static files
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── README.md
```

## 🔌 API Integration

The frontend connects to your Azure Functions backend with these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tournaments` | Get all tournaments |
| POST | `/api/tournament/upload` | Upload tournament Excel file |
| GET | `/api/pairs?tournamentId={id}` | Get pairs for a tournament |
| GET | `/api/games/pair/{pairId}` | Get games for a pair |

## 🎨 Components

### TournamentUpload
- Drag-and-drop Excel file upload
- File validation
- Upload progress and status

### TournamentList
- Grid view of all tournaments
- Key tournament info (location, division, game count)
- Click to view details

### GamesList
- Table view of games for a pair
- Shows round, court, time, opponents
- Status badges for game state

## 🚢 Deployment to Azure

### Using Azure Static Web Apps

1. **Create Static Web App**:
   ```powershell
   az staticwebapp create `
     --name suled-frontend `
     --resource-group your-rg `
     --location "East US 2" `
     --source https://github.com/your-org/your-repo `
     --branch main `
     --app-location "/suled-frontend" `
     --output-location "dist"
   ```

2. **Configure Build**:
   Create `.github/workflows/azure-static-web-apps.yml`:
   ```yaml
   name: Azure Static Web Apps CI/CD

   on:
     push:
       branches:
         - main

   jobs:
     build_and_deploy_job:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Build And Deploy
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             repo_token: ${{ secrets.GITHUB_TOKEN }}
             action: "upload"
             app_location: "/suled-frontend"
             api_location: ""
             output_location: "dist"
   ```

3. **Set Environment Variables** in Azure Portal:
   - Navigate to your Static Web App
   - Go to Configuration
   - Add `VITE_API_BASE_URL` with your Function App URL

## 🔒 CORS Configuration

Ensure your Azure Functions backend allows requests from your frontend domain:

```csharp
// In your Function App
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://your-static-web-app.azurestaticapps.net"
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});
```

## 🐛 Troubleshooting

### API Connection Issues

1. Check that backend is running on `http://localhost:7071`
2. Verify VITE_API_BASE_URL in `.env`
3. Check browser console for CORS errors

### Build Errors

1. Clear node_modules and reinstall:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

2. Clear Vite cache:
   ```powershell
   Remove-Item -Recurse -Force .vite
   ```

## 📝 License

Part of the Suled Tournament Management System.
